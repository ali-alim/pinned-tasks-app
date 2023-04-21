const router = require("express").Router();
const Comment = require("../models/Comment");
const Topic = require("../models/Topic");

router.post("/", async (req, res) => {
  const { content, completed, user, topicId } = req.body;
  const comment = new Comment({ content, user, completed, topic: topicId });
  try {
    const savedComment = await comment.save();
    if (savedComment) {
      Topic.findById(topicId, (err, topic) => {
        if (err) {
          console.error(err);
        } else {
          topic.comments.push(comment);
          topic.save();
        }
      });
    }
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

//get all topics
router.get("/", async (req, res) => {
  const loggedUser = req.query.user;
  try {
    await Comment.find({ user: loggedUser }, (err, comments) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(comments);
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
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
