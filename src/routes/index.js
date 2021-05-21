const express = require("express");
const router = express.Router();

const { uploadFile } = require("../middlewares/upload");

const {
  getEvents,
  createEvent,
  getOneEvent,
  deleteEvent,
} = require("../controllers/event");

router.get("/", getEvents);
router.get("/:id", getOneEvent);
router.delete("/:id", deleteEvent);
router.post("/", uploadFile("image", "videoFile"), createEvent);

module.exports = router;
