'use client';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/public-site/Hero';
import About from '@/components/public-site/About';
import WhyChooseUs from '@/components/public-site/WhyChooseUs';
import Programs from '@/components/public-site/Programs';
import LearningStructure from '@/components/public-site/LearningStructure';
import Leadership from '@/components/public-site/Leadership';
import Teachers from '@/components/public-site/Teachers';
import Gallery from '@/components/public-site/Gallery';
import Contact from '@/components/public-site/Contact';
import EnquiryForm from '@/components/public-site/EnquiryForm';
import WhatsAppButton from '@/components/public-site/WhatsAppButton';

import { useEffect } from 'react'; 
import AOS from 'aos';
import 'aos/dist/aos.css';



export default function HomePage() {
   useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);
  return (
    <main className="min-h-screen   " >
      <Navbar />
      <Hero />
      <About />
      <WhyChooseUs />
      <Programs />
      <LearningStructure />
      <Leadership />
      <Teachers />
      <Gallery />
      <Contact />
      <EnquiryForm />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
