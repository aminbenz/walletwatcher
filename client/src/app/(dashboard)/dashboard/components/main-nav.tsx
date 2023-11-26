import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Wallet2 } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
}

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  links: NavItem[];
}

const MainNav: React.FC<MainNavProps> = ({ links, className, ...props }) => {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <div className="flex gap-2">
        <Wallet2 />
        <span className="font-medium">WalletWatcher</span>
      </div>
      {links.map(({ title, href }: NavItem, index: number) => (
        <Link
          key={index}
          to={href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {title}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
