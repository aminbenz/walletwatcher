import dashboard_config from "@/config/dashboard";
import LayoutCreator from "./components/layout";

export default function Layout({ children }) {
  return (
    <>
      <LayoutCreator
        nav={dashboard_config.nav}
        sidebar={dashboard_config.sidebar}
      >
        {children}
      </LayoutCreator>
    </>
  );
}
