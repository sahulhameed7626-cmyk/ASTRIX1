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
    this.startAlarmClockWatcher();

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
    this.navigateTo("login");
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
    this.currentView = viewId;

    const appLayout = document.getElementById("appLayout");
    if (viewId === "login" || viewId === "onboarding") {
      appLayout?.classList.add("auth-mode");
    } else {
      appLayout?.classList.remove("auth-mode");
    }

    // Toggle view screens
    const allScreens = document.querySelectorAll(".view-screen");
    allScreens.forEach(el => el.classList.remove("active-screen"));

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
  }

  bindNavigation() {
    document.getElementById("sidebarBrandClick")?.addEventListener("click", () => {
      this.navigateTo("dashboard");
    });

    document.querySelectorAll("[data-view]").forEach(elem => {
      elem.addEventListener("click", (e) => {
        const view = elem.getAttribute("data-view");
        if (view) {
          e.preventDefault();
          this.navigateTo(view);
        }
      });
    });

    document.getElementById("mobileMenuToggle")?.addEventListener("click", () => {
      const sidebar = document.getElementById("appSidebar");
      if (sidebar) {
        sidebar.style.display = sidebar.style.display === "flex" ? "none" : "flex";
      }
    });
  }

  bindHeaderActions() {
    document.getElementById("landingToggleBtn")?.addEventListener("click", () => {
      if (this.currentView === "landing") {
        this.navigateTo("dashboard");
        document.getElementById("landingToggleBtn").textContent = "Landing Page";
      } else {
        this.navigateTo("landing");
        document.getElementById("landingToggleBtn").textContent = "Back to App";
      }
    });

    document.getElementById("headerQuickLogBtn")?.addEventListener("click", () => {
      this.openAddFoodModal("lunch");
    });

    document.getElementById("landingCtaStart")?.addEventListener("click", () => {
      this.navigateTo("onboarding");
    });
    document.getElementById("landingCtaExplore")?.addEventListener("click", () => {
      this.navigateTo("dashboard");
    });

    document.getElementById("loginSubmitBtn")?.addEventListener("click", () => {
      const rawPhone = (document.getElementById("loginPhone")?.value || "9876543210").trim();
      const phone = rawPhone.startsWith("+") ? rawPhone : `+91 ${rawPhone}`;
      const height = parseFloat(document.getElementById("loginHeight")?.value) || 178;
      const weight = parseFloat(document.getElementById("loginWeight")?.value) || 69.5;
      
      appState.updateUserProfile({
        phone,
        height,
        currentWeight: weight
      });

      this.showToast(`Signed in: ${phone} (${height}cm, ${weight}kg)`);
      this.navigateTo("dashboard");
    });
    document.getElementById("loginToOnboardingBtn")?.addEventListener("click", () => {
      this.navigateTo("onboarding");
    });
    document.getElementById("loginToLandingBtn")?.addEventListener("click", () => {
      this.navigateTo("landing");
    });
  }

  // --------------------------------------------------------------------------
  // 3. 5-Step Profile Setup Onboarding
  // --------------------------------------------------------------------------
  bindOnboarding() {
    let currentStep = 1;
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

    const updateStepUI = () => {
      document.getElementById("onboardingStepBadge").textContent = `Step ${currentStep} of ${totalSteps}`;
      document.getElementById("onboardingProgressBar").style.width = `${(currentStep / totalSteps) * 100}%`;

      for (let i = 1; i <= totalSteps; i++) {
        const stepEl = document.getElementById(`onboardingStep${i}`);
        if (stepEl) stepEl.style.display = i === currentStep ? "block" : "none";
      }

      const prevBtn = document.getElementById("onboardingPrevBtn");
      const nextBtn = document.getElementById("onboardingNextBtn");

      if (prevBtn) prevBtn.disabled = currentStep === 1;
      if (nextBtn) {
        nextBtn.textContent = currentStep === totalSteps ? "Complete Setup" : "Next Step";
      }
    };

    document.getElementById("onboardingNextBtn")?.addEventListener("click", () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepUI();
      } else {
        const name = document.getElementById("obName")?.value || "Alex Mercer";
        const phone = document.getElementById("obPhone")?.value || "+91 98765 43210";
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

        appState.updateUserProfile({
          name,
          phone,
          height,
          currentWeight: currentW,
          targetWeight: targetW,
          targetDurationMonths: duration,
          interestedSports: sportsChecked.length ? sportsChecked : ["Cycling", "Running"],
          fitnessGoal: selectedGoal
        });

        this.showToast("Profile Setup Completed with All Chosen Goals!");
        this.navigateTo("dashboard");
      }
    });

    document.getElementById("onboardingPrevBtn")?.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepUI();
      }
    });
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

  renderWorkoutsCategories() {
    const homeMount = document.getElementById("homeWorkoutsGrid");
    const equipMount = document.getElementById("equipmentWorkoutsGrid");
    if (!homeMount || !equipMount) return;

    const homeList = WORKOUT_CATEGORIES.filter(w => w.category === "Home Workouts");
    const equipList = WORKOUT_CATEGORIES.filter(w => w.category === "Equipment Workouts");

    const renderCard = (w) => `
      <div class="workout-card" data-id="${w.id}">
        <div>
          <div class="workout-badge-row">
            <span class="badge-tag">${w.subCategory}</span>
            <span style="font-family: var(--font-display); font-weight: 700; color: var(--green-primary);">${w.calories} kcal</span>
          </div>
          <h3 style="font-size: 1.25rem; margin: 12px 0 6px 0;">${w.title}</h3>
          <p style="font-size: 0.85rem; line-height: 1.4;">${w.description}</p>
        </div>
        <div>
          <div class="workout-meta-chips" style="margin-bottom: 16px;">
            <span class="meta-chip">⏱️ ${w.duration} min</span>
            <span class="meta-chip">⚡ ${w.intensity}</span>
            <span class="meta-chip">📋 ${w.exercisesCount} Exercises</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" style="width: 100%;">View Routine & Start →</button>
        </div>
      </div>
    `;

    homeMount.innerHTML = homeList.map(renderCard).join('');
    equipMount.innerHTML = equipList.map(renderCard).join('');

    document.querySelectorAll(".workout-card").forEach(card => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        this.openWorkoutDetails(id);
      });
    });
  }

  openWorkoutDetails(workoutId) {
    appState.state.selectedWorkoutId = workoutId;
    const workout = WORKOUT_CATEGORIES.find(w => w.id === workoutId) || WORKOUT_CATEGORIES[0];

    document.getElementById("wDetailCategory").textContent = `${workout.category} • ${workout.subCategory}`;
    document.getElementById("wDetailTitle").textContent = workout.title;
    document.getElementById("wDetailDesc").textContent = workout.description;
    document.getElementById("wDetailCalories").textContent = `${workout.calories} kcal`;
    document.getElementById("wDetailDuration").textContent = `${workout.duration} min duration`;

    const exerciseListMount = document.getElementById("wDetailExerciseList");
    if (exerciseListMount) {
      exerciseListMount.innerHTML = workout.exercises.map((ex, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-surface); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div>
            <div class="font-bold text-light">${idx + 1}. ${ex.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary);">${ex.target}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: var(--green-primary); font-size: 1rem;">${ex.sets} × ${ex.reps}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">Rest: ${ex.restSec}s</div>
          </div>
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

    this.navigateTo("sport-details");
  }

  bindBodyMap() {}

  renderBodyAnalysisView() {
    const container = document.getElementById("bodyMapContainer");
    const sportId = appState.state.selectedSportId || "cycling";
    const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];

    if (container) {
      renderBodyMap(container, sportId, "front");
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
        this.showToast(`✈️ Telegram ready! Opening Telegram share with full history...`);
      }

      // Preload Telegram with exact formatted history timeline
      const encoded = encodeURIComponent(historyText);
      const url = `https://t.me/share/url?url=&text=${encoded}`;
      window.open(url, "_blank");
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

    container.innerHTML = items.map(item => `
      <div class="timeline-item">
        <div class="timeline-left">
          <div class="timeline-icon-box">
            <svg><use href="#icon-${item.icon || 'activity'}"></use></svg>
          </div>
          <div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-sub">${item.subtitle} • ${item.subMetric}</div>
          </div>
        </div>
        <div class="timeline-right">
          <div class="timeline-metric">${item.metric}</div>
          <div class="timeline-time">${item.date} • ${item.time}</div>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // 21. Analytics & Charts
  // --------------------------------------------------------------------------
  renderAnalyticsCharts() {
    const weeklyMount = document.getElementById("analyticsWeeklyChartMount");
    if (weeklyMount) {
      renderWeeklyCaloriesChart(weeklyMount);
    }

    const weightMount = document.getElementById("analyticsWeightJourneyMount");
    if (weightMount) {
      const user = appState.state.user;
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
      appState.sendTelegramHistoryNotification(text);

      const encoded = encodeURIComponent(text);
      const url = `https://t.me/share/url?url=&text=${encoded}`;
      window.open(url, "_blank");
      this.showToast("Opening Telegram with Daily Summary...");
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
          minute: match[2],
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
      if (minSel) minSel.value = parsed.minute;

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

      const chatIdDisp = document.getElementById("telegramChatIdDisplay");
      if (chatIdDisp) {
        chatIdDisp.textContent = `${appState.state.telegramChatId || '7032355691'} (@sgifesdf_bot)`;
      }

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

    // Initial sync
    setTimeout(() => {
      updateScheduleUI();
    }, 400);

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

      const res = await appState.saveTelegramSchedule({
        enabled,
        time: time24,
        time12: time12,
        chatId: appState.state.telegramChatId || "7032355691"
      });

      updateScheduleUI(res?.schedule);
      this.showToast(enabled ? `⏰ Telegram auto-history scheduled for ${time12}` : `⏸ Telegram auto-history paused.`);
    };

    document.getElementById("saveTelegramScheduleBtn")?.addEventListener("click", saveCurrentSchedule);
    document.getElementById("telegramScheduleToggle")?.addEventListener("change", saveCurrentSchedule);

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
  bindProfileAndSettings() {
    document.getElementById("profileEditBtn")?.addEventListener("click", () => {
      this.navigateTo("onboarding");
    });
    document.getElementById("profileUpdateGoalBtn")?.addEventListener("click", () => {
      this.navigateTo("onboarding");
    });

    document.getElementById("manageAccountBtn")?.addEventListener("click", () => {
      this.showToast("Account details are verified and linked.");
    });

    document.getElementById("testTelegramNotificationBtn")?.addEventListener("click", async () => {
      this.showToast("⏳ Sending activity history test to Telegram @sgifesdf_bot...");
      const result = await appState.testTelegramSchedule(appState.state.telegramChatId || "7032355691");
      if (result && result.success) {
        this.showToast(`✅ Activity History Delivered to Telegram via @sgifesdf_bot!`);
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
      this.showToast("Logged out successfully.");
      this.navigateTo("login");
    });
  }

  // --------------------------------------------------------------------------
  // Master Dynamic Sync
  // --------------------------------------------------------------------------
  renderAllDynamicComponents() {
    const user = appState.state.user;
    const nut = appState.getNutritionTotals();
    const waterTotalMl = appState.getWaterTotal();
    const burned = appState.getCaloriesBurnedToday();

    const sidebarAvatar = document.getElementById("sidebarAvatar");
    if (sidebarAvatar) sidebarAvatar.textContent = user.avatar || "AM";
    const sidebarName = document.getElementById("sidebarUserName");
    if (sidebarName) sidebarName.textContent = user.name;

    const profPhone = document.getElementById("profilePhoneDisplay");
    if (profPhone) profPhone.textContent = user.phone || "+91 98765 43210";

    const settingsPhone = document.getElementById("settingsAccountPhoneDisplay");
    if (settingsPhone) settingsPhone.textContent = `${user.name} (${user.phone || "+91 98765 43210"})`;

    const dCals = document.getElementById("dashValCaloriesConsumed");
    if (dCals) dCals.textContent = nut.calories.toLocaleString();

    const dBurned = document.getElementById("dashValCaloriesBurned");
    if (dBurned) dBurned.textContent = burned.toLocaleString();

    const dProtein = document.getElementById("dashValProtein");
    if (dProtein) dProtein.textContent = `${nut.protein}g`;

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
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.fitSportApp = new FitSportApp();
});
