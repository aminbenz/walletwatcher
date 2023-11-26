import { currency, date } from "@/lib/utils";
import { Card, LineChart, Title } from "@tremor/react";
import { useEffect, useState } from "react";

const valueFormatter = (number: number) => currency(number);

export default function A({ transactions = [] }) {
  const [data, setData] = useState([]);

  const dataData = () => {
    const dayMonthFormat = Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
    });

    const gData = Object.groupBy(
      transactions.sort((a, b) => new Date(a.date) - new Date(b.date)),
      ({ date: d }) => dayMonthFormat.format(new Date(d))
    );

    const reduceddata = Object.entries(gData).map(([date, values]) => ({
      date: date,
      expense: values.reduce(
        (total, { amount, type }) =>
          type === "expense" ? total + amount : total,
        0
      ),
      income: values.reduce(
        (total, { amount, type }) =>
          type === "income" ? total + amount : total,
        0
      ),
    }));

    setData(reduceddata);
  };

  useEffect(() => {
    dataData();
  }, []);

  return (
    <Card className="col-span-4 mt-6 h-96">
      <Title>Comparison of Monthly Expense and Income Trends</Title>
      <LineChart
        data={data}
        index="date"
        categories={["income", "expense"]}
        colors={["emerald", "red"]}
        valueFormatter={valueFormatter}
      />
    </Card>
  );
}
