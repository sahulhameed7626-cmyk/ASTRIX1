// FitSport Main Application Controller with Full Nutrition Dataset Integration
import { appState } from "./state.js";
import { FOOD_DATABASE, WORKOUT_CATEGORIES, SPORTS_DATA } from "./data.js";
import { renderBodyMap } from "./bodyMap.js";
import {
  renderProgressRing,
  renderHydrationGauge,
  renderWeeklyCaloriesChart,
  renderWeightJourneyChart
} from "./charts.js";
import { aiCoach } from "./aiCoach.js";

// Web Audio API Ringtone Synthesizer for Precision Athletic Alarms
class AlarmAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.intervalId = null;
    this.titleTimer = null;
    this.origTitle = typeof document !== "undefined" ? document.title : "FitSport Platform";

    // Unlock Web Audio Context on first user touch/click/keypress anywhere on page
    if (typeof window !== "undefined") {
      const unlockAudio = () => {
        this.init();
        window.removeEventListener("click", unlockAudio);
        window.removeEventListener("touchstart", unlockAudio);
        window.removeEventListener("keydown", unlockAudio);
      };
      window.addEventListener("click", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio, { passive: true });
    }
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  playTone(freq, type, duration, delay, gainLevel = 0.28) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime + delay;
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(gainLevel, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  startRingtone() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    // Flash document title for visual awareness even in other tabs
    let titleFlip = false;
    this.origTitle = document.title;
    this.titleTimer = setInterval(() => {
      document.title = titleFlip ? "🔔 ALARM RINGING! 🔔" : "⏰ [FITSPORT ALERT]";
      titleFlip = !titleFlip;
    }, 600);

    const playChimeSequence = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      const now = this.audioCtx.currentTime;
      // High-energy urgent digital alarm pattern: Beep-Beep (880Hz / 1046Hz) followed by melodic resolution
      this.playTone(880.00, "square", 0.18, 0.00, 0.30);
      this.playTone(880.00, "square", 0.18, 0.22, 0.30);
      this.playTone(1046.50, "sine", 0.25, 0.44, 0.34);
      this.playTone(1318.51, "sine", 0.40, 0.68, 0.36);
    };

    playChimeSequence();
    this.intervalId = setInterval(() => {
      if (this.isPlaying) playChimeSequence();
    }, 1250);
  }

  stopRingtone() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.titleTimer) {
      clearInterval(this.titleTimer);
      this.titleTimer = null;
      document.title = this.origTitle || "FitSport Platform";
    }
  }
}

class FitSportApp {
  constructor() {
    this.currentView = "dashboard";
    this.activeWorkoutTimer = null;
    this.workoutSeconds = 0;
    this.isWorkoutPaused = false;
    this.currentExerciseIndex = 0;
    this.activeWorkoutObj = null;
    this.selectedFoodCategory = "all";
    this.targetMealCategory = "breakfast";

    // Audio and Alarm Engine
    this.alarmAudio = new AlarmAudioEngine();
    this.activeRingingReminder = null;
    this.triggeredMinutes = new Set();

    this.init();
  }

  async init() {
    this.bindNavigation();
    this.bindHeaderActions();
    this.bindOnboarding();
    this.bindFoodAndMeals();
    this.bindWaterTracker();
    this.bindWorkouts();
    this.bindSports();
    this.bindBodyMap();
    this.bindHistoryFilters();
    this.bindDailySummaryAndTelegram();
    this.bindReminders();
    this.bindTelegramSchedule();
    this.bindProfileAndSettings();
    this.bindWeightControls();
    this.bindAutoResetModal();
    if (typeof aiCoach !== "undefined" && aiCoach.bindUIEvents) {
      aiCoach.bindUIEvents();
    }
    this.startAlarmClockWatcher();
    this.startAutoResetWatcher();

    // Subscribe to state updates
    appState.subscribe(() => {
      this.renderAllDynamicComponents();
    });

    // Wait for backend dataset sync then re-render
    setTimeout(() => {
      this.populateFoodSelectInModal();
      this.renderFoodDatabase();
      this.renderMealTracker();
    }, 300);

    // Initial render
    this.renderAllDynamicComponents();
    const urlParams = new URLSearchParams(window.location.search);
    const hashView = window.location.hash ? window.location.hash.replace("#", "") : "";
    const requestedView = urlParams.get("view") || hashView;

    const isAuthed = appState.isSessionLoggedIn();
    const publicScreens = ["login", "onboarding", "logout"];

    if (requestedView === "landing") {
      this.navigateTo(isAuthed ? "dashboard" : "login");
    } else if (requestedView) {
      if (publicScreens.includes(requestedView)) {
        this.navigateTo(requestedView);
      } else if (isAuthed) {
        this.navigateTo(requestedView);
      } else {
        this.showToast("Please sign in to access FitSport.");
        this.navigateTo("login");
      }
    } else if (isAuthed) {
      this.navigateTo("dashboard");
    } else {
      // Landing page removed -> Go directly to Login
      this.navigateTo("login");
    }

    window.addEventListener("hashchange", () => {
      const newHash = window.location.hash ? window.location.hash.replace("#", "") : "";
      if (newHash && newHash !== this.currentView) {
        this.navigateTo(newHash);
      }
    });
  }

  showToast(message) {
    const toast = document.getElementById("toastNotification");
    const msg = document.getElementById("toastMessage");
    if (toast && msg) {
      msg.textContent = message;
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 3200);
    }
  }

  // --------------------------------------------------------------------------
  // Navigation & View Routing
  // --------------------------------------------------------------------------
  navigateTo(viewId) {
    if (viewId === "landing") {
      viewId = appState.isSessionLoggedIn() ? "dashboard" : "login";
    }

    const publicScreens = ["login", "onboarding", "logout"];
    if (!publicScreens.includes(viewId) && !appState.isSessionLoggedIn()) {
      this.showToast("Please sign in to access FitSport.");
      viewId = "login";
    }

    if (viewId === "logout") {
      appState.setLoggedIn(false);
      this.renderLogoutScreen();
      this.showToast("Logged out successfully.");
    }

    this.currentView = viewId;

    const appLayout = document.getElementById("appLayout");
    if (viewId === "login" || viewId === "onboarding" || viewId === "logout") {
      appLayout?.classList.add("auth-mode");
    } else {
      appLayout?.classList.remove("auth-mode");
    }

    // Toggle view screens
    const allScreens = document.querySelectorAll(".view-screen");
    allScreens.forEach(el => el.classList.remove("active-screen"));

    // Auto-close mobile navigation drawer if open
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    sidebar?.classList.remove("mobile-open");
    backdrop?.classList.remove("active");
    document.body.style.overflow = "";

    const targetScreen = document.getElementById(`screen-${viewId}`);
    if (targetScreen) {
      targetScreen.classList.add("active-screen");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Update active nav links
    document.querySelectorAll(".nav-link, .bottom-nav-item").forEach(link => {
      const target = link.getAttribute("data-view");
      if (target === viewId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // View-specific initialization triggers
    if (viewId === "dashboard" || viewId === "fitness") {
      this.renderWeightComponents();
      this.renderAllDynamicComponents();
    }
    if (viewId === "sports") {
      this.renderSportsDashboard();
      this.renderSportsBenefitsMatrix();
    }
    if (viewId === "sport-details") {
      const sportId = appState.state.selectedSportId || "cycling";
      const detailMapContainer = document.getElementById("sDetailBodyMapContainer");
      if (detailMapContainer) {
        renderBodyMap(detailMapContainer, sportId, "both");
      }
    }
    if (viewId === "profile") {
      this.renderProfileScreen();
    }
    if (viewId === "onboarding") {
      this.currentOnboardingStep = 1;
      if (typeof this.updateOnboardingStepUI === "function") {
        this.updateOnboardingStepUI();
      }
      this.populateOnboardingForm();
    }
    if (viewId === "login") {
      const user = appState.state.user || {};
      const loginExistingName = document.getElementById("loginExistingName");
      if (loginExistingName) loginExistingName.value = user.name || "";
      const loginExistingPhone = document.getElementById("loginExistingPhone");
      if (loginExistingPhone) {
        const cleanPhone = (user.phone || "").replace(/^\+91\s*/, "");
        loginExistingPhone.value = cleanPhone;
      }
      const loginGender = document.getElementById("loginGender");
      if (loginGender) loginGender.value = user.gender || "Male";
      const loginAge = document.getElementById("loginAge");
      if (loginAge) loginAge.value = user.age || 24;

      const regName = document.getElementById("regName");
      if (regName) regName.value = "";
      const regPhone = document.getElementById("regPhone");
      if (regPhone) regPhone.value = "";
      const regGender = document.getElementById("regGender");
      if (regGender) regGender.value = user.gender || "Male";
      const regAge = document.getElementById("regAge");
      if (regAge) regAge.value = user.age || 24;
    }
    if (viewId === "analytics") {
      this.renderAnalyticsCharts();
    }
    if (viewId === "body-analysis") {
      this.renderBodyAnalysisView();
    }
    if (viewId === "water") {
      this.renderWaterScreen();
    }
    if (viewId === "daily-summary") {
      this.updateDailySummaryCard();
    }
    if (viewId === "settings" || viewId === "history") {
      if (typeof this.updateTelegramScheduleUI === "function") {
        this.updateTelegramScheduleUI();
      }
    }
    if (viewId === "logout") {
      this.renderLogoutScreen();
    }
  }

  renderLogoutScreen() {
    const user = appState.state.user || {};
    const avatarEl = document.getElementById("logoutAvatar");
    if (avatarEl) {
      avatarEl.textContent = user.avatar || "SH";
    }
    const nameEl = document.getElementById("logoutUserName");
    if (nameEl) {
      nameEl.textContent = user.name || "Sahul Hameed";
    }
    const phoneEl = document.getElementById("logoutUserPhone");
    if (phoneEl) {
      phoneEl.textContent = user.phone || "+91 98765 43210";
    }
  }

  bindNavigation() {
    const sidebar = document.getElementById("appSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const mobileMenuBtn = document.getElementById("mobileMenuToggle");
    const mobileCloseBtn = document.getElementById("mobileSidebarCloseBtn");
    const mobileBottomMoreBtn = document.getElementById("mobileBottomMenuToggle");

    const openMobileMenu = () => {
      sidebar?.classList.add("mobile-open");
      backdrop?.classList.add("active");
      document.body.style.overflow = "hidden";
    };

    const closeMobileMenu = () => {
      sidebar?.classList.remove("mobile-open");
      backdrop?.classList.remove("active");
      document.body.style.overflow = "";
    };

    // Toggle drawer on top 3-line hamburger menu button click
    mobileMenuBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar?.classList.contains("mobile-open")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Toggle drawer on bottom "All Pages" 3-line button click
    mobileBottomMoreBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      openMobileMenu();
    });

    // Close button inside mobile drawer
    mobileCloseBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });

    // Clicking backdrop closes drawer
    backdrop?.addEventListener("click", () => {
      closeMobileMenu();
    });

    document.getElementById("sidebarBrandClick")?.addEventListener("click", () => {
      closeMobileMenu();
      this.navigateTo(appState.isSessionLoggedIn() ? "dashboard" : "login");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", (e) => {
        const view = link.getAttribute("data-view");
        if (view) {
          closeMobileMenu();
          this.navigateTo(view);
        }
      });
    });

    document.querySelectorAll(".bottom-nav-item").forEach(link => {
      link.addEventListener("click", () => {
        const view = link.getAttribute("data-view");
        if (view) {
          closeMobileMenu();
          this.navigateTo(view);
        }
      });
    });

    document.getElementById("sidebarUserCard")?.addEventListener("click", () => {
      closeMobileMenu();
      this.navigateTo("profile");
    });

    // Dashboard Hero Cards and Buttons Navigation
    document.getElementById("dashFitnessCard")?.addEventListener("click", () => {
      this.navigateTo("fitness");
    });
    document.getElementById("dashOpenFitnessBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigateTo("fitness");
    });

    document.getElementById("dashSportsCard")?.addEventListener("click", () => {
      this.navigateTo("sports");
    });
    document.getElementById("dashOpenSportsBtn")?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigateTo("sports");
    });

    // Global delegated navigation for any [data-view] buttons
    document.addEventListener("click", (e) => {
      const target = e.target.closest("[data-view]");
      if (target && !target.classList.contains("nav-link") && !target.classList.contains("bottom-nav-item") && !target.classList.contains("btn-toggle")) {
        const view = target.getAttribute("data-view");
        if (view && view !== "front" && view !== "back") {
          e.preventDefault();
          this.navigateTo(view);
        }
      }
    });
  }

  bindHeaderActions() {
    document.getElementById("headerDailySummaryBtn")?.addEventListener("click", () => {
      this.navigateTo("daily-summary");
    });

    document.getElementById("headerQuickLogBtn")?.addEventListener("click", () => {
      this.openAddFoodModal("lunch");
    });

    document.getElementById("headerLogoutBtn")?.addEventListener("click", () => {
      this.navigateTo("logout");
    });

    // Auth Mode Toggles (Sign In vs Create Account)
    const switchAuthMode = (mode) => {
      const tabSignIn = document.getElementById("authTabSignIn");
      const tabRegister = document.getElementById("authTabRegister");
      const containerSignIn = document.getElementById("authSignInContainer");
      const containerRegister = document.getElementById("authCreateAccountContainer");

      if (mode === "register") {
        tabRegister?.classList.add("active");
        tabSignIn?.classList.remove("active");
        if (containerRegister) containerRegister.style.display = "block";
        if (containerSignIn) containerSignIn.style.display = "none";
      } else {
        tabSignIn?.classList.add("active");
        tabRegister?.classList.remove("active");
        if (containerSignIn) containerSignIn.style.display = "block";
        if (containerRegister) containerRegister.style.display = "none";
      }
    };

    document.getElementById("authTabSignIn")?.addEventListener("click", () => switchAuthMode("signin"));
    document.getElementById("authTabRegister")?.addEventListener("click", () => switchAuthMode("register"));
    document.getElementById("linkSwitchToRegister")?.addEventListener("click", (e) => {
      e.preventDefault();
      switchAuthMode("register");
    });
    document.getElementById("linkSwitchToSignIn")?.addEventListener("click", (e) => {
      e.preventDefault();
      switchAuthMode("signin");
    });

    document.getElementById("regToGuidedOnboardingBtn")?.addEventListener("click", () => {
      this.navigateTo("onboarding");
    });

    // 1. SIGN IN SUBMIT (If we have an account)
    document.getElementById("loginSignInSubmitBtn")?.addEventListener("click", async () => {
      const name = (document.getElementById("loginExistingName")?.value || "").trim();
      const rawPhone = (document.getElementById("loginExistingPhone")?.value || "").trim();

      if (!name && !rawPhone) {
        this.showToast("Please enter your Athlete Name or Phone Number to sign in.");
        document.getElementById("loginExistingName")?.focus();
        return;
      }

      const phone = rawPhone ? (rawPhone.startsWith("+") ? rawPhone : `+91 ${rawPhone}`) : "";
      const currentUser = appState.state.user || {};
      const finalName = name || currentUser.name || "Athlete";
      const finalPhone = phone || currentUser.phone || "+91 99999 88888";
      const gender = document.getElementById("loginGender")?.value || currentUser.gender || "Male";
      const age = parseInt(document.getElementById("loginAge")?.value, 10) || currentUser.age || 24;

      await appState.updateUserProfile({
        name: finalName,
        phone: finalPhone,
        gender,
        age
      });

      appState.setLoggedIn(true);
      this.renderAllDynamicComponents();
      this.showToast(`Welcome back, ${finalName}! Signed in successfully.`);
      this.navigateTo("dashboard");
    });

    // 2. CREATE ACCOUNT SUBMIT (If we do not have an account)
    document.getElementById("loginRegisterSubmitBtn")?.addEventListener("click", async () => {
      const name = (document.getElementById("regName")?.value || "").trim();
      const rawPhone = (document.getElementById("regPhone")?.value || "").trim();

      if (!name) {
        this.showToast("Please enter your Full Name to create your account.");
        document.getElementById("regName")?.focus();
        return;
      }
      if (!rawPhone) {
        this.showToast("Please enter your Phone Number to create your account.");
        document.getElementById("regPhone")?.focus();
        return;
      }

      const phone = rawPhone.startsWith("+") ? rawPhone : `+91 ${rawPhone}`;
      const gender = document.getElementById("regGender")?.value || "Male";
      const age = parseInt(document.getElementById("regAge")?.value, 10) || 24;
      const height = parseFloat(document.getElementById("regHeight")?.value) || 178;
      const currentWeight = parseFloat(document.getElementById("regCurrentWeight")?.value) || 69.5;
      const targetWeight = parseFloat(document.getElementById("regTargetWeight")?.value) || 65.0;
      const targetDurationMonths = parseInt(document.getElementById("regDuration")?.value, 10) || 3;
      const fitnessGoal = document.getElementById("regGoal")?.value || "Improve Sports Performance";

      await appState.updateUserProfile({
        name,
        phone,
        gender,
        age,
        height,
        currentWeight,
        startingWeight: currentWeight,
        targetWeight,
        targetDurationMonths,
        fitnessGoal
      });

      appState.setLoggedIn(true);
      this.renderAllDynamicComponents();
      this.showToast(`Account created! Welcome to FitSport, ${name}!`);
      this.navigateTo("dashboard");
    });

    // Backward compatibility alias
    document.getElementById("loginSubmitBtn")?.addEventListener("click", () => {
      document.getElementById("loginSignInSubmitBtn")?.click();
    });

    document.getElementById("loginToOnboardingBtn")?.addEventListener("click", () => {
      this.navigateTo("onboarding");
    });
    document.getElementById("logoutToLoginBtn")?.addEventListener("click", () => {
      this.navigateTo("login");
    });
  }

  // --------------------------------------------------------------------------
  // 3. 5-Step Profile Setup Onboarding
  // --------------------------------------------------------------------------
  bindOnboarding() {
    this.currentOnboardingStep = 1;
    const totalSteps = 5;

    // "Choose Everything" button in Step 5
    document.getElementById("obSelectAllGoalsBtn")?.addEventListener("click", () => {
      const checkboxes = document.querySelectorAll("#obGoalOptions input[type='checkbox']");
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      
      checkboxes.forEach(cb => {
        cb.checked = !allChecked;
      });

      const btn = document.getElementById("obSelectAllGoalsBtn");
      if (btn) {
        btn.textContent = !allChecked ? "✓ All Selected" : "✓ Choose Everything";
      }
      this.showToast(!allChecked ? "Selected all fitness objectives" : "Cleared selection");
    });

    this.updateOnboardingStepUI = () => {
      const stepBadge = document.getElementById("onboardingStepBadge");
      if (stepBadge) stepBadge.textContent = `Step ${this.currentOnboardingStep} of ${totalSteps}`;
      const progBar = document.getElementById("onboardingProgressBar");
      if (progBar) progBar.style.width = `${(this.currentOnboardingStep / totalSteps) * 100}%`;

      for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.getElementById(`onboardingStep${i}`);
        if (stepEl) stepEl.style.display = i === this.currentOnboardingStep ? "block" : "none";
      }

      const prevBtn = document.getElementById("onboardingPrevBtn");
      const nextBtn = document.getElementById("onboardingNextBtn");

      if (prevBtn) prevBtn.disabled = this.currentOnboardingStep === 1;
      if (nextBtn) {
        nextBtn.textContent = this.currentOnboardingStep === totalSteps ? "Complete Setup" : "Next Step";
      }
    };

    document.getElementById("onboardingNextBtn")?.addEventListener("click", async () => {
      if (this.currentOnboardingStep === 1) {
        const nameVal = (document.getElementById("obName")?.value || "").trim();
        const phoneVal = (document.getElementById("obPhone")?.value || "").trim();
        if (!nameVal) {
          this.showToast("Please enter your Athlete Name to continue.");
          document.getElementById("obName")?.focus();
          return;
        }
        if (!phoneVal) {
          this.showToast("Please enter your Phone Number to continue.");
          document.getElementById("obPhone")?.focus();
          return;
        }
      }

      if (this.currentOnboardingStep < totalSteps) {
        this.currentOnboardingStep++;
        this.updateOnboardingStepUI();
      } else {
        const name = (document.getElementById("obName")?.value || "").trim() || appState.state.user.name || "Sahul Hameed";
        const phone = (document.getElementById("obPhone")?.value || "").trim() || appState.state.user.phone || "+91 99999 88888";
        const height = parseFloat(document.getElementById("obHeight")?.value) || 178;
        const currentW = parseFloat(document.getElementById("obCurrentWeight")?.value) || 69.5;
        const targetW = parseFloat(document.getElementById("obTargetWeight")?.value) || 65.0;
        const duration = parseInt(document.getElementById("obTargetDuration")?.value) || 3;

        const sportsChecked = [];
        document.querySelectorAll("#obSportsList input[type='checkbox']:checked").forEach(cb => {
          sportsChecked.push(cb.value);
        });

        // Collect all checked goals in Step 5 (supports choosing everything)
        const goalsChecked = [];
        document.querySelectorAll("#obGoalOptions input[type='checkbox']:checked").forEach(cb => {
          goalsChecked.push(cb.value);
        });

        const selectedGoal = goalsChecked.length > 0 ? goalsChecked.join(", ") : "Improve Sports Performance";

        await appState.updateUserProfile({
          name,
          phone,
          height,
          currentWeight: currentW,
          targetWeight: targetW,
          targetDurationMonths: duration,
          interestedSports: sportsChecked.length ? sportsChecked : ["Cycling", "Running"],
          fitnessGoal: selectedGoal
        });

        this.renderAllDynamicComponents();
        appState.setLoggedIn(true);
        this.showToast(`Profile Setup Completed for ${name}!`);
        this.navigateTo("dashboard");
      }
    });

    document.getElementById("onboardingPrevBtn")?.addEventListener("click", () => {
      if (this.currentOnboardingStep > 1) {
        this.currentOnboardingStep--;
        this.updateOnboardingStepUI();
      }
    });

    document.getElementById("onboardingToLoginBtn")?.addEventListener("click", () => {
      this.navigateTo("login");
    });
  }

  populateOnboardingForm() {
    const user = appState.state.user;
    if (!user) return;

    const obName = document.getElementById("obName");
    if (obName) obName.value = "";

    const obPhone = document.getElementById("obPhone");
    if (obPhone) obPhone.value = "";

    const obHeight = document.getElementById("obHeight");
    if (obHeight) obHeight.value = user.height || 178;

    const obCurW = document.getElementById("obCurrentWeight");
    if (obCurW) obCurW.value = user.currentWeight || 69.5;

    const obTgtW = document.getElementById("obTargetWeight");
    if (obTgtW) obTgtW.value = user.targetWeight || 65.0;

    const obDur = document.getElementById("obTargetDuration");
    if (obDur) obDur.value = user.targetDurationMonths || 3;

    if (Array.isArray(user.interestedSports)) {
      document.querySelectorAll("#obSportsList input[type='checkbox']").forEach(cb => {
        cb.checked = user.interestedSports.includes(cb.value);
      });
    }

    if (user.fitnessGoal) {
      document.querySelectorAll("#obGoalOptions input[type='checkbox']").forEach(cb => {
        cb.checked = user.fitnessGoal.includes(cb.value);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Dynamic Dashboard & Weight Components
  // --------------------------------------------------------------------------
  renderWeightComponents() {
    const pct = appState.getWeightProgressPercent();
    const user = appState.state.user;

    const dashRingMount = document.getElementById("dashWeightRingContainer");
    if (dashRingMount) {
      renderProgressRing(dashRingMount, pct, 130, 10, "Target Goal");
    }

    const fitnessRingMount = document.getElementById("fitnessProgressRingMount");
    if (fitnessRingMount) {
      renderProgressRing(fitnessRingMount, pct, 160, 12, "Goal Progress");
    }

    const fitnessPctText = document.getElementById("fitnessGoalPctText");
    if (fitnessPctText) fitnessPctText.textContent = `${pct}%`;

    const fitnessCurrentWeight = document.getElementById("fitnessCurrentWeightDisplay");
    if (fitnessCurrentWeight) fitnessCurrentWeight.textContent = `${user.currentWeight} kg`;

    const fitnessTargetWeight = document.getElementById("fitnessTargetWeightDisplay");
    if (fitnessTargetWeight) fitnessTargetWeight.textContent = `${user.targetWeight} kg`;

    const fitnessDuration = document.getElementById("fitnessDurationDisplay");
    if (fitnessDuration) fitnessDuration.textContent = `${user.targetDurationMonths || 3} Months`;

    const quickDurationSelect = document.getElementById("quickDurationSelect");
    if (quickDurationSelect) quickDurationSelect.value = user.targetDurationMonths || 3;

    const dashCurrentWeight = document.getElementById("dashCurrentWeightDisplay");
    if (dashCurrentWeight) dashCurrentWeight.textContent = `${user.currentWeight} kg`;

    const dashTargetWeight = document.getElementById("dashTargetWeightDisplay");
    if (dashTargetWeight) dashTargetWeight.textContent = `${user.targetWeight} kg`;

    const dashDuration = document.getElementById("dashDurationDisplay");
    if (dashDuration) dashDuration.textContent = `${user.targetDurationMonths || 3} Months`;

    const fitnessWeightChartMount = document.getElementById("fitnessWeightChartMount");
    if (fitnessWeightChartMount) {
      renderWeightJourneyChart(fitnessWeightChartMount, appState.state.weightHistory, user.currentWeight, user.targetWeight, user.targetDurationMonths || 3);
    }

    const quickInput = document.getElementById("quickWeightInput");
    if (quickInput && document.activeElement !== quickInput) {
      quickInput.value = user.currentWeight;
    }

    const quickTargetInput = document.getElementById("quickTargetWeightInput");
    if (quickTargetInput && document.activeElement !== quickTargetInput) {
      quickTargetInput.value = user.targetWeight;
    }

    // ------------------------------------------------------------------------
    // Calorie Maintenance Engine (1 kg = 7,700 kcal Rule)
    // ------------------------------------------------------------------------
    const metrics = appState.calculateEnergyMetrics();
    const weightDelta = metrics.weightDiff;
    const deltaSign = weightDelta > 0 ? `+${weightDelta}` : `${weightDelta}`;
    const months = user.targetDurationMonths || 3;
    const days = metrics.totalDays;

    const elWeightDelta = document.getElementById("engineWeightDelta");
    if (elWeightDelta) elWeightDelta.textContent = `${deltaSign} kg`;

    const elDeltaSub = document.getElementById("engineDeltaSubtext");
    if (elDeltaSub) elDeltaSub.textContent = `Target: ${user.targetWeight} kg vs Entered: ${user.currentWeight} kg`;

    const elTotalCals = document.getElementById("engineTotalCaloriesNeeded");
    if (elTotalCals) elTotalCals.textContent = `${metrics.totalCalorieAdjustment.toLocaleString()} kcal`;

    const elTotalFormula = document.getElementById("engineTotalFormula");
    if (elTotalFormula) elTotalFormula.textContent = `${Math.abs(weightDelta)} kg × 7,700 kcal/kg`;

    const elDailyGoal = document.getElementById("engineDailyCalorieTarget");
    if (elDailyGoal) elDailyGoal.textContent = `${metrics.dailyCalorieGoal.toLocaleString()} kcal/day`;

    const elMaint = document.getElementById("engineMaintenanceCals");
    if (elMaint) {
      if (weightDelta < 0) {
        elMaint.textContent = `TDEE: ${metrics.maintenanceCalories.toLocaleString()} - ${metrics.dailyAdjustment} kcal/day`;
      } else if (weightDelta > 0) {
        elMaint.textContent = `TDEE: ${metrics.maintenanceCalories.toLocaleString()} + ${metrics.dailyAdjustment} kcal/day`;
      } else {
        elMaint.textContent = `TDEE Maintenance: ${metrics.maintenanceCalories.toLocaleString()} kcal/day`;
      }
    }

    // ------------------------------------------------------------------------
    // Live Dynamic Caloric Balance Tracker (Nutrition In [+] vs Workout Burned [-])
    // ------------------------------------------------------------------------
    const nut = appState.getNutritionTotals();
    const burned = appState.getCaloriesBurnedToday();
    const foodCalories = nut.calories || 0;
    const burnedCalories = burned || 0;
    const netCalories = Math.max(0, foodCalories - burnedCalories);
    const targetGoal = metrics.dailyCalorieGoal;
    const remainingBudget = targetGoal - netCalories;
    const usedPct = targetGoal > 0 ? Math.min(150, Math.round((netCalories / targetGoal) * 100)) : 0;

    // 4th KPI Pillar: Live Net Calories Today
    const elNetCalories = document.getElementById("engineNetCalories");
    if (elNetCalories) elNetCalories.textContent = `${netCalories.toLocaleString()} kcal`;

    const elNetSub = document.getElementById("engineNetSubtext");
    if (elNetSub) {
      elNetSub.textContent = `+${foodCalories.toLocaleString()} in − ${burnedCalories.toLocaleString()} burn`;
    }

    // Live Balance Tracker Components in the same place
    const elLiveNutritionIn = document.getElementById("engineLiveNutritionIn");
    if (elLiveNutritionIn) elLiveNutritionIn.textContent = `+${foodCalories.toLocaleString()} kcal`;

    const elLiveMealsCount = document.getElementById("engineLiveMealsCount");
    if (elLiveMealsCount) {
      const mealKeys = Object.keys(appState.state.meals || {});
      const totalItems = mealKeys.reduce((acc, key) => acc + (appState.state.meals[key]?.length || 0), 0);
      elLiveMealsCount.textContent = `${totalItems} food items logged`;
    }

    const fNet = document.getElementById("fitnessNetCaloriesDisplay");
    if (fNet) fNet.textContent = `${netCalories.toLocaleString()} kcal`;

    const elLiveWorkoutMinus = document.getElementById("engineLiveWorkoutMinus");
    if (elLiveWorkoutMinus) {
      elLiveWorkoutMinus.textContent = burnedCalories > 0 ? `-${burnedCalories.toLocaleString()} kcal` : `0 kcal`;
    }

    const elLiveBurnDetail = document.getElementById("engineLiveBurnDetail");
    if (elLiveBurnDetail) {
      elLiveBurnDetail.textContent = burnedCalories > 0 ? `Workouts + Sports burned` : `0 kcal (Adds after workout)`;
    }

    const elLiveNetTotal = document.getElementById("engineLiveNetTotal");
    if (elLiveNetTotal) elLiveNetTotal.textContent = `${netCalories.toLocaleString()} kcal`;

    const elLiveRemaining = document.getElementById("engineLiveRemaining");
    if (elLiveRemaining) {
      if (remainingBudget >= 0) {
        elLiveRemaining.textContent = `${remainingBudget.toLocaleString()} kcal`;
        elLiveRemaining.style.color = "#fbbf24";
      } else {
        elLiveRemaining.textContent = `+${Math.abs(remainingBudget).toLocaleString()} kcal`;
        elLiveRemaining.style.color = "#f87171";
      }
    }

    const elLiveGoalRef = document.getElementById("engineLiveGoalRef");
    if (elLiveGoalRef) {
      elLiveGoalRef.textContent = remainingBudget >= 0
        ? `Budget remaining of ${targetGoal.toLocaleString()} kcal`
        : `Exceeded target by ${Math.abs(remainingBudget).toLocaleString()} kcal`;
    }

    const elLiveProgressPct = document.getElementById("engineLiveProgressPct");
    if (elLiveProgressPct) elLiveProgressPct.textContent = `${usedPct}% of goal used`;

    const elLiveProgressBar = document.getElementById("engineLiveProgressBar");
    if (elLiveProgressBar) {
      elLiveProgressBar.style.width = `${Math.min(100, usedPct)}%`;
      if (usedPct > 100) {
        elLiveProgressBar.style.background = "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)";
      } else {
        elLiveProgressBar.style.background = "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)";
      }
    }

    const elLiveTrackMid = document.getElementById("engineLiveTrackMid");
    if (elLiveTrackMid) elLiveTrackMid.textContent = `Halfway (${Math.round(targetGoal / 2).toLocaleString()} kcal)`;

    const elLiveTrackMax = document.getElementById("engineLiveTrackMax");
    if (elLiveTrackMax) elLiveTrackMax.textContent = `${targetGoal.toLocaleString()} kcal Goal`;

    const elLiveStatusBadge = document.getElementById("engineLiveStatusBadge");
    if (elLiveStatusBadge) {
      if (remainingBudget >= 0) {
        elLiveStatusBadge.textContent = "ON TARGET";
        elLiveStatusBadge.style.color = "var(--green-primary)";
        elLiveStatusBadge.style.background = "rgba(34,197,94,0.15)";
        elLiveStatusBadge.style.borderColor = "rgba(34,197,94,0.3)";
      } else {
        elLiveStatusBadge.textContent = "OVER TARGET";
        elLiveStatusBadge.style.color = "#f87171";
        elLiveStatusBadge.style.background = "rgba(239,68,68,0.15)";
        elLiveStatusBadge.style.borderColor = "rgba(239,68,68,0.3)";
      }
    }

    const spanWeight = document.getElementById("calcWeightSpan");
    if (spanWeight) spanWeight.textContent = `${Math.abs(weightDelta)} kg`;

    const spanTotalKcal = document.getElementById("calcTotalKcalSpan");
    if (spanTotalKcal) spanTotalKcal.textContent = `${metrics.totalCalorieAdjustment.toLocaleString()} kcal`;

    const spanDays = document.getElementById("calcDaysSpan");
    if (spanDays) spanDays.textContent = `${days} days (${months} Months)`;

    const spanDailyDef = document.getElementById("calcDailyDeficitSpan");
    if (spanDailyDef) {
      spanDailyDef.textContent = weightDelta < 0
        ? `-${metrics.dailyAdjustment} kcal/day deficit`
        : weightDelta > 0
          ? `+${metrics.dailyAdjustment} kcal/day surplus`
          : `0 kcal/day adjustment`;
    }

    const spanTdee = document.getElementById("calcTdeeSpan");
    if (spanTdee) spanTdee.textContent = `${metrics.maintenanceCalories.toLocaleString()} kcal`;

    const spanGoal = document.getElementById("calcGoalSpan");
    if (spanGoal) spanGoal.textContent = `${metrics.dailyCalorieGoal.toLocaleString()} kcal/day`;
  }

  bindWeightControls() {
    // Quick target weight input listener (auto-save on change)
    document.getElementById("quickTargetWeightInput")?.addEventListener("change", (e) => {
      const targetVal = parseFloat(e.target.value);
      if (!targetVal || isNaN(targetVal) || targetVal <= 0) {
        this.showToast("Please enter a valid target weight in kg.");
        return;
      }
      appState.updateUserProfile({ targetWeight: targetVal });
      this.showToast(`🎯 Targeted weight updated to ${targetVal} kg`);
      this.renderWeightComponents();
    });

    document.getElementById("quickWeightSubmitBtn")?.addEventListener("click", () => {
      const input = document.getElementById("quickWeightInput");
      const targetInput = document.getElementById("quickTargetWeightInput");
      const durationSelect = document.getElementById("quickDurationSelect");

      const val = parseFloat(input?.value);
      const targetVal = parseFloat(targetInput?.value);
      const months = parseInt(durationSelect?.value) || 3;

      if (!val || isNaN(val) || val <= 0) {
        this.showToast("Please enter a valid entered weight in kg.");
        return;
      }

      const updates = { targetDurationMonths: months };
      if (targetVal && !isNaN(targetVal) && targetVal > 0) {
        updates.targetWeight = targetVal;
      }

      appState.logWeightCheckIn(val);
      appState.updateUserProfile(updates);
      this.showToast(`Goal Process updated: Entered ${val} kg → Target ${updates.targetWeight || appState.state.user.targetWeight} kg (${months}M)`);
      this.renderWeightComponents();
    });

    document.getElementById("quickDurationSelect")?.addEventListener("change", (e) => {
      const months = parseInt(e.target.value) || 3;
      appState.updateUserProfile({ targetDurationMonths: months });
      this.showToast(`Estimated timeline set to ${months} Months`);
      this.renderWeightComponents();
    });

    // Click on target weight stat boxes or Profile Update Goal to focus input
    const focusTargetWeightInput = () => {
      this.navigateTo("fitness");
      setTimeout(() => {
        const input = document.getElementById("quickTargetWeightInput");
        if (input) {
          input.scrollIntoView({ behavior: "smooth", block: "center" });
          input.focus();
          input.select();
        }
      }, 150);
    };
    document.getElementById("fitnessTargetWeightBox")?.addEventListener("click", focusTargetWeightInput);
    document.getElementById("dashTargetWeightBox")?.addEventListener("click", focusTargetWeightInput);
    document.getElementById("profileUpdateGoalBtn")?.addEventListener("click", focusTargetWeightInput);

    const handleResetWeight = () => {
      appState.resetWeightHistory();
      this.showToast("Weight trajectory reset to baseline.");
      this.renderWeightComponents();
    };

    document.getElementById("resetWeightHistoryBtn")?.addEventListener("click", handleResetWeight);
    document.getElementById("resetWeightSettingsBtn")?.addEventListener("click", handleResetWeight);
  }

  // --------------------------------------------------------------------------
  // Nutrition & Meals & Comprehensive Food Database (200+ USDA Items)
  // --------------------------------------------------------------------------
  bindFoodAndMeals() {
    this.populateFoodSelectInModal();

    // Portion button presets (50g, 100g, 150g)
    document.querySelectorAll(".portion-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const grams = btn.getAttribute("data-grams");
        document.getElementById("modalCustomGramsInput").value = grams;
        document.querySelectorAll(".portion-btn").forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
        });
        btn.classList.remove("btn-secondary");
        btn.classList.add("btn-primary");
      });
    });

    // Confirm Add Food from modal
    document.getElementById("modalConfirmAddFoodBtn")?.addEventListener("click", () => {
      const mealCat = document.getElementById("modalMealCategorySelect").value;
      const foodId = document.getElementById("modalFoodItemSelect").value;
      const grams = parseFloat(document.getElementById("modalCustomGramsInput").value) || 50;

      const dataset = appState.nutritionDataset.length > 0 ? appState.nutritionDataset : FOOD_DATABASE;
      const foodItem = dataset.find(f => f.id === foodId);
      if (foodItem) {
        appState.addFoodToMeal(mealCat, foodItem, grams);
        this.closeAddFoodModal();
        this.showToast(`Added ${foodItem.name} (${grams}g) to ${mealCat}`);
      }
    });

    document.getElementById("closeAddFoodModalBtn")?.addEventListener("click", () => {
      this.closeAddFoodModal();
    });

    document.getElementById("openAddFoodModalBtn")?.addEventListener("click", () => {
      this.openAddFoodModal("breakfast");
    });

    document.getElementById("tabFoodDatabaseBtn")?.addEventListener("click", () => {
      document.getElementById("foodDatabaseSection")?.scrollIntoView({ behavior: "smooth" });
    });

    const handleResetMeals = () => {
      appState.resetMeals();
      this.showToast("Today's meals reset to 0.");
      this.renderMealTracker();
      this.renderAllDynamicComponents();
    };
    document.getElementById("resetMealsBtn")?.addEventListener("click", handleResetMeals);
    document.getElementById("resetMealsSettingsBtn")?.addEventListener("click", handleResetMeals);

    // Search input
    document.getElementById("foodSearchInput")?.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      this.renderFoodDatabase(query);
    });

    // Category Filter Pills (All, Fruit, Vegetable, Nut, Seed, Dairy)
    document.querySelectorAll("#foodCategoryFilterTabs .tab-pill")?.forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll("#foodCategoryFilterTabs .tab-pill").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.selectedFoodCategory = tab.getAttribute("data-category");
        const query = document.getElementById("foodSearchInput")?.value.toLowerCase().trim() || "";
        this.renderFoodDatabase(query);
      });
    });

    // Target Meal Selector Tabs (Breakfast, Lunch, Dinner, Snacks)
    document.querySelectorAll("#quickAddMealTabs .tab-pill")?.forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll("#quickAddMealTabs .tab-pill").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.targetMealCategory = tab.getAttribute("data-target-meal") || "breakfast";

        // Update all food card meal selects
        document.querySelectorAll(".food-meal-select").forEach(sel => {
          sel.value = this.targetMealCategory;
        });

        const title = this.targetMealCategory.charAt(0).toUpperCase() + this.targetMealCategory.slice(1);
        this.showToast(`Target meal set to: ${title}`);
      });
    });
  }

  populateFoodSelectInModal() {
    const modalFoodSelect = document.getElementById("modalFoodItemSelect");
    if (!modalFoodSelect) return;

    const dataset = appState.nutritionDataset.length > 0 ? appState.nutritionDataset : FOOD_DATABASE;
    
    // Group by category
    const categories = {};
    dataset.forEach(item => {
      const cat = item.category || "General";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    });

    let html = '';
    Object.keys(categories).sort().forEach(cat => {
      html += `<optgroup label="─── ${cat.toUpperCase()} (${categories[cat].length}) ───">`;
      categories[cat].forEach(f => {
        html += `<option value="${f.id}">${f.name} — ${f.calories} kcal (50g) | P:${f.protein}g C:${f.carbs}g F:${f.fat}g ${f.keyVitamin ? '• ' + f.keyVitamin : ''}</option>`;
      });
      html += `</optgroup>`;
    });

    modalFoodSelect.innerHTML = html;
  }

  openAddFoodModal(defaultCategory = "breakfast") {
    const modal = document.getElementById("addFoodModal");
    const categorySelect = document.getElementById("modalMealCategorySelect");
    if (categorySelect) categorySelect.value = defaultCategory;
    if (modal) modal.classList.add("open");
  }

  closeAddFoodModal() {
    const modal = document.getElementById("addFoodModal");
    if (modal) modal.classList.remove("open");
  }

  renderFoodDatabase(query = "") {
    const container = document.getElementById("foodGridMount");
    if (!container) return;

    const dataset = appState.nutritionDataset.length > 0 ? appState.nutritionDataset : FOOD_DATABASE;
    let filtered = dataset;

    if (this.selectedFoodCategory && this.selectedFoodCategory !== "all") {
      filtered = filtered.filter(f => (f.category || "").toLowerCase() === this.selectedFoodCategory.toLowerCase());
    }

    if (query) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(query) ||
        (f.category && f.category.toLowerCase().includes(query)) ||
        (f.keyVitamin && f.keyVitamin.toLowerCase().includes(query))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-secondary);">
          <svg width="40" height="40" stroke="var(--border-subtle)" style="margin-bottom: 12px;"><use href="#icon-apple"></use></svg>
          <p>No food items match "${query}". Try searching for apple, chicken, salmon, oats, or paneer.</p>
        </div>
      `;
      return;
    }

    const currentTargetMeal = this.targetMealCategory || "breakfast";

    container.innerHTML = filtered.map(item => `
      <div class="food-card">
        <div>
          <div class="food-header">
            <div>
              <span class="badge-tag" style="font-size: 0.68rem; margin-bottom: 4px; display: inline-block;">${item.category || "Whole Food"}</span>
              <div class="food-title">${item.name}</div>
              <div class="food-serving">50g standard edible portion</div>
            </div>
            <div class="food-cals-badge">${item.calories} <span style="font-size: 0.75rem; color: var(--text-secondary);">kcal</span></div>
          </div>

          <div class="food-macros-row" style="margin-top: 12px; gap: 6px; flex-wrap: wrap;">
            <div>P: <span class="macro-val">${item.protein}g</span></div>
            <div>C: <span class="macro-val">${item.carbs}g</span></div>
            <div>F: <span class="macro-val">${item.fat !== undefined ? item.fat + 'g' : '-'}</span></div>
            <div>Fib: <span class="macro-val">${item.fiber !== undefined ? item.fiber + 'g' : '-'}</span></div>
            <div>Fe: <span class="macro-val">${item.iron !== undefined ? item.iron + 'mg' : '-'}</span></div>
          </div>

          ${item.keyVitamin ? `
            <div style="font-size: 0.75rem; color: var(--green-soft); background: rgba(207, 240, 197, 0.08); border-radius: 6px; padding: 4px 8px; margin-top: 8px; font-weight: 500;">
              ✨ ${item.keyVitamin}
            </div>
          ` : ''}
        </div>

        <div class="food-actions" style="margin-top: 14px; display: flex; gap: 8px; flex-wrap: wrap;">
          <select class="food-portion-select food-meal-select" id="meal_${item.id}" style="min-width: 95px; flex: 1.2;">
            <option value="breakfast" ${currentTargetMeal === 'breakfast' ? 'selected' : ''}>Breakfast</option>
            <option value="lunch" ${currentTargetMeal === 'lunch' ? 'selected' : ''}>Lunch</option>
            <option value="dinner" ${currentTargetMeal === 'dinner' ? 'selected' : ''}>Dinner</option>
            <option value="snacks" ${currentTargetMeal === 'snacks' ? 'selected' : ''}>Snacks</option>
          </select>
          <select class="food-portion-select" id="portion_${item.id}" style="min-width: 75px; flex: 1;">
            <option value="50" selected>50g</option>
            <option value="100">100g</option>
            <option value="150">150g</option>
            <option value="200">200g</option>
          </select>
          <button type="button" class="btn btn-primary btn-sm btn-quick-add" data-id="${item.id}">+ Add</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll(".btn-quick-add").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const mealSelect = document.getElementById(`meal_${id}`);
        const selectedMeal = mealSelect ? mealSelect.value : (this.targetMealCategory || "breakfast");
        const portionSelect = document.getElementById(`portion_${id}`);
        const grams = parseFloat(portionSelect.value) || 50;
        const food = dataset.find(f => f.id === id);
        if (food) {
          appState.addFoodToMeal(selectedMeal, food, grams);
          const mealTitle = selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1);
          this.showToast(`Added ${food.name} (${grams}g) to ${mealTitle}`);
        }
      });
    });
  }

  renderMealTracker() {
    const container = document.getElementById("mealsContainer");
    if (!container) return;

    const meals = appState.state.meals;
    const categories = [
      { key: "breakfast", title: "BREAKFAST" },
      { key: "lunch", title: "LUNCH" },
      { key: "dinner", title: "DINNER" },
      { key: "snacks", title: "SNACKS" }
    ];

    container.innerHTML = categories.map(cat => {
      const items = meals[cat.key] || [];
      const totalCals = Math.round(items.reduce((sum, i) => sum + i.calories, 0));
      const totalProtein = Math.round(items.reduce((sum, i) => sum + i.protein, 0) * 10) / 10;
      const totalFiber = Math.round(items.reduce((sum, i) => sum + (i.fiber || 0), 0) * 10) / 10;

      const itemsHtml = items.length > 0 ? items.map(i => `
        <div class="meal-item-row">
          <div class="meal-item-info">
            <span class="meal-item-name">${i.name}</span>
            <span class="meal-item-sub">${i.grams || 100}g • ${i.protein}g Protein ${i.fiber ? '• ' + i.fiber + 'g Fiber' : ''} ${i.keyVitamin ? '• ' + i.keyVitamin : ''}</span>
          </div>
          <div class="meal-item-stats">
            <span class="meal-cals">${i.calories} kcal</span>
            <button type="button" class="btn btn-secondary btn-sm remove-meal-item" data-cat="${cat.key}" data-id="${i.id}" style="padding: 2px 8px; font-size: 0.75rem;">✕</button>
          </div>
        </div>
      `).join('') : `<p style="font-size: 0.85rem; color: var(--text-muted); padding: 8px 0;">No items logged yet for this meal.</p>`;

      return `
        <div class="meal-category-card">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="font-size: 1.1rem; color: var(--green-primary);">${cat.title}</h4>
              <span style="font-size: 0.82rem; color: var(--text-secondary);">Meal Total: <strong style="color: var(--text-primary);">${totalCals} kcal</strong> • ${totalProtein}g Protein • ${totalFiber}g Fiber</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm btn-meal-add" data-cat="${cat.key}">+ Add Food</button>
          </div>
          <div class="meal-items-list">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll(".btn-meal-add").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-cat");
        this.openAddFoodModal(cat);
      });
    });

    container.querySelectorAll(".remove-meal-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-cat");
        const id = btn.getAttribute("data-id");
        appState.removeFoodFromMeal(cat, id);
        this.showToast("Item removed");
      });
    });
  }

  // --------------------------------------------------------------------------
  // Hydration / Water Tracker (Target: 3.0 to 4.0 Liters)
  // --------------------------------------------------------------------------
  bindWaterTracker() {
    document.getElementById("addWater250Btn")?.addEventListener("click", () => {
      appState.addWater(250);
      this.showToast("+250 ml logged");
      this.renderWaterScreen();
      this.renderAllDynamicComponents();
    });

    document.getElementById("addWater500Btn")?.addEventListener("click", () => {
      appState.addWater(500);
      this.showToast("+500 ml logged");
      this.renderWaterScreen();
      this.renderAllDynamicComponents();
    });

    document.getElementById("addWater1000Btn")?.addEventListener("click", () => {
      appState.addWater(1000);
      this.showToast("+1,000 ml (1 L) logged");
      this.renderWaterScreen();
      this.renderAllDynamicComponents();
    });

    // Daily Target selector pills (3.0 L, 3.5 L, 4.0 L)
    document.querySelectorAll(".water-target-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = parseInt(btn.getAttribute("data-target"), 10) || 3500;
        appState.setWaterGoal(target);
        this.showToast(`Daily water target updated to ${(target / 1000).toFixed(1)} Liters`);
        this.renderWaterScreen();
        this.renderAllDynamicComponents();
      });
    });

    const handleResetWater = () => {
      appState.resetWater();
      this.showToast("Water intake reset to 0 ml.");
      this.renderWaterScreen();
      this.renderAllDynamicComponents();
    };
    document.getElementById("resetWaterBtn")?.addEventListener("click", handleResetWater);
    document.getElementById("resetWaterSettingsBtn")?.addEventListener("click", handleResetWater);
  }

  renderWaterScreen() {
    const currentMl = appState.getWaterTotal();
    const targetMl = appState.state.user.waterGoal || 3500;

    const mount = document.getElementById("waterGaugeMount");
    if (mount) {
      renderHydrationGauge(mount, currentMl, targetMl);
    }

    // Update target text display
    const targetBadge = document.getElementById("waterTargetBadgeText");
    if (targetBadge) {
      targetBadge.textContent = `${(targetMl / 1000).toFixed(1)} Liters (3 to 4 L)`;
    }

    // Update active highlight on target selector pills
    document.querySelectorAll(".water-target-btn").forEach(btn => {
      const btnTarget = parseInt(btn.getAttribute("data-target"), 10);
      if (btnTarget === targetMl) {
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-secondary");
      } else {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
      }
    });

    // Update total badge
    const totalBadge = document.getElementById("waterTotalBadge");
    if (totalBadge) {
      totalBadge.textContent = `${currentMl.toLocaleString()} ml (${(currentMl / 1000).toFixed(2)} L)`;
    }

    // Render timeline
    const timeline = document.getElementById("waterTimelineMount");
    if (timeline) {
      if (appState.state.waterLogs.length === 0) {
        timeline.innerHTML = `
          <div style="text-align: center; padding: 32px 16px; color: var(--text-secondary);">
            <svg width="36" height="36" stroke="var(--border-subtle)" style="margin-bottom: 8px;"><use href="#icon-droplet"></use></svg>
            <p>No fluid logged yet today. Click <strong>+250 ml</strong> or <strong>+500 ml</strong> above to start!</p>
          </div>
        `;
      } else {
        timeline.innerHTML = appState.state.waterLogs.slice().reverse().map(log => `
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 12px 18px; border-radius: var(--radius-md);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="metric-icon-box" style="width: 32px; height: 32px;"><svg><use href="#icon-droplet"></use></svg></div>
              <div>
                <span class="font-bold text-light">${log.time}</span>
                <div style="font-size: 0.78rem; color: var(--text-secondary);">Hydration intake recorded</div>
              </div>
            </div>
            <span style="font-family: var(--font-display); font-weight: 700; color: var(--green-primary); font-size: 1.1rem;">+${log.amount} ml</span>
          </div>
        `).join('');
      }
    }
  }

  // --------------------------------------------------------------------------
  // Workouts & Active Session Interface
  // --------------------------------------------------------------------------
  bindWorkouts() {
    const handleResetWorkouts = () => {
      appState.resetWorkouts();
      this.showToast("Workouts log reset to 0.");
      this.renderAllDynamicComponents();
    };
    document.getElementById("resetWorkoutsBtn")?.addEventListener("click", handleResetWorkouts);
    document.getElementById("resetWorkoutsSettingsBtn")?.addEventListener("click", handleResetWorkouts);

    document.getElementById("backToWorkoutsBtn")?.addEventListener("click", () => {
      this.navigateTo("workouts");
    });

    document.getElementById("startWorkoutSessionBtn")?.addEventListener("click", () => {
      this.startActiveWorkout(appState.state.selectedWorkoutId || "hw-beg");
    });

    document.getElementById("cancelWorkoutBtn")?.addEventListener("click", () => {
      clearInterval(this.activeWorkoutTimer);
      this.navigateTo("workouts");
    });

    document.getElementById("timerPauseBtn")?.addEventListener("click", () => {
      this.isWorkoutPaused = !this.isWorkoutPaused;
      document.getElementById("timerPauseBtn").textContent = this.isWorkoutPaused ? "Resume" : "Pause";
    });

    document.getElementById("nextExerciseBtn")?.addEventListener("click", () => {
      this.nextWorkoutExercise();
    });

    document.getElementById("finishWorkoutEarlyBtn")?.addEventListener("click", () => {
      this.completeActiveWorkout();
    });

    document.getElementById("saveWorkoutToHistoryBtn")?.addEventListener("click", () => {
      const modal = document.getElementById("workoutCompletedModal");
      if (modal) modal.classList.remove("open");
      this.navigateTo("history");
    });
  }

  getMiniMuscleSvg(targetMuscles = []) {
    const list = Array.isArray(targetMuscles) ? targetMuscles.map(s => String(s).toLowerCase()) : [];
    const isFull = list.some(m => m.includes("full"));
    const isChest = isFull || list.some(m => m.includes("chest") || m.includes("push") || m.includes("upper"));
    const isArms = isFull || list.some(m => m.includes("arm") || m.includes("bicep") || m.includes("tricep") || m.includes("upper") || m.includes("grip"));
    const isShoulders = isFull || list.some(m => m.includes("shoulder") || m.includes("deltoid") || m.includes("upper"));
    const isCore = isFull || list.some(m => m.includes("core") || m.includes("abs") || m.includes("plank") || m.includes("oblique"));
    const isLegs = isFull || list.some(m => m.includes("leg") || m.includes("squat") || m.includes("lunge") || m.includes("quad") || m.includes("glute") || m.includes("hiit") || m.includes("calf"));

    const off = "#27302b";
    const on = "#22c55e";

    return `
      <svg width="28" height="48" viewBox="0 0 32 56" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; filter: drop-shadow(0 0 3px rgba(34,197,94,0.35));">
        <!-- Head -->
        <circle cx="16" cy="5" r="3.6" fill="${off}" />
        <!-- Neck -->
        <rect x="14.6" y="8.8" width="2.8" height="2" rx="0.5" fill="${off}" />
        <!-- Traps & Shoulders -->
        <path d="M8 12.2C10.5 11 13.5 11 16 11C18.5 11 21.5 11 24 12.2L26 15.5C26 15.5 22.8 15 16 15C9.2 15 6 15.5 6 15.5L8 12.2Z" fill="${isShoulders ? on : off}" />
        <!-- Chest -->
        <path d="M9.5 15.5C12 15.2 15.8 15.2 16 15.2C16.2 15.2 20 15.2 22.5 15.5C23.2 17.5 22.5 20.2 21.8 21C20 21.5 16 21.5 16 21.5C16 21.5 12 21.5 10.2 21C9.5 20.2 8.8 17.5 9.5 15.5Z" fill="${isChest ? on : off}" />
        <!-- Upper Arms -->
        <path d="M5.5 16.2L3.8 23.5C3.5 25 4.2 27 5.2 28.5L6.4 28.5C6 26.5 5.8 24 7.2 21.5L7.5 16.2Z" fill="${isArms ? on : off}" />
        <path d="M26.5 16.2L28.2 23.5C28.5 25 27.8 27 26.8 28.5L25.6 28.5C26 26.5 26.2 24 24.8 21.5L24.5 16.2Z" fill="${isArms ? on : off}" />
        <!-- Forearms -->
        <path d="M4 29L3 36C2.8 37 3.5 38 4.2 38L5 38C5.2 36.5 5.5 33 6.2 29Z" fill="${isArms ? on : off}" />
        <path d="M28 29L29 36C29.2 37 28.5 38 27.8 38L27 38C26.8 36.5 26.5 33 25.8 29Z" fill="${isArms ? on : off}" />
        <!-- Core / Abs -->
        <rect x="12" y="22.2" width="8" height="7.2" rx="1.2" fill="${isCore ? on : off}" />
        <!-- Pelvis -->
        <path d="M11.5 29.8H20.5L19.2 33.8H12.8L11.5 29.8Z" fill="${off}" />
        <!-- Thighs / Quads -->
        <path d="M11.2 34.2L9.5 43C9.2 44.5 9.5 46 9.2 50H12.2L13.8 43L14.8 34.2H11.2Z" fill="${isLegs ? on : off}" />
        <path d="M20.8 34.2L22.5 43C22.8 44.5 22.5 46 22.8 50H19.8L18.2 43L17.2 34.2H20.8Z" fill="${isLegs ? on : off}" />
        <!-- Calves -->
        <path d="M9.2 50.5L8.5 54.5H12L12.2 50.5H9.2Z" fill="${isLegs ? on : off}" />
        <path d="M22.8 50.5L23.5 54.5H20L19.8 50.5H22.8Z" fill="${isLegs ? on : off}" />
      </svg>
    `;
  }

  updateWorkoutShowcase(workout) {
    if (!workout) return;
    this.selectedShowcaseWorkout = workout;

    const heroImg = document.getElementById("scHeroImg");
    const heroTitle = document.getElementById("scHeroTitle");
    const heroDuration = document.getElementById("scHeroDuration");
    const heroCalories = document.getElementById("scHeroCalories");
    const heroLevel = document.getElementById("scHeroLevel");
    const heroDesc = document.getElementById("scHeroDesc");
    const exList = document.getElementById("scExerciseList");
    const startBtn = document.getElementById("scStartWorkoutBtn");
    const musclesPctList = document.getElementById("scMusclesPctList");
    const proTipText = document.getElementById("scProTipText");

    if (heroImg) heroImg.src = workout.heroImage || workout.image || "images/workouts/hero_full_body_beg.jpg";
    if (heroTitle) heroTitle.textContent = workout.title;
    if (heroDuration) heroDuration.textContent = `${workout.duration} min`;
    if (heroCalories) heroCalories.textContent = `${workout.calories} kcal`;
    if (heroLevel) {
      heroLevel.textContent = workout.level || "Beginner";
      heroLevel.className = workout.level === "Advanced" ? "badge-level-advanced" : "badge-level-beginner";
    }
    if (heroDesc) heroDesc.textContent = workout.description;

    // Exercises middle column
    if (exList && Array.isArray(workout.exercises)) {
      exList.innerHTML = workout.exercises.map((ex, idx) => `
        <div class="showcase-exercise-item" data-ex-idx="${idx}">
          <div class="showcase-ex-left">
            <span class="showcase-ex-num">${idx + 1}</span>
            <img src="${ex.thumb || 'images/workouts/thumb_squat.jpg'}" alt="${ex.name}" class="showcase-ex-thumb" onerror="this.src='images/workouts/thumb_squat.jpg'" />
            <div class="showcase-ex-info">
              <h4>${ex.name}</h4>
              <span>${ex.reps || (ex.sets ? `${ex.sets} × 10` : '3 × 10')}</span>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      `).join('');

      // Click on exercise opens details
      exList.querySelectorAll(".showcase-exercise-item").forEach(item => {
        item.addEventListener("click", () => {
          this.openWorkoutDetails(workout.id);
        });
      });
    }

    // Start workout button
    if (startBtn) {
      startBtn.onclick = () => {
        appState.state.selectedWorkoutId = workout.id;
        this.startActiveWorkout(workout.id);
      };
    }

    // Muscles worked list
    if (musclesPctList) {
      const breakdown = workout.musclesWorked || [
        { name: "Full Body", pct: 100 },
        { name: "Core", pct: 70 },
        { name: "Legs", pct: 65 },
        { name: "Arms", pct: 50 },
        { name: "Shoulders", pct: 45 }
      ];
      musclesPctList.innerHTML = breakdown.map(m => `
        <div class="showcase-muscles-pct-item">
          <span class="muscle-name"><span class="muscle-dot"></span>${m.name}</span>
          <span class="muscle-pct">${m.pct}%</span>
        </div>
      `).join('');
    }

    // Pro tip
    if (proTipText) {
      proTipText.textContent = workout.proTip || "Keep your core tight and maintain good form throughout the workout for better results and reduced injury risk.";
    }

    // Highlight selected card visually
    document.querySelectorAll(".workout-photo-card").forEach(c => {
      if (c.getAttribute("data-id") === workout.id) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });
  }

  renderWorkoutsCategories() {
    const homeMount = document.getElementById("homeWorkoutsGrid");
    const equipMount = document.getElementById("equipmentWorkoutsGrid");
    const circuitsMount = document.getElementById("circuitsWorkoutsGrid");
    if (!homeMount || !equipMount) return;

    // Featured image workouts (matching reference UI)
    const homeFeatured = WORKOUT_CATEGORIES.filter(w => w.category === "Home Workouts" && w.image);
    const equipFeatured = WORKOUT_CATEGORIES.filter(w => w.category === "Equipment Workouts" && w.image);
    const circuitsList = WORKOUT_CATEGORIES.filter(w => w.subCategory === "30-Min Circuit");

    // Initialize active selected workout to first one (Full Body Beginner) if not set
    if (!this.selectedShowcaseWorkout) {
      this.selectedShowcaseWorkout = homeFeatured[0] || WORKOUT_CATEGORIES[0];
    }

    const renderPhotoCard = (w) => `
      <div class="workout-photo-card ${(this.selectedShowcaseWorkout && this.selectedShowcaseWorkout.id === w.id) ? 'selected' : ''}" data-id="${w.id}">
        <div class="workout-card-img-wrap">
          <img src="${w.image || 'images/workouts/workout_pushups_hd.jpg'}" alt="${w.title}" loading="lazy" onerror="this.src='images/workouts/workout_pushups_hd.jpg'" />
          <div class="workout-card-overlay"></div>
        </div>
        <div class="workout-card-body">
          <div class="workout-card-title">${w.title}</div>
          <div class="workout-card-footer-row">
            <div class="workout-card-stats">
              <div class="workout-meta-inline">
                <span>⏱ ${w.duration} min</span>
                <span>🔥 ${w.calories} kcal</span>
              </div>
              <div style="margin-top: 4px;">
                <span class="${w.level === 'Advanced' ? 'badge-level-advanced' : 'badge-level-beginner'}">${w.level || 'Beginner'}</span>
              </div>
            </div>
            <div class="workout-mini-figure">
              ${this.getMiniMuscleSvg(w.targetMuscles || [])}
            </div>
          </div>
        </div>
      </div>
    `;

    const renderCircuitCard = (w) => `
      <div class="workout-card" data-id="${w.id}">
        <div>
          <div class="workout-badge-row">
            <span class="badge-tag">${w.subCategory || 'Circuit'}</span>
            <span style="font-family: var(--font-display); font-weight: 700; color: var(--green-primary);">${w.calories} kcal</span>
          </div>
          <h3 style="font-size: 1.15rem; margin: 10px 0 6px 0;">${w.title}</h3>
          <p style="font-size: 0.85rem; line-height: 1.4;">${w.description}</p>
        </div>
        <div>
          <div class="workout-meta-chips" style="margin-bottom: 12px;">
            <span class="meta-chip">⏱️ ${w.duration} min</span>
            <span class="meta-chip">⚡ ${w.intensity}</span>
            <span class="meta-chip">📋 ${w.exercisesCount} Exercises</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="width: 100%;">View Routine & Start →</button>
        </div>
      </div>
    `;

    const filterCards = (list, levelFilter) => {
      if (!levelFilter || levelFilter === 'all') return list;
      return list.filter(w => (w.level || '').toLowerCase() === levelFilter.toLowerCase());
    };

    const bindCardClicks = () => {
      document.querySelectorAll(".workout-photo-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = card.getAttribute("data-id");
          const w = WORKOUT_CATEGORIES.find(x => x.id === id);
          if (w) {
            this.updateWorkoutShowcase(w);
          }
        });
      });

      document.querySelectorAll(".workout-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = card.getAttribute("data-id");
          this.openWorkoutDetails(id);
        });
      });
    };

    const updateHomeGrid = () => {
      const list = filterCards(homeFeatured, this._homeFilterLevel);
      homeMount.innerHTML = list.map(renderPhotoCard).join('');
      bindCardClicks();
    };

    const updateEquipGrid = () => {
      const list = filterCards(equipFeatured, this._equipFilterLevel);
      equipMount.innerHTML = list.map(renderPhotoCard).join('');
      bindCardClicks();
    };

    // Render cards initially
    updateHomeGrid();
    updateEquipGrid();
    if (circuitsMount) {
      circuitsMount.innerHTML = circuitsList.map(renderCircuitCard).join('');
      bindCardClicks();
    }

    // Populate bottom showcase panel
    this.updateWorkoutShowcase(this.selectedShowcaseWorkout);

    // Setup pill filters
    if (!this._workoutPillsBound) {
      this._workoutPillsBound = true;

      document.querySelectorAll("#homePillsGroup .workout-pill-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const level = btn.getAttribute("data-level");
          if (this._homeFilterLevel === level) {
            this._homeFilterLevel = null;
            btn.classList.remove("active");
          } else {
            document.querySelectorAll("#homePillsGroup .workout-pill-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            this._homeFilterLevel = level;
          }
          updateHomeGrid();
        });
      });

      document.querySelectorAll("#equipPillsGroup .workout-pill-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const level = btn.getAttribute("data-level");
          if (this._equipFilterLevel === level) {
            this._equipFilterLevel = null;
            btn.classList.remove("active");
          } else {
            document.querySelectorAll("#equipPillsGroup .workout-pill-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            this._equipFilterLevel = level;
          }
          updateEquipGrid();
        });
      });
    }
  }

  openWorkoutDetails(workoutId) {
    appState.state.selectedWorkoutId = workoutId;
    const workout = WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];

    document.getElementById("wDetailCategory").textContent = `${workout.category} • ${workout.subCategory}`;
    document.getElementById("wDetailTitle").textContent = workout.title;
    document.getElementById("wDetailDesc").textContent = workout.description;
    document.getElementById("wDetailCalories").textContent = `${workout.calories} kcal`;
    document.getElementById("wDetailDuration").textContent = `${workout.duration} min duration`;

    const variationsBox = document.getElementById("wDetailVariationsBox");
    const variationsText = document.getElementById("wDetailVariationsText");
    if (variationsBox && variationsText) {
      if (workout.variations) {
        variationsText.textContent = workout.variations;
        variationsBox.style.display = "block";
      } else {
        variationsBox.style.display = "none";
      }
    }

    const exerciseListMount = document.getElementById("wDetailExerciseList");
    if (exerciseListMount) {
      exerciseListMount.innerHTML = workout.exercises.map((ex, idx) => `
        <div style="background: var(--bg-surface); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div>
              <div class="font-bold text-light" style="font-size: 1rem;">${idx + 1}. ${ex.name}</div>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">🎯 ${ex.target}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; color: var(--green-primary); font-size: 1rem;">${ex.sets} × ${ex.reps}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">Rest: ${ex.restSec}s</div>
            </div>
          </div>
          ${ex.howTo ? `<div style="font-size: 0.83rem; color: #a3a3a3; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);"><strong style="color: var(--text-primary);">How To:</strong> ${ex.howTo}</div>` : ''}
          ${ex.caloriesPer30Min ? `<div style="font-size: 0.78rem; color: #34d399; margin-top: 6px; font-weight: 600;">⚡ Est. Burn: ${ex.caloriesPer30Min} (per 30 min)</div>` : ''}
        </div>
      `).join('');
    }

    this.navigateTo("workout-details");
  }

  startActiveWorkout(workoutId) {
    const workout = WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];
    this.activeWorkoutObj = workout;
    this.currentExerciseIndex = 0;
    this.workoutSeconds = 0;
    this.isWorkoutPaused = false;

    document.getElementById("activeWorkoutTitle").textContent = workout.title;
    this.updateActiveExerciseUI();

    clearInterval(this.activeWorkoutTimer);
    this.activeWorkoutTimer = setInterval(() => {
      if (!this.isWorkoutPaused) {
        this.workoutSeconds++;
        const mins = String(Math.floor(this.workoutSeconds / 60)).padStart(2, '0');
        const secs = String(this.workoutSeconds % 60).padStart(2, '0');
        document.getElementById("activeWorkoutTimerDisplay").textContent = `${mins}:${secs}`;
      }
    }, 1000);

    this.navigateTo("active-workout");
  }

  updateActiveExerciseUI() {
    const workout = this.activeWorkoutObj;
    const currentEx = workout.exercises[this.currentExerciseIndex];

    document.getElementById("activeCurrentExerciseName").textContent = currentEx.name;
    document.getElementById("activeStepIndicator").textContent = `Exercise ${this.currentExerciseIndex + 1} of ${workout.exercises.length}`;
    document.getElementById("activeRestIndicator").textContent = `Rest: ${currentEx.restSec}s between sets`;
    document.getElementById("activeSetsDisplay").textContent = currentEx.sets;
    document.getElementById("activeRepsDisplay").textContent = currentEx.reps;
    document.getElementById("activeTargetDisplay").textContent = currentEx.target;

    const nextBtn = document.getElementById("nextExerciseBtn");
    if (this.currentExerciseIndex === workout.exercises.length - 1) {
      nextBtn.textContent = "Finish Routine";
    } else {
      nextBtn.textContent = "Next Exercise";
    }
  }

  nextWorkoutExercise() {
    const workout = this.activeWorkoutObj;
    if (this.currentExerciseIndex < workout.exercises.length - 1) {
      this.currentExerciseIndex++;
      this.updateActiveExerciseUI();
      this.showToast(`Moving to: ${workout.exercises[this.currentExerciseIndex].name}`);
    } else {
      this.completeActiveWorkout();
    }
  }

  completeActiveWorkout() {
    clearInterval(this.activeWorkoutTimer);
    const workout = this.activeWorkoutObj || WORKOUT_CATEGORIES[0];
    const durationActual = Math.max(1, Math.round(this.workoutSeconds / 60));

    appState.completeWorkout(workout.id, durationActual);

    document.getElementById("wCompletedTitle").textContent = workout.title;
    document.getElementById("wCompletedCalories").textContent = `${workout.calories} kcal`;
    document.getElementById("wCompletedDuration").textContent = `${durationActual} minutes`;

    if (typeof aiCoach !== "undefined" && aiCoach.triggerPostWorkoutCheck) {
      aiCoach.triggerPostWorkoutCheck(workout.title || workout.name || "Workout");
    }

    const modal = document.getElementById("workoutCompletedModal");
    if (modal) modal.classList.add("open");
  }

  // --------------------------------------------------------------------------
  // Sports Dashboard & Sport Details & Body Impact
  // --------------------------------------------------------------------------
  bindSports() {
    const handleResetSports = () => {
      appState.resetSports();
      this.showToast("Sports session log reset to 0.");
      this.renderAllDynamicComponents();
    };
    document.getElementById("resetSportsBtn")?.addEventListener("click", handleResetSports);
    document.getElementById("resetSportsSettingsBtn")?.addEventListener("click", handleResetSports);

    document.getElementById("backToSportsBtn")?.addEventListener("click", () => {
      this.navigateTo("sports");
    });

    const calcCalories = () => {
      const sport = SPORTS_DATA.find(s => s.id === appState.state.selectedSportId) || SPORTS_DATA[0];
      const duration = parseFloat(document.getElementById("sInputDuration").value) || 45;
      const intensity = document.getElementById("sInputIntensity").value;

      let multiplier = 1.0;
      if (intensity === "Low") multiplier = 0.8;
      if (intensity === "High") multiplier = 1.35;

      const calories = Math.round(sport.cpmBase * duration * multiplier);
      document.getElementById("sEstimatedCalories").textContent = `${calories} kcal`;
    };

    document.getElementById("sInputDuration")?.addEventListener("input", calcCalories);
    document.getElementById("sInputIntensity")?.addEventListener("change", calcCalories);

    document.getElementById("saveSportActivityBtn")?.addEventListener("click", () => {
      const duration = parseFloat(document.getElementById("sInputDuration").value) || 45;
      const intensity = document.getElementById("sInputIntensity").value;
      const result = appState.addSportActivity(appState.state.selectedSportId, duration, intensity);
      this.showToast(`Saved ${result.sport.name} (${duration}m, ${result.calories} kcal) to History!`);
      this.navigateTo("history");
    });

    document.getElementById("bodySportSelector")?.addEventListener("change", (e) => {
      appState.state.selectedSportId = e.target.value;
      this.renderBodyAnalysisView();
    });
  }

  renderSportsDashboard() {
    const container = document.getElementById("sportsCardsGrid");
    if (!container) return;

    container.innerHTML = SPORTS_DATA.map(sport => `
      <div class="sport-card" data-id="${sport.id}">
        <div>
          <div class="sport-card-top">
            <div class="sport-icon-circle">
              <svg><use href="#icon-${sport.icon}"></use></svg>
            </div>
            <span style="font-family: var(--font-display); font-weight: 700; color: var(--green-primary); font-size: 0.95rem;">
              ~${Math.round(sport.cpmBase * 45)} kcal / 45m
            </span>
          </div>
          <h3 style="font-size: 1.35rem; margin: 14px 0 6px 0;">${sport.name}</h3>
          <span style="font-size: 0.78rem; color: var(--green-soft); font-weight: 600;">${sport.type}</span>
          <p style="font-size: 0.85rem; line-height: 1.4; margin-top: 8px;">${sport.description}</p>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" style="width: 100%;">Configure Session →</button>
      </div>
    `).join('');

    container.querySelectorAll(".sport-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        this.openSportDetails(id);
      });
    });
  }

  openSportDetails(sportId) {
    appState.state.selectedSportId = sportId;
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];

    document.getElementById("sDetailName").textContent = sport.name;
    document.getElementById("sDetailType").textContent = sport.type;
    document.getElementById("sDetailDesc").textContent = `"${sport.description}"`;
    document.getElementById("sDetailIconBox").innerHTML = `<svg width="28" height="28"><use href="#icon-${sport.icon}"></use></svg>`;

    document.getElementById("sInputDuration").value = 45;
    document.getElementById("sInputIntensity").value = "Moderate";
    const initialCalories = Math.round(sport.cpmBase * 45);
    document.getElementById("sEstimatedCalories").textContent = `${initialCalories} kcal`;

    const suggestionsMount = document.getElementById("sDetailSuggestionsMount");
    if (suggestionsMount) {
      suggestionsMount.innerHTML = sport.performanceSuggestions.slice(0, 3).map(s => `
        <div class="suggestion-card">
          <svg><use href="#icon-activity"></use></svg>
          <div class="suggestion-text">${s}</div>
        </div>
      `).join('');
    }

    // Render interactive Anatomical Load Map for the selected sport directly in details
    const detailMapContainer = document.getElementById("sDetailBodyMapContainer");
    if (detailMapContainer) {
      renderBodyMap(detailMapContainer, sportId, "both");
    }

    if (typeof aiCoach !== "undefined" && aiCoach.triggerPreSportCheck) {
      aiCoach.triggerPreSportCheck(sportId);
    }

    this.navigateTo("sport-details");
  }

  bindBodyMap() {
    const selector = document.getElementById("bodySportSelector");
    if (selector) {
      selector.addEventListener("change", (e) => {
        appState.state.selectedSportId = e.target.value;
        this.renderBodyAnalysisView();
      });
    }

    document.getElementById("sportsViewBodyImpactBtn")?.addEventListener("click", () => {
      this.navigateTo("body-analysis");
    });
    document.getElementById("sDetailBodyImpactBtn")?.addEventListener("click", () => {
      this.navigateTo("body-analysis");
    });
    document.getElementById("sDetailFullBodyImpactBtn")?.addEventListener("click", () => {
      this.navigateTo("body-analysis");
    });
  }

  renderBodyAnalysisView() {
    const container = document.getElementById("bodyMapContainer");
    const sportId = appState.state.selectedSportId || "cycling";
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];

    if (container) {
      renderBodyMap(container, sportId, "both");
    }

    const selector = document.getElementById("bodySportSelector");
    if (selector) selector.value = sportId;

    const sub = document.getElementById("suggestionsSportSubtitle");
    if (sub) sub.textContent = `"${sport.name} strongly engages your musculoskeletal kinetic chain."`;

    const suggestionsMount = document.getElementById("performanceSuggestionsContainer");
    if (suggestionsMount) {
      suggestionsMount.innerHTML = sport.performanceSuggestions.map(s => `
        <div class="suggestion-card">
          <svg><use href="#icon-activity"></use></svg>
          <div class="suggestion-text">${s}</div>
        </div>
      `).join('');
    }
  }

  renderSportsBenefitsMatrix() {
    const container = document.getElementById("sportsBenefitsGrid");
    if (!container) return;

    container.innerHTML = SPORTS_DATA.map(sport => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="sport-icon-circle" style="width: 36px; height: 36px;">
              <svg width="18" height="18"><use href="#icon-${sport.icon}"></use></svg>
            </div>
            <h3 class="card-title">${sport.name}</h3>
          </div>
          <span class="badge-tag">${sport.type.split('/')[0].trim()}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.8rem;">
          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Cardiovascular Fitness</span>
              <span class="font-bold text-green">${sport.benefits.cardio}%</span>
            </div>
            <div class="progress-track"><div class="progress-fill-primary" style="width: ${sport.benefits.cardio}%;"></div></div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Muscular Strength</span>
              <span class="font-bold text-light">${sport.benefits.strength}%</span>
            </div>
            <div class="progress-track"><div class="progress-fill-soft" style="width: ${sport.benefits.strength}%;"></div></div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Endurance & Stamina</span>
              <span class="font-bold text-green">${sport.benefits.endurance}%</span>
            </div>
            <div class="progress-track"><div class="progress-fill-primary" style="width: ${sport.benefits.endurance}%;"></div></div>
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span>Caloric Expenditure</span>
              <span class="font-bold text-green">${sport.benefits.calorieBurn}%</span>
            </div>
            <div class="progress-track"><div class="progress-fill-primary" style="width: ${sport.benefits.calorieBurn}%;"></div></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 20. Common History (Unified Fitness + Sports Timeline)
  // --------------------------------------------------------------------------
  bindHistoryFilters() {
    const tabs = document.querySelectorAll("#historyFilterTabs .tab-pill");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const filter = tab.getAttribute("data-filter");
        this.renderHistoryFeed(filter);
      });
    });

    document.getElementById("historyQuickLogBtn")?.addEventListener("click", () => {
      this.openAddFoodModal("dinner");
    });

    document.getElementById("sendHistoryTelegramBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("sendHistoryTelegramBtn");
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span>⏳ Sending to Telegram...</span>`;
      }

      // Generate exact activity history report
      const historyText = appState.generateExactHistoryTelegramText();

      // Copy to clipboard for instant access
      try {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(historyText).catch(() => {});
        }
      } catch (e) {}

      // Dispatch via Telegram Bot API
      const result = await appState.sendTelegramHistoryNotification(historyText);

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<svg width="18" height="18" stroke="#24A1DE"><use href="#icon-telegram"></use></svg> Send History to Telegram (@sgifesdf_bot)`;
      }

      if (result && result.success) {
        this.showToast(`✅ History sent to Telegram via @sgifesdf_bot!`);
      } else {
        this.showToast(`✈️ Telegram bot offline. Opening Telegram share with history...`);
        // Preload Telegram with exact formatted history timeline as fallback
        const encoded = encodeURIComponent(historyText);
        const url = `https://t.me/share/url?url=&text=${encoded}`;
        window.open(url, "_blank");
      }
    });

    const handleResetHistory = () => {
      appState.resetHistory();
      this.showToast("Activity history timeline has been reset.");
      this.renderHistoryFeed("all");
      document.querySelectorAll("#historyFilterTabs .tab-pill").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.filter === "all");
      });
    };
    document.getElementById("resetHistoryBtn")?.addEventListener("click", handleResetHistory);
    document.getElementById("resetHistorySettingsBtn")?.addEventListener("click", handleResetHistory);
  }

  renderHistoryFeed(filter = "all") {
    const user = appState.state.user || {};
    const nut = appState.getNutritionTotals();
    const burned = appState.getCaloriesBurnedToday();
    const netCalories = Math.max(0, nut.calories - burned);
    const targetCalories = user.calorieGoal || 2063;
    const completionPct = Math.min(100, Math.round((nut.calories / targetCalories) * 100));
    const remainingCalories = Math.max(0, targetCalories - nut.calories);

    // 1. Update History Caloric Performance Banner
    const elTarget = document.getElementById("histValTargetCalories");
    if (elTarget) {
      elTarget.innerHTML = `${targetCalories.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;
    }

    const elCompleted = document.getElementById("histValCompletedCalories");
    if (elCompleted) {
      elCompleted.innerHTML = `${nut.calories.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;
    }

    const elBurned = document.getElementById("histValBurnedCalories");
    if (elBurned) {
      elBurned.innerHTML = `${burned.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;
    }

    const elNet = document.getElementById("histValNetCalories");
    if (elNet) {
      elNet.innerHTML = `${netCalories.toLocaleString()} <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;
    }

    const elNetSub = document.getElementById("histNetCaloriesSubtext");
    if (elNetSub) {
      elNetSub.textContent = `${nut.calories.toLocaleString()} in − ${burned.toLocaleString()} burn`;
    }

    const elProgLabel = document.getElementById("histCalorieProgressLabel");
    if (elProgLabel) {
      elProgLabel.textContent = `${nut.calories.toLocaleString()} / ${targetCalories.toLocaleString()} kcal (${completionPct}%)`;
    }

    const elProgBar = document.getElementById("histCalorieProgressBar");
    if (elProgBar) {
      elProgBar.style.width = `${completionPct}%`;
    }

    const elStatusBadge = document.getElementById("historyCalorieStatusBadge");
    if (elStatusBadge) {
      if (nut.calories === 0) {
        elStatusBadge.textContent = "● 0% Completed (Fresh Day)";
        elStatusBadge.style.color = "var(--text-secondary)";
        elStatusBadge.style.borderColor = "var(--border-subtle)";
      } else if (nut.calories >= targetCalories) {
        elStatusBadge.textContent = `✓ 100% Target Met (${nut.calories.toLocaleString()} kcal)`;
        elStatusBadge.style.color = "var(--green-primary)";
        elStatusBadge.style.borderColor = "var(--green-primary)";
      } else {
        elStatusBadge.textContent = `● ${completionPct}% Completed (${remainingCalories.toLocaleString()} kcal left)`;
        elStatusBadge.style.color = "var(--green-primary)";
        elStatusBadge.style.borderColor = "var(--green-primary)";
      }
    }

    const elRemain = document.getElementById("histCalorieRemainingText");
    if (elRemain) {
      elRemain.textContent = remainingCalories > 0 ? `Remaining to target: ${remainingCalories.toLocaleString()} kcal` : `Target achieved! Surplus: ${(nut.calories - targetCalories).toLocaleString()} kcal`;
    }

    const elBurnTarget = document.getElementById("histCalorieBurnTrajectoryText");
    if (elBurnTarget) {
      elBurnTarget.textContent = `Daily burn target: ${(user.dailyBurnTarget || 635).toLocaleString()} kcal`;
    }

    const container = document.getElementById("historyTimelineFeed");
    if (!container) return;

    let items = appState.state.history;
    if (filter !== "all") {
      items = items.filter(item => item.type === filter);
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; color: var(--text-secondary);">
          <svg width="40" height="40" stroke="var(--border-subtle)" style="margin-bottom: 12px;"><use href="#icon-clock"></use></svg>
          <p>No activity logged under this category yet.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      let calorieTagHtml = "";
      if (item.type === "meals") {
        calorieTagHtml = `<div style="margin-top: 4px;"><span style="font-size: 0.72rem; padding: 2px 7px; border-radius: 4px; background: rgba(31, 182, 34, 0.12); color: var(--green-primary); font-weight: 600;">Completed: +${item.metric}</span></div>`;
      } else if (item.type === "workouts" || item.type === "sports") {
        calorieTagHtml = `<div style="margin-top: 4px;"><span style="font-size: 0.72rem; padding: 2px 7px; border-radius: 4px; background: rgba(255, 153, 68, 0.12); color: #ff9944; font-weight: 600;">Burn: −${item.metric}</span></div>`;
      }

      return `
        <div class="timeline-item">
          <div class="timeline-left">
            <div class="timeline-icon-box">
              <svg><use href="#icon-${item.icon || 'activity'}"></use></svg>
            </div>
            <div>
              <div class="timeline-title">${item.title}</div>
              <div class="timeline-sub">${item.subtitle} • ${item.subMetric}</div>
              ${calorieTagHtml}
            </div>
          </div>
          <div class="timeline-right">
            <div class="timeline-metric">${item.metric}</div>
            <div class="timeline-time">${item.date} • ${item.time}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // 21. Analytics & Charts
  // --------------------------------------------------------------------------
  renderAnalyticsCharts() {
    const user = appState.state.user || {};
    const nut = appState.getNutritionTotals();
    const burned = appState.getCaloriesBurnedToday();
    const netCalories = Math.max(0, nut.calories - burned);
    const schedule = appState.getAutoResetSchedule();

    const workoutsToday = appState.state.history.filter(h => h.date === "Today" && h.type === "workouts").length;
    const sportsToday = appState.state.history.filter(h => h.date === "Today" && h.type === "sports").length;
    const totalTodaySessions = workoutsToday + sportsToday;

    // 1. Update Live Daily Analytics Stat Cards
    const elCons = document.getElementById("analyticsTodayConsumed");
    if (elCons) elCons.innerHTML = `${nut.calories.toLocaleString()} <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;

    const elBurn = document.getElementById("analyticsTodayBurned");
    if (elBurn) elBurn.innerHTML = `${burned.toLocaleString()} <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;

    const elNet = document.getElementById("analyticsTodayNet");
    if (elNet) elNet.innerHTML = `${netCalories.toLocaleString()} <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">kcal</span>`;

    const elNetSub = document.getElementById("analyticsNetSubtext");
    if (elNetSub) elNetSub.textContent = `${nut.calories.toLocaleString()} in − ${burned.toLocaleString()} burn`;

    const elWk = document.getElementById("analyticsTodayWorkouts");
    if (elWk) elWk.innerHTML = `${totalTodaySessions} <span style="font-size: 0.82rem; font-weight: 600; color: var(--text-secondary);">completed</span>`;

    const elWkSub = document.getElementById("analyticsWorkoutsSubtext");
    if (elWkSub) elWkSub.textContent = `${workoutsToday} workouts • ${sportsToday} sports`;

    const elSchedBadge = document.getElementById("analyticsAutoResetScheduleBadge");
    if (elSchedBadge) {
      elSchedBadge.textContent = schedule.enabled ? `⏱ Auto-Reset: ${schedule.time12 || schedule.time}` : `⏱ Reset: OFF`;
      elSchedBadge.style.cursor = "pointer";
      if (!elSchedBadge.dataset.bound) {
        elSchedBadge.dataset.bound = "true";
        elSchedBadge.addEventListener("click", () => this.openAutoResetModal());
      }
    }

    const elInstantReset = document.getElementById("analyticsInstantResetBtn");
    if (elInstantReset && !elInstantReset.dataset.bound) {
      elInstantReset.dataset.bound = "true";
      elInstantReset.addEventListener("click", () => {
        appState.resetDailyTrackers();
        this.renderMealTracker();
        this.renderWaterScreen();
        this.renderAllDynamicComponents();
        this.showToast("🔄 Analytics & daily activity reset to 0!");
      });
    }

    // 2. Dynamic Most Played Sports Analytics (starts down at 0, increases as sports are logged)
    const sportsTodayEntries = appState.state.history.filter(h => h.date === "Today" && h.type === "sports");
    let totalSportsMins = 0;
    let totalSportsCals = 0;
    const sportMinutesMap = {
      "Cycling": 0,
      "Football": 0,
      "Badminton": 0,
      "Running": 0
    };

    sportsTodayEntries.forEach(entry => {
      // parse metric (e.g. "520 kcal burned")
      const calsMatch = entry.metric?.match(/(\d+)\s*kcal/);
      if (calsMatch) totalSportsCals += parseInt(calsMatch[1], 10);

      // parse subMetric (e.g. "Duration: 45 min")
      const durMatch = entry.subMetric?.match(/Duration:\s*(\d+)\s*min/);
      const mins = durMatch ? parseInt(durMatch[1], 10) : 30;
      totalSportsMins += mins;

      const titleLower = (entry.title || "").toLowerCase();
      if (titleLower.includes("cycling")) sportMinutesMap["Cycling"] += mins;
      else if (titleLower.includes("football")) sportMinutesMap["Football"] += mins;
      else if (titleLower.includes("badminton")) sportMinutesMap["Badminton"] += mins;
      else if (titleLower.includes("running") || titleLower.includes("run")) sportMinutesMap["Running"] += mins;
      else {
        // dynamic sport
        const sName = entry.title.replace(/^Sport:\s*/i, '').trim();
        sportMinutesMap[sName] = (sportMinutesMap[sName] || 0) + mins;
      }
    });

    const elSportsTime = document.getElementById("analyticsTotalSportsTime");
    if (elSportsTime) {
      elSportsTime.textContent = `${(totalSportsMins / 60).toFixed(1)} hrs`;
    }
    const elSportsCals = document.getElementById("analyticsTotalSportsCalories");
    if (elSportsCals) {
      elSportsCals.textContent = `${totalSportsCals.toLocaleString()} kcal`;
    }
    const elActiveDay = document.getElementById("analyticsMostActiveDay");
    if (elActiveDay) {
      elActiveDay.textContent = totalSportsMins > 0 ? "Today" : "Awaiting Activity";
    }

    const elPrimarySportTitle = document.getElementById("analyticsPrimarySportTitle");
    const sportsKeys = Object.keys(sportMinutesMap);
    let topSport = null;
    let maxMins = 0;
    sportsKeys.forEach(k => {
      if (sportMinutesMap[k] > maxMins) {
        maxMins = sportMinutesMap[k];
        topSport = k;
      }
    });

    if (elPrimarySportTitle) {
      if (totalSportsMins === 0) {
        elPrimarySportTitle.textContent = "Clean Slate (0 min)";
        elPrimarySportTitle.style.color = "var(--text-secondary)";
      } else {
        const topPct = Math.round((maxMins / totalSportsMins) * 100);
        elPrimarySportTitle.textContent = `${topSport} Dominance (${topPct}%)`;
        elPrimarySportTitle.style.color = "var(--green-primary)";
      }
    }

    const elSportsBarsList = document.getElementById("analyticsSportsBarsList");
    if (elSportsBarsList) {
      const displaySports = ["Cycling", "Football", "Badminton", "Running"];
      // ensure all tracked sports are shown
      sportsKeys.forEach(k => {
        if (!displaySports.includes(k) && sportMinutesMap[k] > 0) displaySports.push(k);
      });

      elSportsBarsList.innerHTML = displaySports.map((sportName, idx) => {
        const mins = sportMinutesMap[sportName] || 0;
        const pct = totalSportsMins > 0 ? Math.round((mins / totalSportsMins) * 100) : 0;
        const hours = (mins / 60).toFixed(1);
        const isHighlight = sportName === topSport && totalSportsMins > 0;
        const fillBg = idx === 0 ? "var(--green-primary)" : (idx === 1 ? "var(--green-soft)" : (idx === 2 ? "#2f442f" : "#252e25"));

        return `
          <div class="sport-bar-row">
            <div class="sport-bar-meta ${isHighlight ? 'highlight' : ''}">
              <span style="${isHighlight ? 'color: var(--green-primary); font-weight: 700;' : ''}">${sportName}</span>
              <span style="${isHighlight ? 'color: var(--green-primary); font-weight: 700;' : 'color: var(--text-secondary);'}">
                ${pct}% • ${mins > 0 ? `${hours} hrs (${mins}m)` : '0 mins'}
              </span>
            </div>
            <div class="sport-bar-track">
              <div class="sport-bar-fill ${isHighlight ? 'active' : ''}" style="width: ${pct}%; background: ${fillBg}; transition: width 0.4s ease;"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // 3. Dynamic Weekly Workout Frequency (starts down at 0, increases with completed sessions)
    const elFreqBars = document.getElementById("analyticsWeeklyWorkoutFrequencyBars");
    const elFreqSub = document.getElementById("analyticsWorkoutConsistencySub");
    const elFreqBadge = document.getElementById("analyticsWorkoutTargetBadge");
    const elFreqStrain = document.getElementById("analyticsWorkoutPeakStrain");

    const daysWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayIndex = new Date().getDay();
    const todayDayName = daysWeek[todayIndex];

    const targetWeeklySessions = 6;
    const consistencyPct = Math.min(100, Math.round((totalTodaySessions / targetWeeklySessions) * 100));

    if (elFreqSub) {
      elFreqSub.textContent = `Consistency: ${totalTodaySessions} of ${targetWeeklySessions} target sessions`;
    }
    if (elFreqBadge) {
      elFreqBadge.textContent = `${consistencyPct}% TARGET`;
      elFreqBadge.style.color = totalTodaySessions > 0 ? "var(--green-primary)" : "var(--text-secondary)";
      elFreqBadge.style.borderColor = totalTodaySessions > 0 ? "var(--green-primary)" : "var(--border-color)";
    }
    if (elFreqStrain) {
      elFreqStrain.textContent = totalTodaySessions > 0 
        ? `Today (${todayDayName}): ${totalTodaySessions} session${totalTodaySessions > 1 ? 's' : ''} completed` 
        : `Today (${todayDayName}): 0 sessions completed (Down at 0)`;
      elFreqStrain.style.color = totalTodaySessions > 0 ? "var(--green-primary)" : "var(--text-secondary)";
    }

    if (elFreqBars) {
      const weekdaysList = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      elFreqBars.innerHTML = weekdaysList.map(dayName => {
        const isToday = dayName === todayDayName;
        const count = isToday ? totalTodaySessions : 0;
        const barHeight = count > 0 ? Math.min(140, Math.max(25, count * 45)) : 0;
        const isDown = count === 0;

        return `
          <div class="chart-col" style="text-align: center; flex: 1; position: relative;">
            <div style="height: 120px; display: flex; align-items: flex-end; justify-content: center; position: relative;">
              ${isDown ? `
                <div style="position: absolute; bottom: 0; width: 65%; height: 3px; background: rgba(255, 255, 255, 0.08); border-radius: 2px;" title="${dayName}: 0 sessions (Down at 0)"></div>
              ` : ''}
              <div class="bar bar-burned" style="height: ${barHeight}px; width: 14px; transition: height 0.4s ease; ${barHeight === 0 ? 'opacity: 0;' : ''} ${isToday ? 'background: var(--green-primary); box-shadow: 0 0 12px rgba(31, 182, 34, 0.6);' : 'background: #252e25;'}" title="${dayName}: ${count} completed session(s)"></div>
            </div>
            <span class="col-label" style="display: block; margin-top: 8px; font-size: 0.78rem; ${isToday ? 'color: var(--green-primary); font-weight: 800;' : 'color: var(--text-secondary);'}">
              ${dayName}${isToday ? ' (Today)' : ''}
            </span>
          </div>
        `;
      }).join('');
    }

    // 4. Weekly Energy Balance Dynamic Chart (today's consumed & burned live)
    const weeklyMount = document.getElementById("analyticsWeeklyChartMount");
    if (weeklyMount) {
      renderWeeklyCaloriesChart(weeklyMount, nut.calories, burned, user.calorieGoal || 2063);
    }

    // 5. Weight Journey Chart
    const weightMount = document.getElementById("analyticsWeightJourneyMount");
    if (weightMount) {
      renderWeightJourneyChart(weightMount, appState.state.weightHistory, user.currentWeight, user.targetWeight, user.targetDurationMonths || 3);
    }
  }

  // --------------------------------------------------------------------------
  // 24. Reminders
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 24. Reminders & Alarms (Editable Time with AM / PM & Real-Time Ringing)
  // --------------------------------------------------------------------------
  bindReminders() {
    // Quick-Set Alarm for Next Minute to test live auto-ringing
    document.getElementById("setNextMinuteAlarmBtn")?.addEventListener("click", () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      let h = now.getHours();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      h = h ? h : 12;
      const targetHour = String(h).padStart(2, '0');
      const targetMin = String(now.getMinutes()).padStart(2, '0');
      const targetTime12 = `${targetHour}:${targetMin} ${ampm}`;

      const reminders = appState.state.reminders;
      if (reminders && reminders.length > 0) {
        const targetAlarm = reminders[0];
        targetAlarm.active = true;
        appState.updateReminderTime(targetAlarm.id, targetTime12);
        this.renderRemindersList();
        this.alarmAudio.init(); // prime audio context
        const secsRemaining = 60 - new Date().getSeconds();
        this.showToast(`⏰ "${targetAlarm.title}" set to ${targetTime12}! Ringing automatically in ~${secsRemaining}s!`);
      }
    });

    // Test Alarm Button triggers actual ringing sound and dialog immediately
    document.getElementById("testReminderNotificationBtn")?.addEventListener("click", () => {
      this.triggerAlarmRing({
        id: "test_alarm",
        title: "Hydration & Performance Check-in",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        repeat: "Athletic Routine Schedule"
      });
    });

    // Dismiss Alarm Button
    document.getElementById("alarmDismissBtn")?.addEventListener("click", () => {
      this.dismissAlarm();
    });

    // Snooze Alarm Button (5 minutes)
    document.getElementById("alarmSnoozeBtn")?.addEventListener("click", () => {
      this.snoozeAlarm(5);
    });

    // Add Custom Alarm Modal Triggers
    const modal = document.getElementById("addAlarmModal");
    document.getElementById("addNewAlarmBtn")?.addEventListener("click", () => {
      if (modal) modal.classList.add("open");
    });
    document.getElementById("closeAddAlarmModalBtn")?.addEventListener("click", () => {
      if (modal) modal.classList.remove("open");
    });

    document.getElementById("modalConfirmAddAlarmBtn")?.addEventListener("click", () => {
      const title = document.getElementById("modalAlarmTitle")?.value?.trim() || "Custom Alarm";
      const hour = document.getElementById("modalAlarmHour")?.value || "08";
      const min = document.getElementById("modalAlarmMin")?.value || "00";
      const ampm = document.getElementById("modalAlarmAmpm")?.value || "AM";
      const repeat = document.getElementById("modalAlarmRepeat")?.value || "Everyday";
      const formattedTime = `${hour}:${min} ${ampm}`;

      appState.addReminder(title, formattedTime, repeat);
      this.showToast(`Alarm "${title}" set for ${formattedTime}`);
      if (modal) modal.classList.remove("open");
      this.renderRemindersList();
    });
  }

  triggerAlarmRing(reminder) {
    this.activeRingingReminder = reminder;

    const modal = document.getElementById("alarmRingingModal");
    const titleEl = document.getElementById("alarmRingingTitleDisplay");
    const timeEl = document.getElementById("alarmRingingTimeDisplay");
    const subEl = document.getElementById("alarmRingingSubDisplay");

    if (titleEl) titleEl.textContent = reminder.title || "Routine Alarm";
    if (timeEl) timeEl.textContent = reminder.time || "Now";
    if (subEl) subEl.textContent = `Allotted schedule alert: ${reminder.repeat || "Daily routine"}`;

    if (modal) modal.style.display = "flex";

    // Play synthesized high-energy athletic chime loop
    this.alarmAudio.startRingtone();

    // Browser Notification if granted
    try {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`FitSport Alarm: ${reminder.title}`, {
          body: `Allotted time reached (${reminder.time}). Routine check-in active!`,
          icon: "/favicon.ico"
        });
      }
    } catch (e) {}

    this.showToast(`🔔 ALARM RINGING ON SET TIME: ${reminder.title} (${reminder.time})`);
  }

  dismissAlarm() {
    this.alarmAudio.stopRingtone();
    const modal = document.getElementById("alarmRingingModal");
    if (modal) modal.style.display = "none";
    this.showToast(`✓ Alarm "${this.activeRingingReminder?.title || 'Reminder'}" dismissed.`);
    this.activeRingingReminder = null;
  }

  snoozeAlarm(minutes = 5) {
    const reminder = this.activeRingingReminder;
    this.alarmAudio.stopRingtone();
    const modal = document.getElementById("alarmRingingModal");
    if (modal) modal.style.display = "none";

    this.showToast(`⏱ Alarm snoozed for ${minutes} minutes.`);

    setTimeout(() => {
      if (reminder) {
        this.triggerAlarmRing(reminder);
      }
    }, minutes * 60 * 1000);
  }

  startAlarmClockWatcher() {
    setInterval(() => {
      const now = new Date();
      let h = now.getHours();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      h = h ? h : 12;
      const hourStr = String(h).padStart(2, '0');
      const minStr = String(now.getMinutes()).padStart(2, '0');
      const secStr = String(now.getSeconds()).padStart(2, '0');
      const currentTime12 = `${hourStr}:${minStr} ${ampm}`;
      const currentTimeWithSecs = `${hourStr}:${minStr}:${secStr} ${ampm}`;
      const todayDateStr = now.toISOString().slice(0, 10);

      // Update Live Digital Clock in Reminders screen
      const liveClockEl = document.getElementById("liveAlarmClockDisplay");
      if (liveClockEl) {
        liveClockEl.textContent = currentTimeWithSecs;
      }

      const reminders = appState.state.reminders || [];
      reminders.forEach(r => {
        if (!r.active) return;

        const match = (r.time || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!match) return;
        const rHour = match[1].padStart(2, '0');
        const rMin = match[2].padStart(2, '0');
        const rAmpm = match[3].toUpperCase();
        const normalizedRTime = `${rHour}:${rMin} ${rAmpm}`;

        const triggerKey = `${todayDateStr}_${normalizedRTime}_${r.id}`;
        if (normalizedRTime === currentTime12 && !this.triggeredMinutes.has(triggerKey)) {
          this.triggeredMinutes.add(triggerKey);
          console.log(`[FitSport Alarm] 🔔 RINGING AT SET TIME: ${r.title} at ${normalizedRTime}`);
          this.triggerAlarmRing(r);
        }
      });

      // Check Telegram Scheduled Auto-Dispatch & Alert
      const tgSchedule = appState.state.telegramSchedule;
      if (tgSchedule && tgSchedule.enabled !== false) {
        const match = (tgSchedule.time12 || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (match) {
          const tgHour = match[1].padStart(2, '0');
          const tgMin = match[2].padStart(2, '0');
          const tgAmpm = match[3].toUpperCase();
          const normalizedTgTime = `${tgHour}:${tgMin} ${tgAmpm}`;
          const tgTriggerKey = `${todayDateStr}_${normalizedTgTime}_telegram`;

          if (normalizedTgTime === currentTime12 && !this.triggeredMinutes.has(tgTriggerKey)) {
            this.triggeredMinutes.add(tgTriggerKey);
            console.log(`[FitSport] ⏰ TRIGGERING AUTOMATIC TELEGRAM DISPATCH AT ${normalizedTgTime}!`);
            appState.sendTelegramHistoryNotification().then(res => {
              if (res && res.success) {
                this.showToast(`⏰ Scheduled Daily History automatically sent to Telegram (@sgifesdf_bot)!`);
              }
            });
            // Trigger the alarm ringtone & alert modal at the allotted time!
            this.triggerAlarmRing({
              id: "telegram_scheduled_alarm",
              title: "Daily History Sent to Telegram",
              time: normalizedTgTime,
              repeat: "Everyday"
            });
          }
        }
      }
    }, 1000);
  }

  renderRemindersList() {
    const container = document.getElementById("remindersListMount");
    if (!container) return;

    const parseTime12 = (timeStr) => {
      const match = (timeStr || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        return {
          hour: match[1].padStart(2, '0'),
          minute: match[2].padStart(2, '0'),
          ampm: match[3].toUpperCase()
        };
      }
      return { hour: "08", minute: "00", ampm: "AM" };
    };

    const hoursList = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    // All 60 minutes so any exact minute can be set!
    const minsList = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

    container.innerHTML = appState.state.reminders.map(r => {
      const parsed = parseTime12(r.time);

      return `
        <div class="reminder-card" data-id="${r.id}" style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; background: var(--bg-surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px 22px;">
          <div class="reminder-left" style="display: flex; align-items: center; gap: 14px; min-width: 220px; flex: 1;">
            <div class="reminder-icon-box" style="width: 44px; height: 44px; background: #141b14; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="22" height="22" stroke="var(--green-primary)"><use href="#icon-${r.icon || 'bell'}"></use></svg>
            </div>
            <div>
              <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${r.title}</div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);" id="reminderSub_${r.id}">
                <span class="active-time-badge font-bold" style="color: var(--green-primary);">${r.time}</span> • Repeat: ${r.repeat}
              </div>
            </div>
          </div>

          <!-- Interactive Editable Alarm Time with AM/PM -->
          <div class="alarm-edit-controls" style="display: flex; align-items: center; gap: 8px; background: var(--bg-surface); padding: 8px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <div style="font-size: 0.72rem; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; margin-right: 4px;">Alarm Time:</div>
            
            <!-- Hour Selector -->
            <select class="form-input alarm-hour-select" data-id="${r.id}" style="padding: 4px 6px; font-weight: 800; font-size: 0.95rem; color: var(--green-primary); background: #060606; border: 1px solid var(--border-subtle); border-radius: 6px; cursor: pointer; text-align: center; width: 56px;">
              ${hoursList.map(h => `<option value="${h}" ${h === parsed.hour ? 'selected' : ''}>${h}</option>`).join('')}
            </select>

            <span style="font-size: 1.1rem; font-weight: 900; color: var(--text-secondary);">:</span>

            <!-- Minute Selector -->
            <select class="form-input alarm-minute-select" data-id="${r.id}" style="padding: 4px 6px; font-weight: 800; font-size: 0.95rem; color: var(--green-primary); background: #060606; border: 1px solid var(--border-subtle); border-radius: 6px; cursor: pointer; text-align: center; width: 56px;">
              ${minsList.map(m => `<option value="${m}" ${m === parsed.minute ? 'selected' : ''}>${m}</option>`).join('')}
            </select>

            <!-- AM / PM Selector Pills -->
            <div class="alarm-ampm-pills" style="display: flex; gap: 4px; margin-left: 6px;">
              <button type="button" class="btn btn-sm alarm-ampm-btn ${parsed.ampm === 'AM' ? 'btn-primary' : 'btn-secondary'}" data-id="${r.id}" data-ampm="AM" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 800; line-height: 1;">
                AM
              </button>
              <button type="button" class="btn btn-sm alarm-ampm-btn ${parsed.ampm === 'PM' ? 'btn-primary' : 'btn-secondary'}" data-id="${r.id}" data-ampm="PM" style="padding: 4px 10px; font-size: 0.78rem; font-weight: 800; line-height: 1;">
                PM
              </button>
            </div>
          </div>

          <!-- Active Toggle -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <label class="switch">
              <input type="checkbox" ${r.active ? 'checked' : ''} data-id="${r.id}" class="reminder-toggle-input">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      `;
    }).join('');

    // Bind Hour and Minute change listeners
    const handleTimeChange = (id) => {
      const card = container.querySelector(`.reminder-card[data-id="${id}"]`);
      if (!card) return;

      const hourSelect = card.querySelector(".alarm-hour-select");
      const minSelect = card.querySelector(".alarm-minute-select");
      const activeAmpmBtn = card.querySelector(".alarm-ampm-btn.btn-primary");

      const hour = hourSelect ? hourSelect.value : "08";
      const min = minSelect ? minSelect.value : "00";
      const ampm = activeAmpmBtn ? activeAmpmBtn.getAttribute("data-ampm") : "AM";
      const newTime = `${hour}:${min} ${ampm}`;

      appState.updateReminderTime(id, newTime);

      const reminder = appState.state.reminders.find(r => r.id === id);
      const subEl = document.getElementById(`reminderSub_${id}`);
      if (subEl && reminder) {
        subEl.innerHTML = `<span class="active-time-badge font-bold" style="color: var(--green-primary);">${newTime}</span> • Repeat: ${reminder.repeat}`;
      }

      this.showToast(`🔔 ${reminder?.title || 'Alarm'} time updated to ${newTime}`);
    };

    container.querySelectorAll(".alarm-hour-select, .alarm-minute-select").forEach(sel => {
      sel.addEventListener("change", () => {
        const id = sel.getAttribute("data-id");
        handleTimeChange(id);
      });
    });

    // Bind AM / PM button clicks
    container.querySelectorAll(".alarm-ampm-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const targetAmpm = btn.getAttribute("data-ampm");
        const parentPills = btn.closest(".alarm-ampm-pills");
        if (parentPills) {
          parentPills.querySelectorAll(".alarm-ampm-btn").forEach(b => {
            if (b.getAttribute("data-ampm") === targetAmpm) {
              b.classList.add("btn-primary");
              b.classList.remove("btn-secondary");
            } else {
              b.classList.remove("btn-primary");
              b.classList.add("btn-secondary");
            }
          });
        }
        handleTimeChange(id);
      });
    });

    // Toggle switch listeners
    container.querySelectorAll(".reminder-toggle-input").forEach(input => {
      input.addEventListener("change", () => {
        const id = input.getAttribute("data-id");
        appState.toggleReminder(id);
        const reminder = appState.state.reminders.find(r => r.id === id);
        this.showToast(input.checked ? `Alarm enabled: ${reminder?.title || ''}` : `Alarm paused: ${reminder?.title || ''}`);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 25. Daily Summary & Telegram Sharing
  // --------------------------------------------------------------------------
  bindDailySummaryAndTelegram() {
    document.getElementById("shareTelegramBtn")?.addEventListener("click", async () => {
      const text = appState.generateDailySummaryTelegramText();
      this.showToast("⏳ Sending Daily Summary to Telegram (@sgifesdf_bot)...");
      const res = await appState.sendTelegramHistoryNotification(text);
      if (res && res.success) {
        this.showToast("✅ Daily Summary dispatched to Telegram (@sgifesdf_bot)! Check your chat.");
      } else {
        const encoded = encodeURIComponent(text);
        const url = `https://t.me/share/url?url=&text=${encoded}`;
        window.open(url, "_blank");
        this.showToast("Opening Telegram with Daily Summary...");
      }
    });

    document.getElementById("copySummaryBtn")?.addEventListener("click", () => {
      const text = appState.generateDailySummaryTelegramText();
      navigator.clipboard.writeText(text).then(() => {
        this.showToast("Daily Summary copied to clipboard!");
      }).catch(() => {
        this.showToast("Summary copied!");
      });
    });
  }

  updateDailySummaryCard() {
    const nut = appState.getNutritionTotals();
    const waterL = (appState.getWaterTotal() / 1000).toFixed(2);
    const progress = appState.getWeightProgressPercent();

    const elCals = document.getElementById("sumValCalories");
    if (elCals) elCals.textContent = `${nut.calories} kcal`;

    const elProtein = document.getElementById("sumValProtein");
    if (elProtein) elProtein.textContent = `${nut.protein} g`;

    const elWater = document.getElementById("sumValWater");
    if (elWater) elWater.textContent = `${waterL} L`;

    const elProgress = document.getElementById("sumValProgress");
    if (elProgress) elProgress.textContent = `${progress}%`;
  }

  // --------------------------------------------------------------------------
  // Automated Telegram Daily History Schedule (Customizable Delivery Time)
  // --------------------------------------------------------------------------
  bindTelegramSchedule() {
    const parseTime12 = (time12) => {
      const match = (time12 || "08:45 PM").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (match) {
        return {
          hour: match[1].padStart(2, '0'),
          minute: match[2].padStart(2, '0'),
          ampm: match[3].toUpperCase()
        };
      }
      return { hour: "08", minute: "45", ampm: "PM" };
    };

    const updateScheduleUI = (schedule) => {
      if (!schedule) schedule = appState.state.telegramSchedule || { enabled: true, time12: "08:45 PM", time: "20:45" };
      const parsed = parseTime12(schedule.time12 || "08:45 PM");

      const toggle = document.getElementById("telegramScheduleToggle");
      if (toggle) toggle.checked = schedule.enabled !== false;

      const hourSel = document.getElementById("telegramScheduleHour");
      if (hourSel) hourSel.value = parsed.hour;

      const minSel = document.getElementById("telegramScheduleMinute");
      if (minSel) {
        if (minSel.options.length < 60) {
          const currentVal = minSel.value;
          minSel.innerHTML = Array.from({ length: 60 }, (_, i) => {
            const v = String(i).padStart(2, '0');
            return `<option value="${v}">${v}</option>`;
          }).join('');
          minSel.value = currentVal || parsed.minute;
        }
        minSel.value = parsed.minute;
      }

      const disp = document.getElementById("telegramScheduleDisplay");
      if (disp) {
        disp.textContent = schedule.enabled !== false 
          ? `Everyday at ${schedule.time12 || '08:45 PM'}` 
          : `Paused (Auto-dispatch disabled)`;
      }

      const badge = document.getElementById("telegramScheduleStatusBadge");
      if (badge) {
        badge.textContent = schedule.enabled !== false ? `@sgifesdf_bot Active` : `Paused`;
      }

      const histBadge = document.getElementById("historyTelegramScheduleBadge");
      if (histBadge) {
        histBadge.textContent = `⏰ Auto-Send: ${schedule.time12 || '08:45 PM'} (${schedule.enabled !== false ? 'Active' : 'Off'})`;
      }

      const activeId = appState.state.telegramChatId || "7032355691";
      const chatIdDisp = document.getElementById("telegramChatIdDisplay");
      if (chatIdDisp) {
        const label = activeId === "7032355691" ? "Sahul (7032355691)" : (activeId === "5490113240" ? "maddy_06 (5490113240)" : activeId);
        chatIdDisp.textContent = `${label} (@sgifesdf_bot)`;
      }

      const chatInput = document.getElementById("telegramChatIdInput");
      if (chatInput && document.activeElement !== chatInput) {
        chatInput.value = activeId;
      }

      document.querySelectorAll(".telegram-chat-preset-btn").forEach(btn => {
        const cid = btn.getAttribute("data-chatid");
        if (cid === activeId) {
          btn.classList.add("btn-primary");
          btn.classList.remove("btn-secondary");
          btn.style.background = "#24A1DE";
          btn.style.borderColor = "#24A1DE";
        } else {
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-secondary");
          btn.style.background = "";
          btn.style.borderColor = "";
        }
      });

      // Update AM/PM pill styles
      document.querySelectorAll(".telegram-ampm-btn").forEach(btn => {
        if (btn.getAttribute("data-ampm") === parsed.ampm) {
          btn.classList.add("btn-primary");
          btn.classList.remove("btn-secondary");
          btn.style.background = "#24A1DE";
          btn.style.borderColor = "#24A1DE";
        } else {
          btn.classList.remove("btn-primary");
          btn.classList.add("btn-secondary");
          btn.style.background = "";
          btn.style.borderColor = "";
        }
      });
    };

    this.updateTelegramScheduleUI = updateScheduleUI;

    // Initial sync
    setTimeout(() => {
      updateScheduleUI();
    }, 300);

    // Click on history badge navigates to Settings
    document.getElementById("historyTelegramScheduleBadge")?.addEventListener("click", () => {
      this.navigateTo("settings");
      this.showToast("Customize your automated Telegram history delivery time here.");
    });

    // Save Schedule function
    const saveCurrentSchedule = async () => {
      const toggle = document.getElementById("telegramScheduleToggle");
      const hourSel = document.getElementById("telegramScheduleHour");
      const minSel = document.getElementById("telegramScheduleMinute");
      const activeAmpmBtn = document.querySelector(".telegram-ampm-btn.btn-primary");

      const enabled = toggle ? toggle.checked : true;
      const hour = hourSel ? hourSel.value : "08";
      const min = minSel ? minSel.value : "45";
      const ampm = activeAmpmBtn ? activeAmpmBtn.getAttribute("data-ampm") : "PM";
      const time12 = `${hour}:${min} ${ampm}`;

      // Convert to 24h
      let h24 = parseInt(hour, 10);
      if (ampm === "PM" && h24 < 12) h24 += 12;
      if (ampm === "AM" && h24 === 12) h24 = 0;
      const time24 = `${String(h24).padStart(2, '0')}:${min}`;

      // Reset today's trigger keys for telegram alarm so newly scheduled time can ring
      if (this.triggeredMinutes) {
        const keysToDelete = [];
        this.triggeredMinutes.forEach(key => {
          if (key.includes('telegram')) keysToDelete.push(key);
        });
        keysToDelete.forEach(k => this.triggeredMinutes.delete(k));
      }

      const res = await appState.saveTelegramSchedule({
        enabled,
        time: time24,
        time12: time12,
        chatId: appState.state.telegramChatId || "7032355691"
      });

      updateScheduleUI(res?.schedule || appState.state.telegramSchedule);
      this.showToast(enabled ? `⏰ Telegram auto-history scheduled for ${time12}` : `⏸ Telegram auto-history paused.`);
    };

    document.getElementById("saveTelegramScheduleBtn")?.addEventListener("click", saveCurrentSchedule);
    document.getElementById("telegramScheduleToggle")?.addEventListener("change", saveCurrentSchedule);

    document.querySelectorAll(".telegram-chat-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const cid = btn.getAttribute("data-chatid");
        if (cid) {
          appState.state.telegramChatId = cid;
          appState.saveState();
          saveCurrentSchedule();
          this.showToast(`Active Telegram target set to ${cid === "7032355691" ? "Sahul (7032355691)" : cid}`);
        }
      });
    });

    document.getElementById("saveTelegramChatIdBtn")?.addEventListener("click", () => {
      const val = document.getElementById("telegramChatIdInput")?.value.trim();
      if (val) {
        appState.state.telegramChatId = val;
        appState.saveState();
        saveCurrentSchedule();
        this.showToast(`Active Telegram chat ID updated to ${val}`);
      }
    });

    document.querySelectorAll(".telegram-ampm-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".telegram-ampm-btn").forEach(b => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-secondary");
          b.style.background = "";
          b.style.borderColor = "";
        });
        btn.classList.add("btn-primary");
        btn.classList.remove("btn-secondary");
        btn.style.background = "#24A1DE";
        btn.style.borderColor = "#24A1DE";
        saveCurrentSchedule();
      });
    });

    document.getElementById("telegramScheduleHour")?.addEventListener("change", saveCurrentSchedule);
    document.getElementById("telegramScheduleMinute")?.addEventListener("change", saveCurrentSchedule);
  }

  // --------------------------------------------------------------------------
  // 26. Profile & 27. Settings
  // --------------------------------------------------------------------------
  openEditProfileModal() {
    const user = appState.state.user || {};
    const modal = document.getElementById("editProfileModal");
    if (!modal) return;

    const nameInput = document.getElementById("editProfName");
    if (nameInput) nameInput.value = user.name || "Sahul Hameed";

    const phoneInput = document.getElementById("editProfPhone");
    if (phoneInput) phoneInput.value = user.phone || "+91 99999 88888";

    const genderSelect = document.getElementById("editProfGender");
    if (genderSelect) genderSelect.value = user.gender || "Male";

    const ageInput = document.getElementById("editProfAge");
    if (ageInput) ageInput.value = user.age || 24;

    const heightInput = document.getElementById("editProfHeight");
    if (heightInput) heightInput.value = user.height || 178;

    const weightInput = document.getElementById("editProfCurrentWeight");
    if (weightInput) weightInput.value = user.currentWeight || 69.5;

    const targetWeightInput = document.getElementById("editProfTargetWeight");
    if (targetWeightInput) targetWeightInput.value = user.targetWeight || 65.0;

    const goalSelect = document.getElementById("editProfGoal");
    if (goalSelect) {
      const matchOpt = Array.from(goalSelect.options).find(opt => opt.value === user.fitnessGoal);
      if (matchOpt) {
        goalSelect.value = user.fitnessGoal;
      } else {
        goalSelect.value = "Improve Sports Performance";
      }
    }

    modal.classList.add("open");
  }

  closeEditProfileModal() {
    const modal = document.getElementById("editProfileModal");
    if (modal) modal.classList.remove("open");
  }

  renderProfileScreen() {
    this.renderAllDynamicComponents();
  }

  bindProfileAndSettings() {
    // Edit Profile Modal triggers
    document.getElementById("profileEditBtn")?.addEventListener("click", () => {
      this.openEditProfileModal();
    });

    document.getElementById("manageAccountBtn")?.addEventListener("click", () => {
      this.openEditProfileModal();
    });

    document.getElementById("closeEditProfileModalBtn")?.addEventListener("click", () => {
      this.closeEditProfileModal();
    });

    document.getElementById("editProfileModal")?.addEventListener("click", (e) => {
      if (e.target.id === "editProfileModal") {
        this.closeEditProfileModal();
      }
    });

    document.getElementById("editProfLaunchOnboardingBtn")?.addEventListener("click", () => {
      this.closeEditProfileModal();
      this.currentOnboardingStep = 1;
      if (typeof this.updateOnboardingStepUI === "function") {
        this.updateOnboardingStepUI();
      }
      this.populateOnboardingForm();
      this.navigateTo("onboarding");
    });

    document.getElementById("saveEditProfileModalBtn")?.addEventListener("click", async () => {
      const name = (document.getElementById("editProfName")?.value || "").trim() || appState.state.user.name || "Sahul Hameed";
      const phone = (document.getElementById("editProfPhone")?.value || "").trim() || appState.state.user.phone || "+91 99999 88888";
      const gender = document.getElementById("editProfGender")?.value || appState.state.user.gender || "Male";
      const age = parseInt(document.getElementById("editProfAge")?.value, 10) || appState.state.user.age || 24;
      const height = parseFloat(document.getElementById("editProfHeight")?.value) || 178;
      const currentWeight = parseFloat(document.getElementById("editProfCurrentWeight")?.value) || 69.5;
      const targetWeight = parseFloat(document.getElementById("editProfTargetWeight")?.value) || 65.0;
      const fitnessGoal = document.getElementById("editProfGoal")?.value || "Improve Sports Performance";

      await appState.updateUserProfile({
        name,
        phone,
        gender,
        age,
        height,
        currentWeight,
        targetWeight,
        fitnessGoal
      });

      this.closeEditProfileModal();
      this.renderAllDynamicComponents();
      this.showToast(`Profile updated successfully for ${name}!`);
    });

    document.getElementById("profileUpdateGoalBtn")?.addEventListener("click", () => {
      this.openEditProfileModal();
      document.getElementById("editProfGoal")?.focus();
    });

    document.getElementById("testTelegramNotificationBtn")?.addEventListener("click", async () => {
      const btn = document.getElementById("testTelegramNotificationBtn");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending...";
      }
      this.showToast("⏳ Sending test history to Telegram (@sgifesdf_bot)...");
      const targetId = appState.state.telegramChatId || "7032355691";
      const result = await appState.testTelegramSchedule(targetId);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Send Test to Telegram";
      }
      if (result && result.success) {
        this.showToast(`✅ Activity History Delivered to Telegram via @sgifesdf_bot! Check your Telegram.`);
      } else {
        this.showToast(`✈️ Opening @sgifesdf_bot in Telegram. Click START to link!`);
        window.open("https://t.me/sgifesdf_bot", "_blank");
      }
    });

    document.getElementById("resetAllTodayBtn")?.addEventListener("click", () => {
      appState.resetDailyTrackers();
      this.showToast("All daily activity (Meals, Water, Workouts, Sports) reset to 0.");
      this.renderMealTracker();
      this.renderWaterScreen();
      this.renderAllDynamicComponents();
    });

    document.getElementById("resetDataBtn")?.addEventListener("click", () => {
      appState.resetAll();
      this.showToast("All data factory reset.");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });

    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      this.navigateTo("logout");
    });

    // AI Coach Settings Synchronization & Persistence
    const populateAiSettingsForm = async () => {
      try {
        const res = await fetch("/api/ai/settings");
        if (res.ok) {
          const s = await res.json();
          const masterToggle = document.getElementById("aiSettingMasterToggle");
          const voiceToggle = document.getElementById("aiSettingVoiceToggle");
          const workoutToggle = document.getElementById("aiSettingWorkoutToggle");
          const sportToggle = document.getElementById("aiSettingSportToggle");
          const bCheck = document.getElementById("aiCheckInBreakfastToggle");
          const bTime = document.getElementById("aiCheckInBreakfastTime");
          const lCheck = document.getElementById("aiCheckInLunchToggle");
          const lTime = document.getElementById("aiCheckInLunchTime");
          const sCheck = document.getElementById("aiCheckInSnackToggle");
          const sTime = document.getElementById("aiCheckInSnackTime");
          const dCheck = document.getElementById("aiCheckInDinnerToggle");
          const dTime = document.getElementById("aiCheckInDinnerTime");
          const rCheck = document.getElementById("aiCheckInDailyReviewToggle");

          if (masterToggle) masterToggle.checked = s.enabled !== false;
          if (voiceToggle) voiceToggle.checked = s.voiceEnabled !== false;
          if (workoutToggle) workoutToggle.checked = s.postWorkoutCheckIn !== false;
          if (sportToggle) sportToggle.checked = s.preSportCheckIn !== false;

          if (s.mealCheckIns) {
            if (bCheck) bCheck.checked = !!s.mealCheckIns.breakfast?.enabled;
            if (bTime) bTime.value = s.mealCheckIns.breakfast?.time || "08:30";
            if (lCheck) lCheck.checked = !!s.mealCheckIns.lunch?.enabled;
            if (lTime) lTime.value = s.mealCheckIns.lunch?.time || "13:00";
            if (sCheck) sCheck.checked = !!s.mealCheckIns.snack?.enabled;
            if (sTime) sTime.value = s.mealCheckIns.snack?.time || "17:00";
            if (dCheck) dCheck.checked = !!s.mealCheckIns.dinner?.enabled;
            if (dTime) dTime.value = s.mealCheckIns.dinner?.time || "20:30";
          }
          if (rCheck) rCheck.checked = s.dailyReview?.enabled !== false;
        }
      } catch (err) {
        console.warn("Failed to load AI settings:", err);
      }
    };
    populateAiSettingsForm();

    document.getElementById("saveAiCoachSettingsBtn")?.addEventListener("click", async () => {
      const payload = {
        enabled: document.getElementById("aiSettingMasterToggle")?.checked ?? true,
        voiceEnabled: document.getElementById("aiSettingVoiceToggle")?.checked ?? true,
        postWorkoutCheckIn: document.getElementById("aiSettingWorkoutToggle")?.checked ?? true,
        preSportCheckIn: document.getElementById("aiSettingSportToggle")?.checked ?? true,
        mealCheckIns: {
          breakfast: {
            enabled: document.getElementById("aiCheckInBreakfastToggle")?.checked ?? true,
            time: document.getElementById("aiCheckInBreakfastTime")?.value || "08:30"
          },
          lunch: {
            enabled: document.getElementById("aiCheckInLunchToggle")?.checked ?? true,
            time: document.getElementById("aiCheckInLunchTime")?.value || "13:00"
          },
          snack: {
            enabled: document.getElementById("aiCheckInSnackToggle")?.checked ?? true,
            time: document.getElementById("aiCheckInSnackTime")?.value || "17:00"
          },
          dinner: {
            enabled: document.getElementById("aiCheckInDinnerToggle")?.checked ?? true,
            time: document.getElementById("aiCheckInDinnerTime")?.value || "20:30"
          }
        },
        dailyReview: {
          enabled: document.getElementById("aiCheckInDailyReviewToggle")?.checked ?? true,
          time: "21:00"
        }
      };

      try {
        const res = await fetch("/api/ai/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          if (typeof aiCoach !== "undefined") aiCoach.settings = payload;
          this.showToast("✅ AI Voice Coach settings saved successfully!");
        } else {
          this.showToast("Failed to save AI Coach settings");
        }
      } catch (e) {
        this.showToast("Error updating AI Coach settings");
      }
    });
  }

  // --------------------------------------------------------------------------
  // Daily Auto-Reset Controller & Clock Scheduler
  // --------------------------------------------------------------------------
  openAutoResetModal() {
    const modal = document.getElementById("autoResetModal");
    if (!modal) return;
    const schedule = appState.getAutoResetSchedule();

    const enabledToggle = document.getElementById("autoResetEnabledToggle");
    if (enabledToggle) enabledToggle.checked = !!schedule.enabled;

    const timeInput = document.getElementById("autoResetTimeInput");
    if (timeInput) timeInput.value = schedule.time || "00:00";

    const label = document.getElementById("autoResetTimeDisplayLabel");
    if (label) label.textContent = schedule.time12 || "12:00 AM";

    const subtext = document.getElementById("autoResetStatusSubtext");
    if (subtext) {
      subtext.textContent = schedule.enabled 
        ? `Active: resets everyday at ${schedule.time12 || schedule.time}` 
        : `Auto-reset is currently disabled`;
    }

    const nextDue = document.getElementById("autoResetNextDue");
    if (nextDue) {
      nextDue.textContent = schedule.enabled ? `Everyday at ${schedule.time12 || schedule.time}` : "Disabled";
    }

    modal.style.display = "flex";
  }

  closeAutoResetModal() {
    const modal = document.getElementById("autoResetModal");
    if (modal) modal.style.display = "none";
  }

  updateAutoResetModalLabel(timeStr) {
    if (!timeStr) return;
    const parts = timeStr.split(":");
    let hh = parseInt(parts[0], 10) || 0;
    const mm = parts[1] || "00";
    const ampm = hh >= 12 ? "PM" : "AM";
    const hh12 = hh % 12 === 0 ? 12 : hh % 12;
    const time12 = `${String(hh12).padStart(2, '0')}:${mm} ${ampm}`;

    const label = document.getElementById("autoResetTimeDisplayLabel");
    if (label) label.textContent = time12;

    const subtext = document.getElementById("autoResetStatusSubtext");
    const enabled = document.getElementById("autoResetEnabledToggle")?.checked;
    if (subtext && enabled) {
      subtext.textContent = `Active: resets everyday at ${time12}`;
    }
  }

  updateHeaderAutoResetBadge() {
    const badge = document.getElementById("headerAutoResetBadge");
    if (!badge) return;
    const sched = appState.getAutoResetSchedule();
    if (sched && sched.enabled) {
      badge.textContent = `Reset: ${sched.time12 || sched.time}`;
      badge.style.color = "var(--green-primary)";
    } else {
      badge.textContent = "Reset: OFF";
      badge.style.color = "var(--text-secondary)";
    }
  }

  bindAutoResetModal() {
    // Open from header button
    document.getElementById("headerAutoResetBtn")?.addEventListener("click", () => {
      this.openAutoResetModal();
    });

    // Close button
    document.getElementById("closeAutoResetModalBtn")?.addEventListener("click", () => {
      this.closeAutoResetModal();
    });

    // Click outside to close
    document.getElementById("autoResetModal")?.addEventListener("click", (e) => {
      if (e.target.id === "autoResetModal") {
        this.closeAutoResetModal();
      }
    });

    // Presets
    document.querySelectorAll(".auto-reset-preset").forEach(btn => {
      btn.addEventListener("click", () => {
        const timeVal = btn.getAttribute("data-time");
        const input = document.getElementById("autoResetTimeInput");
        if (input && timeVal) {
          input.value = timeVal;
          this.updateAutoResetModalLabel(timeVal);
        }
      });
    });

    // Time input change
    const timeInput = document.getElementById("autoResetTimeInput");
    timeInput?.addEventListener("input", (e) => {
      this.updateAutoResetModalLabel(e.target.value);
    });

    // Toggle switch change
    document.getElementById("autoResetEnabledToggle")?.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      const subtext = document.getElementById("autoResetStatusSubtext");
      const sched = appState.getAutoResetSchedule();
      if (subtext) {
        subtext.textContent = isChecked 
          ? `Active: resets everyday at ${sched.time12 || sched.time}` 
          : `Auto-reset is currently disabled`;
      }
    });

    // Save button
    document.getElementById("saveAutoResetScheduleBtn")?.addEventListener("click", () => {
      const enabled = document.getElementById("autoResetEnabledToggle")?.checked;
      const time = document.getElementById("autoResetTimeInput")?.value || "00:00";
      const updated = appState.updateAutoResetSchedule({ enabled, time });

      this.closeAutoResetModal();
      this.updateHeaderAutoResetBadge();
      this.showToast(updated.enabled 
        ? `✅ Auto-Reset Active: Data resets automatically everyday at ${updated.time12}!` 
        : `⚠️ Daily Auto-Reset disabled.`);
    });

    // Instant reset button
    document.getElementById("instantResetAllTodayBtn")?.addEventListener("click", () => {
      appState.resetDailyTrackers();
      this.closeAutoResetModal();
      this.renderMealTracker();
      this.renderWaterScreen();
      this.renderAllDynamicComponents();
      this.showToast("🔄 All today's activity (Workouts, Nutrition & Water) reset to 0.");
    });
  }

  startAutoResetWatcher() {
    // Check every 15 seconds against scheduled time
    setInterval(() => {
      const schedule = appState.getAutoResetSchedule();
      if (!schedule || !schedule.enabled || !schedule.time) return;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hours}:${mins}`;
      const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      if (currentTimeStr === schedule.time && schedule.lastResetDate !== todayDateStr) {
        console.log(`[AutoReset] Scheduled auto-reset executing at ${currentTimeStr} (${schedule.time12})...`);
        appState.updateAutoResetSchedule({
          enabled: schedule.enabled,
          time: schedule.time,
          lastResetDate: todayDateStr
        });
        appState.resetDailyTrackers();
        this.renderMealTracker();
        this.renderWaterScreen();
        this.renderAllDynamicComponents();
        this.showToast(`⏰ Daily auto-reset triggered at ${schedule.time12 || schedule.time}! Workouts, nutrition & water reset to 0.`);
      }
    }, 15000);
  }

  // --------------------------------------------------------------------------
  // Master Dynamic Sync
  // --------------------------------------------------------------------------
  renderAllDynamicComponents() {
    const user = appState.state.user;
    const nut = appState.getNutritionTotals();
    const waterTotalMl = appState.getWaterTotal();
    const burned = appState.getCaloriesBurnedToday();

    // 1. Dynamic Dashboard Greeting
    const hour = new Date().getHours();
    let timeGreeting = "Good Morning";
    if (hour >= 12 && hour < 17) {
      timeGreeting = "Good Afternoon";
    } else if (hour >= 17 || hour < 4) {
      timeGreeting = "Good Evening";
    }
    const dashGreetingTime = document.getElementById("dashGreetingTime");
    if (dashGreetingTime) {
      dashGreetingTime.textContent = timeGreeting;
    }
    const dashGreetingName = document.getElementById("dashGreetingName");
    if (dashGreetingName) {
      dashGreetingName.textContent = user.name || "Sahul Hameed";
    }
    const dashGreetingHeader = document.getElementById("dashGreetingHeader");
    if (dashGreetingHeader && (!dashGreetingName || !dashGreetingTime)) {
      dashGreetingHeader.innerHTML = `<span id="dashGreetingTime">${timeGreeting}</span>, <span id="dashGreetingName">${user.name || "Sahul Hameed"}</span>`;
    }

    // 2. Sidebar Mini Card
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    if (sidebarAvatar) sidebarAvatar.textContent = user.avatar || "SH";
    const sidebarName = document.getElementById("sidebarUserName");
    if (sidebarName) sidebarName.textContent = user.name || "Sahul Hameed";

    // 3. Profile Screen Info
    const profAvatar = document.getElementById("profileAvatarLarge");
    if (profAvatar) profAvatar.textContent = user.avatar || "SH";

    const profName = document.getElementById("profileNameDisplay");
    if (profName) profName.textContent = user.name || "Sahul Hameed";

    const profPhone = document.getElementById("profilePhoneDisplay");
    if (profPhone) profPhone.textContent = user.phone || "+91 99999 88888";

    const profGoalBadge = document.getElementById("profileGoalBadge");
    if (profGoalBadge) profGoalBadge.textContent = user.fitnessGoal || "Improve Sports Performance";

    const profGender = document.getElementById("profGender");
    if (profGender) profGender.textContent = user.gender || "Male";

    const profAge = document.getElementById("profAge");
    if (profAge) profAge.textContent = `${user.age || 24} yrs`;

    const profHeight = document.getElementById("profHeight");
    if (profHeight) profHeight.textContent = `${user.height || 178} cm`;

    const profCurrentW = document.getElementById("profCurrentW");
    if (profCurrentW) profCurrentW.textContent = `${user.currentWeight || 69.5} kg`;

    const profTargetW = document.getElementById("profTargetW");
    if (profTargetW) profTargetW.textContent = `${user.targetWeight || 65.0} kg`;

    const profGoalText = document.getElementById("profGoalText");
    if (profGoalText) profGoalText.textContent = user.fitnessGoal || "Improve Sports Performance";

    const profSportsPills = document.getElementById("profSportsPills");
    if (profSportsPills && Array.isArray(user.interestedSports)) {
      profSportsPills.innerHTML = user.interestedSports
        .map(sport => `<span class="badge-tag">${sport}</span>`)
        .join(" ");
    }

    const settingsPhone = document.getElementById("settingsAccountPhoneDisplay");
    if (settingsPhone) settingsPhone.textContent = `${user.name || "Sahul Hameed"} (${user.phone || "+91 99999 88888"})`;

    const summaryDate = document.getElementById("summaryDateLabel");
    if (summaryDate) {
      const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      summaryDate.textContent = `${dateStr} • Athlete: ${user.name || "Sahul Hameed"}`;
    }

    const dCals = document.getElementById("dashValCaloriesConsumed");
    if (dCals) dCals.textContent = nut.calories.toLocaleString();

    const dCalGoal = document.getElementById("dashCalorieGoalText");
    if (dCalGoal) dCalGoal.textContent = `of ${user.calorieGoal.toLocaleString()} kcal goal (1kg = 7,700 kcal)`;

    const dBurned = document.getElementById("dashValCaloriesBurned");
    if (dBurned) dBurned.textContent = burned.toLocaleString();

    const dBurnedSub = document.getElementById("dashBurnedSubtext");
    if (dBurnedSub) dBurnedSub.textContent = burned > 0 ? `${burned.toLocaleString()} kcal burned today` : `0 kcal (Starts after workout)`;

    // Live Net Calories on Dashboard
    const netCalories = Math.max(0, nut.calories - burned);
    const dNet = document.getElementById("dashValNetCalories");
    if (dNet) dNet.textContent = netCalories.toLocaleString();

    const dNetSub = document.getElementById("dashNetCaloriesSubtext");
    if (dNetSub) dNetSub.textContent = `${nut.calories.toLocaleString()} in − ${burned.toLocaleString()} burn`;

    const dTargetCals = document.getElementById("dashValTargetCalories");
    if (dTargetCals) dTargetCals.textContent = user.calorieGoal.toLocaleString();

    // Hero cards workout & sports pills
    const workoutsTodayCount = appState.state.history.filter(h => h.date === "Today" && h.type === "workouts").length;
    const elWkPill = document.getElementById("dashHeroWorkoutPill");
    if (elWkPill) elWkPill.textContent = `🏋️ ${workoutsTodayCount} Workout${workoutsTodayCount === 1 ? '' : 's'} completed`;

    let sportsCalsToday = 0;
    appState.state.history.forEach(h => {
      if (h.date === "Today" && h.type === "sports") {
        const m = h.metric.match(/(\d+)\s*kcal/);
        if (m) sportsCalsToday += parseInt(m[1], 10);
      }
    });
    const elSpPill = document.getElementById("dashHeroSportsPill");
    if (elSpPill) elSpPill.textContent = `⚡ ${sportsCalsToday} kcal burned`;

    const setWeightDisplay = user.targetWeight || user.currentWeight || 65;
    const nutWeightSpan = document.getElementById("nutSetWeightSpan");
    if (nutWeightSpan) nutWeightSpan.textContent = `${setWeightDisplay} kg`;

    const nutWeightPill = document.getElementById("nutSetWeightPill");
    if (nutWeightPill) nutWeightPill.textContent = `SET WEIGHT: ${setWeightDisplay} KG`;

    const dProtein = document.getElementById("dashValProtein");
    if (dProtein) dProtein.textContent = `${nut.protein}g`;

    const dProteinGoal = document.getElementById("dashProteinGoalText");
    if (dProteinGoal) dProteinGoal.textContent = `of ${user.proteinGoal}g target (${setWeightDisplay}kg set)`;

    const dWater = document.getElementById("dashValWater");
    if (dWater) dWater.textContent = `${(waterTotalMl / 1000).toFixed(2)}L`;

    const dashWaterSub = document.getElementById("dashWaterSubtext");
    if (dashWaterSub) {
      dashWaterSub.textContent = `of ${(user.waterGoal / 1000).toFixed(1)}L goal (3 - 4L)`;
    }

    const nutCalsLabel = document.getElementById("nutCaloriesLabel");
    if (nutCalsLabel) nutCalsLabel.textContent = `${nut.calories.toLocaleString()} / ${user.calorieGoal.toLocaleString()} kcal`;
    const nutCalsBar = document.getElementById("nutCaloriesBar");
    if (nutCalsBar) nutCalsBar.style.width = `${Math.min(100, Math.round((nut.calories / user.calorieGoal) * 100))}%`;

    const nutProteinLabel = document.getElementById("nutProteinLabel");
    if (nutProteinLabel) nutProteinLabel.textContent = `${nut.protein} / ${user.proteinGoal} g`;
    const nutProteinBar = document.getElementById("nutProteinBar");
    if (nutProteinBar) nutProteinBar.style.width = `${Math.min(100, Math.round((nut.protein / user.proteinGoal) * 100))}%`;

    const nutCarbsLabel = document.getElementById("nutCarbsLabel");
    if (nutCarbsLabel) nutCarbsLabel.textContent = `${nut.carbs} / ${user.carbsGoal} g`;
    const nutCarbsBar = document.getElementById("nutCarbsBar");
    if (nutCarbsBar) nutCarbsBar.style.width = `${Math.min(100, Math.round((nut.carbs / user.carbsGoal) * 100))}%`;

    const nutFatLabel = document.getElementById("nutFatLabel");
    if (nutFatLabel) nutFatLabel.textContent = `${nut.fat} / ${user.fatGoal} g`;
    const nutFatBar = document.getElementById("nutFatBar");
    if (nutFatBar) nutFatBar.style.width = `${Math.min(100, Math.round((nut.fat / user.fatGoal) * 100))}%`;

    const ironGoal = user.ironGoal || 18;
    const nutIronLabel = document.getElementById("nutIronLabel");
    if (nutIronLabel) nutIronLabel.textContent = `${nut.iron} / ${ironGoal} mg`;
    const nutIronBar = document.getElementById("nutIronBar");
    if (nutIronBar) nutIronBar.style.width = `${Math.min(100, Math.round((nut.iron / ironGoal) * 100))}%`;

    const nutWaterLabel = document.getElementById("nutWaterLabel");
    if (nutWaterLabel) nutWaterLabel.textContent = `${(waterTotalMl / 1000).toFixed(2)} / ${(user.waterGoal / 1000).toFixed(1)} L`;
    const nutWaterBar = document.getElementById("nutWaterBar");
    if (nutWaterBar) nutWaterBar.style.width = `${Math.min(100, Math.round((waterTotalMl / user.waterGoal) * 100))}%`;

    this.renderFoodDatabase();
    this.renderMealTracker();
    this.renderWorkoutsCategories();
    this.renderSportsDashboard();
    this.renderSportsBenefitsMatrix();
    this.renderHistoryFeed();
    this.renderRemindersList();
    this.updateDailySummaryCard();
    this.renderWaterScreen();
    this.renderWeightComponents();
    this.updateHeaderAutoResetBadge();
    this.renderAnalyticsCharts();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.fitSportApp = new FitSportApp();
});
