export enum ENVIRONMENTS {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

export enum USER_TYPES {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  CHUCKER = "chucker",
}

export enum GEO_JSON_TYPES {
  POINT = "Point",
  LINESTRING = "LineString",
  POLYGON = "Polygon",
  MULTIPOINT = "MultiPoint",
  MULTILINESTRING = "MultiLineString",
  MULTIPOLYGON = "MultiPolygon",
}

export enum PAYMENT_ACCOUNT_TYPES {
  BRAINTREE = "braintree",
  STRIPE_CUSTOMER = "stripe_customer",
  STRIPE_ACCOUNT = "stripe_account",
}

export enum USER_STATUSES {
  ACTIVE = "active",
  DELETED = "deleted",
}

export enum CONVERSATION_STATUSES {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export enum MESSAGE_STATUSES {
  UNREAD = "unread",
  READ = "read",
  DELETED = "deleted",
}

export enum NOTIFICATION_STATUSES {
  UNREAD = "unread",
  READ = "read",
}

export enum SOCKET_EVENTS {
  NEW_MESSAGE_ = "new_message_",
  CONVERSATIONS_UPDATED = "conversations_updated",
}

export enum EXTRA_CHARGES_REQUEST_STATUS {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
}

export enum SERVICE_ORDER_STATUS {
  IN_PROGRESS = "in progress",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum SERVICE_ORDER_FEEDBACK {
  REJECTED = "rejected",
  APPROVED = "approved",
  AWAITING = "awaiting",
}

export enum SERVICE_REQUEST_STATUS {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum SERVICE_ORDER_OFFER {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export enum PROFILE_STATUS {
  BASIC_REGISTRATION = "basic-registeration",
  PROFILE_COMPLETION = "profile-completion",
  PHONE_VERIFICATION = "phone-verification",
  PICTURES_UPLOADING = "pictures-uploading",
  LOCATION_ADDITION = "location-addition",
  IDENTITY_VERIFICATION = "identity-verification",
  SERVICE_AREAS_SELECTION = "service-areas-selection",
  W9_FORM_FILLING = "w9-form-filling",
}

export enum NOTIFICATION_TYPES {
  NEW_MESSAGE = "new_message",
  NEW_ORDER_REQUEST = "new_order_request",
  NEW_ORDER_OFFER = "new_order_offer",
  ORDER_OFFER_ACCEPTED = "order_request_accepted",
  EXTRA_CHARGES_REQUEST_ACCEPTED = "extra_charges_request_rejected",
  EXTRA_CHARGES_REQUEST_REJECTED = "extra_charges_request_accepted",
  ORDER_STARTED = "order_started",
  CHUCKER_COMING = "chucker_coming",
  CHUCKER_REACHED = "chucker_reached",
  ORDER_WORK_SUBMITTED = "order_work_submitted",
  ORDER_FEEDBACK_SUBMITTED = "order_feedback_submitted",
  ORDER_CANCELLED = "order_cancelled",
  ORDER_REJECTED = "order_rejected",
}
