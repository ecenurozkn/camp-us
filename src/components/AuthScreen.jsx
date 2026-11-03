import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  User,
  BookOpen,
  Sparkles,
  AlertCircle,
  Users,
  ShieldCheck,
  ArrowRight,
  Award,
} from 'lucide-react';
import {
  STATUS_OPTIONS,
  INITIAL_STUDENTS,
  AVAILABLE_TITLE_BADGES,
} from '../data/mockCampusData';

export default function AuthScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Yönetim Bilişim Sistemleri (MIS)');
  const [grade, setGrade] = useState('3. Sınıf');
  const [initialStatus, setInitialStatus] = useState('Okulda');
  const [selectedBadges, setSelectedBadges] = useState(['MIS Topluluğu Başkanı']);
  const [error, setError] = useState('');

  const validateAbuEmail = (rawEmail) => {
    const cleaned = rawEmail.trim().toLowerCase();
    // Accepts @ankarabilim.edu.tr, @ogrenci.ankarabilim.edu.tr, or general .edu.tr university addresses
    const eduTrRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.edu\.tr$/i;
    return eduTrRegex.test(cleaned);
  };

  const toggleBadge = (badgeLabel) => {
    setSelectedBadges((prev) =>
      prev.includes(badgeLabel)
        ? prev.filter((b) => b !== badgeLabel)
        : [...prev, badgeLabel]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 3) {
      setError('Lütfen adınızı ve soyadınızı eksiksiz girin.');
      return;
    }

    if (!validateAbuEmail(email)) {
      setError(
        'Giriş başarısız! Sadece Ankara Bilim Üniversitesi (@ogrenci.ankarabilim.edu.tr / @ankarabilim.edu.tr) veya .edu.tr uzantılı öğrenci e-posta adresleri kabul edilmektedir.'
      );
      return;
    }

    const parts = name.trim().split(' ');
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : name.trim().slice(0, 2).toUpperCase();

    onLogin({
      id: `stu-custom-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim() || 'Yönetim Bilişim Sistemleri (MIS)',
      grade,
      status: initialStatus,
      titleBadges: selectedBadges,
      avatarBg: 'from-[#142E2C] to-[#3A5A58]',
      initials,
      bio: `${department} öğrencisi • Ankara Bilim Üniversitesi Camp’Us ortak ağı üyesi.`,
      locationNote: 'ABÜ Maltepe Kampüsü',
      updatedAt: 'Şimdi',
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Hero Column (Desktop Bento Preview) */}
        <div className="lg:col-span-5 text-white space-y-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#142E2C] border border-white/25 text-xs font-bold text-[#A9C6C1]">
            <Sparkles className="w-4 h-4 text-[#FF8A3D]" />
            <span>Ankara Bilim Üniversitesi • Resmi Kampüs PWA</span>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-4">
            <img
              src="./icon-512.png"
              alt="Camp’Us ABÜ Logo"
              className="w-24 h-24 rounded-[28px] shadow-2xl border-2 border-white/30"
            />
            <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                Camp<span className="text-[#FF8A3D]">’</span>
                <span className="text-[#A9C6C1]">Us</span>{' '}
                <span className="text-xl sm:text-2xl font-extrabold px-2.5 py-1 rounded-2xl bg-[#FF8A3D] text-white align-middle">
                  ABÜ
                </span>
              </h1>
              <p className="text-sm text-white/85 mt-1.5 font-medium">
                Ankara Bilim Üniversitesi Kampüs Yaşamı & Sosyal İletişim Platformu
              </p>
            </div>
          </div>

          <p className="text-sm text-white/85 leading-relaxed max-w-md mx-auto lg:mx-0">
            Takip etme şartı olmadan <span className="font-bold text-[#FF8A3D]">@ogrenci.ankarabilim.edu.tr</span> uzantılı tüm ABÜ öğrencileriyle ortak ağda buluş; yürüyen merdiven alarmını, bahçe Coffee Hub & MigrosJet indirimlerini ve kütüphane odalarını canlı takip et!
          </p>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="glass-petrol p-3.5 rounded-3xl">
              <p className="text-xs font-extrabold text-[#FF8A3D]">🚨 Canlı Merdiven & Bahçe</p>
              <p className="text-[11px] text-white/80 mt-0.5">
                Yürüyen merdiven arıza alarmı, bahçe güvenlik bildirimi ve Coffee Hub / MigrosJet fırsatları.
              </p>
            </div>
            <div className="glass-petrol p-3.5 rounded-3xl">
              <p className="text-xs font-extrabold text-[#A9C6C1]">🏅 Topluluk Görev Rozetleri</p>
              <p className="text-[11px] text-white/80 mt-0.5">
                MIS, IEEE, Sinema ve tüm ABÜ kulüp yöneticileri için özel unvan rozetleri ve yönetim paneli.
              </p>
            </div>
          </div>
        </div>

        {/* Right Glassmorphic Login Card */}
        <div className="lg:col-span-7 glass-card rounded-[32px] p-5 sm:p-7 space-y-5">
          <div className="flex items-center justify-between border-b border-[#142E2C]/10 pb-3.5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#142E2C]">
                ABÜ Öğrenci Girişi (.edu.tr)
              </h2>
              <p className="text-xs text-[#3A5A58] font-medium">
                @ogrenci.ankarabilim.edu.tr veya @ankarabilim.edu.tr hesabınızla katılın
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#142E2C] text-white text-[11px] font-bold">
              Takip Şartsız Ağ
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold text-[#142E2C] mb-1">
                  Ad Soyad
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#3A5A58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Örn: Ece Nur Özkan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white/80 border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#142E2C] mb-1">
                  ABÜ E-Posta (@ogrenci.ankarabilim.edu.tr)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#3A5A58] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="ad.soyad@ogrenci.ankarabilim.edu.tr"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-white/80 border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF8A3D]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="col-span-2">
                <label className="block text-xs font-extrabold text-[#142E2C] mb-1">
                  Fakülte / Bölüm
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-[#3A5A58] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white/80 border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-extrabold text-[#142E2C] mb-1">
                  Sınıf
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-2xl bg-white/80 border border-[#142E2C]/15 text-xs font-semibold text-[#142E2C]"
                >
                  <option>Hazırlık</option>
                  <option>1. Sınıf</option>
                  <option>2. Sınıf</option>
                  <option>3. Sınıf</option>
                  <option>4. Sınıf</option>
                </select>
              </div>
            </div>

            {/* Title Badges Selector */}
            <div>
              <label className="block text-xs font-extrabold text-[#142E2C] mb-1.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF8A3D]" />
                <span>Topluluk Görev Rozetlerin (İsteğe Bağlı Seç):</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TITLE_BADGES.map((b) => {
                  const active = selectedBadges.includes(b.label);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBadge(b.label)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border transition ${
                        active
                          ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-sm'
                          : 'bg-white/70 text-[#142E2C] border-[#142E2C]/15 hover:bg-white'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-extrabold text-[#142E2C] mb-1.5">
                Anlık Kampüs Durumun (Status Badge)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {STATUS_OPTIONS.map((st) => {
                  const active = initialStatus === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setInitialStatus(st.id)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border text-[11px] font-bold transition ${
                        active
                          ? 'bg-[#142E2C] text-white border-[#142E2C] shadow-md'
                          : 'bg-white/70 text-[#142E2C] border-[#142E2C]/15 hover:bg-white'
                      }`}
                    >
                      <span className="text-base leading-none mb-1">{st.emoji}</span>
                      <span className="truncate w-full text-center">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-950 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#FF8A3D] hover:bg-[#E66B1F] text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>ABÜ Ortak Kampüs Ağına Giriş Yap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo ABÜ Accounts */}
          <div className="pt-3 border-t border-[#142E2C]/10">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#3A5A58] mb-2">
              Hızlı Test İçin Kayıtlı Ankara Bilim Üniversitesi Hesapları:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INITIAL_STUDENTS.slice(0, 3).map((stu) => (
                <button
                  key={stu.id}
                  type="button"
                  onClick={() => onLogin(stu)}
                  className="p-2.5 rounded-2xl bg-white/80 hover:bg-white border border-[#142E2C]/15 text-left transition flex items-center gap-2.5 group"
                >
                  <div
                    className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${stu.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}
                  >
                    {stu.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#142E2C] truncate group-hover:text-[#FF8A3D]">
                      {stu.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#FF8A3D] truncate">
                      {stu.titleBadges?.[0] || stu.department}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
