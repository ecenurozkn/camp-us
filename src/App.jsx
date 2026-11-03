import React, { useState, useEffect } from 'react';
import {
  Home,
  CalendarDays,
  Users,
  UtensilsCrossed,
  MessageSquareHeart,
  ShieldAlert,
  Smartphone,
  LogOut,
  RotateCcw,
  X,
  Share,
  PlusSquare,
  Award,
  HeartPulse,
} from 'lucide-react';

import {
  STATUS_OPTIONS,
  INITIAL_STUDENTS,
  INITIAL_CULTURE_PICKS,
  INITIAL_LIBRARY_DATA,
  INITIAL_CLUBS,
  INITIAL_EVENT_PROPOSALS,
  INITIAL_FEED_POSTS,
  INITIAL_ESCALATOR_STATE,
  INITIAL_GARDEN_DEALS,
  INITIAL_SAFETY_REPORTS,
  INITIAL_ANNOUNCEMENTS,
} from './data/mockCampusData';

import AuthScreen from './components/AuthScreen';
import DashboardTab from './components/DashboardTab';
import CalendarAnnouncementsTab from './components/CalendarAnnouncementsTab';
import ClubsTab from './components/ClubsTab';
import LibraryCafeteriaTab from './components/LibraryCafeteriaTab';
import SocialFeedTab from './components/SocialFeedTab';
import SafetyReportTab from './components/SafetyReportTab';
import CampusNetworkModal from './components/CampusNetworkModal';
import CafeteriaModal from './components/CafeteriaModal';
import EmergencyInfirmaryModal from './components/EmergencyInfirmaryModal';

const STORAGE_KEYS = {
  USER: 'campus_abu_user_v3',
  STUDENTS: 'campus_abu_students_v3',
  CULTURE: 'campus_abu_culture_v3',
  LIBRARY: 'campus_abu_library_v3',
  CLUBS: 'campus_abu_clubs_v3',
  PROPOSALS: 'campus_abu_proposals_v3',
  POSTS: 'campus_abu_posts_v3',
  CAMPUS_MODE: 'campus_abu_mode_v3',
  ESCALATOR: 'campus_abu_escalator_v3',
  DEALS: 'campus_abu_deals_v3',
  SAFETY: 'campus_abu_safety_v3',
  ANNOUNCEMENTS: 'campus_abu_announcements_v3',
  LUNCH_BREAK: 'campus_abu_lunch_break_v3',
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
  const [clubs, setClubs] = useState(() =>
    loadFromStorage(STORAGE_KEYS.CLUBS, INITIAL_CLUBS)
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
  const [escalatorState, setEscalatorState] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ESCALATOR, INITIAL_ESCALATOR_STATE)
  );
  const [gardenDeals, setGardenDeals] = useState(() =>
    loadFromStorage(STORAGE_KEYS.DEALS, INITIAL_GARDEN_DEALS)
  );
  const [safetyReports, setSafetyReports] = useState(() =>
    loadFromStorage(STORAGE_KEYS.SAFETY, INITIAL_SAFETY_REPORTS)
  );
  const [announcements, setAnnouncements] = useState(() =>
    loadFromStorage(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS)
  );

  // 11.40 - 12.20 Lunch Break State (defaults to true so the Öğrenci İşleri & Ofis Saatleri lunch break badge is immediately visible, and toggleable anytime)
  const [isLunchBreakActive, setIsLunchBreakActive] = useState(() =>
    loadFromStorage(STORAGE_KEYS.LUNCH_BREAK, true)
  );

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals (Note: Cultural Book/Movie modal was removed; it is now inline on DashboardTab)
  const [infirmaryModalOpen, setInfirmaryModalOpen] = useState(false);
  const [cafeteriaModalOpen, setCafeteriaModalOpen] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const [selectedNetworkStudent, setSelectedNetworkStudent] = useState(null);

  // PWA Install Prompt
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
      localStorage.setItem(STORAGE_KEYS.CLUBS, JSON.stringify(clubs));
    } catch {}
  }, [clubs]);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ESCALATOR, JSON.stringify(escalatorState));
    } catch {}
  }, [escalatorState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(gardenDeals));
    } catch {}
  }, [gardenDeals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAFETY, JSON.stringify(safetyReports));
    } catch {}
  }, [safetyReports]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.ANNOUNCEMENTS,
        JSON.stringify(announcements)
      );
    } catch {}
  }, [announcements]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.LUNCH_BREAK,
        JSON.stringify(isLunchBreakActive)
      );
    } catch {}
  }, [isLunchBreakActive]);

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
  };

  const handleUpdateMyStatus = (newStatus) => {
    if (!currentUser) return;
    const updated = { ...currentUser, status: newStatus, updatedAt: 'Şimdi' };
    setCurrentUser(updated);
    setStudents((prev) =>
      prev.map((s) => (s.email === updated.email ? updated : s))
    );
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.authorEmail === updated.email ? { ...p, authorStatus: newStatus } : p
      )
    );
  };

  const handleUpdateMyBadges = (newBadges) => {
    if (!currentUser) return;
    const updated = { ...currentUser, titleBadges: newBadges };
    setCurrentUser(updated);
    setStudents((prev) =>
      prev.map((s) => (s.email === updated.email ? updated : s))
    );
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.authorEmail === updated.email ? { ...p, authorBadges: newBadges } : p
      )
    );
  };

  const handleToggleLunchBreakSimulation = () => {
    setIsLunchBreakActive((prev) => {
      const next = !prev;
      setCampusModeId(next ? 'lunch_break' : 'open');
      return next;
    });
  };

  const handleChangeCampusMode = (modeId) => {
    setCampusModeId(modeId);
    if (modeId === 'lunch_break') {
      setIsLunchBreakActive(true);
    } else if (modeId === 'open') {
      setIsLunchBreakActive(false);
    }
  };

  const handleUpdateEscalator = (isWorkingNow) => {
    setEscalatorState((prev) => ({
      ...prev,
      isWorking: isWorkingNow,
      lastReportedBy: currentUser?.name || 'ABÜ Öğrencisi',
      lastUpdated: 'Şimdi',
      confirmCount: prev.confirmCount + 1,
    }));
  };

  const handleAddGardenDeal = (newDeal) => {
    setGardenDeals((prev) => [newDeal, ...prev]);
  };

  const handleLikeGardenDeal = (dealId) => {
    setGardenDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, likes: d.likes + 1 } : d))
    );
  };

  const handleAddSafetyReport = (newReport) => {
    setSafetyReports((prev) => [newReport, ...prev]);
  };

  const handleConfirmSafetyReport = (reportId) => {
    setSafetyReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, confirmedCount: r.confirmedCount + 1 } : r
      )
    );
  };

  const handleResolveSafetyReport = (reportId) => {
    setSafetyReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, isResolved: !r.isResolved } : r
      )
    );
  };

  const handleAddClubEvent = (clubId, newEvent) => {
    setClubs((prev) =>
      prev.map((c) =>
        c.id === clubId ? { ...c, events: [newEvent, ...c.events] } : c
      )
    );
  };

  const handleAddAnnouncement = (newAnn) => {
    setAnnouncements((prev) => [newAnn, ...prev]);
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
            : `${currentUser?.name || 'ABÜ Öğrenci'} Çalışma Grubu`,
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
    setClubs(INITIAL_CLUBS);
    setProposals(INITIAL_EVENT_PROPOSALS);
    setFeedPosts(INITIAL_FEED_POSTS);
    setCampusModeId('open');
    setEscalatorState(INITIAL_ESCALATOR_STATE);
    setGardenDeals(INITIAL_GARDEN_DEALS);
    setSafetyReports(INITIAL_SAFETY_REPORTS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setIsLunchBreakActive(true);
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

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const currentStatusMeta =
    STATUS_OPTIONS.find((s) => s.id === currentUser.status) || STATUS_OPTIONS[0];

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Ana Sayfa', shortLabel: 'Home', icon: Home },
    { id: 'calendar', label: 'Takvim & Duyuru', shortLabel: 'Takvim', icon: CalendarDays },
    { id: 'clubs', label: 'Topluluklar', shortLabel: 'Clubs', icon: Users },
    { id: 'library_food', label: 'Kütüphane & Yemek', shortLabel: 'Yemek', icon: UtensilsCrossed },
    { id: 'feed', label: 'Sosyal Akış', shortLabel: 'Blog', icon: MessageSquareHeart },
    { id: 'safety', label: 'Bahçe Güvenlik', shortLabel: 'Safety', icon: ShieldAlert },
  ];

  const unresolvedSafetyCount = safetyReports.filter((r) => !r.isResolved).length;

  return (
    <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 lg:pb-14">
      {/* TOP GLASSMORPHIC HEADER + DESKTOP FLOATING PILL BAR */}
      <header className="sticky top-3 z-30 my-3.5 glass-card rounded-full px-4 sm:px-6 py-3 flex items-center justify-between gap-2.5">
        {/* Left: Brand Logo & ABÜ Identity */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="cursor-pointer flex items-center gap-3 shrink-0"
        >
          <img
            src="./icon-192.png"
            alt="Camp’Us ABÜ Icon"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl shadow-md border border-white/50 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-[#142E2C] leading-none">
                Camp<span className="text-[#FF8A3D]">’</span>
                <span className="text-[#3A5A58]">Us</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#142E2C] text-[#FF8A3D] text-[10px] font-black">
                ABÜ
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[11px] font-bold text-[#3A5A58] truncate max-w-[115px] sm:max-w-[200px]">
                {currentUser.name}
              </p>
              {currentUser.titleBadges?.[0] && (
                <span className="hidden md:inline-block px-2 py-0.2 rounded-full bg-[#FF8A3D] text-white text-[9px] font-black">
                  🏅 {currentUser.titleBadges[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center (Desktop lg+): FLOATING PETROL PILL BAR */}
        <nav
          aria-label="Masaüstü Gezinme Kapsülü"
          className="hidden lg:flex items-center gap-1.5 bg-[#142E2C] p-1.5 rounded-full shadow-pill border border-white/15"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={
                  active
                    ? 'bg-white text-[#142E2C] rounded-full px-4 py-2 font-black text-xs flex items-center gap-2 shadow-md transition-all'
                    : 'w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/85 flex items-center justify-center transition-all relative'
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {active && <span>{item.label}</span>}
                {!active && item.id === 'safety' && unresolvedSafetyCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A3D] absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Spacious Quick Action Pills + Prominent 🚨 Acil Revir Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 🚨 ACİL REVİR / SAĞLIK YARDIMI BUTTON */}
          <button
            type="button"
            onClick={() => setInfirmaryModalOpen(true)}
            className="px-3 sm:px-3.5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-[#FF8A3D] hover:from-rose-700 hover:to-[#E66B1F] text-white text-xs font-black inline-flex items-center gap-1.5 shadow-md transition"
            title="🚨 Acil Revir / Sağlık Yardımı Çağır"
          >
            <HeartPulse className="w-4 h-4 animate-pulse shrink-0" />
            <span className="hidden sm:inline">🚨 Acil Revir</span>
          </button>

          {/* Status & Title Badges Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedNetworkStudent(currentUser);
              setNetworkModalOpen(true);
            }}
            className={`px-3 py-2 rounded-full border text-xs font-black inline-flex items-center gap-1.5 transition ${currentStatusMeta.badgeClass}`}
            title="Durumunu & Görev Rozetlerini Yönet"
          >
            <span>{currentStatusMeta.emoji}</span>
            <span className="hidden md:inline">{currentStatusMeta.label}</span>
            <Award className="w-3.5 h-3.5 text-[#FF8A3D]" />
          </button>

          {/* PWA Install Button */}
          <button
            type="button"
            onClick={handleInstallPwaClick}
            className="w-9 h-9 sm:w-auto sm:px-3 sm:py-2 rounded-full bg-[#142E2C] hover:bg-[#1D3534] text-white text-xs font-black inline-flex items-center justify-center gap-1.5 shadow-sm transition"
            title="Ana Ekrana Ekle (PWA)"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FF8A3D]" />
            <span className="hidden xl:inline">PWA Ekle</span>
          </button>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={handleResetDemoData}
            className="hidden sm:flex w-9 h-9 rounded-full bg-white/80 hover:bg-white text-[#142E2C] items-center justify-center border border-[#142E2C]/15 transition"
            title="Verileri Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Logout / Switch Student */}
          <button
            type="button"
            onClick={() => setCurrentUser(null)}
            className="w-9 h-9 rounded-full bg-rose-500/15 hover:bg-rose-600 hover:text-white text-rose-800 flex items-center justify-center border border-rose-500/25 transition"
            title="ABÜ Öğrenci Hesabı Değiştir"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN RESPONSIVE CONTENT AREA */}
      <main className="flex-1 pt-2">
        {activeTab === 'dashboard' && (
          <DashboardTab
            currentUser={currentUser}
            onUpdateMyStatus={handleUpdateMyStatus}
            campusModeId={campusModeId}
            onChangeCampusMode={handleChangeCampusMode}
            isLunchBreakActive={isLunchBreakActive}
            onToggleLunchBreakSimulation={handleToggleLunchBreakSimulation}
            escalatorState={escalatorState}
            onUpdateEscalator={handleUpdateEscalator}
            gardenDeals={gardenDeals}
            onAddGardenDeal={handleAddGardenDeal}
            onLikeGardenDeal={handleLikeGardenDeal}
            safetyReports={safetyReports}
            cultureData={cultureData}
            onAddCultureReview={handleAddCultureReview}
            libraryData={libraryData}
            onToggleStudyRoom={handleToggleStudyRoom}
            students={students}
            onOpenNetworkModal={(stu) => {
              setSelectedNetworkStudent(stu);
              setNetworkModalOpen(true);
            }}
            onOpenCafeteriaModal={() => setCafeteriaModalOpen(true)}
            onOpenInfirmaryModal={() => setInfirmaryModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarAnnouncementsTab
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            currentUser={currentUser}
            isLunchBreakActive={isLunchBreakActive}
            onToggleLunchBreakSimulation={handleToggleLunchBreakSimulation}
          />
        )}

        {activeTab === 'clubs' && (
          <ClubsTab
            clubs={clubs}
            proposals={proposals}
            currentUser={currentUser}
            onUpvoteProposal={handleUpvoteProposal}
            onAddProposal={handleAddProposal}
            onAddClubEvent={handleAddClubEvent}
            onAddAnnouncement={handleAddAnnouncement}
            onAddGardenDeal={handleAddGardenDeal}
          />
        )}

        {activeTab === 'library_food' && (
          <LibraryCafeteriaTab
            libraryData={libraryData}
            onToggleStudyRoom={handleToggleStudyRoom}
            onChangeLibraryOccupancy={handleChangeLibraryOccupancy}
            onOpenCafeteriaModal={() => setCafeteriaModalOpen(true)}
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

        {activeTab === 'safety' && (
          <SafetyReportTab
            safetyReports={safetyReports}
            currentUser={currentUser}
            onAddSafetyReport={handleAddSafetyReport}
            onConfirmSafetyReport={handleConfirmSafetyReport}
            onResolveSafetyReport={handleResolveSafetyReport}
          />
        )}
      </main>

      {/* MOBILE FLOATING PETROL PILL BAR (Active tab = Wide White Pill, Inactive = Circular Icons) */}
      <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-3 lg:hidden pointer-events-none pb-safe">
        <nav
          aria-label="Mobil Yüzen Gezinme Kapsülü"
          className="pointer-events-auto bg-[#142E2C]/95 backdrop-blur-2xl border border-white/20 rounded-full p-2 shadow-pill flex items-center gap-1.5"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={
                  active
                    ? 'bg-white text-[#142E2C] rounded-full px-4 py-2.5 font-black text-xs flex items-center gap-2 shadow-md transition-all'
                    : 'w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white/85 flex items-center justify-center transition-all relative'
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {active && <span>{item.shortLabel}</span>}
                {!active && item.id === 'safety' && unresolvedSafetyCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A3D] absolute top-1.5 right-1.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* MODALS */}
      <EmergencyInfirmaryModal
        isOpen={infirmaryModalOpen}
        onClose={() => setInfirmaryModalOpen(false)}
        currentUser={currentUser}
      />

      <CafeteriaModal
        isOpen={cafeteriaModalOpen}
        onClose={() => setCafeteriaModalOpen(false)}
      />

      <CampusNetworkModal
        isOpen={networkModalOpen}
        onClose={() => {
          setNetworkModalOpen(false);
          setSelectedNetworkStudent(null);
        }}
        students={students}
        currentUser={currentUser}
        onUpdateMyStatus={handleUpdateMyStatus}
        onUpdateMyBadges={handleUpdateMyBadges}
        feedPosts={feedPosts}
        initialSelectedStudent={selectedNetworkStudent}
      />

      {/* PWA ADD TO HOME SCREEN MODAL */}
      {showPwaGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1C1B]/65 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-md rounded-[32px] p-6 border border-white/60 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="./icon-192.png"
                  alt="Camp’Us ABÜ App Icon"
                  className="w-16 h-16 rounded-2xl shadow-md"
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF8A3D] text-white text-[10px] font-black">
                    ABÜ Progressive Web App
                  </span>
                  <h3 className="text-base font-black text-[#142E2C] mt-1">
                    Camp’Us ABÜ Ana Ekrana Ekle
                  </h3>
                  <p className="text-xs text-[#3A5A58] font-medium">
                    Yeni “Camp’Us ABÜ” maskot ikonu ile tam ekran deneyim
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPwaGuideModal(false)}
                className="w-8 h-8 rounded-full bg-[#142E2C]/10 flex items-center justify-center text-[#142E2C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#142E2C] glass-tile p-4 rounded-2xl">
              <p className="font-black flex items-center gap-1.5">
                <Share className="w-4 h-4 text-[#FF8A3D]" />
                <span>iOS (Safari) İçin Kurulum:</span>
              </p>
              <p className="text-[#3A5A58]">
                Alt menüdeki <strong>Paylaş</strong> butonuna dokunun ve{' '}
                <strong>“Ana Ekrana Ekle” (Add to Home Screen)</strong> seçeneğini seçin.
              </p>
              <hr className="border-[#142E2C]/10 my-2" />
              <p className="font-black flex items-center gap-1.5">
                <PlusSquare className="w-4 h-4 text-[#142E2C]" />
                <span>Android (Chrome) / Bilgisayar İçin:</span>
              </p>
              <p className="text-[#3A5A58]">
                Tarayıcı sağ üst menüsünden veya adres çubuğundaki{' '}
                <strong>“Uygulamayı Yükle / Ana Ekrana Ekle”</strong> butonuna dokunun.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPwaGuideModal(false)}
              className="w-full py-2.5 rounded-full bg-[#142E2C] text-white text-xs font-black"
            >
              Anladım, Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
