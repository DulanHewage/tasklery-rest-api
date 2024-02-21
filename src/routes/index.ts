import { Router } from "express";
import AuthRouter from "./auth/index.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("Server is up and running");
});

router.use("/auth", AuthRouter);

export default router;
