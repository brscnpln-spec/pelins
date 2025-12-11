import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SleepRitualPage from "@/pages/SleepRitualPage";
import MonsterDetectorPage from "@/pages/MonsterDetectorPage";
import FamilyDashboardPage from "@/pages/FamilyDashboardPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SleepRitualPage} />
      <Route path="/monster" component={MonsterDetectorPage} />
      <Route path="/dashboard" component={FamilyDashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
