import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import UserProtectedRoute from "./routes/UserProtectedRoute";

// Public pages
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/User/Login.jsx";
import Register from "./pages/User/Register";
import About from "./pages/About.jsx";

import PetCareTips from "./pages/PetCareTips.jsx";
import PetTipDetails from "./pages/PetTipDetails";
import AllPet from "./pages/Pets/AllPet";
import PetDetail from "./pages/Pets/PetDetail";

import Product from "./pages/Products/Product.jsx";
import ProductDetail from "./pages/Products/ProductDetail.jsx";

// Protected pages
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Cart/Checkout.jsx";
import OrderSuccess from "./pages/Cart/OrderSuccess.jsx";

import ShowInterest from "./pages/User/ShowInterest";
import SubmitPet from "./pages/User/SubmitPet";
import MyPets from "./pages/User/MyPets";
import AddMyPet from "./pages/User/AddMyPet";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard.jsx";

import BoardingBooking from "./pages/User/BoardingBooking.jsx";
import BoardingDetails from "./pages/User/BoardingDetails.jsx";
import MyBoardingBookings from "./pages/User/MyBoardingBookings.jsx";

import Services from "./pages/Services/Services.jsx";
import ServiceDetails from "./pages/Services/ServiceDetails.jsx";
import BookService from "./pages/Services/BookService";

import PetHealth from "./pages/Pets/PetHealth";
import PaymentSuccess from "./pages/User/PaymentSuccess.jsx";
import Profile from "./pages/User/Profile.jsx";

import AdoptionDetails from "./pages/User/AdoptionDetails.jsx";
import BookingDetails from "./pages/User/BookingDetails.jsx";

import CarePack from "./pages/User/CarePack.jsx";

function App() {
  function NotFound() {
    return <h2>404 - Page Not Found</h2>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/petcaretips" element={<PetCareTips />} />
        <Route path="/pet-tip/:id" element={<PetTipDetails />} />

        <Route path="/allpet" element={<AllPet />} />
        <Route path="/petdetails/:id" element={<PetDetail />} />

        <Route path="/product" element={<Product />} />
        <Route path="/productdetails/:id" element={<ProductDetail />} />

        <Route path="/services" element={<Services />} />
        <Route path="/service/:id" element={<ServiceDetails />} />

        <Route path="/care-pack/:petId" element={<CarePack />} />

        <Route path="/adoption-details/:id" element={<AdoptionDetails />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          element={
            <UserProtectedRoute>
              <Outlet />
            </UserProtectedRoute>
          }
        >
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />

          <Route path="/showinterest/:id" element={<ShowInterest />} />

          <Route path="/submitpet" element={<SubmitPet />} />
          <Route path="/mypets" element={<MyPets />} />
          <Route path="/add-my-pet" element={<AddMyPet />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/notifications" element={<Notifications />} />

          <Route path="/petboarding" element={<BoardingBooking />} />
          <Route path="/mypetboarding" element={<MyBoardingBookings />} />
          <Route path="/boarding/:id" element={<BoardingDetails />} />

          <Route path="/bookservice/:id" element={<BookService />} />

          <Route path="/pet-health/:petId" element={<PetHealth />} />

          <Route path="/paymentsuccess" element={<PaymentSuccess />} />

          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
