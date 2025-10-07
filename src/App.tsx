import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { VerificationPage } from "./pages/auth/Verification";
import { PasswordResetPage } from "./pages/auth/PasswordReset";
import { ToastProvider } from "./components/ui/toast-provider";
// import "./App.css"

// // Pages
// import Home from "./pages/Home"
// import About from "./pages/About"
// import Contact from "./pages/Contact"
// import Login from "./pages/Login"

// // Dashboards
// import BusinessLayout from "./dashboards/business/BusinessLayout"
import AdminLayout from "./layouts/AdminLayout";
import BusinessLayout from "./layouts/BusinessLayout";
import { DashboardHome } from "./pages/admin/DashboardHome";
import { BusinessesPage } from "./pages/admin/Businesses";
import { CampaignsPage } from "./pages/admin/Campaigns";
import { EventsPage } from "./pages/admin/Events";
import { HotAndColdPage } from "./pages/admin/HotAndCold";
import { ModerationPage } from "./pages/admin/Moderation";
import { RevenuePage } from "./pages/admin/Revenue";
import { SettingsPage } from "./pages/admin/Settings";
import { SupportPage } from "./pages/admin/Support";
import { UsersManagementPage } from "./pages/admin/UsersManagement";
import { BusinessProfilePage } from "./pages/admin/BusinessProfile";
import BusinessPageLayout from "./layouts/BusinessPageLayout";
import UserManagementPageLayout from "./layouts/UserManagementPageLayout";
import { CreateUserPage } from "./pages/admin/CreateUser";
import EventsPageLayout from "./layouts/EventsPageLayout";
import { EditUserPage } from "./pages/admin/EditUser";
import { EventDetailsPage } from "./pages/admin/EventDetails";

// // Business pages
// import BusinessHome from "./dashboards/business/BusinessHome"
// import BusinessSettings from "./dashboards/business/BusinessSettings"

// // Admin pages
// import AdminHome from "./dashboards/admin/AdminHome"
// import AdminUsers from "./dashboards/admin/AdminUsers"

function App() {
  return (
    <>
      
        <Router>
          <Routes>
            Public routes
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-verification" element={<VerificationPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            Business Dashboard with nested routes
            <Route path="/business" element={<BusinessLayout />}>
              {/* <Route index element={<BusinessHome />} /> */}
              {/* <Route path="settings" element={<BusinessSettings />} /> */}
            </Route>
            Admin Dashboard with nested routes
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="businesses" element={<BusinessPageLayout />}>
                <Route index element={<BusinessesPage />} />
                <Route path="profile" element={<BusinessProfilePage />} />
              </Route>
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="events" element={<EventsPageLayout />}>
              <Route index element={<EventsPage />}/>
              <Route path="event-details" element={<EventDetailsPage />}/>
              </Route>
              <Route path="hot-and-cold" element={<HotAndColdPage />} />
              <Route path="moderation" element={<ModerationPage />} />
              <Route path="revenue" element={<RevenuePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="users-management" element={<UserManagementPageLayout />}>
                <Route index element={<UsersManagementPage />} />
                <Route path="create-user" element={<CreateUserPage />} />
                <Route path="edit-user" element={<EditUserPage />} />
              </Route>
            </Route>
            {/* <Route path="*" element={<h1>Page Not Found</h1>} /> */}
          </Routes>
        </Router>
      <ToastProvider />
    </>
  );
}

export default App;
