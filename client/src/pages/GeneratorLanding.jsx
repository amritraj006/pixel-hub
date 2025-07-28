import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Image } from 'lucide-react';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';

const GeneratorLanding = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  const handleTryGenerator = () => {
    if (isSignedIn) {
      navigate('/image-generator');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-white">
      {/* Navigation */}
     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Creativity
            </span>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Generate Stunning AI Art
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your ideas into breathtaking visuals with our advanced AI image generator.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            {isSignedIn ? (
              <motion.button
                onClick={handleTryGenerator}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
              >
                Try Generator Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            ) : (
              <SignInButton mode="modal" afterSignInUrl="/image-generator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                >
                  Sign In to Generate
                  <ArrowRight className="w-5 h-5 ml-2" />
                </motion.button>
              </SignInButton>
            )}
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Describe Your Vision</h3>
              <p className="text-gray-600">
                Enter a detailed text prompt describing the image you want to generate. The more specific you are, the better the results.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Generates Art</h3>
              <p className="text-gray-600">
                Our advanced AI processes your prompt and creates unique, high-quality images in seconds.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <ArrowRight className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Download & Share</h3>
              <p className="text-gray-600">
                Download your generated images in high resolution or share them directly with others.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Create Something Amazing?</h2>
            <p className="text-blue-100 mb-6 text-lg">
              Join thousands of creators using our AI image generator to bring their ideas to life.
            </p>
            {isSignedIn ? (
              <motion.button
                onClick={handleTryGenerator}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Generating Now
              </motion.button>
            ) : (
              <SignUpButton mode="modal" afterSignUpUrl="/image-generator">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started for Free
                </motion.button>
              </SignUpButton>
            )}
          </motion.div>
        </section>
      </main>

      {/* Footer would be imported here */}
    </div>
  );
};

export default GeneratorLanding;