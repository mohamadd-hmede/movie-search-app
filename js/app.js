// DOM Elements

const API_KEY = "96218944";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const loadingSpinner = document.getElementById("loading-spinner");
const message = document.getElementById("message");
const movieResults = document.getElementById("movie-results");
const movieModal = document.getElementById("movie-modal");
const modalBody = document.getElementById("modal-body");
const closeModalButton = document.getElementById("close-modal");

// Helper Functions

function showLoading() {
  loadingSpinner.style.display = "block";
  message.textContent = "";
}

function hideLoading() {
  loadingSpinner.style.display = "none";
}

function openModal() {
  movieModal.style.display = "flex";
}

function closeModal() {
  movieModal.style.display = "none";
}

// Feature Functions

function displayMovieDetails(movieDetails) {
  modalBody.textContent = "";

  const modalPoster = document.createElement("img");

  if (movieDetails.Poster === "N/A") {
    modalPoster.src = "https://via.placeholder.com/300x450?text=No+Image";
  } else {
    modalPoster.src = movieDetails.Poster;
  }

  modalPoster.alt = movieDetails.Title;

  const modalTitle = document.createElement("h2");
  modalTitle.textContent = movieDetails.Title;

  const genre = document.createElement("p");
  genre.textContent = `Genre: ${movieDetails.Genre}`;

  const runtime = document.createElement("p");
  runtime.textContent = `Runtime: ${movieDetails.Runtime}`;

  const director = document.createElement("p");
  director.textContent = `Director: ${movieDetails.Director}`;

  const actors = document.createElement("p");
  actors.textContent = `Actors: ${movieDetails.Actors}`;

  const rating = document.createElement("p");
  rating.textContent = `IMDb Rating: ${movieDetails.imdbRating}`;

  const plot = document.createElement("p");
  plot.textContent = movieDetails.Plot;

  modalBody.appendChild(modalPoster);
  modalBody.appendChild(modalTitle);
  modalBody.appendChild(genre);
  modalBody.appendChild(runtime);
  modalBody.appendChild(director);
  modalBody.appendChild(actors);
  modalBody.appendChild(rating);
  modalBody.appendChild(plot);

  openModal();
}

async function showMovieDetails(imdbID) {
  const detailsUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`;

  const detailsResponse = await fetch(detailsUrl);
  const movieDetails = await detailsResponse.json();

  displayMovieDetails(movieDetails);
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const poster = document.createElement("img");

  if (movie.Poster === "N/A") {
    poster.src = "https://via.placeholder.com/300x450?text=No+Image";
  } else {
    poster.src = movie.Poster;
  }

  poster.alt = movie.Title;

  const title = document.createElement("h2");
  title.textContent = movie.Title;

  const year = document.createElement("p");
  year.textContent = movie.Year;

  const detailsButton = document.createElement("button");
  detailsButton.textContent = "View Details";

  detailsButton.addEventListener("click", function () {
    showMovieDetails(movie.imdbID);
  });

  card.appendChild(poster);
  card.appendChild(title);
  card.appendChild(year);
  card.appendChild(detailsButton);

  movieResults.appendChild(card);
}

async function searchMovies(movieTitle) {
  showLoading();
  movieResults.textContent = "";

  try {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(movieTitle)}`;

    const response = await fetch(url);
    const data = await response.json();

    hideLoading();

    if (data.Response === "False") {
      message.textContent = data.Error;
      return;
    }

    message.textContent = `${data.totalResults} results found`;

    data.Search.forEach(function (movie) {
      createMovieCard(movie);
    });
  } catch (error) {
    message.textContent = "Something went wrong. Please try again later.";
    console.error(error);
  }
}

// Event Listeners

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const movieTitle = searchInput.value.trim();

  if (movieTitle === "") {
    message.textContent = "Please enter a movie title.";
    return;
  }

  searchMovies(movieTitle);
});

closeModalButton.addEventListener("click", closeModal);

movieModal.addEventListener("click", function (event) {
  if (event.target === movieModal) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});
