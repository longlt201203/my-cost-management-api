ALTER TABLE `extracted_record` ADD `tmp_record_id` INT NOT NULL;

UPDATE `extracted_record` SET `tmp_record_id` = `record_id`;

ALTER TABLE `extracted_record` DROP COLUMN `record_id`,
    CHANGE COLUMN `tmp_record_id` `record_id` INT NOT NULL;