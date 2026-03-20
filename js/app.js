// ===== App Controller =====
const App = {
  currentScreen: null,
  history: [],

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
      }
    });
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
      window.history.pushState({}, "");
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

  // Get all instruments in order (grouped by category)
  getAllInstrumentsOrdered() {
    const all = [];
    for (const cat of CATEGORIES) {
      for (const id of cat.instrumentIds) {
        all.push(id);
      }
    }
    return all;
  },

  currentInstrumentId: null,

  nextInstrument() {
    const all = this.getAllInstrumentsOrdered();
    const idx = all.indexOf(this.currentInstrumentId);
    const nextIdx = (idx + 1) % all.length;
    this.currentInstrumentId = all[nextIdx];
    this.openInstrument(all[nextIdx]);
  },

  prevInstrument() {
    const all = this.getAllInstrumentsOrdered();
    const idx = all.indexOf(this.currentInstrumentId);
    const prevIdx = (idx - 1 + all.length) % all.length;
    this.currentInstrumentId = all[prevIdx];
    this.openInstrument(all[prevIdx]);
  },

  // ===== Quiz =====
  openQuizMenu() {
    this.history.push({ screen: "home", render: () => {} });
    this.showScreen("quiz-menu");
  },

  startQuiz(difficulty) {
    Quiz.difficulty = difficulty;
    Quiz.recentCorrect = [];
    this.history.push({ screen: "quiz-menu", render: () => {} });
    this.nextQuestion();
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

    for (const opt of question.options) {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.innerHTML = `
        <img src="${opt.image}" alt="" loading="lazy">
      `;

      btn.addEventListener("click", () => {
        if (btn.classList.contains("correct") || btn.classList.contains("wrong")) return;

        if (opt.id === question.correctId) {
          btn.classList.add("correct");
          this.celebrateCorrect(btn);
          setTimeout(() => this.nextQuestion(), 1500);
        } else {
          btn.classList.add("wrong");
          setTimeout(() => btn.classList.remove("wrong"), 500);
        }
      });

      grid.appendChild(btn);
    }
  },

  celebrateCorrect(btn) {
    // Create confetti particles
    const rect = btn.getBoundingClientRect();
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "confetti";
      particle.style.left = (rect.left + rect.width / 2) + "px";
      particle.style.top = (rect.top + rect.height / 2) + "px";
      particle.style.setProperty("--angle", (Math.random() * 360) + "deg");
      particle.style.setProperty("--distance", (50 + Math.random() * 100) + "px");
      particle.style.backgroundColor = ["#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6", "#10B981"][Math.floor(Math.random() * 5)];
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
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
