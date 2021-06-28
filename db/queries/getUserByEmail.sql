-- user login
SELECT *
FROM users
where email = $1 AND password = $2 RETURNING id;
