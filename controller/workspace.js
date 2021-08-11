const Workspace = require("../models/Workspace");
const Post = require("../models/Post");
const Userdata = require("../models/User");
const Comment = require("../models/Comment");

//GET WORK SPACE
exports.getWorkSpace = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const workspace = await Workspace.findAll();

    if (user.role === "teacher") {
      const filterdata = workspace.filter(
        (item) => item.dataValues.teacherid === user.id
      );

      // let array = [];
      // filterdata.map((item) => {
      //   array.push(item.dataValues);
      // });

      // Better - don't return the array
      // let array = [];
      // filterdata.forEach((item) => {
      //   array.push(item.dataValues);
      // });

      // Best - use the returned array
      const workspaces = filterdata.map(item => {
        return item.dataValues
      })

      const postPromises = workspaces.map(workspace => {
        return Post.findAll({
          where: {
            workspaceid: workspace.id
          }
        })
      })

      const postResults = await Promise.all(postPromises)
      console.log('results test:', postResults)

      const commentPromises = postResults.map(result => {
        const promises = result.map(post => {
          return Comment.findAll({
            where: { postid: post.id }
          })
        })

        return Promise.all(promises)
      })

      const commentResults = await Promise
        .all(commentPromises)
      console.log('commentResults test:', commentResults)

      const counted = workspaces.map((workspace, index) => {
        const postResult = postResults[index]

        const postsCount = postResult.length

        const commentResult = commentResults[index]
        const commentsCount = commentResult.reduce(
          (total, postComments) => {
            return total + postComments.length
          },
          0
        )

        return {
          ...workspace,
          postsCount,
          commentsCount
        }
      })

      // console.log('counted test:', counted)

      res.locals.workspace = counted;
    }

    if (user.role === "student") {
      const filterdata = workspace.filter(
        (item) => item.dataValues.studentid === user.id
      );
      let array = [];
      filterdata.map((item) => {
        array.push(item.dataValues);
      });
      res.locals.workspace = array;
    }
  } catch (err) {
    req.flash("error_msg", err);
    console.log(err);
  }
  next();
};

//CREATE WORK SPACE
exports.createWorkSpace = async (req, res) => {
  try {
    const { user } = res.locals;
    teacherid = user.id;
    const { title, description, studentid } = req.body;

    const student = await Userdata.findByPk(studentid);
    let studentname = student.dataValues.username;

    const teacher = await Userdata.findByPk(teacherid);
    let teachername = teacher.dataValues.username;

    const newWorkspace = new Workspace({
      title,
      description,
      studentname,
      studentid,
      teacherid,
      teachername,
    });
    const savednewWorkspace = await newWorkspace.save();
    if (savednewWorkspace) {
      req.flash("success_msg", "created successfully");
      res.redirect("/dashboard");
    } else {
      throw "Cannot create at the moment!";
    }
  } catch (err) {
    req.flash("success_msg", err);
    console.log(err);
    res.redirect("/dashboard");
  }
};

//DELETE WORK SPACE BY ID
exports.deleteWorkSpace = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Workspace.findByPk(id);
    const resultToDelete = await result.destroy(id);
    if (resultToDelete) {
      req.flash("success_msg", "Deleted successfully");
      res.redirect("/dashboard");
    } else {
      throw "something went wrong";
    }
  } catch (err) {
    req.flash("success_msg", err);
    console.log(err);
    res.redirect("/dashboard");
  }
};
