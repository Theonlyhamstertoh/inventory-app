const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/controller.category");

router.get("/", categoryController.get_all);
router.get("/:slug/update", categoryController.get_update_category);
router.post("/:slug/update", categoryController.update_category);
router.delete("/:slug/delete", categoryController.delete_category);
router.get("/create", categoryController.get_create_category);
router.post("/create", categoryController.create_category);
router.get("/:slug", categoryController.get_one);

module.exports = router;
