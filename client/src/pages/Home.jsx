import React, { useEffect } from 'react';
import MainBanner from '../components/MainBanner';
import Category from '../components/Category';
import FeaturesSection from '../components/FeaturesSection';
import PostComponent from '../components/PostComponent';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black flex flex-col items-center w-full min-h-screen">
      <div className="w-full">
        <MainBanner />
      </div>
      <div className="w-full max-w-[1920px] mx-auto">
        <FeaturesSection />
        <Category />
        <PostComponent />
      </div>
    </div>
  );
};

export default Home;