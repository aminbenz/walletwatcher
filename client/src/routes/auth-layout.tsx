import { Outlet, Navigate } from "react-router-dom";
import useSWR from "swr";
import api from "@/lib/axios";

const fetcher = (url: string) => api(url).then((res) => res.data.result);

export default function AuthLayout() {
  const { data } = useSWR("/@me", fetcher);

  if (data?.id) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Outlet />
    </>
  );
}
