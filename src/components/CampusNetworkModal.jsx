import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  MapPin,
  Mail,
  GraduationCap,
  Search,
  Sparkles,
  Award,
  Plus,
} from 'lucide-react';
import {
  STATUS_OPTIONS,
  AVAILABLE_TITLE_BADGES,
} from '../data/mockCampusData';

export default function CampusNetworkModal({
  isOpen,
  onClose,
  students,
  currentUser,
  onUpdateMyStatus,
  onUpdateMyBadges,
  feedPosts = [],
  initialSelectedStudent = null,
}) {
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(initialSelectedStudent);
  const [customBadgeText, setCustomBadgeText] = useState('');

  useEffect(() => {
    setSelectedStudent(initialSelectedStudent);
  }, [initialSelectedStudent]);

  if (!isOpen) return null;

  const allNetworkStudents = [
    currentUser,
    ...students.filter((s) => s.email !== currentUser.email),
  ];

  const filteredStudents = allNetworkStudents.filter((stu) => {
    const matchesStatus = statusFilter === 'Tümü' || stu.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      stu.name.toLowerCase().includes(q) ||
      stu.department.toLowerCase().includes(q) ||
      stu.email.toLowerCase().includes(q) ||
      (stu.titleBadges || []).some((b) => b.toLowerCase().includes(q));
    return matchesStatus && matchesQuery;
  });

  const getStatusMeta = (statusId) =>
    STATUS_OPTIONS.find((s) => s.id === statusId) || STATUS_OPTIONS[0];

  const activeProfile = selectedStudent
    ? allNetworkStudents.find(
        (s) => s.id === selectedStudent.id || s.email === selectedStudent.email
      ) || selectedStudent
    : null;

  const studentPosts = activeProfile
    ? feedPosts.filter(
        (p) =>
          p.authorEmail === activeProfile.email ||
          p.authorName.toLowerCase() === activeProfile.name.toLowerCase()
      )
    : [];

  const handleToggleBadge = (badgeLabel) => {
    const currentBadges = currentUser.titleBadges || [];
    const nextBadges = currentBadges.includes(badgeLabel)
      ? currentBadges.filter((b) => b !== badgeLabel)
      : [...currentBadges, badgeLabel];
    onUpdateMyBadges(nextBadges);
  };

  const handleAddCustomBadge = (e) => {
    e.preventDefault();
    const cleaned = customBadgeText.trim();
    if (!cleaned) return;
    const currentBadges = currentUser.titleBadges || [];
    if (!currentBadges.includes(cleaned)) {
      onUpdateMyBadges([...currentBadges, cleaned]);
    }
    setCustomBadgeText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#142E2C]/75 p-0 sm:p-4">
      <div className="glass-card w-full max-w-xl rounded-t-[32px] sm:rounded-[32px] border border-white/60 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-[#142E2C] via-[#1D3534] to-[#3A5A58] text-white relative">
          <button
            type="button"
            onClick={() => {
              setSelectedStudent(null);
              onClose();
            }}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[11px] font-black mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Ankara Bilim Üniversitesi • Takip Şartsız Ortak Ağ</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black">
            ABÜ Öğrenci Ağı & Topluluk Görev Rozetleri ({allNetworkStudents.length})
          </h2>
          <p className="text-xs text-[#A9C6C1] mt-0.5">
            Aynı okul uzantılı tüm öğrenciler birbirinin profilini, görev rozetlerini ve durumunu doğrudan görür.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeProfile ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-black text-[#142E2C] hover:text-[#FF8A3D] inline-flex items-center gap-1"
              >
                ← Tüm ABÜ Öğrenci Ağına Dön
              </button>

              <div className="p-5 rounded-3xl glass-tile space-y-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${
                      activeProfile.avatarBg || 'from-[#142E2C] to-[#3A5A58]'
                    } text-white font-black text-xl flex items-center justify-center shadow-md shrink-0`}
                  >
                    {activeProfile.initials}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-black text-[#142E2C]">
                        {activeProfile.name}
                      </h3>
                      {activeProfile.email === currentUser.email && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#142E2C] text-white text-[10px] font-black">
                          Senin Profilin
                        </span>
                      )}
                    </div>

                    {/* Title Badges on Profile */}
                    {activeProfile.titleBadges && activeProfile.titleBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 py-0.5">
                        {activeProfile.titleBadges.map((b, idx) => (
                          <span
                            key={b}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                              idx === 0
                                ? 'bg-[#FF8A3D] text-white'
                                : 'bg-[#142E2C] text-[#A9C6C1]'
                            }`}
                          >
                            🏅 {b}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-xs font-extrabold text-[#3A5A58] flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#FF8A3D]" />
                      <span>
                        {activeProfile.department} • {activeProfile.grade || 'Lisans'}
                      </span>
                    </p>
                    <p className="text-[11px] text-[#3A5A58] flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{activeProfile.email}</span>
                    </p>
                  </div>
                </div>

                {/* Live Status */}
                {(() => {
                  const st = getStatusMeta(activeProfile.status);
                  return (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/85 border border-[#142E2C]/10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{st.emoji}</span>
                        <div>
                          <p className="text-[10px] font-black uppercase text-[#3A5A58]">
                            Anlık Kampüs Durumu
                          </p>
                          <p className="text-xs font-black text-[#142E2C]">
                            {st.label} — <span className="font-medium text-[#3A5A58]">{st.desc}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black border ${st.badgeClass}`}
                      >
                        {st.emoji} {st.label}
                      </span>
                    </div>
                  );
                })()}

                {/* If Own Profile: Manage Status & Manage Title Badges */}
                {activeProfile.email === currentUser.email && (
                  <div className="space-y-3 pt-2 border-t border-[#142E2C]/10">
                    <div>
                      <p className="text-xs font-black text-[#142E2C] mb-1.5">
                        Anlık Kişisel Durumunu Güncelle:
                      </p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {STATUS_OPTIONS.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => onUpdateMyStatus(st.id)}
                            className={`py-2 px-1 rounded-2xl border text-[11px] font-extrabold flex flex-col items-center gap-0.5 transition ${
                              currentUser.status === st.id
                                ? 'bg-[#142E2C] text-white border-[#142E2C]'
                                : 'bg-white text-[#142E2C] border-[#142E2C]/15'
                            }`}
                          >
                            <span>{st.emoji}</span>
                            <span className="truncate w-full text-center">{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title Badges Manager */}
                    <div className="p-3.5 rounded-2xl bg-white/85 border border-[#FF8A3D]/35 space-y-2.5">
                      <p className="text-xs font-black text-[#142E2C] flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#FF8A3D]" />
                        <span>Topluluk Görev Rozetlerini (Title Badges) Yönet:</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_TITLE_BADGES.map((b) => {
                          const hasBadge = (currentUser.titleBadges || []).includes(
                            b.label
                          );
                          return (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => handleToggleBadge(b.label)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-black border transition ${
                                hasBadge
                                  ? 'bg-[#FF8A3D] text-white border-[#FF8A3D]'
                                  : 'bg-slate-50 text-[#142E2C] border-[#142E2C]/15'
                              }`}
                            >
                              {hasBadge ? '✓ ' : '+ '}
                              {b.label}
                            </button>
                          );
                        })}
                      </div>

                      <form onSubmit={handleAddCustomBadge} className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={customBadgeText}
                          onChange={(e) => setCustomBadgeText(e.target.value)}
                          placeholder="Özel görev rozeti ekle (Örn: Tiyatro Kulübü Başkanı)"
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-[#142E2C]/20 text-xs text-[#142E2C]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-xl bg-[#142E2C] text-white text-xs font-black inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#FF8A3D]" />
                          <span>Ekle</span>
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>

              {/* Student's Posts */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
                  Öğrencinin Kampüs Paylaşımları ({studentPosts.length})
                </h4>
                {studentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-3.5 rounded-2xl glass-tile space-y-1"
                  >
                    <p className="text-xs font-black text-[#142E2C]">{post.title}</p>
                    <p className="text-xs text-[#3A5A58]">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#3A5A58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Öğrenci adı, bölüm veya görev rozeti ara (Örn: MIS, IEEE)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/85 border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['Tümü', ...STATUS_OPTIONS.map((s) => s.id)].map((stId) => {
                    const active = statusFilter === stId;
                    const stObj = STATUS_OPTIONS.find((s) => s.id === stId);
                    return (
                      <button
                        key={stId}
                        type="button"
                        onClick={() => setStatusFilter(stId)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap border transition ${
                          active
                            ? 'bg-[#142E2C] text-white border-[#142E2C]'
                            : 'bg-white/75 text-[#142E2C] border-[#142E2C]/15'
                        }`}
                      >
                        {stObj ? `${stObj.emoji} ${stObj.label}` : '🌐 Tümü'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                {filteredStudents.map((stu) => {
                  const st = getStatusMeta(stu.status);
                  const isMe = stu.email === currentUser.email;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => setSelectedStudent(stu)}
                      className="cursor-pointer p-3.5 rounded-3xl glass-tile hover:bg-white transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                            stu.avatarBg || 'from-[#142E2C] to-[#3A5A58]'
                          } text-white font-black text-sm flex items-center justify-center shrink-0`}
                        >
                          {stu.initials}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-xs font-black text-[#142E2C] truncate">
                              {stu.name}
                            </p>
                            {isMe && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#142E2C] text-white text-[9px] font-black">
                                Sen
                              </span>
                            )}
                            {stu.titleBadges?.map((b, i) => (
                              <span
                                key={b}
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  i === 0
                                    ? 'bg-[#FF8A3D] text-white'
                                    : 'bg-[#142E2C] text-[#A9C6C1]'
                                }`}
                              >
                                🏅 {b}
                              </span>
                            ))}
                          </div>
                          <p className="text-[11px] text-[#3A5A58] truncate">
                            {stu.department} • {stu.grade}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-black border ${st.badgeClass}`}
                      >
                        {st.emoji} {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
