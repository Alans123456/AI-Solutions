import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./components/PublicLayout";
import { AdminLayout } from "./components/AdminLayout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Projects } from "./pages/Projects";
import { Testimonials } from "./pages/Testimonials";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Gallery } from "./pages/Gallery";
import { Events } from "./pages/Events";
import { EventDetail } from "./pages/EventDetail";
import { Careers } from "./pages/Careers";
import { Contact } from "./pages/Contact";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminInquiries } from "./pages/admin/AdminInquiries";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminServices } from "./pages/admin/AdminServices";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminApplications } from "./pages/admin/AdminApplications";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Navigate to="/login" replace />} />

            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="projects" element={<Projects />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<BlogPost />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="careers" element={<Careers />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
