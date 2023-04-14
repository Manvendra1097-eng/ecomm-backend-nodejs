import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/CustomError";
import User from "../models/user.schema";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = res.body;

  if (!name || !email || !password) {
    throw new CustomError("Invalid Request", 400);
  }

  // check is user present in database
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new CustomError("User already exist", 400);

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = User.getJWTtoken();
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    user,
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const [email, password] = req.body;

  if ((!email, !password)) {
    throw new CustomError("Please enter username and password", 400);
  }

  const user = User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid Credential");
  }

  const isPasswordCorrect = await User.comparePassword(password);

  if (isPasswordCorrect) {
    const token = user.getJWTtoken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  throw new CustomError("Password is incorrect ", 400);
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
