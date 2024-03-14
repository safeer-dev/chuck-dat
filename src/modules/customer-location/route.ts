// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "./controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from "../../middlewares/authenticator";
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
      const { coordinates, street, city, state, country, zipCode } = req.body;
      const user = req.user._id;
      const parsedCoordinates = JSON.parse(coordinates);
      const location = {
        type: "Point",
        coordinates: parsedCoordinates,
      };
      if (
        !parsedCoordinates ||
        !Array.isArray(parsedCoordinates) ||
        parsedCoordinates.length !== 2
      ) {
        throw new Error("Invalid coordinates provided.");
      }

      const args = { user, street, city, state, country, zipCode, location };

      const response = await elementController.addElement(args);
      res.json(response);
    }),
  )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { coordinates, street, city, state, country, zipCode } = req.body;
      const parsedCoordinates = JSON.parse(coordinates);
      const location = {
        type: "Point",
        coordinates: parsedCoordinates,
      };
      if (
        !parsedCoordinates ||
        !Array.isArray(parsedCoordinates) ||
        parsedCoordinates.length !== 2
      ) {
        throw new Error("Invalid coordinates provided.");
      }

      const args = { street, city, state, country, zipCode, location };
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
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    const { element } = req.params;
    const response = await elementController.getElementById(element);
    res.json(response);
  }),
);

export default router;
