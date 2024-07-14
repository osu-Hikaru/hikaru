-- Table: dev.groups

DROP TABLE IF EXISTS dev.groups;
DROP SEQUENCE IF EXISTS dev.groups_id_seq;

SET schema 'dev';
CREATE SEQUENCE IF NOT EXISTS groups_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
CREATE TABLE IF NOT EXISTS dev.groups
(
    internal_id uuid NOT NULL DEFAULT gen_random_uuid(),
    colour character(7) COLLATE pg_catalog."default" NOT NULL,
    has_listing boolean NOT NULL,
    has_playmodes boolean NOT NULL,
    id integer NOT NULL DEFAULT nextval('dev.groups_id_seq'::regclass),
    identifier character varying(16) COLLATE pg_catalog."default" NOT NULL,
    is_probationary boolean NOT NULL,
    name character varying(256) COLLATE pg_catalog."default" NOT NULL,
    playmodes character(1)[] COLLATE pg_catalog."default",
    short_name character varying(3) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT groups_pkey PRIMARY KEY (internal_id),
    CONSTRAINT id UNIQUE (id),
    CONSTRAINT short_name UNIQUE (short_name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS dev.groups
    OWNER to postgres;

GRANT ALL ON TABLE dev.groups TO hikaru;

GRANT ALL ON TABLE dev.groups TO postgres;