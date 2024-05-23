-- Table: dev.users

-- DROP TABLE IF EXISTS dev.users;

CREATE TABLE IF NOT EXISTS dev.users
(
    account_id integer NOT NULL DEFAULT nextval('dev.users_account_id_seq'::regclass),
    CONSTRAINT users_pkey PRIMARY KEY (account_id),
    CONSTRAINT accounts_users FOREIGN KEY (account_id)
        REFERENCES dev.accounts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE RESTRICT
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS dev.users
    OWNER to postgres;

GRANT ALL ON TABLE dev.users TO hikaru;

GRANT ALL ON TABLE dev.users TO postgres;