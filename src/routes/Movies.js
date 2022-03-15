// imports to create routing
var express = require("express");
var router = express.Router();
// imports to handle database
const { Characters, Movies, Genres } = require("../db.js");
// import to validate session
const validateToken = require("../auth/validateToken.js");
const { Op } = require("sequelize");

// route
// list movies
router.get("/movies", validateToken, async (req, res) => {
  try {
    const { name, genreId, order } = req.query;
    if (name || genreId || order) {
      let movies = await Movies.findAll({
        where: {
          title: name ? { [Op.iLike]: "%" + name + "%" } : { [Op.iLike]: "%" },
        },
        include: [
          {
            model: Characters,
          },
          { model: Genres },
        ],
      });
      movies = genreId
        ? movies
            .map((m) => {
              let genres = m.genres.filter((g) => parseInt(genreId) === g.id);
              if (genres.length) {
                return {
                  title: m.title,
                  image: m.image,
                  rating: m.rating,
                  create: m.create,
                  characters: m.characters,
                  genres: genres,
                };
              }
            })
            .filter((f) => f)
        : movies;
      if (order) {
        order === "ASC"
          ? movies.sort((a, b) => {
              if (a.title > b.title) {
                return 1;
              } else {
                return -1;
              }
            })
          : movies.sort((a, b) => {
            if (a.title < b.title) {
              return 1;
            } else {
              return -1;
            }
          })
      }
      movies.length
        ? res.status(200).json(movies)
        : res.status(404).send("Movie not founded.");
    } else {
      let movies = await Movies.findAll({
        include: {
          model: Characters,
          attributes: ["id", "name", "story", "image", "weight"],
        },
      });
      movies.length
        ? res.status(200).json(movies)
        : res.status(404).send("There are not movies yet.");
    }
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});

//DETAIL
router.get("/movies/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movies.findOne({
      where: { id },
      include: {
        model: Characters,
        attributes: ["id", "name", "image", "age", "weight", "story"],
      },
    });
    movie
      ? res.status(200).json(movie)
      : res.status(404).send("Movie not founded.");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});
// CRUD
// CREATE
router.post("/movies/create", validateToken, async (req, res) => {
  try {
    const {
      image, // character property
      title, // character property
      created, // character property
      rating, // character property
      charactersByMovie, // object of characters
      /*
      charactersByMovie:[{
        name: ,
        image: ,
        age: ,
        weight: ,
        story: ,
      },{
        name: ,
        image: ,
        age: ,
        weight: ,
        story: ,
      }]
      */
      genresByMovie, //object of genres by movie
      /* 
      genresByMovie:[{
        name: ,
        image: ,
      }]
      */
    } = req.body;
    // new entrie in character table
    const newMovie = await Movies.create({
      image,
      title,
      created,
      rating,
    });
    charactersByMovie.forEach(async (m) => {
      let [newCharacter, create] = await Characters.findOrCreate({
        where: { name: m.name },
        defaults:{
          image: m.image,
          age: m.age,
          weight: m.weight,
          story: m.story,
        }
      });
      newCharacter.addMovies(newMovie);
    });
    genresByMovie.forEach(async (g) => {
      let [newGenre, create] = await Genres.findOrCreate({
        where: { name: g.name },
        defaults:{image:g.image}
      });
      newGenre.addMovies(newMovie);
    });
    res.status(200).send("Succesful");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});
// EDIT
router.put("/movies/edit/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { image, title, created, rating } = req.body;
    await Movies.update(
      { image, title, created, rating },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).send("Succesful.");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});
//DELETE
router.delete("/movies/delete/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Movies.destroy({
      where: {
        id,
      },
    });
    res.status(200).send("Succesful.");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});

module.exports = router;
