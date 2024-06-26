// module imports
import express, { Request, Response } from "express";

// file imports
import admin from "../modules/admin/route";
import auth from "../modules/auth/route";
import element from "../modules/element/route";
import message from "../modules/message/route";
import user from "../modules/user/route";
import service from "../modules/service/route";
import serviceRequest from "../modules/service-order-request/route";
import serviceOffers from "../modules/service-order-offers/route";
import serviceOrders from "../modules/service-order/route";

import subService from "../modules/sub-service/route";
import chucker from "../modules/chucker/route";
import customerLocation from "../modules/customer-location/route";

// destructuring assignments
const { POSTMAN_URL } = process.env;

// variable initializations
const router = express.Router();

router.use("/admins", admin);
router.use("/auth", auth);
router.use("/elements", element);
router.use("/messages", message);
router.use("/users", user);
router.use("/services", service);
router.use("/sub-services", subService);
router.use("/service-requests", serviceRequest);
router.use("/service-offers", serviceOffers);
router.use("/service-orders", serviceOrders);
router.use("/chuckers", chucker);
router.use("/customer-locations", customerLocation);
router.use("/docs", (_req: Request, res: Response) => res.redirect(POSTMAN_URL || ""));

export default router;
