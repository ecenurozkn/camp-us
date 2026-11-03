import React, { useState } from 'react';
import {
  Users,
  Calendar,
  MapPin,
  Clock,
  ThumbsUp,
  Lightbulb,
  Plus,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Search,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function ClubsTab({
  clubs,
  proposals,
  currentUser,
  onUpvoteProposal,
  onAddProposal,
  onAddClubEvent,
  onAddAnnouncement,
  onAddGardenDeal,
}) {
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedClubs, setJoinedClubs] = useState(['club-mis', 'club-ieee']);

  // Topluluk Yöneticisi Paneli (Manuel Etkinlik / Duyuru / Kampanya Ekleme)
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminActionType, setAdminActionType] = useState('event'); // 'event' | 'announcement' | 'campaign'
  const [adminClubId, setAdminClubId] = useState(clubs[0]?.id || 'club-mis');
  const [adminTitle, setAdminTitle] = useState('');
  const [adminDateOrTag, setAdminDateOrTag] = useState('27 Kasım 2026 Cuma • 15:00');
  const [adminLocationOrVendor, setAdminLocationOrVendor] = useState('ABÜ Konferans Salonu A');
  const [adminDesc, setAdminDesc] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Student Proposal Form
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [targetClubId, setTargetClubId] = useState(clubs[0]?.id || 'club-mis');
  const [propTitle, setPropTitle] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propSuccess, setPropSuccess] = useState('');

  const categories = [
    'Tümü',
    'Teknoloji & İş',
    'Teknoloji',
    'Kültür & Sanat',
    'Kariyer & İş',
    'Müzik & Sanat',
  ];

  const filteredClubs = clubs.filter((club) => {
    const matchesCat = categoryFilter === 'Tümü' || club.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      club.name.toLowerCase().includes(q) ||
      club.description.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const activeClub = selectedClubId
    ? clubs.find((c) => c.id === selectedClubId)
    : null;

  const toggleJoinClub = (clubId) => {
    setJoinedClubs((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId]
    );
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!adminTitle.trim()) return;

    const targetClub =
      clubs.find((c) => c.id === (activeClub ? activeClub.id : adminClubId)) ||
      clubs[0];

    if (adminActionType === 'event') {
      onAddClubEvent(targetClub.id, {
        id: `ce-${Date.now()}`,
        title: adminTitle.trim(),
        date: adminDateOrTag.split('•')[0]?.trim() || 'Kasım 2026',
        time: adminDateOrTag.split('•')[1]?.trim() || '15:00',
        location: adminLocationOrVendor.trim() || 'ABÜ Kampüs',
      });
      setAdminSuccess(`"${targetClub.name}" takvimine yeni etkinlik eklendi!`);
    } else if (adminActionType === 'announcement') {
      onAddAnnouncement({
        id: `ann-${Date.now()}`,
        category: 'Konferans',
        badgeColor: 'bg-[#FF8A3D] text-white',
        title: adminTitle.trim(),
        department: targetClub.name,
        date: adminDateOrTag.trim() || 'Bugün',
        time: '15:00',
        location: adminLocationOrVendor.trim() || 'ABÜ Konferans Salonu',
        sourceUrl: 'https://ankarabilim.edu.tr',
        summary: adminDesc.trim() || `${targetClub.name} tarafından düzenlenen kampüs etkinliği.`,
        isPinned: true,
      });
      setAdminSuccess('Topluluk duyurusu Ana Duyuru Panosuna eklendi!');
    } else {
      onAddGardenDeal({
        id: `deal-${Date.now()}`,
        vendor: adminLocationOrVendor.includes('Migros') ? 'MigrosJet' : 'Coffee Hub',
        vendorBadge: adminLocationOrVendor.includes('Migros')
          ? '🛒 MigrosJet Kampüs'
          : '☕ Coffee Hub Bahçe',
        vendorColor: 'from-[#142E2C] to-[#2B524F]',
        accentTag: adminDateOrTag.trim() || 'KULÜP İNDİRİMİ',
        title: adminTitle.trim(),
        description: adminDesc.trim() || `${targetClub.name} üyelerine özel bahçe kampanyası.`,
        validUntil: 'Hafta boyunca geçerli',
        addedBy: `${currentUser.name} (${currentUser.titleBadges?.[0] || 'Topluluk Yöneticisi'})`,
        likes: 1,
      });
      setAdminSuccess('Yeni bahçe kampanyası Ana Ekrandaki Bahçe Fırsatlarına eklendi!');
    }

    setAdminTitle('');
    setAdminDesc('');
    setShowAdminPanel(false);
    setTimeout(() => setAdminSuccess(''), 4000);
  };

  const handleCreateProposal = (e) => {
    e.preventDefault();
    if (!propTitle.trim() || !propDesc.trim()) return;

    const clubObj =
      clubs.find((c) => c.id === (activeClub ? activeClub.id : targetClubId)) ||
      clubs[0];

    onAddProposal({
      id: `prop-${Date.now()}`,
      clubId: clubObj.id,
      clubName: clubObj.name,
      title: propTitle.trim(),
      description: propDesc.trim(),
      proposedBy: currentUser.name,
      proposerBadge: currentUser.titleBadges?.[0] || null,
      department: currentUser.department,
      votes: 1,
      votedByMe: true,
      status: 'Yeni Öneri • Oylamada ✨',
      createdAt: 'Şimdi',
    });

    setPropTitle('');
    setPropDesc('');
    setShowProposalForm(false);
    setPropSuccess(`"${clubObj.name}" için etkinlik öneriniz yayınlandı!`);
    setTimeout(() => setPropSuccess(''), 3500);
  };

  const sortedProposals = [...proposals]
    .filter((p) => (!activeClub ? true : p.clubId === activeClub.id))
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-5 pb-10">
      {/* TOPLULUK YÖNETİCİSİ PANELİ BANNER & FORM */}
      <div className="glass-petrol rounded-[32px] p-5 text-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0 shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#FF8A3D] text-[10px] font-black uppercase">
                  Topluluk Yöneticisi Paneli
                </span>
                {currentUser.titleBadges?.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black"
                  >
                    🏅 {b}
                  </span>
                ))}
              </div>
              <h2 className="text-base sm:text-lg font-black mt-1">
                ABÜ Öğrenci Toplulukları & Kulüp Yönetim Merkezi
              </h2>
              <p className="text-xs text-[#A9C6C1]">
                Topluluk görevlileri buradan manuel olarak yeni kulüp etkinliği, okul duyurusu veya bahçe kampanyası ekleyebilir.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdminPanel((prev) => !prev)}
            className="px-4 py-2.5 rounded-full bg-[#FF8A3D] hover:bg-[#E66B1F] text-white text-xs font-black inline-flex items-center gap-1.5 shrink-0 shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Yönetici Veri Ekle</span>
          </button>
        </div>

        {adminSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{adminSuccess}</span>
          </div>
        )}

        {showAdminPanel && (
          <form
            onSubmit={handleAdminSubmit}
            className="p-4 rounded-3xl bg-white/10 border border-white/20 space-y-3"
          >
            <div className="grid grid-cols-3 gap-2 bg-[#0F2422] p-1 rounded-2xl">
              {[
                { id: 'event', label: '📅 Kulüp Etkinliği Ekle' },
                { id: 'announcement', label: '📢 Kampüs Duyurusu Ekle' },
                { id: 'campaign', label: '☕ Bahçe Kampanyası Ekle' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAdminActionType(t.id)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-black transition ${
                    adminActionType === t.id
                      ? 'bg-[#FF8A3D] text-white shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <select
                value={adminClubId}
                onChange={(e) => setAdminClubId(e.target.value)}
                className="px-3 py-2 rounded-2xl bg-white text-[#142E2C] text-xs font-bold"
              >
                {clubs.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={adminDateOrTag}
                onChange={(e) => setAdminDateOrTag(e.target.value)}
                placeholder={
                  adminActionType === 'campaign'
                    ? 'Kampanya Etiketi (Örn: %40 İNDİRİM)'
                    : 'Tarih & Saat (Örn: 27 Kasım • 15:00)'
                }
                className="px-3 py-2 rounded-2xl bg-white text-[#142E2C] text-xs font-bold"
              />
              <input
                type="text"
                value={adminLocationOrVendor}
                onChange={(e) => setAdminLocationOrVendor(e.target.value)}
                placeholder={
                  adminActionType === 'campaign'
                    ? 'Mekan: Coffee Hub veya MigrosJet'
                    : 'Konum (Örn: ABÜ Konferans Salonu A)'
                }
                className="px-3 py-2 rounded-2xl bg-white text-[#142E2C] text-xs font-bold"
              />
            </div>

            <input
              type="text"
              value={adminTitle}
              onChange={(e) => setAdminTitle(e.target.value)}
              placeholder="Etkinlik / Duyuru / Kampanya Başlığı..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white text-[#142E2C] text-xs font-bold"
            />

            <textarea
              rows={2}
              value={adminDesc}
              onChange={(e) => setAdminDesc(e.target.value)}
              placeholder="Detaylı açıklama..."
              className="w-full p-3 rounded-2xl bg-white text-[#142E2C] text-xs"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdminPanel(false)}
                className="px-4 py-2 rounded-xl bg-white/15 text-white text-xs font-bold"
              >
                Kapat
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FF8A3D] text-white text-xs font-black shadow-md"
              >
                Kaydet ve Yayınla
              </button>
            </div>
          </form>
        )}
      </div>

      {activeClub ? (
        /* SINGLE CLUB DETAIL VIEW */
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedClubId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#142E2C] bg-white/85 px-4 py-2 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm ABÜ Öğrenci Topluluklarına Dön</span>
          </button>

          <div
            className={`rounded-[32px] p-6 text-white bg-gradient-to-br ${activeClub.gradient} shadow-glass-dark space-y-3`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center text-3xl">
                  {activeClub.icon}
                </div>
                <div>
                  <span className="px-3 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                    {activeClub.category}
                  </span>
                  <h2 className="text-xl font-black mt-1">{activeClub.name}</h2>
                  <div className="flex items-center gap-2 flex-wrap mt-1">
                    <span className="text-xs text-white/90">
                      Başkan: <strong>{activeClub.president}</strong>
                    </span>
                    {activeClub.presidentBadge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black">
                        🏅 {activeClub.presidentBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleJoinClub(activeClub.id)}
                className="px-4 py-2.5 rounded-full bg-white text-[#142E2C] text-xs font-black shadow-md"
              >
                {joinedClubs.includes(activeClub.id)
                  ? '✓ Topluluk Üyesisin'
                  : '+ Topluluğa Katıl'}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed bg-[#142E2C]/60 p-4 rounded-2xl">
              {activeClub.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
              <span>👥 {activeClub.memberCount} ABÜ Öğrencisi</span>
              <span>📍 {activeClub.roomLocation} • {activeClub.instagram}</span>
            </div>
          </div>

          <section className="glass-card rounded-[32px] p-5 space-y-3">
            <h3 className="text-sm sm:text-base font-black text-[#142E2C] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#FF8A3D]" />
              <span>Topluluk Etkinlik Takvimi ({activeClub.events.length})</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeClub.events.map((ev) => (
                <div key={ev.id} className="p-4 rounded-3xl glass-tile space-y-2">
                  <h4 className="text-sm font-black text-[#142E2C]">{ev.title}</h4>
                  <div className="flex flex-wrap gap-3 text-xs font-bold text-[#3A5A58]">
                    <span>📅 {ev.date}</span>
                    <span>🕒 {ev.time}</span>
                    <span>📍 {ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* BENTO GRID OF CLUBS + PROPOSALS */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 7 Cols: Clubs Directory */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-[30px] p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#3A5A58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ABÜ öğrenci topluluğu ara (MIS, IEEE, Sinema, Müzik...)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap border transition ${
                      categoryFilter === cat
                        ? 'bg-[#142E2C] text-white border-[#142E2C]'
                        : 'bg-white/75 text-[#142E2C] border-[#142E2C]/15'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredClubs.map((club) => (
                <div
                  key={club.id}
                  onClick={() => setSelectedClubId(club.id)}
                  className="cursor-pointer glass-card hover:bg-white/90 rounded-[30px] p-5 flex flex-col justify-between space-y-3 transition group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${club.gradient} text-white text-2xl flex items-center justify-center shrink-0 shadow-sm`}
                      >
                        {club.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#FF8A3D]">
                          {club.category}
                        </span>
                        <h3 className="text-sm font-black text-[#142E2C] group-hover:text-[#FF8A3D] transition leading-snug">
                          {club.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-[#3A5A58]">
                        Başkan: {club.president}
                      </span>
                      {club.presidentBadge && (
                        <span className="px-2 py-0.5 rounded-full bg-[#142E2C] text-[#A9C6C1] text-[9px] font-black">
                          🏅 {club.presidentBadge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#3A5A58] line-clamp-2 leading-relaxed">
                      {club.description}
                    </p>

                    {club.events[0] && (
                      <div className="p-2.5 rounded-2xl glass-tile text-[11px]">
                        <p className="font-black text-[#142E2C] truncate">
                          📅 {club.events[0].title}
                        </p>
                        <p className="text-[#3A5A58] truncate">
                          {club.events[0].date} • 📍 {club.events[0].location}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#142E2C]/10 flex items-center justify-between text-xs font-black text-[#142E2C]">
                    <span>👥 {club.memberCount} Üye</span>
                    <span className="text-[#FF8A3D] inline-flex items-center gap-0.5">
                      Kulüp Sayfası <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: Etkinlik Önerisi ve Talebi (Upvote) */}
          <div className="lg:col-span-5">
            <section className="glass-card rounded-[32px] p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#142E2C]">
                      Etkinlik Önerisi & Upvote
                    </h3>
                    <p className="text-[11px] text-[#3A5A58] font-medium">
                      Topluluklara fikir sun veya oy ver
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowProposalForm((prev) => !prev)}
                  className="px-3.5 py-2 rounded-full bg-[#142E2C] text-white text-xs font-extrabold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>Öneri Sun</span>
                </button>
              </div>

              {propSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-950 text-xs font-bold">
                  {propSuccess}
                </div>
              )}

              {showProposalForm && (
                <form
                  onSubmit={handleCreateProposal}
                  className="p-4 rounded-3xl glass-tile space-y-2.5 border border-[#FF8A3D]/40"
                >
                  <select
                    value={targetClubId}
                    onChange={(e) => setTargetClubId(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
                  >
                    {clubs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="Etkinlik Fikri Başlığı..."
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
                  />
                  <textarea
                    rows={2}
                    value={propDesc}
                    onChange={(e) => setPropDesc(e.target.value)}
                    placeholder="Neden yapılmalı? Detayları yazın..."
                    className="w-full p-3 rounded-2xl bg-white border border-[#142E2C]/15 text-xs text-[#142E2C]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-2xl bg-[#FF8A3D] text-white text-xs font-black"
                  >
                    Oylamaya Aç
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {sortedProposals.map((prop, index) => (
                  <div
                    key={prop.id}
                    className="p-4 rounded-3xl glass-tile flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-lg bg-[#142E2C] text-white text-[10px] font-black">
                          #{index + 1} • {prop.clubName}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FF8A3D]/20 text-[#B84A0E] text-[10px] font-extrabold">
                          {prop.status}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-[#142E2C]">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-[#3A5A58] leading-relaxed">
                        {prop.description}
                      </p>
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#3A5A58] pt-0.5">
                        <span>
                          Öneren: <strong className="text-[#142E2C]">{prop.proposedBy}</strong>
                        </span>
                        {prop.proposerBadge && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[9px] font-black">
                            🏅 {prop.proposerBadge}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpvoteProposal(prop.id)}
                      className={`shrink-0 w-14 py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition ${
                        prop.votedByMe
                          ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-md'
                          : 'bg-white text-[#142E2C] border-[#142E2C]/15 hover:bg-[#142E2C] hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-xs font-black">{prop.votes}</span>
                      <span className="text-[9px] font-bold">Oy</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
