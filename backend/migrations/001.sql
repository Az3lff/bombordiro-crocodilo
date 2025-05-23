create SCHEMA IF NOT EXISTS list;

create SCHEMA IF NOT EXISTS "user";

CREATE TABLE IF NOT EXISTS list.users_roles
(
    role text  NOT NULL,
    description text  NOT NULL,
    CONSTRAINT users_roles_pk PRIMARY KEY (role),
    CONSTRAINT users_roles_role_key UNIQUE (role)
);

create table if not exists "user"."user"(
    id serial primary key,
    login text not null,
    password text not null,
    first_name text not null,
    second_name text not null
);

CREATE TABLE IF NOT EXISTS "user".invite
(
    token character varying  NOT NULL,
    created_by integer NOT NULL,
    used_by integer,
    created_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    role character varying  NOT NULL,
    CONSTRAINT invite_token_key UNIQUE (token),
    CONSTRAINT invite_created_by_fkey FOREIGN KEY (created_by)
    REFERENCES "user"."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT invite_role_fkey FOREIGN KEY (role)
    REFERENCES list.users_roles (role) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT invite_used_by_fkey FOREIGN KEY (used_by)
    REFERENCES "user"."user" (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "user".users_role(
    user_id integer not null,
    role text not null
);

create schema if not exists content;

create table if not exists content.map
(
    id uuid primary key,
    title text not null,
    description_file text not null,
    map_file text not null
);
