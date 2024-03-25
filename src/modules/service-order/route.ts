// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "./controller";
import * as extraChargesController from "../extra-charges-request/controller";
import * as previousWorkController from "../previous-work/controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { verifyToken, verifyAdmin, verifyUser } from "../../middlewares/authenticator";
import { SERVICE_ORDER_FEEDBACK } from "../../configs/enum";
import { SERVICE_ORDER_STATUS } from "../../configs/enum";
import { EXTRA_CHARGES_REQUEST_STATUS } from "../../configs/enum";
import { IRequest } from "../../configs/types";
import SocketManager from "../../utils/socket-manager";

const { COMPLETED } = SERVICE_ORDER_STATUS;
const { AWAITING, REJECTED, APPROVED } = SERVICE_ORDER_FEEDBACK;
const { CONFIRMED } = EXTRA_CHARGES_REQUEST_STATUS;
// destructuring assignments

// variable initializations
const router = express.Router();

router.get(
  "/",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    let { keyword } = req.query;
    keyword = keyword?.toString() || "";
    const args = {
      keyword,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getElements(args);
    res.json(response);
  }),
);

router
  .route("/admin")
  .all(verifyToken, verifyAdmin)
  .post(
    exceptionHandler(async (req: Request, res: Response) => {
      const { customer } = req.body;
      const args = { customer };
      const response = await elementController.addElement(args);
      res.json(response);
    }),
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { customer } = req.body;
      const args = { customer };
      element = element?.toString() || "";
      const response = await elementController.updateElementById(element, args);
      res.json(response);
    }),
  )
  .get(
    exceptionHandler(async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      let { keyword } = req.query;
      keyword = keyword?.toString() || "";
      const args = {
        keyword,
        limit: Number(limit),
        page: Number(page),
      };
      const response = await elementController.getElements(args);
      res.json(response);
    }),
  )
  .delete(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      element = element?.toString() || "";
      const response = await elementController.deleteElementById(element);
      res.json(response);
    }),
  );

router.get(
  "/:element",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await elementController.getElementById(element);
    res.json(response);
  }),
);

router.put(
  "/chucker/media-before-work",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { mediaBeforeWork } = req.body;
    const args = { mediaBeforeWork };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);
    res.json(response);
  }),
);

router.put(
  "/chucker/extra-charges-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { amount } = req.body;
    const args = { serviceOrder: element, amount };
    element = element?.toString() || "";
    const response = await extraChargesController.addElement(args);
    const status = await elementController.setExtraChargesRequested(element);
    res.json({ response, status });
  }),
);

router.put(
  "/chucker/cancel-extra-charges-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    element = element?.toString() || "";
    const response = await extraChargesController.deleteElementById(element);

    const serviceOrder = response.serviceOrder.toString();
    const status = await elementController.setExtraChargesRequestedFalse(serviceOrder);
    res.json({ response, status });
  }),
);

router.put(
  "/chucker/start-work",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { status } = req.body;
    const args = { status };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);
    res.json(response);
  }),
);

router.put(
  "/chucker/cancel-order",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { status } = req.body;
    const args = { status };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);
    res.json(response);
  }),
);

router.put(
  "/chucker/submit-work",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { mediaAfterWork, notes } = req.body;
    const args = { mediaAfterWork, notes, feedbackStatus: AWAITING };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);
    const argsPreviousWork = { images: mediaAfterWork, chucker: response.chucker };
    const previousWork = await previousWorkController.addElement(argsPreviousWork);

    res.json({ response, previousWork });
  }),
);

router.get(
  "/chucker/orders",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    const { keyword, date } = req.body;
    const chucker = req.user._id;
    const args = {
      chucker,
      keyword,
      limit: Number(limit),
      page: Number(page),
      date,
    };
    const response = await elementController.getOrders(args);
    res.json(response);
  }),
);

//customer related routes

router.put(
  "/customer/approve-extra-charges-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { status } = req.body;
    const args = { status };
    element = element?.toString() || "";
    const response = await extraChargesController.updateElementById(element, args);
    // const totalPayment = +response.amount;
    const arg = { extraChargesStatus: CONFIRMED };
    const serviceOrder = response.serviceOrder;

    const responseServiceOrder = await elementController.updateElementById(
      serviceOrder,
      arg,
    );
    await new SocketManager().emitEvent({
      to: responseServiceOrder.chucker.toString(),
      event: "reminder",
      data: responseServiceOrder,
    });
    res.json({ response, responseServiceOrder });
  }),
);

router.put(
  "/customer/decline-extra-charges-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { status } = req.body;
    const args = { status };
    element = element?.toString() || "";
    const response = await extraChargesController.updateElementById(element, args);
    const arg = { extraChargesStatus: EXTRA_CHARGES_REQUEST_STATUS.REJECTED };
    const serviceOrder = response.serviceOrder;
    const responseServiceOrder = await elementController.updateElementById(
      serviceOrder,
      arg,
    );
    res.json({ response, responseServiceOrder });
  }),
);

router.put(
  "/customer/accept-work",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    // const { mediaAfterWork, notes } = req.body;
    const args = { feedbackStatus: APPROVED, status: COMPLETED };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);

    res.json({ response });
  }),
);

router.put(
  "/customer/decline-work",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { declinedfeedback } = req.body;
    const args = { declinedfeedback, feedbackStatus: REJECTED };
    element = element?.toString() || "";
    const response = await elementController.updateElementById(element, args);

    res.json({ response });
  }),
);

router.get(
  "/customer/current-orders",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    const { keyword } = req.body;
    const customer = req.body._id;
    // keyword = keyword?.toString() || "";
    const args = {
      customer,
      keyword,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getCustomerCurrentOrders(args);
    res.json(response);
  }),
);

router.get(
  "/customer/previous-orders",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    const customer = req.body._id;
    const args = {
      customer,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getCustomerCurrentOrders(args);
    res.json(response);
  }),
);

export default router;
