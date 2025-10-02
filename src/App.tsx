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


// Admin pages
import AdminLayout from "./layouts/AdminLayout";
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

// Business pages
import BusinessLayout from "./layouts/BusinessLayout";
import { BusinessHome } from "./pages/business/BusinessHome";
import { CalendarPage } from "./pages/business/Calendar";
import { ReservationsPage } from "./pages/business/Reservations";
import { PromotionsPage } from "./pages/business/Promotions";
import { InvoicePage } from "./pages/business/Invoice";
import { BusinessSettingsPage } from "./pages/business/Settings";
import { BusinessEventsPage } from "./pages/business/BusinessEvents";
import { GalleryPage } from "./pages/business/Gallery";


function App() {
  return (
    <>
      
        <Router>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-verification" element={<VerificationPage />} />
            <Route path="/password-reset" element={<PasswordResetPage />} />
            <Route path="/business" element={<BusinessLayout />}>
              <Route index element={<BusinessHome />} />
              <Route path="events" element={<BusinessEventsPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="reservations" element={<ReservationsPage />} />
              <Route path="promotions" element={<PromotionsPage />} />
              <Route path="invoices" element={<InvoicePage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="settings" element={<BusinessSettingsPage />} />
            </Route>
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
