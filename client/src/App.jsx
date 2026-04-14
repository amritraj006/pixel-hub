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
import { SocketProvider } from "./context/SocketContext";
import Notifications from "./pages/Notifications";

const App = () => {
  const location = useLocation();
  const isImgGenRoute = location.pathname === '/image-generator';
  return (
    <SocketProvider>
      <div className="min-h-screen bg-black text-zinc-200 selection:bg-indigo-500/30">
        <Toaster richColors position="top-center" theme="dark" />

        {!isImgGenRoute && <Navbar />}
        <div className={isImgGenRoute ? "top-0 absolute w-full" : "pt-20 pb-16 min-h-[calc(100vh-100px)]"}>
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
            <Route path="/image-generator" element={<ImageGenerator />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </div>
        {!isImgGenRoute &&  <Footer />}
      </div>
    </SocketProvider>
  );
};

export default App;
