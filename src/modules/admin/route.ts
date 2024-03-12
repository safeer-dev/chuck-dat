// module imports
import express, { Request, Response } from "express";

// file imports
import * as adminController from "./controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from "../../middlewares/authenticator";

// destructuring assignments

// variable initializations
const router = express.Router();

router.delete(
  "/clean/DB",
  verifyToken,
  verifyAdmin,

  exceptionHandler(async (_req: Request, res: Response) => {
    res.json({ message: "Operation completed successfully!" });
  }),
);
export default router;
