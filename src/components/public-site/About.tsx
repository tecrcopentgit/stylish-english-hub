'use client';

import { motion } from 'framer-motion';
import { GraduationCap, MessageCircle, Users, BookOpen, Mic, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  { key: 'academic', icon: GraduationCap },
  { key: 'spokenEnglish', icon: MessageCircle },
  { key: 'communication', icon: Users },
  { key: 'reading', icon: BookOpen },
  { key: 'publicSpeaking', icon: Mic },
  { key: 'confidence', icon: Star },
];

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section bg-bg-light">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.about.heading}</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              {t.about.description}
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              {t.about.descriptionLine2}
            </p>
          </div>
        </motion.div>

        {/* Learning Philosophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto mb-16"
        >
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-center text-white">
            <p className="text-sm uppercase tracking-wider mb-2 opacity-90">
              {t.about.philosophyLabel}
            </p>
            <p className="text-2xl font-bold">{t.about.philosophy}</p>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const featureKey = feature.key as keyof typeof t.about.features;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold text-sm text-text-primary leading-tight">
                  {t.about.features[featureKey]}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
