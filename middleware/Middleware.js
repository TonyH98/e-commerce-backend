const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%#*?&])[0-9a-zA-Z@$!%*?&]{8,}$/;

const validator = require('email-validator')


function checkPassword(req, res, next) {
  const { password } = req.body;
  if (!password.match(passwordRequirements)) {
    return res.status(400).json({ message: 'Password does not meet requirements' });
  }
  next();
}


function checkEmail(req , res , next){
  const email = req.body.email;

  if(!validator.validate(email)){
    return res.status(400).json({ error: 'Invalid email address' });
  }
  next()
}


function checkPhoneNumber(req, res, next) {

  const phoneNumber = req.body.phonenumber

  const phoneNumberRegex = /^\(\d{3}\)\d{3}-\d{4}$/;


  if (!phoneNumberRegex.test(phoneNumber)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }


  next();
}



module.exports = {checkPassword, checkEmail, checkPhoneNumber}