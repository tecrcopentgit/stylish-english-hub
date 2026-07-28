'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { academyData as sourceData } from '@/data/academyData';

// ============================================================
// TYPES
// ============================================================

interface BilingualText {
  en: string;
  ta: string;
}

interface Shift {
  id: string;
  time: string;
  label: BilingualText;
}

interface BilingualList {
  en: string[];
  ta: string[];
}

interface Leader {
  id: string;
  name: string;
  image?: unknown;
  imagePath?: string;
  imageImportName?: string;
  title: BilingualText;
  designation: BilingualText;
  qualifications: string;
  experiece_in_number?: string;
  experience: BilingualText;
  profile: BilingualText;
  specialisations?: BilingualList;
  roles?: BilingualList;
}

interface Teacher {
  id: string;
  name: string;
  image?: unknown;
  imagePath?: string;
  imageImportName?: string;
  qualification: string;
  experience: BilingualText;
  specialisations: BilingualText;
  profile: BilingualText;
}

interface Program {
  id: string;
  icon: string;
  title: BilingualText;
  description: BilingualText;
}

interface Feature {
  en: string;
  ta: string;
  icon: string;
  _index?: number;
}

interface GalleryCategory {
  id: string;
  en: string;
  ta: string;
}

interface GalleryImage {
  id: string;
  src: string;
  category: string;
  caption: BilingualText;
}

interface AcademyImages {
  logo: string;
  heroBackground: string;
  founder: string;
  cofounder: string;
  teachers: Record<string, string>;
}

interface Contact {
  phone: string;
  phoneLink: string;
  whatsapp: string;
  whatsappNumber: string;
  whatsappLink: string;
  email: string;
  emailLink: string;
  instagram: string;
  instagramLink: string;
}

interface Address {
  venue: string;
  fullSchoolName: string;
  location: BilingualText;
}

interface Schedule {
  workingDays: BilingualText;
  shifts: Shift[];
}

interface AcademyData {
  name: string;
  logo: string;
  tagline: BilingualText;
  secondaryTagline: BilingualText;
  learningPhilosophy: BilingualText;
  brandPositioning: BilingualText;
  contact: Contact;
  address: Address;
  schedule: Schedule;
  images: AcademyImages;
  leadership: Leader[];
  teachers: Teacher[];
  programs: Program[];
  features: Feature[];
  galleryCategories: GalleryCategory[];
  galleryImages: GalleryImage[];
}

// ============================================================
// CONSTANTS
// ============================================================

const TABS = [
  { id: 'general', label: 'General Info', icon: '⚙️' },
  { id: 'contact', label: 'Contact & Address', icon: '📞' },
  { id: 'schedule', label: 'Schedule', icon: '📅' },
  { id: 'leadership', label: 'Leadership', icon: '👤' },
  { id: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
  { id: 'programs', label: 'Programs', icon: '📚' },
  { id: 'features', label: 'Why Choose Us', icon: '⭐' },
  { id: 'gallery', label: 'Gallery', icon: '🖼️' },
  { id: 'export', label: 'Export Data', icon: '💾' },
] as const;

const ICON_OPTIONS = [
  'GraduationCap', 'MessageCircle', 'Users', 'BookOpen', 'Book',
  'Mic', 'PenTool', 'Star', 'Award', 'Lightbulb', 'Heart',
  'Target', 'MessageSquare', 'Headphones', 'Sun', 'TrendingUp', 'Sparkles',
];

const IMAGE_IMPORTS: Record<string, { varName: string; path: string }> = {
  founder: { varName: 'kaja_sir', path: "'../assets/kaja_sir.png'" },
  cofounder: { varName: 'uvaish_photo', path: "'../assets/uvaish_english.png'" },
  'zulfa-nisa': { varName: 'zulfia_photo', path: "'../assets/zulfa_mam.jpeg'" },
  'jannathul-thasnim': { varName: 'thasnim_photo', path: "'../assets/thasnim_mam.jpeg'" },
  'ramalan-athika': { varName: 'thasnim_photo', path: "'../assets/thasnim_mam.jpeg'" },
  'mohamed-yahya': { varName: 'yahya_photo', path: "'../assets/yahya.jpeg'" },
};

// ============================================================
// UTILITIES
// ============================================================

const deepClone = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));
const genId = () => 'id_' + Math.random().toString(36).substring(2, 11);

const getDefaultData = (): AcademyData => {
  const data = deepClone(sourceData) as unknown as AcademyData;
  data.leadership?.forEach((l) => {
    const img = IMAGE_IMPORTS[l.id];
    l.imagePath = img?.path ?? '';
    l.imageImportName = img?.varName ?? '';
  });
  data.teachers?.forEach((t) => {
    const img = IMAGE_IMPORTS[t.id];
    t.imagePath = img?.path ?? '';
    t.imageImportName = img?.varName ?? '';
  });
  return data;
};

const moveItem = <T,>(arr: T[], index: number, direction: number): T[] => {
  const a = [...arr];
  const target = index + direction;
  if (target < 0 || target >= a.length) return a;
  [a[index], a[target]] = [a[target], a[index]];
  return a;
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function BilingualField({
  label, value, onChange, multiline = false,
}: {
  label: string;
  value: BilingualText;
  onChange: (v: BilingualText) => void;
  multiline?: boolean;
}) {
  const cls =
    'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all';

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-start gap-2">
          <span className="mt-2 inline-flex items-center justify-center min-w-[30px] h-6 px-1.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
            EN
          </span>
          {multiline ? (
            <textarea
              className={cls}
              value={value?.en ?? ''}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              placeholder={`${label} (English)`}
              rows={3}
            />
          ) : (
            <input
              className={cls}
              value={value?.en ?? ''}
              onChange={(e) => onChange({ ...value, en: e.target.value })}
              placeholder={`${label} (English)`}
            />
          )}
        </div>
        <div className="flex-1 flex items-start gap-2">
          <span className="mt-2 inline-flex items-center justify-center min-w-[30px] h-6 px-1.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
            TA
          </span>
          {multiline ? (
            <textarea
              className={cls}
              value={value?.ta ?? ''}
              onChange={(e) => onChange({ ...value, ta: e.target.value })}
              placeholder={`${label} (தமிழ்)`}
              rows={3}
            />
          ) : (
            <input
              className={cls}
              value={value?.ta ?? ''}
              onChange={(e) => onChange({ ...value, ta: e.target.value })}
              placeholder={`${label} (தமிழ்)`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TextField({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <select
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none pr-8"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function BilingualListEditor({
  label, enList, taList, onChangeEn, onChangeTa,
}: {
  label: string;
  enList: string[];
  taList: string[];
  onChangeEn: (v: string[]) => void;
  onChangeTa: (v: string[]) => void;
}) {
  const add = () => {
    onChangeEn([...(enList ?? []), '']);
    onChangeTa([...(taList ?? []), '']);
  };
  const remove = (i: number) => {
    onChangeEn(enList.filter((_, idx) => idx !== i));
    onChangeTa(taList.filter((_, idx) => idx !== i));
  };
  const update = (i: number, lang: 'en' | 'ta', v: string) => {
    if (lang === 'en') {
      const a = [...enList]; a[i] = v; onChangeEn(a);
    } else {
      const a = [...taList]; a[i] = v; onChangeTa(a);
    }
  };
  const cls =
    'w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all';

  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <div className="space-y-2">
        {(enList ?? []).map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
          >
            <span className="pt-2 text-xs font-bold text-slate-400 min-w-[20px]">
              {i + 1}.
            </span>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="mt-2 inline-flex items-center justify-center min-w-[30px] h-6 px-1.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
                  EN
                </span>
                <input className={cls} value={item} onChange={(e) => update(i, 'en', e.target.value)} />
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-2 inline-flex items-center justify-center min-w-[30px] h-6 px-1.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0">
                  TA
                </span>
                <input
                  className={cls}
                  value={(taList ?? [])[i] ?? ''}
                  onChange={(e) => update(i, 'ta', e.target.value)}
                />
              </div>
            </div>
            <button
              onClick={() => remove(i)}
              className="mt-1 p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
              title="Remove"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={add}
        className="mt-2 px-3 py-1.5 text-xs font-semibold border border-dashed border-slate-300 text-slate-500 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}

function Modal({
  title, onClose, onSave, wide = false, children,
}: {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-10 px-5 z-[1000] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl w-full shadow-2xl mb-10 animate-[modalSlide_0.2s_ease-out] ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-lg font-bold text-slate-900 truncate">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors text-sm"
          >
            ✕
          </button>
        </div>
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">{children}</div>
        {onSave && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ToastNotification({
  message, type, onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const bgMap = { success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-blue-600' };
  const iconMap = { success: '✅', error: '❌', info: 'ℹ️' };
  return (
    <div
      className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-xl z-[2000] animate-[toastSlide_0.3s_ease-out] ${bgMap[type]}`}
    >
      <span>{iconMap[type]} {message}</span>
      <button
        onClick={onClose}
        className="w-6 h-6 flex items-center justify-center rounded-md bg-white/20 text-white text-xs hover:bg-white/30 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

// ============================================================
// MAIN ADMIN CLIENT COMPONENT
// ============================================================

interface AdminClientProps {
  adminName: string;
  adminEmail: string;
}

export default function AdminClient({ adminName, adminEmail }: AdminClientProps) {
  const router = useRouter();

  const [data, setData] = useState<AcademyData>(getDefaultData);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editItem, setEditItem] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ---- Hydration-safe localStorage ----
  useEffect(() => {
    setIsClient(true);
    try {
      const saved = localStorage.getItem('sea_admin_data');
      if (saved) setData(JSON.parse(saved));
    } catch {
      /* ignore */
    }
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem('sea_admin_data', JSON.stringify(data));
  }, [data, isClient]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ---- Helpers ----
  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') =>
    setToast({ message, type });

  const updateData = (path: string, value: unknown) => {
    setData((prev) => {
      const next = deepClone(prev);
      const keys = path.split('.');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    notify('Saved');
  };

  const resetAll = () => {
    if (window.confirm('Reset ALL data to original defaults? This cannot be undone.')) {
      localStorage.removeItem('sea_admin_data');
      setData(getDefaultData());
      notify('Data reset to defaults');
    }
  };

  const closeModal = () => {
    setModal(null);
    setEditItem(null);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logoutAdmin();
      router.push('/admin/login');
    } catch {
      notify('Logout failed', 'error');
      setLoggingOut(false);
    }
  };

  // ---- Button helpers ----
  const btnBase = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all active:scale-[0.97] cursor-pointer';
  const btnPrimary = `${btnBase} bg-blue-600 text-white hover:bg-blue-700`;
  const btnDanger = `${btnBase} bg-red-500 text-white hover:bg-red-600`;
  const btnOutline = `${btnBase} border border-slate-300 text-slate-600 hover:bg-slate-50`;
  const btnGhost = `${btnBase} text-slate-500 hover:bg-slate-100 hover:text-slate-700`;
  const btnSm = 'px-2.5 py-1.5 text-xs';
  const btnMd = 'px-4 py-2 text-sm';
  const btnLg = 'px-6 py-3 text-base';

  // ==================================================================
  //  SECTION: General
  // ==================================================================
  const renderGeneral = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        🏫 General Information
      </h2>
      <TextField label="Academy Name" value={data.name} onChange={(v) => updateData('name', v)} />
      <TextField label="Logo Path" value={data.logo} onChange={(v) => updateData('logo', v)} placeholder="/images/academy-logo.png" />
      <BilingualField label="Primary Tagline" value={data.tagline} onChange={(v) => updateData('tagline', v)} />
      <BilingualField label="Secondary Tagline" value={data.secondaryTagline} onChange={(v) => updateData('secondaryTagline', v)} />
      <BilingualField label="Learning Philosophy" value={data.learningPhilosophy} onChange={(v) => updateData('learningPhilosophy', v)} />
      <BilingualField label="Brand Positioning" value={data.brandPositioning} onChange={(v) => updateData('brandPositioning', v)} />

      <h3 className="text-sm font-semibold text-slate-700 mt-8 mb-3">Static Image Paths</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
        <TextField label="Logo" value={data.images?.logo} onChange={(v) => updateData('images.logo', v)} />
        <TextField label="Hero Background" value={data.images?.heroBackground} onChange={(v) => updateData('images.heroBackground', v)} />
        <TextField label="Founder Photo" value={data.images?.founder} onChange={(v) => updateData('images.founder', v)} />
        <TextField label="Co-Founder Photo" value={data.images?.cofounder} onChange={(v) => updateData('images.cofounder', v)} />
      </div>
    </div>
  );

  // ==================================================================
  //  SECTION: Contact
  // ==================================================================
  const renderContact = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        📞 Contact Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
        <TextField label="Phone" value={data.contact?.phone} onChange={(v) => updateData('contact.phone', v)} />
        <TextField label="Phone Link" value={data.contact?.phoneLink} onChange={(v) => updateData('contact.phoneLink', v)} />
        <TextField label="WhatsApp Display" value={data.contact?.whatsapp} onChange={(v) => updateData('contact.whatsapp', v)} />
        <TextField label="WhatsApp Number" value={data.contact?.whatsappNumber} onChange={(v) => updateData('contact.whatsappNumber', v)} />
        <TextField label="WhatsApp Link" value={data.contact?.whatsappLink} onChange={(v) => updateData('contact.whatsappLink', v)} />
        <TextField label="Email" value={data.contact?.email} onChange={(v) => updateData('contact.email', v)} type="email" />
        <TextField label="Email Link" value={data.contact?.emailLink} onChange={(v) => updateData('contact.emailLink', v)} />
        <TextField label="Instagram Handle" value={data.contact?.instagram} onChange={(v) => updateData('contact.instagram', v)} />
        <TextField label="Instagram Link" value={data.contact?.instagramLink} onChange={(v) => updateData('contact.instagramLink', v)} />
      </div>

      <h2 className="text-lg font-bold text-slate-900 mt-10 mb-5 pb-2.5 border-b-2 border-slate-200">
        📍 Address
      </h2>
      <TextField label="Venue" value={data.address?.venue} onChange={(v) => updateData('address.venue', v)} />
      <TextField label="Full School Name" value={data.address?.fullSchoolName} onChange={(v) => updateData('address.fullSchoolName', v)} />
      <BilingualField label="Location" value={data.address?.location} onChange={(v) => updateData('address.location', v)} />
    </div>
  );

  // ==================================================================
  //  SECTION: Schedule
  // ==================================================================
  const addShift = () => {
    const shifts = deepClone(data.schedule?.shifts ?? []);
    shifts.push({ id: `shift${shifts.length + 1}`, time: '', label: { en: '', ta: '' } });
    updateData('schedule.shifts', shifts);
  };

  const removeShift = (i: number) => {
    if (window.confirm('Remove this shift?'))
      updateData('schedule.shifts', data.schedule.shifts.filter((_, idx) => idx !== i));
  };

  const updateShift = (i: number, field: string, value: unknown) => {
    const shifts = deepClone(data.schedule.shifts);
    if (field === 'label') shifts[i].label = value as BilingualText;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    else (shifts[i] as any)[field] = value;
    updateData('schedule.shifts', shifts);
  };

  const renderSchedule = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        📅 Schedule
      </h2>
      <BilingualField label="Working Days" value={data.schedule?.workingDays} onChange={(v) => updateData('schedule.workingDays', v)} />

      <h3 className="text-sm font-semibold text-slate-700 mt-6 mb-3">Shifts</h3>
      {(data.schedule?.shifts ?? []).map((shift, i) => (
        <div key={shift.id ?? i} className="bg-white border border-slate-200 rounded-xl p-5 mb-3 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-slate-900">Shift {i + 1}</h4>
            <button className={`${btnDanger} ${btnSm}`} onClick={() => removeShift(i)}>Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <TextField label="ID" value={shift.id} onChange={(v) => updateShift(i, 'id', v)} />
            <TextField label="Time" value={shift.time} onChange={(v) => updateShift(i, 'time', v)} placeholder="5:30 PM – 7:00 PM" />
          </div>
          <BilingualField label="Label" value={shift.label} onChange={(v) => updateShift(i, 'label', v)} />
        </div>
      ))}
      <button className={`${btnPrimary} ${btnMd}`} onClick={addShift}>+ Add Shift</button>
    </div>
  );

  // ==================================================================
  //  SECTION: Leadership
  // ==================================================================
  const openLeaderModal = (leader: Leader) => { setEditItem(deepClone(leader)); setModal('leadership'); };

  const saveLeader = () => {
    const arr = deepClone(data.leadership ?? []);
    const idx = arr.findIndex((l) => l.id === editItem.id);
    if (idx >= 0) arr[idx] = editItem; else arr.push(editItem);
    updateData('leadership', arr);
    closeModal();
  };

  const removeLeader = (id: string) => {
    if (window.confirm('Remove this leader?'))
      updateData('leadership', data.leadership.filter((l) => l.id !== id));
  };

  const renderLeadership = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        👤 Leadership Team
      </h2>
      {(data.leadership ?? []).map((leader, i) => (
        <div key={leader.id} className="bg-white border border-slate-200 rounded-xl p-5 mb-3 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-slate-900 truncate">{leader.name}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{leader.designation?.en}</p>
              <p className="text-xs text-slate-400 mt-0.5">{leader.qualifications}</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('leadership', moveItem(data.leadership, i, -1))} title="Move Up">▲</button>
              <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('leadership', moveItem(data.leadership, i, 1))} title="Move Down">▼</button>
              <button className={`${btnPrimary} ${btnSm}`} onClick={() => openLeaderModal(leader)}>Edit</button>
              <button className={`${btnDanger} ${btnSm}`} onClick={() => removeLeader(leader.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
      <button
        className={`${btnPrimary} ${btnMd} mt-2`}
        onClick={() => {
          setEditItem({
            id: genId(), name: '', imagePath: '', imageImportName: '',
            title: { en: '', ta: '' }, designation: { en: '', ta: '' },
            qualifications: '', experiece_in_number: '',
            experience: { en: '', ta: '' }, profile: { en: '', ta: '' },
            specialisations: { en: [], ta: [] }, roles: { en: [], ta: [] },
          } as Leader);
          setModal('leadership');
        }}
      >
        + Add Leader
      </button>
    </div>
  );

  // ==================================================================
  //  SECTION: Teachers
  // ==================================================================
  const openTeacherModal = (t: Teacher) => { setEditItem(deepClone(t)); setModal('teacher'); };

  const saveTeacher = () => {
    const arr = deepClone(data.teachers ?? []);
    const idx = arr.findIndex((t) => t.id === editItem.id);
    if (idx >= 0) arr[idx] = editItem; else arr.push(editItem);
    updateData('teachers', arr);
    closeModal();
  };

  const removeTeacher = (id: string) => {
    if (window.confirm('Remove this teacher?'))
      updateData('teachers', data.teachers.filter((t) => t.id !== id));
  };

  const renderTeachers = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        👩‍🏫 Teaching Team
      </h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Qualification</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Experience</th>
                <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.teachers ?? []).map((t, i) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-semibold text-slate-900">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.qualification}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{t.experience?.en}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('teachers', moveItem(data.teachers, i, -1))}>▲</button>
                      <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('teachers', moveItem(data.teachers, i, 1))}>▼</button>
                      <button className={`${btnPrimary} ${btnSm}`} onClick={() => openTeacherModal(t)}>Edit</button>
                      <button className={`${btnDanger} ${btnSm}`} onClick={() => removeTeacher(t.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className={`${btnPrimary} ${btnMd} mt-4`}
        onClick={() => {
          setEditItem({
            id: genId(), name: '', imagePath: '', imageImportName: '',
            qualification: '', experience: { en: '', ta: '' },
            specialisations: { en: '', ta: '' }, profile: { en: '', ta: '' },
          } as Teacher);
          setModal('teacher');
        }}
      >
        + Add Teacher
      </button>
    </div>
  );

  // ==================================================================
  //  SECTION: Programs
  // ==================================================================
  const openProgramModal = (p: Program) => { setEditItem(deepClone(p)); setModal('program'); };

  const saveProgram = () => {
    const arr = deepClone(data.programs ?? []);
    const idx = arr.findIndex((p) => p.id === editItem.id);
    if (idx >= 0) arr[idx] = editItem; else arr.push(editItem);
    updateData('programs', arr);
    closeModal();
  };

  const removeProgram = (id: string) => {
    if (window.confirm('Remove this program?'))
      updateData('programs', data.programs.filter((p) => p.id !== id));
  };

  const renderPrograms = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        📚 Programs
      </h2>
      <div className="space-y-2">
        {(data.programs ?? []).map((p, i) => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-[11px] px-3 py-1.5 bg-blue-50 text-blue-600 font-semibold rounded-lg whitespace-nowrap">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 truncate">{p.title?.en}</h4>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{p.title?.ta}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('programs', moveItem(data.programs, i, -1))}>▲</button>
              <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('programs', moveItem(data.programs, i, 1))}>▼</button>
              <button className={`${btnPrimary} ${btnSm}`} onClick={() => openProgramModal(p)}>Edit</button>
              <button className={`${btnDanger} ${btnSm}`} onClick={() => removeProgram(p.id)}>Del</button>
            </div>
          </div>
        ))}
      </div>
      <button
        className={`${btnPrimary} ${btnMd} mt-4`}
        onClick={() => {
          setEditItem({ id: genId(), icon: 'Star', title: { en: '', ta: '' }, description: { en: '', ta: '' } } as Program);
          setModal('program');
        }}
      >
        + Add Program
      </button>
    </div>
  );

  // ==================================================================
  //  SECTION: Features
  // ==================================================================
  const openFeatureModal = (f: Feature, index: number) => {
    setEditItem({ ...deepClone(f), _index: index });
    setModal('feature');
  };

  const saveFeature = () => {
    const arr = deepClone(data.features ?? []);
    const { _index, ...featureData } = editItem;
    if (_index >= 0 && _index < arr.length) arr[_index] = featureData;
    else arr.push(featureData);
    updateData('features', arr);
    closeModal();
  };

  const removeFeature = (index: number) => {
    if (window.confirm('Remove this feature?'))
      updateData('features', data.features.filter((_, i) => i !== index));
  };

  const renderFeatures = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        ⭐ Why Choose Us — Features
      </h2>
      <div className="space-y-2">
        {(data.features ?? []).map((f, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
            <span className="text-[10px] px-2 py-1 bg-slate-100 text-blue-600 font-semibold rounded-md whitespace-nowrap">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{f.en}</p>
              <p className="text-xs text-slate-500 truncate">{f.ta}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('features', moveItem(data.features, i, -1))}>▲</button>
              <button className={`${btnGhost} ${btnSm}`} onClick={() => updateData('features', moveItem(data.features, i, 1))}>▼</button>
              <button className={`${btnPrimary} ${btnSm}`} onClick={() => openFeatureModal(f, i)}>Edit</button>
              <button className={`${btnDanger} ${btnSm}`} onClick={() => removeFeature(i)}>Del</button>
            </div>
          </div>
        ))}
      </div>
      <button
        className={`${btnPrimary} ${btnMd} mt-4`}
        onClick={() => {
          setEditItem({ en: '', ta: '', icon: 'Star', _index: -1 } as Feature);
          setModal('feature');
        }}
      >
        + Add Feature
      </button>
    </div>
  );

  // ==================================================================
  //  SECTION: Gallery
  // ==================================================================
  const renderGallery = () => {
    const cats = data.galleryCategories ?? [];
    const imgs = data.galleryImages ?? [];

    const addCat = () => updateData('galleryCategories', [...cats, { id: genId(), en: '', ta: '' }]);
    const updateCat = (i: number, field: string, v: string) => {
      const a = deepClone(cats);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a[i] as any)[field] = v;
      updateData('galleryCategories', a);
    };
    const removeCat = (i: number) => {
      if (window.confirm('Remove?'))
        updateData('galleryCategories', cats.filter((_, idx) => idx !== i));
    };

    const addImg = () =>
      updateData('galleryImages', [...imgs, { id: genId(), src: '', category: '', caption: { en: '', ta: '' } }]);
    const updateImg = (i: number, field: string, v: unknown) => {
      const a = deepClone(imgs);
      if (field === 'caption') a[i].caption = v as BilingualText;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else (a[i] as any)[field] = v;
      updateData('galleryImages', a);
    };
    const removeImg = (i: number) => {
      if (window.confirm('Remove?'))
        updateData('galleryImages', imgs.filter((_, idx) => idx !== i));
    };

    const inputSm =
      'w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all';

    return (
      <div className="max-w-4xl">
        <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
          🖼️ Gallery Categories
        </h2>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b-2 border-slate-200">
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">English</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase">Tamil</th>
                  <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((c, i) => (
                  <tr key={c.id ?? i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2"><input className={inputSm} value={c.id} onChange={(e) => updateCat(i, 'id', e.target.value)} /></td>
                    <td className="px-4 py-2"><input className={inputSm} value={c.en} onChange={(e) => updateCat(i, 'en', e.target.value)} /></td>
                    <td className="px-4 py-2"><input className={inputSm} value={c.ta ?? ''} onChange={(e) => updateCat(i, 'ta', e.target.value)} /></td>
                    <td className="px-4 py-2"><button className={`${btnDanger} ${btnSm}`} onClick={() => removeCat(i)}>Del</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <button className={`${btnPrimary} ${btnSm} mt-2`} onClick={addCat}>+ Add Category</button>

        <h2 className="text-lg font-bold text-slate-900 mt-10 mb-5 pb-2.5 border-b-2 border-slate-200">
          🖼️ Gallery Images
        </h2>
        {imgs.length === 0 && <p className="text-xs text-slate-500 mb-3">No gallery images added yet.</p>}
        {imgs.map((img, i) => (
          <div key={img.id ?? i} className="bg-white border border-slate-200 rounded-xl p-5 mb-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900">Image {i + 1}</h4>
              <button className={`${btnDanger} ${btnSm}`} onClick={() => removeImg(i)}>Remove</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
              <TextField label="Source Path" value={img.src} onChange={(v) => updateImg(i, 'src', v)} placeholder="/images/gallery/photo.jpg" />
              <SelectField label="Category" value={img.category} onChange={(v) => updateImg(i, 'category', v)} options={['', ...cats.map((c) => c.id)]} />
            </div>
            <BilingualField label="Caption" value={img.caption} onChange={(v) => updateImg(i, 'caption', v)} />
          </div>
        ))}
        <button className={`${btnPrimary} ${btnSm} mt-2`} onClick={addImg}>+ Add Image</button>
      </div>
    );
  };

  // ==================================================================
  //  SECTION: Export
  // ==================================================================
  const generateExportFile = () => {
    const imgMap = new Map<string, string>();
    data.leadership?.forEach((l) => {
      if (l.imageImportName && l.imagePath) imgMap.set(l.imageImportName, l.imagePath);
    });
    data.teachers?.forEach((t) => {
      if (t.imageImportName && t.imagePath) imgMap.set(t.imageImportName, t.imagePath);
    });

    let file = '';
    file += '// ============================================================\n';
    file += '// STYLISH ENGLISH ACADEMY - CENTRAL DATA FILE\n';
    file += '// ============================================================\n\n';

    imgMap.forEach((path, varName) => {
      file += `import ${varName} from ${path};\n`;
    });
    file += "\nimport classroom from '../assets/images/classroom.jpeg';\n\n";

    const exportData = deepClone(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportData.leadership?.forEach((l: any) => {
      l.image = `__REF__${l.imageImportName ?? 'undefined'}__`;
      delete l.imagePath;
      delete l.imageImportName;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportData.teachers?.forEach((t: any) => {
      t.image = `__REF__${t.imageImportName ?? 'undefined'}__`;
      delete t.imagePath;
      delete t.imageImportName;
    });

    let json = JSON.stringify(exportData, null, 2);
    json = json.replace(/"__REF__(\w+)__"/g, '$1');

    file += `export const academyData = ${json};\n\nexport default academyData;\n`;
    return file;
  };

  const downloadFile = () => {
    const content = generateExportFile();
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academyData.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('File downloaded!');
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(generateExportFile())
      .then(() => notify('Copied to clipboard!'))
      .catch(() => notify('Copy failed', 'error'));
  };

  const renderExport = () => (
    <div className="max-w-4xl">
      <h2 className="text-lg font-bold text-slate-900 mb-5 pb-2.5 border-b-2 border-slate-200">
        💾 Export Data File
      </h2>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h4 className="text-sm font-bold text-blue-800 mb-2">How to use:</h4>
        <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
          <li>Click <strong>Download File</strong> or <strong>Copy to Clipboard</strong></li>
          <li>Replace <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">src/data/academyData.js</code></li>
          <li>Make sure all image files exist in <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">assets</code></li>
          <li>Restart your dev server</li>
        </ol>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <button className={`${btnPrimary} ${btnLg}`} onClick={downloadFile}>📥 Download File</button>
        <button className={`${btnOutline} ${btnLg}`} onClick={copyToClipboard}>📋 Copy to Clipboard</button>
        <button className={`${btnDanger} ${btnLg}`} onClick={resetAll}>🔄 Reset to Defaults</button>
      </div>
      <h3 className="text-sm font-semibold text-slate-700 mb-3">File Preview</h3>
      <pre className="bg-slate-900 text-slate-300 p-5 rounded-xl text-xs leading-relaxed overflow-auto max-h-[500px] whitespace-pre-wrap break-words">
        {generateExportFile()}
      </pre>
    </div>
  );

  // ==================================================================
  //  MODALS
  // ==================================================================
  const renderModals = () => {
    if (!modal || !editItem) return null;

    if (modal === 'leadership') {
      return (
        <Modal title={editItem.name || 'New Leader'} onClose={closeModal} onSave={saveLeader} wide>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <TextField label="ID (unique)" value={editItem.id} onChange={(v) => setEditItem({ ...editItem, id: v })} />
            <TextField label="Name" value={editItem.name} onChange={(v) => setEditItem({ ...editItem, name: v })} />
            <TextField label="Image Import Name" value={editItem.imageImportName} onChange={(v) => setEditItem({ ...editItem, imageImportName: v })} placeholder="kaja_sir" />
            <TextField label="Image Path" value={editItem.imagePath} onChange={(v) => setEditItem({ ...editItem, imagePath: v })} placeholder="'../assets/photo.png'" />
          </div>
          <BilingualField label="Title" value={editItem.title} onChange={(v) => setEditItem({ ...editItem, title: v })} />
          <BilingualField label="Designation" value={editItem.designation} onChange={(v) => setEditItem({ ...editItem, designation: v })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <TextField label="Qualifications" value={editItem.qualifications} onChange={(v) => setEditItem({ ...editItem, qualifications: v })} />
            <TextField label="Experience Number" value={editItem.experiece_in_number} onChange={(v) => setEditItem({ ...editItem, experiece_in_number: v })} />
          </div>
          <BilingualField label="Experience" value={editItem.experience} onChange={(v) => setEditItem({ ...editItem, experience: v })} />
          <BilingualField label="Profile Bio" value={editItem.profile} onChange={(v) => setEditItem({ ...editItem, profile: v })} multiline />
          {editItem.specialisations && (
            <BilingualListEditor
              label="Specialisations"
              enList={editItem.specialisations?.en ?? []}
              taList={editItem.specialisations?.ta ?? []}
              onChangeEn={(v) => setEditItem({ ...editItem, specialisations: { ...editItem.specialisations, en: v } })}
              onChangeTa={(v) => setEditItem({ ...editItem, specialisations: { ...editItem.specialisations, ta: v } })}
            />
          )}
          {editItem.roles && (
            <BilingualListEditor
              label="Roles"
              enList={editItem.roles?.en ?? []}
              taList={editItem.roles?.ta ?? []}
              onChangeEn={(v) => setEditItem({ ...editItem, roles: { ...editItem.roles, en: v } })}
              onChangeTa={(v) => setEditItem({ ...editItem, roles: { ...editItem.roles, ta: v } })}
            />
          )}
        </Modal>
      );
    }

    if (modal === 'teacher') {
      return (
        <Modal title={editItem.name || 'New Teacher'} onClose={closeModal} onSave={saveTeacher} wide>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <TextField label="ID (unique)" value={editItem.id} onChange={(v) => setEditItem({ ...editItem, id: v })} />
            <TextField label="Name" value={editItem.name} onChange={(v) => setEditItem({ ...editItem, name: v })} />
            <TextField label="Image Import Name" value={editItem.imageImportName} onChange={(v) => setEditItem({ ...editItem, imageImportName: v })} />
            <TextField label="Image Path" value={editItem.imagePath} onChange={(v) => setEditItem({ ...editItem, imagePath: v })} />
          </div>
          <TextField label="Qualification" value={editItem.qualification} onChange={(v) => setEditItem({ ...editItem, qualification: v })} />
          <BilingualField label="Experience" value={editItem.experience} onChange={(v) => setEditItem({ ...editItem, experience: v })} />
          <BilingualField label="Specialisations" value={editItem.specialisations} onChange={(v) => setEditItem({ ...editItem, specialisations: v })} multiline />
          <BilingualField label="Profile" value={editItem.profile} onChange={(v) => setEditItem({ ...editItem, profile: v })} multiline />
        </Modal>
      );
    }

    if (modal === 'program') {
      return (
        <Modal title={editItem.title?.en || 'New Program'} onClose={closeModal} onSave={saveProgram}>
          <TextField label="ID (unique)" value={editItem.id} onChange={(v) => setEditItem({ ...editItem, id: v })} />
          <SelectField label="Icon" value={editItem.icon} onChange={(v) => setEditItem({ ...editItem, icon: v })} options={ICON_OPTIONS} />
          <BilingualField label="Title" value={editItem.title} onChange={(v) => setEditItem({ ...editItem, title: v })} />
          <BilingualField label="Description" value={editItem.description} onChange={(v) => setEditItem({ ...editItem, description: v })} multiline />
        </Modal>
      );
    }

    if (modal === 'feature') {
      return (
        <Modal title={editItem.en || 'New Feature'} onClose={closeModal} onSave={saveFeature}>
          <TextField label="English Text" value={editItem.en} onChange={(v) => setEditItem({ ...editItem, en: v })} />
          <TextField label="Tamil Text" value={editItem.ta} onChange={(v) => setEditItem({ ...editItem, ta: v })} />
          <SelectField label="Icon" value={editItem.icon} onChange={(v) => setEditItem({ ...editItem, icon: v })} options={ICON_OPTIONS} />
        </Modal>
      );
    }

    return null;
  };

  // ==================================================================
  //  TAB ROUTER
  // ==================================================================
  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneral();
      case 'contact': return renderContact();
      case 'schedule': return renderSchedule();
      case 'leadership': return renderLeadership();
      case 'teachers': return renderTeachers();
      case 'programs': return renderPrograms();
      case 'features': return renderFeatures();
      case 'gallery': return renderGallery();
      case 'export': return renderExport();
      default: return renderGeneral();
    }
  };

  const currentTab = TABS.find((t) => t.id === activeTab);

  // ==================================================================
  //  MAIN RENDER
  // ==================================================================
  return (
    <>
      {/* Inline keyframes for animations */}
      <style>{`
        @keyframes modalSlide {
          from { opacity: 0; transform: translateY(-20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastSlide {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="flex min-h-screen bg-slate-50 text-slate-900 text-sm">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ---- SIDEBAR ---- */}
        <aside
          className={`
            fixed lg:sticky top-0 left-0 h-screen z-50
            bg-gradient-to-b from-slate-900 to-slate-800
            text-slate-400 flex flex-col shrink-0
            transition-all duration-300 overflow-hidden
            ${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-16'}
          `}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h1 className={`text-white font-bold text-sm whitespace-nowrap ${!sidebarOpen ? 'lg:hidden' : ''}`}>
              🎓 SEA Admin
            </h1>
            <span className={`text-white font-bold text-sm ${sidebarOpen ? 'hidden' : 'hidden lg:block'}`}>
              🎓
            </span>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-7 h-7 bg-slate-700 rounded-md text-slate-400 text-xs flex items-center justify-center hover:bg-slate-600 hover:text-white transition-colors shrink-0"
            >
              {sidebarOpen ? '«' : '»'}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-2 overflow-y-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                title={tab.label}
                className={`
                  flex items-center gap-2.5 w-full px-4 py-2.5 text-sm
                  transition-colors whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200'
                  }
                `}
              >
                <span className="text-lg w-6 text-center shrink-0">{tab.icon}</span>
                <span className={!sidebarOpen ? 'lg:hidden' : ''}>{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar footer — Admin info + Logout */}
          <div className="p-4 border-t border-slate-700 space-y-3">
            <div className={!sidebarOpen ? 'lg:hidden' : ''}>
              <p className="text-xs font-semibold text-slate-300 truncate">{adminName}</p>
              <p className="text-[10px] text-slate-500 truncate">{adminEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={`
                w-full flex items-center justify-center gap-2
                px-3 py-2 text-xs font-semibold rounded-lg
                bg-red-500/20 text-red-400 hover:bg-red-500/30
                transition-colors disabled:opacity-50
                ${!sidebarOpen ? 'lg:px-1' : ''}
              `}
            >
              <span>🚪</span>
              <span className={!sidebarOpen ? 'lg:hidden' : ''}>
                {loggingOut ? 'Logging out...' : 'Logout'}
              </span>
            </button>
            <p className={`text-[11px] text-slate-500 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
              Auto-saved to browser
            </p>
          </div>
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {currentTab?.icon} {currentTab?.label}
                </h2>
                <p className="text-xs text-slate-500 hidden sm:block">
                  Stylish English Academy — Content Manager
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden md:block text-xs text-slate-500">
                👤 {adminName}
              </span>
              <button className={`${btnOutline} ${btnSm}`} onClick={resetAll}>
                🔄 Reset
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderContent()}
          </div>
        </main>

        {/* ---- MODALS ---- */}
        {renderModals()}

        {/* ---- TOAST ---- */}
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  );
}