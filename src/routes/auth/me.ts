import { Router, Response } from "express";
import User from "../../models/user.js";
import { authenticateJWT } from "../../middleware/authentication.js";
import { RequestWithUser } from "../../types/request.js";
import { fieldError } from "../../types/validations.js";
import { mapFieldValidationErrors } from "../../helpers/index.js";
const router = Router();

router.post(
  "/me",
  authenticateJWT,
  async (req: RequestWithUser, res: Response) => {
    try {
      const { user } = req;

      const currentUser = await User.findById(user.id);

      if (!currentUser) {
        return res.status(404).json({
          error: "User not found.",
        });
      }
      res.status(200).json({
        result: {
          id: currentUser.id,
          email: currentUser.email,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          verified: currentUser.verified,
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
  }
);

export default router;
