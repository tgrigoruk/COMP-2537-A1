const express = require("express");
const app = express();
app.use(express.static("./public"));
app.set("view engine", "ejs");

const https = require("https");

app.listen(5001, function (err) {
  if (err) console.log(err);
});

// https://pokeapi.co/

app.get("/", function (req, res) {
  res.send("<h1>GET request to homepage</h1>");
});

app.get("/profile/:id", function (req, res) {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  data = "";
  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      data += chunk;
    });
    https_res.on("end", function () {
      res.render("profile.ejs", extractPokemonData(data));
    });
  });
});

function extractPokemonData(data) {
  data = JSON.parse(data);
  stats = Object.assign(
    {},
    ...data.stats.map((stat) => ({
      [stat.stat.name]: stat.base_stat,
    }))
  );
  pokemonData = {
    name: data.name,
    img: data.sprites.other["official-artwork"].front_default,
    base_xp: data.base_experience,
    stats: stats,
  };
  console.log(pokemonData);
  return pokemonData;
}
