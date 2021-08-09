const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { getComment } = require("../controller/comment");
const { getMyclass } = require("../controller/myclass");
const { getPost } = require("../controller/post");
const { getAllUser } = require("../controller/user");
const { getWorkSpace } = require("../controller/workspace");

// Home Page
router.get("/", forwardAuthenticated, (req, res) => res.render("index"));

// Dashboard
router.get(
  "/dashboard/",
  ensureAuthenticated,
  getWorkSpace,
  getAllUser,
  (req, res) => {
    res.render("dashboard", {
      role: req.user.role,
      name: req.user.username,
      students: res.locals.students,
      workspace: res.locals.workspace,
    });
  }
);

// Myclass
router.get(
  "/myclass",
  ensureAuthenticated,
  getWorkSpace,
  getMyclass,
  getPost,
  //getComment,
  (req, res) => {
    const { classid } = req.query;

    if (res.locals.workspace.length === 0) {
      res.redirect("/dashboard");
    } else {
      res.render("myclass", {
        name: req.user.username,
        role: req.user.role,
        myclass: res.locals.myclass,
        post: res.locals.post,
        classid,
        // comment: res.locals.comment,
      });
    }
  }
);

module.exports = router;
