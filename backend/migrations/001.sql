CREATE SCHEMA IF NOT EXISTS teacher;

create table if not exists teacher.teacher(
    id integer primary key,
    login text not null,
    password text not null,
    first_name text not null,
    second_name text not null
);

create table if not exists teacher.invite_token(
    token text NOT NULL,
    created_by integer NOT NULL,
    used_by integer,
    created_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    role text NOT NULL
    CONSTRAINT invite_token_key UNIQUE (token),
    CONSTRAINT invite_created_by_fkey FOREIGN KEY (created_by)
        REFERENCES employee.employee (id) MATCH SIMPLE
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

CREATE SCHEMA IF NOT EXISTS student;