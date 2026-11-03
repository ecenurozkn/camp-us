import React, { useState } from 'react';
import {
  Utensils,
  Flame,
  Wallet,
  Clock,
  BarChart3,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { CAFETERIA_MENUS } from '../data/mockCampusData';

export default function CafeteriaTab({ onOpenCafeteriaModal }) {
  const [selectedDayId, setSelectedDayId] = useState('today');

  const selectedMenu =
    CAFETERIA_MENUS.find((m) => m.dayId === selectedDayId) ||
    CAFETERIA_MENUS[0];

  return (
    <div className="space-y-6 pb-12">
      {/* ÜST ÖZET KARTI: ABÜ YEMEKHANE MENÜSÜ, 300 TL ÜCRET VE KALORİ ÖZETİ */}
      <section className="glass-card rounded-[32px] p-5 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shadow-sm shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-[#142E2C]">
                  ABÜ Günün Yemekhane Menüsü
                </h2>
                <span className="px-3.5 py-1 rounded-full bg-[#142E2C] text-[#FF8A3D] text-xs font-black">
                  Sabit 300 TL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3A5A58] font-medium mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>{selectedMenu.dateText}</span>
                <span>•</span>
                <span>{selectedMenu.serviceHours}</span>
              </p>
            </div>
          </div>

          {/* Gün Seçici */}
          <div className="flex items-center gap-1.5 bg-[#142E2C]/10 p-1.5 rounded-2xl">
            {CAFETERIA_MENUS.map((menu) => (
              <button
                key={menu.dayId}
                type="button"
                onClick={() => setSelectedDayId(menu.dayId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                  selectedDayId === menu.dayId
                    ? 'bg-[#142E2C] text-white shadow-sm'
                    : 'text-[#142E2C] hover:bg-white'
                }`}
              >
                {menu.dayLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Ücret & Kalori Bilgi Kutuları */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-3xl glass-tile flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#3A5A58]">
                Güncel Yemekhane Ücreti
              </p>
              <p className="text-xl font-black text-[#142E2C]">300 TL</p>
              <p className="text-xs text-[#3A5A58] font-semibold">
                4 Çeşit Tam Öğün (KampüsKart)
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl glass-tile flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#3A5A58]">
                Toplam Kalori Değeri
              </p>
              <p className="text-xl font-black text-[#142E2C]">
                {selectedMenu.totalCalories} kcal
              </p>
              <p className="text-xs text-[#3A5A58] font-semibold">
                Dengeli Günlük Enerji Dağılımı
              </p>
            </div>
          </div>

          <div className="p-4 rounded-3xl glass-tile flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase text-[#3A5A58]">
                Protein & Vegan Seçenek
              </p>
              <p className="text-sm font-black text-[#142E2C]">
                {selectedMenu.proteinGrams}
              </p>
              <p className="text-xs text-emerald-800 font-bold">
                Her öğünde vegan alternatif mevcuttur
              </p>
            </div>
          </div>
        </div>

        {/* 4 Çeşit Yemek Kartları ve Kalori Dağılım Barları */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedMenu.items.map((item) => {
            const pct = Math.round(
              (item.calories / selectedMenu.totalCalories) * 100
            );
            return (
              <div
                key={item.category}
                className="p-5 rounded-3xl glass-tile space-y-3 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-3xl leading-none mt-0.5">
                      {item.icon}
                    </span>
                    <div className="min-w-0 space-y-1">
                      <span className="text-[11px] font-black uppercase text-[#FF8A3D] block">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-[#142E2C]">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#3A5A58] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Vegan Alternatif: {item.veganAlt}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-3 py-1 rounded-2xl bg-[#142E2C] text-white text-xs font-black">
                      {item.calories} kcal
                    </span>
                    <span className="block text-[11px] font-bold text-[#3A5A58] mt-1">
                      Menünün %{pct}’i
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-[#142E2C]/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#142E2C] to-[#FF8A3D]"
                    style={{ width: `${Math.min(100, pct * 1.8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detaylı Besin & Kalori Modalı Açma Butonu */}
        <button
          type="button"
          onClick={onOpenCafeteriaModal}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#142E2C] hover:bg-[#FF8A3D] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition shadow-md"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Detaylı Kalori Dağılımı & Besin Değerleri Modalını Aç</span>
        </button>
      </section>
    </div>
  );
}
