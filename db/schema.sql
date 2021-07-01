CREATE DATABASE herei;

\c herei;

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL, 
    name VARCHAR(200) NOT NULL, 
    password_digest TEXT NOT NULL
);

CREATE TABLE attraction (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200),
    description VARCHAR(800),
    lat FLOAT NOT NULL,
    long FLOAT NOT NULL,
    img TEXT,
    city VARCHAR(200),
    state VARCHAR(200),
    country VARCHAR(200),
    maxCount INTEGER NOT NULL,
    price FLOAT NOT NULL,
    create_at TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL-- belongs to users table (hosts user ID not the booking user)
);

CREATE TABLE session (
    id SERIAL PRIMARY KEY NOT NULL,
    attraction_id INTEGER NOT NULL,
    guest_count INTEGER,
    datetime TIMESTAMP NOT NULL,
    FOREIGN KEY (attraction_id) REFERENCES attraction (id) ON DELETE CASCADE
);

CREATE TABLE user_session (
    id SERIAL PRIMARY KEY NOT NULL,
    session_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (session_id) REFERENCES session (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO user_session (session_id, user_id) VALUES (1, 1);
INSERT INTO user_session (session_id, user_id) VALUES (1, 2);
INSERT INTO user_session (session_id, user_id) VALUES (1, 3);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY NOT NULL,
    session_id INTEGER NOT NULL, -- belongs to a attraction
    users_id INTEGER NOT NULL, -- belongs to a user
    FOREIGN KEY (session_id) REFERENCES session (id) ON DELETE CASCADE, -- if a host user of an attraction is deleted then so will the bookings
    FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE -- if a host user of an attraction is deleted then so will the bookings
    --**** INCLUDE COUNTS
);