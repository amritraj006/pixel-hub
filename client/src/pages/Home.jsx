import React from 'react'
import MainBanner from '../components/MainBanner'
import Category from '../components/Category'
import FeaturesSection from '../components/FeaturesSection'
import PostComponent from '../components/PostComponent'

const Home = () => {
  return (
    <div>
        <MainBanner />
        <FeaturesSection />
        <Category />
        <PostComponent />
    </div>
  )
}

export default Home