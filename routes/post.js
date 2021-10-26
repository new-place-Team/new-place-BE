const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewRouter = require('./review');
const likeRouter = require('./like');
const { addVisitedList } = require('../controllers/post');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.use('/:postId/reviews', reviewRouter);
router.use('/:postId/likes', likeRouter);

/* 가본 장소 리스트에 추가 */
router.post('/:postId/visited', addVisitedList);

module.exports = router;
