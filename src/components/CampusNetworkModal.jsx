import React, { useState } from 'react';
import {
  X,
  Users,
  MapPin,
  Mail,
  GraduationCap,
  Search,
  Sparkles,
} from 'lucide-react';
import { STATUS_OPTIONS } from '../data/mockCampusData';

export default function CampusNetworkModal({
  isOpen,
  onClose,
  students,
  currentUser,
  onUpdateMyStatus,
  feedPosts = [],
  initialSelectedStudent = null,
}) {
  const [statusFilter, setStatusFilter] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(initialSelectedStudent);

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
      stu.email.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const getStatusMeta = (statusId) =>
    STATUS_OPTIONS.find((s) => s.id === statusId) || STATUS_OPTIONS[0];

  const activeProfile = selectedStudent
    ? allNetworkStudents.find((s) => s.id === selectedStudent.id || s.email === selectedStudent.email) || selectedStudent
    : null;

  const studentPosts = activeProfile
    ? feedPosts.filter(
        (p) =>
          p.authorEmail === activeProfile.email ||
          p.authorName.toLowerCase() === activeProfile.name.toLowerCase()
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white relative">
          <button
            type="button"
            onClick={() => {
              setSelectedStudent(null);
              onClose();
            }}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[11px] font-semibold mb-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Takip Et / Takipten Çık Şartı Olmayan Açık Ağ</span>
          </div>
          <h2 className="text-lg font-extrabold">
            Ortak Kampüs Öğrenci Ağı ({allNetworkStudents.length} Aktif)
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Aynı <span className="text-sky-300 font-semibold">.edu.tr</span> uzantılı tüm öğrenciler birbirinin profilini ve anlık durumunu doğrudan görebilir.
          </p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeProfile ? (
            /* Detailed Student Profile View (No follow button, direct open access) */
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                ← Tüm Kampüs Ağına Dön
              </button>

              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50/50 border border-indigo-100 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${
                      activeProfile.avatarBg || 'from-indigo-600 to-sky-500'
                    } text-white font-extrabold text-xl flex items-center justify-center shadow-md shrink-0`}
                  >
                    {activeProfile.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {activeProfile.name}
                      </h3>
                      {activeProfile.email === currentUser.email && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                          Senin Profilin
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>
                        {activeProfile.department} • {activeProfile.grade || 'Lisans'}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      <span>{activeProfile.email}</span>
                    </p>
                  </div>
                </div>

                {/* Current Live Status Badge */}
                {(() => {
                  const st = getStatusMeta(activeProfile.status);
                  return (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{st.emoji}</span>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Anlık Kişisel Durum
                          </p>
                          <p className="text-xs font-extrabold text-slate-800">
                            {st.label} — <span className="font-normal text-slate-500">{st.desc}</span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${st.badgeClass}`}
                      >
                        {st.emoji} {st.label}
                      </span>
                    </div>
                  );
                })()}

                {/* If viewing own profile, allow instant status switching here too */}
                {activeProfile.email === currentUser.email && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-slate-600">
                      Kişisel Durumunu Güncelle:
                    </p>
                    <div className="grid grid-cols-5 gap-1.5">
                      {STATUS_OPTIONS.map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => onUpdateMyStatus(st.id)}
                          className={`py-2 px-1 rounded-2xl border text-[11px] font-bold flex flex-col items-center gap-0.5 transition ${
                            currentUser.status === st.id
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span>{st.emoji}</span>
                          <span className="truncate w-full text-center">{st.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeProfile.bio && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-white/80 p-3 rounded-2xl border border-slate-100">
                    {activeProfile.bio}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {activeProfile.locationNote || 'Kampüs İçi'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ortak Ağda Doğrudan Açık Profil
                  </span>
                </div>
              </div>

              {/* Student's Recent Shared Posts */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Öğrencinin Kampüs Akışı Paylaşımları ({studentPosts.length})
                </h4>
                {studentPosts.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-500 text-center">
                    Henüz blog paylaşımı bulunmuyor, ancak anlık durumu ortak ağda aktif.
                  </div>
                ) : (
                  studentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{post.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {post.mood?.emoji} {post.mood?.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>
                      <p className="text-[10px] text-slate-400">
                        {post.createdAt} • {post.likes} beğeni • {post.comments.length} yorum
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Directory View of All Campus Students */
            <>
              {/* Search & Status Filters */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Öğrenci adı, bölüm veya .edu.tr e-posta ara..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
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
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stObj ? `${stObj.emoji} ${stObj.label}` : '🌐 Tümü'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-2.5">
                {filteredStudents.map((stu) => {
                  const st = getStatusMeta(stu.status);
                  const isMe = stu.email === currentUser.email;
                  return (
                    <div
                      key={stu.id}
                      onClick={() => setSelectedStudent(stu)}
                      className="cursor-pointer p-3.5 rounded-2xl bg-white hover:bg-indigo-50/40 border border-slate-200/80 hover:border-indigo-200 shadow-sm transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                            stu.avatarBg || 'from-indigo-500 to-sky-500'
                          } text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                        >
                          {stu.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-extrabold text-slate-900 truncate">
                              {stu.name}
                            </p>
                            {isMe && (
                              <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                                Sen
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">
                            {stu.department} • {stu.grade}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            📍 {stu.locationNote || stu.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${st.badgeClass}`}
                        >
                          <span>{st.emoji}</span>
                          <span>{st.label}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-indigo-600">
                          Profili Gör →
                        </span>
                      </div>
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
