var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController')
const postsController = require('../controllers/postsController')
const commentsController = require('../controllers/commentsController')
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
router.get('/posts', postsController.getAllPosts)
router.post('/posts', postsController.createPost)
router.get('/posts/:postId', postsController.getSinglePost)
router.put('/posts/:postId', postsController.updatePost)
router.delete('/posts/:postId', postsController.deletePost)
// Routes for Comments
router.get('/comments', commentsController.getAllComments)
router.post('/comments', commentsController.createComment)
router.put('/comments/:commentId', commentsController.updateComment)
router.delete('/comments/:commentId', commentsController.deleteComment)
// Routes that end in error
router.get('/error', (req, res, next) => {
  res.json({
    error: "Invalid User input"
  })
})
module.exports = router;