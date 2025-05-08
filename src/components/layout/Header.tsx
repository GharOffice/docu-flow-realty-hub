
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { isOpen, toggle } = useSidebar();
  const { user, signOut } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Get the first letter of the user's name or email for the avatar
  const getInitial = () => {
    if (!user) return "U";
    
    if (user.user_metadata?.name) {
      return user.user_metadata.name.charAt(0).toUpperCase();
    }
    
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  // Get the user's display name
  const getDisplayName = () => {
    if (!user) return "User";
    
    return user.user_metadata?.name || user.email?.split('@')[0] || "User";
  };

  return (
    <header
      className={cn(
        "h-16 fixed top-0 z-30 w-full bg-background border-b border-border flex items-center px-4 transition-all duration-300",
        isOpen ? "ml-64 lg:w-[calc(100%-16rem)]" : "ml-20 lg:w-[calc(100%-5rem)]"
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
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitial()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{getDisplayName()}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
