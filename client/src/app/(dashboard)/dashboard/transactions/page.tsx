import { columns } from "./components/table/body/columns";
import { DataTable } from "./components/table/body/table";
import Layout from "../layout";
import api from "@/lib/axios";
import useSWR from "swr";

const fetcher = (url: string) => api(url).then((res) => res.data);

const Transactions = () => {
  const { data, error, isLoading } = useSWR("/transactions", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Transaction Management
        </h1>
      </div>
      <div className="grid gap-10">
        <DataTable columns={columns} data={data?.result} />
      </div>
    </>
  );
};

export default Transactions;
