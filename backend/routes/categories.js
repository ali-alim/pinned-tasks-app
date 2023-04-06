const router = require("express").Router();
const Category = require("../models/Category");

//create a pin
router.post("/", async (req, res) => {
  const newCategory = new Category(req.body);
  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update the pin
router.put("/:id", async (req, res) => {
  const name = req.body.name;
  const id = req.params.id;

  try {
    Pin.findById(id, (err, foundCategory) => {
      foundCategory.name = name;
      foundCategory.save();
      res.send(foundCategory);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.delete("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(400);
    throw new Error("Pin not found!");
  }
  await category.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = router;
