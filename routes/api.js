const express = require("express");
const { createComment, getComment } = require("../controller/comment");
const { createPost, getPost } = require("../controller/post");
const { deleteWorkSpace, createWorkSpace } = require("../controller/workspace");
const router = express.Router();

router.post("/createworkspace", createWorkSpace);
router.get("/deleteWorkSpace/:id", deleteWorkSpace);

router.post("/createPost/:classid/:studentid/:teacherid/:workspaceid", createPost);
router.get("/getPost", getPost);

router.post("/createComment/:id/:teacherid/:studentid/:postid", createComment);
router.get("/getComment", getComment);

module.exports = router;
