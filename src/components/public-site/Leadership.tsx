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

        <div className="grid md:grid-cols-1 gap-8 max-w-5xl mx-auto">
          {academyData.leadership.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="card overflow-hidden "
            >
              <div className="  h-full overflow-hidden group">
  {/* Image Layout Wrapper */}
{/* Image Layout Wrapper */}
<div className="relative h-72 bg-gradient-to-br from-primary to-primary/80 overflow-hidden">
  {/* Center Image */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="relative w-48 h-48">
      <Image
        src={leader.image}
        alt={leader.name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="rounded-full object-cover border-4 border-white shadow-xl transition-transform duration-300 group-hover:scale-105"
      />

      {/* Experience Badge */}
      {leader.experiece_in_number && (
        <div className="absolute -bottom-3 -right-3 z-10">
          <div className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 shadow-lg border-2 border-white">
            <Award className="w-4 h-4 text-white" />
            <span className="text-xs font-bold text-white whitespace-nowrap">
              {leader.experiece_in_number}+ Years
            </span>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
</div>

  {/* Content */}
  <div className="p-5">
    <h3 className="font-bold text-lg text-text-primary mb-1 group-hover:text-primary transition-colors">
      {leader.name}
    </h3>
    
    <p className="text-primary font-semibold text-sm mb-1"> 
      {leader.title[language as 'en' | 'ta']} 
    </p> 
    
    <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-3">
      {leader.designation[language as 'en' | 'ta']}
    </p>

    {/* Qualifications & Experience Block */}
    <div className="mb-4 space-y-1">
      <p className="text-sm text-text-secondary"> 
        <span className="font-medium text-text-primary">{t.leadership.qualifications}:</span>{' '} 
        {leader.qualifications} 
      </p> 
      {'experience' in leader && leader.experience && ( 
        <p className="text-sm text-accent font-medium"> 
          <span className="font-medium text-text-primary absolute">{t.leadership.experience}:</span>{' '} 
          {leader.experience[language as 'en' | 'ta']} 
        </p> 
      )} 
    </div>

    {/* Profile Bio with Line Clamp */} 
    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3"> 
      {leader.profile[language as 'en' | 'ta']} 
    </p> 

    {/* Specialisations / Roles Tags */} 
    <div> 
      <p className="text-xs font-semibold text-text-primary mb-2 uppercase tracking-wide flex items-center gap-1.5"> 
        <Briefcase className="w-3.5 h-3.5 text-accent" /> 
        {'specialisations' in leader ? t.leadership.specialisations : t.leadership.keyRoles} 
      </p> 
      <div className="flex flex-wrap gap-1.5"> 
        {('specialisations' in leader && leader.specialisations ? leader.specialisations[language as 'en' | 'ta'] : 'roles' in leader && leader.roles ? leader.roles[language as 'en' | 'ta'] : [])?.map( 
          (item: string, idx: number) => ( 
            <span key={idx} className="text-xs px-2.5 py-0.5 bg-primary/10 text-primary font-medium rounded-full" > 
              {item} 
            </span> 
          ) 
        )} 
      </div> 
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