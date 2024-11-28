import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./screens/dashboard/Dashboard";
import SupporterManagement from "./screens/SupporterManagement";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLogin from "./screens/Login";
import Customers from "./screens/Customer";
import Brands from "./screens/brands";
import Plans from "./screens/plans";
import Cars from "./screens/cars";
import ServiceRequest from "./screens/serviceRequests";
import UpdateCars from "./screens/cars/UpdateCars";
import Garage from "./screens/garage";
import UpdateGarage from "./screens/garage/UpdateGarage";
import HomeBanner from "./screens/homeBanner";
import News from "./screens/news";
import FeaturedRequest from "./screens/featuresCreate";
import ContactUs from "./screens/contactUs";
import AdminUser from "./screens/adminUser";
import Faqs from "./screens/faqs";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Glossary from "./screens/glossary";
import SubCategory from "./screens/subCategory";
import AddProduct from "./screens/Customer/AddProduct";
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/garage" element={<Garage />} />
          <Route path="/update_garage/:id" element={<UpdateGarage />} />
          <Route path="/update_car/:id" element={<UpdateCars />} />
          <Route path="/service_request" element={<ServiceRequest />} />
          <Route path="/key_management" element={<SupporterManagement />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/category" element={<AdminUser />} />
          <Route path="/sub-categories" element={<SubCategory />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/home_banner" element={<HomeBanner />} />
          <Route path="/blogs" element={<News />} />
          <Route path="/glossary" element={<Glossary/>} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/featured_request" element={<FeaturedRequest />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
