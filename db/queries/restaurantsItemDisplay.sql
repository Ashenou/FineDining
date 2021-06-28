-- Display restaurant's items (menu)
SELECT *
FROM items
JOIN item_type ON items.type_id = item_type.id ;
