-- mcm_db.account definition

CREATE TABLE `account` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.board definition

CREATE TABLE `board` (
  `board_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `currency_unit` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `account_id` int NOT NULL,
  PRIMARY KEY (`board_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.category definition

CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.daily_analysis definition

CREATE TABLE `daily_analysis` (
  `daily_analysis_id` int NOT NULL AUTO_INCREMENT,
  `date` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `total` int NOT NULL,
  `board_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`daily_analysis_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.extracted_record definition

CREATE TABLE `extracted_record` (
  `extracted_record_id` int NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `description` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `record_id` int NOT NULL,
  `board_id` int NOT NULL,
  PRIMARY KEY (`extracted_record_id`),
  UNIQUE KEY `REL_e064cf89f7eea7ac1dc221afdf` (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.extracted_record_category definition

CREATE TABLE `extracted_record_category` (
  `extracted_record_category_id` int NOT NULL AUTO_INCREMENT,
  `extracted_record_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`extracted_record_category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.monthly_analysis definition

CREATE TABLE `monthly_analysis` (
  `monthly_analysis_id` int NOT NULL AUTO_INCREMENT,
  `daily_avg` int NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `total` int NOT NULL,
  `mean` int NOT NULL,
  `variant` int NOT NULL,
  `board_id` int NOT NULL,
  `boardId` int DEFAULT NULL,
  PRIMARY KEY (`monthly_analysis_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- mcm_db.record definition

CREATE TABLE `record` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `board_id` int NOT NULL,
  PRIMARY KEY (`record_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;