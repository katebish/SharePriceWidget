-- phpMyAdmin SQL Dump
-- version 3.3.9.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 23, 2015 at 01:52 PM
-- Server version: 5.5.9
-- PHP Version: 5.3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

--
-- Database: `Comp333`
--

-- --------------------------------------------------------

--
-- Table structure for table `shareprices`
--

CREATE TABLE `shareprices` (
  `Name` varchar(40) NOT NULL,
  `Price` float NOT NULL,
  `Change` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shareprices`
--

INSERT INTO `shareprices` VALUES('NZ Wind Farms', 0.55, 0.05);
INSERT INTO `shareprices` VALUES('Foley Wines', 1.41, -0.04);
INSERT INTO `shareprices` VALUES('Geneva Finance', 0.29, 0);
INSERT INTO `shareprices` VALUES('Xero Live', 25.6, 1.16);
INSERT INTO `shareprices` VALUES('Moa Group Ltd', 0.37, -0.1);
INSERT INTO `shareprices` VALUES('Solution Dynamics', 0.8, 0.15);