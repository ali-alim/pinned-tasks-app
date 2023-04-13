const router = require("express").Router();
const Topic = require("../models/Topic");

router.post("/", async (req, res) => {
  const { name, user} = req.body;
  const newTopic = new Topic({ name, createdBy: user});
  try {
    const savedTopic = await newTopic.save();
    res.status(200).json(savedTopic);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedTopic);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//get all topics
router.get("/", async (req, res) => {
  const loggedUser = req.query.user;
  try {
    await Topic.find({ createdBy: loggedUser }, (err, topics) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(topics);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleTopic = await Topic.findById(req.params.id);
    res.json(singleTopic);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const topic = await Topic.findById(req.params.id);
  if (!topic) {
    res.status(400);
    throw new Error("Topic not found!");
  }
  await topic.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = router;
