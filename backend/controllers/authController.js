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

    // =========================
    // VALIDATIONS
    // =========================

    if (
      !name ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Full Name is required"
      });
    }

    if (
      !email ||
      !email.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email is required"
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Email Format"
      });
    }

    if (
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password is required"
      });
    }

    if (
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters"
      });
    }

    if (
      !role
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role is required"
      });
    }

    if (
      !school
    ) {
      return res.status(400).json({
        success: false,
        message:
          "School is required"
      });
    }

    if (
      role !== "dean" &&
      (
        !department ||
        !department.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Department is required"
      });
    }

    // =========================
    // CHECK USER EXISTS
    // =========================

    const userExists =
      await User.findOne({
        email
      });

    if (
      userExists
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists"
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // =========================
    // CREATE USER
    // =========================

    const user =
      await User.create({

        name:
          name.trim(),

        email:
          email.trim(),

        password:
          hashedPassword,

        role,

        school,

        department:
          role === "dean"
            ? ""
            : department,

        designation,

        employeeId
      });

    res.status(201).json({

      success: true,

      token:
        generateToken(
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

    const {
      email,
      password
    } = req.body;

    if (
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and Password are required"
      });
    }

    const user =
      await User.findOne({
        email
      });

    if (
      user &&
      (
        await bcrypt.compare(
          password,
          user.password
        )
      )
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

  res.json(
    req.user
  );

};