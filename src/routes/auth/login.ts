import { Router } from "express";
import User from "../../models/user.js";
const router = Router();

import { fieldError } from "../../types/validations.js";
import { mapFieldValidationErrors } from "../../helpers/index.js";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: "Username or password is incorrect.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(404).json({
        error: "Username or password is incorrect.",
      });
    }

    // create a token
    const token = await user.generateJwtToken();

    // send the token in the response
    res.status(200).json({
      message: "Login successful.",
      result: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          verfied: user.verified,
        },
        token: token,
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
