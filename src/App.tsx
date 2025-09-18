import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Login } from "./pages/auth/Login"
import { ForgotPassword } from "./pages/auth/ForgotPassword"
import { ResetPassword } from "./pages/auth/ResetPassword"
// import "./App.css"

// // Pages
// import Home from "./pages/Home"
// import About from "./pages/About"
// import Contact from "./pages/Contact"
// import Login from "./pages/Login"

// // Dashboards
// import BusinessLayout from "./dashboards/business/BusinessLayout"
// import AdminLayout from "./dashboards/admin/AdminLayout"

// // Business pages
// import BusinessHome from "./dashboards/business/BusinessHome"
// import BusinessSettings from "./dashboards/business/BusinessSettings"

// // Admin pages
// import AdminHome from "./dashboards/admin/AdminHome"
// import AdminUsers from "./dashboards/admin/AdminUsers"

function App() {
  return (
    <Router>
       <Routes>
         Public routes
         {/* <Route path="/" element={<Home />} /> */}
         {/* <Route path="/about" element={<About />} /> */}
         {/* <Route path="/contact" element={<Contact />} /> */}
         <Route path="/" element={<Navigate to="/login" replace />} />
         <Route path="/login" element={<Login />} />
         <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />

         Business Dashboard with nested routes
         {/* <Route path="/business" element={<BusinessLayout />}> */}
           {/* <Route index element={<BusinessHome />} /> */}
           {/* <Route path="settings" element={<BusinessSettings />} /> */}
         {/* </Route> */}

         Admin Dashboard with nested routes
         {/* <Route path="/admin" element={<AdminLayout />}> */}
           {/* <Route index element={<AdminHome />} /> */}
           {/* <Route path="users" element={<AdminUsers />} /> */}
         {/* </Route> */}

         404 fallback
         {/* <Route path="*" element={<h1>Page Not Found</h1>} /> */}
       </Routes>
    </Router>
  )
}

export default App
