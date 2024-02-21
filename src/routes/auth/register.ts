import { Router } from "express";
import User from "../../models/user.js";
const router = Router();

import { fieldError } from "../../types/validations.js";
import { mapFieldValidationErrors } from "../../helpers/index.js";

router.post("/user", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await user.save();

    // map user to a new object to exclude password and other sensitive information
    res.json({
      message: "User created successfully",
      result: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    if (mapFieldValidationErrors(error)) {
      res.status(500).json({
        error: {
          errors: mapFieldValidationErrors(error) as fieldError[],
        },
      });
    } else {
      res.status(500).json({ error: error });
    }
  }
});

export default router;
