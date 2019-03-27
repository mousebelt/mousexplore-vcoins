module.exports = {
  network: process.env.NETWORK,
  stellarApiUrl: process.env.STELLAR_API_URL || 'http://127.0.0.1:8000/',
  SUBMIT_TRANSACTION_TIMEOUT: 120 * 1000,
  port: 8080,
  storagePath: process.env.STORAGE_PATH || '/',
  lowSpaceSize: process.env.LOW_STORAGE_SIZE ? Number(process.env.LOW_STORAGE_SIZE) : 10 * 1024 * 1024 * 1024, // 10 GB
};
