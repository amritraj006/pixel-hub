import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SubCategoryPage from "./pages/SubCategoryPage";
import AllImages from "./pages/AllImages";
import ImageDetails from "./pages/ImageDetails";
import Liked from "./pages/Liked";
import Footer from "./components/Footer";
import AllCategory from "./pages/AllCategory";
import { Toaster } from 'sonner';
import UploadForm from "./pages/UploadFrom";
import Post from "./pages/users/Post";
import UserProfilePosts from "./components/users/UserProfilePosts";
import Dashboard from "./pages/users/Dashboard";
import ImageGenerator from "./pages/ImageGenerator";
import GeneratorLanding from "./pages/GeneratorLanding";




const App = () => {
  const location = useLocation();
  const isImgGenRoute = location.pathname === '/image-generator';
  return (
    <div>
      <Toaster richColors position="top-center" />

      {!isImgGenRoute && <Navbar />}
      <div className="pt-16 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:subcategory" element={<SubCategoryPage />} />
          <Route path="/all-images" element={<AllImages />} />
          <Route path="/category/:category/:title" element={<ImageDetails />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/all-categories" element={<AllCategory />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/post" element={<Post />} />
          <Route path='/l' element={<UserProfilePosts />} />
          <Route path="/my-dashboard" element={<Dashboard />} />
          <Route path="/generator" element={<GeneratorLanding />} />
        </Routes>

      </div>
      <div className="top-0 absolute w-full">
      <Routes>
        <Route path="/image-generator" element={<ImageGenerator />} />
      </Routes>
      </div>
      {!isImgGenRoute &&  <Footer />}
    </div>
  );
};

export default App;
