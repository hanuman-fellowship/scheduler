-- phpMyAdmin SQL Dump
-- version 2.11.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 05, 2010 at 01:11 PM
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
  `notes` text NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `areas`
--

INSERT INTO `areas` VALUES(1, 'Kitchen', 'K', 'Sunanda', '', 528);
INSERT INTO `areas` VALUES(2, 'Dining Room', 'DR', 'Elmira', '', 528);
INSERT INTO `areas` VALUES(3, 'Recycling', 'Recyc', 'Vishwanath', '', 528);
INSERT INTO `areas` VALUES(4, 'Garden', 'G', 'Manorath', '', 528);
INSERT INTO `areas` VALUES(5, 'Maintenance', 'Maint', 'Michael', '', 528);
INSERT INTO `areas` VALUES(6, 'Temple', 'T', 'Janardan', '', 528);
INSERT INTO `areas` VALUES(7, 'CB', 'CB', 'Deneen', '', 528);
INSERT INTO `areas` VALUES(8, 'Programs Housekeeping', 'PH', 'Stephanie', '', 528);
INSERT INTO `areas` VALUES(9, 'CC Housekeeping', 'CC Hskp', 'Sarita', '', 528);
INSERT INTO `areas` VALUES(10, 'Reception Office', 'RO', 'Sumitra B.', '', 528);
INSERT INTO `areas` VALUES(11, 'CC Landscaping', 'CC Land', 'Dharmanand', '', 528);
INSERT INTO `areas` VALUES(12, 'Flowers', 'Flowers', 'Deneen', '', 528);
INSERT INTO `areas` VALUES(13, 'Sarita/Kishori', 'S/K', 'Ali', '', 528);
INSERT INTO `areas` VALUES(15, 'Dishes', 'Dish', 'Ali', '', 528);
INSERT INTO `areas` VALUES(16, 'Tea', 'Tea', 'Arpita', '', 528);
INSERT INTO `areas` VALUES(17, 'Asana', 'Asana', 'Muneesh', '', 528);
INSERT INTO `areas` VALUES(18, 'Graphics', 'Graphics', 'Jamal', '', 528);
INSERT INTO `areas` VALUES(19, 'IT', 'IT', 'Ryk', '', 528);
INSERT INTO `areas` VALUES(20, 'Rock Crew', 'Rock', 'Babaji', '', 528);

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

INSERT INTO `assignments` VALUES(1, 13, 102, 528);
INSERT INTO `assignments` VALUES(2, 13, 163, 528);
INSERT INTO `assignments` VALUES(3, 13, 126, 528);
INSERT INTO `assignments` VALUES(4, 13, 164, 528);
INSERT INTO `assignments` VALUES(5, 13, 165, 528);
INSERT INTO `assignments` VALUES(6, 13, 75, 528);
INSERT INTO `assignments` VALUES(7, 13, 63, 528);
INSERT INTO `assignments` VALUES(8, 18, 128, 528);
INSERT INTO `assignments` VALUES(9, 18, 168, 528);
INSERT INTO `assignments` VALUES(10, 18, 166, 528);
INSERT INTO `assignments` VALUES(11, 18, 167, 528);
INSERT INTO `assignments` VALUES(12, 18, 70, 528);
INSERT INTO `assignments` VALUES(13, 18, 75, 528);
INSERT INTO `assignments` VALUES(14, 8, 169, 528);
INSERT INTO `assignments` VALUES(15, 7, 32, 528);
INSERT INTO `assignments` VALUES(16, 7, 14, 528);
INSERT INTO `assignments` VALUES(17, 7, 131, 528);
INSERT INTO `assignments` VALUES(18, 7, 184, 528);
INSERT INTO `assignments` VALUES(19, 12, 173, 528);
INSERT INTO `assignments` VALUES(21, 14, 46, 528);
INSERT INTO `assignments` VALUES(22, 14, 170, 528);
INSERT INTO `assignments` VALUES(23, 14, 172, 528);
INSERT INTO `assignments` VALUES(24, 14, 128, 528);
INSERT INTO `assignments` VALUES(25, 14, 62, 528);
INSERT INTO `assignments` VALUES(26, 14, 53, 528);
INSERT INTO `assignments` VALUES(27, 14, 64, 528);
INSERT INTO `assignments` VALUES(28, 14, 96, 528);
INSERT INTO `assignments` VALUES(29, 14, 114, 528);
INSERT INTO `assignments` VALUES(30, 14, 54, 528);
INSERT INTO `assignments` VALUES(31, 12, 99, 528);
INSERT INTO `assignments` VALUES(32, 12, 69, 528);
INSERT INTO `assignments` VALUES(33, 12, 33, 528);
INSERT INTO `assignments` VALUES(34, 12, 116, 528);
INSERT INTO `assignments` VALUES(35, 11, 130, 528);
INSERT INTO `assignments` VALUES(36, 12, 77, 528);
INSERT INTO `assignments` VALUES(37, 7, 185, 528);
INSERT INTO `assignments` VALUES(38, 20, 180, 528);
INSERT INTO `assignments` VALUES(39, 20, 174, 528);
INSERT INTO `assignments` VALUES(40, 20, 181, 528);
INSERT INTO `assignments` VALUES(41, 20, 175, 528);
INSERT INTO `assignments` VALUES(42, 20, 176, 528);
INSERT INTO `assignments` VALUES(43, 20, 127, 528);
INSERT INTO `assignments` VALUES(44, 20, 178, 528);
INSERT INTO `assignments` VALUES(45, 20, 179, 528);
INSERT INTO `assignments` VALUES(46, 20, 184, 528);
INSERT INTO `assignments` VALUES(47, 20, 183, 528);
INSERT INTO `assignments` VALUES(48, 20, 185, 528);
INSERT INTO `assignments` VALUES(50, 20, 68, 528);
INSERT INTO `assignments` VALUES(51, 11, 109, 528);
INSERT INTO `assignments` VALUES(52, 11, 187, 528);
INSERT INTO `assignments` VALUES(53, 11, 107, 528);
INSERT INTO `assignments` VALUES(54, 11, 90, 528);
INSERT INTO `assignments` VALUES(56, 11, 65, 528);
INSERT INTO `assignments` VALUES(57, 11, 189, 528);
INSERT INTO `assignments` VALUES(58, 10, 41, 528);
INSERT INTO `assignments` VALUES(59, 10, 39, 528);
INSERT INTO `assignments` VALUES(60, 10, 48, 528);
INSERT INTO `assignments` VALUES(61, 10, 93, 528);
INSERT INTO `assignments` VALUES(62, 10, 190, 528);
INSERT INTO `assignments` VALUES(63, 10, 122, 528);
INSERT INTO `assignments` VALUES(64, 10, 131, 528);
INSERT INTO `assignments` VALUES(65, 3, 1, 528);
INSERT INTO `assignments` VALUES(66, 3, 8, 528);
INSERT INTO `assignments` VALUES(67, 3, 66, 528);
INSERT INTO `assignments` VALUES(68, 3, 118, 528);
INSERT INTO `assignments` VALUES(69, 3, 13, 528);
INSERT INTO `assignments` VALUES(71, 3, 159, 528);
INSERT INTO `assignments` VALUES(72, 3, 100, 528);
INSERT INTO `assignments` VALUES(73, 3, 120, 528);
INSERT INTO `assignments` VALUES(74, 3, 15, 528);
INSERT INTO `assignments` VALUES(75, 3, 160, 528);
INSERT INTO `assignments` VALUES(76, 3, 148, 528);
INSERT INTO `assignments` VALUES(78, 9, 105, 528);
INSERT INTO `assignments` VALUES(79, 9, 191, 528);
INSERT INTO `assignments` VALUES(80, 9, 192, 528);
INSERT INTO `assignments` VALUES(81, 9, 65, 528);
INSERT INTO `assignments` VALUES(82, 9, 131, 528);
INSERT INTO `assignments` VALUES(83, 9, 11, 528);
INSERT INTO `assignments` VALUES(84, 6, 32, 528);
INSERT INTO `assignments` VALUES(85, 6, 8, 528);
INSERT INTO `assignments` VALUES(86, 6, 98, 528);
INSERT INTO `assignments` VALUES(87, 6, 111, 528);
INSERT INTO `assignments` VALUES(88, 6, 38, 528);
INSERT INTO `assignments` VALUES(89, 6, 40, 528);
INSERT INTO `assignments` VALUES(90, 6, 70, 528);
INSERT INTO `assignments` VALUES(91, 6, 130, 528);
INSERT INTO `assignments` VALUES(92, 6, 30, 528);
INSERT INTO `assignments` VALUES(93, 5, 80, 528);
INSERT INTO `assignments` VALUES(94, 5, 97, 528);
INSERT INTO `assignments` VALUES(95, 5, 91, 528);
INSERT INTO `assignments` VALUES(96, 5, 104, 528);
INSERT INTO `assignments` VALUES(97, 5, 43, 528);
INSERT INTO `assignments` VALUES(98, 5, 26, 528);
INSERT INTO `assignments` VALUES(99, 5, 140, 528);
INSERT INTO `assignments` VALUES(100, 5, 49, 528);
INSERT INTO `assignments` VALUES(101, 5, 193, 528);
INSERT INTO `assignments` VALUES(102, 5, 33, 528);
INSERT INTO `assignments` VALUES(103, 19, 25, 528);
INSERT INTO `assignments` VALUES(104, 19, 58, 528);
INSERT INTO `assignments` VALUES(105, 19, 134, 528);
INSERT INTO `assignments` VALUES(106, 19, 67, 528);
INSERT INTO `assignments` VALUES(107, 19, 93, 528);
INSERT INTO `assignments` VALUES(108, 19, 88, 528);
INSERT INTO `assignments` VALUES(109, 2, 106, 528);
INSERT INTO `assignments` VALUES(110, 2, 194, 528);
INSERT INTO `assignments` VALUES(111, 2, 67, 528);
INSERT INTO `assignments` VALUES(112, 2, 84, 528);
INSERT INTO `assignments` VALUES(113, 2, 18, 528);
INSERT INTO `assignments` VALUES(114, 2, 33, 528);
INSERT INTO `assignments` VALUES(115, 2, 138, 528);
INSERT INTO `assignments` VALUES(116, 2, 121, 528);
INSERT INTO `assignments` VALUES(117, 2, 45, 528);
INSERT INTO `assignments` VALUES(118, 2, 151, 528);
INSERT INTO `assignments` VALUES(119, 1, 35, 528);
INSERT INTO `assignments` VALUES(120, 1, 83, 528);
INSERT INTO `assignments` VALUES(121, 1, 103, 528);
INSERT INTO `assignments` VALUES(122, 1, 27, 528);
INSERT INTO `assignments` VALUES(123, 1, 136, 528);
INSERT INTO `assignments` VALUES(124, 1, 101, 528);
INSERT INTO `assignments` VALUES(125, 1, 88, 528);
INSERT INTO `assignments` VALUES(126, 1, 16, 528);
INSERT INTO `assignments` VALUES(127, 4, 195, 528);
INSERT INTO `assignments` VALUES(128, 4, 196, 528);
INSERT INTO `assignments` VALUES(129, 4, 197, 528);
INSERT INTO `assignments` VALUES(130, 4, 60, 528);
INSERT INTO `assignments` VALUES(131, 4, 10, 528);
INSERT INTO `assignments` VALUES(132, 4, 130, 528);
INSERT INTO `assignments` VALUES(133, 4, 96, 528);
INSERT INTO `assignments` VALUES(134, 17, 32, 528);
INSERT INTO `assignments` VALUES(135, 17, 82, 528);
INSERT INTO `assignments` VALUES(136, 17, 117, 528);
INSERT INTO `assignments` VALUES(137, 17, 98, 528);
INSERT INTO `assignments` VALUES(138, 17, 10, 528);
INSERT INTO `assignments` VALUES(139, 17, 115, 528);
INSERT INTO `assignments` VALUES(140, 17, 87, 528);
INSERT INTO `assignments` VALUES(141, 17, 29, 528);
INSERT INTO `assignments` VALUES(142, 17, 149, 528);
INSERT INTO `assignments` VALUES(143, 17, 96, 528);
INSERT INTO `assignments` VALUES(144, 16, 142, 528);
INSERT INTO `assignments` VALUES(145, 16, 91, 528);
INSERT INTO `assignments` VALUES(146, 16, 104, 528);
INSERT INTO `assignments` VALUES(147, 16, 161, 528);
INSERT INTO `assignments` VALUES(148, 16, 119, 528);
INSERT INTO `assignments` VALUES(149, 16, 4, 528);
INSERT INTO `assignments` VALUES(150, 16, 28, 528);
INSERT INTO `assignments` VALUES(151, 16, 78, 528);
INSERT INTO `assignments` VALUES(166, 19, 202, 528);
INSERT INTO `assignments` VALUES(175, 8, 94, 528);
INSERT INTO `assignments` VALUES(176, 8, 148, 528);
INSERT INTO `assignments` VALUES(177, 13, 94, 528);
INSERT INTO `assignments` VALUES(185, 14, 67, 528);
INSERT INTO `assignments` VALUES(186, 17, 50, 528);
INSERT INTO `assignments` VALUES(243, 12, 147, 528);
INSERT INTO `assignments` VALUES(248, 4, 205, 528);
INSERT INTO `assignments` VALUES(249, 4, 206, 528);
INSERT INTO `assignments` VALUES(250, 18, 207, 528);
INSERT INTO `assignments` VALUES(251, 7, 199, 528);

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

INSERT INTO `boundaries` VALUES(1, 1, 1, '00:00:00', '08:15:00', 528);
INSERT INTO `boundaries` VALUES(2, 1, 2, '08:15:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(3, 1, 3, '12:00:00', '18:00:00', 528);
INSERT INTO `boundaries` VALUES(4, 1, 4, '18:00:00', '24:00:00', 528);
INSERT INTO `boundaries` VALUES(5, 2, 1, '00:00:00', '08:00:00', 528);
INSERT INTO `boundaries` VALUES(6, 2, 2, '08:00:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(7, 2, 3, '12:00:00', '18:00:00', 528);
INSERT INTO `boundaries` VALUES(8, 2, 4, '18:00:00', '24:00:00', 528);
INSERT INTO `boundaries` VALUES(9, 3, 1, '00:00:00', '08:15:00', 528);
INSERT INTO `boundaries` VALUES(10, 3, 2, '08:15:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(11, 3, 3, '12:00:00', '18:00:00', 528);
INSERT INTO `boundaries` VALUES(12, 3, 4, '18:00:00', '24:00:00', 528);
INSERT INTO `boundaries` VALUES(13, 4, 1, '00:00:00', '08:15:00', 528);
INSERT INTO `boundaries` VALUES(14, 4, 2, '08:15:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(15, 4, 3, '12:00:00', '18:00:00', 528);
INSERT INTO `boundaries` VALUES(16, 4, 4, '18:00:00', '24:00:00', 528);
INSERT INTO `boundaries` VALUES(17, 5, 1, '00:00:00', '08:15:00', 528);
INSERT INTO `boundaries` VALUES(18, 5, 2, '08:15:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(19, 5, 3, '12:00:00', '18:30:00', 528);
INSERT INTO `boundaries` VALUES(20, 5, 4, '18:30:00', '24:00:00', 528);
INSERT INTO `boundaries` VALUES(21, 6, 1, '00:00:00', '10:00:00', 528);
INSERT INTO `boundaries` VALUES(22, 6, 2, '10:00:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(23, 6, 3, '12:00:00', '18:00:00', 528);
INSERT INTO `boundaries` VALUES(24, 6, 4, '18:00:00', '24:00:00', 528);
INSERT INTO `boundaries` VALUES(25, 7, 1, '00:00:00', '08:30:00', 528);
INSERT INTO `boundaries` VALUES(26, 7, 2, '08:30:00', '12:00:00', 528);
INSERT INTO `boundaries` VALUES(27, 7, 3, '12:00:00', '18:00:00', 528);
INSERT INTO `boundaries` VALUES(28, 7, 4, '18:00:00', '24:00:00', 528);

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
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`),
  KEY `day_id` (`day_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `constant_shifts`
--

INSERT INTO `constant_shifts` VALUES(1, 1, 'Theme Discussion', 2, '11:00:00', '12:45:00', 1, 2, 528);
INSERT INTO `constant_shifts` VALUES(2, 1, 'Theme Discussion', 2, '19:15:00', '21:00:00', 1, 0, 528);
INSERT INTO `constant_shifts` VALUES(3, 1, 'Check In', 4, '19:15:00', '21:00:00', 1, 2, 528);
INSERT INTO `constant_shifts` VALUES(4, 2, 'Theme Discussion', 2, '11:00:00', '12:45:00', 1, 2, 528);
INSERT INTO `constant_shifts` VALUES(5, 2, 'Theme Discussion', 2, '19:15:00', '21:00:00', 1, 0, 528);
INSERT INTO `constant_shifts` VALUES(6, 2, 'Check In', 4, '10:00:00', '12:00:00', 1, 2, 528);
INSERT INTO `constant_shifts` VALUES(7, 3, 'Theme Discussion', 2, '11:00:00', '12:45:00', 1, 2, 528);
INSERT INTO `constant_shifts` VALUES(8, 3, 'Theme Discussion', 2, '19:15:00', '21:00:00', 1, 0, 528);
INSERT INTO `constant_shifts` VALUES(9, 3, 'Check In', 4, '10:00:00', '12:00:00', 1, 2, 528);
INSERT INTO `constant_shifts` VALUES(10, 5, 'Doomsday', 3, '13:00:00', '14:00:00', 0, NULL, 528);

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

INSERT INTO `days` VALUES(1, 'Monday', 528);
INSERT INTO `days` VALUES(2, 'Tuesday', 528);
INSERT INTO `days` VALUES(3, 'Wednesday', 528);
INSERT INTO `days` VALUES(4, 'Thursday', 528);
INSERT INTO `days` VALUES(5, 'Friday', 528);
INSERT INTO `days` VALUES(6, 'Saturday', 528);
INSERT INTO `days` VALUES(7, 'Sunday', 528);

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

INSERT INTO `floating_shifts` VALUES(295, 139, 49, 14, 'MMI', 528);
INSERT INTO `floating_shifts` VALUES(323, 154, 39, 10, '', 528);
INSERT INTO `floating_shifts` VALUES(344, 184, 56, 21.5, '', 528);
INSERT INTO `floating_shifts` VALUES(515, 213, 22, 2, '', 528);
INSERT INTO `floating_shifts` VALUES(518, 116, 56, 1.5, '', 528);
INSERT INTO `floating_shifts` VALUES(519, 225, 54, 30, '', 528);
INSERT INTO `floating_shifts` VALUES(556, 244, 44, 13.5, '', 528);
INSERT INTO `floating_shifts` VALUES(567, 86, 22, 8.5, '', 528);
INSERT INTO `floating_shifts` VALUES(596, 86, 59, 7, '', 528);
INSERT INTO `floating_shifts` VALUES(623, 162, 34, 10, '', 528);
INSERT INTO `floating_shifts` VALUES(627, 18, 24, 2, '', 528);
INSERT INTO `floating_shifts` VALUES(628, 18, 6, 5, '', 528);
INSERT INTO `floating_shifts` VALUES(635, 222, 21, 0.5, '', 528);
INSERT INTO `floating_shifts` VALUES(639, 184, 59, 2, '', 528);
INSERT INTO `floating_shifts` VALUES(648, 283, 44, 2, '', 528);
INSERT INTO `floating_shifts` VALUES(658, 297, 60, 26, '', 528);
INSERT INTO `floating_shifts` VALUES(663, 163, 60, 1.5, '', 528);
INSERT INTO `floating_shifts` VALUES(666, 18, 31, 2, '', 528);
INSERT INTO `floating_shifts` VALUES(669, 8, 7, 1, '', 528);
INSERT INTO `floating_shifts` VALUES(670, 8, 1, 1, '', 528);
INSERT INTO `floating_shifts` VALUES(671, 17, 15, 1, '', 528);

-- --------------------------------------------------------

--
-- Table structure for table `houses`
--

CREATE TABLE `houses` (
  `id` int(11) NOT NULL auto_increment,
  `house_category_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `cat` tinyint(1) NOT NULL,
  `size` smallint(6) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `house_category_id` (`house_category_id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `houses`
--


-- --------------------------------------------------------

--
-- Table structure for table `house_categories`
--

CREATE TABLE `house_categories` (
  `id` int(11) NOT NULL auto_increment,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `house_categories`
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
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `off_days`
--

INSERT INTO `off_days` VALUES(1, 1, 13, 528);
INSERT INTO `off_days` VALUES(2, 6, 13, 528);
INSERT INTO `off_days` VALUES(3, 7, 13, 528);
INSERT INTO `off_days` VALUES(4, 7, 8, 528);
INSERT INTO `off_days` VALUES(5, 3, 14, 528);
INSERT INTO `off_days` VALUES(6, 3, 12, 528);
INSERT INTO `off_days` VALUES(7, 6, 20, 528);
INSERT INTO `off_days` VALUES(8, 7, 20, 528);
INSERT INTO `off_days` VALUES(9, 1, 11, 528);
INSERT INTO `off_days` VALUES(10, 3, 11, 528);
INSERT INTO `off_days` VALUES(11, 5, 10, 528);
INSERT INTO `off_days` VALUES(12, 7, 3, 528);
INSERT INTO `off_days` VALUES(13, 1, 9, 528);
INSERT INTO `off_days` VALUES(14, 5, 9, 528);
INSERT INTO `off_days` VALUES(15, 7, 6, 528);
INSERT INTO `off_days` VALUES(16, 6, 5, 528);
INSERT INTO `off_days` VALUES(17, 7, 5, 528);
INSERT INTO `off_days` VALUES(18, 5, 19, 528);
INSERT INTO `off_days` VALUES(19, 7, 19, 528);
INSERT INTO `off_days` VALUES(20, 6, 2, 528);
INSERT INTO `off_days` VALUES(21, 7, 1, 528);
INSERT INTO `off_days` VALUES(22, 5, 4, 528);
INSERT INTO `off_days` VALUES(23, 7, 4, 528);
INSERT INTO `off_days` VALUES(24, 3, 17, 528);
INSERT INTO `off_days` VALUES(25, 7, 17, 528);
INSERT INTO `off_days` VALUES(26, 6, 16, 528);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=313 ;

--
-- Dumping data for table `people`
--

INSERT INTO `people` VALUES(17, '', '', 'Radhika');
INSERT INTO `people` VALUES(18, '', '', 'Shantam');
INSERT INTO `people` VALUES(49, '', '', 'Shekar');
INSERT INTO `people` VALUES(71, '', '', 'Thecla');
INSERT INTO `people` VALUES(86, '', '', 'Kevin');
INSERT INTO `people` VALUES(98, '', '', 'Jarica');
INSERT INTO `people` VALUES(99, '', '', 'Barnaby ');
INSERT INTO `people` VALUES(116, '', '', 'Stephanie');
INSERT INTO `people` VALUES(135, '', '', 'Sudarsan');
INSERT INTO `people` VALUES(139, '', '', 'Lori');
INSERT INTO `people` VALUES(154, '', '', 'Richard');
INSERT INTO `people` VALUES(162, '', '', 'Yogeshwar');
INSERT INTO `people` VALUES(163, '', '', 'Kara');
INSERT INTO `people` VALUES(175, '', '', 'Rebecca');
INSERT INTO `people` VALUES(178, '', '', 'Joel');
INSERT INTO `people` VALUES(184, '', '', 'Sumitra Ann');
INSERT INTO `people` VALUES(197, '', '', 'Amita ');
INSERT INTO `people` VALUES(213, '', '', 'Rob');
INSERT INTO `people` VALUES(222, '', '', 'Felicia');
INSERT INTO `people` VALUES(225, '', '', 'Manorath');
INSERT INTO `people` VALUES(229, '', '', 'Andrea');
INSERT INTO `people` VALUES(238, '', '', 'George');
INSERT INTO `people` VALUES(239, '', '', ' Abha Susan');
INSERT INTO `people` VALUES(243, '', '', 'Brandon');
INSERT INTO `people` VALUES(244, '', '', 'Jody');
INSERT INTO `people` VALUES(250, '', '', 'Tamar ');
INSERT INTO `people` VALUES(261, '', '', 'Parmita');
INSERT INTO `people` VALUES(270, '', '', 'Terry');
INSERT INTO `people` VALUES(272, '', '', 'Pradeep');
INSERT INTO `people` VALUES(275, '', '', 'Andrew');
INSERT INTO `people` VALUES(276, '', '', 'Samara');
INSERT INTO `people` VALUES(277, '', '', 'Susie');
INSERT INTO `people` VALUES(282, '', '', 'Sarah');
INSERT INTO `people` VALUES(283, '', '', 'Mike');
INSERT INTO `people` VALUES(285, '', '', 'Chiara');
INSERT INTO `people` VALUES(286, '', '', 'Morgan');
INSERT INTO `people` VALUES(287, '', '', 'Nicholas');
INSERT INTO `people` VALUES(288, '', '', 'DeNa');
INSERT INTO `people` VALUES(289, '', '', 'Megan');
INSERT INTO `people` VALUES(291, '', '', 'Michelle');
INSERT INTO `people` VALUES(292, '', '', 'Daniel');
INSERT INTO `people` VALUES(293, '', '', 'Clay');
INSERT INTO `people` VALUES(296, '', '', 'Meghan S ');
INSERT INTO `people` VALUES(297, '', '', 'Kamalesh');
INSERT INTO `people` VALUES(298, '', '', 'Adrienne');
INSERT INTO `people` VALUES(1, '', '', 'Michelle');
INSERT INTO `people` VALUES(2, '', '', 'Sarah');
INSERT INTO `people` VALUES(3, '', '', 'Yuko');
INSERT INTO `people` VALUES(4, '', '', 'Chi Shan');
INSERT INTO `people` VALUES(5, '', '', 'Gil');
INSERT INTO `people` VALUES(6, '', '', 'Minty');
INSERT INTO `people` VALUES(7, '', '', 'Liz');
INSERT INTO `people` VALUES(8, '', '', 'Bequia');
INSERT INTO `people` VALUES(9, '', '', 'Vinod');
INSERT INTO `people` VALUES(10, '', '', 'Patricia');
INSERT INTO `people` VALUES(11, '', '', 'Luce');
INSERT INTO `people` VALUES(12, '', '', 'Katherine');
INSERT INTO `people` VALUES(13, '', '', 'Eric');
INSERT INTO `people` VALUES(14, '', '', 'Elmira');
INSERT INTO `people` VALUES(19, '', '', 'Ron');
INSERT INTO `people` VALUES(16, '', '', 'Kaycie');
INSERT INTO `people` VALUES(20, '', '', 'Ryk');
INSERT INTO `people` VALUES(21, '', '', 'Bag Boy');
INSERT INTO `people` VALUES(299, 'Mary', 'Jensen', '');
INSERT INTO `people` VALUES(300, 'A', 'O', '');
INSERT INTO `people` VALUES(301, 'Coo', 'Mickers', '');
INSERT INTO `people` VALUES(302, 'Lady', 'Anderson', '');
INSERT INTO `people` VALUES(303, 'Rack', 'Bigers', '');
INSERT INTO `people` VALUES(304, 'Chho', 'Monie', '');
INSERT INTO `people` VALUES(305, 'Lag', 'Ranku', '');
INSERT INTO `people` VALUES(306, 'Dig', 'Monnie', '');
INSERT INTO `people` VALUES(307, 'Boolom', 'Fork', '');
INSERT INTO `people` VALUES(308, 'Chack', 'Shom', '');
INSERT INTO `people` VALUES(309, 'Kid', 'Ligley', '');
INSERT INTO `people` VALUES(310, 'Ug', 'Wearewr', '');
INSERT INTO `people` VALUES(311, 'Chick', 'McC', '');
INSERT INTO `people` VALUES(312, 'Hammer', 'Stien', '');

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=209 ;

--
-- Dumping data for table `people_schedules`
--

INSERT INTO `people_schedules` VALUES(174, 1, 1, '', 528);
INSERT INTO `people_schedules` VALUES(175, 2, 1, '', 528);
INSERT INTO `people_schedules` VALUES(176, 3, 3, '', 528);
INSERT INTO `people_schedules` VALUES(177, 4, 1, '', 528);
INSERT INTO `people_schedules` VALUES(178, 5, 1, '', 528);
INSERT INTO `people_schedules` VALUES(179, 6, 1, '', 528);
INSERT INTO `people_schedules` VALUES(180, 7, 3, '', 528);
INSERT INTO `people_schedules` VALUES(181, 8, 3, '', 528);
INSERT INTO `people_schedules` VALUES(182, 9, 2, '', 528);
INSERT INTO `people_schedules` VALUES(183, 10, 2, '', 528);
INSERT INTO `people_schedules` VALUES(184, 11, 2, '', 528);
INSERT INTO `people_schedules` VALUES(185, 12, 2, '', 528);
INSERT INTO `people_schedules` VALUES(186, 13, 4, '', 528);
INSERT INTO `people_schedules` VALUES(187, 14, 2, '', 528);
INSERT INTO `people_schedules` VALUES(188, 19, 1, '', 528);
INSERT INTO `people_schedules` VALUES(189, 16, 1, '', 528);
INSERT INTO `people_schedules` VALUES(190, 17, 1, '', 528);
INSERT INTO `people_schedules` VALUES(191, 18, 4, '', 528);
INSERT INTO `people_schedules` VALUES(192, 20, 4, '', 528);
INSERT INTO `people_schedules` VALUES(193, 21, 1, '', 528);
INSERT INTO `people_schedules` VALUES(194, 312, 5, '', 528);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=17 ;

--
-- Dumping data for table `profile_notes`
--

INSERT INTO `profile_notes` VALUES(1, 299, 'Person created', '2010-08-02 08:59:40');
INSERT INTO `profile_notes` VALUES(2, 300, 'Person created', '2010-08-02 08:59:49');
INSERT INTO `profile_notes` VALUES(3, 301, 'Person created', '2010-08-02 08:59:56');
INSERT INTO `profile_notes` VALUES(4, 302, 'Person created', '2010-08-02 09:00:06');
INSERT INTO `profile_notes` VALUES(5, 303, 'Person created', '2010-08-02 09:00:14');
INSERT INTO `profile_notes` VALUES(6, 304, 'Person created', '2010-08-02 09:00:27');
INSERT INTO `profile_notes` VALUES(7, 305, 'Person created', '2010-08-02 09:00:38');
INSERT INTO `profile_notes` VALUES(8, 306, 'Person created', '2010-08-02 09:00:51');
INSERT INTO `profile_notes` VALUES(9, 307, 'Person created', '2010-08-02 09:01:03');
INSERT INTO `profile_notes` VALUES(10, 308, 'Person created', '2010-08-02 09:01:13');
INSERT INTO `profile_notes` VALUES(11, 309, 'Person created', '2010-08-02 09:01:22');
INSERT INTO `profile_notes` VALUES(12, 310, 'Person created', '2010-08-02 09:01:30');
INSERT INTO `profile_notes` VALUES(13, 311, 'Person created', '2010-08-02 09:01:42');
INSERT INTO `profile_notes` VALUES(14, 309, 'Person restored', '2010-08-02 09:50:58');
INSERT INTO `profile_notes` VALUES(15, 311, 'Person restored', '2010-08-02 09:51:09');
INSERT INTO `profile_notes` VALUES(16, 312, 'Person created', '2010-08-04 15:02:02');

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

INSERT INTO `resident_categories` VALUES(1, 'YSC 1', 528);
INSERT INTO `resident_categories` VALUES(2, 'YSC 2', 528);
INSERT INTO `resident_categories` VALUES(3, 'YSL 1', 528);
INSERT INTO `resident_categories` VALUES(4, 'YSL 2', 528);
INSERT INTO `resident_categories` VALUES(5, 'Resident', 528);
INSERT INTO `resident_categories` VALUES(6, 'Intern', 528);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=531 ;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` VALUES(528, 'Published', NULL, '2010-08-04 15:36:29', NULL);

-- --------------------------------------------------------

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

INSERT INTO `shifts` VALUES(1, 7, 1, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(2, 7, 2, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(3, 7, 3, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(4, 7, 4, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(6, 7, 5, '11:00:00', '14:00:00', 1, 528);
INSERT INTO `shifts` VALUES(8, 7, 1, '13:30:00', '15:30:00', 2, 528);
INSERT INTO `shifts` VALUES(10, 7, 4, '13:30:00', '15:30:00', 2, 528);
INSERT INTO `shifts` VALUES(11, 7, 4, '18:00:00', '19:00:00', 1, 528);
INSERT INTO `shifts` VALUES(12, 7, 1, '18:00:00', '19:00:00', 1, 528);
INSERT INTO `shifts` VALUES(13, 7, 2, '18:00:00', '19:00:00', 1, 528);
INSERT INTO `shifts` VALUES(14, 7, 3, '18:00:00', '19:00:00', 1, 528);
INSERT INTO `shifts` VALUES(15, 7, 5, '18:30:00', '19:30:00', 1, 528);
INSERT INTO `shifts` VALUES(16, 7, 6, '18:00:00', '19:00:00', 1, 528);
INSERT INTO `shifts` VALUES(17, 8, 1, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(18, 8, 4, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(19, 8, 5, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(20, 8, 6, '11:00:00', '14:00:00', 1, 528);
INSERT INTO `shifts` VALUES(21, 8, 7, '11:00:00', '14:00:00', 1, 528);
INSERT INTO `shifts` VALUES(22, 8, 1, '13:30:00', '16:30:00', 1, 528);
INSERT INTO `shifts` VALUES(23, 8, 4, '13:30:00', '16:30:00', 1, 528);
INSERT INTO `shifts` VALUES(24, 8, 5, '13:30:00', '16:30:00', 1, 528);
INSERT INTO `shifts` VALUES(25, 9, 1, '09:00:00', '12:00:00', 1, 528);
INSERT INTO `shifts` VALUES(26, 9, 3, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(27, 9, 4, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(28, 9, 5, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(29, 9, 6, '11:00:00', '13:00:00', 1, 528);
INSERT INTO `shifts` VALUES(30, 9, 6, '13:00:00', '16:00:00', 1, 528);
INSERT INTO `shifts` VALUES(32, 3, 1, '09:30:00', '12:30:00', 3, 528);
INSERT INTO `shifts` VALUES(33, 3, 5, '09:30:00', '12:30:00', 3, 528);
INSERT INTO `shifts` VALUES(34, 3, 3, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(35, 10, 1, '09:00:00', '13:00:00', 1, 528);
INSERT INTO `shifts` VALUES(36, 10, 2, '09:00:00', '13:00:00', 1, 528);
INSERT INTO `shifts` VALUES(38, 10, 4, '11:00:00', '14:00:00', 1, 528);
INSERT INTO `shifts` VALUES(39, 10, 1, '13:00:00', '15:30:00', 1, 528);
INSERT INTO `shifts` VALUES(40, 10, 5, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(41, 2, 1, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(43, 2, 3, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(44, 2, 4, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(45, 2, 7, '08:30:00', '09:30:00', 1, 528);
INSERT INTO `shifts` VALUES(46, 2, 1, '09:15:00', '10:45:00', 1, 528);
INSERT INTO `shifts` VALUES(48, 2, 3, '09:15:00', '10:45:00', 1, 528);
INSERT INTO `shifts` VALUES(49, 2, 4, '09:15:00', '10:45:00', 1, 528);
INSERT INTO `shifts` VALUES(50, 2, 5, '09:15:00', '10:45:00', 1, 528);
INSERT INTO `shifts` VALUES(53, 2, 6, '09:45:00', '12:15:00', 1, 528);
INSERT INTO `shifts` VALUES(54, 2, 7, '09:45:00', '12:15:00', 1, 528);
INSERT INTO `shifts` VALUES(58, 2, 1, '12:30:00', '14:30:00', 1, 528);
INSERT INTO `shifts` VALUES(60, 2, 3, '15:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(62, 2, 5, '16:00:00', '17:30:00', 1, 528);
INSERT INTO `shifts` VALUES(63, 2, 5, '13:30:00', '17:30:00', 1, 528);
INSERT INTO `shifts` VALUES(64, 2, 6, '16:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(65, 2, 6, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(66, 2, 1, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(67, 2, 2, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(68, 2, 3, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(69, 2, 4, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(70, 2, 5, '18:30:00', '19:30:00', 3, 528);
INSERT INTO `shifts` VALUES(71, 1, 1, '06:30:00', '09:00:00', 3, 528);
INSERT INTO `shifts` VALUES(72, 1, 2, '06:30:00', '09:00:00', 3, 528);
INSERT INTO `shifts` VALUES(73, 1, 3, '06:30:00', '09:00:00', 3, 528);
INSERT INTO `shifts` VALUES(74, 1, 4, '06:30:00', '09:00:00', 2, 528);
INSERT INTO `shifts` VALUES(75, 1, 5, '06:30:00', '09:00:00', 3, 528);
INSERT INTO `shifts` VALUES(77, 1, 7, '06:30:00', '10:30:00', 2, 528);
INSERT INTO `shifts` VALUES(78, 1, 7, '07:00:00', '11:00:00', 1, 528);
INSERT INTO `shifts` VALUES(80, 1, 1, '10:00:00', '12:30:00', 2, 528);
INSERT INTO `shifts` VALUES(82, 1, 1, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(83, 1, 2, '13:30:00', '17:30:00', 3, 528);
INSERT INTO `shifts` VALUES(84, 1, 3, '13:30:00', '17:30:00', 1, 528);
INSERT INTO `shifts` VALUES(87, 1, 5, '13:00:00', '17:30:00', 2, 528);
INSERT INTO `shifts` VALUES(88, 1, 6, '13:00:00', '17:00:00', 2, 528);
INSERT INTO `shifts` VALUES(90, 1, 5, '13:30:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(91, 1, 1, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(92, 1, 2, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(93, 1, 3, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(94, 1, 4, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(95, 1, 5, '18:30:00', '19:30:00', 3, 528);
INSERT INTO `shifts` VALUES(96, 1, 6, '18:00:00', '19:00:00', 3, 528);
INSERT INTO `shifts` VALUES(97, 11, 1, '13:30:00', '16:30:00', 1, 528);
INSERT INTO `shifts` VALUES(98, 11, 2, '13:30:00', '16:30:00', 2, 528);
INSERT INTO `shifts` VALUES(99, 11, 4, '13:30:00', '16:00:00', 1, 528);
INSERT INTO `shifts` VALUES(100, 11, 4, '13:30:00', '16:30:00', 1, 528);
INSERT INTO `shifts` VALUES(101, 11, 5, '13:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(102, 5, 2, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(103, 5, 3, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(104, 5, 2, '13:30:00', '16:30:00', 2, 528);
INSERT INTO `shifts` VALUES(105, 5, 3, '13:30:00', '16:30:00', 2, 528);
INSERT INTO `shifts` VALUES(106, 12, 1, '09:30:00', '12:00:00', 1, 528);
INSERT INTO `shifts` VALUES(107, 12, 5, '10:00:00', '13:00:00', 1, 528);
INSERT INTO `shifts` VALUES(108, 13, 1, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(109, 13, 2, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(110, 13, 3, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(111, 13, 4, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(114, 13, 7, '08:30:00', '09:30:00', 1, 528);
INSERT INTO `shifts` VALUES(115, 13, 5, '08:00:00', '09:00:00', 1, 528);
INSERT INTO `shifts` VALUES(116, 13, 6, '10:00:00', '11:00:00', 1, 528);
INSERT INTO `shifts` VALUES(117, 13, 1, '17:00:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(118, 13, 2, '17:00:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(119, 13, 3, '17:00:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(120, 13, 4, '17:00:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(121, 13, 5, '17:30:00', '18:30:00', 1, 528);
INSERT INTO `shifts` VALUES(122, 13, 6, '17:00:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(123, 13, 7, '17:00:00', '18:00:00', 1, 528);
INSERT INTO `shifts` VALUES(125, 15, 1, '09:15:00', '10:15:00', 4, 528);
INSERT INTO `shifts` VALUES(126, 15, 3, '09:15:00', '10:15:00', 4, 528);
INSERT INTO `shifts` VALUES(127, 15, 4, '09:15:00', '10:15:00', 4, 528);
INSERT INTO `shifts` VALUES(128, 15, 5, '09:15:00', '10:15:00', 4, 528);
INSERT INTO `shifts` VALUES(130, 15, 6, '11:00:00', '12:00:00', 5, 528);
INSERT INTO `shifts` VALUES(131, 15, 7, '09:30:00', '10:30:00', 4, 528);
INSERT INTO `shifts` VALUES(132, 15, 2, '09:00:00', '10:00:00', 4, 528);
INSERT INTO `shifts` VALUES(133, 15, 1, '13:30:00', '15:00:00', 1, 528);
INSERT INTO `shifts` VALUES(134, 15, 2, '13:30:00', '15:00:00', 1, 528);
INSERT INTO `shifts` VALUES(135, 15, 3, '13:30:00', '15:00:00', 1, 528);
INSERT INTO `shifts` VALUES(136, 15, 4, '13:30:00', '15:00:00', 1, 528);
INSERT INTO `shifts` VALUES(137, 15, 5, '13:30:00', '15:00:00', 1, 528);
INSERT INTO `shifts` VALUES(138, 15, 5, '15:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(139, 15, 4, '15:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(140, 15, 3, '15:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(141, 15, 2, '15:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(142, 15, 1, '15:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(144, 15, 2, '18:00:00', '19:00:00', 5, 528);
INSERT INTO `shifts` VALUES(145, 15, 3, '18:00:00', '19:00:00', 5, 528);
INSERT INTO `shifts` VALUES(146, 15, 4, '18:00:00', '19:00:00', 5, 528);
INSERT INTO `shifts` VALUES(147, 15, 5, '18:30:00', '19:30:00', 6, 528);
INSERT INTO `shifts` VALUES(148, 15, 6, '18:00:00', '19:00:00', 5, 528);
INSERT INTO `shifts` VALUES(149, 15, 6, '15:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(150, 16, 4, '13:30:00', '15:30:00', 1, 528);
INSERT INTO `shifts` VALUES(151, 9, 7, '11:00:00', '14:00:00', 1, 528);
INSERT INTO `shifts` VALUES(159, 17, 3, '06:30:00', '08:30:00', 1, 528);
INSERT INTO `shifts` VALUES(160, 7, 6, '11:00:00', '14:00:00', 1, 528);
INSERT INTO `shifts` VALUES(161, 10, 3, '09:00:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(163, 1, 2, '13:30:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(164, 4, 3, '10:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(165, 6, 4, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(166, 18, 1, '10:00:00', '15:00:00', 1, 528);
INSERT INTO `shifts` VALUES(167, 18, 2, '12:00:00', '16:00:00', 1, 528);
INSERT INTO `shifts` VALUES(168, 18, 4, '10:00:00', '16:00:00', 1, 528);
INSERT INTO `shifts` VALUES(169, 6, 6, '11:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(170, 2, 2, '08:00:00', '10:30:00', 1, 528);
INSERT INTO `shifts` VALUES(172, 2, 4, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(173, 10, 2, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(174, 19, 1, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(175, 19, 2, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(176, 19, 3, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(178, 19, 4, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(179, 19, 5, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(180, 19, 1, '09:00:00', '12:00:00', 1, 528);
INSERT INTO `shifts` VALUES(181, 19, 2, '09:00:00', '12:00:00', 1, 528);
INSERT INTO `shifts` VALUES(183, 19, 4, '10:15:00', '12:00:00', 1, 528);
INSERT INTO `shifts` VALUES(184, 19, 5, '09:00:00', '12:00:00', 2, 528);
INSERT INTO `shifts` VALUES(185, 19, 3, '09:00:00', '12:00:00', 2, 528);
INSERT INTO `shifts` VALUES(187, 1, 4, '06:30:00', '08:30:00', 1, 528);
INSERT INTO `shifts` VALUES(189, 7, 7, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(190, 1, 6, '13:30:00', '17:30:00', 1, 528);
INSERT INTO `shifts` VALUES(191, 20, 4, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(192, 20, 6, '11:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(193, 1, 4, '13:00:00', '17:30:00', 1, 528);
INSERT INTO `shifts` VALUES(194, 2, 2, '13:30:00', '14:30:00', 1, 528);
INSERT INTO `shifts` VALUES(195, 18, 1, '10:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(196, 18, 2, '13:00:00', '17:00:00', 1, 528);
INSERT INTO `shifts` VALUES(197, 18, 4, '10:00:00', '13:00:00', 1, 528);
INSERT INTO `shifts` VALUES(199, 1, 6, '11:00:00', '12:00:00', 1, 528);
INSERT INTO `shifts` VALUES(202, 1, 3, '10:00:00', '12:30:00', 2, 528);
INSERT INTO `shifts` VALUES(203, 15, 1, '18:00:00', '19:00:00', 5, 528);
INSERT INTO `shifts` VALUES(205, 4, 3, '09:30:00', '12:30:00', 1, 528);
INSERT INTO `shifts` VALUES(206, 4, 3, '13:30:00', '14:30:00', 1, 528);
INSERT INTO `shifts` VALUES(207, 17, 3, '18:00:00', '19:00:00', 1, 528);
INSERT INTO `shifts` VALUES(208, 17, 1, '13:00:00', '14:00:00', 3, 528);

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

INSERT INTO `slots` VALUES(1, 'Before Breakfast', 528);
INSERT INTO `slots` VALUES(2, 'Morning', 528);
INSERT INTO `slots` VALUES(3, 'Afternoon', 528);
INSERT INTO `slots` VALUES(4, 'After Dinner', 528);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES(1, 'shantam', '705b958575bd82a33ac6ac798956924fb0205191', 'operations');
INSERT INTO `users` VALUES(2, 'sumitra', '705b958575bd82a33ac6ac798956924fb0205191', 'operations');
INSERT INTO `users` VALUES(3, 'sumitra', 'omomom', '');
INSERT INTO `users` VALUES(-1, NULL, NULL, '');
