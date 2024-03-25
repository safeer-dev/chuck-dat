// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "./controller";
import * as serviceOrderController from "../service-order/controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { verifyToken, verifyAdmin, verifyUser } from "../../middlewares/authenticator";
import { IRequest } from "../../configs/types";

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
  .route("/customer")
  .all(verifyToken, verifyUser)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const customer = req.user._id;
      const { feedback, chucker, serviceOrder, rating } = req.body;
      const args = { feedback, chucker, customer, serviceOrder, rating };
      const response = await elementController.addElement(args);
      const arg = { isFeedbackPosted: true };
      const responseOrder = await serviceOrderController.updateElementById(
        serviceOrder,
        arg,
      );
      res.json({ response, responseOrder });
    }),
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { feedback, chucker, serviceOrder, rating } = req.body;
      const args = { feedback, chucker, serviceOrder, rating };
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
  "/chucker",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { page, limit } = req.query;
    const user = req.user._id;
    const args = {
      chucker: user.toString(),
      limit: Number(limit),
      page: Number(page),
    };
    const response = await elementController.getElements(args);
    res.json(response);
  }),
);

export default router;
