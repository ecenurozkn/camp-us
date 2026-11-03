import React, { useState } from 'react';
import {
  X,
  Utensils,
  Flame,
  Wallet,
  BarChart3,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CAFETERIA_MENUS } from '../data/mockCampusData';

export default function CafeteriaModal({ isOpen, onClose }) {
  const [selectedDayId, setSelectedDayId] = useState('today');

  if (!isOpen) return null;

  const menu =
    CAFETERIA_MENUS.find((m) => m.dayId === selectedDayId) ||
    CAFETERIA_MENUS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0B1C1B]/65 backdrop-blur-md p-0 sm:p-4">
      <div className="glass-card w-full max-w-xl rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] flex flex-col overflow-hidden border border-white/60">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-[#142E2C] via-[#1D3534] to-[#3A5A58] text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[11px] font-extrabold mb-1.5">
            <Utensils className="w-3.5 h-3.5" />
            <span>ABÜ Yemekhane • Günlük Sabit Ücret: 300 TL</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black">
            Yemekhane Menü & Kalori Analizi Detayı
          </h2>
          <p className="text-xs text-white/80 mt-0.5">
            Her bir yemeğin kalorisi (kcal), makro besin dağılımı ve toplam enerji grafiği
          </p>

          {/* Day Selector */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 bg-black/25 p-1 rounded-2xl">
            {CAFETERIA_MENUS.map((m) => (
              <button
                key={m.dayId}
                type="button"
                onClick={() => setSelectedDayId(m.dayId)}
                className={`py-1.5 px-2 rounded-xl text-xs font-extrabold transition ${
                  selectedDayId === m.dayId
                    ? 'bg-white text-[#142E2C] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {m.dayLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Price & Total Calorie Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-tile p-3.5 rounded-3xl flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-[#3A5A58]">
                  Günlük Sabit Menü Ücreti
                </p>
                <p className="text-xl font-black text-[#142E2C]">
                  {menu.studentPrice}
                </p>
                <p className="text-[10px] text-[#3A5A58] font-medium">
                  4 Çeşit Tam Öğün • ABÜ Yemekhane
                </p>
              </div>
            </div>

            <div className="glass-tile p-3.5 rounded-3xl flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#FF8A3D] text-white flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-[#3A5A58]">
                  Toplam Menü Kalorisi
                </p>
                <p className="text-xl font-black text-[#142E2C]">
                  {menu.totalCalories} kcal
                </p>
                <p className="text-[10px] text-[#3A5A58] font-medium">
                  {menu.totalProtein}g Protein • {menu.totalCarbs}g Karb • {menu.totalFat}g Yağ
                </p>
              </div>
            </div>
          </div>

          {/* Visual Calorie Distribution Stacked Bar Chart */}
          <div className="glass-tile p-4 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#142E2C] flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#FF8A3D]" />
                <span>Öğün Kalori Dağılım Grafiği ({menu.totalCalories} kcal)</span>
              </h3>
              <span className="text-[11px] font-bold text-[#3A5A58]">
                <Clock className="w-3.5 h-3.5 inline mr-1" />
                {menu.serviceHours}
              </span>
            </div>

            {/* Stacked Visual Bar */}
            <div className="w-full h-5 rounded-full bg-[#142E2C]/10 overflow-hidden flex p-0.5 gap-0.5">
              {menu.items.map((item, idx) => {
                const pct = Math.round((item.calories / menu.totalCalories) * 100);
                const colors = [
                  'bg-teal-600',
                  'bg-[#FF8A3D]',
                  'bg-[#142E2C]',
                  'bg-amber-500',
                ];
                return (
                  <div
                    key={item.category}
                    style={{ width: `${pct}%` }}
                    className={`${colors[idx % colors.length]} h-full first:rounded-l-full last:rounded-r-full transition-all`}
                    title={`${item.category}: ${item.calories} kcal (%${pct})`}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-[10px] font-extrabold text-[#142E2C]">
              {menu.items.map((item, idx) => {
                const pct = Math.round((item.calories / menu.totalCalories) * 100);
                const dotColors = [
                  'bg-teal-600',
                  'bg-[#FF8A3D]',
                  'bg-[#142E2C]',
                  'bg-amber-500',
                ];
                return (
                  <div key={item.category} className="flex items-center gap-1 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColors[idx]}`} />
                    <span className="truncate">
                      {item.category} (%{pct})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Individual Meal Items with Detailed Calorie & Macro Bars */}
          <div className="space-y-2.5">
            {menu.items.map((item) => {
              const pctOfTotal = Math.round(
                (item.calories / menu.totalCalories) * 100
              );
              return (
                <div
                  key={item.category}
                  className="glass-tile p-4 rounded-3xl space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#142E2C] text-white text-[10px] font-extrabold uppercase">
                          {item.category}
                        </span>
                        <h4 className="text-sm font-black text-[#142E2C] mt-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-[#3A5A58] font-medium">
                          🌱 Vegan Alternatif: {item.veganAlt}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-2xl bg-[#FF8A3D] text-white text-xs font-black shadow-sm inline-block">
                        {item.calories} kcal
                      </span>
                      <span className="block text-[10px] font-bold text-[#3A5A58] mt-1">
                        Toplamın %{pctOfTotal}’i
                      </span>
                    </div>
                  </div>

                  {/* Individual Calorie Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#142E2C]/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#142E2C] to-[#FF8A3D]"
                      style={{ width: `${Math.min(100, pctOfTotal * 1.8)}%` }}
                    />
                  </div>

                  {/* Macros Pill Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-[#142E2C] pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-white/80">
                        🥩 Protein: {item.protein}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-white/80">
                        🌾 Karb: {item.carbs}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg bg-white/80">
                        🫒 Yağ: {item.fat}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#3A5A58]">
                      Alerjen: {item.allergen}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white/60 border-t border-white/60 flex items-center justify-between">
          <span className="text-xs font-bold text-[#142E2C]">
            Günlük Yemekhane Ücreti: <strong className="text-[#FF8A3D]">300 TL</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#142E2C] hover:bg-[#1D3534] text-white text-xs font-extrabold transition"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
