const Userdata = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getAllUser = async (req, res, next) => {
  const result = await Userdata.findAll();

  if (result.length > 0) {
    const { user } = res.locals;

    if (user.role === "teacher") {
      const filterdata = result.filter(
        (item) => item.dataValues.role === "student"
      );
      let array = [];
      filterdata.map((item) => {
        array.push(item.dataValues);
      });
      res.locals.students = array;
    }
  }
  next();
};

//REGISTER
exports.register = async (req, res) => {
  const { username, email, pass, password2, role } = req.body;
  let errors = [];

  if (!username || !email || !pass || !password2 || !role) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (pass != password2) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (pass.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      username,
      email,
      pass,
      password2,
    });
  }
  const password = await bcrypt.hash(pass, 10);
  try {
    const alreadyExistsUser = await Userdata.findOne({ where: { email } });
    if (alreadyExistsUser) {
      req.flash("success_msg", "Email already exist");
      res.redirect("/register");
    } else {
      const newUser = new Userdata({ username, email, password, role });
      const savedUser = await newUser.save();
      if (savedUser) {
        req.flash("success_msg", "Registered successfully");
        res.redirect("/login");
      } else {
        throw "Cannot register user at the moment!";
      }
    }
  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
};
