-- phpMyAdmin SQL Dump
-- version 2.11.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 06, 2010 at 11:30 PM
-- Server version: 5.0.41
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `krishna`
--

-- --------------------------------------------------------

--
-- Table structure for table `areas`
--

CREATE TABLE `areas` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  `short_name` varchar(10) NOT NULL,
  `manager` varchar(30) NOT NULL,
  `notes` text NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `areas`
--


-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `shift_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`),
  KEY `shift_id` (`shift_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `assignments`
--


-- --------------------------------------------------------

--
-- Table structure for table `boundaries`
--

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

--
-- Dumping data for table `boundaries`
--

INSERT INTO `boundaries` VALUES(1, 1, 1, '00:00:00', '08:15:00', -1);
INSERT INTO `boundaries` VALUES(2, 1, 2, '08:15:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(3, 1, 3, '12:00:00', '18:00:00', -1);
INSERT INTO `boundaries` VALUES(4, 1, 4, '18:00:00', '24:00:00', -1);
INSERT INTO `boundaries` VALUES(5, 2, 1, '00:00:00', '08:00:00', -1);
INSERT INTO `boundaries` VALUES(6, 2, 2, '08:00:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(7, 2, 3, '12:00:00', '18:00:00', -1);
INSERT INTO `boundaries` VALUES(8, 2, 4, '18:00:00', '24:00:00', -1);
INSERT INTO `boundaries` VALUES(9, 3, 1, '00:00:00', '08:15:00', -1);
INSERT INTO `boundaries` VALUES(10, 3, 2, '08:15:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(11, 3, 3, '12:00:00', '18:00:00', -1);
INSERT INTO `boundaries` VALUES(12, 3, 4, '18:00:00', '24:00:00', -1);
INSERT INTO `boundaries` VALUES(13, 4, 1, '00:00:00', '08:15:00', -1);
INSERT INTO `boundaries` VALUES(14, 4, 2, '08:15:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(15, 4, 3, '12:00:00', '18:00:00', -1);
INSERT INTO `boundaries` VALUES(16, 4, 4, '18:00:00', '24:00:00', -1);
INSERT INTO `boundaries` VALUES(17, 5, 1, '00:00:00', '08:15:00', -1);
INSERT INTO `boundaries` VALUES(18, 5, 2, '08:15:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(19, 5, 3, '12:00:00', '18:30:00', -1);
INSERT INTO `boundaries` VALUES(20, 5, 4, '18:30:00', '24:00:00', -1);
INSERT INTO `boundaries` VALUES(21, 6, 1, '00:00:00', '10:00:00', -1);
INSERT INTO `boundaries` VALUES(22, 6, 2, '10:00:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(23, 6, 3, '12:00:00', '18:00:00', -1);
INSERT INTO `boundaries` VALUES(24, 6, 4, '18:00:00', '24:00:00', -1);
INSERT INTO `boundaries` VALUES(25, 7, 1, '00:00:00', '08:30:00', -1);
INSERT INTO `boundaries` VALUES(26, 7, 2, '08:30:00', '12:00:00', -1);
INSERT INTO `boundaries` VALUES(27, 7, 3, '12:00:00', '18:00:00', -1);
INSERT INTO `boundaries` VALUES(28, 7, 4, '18:00:00', '24:00:00', -1);

-- --------------------------------------------------------

--
-- Table structure for table `changes`
--

CREATE TABLE `changes` (
  `id` int(11) NOT NULL,
  `description` text,
  `created` datetime NOT NULL,
  `schedule_id` int(11) NOT NULL,
  KEY `id` (`id`),
  KEY `schedule_id` (`schedule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `changes`
--


-- --------------------------------------------------------

--
-- Table structure for table `change_fields`
--

CREATE TABLE `change_fields` (
  `id` int(11) NOT NULL auto_increment,
  `change_id` int(11) NOT NULL,
  `change_model_id` int(11) NOT NULL,
  `field_key` varchar(30) NOT NULL,
  `field_old_val` longtext,
  `field_new_val` longtext,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `change_model_id` (`change_model_id`),
  KEY `change_id` (`change_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `change_fields`
--


-- --------------------------------------------------------

--
-- Table structure for table `change_models`
--

CREATE TABLE `change_models` (
  `id` int(11) NOT NULL auto_increment,
  `change_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `action` smallint(1) NOT NULL,
  `record_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `record_id` (`record_id`),
  KEY `change_id` (`change_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `change_models`
--


-- --------------------------------------------------------

--
-- Table structure for table `constant_shifts`
--

CREATE TABLE `constant_shifts` (
  `id` int(11) NOT NULL auto_increment,
  `resident_category_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `day_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `specify_hours` tinyint(1) NOT NULL,
  `hours` double default NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`),
  KEY `day_id` (`day_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `constant_shifts`
--


-- --------------------------------------------------------

--
-- Table structure for table `days`
--

CREATE TABLE `days` (
  `id` int(1) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `days`
--

INSERT INTO `days` VALUES(1, 'Monday', -1);
INSERT INTO `days` VALUES(2, 'Tuesday', -1);
INSERT INTO `days` VALUES(3, 'Wednesday', -1);
INSERT INTO `days` VALUES(4, 'Thursday', -1);
INSERT INTO `days` VALUES(5, 'Friday', -1);
INSERT INTO `days` VALUES(6, 'Saturday', -1);
INSERT INTO `days` VALUES(7, 'Sunday', -1);

-- --------------------------------------------------------

--
-- Table structure for table `floating_shifts`
--

CREATE TABLE `floating_shifts` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  `hours` float NOT NULL,
  `note` tinytext NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`),
  KEY `area_id` (`area_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `floating_shifts`
--

-- --------------------------------------------------------

--
-- Table structure for table `off_days`
--

CREATE TABLE `off_days` (
  `id` int(11) NOT NULL auto_increment,
  `day_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `off_days`
--


-- --------------------------------------------------------

--
-- Table structure for table `people`
--

CREATE TABLE `people` (
  `id` int(11) NOT NULL auto_increment,
  `first` varchar(30) NOT NULL,
  `last` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `people`
--


-- --------------------------------------------------------

--
-- Table structure for table `people_schedules`
--

CREATE TABLE `people_schedules` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `resident_category_id` int(11) NOT NULL,
  `notes` text NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `people_schedules`
--


-- --------------------------------------------------------

--
-- Table structure for table `resident_categories`
--

CREATE TABLE `resident_categories` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `resident_categories`
--

INSERT INTO `resident_categories` VALUES(1, 'YSC 1', -1);
INSERT INTO `resident_categories` VALUES(2, 'YSC 2', -1);
INSERT INTO `resident_categories` VALUES(3, 'YSL 1', -1);
INSERT INTO `resident_categories` VALUES(4, 'YSL 2', -1);
INSERT INTO `resident_categories` VALUES(5, 'Resident', -1);
INSERT INTO `resident_categories` VALUES(6, 'Intern', -1);

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  `user_id` int(11) default NULL,
  `updated` datetime NOT NULL,
  `parent_id` int(11) default NULL,
  `schedule_group_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=531 ;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` VALUES(-1, 'Published', NULL, '2010-08-04 15:36:29', NULL, 1);

-- --------------------------------------------------------

CREATE TABLE `schedule_groups` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`name` VARCHAR( 30 ) NOT NULL ,
`start` DATETIME NOT NULL ,
`end` DATETIME NOT NULL
) ENGINE = MYISAM;



--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL auto_increment,
  `key` text NOT NULL,
  `val` text NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `settings`
--


-- --------------------------------------------------------

--
-- Table structure for table `shifts`
--

CREATE TABLE `shifts` (
  `id` int(11) NOT NULL auto_increment,
  `area_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `num_people` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`),
  KEY `area_id` (`area_id`),
  KEY `day_id` (`day_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `shifts`
--


-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `schedule_id` (`schedule_id`,`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `slots`
--

INSERT INTO `slots` VALUES(1, 'Before Breakfast', -1);
INSERT INTO `slots` VALUES(2, 'Morning', -1);
INSERT INTO `slots` VALUES(3, 'Afternoon', -1);
INSERT INTO `slots` VALUES(4, 'After Dinner', -1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` char(50) default NULL,
  `password` char(40) default NULL,
  `email` varchar(50) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES(1, 'shantam', '705b958575bd82a33ac6ac798956924fb0205191', 'shantam@mountmadonna.org');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` VALUES(1, 1, 'operations');


-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `area_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;


-- --------------------------------------------------------

--
-- Table structure for table `request_areas`
--

CREATE TABLE `request_areas` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  `manager` varchar(30) NOT NULL,
  `notes` text NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table structure for table `request_assignments`
--

CREATE TABLE `request_assignments` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `request_shift_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `person_id` (`person_id`),
  KEY `request_shift_id` (`request_shift_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table structure for table `request_shifts`
--

CREATE TABLE `request_shifts` (
  `id` int(11) NOT NULL auto_increment,
  `request_area_id` int(11) NOT NULL,
  `day_id` int(11) NOT NULL,
  `start` time NOT NULL,
  `end` time NOT NULL,
  `num_people` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `area_id` (`request_area_id`),
  KEY `day_id` (`day_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;


-- --------------------------------------------------------

--
-- Table structure for table `request_floating_shifts`
--


CREATE TABLE `request_floating_shifts` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `request_area_id` int(11) NOT NULL,
  `hours` float NOT NULL,
  `note` tinytext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`),
  KEY `request_area_id` (`request_area_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE  `personnel_notes` (
	`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
	`person_id` INT NOT NULL ,
	`notes` TEXT NOT NULL ,
	`schedule_id` INT NOT NULL
) ENGINE = MYISAM;
