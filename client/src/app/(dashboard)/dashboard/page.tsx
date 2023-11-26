import { useEffect, useState } from "react";
import z from "zod";
import clsx from "clsx";

import api from "@/lib/axios";
import dashboard_config from "@/config/dashboard";
import { TimeRange, TransactionCategory, TransactionType } from "@/types/enums";
import { currency, enumToOptions, date } from "@/lib/utils";

import Layout from "./layout";
import LineChart from "./components/overview";
import TransactionsCard from "./components/recent-transactions";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDateRangePicker } from "./components/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { RecentSales } from "./components/recent-sales"
// import { Search } from "./components/search"
// import TeamSwitcher from "./components/team-switcher"
import TransactionModal from "./modals/transaction";
import LineChartTransactions from "./components/line-chart";

const Cards = ({ data }: any) => {
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Function to toggle Add Cash modal
  const openAddCashModal = () => {
    setShowAddCashModal(true);
  };

  const openAddExpenseModal = () => {
    setShowAddExpenseModal(!showAddExpenseModal);
  };

  if (!data?.result) return null;

  const { total_income, total_expense, total_balance } = data.result;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="group/item hover:border-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <svg
            xmlns="http:www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{currency(total_income)}</div>
          {/* <p className="text-xs text-muted-foreground">
            +20.1% from last month
          </p> */}
          <span
            onClick={openAddCashModal}
            className="group/edit inline-flex gap-1 invisible group-hover/item:visible font-medium mt-2 cursor-pointer items-center justify-center rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10"
          >
            Add Cash
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-plus transition duration-150 ease-out hover:ease-in pointer-none"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </span>
        </CardContent>
      </Card>
      <Card className="group/item hover:border-primary">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <svg
            xmlns="http:www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">-{currency(total_expense)}</div>
          {/* <p className="text-xs text-muted-foreground">+19% from last month</p> */}
          <span
            onClick={openAddExpenseModal}
            className="group/edit inline-flex gap-1 invisible group-hover/item:visible font-medium mt-2 cursor-pointer items-center justify-center rounded-md bg-gray-50 px-2 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-500/10"
          >
            Add Expense
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-plus transition duration-150 ease-out hover:ease-in pointer-none"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <svg
            xmlns="http:www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2h0V5z" />
            <path d="M2 9v1c0 1.1.9 2 2 2h1" />
            <path d="M16 11h0" />
          </svg>
        </CardHeader>
        <CardContent>
          <div
            className={clsx("text-2xl font-bold", {
              "text-red-500": total_balance < 0,
              // "text-green-400": total_balance > 0,
            })}
          >
            {total_balance > 0 && "+"}
            {currency(total_balance)}
          </div>
          {/* <p className="text-xs text-muted-foreground">
            +180.1% from last month
          </p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle
            className={clsx("text-sm font-medium", {
              // "text-green-400": total_balance > 0,
              "text-red-500": total_balance < 0,
            })}
          >
            Budget Status
          </CardTitle>
          <svg
            xmlns="http:www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke={total_balance < 0 ? "#ff6161" : "#4ade80"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div
            className={clsx("text-2xl font-bold", {
              "text-red-500": total_balance < 0,
              // "text-green-400": total_balance >= 0,
            })}
          >
            {total_balance >= 0
              ? "Within budget limits"
              : "Exceeded budget limits"}
          </div>
          {/* <p className="text-xs text-muted-foreground">+201 since last hour</p> */}
        </CardContent>
      </Card>
      {/* Add Icon */}
      <TransactionModal
        type={TransactionType.EXPENSE}
        // as="modal"
        modalState={showAddExpenseModal}
        setModalState={setShowAddExpenseModal}
      />
      <TransactionModal
        type={TransactionType.INCOME}
        modalState={showAddCashModal}
        setModalState={setShowAddCashModal}
      />
    </div>
  );
};

const OverviewTab = ({ data }: any) => {
  if (!data?.result?.transactions) {
    return null;
  }

  const transactions = data.result.transactions;

  return (
    <TabsContent value="overview" className="space-y-4">
      <Cards data={data} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <LineChart data={data} />
        <TransactionsCard data={data} max={6} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <LineChartTransactions transactions={transactions} />
      </div>
    </TabsContent>
  );
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(TimeRange.MONTHLY);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const { data } = await api("/transactions/overview", {
          params: {
            time_range: selectedTimeRange,
            limit: 20,
          },
        });

        setData(data);
      } catch (error) {
        console.error("Error fetching news data:", error);
      }
    };

    fetchNewsData();
  }, [selectedTimeRange]);

  return (
    <>
      {/* header */}
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Select
            onValueChange={(value) => setSelectedTimeRange(value)}
            value={selectedTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {enumToOptions(TimeRange).map(({ label, value }) => {
                return <SelectItem value={value}>{label}</SelectItem>;
              })}
            </SelectContent>
          </Select>
          {/* <CalendarDateRangePicker /> */}
          <Button>Download</Button>
        </div>
      </div>
      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Reports
          </TabsTrigger>
          <TabsTrigger value="notifications" disabled>
            Notifications
          </TabsTrigger>
        </TabsList>
        <OverviewTab data={data} />
        <TabsContent value="analytics" className="space-y-4">
          TODO
        </TabsContent>
      </Tabs>
    </>
  );
}
