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
  "/media-before-work",
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
  "/extra-charges-request",
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
  "/cancel-extra-charges-request",
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
  "/approve-extra-charges-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { status } = req.body;
    const args = { status };
    element = element?.toString() || "";
    const response = await extraChargesController.updateElementById(element, args);
    const arg = { extraChargesStatus: CONFIRMED };
    const serviceOrder = response.serviceOrder;
    const responseServiceOrder = await elementController.updateElementById(
      serviceOrder,
      arg,
    );
    res.json({ response, responseServiceOrder });
  }),
);

router.put(
  "/decline-extra-charges-request",
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
  "/start-work",
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
  "/cancel-order",
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
  "/submit-work",
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

router.put(
  "/accept-work",
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
  "/decline-work",
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

export default router;
