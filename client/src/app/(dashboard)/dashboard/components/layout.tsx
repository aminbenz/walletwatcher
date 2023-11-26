import { UserNav } from "../components/user-nav";
import Sidebar from "../components/sidebar";
import MainNav from "../components/main-nav";
import { Search } from "./search";

interface NavItem {
  title: string;
  href: string;
}

interface DashboardPageProps {
  sidebar: {
    name: string;
    items: {
      title: string;
      icon?: string;
      href?: string;
      active?: boolean;
    }[];
  }[];
  nav: NavItem[];
  children: React.ReactNode;
}

export default function DashboardPage({
  children,
  nav,
  sidebar,
}: DashboardPageProps) {
  return (
    <>
      <div className="">
        <div id="nav" className="flex h-16 items-center px-4">
          <MainNav className="mx-6" links={nav} />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav />
          </div>
        </div>
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar links={sidebar} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="px-4 py-6 lg:px-8 grid gap-4">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
