USE netflix;

SELECT * FROM actors;
SELECT * FROM movies;
SELECT * FROM users;
SELECT * FROM users_has_movies;

CREATE TABLE users_has_movies (
fk_user INT,
FOREIGN KEY (fk_user) REFERENCES users(idUser),
fk_movie INT,
FOREIGN KEY (fk_movie) REFERENCES movies(idMovies),
PRIMARY KEY (fk_user, fk_movie)
);

INSERT INTO users_has_movies (fk_user, fk_movie)
VALUES
	(1,1),
    (1,2),
    (2,2);
    
ALTER TABLE users_has_movies ADD score FLOAT;

UPDATE users_has_movies
SET score = 7.5
WHERE fk_user = 1 AND fk_movie = 2;

UPDATE users_has_movies
SET score = 10
WHERE fk_user = 1 AND fk_movie = 1;

UPDATE users_has_movies
SET score = 6.75
WHERE fk_user = 2 AND fk_movie = 2;
