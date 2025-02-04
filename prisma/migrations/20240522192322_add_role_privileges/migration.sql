-- Update current user

INSERT INTO "RolePrivilege"
("roleId", "privilegeId", "inverted", "conditions", "description")
VALUES(3, 31, 0, '{
  "owner": "id"
}', 'Update Current User');

-- Read owned notes

INSERT INTO "RolePrivilege"
("roleId", "privilegeId", "inverted", "conditions", "description")
VALUES(3, 41, 0, '{
  "owner": "authorId"
}', 'Read owned Notes');

-- Create a comment

INSERT INTO "RolePrivilege"
("roleId", "privilegeId", "inverted", "conditions", "description")
VALUES(3, 36, 0, null, 'Create a comment');

-- Update owned comments

INSERT INTO "RolePrivilege"
("roleId", "privilegeId", "inverted", "conditions", "description")
VALUES(3, 38, 0, '{
  "owner": "authorId"
}', 'Update owned Comments');
