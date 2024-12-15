import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingLayout from "./layouts/LandingLayout";
import RegisterUser from "./pages/Register";
import LoginUser from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import CategoryPage from "./pages/user/PersonalKategori";
import HomeLayout from "./layouts/HomeLayout";
import HomePage from "./pages/user/HomePage";
import DestinationDetail from "./pages/user/DetailDestinasi";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import OverviewPage from "./pages/admin/OverviewPage";
import UserPage from "./pages/admin/UserPage";
import RoutePage from "./pages/admin/RoutePage";
import ContentPage from "./pages/admin/ContentPage";
import DestinationPage from "./pages/admin/DestinationPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import DetailDestination from "./pages/admin/DetailDestination";
import AddDestinationPage from "./pages/admin/AddDestinationPage";
import AddContentPage from "./pages/admin/AddContentPage";
import DetailContentPage from "./pages/admin/DetailContentPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Routes untuk Landing Layout */}
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>
          {/* Routes untuk Home Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/home" element={<HomeLayout />}>
              <Route index element={<HomePage />} />
              <Route path=":id" element={<DestinationDetail />} />
            </Route>
          </Route>
          {/* Routes untuk Admin Layout */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/dashboard/user" element={<UserPage />} />
            <Route path="/dashboard/user/detail/:id" element={<UserDetailPage />} />
            <Route path="/dashboard/destination" element={<DestinationPage />} />
            <Route
              path="/dashboard/destination/destination-details/:id"
              element={<DetailDestination />}
            />
            <Route
              path="/dashboard/destination/add-destination"
              element={<AddDestinationPage />}
            />
            <Route path="/dashboard/content" element={<ContentPage />} />
            <Route
              path="/dashboard/content/content-details/:id"
              element={<DetailContentPage />}
            />
            <Route
              path="/dashboard/content/add-content"
              element={<AddContentPage />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
