import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  HeartPulse,
  MapPin,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { EMERGENCY_INFIRMARY_INFO } from '../data/mockCampusData';

export default function EmergencyInfirmaryModal({ isOpen, onClose, currentUser }) {
  const [selectedSpot, setSelectedSpot] = useState('A-Blok Giriş / Merdivenler');
  const [pingSent, setPingSent] = useState(false);

  if (!isOpen) return null;

  const handleSendQuickLocationAlert = () => {
    setPingSent(true);
    setTimeout(() => setPingSent(false), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#142E2C]/75 p-0 sm:p-4">
      <div className="glass-card w-full max-w-lg rounded-t-[34px] sm:rounded-[34px] border-2 border-rose-400/60 max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Urgent Red/Orange Header */}
        <div className="px-6 pt-6 pb-5 bg-gradient-to-r from-rose-600 via-red-600 to-[#FF8A3D] text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-rose-700 text-xs font-black uppercase tracking-wide mb-2 shadow-sm">
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span>🚨 Acil Sağlık & Revir Hattı</span>
          </div>
          <h2 className="text-xl font-black leading-snug">
            {EMERGENCY_INFIRMARY_INFO.title}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 mt-1">
            {EMERGENCY_INFIRMARY_INFO.subtitle}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Direct Call Buttons (Touch-Friendly Large Buttons) */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
              Doğrudan Hızlı Arama Tuşları (Tek Dokunuş):
            </p>

            <a
              href={`tel:${EMERGENCY_INFIRMARY_INFO.mobileDutyPhone}`}
              className="w-full py-4 px-5 rounded-3xl bg-gradient-to-r from-rose-600 to-[#FF8A3D] hover:from-rose-700 hover:to-[#E66B1F] text-white shadow-lg flex items-center justify-between gap-3 transition active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-6 h-6 animate-bounce" />
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-extrabold uppercase text-amber-200 block">
                    Revir Kapalıysa Doğrudan Ulaşın
                  </span>
                  <span className="text-base font-black block">
                    Görevliyi Hemen Ara (Cep / Nöbetçi)
                  </span>
                  <span className="text-xs text-white/90 font-semibold">
                    {EMERGENCY_INFIRMARY_INFO.nurseName} •{' '}
                    {EMERGENCY_INFIRMARY_INFO.mobileDutyDisplay}
                  </span>
                </div>
              </div>
              <span className="px-3.5 py-2 rounded-2xl bg-white text-rose-700 text-xs font-black shrink-0">
                ARA
              </span>
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={`tel:${EMERGENCY_INFIRMARY_INFO.directPhone}`}
                className="p-4 rounded-3xl glass-tile hover:bg-white border border-rose-500/30 flex items-center gap-3 transition"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#3A5A58] block">
                    Revir Odası Sabit Hat
                  </span>
                  <span className="text-xs font-black text-[#142E2C] block">
                    {EMERGENCY_INFIRMARY_INFO.directPhoneDisplay}
                  </span>
                </div>
              </a>

              <a
                href="tel:112"
                className="p-4 rounded-3xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 flex items-center gap-3 transition"
              >
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-800 block">
                    Hayati Acil Durum
                  </span>
                  <span className="text-xs font-black text-rose-950 block">
                    112 Acil Ambulans Çağır
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Quick Campus Location Ping to Nurse & Security */}
          <div className="p-4 rounded-3xl glass-tile space-y-3 border border-[#142E2C]/15">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#142E2C] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>Revir Görevlisine Konum Bildir (Neredesiniz?)</span>
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                'A-Blok Giriş / Merdivenler',
                'B-Blok Stüdyo Katı',
                'Kampüs Bahçesi / Coffee Hub',
                'Merkez Kütüphane',
                'Yemekhane Katı',
              ].map((spot) => (
                <button
                  key={spot}
                  type="button"
                  onClick={() => setSelectedSpot(spot)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap border transition ${
                    selectedSpot === spot
                      ? 'bg-[#142E2C] text-white border-[#142E2C]'
                      : 'bg-white/80 text-[#142E2C] border-[#142E2C]/15'
                  }`}
                >
                  📍 {spot}
                </button>
              ))}
            </div>

            {pingSent ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-600/35 text-emerald-950 text-xs font-extrabold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  Konumunuz ({selectedSpot}) ve iletişim bilginiz ({currentUser?.name}) nöbetçi revir görevlisine ve danışmaya iletildi!
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSendQuickLocationAlert}
                className="w-full py-3 px-4 rounded-2xl bg-[#142E2C] hover:bg-[#1D3534] text-white text-xs font-black transition"
              >
                Görevliye “{selectedSpot}” Konumunda Yardım Çağrısı Gönder
              </button>
            )}
          </div>

          {/* Campus Emergency Health Procedure */}
          <div className="p-4 rounded-3xl bg-[#142E2C] text-white space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FF8A3D]">
                Kampüs Acil Sağlık & İlk Yardım Prosedürü
              </h3>
              <span className="text-[11px] text-[#A9C6C1] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                A-Blok Zemin Kat
              </span>
            </div>
            <p className="text-xs text-[#A9C6C1] font-semibold">
              📍 Revir Konumu: {EMERGENCY_INFIRMARY_INFO.location}
            </p>
            <ul className="space-y-2 text-xs text-white/90 leading-relaxed pt-1">
              {EMERGENCY_INFIRMARY_INFO.procedures.map((step, i) => (
                <li key={i} className="bg-white/10 p-2.5 rounded-2xl">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/75 border-t border-white/60 flex items-center justify-between">
          <span className="text-xs font-bold text-[#3A5A58]">
            {EMERGENCY_INFIRMARY_INFO.securityDeskDisplay}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#142E2C] text-white text-xs font-black"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
