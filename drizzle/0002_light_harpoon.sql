CREATE TABLE `rep-gen_personal_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`text` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `rep-gen_personal_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_student_user_attributes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`personal_attribute_id` int NOT NULL,
	CONSTRAINT `rep-gen_student_user_attributes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_user_profile` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`teacherName` varchar(255) NOT NULL,
	`gradeLevel` varchar(50) NOT NULL,
	`report_requirements` text,
	`has_completed_onboarding` boolean NOT NULL DEFAULT false,
	CONSTRAINT `rep-gen_user_profile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_user` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `rep-gen_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `rep-gen_user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `rep-gen_attribute` ADD `is_global` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `rep-gen_student` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `rep-gen_personal_attribute` ADD CONSTRAINT `rep-gen_personal_attribute_user_id_rep-gen_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `rep-gen_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rep-gen_student_user_attributes` ADD CONSTRAINT `rep-gen_student_user_attributes_student_id_rep-gen_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `rep-gen_student`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rep-gen_student_user_attributes` ADD CONSTRAINT `rep-gen_student_user_attributes_personal_attribute_id_rep-gen_personal_attribute_id_fk` FOREIGN KEY (`personal_attribute_id`) REFERENCES `rep-gen_personal_attribute`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rep-gen_user_profile` ADD CONSTRAINT `rep-gen_user_profile_user_id_rep-gen_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `rep-gen_user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rep-gen_student` ADD CONSTRAINT `rep-gen_student_user_id_rep-gen_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `rep-gen_user`(`id`) ON DELETE cascade ON UPDATE no action;