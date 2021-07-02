-- RETURNS ALL BOOKINGS WITH ATTRACTION INFO AND SESSION INFO FOR USER 6 
SELECT * FROM bookings JOIN session on (session_id = session.id) JOIN attraction on (attraction_id = attraction.id) WHERE user_id = 6;

SELECT * FROM attraction JOIN session ON (attraction_id = attraction.id) WHERE attraction_id = 2;

-- RETURNS ALL THE FUTURE SESSIONS THAT USER 3 HAS BOOKED
SELECT * FROM user_session
JOIN users ON (user_id = users.id)
JOIN session ON (session_id = session.id)
JOIN attraction ON (attraction_id = attraction.id)
WHERE (
user_id = 3 
AND 
datetime >= NOW()
);