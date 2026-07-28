'use client';

import { motion } from 'framer-motion';
import { Award, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';
import Image from 'next/image';

export default function Leadership() {
  const { language, t } = useLanguage();
  const langKey = language as 'en' | 'ta';

  return (
    <section id="leadership" className="section bg-bg-light py-16">
      <div className="container mx-auto px-4">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: '-100px' }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-12"
        >
          <h2 className="section-heading text-3xl font-bold">{t.leadership.heading}</h2>
        </motion.div>

        {/* Leadership List */}
        <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {academyData.leadership.map((leader, index) => {
            const hasSpecialisations = 'specialisations' in leader;
            const tags = hasSpecialisations 
              ? leader.specialisations?.[langKey] 
              : ('roles' in leader ? leader.roles?.[langKey] : []);

            return (
              <motion.div 
                key={leader.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: '-50px' }} 
                transition={{ duration: 0.6, delay: index * 0.1 }} 
                className="card overflow-hidden bg-white shadow-md rounded-xl group"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start p-6 gap-6">
                  
                  {/* Left Side: Image Container */}
                  <div className="relative flex w-40 h-40 rounded  overflow-hidden shadow-lg border-2 border-purple-900">
                    {leader.experiece_in_number && (
                      <div className="absolute bottom-1 right-1 z-20">
                        <div className="flex items-center gap-1 rounded-full  bg-amber-500/40  px-2 py-0.5 shadow-xl shadow-amber-500 border border-amber-300">
                          <Award className="w-3 h-3 text-white" />
                          <span className="text-[10px] font-bold text-white whitespace-nowrap">
                            {leader.experiece_in_number}+ Yrs
                          </span>
                        </div>
                      </div>
                    )}
                    <Image 
                      src={leader.image} 
                      alt={leader.name} 
                      fill 
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Experience Badge */}
                   
                  </div>
                   

                  {/* Right Side: Content */}
                  <div className="flex-1 text-center md:text-left w-full">
                    <h3 className="font-bold text-xl text-text-primary mb-1 group-hover:text-primary transition-colors">
                      {leader.name}
                    </h3>
                    
                    <p className="text-primary font-semibold text-sm mb-0.5">
                      {leader.title[langKey]}
                    </p>
                    
                    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-3">
                      {leader.designation[langKey]}
                    </p>

                    {/* Qualifications & Experience Block */}
                    <div className="mb-3 space-y-1 text-sm text-text-secondary">
                      <p>
                        <span className="font-semibold text-text-primary">{t.leadership.qualifications}:</span>{' '}
                        {leader.qualifications}
                      </p>
                      {'experience' in leader && leader.experience && (
                        <p className="text-accent font-medium">
                          <span className="font-semibold text-text-primary">{t.leadership.experience}:</span>{' '}
                          {leader.experience[langKey]}
                        </p>
                      )}
                    </div>

                    {/* Profile Bio */}
                    <p className="text-xs text-text-secondary leading-relaxed mb-4 ">
                      {leader.profile[langKey]}
                    </p>

                    {/* Specialisations / Roles Tags */}
                    {tags && tags.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs font-semibold text-text-primary mb-2 uppercase tracking-wide flex items-center justify-center md:justify-start gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-accent" />
                          {hasSpecialisations ? t.leadership.specialisations : t.leadership.keyRoles}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                          {tags.map((item: string, idx: number) => (
                            <span key={idx} className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary font-medium rounded-full">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
