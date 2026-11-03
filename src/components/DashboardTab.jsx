import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  BookOpen,
  Film,
  Star,
  Library,
  Utensils,
  Users,
  ChevronRight,
  Clock,
  SlidersHorizontal,
  DoorOpen,
  Flame,
  Wallet,
} from 'lucide-react';
import {
  STATUS_OPTIONS,
  CAMPUS_STATUS_MODES,
  CAFETERIA_MENUS,
} from '../data/mockCampusData';

export default function DashboardTab({
  currentUser,
  onUpdateMyStatus,
  campusModeId,
  onChangeCampusMode,
  cultureData,
  onOpenCultureModal,
  libraryData,
  onToggleStudyRoom,
  students,
  onOpenNetworkModal,
  onNavigateTab,
}) {
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);

  const currentCampusMode =
    CAMPUS_STATUS_MODES.find((m) => m.id === campusModeId) ||
    CAMPUS_STATUS_MODES[0];

  // Calculate Library Occupancy % and Tenha / Orta / Yoğun badge
  const occupancyPercent = Math.round(
    (libraryData.currentUsers / libraryData.totalCapacity) * 100
  );

  const getOccupancyLevel = (pct) => {
    if (pct < 40) {
      return {
        label: 'Tenha',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        barClass: 'from-emerald-500 to-teal-500',
        desc: 'Masaların çoğu boş, oldukça sessiz.',
      };
    }
    if (pct < 75) {
      return {
        label: 'Orta',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        barClass: 'from-amber-500 to-orange-500',
        desc: 'Dengeli yoğunluk, çalışma yeri rahatça bulunabilir.',
      };
    }
    return {
      label: 'Yoğun',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      barClass: 'from-rose-500 to-red-600',
      desc: 'Sınav dönemi yoğunluğu, sınırlı boş koltuk.',
    };
  };

  const occMeta = getOccupancyLevel(occupancyPercent);

  const calcAvg = (reviews) => {
    if (!reviews || !reviews.length) return '5.0';
    return (
      reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0) / reviews.length
    ).toFixed(1);
  };

  const todayMenu = CAFETERIA_MENUS[0];

  const allStudentsWithCurrent = [
    currentUser,
    ...students.filter((s) => s.email !== currentUser.email),
  ];

  return (
    <div className="space-y-4 pb-6">
      {/* 1. OKUL DURUM GÖSTERGESİ (AÇIK / KAPALI - Resmi Tatil, Kar Tatili, Mesai Saatleri) */}
      <section
        className={`rounded-3xl p-4 border shadow-soft transition-all ${
          currentCampusMode.isOpen
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border-emerald-500/40'
            : 'bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white border-rose-500/40'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[11px] font-extrabold tracking-wide shadow-sm">
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      currentCampusMode.isOpen ? 'bg-emerald-500' : 'bg-rose-600'
                    }`}
                  />
                  OKUL DURUMU: {currentCampusMode.badge}
                </span>
                <span className="text-[11px] font-semibold text-white/90 bg-black/15 px-2.5 py-0.5 rounded-full">
                  {currentCampusMode.temperature}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold mt-1.5 leading-snug">
                {currentCampusMode.title}
              </h2>
              <p className="text-xs text-white/90 mt-0.5 leading-relaxed">
                {currentCampusMode.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModeSwitcher((prev) => !prev)}
            className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-[11px] font-bold flex items-center gap-1 transition"
            title="Okul durum senaryosunu test et"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Senaryo</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-white/85 mt-3 pt-2.5 border-t border-white/15">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Durum Nedeni: <strong>{currentCampusMode.reasonType}</strong>
          </span>
          <span>🚌 Ring: {currentCampusMode.ringNext}</span>
        </div>

        {/* Interactive Scenario Switcher for testing Open vs Snow Holiday vs Official Holiday */}
        {showModeSwitcher && (
          <div className="mt-3 p-2.5 rounded-2xl bg-black/20 backdrop-blur-md space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/80">
              Okul Durum Göstergesini Test Et (Canlı Simülasyon):
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {CAMPUS_STATUS_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChangeCampusMode(m.id)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
                    campusModeId === m.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  {m.badge}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. KULLANICI ANLIK KİŞİSEL DURUM SEÇİCİ (Status Badge) */}
      <section className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Anlık Kişisel Durumun (Status Badge)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Ortak ağdaki tüm kampüs arkadaşların şu an nerede olduğunu buradan görür:
            </p>
          </div>
          {(() => {
            const currentSt =
              STATUS_OPTIONS.find((s) => s.id === currentUser.status) ||
              STATUS_OPTIONS[0];
            return (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${currentSt.badgeClass}`}
              >
                <span>{currentSt.emoji}</span>
                <span>{currentSt.label}</span>
              </span>
            );
          })()}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {STATUS_OPTIONS.map((st) => {
            const active = currentUser.status === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateMyStatus(st.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border text-[11px] font-bold transition ${
                  active
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-indigo-50/50 hover:border-indigo-200'
                }`}
              >
                <span className="text-lg leading-none mb-1">{st.emoji}</span>
                <span className="truncate w-full text-center">{st.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ORTAK KAMPÜS AĞI (Takip Şartı Olmadan Canlı Öğrenci Profilleri) */}
      <section className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Ortak Kampüs Ağı (.edu.tr)
              </h3>
              <p className="text-[11px] text-slate-500">
                Takip şartı yok • Tüm öğrencilerin anlık durumunu gör
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenNetworkModal(null)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5"
          >
            <span>Tümünü Gör ({allStudentsWithCurrent.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {allStudentsWithCurrent.map((stu) => {
            const st =
              STATUS_OPTIONS.find((s) => s.id === stu.status) || STATUS_OPTIONS[0];
            const isMe = stu.email === currentUser.email;
            return (
              <button
                key={stu.id}
                type="button"
                onClick={() => onOpenNetworkModal(stu)}
                className="shrink-0 w-32 p-3 rounded-2xl bg-slate-50/90 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 transition text-left space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${
                      stu.avatarBg || 'from-indigo-500 to-sky-500'
                    } text-white font-bold text-xs flex items-center justify-center shadow-sm`}
                  >
                    {stu.initials}
                  </div>
                  <span className="text-sm" title={st.label}>
                    {st.emoji}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800 truncate">
                    {isMe ? `${stu.name} (Sen)` : stu.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{stu.department}</p>
                </div>
                <span
                  className={`inline-block w-full text-center py-0.5 px-1.5 rounded-lg text-[10px] font-bold border truncate ${st.badgeClass}`}
                >
                  {st.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. AYIN KİTABI VE AYIN FİLMİ ÖNE ÇIKAN KARTI (Pop-up & Puan/Yorum Detayı) */}
      <section className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-soft-lg space-y-3.5 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-amber-300 text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Öne Çıkan Kültür Pop-up • Puan Ver & Yorumla</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenCultureModal('book')}
            className="text-xs font-bold text-indigo-200 hover:text-white underline underline-offset-4"
          >
            Pop-up Aç
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ayın Kitabı Card */}
          <div
            onClick={() => onOpenCultureModal('book')}
            className="cursor-pointer p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-indigo-200 uppercase">
                <BookOpen className="w-3.5 h-3.5 text-indigo-300" />
                Ayın Kitabı
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                {calcAvg(cultureData.book.reviews)} / 5
              </span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
                {cultureData.book.title}
              </h4>
              <p className="text-xs text-indigo-200">{cultureData.book.creator}</p>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-indigo-200">
              <span>{cultureData.book.reviews.length} öğrenci yorumu</span>
              <span className="font-bold text-amber-300">Puan Ver & Yorum Yaz →</span>
            </div>
          </div>

          {/* Ayın Filmi Card */}
          <div
            onClick={() => onOpenCultureModal('movie')}
            className="cursor-pointer p-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-200 uppercase">
                <Film className="w-3.5 h-3.5 text-rose-300" />
                Ayın Filmi
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-extrabold">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                {calcAvg(cultureData.movie.reviews)} / 5
              </span>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">
                {cultureData.movie.title}
              </h4>
              <p className="text-xs text-indigo-200">
                {cultureData.movie.originalTitle}
              </p>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-indigo-200">
              <span>{cultureData.movie.reviews.length} öğrenci yorumu</span>
              <span className="font-bold text-amber-300">Puan Ver & Yorum Yaz →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. KÜTÜPHANE DOLULUK VE 4 ÖZEL ÇALIŞMA ODASI CANLI TAKİBİ */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Merkez Kütüphane & Oda Takibi
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${occMeta.badgeClass}`}
                >
                  %{occupancyPercent} • {occMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {libraryData.currentUsers} / {libraryData.totalCapacity} koltuk dolu •{' '}
                {occMeta.desc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('library_food')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0 inline-flex items-center gap-0.5"
          >
            <span>Detay</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Occupancy Progress Bar + Tenha / Orta / Yoğun Scale */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${occMeta.barClass} transition-all duration-500`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span className={occupancyPercent < 40 ? 'text-emerald-600 font-extrabold' : ''}>
              🟢 Tenha (%0-39)
            </span>
            <span
              className={
                occupancyPercent >= 40 && occupancyPercent < 75
                  ? 'text-amber-600 font-extrabold'
                  : ''
              }
            >
              🟡 Orta (%40-74)
            </span>
            <span className={occupancyPercent >= 75 ? 'text-rose-600 font-extrabold' : ''}>
              🔴 Yoğun (%75-100)
            </span>
          </div>
        </div>

        {/* 4 Adet Özel Çalışma Odası (Oda 1, Oda 2, Oda 3, Oda 4) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
              <DoorOpen className="w-4 h-4 text-indigo-600" />
              <span>Özel Çalışma Odaları Anlık Durum (4 Oda)</span>
            </h4>
            <span className="text-[10px] text-slate-400">
              Durumu değiştirmek için odaya dokunun
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {libraryData.studyRooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => onToggleStudyRoom(room.id)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  room.isAvailable
                    ? 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-200'
                    : 'bg-rose-50/70 hover:bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900">
                    {room.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      room.isAvailable
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-500 text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {room.isAvailable ? 'Müsait' : 'Dolu'}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600 truncate">
                  {room.capacity}
                </p>
                <p
                  className={`text-[10px] mt-1 truncate font-medium ${
                    room.isAvailable ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {room.isAvailable ? 'Hemen Kullanılabilir' : room.availableAt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GÜNÜN YEMEKHANE MENÜSÜ KARTI */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Günün Yemekhane Menüsü
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-[10px] font-bold">
                  {todayMenu.dateText}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {todayMenu.serviceHours}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('library_food')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 shrink-0 inline-flex items-center gap-0.5"
          >
            <span>Tüm Hafta</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Price & Total Calories Strip */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
            <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase text-emerald-700">
                Güncel Öğrenci Ücreti
              </p>
              <p className="text-sm font-extrabold text-emerald-900">
                {todayMenu.studentPrice}{' '}
                <span className="text-[10px] font-medium text-emerald-700">
                  (2. Geçiş: {todayMenu.secondPassPrice})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <p className="text-[10px] font-bold uppercase text-amber-700">
                Toplam Enerji / Besin
              </p>
              <p className="text-sm font-extrabold text-amber-900">
                {todayMenu.totalCalories} kcal{' '}
                <span className="text-[10px] font-medium text-amber-700">
                  ({todayMenu.proteinGrams})
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 4 Course Items: Çorba, Ana Yemek, Yardımcı Yemek, Tatlı/Meyve */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {todayMenu.items.map((item) => (
            <div
              key={item.category}
              className="p-3 rounded-2xl bg-slate-50/90 border border-slate-200/70 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 block">
                    {item.category}
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    🌱 Vegan: {item.veganAlt}
                  </p>
                </div>
              </div>
              <span className="shrink-0 px-2 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-extrabold text-slate-700">
                {item.calories} kcal
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
