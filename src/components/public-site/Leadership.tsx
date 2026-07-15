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
              <div className="card h-full overflow-hidden group">
  {/* Image Layout Wrapper */}
  <div className={ `relative h-64 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden`}>
    <div className="absolute inset-0">
      <Image 
        src={leader.image}
        alt={leader.name}
        fill
        sizes={` (max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw `}
        className={ `group-hover:scale-105 transition-transform duration-300 bg-black`} 
      />
    </div>
    {/* Gradient Overlay on Hover */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    {/* Floating Badge (Repositioned into the image frame) */}
    <div className="absolute bottom-3 right-3 left-2 w-10 h-10  rounded-xl flex flex-row items-center justify-center shadow-lg m-2  z-10"> 
      <div className='flex flex-row bg-accent/70  rounded-xl p-2 border border-amber-400 shadow-xl shadow-amber-200 '>
         <Award className="w-5 h-5 text-accent" /> 
        {leader.experiece_in_number ? <div className="text-sm flex text-white font-bold"> 
          
          <span >{leader.experiece_in_number}</span><span>Years</span> 
        </div> : ''}
      </div>
      
     
      
    </div> 
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
          <span className="font-medium text-text-primary">{t.leadership.experience}:</span>{' '} 
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