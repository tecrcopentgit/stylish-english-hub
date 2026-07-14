'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { academyData } from '@/data/academyData';

// Placeholder images until real ones are uploaded
const placeholderImages = [
  { id: '1', category: 'classroom', caption: { en: 'Classroom Learning Session', ta: 'வகுப்பறைப் பயிற்சி' } },
  { id: '2', category: 'spoken-english', caption: { en: 'Spoken English Practice', ta: 'பேச்சு ஆங்கிலப் பயிற்சி' } },
  { id: '3', category: 'reading', caption: { en: 'Reading Activity', ta: 'வாசிப்புச் செயல்பாடு' } },
  { id: '4', category: 'public-speaking', caption: { en: 'Public Speaking Session', ta: 'மேடைப் பேச்சுப் பயிற்சி' } },
  { id: '5', category: 'presentations', caption: { en: 'Student Presentation', ta: 'மாணவர் விளக்கவுரை' } },
  { id: '6', category: 'events', caption: { en: 'Academy Event', ta: 'அகாடமி நிகழ்வு' } },
];

export default function Gallery() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Use actual gallery images if available, otherwise use placeholders
  const images = academyData.galleryImages.length > 0 
    ? academyData.galleryImages 
    : placeholderImages;

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1);
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <section id="gallery" className="section bg-bg-soft-blue">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="section-heading">{t.gallery.heading}</h2>
          <p className="section-description">{t.gallery.description}</p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {academyData.galleryCategories.slice(0, 5).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-text-secondary hover:bg-gray-100'
              }`}
            >
              {category[language]}
            </button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="gallery-item"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
              aria-label={`View ${image.caption[language]}`}
            >
              {/* Placeholder for image */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-primary/40 mb-2" />
                <p className="text-sm text-primary/60 text-center px-4">{image.caption[language]}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-secondary">No images in this category yet.</p>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lightbox"
              onClick={closeLightbox}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="dialog"
              aria-label="Image lightbox"
            >
              <button
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
                onClick={closeLightbox}
                aria-label={t.gallery.close}
              >
                <X className="w-6 h-6" />
              </button>

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div
                className="max-w-4xl max-h-[80vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Placeholder for lightbox image */}
                <div className="w-full h-96 bg-gradient-to-br from-primary/30 to-primary/20 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-24 h-24 text-white/50" />
                </div>
                <p className="mt-4 text-white text-center">
                  {filteredImages[lightboxIndex]?.caption[language]}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
