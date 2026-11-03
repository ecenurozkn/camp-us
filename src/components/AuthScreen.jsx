import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  User,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { STATUS_OPTIONS, INITIAL_STUDENTS } from '../data/mockCampusData';

export default function AuthScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Bilgisayar Mühendisliği');
  const [grade, setGrade] = useState('3. Sınıf');
  const [initialStatus, setInitialStatus] = useState('Okulda');
  const [error, setError] = useState('');

  const validateEduTrEmail = (rawEmail) => {
    const cleaned = rawEmail.trim().toLowerCase();
    // Must contain @ and end with .edu.tr
    const eduTrRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.edu\.tr$/i;
    return eduTrRegex.test(cleaned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || name.trim().length < 3) {
      setError('Lütfen adınızı ve soyadınızı eksiksiz girin.');
      return;
    }

    if (!validateEduTrEmail(email)) {
      setError(
        'Giriş başarısız! Sadece üniversite uzantılı (.edu.tr) e-posta adresine sahip öğrenciler Camp’Us ağına katılabilir. (Örn: ad.soyad@kampus.edu.tr)'
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
      department: department.trim() || 'Mühendislik Fakültesi',
      grade,
      status: initialStatus,
      avatarBg: 'from-indigo-600 to-sky-500',
      initials,
      bio: `${department} öğrencisi • Camp’Us ortak kampüs ağı üyesi.`,
      locationNote: 'Kampüs İçi Aktif',
      updatedAt: 'Şimdi',
    });
  };

  const handleQuickDemoLogin = (student) => {
    setError('');
    onLogin(student);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 sm:py-10 max-w-md mx-auto">
      {/* Top Brand Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-sky-500 shadow-soft-lg p-1.5 mx-auto">
          <img
            src="./campus-icon.svg"
            alt="Camp’Us Logo"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Üniversite Kampüs Yaşamı & Sosyal Ağ PWA</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Camp<span className="text-indigo-600">’</span>
            <span className="text-sky-600">Us</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
            Takip etme şartı olmadan, aynı <span className="font-semibold text-indigo-700">.edu.tr</span> uzantılı tüm kampüs arkadaşlarınla tek ortak ağda buluş.
          </p>
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-soft-lg border border-slate-100 p-5 sm:p-6 my-5 space-y-5">
        {/* Open Network Info Banner */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 to-sky-50/90 border border-indigo-100/80">
          <div className="p-2 rounded-xl bg-white text-indigo-600 shadow-sm shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900">Takip Et / Takipten Çık Yok!</p>
            <p className="mt-0.5 text-slate-600">
              Okul e-postası ile giriş yapan her öğrenci ortak kampüs ağındadır; herkes birbirinin anlık durumunu ve paylaşımlarını doğrudan görebilir.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Ad Soyad
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Örn: Ece Nur Özkan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Üniversite E-Posta Adresi
              </label>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Zorunlu: .edu.tr
              </span>
            </div>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="ogrenci@universite.edu.tr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                  error
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/30 focus:border-indigo-500'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bölüm / Fakülte
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Sınıf
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-2.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
              >
                <option>Hazırlık</option>
                <option>1. Sınıf</option>
                <option>2. Sınıf</option>
                <option>3. Sınıf</option>
                <option>4. Sınıf</option>
                <option>Y. Lisans</option>
              </select>
            </div>
          </div>

          {/* Initial Personal Status Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Şu Anki Kampüs Durumun (Status Badge)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {STATUS_OPTIONS.map((st) => {
                const active = initialStatus === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setInitialStatus(st.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border text-[11px] font-semibold transition ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
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
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>.edu.tr E-Posta ile Kampüse Giriş Yap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Student Accounts */}
        <div className="pt-3 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
            Hızlı Test İçin Kayıtlı (.edu.tr) Öğrenci Hesapları
          </p>
          <div className="space-y-2">
            {INITIAL_STUDENTS.slice(0, 3).map((stu) => {
              const stMeta =
                STATUS_OPTIONS.find((s) => s.id === stu.status) || STATUS_OPTIONS[0];
              return (
                <button
                  key={stu.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(stu)}
                  className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/90 hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 transition text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${stu.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {stu.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-700">
                          {stu.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${stMeta.badgeClass}`}
                        >
                          <span>{stMeta.emoji}</span>
                          <span>{stu.status}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{stu.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 shrink-0 ml-2 group-hover:translate-x-0.5 transition">
                    Seç →
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
        <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
        <span>Camp’Us PWA • Ana Ekrana Eklenebilir Mobil Kampüs Platformu</span>
      </div>
    </div>
  );
}
