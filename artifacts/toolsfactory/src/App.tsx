import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Public Pages
import Home from "@/pages/public/Home";
import ToolsDirectory from "@/pages/public/ToolsDirectory";
import CategoryPage from "@/pages/public/CategoryPage";
import ToolPage from "@/pages/public/ToolPage";
import SearchPage from "@/pages/public/SearchPage";

// Admin Pages
import AdminLogin from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ToolsManager from "@/pages/admin/ToolsManager";
import AdsManager from "@/pages/admin/AdsManager";
import Analytics from "@/pages/admin/Analytics";
import FeedbackManager from "@/pages/admin/FeedbackManager";
import Scanner from "@/pages/admin/Scanner";
import Settings from "@/pages/admin/Settings";

import NotFound from "@/pages/not-found";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

// Simple placeholders for less critical pages to ensure completeness
function About() { return <Layout><div className="container py-20 prose max-w-3xl mx-auto"><h1 className="font-display">About ToolsFactory</h1><p>We build fast, free, client-side tools.</p></div></Layout>; }
function Privacy() { return <Layout><div className="container py-20 prose max-w-3xl mx-auto"><h1 className="font-display">Privacy Policy</h1><p>Your data stays on your device.</p></div></Layout>; }
function Contact() { return <Layout><div className="container py-20 max-w-xl mx-auto"><h1 className="text-4xl font-display font-bold mb-6">Contact Us</h1><p>Email us at hello@toolsfactory.com</p></div></Layout>; }

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/tools" component={ToolsDirectory} />
      <Route path="/tools/category/:category" component={CategoryPage} />
      <Route path="/tools/:slug" component={ToolPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/tools" component={ToolsManager} />
      <Route path="/admin/tools/:id/edit" component={ToolsManager} />
      <Route path="/admin/tools/new" component={ToolsManager} />
      <Route path="/admin/ads" component={AdsManager} />
      <Route path="/admin/analytics" component={Analytics} />
      <Route path="/admin/feedback" component={FeedbackManager} />
      <Route path="/admin/scanner" component={Scanner} />
      <Route path="/admin/settings" component={Settings} />
      
      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
