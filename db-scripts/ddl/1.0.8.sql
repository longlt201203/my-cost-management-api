ALTER TABLE `monthly_analysis` ADD COLUMN `median` INT NOT NULL;

UPDATE `monthly_analysis` SET `median` = `mean`;

ALTER TABLE `monthly_analysis` DROP COLUMN `mean`;

-- mcm_api_db.yearly_analysis definition

CREATE TABLE `yearly_analysis` (
  `yearly_analysis_id` int NOT NULL AUTO_INCREMENT,
  `year` int NOT NULL,
  `month_avg` int NOT NULL,
  `total` int NOT NULL,
  `median` int NOT NULL,
  `variant` int NOT NULL,
  `boardId` int DEFAULT NULL,
  PRIMARY KEY (`yearly_analysis_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;