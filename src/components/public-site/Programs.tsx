'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  MessageCircle,
  Users,
  BookOpen,
  Book,
  Mic,
  PenTool,
  Star,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  MessageCircle,
  Users,
  BookOpen,
  Book,
  Mic,
  PenTool,
  Star,
};

export default function Programs() {
  const { language, t } = useLanguage();

  return (
    <section id="programs" className="section bg-bg-soft-blue">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.programs.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {academyData.programs.map((program, index) => {
            const Icon = iconMap[program.icon] || BookOpen;
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full p-6 border border-transparent hover:border-primary/20 bg-white">
                  <div className="w-14 h-14 mb-5 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-text-primary mb-3 group-hover:text-primary transition-colors">
                    {program.title[language]}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {program.description[language]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
