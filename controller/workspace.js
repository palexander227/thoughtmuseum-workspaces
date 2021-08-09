const Workspace = require("../models/Workspace");
const Userdata = require("../models/user");

//GET WORK SPACE
exports.getWorkSpace = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const workspace = await Workspace.findAll();

    if (user.role === "teacher") {
      const filterdata = workspace.filter(
        (item) => item.dataValues.teacherid === user.id
      );
      let array = [];
      filterdata.map((item) => {
        array.push(item.dataValues);
      });
      res.locals.workspace = array;
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
