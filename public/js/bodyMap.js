// FitSport Interactive Anatomical Body Impact Visualization
import { SPORTS_DATA } from "./data.js";
import { appState } from "./state.js";

export function renderBodyMap(containerElement, sportId = "cycling", activeView = "both", genderOverride = null) {
  if (!containerElement) return;

  // Resolve active athlete gender (persisted in appState or overridden by user toggle)
  const storedGender = appState?.state?.user?.gender || "Male";
  const effectiveGender = genderOverride || storedGender;
  const isMale = effectiveGender.toLowerCase() !== "female";

  const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];
  const impact = sport.muscleImpact;

  // Select appropriate model image & branding
  const imageSrc = isMale ? "/images/body_male.jpg" : "/images/body_female.jpg";
  const imageAlt = isMale 
    ? "FitSport Male Athlete Model with Muscle Impact" 
    : "FitSport Female Athlete Model with Muscle Impact";
  const wrapperClass = isMale ? "" : "female-view";
  const calloutThemeClass = isMale ? "" : "female-callout";
  const genderBadgeClass = isMale ? "male" : "female";
  const genderBadgeText = isMale ? "♂ Male Athlete Model" : "♀ Female Athlete Model";

  // Calculate anatomical muscle hotspots tailored to athlete body geometry
  const hotspots = isMale ? [
    // --- MALE ANTERIOR (FRONT) HOTSPOTS (Left Figure centered at ~26% X) ---
    {
      id: "male-front-deltoid-left",
      name: "Deltoids (Shoulders)",
      view: "front",
      x: 13,
      y: 28,
      load: impact.percentages.arms,
      role: "Shoulder stability & overhead propulsion"
    },
    {
      id: "male-front-deltoid-right",
      name: "Deltoids (Shoulders)",
      view: "front",
      x: 39,
      y: 28,
      load: impact.percentages.arms,
      role: "Shoulder stability & overhead propulsion"
    },
    {
      id: "male-front-chest-left",
      name: "Pectorals (Chest)",
      view: "front",
      x: 21,
      y: 32,
      load: impact.percentages.arms > 60 ? 55 : 30,
      role: "Upper kinetic chest stabilization"
    },
    {
      id: "male-front-chest-right",
      name: "Pectorals (Chest)",
      view: "front",
      x: 31,
      y: 32,
      load: impact.percentages.arms > 60 ? 55 : 30,
      role: "Upper kinetic chest stabilization"
    },
    {
      id: "male-front-core-abs",
      name: "Core & Abdominals",
      view: "front",
      x: 26,
      y: 40,
      load: impact.percentages.core,
      role: "Pelvic stabilization & torso rotational power"
    },
    {
      id: "male-front-arm-left",
      name: "Biceps & Forearms",
      view: "front",
      x: 10,
      y: 43,
      load: impact.percentages.arms,
      role: "Grip & control leverage"
    },
    {
      id: "male-front-arm-right",
      name: "Biceps & Forearms",
      view: "front",
      x: 42,
      y: 43,
      load: impact.percentages.arms,
      role: "Grip & control leverage"
    },
    {
      id: "male-front-quad-left",
      name: "Quadriceps (Left)",
      view: "front",
      x: 20,
      y: 59,
      load: impact.percentages.legs,
      role: "Primary knee extension & power output"
    },
    {
      id: "male-front-quad-right",
      name: "Quadriceps (Right)",
      view: "front",
      x: 32,
      y: 59,
      load: impact.percentages.legs,
      role: "Primary knee extension & power output"
    },
    {
      id: "male-front-calf-left",
      name: "Tibialis & Calves",
      view: "front",
      x: 20,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.85),
      role: "Ankle plantarflexion & shock absorption"
    },
    {
      id: "male-front-calf-right",
      name: "Tibialis & Calves",
      view: "front",
      x: 32,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.85),
      role: "Ankle plantarflexion & shock absorption"
    },

    // --- MALE POSTERIOR (BACK) HOTSPOTS (Right Figure centered at ~76% X) ---
    {
      id: "male-back-traps",
      name: "Trapezius & Upper Back",
      view: "back",
      x: 76,
      y: 26,
      load: impact.percentages.back,
      role: "Scapular retraction & postural brace"
    },
    {
      id: "male-back-delt-left",
      name: "Posterior Deltoids",
      view: "back",
      x: 63,
      y: 28,
      load: impact.percentages.arms,
      role: "Posterior shoulder balance"
    },
    {
      id: "male-back-delt-right",
      name: "Posterior Deltoids",
      view: "back",
      x: 89,
      y: 28,
      load: impact.percentages.arms,
      role: "Posterior shoulder balance"
    },
    {
      id: "male-back-lats-left",
      name: "Latissimus Dorsi",
      view: "back",
      x: 68,
      y: 35,
      load: impact.percentages.back,
      role: "Spinal stabilization & pulling force"
    },
    {
      id: "male-back-lats-right",
      name: "Latissimus Dorsi",
      view: "back",
      x: 84,
      y: 35,
      load: impact.percentages.back,
      role: "Spinal stabilization & pulling force"
    },
    {
      id: "male-back-erector",
      name: "Lower Back (Erector Spinae)",
      view: "back",
      x: 76,
      y: 42,
      load: Math.round(impact.percentages.back * 0.9),
      role: "Core posterior trunk support"
    },
    {
      id: "male-back-glute-left",
      name: "Gluteus Maximus",
      view: "back",
      x: 70,
      y: 52,
      load: impact.percentages.glutes,
      role: "Hip extension & sprint propulsion"
    },
    {
      id: "male-back-glute-right",
      name: "Gluteus Maximus",
      view: "back",
      x: 82,
      y: 52,
      load: impact.percentages.glutes,
      role: "Hip extension & sprint propulsion"
    },
    {
      id: "male-back-hamstring-left",
      name: "Hamstrings (Biceps Femoris)",
      view: "back",
      x: 70,
      y: 64,
      load: impact.percentages.legs,
      role: "Knee flexion & deceleration control"
    },
    {
      id: "male-back-hamstring-right",
      name: "Hamstrings (Biceps Femoris)",
      view: "back",
      x: 82,
      y: 64,
      load: impact.percentages.legs,
      role: "Knee flexion & deceleration control"
    },
    {
      id: "male-back-calf-left",
      name: "Gastrocnemius (Calves)",
      view: "back",
      x: 69,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.9),
      role: "Vertical drive & ankle spring"
    },
    {
      id: "male-back-calf-right",
      name: "Gastrocnemius (Calves)",
      view: "back",
      x: 83,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.9),
      role: "Vertical drive & ankle spring"
    }
  ] : [
    // --- FEMALE ANTERIOR (FRONT) HOTSPOTS (Left Figure centered at ~26% X) ---
    {
      id: "fem-front-deltoid-left",
      name: "Deltoids (Shoulders)",
      view: "front",
      x: 14,
      y: 29,
      load: impact.percentages.arms,
      role: "Shoulder stability & athletic mobility"
    },
    {
      id: "fem-front-deltoid-right",
      name: "Deltoids (Shoulders)",
      view: "front",
      x: 38,
      y: 29,
      load: impact.percentages.arms,
      role: "Shoulder stability & athletic mobility"
    },
    {
      id: "fem-front-chest-left",
      name: "Pectorals (Chest)",
      view: "front",
      x: 21,
      y: 34,
      load: impact.percentages.arms > 60 ? 55 : 30,
      role: "Upper kinetic chest stabilization"
    },
    {
      id: "fem-front-chest-right",
      name: "Pectorals (Chest)",
      view: "front",
      x: 31,
      y: 34,
      load: impact.percentages.arms > 60 ? 55 : 30,
      role: "Upper kinetic chest stabilization"
    },
    {
      id: "fem-front-core-abs",
      name: "Core & Abdominals",
      view: "front",
      x: 26,
      y: 43,
      load: impact.percentages.core,
      role: "Pelvic stabilization & torso rotational power"
    },
    {
      id: "fem-front-arm-left",
      name: "Biceps & Forearms",
      view: "front",
      x: 10,
      y: 44,
      load: impact.percentages.arms,
      role: "Grip & control leverage"
    },
    {
      id: "fem-front-arm-right",
      name: "Biceps & Forearms",
      view: "front",
      x: 42,
      y: 44,
      load: impact.percentages.arms,
      role: "Grip & control leverage"
    },
    {
      id: "fem-front-quad-left",
      name: "Quadriceps (Left)",
      view: "front",
      x: 20,
      y: 60,
      load: impact.percentages.legs,
      role: "Primary knee extension & power output"
    },
    {
      id: "fem-front-quad-right",
      name: "Quadriceps (Right)",
      view: "front",
      x: 32,
      y: 60,
      load: impact.percentages.legs,
      role: "Primary knee extension & power output"
    },
    {
      id: "fem-front-calf-left",
      name: "Tibialis & Calves",
      view: "front",
      x: 20,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.85),
      role: "Ankle plantarflexion & shock absorption"
    },
    {
      id: "fem-front-calf-right",
      name: "Tibialis & Calves",
      view: "front",
      x: 32,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.85),
      role: "Ankle plantarflexion & shock absorption"
    },

    // --- FEMALE POSTERIOR (BACK) HOTSPOTS (Right Figure centered at ~76% X) ---
    {
      id: "fem-back-traps",
      name: "Trapezius & Upper Back",
      view: "back",
      x: 76,
      y: 28,
      load: impact.percentages.back,
      role: "Scapular retraction & postural brace"
    },
    {
      id: "fem-back-delt-left",
      name: "Posterior Deltoids",
      view: "back",
      x: 64,
      y: 29,
      load: impact.percentages.arms,
      role: "Posterior shoulder balance"
    },
    {
      id: "fem-back-delt-right",
      name: "Posterior Deltoids",
      view: "back",
      x: 88,
      y: 29,
      load: impact.percentages.arms,
      role: "Posterior shoulder balance"
    },
    {
      id: "fem-back-lats-left",
      name: "Latissimus Dorsi",
      view: "back",
      x: 69,
      y: 36,
      load: impact.percentages.back,
      role: "Spinal stabilization & pulling force"
    },
    {
      id: "fem-back-lats-right",
      name: "Latissimus Dorsi",
      view: "back",
      x: 83,
      y: 36,
      load: impact.percentages.back,
      role: "Spinal stabilization & pulling force"
    },
    {
      id: "fem-back-erector",
      name: "Lower Back (Erector Spinae)",
      view: "back",
      x: 76,
      y: 43,
      load: Math.round(impact.percentages.back * 0.9),
      role: "Core posterior trunk support"
    },
    {
      id: "fem-back-glute-left",
      name: "Gluteus Maximus",
      view: "back",
      x: 70,
      y: 53,
      load: impact.percentages.glutes,
      role: "Hip extension & sprint propulsion"
    },
    {
      id: "fem-back-glute-right",
      name: "Gluteus Maximus",
      view: "back",
      x: 82,
      y: 53,
      load: impact.percentages.glutes,
      role: "Hip extension & sprint propulsion"
    },
    {
      id: "fem-back-hamstring-left",
      name: "Hamstrings (Biceps Femoris)",
      view: "back",
      x: 70,
      y: 65,
      load: impact.percentages.legs,
      role: "Knee flexion & deceleration control"
    },
    {
      id: "fem-back-hamstring-right",
      name: "Hamstrings (Biceps Femoris)",
      view: "back",
      x: 82,
      y: 65,
      load: impact.percentages.legs,
      role: "Knee flexion & deceleration control"
    },
    {
      id: "fem-back-calf-left",
      name: "Gastrocnemius (Calves)",
      view: "back",
      x: 69,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.9),
      role: "Vertical drive & ankle spring"
    },
    {
      id: "fem-back-calf-right",
      name: "Gastrocnemius (Calves)",
      view: "back",
      x: 83,
      y: 78,
      load: Math.round(impact.percentages.legs * 0.9),
      role: "Vertical drive & ankle spring"
    }
  ];

  // Filter pins based on active view perspective
  const visiblePins = hotspots.filter(pin => {
    if (activeView === "both") return true;
    return pin.view === activeView;
  });

  containerElement.innerHTML = `
    <div class="body-analysis-card">
      <div class="body-analysis-header">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span class="gender-indicator-badge ${genderBadgeClass}">${genderBadgeText}</span>
            <span class="badge-sports">CORE USP • ANATOMICAL IMPACT</span>
          </div>
          <h3 class="card-title">Musculoskeletal Target Analysis: ${sport.name}</h3>
          <p class="card-subtitle">Real-time biomechanical load distribution mapped to active muscle groups.</p>
        </div>

        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <!-- Gender Quick Switcher -->
          <div class="gender-toggle-group">
            <button type="button" class="btn-gender-toggle ${isMale ? 'active' : ''}" data-gender="Male" title="Male Athlete view with muscle impact">
              <span>♂ Male</span>
            </button>
            <button type="button" class="btn-gender-toggle ${!isMale ? 'female-active active' : ''}" data-gender="Female" title="Female Athlete view with muscle impact">
              <span>♀ Female</span>
            </button>
          </div>

          <!-- Perspective View Toggles -->
          <div class="view-toggle-group">
            <button type="button" class="btn-toggle ${activeView === 'both' ? 'active' : ''}" data-view="both">Full Dual View</button>
            <button type="button" class="btn-toggle ${activeView === 'front' ? 'active' : ''}" data-view="front">Anterior (Front)</button>
            <button type="button" class="btn-toggle ${activeView === 'back' ? 'active' : ''}" data-view="back">Posterior (Back)</button>
          </div>
        </div>
      </div>

      <div class="body-analysis-layout">
        <!-- Mannequin Stage with Interactive Muscle Impact Overlays -->
        <div class="body-map-stage">
          <div class="body-map-glow"></div>
          
          <div class="body-mannequin-wrapper ${wrapperClass} view-focus-${activeView}" id="activeMannequinWrapper">
            <div class="body-mannequin-stage-inner">
              <img 
                src="${imageSrc}" 
                alt="${imageAlt}" 
                class="body-mannequin-img"
                id="activeMannequinImage"
              />

              <!-- Muscle Impact Overlays & Interactive Pins -->
              <div class="body-impact-overlay" id="bodyImpactOverlay">
                ${visiblePins.map(pin => {
                  const isPrimary = pin.load >= 60;
                  const isSecondary = pin.load >= 35 && pin.load < 60;
                  const statusClass = isPrimary ? "primary" : (isSecondary ? "secondary" : "minimal");

                  const posVertical = pin.y < 35 ? 'pos-below' : 'pos-above';
                  const posHorizontal = pin.x < 22 ? 'pos-left' : (pin.x > 78 ? 'pos-right' : 'pos-center');

                  return `
                    <div 
                      class="muscle-pin ${statusClass} ${posVertical} ${posHorizontal}" 
                      style="left: ${pin.x}%; top: ${pin.y}%;" 
                      data-muscle="${pin.name}"
                      data-load="${pin.load}%"
                      data-role="${pin.role}"
                      title="${pin.name}: ${pin.load}% Load"
                    >
                      <span class="pin-pulse"></span>
                      <span class="pin-dot"></span>
                      <div class="pin-label-popover">
                        <span class="pin-popover-title">${pin.name}</span>
                        <span class="pin-popover-load">${pin.load}% Load</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Interactive Active Muscle Callout -->
          <div class="active-muscle-callout ${calloutThemeClass}" id="activeMuscleCallout">
            <div class="callout-indicator">
              <span class="callout-dot"></span>
            </div>
            <div class="callout-body">
              <div class="callout-header">
                <span class="callout-title" id="calloutMuscleName">Musculoskeletal Target Indicator</span>
                <span class="callout-badge" id="calloutMuscleLoad">Interactive</span>
              </div>
              <div class="callout-desc" id="calloutMuscleRole">Click or hover any glowing point on the anatomical model to inspect real-time load, engagement percentage, and kinematic stability function.</div>
            </div>
          </div>

          <div class="body-legend" style="margin-top: 14px;">
            <div class="legend-item"><span class="legend-dot active"></span> Primary Muscle (60%+ Load)</div>
            <div class="legend-item"><span class="legend-dot secondary"></span> Secondary Load (35%-59%)</div>
            <div class="legend-item"><span class="legend-dot neutral"></span> Structural Base</div>
          </div>
        </div>

        <!-- Biomechanical Breakdown Panel -->
        <div class="body-metrics-panel">
          <div class="load-summary-box">
            <div class="load-stat-header">
              <span class="load-title">Target Muscular Load Breakdown: ${sport.name}</span>
              <span class="load-badge">Active Impact</span>
            </div>

            <div class="load-bar-item">
              <div class="load-bar-label">
                <span class="font-bold text-light">Lower Body / Legs (Quads & Hamstrings)</span>
                <span class="text-green font-bold">${impact.percentages.legs}%</span>
              </div>
              <div class="load-progress-track">
                <div class="load-progress-fill" style="width: ${impact.percentages.legs}%;"></div>
              </div>
            </div>

            <div class="load-bar-item">
              <div class="load-bar-label">
                <span class="font-bold text-light">Gluteal Complex</span>
                <span class="text-green font-bold">${impact.percentages.glutes}%</span>
              </div>
              <div class="load-progress-track">
                <div class="load-progress-fill" style="width: ${impact.percentages.glutes}%;"></div>
              </div>
            </div>

            <div class="load-bar-item">
              <div class="load-bar-label">
                <span class="font-bold text-light">Core & Abdominals</span>
                <span class="text-green font-bold">${impact.percentages.core}%</span>
              </div>
              <div class="load-progress-track">
                <div class="load-progress-fill" style="width: ${impact.percentages.core}%;"></div>
              </div>
            </div>

            <div class="load-bar-item">
              <div class="load-bar-label">
                <span class="font-bold text-light">Posterior Chain / Back</span>
                <span class="text-green font-bold">${impact.percentages.back}%</span>
              </div>
              <div class="load-progress-track">
                <div class="load-progress-fill" style="width: ${impact.percentages.back}%;"></div>
              </div>
            </div>

            <div class="load-bar-item">
              <div class="load-bar-label">
                <span class="font-bold text-light">Upper Body & Arms</span>
                <span class="text-green font-bold">${impact.percentages.arms}%</span>
              </div>
              <div class="load-progress-track">
                <div class="load-progress-fill" style="width: ${impact.percentages.arms}%;"></div>
              </div>
            </div>
          </div>

          <!-- Muscle Categories Split: Primary vs Secondary -->
          <div class="muscle-categories-grid">
            <div class="muscle-cat-card">
              <div class="cat-badge primary">PRIMARY MUSCLE GROUPS</div>
              <ul class="muscle-pill-list">
                ${impact.primary.map(m => `
                  <li class="muscle-pill primary">
                    <span class="pill-dot"></span> ${m}
                  </li>
                `).join('')}
              </ul>
            </div>

            <div class="muscle-cat-card">
              <div class="cat-badge secondary">SECONDARY STABILIZERS</div>
              <ul class="muscle-pill-list">
                ${impact.secondary.map(m => `
                  <li class="muscle-pill secondary">
                    <span class="pill-dot"></span> ${m}
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach view & gender listeners
  bindBodyMapEvents(containerElement, sportId, effectiveGender);
}

function bindBodyMapEvents(containerElement, sportId, currentGender) {
  // Perspective view toggles (both, front, back)
  const toggleButtons = containerElement.querySelectorAll('.btn-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.getAttribute('data-view') || 'both';
      renderBodyMap(containerElement, sportId, view, currentGender);
    });
  });

  // Gender toggles (Male / Female)
  const genderButtons = containerElement.querySelectorAll('.btn-gender-toggle');
  genderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetGender = btn.getAttribute('data-gender') || 'Male';
      // Persist to user profile
      appState.updateUserProfile({ gender: targetGender });
      renderBodyMap(containerElement, sportId, "both", targetGender);
    });
  });

  // Interactive Pin Click & Hover Handling
  const pins = containerElement.querySelectorAll('.muscle-pin');
  const callout = containerElement.querySelector('#activeMuscleCallout');
  const calloutName = containerElement.querySelector('#calloutMuscleName');
  const calloutLoad = containerElement.querySelector('#calloutMuscleLoad');
  const calloutRole = containerElement.querySelector('#calloutMuscleRole');

  pins.forEach(pin => {
    const activate = () => {
      pins.forEach(p => p.classList.remove('active-pin'));
      pin.classList.add('active-pin');

      const name = pin.getAttribute('data-muscle');
      const load = pin.getAttribute('data-load');
      const role = pin.getAttribute('data-role');

      if (calloutName) calloutName.textContent = name;
      if (calloutLoad) calloutLoad.textContent = `${load} Biomechanical Load`;
      if (calloutRole) calloutRole.textContent = role;
      if (callout) callout.classList.add('highlighted');
    };

    pin.addEventListener('click', (e) => {
      e.stopPropagation();
      activate();
    });

    pin.addEventListener('mouseenter', () => {
      activate();
    });
  });

  // Clicking anywhere on the mannequin background resets pin focus
  const stage = containerElement.querySelector('.body-map-stage');
  if (stage) {
    stage.addEventListener('click', (e) => {
      if (!e.target.closest('.muscle-pin')) {
        pins.forEach(p => p.classList.remove('active-pin'));
        if (callout) callout.classList.remove('highlighted');
        if (calloutName) calloutName.textContent = "Musculoskeletal Target Indicator";
        if (calloutLoad) calloutLoad.textContent = "Interactive";
        if (calloutRole) calloutRole.textContent = "Click or hover any glowing point on the anatomical model to inspect real-time load, engagement percentage, and kinematic stability function.";
      }
    });
  }
}
