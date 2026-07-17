'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';
import Image from 'next/image';

export default function Teachers() {
  const { language, t } = useLanguage();

  return (
    <section id="teachers" className="section bg-white py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: '-100px' }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-12"
        >
          <h2 className="section-heading text-3xl font-bold">{t.teachers.heading}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch justify-center">
          {academyData.teachers.map((teacher, index) => {
            // TypeScript safely reads the correct language string here
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
                className="w-full group"
              >
                <div className="card h-full overflow-hidden border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  {/* Image Layout Wrapper */}
                  <div className="relative flex items-center p-5  justify-center  bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                    <Image 
                      src={teacher.image} 
                      alt={teacherName || "Academy Teacher"} 
                     
                      className="group-hover:scale-105 w-50 h-50 border-2 border-blue-500 hover:shadow-xl shadow-blue-800 transition-transform rounded-full  duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-text-primary mb-2 group-hover:text-primary transition-colors">
                      {teacherName}
                    </h3>

                    {'qualification' in teacher && teacher.qualification && (
                      <p className="text-sm text-text-secondary mb-1">
                        <span className="font-medium">{t.teachers.qualification}:</span> {teacher.qualification}
                      </p>
                    )}

                    {'experience' in teacher && teacher.experience && (
                      <p className="text-sm text-accent font-medium mb-4">
                        {teacher.experience[language as 'en' | 'ta']}
                      </p>
                    )}

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-text-primary mb-1 uppercase tracking-wide">
                        {t.teachers.specialisations}
                      </p>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {teacher.specialisations[language as 'en' | 'ta']}
                      </p>
                    </div>

                    <div className="flex gap-3 items-start p-3 bg-slate-50 rounded-lg text-xs text-text-secondary leading-relaxed whitespace-normal break-words line-clamp-3">
                      <div className='w-1 h-12 bg-blue-600 rounded-xl shrink-0' />
                      <p>{teacher.profile[language as 'en' | 'ta']}</p>
                    </div>
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
