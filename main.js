// Menunggu hingga halaman HTML selesai dimuat sebelum menjalankan kode JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const inputBook = document.getElementById("inputBook");

  inputBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

const books = [];
const RENDER_EVENT = "render-book";

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const inputBookIsComplete = document.getElementById(
    "inputBookIsComplete"
  ).checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    inputBookIsComplete
  );

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// generate id yang unik
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );

  completeBookshelfList.innerHTML = "";
  incompleteBookshelfList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBookList(bookItem);

    // Menentukan ke daftar mana buku harus ditambahkan
    if (bookItem.isComplete) {
      completeBookshelfList.appendChild(bookElement);
      const toggleButton = bookElement.querySelector(".toggle-button");

      // Menetapkan teks dan event listener yang sesuai
      toggleButton.innerText = "Belum selesai dibaca";
      toggleButton.addEventListener("click", function () {
        markAsIncomplete(bookItem.id);
      });
    } else {
      incompleteBookshelfList.appendChild(bookElement);
      const toggleButton = bookElement.querySelector(".toggle-button");

      // Menetapkan teks dan event listener yang sesuai
      toggleButton.innerText = "Selesai dibaca";
      toggleButton.addEventListener("click", function () {
        markAsComplete(bookItem.id);
      });
    }
  }
});

//Fungsi untuk membuat elemen Buku yang sudah diinput
function createBookList(bookObject) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = bookObject.title;

  const authorName = document.createElement("p");
  authorName.innerText = "Penulis: " + bookObject.author;

  const publicationYear = document.createElement("p");
  publicationYear.innerText = "Tahun " + bookObject.year;

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("book_item");

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("action");

  const greenButton = document.createElement("button");
  greenButton.classList.add("green", "toggle-button");
  greenButton.innerText = "Selesai dibaca";

  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";

  // Menambahkan event listener untuk tombol "Selesai dibaca"
  greenButton.addEventListener("click", function () {
    markAsComplete(bookObject.id);
  });

  // Menambahkan event listener untuk tombol "Hapus buku"
  redButton.addEventListener("click", function () {
    removeBook(bookObject.id);
  });

  // Menambahkan tombol "hapus buku" dan "selesai dibaca" ke div dengan class "action"
  actionContainer.append(greenButton, redButton);

  bookContainer.append(bookTitle, authorName, publicationYear, actionContainer);
  // Tambahkan ini untuk mengembalikan elemen bookContainer

  return bookContainer;
}

// Menghandle submit form untuk pencarian buku
const searchBook = document.getElementById("searchBook");
const searchBookTitle = document.getElementById("searchBookTitle");

searchBook.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = searchBookTitle.value.toLowerCase().trim();

  const searchResults = books.filter((book) => {
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.year.toString().includes(query)
    );
  });

  updateSearchResults(searchResults);
});

// Fungsi untuk memperbarui tampilan hasil pencarian
function updateSearchResults(results) {
  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  for (const book of results) {
    const bookItem = createBookList(book);
    if (book.isComplete) {
      completeBookshelfList.appendChild(bookItem);
    } else {
      incompleteBookshelfList.appendChild(bookItem);
    }
  }
}

// Menandai buku sebagai selesai dibaca
function markAsComplete(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// Menandai buku sebagai belum selesai dibaca
function markAsIncomplete(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex].isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

// Menghapus buku dari daftar
function removeBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}
