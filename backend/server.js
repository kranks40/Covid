import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import seedRouter from "./route/seedRouter.js";

import userRouters from "./route/userRoute.js";

dotenv.config();

const app = express();

//Middleware
app.use("/api/v1/seed", seedRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
//this middleware is an error catcher when there is an error in the router using expressAsyncHandler
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "Covid",
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err.message);
  });

  
//Router
app.use("api/v1/users", userRouters);

const port = process.env.PORT || 1300;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port} `);
});
