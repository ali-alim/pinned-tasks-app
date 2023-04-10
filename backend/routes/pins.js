const router = require("express").Router();
const Pin = require("../models/Pin");

//create a pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedPin = await Pin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedPin);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//get all pins
router.get("/", async (req, res) => {
  const loggedUser = req.query.user;
  try {
    await Pin.find({ user: loggedUser }, (err, pins) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(pins);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one pin
router.get('/:id', async (req, res) => {
  try {
    const singlePin = await Pin.findById(req.params.id);
    res.json(singlePin);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete one pin
router.delete("/:id", async (req, res) => {
  const pin = await Pin.findById(req.params.id);
  if (!pin) {
    res.status(400);
    throw new Error("Pin not found!");
  }
  await pin.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = router;
