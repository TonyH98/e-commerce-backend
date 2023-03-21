const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[0-9a-zA-Z@$!%*?&]{8,}$/;

function checkPassword(req, res, next) {
  const { password } = req.body;
  if (!password.match(passwordRequirements)) {
    return res.status(400).json({ message: 'Password does not meet requirements' });
  }
  next();
}

module.exports = {checkPassword}