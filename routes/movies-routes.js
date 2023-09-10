const router = require("express").Router();
const Movie = require("../models/Movie.model.js");
const Celebrity = require("../models/Celebrity.model.js");

router.get("/movies/create", (req, res, next) => {
  Celebrity.find()
    .then((allCelebrities) => {
      res.render("movies/new-movie.hbs", { allCelebrities });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/movies/create", (req, res, next) => {
  const { title, genre, plot, cast } = req.body;
  Movie.create({ title, genre, plot, cast })
    .then(() => {
      console.log("Movie created successfully");
      res.render("movies/movies.hbs");
    })
    .catch((err) => {
      console.error("Error creating movie:", err);
      res.redirect("movies/new-movie.hbs");
      next(err);
    });
});

router.get("/movies", (req, res, next) => {
  Movie.find()
    .then((allMovies) => {
      res.render("movies/movies.hbs", { allMovies });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/movies/:movieID", (req, res, next) => {
  const { movieID } = req.params;
  Movie.findById(movieID)
    .populate("cast")
    .exec()
    .then((movie) => res.render("movies/movie-details.hbs", { movie }))
    .catch((err) => next(err));
});

router.get("/movies/:movieID/edit", (req, res, next) => {
  const { movieID } = req.params;
  Movie.findById(movieID)
    .then((movieToEdit) => {
      console.log(movieToEdit);
      res.render("movies/edit-movie.hbs", { movieToEdit });
    })
    .catch((error) => next(error));
});

router.post("/movies/:movieID/edit", async (req, res, nest) => {
  try {
    const { movieID } = req.params;
    const { title, genre, plot, cast } = req.body;
    await Movie.findByIdAndUpdate(
      movieID,
      { title, genre, plot, cast },
      { new: true }
    );
    res.redirect("/movies");
    console.log(req.body);
  } catch (err) {
    console.log(err);
    res.redirect("movies/:movieID/edit");
  }
});

router.post("/movies/:movieID/delete", async (req, res, next) => {
  try {
    const { movieID } = req.params;
    await Movie.findByIdAndDelete(movieID);
    res.redirect("/movies");
  } catch (error) {
    console.error(error);
    res.redirect("movies/movies.hbs");
  }
});

module.exports = router;
