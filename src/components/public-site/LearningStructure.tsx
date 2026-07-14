'use client';

import { motion } from 'framer-motion';
import { Clock, MessageCircle, BookOpen, GraduationCap, Users, Mic, PenTool, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LearningStructure() {
  const { t } = useLanguage();

  const weekdayIcons = [MessageCircle, BookOpen, GraduationCap];
  const weekendIcons = [Users, BookOpen, Mic, PenTool, Star, Users];

  return (
    <section id="learning-structure" className="section bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.learningStructure.heading}</h2>
          <p className="section-description">{t.learningStructure.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Monday to Thursday */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="card p-8 border-2 border-primary/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {t.learningStructure.weekdays.label}
              </h3>
            </div>
            <div className="space-y-4">
              {t.learningStructure.weekdays.sessions.map((session, index) => {
                const Icon = weekdayIcons[index];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-bg-light rounded-xl"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-accent font-semibold mb-1">{session.time}</p>
                      <p className="font-medium text-text-primary">{session.activity}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Friday and Saturday */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="card p-8 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                {t.learningStructure.weekends.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {t.learningStructure.weekends.activities.map((activity, index) => {
                const Icon = weekendIcons[index % weekendIcons.length];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm"
                  >
                    <Icon className="w-4 h-4 text-accent flex-shrink-0" />
                    <span className="text-sm font-medium text-text-primary">{activity}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
