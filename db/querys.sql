-- RETURNS ALL BOOKINGS WITH ATTRACTION INFO AND SESSION INFO FOR USER 6 
SELECT * FROM bookings JOIN session on (session_id = session.id) JOIN attraction on (attraction_id = attraction.id) WHERE users_id = 6;

SELECT * FROM attraction JOIN session ON (attraction_id = attraction.id) WHERE attraction_id = 2;