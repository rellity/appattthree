-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2023 at 06:26 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `appattthree`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `createdon` datetime NOT NULL,
  `createdby` varchar(50) NOT NULL,
  `status` varchar(10) NOT NULL,
  `endedby` varchar(50) NOT NULL,
  `price` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `createdon`, `createdby`, `status`, `endedby`, `price`) VALUES
(1, 'wedsevent', '2023-11-10 15:18:04', 'Mark Barker', 'ongoing', '', 50),
(2, 'mondaysevent', '2023-11-10 16:04:57', 'Mark Barker', 'ongoing', '', 25),
(4, 'popevent', '2023-11-12 18:21:00', 'Mark Barker', 'ongoing', '', 50);

-- --------------------------------------------------------

--
-- Table structure for table `mondaysevent`
--

CREATE TABLE `mondaysevent` (
  `id` int(11) NOT NULL,
  `idno` varchar(11) NOT NULL,
  `login` datetime DEFAULT NULL,
  `logout` datetime DEFAULT NULL,
  `logbyin` varchar(50) DEFAULT NULL,
  `logbyout` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mondaysevent`
--

INSERT INTO `mondaysevent` (`id`, `idno`, `login`, `logout`, `logbyin`, `logbyout`) VALUES
(10, '2010386-1', '2023-11-13 01:18:31', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `popevent`
--

CREATE TABLE `popevent` (
  `id` int(11) NOT NULL,
  `idno` int(9) NOT NULL,
  `login` datetime DEFAULT NULL,
  `logout` datetime DEFAULT NULL,
  `logbyin` varchar(50) DEFAULT NULL,
  `logbyout` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `popevent`
--

INSERT INTO `popevent` (`id`, `idno`, `login`, `logout`, `logbyin`, `logbyout`) VALUES
(1, 2010386, '2023-11-13 01:21:43', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `stuid` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `stuid`) VALUES
(1, 'Zachari Iligan', '2010386-1');

-- --------------------------------------------------------

--
-- Table structure for table `wedsevent`
--

CREATE TABLE `wedsevent` (
  `id` int(11) NOT NULL,
  `idno` varchar(9) NOT NULL,
  `login` datetime NOT NULL,
  `logout` datetime DEFAULT NULL,
  `logbyin` varchar(50) DEFAULT NULL,
  `logbyout` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wedsevent`
--

INSERT INTO `wedsevent` (`id`, `idno`, `login`, `logout`, `logbyin`, `logbyout`) VALUES
(3, '2010386-1', '2023-11-13 01:23:08', NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mondaysevent`
--
ALTER TABLE `mondaysevent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `popevent`
--
ALTER TABLE `popevent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wedsevent`
--
ALTER TABLE `wedsevent`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mondaysevent`
--
ALTER TABLE `mondaysevent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `popevent`
--
ALTER TABLE `popevent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `wedsevent`
--
ALTER TABLE `wedsevent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
