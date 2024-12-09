USE netflix;

CREATE TABLE movies_has_actors(
	fk_actor INT,
    FOREIGN KEY (fk_actor) REFERENCES actors(idActors),
    fk_movie INT,
    FOREIGN KEY (fk_movie) REFERENCES movies(idMovies),
    PRIMARY KEY (fk_actor, fk_movie)
);