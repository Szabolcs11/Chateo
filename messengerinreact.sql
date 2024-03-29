-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2022 at 10:35 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `messengerinreact`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `FriendID` int(11) NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `UserID`, `FriendID`, `Date`) VALUES
(39, 6, 12, '2022-09-19 21:37:26'),
(40, 12, 6, '2022-09-19 21:37:26'),
(49, 4, 6, '2022-10-06 20:31:52'),
(50, 6, 4, '2022-10-06 20:31:52'),
(51, 4, 1, '2022-10-13 22:01:07'),
(52, 1, 4, '2022-10-13 22:01:07'),
(53, 1, 6, '2022-10-13 22:02:02'),
(54, 6, 1, '2022-10-13 22:02:02');

-- --------------------------------------------------------

--
-- Table structure for table `groupmembers`
--

CREATE TABLE `groupmembers` (
  `id` int(11) NOT NULL,
  `GroupID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `groupmembers`
--

INSERT INTO `groupmembers` (`id`, `GroupID`, `UserID`) VALUES
(1, 1, 1),
(2, 1, 13),
(3, 1, 4);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(11) NOT NULL,
  `GroupKey` varchar(32) NOT NULL,
  `Name` varchar(64) NOT NULL,
  `CoverURL` varchar(128) NOT NULL DEFAULT 'DefaultGroupsCover.png',
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `GroupKey`, `Name`, `CoverURL`, `Date`) VALUES
(1, 'G123456', 'Group 1', 'DefaultGroupsCover.png', '2022-09-21 23:21:49');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `Url` varchar(255) NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `Url`, `Date`) VALUES
(1, '1663188158061kekeny-logo.png', '2022-09-14 22:42:38'),
(2, '1663188158080Orarend.png', '2022-09-14 22:42:38'),
(3, '1663188190309kekeny-logo.png', '2022-09-14 22:43:10'),
(4, '1663188190324Orarend.png', '2022-09-14 22:43:10'),
(5, '1663188204794kekeny-logo.png', '2022-09-14 22:43:24'),
(6, '1663188204822Orarend.png', '2022-09-14 22:43:24'),
(7, '1663188259405kekeny-logo.png', '2022-09-14 22:44:19'),
(8, '1663188259435Orarend.png', '2022-09-14 22:44:19'),
(9, '1663188290692kekeny-logo.png', '2022-09-14 22:44:50'),
(10, '1663188290719Orarend.png', '2022-09-14 22:44:50'),
(11, '1663188435940kekeny-logo.png', '2022-09-14 22:47:15'),
(12, '1663188435967Orarend.png', '2022-09-14 22:47:15'),
(13, '1663188557148kekeny-logo.png', '2022-09-14 22:49:17'),
(14, '1663188557173Orarend.png', '2022-09-14 22:49:17'),
(15, '1663188737863kekeny-logo.png', '2022-09-14 22:52:17'),
(16, '1663188737895Orarend.png', '2022-09-14 22:52:17'),
(17, '1663188858348kekeny-logo.png', '2022-09-14 22:54:18'),
(18, '1663188858377Orarend.png', '2022-09-14 22:54:18'),
(19, '1663190560804Orarend.png', '2022-09-14 23:22:40'),
(20, '1663190801320kekeny-logo.png', '2022-09-14 23:26:41'),
(21, '1663191081788kekeny-logo.png', '2022-09-14 23:31:21'),
(22, '1663191091951kekeny-logo.png', '2022-09-14 23:31:31'),
(23, '1663191091977Orarend.png', '2022-09-14 23:31:31'),
(24, '1663191120168kekeny-logo.png', '2022-09-14 23:32:00'),
(25, '1663191120187Orarend.png', '2022-09-14 23:32:00'),
(26, '1663191149110kekeny-logo.png', '2022-09-14 23:32:29'),
(27, '1663191819934kekeny-logo.png', '2022-09-14 23:43:39'),
(28, '1663191819956Orarend.png', '2022-09-14 23:43:39'),
(29, '1663231008471kekeny-logo.png', '2022-09-15 10:36:48'),
(30, '1663231008485Orarend.png', '2022-09-15 10:36:48'),
(31, '1663231132035kekeny-logo.png', '2022-09-15 10:38:52'),
(32, '1663232666396kekeny-logo.png', '2022-09-15 11:04:26'),
(33, '1663232666404kekeny-logo.png', '2022-09-15 11:04:26'),
(34, '1663232666402kekeny-logo.png', '2022-09-15 11:04:26'),
(35, '1663232666460Orarend.png', '2022-09-15 11:04:26'),
(36, '1663232666531Orarend.png', '2022-09-15 11:04:26'),
(37, '1663232666535Orarend.png', '2022-09-15 11:04:26'),
(38, '1663267208729kekeny-logo.png', '2022-09-15 20:40:08'),
(39, '1663267208757Orarend.png', '2022-09-15 20:40:08'),
(40, '1663267349673kekeny-logo.png', '2022-09-15 20:42:29'),
(41, '1663267349693Orarend.png', '2022-09-15 20:42:29'),
(42, '1663267683161kekeny-logo.png', '2022-09-15 20:48:03'),
(43, '1663267683174Orarend.png', '2022-09-15 20:48:03'),
(44, '1663267740721kekeny-logo.png', '2022-09-15 20:49:00'),
(45, '1663267740737Orarend.png', '2022-09-15 20:49:00'),
(46, '1663267875159kekeny-logo.png', '2022-09-15 20:51:15'),
(47, '1663268330607kekeny-logo.png', '2022-09-15 20:58:50'),
(48, '1663268330628Orarend.png', '2022-09-15 20:58:50'),
(49, '1663268358040kekeny-logo.png', '2022-09-15 20:59:18'),
(50, '1663268358063Orarend.png', '2022-09-15 20:59:18'),
(51, '1663268423345kekeny-logo.png', '2022-09-15 21:00:23'),
(52, '1663268423368Orarend.png', '2022-09-15 21:00:23'),
(53, '1663268450358kekeny-logo.png', '2022-09-15 21:00:50'),
(54, '1663268450373Orarend.png', '2022-09-15 21:00:50'),
(55, '1663268457399Orarend.png', '2022-09-15 21:00:57'),
(56, '1663268503650kekeny-logo.png', '2022-09-15 21:01:43'),
(57, '1663268503674Orarend.png', '2022-09-15 21:01:43'),
(58, '1663268699961kekeny-logo.png', '2022-09-15 21:04:59'),
(59, '1663268699987Orarend.png', '2022-09-15 21:04:59'),
(60, '1663268744464kekeny-logo.png', '2022-09-15 21:05:44'),
(61, '1663268744487Orarend.png', '2022-09-15 21:05:44'),
(62, '1663268761962Orarend.png', '2022-09-15 21:06:01'),
(63, '1663270134481kekeny-logo.png', '2022-09-15 21:28:54'),
(64, '1663270151472Orarend.png', '2022-09-15 21:29:11'),
(65, '1663270222260kekeny-logo.png', '2022-09-15 21:30:22'),
(66, '1663270303482Orarend.png', '2022-09-15 21:31:43'),
(67, '1663270358324Orarend.png', '2022-09-15 21:32:38'),
(68, '1663270479889kekeny-logo.png', '2022-09-15 21:34:39'),
(69, '1663270585613kekeny-logo.png', '2022-09-15 21:36:25'),
(70, '1663270585635Orarend.png', '2022-09-15 21:36:25'),
(71, '1663270598333Orarend.png', '2022-09-15 21:36:38'),
(72, '1663270607415kekeny-logo.png', '2022-09-15 21:36:47'),
(73, '1663270607434Orarend.png', '2022-09-15 21:36:47'),
(74, '1663270665264Orarend.png', '2022-09-15 21:37:45'),
(75, '1663416283906kekeny-logo.png', '2022-09-17 14:04:43'),
(76, '1663416283935Orarend.png', '2022-09-17 14:04:43'),
(77, '1663416364138kekeny-logo.png', '2022-09-17 14:06:04'),
(78, '1663416376673kekeny-logo.png', '2022-09-17 14:06:16'),
(79, '1663449426456kekeny-logo.png', '2022-09-17 23:17:06'),
(80, '1663449440282kekeny-logo.png', '2022-09-17 23:17:20'),
(81, '1663449506875kekeny-logo.png', '2022-09-17 23:18:26'),
(82, '1663449518848kekeny-logo.png', '2022-09-17 23:18:38'),
(83, '1663450442192kekeny-logo.png', '2022-09-17 23:34:02'),
(84, '1663450734388kekeny-logo.png', '2022-09-17 23:38:54'),
(85, '1663450741869kekeny-logo.png', '2022-09-17 23:39:01'),
(86, '1663450755786kekeny-logo.png', '2022-09-17 23:39:15'),
(87, '1663450800022Orarend.png', '2022-09-17 23:40:00'),
(88, '1663450835294Orarend.png', '2022-09-17 23:40:35'),
(89, '1663450901576kekeny-logo.png', '2022-09-17 23:41:41'),
(90, '1663450926685kekeny-logo.png', '2022-09-17 23:42:06'),
(91, '1663450948525Orarend.png', '2022-09-17 23:42:28'),
(92, '1663450954970Orarend.png', '2022-09-17 23:42:34'),
(93, '1663450965351Orarend.png', '2022-09-17 23:42:45'),
(94, '1663450968707kekeny-logo.png', '2022-09-17 23:42:48'),
(95, '1663611102659Szabylogo.png', '2022-09-19 20:11:42'),
(96, '1663611236906kekeny-logo.png', '2022-09-19 20:13:56'),
(97, '1663611281945Szabylogo.png', '2022-09-19 20:14:41'),
(98, '1663611286102kekeny-logo.png', '2022-09-19 20:14:46'),
(99, '1663611289275Orarend.png', '2022-09-19 20:14:49'),
(100, '1663611292723Szabylogo.png', '2022-09-19 20:14:52'),
(101, '1663614281501ProfilePic.png', '2022-09-19 21:04:41'),
(102, '1663614289099Orarend.png', '2022-09-19 21:04:49'),
(103, '1663614304895Szabylogo.png', '2022-09-19 21:05:04'),
(104, '1663614323478ProfilePic.png', '2022-09-19 21:05:23'),
(105, '1663614332840kekeny-logo.png', '2022-09-19 21:05:32'),
(106, '1663614343623Orarend.png', '2022-09-19 21:05:43'),
(107, '1663614356819kekeny-logo.png', '2022-09-19 21:05:56'),
(108, '1663614364790kekeny-logo.png', '2022-09-19 21:06:04'),
(109, '1663614372835Orarend.png', '2022-09-19 21:06:12'),
(110, '1663614378086ProfilePic.png', '2022-09-19 21:06:18'),
(111, '1663614429168Orarend.png', '2022-09-19 21:07:09'),
(112, '1663614451813Szabylogo.png', '2022-09-19 21:07:31'),
(113, '1663614554109Szabylogo.png', '2022-09-19 21:09:14'),
(114, '1663614695937kekeny-logo.png', '2022-09-19 21:11:35'),
(115, '1663614792836Orarend.png', '2022-09-19 21:13:12'),
(116, '1663614792857ProfilePic.png', '2022-09-19 21:13:12'),
(117, '1663614824553Orarend.png', '2022-09-19 21:13:44'),
(118, '1663614834159kekeny-logo.png', '2022-09-19 21:13:54'),
(119, '1663614834179Orarend.png', '2022-09-19 21:13:54'),
(120, '1663615347838ProfilePic.png', '2022-09-19 21:22:27'),
(121, '1663615739517ProfilePic.png', '2022-09-19 21:28:59'),
(122, '1663615787652Orarend.png', '2022-09-19 21:29:47'),
(123, '1663615795405Szabylogo.png', '2022-09-19 21:29:55'),
(124, '1663616231193ProfilePic.png', '2022-09-19 21:37:11'),
(125, '1663616277395Orarend.png', '2022-09-19 21:37:57'),
(126, '1663616286710Szabylogo.png', '2022-09-19 21:38:06'),
(127, '1663799870575Orarend.png', '2022-09-22 00:37:50'),
(128, '1663799888771ProfilePic.png', '2022-09-22 00:38:08'),
(129, '1663799898765Orarend.png', '2022-09-22 00:38:18'),
(130, '1663799898784ProfilePic.png', '2022-09-22 00:38:18'),
(131, '1663947690153ProfilePic.png', '2022-09-23 17:41:30'),
(132, '1663947866306Orarend.png', '2022-09-23 17:44:26'),
(133, '1663948081292Orarend.png', '2022-09-23 17:48:01'),
(134, '1663949333695chateo2.png', '2022-09-23 18:08:53'),
(135, '1663950176673Orarend.png', '2022-09-23 18:22:56'),
(136, '1663950469309chateo1.png', '2022-09-23 18:27:49'),
(137, '1663950644417Orarend.png', '2022-09-23 18:30:44'),
(138, '1663950681461ProfilePic.png', '2022-09-23 18:31:21'),
(139, '1663951369130ProfilePic.png', '2022-09-23 18:42:49'),
(140, '1664575481290Screenshot (2).png', '2022-10-01 00:04:41'),
(141, '1664575497867Szabylogo.png', '2022-10-01 00:04:57'),
(142, '1665082681715kekeny-logo.png', '2022-10-06 20:58:01'),
(143, '1665082841645Orarend.png', '2022-10-06 21:00:41'),
(144, '1665082863916Szabylogo.png', '2022-10-06 21:01:03'),
(145, '1665691340524Orarend.png', '2022-10-13 22:02:20');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `SenderID` int(11) NOT NULL,
  `Text` varchar(10240) DEFAULT NULL,
  `RoomID` int(11) NOT NULL,
  `Date` datetime NOT NULL,
  `ImageIDs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `SenderID`, `Text`, `RoomID`, `Date`, `ImageIDs`) VALUES
(526, 6, 'a', 10, '2022-09-21 22:56:33', ''),
(528, 4, '2', 11, '2022-09-21 23:01:26', ''),
(529, 4, '3', 11, '2022-09-21 23:01:29', ''),
(531, 13, '5', 11, '2022-09-21 23:01:35', ''),
(532, 4, 'Csdaa', 1, '2022-09-22 00:27:46', ''),
(535, 4, '7', 11, '2022-09-22 00:28:37', ''),
(536, 4, '1', 1, '2022-09-22 00:29:20', ''),
(537, 4, 'a', 1, '2022-09-22 00:35:46', ''),
(539, 4, '1', 1, '2022-09-22 00:37:35', ''),
(541, 4, '3', 1, '2022-09-22 00:37:39', ''),
(544, 4, 'Who', 1, '2022-09-22 00:37:55', ''),
(545, 4, 'Asked', 1, '2022-09-22 00:37:57', ''),
(546, 4, 'Me', 1, '2022-09-22 00:38:08', '1663799888771ProfilePic.png'),
(548, 4, 'Ty', 1, '2022-09-22 00:38:25', ''),
(549, 4, 'Helo', 1, '2022-09-22 00:38:59', ''),
(550, 4, 'Hi', 1, '2022-09-22 00:39:39', ''),
(551, 4, '2', 1, '2022-09-22 00:39:43', ''),
(553, 12, 'Hi!', 24, '2022-09-23 18:30:56', ''),
(555, 12, 'Ez en vagyok', 24, '2022-09-23 18:31:21', '1663950681461ProfilePic.png'),
(557, 4, 'Na csa', 24, '2022-09-23 18:31:48', ''),
(558, 12, 'Csa', 24, '2022-09-23 18:31:50', ''),
(561, 4, '2', 24, '2022-09-23 18:32:12', ''),
(562, 12, '3', 24, '2022-09-23 18:32:14', ''),
(564, 4, '5', 24, '2022-09-23 18:32:20', ''),
(565, 12, '6', 24, '2022-09-23 18:32:21', ''),
(567, 4, '8', 24, '2022-09-23 18:32:24', ''),
(568, 12, '9', 24, '2022-09-23 18:32:27', ''),
(569, 12, 'Szia', 25, '2022-09-23 18:43:03', ''),
(571, 4, '2', 25, '2022-09-23 18:43:22', ''),
(588, 4, 'Csa', 1, '2022-10-01 00:05:40', ''),
(589, 4, ':D', 1, '2022-10-01 00:05:44', ''),
(591, 4, 'a', 1, '2022-10-01 00:06:43', ''),
(592, 4, 'ab', 1, '2022-10-01 00:07:09', ''),
(593, 4, ':D', 1, '2022-10-01 00:08:01', ''),
(594, 4, 'a', 1, '2022-10-01 00:08:27', ''),
(595, 4, 'a', 1, '2022-10-01 00:08:31', ''),
(596, 4, ':D', 1, '2022-10-01 00:08:36', ''),
(597, 4, 'a', 1, '2022-10-01 00:09:05', ''),
(598, 4, '<3', 1, '2022-10-01 00:09:25', ''),
(603, 4, ':Smiley$E$M$ ', 1, '2022-10-01 01:22:56', ''),
(606, 4, '<3 ', 1, '2022-10-01 01:33:39', ''),
(611, 6, 'a', 26, '2022-10-02 19:06:41', ''),
(614, 4, 'b', 1, '2022-10-03 18:02:49', ''),
(616, 4, 'd', 1, '2022-10-03 18:15:35', ''),
(618, 6, 'b', 26, '2022-10-06 20:28:22', ''),
(620, 4, ':Smiley$E$M$ ', 1, '2022-10-06 20:51:06', ''),
(624, 1, 'Csa', 32, '2022-10-13 22:02:33', ''),
(625, 6, 'Csaa', 32, '2022-10-13 22:02:35', ''),
(626, 6, ':D :D :D ', 32, '2022-10-13 22:02:38', ''),
(627, 1, ':SmileyCECMCH: :SmileyCECMCH: ', 32, '2022-10-13 22:02:44', ''),
(628, 6, 'a', 31, '2022-10-13 22:02:52', ''),
(629, 6, 'b', 31, '2022-10-13 22:02:54', ''),
(630, 1, 'c', 31, '2022-10-13 22:02:56', ''),
(631, 1, 'd', 31, '2022-10-13 22:02:56', '');

-- --------------------------------------------------------

--
-- Table structure for table `pendingfriendrequests`
--

CREATE TABLE `pendingfriendrequests` (
  `id` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `TargetID` int(11) NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `roommembers`
--

CREATE TABLE `roommembers` (
  `id` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roommembers`
--

INSERT INTO `roommembers` (`id`, `RoomID`, `UserID`) VALUES
(68, 30, 4),
(69, 30, 1),
(70, 31, 1),
(71, 31, 6),
(72, 32, 4),
(73, 32, 6),
(74, 32, 1);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` int(11) NOT NULL,
  `RoomKey` varchar(32) NOT NULL,
  `Name` varchar(32) NOT NULL,
  `CoverURL` varchar(128) NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `RoomKey`, `Name`, `CoverURL`, `Date`) VALUES
(30, 'CdYzVBMd', '', '', '2022-10-13 22:01:07'),
(31, '6kNVbQLU', '', '', '2022-10-13 22:02:02'),
(32, 'p7hqOi', 'Csoport', '1665691340524Orarend.png', '2022-10-13 22:02:20');

-- --------------------------------------------------------

--
-- Table structure for table `seenmessage`
--

CREATE TABLE `seenmessage` (
  `id` int(11) NOT NULL,
  `MessageID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(64) NOT NULL,
  `Date` datetime NOT NULL,
  `Ip` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `UserID`, `Token`, `Date`, `Ip`) VALUES
(43, 13, 'N9KmpM)oIwvdDwVa)y8%Dp9m55mg9TbA', '2022-09-20 09:56:34', '::1'),
(49, 13, 'mTCfuk9MLtMEl3Mt1VjIA7M!(yh3itEI', '2022-09-21 22:59:16', '::1'),
(52, 12, '3is9CU3mc(CGYWNf3PlqFuC1IGNJFyK4', '2022-09-23 16:48:01', '::1'),
(67, 6, 'G7sNs5oXy/vRHY8ota7o(z6D=aXNFSqL', '2022-10-03 22:15:38', '::1'),
(74, 14, 'CVai!7BZ/Kv=m=Hnp*n2FI)X(IMsCXAV', '2022-10-05 20:31:59', '::1'),
(77, 6, 'NkshP7Amjf/En830Ctmp9iylrpdTG4A6', '2022-10-06 20:27:52', '::1'),
(78, 6, 'Ju%C5oVc%tfL+Uih8Tsm(xUqVAX5WQxW', '2022-10-06 20:28:54', '::1'),
(81, 6, '0N)!yZvY0stJVKRUZqw4abqglnzHLO1r', '2022-10-06 20:31:44', '::1'),
(119, 1, 'tcIz7zhLA5CdSXHmh04TnDZQUe66Wi2G', '2022-10-13 21:59:05', '::1'),
(121, 6, 'TlQHZBeiUWpUWINhJz0jLqdzoZhIotxB', '2022-10-13 22:01:57', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `twofalogins`
--

CREATE TABLE `twofalogins` (
  `id` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Token` varchar(128) NOT NULL,
  `Date` datetime NOT NULL,
  `Ip` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `Username` varchar(64) NOT NULL,
  `Email` varchar(128) NOT NULL,
  `Password` varchar(128) NOT NULL,
  `RegDate` datetime NOT NULL,
  `AvatarURL` varchar(128) NOT NULL DEFAULT 'DefaultAvatar.png',
  `Disabled` tinyint(1) NOT NULL,
  `Status` varchar(64) NOT NULL DEFAULT '{"Status":"Offline","LastUpdate":"2022-10-3 19:47:51"}',
  `Secret` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `Username`, `Email`, `Password`, `RegDate`, `AvatarURL`, `Disabled`, `Status`, `Secret`) VALUES
(1, 'Szaby', 'szaby@gmail.com', '$2b$10$ZgpYZWo9xg9CwyjYNR33ee5/RnMkcHKtKxXkIqgnDGVX7Sllk3ave', '2022-08-13 00:49:04', '1663611292723Szabylogo.png', 0, '{\"Status\":\"Online\",\"LastUpdate\":\"2022-10-13 22:33:47\"}', '00i/ofIr%DW0UvTD>M4<x$36r%KgELnX'),
(4, 'a', 'a', '$2b$10$ZgpYZWo9xg9CwyjYNR33ee5/RnMkcHKtKxXkIqgnDGVX7Sllk3ave', '2022-08-15 18:04:44', 'DefaultAvatar.png', 0, '{\"Status\":\"Offline\",\"LastUpdate\":\"2022-10-13 22:1:54\"}', ''),
(6, 'Janos', 'Janos', '$2b$10$ZgpYZWo9xg9CwyjYNR33ee5/RnMkcHKtKxXkIqgnDGVX7Sllk3ave', '2022-09-19 20:15:52', 'DefaultAvatar.png', 0, '{\"Status\":\"Offline\",\"LastUpdate\":\"2022-10-13 22:4:6\"}', ''),
(12, 'Szabolcs', 'szabolcs@gmail.com', '$2b$10$ZgpYZWo9xg9CwyjYNR33ee5/RnMkcHKtKxXkIqgnDGVX7Sllk3ave', '2022-09-19 21:36:36', '1663616231193ProfilePic.png', 0, '{\"Status\":\"Offline\",\"LastUpdate\":\"2022-10-03T18:49:53.000Z\"}', ''),
(13, 'c', 'c', '$2b$10$ZgpYZWo9xg9CwyjYNR33ee5/RnMkcHKtKxXkIqgnDGVX7Sllk3ave', '2022-09-20 09:56:30', 'DefaultAvatar.png', 0, '{\"Status\":\"Offline\",\"LastUpdate\":\"2022-10-03T18:49:53.000Z\"}', ''),
(14, 'Pista', 'Pista', '$2b$10$kjOrGYLe7SfeCxkG5wHoquKZpXCV3bA1RLJQuzaAZh46bFsbzBJx.', '2022-10-05 20:31:55', 'DefaultAvatar.png', 0, '{\"Status\":\"Offline\",\"LastUpdate\":\"2022-10-5 20:31:59\"}', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Test` (`UserID`),
  ADD KEY `Test2` (`FriendID`);

--
-- Indexes for table `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `a` (`UserID`),
  ADD KEY `b` (`GroupID`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MESSAGES_RELATION_SEMDER` (`SenderID`),
  ADD KEY `MESSAGES_RELATION_ROOM` (`RoomID`);

--
-- Indexes for table `pendingfriendrequests`
--
ALTER TABLE `pendingfriendrequests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PENDING_FRIEND_REQIEST_USERID` (`UserID`),
  ADD KEY `PENDING_FRIEND_REQIEST_TARGETID` (`TargetID`);

--
-- Indexes for table `roommembers`
--
ALTER TABLE `roommembers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ROOMMEMBERS_ROOMID` (`RoomID`),
  ADD KEY `ROOMMEMBERS_USERID` (`UserID`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seenmessage`
--
ALTER TABLE `seenmessage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SEEN_MESSAGE_MESSAGEID` (`MessageID`),
  ADD KEY `SEEN_MESSAGE_USERID` (`UserID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `twofalogins`
--
ALTER TABLE `twofalogins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `groupmembers`
--
ALTER TABLE `groupmembers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=632;

--
-- AUTO_INCREMENT for table `pendingfriendrequests`
--
ALTER TABLE `pendingfriendrequests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `roommembers`
--
ALTER TABLE `roommembers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `seenmessage`
--
ALTER TABLE `seenmessage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `twofalogins`
--
ALTER TABLE `twofalogins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `Test` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `Test2` FOREIGN KEY (`FriendID`) REFERENCES `users` (`id`);

--
-- Constraints for table `groupmembers`
--
ALTER TABLE `groupmembers`
  ADD CONSTRAINT `a` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `b` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`id`);

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `MESSAGES_RELATION_SEMDER` FOREIGN KEY (`SenderID`) REFERENCES `users` (`id`);

--
-- Constraints for table `pendingfriendrequests`
--
ALTER TABLE `pendingfriendrequests`
  ADD CONSTRAINT `PENDING_FRIEND_REQIEST_TARGETID` FOREIGN KEY (`TargetID`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `PENDING_FRIEND_REQIEST_USERID` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`);

--
-- Constraints for table `roommembers`
--
ALTER TABLE `roommembers`
  ADD CONSTRAINT `ROOMMEMBERS_ROOMID` FOREIGN KEY (`RoomID`) REFERENCES `rooms` (`id`),
  ADD CONSTRAINT `ROOMMEMBERS_USERID` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`);

--
-- Constraints for table `seenmessage`
--
ALTER TABLE `seenmessage`
  ADD CONSTRAINT `SEEN_MESSAGE_MESSAGEID` FOREIGN KEY (`MessageID`) REFERENCES `messages` (`id`),
  ADD CONSTRAINT `SEEN_MESSAGE_USERID` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
