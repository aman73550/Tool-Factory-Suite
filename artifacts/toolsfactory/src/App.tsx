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
import GenerateTool from "@/pages/admin/GenerateTool";
import TrendingTools from "@/pages/admin/TrendingTools";
import AdsManager from "@/pages/admin/AdsManager";
import Analytics from "@/pages/admin/Analytics";
import FeedbackManager from "@/pages/admin/FeedbackManager";
import Scanner from "@/pages/admin/Scanner";
import SEOManager from "@/pages/admin/SEOManager";
import Settings from "@/pages/admin/Settings";

import NotFound from "@/pages/not-found";
import { Layout } from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

function About() {
  return (
    <Layout>
      <div className="container py-20 max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-6">About ToolsFactory</h1>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            ToolsFactory is a comprehensive suite of free online tools designed for developers, creators, and professionals. Every tool runs entirely in your browser — meaning your data never leaves your device.
          </p>
          <h2>Our Mission</h2>
          <p>We believe great tools should be free, fast, and private. We're building the largest collection of client-side utilities so anyone can get work done without uploading their data to a server.</p>
          <h2>Features</h2>
          <ul>
            <li>20+ professional-grade tools and growing</li>
            <li>100% client-side — your data stays on your device</li>
            <li>No account required, no sign-up, no paywall</li>
            <li>Mobile-friendly and responsive</li>
            <li>Fast, accurate results every time</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

function Privacy() {
  return (
    <Layout>
      <div className="container py-20 max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-6">Privacy Policy</h1>
        <div className="prose dark:prose-invert max-w-none text-muted-foreground">
          <p><strong className="text-foreground">Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <h2>Data Collection</h2>
          <p>ToolsFactory does not collect any personal data. All tool processing happens entirely in your browser (client-side). Your files, text, and inputs are never sent to our servers.</p>
          <h2>Analytics</h2>
          <p>We collect anonymous, aggregated usage data such as page views and tool usage counts. This data contains no personally identifiable information.</p>
          <h2>Cookies</h2>
          <p>We do not use tracking cookies. We may use a session cookie only for admin panel access, which is automatically cleared when you log out or close your browser.</p>
          <h2>Third-Party Services</h2>
          <p>We may display advertisements served by third-party networks. These networks may use cookies per their own privacy policies.</p>
          <h2>Contact</h2>
          <p>Questions? Email us at <a href="mailto:hello@toolsfactory.com">hello@toolsfactory.com</a></p>
        </div>
      </div>
    </Layout>
  );
}

function Contact() {
  return (
    <Layout>
      <div className="container py-20 max-w-xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg mb-8">Have a question, suggestion, or want to request a new tool? We'd love to hear from you.</p>
        <div className="bg-card border rounded-2xl p-8 space-y-6">
          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-1">General Inquiries</div>
            <a href="mailto:hello@toolsfactory.com" className="text-primary font-medium hover:underline">hello@toolsfactory.com</a>
          </div>
          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-1">Advertising</div>
            <a href="mailto:ads@toolsfactory.com" className="text-primary font-medium hover:underline">ads@toolsfactory.com</a>
          </div>
          <div>
            <div className="text-sm font-semibold text-muted-foreground mb-1">Tool Requests</div>
            <p className="text-sm text-muted-foreground">Email us with your tool idea and we'll consider adding it to the platform.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/tools" component={ToolsDirectory} />
      <Route path="/tools/category/:category" component={CategoryPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />

      {/* Admin Routes — must come before /tools/:slug to avoid conflict */}
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/tools/new" component={GenerateTool} />
      <Route path="/admin/tools/:id/edit" component={ToolsManager} />
      <Route path="/admin/tools" component={ToolsManager} />
      <Route path="/admin/trending" component={TrendingTools} />
      <Route path="/admin/ads" component={AdsManager} />
      <Route path="/admin/analytics" component={Analytics} />
      <Route path="/admin/feedback" component={FeedbackManager} />
      <Route path="/admin/scanner" component={Scanner} />
      <Route path="/admin/seo" component={SEOManager} />
      <Route path="/admin/settings" component={Settings} />

      {/* Dynamic Tool Page — must be last to avoid swallowing admin routes */}
      <Route path="/tools/:slug" component={ToolPage} />

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
