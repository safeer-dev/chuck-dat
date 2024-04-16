// module imports
import express, { Request, Response } from "express";

// file imports
import * as elementController from "./controller";
import * as chuckerServiceController from "../chucker-service/controller";
import * as userController from "../user/controller";
import { exceptionHandler } from "../../middlewares/exception-handler";
import { verifyToken, verifyAdmin, verifyUser } from "../../middlewares/authenticator";
import { PUBLIC_DIRECTORY } from "../../configs/directories";
import { upload } from "../../middlewares/uploader";
import { IRequest } from "../../configs/types";
const uploadTemporary = upload(PUBLIC_DIRECTORY);
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

//auth

router.put(
  "/complete-profile",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    let element = req.user._id;
    const { authStepCompleted } = req.query;
    const { firstName, lastName, phone, services } = req.body;

    const args = {
      firstName,
      lastName,
      phone,
      authStepCompleted,
    };

    element = element?.toString() || "";
    const responseUser = await userController.updatechuckerById(element, args);
    const argsSerivce = { chucker: element, services };
    const chuckerServices = await chuckerServiceController.addServices(argsSerivce);

    res.json({ chuckerServices, responseUser });
  }),
);

router.put(
  "/verify-phone",
  verifyToken,
  verifyUser,
  // upload().single("image"),
  exceptionHandler(async (req: IRequest, res: Response) => {
    let user = req.user._id;

    const { otp } = req.body;
    const args = {
      otp,
      user,
    };
    const response = await userController.verifyPhone(args);
    res.json(response);
  }),
);

router.put(
  "/upload-pictures",
  verifyToken,
  verifyUser,
  // uploadTemporary.array("equipmentMedia", 20),
  // uploadTemporary.single("image"),
  // uploadTemporary.single("Media"),
  // uploadTemporary.single("faceImage"),
  exceptionHandler(async (req: IRequest, res: Response) => {
    let element = req.user._id;
    const { authStepCompleted } = req.query;

    const { faceImage, image, equipmentMedia } = req.body;
    // const faceImage = req.file;
    // const image = req.file;
    // const equipmentMedia = req.file;
    element = element?.toString() || "";
    // let mediaPaths;
    // if (equipmentMedia){
    //     mediaPaths = equipmentMedia.map((file: any) => file.filename);
    // }
    const args = {
      faceImage,
      // : faceImage?.filename,
      equipmentMedia,
      // : equipmentMedia?.filename,
      image,
      authStepCompleted,
      // : image?.filename,
    };
    const response = await elementController.updateElement({ user: element }, args);
    const updateUser = await userController.updatechuckerById(element, args);

    res.json({ response, updateUser });
  }),
);

router.put(
  "/upload-location",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    let element = req.user._id;
    const { authStepCompleted } = req.query;

    element = element?.toString() || "";

    const { street, city, state, country, zipCode, coordinates } = req.body;
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

    const args = { street, city, state, country, zipCode, location, authStepCompleted };
    const response = await userController.updatechuckerById(element, args);
    res.json(response);
  }),
);

router.put(
  "/upload-identity",
  verifyToken,
  verifyUser,
  // uploadTemporary.single(" idCard"),
  // uploadTemporary.single("drivingLicense"),
  exceptionHandler(async (req: Request, res: Response) => {
    let { element } = req.query;
    const { drivingLicense, idCard } = req.body;
    // const drivingLicense = req.file;
    // const idCard = req.file;

    element = element?.toString() || "";
    // let mediaPaths;
    // if (equipmentMedia){
    //     mediaPaths = equipmentMedia.map((file: any) => file.filename);
    // }
    const args = {
      idCard,
      drivingLicense,
    };
    const response = await elementController.updateElement({ user: element }, args);

    res.json(response);
  }),
);

router.put(
  "/upload-service-areas",
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { authStepCompleted } = req.query;

    const user = req.user._id;
    const element = user.toString();
    const { ServiceRadius, ServiceZipCodes, coordinates } = req.body;

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

    const args = {
      ServiceRadius,
      ServiceZipCodes,
      Servicelocation: location,
      authStepCompleted,
    };
    const response = await elementController.updateElement({ user: element }, args);

    res.json(response);
  }),
);

router.put(
  "/upload-w9-form",
  verifyToken,
  verifyUser,
  // uploadTemporary.single("form"),
  exceptionHandler(async (req: IRequest, res: Response) => {
    let { authStepCompleted } = req.query;
    let user = req.user._id;
    const { drivingLicense, idCard } = req.body;
    // const drivingLicense = req.file;
    // const idCard = req.file;

    user = user?.toString() || "";
    // let mediaPaths;
    // if (equipmentMedia){
    //     mediaPaths = equipmentMedia.map((file: any) => file.filename);
    // }
    const args = {
      idCard,
      drivingLicense,
    };
    const response = await elementController.updateElement({ user: user }, args);

    res.json(response);
  }),
);

router.get(
  "/myprofile",
  verifyToken,
  verifyAdmin,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const user = req.user._id;
    const response = await elementController.getElementById(user.toString());
    res.json(response);
  }),
);

export default router;
