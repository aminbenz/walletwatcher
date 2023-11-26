import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { BarChart, Title } from "@tremor/react";
import { currency } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Data = { category: string; amount: number };

interface IData {
  expense: Data[];
  income: Data[];
}

export default function Overview({ data: pData }: IData) {
  const [selectedType, setSelectedType] = useState("all");
  const [data, setData] = useState([]);

  const dataData = () => {
    const transactions = pData.result.transactions || [];
    const gData = Object.groupBy(transactions, ({ category }) => category);

    const reduceddata = Object.entries(gData).map(([category, values]) => ({
      name: category,
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

    setData(
      selectedType == "all"
        ? reduceddata
        : reduceddata.filter((item) => item[selectedType])
    );

    // return data_result.sort((a, b) => b.total - a.total);
  };

  useEffect(() => {
    dataData();
  }, [selectedType]);

  const valueFormatter = (number: number) => currency(number);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex gap-4 items-center justify-between w-full">
          <div className="grid gap-2">
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Visualization of {selectedType} by category in this{" "}
              {pData.meta.time_range}
            </CardDescription>
          </div>
          <Select
            onValueChange={(value) => setSelectedType(value)}
            value={selectedType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="all">All data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          className="col-span-4 mt-6 h-96"
          data={data}
          index="name"
          categories={
            selectedType == "all"
              ? ["income", "expense"]
              : selectedType == "income"
              ? ["income"]
              : ["expense"]
          }
          colors={
            selectedType == "all"
              ? ["teal", "red"]
              : selectedType == "income"
              ? ["teal"]
              : ["red"]
          }
          valueFormatter={valueFormatter}
        />
      </CardContent>
    </Card>
  );
}
