import React, { useState } from 'react';
import {
  Library,
  DoorOpen,
  Utensils,
  Flame,
  Wallet,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { CAFETERIA_MENUS } from '../data/mockCampusData';

export default function LibraryCafeteriaTab({
  libraryData,
  onToggleStudyRoom,
  onChangeLibraryOccupancy,
}) {
  const [selectedDayId, setSelectedDayId] = useState('today');

  const occupancyPercent = Math.round(
    (libraryData.currentUsers / libraryData.totalCapacity) * 100
  );

  const getOccupancyMeta = (pct) => {
    if (pct < 40) {
      return {
        label: 'Tenha',
        colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        barGradient: 'from-emerald-500 to-teal-500',
        description: 'Kütüphane oldukça sakin. Bireysel ve grup masaları bolca müsait.',
      };
    }
    if (pct < 75) {
      return {
        label: 'Orta',
        colorClass: 'bg-amber-100 text-amber-800 border-amber-300',
        barGradient: 'from-amber-500 to-orange-500',
        description: 'Normal kampüs yoğunluğu. Sessiz katta ve grup alanında yer bulunabilir.',
      };
    }
    return {
      label: 'Yoğun',
      colorClass: 'bg-rose-100 text-rose-800 border-rose-300',
      barGradient: 'from-rose-500 to-red-600',
      description: 'Vize haftası yoğunluğu! Boş masa sayısı sınırlı.',
    };
  };

  const occMeta = getOccupancyMeta(occupancyPercent);
  const selectedMenu =
    CAFETERIA_MENUS.find((m) => m.dayId === selectedDayId) ||
    CAFETERIA_MENUS[0];

  const availableRoomsCount = libraryData.studyRooms.filter(
    (r) => r.isAvailable
  ).length;

  return (
    <div className="space-y-5 pb-6">
      {/* 1. KÜTÜPHANE DOLULUK SAYACI VE KAT TAKİBİ */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Merkez Kütüphane Canlı Doluluk
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${occMeta.colorClass}`}
                >
                  %{occupancyPercent} • {occMeta.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {libraryData.openHours} • {libraryData.lastUpdated}
              </p>
            </div>
          </div>

          {/* Quick Occupancy Simulator for testing Tenha / Orta / Yoğun */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            {[
              { users: 140, label: 'Tenha (%28)' },
              { users: 335, label: 'Orta (%67)' },
              { users: 445, label: 'Yoğun (%89)' },
            ].map((preset) => {
              const active =
                Math.abs(libraryData.currentUsers - preset.users) < 25;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeLibraryOccupancy(preset.users)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition ${
                    active
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Gauge Box */}
        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Anlık İçerideki Öğrenci Sayısı
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-extrabold text-slate-900">
                  %{occupancyPercent}
                </span>
                <span className="text-sm font-bold text-indigo-600">
                  ({occMeta.label})
                </span>
                <span className="text-xs text-slate-500">
                  • {libraryData.currentUsers} / {libraryData.totalCapacity} Koltuk
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                {libraryData.totalCapacity - libraryData.currentUsers} Boş Koltuk
              </span>
            </div>
          </div>

          <div className="w-full h-4 rounded-full bg-slate-200/80 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${occMeta.barGradient} transition-all duration-500`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-600">{occMeta.description}</p>
        </div>

        {/* 4 ADET ÖZEL ÇALIŞMA ODASI GERÇEK ZAMANLI PANEL (Oda 1, Oda 2, Oda 3, Oda 4) */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Özel Çalışma Odaları (Oda 1 – Oda 4)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Şu an 4 odadan <strong>{availableRoomsCount} tanesi Müsait (Yeşil)</strong>,{' '}
                  <strong>{4 - availableRoomsCount} tanesi Dolu (Kırmızı)</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {libraryData.studyRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-3xl border transition flex flex-col justify-between space-y-3 ${
                  room.isAvailable
                    ? 'bg-emerald-50/75 border-emerald-300 shadow-sm'
                    : 'bg-rose-50/75 border-rose-300 shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {room.name}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        ({room.capacity})
                      </span>
                    </div>

                    {/* Müsait - Yeşil / Dolu - Kırmızı Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                        room.isAvailable
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {room.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Müsait</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Dolu</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-600">
                    🛠️ {room.equipment}
                  </p>

                  <div
                    className={`p-2.5 rounded-2xl text-xs font-semibold ${
                      room.isAvailable
                        ? 'bg-white/85 text-emerald-800 border border-emerald-200'
                        : 'bg-white/85 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {room.isAvailable ? (
                      <span>🟢 Oda şu an boş ve hemen kullanıma uygun.</span>
                    ) : (
                      <span>
                        🔴 {room.currentGroup} • ({room.availableAt})
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleStudyRoom(room.id)}
                  className={`w-full py-2 px-3 rounded-2xl text-xs font-extrabold transition ${
                    room.isAvailable
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-white hover:bg-rose-100 text-rose-700 border border-rose-300'
                  }`}
                >
                  {room.isAvailable
                    ? 'Bu Odayı Kullanmaya Başla (Dolu İşaretle)'
                    : 'Odayı Boşalt (Müsait İşaretle)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. GÜNÜN YEMEKHANE MENÜSÜ, KALORİ VE GÜNCEL ÜCRET KARTI */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Günün Yemekhane Menüsü & Kalori Tablosu
              </h2>
              <p className="text-xs text-slate-500">
                {selectedMenu.dateText} • {selectedMenu.serviceHours}
              </p>
            </div>
          </div>

          {/* Day Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            {CAFETERIA_MENUS.map((menu) => (
              <button
                key={menu.dayId}
                type="button"
                onClick={() => setSelectedDayId(menu.dayId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  selectedDayId === menu.dayId
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {menu.dayLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Banner: Price + Calories + Queue Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold uppercase text-emerald-700">
                Güncel Yemekhane Ücreti
              </p>
              <p className="text-base font-extrabold text-emerald-950">
                Öğrenci: {selectedMenu.studentPrice}
              </p>
              <p className="text-[10px] text-emerald-700">
                2. Geçiş: {selectedMenu.secondPassPrice} • Burslu: 0 ₺
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3">
            <Flame className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold uppercase text-amber-700">
                Toplam Kalori & Besin
              </p>
              <p className="text-base font-extrabold text-amber-950">
                {selectedMenu.totalCalories} kcal
              </p>
              <p className="text-[10px] text-amber-700">
                Dengeli Öğün • {selectedMenu.proteinGrams}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold uppercase text-indigo-700">
                Turnike & Sıra Durumu
              </p>
              <p className="text-xs font-extrabold text-indigo-950">
                {selectedMenu.occupancyText}
              </p>
              <p className="text-[10px] text-indigo-700">
                KampüsKart Bakiye Dolum Aktif
              </p>
            </div>
          </div>
        </div>

        {/* 4 Course Meal Cards */}
        <div className="space-y-2.5">
          {selectedMenu.items.map((item) => (
            <div
              key={item.category}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-extrabold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Alerjen / Not: {item.allergen}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-1">
                    {item.name}
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">
                    🌱 Vejetaryen / Vegan Seçenek: {item.veganAlt}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Enerji Değeri
                </span>
                <span className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-extrabold text-slate-800 shadow-sm">
                  🔥 {item.calories} kcal
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
