import React, { useState } from 'react';
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
  initialActiveTab = 'overview', // 'overview' | 'book' | 'movie'
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/55 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Modal Header */}
        <div className="px-5 pt-5 pb-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{cultureData.monthTitle}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Ayın Kitabı & Ayın Filmi Seçkisi
          </h2>
          <p className="text-xs text-indigo-100 mt-0.5">
            Okuduğun kitabı veya izlediğin filmi 5 üzerinden puanla, kampüs tartışmasına katıl!
          </p>

          {/* Switch Tabs: Ayın Kitabı vs Ayın Filmi */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 bg-slate-900/20 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedType('book')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                selectedType === 'book'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ayın Kitabı ({bookAvg} ★)</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('movie')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
                selectedType === 'movie'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4" />
              <span>Ayın Filmi ({movieAvg} ★)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick Dual Summary Pill if user wants to see both at a glance */}
          <div className="grid grid-cols-2 gap-2.5">
            <div
              onClick={() => setSelectedType('book')}
              className={`cursor-pointer p-3 rounded-2xl border transition ${
                selectedType === 'book'
                  ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/15'
                  : 'bg-slate-50 border-slate-200/80 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 mb-0.5">
                <span>📖 AYIN KİTABI</span>
                <span className="text-amber-600">★ {bookAvg}</span>
              </div>
              <p className="text-xs font-extrabold text-slate-900 truncate">{book.title}</p>
              <p className="text-[11px] text-slate-500 truncate">{book.creator}</p>
            </div>

            <div
              onClick={() => setSelectedType('movie')}
              className={`cursor-pointer p-3 rounded-2xl border transition ${
                selectedType === 'movie'
                  ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/15'
                  : 'bg-slate-50 border-slate-200/80 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-rose-600 mb-0.5">
                <span>🎬 AYIN FİLMİ</span>
                <span className="text-amber-600">★ {movieAvg}</span>
              </div>
              <p className="text-xs font-extrabold text-slate-900 truncate">{movie.title}</p>
              <p className="text-[11px] text-slate-500 truncate">{movie.originalTitle}</p>
            </div>
          </div>

          {/* Active Item Hero Card */}
          <div
            className={`rounded-3xl p-4 text-white bg-gradient-to-br ${activeItem.coverGradient} shadow-md relative overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold mb-1.5">
                  {activeItem.badgeText}
                </span>
                <h3 className="text-lg font-extrabold leading-snug">{activeItem.title}</h3>
                <p className="text-xs text-white/90 font-medium">{activeItem.creator}</p>
                <p className="text-[11px] text-white/75 mt-1">{activeItem.meta}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-3 py-2 text-center shrink-0">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-extrabold text-base">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{activeAvg}</span>
                </div>
                <span className="text-[10px] text-white/90 block">
                  5 üzerinden ({activeItem.reviews.length} oy)
                </span>
              </div>
            </div>

            <p className="text-xs text-white/95 leading-relaxed mt-3 bg-black/15 p-3 rounded-2xl">
              {activeItem.summary}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-200 mt-2.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{activeItem.discussionInfo}</span>
            </div>
          </div>

          {/* 5-Star Rating & Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="bg-slate-50 rounded-3xl p-4 border border-slate-200/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-indigo-600" />
                <span>
                  {selectedType === 'book'
                    ? 'Kitabı Okudun mu? Puan Ver & Yorum Yaz'
                    : 'Filmi İzledin mi? Puan Ver & Yorum Yaz'}
                </span>
              </h4>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {rating} / 5 Yıldız
              </span>
            </div>

            {/* Interactive 1-5 Star Selector */}
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
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition ${
                      filled
                        ? 'bg-amber-50 border-amber-300 text-amber-600 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        filled ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
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
              placeholder={
                selectedType === 'book'
                  ? `"${book.title}" hakkındaki düşüncelerini kampüsle paylaş...`
                  : `"${movie.title}" filmi hakkındaki yorumunu yaz...`
              }
              className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />

            {submittedNotice && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{submittedNotice}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
            >
              Puanı ({rating}/5 ★) ve Yorumu Paylaş
            </button>
          </form>

          {/* Student Reviews List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Öğrenci Değerlendirmeleri ({activeItem.reviews.length})
            </h4>
            <div className="space-y-2">
              {activeItem.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        {rev.studentName}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5">
                        • {rev.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  <p className="text-[10px] text-slate-400">{rev.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Ana ekrandan her zaman tekrar açabilirsiniz
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            Ana Ekrana Dön
          </button>
        </div>
      </div>
    </div>
  );
}
