// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "./controller";
import * as serviceOrderOfferController from "../service-order-offers/controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { verifyToken, verifyAdmin, verifyUser } from "../../middlewares/authenticator";
import { IRequest } from "../../configs/types";

// destructuring assignments

// variable initializations
const router = express.Router();

// router.get(
//   "/",
//   verifyToken,
//   verifyUser,
//   exceptionHandler(async (req: Request, res: Response) => {
//     const { page, limit } = req.query;
//     let { keyword } = req.query;
//     keyword = keyword?.toString() || "";
//     const args = {
//       keyword,
//       limit: Number(limit),
//       page: Number(page),
//     };
//     const response = await elementController.getElements(args);
//     res.json(response);
//   }),
// );

router
  .route("/customer")
  .all(verifyToken, verifyUser)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const { service, lotSize, subServices, location, image, notes } = req.body;
      const customer = req.user._id;
      const args = {
        service,
        customer,
        lotSize,
        subServices,
        location,
        image,
        notes,
      };
      const response = await elementController.addElement(args);
      res.json(response);
    }),
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { service, lotSize, subServices, location, image, notes } = req.body;
      const args = {
        service,
        lotSize,
        subServices,
        location,
        image,
        notes,
      };
      element = element?.toString() || "";
      const response = await elementController.updateElementById(element, args);
      res.json(response);
    }),
  )
  // .get(
  //   exceptionHandler(async (req: Request, res: Response) => {
  //     const { page, limit } = req.query;
  //     let { keyword } = req.query;
  //     keyword = keyword?.toString() || "";
  //     const args = {
  //       keyword,
  //       limit: Number(limit),
  //       page: Number(page),
  //     };
  //     const response = await elementController.getElements(args);
  //     res.json(response);
  //   }),
  // )
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
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await elementController.getElementById(element);
    res.json(response);
  }),
);

//get order requests for chuckers
router.get(
  "/chucker/all",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit, chuckerLocation, chuckerServiceRadius, chuckerZipcodes } =
      req.query;
    const chucker = req.user._id;
    const args = {
      chucker,
      chuckerLocation,
      chuckerServiceRadius,
      chuckerZipcodes,
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getOrderRequests(args);
    res.json(response);
  }),
);

router.get(
  "/chucker/single",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const chucker = req.user._id;
    let { requestId } = req.query;
    requestId = requestId?.toString() || "";

    const args = {
      chucker,
      requestId,
    };
    const response = await elementController.getOrderRequest(args);
    res.json(response);
  }),
);

router.put(
  "/chucker/decline-service-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { serviceRequest } = req.body;
    const chucker = req.user._id;
    const args = {
      chucker,
    };
    const response = await elementController.addDecliner(serviceRequest, chucker);
    res.json(response);
  }),
);

router.post(
  "/chucker/accept-service-request",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { serviceRequest, customer, date } = req.body;
    const chucker = req.user._id;
    const args = {
      chucker,
      serviceRequest,
      customer,
      date,
    };
    const response = await serviceOrderOfferController.addElement(args);
    res.json(response);
  }),
);

export default router;
