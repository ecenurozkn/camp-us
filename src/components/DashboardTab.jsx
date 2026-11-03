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
  ChevronDown,
  ChevronUp,
  Clock,
  SlidersHorizontal,
  DoorOpen,
  AlertTriangle,
  CheckCircle2,
  Coffee,
  Plus,
  ShieldAlert,
  ThumbsUp,
  BarChart3,
  HeartPulse,
  Briefcase,
  GraduationCap,
  MessageSquarePlus,
  Calendar,
  Mail,
} from 'lucide-react';
import {
  STATUS_OPTIONS,
  CAMPUS_STATUS_MODES,
  CAFETERIA_MENUS,
  ABU_SCHEDULE_RULES,
  STUDENT_AFFAIRS_INFO,
  PROFESSOR_OFFICE_HOURS,
} from '../data/mockCampusData';

export default function DashboardTab({
  currentUser,
  onUpdateMyStatus,
  campusModeId,
  onChangeCampusMode,
  isLunchBreakActive,
  onToggleLunchBreakSimulation,
  escalatorState,
  onUpdateEscalator,
  gardenDeals,
  onAddGardenDeal,
  onLikeGardenDeal,
  safetyReports,
  cultureData,
  onAddCultureReview,
  libraryData,
  onToggleStudyRoom,
  students,
  onOpenNetworkModal,
  onOpenCafeteriaModal,
  onOpenInfirmaryModal,
  onNavigateTab,
}) {
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const [showAddDealForm, setShowAddDealForm] = useState(false);
  const [dealVendor, setDealVendor] = useState('Coffee Hub');
  const [dealTag, setDealTag] = useState('%50 İNDİRİM');
  const [dealTitle, setDealTitle] = useState('');
  const [dealDesc, setDealDesc] = useState('');

  // Office Hours Department Filter
  const [profDeptFilter, setProfDeptFilter] = useState('Tümü');

  // Inline "Ayın Kitabı & Ayın Filmi" States (No Popup / Modal!)
  const [selectedCultureType, setSelectedCultureType] = useState('book'); // 'book' | 'movie'
  const [cultureExpanded, setCultureExpanded] = useState(true);
  const [cultureRating, setCultureRating] = useState(5);
  const [cultureHoverRating, setCultureHoverRating] = useState(0);
  const [cultureComment, setCultureComment] = useState('');
  const [cultureSubmittedMsg, setCultureSubmittedMsg] = useState('');

  const currentCampusMode =
    CAMPUS_STATUS_MODES.find((m) => m.id === campusModeId) ||
    CAMPUS_STATUS_MODES[0];

  const occupancyPercent = Math.round(
    (libraryData.currentUsers / libraryData.totalCapacity) * 100
  );

  const getOccupancyLevel = (pct) => {
    if (pct < 40) {
      return {
        label: 'Tenha',
        badgeClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-600/30',
        barClass: 'from-emerald-600 to-teal-500',
        desc: 'Masaların çoğu boş, oldukça sessiz.',
      };
    }
    if (pct < 75) {
      return {
        label: 'Orta',
        badgeClass: 'bg-amber-500/25 text-amber-950 border-amber-600/35',
        barClass: 'from-[#FF8A3D] to-amber-500',
        desc: 'Dengeli yoğunluk, çalışma yeri rahatça bulunabilir.',
      };
    }
    return {
      label: 'Yoğun',
      badgeClass: 'bg-rose-500/20 text-rose-950 border-rose-600/30',
      barClass: 'from-rose-600 to-red-600',
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

  const activeSafetyReport = safetyReports.find((r) => !r.isResolved);

  const profDepartments = [
    'Tümü',
    'Yönetim Bilişim Sistemleri (MIS)',
    'Yazılım & Bilgisayar Müh.',
    'Elektrik-Elektronik & Endüstri Müh.',
    'İç Mimarlık & Tasarım',
    'Psikoloji & İTBF',
  ];

  const filteredProfessors =
    profDeptFilter === 'Tümü'
      ? PROFESSOR_OFFICE_HOURS
      : PROFESSOR_OFFICE_HOURS.filter((p) => p.department === profDeptFilter);

  const activeCultureItem =
    selectedCultureType === 'book' ? cultureData.book : cultureData.movie;
  const bookAvg = calcAvg(cultureData.book.reviews);
  const movieAvg = calcAvg(cultureData.movie.reviews);
  const activeCultureAvg = calcAvg(activeCultureItem.reviews);

  const handleInlineCultureReviewSubmit = (e) => {
    e.preventDefault();
    if (!cultureComment.trim()) return;

    onAddCultureReview(selectedCultureType, {
      id: `rev-${Date.now()}`,
      studentName: currentUser.name,
      department: currentUser.department,
      rating: cultureRating,
      comment: cultureComment.trim(),
      date: 'Şimdi',
    });

    setCultureComment('');
    setCultureRating(5);
    setCultureSubmittedMsg(
      selectedCultureType === 'book'
        ? 'Ayın Kitabı için puan ve yorumunuz eklendi!'
        : 'Ayın Filmi için puan ve yorumunuz eklendi!'
    );
    setTimeout(() => setCultureSubmittedMsg(''), 3500);
  };

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;

    onAddGardenDeal({
      id: `deal-${Date.now()}`,
      vendor: dealVendor,
      vendorBadge:
        dealVendor === 'Coffee Hub'
          ? '☕ Coffee Hub Bahçe'
          : '🛒 MigrosJet Kampüs',
      vendorColor:
        dealVendor === 'Coffee Hub'
          ? 'from-[#142E2C] to-[#2B524F]'
          : 'from-[#FF8A3D] to-[#D95B16]',
      accentTag: dealTag.trim() || 'ÖZEL FIRSAT',
      title: dealTitle.trim(),
      description:
        dealDesc.trim() ||
        `${dealVendor} bahçe şubesinde ABÜ öğrencilerine özel kampanya.`,
      validUntil: 'Bugün geçerli',
      addedBy: `${currentUser.name}${
        currentUser.titleBadges?.[0] ? ` (${currentUser.titleBadges[0]})` : ''
      }`,
      likes: 1,
    });

    setDealTitle('');
    setDealDesc('');
    setShowAddDealForm(false);
  };

  return (
    <div className="space-y-6 sm:space-y-7 pb-12">
      {/* 1. ÜST BAR: ACİL REVİR YARDIM BUTONU + DERS SAATLERİ (09:00-18:10) & ÖĞLE ARASI (11:40-12:20) DURUMU */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Okul Durumu & Ders Saatleri (09:00 - 18:10) */}
        <section
          className={`lg:col-span-8 rounded-[32px] p-6 sm:p-7 border transition-all flex flex-col justify-between gap-4 ${
            currentCampusMode.isOpen
              ? 'glass-petrol text-white'
              : 'bg-gradient-to-r from-rose-800/95 via-red-800/95 to-orange-800/95 backdrop-blur-xl text-white border-rose-400/40 shadow-glass-dark'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                <Building2 className="w-6 h-6 text-[#FF8A3D]" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#142E2C] text-xs font-black tracking-wide shadow-sm">
                    <span
                      className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                        currentCampusMode.isOpen ? 'bg-emerald-500' : 'bg-rose-600'
                      }`}
                    />
                    ABÜ: {currentCampusMode.badge}
                  </span>
                  <span className="text-xs font-extrabold text-[#A9C6C1] bg-white/10 px-3 py-1 rounded-full">
                    🕘 Ders Saatleri: {ABU_SCHEDULE_RULES.classStart} – {ABU_SCHEDULE_RULES.classEnd}
                  </span>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      isLunchBreakActive
                        ? 'bg-[#FF8A3D] text-white animate-pulse'
                        : 'bg-white/10 text-amber-200'
                    }`}
                  >
                    🍽️ Öğle Arası: {ABU_SCHEDULE_RULES.lunchStart} – {ABU_SCHEDULE_RULES.lunchEnd}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black leading-snug pt-0.5">
                  {currentCampusMode.title}
                </h2>
                <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                  {currentCampusMode.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModeSwitcher((prev) => !prev)}
              className="shrink-0 px-3.5 py-2 rounded-2xl bg-white/15 hover:bg-white/25 text-xs font-extrabold flex items-center gap-1.5 transition border border-white/15"
              title="Kampüs ve Öğle Arası senaryosunu test et"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FF8A3D]" />
              <span className="hidden sm:inline">Saat & Mod</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#A9C6C1] pt-3 border-t border-white/15">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#FF8A3D]" />
              <span>
                Durum:{' '}
                <strong className="text-white">
                  {isLunchBreakActive
                    ? 'Şu An Öğle Arası (11:40 - 12:20) • Öğrenci İşleri & Ofisler Kapalı'
                    : 'Ders Oturumları Devam Ediyor (09:00 - 18:10)'}
                </strong>
              </span>
            </span>

            <button
              type="button"
              onClick={onToggleLunchBreakSimulation}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition ${
                isLunchBreakActive
                  ? 'bg-[#FF8A3D] text-white shadow-sm'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {isLunchBreakActive
                ? '⏱️ Öğle Arası (11:40-12:20) Aktif (Kapat)'
                : '⏱️ 11:40-12:20 Öğle Arasını Test Et'}
            </button>
          </div>

          {showModeSwitcher && (
            <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-md space-y-2.5 border border-white/10">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#A9C6C1]">
                Okul Durum Senaryosu:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CAMPUS_STATUS_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onChangeCampusMode(m.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition ${
                      campusModeId === m.id
                        ? 'bg-[#FF8A3D] text-white shadow-sm'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {m.badge}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. ACİL REVİR / SAĞLIK YARDIMI KARTI & BUTONU (4 cols on Desktop) */}
        <section className="lg:col-span-4 rounded-[32px] p-6 bg-gradient-to-br from-rose-600 via-red-600 to-[#FF8A3D] text-white shadow-glass-dark border border-rose-300/40 flex flex-col justify-between gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-rose-700 text-xs font-black uppercase shadow-sm">
                <HeartPulse className="w-4 h-4 animate-pulse" />
                <span>Acil Sağlık & Revir</span>
              </span>
              <span className="text-xs font-bold text-white/90">
                A-Blok Zemin Kat
              </span>
            </div>

            <h3 className="text-lg font-black leading-snug">
              🚨 Acil Revir / Sağlık Yardımı
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Revir her zaman açık olmadığından acil durumda nöbetçi sağlık görevlisini doğrudan arayın veya konum bildirin.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenInfirmaryModal}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <HeartPulse className="w-5 h-5 text-rose-600" />
            <span>Acil Revir & Görevli Numarasını Aç</span>
          </button>
        </section>
      </div>

      {/* 2. KİŞİSEL ANLIK DURUM SEÇİCİ (FERAH, PARMAK DOSTU BAR) */}
      <section className="glass-card rounded-[32px] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
              Anlık Kişisel Durumun (Status Badge)
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#142E2C] mt-0.5">
              Ortak ağdaki tüm ABÜ öğrencileri şu an nerede olduğunu doğrudan görür:
            </p>
          </div>
          {(() => {
            const currentSt =
              STATUS_OPTIONS.find((s) => s.id === currentUser.status) ||
              STATUS_OPTIONS[0];
            return (
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black border ${currentSt.badgeClass}`}
              >
                <span>{currentSt.emoji}</span>
                <span>{currentSt.label}</span>
              </span>
            );
          })()}
        </div>

        <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto pb-1 snap-x">
          {STATUS_OPTIONS.map((st) => {
            const active = currentUser.status === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateMyStatus(st.id)}
                className={`snap-start shrink-0 min-w-[92px] sm:min-w-0 flex flex-col items-center justify-center py-3 px-3 rounded-2xl border text-xs font-extrabold transition ${
                  active
                    ? 'bg-[#142E2C] text-white border-[#142E2C] shadow-md scale-[1.02]'
                    : 'bg-white/75 text-[#142E2C] border-[#142E2C]/15 hover:bg-white'
                }`}
              >
                <span className="text-xl leading-none mb-1.5">{st.emoji}</span>
                <span className="truncate w-full text-center">{st.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ÖĞRENCİ İŞLERİ (11:40-12:20 ÖĞLE ARASI KURALI) + YÜRÜYEN MERDİVEN ALARMI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Öğrenci İşleri Canlı Durum Kartı (6 cols on Desktop) */}
        <section className="lg:col-span-6 glass-card rounded-[32px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#142E2C]">
                    {STUDENT_AFFAIRS_INFO.unitName}
                  </h3>
                  <p className="text-xs text-[#3A5A58] font-medium">
                    📍 {STUDENT_AFFAIRS_INFO.location} • Mesai: {STUDENT_AFFAIRS_INFO.workHours}
                  </p>
                </div>
              </div>

              {/* Automatic 11:40 - 12:20 Lunch Break Badge */}
              <span
                className={`px-3.5 py-1.5 rounded-full text-xs font-black shadow-sm ${
                  isLunchBreakActive
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isLunchBreakActive
                  ? '⛔ Öğle arasında kapalıdır'
                  : '🟢 Açık • İşlem Alınıyor'}
              </span>
            </div>

            {/* Warning / Info Box for 11:40 - 12:20 Rule */}
            <div
              className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed font-semibold ${
                isLunchBreakActive
                  ? 'bg-rose-500/15 border-rose-500/35 text-rose-950'
                  : 'glass-tile text-[#142E2C]'
              }`}
            >
              {isLunchBreakActive ? (
                <div className="space-y-1">
                  <p className="font-black text-rose-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Öğrenci İşleri şu an öğle arasında kapalıdır (11:40 – 12:20)!
                    </span>
                  </p>
                  <p className="text-xs text-rose-900">
                    {STUDENT_AFFAIRS_INFO.lunchClosedDetail}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-black text-[#142E2C]">
                    {STUDENT_AFFAIRS_INFO.openMessage}
                  </p>
                  <p className="text-xs text-[#3A5A58]">
                    {STUDENT_AFFAIRS_INFO.openDetail}{' '}
                    <strong className="text-[#FF8A3D]">
                      (Öğle Arası Kapanış: 11:40 – 12:20)
                    </strong>
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {STUDENT_AFFAIRS_INFO.services.map((srv) => (
                <div
                  key={srv}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/65 border border-white/70 text-xs font-bold text-[#142E2C] flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF8A3D] shrink-0" />
                  <span className="truncate">{srv}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#142E2C]/10 text-xs font-bold text-[#3A5A58]">
            <span>📞 {STUDENT_AFFAIRS_INFO.phone}</span>
            <span>✉️ {STUDENT_AFFAIRS_INFO.email}</span>
          </div>
        </section>

        {/* Yürüyen Merdiven Çalışmıyor Alarmı (!) Widget (6 cols on Desktop) */}
        <section
          className={`lg:col-span-6 rounded-[32px] p-6 border transition-all flex flex-col justify-between gap-4 ${
            escalatorState.isWorking
              ? 'glass-card border-emerald-500/40'
              : 'bg-gradient-to-br from-[#FF8A3D] via-[#E8661B] to-rose-600 text-white border-amber-300/50 shadow-glass-dark'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wide ${
                  escalatorState.isWorking
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#142E2C] text-[#FF8A3D] shadow-md'
                }`}
              >
                {escalatorState.isWorking ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MERDİVEN ÇALIŞIYOR ✅</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-[#FF8A3D]" />
                    <span>CANLI ALARM: MERDİVEN BOZUK! 🚨</span>
                  </>
                )}
              </span>
              <span
                className={`text-xs font-extrabold ${
                  escalatorState.isWorking ? 'text-[#3A5A58]' : 'text-white/90'
                }`}
              >
                👥 {escalatorState.confirmCount} öğrenci doğruladı
              </span>
            </div>

            <div
              className={`p-4 rounded-2xl font-black text-sm leading-relaxed ${
                escalatorState.isWorking
                  ? 'bg-emerald-500/15 text-[#142E2C] border border-emerald-500/25'
                  : 'bg-black/25 text-white border border-white/20 shadow-inner'
              }`}
            >
              {escalatorState.isWorking
                ? escalatorState.workingHeadline
                : '⚠️ Dikkat: Yürüyen merdiven yine çalışmıyor, bacak antrenmanı günü! 🦵🔥'}
            </div>

            <p
              className={`text-xs font-semibold ${
                escalatorState.isWorking ? 'text-[#3A5A58]' : 'text-white/90'
              }`}
            >
              📍 {escalatorState.location} • Son güncelleme:{' '}
              {escalatorState.lastReportedBy} ({escalatorState.lastUpdated})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onUpdateEscalator(false)}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 ${
                !escalatorState.isWorking
                  ? 'bg-[#142E2C] text-white shadow-md ring-2 ring-white/50'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
              }`}
            >
              <span>🚨 Merdiven Bozuldu!</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateEscalator(true)}
              className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-1.5 ${
                escalatorState.isWorking
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-white text-[#142E2C] hover:bg-white/90 shadow-sm'
              }`}
            >
              <span>✅ Düzeldi, Çalışıyor</span>
            </button>
          </div>
        </section>
      </div>

      {/* 4. HOCALARIN OFİS SAATLERİ / AKADEMİK KADRO (Departman Filtreli & 11:40-12:20 Notlu) */}
      <section className="glass-card rounded-[32px] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#A9C6C1] flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 text-[#FF8A3D]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#142E2C]">
                  Akademik Kadro & Hocaların Ofis Saatleri
                </h3>
                <span className="px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-950 border border-amber-600/30 text-xs font-black">
                  🍽️ 11:40 – 12:20 Öğle Arası Ofisler Kapalı
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3A5A58] font-medium mt-0.5">
                Bölüm hocalarının haftalık görüşme saatleri ve oda bilgileri (11:40–12:20 öğle arasında hocalarımız ofislerinde bulunmamaktadır)
              </p>
            </div>
          </div>
        </div>

        {/* Department Filter Pills (Horizontal Touch Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 snap-x">
          {profDepartments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setProfDeptFilter(dept)}
              className={`snap-start shrink-0 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border transition ${
                profDeptFilter === dept
                  ? 'bg-[#142E2C] text-white border-[#142E2C] shadow-sm'
                  : 'bg-white/75 text-[#142E2C] border-[#142E2C]/15 hover:bg-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Horizontal Carousel on Mobile, Grid on Desktop */}
        <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {filteredProfessors.map((prof) => (
            <div
              key={prof.id}
              className="snap-start shrink-0 w-[85vw] sm:w-[340px] lg:w-auto glass-tile p-5 rounded-3xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#142E2C] text-[#FF8A3D] text-[10px] font-black uppercase">
                      {prof.department}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-[#142E2C] mt-1.5">
                      {prof.name}
                    </h4>
                    <p className="text-xs font-bold text-[#3A5A58]">{prof.title}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black shrink-0 ${
                      isLunchBreakActive
                        ? 'bg-rose-600 text-white'
                        : 'bg-emerald-500/20 text-emerald-950 border border-emerald-600/30'
                    }`}
                  >
                    {isLunchBreakActive ? 'Öğle Molasında' : 'Ofis Günü Aktif'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-white/80 space-y-1 text-xs">
                  <p className="font-extrabold text-[#142E2C]">
                    🗓️ {prof.officeDays} • 🕒 {prof.officeTime}
                  </p>
                  <p className="font-semibold text-[#3A5A58]">
                    📍 {prof.officeLocation}
                  </p>
                  <p className="text-[11px] text-[#3A5A58] pt-0.5">{prof.topics}</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-950">
                  ⚠️ Not: {prof.lunchNote}
                </div>
                <a
                  href={`mailto:${prof.email}`}
                  className="text-xs font-extrabold text-[#142E2C] hover:text-[#FF8A3D] inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>{prof.email}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BAHÇE KAMPANYALARI (MigrosJet & Coffee Hub Yatay Kaydırılabilir Karusel) */}
      <section className="glass-card rounded-[32px] p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#142E2C]">
                  ABÜ Bahçe Fırsatları (Coffee Hub & MigrosJet)
                </h3>
                <span className="px-3 py-0.5 rounded-full bg-[#FF8A3D]/20 text-[#B84A0E] text-xs font-black border border-[#FF8A3D]/30">
                  Kaydırılabilir Karusel
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3A5A58] font-medium">
                Okul bahçesindeki güncel kahve, sandviç ve market indirimleri
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddDealForm((prev) => !prev)}
            className="px-4 py-2.5 rounded-full bg-[#FF8A3D] hover:bg-[#E66B1F] text-white text-xs font-black inline-flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Fırsat Ekle</span>
          </button>
        </div>

        {showAddDealForm && (
          <form
            onSubmit={handleCreateDeal}
            className="glass-tile p-5 rounded-3xl space-y-3 border border-[#FF8A3D]/40"
          >
            <p className="text-xs font-black text-[#142E2C]">
              Bahçede Gördüğün Yeni Kampanyayı Paylaş:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={dealVendor}
                onChange={(e) => setDealVendor(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
              >
                <option value="Coffee Hub">☕ Coffee Hub (Bahçe)</option>
                <option value="MigrosJet">🛒 MigrosJet (Bahçe)</option>
              </select>
              <input
                type="text"
                value={dealTag}
                onChange={(e) => setDealTag(e.target.value)}
                placeholder="Etiket (Örn: 2 AL 1 ÖDE)"
                className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
              />
            </div>
            <input
              type="text"
              value={dealTitle}
              onChange={(e) => setDealTitle(e.target.value)}
              placeholder="Kampanya Başlığı (Örn: Iced Latte + Cookie 125 TL)"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C]"
            />
            <input
              type="text"
              value={dealDesc}
              onChange={(e) => setDealDesc(e.target.value)}
              placeholder="Kısa açıklama veya saat aralığı..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#142E2C]/15 text-xs text-[#142E2C]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddDealForm(false)}
                className="px-4 py-2 rounded-xl bg-white text-xs font-bold text-[#3A5A58]"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#142E2C] text-white text-xs font-extrabold"
              >
                Bahçe Fırsatlarına Ekle
              </button>
            </div>
          </form>
        )}

        {/* Horizontal Scrollable Carousel on Mobile, 4-col Grid on XL Desktop */}
        <div className="flex xl:grid xl:grid-cols-4 gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
          {gardenDeals.map((deal) => (
            <div
              key={deal.id}
              className="snap-start shrink-0 w-[82vw] sm:w-[320px] xl:w-auto glass-tile p-5 rounded-3xl flex flex-col justify-between space-y-3 hover:bg-white/80 transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${deal.vendorColor} text-white text-[11px] font-extrabold`}
                  >
                    {deal.vendorBadge}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FF8A3D]/20 text-[#B84A0E] text-[11px] font-black border border-[#FF8A3D]/30">
                    {deal.accentTag}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-black text-[#142E2C] leading-snug">
                  {deal.title}
                </h4>
                <p className="text-xs text-[#3A5A58] leading-relaxed">
                  {deal.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#142E2C]/10 flex items-center justify-between text-xs text-[#3A5A58]">
                <span className="truncate font-semibold">⏰ {deal.validUntil}</span>
                <button
                  type="button"
                  onClick={() => onLikeGardenDeal(deal.id)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-[#FF8A3D] hover:text-white text-[#142E2C] font-extrabold inline-flex items-center gap-1.5 transition shadow-sm"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{deal.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. KÜTÜPHANE & 4 ODA + YEMEKHANE (300 TL) BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kütüphane Doluluk ve 4 Özel Çalışma Odası (7 cols on Desktop) */}
        <section className="lg:col-span-7 glass-card rounded-[32px] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#A9C6C1] flex items-center justify-center shrink-0">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-black text-[#142E2C]">
                      ABÜ Kütüphane & 4 Özel Oda
                    </h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-black border ${occMeta.badgeClass}`}
                    >
                      %{occupancyPercent} • {occMeta.label}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3A5A58] font-medium">
                    {libraryData.currentUsers} / {libraryData.totalCapacity} koltuk dolu •{' '}
                    {occMeta.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('library_food')}
                className="text-xs font-extrabold text-[#142E2C] hover:text-[#FF8A3D] inline-flex items-center gap-1"
              >
                <span>Kütüphane Sekmesi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="w-full h-3.5 rounded-full bg-[#142E2C]/10 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${occMeta.barClass} transition-all duration-500`}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-extrabold text-[#3A5A58]">
                <span>🟢 Tenha (%0-39)</span>
                <span>🟠 Orta (%40-74)</span>
                <span>🔴 Yoğun (%75+)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {libraryData.studyRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => onToggleStudyRoom(room.id)}
                  className={`p-4 rounded-3xl border text-left transition flex flex-col justify-between min-h-[104px] ${
                    room.isAvailable
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-600/35'
                      : 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-600/35'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs sm:text-sm font-black text-[#142E2C]">
                      {room.name}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black text-white ${
                        room.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {room.isAvailable ? 'Müsait' : 'Dolu'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#3A5A58]">
                    {room.capacity}
                  </p>
                  <p className="text-[11px] font-semibold text-[#142E2C] truncate mt-1">
                    {room.isAvailable ? 'Hemen Kullan' : room.availableAt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#3A5A58] font-semibold">
            💡 Oda durumunu (“Müsait” / “Dolu”) değiştirmek için ilgili odaya dokunabilirsiniz.
          </p>
        </section>

        {/* Günün Yemekhane Menüsü Özeti (Sabit 300 TL + Kalori Detay Modalı) (5 cols on Desktop) */}
        <section
          onClick={onOpenCafeteriaModal}
          className="lg:col-span-5 cursor-pointer glass-card hover:bg-white/85 rounded-[32px] p-6 space-y-4 flex flex-col justify-between transition group"
        >
          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#142E2C] group-hover:text-[#FF8A3D] transition">
                    Günün Yemekhane Menüsü
                  </h3>
                  <p className="text-xs text-[#3A5A58] font-medium">
                    {todayMenu.dateText} • Toplam {todayMenu.totalCalories} kcal
                  </p>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-[#142E2C] text-[#FF8A3D] text-xs font-black shadow-sm shrink-0">
                300 TL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {todayMenu.items.map((item) => (
                <div
                  key={item.category}
                  className="p-3 rounded-2xl glass-tile flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{item.icon}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase text-[#FF8A3D] block">
                        {item.category}
                      </span>
                      <p className="text-xs font-bold text-[#142E2C] truncate">
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#3A5A58] shrink-0">
                    {item.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCafeteriaModal();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-[#142E2C] group-hover:bg-[#FF8A3D] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Menü & Kalori Dağılım Grafiğini Aç</span>
          </button>
        </section>
      </div>

      {/* 7. SABİT INLINE KART: AYIN KİTABI & AYIN FİLMİ (POP-UP YOK, SAYFA AKIŞI İÇİNDE PUANLAMA & YORUM) */}
      <section className="glass-card rounded-[32px] p-6 sm:p-7 space-y-5 border border-white/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#142E2C]">
                  Ayın Kitabı & Ayın Filmi Seçkisi
                </h3>
                <span className="px-3 py-0.5 rounded-full bg-[#142E2C] text-[#A9C6C1] text-[11px] font-black">
                  {cultureData.monthTitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3A5A58] font-medium">
                Sayfa içinden doğrudan detayları incele, 5 üzerinden yıldız puanı ver ve yorum bırak
              </p>
            </div>
          </div>

          {/* Tab Switcher: Ayın Kitabı vs Ayın Filmi + Accordion Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#142E2C]/10 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedCultureType('book')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
                  selectedCultureType === 'book'
                    ? 'bg-[#142E2C] text-white shadow-sm'
                    : 'text-[#142E2C] hover:bg-white/60'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#FF8A3D]" />
                <span>Ayın Kitabı ({bookAvg} ★)</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCultureType('movie')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition ${
                  selectedCultureType === 'movie'
                    ? 'bg-[#142E2C] text-white shadow-sm'
                    : 'text-[#142E2C] hover:bg-white/60'
                }`}
              >
                <Film className="w-4 h-4 text-[#FF8A3D]" />
                <span>Ayın Filmi ({movieAvg} ★)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCultureExpanded((prev) => !prev)}
              className="p-2.5 rounded-2xl bg-white/80 hover:bg-white text-[#142E2C] border border-[#142E2C]/15 transition"
              title="Bölümü Daralt / Genişlet"
            >
              {cultureExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Dual Overview Cards Always Visible Inline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Book Summary Card */}
          <div
            onClick={() => {
              setSelectedCultureType('book');
              setCultureExpanded(true);
            }}
            className={`cursor-pointer p-5 rounded-3xl border transition space-y-2.5 ${
              selectedCultureType === 'book'
                ? 'bg-gradient-to-br from-[#142E2C] via-[#1D3534] to-[#3A5A58] text-white border-[#142E2C] shadow-md'
                : 'glass-tile text-[#142E2C] hover:bg-white/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-black uppercase ${
                  selectedCultureType === 'book' ? 'text-[#A9C6C1]' : 'text-[#3A5A58]'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#FF8A3D]" />
                <span>📖 Ayın Kitabı</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-xs font-black">
                ★ {bookAvg} / 5 ({cultureData.book.reviews.length} oy)
              </span>
            </div>
            <div>
              <h4 className="text-base font-black">{cultureData.book.title}</h4>
              <p
                className={`text-xs font-semibold ${
                  selectedCultureType === 'book' ? 'text-white/80' : 'text-[#3A5A58]'
                }`}
              >
                {cultureData.book.creator} • {cultureData.book.meta}
              </p>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                selectedCultureType === 'book' ? 'text-white/90' : 'text-[#1D3534]'
              }`}
            >
              {cultureData.book.summary}
            </p>
          </div>

          {/* Movie Summary Card */}
          <div
            onClick={() => {
              setSelectedCultureType('movie');
              setCultureExpanded(true);
            }}
            className={`cursor-pointer p-5 rounded-3xl border transition space-y-2.5 ${
              selectedCultureType === 'movie'
                ? 'bg-gradient-to-br from-[#142E2C] via-[#1D3534] to-[#3A5A58] text-white border-[#142E2C] shadow-md'
                : 'glass-tile text-[#142E2C] hover:bg-white/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-black uppercase ${
                  selectedCultureType === 'movie' ? 'text-[#A9C6C1]' : 'text-[#3A5A58]'
                }`}
              >
                <Film className="w-4 h-4 text-[#FF8A3D]" />
                <span>🎬 Ayın Filmi</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-xs font-black">
                ★ {movieAvg} / 5 ({cultureData.movie.reviews.length} oy)
              </span>
            </div>
            <div>
              <h4 className="text-base font-black">{cultureData.movie.title}</h4>
              <p
                className={`text-xs font-semibold ${
                  selectedCultureType === 'movie' ? 'text-white/80' : 'text-[#3A5A58]'
                }`}
              >
                {cultureData.movie.originalTitle} • {cultureData.movie.creator}
              </p>
            </div>
            <p
              className={`text-xs leading-relaxed ${
                selectedCultureType === 'movie' ? 'text-white/90' : 'text-[#1D3534]'
              }`}
            >
              {cultureData.movie.summary}
            </p>
          </div>
        </div>

        {/* Inline Accordion Details: 5-Star Rating Form + Student Reviews */}
        {cultureExpanded && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2 border-t border-[#142E2C]/10">
            {/* Inline 5-Star Rating Form (5 cols on Desktop) */}
            <form
              onSubmit={handleInlineCultureReviewSubmit}
              className="lg:col-span-5 glass-tile rounded-3xl p-5 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#142E2C] flex items-center gap-1.5">
                  <MessageSquarePlus className="w-4 h-4 text-[#FF8A3D]" />
                  <span>
                    “{activeCultureItem.title}” İçin Puan Ver
                  </span>
                </h4>
                <span className="text-xs font-black text-white bg-[#FF8A3D] px-2.5 py-0.5 rounded-full">
                  {cultureRating} / 5 ★
                </span>
              </div>

              <p className="text-xs font-bold text-[#3A5A58] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
                <span>{activeCultureItem.discussionInfo}</span>
              </p>

              <div className="flex items-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const filled = (cultureHoverRating || cultureRating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setCultureHoverRating(starValue)}
                      onMouseLeave={() => setCultureHoverRating(0)}
                      onClick={() => setCultureRating(starValue)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-black flex items-center justify-center gap-1 transition ${
                        filled
                          ? 'bg-[#142E2C] border-[#142E2C] text-[#FF8A3D] shadow-sm'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          filled
                            ? 'fill-[#FF8A3D] text-[#FF8A3D]'
                            : 'text-slate-300'
                        }`}
                      />
                      <span>{starValue}</span>
                    </button>
                  );
                })}
              </div>

              <textarea
                rows={2}
                value={cultureComment}
                onChange={(e) => setCultureComment(e.target.value)}
                placeholder={`"${activeCultureItem.title}" hakkındaki yorumunu buraya yaz...`}
                className="w-full p-3.5 rounded-2xl bg-white border border-[#142E2C]/15 text-xs text-[#142E2C]"
              />

              {cultureSubmittedMsg && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-500/20 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{cultureSubmittedMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-2xl bg-[#FF8A3D] hover:bg-[#E66B1F] text-white font-black text-xs shadow-sm transition"
              >
                Puanı ({cultureRating}/5 ★) ve Yorumu Kaydet
              </button>
            </form>

            {/* Inline Student Reviews List (7 cols on Desktop) */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
                  {activeCultureItem.type} Öğrenci Değerlendirmeleri ({activeCultureItem.reviews.length})
                </h4>
                <span className="text-xs font-black text-[#142E2C]">
                  Ortalama: ★ {activeCultureAvg} / 5.0
                </span>
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {activeCultureItem.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl glass-tile space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#142E2C]">
                        {rev.studentName}{' '}
                        <span className="font-semibold text-[11px] text-[#3A5A58]">
                          • {rev.department}
                        </span>
                      </span>
                      <span className="text-xs font-black text-[#FF8A3D]">
                        {'★'.repeat(rev.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-[#1D3534] leading-relaxed">
                      {rev.comment}
                    </p>
                    <p className="text-[10px] text-[#3A5A58] font-medium">
                      {rev.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 8. ORTAK KAMPÜS AĞI (YATAY KAYDIRILABİLİR FERAH ÖĞRENCİ KARUSELİ) */}
      <section className="glass-card rounded-[32px] p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#142E2C] text-[#A9C6C1] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#142E2C]">
                ABÜ Ortak Öğrenci Ağı & Görevliler
              </h3>
              <p className="text-xs text-[#3A5A58] font-medium">
                Takip şartı olmadan tüm ABÜ öğrencilerinin anlık durumları ve görev rozetleri
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenNetworkModal(null)}
            className="text-xs font-black text-[#FF8A3D] hover:underline inline-flex items-center gap-1"
          >
            <span>Tüm Ağ ({allStudentsWithCurrent.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 snap-x snap-mandatory">
          {allStudentsWithCurrent.map((stu) => {
            const st =
              STATUS_OPTIONS.find((s) => s.id === stu.status) ||
              STATUS_OPTIONS[0];
            const isMe = stu.email === currentUser.email;
            return (
              <button
                key={stu.id}
                type="button"
                onClick={() => onOpenNetworkModal(stu)}
                className="snap-start shrink-0 w-60 p-4 rounded-3xl glass-tile hover:bg-white transition flex flex-col justify-between text-left gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                      stu.avatarBg || 'from-[#142E2C] to-[#3A5A58]'
                    } text-white font-black text-xs flex items-center justify-center shrink-0`}
                  >
                    {stu.initials}
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${st.badgeClass}`}
                  >
                    {st.emoji} {st.label}
                  </span>
                </div>

                <div>
                  <p className="text-xs sm:text-sm font-black text-[#142E2C] truncate">
                    {isMe ? `${stu.name} (Sen)` : stu.name}
                  </p>
                  {stu.titleBadges?.[0] && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black truncate max-w-full">
                      🏅 {stu.titleBadges[0]}
                    </span>
                  )}
                  <p className="text-[11px] text-[#3A5A58] truncate mt-1">
                    {stu.department}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ACTIVE SAFETY BANNER IF UNRESOLVED */}
      {activeSafetyReport && (
        <div className="glass-card rounded-[30px] p-5 border-2 border-rose-500/45 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase">
                  Aktif Bahçe Güvenlik Uyarısı
                </span>
                <span className="text-xs font-black text-[#142E2C]">
                  📍 {activeSafetyReport.location} • {activeSafetyReport.time}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1D3534] mt-1">
                {activeSafetyReport.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('safety')}
            className="px-4 py-2.5 rounded-full bg-[#142E2C] hover:bg-[#1D3534] text-white text-xs font-extrabold shrink-0 self-start sm:self-center transition"
          >
            Güvenlik & Report Ekranı →
          </button>
        </div>
      )}
    </div>
  );
}
