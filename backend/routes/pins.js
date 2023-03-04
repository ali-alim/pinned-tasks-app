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

const createTickets = async (req, res) => {
  const ticket = req.body;
  const newticket = new Tickets(ticket);
  try{ newticket.save(); } 
  catch(err){console.log(err)}

  await res.json(ticket);
};

const updateTicket = async(req,res) => {
  const progress = req.body.progress;
  const status = req.body.status;
  const id = req.params.id;
  try{
    Tickets.findById(id, (err, updatedTicket) => {
      updatedTicket.progress = progress;
      updatedTicket.status = status;
      updatedTicket.save();
      res.send("successfully updated")
    });
  } catch(err) {
    console.log(err)
  }
}

//update a pin
router.put("/:id", async (req, res) => {
  const desc = req.body.desc;
  const title = req.body.title;
  const id = req.params.id;

  try {
    Pin.findById(id, (err, foundPin) => {
      foundPin.desc = desc;
      foundPin.title = title;
      foundPin.save();
      res.send("Successfully Updated")
    })
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});
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
