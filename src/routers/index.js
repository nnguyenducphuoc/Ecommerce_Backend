const express = require("express");
const { model } = require("mongoose");
const router = express.Router();

router.get("", (req, res, next) => {
  return res.status(200).json({
    message: "Hello, this is API",
  });
});

module.exports = router;
