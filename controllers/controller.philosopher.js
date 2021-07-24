const multer = require("multer");
const { body } = require("express-validator");
const upload = multer({ dest: "../app/files" });
const { convertImageToBase } = require("../reusable");
const Philosopher = require("../models/model.philosopher");
const mongoose = require("mongoose");
const Category = require("../models/model.category");
const philosopher = {
  get_philosopher: async (req, res) => {
    try {
      const philosopher = await Philosopher.findOne({ slug: req.params.slug });
      res.render("philosopher/philosopher.details.ejs", { philosopher });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  get_create_philosopher: (req, res) => {
    res.render("philosopher/philosopher.form.ejs", { url: req.originalUrl });
  },
  create_philosopher: [
    upload.single("image"),
    body("first_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("name must be longer than 2 letters"),

    body("last_name").trim(),
    body("bio").not().isEmpty().withMessage("description must not be empty. "),
    body("first_quote").trim(),
    body("second_quote").trim(),
    body("third_quote").trim(),
    async (req, res, next) => {
      try {
        const { first_name, last_name, bio, first_quote, second_quote, third_quote } = req.body;
        const category = await Category.findOne({ slug: req.query.slug }).select("_id");
        console.log(category);
        const philosopher = new Philosopher({
          first_name,
          last_name,
          bio,
          quotes: [first_quote, second_quote, third_quote],
          category: {
            name: req.query.slug,
            id: mongoose.Types.ObjectId(category.id),
          },
          image: convertImageToBase(req),
        });

        await philosopher.save();
        res.redirect("/category/" + req.query.slug);
      } catch (err) {
        res.status(400).json({ error: err });
      }
    },
  ],
  delete_philosopher: async (req, res) => {
    try {
      const removedPhilosopher = await Philosopher.findOneAndDelete({ slug: req.params.slug });
      const categoryItBelongsTo = removedPhilosopher.category.name;
      return res.json({ redirect: `/category/${categoryItBelongsTo}` });
    } catch (err) {
      res.status(400).json({ error: err });
    }
  },
  get_update_philosopher: async (req, res) => {
    try {
      const philosopher = await Philosopher.findOne({ slug: req.params.slug });
      res.render("philosopher/philosopher.updateForm.ejs", {
        philosopher,
        url: req.originalUrl,
      });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  update_philosopher: [
    upload.single("image"),
    body("first_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("name must be longer than 2 letters"),

    body("last_name").trim(),
    body("bio").not().isEmpty().withMessage("description must not be empty. "),
    body("first_quote").trim(),
    body("second_quote").trim(),
    body("third_quote").trim(),
    async (req, res, next) => {
      try {
        const { first_name, last_name, bio, first_quote, second_quote, third_quote } = req.body;
        const slug = req.params.slug;

        await Philosopher.findOneAndUpdate(
          { slug },
          {
            first_name,
            last_name,
            bio,
            first_quote,
            second_quote,
            third_quote,
            image: convertImageToBase(req),
          }
        );
        res.redirect("/philosopher/" + req.params.slug);
      } catch (err) {
        res.status(400).json({ error: err });
      }
    },
  ],
};
module.exports = philosopher;
