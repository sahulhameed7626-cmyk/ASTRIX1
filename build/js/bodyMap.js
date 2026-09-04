// FitSport Interactive Anatomical Body Impact Visualization
import { SPORTS_DATA } from "./data.js";

export function renderBodyMap(containerElement, sportId = "cycling", activeView = "front") {
  const sport = SPORTS_DATA.find(s => s.id === sportId) || SPORTS_DATA[0];
  const impact = sport.muscleImpact;

  containerElement.innerHTML = `
    <div class="body-analysis-card">
      <div class="body-analysis-header">
        <div>
          <span class="badge-sports">CORE USP • ANATOMICAL IMPACT</span>
          <h3 class="card-title mt-1">Musculoskeletal Target Analysis: ${sport.name}</h3>
          <p class="card-subtitle">Real-time biomechanical load distribution mapped to active muscle groups.</p>
        </div>
        <div class="view-toggle-group">
          <button type="button" class="btn-toggle ${activeView === 'front' ? 'active' : ''}" data-view="front">Anterior (Front)</button>
          <button type="button" class="btn-toggle ${activeView === 'back' ? 'active' : ''}" data-view="back">Posterior (Back)</button>
        </div>
      </div>

      <div class="body-analysis-layout">
        <!-- SVG Interactive Human Body -->
        <div class="body-map-stage">
          <div class="body-map-glow"></div>
          <svg viewBox="0 0 300 500" class="human-body-svg" preserveAspectRatio="xMidYMid meet" id="humanBodySvg">
            <defs>
              <filter id="muscleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="activeMuscleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1FB622" stop-opacity="0.95"/>
                <stop offset="100%" stop-color="#1FB622" stop-opacity="0.6"/>
              </linearGradient>
              <linearGradient id="secondaryMuscleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#CFF0C5" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="#1FB622" stop-opacity="0.4"/>
              </linearGradient>
            </defs>

            <!-- Base Anatomical Silhouette Structure -->
            <g class="body-base-skeleton" stroke="#222222" stroke-width="1.5" fill="none">
              <!-- Head & Neck -->
              <ellipse cx="150" cy="45" rx="22" ry="28" fill="#111111" stroke="#333333"/>
              <path d="M142 73 L142 90 M158 73 L158 90" stroke="#333333"/>
              <!-- Torso base outline -->
              <path d="M120 90 L180 90 L172 195 L150 215 L128 195 Z" fill="#111111" stroke="#2a2a2a"/>
              <!-- Left & Right Arm base -->
              <path d="M120 90 L95 155 L82 230" stroke="#2a2a2a" stroke-width="12" stroke-linecap="round"/>
              <path d="M180 90 L205 155 L218 230" stroke="#2a2a2a" stroke-width="12" stroke-linecap="round"/>
              <!-- Left & Right Leg base -->
              <path d="M136 215 L128 335 L122 450" stroke="#2a2a2a" stroke-width="18" stroke-linecap="round"/>
              <path d="M164 215 L172 335 L178 450" stroke="#2a2a2a" stroke-width="18" stroke-linecap="round"/>
            </g>

            ${activeView === 'front' ? `
              <!-- FRONT ANTERIOR MUSCLE GROUPS -->
              <!-- Shoulders / Deltoids -->
              <g class="muscle-group ${impact.percentages.arms > 50 ? 'muscle-active' : 'muscle-secondary'}" data-muscle="Deltoids">
                <path d="M110 90 C105 105 102 120 108 135 C116 130 122 110 120 90 Z" fill="${impact.percentages.arms > 50 ? 'url(#activeMuscleGrad)' : '#1a291a'}" stroke="#1FB622" stroke-width="${impact.percentages.arms > 50 ? '2' : '0.5'}" filter="${impact.percentages.arms > 50 ? 'url(#muscleGlow)' : 'none'}"/>
                <path d="M190 90 C195 105 198 120 192 135 C184 130 178 110 180 90 Z" fill="${impact.percentages.arms > 50 ? 'url(#activeMuscleGrad)' : '#1a291a'}" stroke="#1FB622" stroke-width="${impact.percentages.arms > 50 ? '2' : '0.5'}" filter="${impact.percentages.arms > 50 ? 'url(#muscleGlow)' : 'none'}"/>
              </g>

              <!-- Chest / Pectorals -->
              <g class="muscle-group" data-muscle="Chest">
                <path d="M125 96 Q150 105 175 96 L170 135 Q150 142 130 135 Z" fill="#151b15" stroke="#284228" stroke-width="1"/>
              </g>

              <!-- Core / Abdominals (High engagement in cycling & sports) -->
              <g class="muscle-group ${impact.percentages.core >= 40 ? 'muscle-active' : 'muscle-secondary'}" data-muscle="Core">
                <!-- Rectus abdominis blocks -->
                <rect x="135" y="142" width="13" height="12" rx="2" fill="${impact.percentages.core >= 60 ? 'url(#activeMuscleGrad)' : '#1FB622'}" fill-opacity="${impact.percentages.core / 100}" stroke="#1FB622" stroke-width="1.2"/>
                <rect x="152" y="142" width="13" height="12" rx="2" fill="${impact.percentages.core >= 60 ? 'url(#activeMuscleGrad)' : '#1FB622'}" fill-opacity="${impact.percentages.core / 100}" stroke="#1FB622" stroke-width="1.2"/>
                <rect x="135" y="158" width="13" height="12" rx="2" fill="${impact.percentages.core >= 60 ? 'url(#activeMuscleGrad)' : '#1FB622'}" fill-opacity="${impact.percentages.core / 100}" stroke="#1FB622" stroke-width="1.2"/>
                <rect x="152" y="158" width="13" height="12" rx="2" fill="${impact.percentages.core >= 60 ? 'url(#activeMuscleGrad)' : '#1FB622'}" fill-opacity="${impact.percentages.core / 100}" stroke="#1FB622" stroke-width="1.2"/>
                <rect x="136" y="174" width="12" height="14" rx="2" fill="${impact.percentages.core >= 60 ? 'url(#activeMuscleGrad)' : '#1FB622'}" fill-opacity="${impact.percentages.core / 100}" stroke="#1FB622" stroke-width="1.2"/>
                <rect x="152" y="174" width="12" height="14" rx="2" fill="${impact.percentages.core >= 60 ? 'url(#activeMuscleGrad)' : '#1FB622'}" fill-opacity="${impact.percentages.core / 100}" stroke="#1FB622" stroke-width="1.2"/>
              </g>

              <!-- Forearms & Biceps -->
              <g class="muscle-group ${impact.percentages.arms >= 60 ? 'muscle-active' : ''}" data-muscle="Arms">
                <path d="M102 140 C95 160 90 180 84 210 C88 215 95 190 102 165 Z" fill="${impact.percentages.arms >= 60 ? 'url(#activeMuscleGrad)' : '#162216'}" stroke="#1FB622" stroke-width="${impact.percentages.arms >= 60 ? '1.5' : '0.5'}"/>
                <path d="M198 140 C205 160 210 180 216 210 C212 215 205 190 198 165 Z" fill="${impact.percentages.arms >= 60 ? 'url(#activeMuscleGrad)' : '#162216'}" stroke="#1FB622" stroke-width="${impact.percentages.arms >= 60 ? '1.5' : '0.5'}"/>
              </g>

              <!-- Quadriceps / Upper Legs (Massive 85% for Cycling) -->
              <g class="muscle-group muscle-active" data-muscle="Quadriceps" filter="url(#muscleGlow)">
                <!-- Left Quad -->
                <path d="M125 215 C115 250 112 290 120 330 C130 335 142 300 144 240 C138 225 132 215 125 215 Z" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="2.2"/>
                <!-- Right Quad -->
                <path d="M175 215 C185 250 188 290 180 330 C170 335 158 300 156 240 C162 225 168 215 175 215 Z" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="2.2"/>
              </g>

              <!-- Knees / Patella -->
              <circle cx="124" cy="340" r="7" fill="#1a251a" stroke="#2b452b"/>
              <circle cx="176" cy="340" r="7" fill="#1a251a" stroke="#2b452b"/>

              <!-- Calves & Tibialis Anterior -->
              <g class="muscle-group ${impact.percentages.legs >= 70 ? 'muscle-active' : ''}" data-muscle="Calves">
                <path d="M117 350 C110 380 114 415 120 445 C126 445 132 410 130 375 Z" fill="${impact.percentages.legs >= 70 ? 'url(#activeMuscleGrad)' : '#152515'}" stroke="#1FB622" stroke-width="1.8"/>
                <path d="M183 350 C190 380 186 415 180 445 C174 445 168 410 170 375 Z" fill="${impact.percentages.legs >= 70 ? 'url(#activeMuscleGrad)' : '#152515'}" stroke="#1FB622" stroke-width="1.8"/>
              </g>
            ` : `
              <!-- BACK POSTERIOR MUSCLE GROUPS -->
              <!-- Trapezius & Upper Back -->
              <g class="muscle-group" data-muscle="Traps">
                <polygon points="150,85 175,100 162,145 150,160 138,145 125,100" fill="#182718" stroke="#1FB622" stroke-width="1"/>
              </g>

              <!-- Latissimus Dorsi (Lats) -->
              <g class="muscle-group ${impact.percentages.back >= 50 ? 'muscle-active' : ''}" data-muscle="Lats">
                <path d="M125 110 L140 150 L135 185 L120 145 Z" fill="${impact.percentages.back >= 50 ? 'url(#activeMuscleGrad)' : '#182418'}" stroke="#1FB622" stroke-width="1.2"/>
                <path d="M175 110 L160 150 L165 185 L180 145 Z" fill="${impact.percentages.back >= 50 ? 'url(#activeMuscleGrad)' : '#182418'}" stroke="#1FB622" stroke-width="1.2"/>
              </g>

              <!-- Lower Back / Erector Spinae (Secondary in Cycling 35%) -->
              <g class="muscle-group muscle-secondary" data-muscle="Lower Back">
                <rect x="142" y="165" width="7" height="32" rx="2" fill="#CFF0C5" fill-opacity="0.65" stroke="#1FB622" stroke-width="1"/>
                <rect x="151" y="165" width="7" height="32" rx="2" fill="#CFF0C5" fill-opacity="0.65" stroke="#1FB622" stroke-width="1"/>
              </g>

              <!-- Gluteus Maximus (Prominent 70% in Cycling) -->
              <g class="muscle-group muscle-active" data-muscle="Glutes" filter="url(#muscleGlow)">
                <ellipse cx="134" cy="225" rx="18" ry="24" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="2"/>
                <ellipse cx="166" cy="225" rx="18" ry="24" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="2"/>
              </g>

              <!-- Hamstrings (85% in Cycling) -->
              <g class="muscle-group muscle-active" data-muscle="Hamstrings" filter="url(#muscleGlow)">
                <path d="M124 250 C116 280 118 315 125 335 C134 330 142 300 142 260 Z" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="2.2"/>
                <path d="M176 250 C184 280 182 315 175 335 C166 330 158 300 158 260 Z" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="2.2"/>
              </g>

              <!-- Posterior Calves (Gastrocnemius) -->
              <g class="muscle-group muscle-active" data-muscle="Calves" filter="url(#muscleGlow)">
                <path d="M116 350 C108 375 112 405 120 440 C128 440 134 400 130 365 Z" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="1.8"/>
                <path d="M184 350 C192 375 188 405 180 440 C172 440 166 400 170 365 Z" fill="url(#activeMuscleGrad)" stroke="#1FB622" stroke-width="1.8"/>
              </g>
            `}
          </svg>
          <div class="body-legend">
            <div class="legend-item"><span class="legend-dot active"></span> Primary Load (#1FB622)</div>
            <div class="legend-item"><span class="legend-dot secondary"></span> Secondary Load (#CFF0C5)</div>
            <div class="legend-item"><span class="legend-dot neutral"></span> Minimal Base (#222222)</div>
          </div>
        </div>

        <!-- Biomechanical Breakdown Panel -->
        <div class="body-metrics-panel">
          <div class="load-summary-box">
            <div class="load-stat-header">
              <span class="load-title">Target Muscular Load Breakdown</span>
              <span class="load-badge">Active Profile</span>
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

          <!-- Muscle Cards Split: Primary vs Secondary -->
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

  // Attach toggle listener
  const toggleButtons = containerElement.querySelectorAll('.btn-toggle');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const view = e.target.getAttribute('data-view');
      renderBodyMap(containerElement, sportId, view);
    });
  });
}
