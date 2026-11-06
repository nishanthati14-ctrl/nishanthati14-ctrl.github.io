// ============================================================================
// 1. 24 NAMELESS SWARM CURSORS — SLOW VORTEX ORBIT & DELIBERATE CONSTRUCTION
// ============================================================================
const NUM_CURSORS = 24;
const cursorPalette = [
  "#f8fafc", "#cbd5e1", "#38bdf8", "#22d3ee", "#818cf8", "#94a3b8"
];

let cursors = [];
let swarmEnabled = true;
let swarmPhase = "vortex"; // "vortex" -> "building" -> "ambient"
let animFrameId = null;
let buildTimeouts = [];

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
    document.documentElement.style.setProperty("--my", `${e.clientY}px`);
  });

  selectSerEmotion("fear");
  selectFloraCase(0);

  initSwarmCursors();
  runSlowSwarmBuildSequence();

  const replayBtn = document.getElementById("replay-build-btn");
  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      runSlowSwarmBuildSequence();
    });
  }

  const toggleBtn = document.getElementById("toggle-swarm-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      swarmEnabled = !swarmEnabled;
      const layer = document.getElementById("swarm-layer");
      if (layer) layer.style.opacity = swarmEnabled ? "1" : "0";
      toggleBtn.textContent = swarmEnabled ? "24 Cursors: ON" : "24 Cursors: OFF";
    });
  }

  initHandsFreeJarvis();

  document.body.addEventListener(
    "click",
    () => {
      if (!voiceArmed) enableHandsFreeVoice(true);
    },
    { once: true }
  );
});

function initSwarmCursors() {
  const layer = document.getElementById("swarm-layer");
  if (!layer) return;
  layer.innerHTML = "";
  cursors = [];

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < NUM_CURSORS; i++) {
    const color = cursorPalette[i % cursorPalette.length];
    const el = document.createElement("div");
    el.className = "swarm-cursor";

    el.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" style="filter: drop-shadow(0 3px 8px rgba(0,0,0,0.9));">
        <path d="M3 2l17 11-7 2-4 7L3 2z" stroke="#030306" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    `;

    layer.appendChild(el);

    const angle = (i / NUM_CURSORS) * Math.PI * 2;
    const radius = 55 + (i % 4) * 36;

    cursors.push({
      el,
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      tx: cx,
      ty: cy,
      angle,
      radius,
      speed: 0.016 + (i % 4) * 0.004,
      ease: 0.045 + (i % 5) * 0.008
    });
  }

  if (animFrameId) cancelAnimationFrame(animFrameId);
  animateSwarmLoop();
}

function animateSwarmLoop() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  for (let i = 0; i < cursors.length; i++) {
    const c = cursors[i];

    if (swarmPhase === "vortex") {
      c.angle += c.speed;
      const radialWave = Math.sin(c.angle * 2.5 + i) * 22;
      c.tx = cx + Math.cos(c.angle) * (c.radius + radialWave);
      c.ty = cy + Math.sin(c.angle) * (c.radius + radialWave);
      c.x += (c.tx - c.x) * 0.12;
      c.y += (c.ty - c.y) * 0.12;
    } else {
      c.x += (c.tx - c.x) * c.ease;
      c.y += (c.ty - c.y) * c.ease;
    }

    c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
  }

  animFrameId = requestAnimationFrame(animateSwarmLoop);
}

function spawnCursorRipple(c) {
  const ring = document.createElement("div");
  ring.className = "cursor-ripple";
  c.el.appendChild(ring);
  setTimeout(() => ring.remove(), 650);
}

function runSlowSwarmBuildSequence() {
  buildTimeouts.forEach((t) => clearTimeout(t));
  buildTimeouts = [];

  const banner = document.getElementById("build-status-banner");
  const bannerText = document.getElementById("build-stage-text");
  const pctEl = document.getElementById("build-pct");

  const blocks = Array.from(document.querySelectorAll(".build-block")).sort(
    (a, b) => Number(a.dataset.buildOrder || 0) - Number(b.dataset.buildOrder || 0)
  );

  blocks.forEach((b) => b.classList.remove("built", "assembling"));

  if (banner) {
    banner.style.opacity = "1";
    bannerText.textContent = "SWARM_ORCHESTRATOR // 24 CURSORS CIRCLING IN VORTEX FORMATION...";
    if (pctEl) pctEl.textContent = "0%";
  }

  swarmPhase = "vortex";

  const phase2Timer = setTimeout(() => {
    swarmPhase = "building";
    if (bannerText) {
      bannerText.textContent = "AUTONOMOUS_CONSTRUCTION // ASSEMBLING PORTFOLIO ARCHITECTURE...";
    }

    const STEP_DELAY = 650;

    blocks.forEach((block, idx) => {
      const t1 = setTimeout(() => {
        const rect = block.getBoundingClientRect();
        block.classList.add("assembling");

        const progress = Math.round(((idx + 1) / blocks.length) * 100);
        if (pctEl) pctEl.textContent = `${progress}%`;
        if (bannerText) {
          bannerText.textContent = `SWARM_ASSEMBLING // MODULE ${String(idx + 1).padStart(2, "0")} OF ${blocks.length}...`;
        }

        cursors.forEach((c, cIdx) => {
          if (cIdx % 2 === idx % 2 || idx < 3) {
            const targetX = rect.left + Math.random() * Math.max(120, rect.width);
            const targetY = rect.top + Math.random() * Math.max(60, rect.height);
            c.tx = Math.max(20, Math.min(window.innerWidth - 30, targetX));
            c.ty = Math.max(20, Math.min(window.innerHeight - 30, targetY));
            c.ease = 0.055 + (cIdx % 4) * 0.01;
            if (Math.random() > 0.4) spawnCursorRipple(c);
          }
        });

        const t2 = setTimeout(() => {
          block.classList.remove("assembling");
          block.classList.add("built");
        }, 520);
        buildTimeouts.push(t2);
      }, idx * STEP_DELAY);

      buildTimeouts.push(t1);
    });

    const finishTimer = setTimeout(() => {
      swarmPhase = "ambient";
      if (bannerText) bannerText.textContent = "WORKSPACE_ONLINE // SAY 'HELLO JARVIS' FOR VOICE OS";
      setTimeout(() => {
        if (banner) banner.style.opacity = "0";
      }, 2800);
      startAmbientDrift();
    }, blocks.length * STEP_DELAY + 800);

    buildTimeouts.push(finishTimer);
  }, 4200);

  buildTimeouts.push(phase2Timer);
}

let ambientInterval = null;
function startAmbientDrift() {
  if (ambientInterval) clearInterval(ambientInterval);
  const blocks = Array.from(document.querySelectorAll(".build-block"));

  ambientInterval = setInterval(() => {
    if (swarmPhase !== "ambient" || !swarmEnabled) return;

    const visibleBlocks = blocks.filter((b) => {
      const r = b.getBoundingClientRect();
      return r.bottom > 50 && r.top < window.innerHeight - 50;
    });
    if (!visibleBlocks.length) return;

    cursors.forEach((c) => {
      if (Math.random() > 0.5) {
        const target = visibleBlocks[Math.floor(Math.random() * visibleBlocks.length)];
        const r = target.getBoundingClientRect();
        c.tx = Math.max(20, Math.min(window.innerWidth - 30, r.left + Math.random() * r.width));
        c.ty = Math.max(20, Math.min(window.innerHeight - 30, r.top + Math.random() * r.height));
        c.ease = 0.02 + Math.random() * 0.02;
        if (Math.random() > 0.85) spawnCursorRipple(c);
      }
    });
  }, 2400);
}

// ============================================================================
// 2. VISUAL DATA EXPLORERS (SER LIME/ATTENTION & FLORA SVG GRAD-CAM)
// ============================================================================
const serEmotionData = {
  fear: {
    title: "LIME Local Explanation — Fear Class (Fig. 6a)",
    attnDesc: "Localized attention spikes across mid-to-late frames (t = 65–115) capture rapid pitch and spectral contrast shifts in Fear speech.",
    bars: [
      { feat: "F20 > 0.17 (MFCC-20)", val: "+0.130", pos: true, w: "88%" },
      { feat: "F11 <= -0.27 (MFCC-11)", val: "+0.120", pos: true, w: "80%" },
      { feat: "F7 <= -0.19 (MFCC-7)", val: "-0.110", pos: false, w: "74%" },
      { feat: "F5 <= -0.27 (MFCC-5)", val: "-0.110", pos: false, w: "72%" },
      { feat: "F10 <= -0.20 (MFCC-10)", val: "+0.100", pos: true, w: "68%" }
    ],
    weights: [22, 35, 60, 48, 30, 42, 38, 25, 45, 78, 35, 96, 40, 55, 88, 62, 30, 74, 32, 65, 28, 40, 52, 30]
  },
  anger: {
    title: "LIME Local Explanation — Anger Class (Fig. 6b)",
    attnDesc: "High-intensity early-to-mid temporal attention peak (t = 35–70) aligns with elevated RMS energy and formant bursts.",
    bars: [
      { feat: "F11 > 0.34 (MFCC-11)", val: "-0.095", pos: false, w: "86%" },
      { feat: "F7 > 0.29 (MFCC-7)", val: "+0.075", pos: true, w: "76%" },
      { feat: "F10 > 0.38 (MFCC-10)", val: "-0.070", pos: false, w: "70%" },
      { feat: "F31 > 0.24 (MFCC-31)", val: "+0.064", pos: true, w: "64%" },
      { feat: "0.02 < F6 <= 0.42", val: "+0.055", pos: true, w: "56%" }
    ],
    weights: [45, 52, 48, 62, 58, 70, 98, 75, 68, 42, 55, 50, 44, 58, 46, 52, 60, 48, 55, 65, 50, 42, 38, 44]
  },
  neutral: {
    title: "LIME Local Explanation — Neutral Class (Fig. 6c)",
    attnDesc: "Distributed, balanced temporal attention peaks reflect steady prosodic cadence and narrow pitch variance.",
    bars: [
      { feat: "F5 > 0.38 (MFCC-5)", val: "+0.100", pos: true, w: "90%" },
      { feat: "F7 > 0.29 (MFCC-7)", val: "+0.078", pos: true, w: "74%" },
      { feat: "F2 > 0.25 (MFCC-2)", val: "+0.064", pos: true, w: "64%" },
      { feat: "-0.38 < F6 <= 0.02", val: "-0.062", pos: false, w: "62%" },
      { feat: "F13 > 0.31 (MFCC-13)", val: "-0.056", pos: false, w: "56%" }
    ],
    weights: [65, 25, 48, 42, 30, 72, 78, 35, 58, 28, 32, 38, 92, 68, 45, 84, 30, 56, 40, 50, 32, 24, 36, 28]
  },
  sad: {
    title: "LIME Local Explanation — Sad Class (Fig. 6d)",
    attnDesc: "Sustained attention over lower-energy vowel transitions (t = 25–60 and t = 115–135) captures downward pitch contours.",
    bars: [
      { feat: "F6 <= -0.38 (MFCC-6)", val: "-0.165", pos: false, w: "92%" },
      { feat: "F10 <= -0.26 (MFCC-10)", val: "+0.110", pos: true, w: "78%" },
      { feat: "F11 <= -0.27 (MFCC-11)", val: "+0.104", pos: true, w: "74%" },
      { feat: "F5 > 0.38 (MFCC-5)", val: "+0.082", pos: true, w: "62%" },
      { feat: "F2 > 0.25 (MFCC-2)", val: "+0.064", pos: true, w: "52%" }
    ],
    weights: [25, 32, 68, 52, 40, 95, 58, 38, 48, 32, 36, 54, 42, 30, 48, 35, 52, 82, 44, 30, 38, 46, 34, 28]
  },
  happy: {
    title: "LIME Local Explanation — Happy Class (Fig. 6e)",
    attnDesc: "Multi-peak temporal attention across energetic syllables highlights harmonic chroma and high-frequency spectral contrast.",
    bars: [
      { feat: "F6 <= -0.38 (MFCC-6)", val: "-0.160", pos: false, w: "90%" },
      { feat: "F10 <= -0.26 (MFCC-10)", val: "+0.112", pos: true, w: "78%" },
      { feat: "F5 > 0.38 (MFCC-5)", val: "+0.105", pos: true, w: "74%" },
      { feat: "F0 <= -0.22 (MFCC-0)", val: "+0.052", pos: true, w: "48%" },
      { feat: "F2 > 0.25 (MFCC-2)", val: "+0.048", pos: true, w: "45%" }
    ],
    weights: [55, 62, 48, 58, 38, 88, 52, 42, 60, 40, 36, 48, 65, 35, 76, 62, 82, 92, 45, 38, 68, 40, 54, 48]
  }
};

function selectSerEmotion(emoKey) {
  const data = serEmotionData[emoKey];
  if (!data) return;

  document.querySelectorAll(".emo-tab").forEach((btn) => {
    btn.classList.toggle("active-emo", btn.getAttribute("data-emo") === emoKey);
  });

  const limeTitle = document.getElementById("lime-title");
  const limeBars = document.getElementById("lime-bars");
  const attnDesc = document.getElementById("attn-desc");
  const strip = document.getElementById("attn-heatmap-strip");

  if (limeTitle) limeTitle.textContent = data.title;
  if (attnDesc) attnDesc.textContent = data.attnDesc;

  if (limeBars) {
    limeBars.innerHTML = data.bars
      .map(
        (b) => `
        <div class="space-y-1">
          <div class="flex justify-between text-[11px]">
            <span class="text-zinc-300">${b.feat}</span>
            <span class="${b.pos ? "text-emerald-400" : "text-rose-400"} font-bold">${b.val}</span>
          </div>
          <div class="w-full bg-white/[0.06] h-2 rounded overflow-hidden">
            <div class="h-full ${b.pos ? "bg-emerald-400" : "bg-rose-400"}" style="width:${b.w}"></div>
          </div>
        </div>
      `
      )
      .join("");
  }

  if (strip) {
    strip.innerHTML = data.weights
      .map((h) => {
        const color =
          h > 80 ? "bg-amber-300" : h > 55 ? "bg-cyan-400" : "bg-indigo-500/60";
        return `<div class="flex-1 ${color} rounded-t transition-all duration-300" style="height:${h}%"></div>`;
      })
      .join("");
  }
}

const floraCases = [
  {
    actual: "Corn_(maize)___Common_rust_",
    predicted: "Corn_(maize)___Common_rust_",
    confidence: "99.9%",
    status: "CORRECT PREDICTION · FOCAL LESION LOCALIZATION",
    statusColor: "text-emerald-400",
    spotCx: "56%",
    spotCy: "54%",
    spotColor: "rgba(239, 68, 68, 0.85)",
    analysis:
      "Grad-CAM thermal activation locks directly onto the rust-pustule clusters in the mid-blade region, verifying that ResNet50 relies on disease pathology."
  },
  {
    actual: "Tomato___Septoria_leaf_spot",
    predicted: "Tomato___Septoria_leaf_spot",
    confidence: "70.2%",
    status: "CORRECT PREDICTION · NECROTIC SPOT ISOLATED",
    statusColor: "text-cyan-400",
    spotCx: "38%",
    spotCy: "62%",
    spotColor: "rgba(249, 115, 22, 0.85)",
    analysis:
      "ResNet50 isolates a localized Septoria lesion on the lower-left lamina with 70.2% confidence."
  },
  {
    actual: "Orange___Haunglongbing_(Citrus_greening)",
    predicted: "Orange___Haunglongbing_(Citrus_greening)",
    confidence: "99.6%",
    status: "CORRECT PREDICTION · DIFFUSE WHOLE-LEAF ACTIVATION",
    statusColor: "text-amber-300",
    spotCx: "50%",
    spotCy: "50%",
    spotColor: "rgba(56, 189, 248, 0.35)",
    analysis:
      "Classified at 99.6% confidence without a single focal hotspot—demonstrating reliance on global leaf chlorosis rather than a discrete spot."
  },
  {
    actual: "Apple___healthy",
    predicted: "Apple___Apple_scab",
    confidence: "30.5%",
    status: "DOCUMENTED FAILURE CASE · MARGIN ARTIFACT",
    statusColor: "text-rose-400",
    spotCx: "45%",
    spotCy: "20%",
    spotColor: "rgba(239, 68, 68, 0.9)",
    analysis:
      "Healthy apple leaf misclassified as Apple Scab (30.5% confidence). Grad-CAM exposes spurious activation along the upper leaf margin lighting edge."
  }
];

function selectFloraCase(idx) {
  const c = floraCases[idx];
  if (!c) return;

  document.querySelectorAll(".flora-tab").forEach((btn, i) => {
    btn.classList.toggle("active-flora", i === idx);
  });

  const display = document.getElementById("flora-case-display");
  if (display) {
    display.innerHTML = `
      <div class="flex items-center justify-between border-b border-white/10 pb-2">
        <span class="${c.statusColor} font-bold text-[11px]">${c.status}</span>
        <span class="text-white font-bold">Conf: ${c.confidence}</span>
      </div>

      <div class="grid grid-cols-2 gap-3 py-2 items-center">
        <div class="h-28 rounded-xl bg-zinc-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
          <svg width="64" height="64" viewBox="0 0 100 100">
            <path d="M50 10 C80 25, 85 65, 50 90 C15 65, 20 25, 50 10 Z" fill="#15803d" stroke="#4ade80" stroke-width="2"/>
            <path d="M50 15 L50 85" stroke="#86efac" stroke-width="1.5"/>
          </svg>
          <span class="text-[9px] text-zinc-400 mt-1">Original RGB Leaf (160×160)</span>
        </div>

        <div class="h-28 rounded-xl bg-zinc-900 border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden">
          <svg width="64" height="64" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="gradCamSpot" cx="${c.spotCx}" cy="${c.spotCy}" r="42%">
                <stop offset="0%" stop-color="${c.spotColor}"/>
                <stop offset="55%" stop-color="rgba(234, 179, 8, 0.55)"/>
                <stop offset="100%" stop-color="rgba(30, 64, 175, 0.25)"/>
              </radialGradient>
            </defs>
            <path d="M50 10 C80 25, 85 65, 50 90 C15 65, 20 25, 50 10 Z" fill="url(#gradCamSpot)" stroke="#38bdf8" stroke-width="2"/>
          </svg>
          <span class="text-[9px] text-cyan-300 mt-1">Grad-CAM Overlay</span>
        </div>
      </div>

      <div class="text-[11px] text-zinc-400">
        <div>Actual: <span class="text-zinc-200">${c.actual}</span></div>
        <div>Predicted: <span class="text-white">${c.predicted}</span></div>
      </div>
      <p class="text-zinc-300 leading-relaxed text-xs">${c.analysis}</p>
    `;
  }
}

// ============================================================================
// 3. 100% LOCAL J.A.R.V.I.S. NEURAL ENGINE — SEMANTIC NLP + AUTOPILOT TOUR
// ============================================================================
let voiceArmed = false;
let hudOpen = false;
let jarvisSpeaking = false;
let continuousRec = null;
let selectedDeepVoice = null;
let tourActive = false;
let tourTimeouts = [];

const JARVIS_KNOWLEDGE_GRAPH = [
  {
    id: "tour",
    keywords: ["tour", "walkthrough", "guide", "show me around", "present", "autopilot", "demonstrate", "everything"],
    weight: 3,
    handler: () => startJarvisGuidedTour()
  },
  {
    id: "stand_down",
    keywords: ["stand down", "close", "exit", "sleep", "dismiss", "hide", "shut down", "bye"],
    weight: 3,
    speech: "Standing down holographic HUD, Sir. I will remain on background voice watch should you need me.",
    action: "CLOSE_HUD"
  },
  {
    id: "rebuild",
    keywords: ["rebuild", "replay", "swarm", "cursors", "construct", "build again", "vortex", "animation"],
    weight: 3,
    speech: "Re-deploying all twenty-four autonomous swarm cursors into vortex formation now, Sir. Minimizing HUD so you can observe the construction sequence.",
    action: "REBUILD_SWARM"
  },
  {
    id: "identity",
    keywords: ["who is nishant", "introduce", "about nishant", "summary", "profile", "bio", "background", "himself"],
    weight: 2,
    speech: "Nishant Kumar Hati is a Master of Science in Data Science researcher at Amity University Rajasthan, Jaipur, and the Founding General Coordinator of the DEXA Analytics Club. His research spans Deep Learning, Computer Vision, Speech Emotion Recognition, and Explainable AI. He also holds a Shodan First Degree Black Belt in Okinawan Goju-Ryu Karate.",
    action: "SCROLL_HERO"
  },
  {
    id: "ser_overview",
    keywords: ["speech emotion", "ser", "springer", "ijst", "audio paper", "indian emotional", "iesc", "first paper"],
    weight: 2,
    speech: "Navigating to the Speech Emotion Recognition laboratory, Sir. This manuscript is currently under review at Springer Nature's International Journal of Speech Technology. Evaluated on 600 utterances from the Indian Emotional Speech Corpora, Nishant benchmarked ten deep architectures using 68 acoustic features. His 1D CNN plus Attention model achieved the highest accuracy at 91.67 percent.",
    action: "SCROLL_SER"
  },
  {
    id: "ser_features",
    keywords: ["68 features", "mfcc", "chroma", "tonnetz", "spectral contrast", "zcr", "rms", "pitch", "librosa", "150", "matrix"],
    weight: 2.5,
    speech: "For each speech recording in the IESC dataset, 68 handcrafted features were extracted using Librosa: 40 MFCCs, 12 Chroma features, 7 Spectral Contrast features, 6 Tonnetz features, Zero Crossing Rate, RMS Energy, and Fundamental Pitch. Sequences were zero-padded to 150 time steps with Z-score normalization, forming a 150 by 68 input tensor.",
    action: "SCROLL_SER"
  },
  {
    id: "ser_models",
    keywords: ["10 models", "ten models", "bilstm", "lstm", "cnn attention", "91.67", "accuracy comparison", "table 1"],
    weight: 2.5,
    speech: "Across all ten architectures tested on the IESC dataset, 1D CNN plus Attention ranked first with 91.67 percent accuracy and 91.64 percent F1-score, followed closely by BiLSTM plus Attention at 90.83 percent, and 1D CNN plus LSTM plus Attention at 89.17 percent. Standalone LSTM scored 77.50 percent, proving that attention weighting dramatically boosts emotion recognition.",
    action: "SCROLL_SER"
  },
  {
    id: "ser_confusion",
    keywords: ["confusion matrix", "misclassification", "110", "120", "diagonal"],
    weight: 2.5,
    speech: "In the test partition of 120 utterances, the 1D CNN plus Attention model correctly classified 110 samples: 21 of 24 for Angry, 23 of 24 for Fear, 21 of 24 for Happy, 22 of 24 for Neutral, and 23 of 24 for Sad.",
    action: "SCROLL_SER"
  },
  {
    id: "ser_shap_lime",
    keywords: ["shap", "lime", "beeswarm", "f6", "f9", "f20", "attention heatmap", "research question", "rq1", "rq2", "rq3"],
    weight: 2.5,
    speech: "To eliminate the black-box limitation, Nishant applied three Explainable AI methods. Global SHAP beeswarm plots revealed that features F6, F9, F20, F10, and F19 carry the strongest impact. Local LIME plots isolated class-specific feature weights, while 150-step Temporal Attention Heatmaps pinpointed the exact vocal segments driving each prediction.",
    action: "SCROLL_SER"
  },
  {
    id: "emotion_fear",
    keywords: ["fear", "fear class", "6a"],
    weight: 3,
    speech: "Switching the XAI inspector to the Fear emotion class. Notice how LIME highlights MFCC-20 and MFCC-11 as positive drivers, while the attention heatmap peaks sharply between time steps 65 and 115.",
    action: "EMOTION_FEAR"
  },
  {
    id: "emotion_anger",
    keywords: ["anger", "angry", "6b"],
    weight: 3,
    speech: "Loading the Anger class explanation. Early-to-mid temporal attention spikes align with elevated RMS energy and formant bursts.",
    action: "EMOTION_ANGER"
  },
  {
    id: "emotion_happy",
    keywords: ["happy", "happiness", "6e"],
    weight: 3,
    speech: "Displaying the Happy emotion class. Multi-peak temporal attention across energetic syllables highlights harmonic chroma and spectral contrast.",
    action: "EMOTION_HAPPY"
  },
  {
    id: "emotion_sad",
    keywords: ["sad", "sadness", "6d"],
    weight: 3,
    speech: "Inspecting the Sad emotion class, where sustained attention weights track downward pitch contours and low-energy vowel transitions.",
    action: "EMOTION_SAD"
  },
  {
    id: "flora_overview",
    keywords: ["flora", "plant", "leaf", "disease", "plantvillage", "54305", "38 classes", "second paper", "computer vision"],
    weight: 2,
    speech: "Displaying the FLORA Computer Vision study, co-authored at Amity Institute of Information Technology. FLORA evaluated five deep learning architectures across 54,305 PlantVillage leaf images spanning 38 classes. ResNet50 achieved the highest performance with 95.15 percent accuracy, 92.98 percent macro F1, and a test loss of 0.189.",
    action: "SCROLL_FLORA"
  },
  {
    id: "flora_imbalance",
    keywords: ["imbalance", "36:1", "huanglongbing", "citrus", "potato", "mobilenet", "efficientnet", "densenet", "custom cnn"],
    weight: 2.5,
    speech: "PlantVillage exhibits a severe 36-to-1 class imbalance, ranging from 5,507 images for Orange Citrus Greening down to 152 for healthy Potato. Using stratified splits and class weighting, ResNet50 reached 95.15 percent accuracy, MobileNetV2 reached 93.43 percent, EfficientNetB0 scored 92.14 percent, DenseNet121 scored 91.34 percent, and the custom CNN baseline reached 82.57 percent.",
    action: "SCROLL_FLORA"
  },
  {
    id: "flora_gradcam_rust",
    keywords: ["maize", "corn", "rust", "99.9"],
    weight: 3,
    speech: "Selecting the Maize Common Rust Grad-CAM case. ResNet50 classified this leaf with 99.9 percent confidence, with thermal activation tightly locked onto the rust pustules.",
    action: "FLORA_CASE_0"
  },
  {
    id: "flora_gradcam_tomato",
    keywords: ["tomato", "septoria", "70.2"],
    weight: 3,
    speech: "Selecting the Tomato Septoria Leaf Spot Grad-CAM overlay, correctly predicted at 70.2 percent confidence with focal activation over the necrotic lesion.",
    action: "FLORA_CASE_1"
  },
  {
    id: "flora_gradcam_error",
    keywords: ["apple", "scab", "failure", "error", "misclassified", "30.5", "limitation"],
    weight: 3,
    speech: "Loading the documented failure case from Figure 5. Here, a healthy apple leaf was misclassified as Apple Scab at 30.5 percent confidence. Grad-CAM reveals that the model was distracted by lighting along the upper leaf margin rather than a true lesion—proving why Explainable AI auditing is essential.",
    action: "FLORA_CASE_3"
  },
  {
    id: "hyperparameters",
    keywords: ["learning rate", "optimizer", "adam", "epochs", "batch size", "training", "hyperparameter"],
    weight: 2.5,
    speech: "In the Speech Emotion study, models were trained with the Adam optimizer at a learning rate of 0.0005, batch size 32, and up to 70 epochs with EarlyStopping. In the FLORA plant study, all five backbones used Adam at a 0.001 learning rate, batch size 64, 160 by 160 RGB resolution, and a controlled 5-epoch schedule with class weights.",
    action: "NONE"
  },
  {
    id: "ml_practicals",
    keywords: ["practical", "machine learning", "github", "repo", "knn", "naive bayes", "regression", "random forest", "clustering", "eye", "shanti"],
    weight: 2,
    speech: "Scrolling to Nishant's engineering repositories. His GitHub features an Applied Machine Learning suite implementing Linear and Logistic Regression, KNN, Naive Bayes, Decision Trees, Random Forests, Clustering, and Eye Image Classification, alongside the production Shanti Global Academy web portal.",
    action: "SCROLL_ML"
  },
  {
    id: "dexa_karate",
    keywords: ["karate", "black belt", "shodan", "goju", "martial arts", "dexa", "club", "founding", "coordinator", "leadership"],
    weight: 2,
    speech: "Nishant is the Founding General Coordinator of the DEXA Data Exploration and Analytics Club at Amity University Rajasthan. Outside of AI research, he holds a Shodan First Degree Black Belt in traditional Okinawan Goju-Ryu Karate.",
    action: "SCROLL_LEADERSHIP"
  },
  {
    id: "orcid_contact",
    keywords: ["orcid", "email", "contact", "linkedin", "hire", "collaborate", "reach"],
    weight: 2,
    speech: "Nishant's verified ORCID identifier is 0009-0008-1336-3544. You can reach him directly at nishanthati14@gmail.com or connect with him on LinkedIn and GitHub.",
    action: "SCROLL_HERO"
  }
];

function playStarkAudioFX(type = "wake") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === "wake") {
      [440, 660, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq * 0.7, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.22);
        gain.gain.setValueAtTime(0.05 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + 0.38);
      });
    } else if (type === "scan") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.09);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    }
  } catch (e) {}
}

function initHandsFreeJarvis() {
  const hudForm = document.getElementById("jarvis-hud-form");
  const hudInput = document.getElementById("jarvis-hud-input");
  if (hudForm) {
    hudForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = hudInput.value.trim();
      if (!val) return;
      hudInput.value = "";
      executeJarvisCommand(val);
    });
  }

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;

  continuousRec = new SpeechRec();
  continuousRec.lang = "en-US";
  continuousRec.continuous = true;
  continuousRec.interimResults = true;

  continuousRec.onresult = (event) => {
    if (jarvisSpeaking) return;

    let transcript = "";
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript.toLowerCase();
      if (event.results[i].isFinal) isFinal = true;
    }

    const clean = transcript.trim();
    const transcriptEl = document.getElementById("jarvis-user-transcript");
    if (hudOpen && transcriptEl && clean) {
      transcriptEl.textContent = `VOICE_INPUT // "${clean.toUpperCase()}"`;
    }

    if (!hudOpen && (clean.includes("hello jarvis") || clean.includes("hey jarvis") || clean.includes("wake up jarvis"))) {
      SummonJarvisHud();
      return;
    }

    if (hudOpen && isFinal && clean.length > 2) {
      executeJarvisCommand(clean);
    }
  };

  continuousRec.onend = () => {
    if (voiceArmed && !jarvisSpeaking) {
      try {
        continuousRec.start();
      } catch (e) {}
    }
  };
}

function enableHandsFreeVoice(silent = false) {
  voiceArmed = true;
  const dot = document.getElementById("mic-pulse-dot");
  const text = document.getElementById("mic-sensor-text");
  if (dot) dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping";
  if (text) text.textContent = 'MIC ARMED · SAY "HELLO JARVIS" ANYTIME';

  if (continuousRec) {
    try {
      continuousRec.start();
    } catch (e) {}
  }
  if (!silent) playStarkAudioFX("wake");
}

function triggerManualVoiceListen() {
  enableHandsFreeVoice(false);
  const transcriptEl = document.getElementById("jarvis-user-transcript");
  if (transcriptEl) transcriptEl.textContent = "LISTENING FOR YOUR VOICE DIRECTIVE, SIR...";
}

function getTimeOfDayGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning, Sir.";
  if (hr < 18) return "Good afternoon, Sir.";
  return "Good evening, Sir.";
}

function SummonJarvisHud() {
  stopJarvisTour();
  const overlay = document.getElementById("jarvis-hud-overlay");
  if (!overlay) return;
  hudOpen = true;
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
  playStarkAudioFX("wake");
  enableHandsFreeVoice(true);

  const greeting = `${getTimeOfDayGreeting()} J.A.R.V.I.S. holographic interface online. All twenty-four swarm cursors and Nishant Kumar Hati's research modules are standing by. Ask me any technical question, or command me to launch an autopilot tour.`;
  speakDeepJarvis(greeting);
}

function deactivateJarvisHud() {
  stopJarvisTour();
  const overlay = document.getElementById("jarvis-hud-overlay");
  if (!overlay) return;
  hudOpen = false;
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && hudOpen) deactivateJarvisHud();
});

function runDomAction(actionCode) {
  switch (actionCode) {
    case "SCROLL_HERO":
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "SCROLL_SER":
      document.getElementById("ser-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "SCROLL_FLORA":
      document.getElementById("flora-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "SCROLL_ML":
      document.getElementById("ml-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "SCROLL_LEADERSHIP":
      document.getElementById("leadership-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "EMOTION_FEAR":
      selectSerEmotion("fear");
      document.getElementById("ser-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "EMOTION_ANGER":
      selectSerEmotion("anger");
      document.getElementById("ser-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "EMOTION_HAPPY":
      selectSerEmotion("happy");
      document.getElementById("ser-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "EMOTION_SAD":
      selectSerEmotion("sad");
      document.getElementById("ser-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "EMOTION_NEUTRAL":
      selectSerEmotion("neutral");
      document.getElementById("ser-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "FLORA_CASE_0":
      selectFloraCase(0);
      document.getElementById("flora-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "FLORA_CASE_1":
      selectFloraCase(1);
      document.getElementById("flora-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "FLORA_CASE_2":
      selectFloraCase(2);
      document.getElementById("flora-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "FLORA_CASE_3":
      selectFloraCase(3);
      document.getElementById("flora-section")?.scrollIntoView({ behavior: "smooth" });
      break;
    case "REBUILD_SWARM":
      deactivateJarvisHud();
      window.scrollTo({ top: 0, behavior: "smooth" });
      runSlowSwarmBuildSequence();
      break;
    case "CLOSE_HUD":
      deactivateJarvisHud();
      break;
  }
}

function executeJarvisCommand(rawText) {
  playStarkAudioFX("scan");
  const q = rawText.toLowerCase().trim();
  const transcriptEl = document.getElementById("jarvis-user-transcript");
  if (transcriptEl) transcriptEl.textContent = `DIRECTIVE // "${rawText.toUpperCase()}"`;

  let bestNode = null;
  let highestScore = 0;

  for (const node of JARVIS_KNOWLEDGE_GRAPH) {
    let score = 0;
    for (const kw of node.keywords) {
      if (q.includes(kw)) {
        score += kw.split(" ").length * node.weight;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestNode = node;
    }
  }

  if (bestNode) {
    if (bestNode.handler) {
      bestNode.handler();
      return;
    }
    if (bestNode.action && bestNode.action !== "REBUILD_SWARM" && bestNode.action !== "CLOSE_HUD") {
      runDomAction(bestNode.action);
    }
    speakDeepJarvis(bestNode.speech, () => {
      if (bestNode.action === "REBUILD_SWARM" || bestNode.action === "CLOSE_HUD") {
        runDomAction(bestNode.action);
      }
    });
  } else {
    const fallback =
      "I have Nishant Kumar Hati's complete research telemetry loaded, Sir. You can ask me about his Springer Nature Speech Emotion paper, his FLORA plant disease study, the Apple Scab Grad-CAM error case, his DEXA Club leadership, or command me to launch an autopilot tour.";
    speakDeepJarvis(fallback);
  }
}

function stopJarvisTour() {
  tourActive = false;
  tourTimeouts.forEach((t) => clearTimeout(t));
  tourTimeouts = [];
}

function startJarvisGuidedTour() {
  stopJarvisTour();
  tourActive = true;

  const overlay = document.getElementById("jarvis-hud-overlay");
  if (overlay) {
    hudOpen = false;
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");
  }

  const banner = document.getElementById("build-status-banner");
  const bannerText = document.getElementById("build-stage-text");
  const pctEl = document.getElementById("build-pct");
  if (banner) banner.style.opacity = "1";

  const steps = [
    {
      section: "hero",
      status: "JARVIS_AUTOPILOT // 01. EXECUTIVE IDENTITY",
      pct: "20%",
      narration:
        "Initiating executive tour, Sir. Nishant Kumar Hati is a Master of Science in Data Science researcher at Amity University Rajasthan, specializing in Deep Learning and Explainable AI."
    },
    {
      section: "ser-section",
      status: "JARVIS_AUTOPILOT // 02. SPRINGER NATURE SER LAB",
      pct: "45%",
      extra: () => selectSerEmotion("anger"),
      narration:
        "Here is his Speech Emotion Recognition study, under review at Springer Nature. Across 10 architectures and 68 acoustic features, his 1D CNN plus Attention model achieved 91.67 percent accuracy, interpreted with SHAP, LIME, and attention heatmaps."
    },
    {
      section: "flora-section",
      status: "JARVIS_AUTOPILOT // 03. FLORA PLANTVILLAGE BENCHMARK",
      pct: "75%",
      extra: () => selectFloraCase(3),
      narration:
        "Next is the FLORA study across 54,305 PlantVillage images. ResNet50 achieved 95.15 percent accuracy, and Grad-CAM overlays audit both accurate lesion localization and edge-lighting failure cases."
    },
    {
      section: "leadership-section",
      status: "JARVIS_AUTOPILOT // 04. DEXA CLUB & SHODAN BLACK BELT",
      pct: "100%",
      narration:
        "Finally, Nishant serves as the Founding General Coordinator of the DEXA Analytics Club and holds a Shodan First Degree Black Belt in Okinawan Goju-Ryu Karate. Tour complete, Sir."
    }
  ];

  function runStep(index) {
    if (!tourActive || index >= steps.length) {
      setTimeout(() => {
        if (banner) banner.style.opacity = "0";
      }, 2500);
      return;
    }

    const s = steps[index];
    playStarkAudioFX("scan");
    if (bannerText) bannerText.textContent = s.status;
    if (pctEl) pctEl.textContent = s.pct;

    const targetEl = document.getElementById(s.section);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
    if (s.extra) s.extra();

    speakDeepJarvis(s.narration, () => {
      const t = setTimeout(() => runStep(index + 1), 900);
      tourTimeouts.push(t);
    });
  }

  runStep(0);
}

// Select the best English voice available in the current browser/device.
// Browser voice names vary by operating system, so every preference has a fallback.
function pickDeepJarvisVoice() {
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferredNames = [
    /Google UK English Male/i,
    /Microsoft Ryan/i,
    /Microsoft David/i,
    /Microsoft Mark/i,
    /Daniel/i,
    /Alex/i,
    /Google UK English/i,
    /Google US English/i
  ];

  const englishVoices = voices.filter((voice) =>
    /^en(-|_)/i.test(voice.lang || "")
  );

  for (const pattern of preferredNames) {
    const match = englishVoices.find((voice) => pattern.test(voice.name));
    if (match) return match;
  }

  return (
    englishVoices.find((voice) => /en-GB/i.test(voice.lang)) ||
    englishVoices.find((voice) => /en-US/i.test(voice.lang)) ||
    englishVoices[0] ||
    voices[0] ||
    null
  );
}

// Voice lists may load asynchronously. Refresh the selected voice when ready.
function loadJarvisVoices() {
  if (!("speechSynthesis" in window)) return;
  selectedDeepVoice = pickDeepJarvisVoice();
}

if ("speechSynthesis" in window) {
  loadJarvisVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", loadJarvisVoices);
  window.speechSynthesis.onvoiceschanged = loadJarvisVoices;
}

function speakDeepJarvis(text, onCompleteCallback = null) {
  const subtitleEl = document.getElementById("jarvis-spoken-subtitle");
  const eqEl = document.getElementById("jarvis-core-eq");
  const modeEl = document.getElementById("jarvis-hud-mode");

  if (subtitleEl) subtitleEl.textContent = `"${text}"`;

  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
    console.warn("J.A.R.V.I.S. voice output is not supported in this browser.");
    if (modeEl) modeEl.textContent = "VOICE UNSUPPORTED";
    if (onCompleteCallback) setTimeout(onCompleteCallback, 1500);
    return;
  }

  const synth = window.speechSynthesis;
  synth.cancel();
  synth.resume();

  const utterance = new SpeechSynthesisUtterance(String(text));
  selectedDeepVoice = selectedDeepVoice || pickDeepJarvisVoice();

  if (selectedDeepVoice) {
    utterance.voice = selectedDeepVoice;
    utterance.lang = selectedDeepVoice.lang || "en-GB";
  } else {
    utterance.lang = "en-GB";
  }

  // These settings create a measured, lower-pitched delivery.
  // The actual voice quality depends on voices installed on the user's device.
  utterance.pitch = 0.78;
  utterance.rate = 0.92;
  utterance.volume = 1;

  utterance.onstart = () => {
    jarvisSpeaking = true;
    if (eqEl) eqEl.classList.add("speaking");
    if (modeEl) modeEl.textContent = "VOCALIZING";
  };

  utterance.onend = () => {
    jarvisSpeaking = false;
    if (eqEl) eqEl.classList.remove("speaking");
    if (modeEl) modeEl.textContent = "LISTENING";
    if (continuousRec && voiceArmed) {
      try { continuousRec.start(); } catch (error) {}
    }
    if (onCompleteCallback) onCompleteCallback();
  };

  utterance.onerror = (event) => {
    jarvisSpeaking = false;
    if (eqEl) eqEl.classList.remove("speaking");
    if (modeEl) modeEl.textContent = "VOICE ERROR";
    console.error("J.A.R.V.I.S. speech error:", event.error || event);
    if (onCompleteCallback) onCompleteCallback();
  };

  // A short delay after cancel/resume improves reliability in Chromium browsers.
  window.setTimeout(() => {
    try {
      synth.speak(utterance);
    } catch (error) {
      console.error("Unable to start J.A.R.V.I.S. speech:", error);
      if (modeEl) modeEl.textContent = "VOICE ERROR";
      if (onCompleteCallback) onCompleteCallback();
    }
  }, 120);
}
