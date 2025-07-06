const express = require("express");
const router = express.Router();
const {
  getVideoInfo,
  downloadVideo,
} = require("../controllers/downloader.controller");

router.post("/info", getVideoInfo);
router.post("/download", downloadVideo);

module.exports = router;
