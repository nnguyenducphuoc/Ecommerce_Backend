const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../models/product.model.js");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(); // exec => dai dien cho cum tu de biet ta su dung async await trong mongoose
};

module.exports = {
  findAllDraftsForShop,
};
