const searchMainQuery = (weatherCondition, user, lang) => {
  return `
      SELECT DISTINCT
      a.post_id AS postId, 
      a.title,
      a.title_en AS titleEn,
      a.address,
      a.address_short_en AS addressShortEn,
      a.address_short AS addressShort, 
      a.contact_number AS contactNumber, 
      a.category_id AS category, 
      a.post_images AS postImage,
      a.post_desc AS PostDesc,
      a.post_loc_x AS postLocationX, 
      a.post_loc_y AS postLocationY, 
      a.favorite_cnt AS favoriteCnt, 
      a.weather_id AS weatherId, 
      a.inside_yn AS insideYN, 
      a.gender_id AS genderId, 
      a.member_id AS MemberId, 
      CASE 
        WHEN b.user_Id = ${user} THEN true 
        ELSE false 
        END as 'favoriteState'
    FROM Posts a
    LEFT JOIN
    (
      SELECT post_id, user_id
        FROM Favorites
        where user_id = ${user}
    ) b ON a.post_id = b.post_id
    LEFT JOIN VisitedPosts
    ON a.post_id = VisitedPosts.post_id
    WHERE weather_id IN(${weatherCondition}, 7)
      AND a.post_id NOT IN(
        SELECT post_id
        FROM(
          SELECT post_id
          FROM Posts
          ORDER BY favorite_cnt DESC limit 9
        ) as tempPosts 
      )
      AND a.post_id NOT IN (
        SELECT post_id
          FROM VisitedPosts
          WHERE VisitedPosts.user_id = ${user}
        )
      ORDER BY rand() limit 9
      `;
};

const likeQuery = (user, lang) => {
  return `
      SELECT DISTINCT
      a.post_id AS postId, 
      a.title,
      a.title_en AS titleEn, 
      a.address,
      a.address_short_en AS addressShortEn,
      a.address_short AS addressShort, 
      a.contact_number AS contactNumber, 
      a.category_id AS category, 
      a.post_images AS postImage,
      a.post_desc AS PostDesc,
      a.post_loc_x AS postLocationX, 
      a.post_loc_y AS postLocationY, 
      a.favorite_cnt AS favoriteCnt, 
      a.weather_id AS weatherId, 
      a.inside_yn AS insideYN, 
      a.gender_id AS genderId, 
      a.member_id AS MemberId, 
      CASE 
        WHEN b.user_Id = ${user} THEN true 
        ELSE false 
        END as 'favoriteState'
    FROM Posts a
    LEFT JOIN
    (
      SELECT post_id, user_id
        FROM Favorites
        where user_id = ${user}
    ) b ON a.post_id = b.post_id
    WHERE a.post_id NOT IN (
      SELECT post_id
        FROM VisitedPosts
        WHERE VisitedPosts.user_id = ${user}
        )
    ORDER BY favorite_cnt DESC limit 9
    `;
};

const mdQuery = (user, lang) => {
  return `
      SELECT DISTINCT
      a.post_id AS postId, 
      a.title,
      a.title_en AS titleEn, 
      a.address,
      a.address_short_en AS addressShortEn, 
      a.address_short AS addressShort, 
      a.contact_number AS contactNumber, 
      a.category_id AS category, 
      a.post_images AS postImage,
      a.post_desc AS PostDesc,
      a.post_loc_x AS postLocationX, 
      a.post_loc_y AS postLocationY, 
      a.favorite_cnt AS favoriteCnt, 
      a.weather_id AS weatherId, 
      a.inside_yn AS insideYN, 
      a.gender_id AS genderId, 
      a.member_id AS MemberId, 
        CASE 
          WHEN b.user_id = ${user} THEN true 
          ELSE false 
          END as 'favoriteState' 
    FROM Posts a
    LEFT JOIN
    (
      SELECT post_id, user_id
        FROM Favorites
        where user_id = ${user}
    ) b ON a.post_id = b.post_id
    WHERE a.md_pick = 1
    `;
};

const weatherQuery = `
SELECT *
FROM CurrentWeather
WHERE cur_weather_id = 0
`; //데이터베이스에 저장된 날씨 가져오기

const queryOfGettingMainMap = (userId, x, y, lang) => {
  if (lang === 'ko' || lang === undefined) {
    return `
    SELECT 
			Posts.post_id AS postId, 
			title, 
			address_short AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
				CASE WHEN b.user_id = ${userId} THEN 1 
				ELSE 0 
				END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY,
			ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) 
			AS distance
			FROM Posts 
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
      HAVING distance <= 5;
			`;
  } else {
    return `
			SELECT 
			Posts.post_id AS postId, 
			Posts.title_en AS title, 
			Posts.address_short_en AS addressShort,
			favorite_cnt AS favoriteCnt, 
			post_images AS postImage, 
			inside_yn AS insideYN,
			Posts.category_id AS category, 
			permission_state AS permissionState, 
				CASE WHEN b.user_id = ${userId} THEN 1 
				ELSE 0 
				END AS favoriteState,
			post_loc_x AS postLocationX, 
			post_loc_y AS postLocationY,
			ROUND(6371 * acos(cos(radians(${x})) * cos(radians(post_loc_y)) * cos(radians(post_loc_x) - radians(${y})) + sin(radians(${x})) * sin(radians(post_loc_y)))) 
			AS distance
			FROM Posts 
			LEFT JOIN (
				SELECT post_id, user_id
					FROM Favorites
					where user_id = ${userId}
			) b 
			ON Posts.post_id = b.post_id
			HAVING distance <= 5;
			`;
  }
};

module.exports = {
  searchMainQuery,
  likeQuery,
  mdQuery,
  weatherQuery,
  queryOfGettingMainMap,
};
