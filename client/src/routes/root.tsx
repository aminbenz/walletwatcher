import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import UserDashboard from "@/app/(dashboard)/dashboard/page.tsx";
import Transactions from "@/app/(dashboard)/dashboard/transactions/page.tsx";
import Income from "@/app/(dashboard)/dashboard/income/page.tsx";
import Expenses from "@/app/(dashboard)/dashboard/expense/page.tsx";
import { Toaster as ReactToaster } from "react-hot-toast";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SettingsAccountPage from "@/app/(dashboard)/dashboard/settings/account/page.tsx";
import SettingsAppearancePage from "@/app/(dashboard)/dashboard/settings/appearance/page.tsx";
import RegisterPage from "@/app/(auth)/register/page.tsx";
import LoginPage from "@/app/(auth)/login/page.tsx";
import Home from "@/app/(marketing)/page.tsx";
import UserDashboardRoute from "./dashboard-layout.tsx";
import AuthLayout from "./auth-layout";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "dashboard",
    element: <UserDashboardRoute />,
    children: [
      {
        path: "",
        element: <UserDashboard />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "income",
        element: <Income />,
      },
      {
        path: "expenses",
        element: <Expenses />,
      },
      {
        path: "settings/account",
        element: <SettingsAccountPage />,
      },
      {
        path: "settings/appearance",
        element: <SettingsAppearancePage />,
      },
      // {
      //   element: <AuthLayout />,
      //   children: [
      //     {
      //       path: "register",
      //       element: <RegisterPage />,
      //     },
      //     {
      //       path: "login",
      //       element: <LoginPage />,
      //     },
      //   ],
      // },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     // element: <AuthLayout />,
//     children: [
//       {
//         path: "/register",
//         element: <RegisterPage />,
//       },
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//     ],
//   },
//   {
//     path: "/dashboard",
//     element: (
//       <PRoute>
//         <UserDashboard />
//       </PRoute>
//     ),
//   },
//   {
//     path: "/dashboard/transactions",
//     element: <Transactions />,
//   },
//   {
//     path: "/dashboard/income",
//     element: <Income />,
//   },
//   {
//     path: "/dashboard/expenses",
//     element: <Expenses />,
//   },
//   {
//     path: "/dashboard/settings/account",
//     element: <SettingsAccountPage />,
//   },
//   {
//     path: "/dashboard/settings/appearance",
//     element: <SettingsAppearancePage />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <ReactToaster />
        <div className="hidden signature">
          WalletWatcher - Created by aminbenz
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
