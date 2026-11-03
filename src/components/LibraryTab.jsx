import React from 'react';
import {
  Library,
  DoorOpen,
  CheckCircle2,
  XCircle,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function LibraryTab({
  libraryData,
  onToggleStudyRoom,
  onChangeLibraryOccupancy,
}) {
  const occupancyPercent = Math.round(
    (libraryData.currentUsers / libraryData.totalCapacity) * 100
  );

  const getOccupancyMeta = (pct) => {
    if (pct < 40) {
      return {
        label: 'Tenha',
        colorClass: 'bg-emerald-500/20 text-emerald-950 border-emerald-600/30',
        barGradient: 'from-emerald-600 to-teal-500',
        description:
          'Kütüphane şu an oldukça sakin. Bireysel çalışma masaları ve prizli koltuklar bolca müsait.',
      };
    }
    if (pct < 75) {
      return {
        label: 'Orta',
        colorClass: 'bg-amber-500/25 text-amber-950 border-amber-600/35',
        barGradient: 'from-[#FF8A3D] to-amber-500',
        description:
          'Dengeli kampüs yoğunluğu. Sessiz çalışma katında ve grup masalarında rahatlıkla yer bulunabilir.',
      };
    }
    return {
      label: 'Yoğun',
      colorClass: 'bg-rose-500/20 text-rose-950 border-rose-600/30',
      barGradient: 'from-rose-600 to-red-600',
      description:
        'Sınav haftası yoğunluğu! Boş koltuk sayısı sınırlı, özel çalışma odalarını kontrol edebilirsiniz.',
    };
  };

  const occMeta = getOccupancyMeta(occupancyPercent);
  const availableRoomsCount = libraryData.studyRooms.filter(
    (r) => r.isAvailable
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* ÜST ÖZET KARTI: KÜTÜPHANE CANLI DOLULUK SAYACI */}
      <section className="glass-card rounded-[32px] p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shadow-sm shrink-0">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-[#142E2C]">
                  ABÜ Merkez Kütüphane Canlı Doluluk
                </h2>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-black border ${occMeta.colorClass}`}
                >
                  %{occupancyPercent} • {occMeta.label}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3A5A58] font-medium mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>{libraryData.openHours}</span>
                <span>•</span>
                <span>{libraryData.lastUpdated}</span>
              </p>
            </div>
          </div>

          {/* Yoğunluk Test / Simülasyon Seçici */}
          <div className="flex items-center gap-1.5 bg-[#142E2C]/10 p-1.5 rounded-2xl">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                    active
                      ? 'bg-[#142E2C] text-white shadow-sm'
                      : 'text-[#142E2C] hover:bg-white'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Canlı Sayaç ve İlerleme Çubuğu */}
        <div className="p-5 rounded-3xl glass-tile space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
                Anlık Kütüphane Doluluk Oranı
              </p>
              <div className="flex items-baseline gap-2.5 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#142E2C]">
                  %{occupancyPercent}
                </span>
                <span className="text-base font-extrabold text-[#FF8A3D]">
                  ({occMeta.label})
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#3A5A58]">
                  • {libraryData.currentUsers} / {libraryData.totalCapacity} Koltuk Dolu
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-950 bg-emerald-500/20 border border-emerald-600/30 px-3.5 py-1.5 rounded-full">
                🟢 {libraryData.totalCapacity - libraryData.currentUsers} Boş Koltuk Mevcut
              </span>
            </div>
          </div>

          <div className="w-full h-4 rounded-full bg-[#142E2C]/10 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${occMeta.barGradient} transition-all duration-500`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#3A5A58] font-semibold">
            <span>{occMeta.description}</span>
            <span>📶 {libraryData.wifiStatus}</span>
          </div>
        </div>
      </section>

      {/* 4 ADET ÖZEL ÇALIŞMA ODASI (ODA 1, ODA 2, ODA 3, ODA 4) */}
      <section className="glass-card rounded-[32px] p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shadow-sm shrink-0">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#142E2C]">
                Özel Çalışma Odaları (Oda 1 – Oda 4)
              </h3>
              <p className="text-xs sm:text-sm text-[#3A5A58] font-medium">
                Grup çalışması için 4 özel odanın gerçek zamanlı müsaitlik durumu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-950 border border-emerald-600/30 text-xs font-black">
              {availableRoomsCount} Oda Müsait
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-rose-500/20 text-rose-950 border border-rose-600/30 text-xs font-black">
              {4 - availableRoomsCount} Oda Dolu
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {libraryData.studyRooms.map((room) => (
            <div
              key={room.id}
              className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
                room.isAvailable
                  ? 'bg-emerald-500/15 border-emerald-600/35'
                  : 'bg-rose-500/15 border-rose-600/35'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-black text-[#142E2C]">
                    {room.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black text-white ${
                      room.isAvailable ? 'bg-emerald-600' : 'bg-rose-600'
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

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3A5A58]">
                  <Users className="w-3.5 h-3.5 text-[#142E2C]" />
                  <span>Kapasite: {room.capacity}</span>
                </div>

                <p className="text-xs text-[#3A5A58] font-medium">
                  🛠️ Donanım: {room.equipment}
                </p>

                <div className="p-3 rounded-2xl bg-white border border-[#142E2C]/10 text-xs font-extrabold text-[#142E2C]">
                  {room.isAvailable
                    ? '🟢 Şu an boş, hemen giriş yapabilirsiniz'
                    : `🔴 ${room.currentGroup} (${room.availableAt})`}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleStudyRoom(room.id)}
                className={`w-full py-2.5 px-3 rounded-2xl text-xs font-black transition shadow-sm ${
                  room.isAvailable
                    ? 'bg-[#142E2C] hover:bg-[#1D3534] text-white'
                    : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-300'
                }`}
              >
                {room.isAvailable
                  ? 'Odayı Kullan (Dolu İşaretle)'
                  : 'Odayı Boşalt (Müsait İşaretle)'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
