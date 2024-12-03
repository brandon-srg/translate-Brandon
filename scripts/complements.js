import { dictionarys } from "./dictionary.js";

if (!localStorage.getItem("dictionarys")) {
  localStorage.setItem("dictionarys", JSON.stringify(dictionarys));
}

let dictionary = JSON.parse(localStorage.getItem("dictionarys"))

const showWords = () => {
  const allWordsSection = document.getElementById("allWords");
  allWordsSection.innerHTML = "";

  const categoryValue = document.getElementById("orderByCategoryTable").value;

  const table = document.createElement("table");
  table.classList.add("words-table");

  const headerRow = document.createElement("tr");

  headerRow.innerHTML = `
      <th>ID</th>
      <th>English</th>
      <th>Spanish</th>
      <th>Example</th>
  `;
  table.appendChild(headerRow);


  if (categoryValue == "all") {
    headerRow.innerHTML = `
      <th>ID</th>
      <th>English</th>
      <th>Spanish</th>
      <th>Example</th>
      <th>Category</th>
  `;
    for (const category in dictionary.categories) {
      dictionary.categories[category].forEach((word) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${word.id}</td>
        <td>${word.english}</td>
        <td>${word.spanish}</td>
        <td>${word.example}</td>
        <td>${category}</td>
      `;
        table.appendChild(row);
      });
    }
  } else {
    dictionary.categories[categoryValue].forEach((word) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${word.id}</td>
        <td>${word.english}</td>
        <td>${word.spanish}</td>
        <td>${word.example}</td>
      `;
      table.appendChild(row);
    });
  }
  allWordsSection.appendChild(table);
}

const renderCategory = (idSelect) => {
  const selectCategory = document.getElementById(idSelect);
  for (const key in dictionary.categories) {
    const category = document.createElement("option");
    category.value = key;
    category.textContent = key;
    category.classList.add("optionCategories")
    selectCategory.appendChild(category);
  }
}

const addword = () => {
  const english = document.getElementById("english").value;
  const spanish = document.getElementById("spanish").value;
  const example = document.getElementById("example").value;
  const categoryValue = document.getElementById("orderByCategoryForm").value;

  if (!english || !spanish || !example || !categoryValue) {
    alert("All fields are required!");
    return;
  }

  const newWord = {
    "id": dictionary.categories[categoryValue].length + 1,
    "english": english,
    "spanish": spanish,
    "example": example
  }
  dictionary.categories[categoryValue].push(newWord);
  localStorage.setItem('dictionarys', JSON.stringify(dictionary));

  const validator = validatorWord(english, spanish, "all");
  if (validator > 1) {
    alert("This word already exists in the dictionary");
  } else {
    alert("Word added successfully");
  }
  showWords();

  console.log(dictionary.categories[categoryValue]);


}

const validatorWord = (wordEnglish, wordSpanish, mode) => {
  let validator = 0;
  for (const key in dictionary.categories) {
    dictionary.categories[key].forEach((word) => {
      const english = word.english;
      const spanish = word.spanish;

      if (mode === "all") {
        if (
          wordEnglish &&
          wordSpanish &&
          english.toLowerCase() === wordEnglish.toLowerCase() &&
          spanish.toLowerCase() === wordSpanish.toLowerCase()
        ) {
          validator++;
        }
      } else if (mode === "EnTSp") {
        if (wordEnglish && english.toLowerCase() === wordEnglish.toLowerCase()) {
          validator++;
        }
      } else if (mode === "SpTEn") {
        if (wordSpanish && spanish.toLowerCase() === wordSpanish.toLowerCase()) {
          validator++;
        }
      }
    });
  }
  return validator;
};

const orderByAlphabeetical = (array, getter, order = "asc") => {
  array.sort((a, b) => {
    const first = getter(a);
    const second = getter(b);

    const compare = first.localCompare(second);
    return order === "asc"? compare : -compare;
  });
  return array;
}

const translaterWord = () => {
  const containerTranslate = document.getElementById("translated-word");
  containerTranslate.innerHTML = "";

  const wordToTranslate = document.getElementById("wordInput").value.trim();
  const mode = document.getElementById("lenguage").value;

  if (!wordToTranslate || !mode) {
    alert("Please enter a word and select a language mode!");
    return;
  }

  const table = document.createElement("table");
  table.classList.add("words-table");

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = `
      <th>ID</th>
      <th>English</th>
      <th>Spanish</th>
      <th>Example</th>
  `;
  table.appendChild(headerRow);

  let validator = 0;
  let validatorRows = 0;

  if (mode === "EnTSp") {
    validator = validatorWord(wordToTranslate, undefined, "EnTSp");
  } else if (mode === "SpTEn") {
    validator = validatorWord(undefined, wordToTranslate, "SpTEn");
  }

  if (validator > 0) {
    for (const key in dictionary.categories) {
      dictionary.categories[key].forEach((word) => {
        const english = word.english.toLowerCase();
        const spanish = word.spanish.toLowerCase();

        if (
          (mode === "EnTSp" && english === wordToTranslate.toLowerCase()) ||
          (mode === "SpTEn" && spanish === wordToTranslate.toLowerCase())
        ) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${word.id}</td>
            <td>${word.english}</td>
            <td>${word.spanish}</td>
            <td>${word.example}</td>
          `;
          table.appendChild(row);
          validatorRows++;
        }
      });
    }
  }

  if (validatorRows === 0) {
    const noResultsRow = document.createElement("tr");
    noResultsRow.innerHTML = `
      <td colspan="4">No matches found for the entered word and selected language mode.</td>
    `;
    table.appendChild(noResultsRow);
  }

  containerTranslate.appendChild(table);
};


document.getElementById("orderByCategoryTable").addEventListener("change", () => showWords());
document.getElementById("addWord").addEventListener("click", () => addword());
document.getElementById("translaterButton").addEventListener("click", () => translaterWord());





document.addEventListener("DOMContentLoaded", () => {
  renderCategory("orderByCategoryTable");
  renderCategory("orderByCategoryForm");
  showWords();
});


