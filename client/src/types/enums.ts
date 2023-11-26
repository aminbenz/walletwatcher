export enum ErrorCode {
  UserAlreadyExists,
  UserNotExists,
  WrongPassword,
  InvalidEmailFormat,
  AccountLocked,
  AccessDenied,
  TimeoutError,
  InvalidToken,
  DuplicateEntry,
  InvalidInput,
  ServerError,
  DatabaseError,
  NotFound,
  Unauthorized,
  ExpiredSession,
  InvalidRequest,
  PaymentRequired,
  InsufficientPermissions,
  NeedOtp,
  InvalidOTP,
  ToManyRequests,
  PasswordNeedIt,
  PasskeyNeedIt,
  Passwordless,
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export enum TransactionCategory {
  FOOD_DINING = "Food and Dining",
  TRANSPORTATION = "Transportation",
  HOUSING = "Housing",
  BILLS_UTILITIES = "Bills and Utilities",
  ENTERTAINMENT = "Entertainment",
  HEALTH_FITNESS = "Health and Fitness",
  SHOPPING = "Shopping",
  TRAVEL = "Travel",
  EDUCATION = "Education",
  INVESTMENT = "Investment",
  MISCELLANEOUS = "Miscellaneous",
  FREELANCING = "Freelancing",
  SALARY = "Salary",
  OTHER = "Other",
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum TimeRange {
  // DAILY = "day",
  // WEEKLY = "week",
  // LAST_7_DAYS = "last_7_days",
  // LAST_14_DAYS = "last_14_days",
  MONTHLY = "month",
  YEARLY = "year",
  // QUARTERLY = "quarter",
  // BI_WEEKLY = "bi_weekly",
  // FINANCIAL_YEAR = "financial_year",
  LIFETIME = "lifetime",
  // CUSTOM_DATE_RANGE = "custom",
}
