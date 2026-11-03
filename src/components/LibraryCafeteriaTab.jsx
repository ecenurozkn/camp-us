import React, { useState } from 'react';
import {
  Library,
  DoorOpen,
  Utensils,
  Flame,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
} from 'lucide-react';
import { CAFETERIA_MENUS } from '../data/mockCampusData';

export default function LibraryCafeteriaTab({
  libraryData,
  onToggleStudyRoom,
  onChangeLibraryOccupancy,
  onOpenCafeteriaModal,
}) {
  const [selectedDayId, setSelectedDayId] = useState('today');

  const occupancyPercent = Math.round(
    (libraryData.currentUsers / libraryData.totalCapacity) * 100
  );

  const getOccupancyMeta = (pct) => {
    if (pct < 40) {
      return {
        label: 'Tenha',
        colorClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-600/30',
        barGradient: 'from-emerald-600 to-teal-500',
        description: 'Kütüphane oldukça sakin. Bireysel ve grup masaları bolca müsait.',
      };
    }
    if (pct < 75) {
      return {
        label: 'Orta',
        colorClass: 'bg-amber-500/25 text-amber-950 border-amber-600/35',
        barGradient: 'from-[#FF8A3D] to-amber-500',
        description: 'Normal kampüs yoğunluğu. Sessiz katta ve grup alanında yer bulunabilir.',
      };
    }
    return {
      label: 'Yoğun',
      colorClass: 'bg-rose-500/20 text-rose-950 border-rose-600/30',
      barGradient: 'from-rose-600 to-red-600',
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-10">
      {/* 1. KÜTÜPHANE DOLULUK SAYACI VE 4 ÖZEL ODA (6 cols on Desktop) */}
      <section className="lg:col-span-6 glass-card rounded-[32px] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shadow-sm shrink-0">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#142E2C]">
                  ABÜ Kütüphane Canlı Doluluk
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black border ${occMeta.colorClass}`}
                >
                  %{occupancyPercent} • {occMeta.label}
                </span>
              </div>
              <p className="text-xs text-[#3A5A58] font-medium mt-0.5">
                {libraryData.openHours}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#142E2C]/10 p-1 rounded-2xl">
            {[
              { users: 90, label: 'Tenha (%28)' },
              { users: 214, label: 'Orta (%67)' },
              { users: 285, label: 'Yoğun (%89)' },
            ].map((preset) => {
              const active =
                Math.abs(libraryData.currentUsers - preset.users) < 20;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onChangeLibraryOccupancy(preset.users)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition ${
                    active
                      ? 'bg-[#142E2C] text-white shadow-sm'
                      : 'text-[#142E2C] hover:bg-white/60'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gauge Box */}
        <div className="p-4 rounded-3xl glass-tile space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#3A5A58]">
                Anlık İçerideki Öğrenci Sayısı
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-black text-[#142E2C]">
                  %{occupancyPercent}
                </span>
                <span className="text-sm font-extrabold text-[#FF8A3D]">
                  ({occMeta.label})
                </span>
                <span className="text-xs font-semibold text-[#3A5A58]">
                  • {libraryData.currentUsers} / {libraryData.totalCapacity} Koltuk
                </span>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-900 bg-emerald-500/20 border border-emerald-600/30 px-3 py-1 rounded-full">
              {libraryData.totalCapacity - libraryData.currentUsers} Boş Koltuk
            </span>
          </div>

          <div className="w-full h-4 rounded-full bg-[#142E2C]/10 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${occMeta.barGradient} transition-all duration-500`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <p className="text-xs text-[#3A5A58] font-medium">{occMeta.description}</p>
        </div>

        {/* 4 Study Rooms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-[#142E2C] flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-[#FF8A3D]" />
              <span>Özel Çalışma Odaları (Oda 1 – Oda 4)</span>
            </h3>
            <span className="text-xs font-extrabold text-[#3A5A58]">
              {availableRoomsCount} Müsait / {4 - availableRoomsCount} Dolu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {libraryData.studyRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 rounded-3xl border transition flex flex-col justify-between space-y-3 ${
                  room.isAvailable
                    ? 'bg-emerald-500/15 border-emerald-600/35'
                    : 'bg-rose-500/15 border-rose-600/35'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#142E2C]">
                      {room.name} ({room.capacity})
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black text-white ${
                        room.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                    >
                      {room.isAvailable ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Müsait</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Dolu</span>
                        </>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3A5A58] font-medium">
                    🛠️ {room.equipment}
                  </p>
                  <p className="text-xs font-extrabold text-[#142E2C]">
                    {room.isAvailable
                      ? '🟢 Şu an boş, kullanıma hazır'
                      : `🔴 ${room.currentGroup} (${room.availableAt})`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleStudyRoom(room.id)}
                  className={`w-full py-2 px-3 rounded-2xl text-xs font-black transition ${
                    room.isAvailable
                      ? 'bg-[#142E2C] text-white'
                      : 'bg-white text-rose-700 border border-rose-300'
                  }`}
                >
                  {room.isAvailable
                    ? 'Odayı Kullan (Dolu İşaretle)'
                    : 'Odayı Boşalt (Müsait İşaretle)'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. GÜNÜN YEMEKHANE MENÜSÜ (Sabit 300 TL & Detaylı Kalori Barları) (6 cols on Desktop) */}
      <section className="lg:col-span-6 glass-card rounded-[32px] p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shadow-sm shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#142E2C]">
                  ABÜ Yemekhane Menüsü
                </h2>
                <span className="px-3 py-0.5 rounded-full bg-[#142E2C] text-[#FF8A3D] text-xs font-black">
                  300 TL
                </span>
              </div>
              <p className="text-xs text-[#3A5A58] font-medium">
                {selectedMenu.dateText} • {selectedMenu.serviceHours}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-[#142E2C]/10 p-1 rounded-2xl">
            {CAFETERIA_MENUS.map((menu) => (
              <button
                key={menu.dayId}
                type="button"
                onClick={() => setSelectedDayId(menu.dayId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  selectedDayId === menu.dayId
                    ? 'bg-[#142E2C] text-white shadow-sm'
                    : 'text-[#142E2C] hover:bg-white/60'
                }`}
              >
                {menu.dayLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Price + Calories Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-3xl glass-tile flex items-center gap-3">
            <Wallet className="w-5 h-5 text-[#142E2C] shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-[#3A5A58]">
                Sabit Yemekhane Ücreti
              </p>
              <p className="text-lg font-black text-[#142E2C]">300 TL</p>
              <p className="text-[10px] text-[#3A5A58] font-semibold">
                4 Çeşit Günlük Menü
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-3xl glass-tile flex items-center gap-3">
            <Flame className="w-5 h-5 text-[#FF8A3D] shrink-0" />
            <div>
              <p className="text-[10px] font-black uppercase text-[#3A5A58]">
                Toplam Kalori & Makro
              </p>
              <p className="text-lg font-black text-[#142E2C]">
                {selectedMenu.totalCalories} kcal
              </p>
              <p className="text-[10px] text-[#3A5A58] font-semibold">
                {selectedMenu.proteinGrams}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Course Items with Calorie Bar */}
        <div className="space-y-2.5">
          {selectedMenu.items.map((item) => {
            const pct = Math.round(
              (item.calories / selectedMenu.totalCalories) * 100
            );
            return (
              <div
                key={item.category}
                className="p-3.5 rounded-3xl glass-tile space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="min-w-0">
                      <span className="text-[10px] font-black uppercase text-[#FF8A3D] block">
                        {item.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-[#142E2C] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#3A5A58] truncate">
                        🌱 Vegan: {item.veganAlt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 rounded-2xl bg-[#142E2C] text-white text-xs font-black">
                      {item.calories} kcal
                    </span>
                    <span className="block text-[10px] font-bold text-[#3A5A58] mt-0.5">
                      %{pct} pay
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#142E2C]/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#142E2C] to-[#FF8A3D]"
                    style={{ width: `${Math.min(100, pct * 1.8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenCafeteriaModal}
          className="w-full py-3 px-4 rounded-2xl bg-[#142E2C] hover:bg-[#FF8A3D] text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-md"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Detaylı Besin & Kalori Grafiği Modalını Aç</span>
        </button>
      </section>
    </div>
  );
}
