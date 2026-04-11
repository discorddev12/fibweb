import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AgentProvider } from "@/hooks/use-agent";
import Index from "./pages/Index";
import About from "./pages/About";
import ChainOfCommand from "./pages/ChainOfCommand";
import Media from "./pages/Media";
import Join from "./pages/Join";
import Database from "./pages/Database";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AgentProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/chain-of-command" element={<ChainOfCommand />} />
          <Route path="/media" element={<Media />} />
          <Route path="/join" element={<Join />} />
          <Route path="/database" element={<Database />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AgentProvider>
  </QueryClientProvider>
);

export default App;
