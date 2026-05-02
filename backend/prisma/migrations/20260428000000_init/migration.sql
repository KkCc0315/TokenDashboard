-- CreateTable
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `User_email_key`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Watchlist` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `Watchlist_userId_name_key`(`userId`, `name`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WatchlistItem` (
  `id` VARCHAR(191) NOT NULL,
  `watchlistId` VARCHAR(191) NOT NULL,
  `tokenSymbol` VARCHAR(191) NOT NULL,
  `tokenName` VARCHAR(191) NOT NULL,
  `contractAddress` VARCHAR(191) NULL,
  `chain` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `WatchlistItem_watchlistId_tokenSymbol_key`(`watchlistId`, `tokenSymbol`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiSyncLog` (
  `id` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL,
  `endpoint` VARCHAR(191) NOT NULL,
  `status` VARCHAR(191) NOT NULL,
  `message` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Watchlist`
  ADD CONSTRAINT `Watchlist_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WatchlistItem`
  ADD CONSTRAINT `WatchlistItem_watchlistId_fkey`
  FOREIGN KEY (`watchlistId`) REFERENCES `Watchlist`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
