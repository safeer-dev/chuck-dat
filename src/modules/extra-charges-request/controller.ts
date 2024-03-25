// module imports
import { isValidObjectId } from "mongoose";

// file imports
import ElementModel from "./model";
import * as notificationsController from "../notification/controller";
import * as serviceOrderController from "../service-order/controller";
import { EXTRA_CHARGES_REQUEST_STATUS } from "../../configs/enum";
import { NOTIFICATION_TYPES } from "../../configs/enum";
import { Element } from "./interface";
import { GetElementsDTO } from "./dto";
import { MongoID } from "../../configs/types";
import { ErrorHandler } from "../../middlewares/error-handler";

// destructuring assignments
const { CONFIRMED, REJECTED } = EXTRA_CHARGES_REQUEST_STATUS;
const { EXTRA_CHARGES_REQUEST_ACCEPTED, EXTRA_CHARGES_REQUEST_REJECTED } =
  NOTIFICATION_TYPES;
// variable initializations

/**
 * @description Add element
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const addElement = async (elementObj: Element) => {
  return await ElementModel.create(elementObj);
};

/**
 * @description Update element data
 * @param {String} element element id
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElementById = async (
  element: MongoID,
  elementObj: Partial<Element>,
) => {
  const { status } = elementObj;
  if (!element) throw new ErrorHandler("Please enter element id!", 400);
  if (!isValidObjectId(element))
    throw new ErrorHandler("Please enter valid element id!", 400);
  const elementExists = await ElementModel.findByIdAndUpdate(element, elementObj, {
    new: true,
  });
  if (!elementExists) throw new ErrorHandler("element not found!", 404);
  // if (elementExists) {
  //   const serviceOrder = await serviceOrderController.getElementById(
  //     elementExists.serviceOrder.toString(),
  //   );
  //   if (status == CONFIRMED) {
  //     const notificationObj = {
  //       type: EXTRA_CHARGES_REQUEST_ACCEPTED,
  //       user: serviceOrder.chucker,
  //       socketData: serviceOrder,
  //       event: `extraChargesRequestAccepted_${serviceOrder._id.toString()}`,
  //       title: "extra charges Request Accepted",
  //       body: `Your extra charges request has been accepted`,
  //       notificationData: { user: serviceOrder.chucker, order: serviceOrder._id },
  //       firebaseData: { order: serviceOrder._id.toString() },
  //       useSocket: true,
  //       useFirebase: true,
  //       useDatabase: true,
  //     };

  //     await notificationsController.notifyUsers(notificationObj);
  //   } else if (status == REJECTED) {
  //     //  await new SocketManager().emitEvent({
  //     //    to: responseServiceOrder.chucker.toString(),
  //     //    event: "",
  //     //    data: responseServiceOrder,
  //     //  });
  //     const notificationObj = {
  //       type: EXTRA_CHARGES_REQUEST_REJECTED,
  //       user: serviceOrder.chucker,
  //       socketData: serviceOrder,
  //       event: `extraChargesRequestRejected_${serviceOrder._id.toString()}`,
  //       title: "extra charges request rejected",
  //       body: `Your extra charges request has been rejected`,
  //       notificationData: { user: serviceOrder.chucker, order: serviceOrder._id },
  //       firebaseData: { order: serviceOrder._id.toString() },
  //       useSocket: true,
  //       useFirebase: true,
  //       useDatabase: true,
  //     };

  //     await notificationsController.notifyUsers(notificationObj);
  //   }
  // }
  return elementExists;
};

/**
 * @description Update element data
 * @param {Object} query element data
 * @param {Object} elementObj element data
 * @returns {Object} element data
 */
export const updateElement = async (
  query: Partial<Element>,
  elementObj: Partial<Element>,
) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const elementExists = await ElementModel.findOneAndUpdate(query, elementObj, {
    new: true,
  });
  if (!elementExists) throw new ErrorHandler("element not found!", 404);
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const deleteElementById = async (element: MongoID) => {
  if (!element) throw new ErrorHandler("Please enter element id!", 400);
  if (!isValidObjectId(element))
    throw new ErrorHandler("Please enter valid element id!", 400);
  const elementExists = await ElementModel.findByIdAndDelete(element);
  if (!elementExists) throw new ErrorHandler("element not found!", 404);
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const elementExists = await ElementModel.findOneAndDelete(query);
  if (!elementExists) throw new ErrorHandler("element not found!", 404);
  return elementExists;
};

/**
 * @description Get element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const getElementById = async (element: MongoID) => {
  if (!element) throw new ErrorHandler("Please enter element id!", 400);
  if (!isValidObjectId(element))
    throw new ErrorHandler("Please enter valid element id!", 400);
  const elementExists = await ElementModel.findById(element).select(
    "-createdAt -updatedAt -__v",
  );
  if (!elementExists) throw new ErrorHandler("element not found!", 404);
  return elementExists;
};

/**
 * @description Get element
 * @param {Object} query element data
 * @returns {Object} element data
 */
export const getElement = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  const elementExists = await ElementModel.findOne(query).select(
    "-createdAt -updatedAt -__v",
  );
  if (!elementExists) throw new ErrorHandler("element not found!", 404);
  return elementExists;
};

/**
 * @description Get elements
 * @param {Object} params elements fetching parameters
 * @returns {Object[]} elements data
 */
export const getElements = async (params: GetElementsDTO) => {
  let { limit, page } = params;
  page = page - 1 || 0;
  limit = limit || 10;
  const query: any = {};
  const [result] = await ElementModel.aggregate([
    { $match: query },
    { $sort: { createdAt: -1 } },
    { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [{ $skip: page * limit }, { $limit: limit }],
      },
    },
    { $unwind: "$totalCount" },
    {
      $project: {
        totalCount: "$totalCount.totalCount",
        totalPages: { $ceil: { $divide: ["$totalCount.totalCount", limit] } },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};

/**
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkElementExistence = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await ElementModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new ErrorHandler("Please enter query!", 400);
  return await ElementModel.countDocuments(query);
};
