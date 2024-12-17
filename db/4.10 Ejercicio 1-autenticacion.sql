USE netflix;

ALTER TABLE users CHANGE password password VARCHAR(1500) NOT NULL;

ALTER TABLE users CHANGE name name VARCHAR(45);

ALTER TABLE users CHANGE user user VARCHAR(45);
