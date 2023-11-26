import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  links: {
    name: string;
    items: {
      title: string;
      icon?: string;
      href?: string;
      active?: boolean;
    }[];
  }[];
}

export default function Sidebar({ className, links }: SidebarProps) {
  return (
    <aside className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {links.map(({ name, items }) => {
          return (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {name}
              </h2>
              <div className="grid gap-1">
                {items.map(({ title, icon: Icon, href }) => {
                  return (
                    <NavLink to={href} end>
                      {({ isActive }) => {
                        return (
                          <Button
                            variant={(isActive && "secondary") || "ghost"}
                            className="w-full justify-start"
                          >
                            <Icon strokeWidth={2} size={20} />
                            {title}
                          </Button>
                        );
                      }}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
