-- phpMyAdmin SQL Dump
-- version 2.11.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 15, 2010 at 10:07 PM
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
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` VALUES(1, 'Kitchen', 'K', 'Sunanda', 1);
INSERT INTO `areas` VALUES(2, 'CB', 'CB', 'Nicholash', 1);
INSERT INTO `areas` VALUES(3, 'Rock Crew', 'Rock', 'Ali Moren', 1);

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

INSERT INTO `boundaries` VALUES(1, 1, 1, '00:00:00', '08:15:00', 1);
INSERT INTO `boundaries` VALUES(2, 1, 2, '08:15:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(3, 1, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(4, 1, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(5, 2, 1, '00:00:00', '08:00:00', 1);
INSERT INTO `boundaries` VALUES(6, 2, 2, '08:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(7, 2, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(8, 2, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(9, 3, 1, '00:00:00', '08:15:00', 1);
INSERT INTO `boundaries` VALUES(10, 3, 2, '08:15:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(11, 3, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(12, 3, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(13, 4, 1, '00:00:00', '08:15:00', 1);
INSERT INTO `boundaries` VALUES(14, 4, 2, '08:15:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(15, 4, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(16, 4, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(17, 5, 1, '00:00:00', '08:15:00', 1);
INSERT INTO `boundaries` VALUES(18, 5, 2, '08:15:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(19, 5, 3, '12:00:00', '18:30:00', 1);
INSERT INTO `boundaries` VALUES(20, 5, 4, '18:30:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(21, 6, 1, '00:00:00', '10:00:00', 1);
INSERT INTO `boundaries` VALUES(22, 6, 2, '10:00:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(23, 6, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(24, 6, 4, '18:00:00', '24:00:00', 1);
INSERT INTO `boundaries` VALUES(25, 7, 1, '00:00:00', '08:30:00', 1);
INSERT INTO `boundaries` VALUES(26, 7, 2, '08:30:00', '12:00:00', 1);
INSERT INTO `boundaries` VALUES(27, 7, 3, '12:00:00', '18:00:00', 1);
INSERT INTO `boundaries` VALUES(28, 7, 4, '18:00:00', '24:00:00', 1);

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

INSERT INTO `changes` VALUES(1, 'New person created: Jason', '2010-07-15 22:05:52', 1);
INSERT INTO `changes` VALUES(0, 'New floating shift: CB; 1 hr  w/ Jason', '2010-07-15 22:05:58', 1);

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

INSERT INTO `change_fields` VALUES(1, 1, 1, 'person_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(2, 1, 1, 'resident_category_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(3, 1, 1, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(4, 1, 1, 'id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(5, 0, 2, 'area_id', NULL, '2', 1);
INSERT INTO `change_fields` VALUES(6, 0, 2, 'person_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(7, 0, 2, 'hours', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(8, 0, 2, 'note', NULL, '', 1);
INSERT INTO `change_fields` VALUES(9, 0, 2, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(10, 0, 2, 'id', NULL, '1', 1);

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

INSERT INTO `change_models` VALUES(1, 1, 'PeopleSchedules', 1, 1, 1);
INSERT INTO `change_models` VALUES(2, 0, 'FloatingShift', 1, 1, 1);

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

INSERT INTO `floating_shifts` VALUES(1, 1, 2, 1, '', 1);

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
  `first` varchar(30) NOT NULL,
  `middle` varchar(30) NOT NULL,
  `last` varchar(30) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `people`
--

INSERT INTO `people` VALUES(1, 'Jason', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `people_schedules`
--

CREATE TABLE `people_schedules` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `resident_category_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `schedule_id` (`schedule_id`,`person_id`),
  KEY `resident_category_id` (`resident_category_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `people_schedules`
--

INSERT INTO `people_schedules` VALUES(1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `profile_notes`
--

CREATE TABLE `profile_notes` (
  `id` int(11) NOT NULL auto_increment,
  `person_id` int(11) NOT NULL,
  `note` longtext NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `profile_id` (`person_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `profile_notes`
--

INSERT INTO `profile_notes` VALUES(1, 1, 'Person Created', '2010-07-15 22:05:52');

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
INSERT INTO `resident_categories` VALUES(4, 'YSL 2', 1);
INSERT INTO `resident_categories` VALUES(5, 'Resident', 1);
INSERT INTO `resident_categories` VALUES(6, 'Intern', 1);
INSERT INTO `resident_categories` VALUES(3, 'YSL 1', 1);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=112 ;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` VALUES(1, 'Published', NULL, '2010-05-26 22:04:02', NULL);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES(1, 'shantam', '705b958575bd82a33ac6ac798956924fb0205191', 'operations');
INSERT INTO `users` VALUES(2, 'sumitra', '705b958575bd82a33ac6ac798956924fb0205191', 'operations');
