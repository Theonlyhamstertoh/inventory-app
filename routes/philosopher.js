const express = require("express");
const router = express.Router();

const philosopherController = require("../controllers/controller.philosopher");
router.get("/create", philosopherController.get_create_philosopher);
router.post("/create", philosopherController.create_philosopher);
router.delete("/:slug/delete", philosopherController.delete_philosopher);
router.get("/:slug/update", philosopherController.get_update_philosopher);
router.post("/:slug/update", philosopherController.update_philosopher);
router.get("/:slug", philosopherController.get_philosopher);

module.exports = router;
