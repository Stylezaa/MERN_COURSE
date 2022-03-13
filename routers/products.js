const { Product } = require("../models/product");
// const { Category } = require("../models/category");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();
const mongoose = require("mongoose");

// http://localhost:3000/api/v1/products
router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate("category");
  // const productList = await Product.find().select("name price -_id"); //specific for choose to display

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category"); //params is parameter in url
  //the populate for show other schema (table) in own schema

  if (!product) {
    res
      .status(500)
      .json({ message: "The product with the given ID was not found." });
  }

  res.status(200).send(product);
});

router.post(`/`, async (req, res) => {
  // validate and check category are exits ?
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  product = await product.save();

  if (!product) {
    return res.status(500).send("The product cannot be created");
  }

  res.send(product);
});

router.put("/:id", async (req, res) => {
  //check valid product id format for fix backend hang error
  if (!mongoose.isValidObjectId(req.params.id)) {
    //params is parameter in url
    return res.status(400).send("Invalid Product ID");
  }

  // validate and check category are exits ?
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    {
      new: true, // for return last data update of category
    }
  );

  if (!product) {
    return res.status(400).send("the product cannot be created!");
  }

  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id) //params is parameter in url
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments(); //countDocuments for get count

  if (!productCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    productCount: productCount, //return productCount number
  });
});

//get featured = true for this api
router.get(`/get/featured`, async (req, res) => {
  const product = await Product.find({ isFeatured: true });

  if (!product) {
    res.status(500).json({ success: false });
  }

  res.send(product);
});

//get request number by count parameter
router.get(`/get/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0; //get count from frontend input (//params is parameter in url)
  const product = await Product.find().limit(count); //show limit count control

  if (!product) {
    res.status(500).json({ success: false });
  }

  res.send(product);
});

//Query parameter (Filter Category)
router.get(`/`, async (req, res) => {
  //localhost:3000/api/v1/products?categories=22343545,4525235
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

module.exports = router;
