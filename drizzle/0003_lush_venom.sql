CREATE TABLE `repgen_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`text` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`is_global` boolean NOT NULL DEFAULT true,
	CONSTRAINT `repgen_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repgen_personal_attr` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`text` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `repgen_personal_attr_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repgen_student_attr` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`attribute_id` int NOT NULL,
	CONSTRAINT `repgen_student_attr_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repgen_student_user_attr` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`attr_id` int NOT NULL,
	CONSTRAINT `repgen_student_user_attr_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repgen_student` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`gender` varchar(50) NOT NULL DEFAULT 'other',
	CONSTRAINT `repgen_student_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repgen_user_profile` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`teacherName` varchar(255) NOT NULL,
	`gradeLevel` varchar(50) NOT NULL,
	`report_requirements` text,
	`has_completed_onboarding` boolean NOT NULL DEFAULT false,
	CONSTRAINT `repgen_user_profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repgen_user` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `repgen_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `repgen_user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
DROP TABLE `rep-gen_attribute`;--> statement-breakpoint
DROP TABLE `rep-gen_personal_attribute`;--> statement-breakpoint
DROP TABLE `rep-gen_student_attribute`;--> statement-breakpoint
DROP TABLE `rep-gen_student_user_attributes`;--> statement-breakpoint
DROP TABLE `rep-gen_student`;--> statement-breakpoint
DROP TABLE `rep-gen_user_profile`;--> statement-breakpoint
DROP TABLE `rep-gen_user`;--> statement-breakpoint
ALTER TABLE `repgen_personal_attr` ADD CONSTRAINT `repgen_personal_attr_user_id_repgen_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `repgen_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repgen_student_attr` ADD CONSTRAINT `repgen_student_attr_student_id_repgen_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `repgen_student`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repgen_student_attr` ADD CONSTRAINT `repgen_student_attr_attribute_id_repgen_attribute_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `repgen_attribute`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repgen_student_user_attr` ADD CONSTRAINT `repgen_student_user_attr_student_id_repgen_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `repgen_student`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repgen_student_user_attr` ADD CONSTRAINT `repgen_student_user_attr_attr_id_repgen_personal_attr_id_fk` FOREIGN KEY (`attr_id`) REFERENCES `repgen_personal_attr`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repgen_student` ADD CONSTRAINT `repgen_student_user_id_repgen_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `repgen_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repgen_user_profile` ADD CONSTRAINT `repgen_user_profile_user_id_repgen_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `repgen_user`(`id`) ON DELETE cascade ON UPDATE no action;