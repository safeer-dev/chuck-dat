// file imports
import { EXTRA_CHARGES_REQUEST_STATUS } from "../../configs/enum";
import { MongoID } from "../../configs/types";

export interface Element {
  serviceOrder: any;
  amount: number;
  status?: EXTRA_CHARGES_REQUEST_STATUS;
}
