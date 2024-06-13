var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController')
router.get('/', function(req, res, next) {
  res.json({
    test: "Hello"
  });
});
// Routes for Users
router.get('/users', usersController.getAllUsers)
router.post('/users', usersController.createUser)
router.post('/users/login', usersController.loginUser)
router.get('/users/:userId', usersController.getSingleUser)
router.put('/users/:userId', usersController.updateUser)
router.delete('/users/:userId', usersController.deleteUser)
// Routes for Posts

// Routes for Comments

// Routes that end in error
router.get('/error', (req, res, next) => {
  res.json({
    error: "Invalid User input"
  })
})
module.exports = router;