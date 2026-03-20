// ===== Quiz Engine =====
const Quiz = {
  difficulty: "easy", // "easy" or "hard"
  recentCorrect: [],  // rolling window to avoid repetition
  MAX_RECENT: 10,

  // Check if two instruments conflict at current difficulty
  areConflicting(id1, id2) {
    // Always check NEVER_TOGETHER
    for (const group of NEVER_TOGETHER) {
      if (group.includes(id1) && group.includes(id2)) return true;
    }
    // In easy mode, also check ADVANCED_ONLY
    if (this.difficulty === "easy") {
      for (const group of ADVANCED_ONLY) {
        if (group.includes(id1) && group.includes(id2)) return true;
      }
    }
    return false;
  },

  // Generate a quiz question
  generateQuestion() {
    // Pick a correct answer (avoid recent)
    let pool = INSTRUMENTS.filter(i => !this.recentCorrect.includes(i.id));
    if (pool.length < 4) {
      this.recentCorrect = [];
      pool = [...INSTRUMENTS];
    }

    const correct = pool[Math.floor(Math.random() * pool.length)];

    // Track recent
    this.recentCorrect.push(correct.id);
    if (this.recentCorrect.length > this.MAX_RECENT) {
      this.recentCorrect.shift();
    }

    // Build distractor pool (exclude conflicts with correct answer)
    const distractorPool = INSTRUMENTS.filter(i => {
      if (i.id === correct.id) return false;
      if (this.areConflicting(i.id, correct.id)) return false;
      return true;
    });

    // Shuffle and pick 3 distractors that don't conflict with each other
    const shuffled = this.shuffle([...distractorPool]);
    const distractors = [];

    for (const candidate of shuffled) {
      if (distractors.length >= 3) break;
      // Check candidate doesn't conflict with already chosen distractors
      let ok = true;
      for (const d of distractors) {
        if (this.areConflicting(candidate.id, d.id)) {
          ok = false;
          break;
        }
      }
      if (ok) distractors.push(candidate);
    }

    // Combine and shuffle options
    const options = this.shuffle([correct, ...distractors]);

    return {
      correctId: correct.id,
      correctName: correct.nameHe,
      options: options.map(o => ({ id: o.id, nameHe: o.nameHe, image: o.imageA }))
    };
  },

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};
