'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';
import Image from 'next/image';
import academy_logo from '../../assets/stylish_english_hub.png';
import whatsapp_logo from '../../assets/logo/whatsapp.png';

export default function Hero() {
  const { t } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden p-10"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat p-20"
        style={{
          backgroundImage: `url('${academyData.images.heroBackground}')`,
        }}
        data-aos='fade-in'
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight "
          >
            
            <span className=" text-5xl" data-aos='zoom-in'>STYLISH ENGLISH</span>
            <span className="block text-accent text-xl ">KNOWLEDGE HUB</span>
            <div className='flex  items-center justify-center '><Image className=' h-20 w-20 rounded-full shadow-xl shadow-blue-200' src = {academy_logo} alt = ''/></div>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t.hero.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <button
              onClick={() => scrollToSection('#programs')}
              className="btn btn-accent w-full sm:w-auto group"
            >
              {t.hero.explorePrograms}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToSection('#contact')}
              className="btn btn-white w-full sm:w-auto"
            >
              {t.hero.contactUs}
            </button>
          </motion.div>

          {/* Trust Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
          >
            <span className="text-sm sm:text-base text-white/90">
              {t.hero.trustMessage}
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1.5 h-3 bg-white/70 rounded-full" />
          </motion.div>
        </motion.div>
      </div>

      {/* Quick Contact Buttons (Mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3"
      >
        <a
          href={academyData.contact.phoneLink}
          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
          aria-label="Call us"
        >
          <Phone className="w-5 h-5" />
        </a>
        <a
          href={academyData.contact.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-all"
          aria-label="Chat on WhatsApp"
        >
          <Image src={whatsapp_logo} alt='' className='rounded-full hover:scale-105 hover:shadow-xl shadow-green-400'/>
        </a>
      </motion.div>
    </section>
  );
}
