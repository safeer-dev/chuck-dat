import { MongoID } from "../../configs/types";

export type GetElementsDTO = {
  customer: MongoID;
  limit: number;
  page: number;
  keyword?: string;
};
