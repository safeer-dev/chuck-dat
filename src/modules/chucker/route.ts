// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "./controller";
import * as chuckerServiceController from "../chucker-service/controller";
import * as userController from "../user/controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from "../../middlewares/authenticator";

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
  .route("/complete-profile")
  .all(verifyToken, verifyUser)
  // .post(
  //   exceptionHandler(async (req: Request, res: Response) => {
  //     const { title } = req.body;
  //     const args = { title };
  //     const response = await elementController.addElement(args);
  //     res.json(response);
  //   })
  // )
  .put(
    exceptionHandler(async (req: Request, res: Response) => {
      let { element } = req.query;
      const { firstName, lastName, phone, services } = req.body;

      const args = {
        firstName,
        lastName,
        phone,
      };

      element = element?.toString() || "";
      const responseUser = await userController.updatechuckerById(
        element,
        args,
      );
      const argsSerivce = { chucker: element, services };
      const chuckerServices = await chuckerServiceController.addServices(
        argsSerivce,
      );

      res.json({ chuckerServices, responseUser });
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

router.get(
  "/upload-pictures",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { faceImage, equipmentMedia, image } = req.body;
    element = element?.toString() || "";

    const args = { faceImage, equipmentMedia, image };
    const response = await elementController.updateElementById(element, args);
    const updateUser = await userController.updatechuckerById(element, args);

    res.json(response);
  }),
);

export default router;

// const promises = hashtags.map(async (tag: any) => {
//   const arga = { post: response._id, hashtag: tag };
//   const hashTag = await hashtagcontroller.addElement(arga);
//   return hashTag;
// });

// const results = await Promise.all(promises);
