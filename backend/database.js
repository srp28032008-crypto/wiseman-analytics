// Wiseman Analytics - Pure JS File-Backed JSON Database Engine
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const tradesFile = path.join(dataDir, 'trades.json');

// Ensure database directory and files exist on initialization
async function initDatabase() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    
    // Check and create users.json
    try {
      await fs.access(usersFile);
    } catch {
      await fs.writeFile(usersFile, JSON.stringify([]));
    }

    // Check and create trades.json
    try {
      await fs.access(tradesFile);
    } catch {
      await fs.writeFile(tradesFile, JSON.stringify([]));
    }
    
    console.log("📁 TERMINATOR DATABASE: Storage layers verified. Integrity sealed.");
  } catch (err) {
    console.error("❌ TERMINATOR DATABASE INIT ERROR:", err);
  }
}

// Helper: Safely read file contents
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Read error on ${filePath}, recovering with empty set:`, err);
    return [];
  }
}

// Helper: Safely write JSON content (Atomic write replacement)
async function writeJsonFile(filePath, data) {
  try {
    const tempPath = `${filePath}.tmp`;
    const payload = JSON.stringify(data, null, 2);
    await fs.writeFile(tempPath, payload, 'utf8');
    await fs.rename(tempPath, filePath);
  } catch (err) {
    console.error(`Write error on ${filePath}:`, err);
    throw err;
  }
}

// Initialize on require
initDatabase();

// Exported database interface
const db = {
  users: {
    async create(username, hashedPassword) {
      const users = await readJsonFile(usersFile);
      
      const newUser = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        username: username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      await writeJsonFile(usersFile, users);
      return newUser;
    },

    async find(username) {
      const users = await readJsonFile(usersFile);
      return users.find(u => u.username === username) || null;
    }
  },

  trades: {
    async create(userId, symbol, type, entryPrice, size) {
      const trades = await readJsonFile(tradesFile);
      
      const newTrade = {
        id: "TID_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        userId: userId,
        symbol: symbol,
        type: type,
        entryPrice: parseFloat(entryPrice),
        size: parseInt(size),
        status: "OPEN",
        exitPrice: null,
        pnl: 0,
        createdAt: new Date().toISOString(),
        closedAt: null
      };

      trades.push(newTrade);
      await writeJsonFile(tradesFile, trades);
      return newTrade;
    },

    async close(tradeId, exitPrice, pnl) {
      const trades = await readJsonFile(tradesFile);
      const idx = trades.findIndex(t => t.id === tradeId);
      
      if (idx === -1) {
        throw new Error("Trade record not found, Sir.");
      }

      trades[idx].status = "CLOSED";
      trades[idx].exitPrice = parseFloat(exitPrice);
      trades[idx].pnl = parseFloat(pnl);
      trades[idx].closedAt = new Date().toISOString();

      await writeJsonFile(tradesFile, trades);
      return trades[idx];
    },

    async list(userId) {
      const trades = await readJsonFile(tradesFile);
      return trades.filter(t => t.userId === userId);
    }
  }
};

module.exports = db;
