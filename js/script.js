function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const createElement = (arr) => {
  const htmlElement = arr.map((el) => `<span>${el}</span>`);
  return htmlElement.join(" ");
};

const allLevel = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayAllLevel(data.data));
};

const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (lessonId) => {
  manageSpinner(true);
  fetch(`https://openapi.programming-hero.com/api/level/${lessonId}`)
    .then((res) => res.json())
    .then((word) => {
      removeActive();
      const lessonBtn = document.getElementById(`lessonBtn${lessonId}`);
      lessonBtn.classList.add("active");
      displayAllWord(word.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetail(details.data);
};

const displayWordDetail = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
 <h2 class="text-4xl font-semibold">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i>: ${word.pronunciation ? word.pronunciation : "উচ্চারন উপলভ্য নয়"})
            </h2>
            <p class="text-xl font-semibold">Meaning</p>
            <p class="font-bangla font-medium text-xl">${word.meaning ? word.meaning : "অর্থ পাওয়া যাচ্ছে না।"}</p>
            <p class="font-semibold text-xl">Example</p>
            <p class="font-semibold text-xl">
             ${word.sentence}
            </p>
            <p class="font-semibold text-xl">সমার্থক শব্দ গুলো</p>
            <div>
             ${createElement(word.synonyms)}
            </div>`;
  document.getElementById("word_modal").showModal();
};

const displayAllWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length === 0) {
    wordContainer.innerHTML = `
      <div
          class="col-span-full text-center rounded py-20 font-bangla space-y-5"
        > 
        <img class="mx-auto" src="./assets/alert-error.png" alt="error msg">
          <p class="text-gray-400 text-xl">
           এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </p>
          <h2 class="text-4xl font-medium">নেক্সট Lesson এ যান।</h2>
        </div>
  `;
    manageSpinner(false);
    return;
  }
  words.forEach((word) => {
    const wordDiv = document.createElement("div");
    wordDiv.className = "bg-white rounded-xl space-y-5 p-14";
    wordDiv.innerHTML = `<h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দটি পাওয়া যাচ্ছে না"}</h2>
        <p class="text-xl font-medium">Meaning /Pronunciation</p>
        <p class="text-2xl font-semibold">"${word.meaning ? word.meaning : "অর্থটি পাওয়া যাচ্ছে না"} / ${word.pronunciation ? word.pronunciation : "উচ্চারনটি খুজে পাওয়া যাচ্ছে না"}"</p>
        <div class="flex justify-between items-center">
          <div onclick="loadWordDetail(${word.id})" class="btn"><i class="fa-solid fa-circle-info"></i></div>
          <div onclick="pronounceWord('${word.word}')" class="btn"><i class="fa-solid fa-volume-high"></i></div>
          </div>`;
    wordContainer.append(wordDiv);
  });
  manageSpinner(false);
};

const manageSpinner = (status) => {
  if (status) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("word-container").classList.remove("hidden");
  }
};

const displayAllLevel = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  lessons.forEach((lesson) => {
    const lessonDiv = document.createElement("div");
    lesson.innerHTML = "";
    lessonDiv.innerHTML = `
    <button id="lessonBtn${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}</button>`;
    levelContainer.appendChild(lessonDiv);
  });
};
allLevel();

document.getElementById("search-btn").addEventListener("click", () => {
  removeActive()
  const input = document.getElementById("search-input");
  const value = input.value.trim().toLowerCase();
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter(word=> word.word.toLowerCase().includes(value));
     displayAllWord(filterWords)
    });
});
