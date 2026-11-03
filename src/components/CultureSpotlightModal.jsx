import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Film,
  Star,
  MessageSquarePlus,
  Sparkles,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export default function CultureSpotlightModal({
  isOpen,
  onClose,
  cultureData,
  initialActiveTab = 'book',
  currentUser,
  onAddCultureReview,
}) {
  const [selectedType, setSelectedType] = useState(
    initialActiveTab === 'movie' ? 'movie' : 'book'
  );
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState('');

  useEffect(() => {
    setSelectedType(initialActiveTab === 'movie' ? 'movie' : 'book');
  }, [initialActiveTab]);

  if (!isOpen) return null;

  const book = cultureData.book;
  const movie = cultureData.movie;
  const activeItem = selectedType === 'book' ? book : movie;

  const calcAverage = (reviews) => {
    if (!reviews || reviews.length === 0) return '5.0';
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 5), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const bookAvg = calcAverage(book.reviews);
  const movieAvg = calcAverage(movie.reviews);
  const activeAvg = calcAverage(activeItem.reviews);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onAddCultureReview(selectedType, {
      id: `rev-${Date.now()}`,
      studentName: currentUser.name,
      department: currentUser.department,
      rating,
      comment: comment.trim(),
      date: 'Şimdi',
    });

    setComment('');
    setRating(5);
    setSubmittedNotice(
      selectedType === 'book'
        ? 'Ayın Kitabı için puan ve yorumunuz eklendi!'
        : 'Ayın Filmi için puan ve yorumunuz eklendi!'
    );
    setTimeout(() => setSubmittedNotice(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0B1C1B]/65 backdrop-blur-md p-0 sm:p-4">
      <div className="glass-card w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] border border-white/60 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-r from-[#142E2C] via-[#1D3534] to-[#3A5A58] text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[11px] font-black mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{cultureData.monthTitle}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            ABÜ Ayın Kitabı & Ayın Filmi Seçkisi
          </h2>
          <p className="text-xs text-[#A9C6C1] mt-0.5">
            Okuduğun kitabı veya izlediğin filmi 5 üzerinden puanla, yorumunu bırak!
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3.5 bg-black/25 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedType('book')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition ${
                selectedType === 'book'
                  ? 'bg-white text-[#142E2C] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#FF8A3D]" />
              <span>Ayın Kitabı ({bookAvg} ★)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('movie')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-black transition ${
                selectedType === 'movie'
                  ? 'bg-white text-[#142E2C] shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-[#FF8A3D]" />
              <span>Ayın Filmi ({movieAvg} ★)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div
            className={`rounded-3xl p-4 text-white bg-gradient-to-br ${activeItem.coverGradient} shadow-md space-y-2.5`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black mb-1">
                  {activeItem.badgeText}
                </span>
                <h3 className="text-lg font-black leading-snug">{activeItem.title}</h3>
                <p className="text-xs text-white/90 font-semibold">{activeItem.creator}</p>
                <p className="text-[11px] text-white/75 mt-0.5">{activeItem.meta}</p>
              </div>
              <div className="bg-black/25 backdrop-blur-md rounded-2xl px-3 py-2 text-center shrink-0">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-base">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{activeAvg}</span>
                </div>
                <span className="text-[10px] text-white/90 block">
                  5 üzerinden ({activeItem.reviews.length} oy)
                </span>
              </div>
            </div>

            <p className="text-xs text-white/95 leading-relaxed bg-black/20 p-3 rounded-2xl">
              {activeItem.summary}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-200">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{activeItem.discussionInfo}</span>
            </div>
          </div>

          {/* 5-Star Rating & Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="glass-tile rounded-3xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#142E2C] flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-[#FF8A3D]" />
                <span>5 Üzerinden Puan Ver & Yorum Yaz</span>
              </h4>
              <span className="text-xs font-black text-white bg-[#FF8A3D] px-2.5 py-0.5 rounded-full">
                {rating} / 5 ★
              </span>
            </div>

            <div className="flex items-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((starValue) => {
                const filled = (hoverRating || rating) >= starValue;
                return (
                  <button
                    key={starValue}
                    type="button"
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(starValue)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-black transition ${
                      filled
                        ? 'bg-[#142E2C] border-[#142E2C] text-[#FF8A3D] shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        filled ? 'fill-[#FF8A3D] text-[#FF8A3D]' : 'text-slate-300'
                      }`}
                    />
                    <span>{starValue}</span>
                  </button>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`"${activeItem.title}" hakkındaki düşüncelerini ABÜ öğrencileriyle paylaş...`}
              className="w-full p-3 rounded-2xl bg-white border border-[#142E2C]/15 text-xs text-[#142E2C]"
            />

            {submittedNotice && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-500/20 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submittedNotice}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-2xl bg-[#FF8A3D] hover:bg-[#E66B1F] text-white font-black text-xs shadow-sm transition"
            >
              Puanı ({rating}/5 ★) ve Yorumu Paylaş
            </button>
          </form>

          {/* Student Reviews */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#3A5A58]">
              ABÜ Öğrenci Yorumları ({activeItem.reviews.length})
            </h4>
            {activeItem.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-3.5 rounded-2xl glass-tile space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#142E2C]">
                    {rev.studentName}{' '}
                    <span className="font-semibold text-[11px] text-[#3A5A58]">
                      • {rev.department}
                    </span>
                  </span>
                  <span className="text-xs font-black text-[#FF8A3D]">
                    {'★'.repeat(rev.rating)}
                  </span>
                </div>
                <p className="text-xs text-[#1D3534] leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
