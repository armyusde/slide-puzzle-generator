// Mountain Slide Puzzle — a sliding tile puzzle of a mountain range.
// The picture is cut into a grid with one piece missing. Tap (or swipe) a tile
// next to the empty space to slide it. Put the picture back together to win.

const els = {
  board: document.getElementById("board"),
  message: document.getElementById("message"),
  moves: document.getElementById("moves"),
  time: document.getElementById("time"),
  sizeButtons: document.getElementById("size-buttons"),
  numbers: document.getElementById("numbers-toggle"),
  scoreBtn: document.getElementById("score-btn"),
  scoreModal: document.getElementById("score-modal"),
  scoreForm: document.getElementById("score-form"),
  scoreSummary: document.getElementById("score-summary"),
  nameInput: document.getElementById("name-input"),
  cancelBtn: document.getElementById("cancel-btn"),
  newGame: document.getElementById("new-btn"),
  solve: document.getElementById("solve-btn"),
};

const SIZE_KEY = "mountainSlide.size";
const NUMBERS_KEY = "mountainSlide.numbers";
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
};

let size = [3, 4, 5].includes(Number(store.get(SIZE_KEY))) ? Number(store.get(SIZE_KEY)) : 4;
let game = null;

const rand = n => Math.floor(Math.random() * n);
const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ---------- language ---------- */
// To add a language: add an entry to TEXT with the same keys. "name" is what
// the language dropdown shows, and "code" is the standard language tag.

const LANG_KEY = "wordJumble.lang"; // shared with the bonus pack, so both remember the choice
const TEXT = {
  en: {
    title: "Mountain Slide Puzzle", movesLabel: "Moves:", timeLabel: "Time:",
    heading: "Slide the tiles",
    instructions: "Tap a tile next to the empty space to slide it. Put the mountain picture back together.",
    picture: "Picture", size: "Size", numbers: "Numbers", newGame: "New game",
    start: "Put the picture back together.", solvedMsg: "You did it!",
    enterName: "Enter name for high score", highScore: "High Score!", yourName: "Enter your name",
    save: "Save", saving: "Saving…", cancel: "Cancel",
    saved: name => `Saved! Nice work, ${name}.`,
    updateReady: "A new version of the game is ready.", updateNow: "Update",
    name: "English", code: "en",
  },
  zh: {
    title: "山脉滑块拼图", movesLabel: "步数：", timeLabel: "时间：",
    heading: "滑动拼块",
    instructions: "点击空格旁边的拼块即可滑动。把山脉图片拼回原样。",
    picture: "原图", size: "大小", numbers: "数字", newGame: "新游戏",
    start: "把图片拼回原样。", solvedMsg: "完成了！",
    enterName: "输入名字记录高分", highScore: "新高分！", yourName: "输入你的名字",
    save: "保存", saving: "保存中…", cancel: "取消",
    saved: name => `已保存！干得好，${name}。`,
    updateReady: "游戏有新版本了。", updateNow: "更新",
    name: "中文（简体）", code: "zh-CN",
  },
  ar: {
    title: "لغز الجبال المنزلق", movesLabel: "الحركات:", timeLabel: "الوقت:",
    heading: "حرّك القطع",
    instructions: "اضغط على قطعة بجوار المربع الفارغ لتحريكها. أعد تركيب صورة الجبال.",
    picture: "الصورة", size: "الحجم", numbers: "الأرقام", newGame: "لعبة جديدة",
    start: "أعد تركيب الصورة.", solvedMsg: "أحسنت!",
    enterName: "أدخل اسمك لتسجيل النتيجة", highScore: "نتيجة عالية!", yourName: "أدخل اسمك",
    save: "حفظ", saving: "جارٍ الحفظ…", cancel: "إلغاء",
    saved: name => `تم الحفظ! أحسنت يا ⁨${name}⁩.`,
    updateReady: "يتوفر إصدار جديد من اللعبة.", updateNow: "تحديث",
    name: "العربية", code: "ar", dir: "rtl",
  },
  es: {
    title: "Rompecabezas deslizante de montañas", movesLabel: "Movimientos:", timeLabel: "Tiempo:",
    heading: "Desliza las piezas",
    instructions: "Toca una pieza junto al espacio vacío para deslizarla. Vuelve a armar la imagen de las montañas.",
    picture: "Imagen", size: "Tamaño", numbers: "Números", newGame: "Nuevo juego",
    start: "Vuelve a armar la imagen.", solvedMsg: "¡Lo lograste!",
    enterName: "Escribe tu nombre para el récord", highScore: "¡Nuevo récord!", yourName: "Escribe tu nombre",
    save: "Guardar", saving: "Guardando…", cancel: "Cancelar",
    saved: name => `¡Guardado! Buen trabajo, ${name}.`,
    updateReady: "Hay una nueva versión del juego.", updateNow: "Actualizar",
    name: "Español", code: "es",
  },
  fr: {
    title: "Taquin des montagnes", movesLabel: "Coups :", timeLabel: "Temps :",
    heading: "Fais glisser les pièces",
    instructions: "Touche une pièce à côté de la case vide pour la faire glisser. Reconstitue l’image des montagnes.",
    picture: "Image", size: "Taille", numbers: "Numéros", newGame: "Nouvelle partie",
    start: "Reconstitue l’image.", solvedMsg: "Bravo, tu as réussi !",
    enterName: "Inscris ton nom au tableau des scores", highScore: "Nouveau record !", yourName: "Entre ton nom",
    save: "Enregistrer", saving: "Enregistrement…", cancel: "Annuler",
    saved: name => `Enregistré ! Bien joué, ${name}.`,
    updateReady: "Une nouvelle version du jeu est prête.", updateNow: "Mettre à jour",
    name: "Français", code: "fr",
  },
  pt: {
    title: "Quebra-cabeça deslizante das montanhas", movesLabel: "Movimentos:", timeLabel: "Tempo:",
    heading: "Deslize as peças",
    instructions: "Toque em uma peça ao lado do espaço vazio para deslizá-la. Monte de novo a imagem das montanhas.",
    picture: "Imagem", size: "Tamanho", numbers: "Números", newGame: "Novo jogo",
    start: "Monte a imagem de novo.", solvedMsg: "Você conseguiu!",
    enterName: "Digite seu nome para o recorde", highScore: "Novo recorde!", yourName: "Digite seu nome",
    save: "Salvar", saving: "Salvando…", cancel: "Cancelar",
    saved: name => `Salvo! Muito bem, ${name}.`,
    updateReady: "Uma nova versão do jogo está pronta.", updateNow: "Atualizar",
    name: "Português", code: "pt",
  },
  de: {
    title: "Berg-Schiebepuzzle", movesLabel: "Züge:", timeLabel: "Zeit:",
    heading: "Schiebe die Teile",
    instructions: "Tippe auf ein Teil neben dem leeren Feld, um es zu verschieben. Setze das Bergbild wieder zusammen.",
    picture: "Bild", size: "Größe", numbers: "Zahlen", newGame: "Neues Spiel",
    start: "Setze das Bild wieder zusammen.", solvedMsg: "Geschafft!",
    enterName: "Namen für die Bestenliste eingeben", highScore: "Neuer Rekord!", yourName: "Gib deinen Namen ein",
    save: "Speichern", saving: "Wird gespeichert…", cancel: "Abbrechen",
    saved: name => `Gespeichert! Gut gemacht, ${name}.`,
    updateReady: "Eine neue Version des Spiels ist bereit.", updateNow: "Aktualisieren",
    name: "Deutsch", code: "de",
  },
  ru: {
    title: "Пятнашки: горы", movesLabel: "Ходов:", timeLabel: "Время:",
    heading: "Двигайте плитки",
    instructions: "Нажмите на плитку рядом с пустой клеткой, чтобы сдвинуть её. Соберите картинку с горами.",
    picture: "Картинка", size: "Размер", numbers: "Номера", newGame: "Новая игра",
    start: "Соберите картинку.", solvedMsg: "Готово!",
    enterName: "Записать имя в рекорды", highScore: "Новый рекорд!", yourName: "Введите ваше имя",
    save: "Сохранить", saving: "Сохранение…", cancel: "Отмена",
    saved: name => `Сохранено! Отлично, ${name}.`,
    updateReady: "Доступна новая версия игры.", updateNow: "Обновить",
    name: "Русский", code: "ru",
  },
  hi: {
    title: "पहाड़ स्लाइड पहेली", movesLabel: "चालें:", timeLabel: "समय:",
    heading: "टुकड़े खिसकाएँ",
    instructions: "खाली जगह के पास वाले टुकड़े पर टैप करके उसे खिसकाएँ। पहाड़ों की तस्वीर फिर से जोड़ें।",
    picture: "तस्वीर", size: "आकार", numbers: "संख्याएँ", newGame: "नया खेल",
    start: "तस्वीर फिर से जोड़ें।", solvedMsg: "शाबाश!",
    enterName: "उच्च स्कोर के लिए नाम लिखें", highScore: "नया उच्च स्कोर!", yourName: "अपना नाम लिखें",
    save: "सहेजें", saving: "सहेजा जा रहा है…", cancel: "रद्द करें",
    saved: name => `सहेज लिया! बहुत बढ़िया, ${name}।`,
    updateReady: "खेल का नया संस्करण तैयार है।", updateNow: "अपडेट करें",
    name: "हिन्दी", code: "hi",
  },
  ja: {
    title: "山のスライドパズル", movesLabel: "手数：", timeLabel: "時間：",
    heading: "ピースをスライド",
    instructions: "空いたマスの隣のピースをタップすると動きます。山の絵を元どおりにしよう。",
    picture: "完成図", size: "サイズ", numbers: "番号", newGame: "新しいゲーム",
    start: "絵を元どおりにしよう。", solvedMsg: "完成！",
    enterName: "名前を登録する", highScore: "ハイスコア！", yourName: "名前を入力",
    save: "保存", saving: "保存中…", cancel: "キャンセル",
    saved: name => `保存しました！よくできました、${name}さん。`,
    updateReady: "ゲームの新しいバージョンがあります。", updateNow: "更新",
    name: "日本語", code: "ja",
  },
  ko: {
    title: "산 슬라이드 퍼즐", movesLabel: "이동:", timeLabel: "시간:",
    heading: "조각을 밀어 보세요",
    instructions: "빈칸 옆의 조각을 누르면 움직입니다. 산 그림을 다시 맞춰 보세요.",
    picture: "그림", size: "크기", numbers: "숫자", newGame: "새 게임",
    start: "그림을 다시 맞춰 보세요.", solvedMsg: "완성!",
    enterName: "최고 기록에 이름 남기기", highScore: "최고 기록!", yourName: "이름을 입력하세요",
    save: "저장", saving: "저장 중…", cancel: "취소",
    saved: name => `저장했습니다! 잘했어요, ${name}님.`,
    updateReady: "게임의 새 버전이 준비되었습니다.", updateNow: "업데이트",
    name: "한국어", code: "ko",
  },
  vi: {
    title: "Xếp hình trượt núi non", movesLabel: "Số bước:", timeLabel: "Thời gian:",
    heading: "Trượt các mảnh",
    instructions: "Chạm vào mảnh cạnh ô trống để trượt nó. Ghép lại bức tranh núi non.",
    picture: "Hình mẫu", size: "Cỡ", numbers: "Số", newGame: "Ván mới",
    start: "Ghép lại bức tranh.", solvedMsg: "Bạn đã làm được!",
    enterName: "Ghi tên vào bảng điểm cao", highScore: "Điểm cao mới!", yourName: "Nhập tên của bạn",
    save: "Lưu", saving: "Đang lưu…", cancel: "Hủy",
    saved: name => `Đã lưu! Giỏi lắm, ${name}.`,
    updateReady: "Đã có phiên bản mới của trò chơi.", updateNow: "Cập nhật",
    name: "Tiếng Việt", code: "vi",
  },
  id: {
    title: "Puzzle Geser Pegunungan", movesLabel: "Langkah:", timeLabel: "Waktu:",
    heading: "Geser kepingannya",
    instructions: "Ketuk keping di sebelah kotak kosong untuk menggesernya. Susun kembali gambar pegunungan.",
    picture: "Gambar", size: "Ukuran", numbers: "Angka", newGame: "Permainan baru",
    start: "Susun kembali gambarnya.", solvedMsg: "Berhasil!",
    enterName: "Masukkan nama untuk skor tertinggi", highScore: "Skor tertinggi!", yourName: "Masukkan namamu",
    save: "Simpan", saving: "Menyimpan…", cancel: "Batal",
    saved: name => `Tersimpan! Hebat, ${name}.`,
    updateReady: "Versi baru permainan sudah siap.", updateNow: "Perbarui",
    name: "Bahasa Indonesia", code: "id",
  },
  tl: {
    title: "Slide Puzzle ng Kabundukan", movesLabel: "Galaw:", timeLabel: "Oras:",
    heading: "I-slide ang mga piraso",
    instructions: "I-tap ang pirasong katabi ng bakanteng puwesto para i-slide ito. Buuin muli ang larawan ng kabundukan.",
    picture: "Larawan", size: "Laki", numbers: "Numero", newGame: "Bagong laro",
    start: "Buuin muli ang larawan.", solvedMsg: "Nagawa mo!",
    enterName: "Ilagay ang pangalan sa high score", highScore: "Bagong high score!", yourName: "Ilagay ang iyong pangalan",
    save: "I-save", saving: "Sine-save…", cancel: "Kanselahin",
    saved: name => `Na-save! Magaling, ${name}.`,
    updateReady: "May bagong bersyon ng laro.", updateNow: "I-update",
    name: "Tagalog", code: "tl",
  },
  it: {
    title: "Puzzle scorrevole delle montagne", movesLabel: "Mosse:", timeLabel: "Tempo:",
    heading: "Fai scorrere i tasselli",
    instructions: "Tocca un tassello accanto allo spazio vuoto per farlo scorrere. Ricomponi l’immagine delle montagne.",
    picture: "Immagine", size: "Dimensione", numbers: "Numeri", newGame: "Nuova partita",
    start: "Ricomponi l’immagine.", solvedMsg: "Ce l’hai fatta!",
    enterName: "Inserisci il nome per il record", highScore: "Nuovo record!", yourName: "Inserisci il tuo nome",
    save: "Salva", saving: "Salvataggio…", cancel: "Annulla",
    saved: name => `Salvato! Ben fatto, ${name}.`,
    updateReady: "È pronta una nuova versione del gioco.", updateNow: "Aggiorna",
    name: "Italiano", code: "it",
  },
  fa: {
    title: "پازل کشویی کوهستان", movesLabel: "حرکت‌ها:", timeLabel: "زمان:",
    heading: "قطعه‌ها را جابه‌جا کن",
    instructions: "روی قطعهٔ کنار خانهٔ خالی بزن تا جابه‌جا شود. تصویر کوه‌ها را دوباره کامل کن.",
    picture: "تصویر", size: "اندازه", numbers: "شماره‌ها", newGame: "بازی جدید",
    start: "تصویر را دوباره کامل کن.", solvedMsg: "آفرین، تمام شد!",
    enterName: "نامت را برای امتیاز برتر وارد کن", highScore: "امتیاز برتر!", yourName: "نامت را وارد کن",
    save: "ذخیره", saving: "در حال ذخیره…", cancel: "لغو",
    saved: name => `ذخیره شد! آفرین ⁨${name}⁩.`,
    updateReady: "نسخهٔ جدید بازی آماده است.", updateNow: "به‌روزرسانی",
    name: "فارسی", code: "fa", dir: "rtl",
  },
  he: {
    title: "פאזל הזזה של הרים", movesLabel: "מהלכים:", timeLabel: "זמן:",
    heading: "הזיזו את החלקים",
    instructions: "הקישו על חלק שליד המשבצת הריקה כדי להזיז אותו. הרכיבו מחדש את תמונת ההרים.",
    picture: "תמונה", size: "גודל", numbers: "מספרים", newGame: "משחק חדש",
    start: "הרכיבו מחדש את התמונה.", solvedMsg: "הצלחתם!",
    enterName: "הכניסו שם לטבלת השיאים", highScore: "שיא חדש!", yourName: "הכניסו את שמכם",
    save: "שמירה", saving: "שומר…", cancel: "ביטול",
    saved: name => `נשמר! כל הכבוד, ⁨${name}⁩.`,
    updateReady: "גרסה חדשה של המשחק מוכנה.", updateNow: "עדכון",
    name: "עברית", code: "he", dir: "rtl",
  },
  el: {
    title: "Συρόμενο παζλ βουνών", movesLabel: "Κινήσεις:", timeLabel: "Χρόνος:",
    heading: "Σύρε τα κομμάτια",
    instructions: "Πάτησε ένα κομμάτι δίπλα στο κενό τετράγωνο για να το μετακινήσεις. Φτιάξε ξανά την εικόνα με τα βουνά.",
    picture: "Εικόνα", size: "Μέγεθος", numbers: "Αριθμοί", newGame: "Νέο παιχνίδι",
    start: "Φτιάξε ξανά την εικόνα.", solvedMsg: "Τα κατάφερες!",
    enterName: "Γράψε το όνομά σου στο ρεκόρ", highScore: "Νέο ρεκόρ!", yourName: "Γράψε το όνομά σου",
    save: "Αποθήκευση", saving: "Αποθήκευση…", cancel: "Άκυρο",
    saved: name => `Αποθηκεύτηκε! Μπράβο, ${name}.`,
    updateReady: "Μια νέα έκδοση του παιχνιδιού είναι έτοιμη.", updateNow: "Ενημέρωση",
    name: "Ελληνικά", code: "el",
  },
};

// "Solve it" button: [button, stop button, while solving, when finished].
const SOLVE_TEXT = {
  en: ["Solve it", "Stop", "Solving…", "Solved automatically."],
  zh: ["自动完成", "停止", "正在自动完成…", "已自动完成。"],
  ar: ["حُلّها", "إيقاف", "جارٍ الحل…", "تم الحل تلقائيًا."],
  es: ["Resolver", "Detener", "Resolviendo…", "Resuelto automáticamente."],
  fr: ["Résoudre", "Arrêter", "Résolution…", "Résolu automatiquement."],
  pt: ["Resolver", "Parar", "Resolvendo…", "Resolvido automaticamente."],
  de: ["Lösen", "Stopp", "Wird gelöst…", "Automatisch gelöst."],
  ru: ["Собрать", "Стоп", "Собираю…", "Собрано автоматически."],
  hi: ["हल करें", "रोकें", "हल किया जा रहा है…", "अपने-आप हल हो गया।"],
  ja: ["自動で解く", "止める", "解いています…", "自動で解きました。"],
  ko: ["자동 풀기", "멈추기", "푸는 중…", "자동으로 풀었습니다."],
  vi: ["Tự giải", "Dừng", "Đang giải…", "Đã tự động giải xong."],
  id: ["Selesaikan", "Berhenti", "Sedang menyelesaikan…", "Diselesaikan otomatis."],
  tl: ["Lutasin", "Itigil", "Nilulutas…", "Awtomatikong nalutas."],
  it: ["Risolvi", "Ferma", "Risoluzione…", "Risolto automaticamente."],
  fa: ["حل کن", "توقف", "در حال حل…", "به‌طور خودکار حل شد."],
  he: ["פתרו בשבילי", "עצור", "פותר…", "נפתר אוטומטית."],
  el: ["Λύσ’ το", "Διακοπή", "Επίλυση…", "Λύθηκε αυτόματα."],
};
for (const [id, [solve, stop, solving, solvedAuto]] of Object.entries(SOLVE_TEXT)) {
  Object.assign(TEXT[id], { solve, stop, solving, solvedAuto });
}

let lang = "en";
if (TEXT[store.get(LANG_KEY)]) lang = store.get(LANG_KEY);
const t = key => TEXT[lang][key];

// "4×4 — Moves: 52, Time: 1:23" in the chosen language.
const statsText = () =>
  `${game.n}×${game.n} — ${t("movesLabel")} ${game.moves}, ${t("timeLabel")} ${formatTime(game.seconds)}`;

function showMessage() {
  if (!game) return;
  if (game.savedName) els.message.textContent = t("saved")(game.savedName);
  else if (game.done) els.message.textContent = `${t(game.autoUsed ? "solvedAuto" : "solvedMsg")} ${statsText()}`;
  else if (game.solving) els.message.textContent = t("solving");
  else els.message.textContent = t("start");
  els.message.className = "message" + (game.done ? " win" : "");
  els.solve.textContent = t(game.solving ? "stop" : "solve");
  els.solve.disabled = game.done;
}

function applyLanguage() {
  document.documentElement.lang = t("code");
  document.documentElement.dir = t("dir") || "ltr";
  document.title = t("title");
  document.querySelectorAll("[data-t]").forEach(n => { n.textContent = t(n.dataset.t); });
  langSelect.value = lang;
  showMessage();
  if (game && !els.scoreModal.hidden) els.scoreSummary.textContent = statsText();
}

// Language dropdown: each language listed in its own name.
const langSelect = document.getElementById("lang-select");
for (const [id, tx] of Object.entries(TEXT)) {
  const opt = document.createElement("option");
  opt.value = id; opt.textContent = tx.name; opt.lang = tx.code;
  langSelect.appendChild(opt);
}
langSelect.addEventListener("change", () => {
  lang = langSelect.value;
  store.set(LANG_KEY, lang);
  applyLanguage();
});

/* ---------- the board ---------- */
// game.cells[i] = which piece sits in square i (squares numbered left to right,
// top to bottom). Piece number p belongs in square p. The last piece is left
// out: wherever it "sits" is the empty square.

function newGame() {
  const n = size;
  const blank = n * n - 1;
  const cells = [...Array(n * n).keys()];
  // Shuffle by making random legal moves from the solved picture, so every
  // puzzle can always be solved.
  let empty = blank, prev = -1;
  for (let k = 0; k < n * n * 40 || isSolved(cells); k++) {
    const options = neighbours(empty, n).filter(c => c !== prev);
    const c = options[rand(options.length)];
    [cells[empty], cells[c]] = [cells[c], cells[empty]];
    prev = empty; empty = c;
  }

  stopTimer();
  stopSolving();
  game = {
    n, cells, empty, moves: 0, seconds: 0, started: false, done: false, timer: null, savedName: null,
    solving: false, autoUsed: false,
  };
  els.moves.textContent = "0";
  els.time.textContent = formatTime(0);
  els.scoreBtn.hidden = true;

  els.board.innerHTML = "";
  els.board.className = "board" + (els.numbers.checked ? " show-numbers" : "");
  els.board.style.setProperty("--n", n);
  game.tiles = [];
  for (let p = 0; p < n * n; p++) {
    const tile = document.createElement("div");
    tile.className = "tile" + (p === blank ? " last" : "");
    const face = document.createElement("div");
    face.className = "face";
    face.style.backgroundSize = `${n * 100}% ${n * 100}%`;
    face.style.backgroundPosition = `${(p % n) / (n - 1) * 100}% ${Math.floor(p / n) / (n - 1) * 100}%`;
    const num = document.createElement("span");
    num.className = "num";
    num.textContent = p + 1;
    face.appendChild(num);
    tile.appendChild(face);
    els.board.appendChild(tile);
    game.tiles.push(tile);
  }
  for (const b of els.sizeButtons.children) b.classList.toggle("active", Number(b.dataset.size) === n);
  layout();
  showMessage();
}

function neighbours(i, n) {
  const r = Math.floor(i / n), c = i % n, out = [];
  if (r > 0) out.push(i - n);
  if (r < n - 1) out.push(i + n);
  if (c > 0) out.push(i - 1);
  if (c < n - 1) out.push(i + 1);
  return out;
}

function isSolved(cells) { return cells.every((p, i) => p === i); }

// Put every piece where it belongs on screen (the slide is a CSS transition).
function layout() {
  const { n, cells, empty } = game;
  cells.forEach((p, i) => {
    const tile = game.tiles[p];
    tile.style.transform = `translate(${(i % n) * 100}%, ${Math.floor(i / n) * 100}%)`;
    tile.dataset.cell = i;
    const sameLine = i !== empty && (i % n === empty % n || Math.floor(i / n) === Math.floor(empty / n));
    tile.classList.toggle("can-move", !game.done && sameLine);
  });
}

// Slide the piece in square `cell` toward the empty square. If it's in the same
// row or column but further away, the whole line between them slides together.
function slideFrom(cell) {
  if (!game || game.done || cell === game.empty) return false;
  const { n } = game;
  let step;
  if (Math.floor(cell / n) === Math.floor(game.empty / n)) step = cell < game.empty ? 1 : -1;
  else if (cell % n === game.empty % n) step = cell < game.empty ? n : -n;
  else return false;

  while (game.empty !== cell) {
    const from = game.empty - step;
    game.cells[game.empty] = game.cells[from];
    game.cells[from] = n * n - 1;
    game.empty = from;
    game.moves++;
  }
  if (!game.started) startTimer();
  els.moves.textContent = game.moves;
  if (isSolved(game.cells)) win();
  layout();
  return true;
}

function startTimer() {
  game.started = true;
  const g = game;
  const t0 = Date.now();
  g.timer = setInterval(() => {
    g.seconds = Math.floor((Date.now() - t0) / 1000);
    els.time.textContent = formatTime(g.seconds);
  }, 250);
}

function stopTimer() { if (game && game.timer) { clearInterval(game.timer); game.timer = null; } }

function win() {
  stopTimer();
  stopSolving();
  game.done = true;
  els.board.classList.add("solved");
  els.scoreBtn.hidden = false;
  showMessage();
}

/* ---------- touch / mouse ---------- */
// A tap slides the tapped piece. A swipe slides the piece next to the empty
// square in the swipe's direction. Only the *difference* in finger position is
// used, so it stays correct when the iPhone is pinch-zoomed or scrolled.

let press = null;

els.board.addEventListener("pointerdown", e => {
  const tile = e.target.closest(".tile");
  press = { x: e.clientX, y: e.clientY, cell: tile ? Number(tile.dataset.cell) : -1 };
  e.preventDefault();
});
els.board.addEventListener("touchstart", e => e.preventDefault(), { passive: false });

window.addEventListener("pointerup", e => {
  if (!press) return;
  const dx = e.clientX - press.x, dy = e.clientY - press.y;
  const cell = press.cell;
  press = null;
  if (!game || game.done || game.solving) return;
  if (Math.hypot(dx, dy) < 15) { if (cell >= 0) slideFrom(cell); return; }
  // Swipe: e.g. swiping left moves the piece to the right of the empty square.
  const { n, empty } = game;
  const r = Math.floor(empty / n), c = empty % n;
  let from = -1;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0 && c < n - 1) from = empty + 1;
    if (dx > 0 && c > 0) from = empty - 1;
  } else {
    if (dy < 0 && r < n - 1) from = empty + n;
    if (dy > 0 && r > 0) from = empty - n;
  }
  if (from >= 0) slideFrom(from);
});
window.addEventListener("pointercancel", () => { press = null; });

// Arrow keys on a computer work like swipes.
document.addEventListener("keydown", e => {
  if (!game || game.done || game.solving || !els.scoreModal.hidden) return;
  const { n, empty } = game;
  const r = Math.floor(empty / n), c = empty % n;
  const map = {
    ArrowLeft: c < n - 1 ? empty + 1 : -1, ArrowRight: c > 0 ? empty - 1 : -1,
    ArrowUp: r < n - 1 ? empty + n : -1, ArrowDown: r > 0 ? empty - n : -1,
  };
  if (e.key in map) { e.preventDefault(); if (map[e.key] >= 0) slideFrom(map[e.key]); }
});

/* ---------- automatic solver ---------- */
// Solves the way people do: put the top row in place, then the left column,
// leaving a smaller square; repeat until only 3×3 is left, then search that
// last 3×3 for the shortest finish (on a 3×3 puzzle the whole solve is the
// shortest possible). Returns the squares the empty square moves to, in order.

function findSolution(startCells, n) {
  const cells = startCells.slice();
  const blankId = n * n - 1;
  const N = n * n;
  let empty = cells.indexOf(blankId);
  const path = [];
  const locked = new Array(N).fill(false); // squares already finished
  const move = to => { cells[empty] = cells[to]; cells[to] = blankId; empty = to; path.push(to); };

  // Bring the pieces in `group` (1 or 2 of them) to their home squares without
  // touching finished squares. Searches over (empty square, where those pieces
  // are); every other piece is ignored, so the search stays small.
  function place(group) {
    const home = group.slice(); // piece p's home square is p
    let pos = group.map(id => cells.indexOf(id));
    if (pos.every((p, i) => p === home[i])) { group.forEach(id => { locked[id] = true; }); return; }
    const encode = (e, ps) => ps.reduce((a, p) => a * N + p, e);
    const div = N ** group.length;
    const start = encode(empty, pos);
    const prev = new Map([[start, -1]]);
    const queue = [[empty, pos]];
    let found = -1;
    for (let qi = 0; qi < queue.length && found < 0; qi++) {
      const [e, ps] = queue[qi];
      const key = encode(e, ps);
      for (const nb of neighbours(e, n)) {
        if (locked[nb]) continue;
        const np = ps.map(p => (p === nb ? e : p));
        const nk = encode(nb, np);
        if (prev.has(nk)) continue;
        prev.set(nk, key);
        if (np.every((p, i) => p === home[i])) { found = nk; break; }
        queue.push([nb, np]);
      }
    }
    const steps = [];
    for (let k = found; k !== start; k = prev.get(k)) steps.push(Math.floor(k / div));
    steps.reverse().forEach(move);
    group.forEach(id => { locked[id] = true; });
  }

  let top = 0, left = 0;
  while (n - top > 3) {
    for (let c = left; c < n - 2; c++) place([top * n + c]);
    place([top * n + n - 2, top * n + n - 1]); // last two of a row go in together
    top++;
    for (let r = top; r < n - 2; r++) place([r * n + left]);
    place([(n - 2) * n + left, (n - 1) * n + left]);
    left++;
  }

  // Last 3×3: A* search with the "how far is each piece from home" estimate.
  const region = [];
  for (let r = top; r < n; r++) for (let c = left; c < n; c++) region.push(r * n + c);
  const local = new Map(region.map((sq, i) => [sq, i]));
  const dist = (id, i) => {
    const h = local.get(id);
    return Math.abs(Math.floor(h / 3) - Math.floor(i / 3)) + Math.abs((h % 3) - (i % 3));
  };
  const estimate = s => s.reduce((sum, id, i) => (id === blankId ? sum : sum + dist(id, i)), 0);
  const startState = region.map(sq => cells[sq]);
  const goalKey = region.join(",");
  const seen = new Map([[startState.join(","), { parent: null, step: -1 }]]);
  const heap = [];
  const push = item => {
    heap.push(item);
    for (let i = heap.length - 1; i > 0;) {
      const p = (i - 1) >> 1;
      if (heap[p].f <= heap[i].f) break;
      [heap[p], heap[i]] = [heap[i], heap[p]]; i = p;
    }
  };
  const pop = () => {
    const top = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      for (let i = 0; ;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < heap.length && heap[l].f < heap[m].f) m = l;
        if (r < heap.length && heap[r].f < heap[m].f) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
      }
    }
    return top;
  };
  push({ s: startState, g: 0, f: estimate(startState), key: startState.join(",") });
  let endKey = startState.join(",") === goalKey ? goalKey : null;
  while (heap.length && !endKey) {
    const cur = pop();
    const b = cur.s.indexOf(blankId);
    for (const nb of neighbours(b, 3)) {
      const s = cur.s.slice();
      [s[b], s[nb]] = [s[nb], s[b]];
      const key = s.join(",");
      if (seen.has(key)) continue;
      seen.set(key, { parent: cur.key, step: region[nb] });
      if (key === goalKey) { endKey = key; break; }
      push({ s, g: cur.g + 1, f: cur.g + 1 + estimate(s), key });
    }
  }
  const tail = [];
  for (let k = endKey; seen.get(k).parent !== null; k = seen.get(k).parent) tail.push(seen.get(k).step);
  tail.reverse().forEach(move);
  return path;
}

let solveTimer = null;

function stopSolving() {
  if (solveTimer) { clearTimeout(solveTimer); solveTimer = null; }
  if (game && game.solving) {
    game.solving = false;
    els.board.classList.remove("solving");
    showMessage();
  }
}

function startSolving() {
  if (!game || game.done || game.solving) return;
  const path = findSolution(game.cells, game.n);
  if (!path.length) return;
  game.solving = true;
  game.autoUsed = true;
  els.board.classList.add("solving");
  showMessage();
  // Long solutions play faster so they don't take forever.
  const delay = Math.max(70, Math.min(220, 9000 / path.length));
  let i = 0;
  const step = () => {
    if (!game.solving) return;
    slideFrom(path[i++]);
    if (!game.done && i < path.length) solveTimer = setTimeout(step, delay);
  };
  step();
}

els.solve.addEventListener("click", () => (game && game.solving ? stopSolving() : startSolving()));

/* ---------- options ---------- */

els.sizeButtons.addEventListener("click", e => {
  const b = e.target.closest("button[data-size]");
  if (!b) return;
  size = Number(b.dataset.size);
  store.set(SIZE_KEY, size);
  newGame();
});

els.numbers.checked = store.get(NUMBERS_KEY) === "1";
els.numbers.addEventListener("change", () => {
  store.set(NUMBERS_KEY, els.numbers.checked ? "1" : "0");
  els.board.classList.toggle("show-numbers", els.numbers.checked);
});

els.newGame.addEventListener("click", newGame);

/* ---------- high score popup ---------- */

const HIGH_SCORE_KEY = "mountainSlide.highScores";

function saveHighScore(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(HIGH_SCORE_KEY) || "[]");
    list.push(entry);
    // Best games first: bigger puzzles, then fewest moves, then fastest.
    // Games finished with "Solve it" go after the ones you solved yourself.
    list.sort((a, b) => !!a.auto - !!b.auto || b.size - a.size || a.moves - b.moves || a.seconds - b.seconds);
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(list.slice(0, 50)));
  } catch (e) { /* storage unavailable (e.g. private browsing) — just skip saving */ }
}

function openScoreModal() {
  els.scoreSummary.textContent = statsText();
  els.nameInput.value = "";
  els.scoreModal.hidden = false;
  els.nameInput.focus();
}

function closeScoreModal() { els.scoreModal.hidden = true; }

els.scoreBtn.addEventListener("click", openScoreModal);
els.cancelBtn.addEventListener("click", closeScoreModal);
els.scoreModal.addEventListener("click", e => { if (e.target === els.scoreModal) closeScoreModal(); });

/* ---------- bonus pack ---------- */
// assets/levels.dat is an encrypted bonus pack. A name entered in the high score
// box is tried as its key; only the right one opens it.

const PACK_URL = "assets/levels.dat";
const PACK_ROUNDS = 600000;

async function openPack(name) {
  const key = name.toLowerCase().replace(/\s+/g, "");
  if (key.length < 8 || !window.crypto || !crypto.subtle || typeof DecompressionStream === "undefined") return null;
  try {
    const res = await fetch(PACK_URL);
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    const n = buf.length;
    if (n < 100 || String.fromCharCode(...buf.subarray(0, 4)) !== "WJG1") return null;

    const salt = buf.slice(4, 20), iv = buf.slice(20, 36), tag = buf.slice(n - 32);
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: PACK_ROUNDS, hash: "SHA-256" }, base, 512));

    const macKey = await crypto.subtle.importKey("raw", bits.slice(32), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    if (!(await crypto.subtle.verify("HMAC", macKey, tag, buf.subarray(0, n - 32)))) return null;

    const aesKey = await crypto.subtle.importKey("raw", bits.slice(0, 32), { name: "AES-CBC" }, false, ["decrypt"]);
    const plain = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-CBC", iv }, aesKey, buf.subarray(36, n - 32)));
    const unzip = async bytes =>
      JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text());
    // Version 2 ("WJP2"): a small table, then separately compressed parts, so each
    // extra part is only unpacked when it is needed (keeps memory low on phones).
    if (String.fromCharCode(...plain.subarray(0, 4)) !== "WJP2") return await unzip(plain);
    const headLen = new DataView(plain.buffer, plain.byteOffset + 4, 4).getUint32(0, true);
    const head = JSON.parse(new TextDecoder().decode(plain.subarray(8, 8 + headLen)));
    const part = ([start, len]) => plain.subarray(8 + headLen + start, 8 + headLen + start + len);
    const pack = await unzip(part(head.core));
    pack.langs = Object.keys(head.langs);
    pack.loadLang = code => (head.langs[code] ? unzip(part(head.langs[code])) : Promise.resolve(null));
    return pack;
  } catch (e) {
    return null;
  }
}

function showPack(pack) {
  inPack = true; // never reload for an update while the bonus pack is open
  stopTimer();
  document.querySelectorAll('link[rel="stylesheet"], style').forEach(n => n.remove());
  document.head.appendChild(Object.assign(document.createElement("style"), { textContent: pack.css }));
  document.body.className = "";
  document.body.innerHTML = pack.html;
  self.PACK = {
    index: pack.index, books: pack.books, booksByLang: pack.booksByLang || {},
    langs: pack.langs || [], loadLang: pack.loadLang || (() => Promise.resolve(null)), lang,
  };
  const script = document.createElement("script");
  script.textContent = `(() => {\n${pack.js}\n})();`;
  document.body.appendChild(script);
  window.scrollTo(0, 0);
}

els.scoreForm.addEventListener("submit", async e => {
  e.preventDefault();
  const name = els.nameInput.value.trim();
  if (!name) return;

  const saveBtn = els.scoreForm.querySelector('button[type="submit"]');
  saveBtn.disabled = true;
  saveBtn.textContent = t("saving");
  const pack = await openPack(name);
  saveBtn.disabled = false;
  saveBtn.textContent = t("save");

  els.scoreBtn.hidden = true; // one entry per game
  closeScoreModal();
  if (pack) { showPack(pack); return; }

  saveHighScore({
    name, size: game.n, moves: game.moves, seconds: game.seconds, auto: game.autoUsed,
    date: new Date().toISOString(),
  });
  game.savedName = name;
  showMessage();
});

/* ---------- automatic updates ---------- */
// iPhone home-screen apps are usually resumed rather than restarted, so check for
// a new version every time the app is opened or brought back to the front.
// When the new version has been downloaded: if no game is in progress, reload
// straight away; otherwise show an "Update" bar so a game isn't lost.

let inPack = false;

function gameUntouched() {
  return game && (game.moves === 0 || game.done && els.scoreBtn.hidden) && els.scoreModal.hidden;
}

function showUpdateBar() {
  if (document.getElementById("update-bar")) return;
  const bar = document.createElement("div");
  bar.id = "update-bar";
  bar.className = "update-bar";
  const text = document.createElement("span");
  text.dataset.t = "updateReady";
  text.textContent = t("updateReady");
  const btn = document.createElement("button");
  btn.type = "button";
  btn.dataset.t = "updateNow";
  btn.textContent = t("updateNow");
  btn.addEventListener("click", () => location.reload());
  bar.append(text, btn);
  document.body.appendChild(bar);
}

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  let controlled = !!navigator.serviceWorker.controller;
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!controlled) { controlled = true; return; } // first install, not an update
    if (reloading || inPack) return;
    if (gameUntouched()) { reloading = true; location.reload(); }
    else showUpdateBar();
  });
  const checkForUpdate = () => {
    navigator.serviceWorker.getRegistration().then(r => r && r.update()).catch(() => {});
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkForUpdate();
  });
  window.addEventListener("pageshow", e => { if (e.persisted) checkForUpdate(); });
}

// Start fresh (drop any leftover #... from the address).
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
applyLanguage();
newGame();
