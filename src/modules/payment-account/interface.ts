// file imports
import { MongoID } from "../../configs/types";
import { PAYMENT_ACCOUNT_TYPES } from "../../configs/enum";

export interface Element {
  _id?: MongoID;
  type: PAYMENT_ACCOUNT_TYPES;
  user: MongoID;
  account?: object;
}
