-- phpMyAdmin SQL Dump
-- version 2.11.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 30, 2010 at 01:34 AM
-- Server version: 5.0.41
-- PHP Version: 5.2.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

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
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` VALUES(1, 'Kitchen', 'K', 'Sunanda', 1);
INSERT INTO `areas` VALUES(2, 'CB', 'CB', 'Nicholas', 1);

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
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
  KEY `branch_id` (`schedule_id`,`id`),
  KEY `day_id` (`day_id`),
  KEY `time_id` (`slot_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `boundaries`
--

INSERT INTO `boundaries` VALUES(1, 1, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(2, 1, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(3, 1, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(4, 1, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(5, 2, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(6, 2, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(7, 2, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(8, 2, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(9, 3, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(10, 3, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(11, 3, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(12, 3, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(13, 4, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(14, 4, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(15, 4, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(16, 4, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(17, 5, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(18, 5, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(19, 5, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(20, 5, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(21, 6, 1, '00:00:00', '10:00:00', 1);
INSERT INTO `boundaries` VALUES(22, 6, 2, '10:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(23, 6, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(24, 6, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(25, 7, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(26, 7, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(27, 7, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(28, 7, 4, '00:00:18', '00:00:24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `changes`
--

CREATE TABLE `changes` (
  `id` int(11) NOT NULL,
  `description` varchar(30) default NULL,
  `schedule_id` int(11) NOT NULL,
  KEY `id` (`id`),
  KEY `schedule_id` (`schedule_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `changes`
--

INSERT INTO `changes` VALUES(1, 'New Kitchen shift created', 1);
INSERT INTO `changes` VALUES(0, 'New Kitchen shift created', 1);

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

INSERT INTO `change_fields` VALUES(1, 1, 1, 'area_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(2, 1, 1, 'day_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(3, 1, 1, 'start', NULL, '13:00:00', 1);
INSERT INTO `change_fields` VALUES(4, 1, 1, 'end', NULL, '15:00:00', 1);
INSERT INTO `change_fields` VALUES(5, 1, 1, 'num_people', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(6, 1, 1, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(7, 1, 1, 'id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(8, 0, 2, 'area_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(9, 0, 2, 'day_id', NULL, '3', 1);
INSERT INTO `change_fields` VALUES(10, 0, 2, 'start', NULL, '13:30:00', 1);
INSERT INTO `change_fields` VALUES(11, 0, 2, 'end', NULL, '17:00:00', 1);
INSERT INTO `change_fields` VALUES(12, 0, 2, 'num_people', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(13, 0, 2, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(14, 0, 2, 'id', NULL, '2', 1);

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

INSERT INTO `change_models` VALUES(1, 1, 'Shift', 1, 1, 1);
INSERT INTO `change_models` VALUES(2, 0, 'Shift', 1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `constant_shifts`
--

CREATE TABLE `constant_shifts` (
  `id` int(11) NOT NULL auto_increment,
  `resident_category_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `day` int(11) NOT NULL,
  `start` double NOT NULL,
  `end` double NOT NULL,
  `length` double NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`)
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
  UNIQUE KEY `branch_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `days`
--

INSERT INTO `days` VALUES(1, 'Monday', 1);
INSERT INTO `days` VALUES(2, 'Tuesday', 1);
INSERT INTO `days` VALUES(3, 'Wednesday', 1);
INSERT INTO `days` VALUES(4, 'Thursday', 1);
INSERT INTO `days` VALUES(5, 'Friday', 1);
INSERT INTO `days` VALUES(6, 'Saturday', 1);
INSERT INTO `days` VALUES(7, 'Sunday', 1);

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
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
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
  `day` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
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
  `name` varchar(30) NOT NULL,
  `first` varchar(30) NOT NULL,
  `last` varchar(30) NOT NULL,
  `resident_category_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `people`
--

INSERT INTO `people` VALUES(1, 'Shantam', 'Jason', 'Galuten', 4, 1);

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

INSERT INTO `resident_categories` VALUES(1, 'YSC 1', 1);
INSERT INTO `resident_categories` VALUES(2, 'YSC 2', 1);
INSERT INTO `resident_categories` VALUES(3, 'YSL 2', 1);
INSERT INTO `resident_categories` VALUES(4, 'Resident', 1);
INSERT INTO `resident_categories` VALUES(5, 'Intern', 1);

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) default NULL,
  `user_id` int(11) default NULL,
  `updated` datetime default NULL,
  `parent_id` int(11) default NULL,
  PRIMARY KEY  (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` VALUES(1, NULL, NULL, '2010-05-26 22:04:02', NULL);

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

INSERT INTO `shifts` VALUES(1, 1, 1, '13:00:00', '15:00:00', 1, 1);
INSERT INTO `shifts` VALUES(2, 1, 3, '13:30:00', '17:00:00', 1, 1);

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

INSERT INTO `slots` VALUES(1, 'Before Breakfast', 1);
INSERT INTO `slots` VALUES(2, 'Morning', 1);
INSERT INTO `slots` VALUES(3, 'Afternoon', 1);
INSERT INTO `slots` VALUES(4, 'After Dinner', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `username` char(50) default NULL,
  `password` char(40) default NULL,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES(1, 'shantam', '705b958575bd82a33ac6ac798956924fb0205191', 'operations');
