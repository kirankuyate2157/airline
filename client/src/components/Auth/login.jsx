import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast from "react-hot-toast";

function Login({ setType }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(data).length > 0) {
      toast.error("please enter a valid credentials!");
      return;
    }
    try {
      const res = await axios.post("/users/login", data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='h-full  flex flex-col gap-3'>
      <div className='flex justify-end py-1'>
        <button
          onClick={() => setType("signup")}
          className='border p-1 px-3 border-blue-600 text-blue-600 rounded'
        >
          SIGN UP
        </button>
      </div>
      <div className='w-full h-full py-16   flex flex-col justify-center  gap-6'>
        <div className='text-blue-600 flex flex-col items-start justify-start'>
          <h1 className=' font-semibold text-[1.7rem] sm:text-3xl'>
            Explore & Experience
          </h1>
          <p className='font-semibold text-sm'>
            Get onto your most confortable journey yet. All the way up.
          </p>
        </div>
        <div>
          <div className='flex flex-col items-start py-1.5 sm:py-3'>
            <input
              type='text'
              name='email'
              className='border-solid rounded-md border border-gray-300 w-[100%] p-2'
              placeholder='Email'
              onChange={handleChange}
              value={data.email}
              required
            />
          </div>

          <div className='flex flex-col items-start py-1.5 sm:py-3'>
            <div className='border-solid rounded-md border items-center border-gray-300 w-[100%] p-2 flex'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                className='w-full outline-none'
                placeholder='Password'
                onChange={handleChange}
                value={data.password}
                required
              />
              {showPassword ? (
                <IoEyeOff onClick={() => setShowPassword(false)} />
              ) : (
                <IoEye onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>
        </div>
        <button
          type='submit'
          onClick={handleSubmit}
          className='w-full text-white font-semibold bg-blue-600 p-2 rounded-sm'
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
}

export default Login;
