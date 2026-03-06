import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CommissionerDashboard from "./pages/CommissionerDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import ContractDetail from "./pages/ContractDetail";
import Court from "./pages/Court";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/commissioner" element={<CommissionerDashboard />} />
          <Route path="/artist" element={<ArtistDashboard />} />
          <Route path="/contract/:id" element={<ContractDetail />} />
          <Route path="/court" element={<Court />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;