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
  AlertTriangle,
  CheckCircle2,
  Coffee,
  ShoppingBag,
  Plus,
  ShieldAlert,
  Award,
  ThumbsUp,
  BarChart3,
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
  escalatorState,
  onUpdateEscalator,
  gardenDeals,
  onAddGardenDeal,
  onLikeGardenDeal,
  safetyReports,
  cultureData,
  onOpenCultureModal,
  libraryData,
  onToggleStudyRoom,
  students,
  onOpenNetworkModal,
  onOpenCafeteriaModal,
  onNavigateTab,
}) {
  const [showModeSwitcher, setShowModeSwitcher] = useState(false);
  const [showAddDealForm, setShowAddDealForm] = useState(false);
  const [dealVendor, setDealVendor] = useState('Coffee Hub');
  const [dealTag, setDealTag] = useState('%50 İNDİRİM');
  const [dealTitle, setDealTitle] = useState('');
  const [dealDesc, setDealDesc] = useState('');

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

  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;

    onAddGardenDeal({
      id: `deal-${Date.now()}`,
      vendor: dealVendor,
      vendorBadge:
        dealVendor === 'Coffee Hub' ? '☕ Coffee Hub Bahçe' : '🛒 MigrosJet Kampüs',
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
    <div className="space-y-5 pb-10">
      {/* TOP FULL-WIDTH ROW: OKUL DURUMU + YÜRÜYEN MERDİVEN CANLI ALARM (!) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 1. OKUL DURUM GÖSTERGESİ (7 cols on Desktop) */}
        <section
          className={`lg:col-span-7 rounded-[30px] p-5 border transition-all ${
            currentCampusMode.isOpen
              ? 'glass-petrol text-white'
              : 'bg-gradient-to-r from-rose-800/90 via-red-800/90 to-orange-800/90 backdrop-blur-xl text-white border-rose-400/40 shadow-glass-dark'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                <Building2 className="w-6 h-6 text-[#FF8A3D]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white text-[#142E2C] text-[11px] font-black tracking-wide shadow-sm">
                    <span
                      className={`w-2 h-2 rounded-full animate-pulse ${
                        currentCampusMode.isOpen ? 'bg-emerald-500' : 'bg-rose-600'
                      }`}
                    />
                    ABÜ DURUMU: {currentCampusMode.badge}
                  </span>
                  <span className="text-[11px] font-bold text-[#A9C6C1] bg-white/10 px-2.5 py-0.5 rounded-full">
                    {currentCampusMode.temperature}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black mt-2 leading-snug">
                  {currentCampusMode.title}
                </h2>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  {currentCampusMode.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModeSwitcher((prev) => !prev)}
              className="shrink-0 px-3 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 text-[11px] font-extrabold flex items-center gap-1.5 transition border border-white/15"
              title="Okul durum senaryosunu test et"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF8A3D]" />
              <span>Senaryo</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A9C6C1] mt-4 pt-3 border-t border-white/15">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" />
              Durum: <strong className="text-white">{currentCampusMode.reasonType}</strong>
            </span>
            <span>📍 {currentCampusMode.ringNext}</span>
          </div>

          {showModeSwitcher && (
            <div className="mt-3 p-3 rounded-2xl bg-black/25 backdrop-blur-md space-y-2 border border-white/10">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#A9C6C1]">
                Okul Durum Göstergesini Test Et:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {CAMPUS_STATUS_MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onChangeCampusMode(m.id)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition ${
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

        {/* 2. YÜRÜYEN MERDİVEN ÇALIŞMIYOR ALARMI (!) WIDGET (5 cols on Desktop) */}
        <section
          className={`lg:col-span-5 rounded-[30px] p-5 border transition-all flex flex-col justify-between ${
            escalatorState.isWorking
              ? 'glass-card border-emerald-500/40'
              : 'bg-gradient-to-br from-[#FF8A3D] via-[#E8661B] to-rose-600 text-white border-amber-300/50 shadow-glass-dark'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${
                  escalatorState.isWorking
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#142E2C] text-[#FF8A3D] shadow-md animate-bounce'
                }`}
              >
                {escalatorState.isWorking ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>MERDİVEN ÇALIŞIYOR ✅</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FF8A3D]" />
                    <span>CANLI ALARM: MERDİVEN BOZUK! 🚨</span>
                  </>
                )}
              </span>
              <span
                className={`text-[11px] font-extrabold ${
                  escalatorState.isWorking ? 'text-[#3A5A58]' : 'text-white/90'
                }`}
              >
                👥 {escalatorState.confirmCount} öğrenci bildirdi
              </span>
            </div>

            {/* Witty Alert Banner */}
            <div
              className={`p-3 rounded-2xl font-black text-xs sm:text-sm leading-snug ${
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
              className={`text-[11px] font-semibold ${
                escalatorState.isWorking ? 'text-[#3A5A58]' : 'text-white/90'
              }`}
            >
              📍 {escalatorState.location} • Son güncelleme: {escalatorState.lastReportedBy} ({escalatorState.lastUpdated})
            </p>
          </div>

          {/* 1-Click Trigger Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-current/10">
            <button
              type="button"
              onClick={() => onUpdateEscalator(false)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
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
              className={`py-2.5 px-3 rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
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

      {/* LIVE GARDEN SAFETY BANNER IF ANY UNRESOLVED ALERT EXISTS */}
      {activeSafetyReport && (
        <div className="glass-card rounded-[26px] p-4 border-2 border-rose-500/45 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase">
                  Aktif Bahçe Güvenlik Uyarısı
                </span>
                <span className="text-xs font-black text-[#142E2C]">
                  📍 {activeSafetyReport.location}
                </span>
                <span className="text-[11px] font-bold text-[#3A5A58]">
                  • {activeSafetyReport.time}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#1D3534] mt-0.5">
                {activeSafetyReport.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('safety')}
            className="px-4 py-2 rounded-full bg-[#142E2C] hover:bg-[#1D3534] text-white text-xs font-extrabold shrink-0 self-start sm:self-center transition"
          >
            Güvenlik & Report Ekranı →
          </button>
        </div>
      )}

      {/* BENTO GRID MIDDLE ROW: BAHÇE KAMPANYALARI (MigrosJet & Coffee Hub) + KİŞİSEL DURUM & ORTAK AĞ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3. BAHÇE KAMPANYALARI: MIGROSJET & COFFEE HUB (7 cols on Desktop) */}
        <section className="lg:col-span-7 glass-card rounded-[30px] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0 shadow-sm">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-[#142E2C]">
                    ABÜ Bahçe Fırsatları (Coffee Hub & MigrosJet)
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D]/20 text-[#B84A0E] text-[10px] font-black border border-[#FF8A3D]/30">
                    Canlı Kampanyalar
                  </span>
                </div>
                <p className="text-xs text-[#3A5A58] font-medium">
                  Okul bahçesindeki güncel kahve, sandviç ve market indirimleri
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddDealForm((prev) => !prev)}
              className="px-3.5 py-2 rounded-full bg-[#FF8A3D] hover:bg-[#E66B1F] text-white text-xs font-extrabold inline-flex items-center gap-1 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Fırsat Ekle</span>
            </button>
          </div>

          {/* Add New Garden Deal Form */}
          {showAddDealForm && (
            <form
              onSubmit={handleCreateDeal}
              className="glass-tile p-4 rounded-3xl space-y-3 border border-[#FF8A3D]/40"
            >
              <p className="text-xs font-black text-[#142E2C]">
                Bahçede Yeni Gördüğün İndirimi / Kampanyayı Paylaş:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={dealVendor}
                  onChange={(e) => setDealVendor(e.target.value)}
                  className="px-3 py-2 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
                >
                  <option value="Coffee Hub">☕ Coffee Hub (Bahçe)</option>
                  <option value="MigrosJet">🛒 MigrosJet (Bahçe)</option>
                </select>
                <input
                  type="text"
                  value={dealTag}
                  onChange={(e) => setDealTag(e.target.value)}
                  placeholder="Etiket (Örn: 2 AL 1 ÖDE)"
                  className="px-3 py-2 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
                />
              </div>
              <input
                type="text"
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                placeholder="Kampanya Başlığı (Örn: Iced Latte + Cookie 125 TL)"
                className="w-full px-3.5 py-2 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C]"
              />
              <input
                type="text"
                value={dealDesc}
                onChange={(e) => setDealDesc(e.target.value)}
                placeholder="Kısa açıklama veya saat aralığı..."
                className="w-full px-3.5 py-2 rounded-2xl bg-white border border-[#142E2C]/15 text-xs text-[#142E2C]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDealForm(false)}
                  className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-[#3A5A58]"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#142E2C] text-white text-xs font-extrabold"
                >
                  Bahçe Fırsatlarına Ekle
                </button>
              </div>
            </form>
          )}

          {/* Garden Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gardenDeals.map((deal) => (
              <div
                key={deal.id}
                className="glass-tile p-4 rounded-3xl flex flex-col justify-between space-y-2.5 hover:bg-white/80 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full bg-gradient-to-r ${deal.vendorColor} text-white text-[10px] font-extrabold`}
                    >
                      {deal.vendorBadge}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D]/20 text-[#B84A0E] text-[10px] font-black border border-[#FF8A3D]/30">
                      {deal.accentTag}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-[#142E2C] leading-snug">
                    {deal.title}
                  </h4>
                  <p className="text-[11px] text-[#3A5A58] leading-relaxed">
                    {deal.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#142E2C]/10 flex items-center justify-between text-[10px] text-[#3A5A58]">
                  <span className="truncate max-w-[170px] font-semibold">
                    ⏰ {deal.validUntil}
                  </span>
                  <button
                    type="button"
                    onClick={() => onLikeGardenDeal(deal.id)}
                    className="px-2.5 py-1 rounded-full bg-white hover:bg-[#FF8A3D] hover:text-white text-[#142E2C] font-extrabold inline-flex items-center gap-1 transition shadow-sm"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{deal.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. KİŞİSEL DURUM SEÇİCİ + ABÜ ORTAK KAMPÜS AĞI & GÖREV ROZETLERİ (5 cols on Desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Personal Status Selector */}
          <section className="glass-card rounded-[30px] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
                  Anlık Kişisel Durumun (Status Badge)
                </h3>
                <p className="text-xs font-semibold text-[#142E2C] mt-0.5">
                  Ortak ağdaki tüm ABÜ öğrencileri durumunu görür:
                </p>
              </div>
              {(() => {
                const currentSt =
                  STATUS_OPTIONS.find((s) => s.id === currentUser.status) ||
                  STATUS_OPTIONS[0];
                return (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${currentSt.badgeClass}`}
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
                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border text-[11px] font-extrabold transition ${
                      active
                        ? 'bg-[#142E2C] text-white border-[#142E2C] shadow-md scale-[1.02]'
                        : 'bg-white/70 text-[#142E2C] border-[#142E2C]/15 hover:bg-white'
                    }`}
                  >
                    <span className="text-lg leading-none mb-1">{st.emoji}</span>
                    <span className="truncate w-full text-center">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Ortak Kampüs Ağı (Students with Title Badges) */}
          <section className="glass-card rounded-[30px] p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#142E2C] text-[#A9C6C1] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#142E2C]">
                    ABÜ Ortak Öğrenci Ağı & Görevliler
                  </h3>
                  <p className="text-[11px] text-[#3A5A58] font-medium">
                    Takip şartı yok • Topluluk görev rozetleriyle açık ağ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenNetworkModal(null)}
                className="text-xs font-black text-[#FF8A3D] hover:underline inline-flex items-center gap-0.5"
              >
                <span>Tümü ({allStudentsWithCurrent.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {allStudentsWithCurrent.slice(0, 4).map((stu) => {
                const st =
                  STATUS_OPTIONS.find((s) => s.id === stu.status) ||
                  STATUS_OPTIONS[0];
                const isMe = stu.email === currentUser.email;
                return (
                  <button
                    key={stu.id}
                    type="button"
                    onClick={() => onOpenNetworkModal(stu)}
                    className="w-full p-2.5 rounded-2xl glass-tile hover:bg-white transition flex items-center justify-between gap-2 text-left"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${
                          stu.avatarBg || 'from-[#142E2C] to-[#3A5A58]'
                        } text-white font-bold text-xs flex items-center justify-center shrink-0`}
                      >
                        {stu.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-black text-[#142E2C] truncate">
                            {isMe ? `${stu.name} (Sen)` : stu.name}
                          </p>
                          {stu.titleBadges?.[0] && (
                            <span className="px-2 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[9px] font-black truncate">
                              🏅 {stu.titleBadges[0]}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#3A5A58] truncate">
                          {stu.department} • 📍 {stu.locationNote}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${st.badgeClass}`}
                    >
                      {st.emoji} {st.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* BENTO GRID BOTTOM ROW: KÜTÜPHANE & 4 ODA + YEMEKHANE (300 TL & DETAY MODAL) + AYIN KİTABI/FİLMİ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 5. KÜTÜPHANE DOLULUK VE 4 ÖZEL ÇALIŞMA ODASI (5 cols on Desktop) */}
        <section className="lg:col-span-5 glass-card rounded-[30px] p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#142E2C] text-[#A9C6C1] flex items-center justify-center shrink-0">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-[#142E2C]">
                      ABÜ Kütüphane & 4 Oda
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${occMeta.badgeClass}`}
                    >
                      %{occupancyPercent} • {occMeta.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3A5A58] font-medium">
                    {libraryData.currentUsers} / {libraryData.totalCapacity} koltuk dolu
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab('library_food')}
                className="text-xs font-extrabold text-[#142E2C] hover:text-[#FF8A3D] inline-flex items-center gap-0.5"
              >
                <span>Detay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-[#142E2C]/10 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${occMeta.barClass} transition-all duration-500`}
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[#3A5A58]">
                <span>🟢 Tenha</span>
                <span>🟠 Orta</span>
                <span>🔴 Yoğun</span>
              </div>
            </div>

            {/* 4 Study Rooms */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {libraryData.studyRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => onToggleStudyRoom(room.id)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    room.isAvailable
                      ? 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-600/35'
                      : 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-600/35'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-[#142E2C]">
                      {room.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black text-white ${
                        room.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {room.isAvailable ? 'Müsait' : 'Dolu'}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-[#3A5A58] truncate">
                    {room.capacity} • {room.isAvailable ? 'Boş' : room.availableAt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-[#3A5A58] font-semibold text-center pt-1">
            💡 Oda durumunu değiştirmek için odaya dokunabilirsiniz
          </p>
        </section>

        {/* 6. GÜNÜN YEMEKHANE MENÜSÜ ÖZETİ (Sabit 300 TL + Kalori Detay Modalı) (4 cols on Desktop) */}
        <section
          onClick={onOpenCafeteriaModal}
          className="lg:col-span-4 cursor-pointer glass-card hover:bg-white/85 rounded-[30px] p-5 space-y-3.5 flex flex-col justify-between transition group"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#142E2C] group-hover:text-[#FF8A3D] transition">
                    Günün Yemekhane Menüsü
                  </h3>
                  <p className="text-[11px] text-[#3A5A58] font-medium">
                    {todayMenu.dateText} • {todayMenu.totalCalories} kcal
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#142E2C] text-[#FF8A3D] text-xs font-black shadow-sm shrink-0">
                300 TL
              </span>
            </div>

            <div className="space-y-1.5">
              {todayMenu.items.map((item) => (
                <div
                  key={item.category}
                  className="px-3 py-2 rounded-2xl glass-tile flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{item.icon}</span>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase text-[#FF8A3D] block">
                        {item.category}
                      </span>
                      <p className="text-xs font-bold text-[#142E2C] truncate">
                        {item.name}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#3A5A58] shrink-0">
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
            className="w-full py-2.5 px-4 rounded-2xl bg-[#142E2C] group-hover:bg-[#FF8A3D] text-white text-xs font-black flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Menü & Kalori Grafiği Detayını Aç</span>
          </button>
        </section>

        {/* 7. AYIN KİTABI VE AYIN FİLMİ KÜLTÜR SEÇKİSİ (3 cols on Desktop) */}
        <section className="lg:col-span-3 glass-petrol text-white rounded-[30px] p-5 flex flex-col justify-between space-y-3.5">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black">
                <Sparkles className="w-3 h-3" />
                Ayın Seçkisi
              </span>
              <button
                type="button"
                onClick={() => onOpenCultureModal('book')}
                className="text-[11px] font-extrabold text-[#A9C6C1] hover:text-white underline"
              >
                Pop-up Aç
              </button>
            </div>

            <div
              onClick={() => onOpenCultureModal('book')}
              className="cursor-pointer p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[#A9C6C1]">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  AYIN KİTABI
                </span>
                <span className="text-amber-300">
                  ★ {calcAvg(cultureData.book.reviews)}/5
                </span>
              </div>
              <p className="text-xs font-black text-white truncate">
                {cultureData.book.title}
              </p>
              <p className="text-[11px] text-white/75 truncate">
                {cultureData.book.creator}
              </p>
            </div>

            <div
              onClick={() => onOpenCultureModal('movie')}
              className="cursor-pointer p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 transition space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-extrabold text-[#A9C6C1]">
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  AYIN FİLMİ
                </span>
                <span className="text-amber-300">
                  ★ {calcAvg(cultureData.movie.reviews)}/5
                </span>
              </div>
              <p className="text-xs font-black text-white truncate">
                {cultureData.movie.title}
              </p>
              <p className="text-[11px] text-white/75 truncate">
                {cultureData.movie.originalTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenCultureModal('book')}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#FF8A3D] hover:bg-[#E66B1F] text-white text-xs font-black transition shadow-md"
          >
            5 Üzerinden Puan Ver & Yorumla
          </button>
        </section>
      </div>
    </div>
  );
}
