import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Send,
  PhoneCall,
  Users,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { GARDEN_LOCATIONS } from '../data/mockCampusData';

export default function SafetyReportTab({
  safetyReports,
  currentUser,
  onAddSafetyReport,
  onConfirmSafetyReport,
  onResolveSafetyReport,
}) {
  const [location, setLocation] = useState(GARDEN_LOCATIONS[1]); // Coffee Hub Önü
  const [category, setCategory] = useState(
    'Dışarıdan Gelen Şüpheli Kişi / Rahatsızlık'
  );
  const [urgency, setUrgency] = useState('Yüksek Aciliyet 🚨');
  const [description, setDescription] = useState('');
  const [submittedBanner, setSubmittedBanner] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const urgencyColor =
      urgency.includes('Yüksek')
        ? 'bg-rose-600 text-white'
        : urgency.includes('Orta')
        ? 'bg-amber-500 text-slate-950'
        : 'bg-[#142E2C] text-white';

    onAddSafetyReport({
      id: `safe-${Date.now()}`,
      location,
      category,
      urgency,
      urgencyColor,
      description: description.trim(),
      reportedBy: currentUser.name,
      reporterRole:
        currentUser.titleBadges?.[0] || `${currentUser.department} Öğrencisi`,
      time: 'Şimdi',
      confirmedCount: 1,
      status: 'Kampüs Güvenliğine & Ortak Ağa İletildi',
      isResolved: false,
    });

    setDescription('');
    setSubmittedBanner(
      `Güvenlik bildiriminiz (${location}) anında Kampüs Güvenlik Birimine ve tüm ABÜ öğrencilerine uyarı olarak gönderildi!`
    );
    setTimeout(() => setSubmittedBanner(''), 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-8">
      {/* Left / Main Form Column */}
      <div className="lg:col-span-5 space-y-4">
        <div className="glass-petrol rounded-[32px] p-5 sm:p-6 text-white space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/25 border border-rose-400/40 text-rose-300 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black uppercase">
                  ABÜ Bahçe Güvenlik Hattı
                </span>
                <h2 className="text-lg font-black mt-1">
                  Güvenlik Bildirimi / Rahatsızlık Report Et
                </h2>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/80 leading-relaxed">
            Okul bahçesine dışarıdan kişiler girebildiği için, bahçede öğrencileri rahatsız eden şüpheli kişiler veya durumları anında bildirin. Bildiriminiz hem **ABÜ Güvenlik Birimine** hem de bahçedeki **tüm öğrencilere** canlı uyarı olarak düşer.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Location Selector Pills */}
            <div>
              <label className="block text-xs font-extrabold text-[#A9C6C1] mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>1. Olay Konumunu Seçin (Bahçe Noktaları):</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {GARDEN_LOCATIONS.map((loc) => {
                  const active = location === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocation(loc)}
                      className={`py-2 px-2.5 rounded-2xl text-[11px] font-extrabold text-left border transition truncate ${
                        active
                          ? 'bg-[#FF8A3D] text-white border-[#FF8A3D] shadow-md'
                          : 'bg-white/10 text-white/85 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      📍 {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-extrabold text-[#A9C6C1] mb-1">
                2. Rahatsızlık / Durum Türü:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-[#FF8A3D]"
              >
                <option className="text-slate-900">
                  Dışarıdan Gelen Şüpheli Kişi / Rahatsızlık
                </option>
                <option className="text-slate-900">
                  Öğrencileri Rahatsız Eden Sözlü/Fiziksel Davranış
                </option>
                <option className="text-slate-900">
                  İzinsiz Satış / Broşür / Para Talebi
                </option>
                <option className="text-slate-900">
                  Kampüs Dışı Yabancı Girişi / Eşya Güvenliği
                </option>
              </select>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-xs font-extrabold text-[#A9C6C1] mb-1.5">
                3. Aciliyet Seviyesi:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Yüksek Aciliyet 🚨', activeClass: 'bg-rose-600 text-white border-rose-500' },
                  { id: 'Orta Dikkat ⚠️', activeClass: 'bg-amber-500 text-slate-950 border-amber-400' },
                  { id: 'Bilgilendirme ℹ️', activeClass: 'bg-teal-500 text-white border-teal-400' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUrgency(u.id)}
                    className={`py-2 px-2 rounded-2xl text-[11px] font-black border transition ${
                      urgency === u.id
                        ? `${u.activeClass} shadow-md scale-[1.02]`
                        : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    {u.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-extrabold text-[#A9C6C1] mb-1">
                4. Durum Açıklaması (Kişi eşkali, konum detayı vb.):
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Coffee Hub önündeki masalarda dışarıdan gelen bir kişi öğrencileri rahatsız ediyor, güvenlik yönlendirilebilir mi?"
                className="w-full p-3.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-none focus:border-[#FF8A3D]"
              />
            </div>

            {submittedBanner && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submittedBanner}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-[#FF8A3D] hover:from-rose-700 hover:to-[#E66B1F] text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4" />
              <span>Kampüs Güvenliğine & Öğrencilere Bildir</span>
            </button>
          </form>

          {/* Direct Campus Security Desk Info */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#A9C6C1]">
            <span className="flex items-center gap-1.5 font-bold">
              <PhoneCall className="w-4 h-4 text-[#FF8A3D]" />
              ABÜ Danışma & Güvenlik Kulübesi:
            </span>
            <span className="font-black text-white bg-white/15 px-3 py-1 rounded-full">
              Dahili: 112 / Bahçe Giriş Noktası
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Live Safety Alerts Feed for Students */}
      <div className="lg:col-span-7 space-y-4">
        <div className="glass-card rounded-[32px] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#142E2C] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Canlı Kampüs Bahçesi Güvenlik Uyarıları ({safetyReports.length})</span>
              </h3>
              <p className="text-xs text-[#3A5A58] font-medium">
                Öğrenciler tarafından bildirilen anlık bahçe ve kampüs çevresi uyarıları
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-800 border border-rose-500/30 text-xs font-extrabold">
              Canlı Radar
            </span>
          </div>

          <div className="space-y-3">
            {safetyReports.map((rep) => (
              <div
                key={rep.id}
                className={`p-4 sm:p-5 rounded-3xl border transition space-y-3 ${
                  rep.isResolved
                    ? 'bg-white/50 border-emerald-500/30 opacity-80'
                    : 'bg-white/85 border-rose-500/35 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-black ${
                        rep.isResolved
                          ? 'bg-emerald-700 text-white'
                          : rep.urgencyColor
                      }`}
                    >
                      {rep.isResolved ? '✓ Güvenlik Müdahale Etti / Çözüldü' : rep.urgency}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#142E2C] text-white text-[11px] font-extrabold">
                      📍 {rep.location}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#3A5A58]">{rep.time}</span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-[#142E2C]">{rep.category}</h4>
                  <p className="text-xs sm:text-sm text-[#1D3534] leading-relaxed mt-1">
                    {rep.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#142E2C]/10 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#142E2C]">
                      Bildiren: {rep.reportedBy}
                    </span>
                    {rep.reporterRole && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FF8A3D]/20 text-[#B84A0E] text-[10px] font-extrabold border border-[#FF8A3D]/30">
                        {rep.reporterRole}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onConfirmSafetyReport(rep.id)}
                      className="px-3 py-1.5 rounded-full bg-[#142E2C]/10 hover:bg-[#142E2C] hover:text-white text-[#142E2C] text-[11px] font-extrabold inline-flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ben de Gördüm ({rep.confirmedCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onResolveSafetyReport(rep.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold inline-flex items-center gap-1 transition ${
                        rep.isResolved
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-600/15 hover:bg-emerald-600 hover:text-white text-emerald-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{rep.isResolved ? 'Çözüldü' : 'Çözüldü İşaretle'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
