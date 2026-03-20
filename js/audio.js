// ===== Audio Manager =====
// Only one sound plays at a time
const AudioManager = {
  current: null,
  pending: null,  // pre-loaded next audio
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
      if (this.onEnd) this.onEnd();
    });
  },

  // Play name then music in sequence - both pre-loaded from user gesture
  playNameThenMusic(instrumentId, onMusicStart, onMusicEnd) {
    const inst = getInstrument(instrumentId);
    if (!inst) return;

    this.stop();

    const nameSrc = `voice/names/${encodeURIComponent(inst.nameHe)}.m4a`;
    const nameAudio = new Audio(nameSrc);
    const musicAudio = new Audio(inst.audio);

    // Pre-load both from user gesture context
    nameAudio.load();
    musicAudio.load();

    this.current = nameAudio;
    this.isPlaying = true;

    nameAudio.addEventListener("ended", () => {
      // Switch to music
      this.current = musicAudio;
      if (onMusicStart) onMusicStart();
      musicAudio.play().catch(err => {
        console.warn("Music autoplay blocked:", err);
        this.isPlaying = false;
        if (onMusicEnd) onMusicEnd();
      });
    });

    nameAudio.addEventListener("error", () => {
      // If name fails, try music directly
      this.current = musicAudio;
      if (onMusicStart) onMusicStart();
      musicAudio.play().catch(() => {
        this.isPlaying = false;
        if (onMusicEnd) onMusicEnd();
      });
    });

    musicAudio.addEventListener("ended", () => {
      this.isPlaying = false;
      if (onMusicEnd) onMusicEnd();
    });

    musicAudio.addEventListener("error", () => {
      this.isPlaying = false;
      if (onMusicEnd) onMusicEnd();
    });

    nameAudio.play().catch(err => {
      console.warn("Name play blocked:", err);
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
    this.onEnd = null;
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

  // Play quiz prompt
  playQuizPrompt(instrumentId, onEnd) {
    this.playName(instrumentId, onEnd);
  }
};
