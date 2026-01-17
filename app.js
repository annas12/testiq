const tests = [
  {
    id: "singkat",
    title: "Tes IQ Singkat (Online)",
    questionRange: "10–25 soal",
    timeRange: "5–15 menit",
    defaultDuration: 10,
    icons: ["⚡", "📱", "🧩"],
  },
  {
    id: "standar",
    title: "Tes IQ Standar",
    questionRange: "30–60 soal",
    timeRange: "30–90 menit",
    defaultDuration: 45,
    icons: ["📘", "🧠", "⏳"],
  },
  {
    id: "profesional",
    title: "Tes IQ Profesional (Psikolog)",
    questionRange: "60–120+ soal",
    timeRange: "1,5–3 jam",
    defaultDuration: 90,
    icons: ["🏅", "🧬", "📝"],
  },
  {
    id: "seleksi",
    title: "Tes Seleksi Kerja/Sekolah",
    questionRange: "20–50 soal",
    timeRange: "20–60 menit",
    defaultDuration: 35,
    icons: ["💼", "🏫", "📈"],
  },
];

const questionPool = [
  {
    text: "Jika semua Bloops adalah Razzies dan semua Razzies adalah Lazzies, maka semua Bloops adalah Lazzies.",
    options: ["Benar", "Salah", "Tidak dapat disimpulkan", "Tidak ada hubungan"],
    answer: 0,
  },
  {
    text: "Pola: 2, 6, 12, 20, 30, ... angka berikutnya?",
    options: ["36", "40", "42", "44"],
    answer: 2,
  },
  {
    text: "Manakah yang tidak termasuk dalam kelompok?",
    options: ["Apel", "Jeruk", "Wortel", "Mangga"],
    answer: 2,
  },
  {
    text: "Jika 3x + 2 = 14, maka x = ...",
    options: ["2", "4", "6", "8"],
    answer: 1,
  },
  {
    text: "A:B = 2:5, maka 8:B = ...",
    options: ["5", "10", "15", "20"],
    answer: 3,
  },
  {
    text: "Pilih gambar mental yang sesuai: Jika segitiga menjadi lingkaran, maka kotak menjadi...",
    options: ["Segitiga", "Bintang", "Lingkaran", "Persegi panjang"],
    answer: 2,
  },
  {
    text: "1, 1, 2, 3, 5, 8, ... angka berikutnya?",
    options: ["11", "12", "13", "15"],
    answer: 2,
  },
  {
    text: "Kata yang berlawanan dengan 'abstrak' adalah...",
    options: ["Konkret", "Luas", "Lugas", "Rumit"],
    answer: 0,
  },
  {
    text: "Jika hari ini Rabu, 10 hari lagi adalah...",
    options: ["Jumat", "Sabtu", "Minggu", "Senin"],
    answer: 3,
  },
  {
    text: "Pola huruf: A, D, G, J, ...",
    options: ["K", "L", "M", "N"],
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

const analysisPresets = [
  "Kemampuan penalaran logis Anda kuat dalam pola numerik.",
  "Kecepatan pengambilan keputusan berada pada level stabil.",
  "Persepsi visual dan pemahaman pola masih bisa ditingkatkan.",
  "Konsistensi jawaban menunjukkan fokus yang baik.",
];

const recommendationPresets = [
  "Latih soal logika verbal 15 menit per hari.",
  "Ikuti kursus pemecahan masalah atau critical thinking.",
  "Pertimbangkan jalur karier yang membutuhkan analisis data.",
  "Gunakan aplikasi puzzle untuk melatih ketelitian.",
];

const scoreLabels = [
  { min: 0, label: "Dasar — fokuskan latihan pada logika dasar." },
  { min: 50, label: "Rata-rata — lanjutkan latihan pola numerik." },
  { min: 70, label: "Baik — siap untuk tantangan lebih kompleks." },
  { min: 85, label: "Unggul — kemampuan analitik sangat kuat." },
];

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
  questions = buildQuestions();
  answers = Array(questions.length).fill(null);
  currentIndex = 0;
  remainingSeconds = test.defaultDuration * 60;

  runnerTitle.textContent = test.title;
  runnerMeta.textContent = `${test.questionRange} • ${test.timeRange}`;
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

function buildQuestions() {
  const base = [...questionPool];
  const size = Math.min(10, base.length);
  const shuffled = base.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
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

  const score = Math.round((correct / questions.length) * 100);
  finalScore.textContent = score.toString();

  const label = [...scoreLabels].reverse().find((item) => score >= item.min);
  scoreLabel.textContent = label ? label.label : scoreLabels[0].label;

  analysisList.innerHTML = "";
  recommendationList.innerHTML = "";

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
