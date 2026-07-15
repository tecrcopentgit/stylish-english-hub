'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitch, { LanguageSwitchLight } from '@/components/ui/LanguageSwitch';
import { academyData } from '@/data/academyData';
import Image from 'next/image';
import stylish_english_academy_logo from '../../assets/stylish_english_hub.png';

export default function Navbar() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [ activeSection , setActiveSection ] = useState("#home")

  

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#programs', label: t.nav.programs },
    { href: '#learning-structure', label: t.nav.learningStructure },
    { href: '#leadership', label: t.nav.leadership },
    { href: '#teachers', label: t.nav.teachers },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#contact', label: t.nav.contact },
  ];

  // FIXED: Updated types to handle both normal clicks and select dropdown changes
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement> | React.ChangeEvent<HTMLSelectElement>,
    href: string
  ) => {
    e.preventDefault();
    setActiveSection(href);
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset; // FIXED: window.pageYOffset is deprecated, use window.scrollY
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="group flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center rounded-xl shadow-xl shadow-blue-400  group-hover:rotate-5 p-1 ${
                  isScrolled ? 'bg-primary' : 'bg-blue-400 '
                }`}
              >
                <Image
                  src={stylish_english_academy_logo}
                  className="rounded h-10 w-10 object-cover "
                  alt="Academy Logo" // Added alt tag for accessibility
                />
              </div>
              <div className="hidden sm:block">
                <p
                  className={`font-bold text-lg leading-tight group-hover:scale-105 ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                >
                  {academyData.name}
                </p>
              </div>
            </Link>

           <select
  // 1. Bind value to your active section state
  value={activeSection} 
  onChange={(e) => {
    const href = e.target.value;
    if (href) {
      scrollToSection(e, href);
      // 2. REMOVED: e.target.value = ""; (Let state handle the value)
    }
  }}
  className={`hidden sm:flex font-medium text-sm transition-colors rounded-md border p-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-accent ${
    isScrolled ? 'text-gray-700 border-gray-300' : 'text-white bg-gray-900/50 border-white/20'
  }`}
>
  {/* 3. REMOVED: Static "Navigate to..." placeholder option */}
  
  {navLinks.map((link) => (
    <option
      key={link.href}
      value={link.href}
      className={`rounded-full bg-blue-400/50 border font-bold border-red-600 p-2 ${
        isScrolled ? 'text-gray-700' : 'text-gray-900'
      }`}
    >
      {link.label}
    </option>
  ))}
</select>


            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                {isScrolled ? <LanguageSwitchLight /> : <LanguageSwitch />}
              </div>
              <a
                href="#enquiry"
                onClick={(e) => scrollToSection(e, '#enquiry')}
                className={`hidden sm:inline-flex items-center px-5 py-2.5 rounded-lg transition-all ${
                  isScrolled
                    ? 'bg-blue-800 text-white hover:bg-primary-light'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {t.nav.enquireNow}
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-20 z-40 bg-white shadow-xl lg:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <hr className="my-2" />
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-gray-600">Language</span>
                  <LanguageSwitchLight />
                </div>
                <a
                  href="#enquiry"
                  onClick={(e) => scrollToSection(e, '#enquiry')}
                  className="mt-2 py-3 px-4 bg-blue-700 text-white text-center font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {t.nav.enquireNow}
                </a>
                <Link
                  href="/staff-login"
                  className="py-3 px-4 text-gray-500 text-center text-sm hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t.nav.staffLogin}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
