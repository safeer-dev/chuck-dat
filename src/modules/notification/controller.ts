import messagesModel from "../message/model";
import notificationsModel from "../notification/model";
import FirebaseManager from "../../utils/firebase-manager";
import { NOTIFICATION_TYPES, MESSAGE_STATUSES } from "../../configs/enum";
import SocketManager from "../../utils/socket-manager";
const { NEW_MESSAGE, CUSTOM } = NOTIFICATION_TYPES;
const { UNREAD, READ } = MESSAGE_STATUSES;

/**
 * Get user notifications
 * @param {string} user user id
 * @param {number} limit notifications limit
 * @param {number} page notifications page number
 * @returns {[object]} array of notifications
 */
export const getAllNotifications = async (params: any) => {
  const { user } = params;
  let { page, limit } = params;
  const query: any = {};
  if (user) query.user = user;
  page = page - 1 || 0;
  limit = limit || 10;
  const [result] = await notificationsModel.aggregate([
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
        totalPages: {
          $ceil: {
            $divide: ["$totalCount.totalCount", limit],
          },
        },
        data: 1,
      },
    },
  ]);
  return { data: [], totalCount: 0, totalPages: 0, ...result };
};

/**
 * New message notification
 * @param {string} message message id
 * @returns {null}
 */
export const newMessageNotification = async (parameters: any) => {
  const { message } = parameters;
  const messageExists: any = await messagesModel
    .findOne({ _id: message })
    .populate("userTo userFrom");
  if (!messageExists) {
    throw new Error("Message not found!");
  }
  const title = "New Message";
  const body = `New message from ${messageExists.userFrom.name}!`;
  await notificationsModel.create({
    type: NEW_MESSAGE,
    text: body,
    message: messageExists._id,
    messenger: messageExists.userFrom,
    user: messageExists.userTo,
  });

  const newNotifications = await notificationsModel
    .find({ user: messageExists.userTo, status: UNREAD })
    .count();

  await new SocketManager().emitGroupEvent({
    to: messageExists.userTo.toString(),
    event: "newNotifications_" + messageExists.userTo._id.toString(),
    data: newNotifications,
  });

  const fcms: any = [];
  messageExists.userTo.fcms.forEach(async (element: any) => {
    fcms.push(element.token);
  });
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: {
      type: NEW_MESSAGE,
      // message: JSON.stringify(messageExists)
    },
  });
};

/**
 * @description sends notifications to nearby chuckers
 * @param {[string]} fcms user fcms
 */
export const newOrderRequestNotification = async (args: any) => {
  const { fcms, type, order } = args;
  const title = "New Order Request";
  const body = "There is a new order request near you.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
};

/**
 * @description sends notifications to customer when offer is made
 * @param {[string]} fcms user fcms
 */
export const newOrderOfferNotification = async (args: any) => {
  const { fcms, type, order } = args;
  const title = "New Order Offer";
  const body = "There is a new offer for your order.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
};

/**
 * @description sends notifications to chucker when offer is accepted
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const OrderOfferAcceptedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Offer Accepted";
  const body = "Your request for order is accepted.";

  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    user: chucker,
    customer,
    order,
  });
};

/**
 * @description sends notifications to customer started order
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const orderStartedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Started";
  const body = "Chucker has started your order.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    chucker,
    user: customer,
    order,
  });
};

/**
 * @description sends notifications to customer on chucker moving
 * @param {[string]} fcms user fcms
 */
export const chuckerStaredMovingNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Chucker Started Moving";
  const body = "Chucker has started moving towards your location.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    chucker,
    user: customer,
    order,
  });
};

/**
 * @description sends notifications to customer on chucker reaching
 * @param {[string]} fcms user fcms
 */
export const chuckerReachedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Chucker Reached";
  const body = "Chucker has reached your location.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    chucker,
    user: customer,
    order,
  });
};

/**
 * @description sends notifications to chucker when work is rejected
 * @param {[string]} fcms user fcms
 */
export const orderWorkRejectedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Work Rejected";
  const body = "Your order work has been rejected by customer.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends notifications to chucker when work is accepted
 * @param {[string]} fcms user fcms
 */
export const orderWorkAcceptedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Work Accepted";
  const body = "Your order work has been accepted by customer.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends notifications to customer on pre work submission
 * @param {[string]} fcms user fcms
 */
export const orderPreWorkSubmittedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Pre Work Submitted";
  const body = "Your before work order pictures have been submitted by chucker.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    chucker,
    user: customer,
    order,
  });
};
/**
 * @description sends notifications to customer on work submission
 * @param {[string]} fcms user fcms
 */
export const orderWorkSubmittedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Work Submitted";
  const body = "Your order work has been submitted by chucker.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    chucker,
    user: customer,
    order,
  });
};

/**
 * @description sends notifications to chucker completed order
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const orderCompletedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Completed";
  const body = "Customer has completed your order.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends notifications to chucker cancelled order
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const orderCancelledNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Cancelled";
  const body = "Order has been cancelled.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends notifications to customer extra charges requested
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const extraChargesRequestedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Extra Charges Request";
  const body = "Chucker has requested extra charges.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    chucker,
    user: customer,
    order,
  });
};

/**
 * @description sends notifications to chucker extra charges approved
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const extraChargesApprovedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Extra Charges Approved";
  const body = "Customer has approved extra charges.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends notifications to chucker extra charges rejected
 * @param {[string]} fcms user fcms
 * @param {string} chucker id of chucker
 * @param {string} order id of order
 * @param {string} customer id of customer
 */
export const extraChargesRejectedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Extra Charges Rejected";
  const body = "Customer has rejected extra charges.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });

  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends notifications to chucker on review submission
 * @param {[string]} fcms user fcms
 */
export const orderReviewSubmittedNotification = async (args: any) => {
  const { fcms, chucker, customer, order, type } = args;
  const title = "Order Review Submitted";
  const body = "Order review has been submitted by customer.";
  await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type, order: order.toString() },
  });
  await notificationsModel.create({
    type,
    text: body,
    customer,
    user: chucker,
    order,
  });
};

/**
 * @description sends custom notifications
 * @param {[string]} fcms user fcms
 */
export const customNotification = async (args: any) => {
  const { fcms, title, body } = args;

  return await new FirebaseManager().notify({
    fcms,
    title,
    body,
    data: { type: CUSTOM },
  });
};
