async function checkIsAdmin(req, res, next) {
  try {
    const isAdmin = req.user.role == "admin" ? true : false;
    if (isAdmin === false) {
      return res
        .status(400)
        .json({ message: "Only admin can access this route" });
    }
    next();
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
}
module.exports = { checkIsAdmin };
