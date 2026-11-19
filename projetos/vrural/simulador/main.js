document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Management (Light/Dark Mode Toggle) ---
  const themeToggle = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.classList.add(savedTheme === 'dark' ? 'theme-dark' : 'theme-light');
  } else {
    htmlElement.classList.add(systemPrefersDark ? 'theme-dark' : 'theme-light');
  }

  updateToggleIcon();

  themeToggle.addEventListener('click', () => {
    if (htmlElement.classList.contains('theme-dark')) {
      htmlElement.classList.remove('theme-dark');
      htmlElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.classList.remove('theme-light');
      htmlElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
    }
    updateToggleIcon();
  });

  function updateToggleIcon() {
    const isDark = htmlElement.classList.contains('theme-dark') ||
                   (!htmlElement.classList.contains('theme-light') && systemPrefersDark);

    if (isDark) {
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41zm-12.37 12.37c-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41z"/>
        </svg>
      `;
      themeToggle.setAttribute('aria-label', 'Ativar modo claro');
    } else {
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.6-.1 1.2.3 1.3.9.1.6-.3 1.2-.9 1.3-3.7.7-6.4 4-6.4 7.8 0 4.4 3.6 8 8 8 3.8 0 7.1-2.7 7.8-6.4.1-.6.7-1 1.3-.9.6.1 1 .7.9 1.3-.9 4.7-5 8.2-9.8 8.2z"/>
        </svg>
      `;
      themeToggle.setAttribute('aria-label', 'Ativar modo escuro');
    }
  }

  // --- 2. Interactive Agronomic Soil Calibration Simulator (Mission + Explorer Modes) ---
  const COSTS = {
    limePerTon: 200,
    incorporationPerHa: 150,
    p2o5PerKg: 4.5
  };

  const MISSIONS = {
    1: {
      id: 1,
      title: 'Missão 1: A Herança Ácida',
      level: 'Nível Básico',
      context: 'Lote recém-assumido no P.A. Nova Amazônia com pH 4.8 e Al³⁺ tóxico (1.4 cmol). Corrija a acidez do solo e garanta alta produtividade sem ultrapassar o teto orçamentário.',
      maxBudget: 1000,
      minYield: 80,
      minPh: 5.8,
      maxPh: 6.3,
      minNpk: null,
      hasVeranico: false
    },
    2: {
      id: 2,
      title: 'Missão 2: A Armadilha do Veranico',
      level: 'Nível Intermediário',
      context: 'Previsão de veranico severo de 15 dias sem chuva no Mês 3 do ciclo em Roraima. Sem incorporação do calcário a 20 cm, a raiz fica superficial e o estresse hídrico derruba a colheita em 45%.',
      maxBudget: 1050,
      minYield: 78,
      minPh: null,
      maxPh: null,
      minNpk: null,
      hasVeranico: true
    },
    3: {
      id: 3,
      title: 'Missão 3: Orçamento Enxuto & Precisão',
      level: 'Nível Avançado',
      context: 'Recurso financeiro restrito para agricultura familiar. O aluno precisa calibrar a dose exata de calcário e fósforo com máxima eficiência de NPK, sem supercalagem e dentro do teto de R$ 980/ha.',
      maxBudget: 980,
      minYield: 82,
      minPh: 5.8,
      maxPh: 6.3,
      minNpk: 85,
      hasVeranico: false
    }
  };

  // Simulator State
  let currentMode = 'mission'; // 'mission' (default) | 'explorer'
  let currentMissionId = 1;
  let currentStage = 1; // 1: Dia -90 | 2: Dia 0 | 3: Mês 3 | 4: Mês 5
  let lastNonZeroLime = 2.0;

  // Core Frame & Controls
  const simFrame = document.getElementById('simulator-frame');
  const limeControlGroup = document.getElementById('lime-control-group');
  const limeSlider = document.getElementById('lime-slider');
  const limeValBadge = document.getElementById('lime-val-badge');
  const methodRadios = document.querySelectorAll('input[name="application_method"]');
  const p2o5Radios = document.querySelectorAll('input[name="p2o5_dose"]');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Input Text Elements for Guided vs Neutral Mode
  const tickRec = document.getElementById('tick-rec');
  const tickMax = document.getElementById('tick-max');
  const methodDescInc = document.getElementById('method-desc-inc');
  const methodDescSup = document.getElementById('method-desc-sup');
  const methodDescNone = document.getElementById('method-desc-none');
  const pillSub90 = document.getElementById('pill-sub-90');
  const pillSub40 = document.getElementById('pill-sub-40');
  const pillSub0 = document.getElementById('pill-sub-0');

  // Step Wizard Card Elements (Mission Mode)
  const simCardStep1 = document.getElementById('sim-card-step1');
  const step1StatusTag = document.getElementById('step1-status-tag');
  const step1Content = document.getElementById('step1-content');
  const step1Summary = document.getElementById('step1-summary');
  const step1SummaryLime = document.getElementById('step1-summary-lime');
  const step1SummaryMethod = document.getElementById('step1-summary-method');
  const step1Actions = document.getElementById('step1-actions');
  const btnStep1Confirm = document.getElementById('btn-step1-confirm');

  const simCardStep2 = document.getElementById('sim-card-step2');
  const step2StatusTag = document.getElementById('step2-status-tag');
  const step2LockedMsg = document.getElementById('step2-locked-msg');
  const step2Content = document.getElementById('step2-content');
  const step2ReactionBox = document.getElementById('step2-reaction-box');
  const step2ReactPh = document.getElementById('step2-react-ph');
  const step2ReactV = document.getElementById('step2-react-v');
  const step2ReactAl = document.getElementById('step2-react-al');
  const step2ReactNote = document.getElementById('step2-react-note');
  const step2Summary = document.getElementById('step2-summary');
  const step2SummaryP2o5 = document.getElementById('step2-summary-p2o5');
  const step2Actions = document.getElementById('step2-actions');
  const btnStep2Back = document.getElementById('btn-step2-back');
  const btnStep2Confirm = document.getElementById('btn-step2-confirm');

  const simCardStep3 = document.getElementById('sim-card-step3');
  const step3StatusTag = document.getElementById('step3-status-tag');
  const step3LockedMsg = document.getElementById('step3-locked-msg');
  const step3Content = document.getElementById('step3-content');
  const step3DiagRoot = document.getElementById('step3-diag-root');
  const step3DiagP = document.getElementById('step3-diag-p');
  const step3DiagWater = document.getElementById('step3-diag-water');
  const step3Actions = document.getElementById('step3-actions');
  const btnStep3Back = document.getElementById('btn-step3-back');
  const btnStep3Confirm = document.getElementById('btn-step3-confirm');

  const simCardStep4 = document.getElementById('sim-card-step4');
  const step4StatusTag = document.getElementById('step4-status-tag');
  const step4LockedMsg = document.getElementById('step4-locked-msg');
  const step4Content = document.getElementById('step4-content');
  const btnStep4Laudo = document.getElementById('btn-step4-laudo');
  const btnStep4Restart = document.getElementById('btn-step4-restart');

  // Mode & Mission Elements
  const modeTabMission = document.getElementById('mode-tab-mission');
  const modeTabExplorer = document.getElementById('mode-tab-explorer');
  const simMissionPanel = document.getElementById('sim-mission-panel');
  const simPresetsBar = document.getElementById('sim-presets-bar');
  const missionButtons = document.querySelectorAll('.mission-tab');
  const missionLevelBadge = document.getElementById('mission-level-badge');
  const missionTitleEl = document.getElementById('mission-title');
  const missionContextEl = document.getElementById('mission-context');
  const missionGoalsList = document.getElementById('mission-goals-list');
  const missionCostVal = document.getElementById('mission-cost-val');
  const missionBudgetLimit = document.getElementById('mission-budget-limit');
  const missionBudgetBadge = document.getElementById('mission-budget-badge');
  const missionBudgetBar = document.getElementById('mission-budget-bar');
  const costLimeVal = document.getElementById('cost-lime-val');
  const costMethodVal = document.getElementById('cost-method-val');
  const costP2o5Val = document.getElementById('cost-p2o5-val');

  // Timeline Elements
  const simTimelineBar = document.getElementById('sim-timeline-bar');
  const stageButtons = document.querySelectorAll('.timeline-step');
  const btnNextStage = document.getElementById('btn-next-stage');
  const btnCompleteCycle = document.getElementById('btn-complete-cycle');
  const simClimateBanner = document.getElementById('sim-climate-banner');
  const climateBannerTitle = document.getElementById('climate-banner-title');
  const climateBannerDesc = document.getElementById('climate-banner-desc');
  const simMissionVerdict = document.getElementById('sim-mission-verdict');
  const verdictStatusBadge = document.getElementById('verdict-status-badge');
  const verdictTitle = document.getElementById('verdict-title');
  const verdictCauseEffect = document.getElementById('verdict-cause-effect');
  const verdictChecklist = document.getElementById('verdict-checklist');

  // HUD Displays
  const hudPhVal = document.getElementById('hud-ph-val');
  const hudPhBadge = document.getElementById('hud-ph-badge');
  const hudVVal = document.getElementById('hud-v-val');
  const hudVBadge = document.getElementById('hud-v-badge');
  const hudAlVal = document.getElementById('hud-al-val');
  const hudAlBadge = document.getElementById('hud-al-badge');
  const hudNpkVal = document.getElementById('hud-npk-val');
  const hudNpkBadge = document.getElementById('hud-npk-badge');

  // Yield & Economic Displays
  const yieldVal = document.getElementById('yield-val');
  const yieldDiffLabel = document.getElementById('yield-diff-label');
  const economicVal = document.getElementById('economic-val');
  const economicDetailLabel = document.getElementById('economic-detail-label');

  // Feedback Elements
  const feedbackBox = document.getElementById('feedback-box');
  const feedbackIcon = document.getElementById('feedback-icon');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackRule = document.getElementById('feedback-rule');
  const simSummaryNote = document.getElementById('sim-summary-note');

  // SVG Graphic Elements
  const svgSoilLayer1 = document.getElementById('svg-soil-layer-1');
  const svgLayer1Label = document.getElementById('svg-layer1-label');
  const svgLayer2Label = document.getElementById('svg-layer2-label');
  const svgCornShoot = document.getElementById('svg-corn-shoot');
  const svgRootsGroup = document.getElementById('svg-roots-group');

  // Modal Elements
  const laudoDialog = document.getElementById('laudo-dialog');
  const btnOpenLaudo = document.getElementById('btn-open-laudo');
  const laudoCloseBtn = document.getElementById('laudo-close-btn');
  const laudoCloseAction = document.getElementById('laudo-close-action');
  const laudoPrintBtn = document.getElementById('laudo-print-btn');
  const btnSimReset = document.getElementById('btn-sim-reset');

  // Modal Table Fields
  const laudoScoreVal = document.getElementById('laudo-score-val');
  const laudoScoreTag = document.getElementById('laudo-score-tag');
  const laudoRiskLabel = document.getElementById('laudo-risk-label');
  const laudoTdMission = document.getElementById('laudo-td-mission');
  const laudoTdMissionTarget = document.getElementById('laudo-td-mission-target');
  const laudoTdCost = document.getElementById('laudo-td-cost');
  const laudoTdBudget = document.getElementById('laudo-td-budget');
  const laudoTdLime = document.getElementById('laudo-td-lime');
  const laudoTdMethod = document.getElementById('laudo-td-method');
  const laudoTdP2o5 = document.getElementById('laudo-td-p2o5');
  const laudoTdPh = document.getElementById('laudo-td-ph');
  const laudoTdYield = document.getElementById('laudo-td-yield');
  const laudoTdYieldTarget = document.getElementById('laudo-td-yield-target');

  function syncSliderCSS(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 4.5;
    const val = parseFloat(slider.value) || 0;
    slider.style.setProperty('--control-value', val);
    slider.style.setProperty('--attr-min', min);
    slider.style.setProperty('--attr-max', max);
  }

  function getSelectedMethod() {
    const checked = document.querySelector('input[name="application_method"]:checked');
    return checked ? checked.value : 'inc-60-90';
  }

  function getSelectedP2O5() {
    const checked = document.querySelector('input[name="p2o5_dose"]:checked');
    return checked ? parseFloat(checked.value) : 90;
  }

  function formatBRL(value) {
    return `R$ ${Math.round(value).toLocaleString('pt-BR')}`;
  }

  function syncLimeSliderEnabled(method) {
    if (!limeSlider) return;
    const isDisabled = method === 'sem-calagem';
    limeSlider.disabled = isDisabled;
    if (limeControlGroup) {
      limeControlGroup.classList.toggle('is-disabled', isDisabled);
    }
  }

  function applyMissionInitialDefaults() {
    if (!limeSlider) return;
    lastNonZeroLime = 2.0;
    limeSlider.value = '1.0';
    const incRadio = document.querySelector('input[name="application_method"][value="inc-60-90"]');
    if (incRadio) incRadio.checked = true;
    const p40Radio = document.querySelector('input[name="p2o5_dose"][value="40"]');
    if (p40Radio) p40Radio.checked = true;
    syncLimeSliderEnabled('inc-60-90');
  }

  /**
   * Computes agronomic state, costs, and mission checks from current inputs.
   * Respects Embrapa base saturation formula (CTC=6.0, PRNT=85%), Liebig's Law of the Minimum,
   * and Mitscherlich diminishing returns.
   */
  function computeAgronomicModel() {
    const method = getSelectedMethod();
    const rawLimeDose = parseFloat(limeSlider.value);
    const limeDose = method === 'sem-calagem' ? 0 : rawLimeDose;
    const p2o5 = getSelectedP2O5();

    let effectiveLime = limeDose;
    let isSuperficial = false;
    let isNoLime = false;

    if (method === 'sem-calagem' || limeDose === 0) {
      effectiveLime = 0;
      isNoLime = true;
    } else if (method === 'sup-vespera') {
      effectiveLime = limeDose * 0.28; // Only 28% reacts in top 2-3 cm; subsoil remains untreated
      isSuperficial = true;
    }

    // 1. pH calculation (0-20 cm effective zone)
    let calcPh = 4.8 + (effectiveLime * 0.55);
    calcPh = Math.min(Math.max(calcPh, 4.8), 7.3);

    // 2. Base saturation (V%) using V2 = V1 + (NC * PRNT) / T (T=6.0, PRNT=85%)
    let calcV = 28 + (effectiveLime * (85 / 6.0));
    calcV = Math.min(Math.max(calcV, 28), 78);

    // 3. Active Aluminum (Al3+) in root zone (0-20 cm)
    let calcAl = 0;
    if (isNoLime) {
      calcAl = 1.4;
    } else if (isSuperficial) {
      calcAl = Math.max(0.9, 1.4 - (effectiveLime * 0.45)); // Subsoil below 3 cm stays toxic
    } else {
      calcAl = Math.max(0, 1.4 - (effectiveLime * 0.8));
    }

    // 4. NPK Efficiency respecting Liebig's Law of the Minimum (native P = 3.5 mg/dm³)
    let npkEff = 32;
    if (p2o5 === 0) {
      npkEff = isNoLime ? 24 : (isSuperficial ? 28 : 35);
    } else if (isNoLime) {
      npkEff = 32;
    } else if (isSuperficial) {
      npkEff = 44;
    } else if (calcPh >= 5.8 && calcPh <= 6.3) {
      npkEff = p2o5 >= 90 ? 94 : 86;
    } else if (calcPh > 6.3 && calcPh <= 6.8) {
      npkEff = Math.round((p2o5 >= 90 ? 90 : 82) - ((calcPh - 6.3) / 0.5) * 14);
    } else if (calcPh > 6.8) {
      npkEff = 60; // Calcium-phosphate precipitation & Zn/Fe/Mn blockage
    } else {
      npkEff = Math.round(32 + ((calcPh - 4.8) / 1.0) * (p2o5 >= 90 ? 58 : 50));
    }
    npkEff = Math.min(Math.max(Math.round(npkEff), 20), 96);

    // 5. Base Yield Calculation (sacas / ha) under Law of the Minimum & Diminishing Returns
    let estYield = 28;
    if (isNoLime) {
      estYield = p2o5 === 0 ? 28 : (p2o5 === 40 ? 31 : 33);
    } else if (isSuperficial) {
      estYield = p2o5 === 0 ? 31 : (p2o5 === 40 ? 40 : 48);
    } else {
      let phFactor = 1.0;
      if (calcPh < 5.8) {
        phFactor = (calcPh - 4.8) / 1.0;
      } else if (calcPh > 6.3) {
        phFactor = Math.max(0.55, 1.0 - (calcPh - 6.3) * 0.48);
      }

      if (p2o5 === 0) {
        estYield = Math.round(28 + 14 * phFactor);
      } else if (p2o5 === 40) {
        estYield = Math.round(28 + 46 * phFactor);
      } else {
        estYield = Math.round(28 + 58 * phFactor + (calcPh >= 5.8 && calcPh <= 6.3 ? 2 : 0));
      }
    }

    // Mission 2 Climatic Rule: Veranico de 15 dias no Mês 3
    const mission = MISSIONS[currentMissionId];
    const hasDeepRoots = !isNoLime && !isSuperficial && calcAl <= 0.1 && effectiveLime >= 1.8;
    let veranicoPenaltyApplied = false;

    if (currentMode === 'mission' && mission.hasVeranico && !hasDeepRoots) {
      estYield = Math.round(estYield * 0.55); // 45% yield collapse due to shallow roots
      veranicoPenaltyApplied = true;
    }

    // 6. Costs & Economic Balance
    const limeCost = isNoLime ? 0 : limeDose * COSTS.limePerTon;
    const methodCost = method === 'inc-60-90' ? COSTS.incorporationPerHa : 0;
    const p2o5Cost = p2o5 * COSTS.p2o5PerKg;
    const stage1CommittedCost = Math.round(limeCost + methodCost);
    const totalCost = Math.round(limeCost + methodCost + p2o5Cost);

    const baseRevenue = 28 * 60; // R$ 1.680/ha
    const simRevenue = estYield * 60;
    const explorerNetGain = Math.max(0, (simRevenue - baseRevenue) - limeCost);
    const missionNetGain = (simRevenue - baseRevenue) - totalCost;

    // 7. Evaluate Mission Goals
    const phRounded = parseFloat(calcPh.toFixed(1));
    const goalChecks = evaluateMissionGoals(mission, {
      estYield,
      calcPh: phRounded,
      npkEff,
      totalCost,
      hasDeepRoots
    });

    return {
      limeDose,
      method,
      p2o5,
      effectiveLime,
      isSuperficial,
      isNoLime,
      hasDeepRoots,
      veranicoPenaltyApplied,
      calcPh,
      phRounded,
      calcV,
      calcAl,
      npkEff,
      estYield,
      limeCost,
      methodCost,
      p2o5Cost,
      stage1CommittedCost,
      totalCost,
      explorerNetGain,
      missionNetGain,
      mission,
      goalChecks
    };
  }

  function evaluateMissionGoals(mission, metrics) {
    const checks = [];

    checks.push({
      label: `Produtividade ≥ ${mission.minYield} sc/ha`,
      met: metrics.estYield >= mission.minYield,
      actual: `${metrics.estYield} sc/ha`
    });

    if (mission.id === 1) {
      checks.push({
        label: 'pH entre 5.8 e 6.3',
        met: metrics.calcPh >= 5.8 && metrics.calcPh <= 6.3,
        actual: `pH ${metrics.calcPh.toFixed(1)}`
      });
    }

    if (mission.id === 2) {
      checks.push({
        label: 'Raiz profunda (> 40 cm) contra Veranico',
        met: metrics.hasDeepRoots,
        actual: metrics.hasDeepRoots ? 'Resistente' : 'Estresse Hídrico (-45%)'
      });
    }

    if (mission.id === 3) {
      checks.push({
        label: `Eficiência NPK ≥ ${mission.minNpk}%`,
        met: metrics.npkEff >= mission.minNpk,
        actual: `${metrics.npkEff}%`
      });
      checks.push({
        label: 'Sem supercalagem (pH ≤ 6.3)',
        met: metrics.calcPh <= 6.3,
        actual: `pH ${metrics.calcPh.toFixed(1)}`
      });
    }

    checks.push({
      label: `Orçamento ≤ ${formatBRL(mission.maxBudget)}/ha`,
      met: metrics.totalCost <= mission.maxBudget,
      actual: `${formatBRL(metrics.totalCost)}/ha`
    });

    const allMet = checks.every(c => c.met);
    return { checks, allMet };
  }

  function updateMissionPanel(model) {
    if (!simMissionPanel) return;
    const { mission, limeCost, methodCost, p2o5Cost, stage1CommittedCost, totalCost, goalChecks } = model;
    const isStage1 = currentStage === 1;
    const displayedCost = isStage1 ? stage1CommittedCost : totalCost;

    missionLevelBadge.textContent = mission.level;
    missionTitleEl.textContent = mission.title;
    missionContextEl.textContent = mission.context;

    // Budget Meter
    missionCostVal.textContent = formatBRL(displayedCost);
    missionBudgetLimit.textContent = `/ Limite: ${formatBRL(mission.maxBudget)}/ha`;
    costLimeVal.textContent = formatBRL(limeCost);
    costMethodVal.textContent = formatBRL(methodCost);
    costP2o5Val.textContent = isStage1 ? 'A definir (Dia 0)' : formatBRL(p2o5Cost);

    const pct = Math.min(100, (displayedCost / mission.maxBudget) * 100);
    missionBudgetBar.style.width = `${pct}%`;

    const overBudget = displayedCost > mission.maxBudget;
    missionBudgetBar.classList.toggle('over-budget', overBudget);

    if (overBudget) {
      missionBudgetBadge.textContent = `Estouro: +${formatBRL(displayedCost - mission.maxBudget)}`;
      missionBudgetBadge.style.color = 'var(--accent-coral)';
      missionBudgetBadge.style.background = 'rgba(248, 113, 113, 0.14)';
      missionBudgetBadge.style.borderColor = 'rgba(248, 113, 113, 0.35)';
    } else {
      missionBudgetBadge.textContent = isStage1 ? 'Planejamento Dia -90' : 'Dentro do Orçamento';
      missionBudgetBadge.style.color = 'var(--accent-emerald)';
      missionBudgetBadge.style.background = 'rgba(16, 185, 129, 0.12)';
      missionBudgetBadge.style.borderColor = 'rgba(16, 185, 129, 0.25)';
    }

    // Goals Chips (in Mission mode, evaluation is fully confirmed at Stage 4; budget is live)
    const showAllStatus = currentStage === 4;
    missionGoalsList.innerHTML = goalChecks.checks.map(check => {
      const isBudgetChip = check.label.startsWith('Orçamento');
      let cls = 'mission-goal-item';
      let icon = '•';

      if (showAllStatus || isBudgetChip) {
        const met = isBudgetChip ? !overBudget : check.met;
        cls += met ? ' goal-met' : ' goal-fail';
        icon = met ? '✓' : '✕';
      }
      return `<li class="${cls}"><span>${icon}</span><span>${check.label}</span></li>`;
    }).join('');
  }

  function updateTimelineUI() {
    if (!simTimelineBar) return;

    stageButtons.forEach(btn => {
      const stage = parseInt(btn.getAttribute('data-stage'), 10);
      btn.classList.toggle('active', stage === currentStage);
      btn.classList.toggle('completed', stage < currentStage);
    });

    if (btnNextStage) {
      btnNextStage.textContent = currentStage < 4 ? 'Avançar Etapa ➔' : 'Reiniciar Ciclo ↺';
    }
  }

  function setCardState(cardEl, state, tagEl, tagText) {
    if (!cardEl) return;
    cardEl.classList.toggle('is-active', state === 'active');
    cardEl.classList.toggle('is-completed', state === 'completed');
    cardEl.classList.toggle('is-locked', state === 'locked');
    if (tagEl) tagEl.textContent = tagText;
  }

  /**
   * Updates Card Wizard state in Mission Mode.
   * Gated progression: Card 1 -> Card 2 -> Card 3 -> Card 4.
   */
  function updateCardWizardUI(model) {
    if (currentMode !== 'mission') return;

    const methodLabel = model.method === 'inc-60-90'
      ? 'Incorporado a 20 cm'
      : (model.method === 'sup-vespera' ? 'Superficial na véspera' : 'Sem calagem');

    if (step1SummaryLime) step1SummaryLime.textContent = `${model.limeDose.toFixed(1)} t/ha`;
    if (step1SummaryMethod) step1SummaryMethod.textContent = methodLabel;
    if (step2SummaryP2o5) step2SummaryP2o5.textContent = `${model.p2o5} kg/ha de P₂O₅ no sulco`;

    // Populate Step 2 post-reaction summary box (90 days after Stage 1)
    if (step2ReactionBox) {
      step2ReactPh.textContent = model.calcPh.toFixed(1);
      step2ReactV.textContent = `${Math.round(model.calcV)}%`;
      step2ReactAl.textContent = `${model.calcAl.toFixed(1)} cmol`;
      step2ReactionBox.classList.remove('is-acid-warn', 'is-surface-warn');
      if (model.isNoLime || model.calcAl > 0.3) {
        if (model.isSuperficial) {
          step2ReactionBox.classList.add('is-surface-warn');
          step2ReactNote.textContent = 'Calcário sem incorporação reagiu apenas nos 2–3 cm superficiais; o subsolo permanece com Al³⁺ ativo.';
        } else {
          step2ReactionBox.classList.add('is-acid-warn');
          step2ReactNote.textContent = model.isNoLime
            ? 'Nenhuma calagem realizada: acidez severa e Al³⁺ livre permanecem ativos no sulco de semeadura.'
            : 'Dose insuficiente para neutralizar completamente o Al³⁺ na camada de 0–20 cm.';
        }
      } else if (model.calcPh > 6.3) {
        step2ReactionBox.classList.add('is-surface-warn');
        step2ReactNote.textContent = 'Reação concluída com alcalinidade elevada (V% > 65%), com risco de indisponibilidade de micronutrientes.';
      } else {
        step2ReactNote.textContent = 'Reação de neutralização concluída na camada arável (0–20 cm). Ambiente propício à absorção de fósforo.';
      }
    }

    // Populate Step 3 physiological diagnostics box (75 DAE / VT stage)
    if (step3DiagRoot && step3DiagP && step3DiagWater) {
      if (model.isNoLime || (model.calcPh < 5.2 && !model.isSuperficial)) {
        step3DiagRoot.textContent = '10 cm (Atrofia radicular por Al³⁺)';
      } else if (model.isSuperficial) {
        step3DiagRoot.textContent = '12–15 cm (Confinada à superfície)';
      } else if (!model.hasDeepRoots) {
        step3DiagRoot.textContent = '22–28 cm (Exploração parcial)';
      } else {
        step3DiagRoot.textContent = '> 40 cm (Subsolo bem explorado)';
      }

      if (model.p2o5 === 0) {
        step3DiagP.textContent = 'Deficiência severa (Sem P₂O₅; solo 3.5 mg)';
      } else if (model.isNoLime || model.isSuperficial) {
        step3DiagP.textContent = `Baixa eficiência (${model.npkEff}% • Fixação química)`;
      } else if (model.p2o5 === 40) {
        step3DiagP.textContent = `Subdose no sulco (${model.npkEff}% de eficiência)`;
      } else if (model.calcPh > 6.8) {
        step3DiagP.textContent = `Reduzida (${model.npkEff}% • Precipitação c/ Ca)`;
      } else {
        step3DiagP.textContent = `Alta disponibilidade (${model.npkEff}% aproveitado)`;
      }

      if (model.mission.hasVeranico) {
        step3DiagWater.textContent = model.hasDeepRoots
          ? 'Túrgida (Resistiu aos 15 dias sem chuva)'
          : 'Murchamento severo (Estresse hídrico em VT)';
      } else {
        step3DiagWater.textContent = model.hasDeepRoots
          ? 'Planta vigorosa em pendoamento (VT)'
          : 'Desenvolvimento vegetativo limitado';
      }
    }

    if (currentStage === 1) {
      // Step 1 active
      setCardState(simCardStep1, 'active', step1StatusTag, 'Decisão Ativa');
      if (step1Content) step1Content.classList.remove('is-hidden');
      if (step1Summary) step1Summary.classList.add('is-hidden');
      if (step1Actions) step1Actions.classList.remove('is-hidden');

      // Step 2 locked
      setCardState(simCardStep2, 'locked', step2StatusTag, 'Aguardando Passo 1');
      if (step2LockedMsg) step2LockedMsg.classList.remove('is-hidden');
      if (step2Content) step2Content.classList.add('is-hidden');
      if (step2Summary) step2Summary.classList.add('is-hidden');
      if (step2Actions) step2Actions.classList.add('is-hidden');

      // Step 3 locked
      setCardState(simCardStep3, 'locked', step3StatusTag, 'Aguardando Passo 2');
      if (step3LockedMsg) step3LockedMsg.classList.remove('is-hidden');
      if (step3Content) step3Content.classList.add('is-hidden');
      if (step3Actions) step3Actions.classList.add('is-hidden');

      // Step 4 locked
      setCardState(simCardStep4, 'locked', step4StatusTag, 'Aguardando Passo 3');
      if (step4LockedMsg) step4LockedMsg.classList.remove('is-hidden');
      if (step4Content) step4Content.classList.add('is-hidden');
    } else if (currentStage === 2) {
      // Step 1 completed
      setCardState(simCardStep1, 'completed', step1StatusTag, '✓ Confirmado');
      if (step1Content) step1Content.classList.add('is-hidden');
      if (step1Summary) step1Summary.classList.remove('is-hidden');
      if (step1Actions) step1Actions.classList.add('is-hidden');

      // Step 2 active
      setCardState(simCardStep2, 'active', step2StatusTag, 'Decisão Ativa');
      if (step2LockedMsg) step2LockedMsg.classList.add('is-hidden');
      if (step2Content) step2Content.classList.remove('is-hidden');
      if (step2Summary) step2Summary.classList.add('is-hidden');
      if (step2Actions) step2Actions.classList.remove('is-hidden');

      // Step 3 locked
      setCardState(simCardStep3, 'locked', step3StatusTag, 'Aguardando Passo 2');
      if (step3LockedMsg) step3LockedMsg.classList.remove('is-hidden');
      if (step3Content) step3Content.classList.add('is-hidden');
      if (step3Actions) step3Actions.classList.add('is-hidden');

      // Step 4 locked
      setCardState(simCardStep4, 'locked', step4StatusTag, 'Aguardando Passo 3');
      if (step4LockedMsg) step4LockedMsg.classList.remove('is-hidden');
      if (step4Content) step4Content.classList.add('is-hidden');
    } else if (currentStage === 3) {
      // Step 1 completed
      setCardState(simCardStep1, 'completed', step1StatusTag, '✓ Confirmado');
      if (step1Content) step1Content.classList.add('is-hidden');
      if (step1Summary) step1Summary.classList.remove('is-hidden');
      if (step1Actions) step1Actions.classList.add('is-hidden');

      // Step 2 completed
      setCardState(simCardStep2, 'completed', step2StatusTag, '✓ Confirmado');
      if (step2LockedMsg) step2LockedMsg.classList.add('is-hidden');
      if (step2Content) step2Content.classList.add('is-hidden');
      if (step2Summary) step2Summary.classList.remove('is-hidden');
      if (step2Actions) step2Actions.classList.add('is-hidden');

      // Step 3 active
      setCardState(simCardStep3, 'active', step3StatusTag, 'Acompanhamento');
      if (step3LockedMsg) step3LockedMsg.classList.add('is-hidden');
      if (step3Content) step3Content.classList.remove('is-hidden');
      if (step3Actions) step3Actions.classList.remove('is-hidden');

      // Step 4 locked
      setCardState(simCardStep4, 'locked', step4StatusTag, 'Aguardando Passo 3');
      if (step4LockedMsg) step4LockedMsg.classList.remove('is-hidden');
      if (step4Content) step4Content.classList.add('is-hidden');
    } else if (currentStage === 4) {
      // Step 1 completed
      setCardState(simCardStep1, 'completed', step1StatusTag, '✓ Confirmado');
      if (step1Content) step1Content.classList.add('is-hidden');
      if (step1Summary) step1Summary.classList.remove('is-hidden');
      if (step1Actions) step1Actions.classList.add('is-hidden');

      // Step 2 completed
      setCardState(simCardStep2, 'completed', step2StatusTag, '✓ Confirmado');
      if (step2LockedMsg) step2LockedMsg.classList.add('is-hidden');
      if (step2Content) step2Content.classList.add('is-hidden');
      if (step2Summary) step2Summary.classList.remove('is-hidden');
      if (step2Actions) step2Actions.classList.add('is-hidden');

      // Step 3 completed
      setCardState(simCardStep3, 'completed', step3StatusTag, '✓ Concluído');
      if (step3LockedMsg) step3LockedMsg.classList.add('is-hidden');
      if (step3Content) step3Content.classList.add('is-hidden');
      if (step3Actions) step3Actions.classList.add('is-hidden');

      // Step 4 active
      setCardState(simCardStep4, 'active', step4StatusTag, 'Safra Colhida');
      if (step4LockedMsg) step4LockedMsg.classList.add('is-hidden');
      if (step4Content) step4Content.classList.remove('is-hidden');
    }
  }

  /**
   * Updates HUD Metrics respecting soil chemical reaction kinetics.
   * Mission Mode:
   *  - Stage 1 (Dia -90): Shows original baseline soil while lime is incubating (prevents slider spoilers).
   *  - Stage 2 (Dia 0): Reveals post-90-day soil chemistry; NPK stays pending until Month 3.
   *  - Stage 3 (Mês 3 / VT): Reveals NPK uptake efficiency in neutral telemetry.
   *  - Stage 4 (Mês 5 / R6): Unlocks full colored evaluation badges.
   * Explorer Mode: Instant full evaluation.
   */
  function updateSoilMetricsHUD(model) {
    const { calcPh, calcV, calcAl, npkEff, isSuperficial } = model;
    const isMission = currentMode === 'mission';

    if (isMission && currentStage === 1) {
      hudPhVal.textContent = '4.8';
      hudPhBadge.textContent = 'Em incubação (60-90d)';
      hudPhBadge.className = 'hud-stat-status status-neutral';

      hudVVal.textContent = '28%';
      hudVBadge.textContent = 'Aguardando reação';
      hudVBadge.className = 'hud-stat-status status-neutral';

      hudAlVal.textContent = '1.4 cmol';
      hudAlBadge.textContent = 'Neutralização em curso';
      hudAlBadge.className = 'hud-stat-status status-neutral';

      hudNpkVal.textContent = '-- %';
      hudNpkBadge.textContent = 'Aguardando Dia 0';
      hudNpkBadge.className = 'hud-stat-status status-neutral';
      return;
    }

    hudPhVal.textContent = calcPh.toFixed(1);
    hudVVal.textContent = `${Math.round(calcV)}%`;
    hudAlVal.textContent = isSuperficial ? `${calcAl.toFixed(1)} cmol` : `${calcAl.toFixed(1)} cmol`;

    if (isMission && currentStage < 4) {
      hudPhBadge.textContent = 'Análise Pós-Reação (0-20 cm)';
      hudPhBadge.className = 'hud-stat-status status-neutral';

      hudVBadge.textContent = 'Saturação Efetiva';
      hudVBadge.className = 'hud-stat-status status-neutral';

      hudAlBadge.textContent = isSuperficial ? 'Subsolo (5-20 cm)' : 'Al³⁺ Trocável (0-20 cm)';
      hudAlBadge.className = 'hud-stat-status status-neutral';

      if (currentStage === 2) {
        hudNpkVal.textContent = 'Em absorção';
        hudNpkBadge.textContent = 'Medido no Mês 3 (VT)';
        hudNpkBadge.className = 'hud-stat-status status-neutral';
      } else {
        hudNpkVal.textContent = `${npkEff}%`;
        hudNpkBadge.textContent = 'Eficiência Medida (VT)';
        hudNpkBadge.className = 'hud-stat-status status-neutral';
      }
      return;
    }

    // Evaluated Badges (Explorer Mode or Mission Stage 4)
    if (calcPh < 5.3) {
      hudPhBadge.textContent = 'Ácido Severo (< 5.3)';
      hudPhBadge.className = 'hud-stat-status status-danger';
    } else if (calcPh >= 5.8 && calcPh <= 6.3) {
      hudPhBadge.textContent = 'Faixa Ideal Embrapa (5.8 - 6.3)';
      hudPhBadge.className = 'hud-stat-status status-ideal';
    } else if (calcPh > 6.8) {
      hudPhBadge.textContent = 'Supercalagem (> 6.8)';
      hudPhBadge.className = 'hud-stat-status status-warning';
    } else {
      hudPhBadge.textContent = 'Moderado (Em correção)';
      hudPhBadge.className = 'hud-stat-status status-warning';
    }

    if (calcV < 45) {
      hudVBadge.textContent = 'Crítico (Meta: 60%)';
      hudVBadge.className = 'hud-stat-status status-danger';
    } else if (calcV >= 55 && calcV <= 65) {
      hudVBadge.textContent = 'Meta Atingida (55 - 65%)';
      hudVBadge.className = 'hud-stat-status status-ideal';
    } else if (calcV > 70) {
      hudVBadge.textContent = 'Excesso de Bases (> 70%)';
      hudVBadge.className = 'hud-stat-status status-warning';
    } else {
      hudVBadge.textContent = 'Subótimo (Meta: 60%)';
      hudVBadge.className = 'hud-stat-status status-warning';
    }

    if (isSuperficial) {
      hudAlVal.textContent = `${calcAl.toFixed(1)} cmol`;
      hudAlBadge.textContent = 'Tóxico no Subsolo';
      hudAlBadge.className = 'hud-stat-status status-danger';
    } else if (calcAl > 0.3) {
      hudAlVal.textContent = `${calcAl.toFixed(1)} cmol`;
      hudAlBadge.textContent = 'Tóxico para Raiz';
      hudAlBadge.className = 'hud-stat-status status-danger';
    } else {
      hudAlVal.textContent = '0.0 cmol';
      hudAlBadge.textContent = 'Totalmente Neutralizado';
      hudAlBadge.className = 'hud-stat-status status-ideal';
    }

    hudNpkVal.textContent = `${npkEff}%`;
    if (model.p2o5 === 0) {
      hudNpkBadge.textContent = 'Sem Adubação Fosfatada';
      hudNpkBadge.className = 'hud-stat-status status-danger';
    } else if (npkEff < 50) {
      hudNpkBadge.textContent = 'Fósforo Travado pelo Al³⁺';
      hudNpkBadge.className = 'hud-stat-status status-danger';
    } else if (npkEff >= 80) {
      hudNpkBadge.textContent = 'Adubo Altamente Eficiente';
      hudNpkBadge.className = 'hud-stat-status status-ideal';
    } else {
      hudNpkBadge.textContent = 'Aproveitamento Médio';
      hudNpkBadge.className = 'hud-stat-status status-warning';
    }
  }

  function updateSoilLayerVisuals(ph, isSuperficial, isNoLime) {
    if (!svgSoilLayer1) return;

    const isMissionPreHarvest = (currentMode === 'mission' && currentStage < 4);
    const isMissionStage1 = (currentMode === 'mission' && currentStage === 1);

    if (isMissionStage1) {
      svgSoilLayer1.setAttribute('fill', 'url(#soilTopAcid)');
      svgLayer1Label.textContent = isNoLime
        ? 'Solo Nativo Ácido (0 - 20 cm)'
        : 'Camada Arável (Em reação • 0-20 cm)';
      svgLayer1Label.setAttribute('fill', '#9ca3af');
      svgLayer2Label.textContent = 'Subsolo (20 - 50 cm)';
      svgLayer2Label.setAttribute('fill', '#9ca3af');
      return;
    }

    if (isNoLime || (ph < 5.2 && !isSuperficial)) {
      svgSoilLayer1.setAttribute('fill', 'url(#soilTopAcid)');
      if (isMissionPreHarvest) {
        svgLayer1Label.textContent = `Camada Arável (pH ${ph.toFixed(1)})`;
        svgLayer1Label.setAttribute('fill', '#9ca3af');
        svgLayer2Label.textContent = 'Subsolo (20 - 50 cm)';
        svgLayer2Label.setAttribute('fill', '#9ca3af');
      } else {
        svgLayer1Label.textContent = `Zona Ácida (pH ${ph.toFixed(1)} • Al³⁺ Livre)`;
        svgLayer1Label.setAttribute('fill', '#f87171');
        svgLayer2Label.textContent = 'Subsolo Tóxico para Raízes';
        svgLayer2Label.setAttribute('fill', '#f87171');
      }
    } else if (isSuperficial) {
      svgSoilLayer1.setAttribute('fill', 'url(#soilTopCorrected)');
      if (isMissionPreHarvest) {
        svgLayer1Label.textContent = 'Camada Arável (0 - 20 cm)';
        svgLayer1Label.setAttribute('fill', '#9ca3af');
        svgLayer2Label.textContent = 'Subsolo (20 - 50 cm)';
        svgLayer2Label.setAttribute('fill', '#9ca3af');
      } else {
        svgLayer1Label.textContent = 'Superfície Corrigida (0-5 cm)';
        svgLayer1Label.setAttribute('fill', '#fbbf24');
        svgLayer2Label.textContent = 'Subsolo Ácido (5-20 cm Al³⁺ Ativo)';
        svgLayer2Label.setAttribute('fill', '#f87171');
      }
    } else {
      svgSoilLayer1.setAttribute('fill', 'url(#soilTopCorrected)');
      if (isMissionPreHarvest) {
        svgLayer1Label.textContent = `Camada Arável (pH ${ph.toFixed(1)})`;
        svgLayer1Label.setAttribute('fill', '#9ca3af');
        svgLayer2Label.textContent = 'Subsolo (20 - 50 cm)';
        svgLayer2Label.setAttribute('fill', '#9ca3af');
      } else {
        svgLayer1Label.textContent = `Zona Calibrada a 20 cm (pH ${ph.toFixed(1)})`;
        svgLayer1Label.setAttribute('fill', '#00f58d');
        svgLayer2Label.textContent = 'Subsolo Descompactado e Seguro';
        svgLayer2Label.setAttribute('fill', '#9ca3af');
      }
    }
  }

  function updateSvgStage1(model) {
    updateSoilLayerVisuals(model.calcPh, model.isSuperficial, model.isNoLime);

    if (model.isNoLime) {
      svgCornShoot.innerHTML = `
        <text x="0" y="-22" text-anchor="middle" fill="#9ca3af" font-family="Outfit, sans-serif" font-size="11" font-weight="600">Solo Original Sem Calagem (Dia -90)</text>
      `;
      svgRootsGroup.innerHTML = '';
    } else if (model.isSuperficial) {
      svgCornShoot.innerHTML = `
        <circle cx="-45" cy="-4" r="2.2" fill="#e5e7eb"/>
        <circle cx="-15" cy="-3" r="2.5" fill="#e5e7eb"/>
        <circle cx="20" cy="-4" r="2.2" fill="#e5e7eb"/>
        <circle cx="50" cy="-3" r="2.4" fill="#e5e7eb"/>
        <text x="0" y="-22" text-anchor="middle" fill="#9ca3af" font-family="Outfit, sans-serif" font-size="11" font-weight="600">Aplicação Superficial a Lanço (Dia -90)</text>
      `;
      svgRootsGroup.innerHTML = '';
    } else {
      svgCornShoot.innerHTML = `
        <text x="0" y="-22" text-anchor="middle" fill="#00f58d" font-family="Outfit, sans-serif" font-size="11" font-weight="600">Grade Aradora • Incorporação a 20 cm (Dia -90)</text>
      `;
      svgRootsGroup.innerHTML = `
        <circle cx="-60" cy="35" r="2.2" fill="#a7f3d0" opacity="0.65"/>
        <circle cx="-20" cy="65" r="2.2" fill="#a7f3d0" opacity="0.65"/>
        <circle cx="30" cy="48" r="2.2" fill="#a7f3d0" opacity="0.65"/>
        <circle cx="65" cy="78" r="2.2" fill="#a7f3d0" opacity="0.65"/>
      `;
    }
  }

  function updateSvgStage2(model) {
    updateSoilLayerVisuals(model.calcPh, model.isSuperficial, model.isNoLime);

    const p2o5Color = model.p2o5 === 0 ? '#6b7280' : '#38bdf8';
    const sproutColor = '#10b981';

    svgCornShoot.innerHTML = `
      <path d="M0,0 L0,-22" stroke="${sproutColor}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M0,-14 Q-14,-24 -22,-18" fill="none" stroke="${sproutColor}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M0,-12 Q14,-24 22,-16" fill="none" stroke="${sproutColor}" stroke-width="2.5" stroke-linecap="round"/>
      <text x="0" y="-34" text-anchor="middle" fill="${p2o5Color}" font-family="Outfit, sans-serif" font-size="11" font-weight="600">Semeadura + ${model.p2o5} kg/ha de P₂O₅ (Dia 0)</text>
    `;

    svgRootsGroup.innerHTML = `
      <ellipse cx="0" cy="14" rx="6" ry="4" fill="#fbbf24"/>
      <path d="M0,18 L0,34" fill="none" stroke="#e5e7eb" stroke-width="2.2" stroke-linecap="round"/>
      ${model.p2o5 > 0 ? `
        <circle cx="-14" cy="16" r="3" fill="${p2o5Color}"/>
        <circle cx="14" cy="16" r="3" fill="${p2o5Color}"/>
      ` : ''}
    `;
  }

  function updateSvgVisualizer(ph, al, isSuperficial, isNoLime, isVeranicoDrought = false) {
    if (!svgSoilLayer1) return;

    updateSoilLayerVisuals(ph, isSuperficial, isNoLime);

    if (isNoLime || (ph < 5.2 && !isSuperficial)) {
      svgRootsGroup.innerHTML = `
        <path d="M0,0 Q-4,25 0,42" fill="none" stroke="#dc2626" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M-2,15 Q-15,25 -25,32" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
        <path d="M2,18 Q15,28 22,35" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
        <circle cx="0" cy="42" r="4.5" fill="#7f1d1d"/>
        <circle cx="-25" cy="32" r="3.5" fill="#7f1d1d"/>
        <circle cx="22" cy="35" r="3.5" fill="#7f1d1d"/>
      `;

      svgCornShoot.innerHTML = `
        <path d="M0,0 L0,-40" stroke="#ca8a04" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M0,-15 Q-20,-28 -40,-20" fill="none" stroke="${isVeranicoDrought ? '#eab308' : '#a855f7'}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M0,-12 Q20,-28 38,-18" fill="none" stroke="${isVeranicoDrought ? '#eab308' : '#a855f7'}" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M0,-40 Q-5,-60 0,-65 Q5,-60 0,-40" fill="#eab308" opacity="0.8"/>
      `;
    } else if (isSuperficial) {
      svgRootsGroup.innerHTML = `
        <path d="M0,0 Q-3,25 0,55" fill="none" stroke="#e5e7eb" stroke-width="3" stroke-linecap="round"/>
        <path d="M-2,15 Q-45,22 -85,25" fill="none" stroke="#00f58d" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M2,18 Q45,24 85,26" fill="none" stroke="#00f58d" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M0,55 L-6,68" fill="none" stroke="#ef4444" stroke-width="2.8" stroke-linecap="round"/>
        <path d="M0,55 L8,70" fill="none" stroke="#ef4444" stroke-width="2.8" stroke-linecap="round"/>
        <circle cx="-6" cy="68" r="3.5" fill="#7f1d1d"/>
        <circle cx="8" cy="70" r="3.5" fill="#7f1d1d"/>
      `;

      if (isVeranicoDrought) {
        svgCornShoot.innerHTML = `
          <circle cx="215" cy="-60" r="14" fill="#fbbf24" opacity="0.9"/>
          <path d="M0,0 Q4,-26 0,-44" fill="none" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
          <path d="M0,-18 Q-24,-10 -45,4" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
          <path d="M0,-16 Q24,-8 44,6" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round"/>
          <path d="M0,-38 Q-20,-28 -36,-14" fill="none" stroke="#ca8a04" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M0,-36 Q20,-26 36,-12" fill="none" stroke="#ca8a04" stroke-width="2.8" stroke-linecap="round"/>
        `;
      } else {
        svgCornShoot.innerHTML = `
          <path d="M0,0 L0,-50" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
          <path d="M0,-20 Q-25,-35 -48,-25" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          <path d="M0,-18 Q25,-35 45,-22" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round"/>
          <path d="M0,-50 Q-6,-75 0,-80 Q6,-75 0,-50" fill="#00f58d" opacity="0.8"/>
        `;
      }
    } else {
      svgRootsGroup.innerHTML = `
        <path d="M0,0 Q-4,60 0,110 T-2,185" fill="none" stroke="#f3f4f6" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M-2,25 Q-30,45 -55,85" fill="none" stroke="#e5e7eb" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M2,30 Q35,50 60,95" fill="none" stroke="#e5e7eb" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M-1,65 Q-45,95 -70,150" fill="none" stroke="#d1d5db" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M1,70 Q45,105 75,155" fill="none" stroke="#d1d5db" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M-2,120 Q-25,150 -35,190" fill="none" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M0,125 Q25,155 35,192" fill="none" stroke="#9ca3af" stroke-width="1.4" stroke-linecap="round"/>
        <circle cx="-2" cy="185" r="3.5" fill="#00f58d"/>
        <circle cx="-70" cy="150" r="2.8" fill="#00f58d"/>
        <circle cx="75" cy="155" r="2.8" fill="#00f58d"/>
      `;

      svgCornShoot.innerHTML = `
        ${isVeranicoDrought ? '<circle cx="215" cy="-60" r="14" fill="#fbbf24" opacity="0.85"/>' : ''}
        <path d="M0,0 L0,-65" stroke="#10b981" stroke-width="5" stroke-linecap="round"/>
        <path d="M0,-25 Q-35,-45 -65,-30" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
        <path d="M0,-20 Q35,-45 65,-28" fill="none" stroke="#10b981" stroke-width="4" stroke-linecap="round"/>
        <path d="M0,-50 Q-30,-75 -50,-65" fill="none" stroke="#00f58d" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M0,-48 Q30,-75 52,-62" fill="none" stroke="#00f58d" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M0,-65 Q-8,-95 0,-100 Q8,-95 0,-65" fill="#00f58d" opacity="0.8"/>
      `;
    }
  }

  function updatePedagogicalFeedback(model, netGain) {
    if (!feedbackBox) return;
    const { calcPh: ph, calcV, calcAl, isSuperficial, isNoLime, limeDose, p2o5, estYield } = model;

    if (isNoLime || limeDose === 0) {
      feedbackBox.style.borderLeftColor = 'var(--accent-coral)';
      feedbackIcon.setAttribute('fill', '#f87171');
      feedbackTitle.textContent = 'Erro Crítico: Plantio em Solo Ácido sem Calagem';
      feedbackText.textContent = 'O solo permaneceu com pH 4.8 e 1.4 cmol de Alumínio tóxico ativo. O alumínio destrói as células da coifa radicular do milho, impedindo as raízes de ultrapassarem 10 cm de profundidade. Quase 70% do fertilizante aplicado na semeadura foi perdido por fixação química.';
      feedbackRule.textContent = 'Lição VRural: "Economizar no calcário é a forma mais rápida de falir na lavoura de milho da Amazônia Legal."';
      simSummaryNote.textContent = 'Diagnóstico: Solo altamente tóxico. Risco extremo de perda total em caso de veranico.';
    } else if (isSuperficial) {
      feedbackBox.style.borderLeftColor = 'var(--accent-gold)';
      feedbackIcon.setAttribute('fill', '#fbbf24');
      feedbackTitle.textContent = 'Alerta Operacional: Calcário Aplicado na Superfície sem Incorporar';
      feedbackText.textContent = 'O calcário dolomítico possui solubilidade muito baixa em água e precisa de contato físico com as partículas de solo para reagir. Ao aplicar na véspera sem grade aradora, o corretivo neutralizou apenas os primeiros 3 cm de terra e o subsolo permaneceu tóxico.';
      feedbackRule.textContent = 'Regra Embrapa: "Calcário não desce por gravidade. É indispensável incorporar a 20 cm de profundidade com 60 a 90 dias de antecedência."';
      simSummaryNote.textContent = 'Diagnóstico: Raiz superficial e vulnerável ao estresse hídrico.';
    } else if (ph > 6.8) {
      feedbackBox.style.borderLeftColor = 'var(--accent-gold)';
      feedbackIcon.setAttribute('fill', '#fbbf24');
      feedbackTitle.textContent = 'Atenção: Supercalagem (Excesso de Corretivo Aplicado)';
      feedbackText.textContent = `A dose de ${limeDose.toFixed(1)} t/ha elevou o pH para ${ph.toFixed(1)} e a saturação por bases para ${Math.round(calcV)}%. Em solos de Roraima, o excesso de alcalinidade precipita fosfatos de cálcio e induz deficiência de micronutrientes (Zn, Fe e Mn), limitando o teto produtivo a ${estYield} sc/ha.`;
      feedbackRule.textContent = 'Recomendação Embrapa: "A dosagem ideal para a maioria dos latossolos da região gira entre 2.0 e 2.5 t/ha (PRNT 85%). Mais não é melhor."';
      simSummaryNote.textContent = 'Diagnóstico: Bloqueio químico de micronutrientes por pH elevado.';
    } else if (calcAl > 0.3 || ph < 5.6) {
      feedbackBox.style.borderLeftColor = 'var(--accent-gold)';
      feedbackIcon.setAttribute('fill', '#fbbf24');
      feedbackTitle.textContent = 'Subcalagem: Correção Insuficiente para o Milho';
      feedbackText.textContent = `A dose de ${limeDose.toFixed(1)} t/ha elevou o pH apenas para ${ph.toFixed(1)} (V% = ${Math.round(calcV)}%), deixando ${calcAl.toFixed(1)} cmol de Al³⁺ ativo na camada arável. A acidez residual restringiu o desenvolvimento radicular e limitou a colheita a ${estYield} sc/ha.`;
      feedbackRule.textContent = 'Equação Embrapa: "NC = [(V₂ − V₁) × T] ÷ PRNT. Para elevar V₁=28% a V₂=60% (T=6.0, PRNT=85%), são necessárias ~2.2 t/ha."';
      simSummaryNote.textContent = 'Diagnóstico: Subcalagem manteve acidez limitante.';
    } else if (p2o5 === 0) {
      feedbackBox.style.borderLeftColor = 'var(--accent-coral)';
      feedbackIcon.setAttribute('fill', '#f87171');
      feedbackTitle.textContent = 'Lei do Mínimo de Liebig: Deficiência Severa de Fósforo';
      feedbackText.textContent = `Mesmo com o pH corrigido (${ph.toFixed(1)}) e Al³⁺ neutralizado, o solo nativo de Roraima possui apenas 3.5 mg/dm³ de Fósforo (muito baixo). Sem P₂O₅ no sulco de semeadura, o fósforo torna-se o fator limitante e trava a colheita em ${estYield} sc/ha.`;
      feedbackRule.textContent = 'Lei do Mínimo: "A produtividade é limitada pelo nutriente em menor disponibilidade, ainda que a acidez esteja perfeitamente corrigida."';
      simSummaryNote.textContent = 'Diagnóstico: Calagem correta, mas déficit severo de fósforo limitou a safra.';
    } else if (p2o5 < 90) {
      feedbackBox.style.borderLeftColor = 'var(--accent-gold)';
      feedbackIcon.setAttribute('fill', '#fbbf24');
      feedbackTitle.textContent = 'Subdose Fosfatada: Teto Produtivo Limitado pelo P₂O₅';
      feedbackText.textContent = `A calagem neutralizou o Al³⁺ (pH ${ph.toFixed(1)}, V% ${Math.round(calcV)}%), mas a aplicação de apenas ${p2o5} kg/ha de P₂O₅ em solo de baixa fertilidade natural limitou a formação de espigas e conteve a produtividade em ${estYield} sc/ha.`;
      feedbackRule.textContent = 'Recomendação Embrapa: "Em solos com P muito baixo (< 5 mg/dm³), utilize adubação de fosfatagem/base completa (90 kg/ha de P₂O₅)."';
      simSummaryNote.textContent = 'Diagnóstico: Solo corrigido, porém subadubado em fósforo.';
    } else {
      feedbackBox.style.borderLeftColor = 'var(--accent-mint)';
      feedbackIcon.setAttribute('fill', '#00f58d');
      feedbackTitle.textContent = 'Calibração Agronômica Eficiente (Padrão Embrapa)';
      feedbackText.textContent = `A dosagem de ${limeDose.toFixed(1)} t/ha com antecedência e incorporação a 20 cm neutralizou o alumínio tóxico (Al³⁺). O pH subiu para ${ph.toFixed(1)} e o V% atingiu ${Math.round(calcV)}%. O sistema radicular explorou mais de 40 cm de profundidade, garantindo absorção de água e aproveitamento do fósforo (${p2o5} kg/ha).`;
      feedbackRule.textContent = 'Tese VRural Comprovada: "Errar no simulador para não perder a lavoura."';
      simSummaryNote.textContent = `Status: Calibração em conformidade técnica. Ganho líquido de R$ ${Math.max(0, netGain).toLocaleString('pt-BR')}/ha.`;
    }
  }

  function renderMissionStage(model) {
    const {
      limeDose,
      isSuperficial,
      isNoLime,
      hasDeepRoots,
      veranicoPenaltyApplied,
      calcPh,
      calcAl,
      npkEff,
      p2o5,
      estYield,
      totalCost,
      missionNetGain,
      mission,
      goalChecks
    } = model;

    // Reset stage-specific banners
    simClimateBanner.classList.add('is-hidden');
    simClimateBanner.classList.remove('climate-danger', 'climate-safe');
    simMissionVerdict.classList.add('is-hidden');
    simMissionVerdict.classList.remove('verdict-pass', 'verdict-fail');

    // Update wizard card views
    updateCardWizardUI(model);

    if (currentStage === 1) {
      updateSoilMetricsHUD(model);
      updateSvgStage1(model);

      yieldVal.textContent = 'Aguardando Colheita';
      yieldDiffLabel.textContent = 'Passo 1 de 4 • Calagem e Preparo (Dia -90)';
      yieldDiffLabel.className = 'outcome-diff';

      economicVal.textContent = `${formatBRL(model.stage1CommittedCost)} / ha`;
      economicDetailLabel.textContent = 'Custo de preparo + calcário • Adubação no Dia 0';

      feedbackBox.style.borderLeftColor = 'var(--accent-mint)';
      feedbackIcon.setAttribute('fill', '#00f58d');
      feedbackTitle.textContent = 'Caderno de Campo • Passo 1 (Dia -90): Preparo do Solo e Calagem';
      feedbackText.textContent = 'O calcário dolomítico precisa de 60 a 90 dias de reação com a umidade do solo para neutralizar o Al³⁺ e elevar o pH. Por isso, as leituras de pH, V% e Al³⁺ só serão reveladas após o período de incubação, no Dia 0 (Semeadura).';
      feedbackRule.textContent = 'Equação Embrapa: Calcule a necessidade de calagem com o laudo inicial: NC = [(V₂ − V₁) × T] ÷ PRNT (Meta V₂ = 60%, T = 6.0, PRNT = 85%).';
      simSummaryNote.textContent = 'Passo 1 ativo: Defina o preparo e a dose para avançar 90 dias até a semeadura.';
      return;
    }

    if (currentStage === 2) {
      updateSoilMetricsHUD(model);
      updateSvgStage2(model);

      yieldVal.textContent = 'Semeadura (Dia 0)';
      yieldDiffLabel.textContent = 'Passo 2 de 4 • Reação Concluída & P₂O₅';
      yieldDiffLabel.className = 'outcome-diff';

      economicVal.textContent = `${formatBRL(totalCost)} / ha`;
      economicDetailLabel.textContent = `Custo acumulado até o Dia 0 (Calagem + Fósforo)`;

      feedbackBox.style.borderLeftColor = 'var(--accent-mint)';
      feedbackIcon.setAttribute('fill', '#00f58d');
      feedbackTitle.textContent = 'Caderno de Campo • Passo 2 (Dia 0): Análise Pós-Reação & Semeadura';
      feedbackText.textContent = `Após 90 dias de incubação no solo, a camada de 0–20 cm atingiu pH ${calcPh.toFixed(1)} e Al³⁺ de ${calcAl.toFixed(1)} cmol. Agora defina a adubação fosfatada (${p2o5} kg/ha de P₂O₅) no sulco de semeadura considerando o fósforo nativo muito baixo (3.5 mg/dm³).`;
      feedbackRule.textContent = 'Lei do Mínimo (Liebig): Mesmo em solo corrigido, a falta de P₂O₅ trava o desenvolvimento inicial da plântula; em solo ácido, o Al³⁺ fixa o adubo aplicado.';
      simSummaryNote.textContent = `Passo 2 ativo: Solo em pH ${calcPh.toFixed(1)}. Confirme a dose de P₂O₅ para acompanhar o ciclo até o Mês 3.`;
      return;
    }

    if (currentStage === 3) {
      updateSoilMetricsHUD(model);
      updateSvgVisualizer(calcPh, calcAl, isSuperficial, isNoLime, mission.hasVeranico);

      if (mission.hasVeranico) {
        simClimateBanner.classList.remove('is-hidden');
        if (!hasDeepRoots) {
          simClimateBanner.classList.add('climate-danger');
          climateBannerTitle.textContent = '☀️ Alerta Climático: Veranico de 15 dias! (Murchamento Severo)';
          climateBannerDesc.textContent = 'Sem incorporação do calcário a 20 cm, as raízes ficaram rasas e não alcançam a umidade do subsolo. O estresse hídrico no pendoamento (VT) provocou queda de 45% na produtividade!';
        } else {
          simClimateBanner.classList.add('climate-safe');
          climateBannerTitle.textContent = '☀️ Alerta Climático: Veranico de 15 dias — Lavoura Resistente!';
          climateBannerDesc.textContent = 'Graças à calagem incorporada a 20 cm no Estágio 1, as raízes atingiram mais de 40 cm de profundidade e mantiveram a absorção de água durante a estiagem.';
        }
      }

      yieldVal.textContent = 'Pendoamento (VT)';
      yieldDiffLabel.textContent = 'Passo 3 de 4 • Raízes e Clima (Mês 3 / 75 DAE)';
      yieldDiffLabel.className = 'outcome-diff';

      economicVal.textContent = `${formatBRL(totalCost)} / ha`;
      economicDetailLabel.textContent = `Eficiência NPK medida: ${npkEff}% • Colheita no Mês 5`;

      feedbackBox.style.borderLeftColor = 'var(--accent-mint)';
      feedbackIcon.setAttribute('fill', '#00f58d');

      if (mission.hasVeranico) {
        feedbackTitle.textContent = 'Caderno de Campo • Passo 3 (Mês 3): Arquitetura Radicular e Veranico';
        feedbackText.textContent = hasDeepRoots
          ? `Aos 75 DAE (estádio VT), as raízes ultrapassaram a camada arável (-20 cm) e exploram a umidade do subsolo profundo, suportando os 15 dias de estiagem com aproveitamento de ${npkEff}% dos nutrientes.`
          : 'Aos 75 DAE (estádio VT), a ausência de calagem profunda impediu o enraizamento além dos 15 cm. A estiagem provocou murchamento severo no pendoamento.';
        feedbackRule.textContent = 'Orientações do Instrutor: Observe o diagnóstico fisiológico e o corte de solo. Avance para o estádio R6 (Colheita no Mês 5).';
      } else {
        feedbackTitle.textContent = 'Caderno de Campo • Passo 3 (Mês 3): Desenvolvimento Radicular & Nutrição';
        feedbackText.textContent = `O milho atingiu o pendoamento (VT / 75 DAE) com aproveitamento de NPK medido em ${npkEff}%. A profundidade efetiva do sistema radicular e a disponibilidade de P₂O₅ definem o enchimento de grãos.`;
        feedbackRule.textContent = 'Orientações do Instrutor: Revise o diagnóstico radicular e nutricional no cartão antes de colher a safra no Mês 5.';
      }

      simSummaryNote.textContent = 'Passo 3 ativo: Diagnóstico de campo concluído. Avance para a colheita no Mês 5.';
      return;
    }

    // Stage 4: Colheita & Veredito Final
    updateSoilMetricsHUD(model);
    updateSvgVisualizer(calcPh, calcAl, isSuperficial, isNoLime, mission.hasVeranico);

    if (mission.hasVeranico) {
      simClimateBanner.classList.remove('is-hidden');
      simClimateBanner.classList.add(veranicoPenaltyApplied ? 'climate-danger' : 'climate-safe');
      climateBannerTitle.textContent = veranicoPenaltyApplied
        ? '☀️ Impacto Confirmado: Veranico reduziu a safra em 45%'
        : '☀️ Veranico Superado: Raízes profundas protegeram a safra';
      climateBannerDesc.textContent = veranicoPenaltyApplied
        ? 'O estresse hídrico no Mês 3 comprometeu o enchimento de grãos das plantas com raiz rasa.'
        : 'O enraizamento acima de 40 cm garantiu estabilidade produtiva até a colheita.';
    }

    yieldVal.textContent = `${estYield} sacas/ha`;
    const diffSacas = estYield - 28;
    if (diffSacas > 0) {
      yieldDiffLabel.textContent = `+${diffSacas} sc/ha vs solo ácido nativo`;
      yieldDiffLabel.className = 'outcome-diff status-ideal';
    } else {
      yieldDiffLabel.textContent = 'Sem ganho produtivo (lavoura estagnada)';
      yieldDiffLabel.className = 'outcome-diff status-danger';
    }

    const signedGain = missionNetGain >= 0
      ? `+ ${formatBRL(missionNetGain)} / ha`
      : `- ${formatBRL(Math.abs(missionNetGain))} / ha`;
    economicVal.textContent = signedGain;
    economicDetailLabel.textContent = `Custo total: ${formatBRL(totalCost)} | Teto: ${formatBRL(mission.maxBudget)}`;

    // Mission Verdict Card
    const methodShortLabel = isNoLime
      ? 'sem calagem'
      : (isSuperficial ? 'superficial sem incorporar' : 'incorporado a 20 cm');

    simMissionVerdict.classList.remove('is-hidden');
    if (goalChecks.allMet) {
      simMissionVerdict.classList.add('verdict-pass');
      verdictStatusBadge.textContent = 'MISSÃO CONCLUÍDA';
      verdictTitle.textContent = `${mission.title} — Aprovado com Sucesso!`;
      verdictCauseEffect.textContent = `Causa e Efeito: A decisão no Passo 1 (${limeDose.toFixed(1)} t/ha, ${methodShortLabel}) somada a ${p2o5} kg/ha de P₂O₅ no Passo 2 resultou em pH ${calcPh.toFixed(1)}, ${npkEff}% de eficiência de NPK e ${estYield} sacas/ha dentro do orçamento (${formatBRL(totalCost)}/ha).`;
    } else {
      simMissionVerdict.classList.add('verdict-fail');
      verdictStatusBadge.textContent = 'FALHA NA SAFRA';
      verdictTitle.textContent = `${mission.title} — Necessita Novo Manejo`;
      const failedReasons = goalChecks.checks.filter(c => !c.met).map(c => `${c.label} (obtido: ${c.actual})`).join('; ');
      const pNote = p2o5 < 90
        ? ` Note também a Lei do Mínimo: ${p2o5} kg/ha de P₂O₅ limitou a resposta produtiva em solo de fósforo muito baixo (3.5 mg/dm³).`
        : '';
      verdictCauseEffect.textContent = `Causa e Efeito: As escolhas nos Passos 1 (${limeDose.toFixed(1)} t/ha, ${methodShortLabel}) e 2 (${p2o5} kg/ha P₂O₅) definiram o resultado no Mês 5. Critérios não atingidos: ${failedReasons}.${pNote}`;
    }

    verdictChecklist.innerHTML = goalChecks.checks.map(check => `
      <li class="mission-goal-item ${check.met ? 'goal-met' : 'goal-fail'}">
        <span>${check.met ? '✓' : '✕'}</span>
        <span>${check.label}: <strong>${check.actual}</strong></span>
      </li>
    `).join('');

    updatePedagogicalFeedback(model, missionNetGain);
  }

  function runSimulation() {
    if (!limeSlider) return;

    const model = computeAgronomicModel();

    // Update Slider & Option UI
    limeValBadge.textContent = `${model.limeDose.toFixed(1)} t/ha`;
    syncSliderCSS(limeSlider);

    document.querySelectorAll('.method-option').forEach(opt => {
      const radio = opt.querySelector('input[type="radio"]');
      opt.classList.toggle('selected', radio && radio.checked);
    });

    if (currentMode === 'mission') {
      updateMissionPanel(model);
      updateTimelineUI();
      renderMissionStage(model);
    } else {
      // Explorer Mode (Original instant simulation)
      simClimateBanner.classList.add('is-hidden');
      simMissionVerdict.classList.add('is-hidden');

      updateSoilMetricsHUD(model);

      yieldVal.textContent = `${model.estYield} sacas/ha`;
      const diffSacas = model.estYield - 28;
      if (diffSacas > 0) {
        yieldDiffLabel.textContent = `+${diffSacas} sc/ha em relação ao solo ácido nativo`;
        yieldDiffLabel.className = 'outcome-diff status-ideal';
      } else {
        yieldDiffLabel.textContent = 'Sem ganho de produtividade (estagnação da lavoura)';
        yieldDiffLabel.className = 'outcome-diff status-danger';
      }

      if (model.explorerNetGain > 0) {
        economicVal.textContent = `+ ${formatBRL(model.explorerNetGain)} / ha`;
        economicDetailLabel.textContent = `Custo calcário: ${formatBRL(model.limeCost)} | Retorno: ${(model.explorerNetGain / Math.max(model.limeCost, 1)).toFixed(1)}x`;
      } else {
        economicVal.textContent = 'R$ 0 / ha';
        economicDetailLabel.textContent = 'Perda de oportunidade: mais de R$ 3.000/ha deixados de colher';
      }

      updateSvgVisualizer(model.calcPh, model.calcAl, model.isSuperficial, model.isNoLime, false);
      updatePedagogicalFeedback(model, model.explorerNetGain);
    }
  }

  function setSimulatorMode(mode) {
    currentMode = mode;
    const isMission = mode === 'mission';

    if (simFrame) {
      simFrame.classList.toggle('mode-mission', isMission);
      simFrame.classList.toggle('mode-explorer', !isMission);
    }

    if (modeTabMission && modeTabExplorer) {
      modeTabMission.classList.toggle('active', isMission);
      modeTabMission.setAttribute('aria-selected', String(isMission));
      modeTabExplorer.classList.toggle('active', !isMission);
      modeTabExplorer.setAttribute('aria-selected', String(!isMission));
    }

    if (simMissionPanel) simMissionPanel.classList.toggle('is-hidden', !isMission);
    if (simTimelineBar) simTimelineBar.classList.toggle('is-hidden', !isMission);
    if (simPresetsBar) simPresetsBar.classList.toggle('is-hidden', isMission);
    if (btnCompleteCycle) btnCompleteCycle.classList.toggle('is-hidden', isMission);

    // Dynamic text toggles: hide spoilers in Mission Mode, show full hints in Explorer Mode
    if (isMission) {
      currentStage = 1;
      applyMissionInitialDefaults();

      if (tickRec) {
        tickRec.textContent = '2.0 - 2.5 t';
        tickRec.classList.remove('rec-tick');
      }
      if (tickMax) {
        tickMax.textContent = '4.5 t/ha';
      }
      if (methodDescInc) {
        methodDescInc.textContent = 'Distribuição uniforme e incorporação mecânica a 20 cm com grade aradora entre 60 e 90 dias antes do plantio.';
      }
      if (methodDescSup) {
        methodDescSup.textContent = 'Aplicação de calcário a lanço na superfície na véspera do plantio, sem incorporação mecânica no perfil do solo.';
      }
      if (methodDescNone) {
        methodDescNone.textContent = 'Semeadura direta sobre o solo original, sem aplicação prévia de corretivo de acidez.';
      }
      if (pillSub90) pillSub90.textContent = '90 kg/ha P₂O₅';
      if (pillSub40) pillSub40.textContent = '40 kg/ha P₂O₅';
      if (pillSub0) pillSub0.textContent = 'Sem Fósforo';
    } else {
      limeSlider.value = '2.2';
      const incRadio = document.querySelector('input[name="application_method"][value="inc-60-90"]');
      if (incRadio) incRadio.checked = true;
      const p90Radio = document.querySelector('input[name="p2o5_dose"][value="90"]');
      if (p90Radio) p90Radio.checked = true;
      syncLimeSliderEnabled('inc-60-90');

      if (tickRec) {
        tickRec.textContent = '★ 2.0 - 2.5 t (Embrapa)';
        tickRec.classList.add('rec-tick');
      }
      if (tickMax) {
        tickMax.textContent = '4.5 t (Excesso)';
      }
      if (methodDescInc) {
        methodDescInc.textContent = 'Aração e gradagem uniforme. O corretivo reage no perfil e neutraliza o Al³⁺ na zona de crescimento radicular.';
      }
      if (methodDescSup) {
        methodDescSup.textContent = 'Erro frequente: o corretivo insolúvel fica retido nos 2 cm superficiais; o subsolo permanece ácido e tóxico.';
      }
      if (methodDescNone) {
        methodDescNone.textContent = 'Prejuízo garantido: o fósforo do adubo reage com o alumínio livre e fica quimicamente travado no solo.';
      }
      if (pillSub90) pillSub90.textContent = 'Dose Embrapa';
      if (pillSub40) pillSub40.textContent = 'Subdose';
      if (pillSub0) pillSub0.textContent = 'Sem Fósforo';
    }

    runSimulation();
  }

  // --- Event Listeners ---

  // Mode Tabs Listeners
  if (modeTabMission) {
    modeTabMission.addEventListener('click', () => setSimulatorMode('mission'));
  }
  if (modeTabExplorer) {
    modeTabExplorer.addEventListener('click', () => setSimulatorMode('explorer'));
  }

  // Mission Selection Listeners
  missionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      missionButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentMissionId = parseInt(btn.getAttribute('data-mission'), 10) || 1;
      currentStage = 1;
      applyMissionInitialDefaults();
      runSimulation();
    });
  });

  // Timeline Stepper Listeners (Cannot jump ahead to future locked steps in Mission Mode)
  stageButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStage = parseInt(btn.getAttribute('data-stage'), 10) || 1;
      if (currentMode === 'mission') {
        // Only allow reviewing already completed stages or current stage
        if (targetStage > currentStage) {
          return;
        }
      }
      currentStage = targetStage;
      runSimulation();
    });
  });

  if (btnNextStage) {
    btnNextStage.addEventListener('click', () => {
      currentStage = currentStage < 4 ? currentStage + 1 : 1;
      runSimulation();
    });
  }

  if (btnCompleteCycle) {
    btnCompleteCycle.addEventListener('click', () => {
      currentStage = 4;
      runSimulation();
    });
  }

  // Step-by-Step Card Wizard Buttons (Cannot be skipped!)
  if (btnStep1Confirm) {
    btnStep1Confirm.addEventListener('click', () => {
      currentStage = 2;
      runSimulation();
    });
  }

  if (btnStep2Back) {
    btnStep2Back.addEventListener('click', () => {
      currentStage = 1;
      runSimulation();
    });
  }

  if (btnStep2Confirm) {
    btnStep2Confirm.addEventListener('click', () => {
      currentStage = 3;
      runSimulation();
    });
  }

  if (btnStep3Back) {
    btnStep3Back.addEventListener('click', () => {
      currentStage = 2;
      runSimulation();
    });
  }

  if (btnStep3Confirm) {
    btnStep3Confirm.addEventListener('click', () => {
      currentStage = 4;
      runSimulation();
    });
  }

  if (btnStep4Laudo) {
    btnStep4Laudo.addEventListener('click', () => {
      if (btnOpenLaudo) btnOpenLaudo.click();
    });
  }

  if (btnStep4Restart) {
    btnStep4Restart.addEventListener('click', () => {
      currentStage = 1;
      runSimulation();
    });
  }

  // Preset Scenario Handlers (Explorer Mode)
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const preset = btn.getAttribute('data-preset');
      if (preset === 'ideal') {
        limeSlider.value = '2.2';
        document.querySelector('input[name="application_method"][value="inc-60-90"]').checked = true;
        document.querySelector('input[name="p2o5_dose"][value="90"]').checked = true;
        syncLimeSliderEnabled('inc-60-90');
      } else if (preset === 'acid') {
        limeSlider.value = '0.0';
        document.querySelector('input[name="application_method"][value="sem-calagem"]').checked = true;
        document.querySelector('input[name="p2o5_dose"][value="0"]').checked = true;
        syncLimeSliderEnabled('sem-calagem');
      } else if (preset === 'surface') {
        limeSlider.value = '2.2';
        document.querySelector('input[name="application_method"][value="sup-vespera"]').checked = true;
        document.querySelector('input[name="p2o5_dose"][value="90"]').checked = true;
        syncLimeSliderEnabled('sup-vespera');
      } else if (preset === 'excess') {
        limeSlider.value = '4.2';
        document.querySelector('input[name="application_method"][value="inc-60-90"]').checked = true;
        document.querySelector('input[name="p2o5_dose"][value="90"]').checked = true;
        syncLimeSliderEnabled('inc-60-90');
      }

      runSimulation();
    });
  });

  function handleControlInputChange() {
    presetButtons.forEach(b => b.classList.remove('active'));
    runSimulation();
  }

  if (limeSlider) {
    limeSlider.addEventListener('input', () => {
      const val = parseFloat(limeSlider.value);
      if (val > 0) {
        lastNonZeroLime = val;
      }
      handleControlInputChange();
    });
  }

  methodRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'sem-calagem') {
        const cur = parseFloat(limeSlider.value);
        if (cur > 0) lastNonZeroLime = cur;
        limeSlider.value = '0.0';
        syncLimeSliderEnabled('sem-calagem');
      } else {
        syncLimeSliderEnabled(radio.value);
        if (parseFloat(limeSlider.value) === 0) {
          limeSlider.value = String(lastNonZeroLime || 2.0);
        }
      }
      handleControlInputChange();
    });
  });

  p2o5Radios.forEach(radio => {
    radio.addEventListener('change', handleControlInputChange);
  });

  // Reset Button
  if (btnSimReset) {
    btnSimReset.addEventListener('click', () => {
      if (currentMode === 'mission') {
        currentStage = 1;
        applyMissionInitialDefaults();
        runSimulation();
      } else {
        const idealBtn = document.getElementById('preset-ideal');
        if (idealBtn) idealBtn.click();
      }
    });
  }

  // --- Modal Report Dialog Logic ---
  if (btnOpenLaudo && laudoDialog) {
    btnOpenLaudo.addEventListener('click', () => {
      if (currentMode === 'mission' && currentStage < 4) {
        currentStage = 4;
        runSimulation();
      }

      const model = computeAgronomicModel();
      const methodLabel = model.method === 'inc-60-90'
        ? 'Incorporado a 20 cm'
        : (model.method === 'sup-vespera' ? 'Superficial na véspera' : 'Sem calagem');

      // Populate Modal Fields
      laudoTdLime.textContent = `${model.limeDose.toFixed(1)} t/ha`;
      laudoTdMethod.textContent = methodLabel;
      laudoTdP2o5.textContent = `${model.p2o5} kg/ha no sulco`;
      laudoTdPh.textContent = `${model.calcPh.toFixed(1)}`;
      laudoTdYield.textContent = `${model.estYield} sacas/ha`;
      laudoTdCost.textContent = `${formatBRL(model.totalCost)} / ha`;

      let score = 100;
      if (model.method !== 'inc-60-90') score -= 35;
      if (model.calcPh < 5.5 || model.calcPh > 6.8) score -= 25;
      if (model.p2o5 < 80) score -= 15;

      if (currentMode === 'mission') {
        const passed = model.goalChecks.allMet;
        if (model.totalCost > model.mission.maxBudget) score -= 20;
        if (model.estYield < model.mission.minYield) score -= 20;
        score = Math.max(20, Math.min(score, 100));

        laudoTdMission.textContent = model.mission.title;
        laudoTdMissionTarget.textContent = model.mission.level;
        laudoTdBudget.textContent = `Orçamento: ≤ ${formatBRL(model.mission.maxBudget)} / ha`;
        laudoTdYieldTarget.textContent = `Meta: ≥ ${model.mission.minYield} sc/ha`;

        laudoScoreVal.textContent = `${score} / 100 pts`;
        if (passed) {
          laudoScoreVal.style.color = 'var(--accent-mint)';
          laudoScoreTag.textContent = 'Aprovado na Missão';
          laudoScoreTag.style.color = 'var(--accent-mint)';
          if (laudoRiskLabel) laudoRiskLabel.textContent = 'Risco de perda: Baixo';
        } else {
          laudoScoreVal.style.color = 'var(--accent-coral)';
          laudoScoreTag.textContent = 'Reprovado — Necessita Novo Manejo';
          laudoScoreTag.style.color = 'var(--accent-coral)';
          if (laudoRiskLabel) laudoRiskLabel.textContent = 'Risco de perda: Elevado';
        }
      } else {
        score = Math.max(20, Math.min(score, 100));
        laudoTdMission.textContent = 'Simulação Livre (Modo Explorador)';
        laudoTdMissionTarget.textContent = 'Estudo Exploratório';
        laudoTdBudget.textContent = 'Sem teto orçamentário';
        laudoTdYieldTarget.textContent = 'Meta familiar: > 75 sc/ha';

        laudoScoreVal.textContent = `${score} / 100 pts`;
        if (score >= 80) {
          laudoScoreVal.style.color = 'var(--accent-mint)';
          laudoScoreTag.textContent = 'Aprovado na Missão';
          laudoScoreTag.style.color = 'var(--accent-mint)';
          if (laudoRiskLabel) laudoRiskLabel.textContent = 'Risco de perda: Baixo';
        } else {
          laudoScoreVal.style.color = 'var(--accent-coral)';
          laudoScoreTag.textContent = 'Reprovado — Necessita Novo Manejo';
          laudoScoreTag.style.color = 'var(--accent-coral)';
          if (laudoRiskLabel) laudoRiskLabel.textContent = 'Risco de perda: Elevado';
        }
      }

      laudoDialog.showModal();
    });
  }

  if (laudoCloseBtn && laudoDialog) {
    laudoCloseBtn.addEventListener('click', () => laudoDialog.close());
  }

  if (laudoCloseAction && laudoDialog) {
    laudoCloseAction.addEventListener('click', () => laudoDialog.close());
  }

  if (laudoPrintBtn) {
    laudoPrintBtn.addEventListener('click', () => window.print());
  }

  if (laudoDialog) {
    laudoDialog.addEventListener('click', (e) => {
      if (e.target === laudoDialog) {
        laudoDialog.close();
      }
    });
  }

  // Initialize Simulator in Default Mission Mode on Page Load
  setSimulatorMode('mission');

  // --- 3. Scroll Reveal Fallback (For older or incompatible browsers) ---
  if (!CSS.supports('(animation-timeline: view()) and (animation-range: entry)')) {
    const reveals = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
      reveal.style.opacity = '0';
      reveal.style.transform = 'translateY(30px) scale(0.95)';
      revealObserver.observe(reveal);
    });
  }

  // --- 4. Interactive header state on scroll ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
      header.style.backgroundColor = 'var(--bg-surface-trans)';
      header.style.backdropFilter = 'blur(12px)';
    } else {
      header.classList.remove('header-scrolled');
      header.style.backgroundColor = 'transparent';
      header.style.backdropFilter = 'none';
    }
  });
});
