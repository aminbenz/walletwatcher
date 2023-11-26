import { currency, date, ellipsis } from "@/lib/utils";

import { TransactionType } from "@/types/enums";
import CategoryIcon from "../../components/category-icon";
import moment from "moment";
import TransactionModal from "../../modals/transaction";

export default function Income({ transactions }: { data: any }) {
  if (!transactions) return null;

  const total_income = transactions.reduce(
    (total, { amount }) => total + amount,
    0
  );

  return (
    <>
      <div className="p-4 col-span-3 grid gap-4">
        <TransactionModal
          as="form"
          type="income"
          // title="Icome Details"
          // openText="Add Transaction"
        />
      </div>
      <div className="p-4 col-span-4 grid gap-2">
        <div className="space-y-8">
          <h2 className="text-xl font-bold tracking-tight">
            Total Income{" "}
            <span className=" text-green-400 font-medium">
              +{currency(total_income)}
            </span>
          </h2>
          {transactions.length > 0 ? (
            transactions.map(
              ({
                description,
                amount,
                category,
                date: d,
                type,
                created_at,
              }: any) => {
                const iso_date = date(d, "iso");
                return (
                  <div className="flex items-center">
                    <CategoryIcon category={category} />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {description
                          ? ellipsis(description, 50)
                          : type == TransactionType.INCOME
                          ? "(Add Cash)"
                          : "(Expense Made)"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({category}),{" "}
                        {moment(
                          iso_date == date(new Date(), "iso") ? created_at : d
                        ).fromNow()}
                      </p>
                    </div>
                    <div className="flex justify-center ml-auto gap-2">
                      <p
                        style={{
                          width: "80px",
                          textAlign: "end",
                        }}
                        className="text-sm text-green-400 font-medium"
                      >
                        {"+" + currency(amount)}
                      </p>
                      {/* <span>{iso_date}</span> */}
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <>
              <p className="grid h-fit place-items-center text-gray-500">
                (No Transactions)
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
