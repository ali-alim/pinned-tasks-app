const router = require("express").Router();
const Comment = require("../models/Comment");
const Topic = require("../models/Topic");

router.post("/", async (req, res) => {
  const { content, topicId} = req.body;
  const comment = new Comment({ content, topic: topicId});
  try {
    comment.save((err, comment) => {
      if (err) {
        console.error(err);
      } else {
        // Add the comment to the related topic
        Topic.findById(topicId, (err, topic) => {
          if (err) {
            console.error(err);
          } else {
            topic.comments.push(comment);
            topic.save();
          }
        });
      }})
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

//get all topics
router.get("/", async (req, res) => {
  const loggedUser = req.query.user;
  try {
    await Comment.find({ user: loggedUser }, (err, topics) => {
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
    const singleComment = await Comment.findById(req.params.id);
    res.json(singleComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(400);
    throw new Error("Comment not found!");
  }
  await comment.remove();
  res.status(200).json({ id: req.params.id });
});

module.exports = router;
