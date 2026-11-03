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
  Award,
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
  const [tagInput, setTagInput] = useState('#ABÜ #CampUs #MaltepeKampüs');
  const [commentInputs, setCommentInputs] = useState({});
  const [openCommentsFor, setOpenCommentsFor] = useState(['post-1', 'post-2']);
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
      avatarBg: currentUser.avatarBg || 'from-[#142E2C] to-[#3A5A58]',
      authorStatus: currentUser.status,
      authorBadges: currentUser.titleBadges || [],
      mood: selectedMood,
      title:
        title.trim() ||
        `${selectedMood.emoji} ${currentUser.name} Kampüs Düşüncesi`,
      content: content.trim(),
      tags: parsedTags.length ? parsedTags : ['#ABÜ'],
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
      authorBadge: currentUser.titleBadges?.[0] || null,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-10">
      {/* Left 5 Cols on Desktop: Compose Blog Post + User Badges Card */}
      <div className="lg:col-span-5 space-y-4">
        <section className="glass-card rounded-[32px] p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#142E2C] text-[#FF8A3D] flex items-center justify-center shrink-0">
                <PenLine className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#142E2C]">
                  ABÜ Sosyal Akış & Blog Paylaş
                </h2>
                <p className="text-xs text-[#3A5A58] font-medium">
                  Görev rozetlerin ve duygu durumunla ortak ağda paylaş
                </p>
              </div>
            </div>
          </div>

          {/* Active User Title Badges Preview */}
          {currentUser.titleBadges?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-2xl glass-tile">
              <span className="text-[10px] font-black uppercase text-[#3A5A58] mr-1">
                Aktif Unvanların:
              </span>
              {currentUser.titleBadges.map((badge) => (
                <span
                  key={badge}
                  className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black"
                >
                  🏅 {badge}
                </span>
              ))}
            </div>
          )}

          <form onSubmit={handlePublishPost} className="space-y-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#3A5A58] mb-1.5 flex items-center gap-1">
                <SmilePlus className="w-3.5 h-3.5 text-[#FF8A3D]" />
                <span>Duygu Durumu Seç:</span>
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {MOOD_OPTIONS.map((mood) => {
                  const active = selectedMood.id === mood.id;
                  return (
                    <button
                      key={mood.id}
                      type="button"
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1.5 rounded-2xl border text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition ${
                        active
                          ? 'bg-[#142E2C] text-white border-[#142E2C] shadow-sm'
                          : 'bg-white/75 text-[#142E2C] border-[#142E2C]/15 hover:bg-white'
                      }`}
                    >
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Blog Başlığı (Örn: Bahçede Coffee Hub Molası & MIS Zirvesi...)"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white/85 border border-[#142E2C]/15 text-xs font-bold text-[#142E2C]"
            />

            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`ABÜ kampüsünde bugün neler oluyor, ${currentUser.name.split(' ')[0]}?`}
              className="w-full p-3.5 rounded-2xl bg-white/85 border border-[#142E2C]/15 text-xs text-[#142E2C]"
            />

            <div className="relative">
              <Hash className="w-3.5 h-3.5 text-[#3A5A58] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-2xl bg-white/85 border border-[#142E2C]/15 text-[11px] font-bold text-[#142E2C]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-2xl bg-[#FF8A3D] hover:bg-[#E66B1F] text-white text-xs font-black shadow-md flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>ABÜ Ortak Kampüs Akışında Paylaş</span>
            </button>
          </form>
        </section>
      </div>

      {/* Right 7 Cols on Desktop: Social Feed Stream */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setMoodFilter('Tümü')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap border transition ${
              moodFilter === 'Tümü'
                ? 'bg-[#142E2C] text-white border-[#142E2C]'
                : 'bg-white/80 text-[#142E2C] border-white/60'
            }`}
          >
            🌐 Tüm Akış ({posts.length})
          </button>
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMoodFilter(m.label)}
              className={`px-3 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap border transition ${
                moodFilter === m.label
                  ? 'bg-[#FF8A3D] text-white border-[#FF8A3D]'
                  : 'bg-white/80 text-[#142E2C] border-white/60'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const authorStatusMeta = getStatusMeta(post.authorStatus);
            const commentsOpen = openCommentsFor.includes(post.id);

            return (
              <article
                key={post.id}
                className="glass-card rounded-[32px] p-5 space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() =>
                      onOpenNetworkModal({
                        id: post.id,
                        name: post.authorName,
                        email: post.authorEmail,
                        department: post.department,
                        status: post.authorStatus,
                        titleBadges: post.authorBadges || [],
                        initials: post.authorInitials,
                        avatarBg: post.avatarBg,
                      })
                    }
                    className="cursor-pointer flex items-start gap-3 group"
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${
                        post.avatarBg || 'from-[#142E2C] to-[#3A5A58]'
                      } text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {post.authorInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-black text-[#142E2C] group-hover:text-[#FF8A3D] transition">
                          {post.authorName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${authorStatusMeta.badgeClass}`}
                        >
                          <span>{authorStatusMeta.emoji}</span>
                          <span>{authorStatusMeta.label}</span>
                        </span>
                      </div>

                      {/* Colorful Title Badges Next to Author Name */}
                      {post.authorBadges && post.authorBadges.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.authorBadges.map((badge, idx) => (
                            <span
                              key={badge}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                                idx === 0
                                  ? 'bg-[#FF8A3D] text-white'
                                  : 'bg-[#142E2C] text-[#A9C6C1]'
                              }`}
                            >
                              🏅 {badge}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-[11px] text-[#3A5A58] font-medium mt-0.5">
                        {post.department} • {post.createdAt}
                      </p>
                    </div>
                  </div>

                  {post.mood && (
                    <span
                      className={`px-2.5 py-1 rounded-2xl text-[11px] font-black border shrink-0 flex items-center gap-1 ${post.mood.color}`}
                    >
                      <span>{post.mood.emoji}</span>
                      <span className="hidden sm:inline">{post.mood.label}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {post.title && (
                    <h4 className="text-sm sm:text-base font-black text-[#142E2C]">
                      {post.title}
                    </h4>
                  )}
                  <p className="text-xs sm:text-sm text-[#1D3534] leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg bg-[#142E2C]/10 text-[#142E2C] text-[11px] font-extrabold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#142E2C]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleLike(post.id)}
                      className={`px-3.5 py-1.5 rounded-2xl text-xs font-black inline-flex items-center gap-1.5 border transition ${
                        post.likedByMe
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white/75 text-[#142E2C] border-[#142E2C]/15'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.likedByMe ? 'fill-white text-white' : ''
                        }`}
                      />
                      <span>{post.likes} Beğeni</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleCommentsSection(post.id)}
                      className="px-3.5 py-1.5 rounded-2xl bg-white/75 text-[#142E2C] border border-[#142E2C]/15 text-xs font-black inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4 text-[#FF8A3D]" />
                      <span>{post.comments.length} Yorum</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-[#3A5A58]">
                    ABÜ Ortak Ağda Açık
                  </span>
                </div>

                {commentsOpen && (
                  <div className="pt-2 space-y-2.5">
                    {post.comments.length > 0 && (
                      <div className="space-y-2 p-3 rounded-2xl glass-tile">
                        {post.comments.map((c) => (
                          <div
                            key={c.id}
                            className="text-xs bg-white/85 p-2.5 rounded-xl space-y-1"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-black text-[#142E2C]">
                                  {c.authorName}
                                </span>
                                {c.authorBadge && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[9px] font-black">
                                    🏅 {c.authorBadge}
                                  </span>
                                )}
                                <span className="text-[10px] text-[#3A5A58]">
                                  ({c.department})
                                </span>
                              </div>
                              <span className="text-[10px] text-[#3A5A58]">
                                {c.time}
                              </span>
                            </div>
                            <p className="text-[#1D3534]">{c.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

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
                        placeholder="Yorum bırak..."
                        className="flex-1 px-3.5 py-2 rounded-2xl bg-white/85 border border-[#142E2C]/15 text-xs text-[#142E2C]"
                      />
                      <button
                        type="button"
                        onClick={() => handleCommentSubmit(post.id)}
                        className="p-2.5 rounded-2xl bg-[#142E2C] hover:bg-[#FF8A3D] text-white transition"
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
    </div>
  );
}
