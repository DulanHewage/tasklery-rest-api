import express from "express";
// import User from "../models/user.js";
const router = express.Router();

// Define your routes here
router.get("/", (_req, res) => {
  res.send("Server is up and running");
});

// router.post("/api/user", async (req, res) => {
//   try {
//     const user = new User({
//       name: "John Doe",
//       email: "jogndoe@gmail.com",
//     });
//     await user.save();
//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

export default router;
