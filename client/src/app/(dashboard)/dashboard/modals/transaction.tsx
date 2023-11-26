import { enumToOptions, date } from "@/lib/utils";
import { transactionSchema } from "@/lib/schema";
import { TransactionCategory, TransactionType } from "@/types/enums";
import Modal from "@/components/modal";

interface ITransaction {
  title?: string;
  type?: TransactionType | "transaction";
}

export default function TransactionModal({
  title,
  type = "transaction",
  ...rest
}: ITransaction) {
  const fields = [
    {
      name: "amount",
      label: "Amount",
      type: "number",
      min: 0,
      // step: 100,
      placeholder: "$ Enter amount",
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      max: date(new Date(new Date().getFullYear() + 2, 0, 1), "iso"),
      description: "The date when the transaction made",
    },
    {
      name: "category",
      label: "Source or Category",
      type: "select",
      placeholder: "Please select a category",
      options: enumToOptions(TransactionCategory),
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      min: 0,
      max: 300,
      placeholder: "Add a brief description (max 300 characters)",
    },
  ];

  if (type == "transaction") {
    const newObj = {
      name: "type",
      type: "radio",
      layout: "row",
      label: "Type",
      options: [
        {
          label: "Income",
          value: "income",
        },
        {
          label: "Expense",
          value: "expense",
        },
      ],
    };

    fields.unshift(newObj);
  }

  const defaultValues = {
    description: "",
    date: date(new Date(), "iso"),
  };

  if (type !== "transaction") {
    defaultValues.type = type;
  }

  return (
    <>
      {/* Add Icon */}
      <Modal
        //   isOpen={showAddCashModal}
        title={title || `Add ${type}`}
        endpoint="/transactions/"
        fields={fields}
        schema={transactionSchema}
        defaultValues={defaultValues}
        {...rest}
      />
    </>
  );
}
