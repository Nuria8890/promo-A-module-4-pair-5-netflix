-- Buscar cuantas películas como favorita tiene cada usuario.
SELECT COUNT(users_has_movies.fk_movie) AS peliculas_favoritas, users.name AS usuario
FROM users_has_movies
INNER JOIN users
	ON users.idUser = users_has_movies.fk_user
GROUP BY users_has_movies.fk_user;


-- Buscar el usuario con mayor cantidad de películas favoritas (NO SABEMOS)
SELECT users.name AS usuario, COUNT(*) AS peliculas_favoritas
FROM users
INNER JOIN users_has_movies
	ON users.idUser = users_has_movies.fk_user
GROUP BY users.name
HAVING MAX(users_has_movies.fk_movie);