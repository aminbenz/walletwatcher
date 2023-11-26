import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * A constant representing the fallback value as 'N/A'.
 */
export const FALLBACK = "N/A";

/**
 * A constant representing the locale as undefined (auto locale), "ar", "fr", "en-US", etc.
 */
export const LOCALE = localStorage.getItem("language") || undefined;
export const CURRENCY = localStorage.getItem("currency") || "USD";
export const maxFractionDigits =
  Number(localStorage.getItem("maxFractionDigits")) || 0;
/**
 * Combines CSS classes using clsx and tailwind-merge.
 * @param inputs - An array of CSS class values.
 * @returns The combined CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a currency amount.
 * @param amount - The amount to format.
 * @returns The formatted currency as a string.
 */
export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

/**
 * Formats a currency amount.
 * @param amount - The amount to format.
 * @returns The formatted currency as a string.
 */
export const currency = (
  amount: number,
  currency = CURRENCY,
  locale = LOCALE
) => {
  return amount.toLocaleString(locale, {
    style: "currency",
    currency: currency,
    maximumFractionDigits: maxFractionDigits,
  });
};

/**
 * Converts a Date or string to an ISO date format.
 * @param date - The Date or string to convert to ISO format.
 * @returns The ISO date as a string.
 */
export const iso_date = (date: Date | string) => {
  return new Date(date).toISOString().split("T")[0];
};

/**
 * Formats a date based on the specified options.
 * @param date - The Date or string to format.
 * @param type - The type of formatting: 'date', 'datetime', or 'iso'.
 * @param size - The size of the date format: 'short', 'medium', 'long', or 'full'.
 * @param locale - The locale for formatting.
 * @returns The formatted date as a string.
 */
export const date = (
  date: string | Date,
  type: "date" | "datetime" | "iso" = "date",
  size: "short" | "medium" | "long" | "full" = "long",
  locale: string | undefined = LOCALE
) => {
  const options: Intl.DateTimeFormatOptions = { dateStyle: size };

  if (type === "iso") return new Date(date).toISOString().split("T")[0];
  if (type === "datetime") options.timeStyle = "short";

  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
};

/**
 * Generates a pagination array for the current page and total pages.
 * @param currentPage - The current page number.
 * @param totalPages - The total number of pages.
 * @returns An array representing the pagination.
 */
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

/**
 * Generates metadata for pagination.
 * @param current_page - The current page number.
 * @param items_per_page - The number of items per page.
 * @param total_items - The total number of items.
 * @returns Metadata for pagination.
 */
export const generate_meta = (
  current_page: number,
  items_per_page: number,
  total_items: number
) => {
  const skip = (current_page - 1) * items_per_page;
  const total_pages = Math.ceil(total_items / items_per_page);
  const prev_page = current_page > 1 ? current_page - 1 : null;
  const next_page = current_page < total_pages ? current_page + 1 : null;
  const is_last_page = current_page === total_pages;
  const is_first_page = current_page === 1;
  const first_page = 1;
  const last_page = total_pages;

  const pagination = generatePagination(current_page, total_pages);

  return {
    prev_page,
    current_page,
    next_page,
    total_items,
    items_per_page,
    skip,
    first_page,
    last_page,
    is_first_page,
    is_last_page,
    total_pages,
    pagination,
  };
};

/**
 * Options for the retrieve function.
 */

/**
 * Delays execution for a specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified delay.
 */
export const sleep = (ms: number = 3000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Formats a title with capitalization and replaces underscores with spaces.
 * @param input - The input string to format.
 * @param base - The base length to determine if the title should be capitalized.
 * @param fallback - The fallback value if the input is empty.
 * @returns The formatted title with underscores replaced by spaces.
 */
export const title = (input: string, maxLength = 30, fallback = FALLBACK) => {
  if (!input) return fallback;
  return ellipsis(
    input
      .toLowerCase()
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    maxLength
  );
};

/**
 * Opens the default email application or a web-based email service based on the user's email address.
 * @param email - The user's email address.
 * @param platform - The platform for opening the email (e.g., 'web' or 'sys').
 */
export function open_email(email: string, platform: "web" | "sys" = "sys") {
  if (platform === "sys") {
    return (window.location.href = "mailto:");
  }
  const domain = email.split("@")[1];
  if (!domain) return alert("Please provide an email address");
  if (domain === "gmail.com") {
    window.open("https://mail.google.com/mail", "_blank");
  } else if (domain === "yahoo.com") {
    window.open("https://mail.yahoo.com", "_blank");
  } else if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com"
  ) {
    window.open("https://outlook.live.com/mail/0/inbox", "_blank");
  } else {
    window.open("https://" + domain, "_blank");
  }
}

/**
 * Generates a date range based on the number of days.
 * @param days - The number of days for the date range (default is 30 days).
 * @returns An object with 'from' and 'to' date values.
 */
export const date_range = (days = 30) => {
  const currentDate = new Date();
  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - days);

  return {
    from: prevDate,
    to: currentDate,
  };
};

/**
 * Shortens a string and appends an ellipsis (...) if it exceeds the specified maximum length.
 * @param text - The input string to shorten.
 * @param maxLength - The maximum length of the string before applying ellipsis.
 * @returns The shortened string with an ellipsis if necessary.
 */
export function ellipsis(text: string, maxLength: number = 40): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
}

export const list = (items: string[]) => {
  return new Intl.ListFormat().format(items);
};

export const word = (input: string, base: number = 3, fallback = FALLBACK) => {
  if (!input) return fallback;
  return input.length <= base
    ? input
    : input
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const enumToOptions = (Enum: any) => {
  const options = [];

  for (const key in Enum) {
    if (Object.prototype.hasOwnProperty.call(Enum, key)) {
      const enumValue = Enum[key as keyof typeof Enum];
      if (typeof enumValue !== "string" && typeof enumValue !== "number") {
        continue; // Skipping non-string or non-number enum values
      }
      options.push({
        label: word(key),
        value: enumValue,
      });
    }
  }

  return options;
};
