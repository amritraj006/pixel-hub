import React from 'react';
import { Upload, Heart, MessageCircle, Bell, Sparkles, Download, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Upload className="w-5 h-5 text-indigo-400" strokeWidth={1.5} />,
    title: "Upload & Share",
    description: "Publish your artwork in seconds — add a title, pick a category, and share it with the Pixel Hub community. Secured with Clerk authentication.",
    color: "from-indigo-400 to-violet-400",
    glowColor: "shadow-indigo-500/20"
  },
  {
    icon: <Heart className="w-5 h-5 text-rose-400" strokeWidth={1.5} />,
    title: "Like Posts",
    description: "Show appreciation for great artwork with real-time like counts. Every tap is synced instantly across all viewers.",
    color: "from-rose-400 to-pink-400",
    glowColor: "shadow-pink-500/20"
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-sky-400" strokeWidth={1.5} />,
    title: "Comment & Reply",
    description: "Drop a comment or reply in a thread. Full nested comment support keeps conversations organized and contextual.",
    color: "from-sky-400 to-cyan-400",
    glowColor: "shadow-sky-500/20"
  },
  {
    icon: <Bell className="w-5 h-5 text-amber-400" strokeWidth={1.5} />,
    title: "Real-Time Notifications",
    description: "Get instant Socket.IO-powered alerts whenever someone likes or comments on your post. Never miss a moment of engagement.",
    color: "from-amber-400 to-orange-400",
    glowColor: "shadow-orange-500/20"
  },
  {
    icon: <Sparkles className="w-5 h-5 text-purple-400" strokeWidth={1.5} />,
    title: "AI Image Generator",
    description: "Turn your imagination into visuals. Our built-in AI generator lets you create original images from a text prompt in seconds.",
    color: "from-fuchsia-400 to-purple-400",
    glowColor: "shadow-purple-500/20"
  },
  {
    icon: <Download className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />,
    title: "One-Click Download",
    description: "Download any image from the gallery instantly — no watermarks, no redirects. Works seamlessly on both desktop and mobile.",
    color: "from-emerald-400 to-teal-400",
    glowColor: "shadow-emerald-500/20"
  }
];

const FeaturesSection = () => {
  return (
    <section className="relative py-24 overflow-hidden border-t border-zinc-900/50">
      {/* Dark mode decorative background blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-[10%] w-[30%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
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
            className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800 mb-8"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-current mr-2" />
            <span className="text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              Premium Capabilities
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-6 tracking-tight">
            Elevate Your <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">Workflow</span>
          </h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-medium">
            Discover powerful tools and a vast library designed to inspire and accelerate your creative process.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group h-full"
            >
              <div className="h-full p-8 rounded-2xl bg-zinc-950/50 backdrop-blur-lg border border-zinc-800 shadow-lg transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group-hover:bg-zinc-900/80">
                {/* Glow effect that tracks behind the card */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.color} mix-blend-overlay`} style={{ opacity: 0.03 }} />
                
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg ${feature.glowColor}`}>
                    <div>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 tracking-tight">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed relative z-10">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;