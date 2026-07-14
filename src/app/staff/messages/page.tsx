'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Calendar, Users, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MessagesPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
          {t.staff.nav.whatsappMessages}
        </h1>
        <p className="text-text-secondary mt-2">
          View history of WhatsApp messages sent for attendance and payments.
        </p>
      </div>

      {/* Message History */}
      <div className="card p-8 text-center">
        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-text-secondary">
          {t.common.noData}
        </p>
        <p className="text-sm text-text-muted mt-2">
          Messages will appear here after you send attendance or payment notifications.
        </p>
      </div>
    </div>
  );
}
