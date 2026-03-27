const { PrismaClient } = require('@prisma/client');

let prisma;

const getPrisma = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl) {
    return null;
  }

  if (
    dbUrl.includes('USER:PASSWORD')
    || dbUrl.includes('HOST.neon.tech')
    || dbUrl.includes('DB_NAME')
  ) {
    return null;
  }

  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
};

const saveScanHistory = async (scanData) => {
  const client = getPrisma();
  if (!client) {
    return;
  }

  try {
    await client.scan.create({
      data: scanData,
    });
  } catch (error) {
    // Scan history is optional; avoid failing core response flow.
    console.warn('Skipping scan history save:', error.message);
  }
};

module.exports = {
  saveScanHistory,
};
