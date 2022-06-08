import express from "express";
import data from "../data.js";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const seedRouter = express.Router();
seedRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
     //await User.removed({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

export default seedRouter;
