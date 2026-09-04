// FitSport High Performance SVG Data Visualizations
// Strictly uses: #060606, #1FB622, #CFF0C5, #EEEEEE, #AAAAAA

export function renderProgressRing(container, percent = 58, size = 180, strokeWidth = 12, label = "Goal Progress") {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  container.innerHTML = `
    <div class="progress-ring-wrapper" style="width: ${size}px; height: ${size}px;">
      <svg width="${size}" height="${size}" class="progress-ring-svg">
        <circle
          stroke="#1c1c1c"
          stroke-width="${strokeWidth}"
          fill="transparent"
          r="${radius}"
          cx="${size / 2}"
          cy="${size / 2}"
        />
        <circle
          class="progress-ring-circle"
          stroke="#1FB622"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          fill="transparent"
          r="${radius}"
          cx="${size / 2}"
          cy="${size / 2}"
        />
      </svg>
      <div class="progress-ring-content">
        <div class="progress-ring-value">${percent}%</div>
        <div class="progress-ring-label">${label}</div>
      </div>
    </div>
  `;
}

export function renderHydrationGauge(container, currentMl = 2400, targetMl = 3500) {
  if (!container) return;
  const cur = Math.max(0, parseInt(currentMl) || 0);
  const tgt = Math.max(1000, parseInt(targetMl) || 3500);
  const percent = Math.min(100, Math.round((cur / tgt) * 100));
  const size = 230;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  container.innerHTML = `
    <div class="progress-ring-wrapper" style="width: ${size}px; height: ${size}px; margin: 0 auto;">
      <svg width="${size}" height="${size}" class="progress-ring-svg">
        <circle
          stroke="#152015"
          stroke-width="${strokeWidth}"
          fill="transparent"
          r="${radius}"
          cx="${size / 2}"
          cy="${size / 2}"
        />
        <circle
          class="progress-ring-circle"
          stroke="#1FB622"
          stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          stroke-linecap="round"
          fill="transparent"
          r="${radius}"
          cx="${size / 2}"
          cy="${size / 2}"
        />
      </svg>
      <div class="progress-ring-content">
        <div class="progress-ring-icon" style="margin-bottom: 4px;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1FB622" stroke-width="2.5">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
        </div>
        <div class="progress-ring-value" style="font-size: 1.8rem; font-weight: 900; line-height: 1.1;">
          ${(cur / 1000).toFixed(2)} <span class="unit" style="font-size: 0.95rem; color: var(--text-secondary);">/ ${(tgt / 1000).toFixed(1)} L</span>
        </div>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--green-primary); margin-top: 4px;">
          ${cur.toLocaleString()} ml logged
        </div>
        <div class="progress-ring-label" style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
          ${percent}% of 3 - 4L Goal
        </div>
      </div>
    </div>
  `;
}


export function renderWeeklyCaloriesChart(container) {
  const days = [
    { day: "Mon", consumed: 2100, burned: 650 },
    { day: "Tue", consumed: 1950, burned: 580 },
    { day: "Wed", consumed: 2250, burned: 720 },
    { day: "Thu", consumed: 1880, burned: 490 },
    { day: "Fri", consumed: 2050, burned: 810 },
    { day: "Sat", consumed: 2400, burned: 920 },
    { day: "Sun", consumed: 1850, burned: 600 }
  ];

  const maxVal = 2600;
  const height = 200;

  const barsHtml = days.map(d => {
    const consumedH = (d.consumed / maxVal) * height;
    const burnedH = (d.burned / maxVal) * height;

    return `
      <div class="chart-col">
        <div class="bar-pair">
          <div class="bar bar-consumed" style="height: ${consumedH}px;" title="Consumed: ${d.consumed} kcal"></div>
          <div class="bar bar-burned" style="height: ${burnedH}px;" title="Burned: ${d.burned} kcal"></div>
        </div>
        <div class="col-label">${d.day}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-header">
        <div>
          <h4 class="chart-title">Weekly Energy Balance</h4>
          <span class="chart-subtitle">Calories Consumed vs Calories Burned</span>
        </div>
        <div class="chart-legend">
          <span class="legend-item"><span class="legend-box" style="background: #CFF0C5;"></span> Consumed</span>
          <span class="legend-item"><span class="legend-box" style="background: #1FB622;"></span> Burned</span>
        </div>
      </div>
      <div class="bar-chart-container" style="height: ${height + 40}px;">
        ${barsHtml}
      </div>
    </div>
  `;
}

export function renderWeightJourneyChart(container, weightHistory, currentWeight = 69.5, targetWeight = 65.0, targetMonths = 3) {
  if (!container) return;

  const curW = parseFloat(currentWeight) || 69.5;
  const tgtW = parseFloat(targetWeight) || 65.0;
  const durationMonths = parseInt(targetMonths) || 3;

  // Trajectory STARTS on entered weight and ENDS on targeted weight as per estimated month
  let points = [];
  const totalDiff = tgtW - curW;

  if (durationMonths === 1) {
    points = [
      { date: "Start (Entered)", weight: curW, isStart: true },
      { date: "Week 1", weight: Math.round((curW + (totalDiff * 0.25)) * 10) / 10 },
      { date: "Week 2", weight: Math.round((curW + (totalDiff * 0.50)) * 10) / 10 },
      { date: "Week 3", weight: Math.round((curW + (totalDiff * 0.75)) * 10) / 10 },
      { date: "Month 1 (Target)", weight: tgtW, isEnd: true }
    ];
  } else if (durationMonths === 2) {
    points = [
      { date: "Start (Entered)", weight: curW, isStart: true },
      { date: "Week 2", weight: Math.round((curW + (totalDiff * 0.25)) * 10) / 10 },
      { date: "Month 1", weight: Math.round((curW + (totalDiff * 0.50)) * 10) / 10 },
      { date: "Week 6", weight: Math.round((curW + (totalDiff * 0.75)) * 10) / 10 },
      { date: "Month 2 (Target)", weight: tgtW, isEnd: true }
    ];
  } else if (durationMonths === 3) {
    points = [
      { date: "Start (Entered)", weight: curW, isStart: true },
      { date: "Week 3", weight: Math.round((curW + (totalDiff * 0.25)) * 10) / 10 },
      { date: "Month 1", weight: Math.round((curW + (totalDiff * 0.45)) * 10) / 10 },
      { date: "Month 2", weight: Math.round((curW + (totalDiff * 0.72)) * 10) / 10 },
      { date: "Month 3 (Target)", weight: tgtW, isEnd: true }
    ];
  } else if (durationMonths === 6) {
    points = [
      { date: "Start (Entered)", weight: curW, isStart: true },
      { date: "Month 1", weight: Math.round((curW + (totalDiff * 0.18)) * 10) / 10 },
      { date: "Month 2", weight: Math.round((curW + (totalDiff * 0.36)) * 10) / 10 },
      { date: "Month 3", weight: Math.round((curW + (totalDiff * 0.55)) * 10) / 10 },
      { date: "Month 4", weight: Math.round((curW + (totalDiff * 0.75)) * 10) / 10 },
      { date: "Month 6 (Target)", weight: tgtW, isEnd: true }
    ];
  } else {
    const numSteps = 5;
    points = [{ date: "Start (Entered)", weight: curW, isStart: true }];
    for (let i = 1; i < numSteps; i++) {
      const frac = i / numSteps;
      const mLabel = (frac * durationMonths).toFixed(1).replace('.0', '');
      points.push({
        date: `Month ${mLabel}`,
        weight: Math.round((curW + (totalDiff * frac)) * 10) / 10
      });
    }
    points.push({ date: `Month ${durationMonths} (Target)`, weight: tgtW, isEnd: true });
  }

  // Calculate dynamic scale bounds based on all trajectory points
  const allVals = points.map(p => p.weight);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const span = Math.max(2, maxVal - minVal);
  const minW = Math.floor(minVal - (span * 0.25));
  const maxW = Math.ceil(maxVal + (span * 0.25));
  const totalRange = maxW - minW || 1;

  const width = 640;
  const height = 240;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 35;
  const paddingBottom = 40;

  const usableW = width - paddingLeft - paddingRight;
  const usableH = height - paddingTop - paddingBottom;

  const coords = points.map((p, index) => {
    const x = paddingLeft + (index / (points.length - 1)) * usableW;
    const y = paddingTop + (1 - ((p.weight - minW) / totalRange)) * usableH;
    return { ...p, x, y };
  });

  // Calculate smooth cubic Bezier curve
  let d = `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    const cpX1 = (prev.x + (curr.x - prev.x) / 2).toFixed(1);
    const cpX2 = cpX1;
    d += ` C ${cpX1} ${prev.y.toFixed(1)}, ${cpX2} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }

  // Target reference line Y position
  const targetY = paddingTop + (1 - ((tgtW - minW) / totalRange)) * usableH;

  // 3 Horizontal reference grid lines
  const gridVals = [maxW, Math.round(((maxW + minW) / 2) * 10) / 10, minW];
  const gridLinesHtml = gridVals.map(val => {
    const gy = paddingTop + (1 - ((val - minW) / totalRange)) * usableH;
    return `
      <line x1="${paddingLeft}" y1="${gy.toFixed(1)}" x2="${width - paddingRight}" y2="${gy.toFixed(1)}" stroke="#1e2d1e" stroke-dasharray="3,4" stroke-width="1" />
      <text x="${paddingLeft - 10}" y="${(gy + 4).toFixed(1)}" fill="#888888" font-size="10" font-family="monospace" text-anchor="end">${val} kg</text>
    `;
  }).join('');

  // Markers and pill tags
  const circlesHtml = coords.map((c) => {
    const isStart = c.isStart;
    const isEnd = c.isEnd;
    const strokeColor = isStart ? "#1FB622" : (isEnd ? "#CFF0C5" : "#77aa77");
    const textColor = isStart ? "#1FB622" : (isEnd ? "#CFF0C5" : "#EEEEEE");
    const radius = (isStart || isEnd) ? 6 : 4;

    return `
      <g class="chart-marker-point">
        <circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${radius}" fill="#060606" stroke="${strokeColor}" stroke-width="2.5" />
        <rect x="${(c.x - 26).toFixed(1)}" y="${(c.y - 25).toFixed(1)}" width="52" height="19" rx="4" fill="rgba(10,18,10,0.92)" stroke="${strokeColor}" stroke-width="1" />
        <text x="${c.x.toFixed(1)}" y="${(c.y - 12).toFixed(1)}" fill="${textColor}" font-size="10.5" font-weight="700" text-anchor="middle">${c.weight} kg</text>
        <text x="${c.x.toFixed(1)}" y="${(height - 12).toFixed(1)}" fill="${isStart || isEnd ? '#EEEEEE' : '#AAAAAA'}" font-size="10" font-weight="${isStart || isEnd ? '700' : '500'}" text-anchor="middle">${c.date}</text>
      </g>
    `;
  }).join('');

  const diffToGoal = Math.abs(curW - tgtW).toFixed(1);
  const badgeText = curW === tgtW 
    ? "🎉 Goal Reached!" 
    : (curW > tgtW ? `Plan: -${diffToGoal} kg in ${durationMonths} Mo` : `Plan: +${diffToGoal} kg in ${durationMonths} Mo`);

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 16px;">
        <div>
          <h4 class="chart-title">Estimated Weight Trajectory</h4>
          <span class="chart-subtitle">Starts at Entered: <strong>${curW} kg</strong> ➔ Ends at Targeted: <strong>${tgtW} kg</strong> (${durationMonths} Months)</span>
        </div>
        <div style="background: rgba(31, 182, 34, 0.15); border: 1px solid #1FB622; color: #1FB622; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 700;">
          ${badgeText}
        </div>
      </div>
      <div class="line-chart-stage">
        <svg viewBox="0 0 ${width} ${height}" class="line-chart-svg" style="width: 100%; height: auto; max-height: 250px; display: block;" preserveAspectRatio="xMidYMid meet">
          <!-- Horizontal Grid Lines -->
          ${gridLinesHtml}

          <!-- Target Reference Dashed Line with Badge at End -->
          <line x1="${paddingLeft}" y1="${targetY.toFixed(1)}" x2="${(width - paddingRight - 110).toFixed(1)}" y2="${targetY.toFixed(1)}" stroke="#CFF0C5" stroke-dasharray="5,5" stroke-width="1.8" />
          <rect x="${(width - paddingRight - 108).toFixed(1)}" y="${(targetY - 11).toFixed(1)}" width="108" height="22" rx="4" fill="rgba(207, 240, 197, 0.15)" stroke="#CFF0C5" stroke-width="1.2" />
          <text x="${(width - paddingRight - 54).toFixed(1)}" y="${(targetY + 4).toFixed(1)}" fill="#CFF0C5" font-size="10" font-weight="700" text-anchor="middle">Goal: ${tgtW} kg (${durationMonths}M)</text>

          <!-- Gradient Area Under Curve -->
          <defs>
            <linearGradient id="weightGradCurve" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#1FB622" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#1FB622" stop-opacity="0.0"/>
            </linearGradient>
          </defs>
          <path d="${d} L ${coords[coords.length - 1].x.toFixed(1)} ${(height - paddingBottom).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(height - paddingBottom).toFixed(1)} Z" fill="url(#weightGradCurve)" />

          <!-- Main Trajectory Curve Line -->
          <path d="${d}" fill="none" stroke="#1FB622" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>

          <!-- Marker Points -->
          ${circlesHtml}
        </svg>
      </div>
    </div>
  `;
}


