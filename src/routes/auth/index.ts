import { Router } from "express";

import registerRouter from "./register.js";
import loginRouter from "./login.js";
import meRouter from "./me.js";

const router = Router();

router.use(registerRouter);
router.use(loginRouter);
router.use(meRouter);

export default router;
