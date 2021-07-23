const async = require("async");
const Category = require("../models/model.category");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "../uploads" });
const { convertImageToBase } = require("../reusable");
const Philosopher = require("../models/model.philosopher");
const categoryController = {
  get_all: (req, res) => {
    async.parallel(
      {
        categories: function (callback) {
          Category.find().sort({ slug: "ascending" }).exec(callback);
        },
      },
      function (err, results) {
        if (err) return res.status(404).json({ error: err });
        res.render("index", { categories: results.categories });
      }
    );
  },

  get_one: async (req, res) => {
    const slug = req.params.slug;

    try {
      const category = await Category.findOne({ slug }).exec();
      const philosophers = await Philosopher.find({ "category.id": category._id }).exec();
      res.render("category/category.details.ejs", { category, philosophers });
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },

  get_create_category: (req, res) => {
    return res.render("category/category.form.ejs");
  },

  create_category: [
    upload.single("image"),
    body("name").trim().isLength({ min: 2 }).withMessage("name must be longer than 2 letters"),
    body("timeline").trim(),
    body("description").not().isEmpty().withMessage("description must not be empty. "),
    // upload.single("image"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(errors.array());
      } else {
        const { name, description, timeline } = req.body;
        const category = new Category({
          name,
          description,
          timeline,
          image: convertImageToBase(req),
        });
        category.save().then((result) => res.redirect("/category"));
      }
    },
  ],
  delete_category: (req, res) => {
    const slug = req.params.slug;

    Category.findOneAndDelete({ slug }).then(() => res.json({ redirect: "/category" }));
  },

  get_update_category: (req, res) => {
    const slug = req.params.slug;
    Category.findOne({ slug })
      .exec()
      .then((data) => {
        res.render("category/category.updateForm.ejs", { data });
      })
      .catch((err) => res.status(404).json({ error: err }));
  },

  update_category: [
    upload.single("image"),
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be longer than 2 letters"),
    body("timeline").trim(),
    body("description").not().isEmpty().withMessage("description must not be empty. "),
    (req, res) => {
      const slug = req.params.slug;
      Category.findOneAndUpdate(
        { slug },
        {
          name: req.body.name,
          description: req.body.description,
          timeline: req.body.timeline,
          image: convertImageToBase(req),
        }
      )
        .then((result) => res.redirect("/category/" + slug))
        .catch((err) => res.json({ message: err }));
    },
  ],
};

module.exports = categoryController;
