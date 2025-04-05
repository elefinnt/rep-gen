CREATE TABLE `rep-gen_attribute` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`text` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	CONSTRAINT `rep-gen_attribute_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rep-gen_student` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `rep-gen_student_id` PRIMARY KEY(`id`)
);
