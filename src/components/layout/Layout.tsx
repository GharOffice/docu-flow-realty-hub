
import { Outlet } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const { isOpen } = useSidebar();

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar />
      <Header />
      <main
        className={cn(
          "pt-16 h-full overflow-y-auto transition-all duration-300",
          isOpen ? "ml-64" : "ml-20"
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
