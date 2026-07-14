'use client';

import { motion } from 'framer-motion';
import { Award, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

import Image from 'next/image';

export default function Leadership() {
  const { language, t } = useLanguage();

  return (
    <section id="leadership" className="section bg-bg-light">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.leadership.heading}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {academyData.leadership.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card overflow-hidden"
            >
              <div className="p-8">
                {/* Profile Image */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-50 h-50 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-accent shadow-xl hover:shadow-amber-400 hover:scale-104 hover:rotate-6 transition-all ease-in-out">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <Image
                          src = {leader.image}
                          alt={leader.name}
                          className="  rounded-full w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl  text-text-primary mb-1">{leader.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">
                      {leader.title[language]}
                    </p>
                    <p className="text-text-secondary text-sm">{leader.designation[language]}</p>
                  </div>
                </div>

                {/* Qualifications */}
                <div className="mb-4 p-3 bg-bg-light rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <span className="font-semibold text-text-primary">{t.leadership.qualifications}:</span>{' '}
                    {leader.qualifications}
                  </p>
                  {'experience' in leader && leader.experience && (
                    <p className="text-sm text-text-secondary mt-1">
                      <span className="font-semibold text-text-primary">{t.leadership.experience}:</span>{' '}
                      {leader.experience[language]}
                    </p>
                  )}
                </div>

                {/* Profile */}
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  {leader.profile[language]}
                </p>

                {/* Specialisations / Roles */}
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-accent" />
                    {'specialisations' in leader ? t.leadership.specialisations : t.leadership.keyRoles}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {('specialisations' in leader && leader.specialisations ? leader.specialisations[language] : 'roles' in leader && leader.roles ? leader.roles[language] : [])?.map(
                      (item: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}