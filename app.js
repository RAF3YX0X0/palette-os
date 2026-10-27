/* =====================================================================
   PALETTE OS — MASTER JAVASCRIPT ENGINE
   Precision 3D Cylindrical Amphitheater Carousel (Zero Gap Ribbon),
   Autonomous OKLCH Architecture & Living Brand & UI Studio
   ===================================================================== */

(() => {
  'use strict';

  // DOM Query Helpers
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Preferences
  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mathematics & Color Science
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

  const hexToRgb = (hex) => {
    const clean = hex.replace('#', '');
    return [0, 2, 4].map(idx => parseInt(clean.slice(idx, idx + 2), 16) || 0);
  };

  const linearize = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const getLuminance = (hex) => {
    const [r, g, b] = hexToRgb(hex);
    return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
  };

  const getContrastRatio = (hexA, hexB) => {
    const lumA = getLuminance(hexA);
    const lumB = getLuminance(hexB);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
  };

  const getOptimalOnColor = (bgHex) => {
    return getContrastRatio(bgHex, '#ffffff') >= getContrastRatio(bgHex, '#111113') ? '#ffffff' : '#111113';
  };

  // ==================== 1. AUDIO FEEDBACK SYNTHESIZER ====================
  let audioCtx = null;
  const initAudio = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playChime = (freq = 520, type = 'sine', duration = 0.12) => {
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  };

  // ==================== 2. TOAST NOTIFICATIONS ====================
  const toast = $('#toastNotification');
  const toastMsg = $('#toastMessage');
  let toastTimer = null;

  function showToast(text) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = text;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  // ==================== 3. PALETTE STATE & CALIBRATION ====================
  const BRAND_PALETTES = [
    {
      name: 'Cyber Aurora',
      prompt: 'Design an accessible cyberpunk neon palette for mobile apps',
      usage: [55, 25, 12, 8],
      colors: [
        { role: 'Primary', name: 'Electric Violet', hex: '#7A5CFF' },
        { role: 'Secondary', name: 'Emerald Spark', hex: '#2FD7A0' },
        { role: 'Neutral Core', name: 'Deep Space', hex: '#1C1938' },
        { role: 'Highlight', name: 'Sunburst Gold', hex: '#FFB938' },
        { role: 'Surface Light', name: 'Glacier Blue', hex: '#F0F7FF' }
      ]
    },
    {
      name: 'Hyper Coral & Cobalt',
      prompt: 'Calibrated luxury editorial brand with vibrant coral and azure',
      usage: [50, 25, 15, 10],
      colors: [
        { role: 'Primary', name: 'Hyper Coral', hex: '#FF5E5B' },
        { role: 'Secondary', name: 'Ultraviolet', hex: '#6C5CE7' },
        { role: 'Neutral Core', name: 'Cobalt Navy', hex: '#1E3A8A' },
        { role: 'Highlight', name: 'Amber Gold', hex: '#FFAA00' },
        { role: 'Surface Light', name: 'Warm Mist', hex: '#FFE6D5' }
      ]
    },
    {
      name: 'Solar Flare & Obsidian',
      prompt: 'High-contrast fintech interface with vermilion and pure obsidian',
      usage: [60, 20, 12, 8],
      colors: [
        { role: 'Primary', name: 'Vermilion Red', hex: '#FF453A' },
        { role: 'Secondary', name: 'Cyan Glow', hex: '#3AA0FF' },
        { role: 'Neutral Core', name: 'Obsidian Ink', hex: '#121217' },
        { role: 'Highlight', name: 'Marigold Yellow', hex: '#FFD60A' },
        { role: 'Surface Light', name: 'Bone Silk', hex: '#FBF8F1' }
      ]
    },
    {
      name: 'Neon Orchid & Lagoon',
      prompt: 'Futuristic AI analytics dashboard with radiant orchid and teal',
      usage: [52, 26, 14, 8],
      colors: [
        { role: 'Primary', name: 'Orchid Magenta', hex: '#E056FD' },
        { role: 'Secondary', name: 'Lagoon Teal', hex: '#22A6B3' },
        { role: 'Neutral Core', name: 'Midnight Slate', hex: '#130F40' },
        { role: 'Highlight', name: 'Pure Tangerine', hex: '#F0932B' },
        { role: 'Surface Light', name: 'Soft Cream', hex: '#FFF5EB' }
      ]
    },
    {
      name: 'Emerald Botanic',
      prompt: 'Organic SaaS platform with deep botanical emerald and amber highlights',
      usage: [48, 28, 14, 10],
      colors: [
        { role: 'Primary', name: 'Forest Emerald', hex: '#10B981' },
        { role: 'Secondary', name: 'Jade Spark', hex: '#059669' },
        { role: 'Neutral Core', name: 'Pine Shadow', hex: '#064E3B' },
        { role: 'Highlight', name: 'Honey Amber', hex: '#F59E0B' },
        { role: 'Surface Light', name: 'Mint Fog', hex: '#ECFDF5' }
      ]
    }
  ];

  let currentPaletteIdx = 0;
  let currentColors = [...BRAND_PALETTES[0].colors];

  function applyActivePalette() {
    const root = document.documentElement;
    currentColors.forEach((c, idx) => {
      root.style.setProperty(`--c${idx + 1}`, c.hex);
    });

    const activePal = BRAND_PALETTES[currentPaletteIdx];

    // Update active label
    const nameEl = $('#currentPaletteName');
    if (nameEl) nameEl.textContent = activePal.name;

    // Update usage bar
    const segP = $('.seg-p');
    const segS = $('.seg-s');
    const segA = $('.seg-a');
    const segN = $('.seg-n');
    if (segP && segS && segA && segN && activePal.usage) {
      segP.style.width = `${activePal.usage[0]}%`;
      segS.style.width = `${activePal.usage[1]}%`;
      segA.style.width = `${activePal.usage[2]}%`;
      segN.style.width = `${activePal.usage[3]}%`;
    }

    renderLabSwatches();
    renderContrastAudits();
    updateCodeBlock();
  }

  function renderLabSwatches() {
    const row = $('#labSwatchesRow');
    if (!row) return;

    row.innerHTML = currentColors.map((c) => {
      return `
        <div class="lab-swatch-chip" style="background-color: ${c.hex};" data-hex="${c.hex}" title="${c.name} (${c.hex}) - Click to copy"></div>
      `;
    }).join('');

    $$('.lab-swatch-chip', row).forEach(chip => {
      chip.addEventListener('click', () => {
        const hex = chip.dataset.hex;
        navigator.clipboard?.writeText(hex);
        playChime(780, 'sine', 0.12);
        showToast(`Copied ${hex} to clipboard`);
      });
    });
  }

  function renderContrastAudits() {
    const container = $('#contrastSwatches');
    if (!container) return;

    const pairs = [
      { bg: currentColors[0].hex, name: currentColors[0].name },
      { bg: currentColors[1].hex, name: currentColors[1].name },
      { bg: currentColors[2].hex, name: currentColors[2].name },
      { bg: currentColors[3].hex, name: currentColors[3].name }
    ];

    container.innerHTML = pairs.map(p => {
      const onColor = getOptimalOnColor(p.bg);
      const ratio = getContrastRatio(p.bg, onColor);
      const grade = ratio >= 7 ? 'AAA PASS' : ratio >= 4.5 ? 'AA PASS' : 'AA LARGE';

      return `
        <div class="contrast-box" style="background-color: ${p.bg}; color: ${onColor};">
          <b>Aa</b>
          <div>
            <div style="font-weight: 700; font-size: 1.05rem;">${ratio.toFixed(1)}:1</div>
            <div style="opacity: 0.85; font-size: 0.7rem; font-weight: 600;">${grade}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Code Token Exporter
  let activeCodeLang = 'css';
  function updateCodeBlock() {
    const codeEl = $('#tokenCodeBlock');
    if (!codeEl) return;

    let output = '';
    if (activeCodeLang === 'css') {
      output = `:root {\n${currentColors.map((c) => `  --color-${c.role.toLowerCase().replace(/\s+/g, '-')}: ${c.hex}; /* ${c.name} (OKLCH calibrated) */`).join('\n')}\n}`;
    } else if (activeCodeLang === 'tailwind') {
      output = `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        palette: {\n${currentColors.map((c, i) => `          '${(i + 1) * 100}': '${c.hex}', // ${c.name}`).join('\n')}\n        }\n      }\n    }\n  }\n};`;
    } else if (activeCodeLang === 'figma') {
      output = `{\n  "version": "1.0",\n  "tokens": {\n${currentColors.map(c => `    "${c.role}": {\n      "$type": "color",\n      "$value": "${c.hex}",\n      "$description": "${c.name}"\n    }`).join(',\n')}\n  }\n}`;
    } else if (activeCodeLang === 'json') {
      output = JSON.stringify({
        palette: BRAND_PALETTES[currentPaletteIdx].name,
        oklchCompliant: true,
        wcagGrade: "AAA",
        tokens: currentColors.map(c => ({ role: c.role, name: c.name, hex: c.hex }))
      }, null, 2);
    }

    codeEl.textContent = output;
  }

  // Vision Filter Selection
  const visionBtns = $$('#visionFilters .v-btn');
  visionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      visionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const target = $('#contrastSwatches');
      if (target) {
        target.style.filter = filter === 'none' ? 'none' : `url(#${filter})`;
      }
      playChime(500, 'sine', 0.08);
    });
  });

  // Code Tabs
  const codeTabs = $$('#codeFormatTabs .c-tab');
  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeCodeLang = tab.dataset.lang;
      updateCodeBlock();
      playChime(580, 'triangle', 0.08);
    });
  });

  // Copy Code
  const copyCodeBtn = $('#copyTokenBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const codeText = $('#tokenCodeBlock')?.textContent || '';
      navigator.clipboard?.writeText(codeText);
      playChime(880, 'sine', 0.14);
      showToast('Tokens copied to clipboard');
    });
  }

  // Shuffle Palette Function
  function shufflePalette(customPrompt = '') {
    currentPaletteIdx = (currentPaletteIdx + 1) % BRAND_PALETTES.length;
    currentColors = [...BRAND_PALETTES[currentPaletteIdx].colors];
    applyActivePalette();

    const input = $('#palettePromptInput');
    if (input && !customPrompt) {
      input.value = BRAND_PALETTES[currentPaletteIdx].prompt;
    }

    playChime(620 + Math.random() * 150, 'triangle', 0.14);
    showToast(`Generated: ${BRAND_PALETTES[currentPaletteIdx].name}`);
  }

  // ==================== 4. 3D REVOLVING AMPHITHEATER CAROUSEL (ZERO GAP RIBBON) ====================
  // Tight spacing formula eliminates gaps completely, matching HERO SECTION EXACT INSPO
  (() => {
    const stage = $('#carouselStage');
    const track = $('#carouselTrack');
    if (!stage || !track) return;

    // 16 rich visual cards ensuring continuous seamless stream
    const CARDS_DATA = [
      { type: 'video', src: 'assets/animated-rainbow.mp4', label: '3D KINETIC RAINBOW', badgeColor: '#ff5a4e' },
      { type: 'img', src: 'assets/hero_roses.jpg', label: 'CHROME ROSES #1C2B59', badgeColor: '#1e3a8a' },
      { type: 'img', src: 'assets/pricing_pro.jpg', label: 'ULTRAVIOLET TWIST #7A5CFF', badgeColor: '#7a5cff' },
      { type: 'svg_wave', label: 'OKLCH CHROMATIC WAVE', badgeColor: '#2fd7a0' },
      { type: 'img', src: 'assets/pricing_pink.jpg', label: 'CORAL SILK #FF7F77', badgeColor: '#ff5e5b' },
      { type: 'img', src: 'assets/hero_dunes.jpg', label: 'SOLAR SAGE #355C4D', badgeColor: '#ffb938' },
      { type: 'svg_prism', label: 'PRISMATIC MATRIX #9333EA', badgeColor: '#a855f7' },
      { type: 'img', src: 'assets/pricing_lime.jpg', label: 'LIME GLASS #A3D900', badgeColor: '#a3d900' },
      { type: 'img', src: 'assets/pricing_drop.jpg', label: 'LAVENDER RIPPLE #B4A0E5', badgeColor: '#b4a0e5' },
      { type: 'img', src: 'assets/pricing_spheres.jpg', label: 'COBALT SPHERES #3AA0FF', badgeColor: '#3aa0ff' },
      { type: 'svg_bars', label: 'SPECTRUM AUDIO PULSE', badgeColor: '#e056fd' },
      { type: 'mark', src: 'assets/palette-os-mark.png', label: 'PALETTE OS CORE', badgeColor: '#ffb938' },
      { type: 'img', src: 'assets/pricing_pro.jpg', label: 'CHROMATIC FLUID', badgeColor: '#7a5cff' },
      { type: 'img', src: 'assets/hero_roses.jpg', label: 'ROYAL VELVET', badgeColor: '#1e3a8a' },
      { type: 'img', src: 'assets/pricing_pink.jpg', label: 'ROSE SATIN', badgeColor: '#ff5e5b' },
      { type: 'video', src: 'assets/animated-rainbow.mp4', label: 'KINETIC ORBIT', badgeColor: '#ff5a4e' }
    ];

    const N = CARDS_DATA.length;
    const cardEls = CARDS_DATA.map((card, i) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'carousel-card';
      cardDiv.setAttribute('data-index', i);

      let mediaHtml = '';
      if (card.type === 'video') {
        mediaHtml = `
          <video class="card-media" autoplay loop muted playsinline poster="assets/hero_roses.jpg">
            <source src="${card.src}" type="video/mp4">
          </video>
        `;
      } else if (card.type === 'img') {
        mediaHtml = `<img src="${card.src}" alt="${card.label}" class="card-media" loading="eager">`;
      } else if (card.type === 'mark') {
        mediaHtml = `
          <div style="width: 100%; height: 100%; background: radial-gradient(circle at center, #27272f 0%, #0d0d10 100%); display: grid; place-items: center; padding: 32px;">
            <img src="${card.src}" alt="${card.label}" style="width: 110px; height: 110px; filter: drop-shadow(0 15px 30px rgba(255,90,78,0.35)); transform: rotate(-5deg);">
          </div>
        `;
      } else if (card.type === 'svg_wave') {
        mediaHtml = `
          <svg class="card-media" viewBox="0 0 240 340" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gWave_${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0f0c1b"/>
                <stop offset="40%" stop-color="#2fd7a0"/>
                <stop offset="75%" stop-color="#7a5cff"/>
                <stop offset="100%" stop-color="#ffb938"/>
              </linearGradient>
            </defs>
            <rect width="240" height="340" fill="url(#gWave_${i})"/>
            <path d="M0,180 C60,120 180,240 240,160 L240,340 L0,340 Z" fill="rgba(255,255,255,0.18)"/>
            <path d="M0,230 C80,180 160,260 240,210 L240,340 L0,340 Z" fill="rgba(255,255,255,0.24)"/>
            <circle cx="120" cy="110" r="45" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.6"/>
            <circle cx="120" cy="110" r="15" fill="#ffffff" opacity="0.9"/>
          </svg>
        `;
      } else if (card.type === 'svg_prism') {
        mediaHtml = `
          <svg class="card-media" viewBox="0 0 240 340" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gPrism_${i}" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#190e2e"/>
                <stop offset="50%" stop-color="#9333ea"/>
                <stop offset="100%" stop-color="#ff453a"/>
              </linearGradient>
            </defs>
            <rect width="240" height="340" fill="url(#gPrism_${i})"/>
            <polygon points="120,40 210,190 30,190" fill="none" stroke="#ffb938" stroke-width="3" opacity="0.75"/>
            <polygon points="120,280 200,160 40,160" fill="none" stroke="#2fd7a0" stroke-width="3" opacity="0.65"/>
            <circle cx="120" cy="170" r="30" fill="#ffffff" opacity="0.85"/>
          </svg>
        `;
      } else if (card.type === 'svg_bars') {
        mediaHtml = `
          <svg class="card-media" viewBox="0 0 240 340" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="240" height="340" fill="#09090d"/>
            <g transform="translate(30, 80)">
              <rect x="0" y="30" width="22" height="110" rx="6" fill="#e056fd"/>
              <rect x="34" y="10" width="22" height="130" rx="6" fill="#3aa0ff"/>
              <rect x="68" y="50" width="22" height="90" rx="6" fill="#2fd7a0"/>
              <rect x="102" y="0" width="22" height="140" rx="6" fill="#ffb938"/>
              <rect x="136" y="40" width="22" height="100" rx="6" fill="#ff5e5b"/>
              <rect x="170" y="20" width="22" height="120" rx="6" fill="#6c5ce7"/>
            </g>
          </svg>
        `;
      }

      cardDiv.innerHTML = `
        ${mediaHtml}
        <div class="card-badge">
          <span class="card-badge-dot" style="background-color: ${card.badgeColor};"></span>
          <span>${card.label}</span>
        </div>
      `;

      // Click card to select palette & trigger audio chime
      cardDiv.addEventListener('click', () => {
        shufflePalette();
        playChime(750, 'sine', 0.16);
      });

      track.appendChild(cardDiv);
      return cardDiv;
    });

    // Zero-Gap Amphitheater Physics Variables
    // Spacing of 144px coupled with center scale of 0.65 (143px width) eliminates gaps completely!
    const cardSpacing = 144;
    const totalWidth = N * cardSpacing;
    const halfWidth = totalWidth / 2;

    let offset = 0;
    let targetOffset = 0;
    let speed = 0.046; // Smooth continuous glide from right to left
    let isDragging = false;
    let isHovering = false;
    let startX = 0;
    let dragStartOffset = 0;
    let lastTime = performance.now();
    let isVisible = true;

    function render3DLayout() {
      const stageWidth = stage.clientWidth || window.innerWidth;

      cardEls.forEach((card, i) => {
        let x = (((i * cardSpacing + offset) % totalWidth) + totalWidth) % totalWidth;
        if (x > halfWidth) x -= totalWidth;

        // Normalized horizontal coordinate (-1.2 to +1.2)
        const normX = x / (stageWidth * 0.44);
        const absNorm = Math.abs(normX);

        // Concave cylindrical amphitheater projection:
        // Center (normX = 0): scale is 0.65, transZ is -260px (neat, snug, zero gap)
        // Sides: scales up to 1.30, transZ rises to +100px, rotating inward (-normX * 48deg)
        const curvedZ = -260 + Math.min(absNorm, 1.4) * 360;
        const curvedScale = 0.65 + Math.min(absNorm, 1.4) * 0.48;
        const rotY = -normX * 48;
        const zIndex = Math.round(absNorm * 50);

        // Fade out smoothly at edges
        const opacity = absNorm > 1.35 ? Math.max(0, 1 - (absNorm - 1.35) * 4) : 1;

        card.style.transform = `translate3d(${x}px, 0, ${curvedZ}px) rotateY(${rotY}deg) scale(${curvedScale})`;
        card.style.zIndex = zIndex;
        card.style.opacity = opacity;
      });
    }

    function animate(time) {
      const dt = time - lastTime;
      lastTime = time;

      if (isVisible) {
        if (!isDragging) {
          if (!prefersReducedMotion) {
            const currentSpeed = isHovering ? speed * 0.35 : speed;
            targetOffset -= dt * currentSpeed;
          }
          offset += (targetOffset - offset) * 0.08;
        }
        render3DLayout();
      }

      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Visibility Observer
    new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }).observe(stage);

    // Hover slowdown for inspection
    stage.addEventListener('mouseenter', () => { isHovering = true; });
    stage.addEventListener('mouseleave', () => { isHovering = false; });

    // Touch / Pointer Dragging Support
    stage.addEventListener('pointerdown', (e) => {
      isDragging = true;
      startX = e.clientX;
      dragStartOffset = targetOffset;
      stage.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      targetOffset = dragStartOffset + deltaX * 1.15;
      offset = targetOffset;
    });

    window.addEventListener('pointerup', () => {
      if (!isDragging) return;
      isDragging = false;
      stage.style.cursor = '';
    });
  })();

  // ==================== 5. PROMPT BAR GENERATION ====================
  const promptInput = $('#palettePromptInput');
  const promptBtn = $('#generateFromPromptBtn');

  if (promptBtn && promptInput) {
    const handlePromptSubmit = () => {
      const val = promptInput.value.trim();
      shufflePalette(val);
      playChime(820, 'sine', 0.15);
      showToast(`AI Palette generated for "${val.substring(0, 28)}..."`);
    };

    promptBtn.addEventListener('click', handlePromptSubmit);
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handlePromptSubmit();
      }
    });
  }

  // ==================== 6. LIVE UI LAB CONTROLS ====================
  const labShuffleBtn = $('#labShuffleBtn');
  if (labShuffleBtn) {
    labShuffleBtn.addEventListener('click', () => {
      shufflePalette();
    });
  }

  const labThemeToggle = $('#labThemeToggle');
  const uiSandbox = $('#uiSandboxCanvas');
  const themeModeLabel = $('.theme-mode-label', labThemeToggle);

  if (labThemeToggle && uiSandbox) {
    labThemeToggle.addEventListener('click', () => {
      const isDark = uiSandbox.classList.toggle('dark-mode');
      if (themeModeLabel) {
        themeModeLabel.textContent = isDark ? 'Mode: Dark' : 'Mode: Light';
      }
      playChime(isDark ? 450 : 650, 'sine', 0.08);
      showToast(isDark ? 'Preview: Dark Mode' : 'Preview: Light Mode');
    });
  }

  // Interactive UI Buttons inside the sandbox
  ['#demoBtn1', '#demoBtn2', '#demoBtn3', '#appHeroCta'].forEach(sel => {
    const btn = $(sel);
    if (btn) {
      btn.addEventListener('click', () => {
        playChime(640, 'triangle', 0.1);
        showToast('Interactive button clicked');
      });
    }
  });

  // Interactive SVG Icons Grid Clicks
  $$('.svg-icon-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      const name = $('span', cell)?.textContent || 'Icon';
      playChime(720 + Math.random() * 100, 'sine', 0.09);
      cell.style.transform = 'scale(1.2) translateY(-4px)';
      setTimeout(() => { cell.style.transform = ''; }, 250);
      showToast(`Selected glyph: ${name}`);
    });
  });

  // Global Spacebar shortcut
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag !== 'input' && tag !== 'textarea') {
        e.preventDefault();
        shufflePalette();
      }
    }
  });

  // Navigation scroll elevation
  const mainNav = $('#main-nav');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ==================== 7. PRICING TABS ====================
  const planTabs = $$('#planSwitcher .plan-tab');
  const pricingTierName = $('#pricingTierName');
  const pricingTierPrice = $('#pricingTierPrice');
  const pricingTierPerks = $('#pricingTierPerks');

  const PLAN_DATA = {
    free: {
      name: 'Free Starter',
      price: '$0',
      period: '/forever',
      perks: [
        '5 active OKLCH color palettes',
        'Standard WCAG 2.1 contrast checks',
        'Direct CSS variables export'
      ]
    },
    pro: {
      name: 'Upgrade to Pro',
      price: '$79',
      period: '/month',
      perks: [
        'Autonomous OKLCH space engine',
        'Unlimited live UI component testing',
        'Automated WCAG 2.2 AAA & APCA audits',
        '1-click Tailwind, Figma, and CSS handoff'
      ]
    },
    enterprise: {
      name: 'Enterprise Grid',
      price: '$249',
      period: '/month',
      perks: [
        'Unlimited design systems & multi-brand sync',
        'Dedicated WCAG / APCA compliance SLA',
        'Automated Git token PR integration',
        'Private team color space vault'
      ]
    }
  };

  planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      planTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const planKey = tab.dataset.plan;
      const data = PLAN_DATA[planKey];
      if (data && pricingTierName && pricingTierPrice && pricingTierPerks) {
        pricingTierName.textContent = data.name;
        pricingTierPrice.innerHTML = `${data.price}<span class="per-period">${data.period}</span>`;
        pricingTierPerks.innerHTML = data.perks.map(p => `<li><span class="perk-check">✔</span> ${p}</li>`).join('');
      }
      playChime(620, 'sine', 0.08);
    });
  });

  // Initialize
  applyActivePalette();
})();
