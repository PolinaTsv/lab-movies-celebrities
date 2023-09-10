const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model.js");

router.get("/celebrities", (req, res, next) => {
  Celebrity.find()
    .then((allCelebrities) => {
      res.render("celebrities/celebrities.hbs", { allCelebrities });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/celebrities/create", (req, res, next) => {
  res.render("celebrities/new-celebrity.hbs");
});

router.post("/celebrities/create", (req, res, next) => {
  const { name, occupation, catchPhrase } = req.body;
  Celebrity.create({ name, occupation, catchPhrase })
    .then(() => {
      console.log("Celebrity created successfully");
      res.render("celebrities/celebrities.hbs");
    })
    .catch((err) => {
      console.error("Error creating celebrity:", err);
      res.redirect("celebrities/new-celebrity.hbs");
      next(err);
    });
});

router.get("/celebrities/:celebrityID/edit", (req, res, next) => {
  const { celebrityID } = req.params;
  Celebrity.findById(celebrityID)
    .then((celebrityToEdit) => {
      console.log(celebrityToEdit);
      res.render("celebrities/edit-celebrity.hbs", { celebrityToEdit });
    })
    .catch((error) => next(error));
});

router.post("/celebrities/:celebrityID/edit", async (req, res, nest) => {
  try {
    const { celebrityID } = req.params;
    const { name, occupation, catchPhrase } = req.body;
    await Celebrity.findByIdAndUpdate(
      celebrityID,
      { name, occupation, catchPhrase },
      { new: true }
    );
    res.redirect("/celebrities");
  } catch (err) {
    console.log(err);
    res.redirect("celebrities/:celebrityID/edit");
  }
});

router.post("/celebrities/:celebrityID/delete", async (req, res, next) => {
  try {
    const { celebrityID } = req.params;
    await Celebrity.findByIdAndDelete(celebrityID);
    res.redirect("/celebrities");
  } catch (error) {
    console.error(error);
    res.redirect("celebrities/celebrities.hbs");
  }
});

module.exports = router;
