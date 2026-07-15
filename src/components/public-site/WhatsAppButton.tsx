'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

import whatsapp_image from '../../assets/logo/whatsapp.png';
import Image from 'next/image';

export default function WhatsAppButton() {
  const { t } = useLanguage();

  const message = encodeURIComponent(t.whatsapp.defaultMessage);
  const whatsappUrl = `https://wa.me/${academyData.contact.whatsappNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      className=" fixed bottom-10 right-10   "
      aria-label="Chat on WhatsApp "
    >
      <div className='p-2 bg-green-400/40 shadow-xl shadow-green-300 hover:bg-green-400 rounded-full h-15 w-15 animate-pulse'><Image src={whatsapp_image} alt=''  className='rounded-full'/></div>
    </motion.a>
  );
}
