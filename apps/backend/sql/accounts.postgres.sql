-- Table: dev.accounts

/* DANGER */
DROP TABLE IF EXISTS dev.accounts;
DROP SEQUENCE IF EXISTS dev.accounts_id_seq;
/* DANGER */

SET schema 'dev';
CREATE SEQUENCE IF NOT EXISTS accounts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE TABLE IF NOT EXISTS dev.accounts
(
    id integer NOT NULL DEFAULT nextval('dev.accounts_id_seq'::regclass),
    username character varying(16) COLLATE pg_catalog."default" NOT NULL,
    password character(60) COLLATE pg_catalog."default" NOT NULL,
    email character varying(128) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT accounts_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS dev.accounts
    OWNER to postgres;

GRANT ALL ON TABLE dev.accounts TO hikaru;

GRANT USAGE, SELECT ON SEQUENCE accounts_id_seq TO hikaru;

GRANT ALL ON TABLE dev.accounts TO postgres;