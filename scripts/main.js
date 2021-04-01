import data from "./data.js";
import { searchMovieByTitle, makeBgActive } from "./helpers.js";

class MoviesApp {
  constructor(options) {
    const {
      root,
      searchInput,
      searchForm,
      yearHandler,
      yearSubmitter,
      genreSubmitter,
    } = options;
    this.$tableEl = document.getElementById(root);
    this.$tbodyEl = this.$tableEl.querySelector("tbody");
    this.$yearEl = document.querySelector(".year-box");
    this.$genreEl = document.querySelector(".genre-box");

    this.$searchInput = document.getElementById(searchInput);
    this.$searchForm = document.getElementById(searchForm);
    this.yearHandler = yearHandler;
    this.$yearSubmitter = document.getElementById(yearSubmitter);
    this.$genreSubmitter = document.getElementById(genreSubmitter);
  }

  createMovieEl(movie) {
    const { image, title, genre, year, id } = movie;
    return `<tr data-id="${id}"><td><img src="${image}"></td><td>${title}</td><td>${genre}</td><td>${year}</td></tr>`;
  }

  createYearEl(year) {
    return `<div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="year"
                value="${year}"
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                ${year}
              </label>
            </div>
`;
  }
  createGenreEl(genre) {
    return `<div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="genre"
                value="${genre}"
                id="flexCheckDefault"
              />
              <label class="form-check-label" for="flexCheckDefault">
                ${genre}
              </label>
            </div>
`;
  }

  fillTable() {
    /* const moviesHTML = data.reduce((acc, cur) => {
            return acc + this.createMovieEl(cur);
        }, "");*/
    const moviesArr = data
      .map((movie) => {
        return this.createMovieEl(movie);
      })
      .join("");
    this.$tbodyEl.innerHTML = moviesArr;
  }

  reset() {
    this.$tbodyEl.querySelectorAll("tr").forEach((item) => {
      item.style.background = "transparent";
    });
  }

  fillYear() {
    let groupedYears = this.groupBy(data, "year");
    const years = Object.keys(groupedYears);
    const yearsHTML = years
      .map((year) => {
        return this.createYearEl(year);
      })
      .join("");
    this.$yearEl.innerHTML = yearsHTML;
  }

  fillGenre() {
    let groupedGenres = this.groupBy(data, "genre");
    const genres = Object.keys(groupedGenres);
    const genresHTML = genres
      .map((genre) => {
        return this.createGenreEl(genre);
      })
      .join("");
    this.$genreEl.innerHTML = genresHTML;
  }

  handleSearch() {
    this.$searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      this.reset();
      const searchValue = this.$searchInput.value;
      const matchedMovies = data
        .filter((movie) => {
          return searchMovieByTitle(movie, searchValue);
        })
        .forEach(makeBgActive);
      this.$searchInput.value = "";
    });
  }

  handleYearFilter() {
    const years = document.querySelectorAll(
      `input[name='${this.yearHandler}']`
    );
    years.forEach((year) => {
      const filteredMovies = data.filter((movie) => movie.year === year.value);
      year.nextSibling.nextSibling.outerText +=
        " (" + filteredMovies.length + ")";
    });

    this.$yearSubmitter.addEventListener("click", () => {
      this.reset();
      const selectedYear = document.querySelector(
        `input[name='${this.yearHandler}']:checked`
      ).value;
      const matchedMovies = data
        .filter((movie) => {
          return movie.year === selectedYear;
        })
        .forEach(makeBgActive);
    });
  }

  handleGenreFilter() {
    const genres = document.querySelectorAll(`input[type=checkbox]`);
    genres.forEach((genre) => {
      const filteredMovies = data.filter(
        (movie) => movie.genre === genre.value
      );
      genre.nextSibling.nextSibling.outerText +=
        " (" + filteredMovies.length + ")";
    });

    this.$genreSubmitter.addEventListener("click", () => {
      this.reset();
      const selectedGenre = document.querySelectorAll(
        `input[type=checkbox]:checked`
      );
      selectedGenre.forEach((genre) => {
        const matchedMovies = data
          .filter((movie) => {
            return movie.genre === genre.value;
          })
          .forEach(makeBgActive);
      });
    });
  }

  groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
      let key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  init() {
    this.fillTable();
    this.fillYear();
    this.fillGenre();
    this.handleSearch();
    this.handleYearFilter();
    this.handleGenreFilter();
  }
}

let myMoviesApp = new MoviesApp({
  root: "movies-table",
  searchInput: "searchInput",
  searchForm: "searchForm",
  yearHandler: "year",
  yearSubmitter: "yearSubmitter",
  genreHandler: "genre",
  genreSubmitter: "genreSubmitter",
});

myMoviesApp.init();
