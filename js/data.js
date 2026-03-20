// ===== Instrument Data =====
const INSTRUMENTS = [
  // === כלי מיתר (Strings) 0-14 ===
  { id: 0,  nameHe: "כינור",           nameEn: "Violin",           category: "strings",     imageA: "images/00_Violin_A.jpg",           imageB: "images/00_Violin_B.jpg",           audio: "audio/Violin.mp3" },
  { id: 1,  nameHe: "ויולה",           nameEn: "Viola",            category: "strings",     imageA: "images/01_Viola_A.jpg",            imageB: "images/01_Viola_B.jpg",            audio: "audio/Viola.mp3" },
  { id: 2,  nameHe: "צ'לו",            nameEn: "Cello",            category: "strings",     imageA: "images/02_Cello_A.jpg",            imageB: "images/02_Cello_B.jpg",            audio: "audio/cello.mp3" },
  { id: 3,  nameHe: "קונטרבס",         nameEn: "Double Bass",      category: "strings",     imageA: "images/03_Double_Bass_A.jpg",      imageB: "images/03_Double_Bass_B.jpg",      audio: "audio/double bass.mp3" },
  { id: 4,  nameHe: "נבל",             nameEn: "Harp",             category: "strings",     imageA: "images/04_Harp_A.jpg",             imageB: "images/04_Harp_B.jpg",             audio: "audio/harp.mp3" },
  { id: 5,  nameHe: "גיטרה חשמלית",    nameEn: "Electric Guitar",  category: "strings",     imageA: "images/05_Electric_Guitar_A.jpg",  imageB: "images/05_Electric_Guitar_B.jpg",  audio: "audio/Electric Guitar.mp3" },
  { id: 6,  nameHe: "גיטרה בס",        nameEn: "Bass Guitar",      category: "strings",     imageA: "images/06_Bass_Guitar_A.jpg",      imageB: "images/06_Bass_Guitar_B.jpg",      audio: "audio/Bass Guitar.mp3" },
  { id: 7,  nameHe: "גיטרה אקוסטית",   nameEn: "Acoustic Guitar",  category: "strings",     imageA: "images/07_Acoustic_Guitar_A.jpg",  imageB: "images/07_Acoustic_Guitar_B.jpg",  audio: "audio/Acoustic Guitar.mp3" },
  { id: 8,  nameHe: "גיטרה קלאסית",    nameEn: "Classical Guitar",  category: "strings",    imageA: "images/08_Classical_Guitar_A.jpg", imageB: "images/08_Classical_Guitar_B.jpg", audio: "audio/Classical Guitar.mp3" },
  { id: 9,  nameHe: "יוקולילי",         nameEn: "Ukulele",          category: "strings",     imageA: "images/09_Ukulele_A.jpg",          imageB: "images/09_Ukulele_B.jpg",          audio: "audio/Ukulele.mp3" },
  { id: 10, nameHe: "בנג'ו",           nameEn: "Banjo",            category: "strings",     imageA: "images/10_Banjo_A.jpg",            imageB: "images/10_Banjo_B.jpg",            audio: "audio/Banjo.mp3" },
  { id: 11, nameHe: "מנדולינה",         nameEn: "Mandolin",         category: "strings",     imageA: "images/11_Mandolin_A.jpg",         imageB: "images/11_Mandolin_B.jpg",         audio: "audio/Mandolin.mp3" },
  { id: 12, nameHe: "עוּד",             nameEn: "Oud",              category: "strings",     imageA: "images/12_Oud_A.jpg",              imageB: "images/12_Oud_B.jpg",              audio: "audio/Oud.mp3" },
  { id: 13, nameHe: "סיטאר",           nameEn: "Sitar",            category: "strings",     imageA: "images/13_Sitar_A.jpg",            imageB: "images/13_Sitar_B.jpg",            audio: "audio/Sitar.mp3" },
  { id: 14, nameHe: "בלליקה",          nameEn: "Balalaika",        category: "strings",     imageA: "images/14_Balalaika_A.jpg",        imageB: "images/14_Balalaika_B.jpg",        audio: "audio/balalaika.mp3" },

  // === כלי נשיפה (Wind) 15-27 ===
  { id: 15, nameHe: "חליל צד",          nameEn: "Flute",            category: "wind",        imageA: "images/15_Flute_A.jpg",            imageB: "images/15_Flute_B.jpg",            audio: "audio/Flute.mp3" },
  { id: 16, nameHe: "פיקולו",           nameEn: "Piccolo",          category: "wind",        imageA: "images/16_Piccolo_A.jpg",          imageB: "images/16_Piccolo_B.jpg",          audio: "audio/Piccolo.mp3" },
  { id: 17, nameHe: "אבוב",            nameEn: "Oboe",             category: "wind",        imageA: "images/17_Oboe_A.jpg",             imageB: "images/17_Oboe_B.jpg",             audio: "audio/oboe.mp3" },
  { id: 18, nameHe: "קלרינט",          nameEn: "Clarinet",         category: "wind",        imageA: "images/18_Clarinet_A.jpg",         imageB: "images/18_Clarinet_B.jpg",         audio: "audio/Clarinet.mp3" },
  { id: 19, nameHe: "בסון",            nameEn: "Bassoon",          category: "wind",        imageA: "images/19_Bassoon_A.jpg",          imageB: "images/19_Bassoon_B.jpg",          audio: "audio/Bassoon.mp3" },
  { id: 20, nameHe: "סקסופון",         nameEn: "Alto Saxophone",   category: "wind",        imageA: "images/20_Alto_Saxophone_A.jpg",   imageB: "images/20_Alto_Saxophone_B.jpg",   audio: "audio/alto saxophone.mp3" },
  { id: 21, nameHe: "חלילית",          nameEn: "Recorder",         category: "wind",        imageA: "images/21_Recorder_A.jpg",         imageB: "images/21_Recorder_B.jpg",         audio: "audio/Recorder.mp3" },
  { id: 22, nameHe: "מפוחית",          nameEn: "Harmonica",        category: "wind",        imageA: "images/22_Harmonica_A.jpg",        imageB: "images/22_Harmonica_B.jpg",        audio: "audio/harmonica.mp3" },
  { id: 23, nameHe: "חצוצרה",          nameEn: "Trumpet",          category: "wind",        imageA: "images/23_Trumpet_A.jpg",          imageB: "images/23_Trumpet_B.jpg",          audio: "audio/trumpet.mp3" },
  { id: 24, nameHe: "טרומבון",         nameEn: "Trombone",         category: "wind",        imageA: "images/24_Trombone_A.jpg",         imageB: "images/24_Trombone_B.jpg",         audio: "audio/trombone.mp3" },
  { id: 25, nameHe: "קרן יער",         nameEn: "French Horn",      category: "wind",        imageA: "images/25_French_Horn_A.jpg",      imageB: "images/25_French_Horn_B.jpg",      audio: "audio/French horn.mp3" },
  { id: 26, nameHe: "טובה",            nameEn: "Tuba",             category: "wind",        imageA: "images/26_Tuba_A.jpg",             imageB: "images/26_Tuba_B.jpg",             audio: "audio/tuba.mp3" },
  { id: 27, nameHe: "שופר",            nameEn: "Shofar",           category: "wind",        imageA: "images/27_Shofar_A.jpg",           imageB: "images/27_Shofar_B.jpg",           audio: "audio/Shofar.mp3" },

  // === כלי הקשה (Percussion) 28-37, 43 ===
  { id: 28, nameHe: "תופים",     nameEn: "Drum Set",         category: "percussion",  imageA: "images/28_Drum_Set_A.jpg",         imageB: "images/28_Drum_Set_B.jpg",         audio: "audio/drums.mp3" },
  { id: 29, nameHe: "טימפני",          nameEn: "Timpani",          category: "percussion",  imageA: "images/29_Timpani_A.jpg",          imageB: "images/29_Timpani_B.jpg",          audio: "audio/timpani.mp3" },
  { id: 30, nameHe: "קסילופון",        nameEn: "Xylophone",        category: "percussion",  imageA: "images/30_Xylophone_A.jpg",        imageB: "images/30_Xylophone_B.jpg",        audio: "audio/Xylophone.mp3" },
  { id: 31, nameHe: "מרימבה",          nameEn: "Marimba",          category: "percussion",  imageA: "images/31_Marimba_A.jpg",          imageB: "images/31_Marimba_B.jpg",          audio: "audio/Marimba.mp3" },
  { id: 32, nameHe: "תוף מרים",        nameEn: "Tambourine",       category: "percussion",  imageA: "images/32_Tambourine_A.jpg",       imageB: "images/32_Tambourine_B.jpg",       audio: "audio/Tambourine.mp3" },
  { id: 33, nameHe: "בונגוס",          nameEn: "Bongos",           category: "percussion",  imageA: "images/33_Bongos_A.jpg",           imageB: "images/33_Bongos_B.jpg",           audio: "audio/Bongos.mp3" },
  { id: 34, nameHe: "ג'מבה",           nameEn: "Djembe",           category: "percussion",  imageA: "images/34_Djembe_A.jpg",           imageB: "images/34_Djembe_B.jpg",           audio: "audio/Djembe.mp3" },
  { id: 35, nameHe: "גונג",            nameEn: "Gong",             category: "percussion",  imageA: "images/35_Gong_A.jpg",             imageB: "images/35_Gong_B.jpg",             audio: "audio/Gong.mp3" },
  { id: 36, nameHe: "משולש",           nameEn: "Triangle",         category: "percussion",  imageA: "images/36_Triangle_A.jpg",         imageB: "images/36_Triangle_B.jpg",         audio: "audio/Triangle.mp3" },
  { id: 37, nameHe: "מצילתיים",        nameEn: "Cymbals",          category: "percussion",  imageA: "images/37_Cymbals_A.jpg",          imageB: "images/37_Cymbals_B.jpg",          audio: "audio/Cymbals.mp3" },
  { id: 43, nameHe: "דרבוקה",          nameEn: "Darbuka",          category: "percussion",  imageA: "images/43_Darbuka_A.jpg",          imageB: "images/43_Darbuka_B.jpg",          audio: "audio/Darbuka.mp3" },

  // === כלי מקלדת (Keyboard) 38-42 ===
  { id: 38, nameHe: "פסנתר",           nameEn: "Piano",            category: "keyboard",    imageA: "images/38_Piano_A.jpg",            imageB: "images/38_Piano_B.jpg",            audio: "audio/Piano.mp3" },
  { id: 39, nameHe: "עוגב",            nameEn: "Pipe Organ",       category: "keyboard",    imageA: "images/39_Pipe_Organ_A.jpg",       imageB: "images/39_Pipe_Organ_B.jpg",       audio: "audio/Pipe Organ.mp3" },
  { id: 40, nameHe: "אקורדיון",        nameEn: "Accordion",        category: "keyboard",    imageA: "images/40_Accordion_A.jpg",        imageB: "images/40_Accordion_B.jpg",        audio: "audio/accordion.mp3" },
  { id: 41, nameHe: "סינתיסייזר",      nameEn: "Synthesizer",      category: "keyboard",    imageA: "images/41_Synthesizer_A.jpg",      imageB: "images/41_Synthesizer_B.jpg",      audio: "audio/Synthesizer.mp3" },
  { id: 42, nameHe: "מלודיקה",         nameEn: "Melodica",         category: "keyboard",    imageA: "images/42_Melodica_A.jpg",         imageB: "images/42_Melodica_B.jpg",         audio: "audio/Melodica.mp3" },
];

// ===== Categories =====
const CATEGORIES = [
  { id: "strings",    nameHe: "כלי מיתר",   color: "#F59E0B", colorLight: "#FEF3C7", emoji: "🎻", image: "images/category_strings.jpg", instrumentIds: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14] },
  { id: "wind",       nameHe: "כלי נשיפה",   color: "#3B82F6", colorLight: "#DBEAFE", emoji: "🎺", image: "images/category_wind.jpg", instrumentIds: [15,16,17,18,19,20,21,22,23,24,25,26,27] },
  { id: "percussion", nameHe: "כלי הקשה",    color: "#EF4444", colorLight: "#FEE2E2", emoji: "🥁", image: "images/category_percussion.jpg", instrumentIds: [28,29,30,31,32,33,34,35,36,37,43] },
  { id: "keyboard",   nameHe: "כלי מקלדת",   color: "#8B5CF6", colorLight: "#EDE9FE", emoji: "🎹", image: "images/category_keyboard.jpg", instrumentIds: [38,39,40,41,42] },
];

// ===== Quiz Exclusion Rules =====
// These instruments look too similar - NEVER show together
const NEVER_TOGETHER = [
  [0, 1],       // כינור <-> ויולה
  [7, 8],       // גיטרה אקוסטית <-> גיטרה קלאסית
  [15, 16],     // חליל צד <-> פיקולו
  [30, 31],     // קסילופון <-> מרימבה
  [33, 43],     // בונגוס <-> דרבוקה
];

// These are similar but can appear together in advanced mode
const ADVANCED_ONLY = [
  [2, 3],       // צ'לו <-> קונטרבס
  [23, 25],     // חצוצרה <-> קרן יער
  [17, 18, 19], // אבוב <-> קלרינט <-> בסון
  [5, 6],       // גיטרה חשמלית <-> גיטרה בס
  [12, 10, 11], // עוד <-> בנג'ו <-> מנדולינה
];

// Helper: get instrument by id
function getInstrument(id) {
  return INSTRUMENTS.find(i => i.id === id);
}

// Helper: get category by id
function getCategory(id) {
  return CATEGORIES.find(c => c.id === id);
}

// Helper: get category for an instrument
function getCategoryForInstrument(instrumentId) {
  return CATEGORIES.find(c => c.instrumentIds.includes(instrumentId));
}
