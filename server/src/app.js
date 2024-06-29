import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import userRouter from "./routes/user.routes.js"


const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Enable trust proxy
app.enable('trust proxy');

// Apply middleware
app.use(bodyParser.json());

// app.use(function (req, res, next) {

//   res.header("Access-Control-Allow-Origin", "*");
//   // const allowedOrigins = process.env.CORS_ORIGIN;
//   const origin = req.headers.origin;
//   console.log("origin : ",origin )
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   res.header("Access-Control-Allow-credentials", true);
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE, PATCH");
//   next();
// });


app.use(express.json({ limit: "16kb" })); //json upload limit to save server from crash..
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //url data understanding
app.use(express.static("public")); //store file direct on server for public access
app.use(cookieParser()); //cookie  set get operations


app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
    res.send("hey i back end api started now testing .... 🍻⏳");
  });
  
  export { app };


