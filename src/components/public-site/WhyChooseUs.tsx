'use client';

import { motion } from 'framer-motion';
import {
  Award,
  Lightbulb,
  Heart,
  Target,
  MessageSquare,
  Headphones,
  BookOpen,
  Sun,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

const iconMap: Record<string, React.ElementType> = {
  Award,
  Lightbulb,
  Heart,
  Target,
  MessageSquare,
  Headphones,
  BookOpen,
  Sun,
  TrendingUp,
  Sparkles,
};

export default function WhyChooseUs() {
  const { language, t } = useLanguage();

  return (
    <section id="why-choose-us" className="section bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.whyChooseUs.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {academyData.features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Award;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group"
              >
                <div className="card h-full p-6 text-center border border-gray-100 hover:border-primary/20">
                  <div className="w-12 h-12 mx-auto mb-4 bg-accent/10 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                    <Icon className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-text-primary text-sm leading-tight">
                    {feature[language]}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
