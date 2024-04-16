import { MongoID } from "../../configs/types";

export type GetElementsDTO = {
  customer?: MongoID;
  chucker?: any;
  limit: number;
  page: number;
  keyword?: string;
};
