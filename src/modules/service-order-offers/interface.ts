import { MongoID } from "../../configs/types";

export interface Element {
  serviceRequest: string;
  chucker: MongoID;
  customer: string;
  date: any;
}
