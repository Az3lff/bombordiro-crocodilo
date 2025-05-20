CREATE SCHEMA IF NOT EXISTS teacher;

create table if not exists teacher.teacher(
    id integer primary key,
    login text not null,
    password text not null,
    first_name text not null,
    second_name text not null
);

create table if not exists teacher.invite_token(
    
);

CREATE SCHEMA IF NOT EXISTS student;