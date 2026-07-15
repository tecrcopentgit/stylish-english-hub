'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';
import Image from 'next/image';

export default function Teachers() {
  const { language, t } = useLanguage();

  return (
    <section id="teachers" className="section bg-white">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.teachers.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {academyData.teachers.map((teacher, index) => {
            // FIXED: TypeScript safely reads the correct language string here
            const teacherName = typeof teacher.name === 'string' 
              ? teacher.name 
              : teacher.name[language as 'en' | 'ta'];
            
            return (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card h-full overflow-hidden">
                  {/* Image Layout Wrapper */}
                  {/* FIXED: Replaced standard text span with a clean Next.js layout container */}
                  <div className="relative h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                    <div className="absolute inset-0">
                      <Image 
                        src={teacher.image}
                        alt={teacherName || "Academy Teacher"} // FIXED: Uses the resolved string to fix TS(2322)
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className=" group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-text-primary mb-1 group-hover:text-primary transition-colors">
                      {teacherName}
                    </h3>
                    
                    {'qualification' in teacher && teacher.qualification && (
                      <p className="text-sm text-text-secondary mb-1">
                        <span className="font-medium">{t.teachers.qualification}:</span> {teacher.qualification}
                      </p>
                    )}
                    
                    {'experience' in teacher && teacher.experience && (
                      <p className="text-sm text-accent font-medium mb-3">
                        {teacher.experience[language as 'en' | 'ta']}
                      </p>
                    )}

                    <div className="mb-3">
                      <p className="text-xs font-semibold text-text-primary mb-1 uppercase tracking-wide">
                        {t.teachers.specialisations}
                      </p>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {teacher.specialisations[language as 'en' | 'ta']}
                      </p>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {teacher.profile[language as 'en' | 'ta']}
                    </p>
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
