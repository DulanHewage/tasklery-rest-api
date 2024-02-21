import { Router } from "express";

import registerRouter from "./register.js";
const router = Router();

router.use(registerRouter);

export default router;
