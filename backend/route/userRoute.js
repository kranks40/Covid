import express from "express";
import expressAsyncHandler from "express-async-handler";

import bcrypt from "bcryptjs";
import data from "../data.js";
import { generateToken } from "../utils.js";
import User from "../models/userModel.js";

const userRouter = express.Router();



userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    //An ajax request is sent  to check the user and email in the database
    const user = await User.findOne({ email: req.body.email });
    //you need to check if user exist and compare it with the password
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //if the comparison is true then i would send only parts of user data
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          //the token would be generated by json webtoken to be used to authenticate and authorise user.
          token: generateToken(user),
        });
        return;
      }
    }
    // if user does not exist or password does not match a status 401 would be sent, which means invalid code.
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      //the token would be generated by json webtoken to be used to authenticate and authorise user.
      token: generateToken(createdUser),
    });
  })
);

//getting user details for profile screen
userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.send(404).send({ message: "User not Found" });
    }
  })
);

//updates the user profile
userRouter.put(
  "/profile",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

//api to list users
userRouter.get(
  "/",

  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

//api to delete user
userRouter.delete(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Cannot Delete Admin User" });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: "User Deleted", user: deleteUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

//api to update user
userRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
