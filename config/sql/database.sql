-- MySQL dump 10.13  Distrib 5.1.55, for redhat-linux-gnu (i386)
--
-- Host: localhost    Database: scheduler
-- ------------------------------------------------------
-- Server version	5.1.55

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `areas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `short_name` varchar(10) NOT NULL,
  `manager` varchar(30) NOT NULL,
  `notes` text NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`),
  KEY `shift_id` (`shift_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `boundaries`
--

DROP TABLE IF EXISTS `boundaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `boundaries` (
  `id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `slot_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `schedule_id` int(11) NOT NULL,
  KEY `schedule_id` (`schedule_id`,`id`),
  KEY `day_id` (`day_id`),
  KEY `time_id` (`slot_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `boundaries`
--

LOCK TABLES `boundaries` WRITE;
/*!40000 ALTER TABLE `boundaries` DISABLE KEYS */;
INSERT INTO `boundaries` VALUES (28,7,4,'18:00:00','24:00:00',1),(27,7,3,'12:00:00','18:00:00',1),(26,7,2,'08:30:00','12:00:00',1),(25,7,1,'00:00:00','08:30:00',1),(24,6,4,'18:00:00','24:00:00',1),(23,6,3,'12:00:00','18:00:00',1),(22,6,2,'10:00:00','12:00:00',1),(21,6,1,'00:00:00','10:00:00',1),(20,5,4,'18:30:00','24:00:00',1),(19,5,3,'12:00:00','18:30:00',1),(18,5,2,'08:15:00','12:00:00',1),(17,5,1,'00:00:00','08:15:00',1),(16,4,4,'18:00:00','24:00:00',1),(15,4,3,'12:00:00','18:00:00',1),(14,4,2,'08:15:00','12:00:00',1),(13,4,1,'00:00:00','08:15:00',1),(12,3,4,'18:00:00','24:00:00',1),(11,3,3,'12:00:00','18:00:00',1),(10,3,2,'08:15:00','12:00:00',1),(9,3,1,'00:00:00','08:15:00',1),(8,2,4,'18:00:00','24:00:00',1),(7,2,3,'12:00:00','18:00:00',1),(6,2,2,'08:00:00','12:00:00',1),(5,2,1,'00:00:00','08:00:00',1),(4,1,4,'18:00:00','24:00:00',1),(3,1,3,'12:00:00','18:00:00',1),(2,1,2,'08:15:00','12:00:00',1),(1,1,1,'00:00:00','08:15:00',1);
/*!40000 ALTER TABLE `boundaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `change_fields`
--

DROP TABLE IF EXISTS `change_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `change_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `change_id` int(11) NOT NULL,
  `change_model_id` int(11) NOT NULL,
  `field_key` varchar(30) NOT NULL,
  `field_old_val` longtext,
  `field_new_val` longtext,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `change_model_id` (`change_model_id`),
  KEY `change_id` (`change_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `change_fields`
--

LOCK TABLES `change_fields` WRITE;
/*!40000 ALTER TABLE `change_fields` DISABLE KEYS */;
/*!40000 ALTER TABLE `change_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `change_models`
--

DROP TABLE IF EXISTS `change_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `change_models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `change_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `action` smallint(1) NOT NULL,
  `record_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `record_id` (`record_id`),
  KEY `change_id` (`change_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `change_models`
--

LOCK TABLES `change_models` WRITE;
/*!40000 ALTER TABLE `change_models` DISABLE KEYS */;
/*!40000 ALTER TABLE `change_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `changes`
--

DROP TABLE IF EXISTS `changes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `changes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` text,
  `created` datetime NOT NULL,
  `undone` tinyint(1) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  KEY `id` (`id`),
  KEY `schedule_id` (`schedule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `changes`
--

LOCK TABLES `changes` WRITE;
/*!40000 ALTER TABLE `changes` DISABLE KEYS */;
/*!40000 ALTER TABLE `changes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `constant_shifts`
--

DROP TABLE IF EXISTS `constant_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `constant_shifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resident_category_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `day_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `specify_hours` tinyint(1) NOT NULL,
  `hours` double DEFAULT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`),
  KEY `day_id` (`day_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `constant_shifts`
--

LOCK TABLES `constant_shifts` WRITE;
/*!40000 ALTER TABLE `constant_shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `constant_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `days`
--

DROP TABLE IF EXISTS `days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `days` (
  `id` int(1) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `days`
--

LOCK TABLES `days` WRITE;
/*!40000 ALTER TABLE `days` DISABLE KEYS */;
INSERT INTO `days` VALUES (1,'Monday',1),(2,'Tuesday',1),(3,'Wednesday',1),(4,'Thursday',1),(5,'Friday',1),(6,'Saturday',1),(7,'Sunday',1);
/*!40000 ALTER TABLE `days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_auths`
--

DROP TABLE IF EXISTS `email_auths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_auths` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_auths`
--

LOCK TABLES `email_auths` WRITE;
/*!40000 ALTER TABLE `email_auths` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_auths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floating_shifts`
--

DROP TABLE IF EXISTS `floating_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floating_shifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `hours` float NOT NULL,
  `note` tinytext NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`),
  KEY `area_id` (`area_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floating_shifts`
--

LOCK TABLES `floating_shifts` WRITE;
/*!40000 ALTER TABLE `floating_shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `floating_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `managers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managers`
--

LOCK TABLES `managers` WRITE;
/*!40000 ALTER TABLE `managers` DISABLE KEYS */;
/*!40000 ALTER TABLE `managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `off_days`
--

DROP TABLE IF EXISTS `off_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `off_days` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `off_days`
--

LOCK TABLES `off_days` WRITE;
/*!40000 ALTER TABLE `off_days` DISABLE KEYS */;
/*!40000 ALTER TABLE `off_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operations_notes`
--

DROP TABLE IF EXISTS `operations_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operations_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `note` text NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operations_notes`
--

LOCK TABLES `operations_notes` WRITE;
/*!40000 ALTER TABLE `operations_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `operations_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people`
--

DROP TABLE IF EXISTS `people`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first` varchar(30) NOT NULL,
  `last` varchar(30) NOT NULL,
  `display_name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people`
--

LOCK TABLES `people` WRITE;
/*!40000 ALTER TABLE `people` DISABLE KEYS */;
/*!40000 ALTER TABLE `people` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `people_schedules`
--

DROP TABLE IF EXISTS `people_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `people_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `resident_category_id` int(11) NOT NULL,
  `notes` text NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `people_schedules`
--

LOCK TABLES `people_schedules` WRITE;
/*!40000 ALTER TABLE `people_schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `people_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personnel_notes`
--

DROP TABLE IF EXISTS `personnel_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personnel_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `person_id` int(11) NOT NULL,
  `note` text NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personnel_notes`
--

LOCK TABLES `personnel_notes` WRITE;
/*!40000 ALTER TABLE `personnel_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `personnel_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resident_categories`
--

DROP TABLE IF EXISTS `resident_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resident_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `color` varchar(7) NOT NULL,
	`sort_order` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resident_categories`
--

LOCK TABLES `resident_categories` WRITE;
/*!40000 ALTER TABLE `resident_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `resident_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,1,'operations');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_groups`
--

DROP TABLE IF EXISTS `schedule_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedule_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_groups`
--

LOCK TABLES `schedule_groups` WRITE;
/*!40000 ALTER TABLE `schedule_groups` DISABLE KEYS */;
INSERT INTO `schedule_groups` VALUES (1,'First Schedule','2011-01-01 00:00:00','2011-01-01 00:00:00');
/*!40000 ALTER TABLE `schedule_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `updated` datetime NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `schedule_group_id` int(11) NOT NULL,
  `request` int(1) NOT NULL DEFAULT '0',
  `template` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'Published',NULL,'2011-01-01 00:00:00',NULL,1,0,0);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` text NOT NULL,
  `val` text NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shifts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `area_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `num_people` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `area_id` (`area_id`),
  KEY `day_id` (`day_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `slots`
--

DROP TABLE IF EXISTS `slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `slots`
--

LOCK TABLES `slots` WRITE;
/*!40000 ALTER TABLE `slots` DISABLE KEYS */;
INSERT INTO `slots` VALUES (3,'Afternoon',1),(2,'Morning',1),(1,'Before Breakfast',1),(4,'After Dinner',1);
/*!40000 ALTER TABLE `slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(50) DEFAULT NULL,
  `password` char(40) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `notes` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','00173e0f483ee037d3aa18fb72925322450e5874','','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2011-03-10 10:38:57
