// ===== Audio Manager =====
// Only one sound plays at a time
const AudioManager = {
  current: null,
  isPlaying: false,
  onEnd: null,

  play(src, onEnd) {
    this.stop();
    this.current = new Audio(src);
    this.isPlaying = true;
    this.onEnd = onEnd || null;

    this.current.addEventListener("ended", () => {
      this.isPlaying = false;
      if (this.onEnd) this.onEnd();
    });

    this.current.addEventListener("error", (e) => {
      console.warn("Audio error:", src, e);
      this.isPlaying = false;
      if (this.onEnd) this.onEnd();
    });

    this.current.play().catch(err => {
      console.warn("Audio play blocked:", err);
      this.isPlaying = false;
    });
  },

  stop() {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.current = null;
    }
    this.isPlaying = false;
  },

  // Play instrument music sample
  playMusic(instrumentId, onEnd) {
    const inst = getInstrument(instrumentId);
    if (inst) this.play(inst.audio, onEnd);
  },

  // Play instrument name (Hebrew voice)
  playName(instrumentId, onEnd) {
    const inst = getInstrument(instrumentId);
    if (inst) {
      const src = `voice/names/${encodeURIComponent(inst.nameHe)}.m4a`;
      this.play(src, onEnd);
    }
  },

  // Play category name
  playCategoryName(categoryId, onEnd) {
    const cat = getCategory(categoryId);
    if (cat) {
      const src = `voice/categories/${encodeURIComponent(cat.nameHe)}.m4a`;
      this.play(src, onEnd);
    }
  },

  // Play quiz prompt ("איפה ה...?")
  playQuizPrompt(instrumentId, onEnd) {
    // For now, just play the instrument name
    this.playName(instrumentId, onEnd);
  }
};
