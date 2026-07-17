// ============================================================
// STYLISH ENGLISH ACADEMY - CENTRAL DATA FILE
// ============================================================
// Edit this file to update academy information across the website.
// All content changes should be made here for consistency.
// ============================================================

import kaja_sir from '../assets/kaja_sir.png';
import uvaish_photo from '../assets/uvaish_english.png';
import zulfia_photo from '../assets/zulfa_mam.jpeg';
import thasnim_photo from '../assets/thasnim_mam.jpeg';
import yahya_photo from '../assets/yahya.jpeg';

import classroom from '../assets/images/classroom.jpeg';

export const academyData = {
  // Academy Name (Do not translate)
  name: 'Stylish English Academy',
  logo:'' ,
  
  // Taglines
  tagline: {
    en: 'Stylish English Academy',
    ta: 'இன்று கற்போம், நாளை வழிநடத்துவோம்!',
  },
  secondaryTagline: {
    en: 'Learn English with Confidence. Communicate with Impact.',
    ta: 'தன்னம்பிக்கையுடன் ஆங்கிலம் கற்போம்; திறமையாகப் பேசுவோம்!',
  },
  learningPhilosophy: {
    en: 'Learning by Doing',
    ta: 'செய்து கற்றுக்கொள்வோம்',
  },
  brandPositioning: {
    en: 'Academic Excellence • English Fluency • Communication Skills • Student Development',
    ta: 'பாட முன்னேற்றம் • ஆங்கிலப் பேச்சுத் திறன் • தொடர்புத் திறன் • மாணவர் மேம்பாடு',
  },

  // Contact Information
  contact: {
    phone: '+91 95661 80862',
    phoneLink: 'tel:+919566180862',
    whatsapp: '+91 93615 74288',
    whatsappNumber: '919361574288',
    whatsappLink: 'https://wa.me/919361574288',
    email: 'stylishenglishacademy@gmail.com',
    emailLink: 'mailto:stylishenglishacademy@gmail.com',
    instagram: '@stylishenglishacademy',
    instagramLink: 'https://www.instagram.com/stylishenglishacademy/',
  },

  // Address
  address: {
    venue: 'T.M.J. Nursery & Primary School',
    fullSchoolName: 'Therku Mohideen Jamath School',
    location: {
      en: 'Melapalayam, Tirunelveli, Tamil Nadu',
      ta: 'மேலப்பாளையம், திருநெல்வேலி, தமிழ்நாடு',
    },
  },

  // Working Hours
  schedule: {
    workingDays: {
      en: 'Monday to Saturday',
      ta: 'திங்கள் முதல் சனி வரை',
    },
    shifts: [
      {
        id: 'shift1',
        time: '5:30 PM – 7:00 PM',
        label: {
          en: 'Shift 1: 5:30 PM – 7:00 PM',
          ta: 'முதல் நேர வகுப்பு: மாலை 5:30 முதல் 7:00 மணி வரை',
        },
      },
      {
        id: 'shift2',
        time: '7:00 PM – 8:30 PM',
        label: {
          en: 'Shift 2: 7:00 PM – 8:30 PM',
          ta: 'இரண்டாம் நேர வகுப்பு: மாலை 7:00 முதல் 8:30 மணி வரை',
        },
      },
    ],
  },

  // Images - Update these paths after uploading images
  images: {
    logo: ' /images/academy-logo.png ',
    heroBackground: ' /images/homepage-background.jpg ',
    founder: ' /images/kaja_sir.jpeg ' ,
    cofounder: ' /images/r-mohamed-uvaiz-cofounder.jpg ',
    teachers: {
      zulfaNisa: '/images/zulfa-nisa-teacher.png',
      jannathulThasnim: '/images/jannathul-thasnim-teacher.png',
      mathematicsTeacher: '/images/mathematics-teacher.png',
      mohamedYahya: '/images/mohamed-yahya-teacher.png',
    },
  },

  // Leadership Team
  leadership: [
    {
      id: 'founder',
      name: 'S.M. Khaja Mohideen',
      image: kaja_sir,
      title: {
        en: 'English Fluency Guide',
        ta: 'ஆங்கிலப் பேச்சுத் திறன் வழிகாட்டி',
      },
      designation: {
        en: 'Founder & Lead English Trainer',
        ta: 'நிறுவனர் மற்றும் முதன்மை ஆங்கிலப் பயிற்சியாளர்',
      },
      qualifications: 'M.Com., M.A. (English), PGDSE, B.Ed., D.A.T.',
      experiece_in_number: '15',
      experience: {
        en: '15+ Years',
        ta: '15 ஆண்டுகளுக்கும் மேலான கற்பித்தல் அனுபவம்',
      },
      profile: {
        en: 'S.M. Khaja Mohideen is an experienced English Fluency Guide with over 15 years of teaching experience. He helps students improve English fluency, grammar, pronunciation, vocabulary, and communication through simple and activity-based learning methods.',
        ta: 'S.M. Khaja Mohideen அவர்கள் 15 ஆண்டுகளுக்கும் மேலான கற்பித்தல் அனுபவம் கொண்ட ஆங்கிலப் பேச்சுத் திறன் வழிகாட்டி. எளிய விளக்கங்கள் மற்றும் செயல்முறைப் பயிற்சிகள் மூலம் மாணவர்களின் ஆங்கிலப் பேச்சு, இலக்கணம், உச்சரிப்பு, சொற்களஞ்சியம் மற்றும் தொடர்புத் திறனை மேம்படுத்த உதவுகிறார்.',
      },
      specialisations: {
        en: [
          'Spoken English and English Fluency',
          'English Grammar',
          'Phonetics Training',
          'Reading and Pronunciation',
          'Vocabulary Development',
          'Activity-Based English Learning',
        ],
        ta: [
          'பேச்சு ஆங்கிலம் மற்றும் ஆங்கில சரளத்திறன்',
          'ஆங்கில இலக்கணம்',
          'ஒலியியல் மற்றும் சரியான உச்சரிப்புப் பயிற்சி',
          'வாசிப்பு மற்றும் உச்சரிப்புப் பயிற்சி',
          'சொற்களஞ்சிய மேம்பாடு',
          'செயல்பாடுகள் மூலம் ஆங்கிலம் கற்றல்',
        ],
      },
    },
    {
      id: 'cofounder',
      name: 'R. Mohamed Uvaiz',
      image: uvaish_photo,
      title: {
        en: 'Co-Founder & Chief Student Coordinator',
        ta: 'இணை நிறுவனர் மற்றும் முதன்மை மாணவர் ஒருங்கிணைப்பாளர்',
      },
      designation: {
        en: 'Co-Founder & Chief Student Coordinator',
        ta: 'இணை நிறுவனர் மற்றும் முதன்மை மாணவர் ஒருங்கிணைப்பாளர்',
      },
      qualifications: 'B.Com., MBA ',
      profile: {
        en: 'R. Mohamed Uvaiz is the Co-Founder and Chief Student Coordinator of Stylish English Academy. He supports students through guidance, communication coaching, motivation, public speaking, personality development, and student engagement. He also contributes to the academy\'s digital growth through social media management and performance marketing.',
        ta: 'R. Mohamed Uvaiz அவர்கள் Stylish English Academy-யின் இணை நிறுவனர் மற்றும் முதன்மை மாணவர் ஒருங்கிணைப்பாளர். மாணவர்களுக்கு வழிகாட்டுதல், தொடர்புத் திறன் பயிற்சி, ஊக்கமளித்தல், மேடைப் பேச்சு மற்றும் ஆளுமைத் திறன் மேம்பாட்டில் ஆதரவு வழங்குகிறார். மேலும் சமூக ஊடக மேலாண்மை மற்றும் டிஜிட்டல் மார்க்கெட்டிங் மூலம் அகாடமியின் வளர்ச்சிக்கும் பங்களிக்கிறார்.',
      },
      roles: {

        en: [
          'Student Support and Guidance',
          'Communication Coach',
          'Public Speaker',
          'Motivational Speaker',
          'Personality Development Trainer',
          'Social Media Manager',
          'Performance Marketer',
          'Event Coordinator',
        ],

        ta: [
          'மாணவர் ஆதரவு மற்றும் வழிகாட்டுதல்',
          'தொடர்புத் திறன் பயிற்சியாளர்',
          'பொதுப் பேச்சாளர்',
          'ஊக்கமளிக்கும் பேச்சாளர்',
          'ஆளுமைத் திறன் பயிற்சியாளர்',
          'சமூக ஊடக மேலாளர்',
          'செயல்திறன் டிஜிட்டல் மார்க்கெட்டர்',
          'நிகழ்ச்சி ஒருங்கிணைப்பாளர்',
        ],

      },
    },
  ],

  // Teaching Team
  teachers: [
    {
      id: 'zulfa-nisa',
      name: 'Ms. Zulfa Nisa',
      image: zulfia_photo,
      qualification: 'M.Com.',
      experience: {
        en: '1 Year',
        ta: '1 ஆண்டு கற்பித்தல் அனுபவம்',
      },
      specialisations: {
        en: 'Social Science, Tamil, Tamil and English Handwriting Development, Reading Practice',
        ta: 'சமூக அறிவியல், தமிழ், தமிழ் மற்றும் ஆங்கிலக் கையெழுத்துப் பயிற்சி, வாசிப்புப் பயிற்சி',
      },
      profile: {
        en: 'Engaging Social Science tutor and dual-language educator specialising in Tamil literacy and English/Tamil handwriting development',
        ta: 'சமூக அறிவியல், தமிழ்மொழித் திறன் மற்றும் இருமொழி கையெழுத்துப் பயிற்சியில் சிறந்த வழிகாட்டி',
      },
    },
    {
      id: 'jannathul-thasnim',
      name: 'Ms. S. Jannathul Thasnim',
      image: thasnim_photo,
      qualification: 'BCA',
      experience: {
        en: '1 Year',
        ta: '1 ஆண்டு கற்பித்தல் அனுபவம்',
      },
      specialisations: {
        en: 'Elementary Mathematics, Fundamental Science, Tamil, Handwriting Development, Reading Practice',
        ta: 'அடிப்படை கணிதம், அறிவியல், தமிழ், கையெழுத்துப் பயிற்சி மற்றும் வாசிப்புப் பயிற்சி',
      },
      profile: {
        en: 'Primary educator simplifying Math and Science while fostering Tamil literacy and dual-language handwriting development',
        ta: 'ஆரம்பக் கல்வி கணிதம், அறிவியல் மற்றும் தமிழ்மொழித் திறன்களுடன் இருமொழி கையெழுத்துப் பயிற்சியிலும் சிறந்த வழிகாட்டி',
      },
    },
    {
      id: 'mathematics-teacher',
    
      name: {
        en: 'Mathematics Teacher',
        ta: 'கணித ஆசிரியர்',
      },
      image: thasnim_photo,
      specialisations: {
        en: 'Mathematics, Step-by-Step Problem Solving, Calculation Skills, Logical Thinking',
        ta: 'கணிதம், படிப்படியான கணக்குத் தீர்வு, கணக்கிடும் திறன் மற்றும் தர்க்க சிந்தனை',
      },
      profile: {
        en: 'Dedicated Mathematics educator simplifying complex concepts through step-by-step guidance and structured practice',
        ta: 'கணிதக் கருத்துகளை எளிய விளக்கங்கள், படிப் படியான வழிகாட்டுதல் மற்றும் தொடர் பயிற்சி மூலம் கற்பிக்கும் அர்ப்பணிப்புள்ள ஆசிரியர்',
      },
    },
    {
      id: 'mohamed-yahya',
      name: 'Mr. R. Mohamed Yahya',
      image: yahya_photo,
      qualification: 'B.A. English',
      specialisations: {
        en: 'English Teaching, English Explanation Through Tamil, Basic Grammar, Spoken English, Communication Skills, History Support',
        ta: 'ஆங்கிலப் பாடம், தமிழில் எளிய ஆங்கில விளக்கம், அடிப்படை இலக்கணம், பேச்சு ஆங்கிலம், தொடர்புத் திறன் மற்றும் வரலாற்றுப் பாட உதவி',
      },
      profile: {
        en: 'Bilingual educator simplifying English and History through Tamil while building grammar, speaking confidence, and academic clarity',
        ta: 'தமிழ் வழி எளிய விளக்கங்கள் மூலம் ஆங்கிலம் மற்றும் வரலாற்றைக் கற்பித்து, இலக்கணம், சரளமான பேச்சுத்திறனை வளர்க்கும் சிறந்த ஆசிரியர்',
      },
    },
  ],

  // Programs
  programs: [
    {
      id: 'academic-tuition',
      icon: 'GraduationCap',
      title: { en: 'Academic Tuition', ta: 'பாடப் பயிற்சி' },
      description: {
        en: 'Structured academic support that helps students understand lessons and improve their academic performance.',
        ta: 'பாடங்களை எளிதாகப் புரிந்துகொண்டு, படிப்பில் நல்ல முன்னேற்றம் பெற மாணவர்களுக்கு தேவையான வழிகாட்டுதல் வழங்கப்படும்.',
      },
    },
    {
      id: 'spoken-english',
      icon: 'MessageCircle',
      title: { en: 'Spoken English Training', ta: 'பேச்சு ஆங்கிலப் பயிற்சி' },
      description: {
        en: 'Practical speaking activities designed to improve English fluency, grammar, vocabulary, pronunciation, and confidence.',
        ta: 'ஆங்கிலத்தில் சரளமாகவும் தன்னம்பிக்கையுடனும் பேச, இலக்கணம், சொற்களஞ்சியம் மற்றும் உச்சரிப்புடன் கூடிய செயல்முறைப் பயிற்சிகள் வழங்கப்படும்.',
      },
    },
    {
      id: 'communication-skills',
      icon: 'Users',
      title: { en: 'Communication Skills', ta: 'தொடர்புத் திறன் பயிற்சி' },
      description: {
        en: 'Interactive activities that help students express their ideas clearly and confidently.',
        ta: 'மாணவர்கள் தங்கள் எண்ணங்களை தெளிவாகவும் தன்னம்பிக்கையுடனும் வெளிப்படுத்த உதவும் பயிற்சிகள் வழங்கப்படும்.',
      },
    },
    {
      id: 'homework-support',
      icon: 'BookOpen',
      title: { en: 'Homework Support', ta: 'வீட்டுப்பாட உதவி' },
      description: {
        en: 'Guided support that helps students complete homework and understand challenging lessons.',
        ta: 'வீட்டுப்பாடங்களை சரியாக முடிக்கவும், கடினமான பாடங்களை எளிதாகப் புரிந்துகொள்ளவும் ஆசிரியர்கள் உதவுவார்கள்.',
      },
    },
    {
      id: 'reading-practice',
      icon: 'Book',
      title: { en: 'Reading Practice', ta: 'வாசிப்புப் பயிற்சி' },
      description: {
        en: 'Regular reading activities that improve pronunciation, vocabulary, comprehension, fluency, and confidence.',
        ta: 'தொடர்ச்சியான வாசிப்புப் பயிற்சிகள் மூலம் உச்சரிப்பு, சொற்களஞ்சியம், புரிதல் மற்றும் வாசிப்புத் தன்னம்பிக்கை மேம்படுத்தப்படும்.',
      },
    },
    {
      id: 'public-speaking',
      icon: 'Mic',
      title: { en: 'Public Speaking', ta: 'மேடைப் பேச்சுப் பயிற்சி' },
      description: {
        en: 'Speaking opportunities that develop confidence, stage presence, presentation skills, and effective communication.',
        ta: 'மாணவர்கள் மேடையில் பயமின்றி தன்னம்பிக்கையுடன் பேசவும், தங்கள் கருத்துகளை தெளிவாகப் பகிரவும் வாய்ப்புகள் வழங்கப்படும்.',
      },
    },
    {
      id: 'handwriting',
      icon: 'PenTool',
      title: { en: 'Handwriting Development', ta: 'கையெழுத்து மேம்பாட்டுப் பயிற்சி' },
      description: {
        en: 'Regular guidance to improve neat, clear, and readable handwriting in Tamil and English.',
        ta: 'தமிழ் மற்றும் ஆங்கிலத்தில் அழகாகவும் தெளிவாகவும் எழுதுவதற்கான பயிற்சிகள் வழங்கப்படும்.',
      },
      
    },

    {
      id: 'personality-development',
      icon: 'Star',
      title: { en: 'Personality Development', ta: 'ஆளுமைத் திறன் மேம்பாடு' },
      description: {
        en: 'Activities that develop confidence, discipline, leadership, positive thinking, and communication.',
        ta: 'தன்னம்பிக்கை, ஒழுக்கம், தலைமைத்திறன், நேர்மறை சிந்தனை மற்றும் தொடர்புத் திறனை வளர்க்கும் செயல்பாடுகள் வழங்கப்படும்.',
      },
    },
  ],

  // Why Choose Us features
  features: [
    { en: 'Experienced and Supportive Teachers', ta: 'அனுபவமுள்ள, ஆதரவான ஆசிரியர்கள்', icon: 'Award' },
    { en: 'Practical Learning Activities', ta: 'செயல்முறை கற்றல் செயல்பாடுகள்', icon: 'Lightbulb' },
    { en: 'Individual Student Attention', ta: 'ஒவ்வொரு மாணவருக்கும் தனிப்பட்ட கவனம்', icon: 'Heart' },
    { en: 'Academic Guidance', ta: 'பாட வழிகாட்டுதல்', icon: 'Target' },
    { en: 'Spoken English Practice', ta: 'பேச்சு ஆங்கிலப் பயிற்சி', icon: 'MessageSquare' },
    { en: 'Communication Skills Training', ta: 'தொடர்புத் திறன் பயிற்சி', icon: 'Headphones' },
    { en: 'Reading and Public Speaking', ta: 'வாசிப்பு மற்றும் மேடைப் பேச்சு', icon: 'BookOpen' },
    { en: 'Positive Learning Environment', ta: 'நல்ல மற்றும் ஊக்கமளிக்கும் கற்றல் சூழல்', icon: 'Sun' },
    { en: 'Student Motivation', ta: 'மாணவர்களுக்கு ஊக்கமும் வழிகாட்டுதலும்', icon: 'TrendingUp' },
    { en: 'Personality Development', ta: 'ஆளுமைத் திறன் மேம்பாடு', icon: 'Sparkles' },
  ],

  // Gallery categories
  galleryCategories: [
    { id: 'all', en: 'All', ta: 'அனைத்தும்' },
    { id: 'classroom', en: 'Classroom Learning', ta: 'வகுப்பறைக் கற்றல்' },
    { id: 'spoken-english', en: 'Spoken English', ta: 'பேச்சு ஆங்கிலம்' },
    { id: 'reading', en: 'Reading Activities', ta: 'வாசிப்புச் செயல்பாடுகள்' },
    { id: 'public-speaking', en: 'Public Speaking', ta: 'மேடைப் பேச்சு' },
    { id: 'presentations', en: 'Student Presentations', ta: 'மாணவர் விளக்கவுரைகள்' },
    { id: 'communication', en: 'Communication Programs', ta: 'தொடர்புத் திறன் நிகழ்வுகள்' },
    { id: 'events', en: 'Special Events', ta: 'சிறப்பு நிகழ்வுகள்' },
  ],

  // Sample gallery images (replace with actual images)
  galleryImages: [
    // Add gallery images here with format:
    // { id: '1', src: '/images/gallery/gallery-01.jpg', category: 'classroom', caption: { en: 'Classroom session', ta: 'வகுப்பறை பயிற்சி' } },
  ],
};

export default academyData;
