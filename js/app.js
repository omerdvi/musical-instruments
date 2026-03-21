// ===== App Controller =====
const App = {
  currentScreen: null,
  history: [],
  quizScore: 0,
  oddQuizScore: 0,

  init() {
    this.showScreen("home");
    this.renderHome();

    // Prevent zoom on double-tap
    document.addEventListener("dblclick", e => e.preventDefault());

    // Handle back button / swipe
    window.addEventListener("popstate", () => {
      if (this.history.length > 0) {
        const prev = this.history.pop();
        this.showScreen(prev.screen, false);
        if (prev.render) prev.render();
      } else {
        // No more in-app history — go home
        this.showScreen("home", false);
      }
    });

    // Global image error fallback
    document.addEventListener("error", (e) => {
      if (e.target.tagName === "IMG" && !e.target.dataset.fallback) {
        e.target.dataset.fallback = "1";
        e.target.style.opacity = "0.3";
        e.target.alt = "🎵";
      }
    }, true);
  },

  showScreen(screenId, pushHistory = true) {
    // Hide all screens
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    // Show target
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
      target.classList.add("active");
      target.scrollTop = 0;
    }

    if (pushHistory && this.currentScreen && this.currentScreen !== screenId) {
      window.history.pushState({ screen: screenId }, "");
    }

    this.currentScreen = screenId;
    AudioManager.stop();
  },

  // ===== Home Screen =====
  renderHome() {
    const grid = document.getElementById("home-categories");
    grid.innerHTML = "";

    for (const cat of CATEGORIES) {
      const btn = document.createElement("button");
      btn.className = "category-btn";
      btn.style.setProperty("--cat-color", cat.color);
      btn.style.setProperty("--cat-color-light", cat.colorLight);

      btn.innerHTML = `
        <div class="category-icon">
          <img src="${cat.image}" alt="${cat.nameHe}" loading="lazy">
        </div>
        <span class="category-label">${cat.nameHe}</span>
      `;

      btn.addEventListener("click", () => {
        this.history.push({ screen: "home", render: () => {} });
        this.openCategory(cat.id);
      });

      grid.appendChild(btn);
    }
  },

  // ===== Category Screen =====
  openCategory(categoryId) {
    const cat = getCategory(categoryId);
    if (!cat) return;

    document.getElementById("category-title").textContent = cat.nameHe;
    document.getElementById("screen-category").style.setProperty("--cat-color", cat.color);
    document.getElementById("screen-category").style.setProperty("--cat-color-light", cat.colorLight);

    const grid = document.getElementById("category-instruments");
    grid.innerHTML = "";

    for (const instId of cat.instrumentIds) {
      const inst = getInstrument(instId);
      if (!inst) continue;

      const card = document.createElement("button");
      card.className = "instrument-card";

      card.innerHTML = `
        <div class="instrument-thumb">
          <img src="${inst.imageA}" alt="${inst.nameHe}" loading="lazy">
        </div>
        <span class="instrument-label">${inst.nameHe}</span>
      `;

      card.addEventListener("click", () => {
        this.history.push({ screen: "category", render: () => this.openCategory(categoryId) });
        this.openInstrument(inst.id);
      });

      grid.appendChild(card);
    }

    this.showScreen("category");
    // Play category name
    setTimeout(() => AudioManager.playCategoryName(categoryId), 300);
  },

  // ===== Instrument Screen =====
  openInstrument(instrumentId) {
    const inst = getInstrument(instrumentId);
    if (!inst) return;
    this.currentInstrumentId = instrumentId;

    const cat = getCategoryForInstrument(instrumentId);

    document.getElementById("instrument-title").textContent = inst.nameHe;
    document.getElementById("screen-instrument").style.setProperty("--cat-color", cat.color);
    document.getElementById("screen-instrument").style.setProperty("--cat-color-light", cat.colorLight);

    document.getElementById("instrument-img-a").src = inst.imageA;
    document.getElementById("instrument-img-a").alt = inst.nameHe;
    document.getElementById("instrument-img-b").src = inst.imageB;
    document.getElementById("instrument-img-b").alt = inst.nameHe + " - נגן";

    // Update nav button states
    this.updateInstrumentNav();

    // Play music button
    const playBtn = document.getElementById("btn-play-music");
    playBtn.onclick = () => {
      if (AudioManager.isPlaying) {
        AudioManager.stop();
        playBtn.classList.remove("playing");
      } else {
        playBtn.classList.add("playing");
        AudioManager.playMusic(instrumentId, () => {
          playBtn.classList.remove("playing");
        });
      }
    };
    playBtn.classList.remove("playing");

    // Play name button
    const nameBtn = document.getElementById("btn-play-name");
    nameBtn.onclick = () => {
      AudioManager.playName(instrumentId);
    };

    this.showScreen("instrument");
    // Auto-play: name first, then music (both pre-loaded from user tap)
    AudioManager.playNameThenMusic(
      instrumentId,
      () => playBtn.classList.add("playing"),
      () => playBtn.classList.remove("playing")
    );
  },

  // Get instruments in current category only
  getCategoryInstruments() {
    const cat = getCategoryForInstrument(this.currentInstrumentId);
    return cat ? cat.instrumentIds : [];
  },

  currentInstrumentId: null,

  updateInstrumentNav() {
    const ids = this.getCategoryInstruments();
    const idx = ids.indexOf(this.currentInstrumentId);
    const nextBtn = document.getElementById("btn-next-instrument");
    const prevBtn = document.getElementById("btn-prev-instrument");

    // Disable at category edges
    if (nextBtn) {
      const atEnd = (idx >= ids.length - 1);
      nextBtn.disabled = atEnd;
      nextBtn.style.opacity = atEnd ? "0.3" : "1";
    }
    if (prevBtn) {
      const atStart = (idx <= 0);
      prevBtn.disabled = atStart;
      prevBtn.style.opacity = atStart ? "0.3" : "1";
    }
  },

  nextInstrument() {
    const ids = this.getCategoryInstruments();
    const idx = ids.indexOf(this.currentInstrumentId);
    if (idx < ids.length - 1) {
      this.openInstrument(ids[idx + 1]);
    }
  },

  prevInstrument() {
    const ids = this.getCategoryInstruments();
    const idx = ids.indexOf(this.currentInstrumentId);
    if (idx > 0) {
      this.openInstrument(ids[idx - 1]);
    }
  },

  // ===== Sound Effects =====
  playCorrectSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.15;
      osc.type = "sine";
      // Happy ascending notes: C5 → E5 → G5
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(659, now + 0.12);
      osc.frequency.setValueAtTime(784, now + 0.24);
      gain.gain.setValueAtTime(0.15, now + 0.3);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) { /* ignore on unsupported browsers */ }
  },

  playWrongSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.1;
      osc.type = "sine";
      // Gentle low tone
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.25);
      gain.gain.setValueAtTime(0.1, now + 0.2);
      gain.gain.linearRampToValueAtTime(0, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) { /* ignore on unsupported browsers */ }
  },

  // ===== Quiz =====
  openQuizMenu() {
    this.history.push({ screen: "home", render: () => {} });
    this.showScreen("quiz-menu");
  },

  startQuiz(difficulty) {
    Quiz.difficulty = difficulty;
    Quiz.recentCorrect = [];
    this.quizScore = 0;
    this.updateQuizScore();
    this.history.push({ screen: "quiz-menu", render: () => {} });
    this.nextQuestion();
  },

  updateQuizScore() {
    const el = document.getElementById("quiz-score");
    if (el) el.textContent = `⭐ ${this.quizScore}`;
  },

  updateOddQuizScore() {
    const el = document.getElementById("odd-quiz-score");
    if (el) el.textContent = `⭐ ${this.oddQuizScore}`;
  },

  nextQuestion() {
    const question = Quiz.generateQuestion();
    this.renderQuestion(question);
    this.showScreen("quiz", false);
    // Play the instrument name as the quiz prompt
    setTimeout(() => AudioManager.playName(question.correctId), 400);
  },

  renderQuestion(question) {
    const prompt = document.getElementById("quiz-prompt");
    prompt.textContent = `איפה ה${question.correctName}?`;

    const grid = document.getElementById("quiz-options");
    grid.innerHTML = "";
    let answered = false;

    for (const opt of question.options) {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.dataset.instrumentId = opt.id;
      btn.innerHTML = `<img src="${opt.image}" alt="">`;

      btn.addEventListener("click", () => {
        if (answered || btn.classList.contains("wrong")) return;

        if (opt.id === question.correctId) {
          answered = true;
          btn.classList.add("correct");
          this.quizScore++;
          this.updateQuizScore();
          this.playCorrectSound();
          // Lock all buttons
          grid.querySelectorAll(".quiz-option").forEach(b => b.style.pointerEvents = "none");
          this.celebrateCorrect(btn);
          setTimeout(() => this.nextQuestion(), 1500);
        } else {
          btn.classList.add("wrong");
          this.playWrongSound();
          // After shake, hint at correct answer
          setTimeout(() => {
            const correctBtn = grid.querySelector(`[data-instrument-id="${question.correctId}"]`);
            if (correctBtn) correctBtn.classList.add("hint");
            setTimeout(() => {
              if (correctBtn) correctBtn.classList.remove("hint");
            }, 1200);
          }, 500);
        }
      });

      grid.appendChild(btn);
    }
  },

  celebrateCorrect(btn) {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6", "#10B981"];

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "confetti";
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 60;

      particle.style.left = cx + "px";
      particle.style.top = cy + "px";
      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");
      particle.style.backgroundColor = colors[Math.floor(Math.random() * 5)];
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  },

  // ===== Odd One Out Quiz =====
  startOddOneOut() {
    this.oddQuizScore = 0;
    this.updateOddQuizScore();
    this.history.push({ screen: "quiz-menu", render: () => {} });
    this.nextOddQuestion();
  },

  nextOddQuestion() {
    const question = Quiz.generateOddOneOut();
    this.renderOddQuestion(question);
    this.showScreen("odd-quiz", false);
    // Play category name
    setTimeout(() => AudioManager.playCategoryName(question.categoryId), 400);
  },

  renderOddQuestion(question) {
    document.getElementById("odd-quiz-prompt").textContent = "מה לא שייך?";
    document.getElementById("odd-category-img").src = question.categoryImage;
    document.getElementById("odd-category-name").textContent = question.categoryName;
    document.getElementById("odd-category-name").style.color = question.categoryColor;

    const grid = document.getElementById("odd-quiz-options");
    grid.innerHTML = "";
    let answered = false;

    for (const opt of question.options) {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.dataset.instrumentId = opt.id;
      btn.innerHTML = `<img src="${opt.image}" alt="">`;

      btn.addEventListener("click", () => {
        if (answered || btn.classList.contains("wrong")) return;

        if (opt.id === question.oddId) {
          answered = true;
          btn.classList.add("correct");
          this.oddQuizScore++;
          this.updateOddQuizScore();
          this.playCorrectSound();
          grid.querySelectorAll(".quiz-option").forEach(b => b.style.pointerEvents = "none");
          this.celebrateCorrect(btn);
          setTimeout(() => this.nextOddQuestion(), 1500);
        } else {
          btn.classList.add("wrong");
          this.playWrongSound();
          setTimeout(() => {
            const correctBtn = grid.querySelector(`[data-instrument-id="${question.oddId}"]`);
            if (correctBtn) correctBtn.classList.add("hint");
            setTimeout(() => {
              if (correctBtn) correctBtn.classList.remove("hint");
            }, 1200);
          }, 500);
        }
      });

      grid.appendChild(btn);
    }
  },

  // ===== About =====
  openAbout() {
    this.history.push({ screen: "home", render: () => {} });
    this.showScreen("about");
  },

  // Navigation
  goBack() {
    window.history.back();
  },

  goHome() {
    this.history = [];
    AudioManager.stop();
    this.showScreen("home", false);
  }
};

// Start the app
document.addEventListener("DOMContentLoaded", () => App.init());
