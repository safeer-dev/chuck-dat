// module imports
import mongoose, { isValidObjectId } from "mongoose";

// file imports
import ElementModel from "./model";
import * as chuckerController from "../chucker/controller";
import { Element } from "./interface";
import { GetElementsDTO } from "./dto";

// destructuring assignments

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
  element: string,
  elementObj: Partial<Element>,
) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element)) throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findByIdAndUpdate(element, elementObj, {
    new: true,
  });
  if (!elementExists) throw new Error("element not found!|||404");
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
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOneAndUpdate(query, elementObj, {
    new: true,
  });
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const deleteElementById = async (element: string) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element)) throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findByIdAndDelete(element);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Delete element
 * @param {String} query element data
 * @returns {Object} element data
 */
export const deleteElement = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOneAndDelete(query);
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {String} element element id
 * @returns {Object} element data
 */
export const getElementById = async (element: any) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element)) throw new Error("Please enter valid element id!|||400");
  const elementExists = await ElementModel.findById(element).select(
    "-createdAt -updatedAt -__v",
  );
  if (!elementExists) throw new Error("element not found!|||404");
  return elementExists;
};

/**
 * @description Get element
 * @param {Object} query element data
 * @returns {Object} element data
 */
export const getElement = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  const elementExists = await ElementModel.findOne(query).select(
    "-createdAt -updatedAt -__v",
  );
  if (!elementExists) throw new Error("element not found!|||404");
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
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceLookup",
      },
    },
    { $unwind: { path: "$serviceLookup", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        serviceId: "$service",
        serviceName: "$serviceLookup.name",
        amount: "$serviceLookup.charges",
      },
    },
    {
      $lookup: {
        from: "customer-locations",
        localField: "location",
        foreignField: "_id",
        as: "address",
      },
    },
    { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },

    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [
          { $skip: page * limit },
          { $limit: limit },
          {
            $project: {
              service: "$serviceId",
              amount: 1,

              serviceName: 1,
              lotSize: 1,
              notes: 1,
              subServices: 1,
              location: "$address",
              image: 1,
              status: 1,
              isAssigned: 1,
              name: 1,
              customer: 1,
            },
          },
        ],
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

//  export const getOrderRequests = async (params: GetElementsDTO) => {
//    let { limit, page, chucker, customerLocation, chuckerServiceRadius, zipCodes } =
//      params;
//    page = page - 1 || 0;
//    limit = limit || 10;

//    const result = await ElementModel.aggregate([
//      {
//        $geoNear: {
//          near: {
//            type: "Point",
//            coordinates: customerLocation,
//          },
//          distanceField: "distance",
//          maxDistance: chuckerServiceRadius,
//          spherical: true,
//          query: {
//            decliners: { $nin: [new mongoose.Types.ObjectId(chucker)] },
//          },
//        },
//      },
//      {
//        $match: {
//          "address.zipCode": { $in: zipCodes }, // Filter by customer location zip codes
//        },
//      },
//      { $sort: { createdAt: -1 } },
//      { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
//      {
//        $lookup: {
//          from: "services",
//          localField: "service",
//          foreignField: "_id",
//          as: "serviceLookup",
//        },
//      },
//      { $unwind: { path: "$serviceLookup", preserveNullAndEmptyArrays: true } },
//      {
//        $addFields: {
//          serviceId: "$service",
//          serviceName: "$serviceLookup.name",
//          amount: "$serviceLookup.charges",
//        },
//      },
//      {
//        $lookup: {
//          from: "customer-locations",
//          localField: "location",
//          foreignField: "_id",
//          as: "address",
//        },
//      },
//      { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
//      {
//        $facet: {
//          totalCount: [{ $count: "totalCount" }],
//          data: [
//            { $skip: page * limit },
//            { $limit: limit },
//            {
//              $project: {
//                service: "$serviceId",
//                amount: 1,
//                serviceName: 1,
//                lotSize: 1,
//                notes: 1,
//                subServices: 1,
//                location: "$address",
//                image: 1,
//                status: 1,
//                isAssigned: 1,
//                name: 1,
//                customer: 1,
//              },
//            },
//          ],
//        },
//      },
//      { $unwind: "$totalCount" },
//      {
//        $project: {
//          totalCount: "$totalCount.totalCount",
//          totalPages: { $ceil: { $divide: ["$totalCount.totalCount", limit] } },
//          data: 1,
//        },
//      },
//    ]);

//    return { data: [], totalCount: 0, totalPages: 0, ...(result[0] || {}) }; // result[0] because result is an array with one element
//  };

export const getOrderRequests = async (params: GetElementsDTO) => {
  let { limit, page, chucker, chuckerLocation, chuckerServiceRadius, chuckerZipcodes } =
    params;
  page = page - 1 || 0;
  limit = limit || 10;
  const result = await ElementModel.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: chuckerLocation?.coordinates || [0, 0],
        },
        distanceField: "distance",
        maxDistance: chuckerServiceRadius,
        // query: { status: PENDING },
        // includeLocs: "dist.location",
        // spherical: true,
      },
    },
    {
      $match: {
        decliners: { $nin: [new mongoose.Types.ObjectId(chucker)] },
      },
    },

    { $sort: { createdAt: -1 } },
    { $project: { createdAt: 0, updatedAt: 0, __v: 0 } },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "serviceLookup",
      },
    },
    { $unwind: { path: "$serviceLookup", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        serviceId: "$service",
        serviceName: "$serviceLookup.name",
        amount: "$serviceLookup.charges",
      },
    },
    {
      $lookup: {
        from: "customer-locations",
        localField: "location",
        foreignField: "_id",
        as: "address",
      },
    },
    { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
    {
      $facet: {
        totalCount: [{ $count: "totalCount" }],
        data: [
          { $skip: page * limit },
          { $limit: limit },
          {
            $project: {
              service: "$serviceId",
              amount: 1,
              serviceName: 1,
              lotSize: 1,
              notes: 1,
              subServices: 1,
              location: "$address",
              image: 1,
              status: 1,
              isAssigned: 1,
              name: 1,
              customer: 1,
            },
          },
        ],
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

  return { data: [], totalCount: 0, totalPages: 0, ...result[0] }; // result[0] because result is an array with one element
};

export const getOrderRequest = async (params: any) => {
  const { chucker, requestId } = params;

  const result = await ElementModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(requestId),
      },
    },
    {
      $match: {
        decliners: { $nin: [new mongoose.Types.ObjectId(chucker)] },
      },
    },
  ]);

  return result;
};

/**
 * @description Check element existence
 * @param {Object} query element data
 * @returns {Boolean} element existence status
 */
export const checkElementExistence = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await ElementModel.exists(query);
};

/**
 * @description Count elements
 * @param {Object} query element data
 * @returns {Number} elements count
 */
export const countElements = async (query: Partial<Element>) => {
  if (!query || Object.keys(query).length === 0)
    throw new Error("Please enter query!|||400");
  return await ElementModel.countDocuments(query);
};

export const getPendingOrderRequest = async (customer: string) => {
  const pendingOrders = await ElementModel.find({ customer, status: "pending" });

  return pendingOrders;
};

export const addDecliner = async (element: string, chucker_id: any) => {
  if (!element) throw new Error("Please enter element id!|||400");
  if (!isValidObjectId(element)) throw new Error("Please enter valid element id!|||400");

  const elementExists: any = await ElementModel.findByIdAndUpdate(
    element,
    { $push: { decliners: chucker_id } },
    { new: true },
  ).catch((error) => {
    console.error("Error updating element:", error);
    throw new Error("Error updating element!|||500");
  });

  if (!elementExists) throw new Error("element not found!|||404");

  return elementExists;
};
