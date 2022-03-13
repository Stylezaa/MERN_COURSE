const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// http://localhost:3000/api/v1/products
router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-passwordHash");
  //.select("-passwordHash") for delete this field from my schema api

  if (!userList) {
    res.status(500).json({ success: false });
  }

  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("name phone email"); //params is parameter in url

  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }

  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10), // Encrypt Password
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  user = await user.save();

  if (!user) {
    res.status(500).send("the category cannot be created!");
  }

  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;

  if (!user) {
    return res.status(400).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );

    return res.status(200).send({ user: user.email, token: token });
  } else {
    return res.status(400).send("password is wrong!");
  }
});

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments(); //countDocuments for get count

  if (!userCount) {
    res.status(500).json({ success: false });
  }

  res.send({
    userCount: userCount, //return productCount number
  });
});

router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id) //params is parameter in url
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "the user is deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
