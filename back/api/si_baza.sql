-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 18, 2024 at 01:13 PM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `si_baza`
--

-- --------------------------------------------------------

--
-- Table structure for table `korisnici`
--

DROP TABLE IF EXISTS `Korisnici`;
CREATE TABLE IF NOT EXISTS `Korisnici` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ime` longtext NOT NULL,
  `prezime` longtext NOT NULL,
  `username` longtext NOT NULL,
  `email` longtext NOT NULL,
  `passwordHash` longblob NOT NULL,
  `passwordSalt` longblob NOT NULL,
  `idUlogeAplikacija` int NOT NULL,
  `status` int NOT NULL,
  `imageURL` longtext NOT NULL,
  `phoneNumber` longtext NOT NULL,
  `specijalizacija` longtext,
  `opis` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `korisnici`
--

INSERT INTO `Korisnici` (`id`, `ime`, `prezime`, `username`, `email`, `passwordHash`, `passwordSalt`, `idUlogeAplikacija`, `status`, `imageURL`, `phoneNumber`, `specijalizacija`, `opis`) VALUES
(1, 'Admin', 'Acc', 'admin', 'admintw@test.com', 0x1b119fe55bf0a6400a7b4a3354f6c497913f2e3bd019ebd16967b3dde82ab98c5d7479425c8bcac7ed3f45cfd4ceb6296a76a585dee3d3490272a7b25496aa0c, 0x17e6adde3dade414c9fbfa3a891dc0a705db5d47997ce6ea90c1e6de486bca984b72919e6b6569c983a193edc700ebed3f5566f0c7b825dcdf945053f5b94dd00bce0e92aa02e89de1c5eeb7d863a8b39ef57ca2d28f8102be5d76b75a171eca4eeb13bd498130cd16579c537bb8a5fdd449f364d4cf0815e250c11cdd8e5641, 1, 1, 'Uploads/default.png', '0613321010', NULL, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--
DROP TABLE IF EXISTS `Likes`;
CREATE TABLE IF NOT EXISTS `Likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `korisnikId` int NOT NULL,
  `komentarId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Likes_komentarId` (`komentarId`),
  KEY `IX_Likes_korisnikId` (`korisnikId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listadokumenata`
--

DROP TABLE IF EXISTS `listaDokumenata`;
CREATE TABLE IF NOT EXISTS `listaDokumenata` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Title` longtext NOT NULL,
  `DateUploaded` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listadokumentacijataskova`
--

DROP TABLE IF EXISTS `ListaDokumentacijaTaskova`;
CREATE TABLE IF NOT EXISTS `ListaDokumentacijaTaskova` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Naslov` longtext NOT NULL,
  `Putanja` longtext NOT NULL,
  `taskId` int NOT NULL,
  `DateUploaded` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ListaDokumentacijaTaskova_taskId` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listakomentara`
--
DROP TABLE IF EXISTS `ListaKomentara`;
CREATE TABLE IF NOT EXISTS `ListaKomentara` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` longtext NOT NULL,
  `autorId` int NOT NULL,
  `taskId` int NOT NULL,
  `parentId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaKomentara_autorId` (`autorId`),
  KEY `IX_ListaKomentara_taskId` (`taskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listalabela`
--

DROP TABLE IF EXISTS `ListaLabela`;
CREATE TABLE IF NOT EXISTS `ListaLabela` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` longtext NOT NULL,
  `idProjekat` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaLabela_idProjekat` (`idProjekat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listalabelredosled`
--
DROP TABLE IF EXISTS `ListaLabelRedosled`;
CREATE TABLE IF NOT EXISTS `ListaLabelRedosled` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order` longtext NOT NULL,
  `idProjekat` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaLabelRedosled_idProjekat` (`idProjekat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- --------------------------------------------------------
--
-- Table structure for table `listaobavestenjekorisnik`
--

DROP TABLE IF EXISTS `ListaObavestenjeKorisnik`;
CREATE TABLE IF NOT EXISTS `ListaObavestenjeKorisnik` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idObavestenje` int NOT NULL,
  `idKorisnik` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaObavestenjeKorisnik_idKorisnik` (`idKorisnik`),
  KEY `IX_ListaObavestenjeKorisnik_idObavestenje` (`idObavestenje`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listapodesavanja`
--
DROP TABLE IF EXISTS `ListaPodesavanja`;
CREATE TABLE IF NOT EXISTS `ListaPodesavanja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `korisnikId` int NOT NULL,
  `jezik` longtext NOT NULL,
  `notifikacija` tinyint(1) NOT NULL,
  `status` longtext NOT NULL,
  `homeHK` longtext NOT NULL,
  `profileHK` longtext NOT NULL,
  `tasksHK` longtext NOT NULL,
  `settingsHK` longtext NOT NULL,
  `logoutHK` longtext NOT NULL,
  `temaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaPodesavanja_korisnikId` (`korisnikId`),
  KEY `IX_ListaPodesavanja_temaId` (`temaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `listapodesavanja`
--

INSERT INTO `ListaPodesavanja` (`id`, `korisnikId`, `jezik`, `notifikacija`, `status`, `homeHK`, `profileHK`, `tasksHK`, `settingsHK`, `logoutHK`, `temaId`) VALUES
(1, 1, 'en', 1, 'Active', 'w', 'a', 's', 'd', 'x', 1);

-- --------------------------------------------------------

--
-- Table structure for table `listataskucesnici`
--

DROP TABLE IF EXISTS `ListaTaskUcesnici`;
CREATE TABLE IF NOT EXISTS `ListaTaskUcesnici` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `idTask` int NOT NULL,
  `idKorisnik` int NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_ListaTaskUcesnici_idKorisnik` (`idKorisnik`),
  KEY `IX_ListaTaskUcesnici_idTask` (`idTask`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listatema`
--
DROP TABLE IF EXISTS `ListaTema`;
CREATE TABLE IF NOT EXISTS `ListaTema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` longtext NOT NULL,
  `outer` longtext NOT NULL,
  `inner` longtext NOT NULL,
  `navBar` longtext NOT NULL,
  `korisnikId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaTema_korisnikId` (`korisnikId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
--
-- Dumping data for table `listatema`
--
INSERT INTO `ListaTema` (`id`, `naziv`, `outer`, `inner`, `navBar`, `korisnikId`) VALUES
(1, 'Light', '#ffffff', '#ffffff', '#1E1E1E', NULL),
(2, 'Dark', '#000000', '#1e1e1e', '#1e1e1e', NULL),
(3, 'Warm', '#fffcda', '#fff2cb', '#fff2cb', NULL),
(4, 'Cold', '#a8dcff', '#cdfffa', '#00aaff', NULL);
-- --------------------------------------------------------

--
-- Table structure for table `listaulogakorisnikprojekat`
--

DROP TABLE IF EXISTS `ListaUlogaKorisnikProjekat`;
CREATE TABLE IF NOT EXISTS `ListaUlogaKorisnikProjekat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idProjekat` int NOT NULL,
  `idKorisnik` int NOT NULL,
  `idUloga` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ListaUlogaKorisnikProjekat_idKorisnik` (`idKorisnik`),
  KEY `IX_ListaUlogaKorisnikProjekat_idProjekat` (`idProjekat`),
  KEY `IX_ListaUlogaKorisnikProjekat_idUloga` (`idUloga`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listaulogaprojekat`
--

DROP TABLE IF EXISTS `ListaUlogaProjekat`;
CREATE TABLE IF NOT EXISTS `ListaUlogaProjekat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `listaulogaprojekat`
--

INSERT INTO `ListaUlogaProjekat` (`id`, `naziv`) VALUES
(1, 'Owner'),
(2, 'Maintainer'),
(3, 'Developer'),
(4, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `listaulogeaplikacija`
--

DROP TABLE IF EXISTS `ListaUlogeAplikacija`;
CREATE TABLE IF NOT EXISTS `ListaUlogeAplikacija` (
  `id` int NOT NULL,
  `naziv` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `listaulogeaplikacija`
--

INSERT INTO `ListaUlogeAplikacija` (`id`, `naziv`) VALUES
(1, 'Admin'),
(2, 'User'),
(3, 'Guest'),
(4, 'Project Manager');

-- --------------------------------------------------------

--
-- Table structure for table `listauserresettoken`
--

DROP TABLE IF EXISTS `ListaUserResetToken`;
CREATE TABLE IF NOT EXISTS `ListaUserResetToken` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` char(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listazavisnostitaskova`
--

DROP TABLE IF EXISTS `listaZavisnostiTaskova`;
CREATE TABLE IF NOT EXISTS `listaZavisnostiTaskova` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sourceId` int NOT NULL,
  `targetId` int NOT NULL,
  `type` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_listaZavisnostiTaskova_sourceId` (`sourceId`),
  KEY `IX_listaZavisnostiTaskova_targetId` (`targetId`),
  KEY `IX_listaZavisnostiTaskova_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `listazavisnostitype`
--

DROP TABLE IF EXISTS `ListaZavisnostiType`;
CREATE TABLE IF NOT EXISTS `ListaZavisnostiType` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `listazavisnostitype`
--

INSERT INTO `ListaZavisnostiType` (`id`, `name`) VALUES
(1, 'finish_to_start'),
(2, 'start_to_start'),
(3, 'finish_to_finish'),
(4, 'start_to_finish');

-- --------------------------------------------------------

--
-- Table structure for table `obavestenja`
--

DROP TABLE IF EXISTS `Obavestenja`;
CREATE TABLE IF NOT EXISTS `Obavestenja` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` longtext NOT NULL,
  `isRead` int NOT NULL,
  `dateCreated` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projekti`
--

DROP TABLE IF EXISTS `Projekti`;
CREATE TABLE IF NOT EXISTS `Projekti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` longtext NOT NULL,
  `opis` longtext NOT NULL,
  `prioritet` longtext NOT NULL,
  `pocetak` longtext NOT NULL,
  `kraj` longtext NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `Tasks`;
CREATE TABLE IF NOT EXISTS `Tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `naziv` longtext NOT NULL,
  `opis` longtext NOT NULL,
  `prioritet` longtext NOT NULL,
  `pocetak` longtext NOT NULL,
  `kraj` longtext NOT NULL,
  `idParent` int NOT NULL,
  `idProjekat` int DEFAULT NULL,
  `idLabel` int DEFAULT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Tasks_idLabel` (`idLabel`),
  KEY `IX_Tasks_idProjekat` (`idProjekat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
CREATE TABLE IF NOT EXISTS `__efmigrationshistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `__efmigrationshistory`
--

INSERT INTO `__efmigrationshistory` (`MigrationId`, `ProductVersion`) VALUES
('20240418130328_init', '8.0.2');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `Likes`
  ADD CONSTRAINT `FK_Likes_Korisnici_korisnikId` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Likes_ListaKomentara_komentarId` FOREIGN KEY (`komentarId`) REFERENCES `ListaKomentara` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listadokumentacijataskova`
--
ALTER TABLE `ListaDokumentacijaTaskova`
  ADD CONSTRAINT `FK_ListaDokumentacijaTaskova_Tasks_taskId` FOREIGN KEY (`taskId`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE;


--
-- Constraints for table `listakomentara`
--
ALTER TABLE `ListaKomentara`
  ADD CONSTRAINT `FK_ListaKomentara_Korisnici_autorId` FOREIGN KEY (`autorId`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ListaKomentara_Tasks_taskId` FOREIGN KEY (`taskId`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listalabela`
--
ALTER TABLE `ListaLabela`
  ADD CONSTRAINT `FK_ListaLabela_Projekti_idProjekat` FOREIGN KEY (`idProjekat`) REFERENCES `Projekti` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listalabelredosled`
--
ALTER TABLE `ListaLabelRedosled`
  ADD CONSTRAINT `FK_ListaLabelRedosled_Projekti_idProjekat` FOREIGN KEY (`idProjekat`) REFERENCES `Projekti` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listaobavestenjekorisnik`
--
ALTER TABLE `ListaObavestenjeKorisnik`
  ADD CONSTRAINT `FK_ListaObavestenjeKorisnik_Korisnici_idKorisnik` FOREIGN KEY (`idKorisnik`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ListaObavestenjeKorisnik_Obavestenja_idObavestenje` FOREIGN KEY (`idObavestenje`) REFERENCES `Obavestenja` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listapodesavanja`
--
ALTER TABLE `ListaPodesavanja`
  ADD CONSTRAINT `FK_ListaPodesavanja_Korisnici_korisnikId` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ListaPodesavanja_ListaTema_temaId` FOREIGN KEY (`temaId`) REFERENCES `ListaTema` (`id`);

--
-- Constraints for table `listataskucesnici`
--
ALTER TABLE `ListaTaskUcesnici`
  ADD CONSTRAINT `FK_ListaTaskUcesnici_Korisnici_idKorisnik` FOREIGN KEY (`idKorisnik`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ListaTaskUcesnici_Tasks_idTask` FOREIGN KEY (`idTask`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listatema`
--
ALTER TABLE `ListaTema`
  ADD CONSTRAINT `FK_ListaTema_Korisnici_korisnikId` FOREIGN KEY (`korisnikId`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listaulogakorisnikprojekat`
--
ALTER TABLE `ListaUlogaKorisnikProjekat`
  ADD CONSTRAINT `FK_ListaUlogaKorisnikProjekat_Korisnici_idKorisnik` FOREIGN KEY (`idKorisnik`) REFERENCES `Korisnici` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ListaUlogaKorisnikProjekat_ListaUlogaProjekat_idUloga` FOREIGN KEY (`idUloga`) REFERENCES `ListaUlogaProjekat` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ListaUlogaKorisnikProjekat_Projekti_idProjekat` FOREIGN KEY (`idProjekat`) REFERENCES `Projekti` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `listazavisnostitaskova`
--
ALTER TABLE `listaZavisnostiTaskova`
  ADD CONSTRAINT `FK_listaZavisnostiTaskova_ListaZavisnostiType_type` FOREIGN KEY (`type`) REFERENCES `ListaZavisnostiType` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_listaZavisnostiTaskova_Tasks_sourceId` FOREIGN KEY (`sourceId`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_listaZavisnostiTaskova_Tasks_targetId` FOREIGN KEY (`targetId`) REFERENCES `Tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `Tasks`
  ADD CONSTRAINT `FK_Tasks_ListaLabela_idLabel` FOREIGN KEY (`idLabel`) REFERENCES `ListaLabela` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Tasks_Projekti_idProjekat` FOREIGN KEY (`idProjekat`) REFERENCES `Projekti` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
