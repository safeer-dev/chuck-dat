// module imports
import express, { Request, Response } from "express";

// file imports
import admin from "../modules/admin/route";
import auth from "../modules/auth/route";
import element from "../modules/element/route";
import message from "../modules/message/route";
import user from "../modules/user/route";
import service from "../modules/service/route";
import subService from "../modules/sub-service/route";
import chucker from "../modules/chucker/route";
import customerLocation from "../modules/customer-location/route";

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = express.Router();

router.use("/admin", admin);
router.use("/auth", auth);
router.use("/element", element);
router.use("/message", message);
router.use("/user", user);
router.use("/service", service);
router.use("/sub-service", subService);

router.use("/chucker", chucker);
router.use("/customer-location", customerLocation);

router.use("/docs", (_req: Request, res: Response) =>
  res.redirect(POSTMAN_URL || ""),
);

export default router;
