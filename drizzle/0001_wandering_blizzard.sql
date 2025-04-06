CREATE TABLE `rep-gen_student_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`student_id` int NOT NULL,
	`attribute_id` int NOT NULL,
	CONSTRAINT `rep-gen_student_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `rep-gen_student` ADD `gender` varchar(50) DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE `rep-gen_student_attribute` ADD CONSTRAINT `rep-gen_student_attribute_student_id_rep-gen_student_id_fk` FOREIGN KEY (`student_id`) REFERENCES `rep-gen_student`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `rep-gen_student_attribute` ADD CONSTRAINT `rep-gen_student_attribute_attribute_id_rep-gen_attribute_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `rep-gen_attribute`(`id`) ON DELETE cascade ON UPDATE no action;