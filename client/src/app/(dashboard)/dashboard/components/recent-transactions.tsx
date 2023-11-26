import { currency, date, ellipsis } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { TransactionType } from "@/types/enums";
import CategoryIcon from "./category-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import moment from "moment";
import TransactionModal from "../modals/transaction";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RecentTransactions({
  data,
  max,
}: {
  data: any;
  max: number;
}) {
  if (!data?.result?.transactions) return null;

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>{data.message}</CardDescription>
          </div>
          <div className="flex gap-2">
            <TransactionModal
              title="Transaction Details"
              openText="Add Transaction"
            />
            <Link to="/dashboard/transactions">
              <Button>View All</Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.result.transactions.length > 0 ? (
            data.result.transactions
              .slice(0, max)
              .map(
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
                        <Badge
                          variant={type == "income" ? "green" : "destructive"}
                        >
                          {type}
                        </Badge>
                        <p
                          style={{
                            width: "80px",
                            textAlign: "end",
                          }}
                          className={clsx("text-sm font-medium", {
                            "text-red-500": type == "expense",
                            "text-green-400": type == "income",
                          })}
                        >
                          {type == "income" ? "+" : "-"}
                          {currency(amount)}
                        </p>
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
      </CardContent>
    </Card>
  );
}
