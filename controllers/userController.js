const User = require('../models/users');

const addUser = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? req.file.filename : 'user_unknown.png'
    });

    await user.save();

    req.session.message = {
      type: 'success',
      message: 'User added successfully'
    };
  } catch (error) {
    req.session.message = {
      type: 'danger',
      message: error.message
    };
  }

  res.redirect('/');
};

module.exports = { addUser };