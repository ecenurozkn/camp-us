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
} from 'lucide-react';

export default function ClubsTab({
  clubs,
  proposals,
  currentUser,
  onUpvoteProposal,
  onAddProposal,
}) {
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedClubs, setJoinedClubs] = useState(['club-ai', 'club-cinema']);

  // Proposal form states
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [targetClubId, setTargetClubId] = useState(clubs[0]?.id || 'club-ai');
  const [propTitle, setPropTitle] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propSuccess, setPropSuccess] = useState('');

  const categories = ['Tümü', 'Teknoloji', 'Kültür & Sanat', 'Müzik & Sanat', 'Kariyer & İş', 'Spor & Doğa'];

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

  // Sort proposals by votes descending
  const sortedProposals = [...proposals]
    .filter((p) => (!activeClub ? true : p.clubId === activeClub.id))
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-5 pb-6">
      {activeClub ? (
        /* SINGLE CLUB DETAIL PAGE */
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setSelectedClubId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tüm Öğrenci Toplulukları Dizinine Dön</span>
          </button>

          {/* Club Hero Banner */}
          <div
            className={`rounded-3xl p-5 text-white bg-gradient-to-br ${activeClub.gradient} shadow-soft-lg space-y-3`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-sm">
                  {activeClub.icon}
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase tracking-wider">
                    {activeClub.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-extrabold mt-1">
                    {activeClub.name}
                  </h2>
                  <p className="text-xs text-white/90">
                    Başkan: {activeClub.president} • {activeClub.instagram}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleJoinClub(activeClub.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold shrink-0 transition ${
                  joinedClubs.includes(activeClub.id)
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'bg-black/25 hover:bg-black/35 text-white border border-white/30'
                }`}
              >
                {joinedClubs.includes(activeClub.id)
                  ? '✓ Topluluk Üyesisin'
                  : '+ Topluluğa Katıl'}
              </button>
            </div>

            <p className="text-xs text-white/95 leading-relaxed bg-black/15 p-3.5 rounded-2xl">
              {activeClub.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/90 pt-1">
              <span>
                👥{' '}
                <strong>
                  {activeClub.memberCount +
                    (joinedClubs.includes(activeClub.id) ? 1 : 0)}
                </strong>{' '}
                Aktif Öğrenci Üye
              </span>
              <span>📍 Kulüp Odası: {activeClub.roomLocation}</span>
            </div>
          </div>

          {/* Club Scheduled Events (Tarih / Saat / Konum) */}
          <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Topluluk Etkinlik Takvimi ({activeClub.events.length})</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Tarih, Saat & Konum
              </span>
            </div>

            <div className="space-y-2.5">
              {activeClub.events.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {ev.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      {ev.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {ev.time}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      {ev.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* ALL CLUBS DIRECTORY */
        <>
          <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Öğrenci Toplulukları (Kulüpler) Dizini
                </h2>
                <p className="text-xs text-slate-500">
                  Kulüp sayfalarını incele, etkinlik takvimlerini gör veya yeni etkinlik önerip oy ver!
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Search & Category Filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Topluluk veya ilgi alanı ara..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Club Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => setSelectedClubId(club.id)}
                className="cursor-pointer bg-white rounded-3xl p-4 border border-slate-100 hover:border-indigo-200 shadow-soft transition flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${club.gradient} text-white text-2xl flex items-center justify-center shadow-sm shrink-0`}
                      >
                        {club.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600">
                          {club.category}
                        </span>
                        <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                          {club.name}
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          👥 {club.memberCount} Üye • {club.events.length} Yaklaşan Etkinlik
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>

                  {/* Preview of Next Event */}
                  {club.events[0] && (
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-[11px] space-y-1">
                      <p className="font-bold text-slate-800 truncate">
                        📅 {club.events[0].title}
                      </p>
                      <p className="text-slate-500 truncate">
                        {club.events[0].date} • {club.events[0].time} • 📍{' '}
                        {club.events[0].location}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-indigo-600">
                  <span>Kulüp Sayfası & Etkinlikler</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ETKİNLİK ÖNERİSİ VE TALEBİ ALANI (UPVOTE SİSTEMİ) */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Etkinlik Önerisi ve Talebi (Upvote)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                  Öğrenci Fikir Havuzu
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Topluluklara yeni etkinlik fikri sun veya mevcut önerilere oy (upvote) ver!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowProposalForm((prev) => !prev)}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Etkinlik Öner</span>
          </button>
        </div>

        {propSuccess && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{propSuccess}</span>
          </div>
        )}

        {/* New Event Proposal Form */}
        {showProposalForm && (
          <form
            onSubmit={handleCreateProposal}
            className="p-4 rounded-3xl bg-indigo-50/60 border border-indigo-200/80 space-y-3"
          >
            <h4 className="text-xs font-extrabold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Topluluğa Yeni Etkinlik Fikri Sun</span>
            </h4>

            {!activeClub && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Hangi Topluluğa Öneriyorsun?
                </label>
                <select
                  value={targetClubId}
                  onChange={(e) => setTargetClubId(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Etkinlik Başlığı / Fikri
              </label>
              <input
                type="text"
                value={propTitle}
                onChange={(e) => setPropTitle(e.target.value)}
                placeholder="Örn: Kampüs Çimlerinde Açık Hava Tasarım & Müzik Atölyesi"
                className="w-full px-3.5 py-2 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Etkinlik Detayı ve Neden Yapılmalı?
              </label>
              <textarea
                rows={2}
                value={propDesc}
                onChange={(e) => setPropDesc(e.target.value)}
                placeholder="Etkinlik içeriğini, olası mekan ve zaman önerini kısaca yaz..."
                className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowProposalForm(false)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm"
              >
                Öneriyi Yayınla & Oylamaya Aç
              </button>
            </div>
          </form>
        )}

        {/* Upvote Proposal Cards */}
        <div className="space-y-2.5">
          {sortedProposals.map((prop, index) => (
            <div
              key={prop.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-start justify-between gap-3.5"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-800 text-[10px] font-extrabold">
                    #{index + 1} • {prop.clubName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 text-[10px] font-bold">
                    {prop.status}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {prop.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {prop.description}
                </p>
                <p className="text-[11px] text-slate-400">
                  Öneren: <strong className="text-slate-600">{prop.proposedBy}</strong> (
                  {prop.department}) • {prop.createdAt}
                </p>
              </div>

              {/* Upvote Button */}
              <button
                type="button"
                onClick={() => onUpvoteProposal(prop.id)}
                className={`shrink-0 w-16 py-2.5 px-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition ${
                  prop.votedByMe
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20 scale-[1.02]'
                    : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <ThumbsUp
                  className={`w-4 h-4 ${
                    prop.votedByMe ? 'fill-white text-white' : 'text-indigo-600'
                  }`}
                />
                <span className="text-sm font-extrabold leading-tight">
                  {prop.votes}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-tighter opacity-90">
                  {prop.votedByMe ? 'Oylandı' : 'Oy Ver'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
