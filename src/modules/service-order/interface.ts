import { EXTRA_CHARGES_REQUEST_STATUS, SERVICE_ORDER_STATUS } from "../../configs/enum";

export interface Element {
  service?: any;
  serviceRequest?: any;
  customer?: any;
  chucker?: any;
  subServices?: any;
  location?: any;
  extraChargesRequested?: any;
  extraChargesStatus?: any;
  totalPayment?: any;
  status?: any;
  mediaBeforeWork?: any;
  mediaAfterWork?: any;
}
