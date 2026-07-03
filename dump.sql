--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.tasks DROP CONSTRAINT IF EXISTS tasks_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tasks ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.tasks_id_seq;
DROP TABLE IF EXISTS public.tasks;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tasks (
    id integer NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    status character varying(30) DEFAULT 'open'::character varying NOT NULL,
    priority character varying(30) DEFAULT 'low'::character varying NOT NULL,
    zone character varying(80),
    department character varying(50) DEFAULT 'operations'::character varying NOT NULL,
    assigned_to integer,
    created_by integer,
    due_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_priority CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying])::text[]))),
    CONSTRAINT valid_status CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'blocked'::character varying])::text[])))
);


--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tasks_id_seq OWNED BY public.tasks.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    role character varying(30) DEFAULT 'operator'::character varying NOT NULL,
    department character varying(50) DEFAULT 'operations'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks ALTER COLUMN id SET DEFAULT nextval('public.tasks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tasks (id, title, description, status, priority, zone, department, assigned_to, created_by, due_date, created_at, updated_at) FROM stdin;
1	Move pallet A-102	Move pallet from receiving to storage zone B.	open	high	Receiving	operations	1	1	\N	2026-07-01 07:04:49.540989	2026-07-01 07:04:49.540989
2	Inventory cycle count	Verify SKU quantities in aisle 4.	in_progress	medium	Zone B	inventory	2	2	\N	2026-07-01 07:04:49.540989	2026-07-01 07:04:49.540989
3	Charge AMR unit 14	Move robot 14 to charging station.	completed	low	Charging	operations	1	1	\N	2026-07-01 07:04:49.540989	2026-07-01 07:04:49.540989
4	Blocked conveyor check	Inspect conveyor belt in packing area.	blocked	high	Packing	maintenance	\N	1	\N	2026-07-01 07:04:49.540989	2026-07-01 07:04:49.540989
5	Robot station safety door lock	Robot station safety door lock malfunction every time the cell system is reset 	open	medium		operations	\N	1	\N	2026-07-01 09:08:58.585727	2026-07-01 09:08:58.585727
6	Floor scanner location	Floor scanner must be relocated due to a blind section that creates safety risk 	open	medium		maintenance	\N	1	\N	2026-07-02 04:01:47.142393	2026-07-02 04:01:47.142393
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password_hash, role, department, created_at) FROM stdin;
1	Warehouse Operator	operator@example.com	$2a$10$wH8M7d6CtEKb6Jn4XeYmde8/9Ndzb7xvmilMIqHftprvQmMujwDum	operator	operations	2026-07-01 07:04:49.540989
2	Inventory Supervisor	supervisor@example.com	$2a$10$wH8M7d6CtEKb6Jn4XeYmde8/9Ndzb7xvmilMIqHftprvQmMujwDum	supervisor	inventory	2026-07-01 07:04:49.540989
3	mathew	mathew@demo.com	$2b$10$KIZngb3EuU.KvQZcGbdSpuuM8P2blikb7y.X2NMOzwLxO9UVxYkhC	operator	inventory	2026-07-01 10:51:02.646627
\.


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tasks_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: tasks tasks_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

