import { SERVICE_ORDER_STATUS } from "../../configs/enum";

export type GetElementsDTO = {
  limit: number;
  page: number;
  keyword?: string;
  chucker?: any;
};

export type GetOrdersDTO = {
  limit: number;
  page: number;
  status?: SERVICE_ORDER_STATUS;
  chucker: any;
  date?: any;
};

export type GetCustomerOrdersDTO = {
  limit: number;
  page: number;
  keyword?: SERVICE_ORDER_STATUS;
  customer: any;
};
