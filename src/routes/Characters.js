// imports to create routing
var express = require("express");
var router = express.Router();
const { Op } = require("sequelize");
// imports to handle database
const { Characters, Movies, Genres } = require("../db.js");
// import to validate session
const validateToken = require("../auth/validateToken.js");

// route
router.get("/characters", validateToken, async (req, res) => {
  try {
    const { name, age, idMovie } = req.query;
    if (name || age || idMovie) {
      let characters = await Characters.findAll({
        where: {
          name: name ? { [Op.iLike]: "%" + name + "%" } : { [Op.iLike]: "%" },
        },
        include: {
          model: Movies,
          attributes: ["id", "title", "image", "rating", "created"],
        },
      });
      characters = age
        ? characters.filter((c) => c.age === parseInt(age))
        : characters;
      characters = idMovie
        ? characters.map((c) => {
            return {
              name: c.name,
              age: c.age,
              story: c.story,
              id: c.id,
              image: c.image,
              weight: c.weight,
              movies: c.movies.filter((cc) => cc.id === parseInt(idMovie)),
            };
          })
        : characters;
      characters.length
        ? res.status(200).json(characters)
        : res.status(404).send("Not founded.");
    } else {
      const characters = await Characters.findAll();
      characters.length
        ? res.status(200).json(characters)
        : res.status(404).send("There are not characters yet.");
    }
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});
// CRUD
// CREATE
router.post("/characters/create", validateToken, async (req, res) => {
  try {
    const {
      image, // character property
      name, // character property
      age, // character property
      weight, // character property
      story, // character property
      movies, // object to create associate movies
      /*
      movies:[{
        image: ,
        title: ,
        create: ,
        rating: ,
      },{
        image: ,
        title: ,
        create: ,
        rating: ,
      }]
      */
      genresByMovie, //object of genres by movie
      /*
      genresByMovie:{
        movie1 : [{name: ,image: ,},{name: ,image: ,}],
        movie2: [{name: ,image: ,},{name: ,image: ,}]
      }
      */
    } = req.body;
    // new entrie in character table
    const newCharacter = await Characters.create({
      image,
      name,
      age,
      weight,
      story,
    });
    // adding movies and their genres
    movies.forEach(async (m) => {
      let genresToMovie = [];
      genresByMovie[m.title].forEach(async function (g) {
        let [gm, create] = await Genres.findOrCreate({
          where: { name: g.name },
          defaults: { image: g.image },
        });
        genresToMovie.push(gm);
      });
      let [newMovie, create] = await Movies.findOrCreate({
        where: { title: m.title },
        defaults: {
          image: m.image,
          create: m.create,
          rating: m.rating,
        },
      });
      newMovie.addGenres(genresToMovie);
      newCharacter.addMovies(newMovie);
    });
    res.status(200).send("Succesful");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});
// EDIT
router.put("/characters/edit/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image, // character property
      name, // character property
      age, // character property
      weight, // character property
      story, // character property
    } = req.body;
    await Characters.update(
      { image, name, age, weight, story },
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
router.delete("/characters/delete/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Characters.destroy({
      where: {
        id,
      },
    });
    res.status(200).send("Succesful.");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});

//DETAIL

router.get("/character/:id", validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const character = await Characters.findOne({
      where: { id },
      include: {
        model: Movies,
        attributes: ["id", "title", "image", "rating", "created"],
      },
    });
    character
      ? res.status(200).json(character)
      : res.status(404).send("Character not founded.");
  } catch {
    res.status(400).send("Something went wrong! :(");
  }
});

module.exports = router;
