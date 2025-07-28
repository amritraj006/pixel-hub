import React from 'react';
import { Search, Heart, Download, Zap, Camera, Layers, Shield,  } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Search className="w-6 h-6" strokeWidth={1.5} />,
    title: "Smart Search",
    description: "AI-powered search finds perfect images in seconds with natural language queries",
    color: "from-blue-400 to-blue-600",
    iconBg: "bg-blue-100"
  },
  {
    icon: <Camera className="w-6 h-6" strokeWidth={1.5} />,
    title: "4K Quality",
    description: "Ultra HD resolution for stunning clarity in all your projects",
    color: "from-purple-400 to-purple-600",
    iconBg: "bg-purple-100"
  },
  {
    icon: <Heart className="w-6 h-6" strokeWidth={1.5} />,
    title: "Curated Collections",
    description: "Hand-selected by design experts for maximum visual impact",
    color: "from-rose-400 to-rose-600",
    iconBg: "bg-rose-100"
  },
  {
    icon: <Download className="w-6 h-6" strokeWidth={1.5} />,
    title: "One-Click Downloads",
    description: "Instant access to multiple sizes and formats with no watermarks",
    color: "from-emerald-400 to-emerald-600",
    iconBg: "bg-emerald-100"
  },
  {
    icon: <Layers className="w-6 h-6" strokeWidth={1.5} />,
    title: "10M+ Assets",
    description: "Massive library with fresh content added daily",
    color: "from-amber-400 to-amber-600",
    iconBg: "bg-amber-100"
  },
  {
    icon: <Shield className="w-6 h-6" strokeWidth={1.5} />,
    title: "Safe & Legal",
    description: "All images are properly licensed for commercial use",
    color: "from-indigo-400 to-indigo-600",
    iconBg: "bg-indigo-100"
  }
];

const FeaturesSection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent z-10" />
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl opacity-30" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-rose-400 rounded-full filter blur-3xl opacity-20" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-24 z-20">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-white shadow-sm border border-gray-100 mb-6"
          >
            <Zap className="w-5 h-5 text-yellow-500 fill-current mr-2" />
            <span className="text-sm font-medium bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
              PREMIUM FEATURES
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
            Elevate Your <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Creative Workflow</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools designed to inspire and accelerate your creative process
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-transparent relative overflow-hidden">
                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                  <div className="absolute inset-0 rounded-2xl bg-white" />
                </div>
                
                <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  <span className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.title}
                  </span>
                </h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <div className="absolute bottom-6 left-8 w-8 h-px bg-gradient-to-r from-gray-200 to-transparent group-hover:from-indigo-400 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;