const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helper/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

const router = express.Router();

// authen v2
router.use(authenticationV2);
//
router.post("", asyncHandler(productController.createProduct));

module.exports = router;
