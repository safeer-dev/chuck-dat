import { MongoID } from "../../configs/types";

export interface Element {
  service: string;
  customer: MongoID;
  lotSize: string;
  subServices: string;
  location: any;
  image: string;
  notes: string;
}
