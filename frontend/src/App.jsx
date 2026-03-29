import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Booking = lazy(() => import("./pages/Booking"));
const Repair = lazy(() => import("./pages/Repair"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Checkout = lazy(() => import("./pages/Checkout"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const AIChat = lazy(() => import("./components/AIChat"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-black text-lg">W</div>
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
}

function Layout() {
  const loc = useLocation();
  const noNav = ["/login", "/register"].includes(loc.pathname);
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Navbar />
      <main className={noNav ? "" : "pt-16"}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/booking/:productId" element={<Booking />} />
            <Route path="/repair" element={<Repair />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track/:id" element={<TrackOrder />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}><AIChat /></Suspense>
      <Toaster position="bottom-left" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
