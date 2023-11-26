import { Outlet, Navigate } from "react-router-dom";
import DashboardLayout from "@/app/(dashboard)/dashboard/layout";
import useSWR from "swr";
import api from "@/lib/axios";

const fetcher = (url: string) => api(url).then((res) => res.data.result);

export default function Root() {
  const { data, isLoading } = useSWR("/@me", fetcher);

  if (isLoading) return <div>loading...</div>;

  if (!data?.id) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </>
  );
}
