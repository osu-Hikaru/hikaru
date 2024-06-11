-- Table: dev.web

DROP TABLE IF EXISTS dev.web;

CREATE TABLE IF NOT EXISTS dev.web
(
    setting character varying(128) COLLATE pg_catalog."default" NOT NULL,
    value character varying(128) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT web_pkey PRIMARY KEY (setting)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS dev.web
    OWNER to postgres;

GRANT ALL ON TABLE dev.web TO hikaru;

GRANT ALL ON TABLE dev.web TO postgres;