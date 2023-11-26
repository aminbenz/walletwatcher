import { TransactionCategory } from "@/types/enums";
import z from "zod";

export const transactionSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Cash amount is required",
    })
    .min(1, "Cash amount must be a positive number")
    .max(999999, "Error MAX IS 999999"),
  category: z.nativeEnum(TransactionCategory, {
    required_error: "Please select a source",
  }),
  description: z
    .string({
      required_error: "Please add a description",
    })
    // .min(3, "Please enter more than 3 letters")
    .max(300)
    .nullable(),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date type: Date ust be iso format",
  }),
  type: z.string(),
});
