const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require(
  "../utils/generateToken"
);

exports.registerUser = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      role,
      school,
      department,
      designation,
      employeeId
    } = req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists"
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        school,
        department,
        designation,
        employeeId
      });

    res.status(201).json({
      success: true,
      token: generateToken(
        user._id
      ),
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
};

exports.loginUser = async (
  req,
  res
) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await User.findOne({
        email
      });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.json({
        success: true,
        token:
          generateToken(
            user._id
          ),
        user
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid credentials"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message
    });
  }
};

exports.getMe = async (
  req,
  res
) => {
  res.json(req.user);
};