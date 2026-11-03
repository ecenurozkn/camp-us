import React, { useState } from 'react';
import {
  BellRing,
  CalendarDays,
  Timer,
  Megaphone,
  PartyPopper,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ACADEMIC_ALERTS,
  CAMPUS_ANNOUNCEMENTS,
  SOCIAL_CALENDAR_EVENTS,
} from '../data/mockCampusData';

export default function CalendarAnnouncementsTab() {
  const [activeSubView, setActiveSubView] = useState('all'); // 'all' | 'academic' | 'announcements' | 'social'
  const [announcementCategory, setAnnouncementCategory] = useState('Tümü');
  const [socialViewPeriod, setSocialViewPeriod] = useState('semester'); // 'semester' | '2026-10' | '2026-11' | '2026-12' | '2027-05'
  const [expandedAlertId, setExpandedAlertId] = useState('alert-exam');
  const [rsvpEvents, setRsvpEvents] = useState(['soc-3', 'soc-6']);

  const toggleRsvp = (eventId) => {
    setRsvpEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const filteredAnnouncements =
    announcementCategory === 'Tümü'
      ? CAMPUS_ANNOUNCEMENTS
      : CAMPUS_ANNOUNCEMENTS.filter((a) => a.category === announcementCategory);

  const filteredSocialEvents =
    socialViewPeriod === 'semester'
      ? SOCIAL_CALENDAR_EVENTS
      : SOCIAL_CALENDAR_EVENTS.filter((e) => e.monthKey === socialViewPeriod);

  const getColorClasses = (color) => {
    switch (color) {
      case 'emerald':
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          countdown: 'bg-emerald-600 text-white',
          border: 'border-emerald-200/80',
        };
      case 'indigo':
        return {
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          countdown: 'bg-indigo-600 text-white',
          border: 'border-indigo-200/80',
        };
      case 'amber':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          countdown: 'bg-amber-500 text-white',
          border: 'border-amber-200/80',
        };
      default:
        return {
          badge: 'bg-sky-100 text-sky-800 border-sky-200',
          countdown: 'bg-sky-600 text-white',
          border: 'border-sky-200/80',
        };
    }
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Section Header & Quick Filter Pills */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Akademik, İdari & Sosyal Takvim
            </h2>
            <p className="text-xs text-slate-500">
              Kritik sınav/Erasmus geri sayımları, rektörlük duyuruları ve dönemlik sosyal faaliyet takvimi
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'academic', label: 'Kritik Sorular' },
            { id: 'announcements', label: 'Duyurular' },
            { id: 'social', label: 'Sosyal Takvim' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubView(tab.id)}
              className={`py-2 px-2 rounded-xl text-[11px] font-extrabold transition ${
                activeSubView === tab.id
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. AKADEMİK VE İDARİ BİLDİRİMLER (Sabit Bilgi Kartları & Geri Sayımlar) */}
      {(activeSubView === 'all' || activeSubView === 'academic') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900">
                Akademik & İdari Sabit Bilgi Kartları
              </h3>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Canlı Geri Sayım
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ACADEMIC_ALERTS.map((alert) => {
              const styles = getColorClasses(alert.statusColor);
              const isExpanded = expandedAlertId === alert.id;
              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-3xl p-4 border ${styles.border} shadow-soft flex flex-col justify-between space-y-3 transition`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${styles.badge}`}
                      >
                        {alert.statusBadge}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">
                        📅 {alert.dateText}
                      </span>
                    </div>

                    {/* Critical Question Title */}
                    <h4 className="text-sm font-extrabold text-slate-900">
                      “{alert.question}”
                    </h4>

                    {/* Direct Answer */}
                    <p className="text-xs font-bold text-indigo-700">
                      {alert.answerTitle}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {alert.answerDetail}
                    </p>
                  </div>

                  {/* Countdown Box */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl ${styles.countdown} flex items-center justify-center shrink-0`}
                        >
                          <Timer className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-slate-400">
                            {alert.countdownLabel}
                          </p>
                          <p className="text-xs font-extrabold text-slate-900">
                            {alert.countdownDays} Gün {alert.countdownHours} Saat Kaldı
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAlertId(isExpanded ? null : alert.id)
                        }
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5"
                      >
                        <span>Not</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
                        <strong>Önemli Detay:</strong> {alert.extraNotes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. SOSYAL FAALİYET TAKVİMİ (Aylık / Dönemlik Görünüm: Sinema Günü, Bahar Şenliği, Halloween vb.) */}
      {(activeSubView === 'all' || activeSubView === 'social') && (
        <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Sosyal Faaliyet Takvimi
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                    Aylık & Dönemlik Görünüm
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Halloween Partisi, Gelecek Ay Sinema Günü, Mayıs Bahar Şenliği ve Konserler
                </p>
              </div>
            </div>
          </div>

          {/* Monthly / Semester Period Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'semester', label: '🗓️ Tüm Dönem (Güz & Bahar)' },
              { id: '2026-10', label: '🎃 Ekim / Halloween' },
              { id: '2026-11', label: '🍂 Kasım (Bu Ay)' },
              { id: '2026-12', label: '🎬 Aralık (Gelecek Ay Sinema Günü)' },
              { id: '2027-03', label: '🎭 Mart Tiyatro' },
              { id: '2027-05', label: '🌸 Mayıs Bahar Şenliği' },
            ].map((period) => (
              <button
                key={period.id}
                type="button"
                onClick={() => setSocialViewPeriod(period.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                  socialViewPeriod === period.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Visual Timeline / Calendar Cards */}
          <div className="space-y-3">
            {filteredSocialEvents.map((ev) => {
              const isJoined = rsvpEvents.includes(ev.id);
              return (
                <div
                  key={ev.id}
                  className="p-3.5 sm:p-4 rounded-3xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-indigo-200 transition shadow-sm flex items-start gap-3.5"
                >
                  {/* Date Badge */}
                  <div
                    className={`w-14 h-16 rounded-2xl bg-gradient-to-br ${ev.color} text-white flex flex-col items-center justify-center shrink-0 shadow-sm`}
                  >
                    <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-90">
                      {ev.monthShort}
                    </span>
                    <span className="text-lg font-extrabold leading-none my-0.5">
                      {ev.day}
                    </span>
                    <span className="text-xs leading-none">{ev.emoji}</span>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${ev.bgSoft}`}
                      >
                        {ev.monthName} • {ev.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        👥 {ev.attendeesCount + (isJoined ? 1 : 0)} Katılımcı
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5">
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          {ev.time}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {ev.location}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleRsvp(ev.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition ${
                          isJoined
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Takvimimde Ekli</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Takvimime Ekle</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. GENEL OKUL DUYURULARI VE KONFERANSLAR PANOSU */}
      {(activeSubView === 'all' || activeSubView === 'announcements') && (
        <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Genel Okul Duyuruları & Konferanslar
                </h3>
                <p className="text-xs text-slate-500">
                  Rektörlük, bölüm başkanlıkları, seminer ve konferans panosu
                </p>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['Tümü', 'Rektörlük Duyurusu', 'Konferans', 'Bölüm Duyurusu', 'Seminer'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAnnouncementCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                    announcementCategory === cat
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Announcements List */}
          <div className="space-y-3">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${ann.badgeColor}`}
                    >
                      {ann.category}
                    </span>
                    {ann.isPinned && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        📌 Sabit Duyuru
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {ann.date} • {ann.time}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ann.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-indigo-700">
                    🏛️ {ann.department}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {ann.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
