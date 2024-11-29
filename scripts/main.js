import { dictionarys } from "./dictionary.js";

const showModal = (message) => {
    const modal = document.getElementById("alertModal");
    const modalMessage = document.getElementById("modalMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
};

const closeModal = () => {
    const modal = document.getElementById("alertModal");
    modal.style.display = "none";
};


document.getElementById("closeModal").addEventListener("click", closeModal);
window.addEventListener("click", (event) => {
    const modal = document.getElementById("alertModal");
    if (event.target === modal) {
        closeModal();
    }
});

document.getElementById("translater").addEventListener("click", () => {
    const inputWord = document.getElementById("wordInput").value.trim();
    const selectedLanguage = document.getElementById("lenguage").value;

    if (!inputWord || !selectedLanguage) {
        showModal("Please complete all fields.");
        return;
    }

    const result = searchWord(dictionarys, inputWord, selectedLanguage);
    const translatedWordSection = document.getElementById("translated-word");
    translatedWordSection.innerHTML = "";

    if (result) {
        const table = document.createElement("table");
        table.classList.add("result-table");

        const headerRow = document.createElement("tr");
        headerRow.innerHTML = `
            <th>English</th>
            <th>Spanish</th>
            <th>Example</th>
            <th>Category</th>
        `;
        table.appendChild(headerRow);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${result.english}</td>
            <td>${result.spanish}</td>
            <td>${result.example}</td>
            <td>${Object.keys(dictionarys.categories).find((key) =>
                dictionarys.categories[key].includes(result)
            )}</td>
        `;
        table.appendChild(row);

        translatedWordSection.appendChild(table);
    } else {
        showModal("Word not found.");
    }
});


const searchWord = (dictionary, word, language) => {
    const isEnglishToSpanish = language === "englishToSpanish";
    const searchKey = isEnglishToSpanish ? "english" : "spanish";

    for (const category in dictionary.categories) {
        const foundWord = dictionary.categories[category].find((entry) =>
            entry[searchKey].toLowerCase() === word.toLowerCase()
        );
        if (foundWord) return foundWord;
    }

    return null;
};

const showAll = (dictionary) => {
    const allWordsSection = document.getElementById("allWords");
    allWordsSection.innerHTML = "";

    const table = createTableWithWords(dictionary, null);
    allWordsSection.appendChild(table);
};

const renderCategory = (dictionary, id) => {
    const selectCategory = document.getElementById(id);
    for (const key in dictionary.categories) {
        const category = document.createElement("option");
        category.value = key;
        category.textContent = key;
        category.classList.add("optionCategories");
        selectCategory.appendChild(category);
    }

    selectCategory.addEventListener("change", (event) => {
        const selectedCategory = event.target.value;
        showCategory(dictionary, selectedCategory);
    });
};


const showCategory = (dictionary, category, sortKey = "english", sortOrder = "asc") => {
    const allWordsSection = document.getElementById("allWords");
    allWordsSection.innerHTML = "";

    const table = createTableWithWords(dictionary, category, sortKey, sortOrder);
    allWordsSection.appendChild(table);
};

const setupSortSelect = (dictionary) => {
  const sortOrderSelect = document.getElementById("sortOrder");

  sortOrderSelect.addEventListener("change", (event) => {
      const sortOrder = event.target.value;
      const allWordsSection = document.getElementById("allWords");
      allWordsSection.innerHTML = "";

      const table = createTableWithWords(dictionary, null, "english", sortOrder);
      allWordsSection.appendChild(table);
  });
};

const createTableWithWords = (dictionary, category, sortKey = "english", sortOrder = "asc") => {
  let words = [];

  if (category && dictionary.categories[category]) {
      words = [...dictionary.categories[category]];
  } else {
      for (const cat in dictionary.categories) {
          words = words.concat(dictionary.categories[cat]);
      }
  }

  words.sort((a, b) => {
      if (sortOrder === "asc") {
          if (a[sortKey] < b[sortKey]) return -1;
          if (a[sortKey] > b[sortKey]) return 1;
      } else if (sortOrder === "desc") {
          if (a[sortKey] < b[sortKey]) return 1;
          if (a[sortKey] > b[sortKey]) return -1;
      }
      return 0;
  });

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

  words.forEach((word) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${word.id}</td>
          <td>${word.english}</td>
          <td>${word.spanish}</td>
          <td>${word.example}</td>
      `;
      table.appendChild(row);
  });

  return table;
};



document.getElementById("addWord").addEventListener("click", () => {
  const englishInput = document.getElementById("english").value.trim();
  const spanishInput = document.getElementById("spanish").value.trim();
  const exampleInput = document.getElementById("example").value.trim();
  const categorySelect = document.getElementById("orderByCategoryTable").value;

  if (!englishInput || !spanishInput || !exampleInput || !categorySelect) {
      showModal("Please complete all fields.");
      return;
  }


  const newWord = {
      id: new Date().getTime().toString(), 
      english: englishInput,
      spanish: spanishInput,
      example: exampleInput,
  };


  if (!dictionarys.categories[categorySelect]) {
      dictionarys.categories[categorySelect] = [];
  }
  dictionarys.categories[categorySelect].push(newWord);

  
  showCategory(dictionarys, categorySelect);

  
  document.getElementById("addWordForm").reset();
  showModal("Word added successfully!");
});



document.getElementById("orderByAlphabet").addEventListener("change", (event) => {
  const [sortKey, sortOrder] = event.target.value.split("-");
  const allWordsSection = document.getElementById("allWords");
  allWordsSection.innerHTML = "";

  
  showCategory(dictionarys, null, sortKey, sortOrder);
});

document.addEventListener("DOMContentLoaded", () => {
    showAll(dictionarys);
    renderCategory(dictionarys, "orderByCategoryTable");
    renderCategory(dictionarys, "orderByCategoryForm");
    setupSortSelect(dictionarys);
});



