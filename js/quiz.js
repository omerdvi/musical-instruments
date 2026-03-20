// ===== Quiz Engine =====
const Quiz = {
  difficulty: "easy", // "easy" or "hard"
  recentCorrect: [],  // rolling window to avoid repetition
  MAX_RECENT: 10,

  // Check if two instruments conflict at current difficulty
  areConflicting(id1, id2) {
    for (const group of NEVER_TOGETHER) {
      if (group.includes(id1) && group.includes(id2)) return true;
    }
    if (this.difficulty === "easy") {
      for (const group of ADVANCED_ONLY) {
        if (group.includes(id1) && group.includes(id2)) return true;
      }
    }
    return false;
  },

  // Generate a "find the instrument" question
  generateQuestion() {
    let pool = INSTRUMENTS.filter(i => !this.recentCorrect.includes(i.id));
    if (pool.length < 4) {
      this.recentCorrect = [];
      pool = [...INSTRUMENTS];
    }

    const correct = pool[Math.floor(Math.random() * pool.length)];

    this.recentCorrect.push(correct.id);
    if (this.recentCorrect.length > this.MAX_RECENT) {
      this.recentCorrect.shift();
    }

    const distractorPool = INSTRUMENTS.filter(i => {
      if (i.id === correct.id) return false;
      if (this.areConflicting(i.id, correct.id)) return false;
      return true;
    });

    const shuffled = this.shuffle([...distractorPool]);
    const distractors = [];

    for (const candidate of shuffled) {
      if (distractors.length >= 3) break;
      let ok = true;
      for (const d of distractors) {
        if (this.areConflicting(candidate.id, d.id)) {
          ok = false;
          break;
        }
      }
      if (ok) distractors.push(candidate);
    }

    const options = this.shuffle([correct, ...distractors]);

    return {
      correctId: correct.id,
      correctName: correct.nameHe,
      options: options.map(o => ({ id: o.id, nameHe: o.nameHe, image: o.imageA }))
    };
  },

  // Generate a "what doesn't belong" question
  generateOddOneOut() {
    // Pick a random category for the "correct" group
    const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const catInstruments = cat.instrumentIds.map(id => getInstrument(id)).filter(Boolean);

    // Pick 3 instruments from this category
    const shuffledCat = this.shuffle([...catInstruments]);
    const group = shuffledCat.slice(0, 3);

    // Pick 1 instrument from a DIFFERENT category
    const otherCats = CATEGORIES.filter(c => c.id !== cat.id);
    const otherCat = otherCats[Math.floor(Math.random() * otherCats.length)];
    const otherInstruments = otherCat.instrumentIds.map(id => getInstrument(id)).filter(Boolean);
    const oddOne = otherInstruments[Math.floor(Math.random() * otherInstruments.length)];

    const options = this.shuffle([...group, oddOne]);

    return {
      categoryId: cat.id,
      categoryName: cat.nameHe,
      categoryImage: cat.image,
      categoryColor: cat.color,
      oddId: oddOne.id,
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
