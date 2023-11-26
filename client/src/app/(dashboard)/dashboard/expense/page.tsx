import Layout from "../layout";
import api from "@/lib/axios";
import useSWR from "swr";
import IncomeCard from "./components/income";

const fetcher = (url: string) => api(url).then((res) => res.data);

const Transactions = () => {
  const { data, error, isLoading } = useSWR(
    "/transactions?type=expense",
    fetcher
  );

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Expense Page</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* <LineChart data={data} max={5} /> */}
        <IncomeCard transactions={data.result} />
      </div>
    </>
  );
};

export default Transactions;
