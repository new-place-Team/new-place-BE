const { pool } = require('../models/index');
const {
  searchMainQuery,
  likeQuery,
  mdQuery,
  weatherQuery,
} = require('../query/main');
const { getUserVisitedQuery, getUserFavoriteQuery } = require('../query/index');
const customizedError = require('./error');

const searchMain = async (req, res, next) => {
  let weatherResult;
  let user = 0;
  const connection = await pool.getConnection(async (conn) => conn);

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].postImages = result[0][i].postImages.split('&&').slice(1)[0];
    }
    return resultImg;
  };

  if (req.user) {
    user = req.user;
  }

  try {
    weatherResult = await connection.query(weatherQuery);
    const weatherInfo = weatherResult[0]; //날씨 조회
    const weatherCondition = weatherInfo[0].weather_status; //날씨 상태 ID
    const weatherTemp = weatherInfo[0].weather_temp; //현재 온도
    const weatherDiff = weatherInfo[0].temp_diff; // 어제와 오늘 온도의 차이
    const weatherFe = weatherInfo[0].weather_status_fe;
    const result = await connection.query(
      searchMainQuery(weatherCondition, user)
    ); //날씨
    const likeResult = await connection.query(likeQuery(user)); //좋아요
    const mdResult = await connection.query(mdQuery(user)); // 관리자 추천
    const adjResult = adjImg(result);
    const adjLike = adjImg(likeResult);
    const adjMd = adjImg(mdResult);

    return res.status(200).json({
      weather: {
        status: weatherCondition,
        temperature: weatherTemp,
        diff: weatherDiff,
        frontWeather: weatherFe,
      },
      weatherPlace: adjResult,
      likePlace: adjLike,
      pickPlace: adjMd,
    });
  } catch (err) {
    return next(customizedError(err, 400));
  } finally {
    await connection.release();
  }
};

/* 가본 리스트 조회  */
const getVisitedPosts = async (req, res, next) => {
  const userId = req.user;

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].postImage = result[0][i].postImage.split('&&').slice(1)[0];
    }
    return resultImg;
  };
  try {
    const result = await pool.query(getUserVisitedQuery(userId));
    const visitedPosts = adjImg(result);
    return res.status(200).json({
      visitedPosts,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  }
};

const getFavoritesPosts = async (req, res, next) => {
  const userId = req.user;

  const adjImg = (result) => {
    let resultImg = result[0];
    for (let i = 0; i < resultImg.length; i++) {
      resultImg[i].postImage = result[0][i].postImage.split('&&').slice(1)[0];
    }
    return resultImg;
  };

  try {
    const result = await pool.query(getUserFavoriteQuery(userId));
    const favoritePosts = adjImg(result);
    return res.status(200).json({
      favoritePosts,
    });
  } catch (err) {
    return next(customizedError(err, 500));
  }
};

module.exports = {
  searchMain,
  getVisitedPosts,
  getFavoritesPosts,
};
