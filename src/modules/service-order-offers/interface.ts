import { SERVICE_ORDER_OFFER } from "../../configs/enum";
import { MongoID } from "../../configs/types";

export interface Element {
  serviceRequest: string;
  chucker: MongoID;
  customer: string;
  date: any;
  status?: SERVICE_ORDER_OFFER;
}
