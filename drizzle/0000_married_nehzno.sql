CREATE TABLE `rep-gen_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`text` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `rep-gen_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_student_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`attribute_id` int NOT NULL,
	CONSTRAINT `rep-gen_student_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_student` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`gender` varchar(50) NOT NULL DEFAULT 'other',
	CONSTRAINT `rep-gen_student_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_user_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`text` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `rep-gen_user_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `rep-gen_student_attribute` ADD CONSTRAINT `rep-gen_student_attribute_student_id_rep-gen_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `rep-gen_student`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rep-gen_student_attribute` ADD CONSTRAINT `rep-gen_student_attribute_attribute_id_rep-gen_attribute_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `rep-gen_attribute`(`id`) ON DELETE cascade ON UPDATE no action;