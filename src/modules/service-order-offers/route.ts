// module imports
import express, { Request, Response } from "express";
import { SERVICE_ORDER_OFFER } from "../../configs/enum";
// file imports
import * as elementController from "./controller";
import * as serviceOrderController from "../service-order/controller";
import * as serviceRequestController from "../service-order-request/controller";
import * as serviceController from "../service/controller";

import { exceptionHandler } from "../../middlewares/exception-handler";
import { verifyToken, verifyAdmin, verifyUser } from "../../middlewares/authenticator";
import { IRequest } from "../../configs/types";

// destructuring assignments
const { CONFIRMED } = SERVICE_ORDER_OFFER;
// variable initializations
const router = express.Router();

router.get(
  "/chucker",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    const chucker = req.user._id;
    let { keyword } = req.query;
    keyword = keyword?.toString() || "";
    const args = {
      keyword,
      chucker,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getElements(args);
    res.json(response);
  }),
);

router.put(
  "/chucker/edit-service-request-offer",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { date } = req.body;
    const args = {
      date,
    };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);
    res.json(response);
  }),
);

router.delete(
  "/chucker/delete-service-request-offer",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    element = element?.toString() || "";
    const response = await elementController.deleteElementById(element);
    res.json(response);
  }),
);

//customer routes
router.put(
  "/customer/accept-offer",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    let { serviceOffer } = req.query;
    serviceOffer = serviceOffer?.toString() || "";
    const args = { status: CONFIRMED };
    const response = await elementController.updateServiceOffer(serviceOffer, args);
    let element = response.serviceRequest;
    const serviceRequest = await serviceRequestController.getElementById(element);
    const service = await serviceController.getElementById(serviceRequest.service);
    const argsServiceOrder = {
      customer: response.customer,
      chucker: response.chucker,
      date: response.date,
      serviceRequest: response.serviceRequest,
      totalPayment: service.charges,
      service: service._id,
    };
    const addserviceOrder = await serviceOrderController.addElement(argsServiceOrder);
    res.json({ response, addserviceOrder });
  }),
);

router.get(
  "/customer",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    const customer = req.user._id;
    const args = {
      customer,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getElements(args);
    res.json(response);
  }),
);

router.get(
  "/:element",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await elementController.getElementById(element);
    res.json(response);
  }),
);

export default router;
