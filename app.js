const tests = [
  {
    id: "singkat",
    title: "Tes IQ Singkat (Online)",
    questionRange: "20 soal",
    timeRange: "10–12 menit",
    questionCount: 20,
    minDuration: 10,
    maxDuration: 12,
    icons: ["⚡", "📱", "🧩"],
  },
];

const questionPool = [
  {
    text: "Pola: 2, 6, 12, 20, 30, ...",
    options: ["40", "41", "42", "44"],
    answer: 2,
  },
  {
    text: "Pola: 3, 9, 27, 81, ...",
    options: ["162", "243", "324", "729"],
    answer: 1,
  },
  {
    text: "Pola: 5, 8, 14, 23, 35, ...",
    options: ["46", "48", "49", "50"],
    answer: 2,
  },
  {
    text: "Jika 7x + 5 = 26, maka x = ...",
    options: ["2", "3", "4", "5"],
    answer: 0,
  },
  {
    text: "15 × 4 ÷ 5 = ...",
    options: ["10", "12", "15", "20"],
    answer: 1,
  },
  {
    text: "9 : 3 = 27 : ...",
    options: ["6", "7", "8", "9"],
    answer: 3,
  },
  {
    text: "Angka berikutnya: 1, 1, 2, 3, 5, 8, ...",
    options: ["11", "12", "13", "15"],
    answer: 2,
  },
  {
    text: "64, 32, 16, 8, ...",
    options: ["6", "4", "2", "1"],
    answer: 2,
  },
  {
    text: "Semua A adalah B. Semua B adalah C. Maka semua A adalah ...",
    options: ["A", "B", "C", "Tidak bisa disimpulkan"],
    answer: 2,
  },
  {
    text: "Anton lebih tinggi dari Budi. Budi lebih tinggi dari Citra. Siapa paling pendek?",
    options: ["Anton", "Budi", "Citra", "Tidak diketahui"],
    answer: 2,
  },
  {
    text: "Jika: “Tidak ada kucing yang bisa berenang” dan “Milo adalah kucing”, maka ...",
    options: [
      "Milo bisa berenang",
      "Milo tidak bisa berenang",
      "Milo pasti ikan",
      "Tidak bisa disimpulkan",
    ],
    answer: 1,
  },
  {
    text: "Mana yang paling tidak cocok?",
    options: ["Mata", "Telinga", "Hidung", "Siku"],
    answer: 3,
  },
  {
    text: "Jika semua dokter adalah pekerja. Sebagian pekerja adalah atlet. Maka ...",
    options: [
      "Semua dokter adalah atlet",
      "Sebagian dokter adalah atlet",
      "Tidak dapat dipastikan dokter atlet atau tidak",
      "Tidak ada atlet yang pekerja",
    ],
    answer: 2,
  },
  {
    text: "Jika “BEKU” berlawanan dengan ...",
    options: ["Es", "Dingin", "Cair", "Keras"],
    answer: 2,
  },
  {
    text: "Pisau : Memotong = Pensil : ...",
    options: ["Menghapus", "Menulis", "Membaca", "Makan"],
    answer: 1,
  },
  {
    text: "Buku : Pengetahuan = Peta : ...",
    options: ["Sejarah", "Arah", "Musik", "Warna"],
    answer: 1,
  },
  {
    text: "Sinonim “AKURAT” adalah ...",
    options: ["Tepat", "Cepat", "Keras", "Ramai"],
    answer: 0,
  },
  {
    text: "Lawan kata “KONSTAN” adalah ...",
    options: ["Stabil", "Tetap", "Berubah", "Sama"],
    answer: 2,
  },
  {
    text: "Sebuah persegi dibagi 4 bagian sama besar. Jika 1 bagian diarsir, maka pecahan yang diarsir adalah ...",
    options: ["1/2", "1/3", "1/4", "3/4"],
    answer: 2,
  },
  {
    text: "Jika sebuah benda diputar 180°, posisinya menjadi ... (secara umum)",
    options: ["Sama persis seperti awal", "Terbalik arah", "Tidak berubah sama sekali", "90° ke kanan"],
    answer: 1,
  },
];

const testGrid = document.getElementById("testGrid");
const testRunner = document.getElementById("testRunner");
const runnerTitle = document.getElementById("runnerTitle");
const runnerMeta = document.getElementById("runnerMeta");
const timerEl = document.getElementById("timer");
const questionIndex = document.getElementById("questionIndex");
const questionText = document.getElementById("questionText");
const optionsEl = document.getElementById("options");
const progressBar = document.getElementById("progressBar");
const resultsSection = document.getElementById("results");
const finalScore = document.getElementById("finalScore");
const scoreLabel = document.getElementById("scoreLabel");
const analysisList = document.getElementById("analysisList");
const recommendationList = document.getElementById("recommendationList");
const scrollToTests = document.getElementById("scrollToTests");
const viewGuide = document.getElementById("viewGuide");

let currentTest = null;
let questions = [];
let currentIndex = 0;
let answers = [];
let timerInterval = null;
let remainingSeconds = 0;
let currentDuration = 0;

const analysisPresets = [
  "Numerik & pola: menilai kemampuan mengenali urutan dan operasi angka.",
  "Logika & penalaran: menguji konsistensi kesimpulan dari informasi.",
  "Verbal & analogi: mengukur pemahaman makna dan relasi kata.",
  "Spasial sederhana: melihat kemampuan visual dasar.",
];

const recommendationPresets = [
  "Latih pola angka dengan waktu singkat agar kecepatan meningkat.",
  "Baca soal logika silogisme untuk menguatkan penalaran.",
  "Perbanyak kosakata dan analogi untuk bagian verbal.",
  "Gunakan latihan visual sederhana (pola, pecahan) secara rutin.",
];

const scoreBands = [
  { min: 0, max: 4, iq: "< 80", label: "Sangat rendah" },
  { min: 5, max: 7, iq: "80–89", label: "Rendah" },
  { min: 8, max: 10, iq: "90–99", label: "Rata-rata bawah" },
  { min: 11, max: 13, iq: "100–109", label: "Rata-rata" },
  { min: 14, max: 16, iq: "110–119", label: "Di atas rata-rata" },
  { min: 17, max: 18, iq: "120–129", label: "Tinggi" },
  { min: 19, max: 20, iq: "≥ 130", label: "Sangat tinggi" },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function renderTests() {
  testGrid.innerHTML = "";
  tests.forEach((test) => {
    const card = document.createElement("div");
    card.className = "test-card";

    const icons = test.icons
      .map((icon) => `<span aria-hidden="true">${icon}</span>`)
      .join("");

    card.innerHTML = `
      <div class="test-icons">${icons}</div>
      <h3>${test.title}</h3>
      <div class="test-meta">
        <span><strong>Jumlah Soal:</strong> ${test.questionRange}</span>
        <span><strong>Waktu:</strong> ${test.timeRange}</span>
      </div>
      <button class="btn primary" data-test="${test.id}">Mulai Tes</button>
    `;

    testGrid.appendChild(card);
  });
}

function setupTest(test) {
  currentTest = test;
  currentDuration = randomInt(test.minDuration, test.maxDuration);
  questions = buildQuestions(test.questionCount);
  answers = Array(questions.length).fill(null);
  currentIndex = 0;
  remainingSeconds = currentDuration * 60;

  runnerTitle.textContent = test.title;
  runnerMeta.textContent = `${questions.length} soal • ${currentDuration} menit`;
  updateTimerDisplay();
  updateQuestion();
  updateProgress();

  testRunner.style.display = "block";
  resultsSection.style.display = "none";
  testRunner.scrollIntoView({ behavior: "smooth" });

  if (timerInterval) {
    clearInterval(timerInterval);
  }
  timerInterval = setInterval(tickTimer, 1000);
}

function buildQuestions(size) {
  return questionPool.slice(0, size);
}

function updateQuestion() {
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) return;

  questionIndex.textContent = `Soal ${currentIndex + 1} dari ${questions.length}`;
  questionText.textContent = currentQuestion.text;
  optionsEl.innerHTML = "";

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;

    if (answers[currentIndex] === index) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      answers[currentIndex] = index;
      updateQuestion();
      updateProgress();
    });

    optionsEl.appendChild(button);
  });
}

function updateProgress() {
  const answered = answers.filter((answer) => answer !== null).length;
  const progress = (answered / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function updateTimerDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timerEl.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function tickTimer() {
  if (remainingSeconds <= 0) {
    finishTest();
    return;
  }
  remainingSeconds -= 1;
  updateTimerDisplay();
}

function finishTest() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const correct = answers.reduce((total, answer, index) => {
    if (answer === questions[index].answer) {
      return total + 1;
    }
    return total;
  }, 0);

  finalScore.textContent = `${correct}/${questions.length}`;

  const band = scoreBands.find((item) => correct >= item.min && correct <= item.max);
  scoreLabel.textContent = band
    ? `Estimasi IQ ${band.iq} • ${band.label}`
    : "Estimasi IQ belum tersedia.";

  analysisList.innerHTML = "";
  recommendationList.innerHTML = "";

  const estimationNote = "Tes singkat ini bersifat perkiraan dan bukan diagnosis psikolog.";
  const bandText = band ? `Interpretasi: ${band.label}.` : "Interpretasi: belum tersedia.";

  [estimationNote, `Skor mentah: ${correct} dari ${questions.length}.`, bandText].forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    analysisList.appendChild(li);
  });

  analysisPresets.slice(0, 3).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    analysisList.appendChild(li);
  });

  recommendationPresets.slice(0, 3).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    recommendationList.appendChild(li);
  });

  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

function goNext() {
  if (currentIndex < questions.length - 1) {
    currentIndex += 1;
    updateQuestion();
  }
}

function goPrev() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    updateQuestion();
  }
}

renderTests();

testGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-test]");
  if (!button) return;

  const testId = button.dataset.test;
  const selected = tests.find((test) => test.id === testId);
  if (selected) {
    setupTest(selected);
  }
});

document.getElementById("prevQuestion").addEventListener("click", goPrev);
document.getElementById("nextQuestion").addEventListener("click", goNext);
document.getElementById("finishTest").addEventListener("click", finishTest);

scrollToTests.addEventListener("click", () => {
  document.getElementById("tests").scrollIntoView({ behavior: "smooth" });
});

viewGuide.addEventListener("click", () => {
  document.getElementById("guide").scrollIntoView({ behavior: "smooth" });
});
