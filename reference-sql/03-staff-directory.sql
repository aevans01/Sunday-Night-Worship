CREATE TABLE IF NOT EXISTS church_staff (
 id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 position_key VARCHAR(50) NOT NULL UNIQUE,
 name VARCHAR(100) NOT NULL,
 role VARCHAR(100) NOT NULL,
 photo VARCHAR(1000) NOT NULL DEFAULT '',
 display_order INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Re-running does not overwrite names or photos edited in Manage Team.
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-1','Jimmy Binns','Pastor',1) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-2','David Furlow','Minister of Music',2) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-3','Randy Ragland','Minister of Youth',3) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-4','Judy Collins','Office Secretary',4) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-5','Marla Young','Financial Secretary',5) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-6','Corey Krause','Children''s Pastor',6) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-7','Karen Rice','Children''s Ministry Assistant',7) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-8','Hillary Evans','Preschool Ministry Assistant',8) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-9','Michael Oldham','Custodian',9) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
INSERT INTO church_staff (position_key,name,role,display_order) VALUES ('position-10','Michael Oldham','Grounds Keeper',10) ON DUPLICATE KEY UPDATE position_key=VALUES(position_key);
