CREATE SCHEMA IF NOT EXISTS admin;

create SCHEMA IF NOT EXISTS list;

CREATE TABLE IF NOT EXISTS list.users_roles
(
    role text  NOT NULL,
    description text  NOT NULL,
    CONSTRAINT users_roles_pk PRIMARY KEY (role),
    CONSTRAINT users_roles_role_key UNIQUE (role)
);


create table if not exists admin.admin
(
    id serial PRIMARY KEY,
    login text not null,
    password text not null,
    first_name text not null,
    second_name text not null,
    image_url text default null
);

CREATE TABLE IF NOT EXISTS admin.invite
(
    token character varying  NOT NULL,
    created_by integer NOT NULL,
    used_by integer,
    created_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    role character varying  NOT NULL,
    CONSTRAINT invite_token_key UNIQUE (token),
    CONSTRAINT invite_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES admin.admin (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT invite_role_fkey FOREIGN KEY (role)
    REFERENCES list.users_roles (role) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT invite_used_by_fkey FOREIGN KEY (used_by)
    REFERENCES admin.admin (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE SCHEMA IF NOT EXISTS student;

create table if not exists student.student
(
    id serial PRIMARY KEY,
    login text not null,
    password text not null,
    first_name text not null,
    second_name text not null,
    image_url text default null
);
