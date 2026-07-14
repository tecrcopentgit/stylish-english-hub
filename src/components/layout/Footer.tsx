'use client';

import Link from 'next/link';
import { GraduationCap, Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

export default function Footer() {
  const { language, t } = useLanguage();

  const quickLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#programs', label: t.nav.programs },
    { href: '#teachers', label: t.nav.teachers },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#contact', label: t.nav.contact },
  ];

  const programs = academyData.programs.slice(0, 6).map((p) => ({
    label: p.title[language],
  }));

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Academy Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{academyData.name}</h3>
                <p className="text-sm text-gray-400">{academyData.tagline[language]}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              {language === 'en'
                ? 'Empowering students through academic excellence, English fluency, communication skills, and confidence-building activities.'
                : 'பாட முன்னேற்றம், ஆங்கிலப் பேச்சுத் திறன், தொடர்புத் திறன் மற்றும் தன்னம்பிக்கை வளர்க்கும் செயல்பாடுகள் மூலம் மாணவர்களை மேம்படுத்துகிறோம்.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-accent">{t.footer.quickLinks}</h4>
            <h2></h2>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/staff-login"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {t.nav.staffLogin}
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-accent">{t.footer.ourPrograms}</h4>
            <ul className="space-y-2">
              {programs.map((program, index) => (
                <li key={index}>
                  <span className="text-gray-300 text-sm">{program.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-accent">{t.footer.contactInfo}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm">
                  {academyData.address.venue}
                  <br />
                  {academyData.address.location[language]}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href={academyData.contact.phoneLink}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {academyData.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href={academyData.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {academyData.contact.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                <a
                  href={academyData.contact.emailLink}
                  className="text-gray-300 hover:text-white transition-colors text-sm break-all"
                >
                  {academyData.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
                <a
                  href={academyData.contact.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {academyData.contact.instagram}
                </a>
              </li>
              <li className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-700">
                <Clock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <p className="font-medium text-white mb-1">{academyData.schedule.workingDays[language]}</p>
                  {academyData.schedule.shifts.map((shift) => (
                    <p key={shift.id}>{shift.time}</p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              {t.footer.copyright}
            </p>
            <p className="text-accent text-sm font-medium">
              {t.footer.tagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
