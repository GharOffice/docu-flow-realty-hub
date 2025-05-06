
import { useState } from "react";
import { useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Menu,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { isOpen, toggle } = useSidebar();
  const [searchValue, setSearchValue] = useState("");

  return (
    <header
      className={cn(
        "h-16 fixed top-0 z-30 w-full bg-background border-b border-border flex items-center px-4 transition-all duration-300",
        isOpen ? "ml-64" : "ml-20"
      )}
    >
      <div className="flex items-center lg:hidden">
        <Button variant="ghost" size="icon" onClick={toggle}>
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex-1 px-2 md:px-4">
        <div className="relative max-w-md">
          <Search 
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" 
          />
          <Input 
            placeholder="Search documents..." 
            className="pl-8 bg-background" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="font-medium">Document approval request</div>
                <div className="text-sm text-muted-foreground">Property Purchase Agreement requires your review</div>
                <div className="text-xs text-muted-foreground">2 minutes ago</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="font-medium">Workflow completed</div>
                <div className="text-sm text-muted-foreground">Lease Agreement has been fully approved</div>
                <div className="text-xs text-muted-foreground">1 hour ago</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <div className="font-medium">Comment from Michael Scott</div>
                <div className="text-sm text-muted-foreground">Please review section 3.2 of the contract</div>
                <div className="text-xs text-muted-foreground">Yesterday</div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center cursor-pointer text-primary">View all notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
