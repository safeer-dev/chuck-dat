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

export enum NOTIFICATION_TYPES {
  NEW_MESSAGE = "new_message",
  CUSTOM = "custom",
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
