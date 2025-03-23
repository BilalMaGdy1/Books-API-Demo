// ==  DOM Element  ==
const booksContainer = document.getElementById("booksContainer");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const alertModal = document.getElementById("alertModal");
const alertMessage = document.getElementById("alertMessage");
const modalBody = document.getElementById("modalBody");
const bookModal = document.getElementById("bookModal");

// == Variables and API Link ==
const maxResultsLimit = 30;
const defaultTopic = "Novels";
let booksData = [];
const googleBooksAPI = "https://www.googleapis.com/books/v1/volumes?q=";

// == Event Listeners for Alert and Modal Close ==
document.getElementById("alertClose").onclick = () =>
  alertModal.classList.remove("active");

document.getElementById("modalClose").onclick = () =>
  bookModal.classList.remove("active");

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    bookModal.classList.remove("active");
  }
});

// == Fetch Books from Google Books API ==
async function fetchBooks(topic = defaultTopic, maxResults = 10) {
  try {
    const response = await fetch(`${googleBooksAPI}${topic}&maxResults=${maxResults}`);
    if (!response.ok) {
      throw new Error("HTTP Error : " + response.status);
    }
    const data = await response.json();
    const items = data.items;
    if (Array.isArray(items)) {
      items.forEach((item) => {
        const info = item.volumeInfo;
        booksData.push({
          id: item.id || "Unavailable",
          title: info.title || "Unavailable",
          authors: info.authors || "Unavailable",
          imageLink: info.imageLinks ? info.imageLinks.thumbnail : "",
          description: info.description || "Unavailable",
          publisher: info.publisher || "Unavailable",
          publishedDate: info.publishedDate || "Unavailable",
          previewLink: info.previewLink || "Unavailable",
          pageCount: info.pageCount || "Unavailable",
          categories: info.categories || "Unavailable",
        });
      });
    }
    renderBooks(booksData);
  } catch (error) {
    alertModal.classList.add("active");
    alertMessage.textContent = error;
  }
}

fetchBooks(defaultTopic, maxResultsLimit);

// == Render Books in the Books Container ==
function renderBooks(booksArray) {
  booksContainer.innerHTML = "";
  booksArray.forEach((book) => {
    // Create book item container
    const bookItem = document.createElement("div");
    bookItem.className = "bookItem";
    bookItem.onclick = () => showBookDetails(book.id);
    
    // Create image container and element
    const imageContainer = document.createElement("div");
    imageContainer.className = "bookImage";
    const imageElement = document.createElement("img");
    imageElement.src = book.imageLink;
    imageElement.alt = book.title;
    imageContainer.appendChild(imageElement);
    
    // Create title container and element
    const titleContainer = document.createElement("div");
    titleContainer.className = "bookTitle";
    const titleElement = document.createElement("h3");
    titleElement.textContent = book.title;
    titleContainer.appendChild(titleElement);
    
    bookItem.append(imageContainer, titleContainer);
    booksContainer.appendChild(bookItem);
  });
}

// == Show Book Details in Modal ==
function showBookDetails(bookId) {
  // Find the book data by id
  const selectedBook = booksData.find((book) => book.id === bookId);
  if (selectedBook) {
    renderBookDetails(selectedBook);
  }
}

// == Render Book Details in Modal ==
function renderBookDetails(book) {
  bookModal.classList.add("active");
  modalBody.innerHTML = `
    <div class="image">
      <img src="${book.imageLink}" alt="${book.title}">
    </div>
    <div class="details">
      <ul>
        <li><strong>Title:</strong> ${book.title}</li>
        <li><strong>Author(s):</strong> ${Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}</li>
        <li><strong>Publisher:</strong> ${book.publisher}</li>
        <li><strong>Published:</strong> ${book.publishedDate}</li>
        <li><strong>Page Count:</strong> ${book.pageCount}</li>
        <li><strong>Categories:</strong> ${Array.isArray(book.categories) ? book.categories.join(", ") : book.categories
        }</li>
      </ul>
      <p><strong>Description:</strong> ${book.description}</p>
    </div>
    <a href="${book.previewLink}" target="_blank" id="moreDetails">More</a>
  `;
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchInput.value.trim() !== "") {
    booksData = [];
    const query = searchInput.value.trim();
    fetchBooks(query, maxResultsLimit);
  }
});

searchButton.addEventListener("click", () => {
  if (searchInput.value.trim() !== "") {
    booksData = [];
    const query = searchInput.value.trim();
    fetchBooks(query, maxResultsLimit);
  }
});