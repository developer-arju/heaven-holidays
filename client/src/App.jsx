import { Routes, Route } from "react-router-dom";

/** Pages */
import HomePage from "./pages/HomePage";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import Packages from "./pages/Packages";
import ResortsAndHotels from "./pages/ResortsAndHotels";
import BookPackages from "./pages/BookPackages";
import Bookings from "./pages/Bookings";
import PackgeDetails from "./pages/PackgeDetails";
import SavedBooking from "./pages/SavedBooking";
import ContactPage from "./pages/ContactPage";
import ForgotPassword from "./pages/ForgotPassword";
import CreateNewPassword from "./pages/CreateNewPassword";

// provider
import ProviderAuth from "./pages/Provider/ProviderAuth";
import Register from "./pages/Provider/Register";
import ResetPassword from "./pages/Provider/ResetPassword";
import NewPassword from "./pages/Provider/NewPassword";
import ProviderDashboard from "./pages/Provider/Dashboard";
import ProviderPackages from "./pages/Provider/Packages";
import AddPackage from "./pages/Provider/AddPackage";
import ProviderProperties from "./pages/Provider/Properties";
import EditProperty from "./pages/Provider/EditProperty";
import AddProperty from "./pages/Provider/AddProperty";
import PriceOption from "./pages/Provider/PriceOption";
import EditPriceOption from "./pages/Provider/EditPriceOption";
import ProviderBussiness from "./pages/Provider/Bookings";

// admin
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminAuth from "./pages/Admin/Auth";
import ProviderList from "./pages/Admin/ProviderList";
import UsersList from "./pages/Admin/UsersList";
import AdminBookings from "./pages/Admin/Bookings";
import PackageListingAdmin from "./pages/Admin/Packages";
import Messages from "./pages/Admin/Messages";

/** Components */
import NotFound from "./components/NotFound";
import UserAuthenticated from "./components/UserAuthenticated";
import ProviderPrivateRoutes from "./components/Provider/PrivateRoutes";
import AdminPrivateRoutes from "./components/admin/PrivateRoutes";
import PersonalInfo from "./components/Provider/PersonalInfo";
import BussinessInfo from "./components/Provider/BussinessInfo";
import PrivateRoutes from "./components/PrivateRoutes";
import EditPackageBasicInfo from "./pages/Provider/EditPackageBasicInfo";
import ShowBookingDetails from "./pages/Provider/ShowBookingDetails";

function App({ socket }) {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/details/:packageId" element={<PackgeDetails />} />
        <Route path="properties" element={<ResortsAndHotels />} />
        <Route path="connect" element={<ContactPage socket={socket} />} />

        <Route element={<PrivateRoutes />}>
          <Route path="packages/book/:packageId" element={<BookPackages />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="saved" element={<SavedBooking />} />
        </Route>

        <Route element={<UserAuthenticated />}>
          <Route path="auth" element={<UserLogin />} />
          <Route path="register" element={<UserSignUp />} />
          <Route path="reset-password" element={<ForgotPassword />} />
          <Route path="reset/:id" element={<CreateNewPassword />} />
        </Route>
      </Route>

      {/* Provider Routes */}
      <Route path="/provider">
        <Route element={<ProviderPrivateRoutes socket={socket} />}>
          <Route index element={<ProviderDashboard />} />
          <Route path="packages" element={<ProviderPackages />} />
          <Route
            path="packages/edit/:packageId"
            element={<EditPackageBasicInfo />}
          />
          <Route path="packages/add" element={<AddPackage />} />
          <Route path="properties" element={<ProviderProperties />} />
          <Route path="properties/add" element={<AddProperty />} />
          <Route
            path="properties/add/price-options/:docId"
            element={<PriceOption />}
          />
          <Route path="properties/edit/:docId" element={<EditProperty />} />
          <Route
            path="properties/edit/price-options/:docId"
            element={<EditPriceOption />}
          />
          <Route path="bookings" element={<ProviderBussiness />} />
          <Route path="bookings/view/:id" element={<ShowBookingDetails />} />
        </Route>
        <Route path="auth" element={<ProviderAuth />} />
        <Route path="reset" element={<ResetPassword />} />
        <Route path="reset/:id" element={<NewPassword />} />
        <Route path="register" element={<Register />}>
          <Route index element={<PersonalInfo />} />
          <Route path="bussiness/:providerId" element={<BussinessInfo />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin">
        <Route element={<AdminPrivateRoutes socket={socket} />}>
          <Route index element={<AdminDashboard socket={socket} />} />
          <Route path="providers" element={<ProviderList />} />
          <Route path="users" element={<UsersList />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="packages" element={<PackageListingAdmin />} />
          <Route path="messages" element={<Messages socket={socket} />} />
        </Route>
        <Route path="auth" element={<AdminAuth />} />
      </Route>
      {/** Page Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
