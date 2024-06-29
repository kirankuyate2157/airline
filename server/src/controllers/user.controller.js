import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AirUser } from "./../models/user.model.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await AirUser.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); //i validating it  no need to again validation so .
    return { accessToken, refreshToken };
  } catch (error) { }
};

const registration = asyncHandler(async (req, res) => {
  /*
    - get user details from frontend
    - validations - check it not empty
    - check if user already exists: user ,email
    - create user object - create entry in DB
    - remove password and refresh token field from responses
    - check for user creation
    - return res
    */

  const { email, password, firstName, lastName, username } = req.body;
  function generateAirUsername(fullName) {

    const randomNumber = Math.floor(Math.random() * 100); // Generates a random number between 0 and 9999
    const username = `${fullName?.trim()}${randomNumber}`;
    return username;
  }
  const genAirUsername = generateAirUsername(firstName);
  console.log({
    email: email,
    username: username ? username : genAirUsername,
    password: password,
    firstName: firstName,
    lastName: lastName,

  });

  if (
    [firstName, lastName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "field is missing or empty 🫠");
  }

  const existedAirUser = await AirUser.findOne({ $or: [{ username }, { email }] });
  if (existedAirUser) {
    throw new ApiError(409, "AirUser with mail or  username already exists 🫠", res);
  }

  const user = await AirUser.create({
    firstName,
    lastName,
    username: username ? username?.toLowerCase() : genAirUsername?.toLowerCase(),
    email,
    password,
  });

  const createdAirUser = await AirUser.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!createdAirUser) {
    throw new ApiError(500, "Something went wrong 🫠 while registering user", res);
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdAirUser, "AirUser registered Successfully ✅"));
});

const loginUser = asyncHandler(async (req, res) => {
  /* 
- req body data
- find username email in DB
- check password match
- if match make  refresh token send data with it 
- send cookies
*/

  const { email, username, password } = req.body;

  if (!email) {
    throw new ApiError(400, "username or email is required 🫠..", res);
  }

  const user = await AirUser.findOne({ $or: [{ username:email }, { email}] });

  if (!user) {
    throw new ApiError(404, "user does not exist .🫠..", res);
  }


  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials 🫠..", res);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedAirUser = await AirUser.findById(user._id).select(
    "-password -refreshToken "
  );

  const options = { httpOnly: true, secure: true }; //only modifiable  by server

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedAirUser, accessToken, refreshToken },
        "user logged in successfully ✅"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  /*
  use cookies to find user 
  find user by id
  clear cookies and refreshToken of user

  */
  AirUser.findByIdAndUpdate(
    req.user._id,
    {
      // $set: { refreshToken: undefined },
      $unset: {
        refreshToken: 1, //this will removes refreshToken from document
      },
    },
    { new: true }
  );

  const options = { httpOnly: true, secure: true }; //only modifiable  by server

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout in successfully ✅"));
});

const refreshTokenToAccessToken = asyncHandler(async (req, res) => {
  const IncomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized request 🫠");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await AirUser.findById(decodedRefreshToken?._id);

    if (!user) throw new ApiError(401, "Invalid Refresh token AirUser Not found ");

    if (IncomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used 🫠");
    }
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);
    const options = { httpOnly: true, secure: true }; //only modifiable  by server

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed and stored ✅"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token 🫠");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(401, "Invalid email or password 🫠");
  }

  const user = await AirUser.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, " Incorrect old password 🫠");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully ✅"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullName } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All field are required 🫠");
  }
  const user = await AirUser.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullName: fullName, email: email },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account details updated successfully ✅")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully ✅"));
});





export {
  registration,
  loginUser,
  logoutUser,
  refreshTokenToAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  getCurrentUser,
};
