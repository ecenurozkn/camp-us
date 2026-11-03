import React, { useState, useEffect } from 'react';
import {
  Home,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageSquareHeart,
  Smartphone,
  Sparkles,
  LogOut,
  RotateCcw,
  X,
  Share,
  PlusSquare,
} from 'lucide-react';

import {
  STATUS_OPTIONS,
  INITIAL_STUDENTS,
  INITIAL_CULTURE_PICKS,
  INITIAL_LIBRARY_DATA,
  INITIAL_CLUBS,
  INITIAL_EVENT_PROPOSALS,
  INITIAL_FEED_POSTS,
} from './data/mockCampusData';

import AuthScreen from './components/AuthScreen';
import DashboardTab from './components/DashboardTab';
import CalendarAnnouncementsTab from './components/CalendarAnnouncementsTab';
import ClubsTab from './components/ClubsTab';
import LibraryCafeteriaTab from './components/LibraryCafeteriaTab';
import SocialFeedTab from './components/SocialFeedTab';
import CultureSpotlightModal from './components/CultureSpotlightModal';
import CampusNetworkModal from './components/CampusNetworkModal';

const STORAGE_KEYS = {
  USER: 'campus_pwa_user_v1',
  STUDENTS: 'campus_pwa_students_v1',
  CULTURE: 'campus_pwa_culture_v1',
  LIBRARY: 'campus_pwa_library_v1',
  PROPOSALS: 'campus_pwa_proposals_v1',
  POSTS: 'campus_pwa_posts_v1',
  CAMPUS_MODE: 'campus_pwa_mode_v1',
};

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  // Current logged-in .edu.tr student (starts with Ece Nur Özkan or null when logged out)
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage(STORAGE_KEYS.USER, INITIAL_STUDENTS[0])
  );
  const [students, setStudents] = useState(() =>
    loadFromStorage(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );
  const [cultureData, setCultureData] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CULTURE, INITIAL_CULTURE_PICKS)
  );
  const [libraryData, setLibraryData] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LIBRARY, INITIAL_LIBRARY_DATA)
  );
  const [proposals, setProposals] = useState(() =>
    loadFromStorage(STORAGE_KEYS.PROPOSALS, INITIAL_EVENT_PROPOSALS)
  );
  const [feedPosts, setFeedPosts] = useState(() =>
    loadFromStorage(STORAGE_KEYS.POSTS, INITIAL_FEED_POSTS)
  );
  const [campusModeId, setCampusModeId] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CAMPUS_MODE, 'open')
  );

  // Active Bottom Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Pop-up / Modals
  // Show "Ayın Kitabı & Ayın Filmi" pop-up automatically when entering Dashboard
  const [cultureModalOpen, setCultureModalOpen] = useState(true);
  const [cultureModalTab, setCultureModalTab] = useState('book');

  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [selectedNetworkStudent, setSelectedNetworkStudent] = useState(null);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaGuideModal, setShowPwaGuideModal] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Persist states
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CULTURE, JSON.stringify(cultureData));
    } catch {}
  }, [cultureData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(libraryData));
    } catch {}
  }, [libraryData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
    } catch {}
  }, [proposals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(feedPosts));
    } catch {}
  }, [feedPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CAMPUS_MODE, JSON.stringify(campusModeId));
    } catch {}
  }, [campusModeId]);

  // Handlers
  const handleLogin = (studentObj) => {
    setCurrentUser(studentObj);
    setStudents((prev) => {
      const exists = prev.some((s) => s.email === studentObj.email);
      if (exists) {
        return prev.map((s) =>
          s.email === studentObj.email ? { ...s, ...studentObj } : s
        );
      }
      return [studentObj, ...prev];
    });
    setActiveTab('dashboard');
    setCultureModalOpen(true);
  };

  const handleUpdateMyStatus = (newStatus) => {
    if (!currentUser) return;
    const updated = { ...currentUser, status: newStatus, updatedAt: 'Şimdi' };
    setCurrentUser(updated);
    setStudents((prev) =>
      prev.map((s) => (s.email === updated.email ? updated : s))
    );
    // Also update author's live status badge on their feed posts
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.authorEmail === updated.email ? { ...p, authorStatus: newStatus } : p
      )
    );
  };

  const handleAddCultureReview = (type, newReview) => {
    setCultureData((prev) => {
      const target = prev[type];
      return {
        ...prev,
        [type]: {
          ...target,
          reviews: [newReview, ...target.reviews],
        },
      };
    });
  };

  const handleToggleStudyRoom = (roomId) => {
    setLibraryData((prev) => ({
      ...prev,
      studyRooms: prev.studyRooms.map((r) => {
        if (r.id !== roomId) return r;
        const nextAvailable = !r.isAvailable;
        return {
          ...r,
          isAvailable: nextAvailable,
          currentGroup: nextAvailable
            ? null
            : `${currentUser?.name || 'Öğrenci'} Çalışma Grubu`,
          availableAt: nextAvailable ? 'Şu an müsait' : '1 saat içinde boşalacak',
        };
      }),
    }));
  };

  const handleChangeLibraryOccupancy = (newUsersCount) => {
    setLibraryData((prev) => ({
      ...prev,
      currentUsers: newUsersCount,
      lastUpdated: 'Şimdi Güncellendi',
    }));
  };

  const handleUpvoteProposal = (proposalId) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id !== proposalId) return p;
        const nextVoted = !p.votedByMe;
        return {
          ...p,
          votedByMe: nextVoted,
          votes: nextVoted ? p.votes + 1 : Math.max(0, p.votes - 1),
        };
      })
    );
  };

  const handleAddProposal = (newProp) => {
    setProposals((prev) => [newProp, ...prev]);
  };

  const handleAddPost = (newPost) => {
    setFeedPosts((prev) => [newPost, ...prev]);
  };

  const handleToggleLike = (postId) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const nextLiked = !p.likedByMe;
        return {
          ...p,
          likedByMe: nextLiked,
          likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
        };
      })
    );
  };

  const handleAddComment = (postId, commentObj) => {
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, commentObj] } : p
      )
    );
  };

  const handleResetDemoData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    setCurrentUser(INITIAL_STUDENTS[0]);
    setStudents(INITIAL_STUDENTS);
    setCultureData(INITIAL_CULTURE_PICKS);
    setLibraryData(INITIAL_LIBRARY_DATA);
    setProposals(INITIAL_EVENT_PROPOSALS);
    setFeedPosts(INITIAL_FEED_POSTS);
    setCampusModeId('open');
    setCultureModalOpen(true);
  };

  const handleInstallPwaClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowPwaGuideModal(true);
    }
  };

  // If user is logged out, show the .edu.tr Authentication Screen
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const currentStatusMeta =
    STATUS_OPTIONS.find((s) => s.id === currentUser.status) || STATUS_OPTIONS[0];

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'calendar', label: 'Takvim & Duyuru', icon: CalendarDays },
    { id: 'clubs', label: 'Topluluklar', icon: Users },
    { id: 'library_food', label: 'Kütüphane & Yemek', icon: UtensilsCrossed },
    { id: 'feed', label: 'Sosyal Akış (Blog)', icon: MessageSquareHeart },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto pb-24">
      {/* TOP STICKY APP BAR */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo + Name */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <img
              src="./campus-icon.svg"
              alt="Camp’Us Icon"
              className="w-10 h-10 rounded-2xl shadow-sm shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                  Camp<span className="text-indigo-600">’</span>
                  <span className="text-sky-600">Us</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-100">
                  .edu.tr Ağı
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-[165px] sm:max-w-xs mt-0.5">
                {currentUser.name} • {currentUser.department}
              </p>
            </div>
          </div>

          {/* Right Action Pills: Status Badge, Ayın Kitabı/Filmi, PWA Install, Account Switch */}
          <div className="flex items-center gap-1.5">
            {/* Personal Status Pill */}
            <button
              type="button"
              onClick={() => {
                setSelectedNetworkStudent(currentUser);
                setNetworkModalOpen(true);
              }}
              className={`px-2.5 py-1.5 rounded-2xl border text-[11px] font-extrabold inline-flex items-center gap-1 transition ${currentStatusMeta.badgeClass}`}
              title="Anlık kişisel durumunu değiştir veya ortak ağı gör"
            >
              <span>{currentStatusMeta.emoji}</span>
              <span className="hidden xs:inline sm:inline">
                {currentStatusMeta.label}
              </span>
            </button>

            {/* Culture Pop-up Trigger */}
            <button
              type="button"
              onClick={() => {
                setCultureModalTab('book');
                setCultureModalOpen(true);
              }}
              className="p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200/80 transition"
              title="Ayın Kitabı & Ayın Filmi Pop-up"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Add to Home Screen (PWA) Button */}
            <button
              type="button"
              onClick={handleInstallPwaClick}
              className="px-2.5 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-[11px] font-bold inline-flex items-center gap-1 transition"
              title="Ana Ekrana Ekle (PWA)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Uygulamayı Ekle</span>
            </button>

            {/* Reset Demo Data */}
            <button
              type="button"
              onClick={handleResetDemoData}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Örnek Verileri Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Switch .edu.tr Student / Logout */}
            <button
              type="button"
              onClick={() => setCurrentUser(null)}
              className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition"
              title=".edu.tr Öğrenci Hesabı Değiştir / Giriş Ekranı"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex-1 px-3.5 sm:px-4 pt-4">
        {activeTab === 'dashboard' && (
          <DashboardTab
            currentUser={currentUser}
            onUpdateMyStatus={handleUpdateMyStatus}
            campusModeId={campusModeId}
            onChangeCampusMode={setCampusModeId}
            cultureData={cultureData}
            onOpenCultureModal={(tabType) => {
              setCultureModalTab(tabType || 'book');
              setCultureModalOpen(true);
            }}
            libraryData={libraryData}
            onToggleStudyRoom={handleToggleStudyRoom}
            students={students}
            onOpenNetworkModal={(stu) => {
              setSelectedNetworkStudent(stu);
              setNetworkModalOpen(true);
            }}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'calendar' && <CalendarAnnouncementsTab />}

        {activeTab === 'clubs' && (
          <ClubsTab
            clubs={INITIAL_CLUBS}
            proposals={proposals}
            currentUser={currentUser}
            onUpvoteProposal={handleUpvoteProposal}
            onAddProposal={handleAddProposal}
          />
        )}

        {activeTab === 'library_food' && (
          <LibraryCafeteriaTab
            libraryData={libraryData}
            onToggleStudyRoom={handleToggleStudyRoom}
            onChangeLibraryOccupancy={handleChangeLibraryOccupancy}
          />
        )}

        {activeTab === 'feed' && (
          <SocialFeedTab
            posts={feedPosts}
            currentUser={currentUser}
            onAddPost={handleAddPost}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onOpenNetworkModal={(stu) => {
              setSelectedNetworkStudent(stu);
              setNetworkModalOpen(true);
            }}
          />
        )}
      </main>

      {/* BOTTOM NAVIGATION BAR (5 Tabs as Required) */}
      <nav
        aria-label="Alt Gezinme Çubuğu"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-nav pb-safe"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-5 px-1.5 py-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition ${
                  active
                    ? 'text-indigo-600 bg-indigo-50/80 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800 font-semibold'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-0.5 transition ${
                    active ? 'stroke-[2.5px] scale-105' : 'stroke-[1.9px]'
                  }`}
                />
                <span className="text-[10px] sm:text-[11px] leading-tight text-center truncate w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* AYIN KİTABI VE AYIN FİLMİ POP-UP / DETAY MODALI */}
      <CultureSpotlightModal
        isOpen={cultureModalOpen}
        onClose={() => setCultureModalOpen(false)}
        cultureData={cultureData}
        initialActiveTab={cultureModalTab}
        currentUser={currentUser}
        onAddCultureReview={handleAddCultureReview}
      />

      {/* ORTAK KAMPÜS AĞI (Takip Şartı Olmayan Öğrenci Profilleri) MODALI */}
      <CampusNetworkModal
        isOpen={networkModalOpen}
        onClose={() => {
          setNetworkModalOpen(false);
          setSelectedNetworkStudent(null);
        }}
        students={students}
        currentUser={currentUser}
        onUpdateMyStatus={handleUpdateMyStatus}
        feedPosts={feedPosts}
        initialSelectedStudent={selectedNetworkStudent}
      />

      {/* PWA ADD TO HOME SCREEN GUIDE MODAL */}
      {showPwaGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="./icon-192.png"
                  alt="Camp’Us App Icon"
                  className="w-14 h-14 rounded-2xl shadow-md"
                />
                <div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold">
                    Progressive Web App (PWA)
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                    Camp’Us Ana Ekrana Ekle
                  </h3>
                  <p className="text-xs text-slate-500">
                    Özel “Camp’Us” ikonu ile tam ekran mobil deneyim
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPwaGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Share className="w-4 h-4 text-indigo-600" />
                <span>iOS (Safari) İçin Kurulum:</span>
              </p>
              <p className="text-slate-600">
                Alt menüdeki <strong>Paylaş</strong> butonuna dokunun ve{' '}
                <strong>“Ana Ekrana Ekle” (Add to Home Screen)</strong> seçeneğini seçin.
              </p>
              <hr className="border-slate-200 my-2" />
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <PlusSquare className="w-4 h-4 text-sky-600" />
                <span>Android (Chrome) / Masaüstü İçin:</span>
              </p>
              <p className="text-slate-600">
                Tarayıcı sağ üst menüsünden (⋮) veya adres çubuğundaki{' '}
                <strong>“Uygulamayı Yükle / Ana Ekrana Ekle”</strong> butonuna dokunun.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPwaGuideModal(false)}
              className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
