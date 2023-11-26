import { Navigate, Outlet } from "react-router-dom";
import cookies from "js-cookie";

export default function PRoute() {
  const isAuthenticated = cookies.get("session");
  console.log(
    "🚀 ~ file: protected-route.tsx:6 ~ PRoute ~ isAuthenticated:",
    isAuthenticated
  );

  //   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
