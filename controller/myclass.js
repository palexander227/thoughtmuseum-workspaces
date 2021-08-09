const Workspace = require("../models/Workspace");

//GET MY CLASS BY ID
exports.getMyclass = async (req, res, next) => {
  const { classid } = req.query;
  try {
    const result = await Workspace.findByPk(classid);
    if (result) {
      res.locals.myclass = result.dataValues;
    }
  } catch (err) {
    res.redirect("/dashboard");
    console.log(err);
  }
  next();
};
