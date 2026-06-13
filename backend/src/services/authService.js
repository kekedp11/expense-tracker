import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (data) => {
  const { username, password } = data;

  const existingUser = await User.findOne({
    username,
  });

  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  const user = await User.create({
    username,
    password: hashedPassword,
  });

  return {
    id: user._id,
    username: user.username,
  };
};

export const login = async (data) => {
  const { username, password } = data;

  const user = await User.findOne({
    username,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
    },
  };
};