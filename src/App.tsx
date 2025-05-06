
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Documents from "@/pages/Documents";
import Approvals from "@/pages/Approvals";
import DocumentView from "@/pages/DocumentView";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/documents/:id" element={<DocumentView />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
