import {
  ArrowLeftRight,
  ShoppingBasket,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

export default {
  nav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    { title: "Help", href: "#" },
  ],

  sidebar: [
    {
      name: "Main",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard/",
          active: true,
        },
        {
          title: "Transactions",
          icon: ArrowLeftRight,
          href: "/dashboard/transactions",
        },
        {
          title: "Income",
          icon: Wallet,
          href: "/dashboard/income",
        },
        {
          title: "Expenses",
          icon: ShoppingBasket,
          href: "/dashboard/expenses",
        },
      ],
    },
    {
      name: "Settings",
      items: [
        {
          title: "Account",
          icon: "settings",
          href: "/dashboard/settings/account",
        },
        {
          title: "Appearance",
          icon: "appearance",
          href: "/dashboard/settings/appearance",
        },
      ],
    },
  ],
};
