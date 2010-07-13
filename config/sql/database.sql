-- phpMyAdmin SQL Dump
-- version 2.11.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jul 13, 2010 at 08:01 AM
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

INSERT INTO `assignments` VALUES(5, 1, 7, 1);
INSERT INTO `assignments` VALUES(3, 2, 21, 1);
INSERT INTO `assignments` VALUES(4, 4, 21, 1);
INSERT INTO `assignments` VALUES(2, 3, 21, 1);
INSERT INTO `assignments` VALUES(1, 1, 21, 1);
INSERT INTO `assignments` VALUES(6, 4, 16, 1);
INSERT INTO `assignments` VALUES(7, 3, 15, 1);
INSERT INTO `assignments` VALUES(8, 1, 8, 1);
INSERT INTO `assignments` VALUES(17, 1, 13, 1);
INSERT INTO `assignments` VALUES(10, 1, 16, 1);
INSERT INTO `assignments` VALUES(11, 1, 14, 1);
INSERT INTO `assignments` VALUES(16, 3, 13, 1);

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

INSERT INTO `changes` VALUES(-5, 'Gormu assigned to K Wed 8-10', '2010-07-12 13:46:56', 1);
INSERT INTO `changes` VALUES(-4, 'Jack assigned to K Thu 8-9', '2010-07-12 13:46:54', 1);
INSERT INTO `changes` VALUES(-3, 'Gormu assigned to K Thu 8-9', '2010-07-12 13:46:51', 1);
INSERT INTO `changes` VALUES(-2, 'Boo assigned to K Thu 8-9', '2010-07-12 13:46:49', 1);
INSERT INTO `changes` VALUES(-1, 'New Shift created: CB Mon 1-2', '2010-07-12 10:59:57', 1);
INSERT INTO `changes` VALUES(-6, 'Boo assigned to K Wed 8-10', '2010-07-12 13:46:58', 1);
INSERT INTO `changes` VALUES(-7, 'Shift changed: (K Wed 8:15-9:15) # of people -> 5', '2010-07-12 13:47:03', 1);
INSERT INTO `changes` VALUES(-8, 'Shift changed: (K Mon 8:15-9:15) day -> Fri', '2010-07-12 13:47:08', 1);
INSERT INTO `changes` VALUES(-9, 'Shift deleted: K Wed 8:15-9:15', '2010-07-12 13:48:06', 1);
INSERT INTO `changes` VALUES(-10, 'Shift deleted: K Fri 8:15-9:15', '2010-07-12 13:48:09', 1);
INSERT INTO `changes` VALUES(-17, 'New floating shift: K; 1 hr  w/ Baggy', '2010-07-12 21:37:09', 1);
INSERT INTO `changes` VALUES(-11, 'Shift deleted: K Thu 8-9', '2010-07-12 13:48:12', 1);
INSERT INTO `changes` VALUES(-16, 'New floating shift: CB; 1 hr  w/ Baggy', '2010-07-12 21:37:02', 1);
INSERT INTO `changes` VALUES(-15, 'New person created: Ronnie', '2010-07-12 16:44:13', 1);
INSERT INTO `changes` VALUES(-14, 'New person created: Baggy', '2010-07-12 16:43:50', 1);
INSERT INTO `changes` VALUES(-13, 'Jack removed from Rock Mon 8:15-9:15', '2010-07-12 13:54:25', 1);
INSERT INTO `changes` VALUES(-12, 'New person created: Sahadev', '2010-07-12 13:50:22', 1);
INSERT INTO `changes` VALUES(-18, 'New floating shift: K; 1 hr  w/ Baggy', '2010-07-12 21:44:12', 1);

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

INSERT INTO `change_fields` VALUES(22, -5, 5, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(21, -5, 5, 'person_id', NULL, '4', 1);
INSERT INTO `change_fields` VALUES(20, -5, 5, 'shift_id', NULL, '12', 1);
INSERT INTO `change_fields` VALUES(14, -3, 3, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(15, -3, 3, 'id', NULL, '19', 1);
INSERT INTO `change_fields` VALUES(16, -4, 4, 'shift_id', NULL, '11', 1);
INSERT INTO `change_fields` VALUES(17, -4, 4, 'person_id', NULL, '3', 1);
INSERT INTO `change_fields` VALUES(10, -2, 2, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(11, -2, 2, 'id', NULL, '18', 1);
INSERT INTO `change_fields` VALUES(12, -3, 3, 'shift_id', NULL, '11', 1);
INSERT INTO `change_fields` VALUES(13, -3, 3, 'person_id', NULL, '4', 1);
INSERT INTO `change_fields` VALUES(6, -1, 1, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(7, -1, 1, 'id', NULL, '22', 1);
INSERT INTO `change_fields` VALUES(8, -2, 2, 'shift_id', NULL, '11', 1);
INSERT INTO `change_fields` VALUES(9, -2, 2, 'person_id', NULL, '2', 1);
INSERT INTO `change_fields` VALUES(1, -1, 1, 'area_id', NULL, '2', 1);
INSERT INTO `change_fields` VALUES(2, -1, 1, 'day_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(3, -1, 1, 'start', NULL, '13:00:00', 1);
INSERT INTO `change_fields` VALUES(4, -1, 1, 'end', NULL, '14:00:00', 1);
INSERT INTO `change_fields` VALUES(5, -1, 1, 'num_people', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(19, -4, 4, 'id', NULL, '20', 1);
INSERT INTO `change_fields` VALUES(18, -4, 4, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(23, -5, 5, 'id', NULL, '21', 1);
INSERT INTO `change_fields` VALUES(24, -6, 6, 'shift_id', NULL, '12', 1);
INSERT INTO `change_fields` VALUES(25, -6, 6, 'person_id', NULL, '2', 1);
INSERT INTO `change_fields` VALUES(26, -6, 6, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(27, -6, 6, 'id', NULL, '22', 1);
INSERT INTO `change_fields` VALUES(28, -7, 7, 'id', '9', '9', 1);
INSERT INTO `change_fields` VALUES(29, -7, 7, 'area_id', '1', '1', 1);
INSERT INTO `change_fields` VALUES(30, -7, 7, 'day_id', '3', '3', 1);
INSERT INTO `change_fields` VALUES(31, -7, 7, 'start', '08:15:00', '08:15:00', 1);
INSERT INTO `change_fields` VALUES(32, -7, 7, 'end', '09:15:00', '09:15:00', 1);
INSERT INTO `change_fields` VALUES(33, -7, 7, 'num_people', '2', '5', 1);
INSERT INTO `change_fields` VALUES(34, -7, 7, 'schedule_id', '1', '1', 1);
INSERT INTO `change_fields` VALUES(35, -7, 7, 'id', '9', '9', 1);
INSERT INTO `change_fields` VALUES(36, -8, 8, 'id', '10', '10', 1);
INSERT INTO `change_fields` VALUES(37, -8, 8, 'area_id', '1', '1', 1);
INSERT INTO `change_fields` VALUES(38, -8, 8, 'day_id', '1', '5', 1);
INSERT INTO `change_fields` VALUES(39, -8, 8, 'start', '08:15:00', '08:15:00', 1);
INSERT INTO `change_fields` VALUES(40, -8, 8, 'end', '09:15:00', '09:15:00', 1);
INSERT INTO `change_fields` VALUES(41, -8, 8, 'num_people', '1', '1', 1);
INSERT INTO `change_fields` VALUES(42, -8, 8, 'schedule_id', '1', '1', 1);
INSERT INTO `change_fields` VALUES(43, -8, 8, 'id', '10', '10', 1);
INSERT INTO `change_fields` VALUES(44, -9, 9, 'id', '9', NULL, 1);
INSERT INTO `change_fields` VALUES(45, -9, 9, 'area_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(46, -9, 9, 'day_id', '3', NULL, 1);
INSERT INTO `change_fields` VALUES(47, -9, 9, 'start', '08:15:00', NULL, 1);
INSERT INTO `change_fields` VALUES(48, -9, 9, 'end', '09:15:00', NULL, 1);
INSERT INTO `change_fields` VALUES(49, -9, 9, 'num_people', '5', NULL, 1);
INSERT INTO `change_fields` VALUES(50, -9, 9, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(51, -10, 10, 'id', '10', NULL, 1);
INSERT INTO `change_fields` VALUES(52, -10, 10, 'area_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(53, -10, 10, 'day_id', '5', NULL, 1);
INSERT INTO `change_fields` VALUES(54, -10, 10, 'start', '08:15:00', NULL, 1);
INSERT INTO `change_fields` VALUES(55, -10, 10, 'end', '09:15:00', NULL, 1);
INSERT INTO `change_fields` VALUES(56, -10, 10, 'num_people', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(57, -10, 10, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(58, -11, 11, 'id', '18', NULL, 1);
INSERT INTO `change_fields` VALUES(59, -11, 11, 'person_id', '2', NULL, 1);
INSERT INTO `change_fields` VALUES(60, -11, 11, 'shift_id', '11', NULL, 1);
INSERT INTO `change_fields` VALUES(61, -11, 11, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(62, -11, 12, 'id', '19', NULL, 1);
INSERT INTO `change_fields` VALUES(63, -11, 12, 'person_id', '4', NULL, 1);
INSERT INTO `change_fields` VALUES(64, -11, 12, 'shift_id', '11', NULL, 1);
INSERT INTO `change_fields` VALUES(65, -11, 12, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(66, -11, 13, 'id', '20', NULL, 1);
INSERT INTO `change_fields` VALUES(67, -11, 13, 'person_id', '3', NULL, 1);
INSERT INTO `change_fields` VALUES(68, -11, 13, 'shift_id', '11', NULL, 1);
INSERT INTO `change_fields` VALUES(69, -11, 13, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(70, -11, 14, 'id', '11', NULL, 1);
INSERT INTO `change_fields` VALUES(71, -11, 14, 'area_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(72, -11, 14, 'day_id', '4', NULL, 1);
INSERT INTO `change_fields` VALUES(73, -11, 14, 'start', '08:00:00', NULL, 1);
INSERT INTO `change_fields` VALUES(74, -11, 14, 'end', '09:00:00', NULL, 1);
INSERT INTO `change_fields` VALUES(75, -11, 14, 'num_people', '10', NULL, 1);
INSERT INTO `change_fields` VALUES(76, -11, 14, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(97, -16, 19, 'person_id', NULL, '6', 1);
INSERT INTO `change_fields` VALUES(98, -16, 19, 'hours', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(99, -16, 19, 'note', NULL, '', 1);
INSERT INTO `change_fields` VALUES(100, -16, 19, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(101, -16, 19, 'id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(102, -17, 20, 'area_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(103, -17, 20, 'person_id', NULL, '6', 1);
INSERT INTO `change_fields` VALUES(104, -17, 20, 'hours', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(105, -17, 20, 'note', NULL, '', 1);
INSERT INTO `change_fields` VALUES(106, -17, 20, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(107, -17, 20, 'id', NULL, '2', 1);
INSERT INTO `change_fields` VALUES(108, -18, 21, 'area_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(109, -18, 21, 'person_id', NULL, '6', 1);
INSERT INTO `change_fields` VALUES(110, -18, 21, 'hours', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(111, -18, 21, 'note', NULL, '', 1);
INSERT INTO `change_fields` VALUES(112, -18, 21, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(113, -18, 21, 'id', NULL, '3', 1);
INSERT INTO `change_fields` VALUES(90, -14, 17, 'id', NULL, '6', 1);
INSERT INTO `change_fields` VALUES(91, -15, 18, 'name', NULL, 'Ronnie', 1);
INSERT INTO `change_fields` VALUES(92, -15, 18, 'resident_category_id', NULL, '4', 1);
INSERT INTO `change_fields` VALUES(93, -15, 18, 'edit_profile', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(94, -15, 18, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(95, -15, 18, 'id', NULL, '7', 1);
INSERT INTO `change_fields` VALUES(96, -16, 19, 'area_id', NULL, '2', 1);
INSERT INTO `change_fields` VALUES(82, -13, 16, 'id', '7', NULL, 1);
INSERT INTO `change_fields` VALUES(83, -13, 16, 'person_id', '3', NULL, 1);
INSERT INTO `change_fields` VALUES(84, -13, 16, 'shift_id', '15', NULL, 1);
INSERT INTO `change_fields` VALUES(85, -13, 16, 'schedule_id', '1', NULL, 1);
INSERT INTO `change_fields` VALUES(86, -14, 17, 'name', NULL, 'Baggy', 1);
INSERT INTO `change_fields` VALUES(87, -14, 17, 'resident_category_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(88, -14, 17, 'edit_profile', NULL, '0', 1);
INSERT INTO `change_fields` VALUES(89, -14, 17, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(77, -12, 15, 'name', NULL, 'Sahadev', 1);
INSERT INTO `change_fields` VALUES(78, -12, 15, 'resident_category_id', NULL, '5', 1);
INSERT INTO `change_fields` VALUES(79, -12, 15, 'edit_profile', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(80, -12, 15, 'schedule_id', NULL, '1', 1);
INSERT INTO `change_fields` VALUES(81, -12, 15, 'id', NULL, '5', 1);

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

INSERT INTO `change_models` VALUES(4, -4, 'Assignment', 1, 20, 1);
INSERT INTO `change_models` VALUES(3, -3, 'Assignment', 1, 19, 1);
INSERT INTO `change_models` VALUES(1, -1, 'Shift', 1, 22, 1);
INSERT INTO `change_models` VALUES(2, -2, 'Assignment', 1, 18, 1);
INSERT INTO `change_models` VALUES(5, -5, 'Assignment', 1, 21, 1);
INSERT INTO `change_models` VALUES(6, -6, 'Assignment', 1, 22, 1);
INSERT INTO `change_models` VALUES(7, -7, 'Shift', 2, 9, 1);
INSERT INTO `change_models` VALUES(8, -8, 'Shift', 2, 10, 1);
INSERT INTO `change_models` VALUES(9, -9, 'Shift', 0, 9, 1);
INSERT INTO `change_models` VALUES(10, -10, 'Shift', 0, 10, 1);
INSERT INTO `change_models` VALUES(11, -11, 'Assignment', 0, 18, 1);
INSERT INTO `change_models` VALUES(12, -11, 'Assignment', 0, 19, 1);
INSERT INTO `change_models` VALUES(13, -11, 'Assignment', 0, 20, 1);
INSERT INTO `change_models` VALUES(14, -11, 'Shift', 0, 11, 1);
INSERT INTO `change_models` VALUES(20, -17, 'FloatingShift', 1, 2, 1);
INSERT INTO `change_models` VALUES(16, -13, 'Assignment', 0, 7, 1);
INSERT INTO `change_models` VALUES(17, -14, 'Person', 1, 6, 1);
INSERT INTO `change_models` VALUES(18, -15, 'Person', 1, 7, 1);
INSERT INTO `change_models` VALUES(19, -16, 'FloatingShift', 1, 1, 1);
INSERT INTO `change_models` VALUES(15, -12, 'Person', 1, 5, 1);
INSERT INTO `change_models` VALUES(21, -18, 'FloatingShift', 1, 3, 1);

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
  `middle` varchar(30) NOT NULL,
  `last` varchar(30) NOT NULL,
  `housing` varchar(30) NOT NULL,
  `resident_category_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  UNIQUE KEY `branch_id` (`schedule_id`,`id`),
  KEY `resident_category_id` (`resident_category_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `people`
--

INSERT INTO `people` VALUES(1, 'George', 'George', '', 'Kromack', 'Log Building', 1, 1);
INSERT INTO `people` VALUES(2, 'Boo', '', '', '', '', 1, 1);
INSERT INTO `people` VALUES(3, 'Jack', '', '', '', '', 1, 1);
INSERT INTO `people` VALUES(4, 'Gormu', '', '', '', '', 3, 1);

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
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `profile_notes`
--

INSERT INTO `profile_notes` VALUES(1, 0, 'Person Created', '2010-07-11 10:28:47');
INSERT INTO `profile_notes` VALUES(2, 0, 'Person Created', '2010-07-11 11:19:33');
INSERT INTO `profile_notes` VALUES(3, 0, 'Person Created', '2010-07-11 12:06:02');
INSERT INTO `profile_notes` VALUES(4, 0, 'Person Created', '2010-07-11 13:52:25');
INSERT INTO `profile_notes` VALUES(5, 0, 'Person Created', '2010-07-11 23:01:17');
INSERT INTO `profile_notes` VALUES(6, 0, 'Person Created', '2010-07-12 13:50:22');
INSERT INTO `profile_notes` VALUES(7, 6, 'Person Created', '2010-07-12 16:43:50');
INSERT INTO `profile_notes` VALUES(8, 7, 'Person Created', '2010-07-12 16:44:13');

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

INSERT INTO `shifts` VALUES(8, 3, 4, '08:15:00', '09:15:00', 1, 1);
INSERT INTO `shifts` VALUES(14, 3, 7, '08:30:00', '09:30:00', 1, 1);
INSERT INTO `shifts` VALUES(12, 1, 3, '08:00:00', '10:00:00', 3, 1);
INSERT INTO `shifts` VALUES(10, 1, 1, '08:15:00', '09:15:00', 1, 1);
INSERT INTO `shifts` VALUES(13, 3, 5, '08:15:00', '09:15:00', 2, 1);
INSERT INTO `shifts` VALUES(6, 2, 6, '12:00:00', '13:00:00', 1, 1);
INSERT INTO `shifts` VALUES(9, 1, 3, '08:15:00', '09:15:00', 2, 1);
INSERT INTO `shifts` VALUES(7, 3, 2, '08:15:00', '09:15:00', 1, 1);
INSERT INTO `shifts` VALUES(11, 1, 4, '08:00:00', '09:00:00', 10, 1);
INSERT INTO `shifts` VALUES(15, 3, 1, '08:15:00', '09:15:00', 1, 1);
INSERT INTO `shifts` VALUES(16, 3, 1, '08:15:00', '09:15:00', 3, 1);
INSERT INTO `shifts` VALUES(17, 2, 1, '13:00:00', '14:00:00', 1, 1);
INSERT INTO `shifts` VALUES(18, 2, 5, '12:00:00', '13:00:00', 1, 1);
INSERT INTO `shifts` VALUES(19, 2, 4, '12:00:00', '13:00:00', 1, 1);
INSERT INTO `shifts` VALUES(20, 2, 3, '12:00:00', '13:00:00', 1, 1);
INSERT INTO `shifts` VALUES(21, 2, 6, '08:00:00', '13:00:00', 4, 1);

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
