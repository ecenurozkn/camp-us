import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  SmilePlus,
  PenLine,
  Users,
  Hash,
} from 'lucide-react';
import { MOOD_OPTIONS, STATUS_OPTIONS } from '../data/mockCampusData';

export default function SocialFeedTab({
  posts,
  currentUser,
  onAddPost,
  onToggleLike,
  onAddComment,
  onOpenNetworkModal,
}) {
  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('#KampüsGünlüğü #CampUs');
  const [commentInputs, setCommentInputs] = useState({});
  const [openCommentsFor, setOpenCommentsFor] = useState(['post-1']);
  const [moodFilter, setMoodFilter] = useState('Tümü');

  const handlePublishPost = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const parsedTags = tagInput
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    onAddPost({
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorEmail: currentUser.email,
      department: `${currentUser.department} • ${currentUser.grade || 'Lisans'}`,
      authorInitials: currentUser.initials,
      avatarBg: currentUser.avatarBg || 'from-indigo-600 to-sky-500',
      authorStatus: currentUser.status,
      mood: selectedMood,
      title:
        title.trim() ||
        `${selectedMood.emoji} ${currentUser.name} Kampüs Düşüncesi`,
      content: content.trim(),
      tags: parsedTags.length ? parsedTags : ['#CampUs'],
      createdAt: 'Az önce',
      likes: 1,
      likedByMe: true,
      comments: [],
    });

    setTitle('');
    setContent('');
  };

  const handleCommentSubmit = (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    onAddComment(postId, {
      id: `c-${Date.now()}`,
      authorName: currentUser.name,
      department: currentUser.department,
      text,
      time: 'Şimdi',
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    if (!openCommentsFor.includes(postId)) {
      setOpenCommentsFor((prev) => [...prev, postId]);
    }
  };

  const toggleCommentsSection = (postId) => {
    setOpenCommentsFor((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const getStatusMeta = (statusId) =>
    STATUS_OPTIONS.find((s) => s.id === statusId) || STATUS_OPTIONS[0];

  const filteredPosts =
    moodFilter === 'Tümü'
      ? posts
      : posts.filter((p) => p.mood?.label === moodFilter);

  return (
    <div className="space-y-5 pb-6">
      {/* 1. YENİ BLOG YAZISI & DUYGU DURUMU PAYLAŞIM KARTI */}
      <section className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Kampüs Blog & Duygu Durumu Paylaş
              </h2>
              <p className="text-xs text-slate-500">
                Ortak ağdaki tüm okul arkadaşların takip şartı olmadan paylaşımını görür
              </p>
            </div>
          </div>

          {(() => {
            const st = getStatusMeta(currentUser.status);
            return (
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${st.badgeClass}`}
              >
                {st.emoji} {st.label}
              </span>
            );
          })()}
        </div>

        <form onSubmit={handlePublishPost} className="space-y-3">
          {/* Mood / Emoji Tag Selector */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <SmilePlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Şu Anki Duygu Durumunu Seç (Emoji / Etiket):</span>
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {MOOD_OPTIONS.map((mood) => {
                const active = selectedMood.id === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3 py-1.5 rounded-2xl border text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Blog Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Kısa blog başlığı (Örn: Kütüphane 3. Katta Gece Çalışması ve Kahve...)"
            className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition"
          />

          {/* Blog / Campus Thought Content */}
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Bugün kampüste neler oluyor, ${currentUser.name.split(' ')[0]}? Düşüncelerini, ders notlarını veya kampüs anını paylaş...`}
            className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
            <div className="relative flex-1">
              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="#Etiketler"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium text-indigo-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 inline-flex items-center justify-center gap-2 transition shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ortak Kampüs Akışında Paylaş</span>
            </button>
          </div>
        </form>
      </section>

      {/* 2. DUYGU DURUMU FİLTRESİ & ORTAK AĞ BİLGİSİ */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMoodFilter('Tümü')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
              moodFilter === 'Tümü'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            🌐 Tüm Akış ({posts.length})
          </button>
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMoodFilter(m.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                moodFilter === m.label
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. SOSYAL AKIŞ (FEED) KARTLARI */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const authorStatusMeta = getStatusMeta(post.authorStatus);
          const commentsOpen = openCommentsFor.includes(post.id);

          return (
            <article
              key={post.id}
              className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-soft space-y-3.5"
            >
              {/* Author & Mood + Live Campus Status Header */}
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() =>
                    onOpenNetworkModal({
                      id: post.id,
                      name: post.authorName,
                      email: post.authorEmail,
                      department: post.department,
                      status: post.authorStatus,
                      initials: post.authorInitials,
                      avatarBg: post.avatarBg,
                    })
                  }
                  className="cursor-pointer flex items-center gap-3 group"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                      post.avatarBg || 'from-indigo-500 to-sky-500'
                    } text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm`}
                  >
                    {post.authorInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition">
                        {post.authorName}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${authorStatusMeta.badgeClass}`}
                      >
                        <span>{authorStatusMeta.emoji}</span>
                        <span>{authorStatusMeta.label}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {post.department} • {post.createdAt}
                    </p>
                  </div>
                </div>

                {/* Mood Badge */}
                {post.mood && (
                  <span
                    className={`px-2.5 py-1 rounded-2xl text-[11px] font-extrabold border shrink-0 flex items-center gap-1 ${
                      post.mood.color ||
                      'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}
                  >
                    <span>{post.mood.emoji}</span>
                    <span>{post.mood.label}</span>
                  </span>
                )}
              </div>

              {/* Blog Post Title & Body */}
              <div className="space-y-1.5">
                {post.title && (
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                    {post.title}
                  </h4>
                )}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-indigo-600 text-[11px] font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Like & Comment Action Bar */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleLike(post.id)}
                    className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold inline-flex items-center gap-1.5 border transition ${
                      post.likedByMe
                        ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                        : 'bg-slate-50 hover:bg-rose-50/50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.likedByMe
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-500'
                      }`}
                    />
                    <span>{post.likes} Beğeni</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCommentsSection(post.id)}
                    className="px-3.5 py-1.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 text-slate-600 border border-slate-200 text-xs font-extrabold inline-flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-indigo-500" />
                    <span>{post.comments.length} Yorum</span>
                  </button>
                </div>

                <span className="text-[10px] font-semibold text-slate-400 inline-flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Ortak Ağda Açık
                </span>
              </div>

              {/* Comments Section */}
              {commentsOpen && (
                <div className="pt-2 space-y-2.5">
                  {post.comments.length > 0 && (
                    <div className="space-y-2 bg-slate-50/90 p-3 rounded-2xl border border-slate-100">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className="text-xs bg-white p-2.5 rounded-xl border border-slate-100 space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-800">
                              {c.authorName}{' '}
                              <span className="font-normal text-[10px] text-slate-400">
                                ({c.department})
                              </span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {c.time}
                            </span>
                          </div>
                          <p className="text-slate-600">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCommentSubmit(post.id);
                        }
                      }}
                      placeholder="Bu paylaşıma yorum bırak..."
                      className="flex-1 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleCommentSubmit(post.id)}
                      className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition shrink-0"
                      title="Yorum Gönder"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
