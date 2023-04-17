const router = require("express").Router();
const Archive = require("../models/Archive");

router.post("/", async (req, res) => {
  const { name, user, inputs } = req.body;
  const newArchive = new Archive({ name, createdBy: user });
  newArchive.inputs.push({ content: inputs });
  try {
    const savedArchive = await newArchive.save();
    res.status(200).json(savedArchive);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/:id", async (req, res) => {
  console.log("req.params",req.params)
  try {
    const updatedArchive = await Archive.updateOne(
      { _id: req.params.id },
      { $push: { inputs: { content: req.body.inputs } } }
    );

    res.json(updatedArchive);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
  // try {
  //   const updatedArchive = await Archive.findByIdAndUpdate(req.params.id,
  //     req.body, {
  //     new: true,
  //     runValidators: true,
  //   });
  //   res.json(updatedArchive);
  // } catch (err) {
  //   console.error(err);
  //   res.status(500).send('Server Error');
  // }
});

//get all topics
router.get("/", async (req, res) => {
  const loggedUser = req.query.user;
  try {
    await Archive.find({ createdBy: loggedUser }, (err, archives) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(archives);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const singleArchive = await Archive.findById(req.params.id);
    res.json(singleArchive);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const archive = await Archive.findById(req.params.id);
  if (!archive) {
    res.status(400);
    throw new Error("Archive not found!");
  }
  await archive.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = router;
