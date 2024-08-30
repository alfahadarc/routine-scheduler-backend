CREATE TABLE public."admin" (
	username varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT admin_pk PRIMARY KEY (username),
	CONSTRAINT admin_un UNIQUE (email)
);

CREATE TABLE public.configs (
	"key" varchar NOT NULL,
	value varchar NOT NULL,
	CONSTRAINT configs_pk PRIMARY KEY (key)
);

CREATE TABLE public.courses (
	course_id varchar NOT NULL,
	"name" varchar NOT NULL,
	"type" int4 NOT NULL,
	"session" varchar NOT NULL,
	class_per_week float8 NOT NULL,
	CONSTRAINT courses_pk PRIMARY KEY (course_id, session)
);

CREATE TABLE public.forms (
	id varchar NOT NULL,
	"type" varchar NOT NULL,
	response varchar NULL,
	initial varchar NOT NULL,
	CONSTRAINT forms_pk PRIMARY KEY (id)
);
CREATE INDEX forms_key_idx ON public.forms USING btree (id);

CREATE TABLE public.lab_room_assignment (
	course_id varchar NOT NULL,
	"session" varchar NOT NULL,
	batch int4 NOT NULL,
	"section" varchar NOT NULL,
	room varchar NULL,
	CONSTRAINT lab_room_assignment_pk PRIMARY KEY (course_id, session, batch, section)
);

CREATE TABLE public.rooms (
	room varchar NOT NULL,
	"type" int4 NULL,
	CONSTRAINT rooms_pk PRIMARY KEY (room)
);

CREATE TABLE public.teachers (
	initial varchar NOT NULL,
	"name" varchar NOT NULL,
	surname varchar NOT NULL,
	email varchar NOT NULL,
	seniority_rank int4 NOT NULL,
	active int2 NOT NULL,
	theory_courses int4 NOT NULL,
	sessional_courses int4 NOT NULL,
	CONSTRAINT teachers_pk PRIMARY KEY (initial)
);

CREATE TABLE public.sections (
	batch int4 NOT NULL,
	"section" varchar NOT NULL,
	"type" int4 NOT NULL,
	room varchar NULL,
	"session" varchar NOT NULL,
	level_term varchar NOT NULL,
	CONSTRAINT sections_pk PRIMARY KEY (batch, section),
	CONSTRAINT sections_fk FOREIGN KEY (room) REFERENCES public.rooms(room) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.teacher_assignment (
	course_id varchar NOT NULL,
	initial varchar NOT NULL,
	"session" varchar NOT NULL,
	CONSTRAINT teacher_assignment_pk PRIMARY KEY (course_id, initial, session),
	CONSTRAINT teacher_assignment_fk FOREIGN KEY (course_id,"session") REFERENCES public.courses(course_id,"session") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT teacher_assignment_fk_1 FOREIGN KEY (initial) REFERENCES public.teachers(initial) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.courses_sections (
	course_id varchar NOT NULL,
	"session" varchar NOT NULL,
	batch int4 NOT NULL,
	"section" varchar NOT NULL,
	CONSTRAINT courses_sections_pk PRIMARY KEY (course_id, session, batch, section),
	CONSTRAINT courses_sections_fk FOREIGN KEY (batch,"section") REFERENCES public.sections(batch,"section") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT courses_sections_fk_c FOREIGN KEY (course_id,"session") REFERENCES public.courses(course_id,"session") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.schedule_assignment (
	course_id varchar NOT NULL,
	"session" varchar NOT NULL,
	batch int4 NOT NULL,
	"section" varchar NOT NULL,
	"day" varchar NOT NULL,
	"time" int4 NOT NULL,
	CONSTRAINT schedule_assignment_check CHECK (((day)::text = ANY (ARRAY[('Saturday'::character varying)::text, ('Sunday'::character varying)::text, ('Monday'::character varying)::text, ('Tuesday'::character varying)::text, ('Wednesday'::character varying)::text]))),
	CONSTRAINT schedule_assignment_pk PRIMARY KEY (session, batch, section, day, "time"),
	CONSTRAINT schedule_assignment_un UNIQUE (course_id, session, batch, section, day, "time"),
	CONSTRAINT schedule_assignment_fk FOREIGN KEY (course_id,"session") REFERENCES public.courses(course_id,"session"),
	CONSTRAINT schedule_assignment_fk1 FOREIGN KEY (batch,"section") REFERENCES public.sections(batch,"section") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE public.teacher_sessional_assignment (
	initial varchar NOT NULL,
	course_id varchar NOT NULL,
	"session" varchar NOT NULL,
	batch int4 NOT NULL,
	"section" varchar NOT NULL,
	CONSTRAINT teacher_sessional_assignment_pk PRIMARY KEY (initial, course_id, session, batch, section),
	CONSTRAINT teacher_sessional_assignment_courses_sections_fk FOREIGN KEY (course_id,"session",batch,"section") REFERENCES public.courses_sections(course_id,"session",batch,"section"),
	CONSTRAINT teacher_sessional_assignment_teachers_fk FOREIGN KEY (initial) REFERENCES public.teachers(initial)
);

INSERT INTO public."admin" (username,email,"password") VALUES
	 ('admin','ask@mail.com','$2a$12$9DOeaW4x5gJqWC4WKXMInOzkJUDqbA2x60QhydtAOE81W7qs8Ymqm');
INSERT INTO public.configs ("key",value) VALUES
	 ('demo','hi this is a template body'),
	 ('CURRENT_SESSION','Jan-23'),
	 ('ALL_SESSIONS','["Jan-23"]'),
	 ('THEORY_PREFERENCES_COMPLETE','0'),
	 ('THEORY_EMAIL','Sample theory email'),
	 ('SCHEDULE_EMAIL','Sample schedule email'),
	 ('SESSIONAL_EMAIL','Sample sessional email');
INSERT INTO public.courses (course_id,"name","type","session",class_per_week) VALUES
	 ('CHEM113','Chemistry',0,'Jan-23',3.0),
	 ('CHEM118','Chemistry Sessional',1,'Jan-23',1.0),
	 ('CSE105','Data Structures and Algorithms I',0,'Jan-23',3.0),
	 ('CSE106','Data Structures and Algorithms I Sessional',1,'Jan-23',1.0),
	 ('CSE107','Object Oriented Programming Language',0,'Jan-23',3.0),
	 ('CSE108','Object Oriented Programming Language Sessional',1,'Jan-23',1.0),
	 ('CSE207','Data Structures and Algorithms II',0,'Jan-23',3.0),
	 ('CSE208','Data Structures and Algorithms II Sessional',1,'Jan-23',1.0),
	 ('CSE211','Theory of Computation',0,'Jan-23',3.0),
	 ('CSE215','Database',0,'Jan-23',3.0);
INSERT INTO public.courses (course_id,"name","type","session",class_per_week) VALUES
	 ('CSE216','Database Sessional',1,'Jan-23',1.0),
	 ('CSE283','Digital Techniques',0,'Jan-23',3.0),
	 ('CSE284','Digital Techniques Sessional',1,'Jan-23',1.0),
	 ('CSE301','Mathematical Analysis for Computer Science',0,'Jan-23',3.0),
	 ('CSE313','Operating System',0,'Jan-23',3.0),
	 ('CSE314','Operating System Sessional',1,'Jan-23',1.0),
	 ('CSE317','Artificial Intelligence',0,'Jan-23',3.0),
	 ('CSE318','Artificial Intelligence Sessional',1,'Jan-23',1.0),
	 ('CSE321','Computer Networks',0,'Jan-23',3.0),
	 ('CSE322','Computer Networks Sessional',1,'Jan-23',1.0);
INSERT INTO public.courses (course_id,"name","type","session",class_per_week) VALUES
	 ('CSE325','Information System Design',0,'Jan-23',3.0),
	 ('CSE326','Information System Design Sessional',1,'Jan-23',1.0),
	 ('CSE400','Project and Thesis',1,'Jan-23',1.0),
	 ('CSE405','Computer Security',0,'Jan-23',3.0),
	 ('CSE406','Computer Security Sessional',1,'Jan-23',1.0),
	 ('CSE408','Software Development Sessional',1,'Jan-23',1.0),
	 ('CSE409','Computer Graphics',0,'Jan-23',3.0),
	 ('CSE410','Computer Graphics Sessional',1,'Jan-23',1.0),
	 ('CSE421','Basic Graph Theory',0,'Jan-23',3.0),
	 ('CSE423','Fault Tolerant Systems',0,'Jan-23',3.0);
INSERT INTO public.courses (course_id,"name","type","session",class_per_week) VALUES
	 ('CSE463','Introduction to Bioinformatics',0,'Jan-23',3.0),
	 ('EEE269','Electrical Drives and Instrumentation',0,'Jan-23',3.0),
	 ('EEE270','Electrical Drives and Instrumentation Sessional',1,'Jan-23',1.0),
	 ('HUM475','Engineering Economics',0,'Jan-23',3.0),
	 ('MATH143','Linear Algebra',0,'Jan-23',3.0),
	 ('MATH247','Linear Algebra, Laplace Transformation and Fourier Analysis',0,'Jan-23',3.0),
	 ('ME165','Basic Mechanical Engineering',0,'Jan-23',3.0),
	 ('ME174','Mechanical Engineering Drawing and CAD',1,'Jan-23',1.0),
	 ('CT','Class Test',0,'Jan-23',3.0);
INSERT INTO public.rooms (room,"type") VALUES
	 ('MCL',1),
	 ('MML',1),
	 ('CL',1),
	 ('SEL',1),
	 ('NL',1),
	 ('IL',1),
	 ('DL',1),
	 ('PL',1),
	 ('BL',1),
	 ('DBL',1);
INSERT INTO public.rooms (room,"type") VALUES
	 ('WNL',1),
	 ('VDAL',1),
	 ('AIRL',1),
	 ('IAC',1),
	 ('103',0),
	 ('104',0),
	 ('107',0),
	 ('108',0),
	 ('109',0),
	 ('203',0);
INSERT INTO public.rooms (room,"type") VALUES
	 ('204',0),
	 ('205',0),
	 ('206',0),
	 ('207',0),
	 ('903',0),
	 ('504',0);
INSERT INTO public.sections (batch,"section","type",room,"session",level_term) VALUES
	 (18,'A',0,'203','Jan-23','L4-T1'),
	 (18,'B',0,'204','Jan-23','L4-T1'),
	 (18,'A1',1,NULL,'Jan-23','L4-T1'),
	 (18,'A2',1,NULL,'Jan-23','L4-T1'),
	 (18,'B1',1,NULL,'Jan-23','L4-T1'),
	 (18,'B2',1,NULL,'Jan-23','L4-T1'),
	 (19,'A',0,'205','Jan-23','L3-T2'),
	 (19,'B',0,'206','Jan-23','L3-T2'),
	 (19,'A1',1,NULL,'Jan-23','L3-T2'),
	 (19,'A2',1,NULL,'Jan-23','L3-T2');
INSERT INTO public.sections (batch,"section","type",room,"session",level_term) VALUES
	 (19,'B1',1,NULL,'Jan-23','L3-T2'),
	 (19,'B2',1,NULL,'Jan-23','L3-T2'),
	 (20,'A',0,'103','Jan-23','L2-T2'),
	 (20,'B',0,'104','Jan-23','L2-T2'),
	 (20,'A1',1,NULL,'Jan-23','L2-T2'),
	 (20,'A2',1,NULL,'Jan-23','L2-T2'),
	 (20,'B1',1,NULL,'Jan-23','L2-T2'),
	 (20,'B2',1,NULL,'Jan-23','L2-T2'),
	 (21,'A',0,'107','Jan-23','L1-T2'),
	 (21,'B',0,'108','Jan-23','L1-T2');
INSERT INTO public.sections (batch,"section","type",room,"session",level_term) VALUES
	 (21,'C',0,'109','Jan-23','L1-T2'),
	 (21,'A1',1,NULL,'Jan-23','L1-T2'),
	 (21,'A2',1,NULL,'Jan-23','L1-T2'),
	 (21,'B1',1,NULL,'Jan-23','L1-T2'),
	 (21,'B2',1,NULL,'Jan-23','L1-T2'),
	 (21,'C1',1,NULL,'Jan-23','L1-T2'),
	 (21,'C2',1,NULL,'Jan-23','L1-T2');
INSERT INTO public.teachers (initial,"name",surname,email,seniority_rank,active,theory_courses,sessional_courses) VALUES
	 ('MMA','Dr. Muhammad Masroor Ali','Masroor','sabit.jehadul.karim@gmail.com',1,1,1,1),
	 ('MSR','Dr. Md. Saidur Rahman','Saidur','alfahadarc@gmail.com',2,1,1,1),
	 ('MMI','Dr. Md. Monirul Islam','Monir','somoroy1290@gmail.com',3,1,1,1),
	 ('MSRJ','Dr. M. Sohel Rahman','Sohel','alfahadarc@gmail.com',5,1,1,1),
	 ('AKMAR','Dr. A.K.M. Ashikur Rahman','Ashik','somoroy1290@gmail.com',6,1,1,1),
	 ('MEA','Dr. Mohammed Eunus Ali','Eunus','sabit.jehadul.karim@gmail.com',7,1,1,1),
	 ('MN','Dr. Mahmuda Naznin','Mahmuda','alfahadarc@gmail.com',8,1,1,1),
	 ('MDMI','Dr. Md. Monirul Islam','Monir Jr.','somoroy1290@gmail.com',9,1,1,1),
	 ('TH','Dr. Tanzima Hashem','Tanzima','sabit.jehadul.karim@gmail.com',10,1,1,1),
	 ('MSH','Dr. Md. Shohrab Hossain','Shohrab','alfahadarc@gmail.com',11,1,1,1);
INSERT INTO public.teachers (initial,"name",surname,email,seniority_rank,active,theory_courses,sessional_courses) VALUES
	 ('AI','Dr. Anindya Iqbal','Anindya','sabit.jehadul.karim@gmail.com',13,1,1,1),
	 ('RS','Dr. Rifat Shahriyar','Rifat','alfahadarc@gmail.com',14,1,1,1),
	 ('MDAA','Dr. Muhammad Abdullah Adnan','Adnan','somoroy1290@gmail.com',15,1,1,1),
	 ('MDSR','Dr. Mohammad Saifur Rahman','Saifur','sabit.jehadul.karim@gmail.com',16,1,1,1),
	 ('MSB','Dr. Md. Shamsuzzoha Bayzid','Bayzid','alfahadarc@gmail.com',17,1,1,1),
	 ('AHR','Dr. Atif Hasan Rahman','Atif','somoroy1290@gmail.com',18,1,1,1),
	 ('SS','Dr. Sadia Sharmin','Sadia','sabit.jehadul.karim@gmail.com',19,1,1,1),
	 ('AW','Abu Wasif','Wasif','alfahadarc@gmail.com',20,1,1,1),
	 ('TA','Tanveer Awal','Tanveer','somoroy1290@gmail.com',21,1,1,1),
	 ('KMS','Khaled Mahmud Shahriar','Shahriar','sabit.jehadul.karim@gmail.com',22,1,1,1);
INSERT INTO public.teachers (initial,"name",surname,email,seniority_rank,active,theory_courses,sessional_courses) VALUES
	 ('MSIB','Md. Shariful Islam Bhuyan','Sharif','alfahadarc@gmail.com',23,1,1,1),
	 ('SB','Sukarna Barua','Sukarna','somoroy1290@gmail.com',24,1,1,1),
	 ('MAN','Dr. Muhammad Ali Nayeem','Nayeem','sabit.jehadul.karim@gmail.com',25,1,1,1),
	 ('RRR','Dr. Rezwana Reaz Rimpi','Rezwana','alfahadarc@gmail.com',26,1,1,1),
	 ('HT','Tahmid Hasan','Tahmid','somoroy1290@gmail.com',27,1,1,1),
	 ('TM','Md. Tareq Mahmood','Tareq','sabit.jehadul.karim@gmail.com',28,1,1,1),
	 ('PSA','Preetom Saha Arko','Arko','alfahadarc@gmail.com',29,1,1,1),
	 ('RRD','Rayhan Rashed','Rayhan','alfahadarc@gmail.com',32,1,1,1),
	 ('MTH','Mohammad Tawhidul Hasan Bhuiyan','Tuhin','somoroy1290@gmail.com',33,1,1,1),
	 ('NBH','Navid Bin Hasan','Navid','sabit.jehadul.karim@gmail.com',34,1,1,1);
INSERT INTO public.teachers (initial,"name",surname,email,seniority_rank,active,theory_courses,sessional_courses) VALUES
	 ('MAI','Md. Ashraful Islam','Ashraful','alfahadarc@gmail.com',35,1,1,1),
	 ('MHE','A. K. M. Mehedi Hasan','Mehedi','somoroy1290@gmail.com',36,1,1,1),
	 ('ART','Abdur Rashid Tushar','Tushar','sabit.jehadul.karim@gmail.com',37,1,1,1),
	 ('IJ','Ishrat Jahan','Ishrat','alfahadarc@gmail.com',38,1,1,1),
	 ('MRI','Md. Ruhan Islam','Ruhan','somoroy1290@gmail.com',39,1,1,1),
	 ('SAH','Sheikh Azizul Hakim','Hakim','sabit.jehadul.karim@gmail.com',40,1,1,1),
	 ('KRV','Kowshic Roy','Vodro','alfahadarc@gmail.com',41,1,1,1),
	 ('MTM','Mashiat Mustaq','Mashiat','somoroy1290@gmail.com',42,1,1,1),
	 ('SMH','Saem Hasan','Saem','sabit.jehadul.karim@gmail.com',43,1,1,1),
	 ('KMRH','Khandokar Md. Rahat Hossain','Rahat','alfahadarc@gmail.com',44,1,1,1);
INSERT INTO public.teachers (initial,"name",surname,email,seniority_rank,active,theory_courses,sessional_courses) VALUES
	 ('AAI','Dr. A. B. M. Alim Al Islam','Alim','somoroy1290@gmail.com',12,1,1,1),
	 ('MMAK','Dr. Md. Mostofa Akbar','Mostofa','sabit.jehadul.karim@gmail.com',4,1,1,1),
	 ('MTZ','Md. Toufikuzzaman','Toufik','sabit.jehadul.karim@gmail.com',31,1,1,1);

INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CHEM113','Jan-23',21,'A'),
	 ('CHEM113','Jan-23',21,'B'),
	 ('CHEM113','Jan-23',21,'C'),
	 ('CHEM118','Jan-23',21,'A1'),
	 ('CHEM118','Jan-23',21,'A2'),
	 ('CHEM118','Jan-23',21,'B1'),
	 ('CHEM118','Jan-23',21,'B2'),
	 ('CHEM118','Jan-23',21,'C1'),
	 ('CHEM118','Jan-23',21,'C2'),
	 ('CSE105','Jan-23',21,'A');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE105','Jan-23',21,'B'),
	 ('CSE105','Jan-23',21,'C'),
	 ('CSE106','Jan-23',21,'A1'),
	 ('CSE106','Jan-23',21,'A2'),
	 ('CSE106','Jan-23',21,'B1'),
	 ('CSE106','Jan-23',21,'B2'),
	 ('CSE106','Jan-23',21,'C1'),
	 ('CSE106','Jan-23',21,'C2'),
	 ('CSE107','Jan-23',21,'A'),
	 ('CSE107','Jan-23',21,'B');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE107','Jan-23',21,'C'),
	 ('CSE108','Jan-23',21,'A1'),
	 ('CSE108','Jan-23',21,'A2'),
	 ('CSE108','Jan-23',21,'B1'),
	 ('CSE108','Jan-23',21,'B2'),
	 ('CSE108','Jan-23',21,'C1'),
	 ('CSE108','Jan-23',21,'C2'),
	 ('CSE207','Jan-23',20,'A'),
	 ('CSE207','Jan-23',20,'B'),
	 ('CSE208','Jan-23',20,'A1');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE208','Jan-23',20,'A2'),
	 ('CSE208','Jan-23',20,'B1'),
	 ('CSE208','Jan-23',20,'B2'),
	 ('CSE211','Jan-23',20,'A'),
	 ('CSE211','Jan-23',20,'B'),
	 ('CSE215','Jan-23',20,'A'),
	 ('CSE215','Jan-23',20,'B'),
	 ('CSE216','Jan-23',20,'A1'),
	 ('CSE216','Jan-23',20,'A2'),
	 ('CSE216','Jan-23',20,'B1');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE216','Jan-23',20,'B2'),
	 ('CSE283','Jan-23',20,'A'),
	 ('CSE283','Jan-23',20,'B'),
	 ('CSE284','Jan-23',20,'A1'),
	 ('CSE284','Jan-23',20,'A2'),
	 ('CSE284','Jan-23',20,'B1'),
	 ('CSE284','Jan-23',20,'B2'),
	 ('CSE301','Jan-23',19,'A'),
	 ('CSE301','Jan-23',19,'B'),
	 ('CSE313','Jan-23',19,'A');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE313','Jan-23',19,'B'),
	 ('CSE314','Jan-23',19,'A1'),
	 ('CSE314','Jan-23',19,'A2'),
	 ('CSE314','Jan-23',19,'B1'),
	 ('CSE314','Jan-23',19,'B2'),
	 ('CSE317','Jan-23',19,'A'),
	 ('CSE317','Jan-23',19,'B'),
	 ('CSE318','Jan-23',19,'A1'),
	 ('CSE318','Jan-23',19,'A2'),
	 ('CSE318','Jan-23',19,'B1');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE318','Jan-23',19,'B2'),
	 ('CSE321','Jan-23',19,'A'),
	 ('CSE321','Jan-23',19,'B'),
	 ('CSE322','Jan-23',19,'A1'),
	 ('CSE322','Jan-23',19,'A2'),
	 ('CSE322','Jan-23',19,'B1'),
	 ('CSE322','Jan-23',19,'B2'),
	 ('CSE325','Jan-23',19,'A'),
	 ('CSE325','Jan-23',19,'B'),
	 ('CSE326','Jan-23',19,'A1');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE326','Jan-23',19,'A2'),
	 ('CSE326','Jan-23',19,'B1'),
	 ('CSE326','Jan-23',19,'B2'),
	 ('CSE400','Jan-23',18,'A1'),
	 ('CSE400','Jan-23',18,'A2'),
	 ('CSE400','Jan-23',18,'B1'),
	 ('CSE400','Jan-23',18,'B2'),
	 ('CSE405','Jan-23',18,'A'),
	 ('CSE405','Jan-23',18,'B'),
	 ('CSE406','Jan-23',18,'A1');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE406','Jan-23',18,'A2'),
	 ('CSE406','Jan-23',18,'B1'),
	 ('CSE406','Jan-23',18,'B2'),
	 ('CSE408','Jan-23',18,'A1'),
	 ('CSE408','Jan-23',18,'A2'),
	 ('CSE408','Jan-23',18,'B1'),
	 ('CSE408','Jan-23',18,'B2'),
	 ('CSE409','Jan-23',18,'A'),
	 ('CSE409','Jan-23',18,'B'),
	 ('CSE410','Jan-23',18,'A1');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('CSE410','Jan-23',18,'A2'),
	 ('CSE410','Jan-23',18,'B1'),
	 ('CSE410','Jan-23',18,'B2'),
	 ('CSE421','Jan-23',18,'A'),
	 ('CSE463','Jan-23',18,'A'),
	 ('CSE463','Jan-23',18,'B'),
	 ('EEE269','Jan-23',20,'A'),
	 ('EEE269','Jan-23',20,'B'),
	 ('EEE270','Jan-23',20,'A1'),
	 ('EEE270','Jan-23',20,'A2');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('EEE270','Jan-23',20,'B1'),
	 ('EEE270','Jan-23',20,'B2'),
	 ('HUM475','Jan-23',18,'A'),
	 ('HUM475','Jan-23',18,'B'),
	 ('MATH143','Jan-23',21,'A'),
	 ('MATH143','Jan-23',21,'B'),
	 ('MATH143','Jan-23',21,'C'),
	 ('MATH247','Jan-23',20,'A'),
	 ('MATH247','Jan-23',20,'B'),
	 ('ME165','Jan-23',21,'A');
INSERT INTO public.courses_sections (course_id,"session",batch,"section") VALUES
	 ('ME165','Jan-23',21,'B'),
	 ('ME165','Jan-23',21,'C'),
	 ('ME174','Jan-23',21,'A1'),
	 ('ME174','Jan-23',21,'A2'),
	 ('ME174','Jan-23',21,'B1'),
	 ('ME174','Jan-23',21,'B2'),
	 ('ME174','Jan-23',21,'C1'),
	 ('ME174','Jan-23',21,'C2'),
	 ('CSE423','Jan-23',18,'B');
