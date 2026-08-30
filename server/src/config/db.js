import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import {
  INITIAL_USERS,
  INITIAL_DONORS,
  INITIAL_HOSPITALS,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
  PRESEEDED_RAG_DOCUMENTS
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'db_store.json');

// In-memory data store with JSON persistence fallback
class DataStore {
  constructor() {
    this.data = {
      users: [],
      donors: [],
      hospitals: [],
      requests: [],
      notifications: [],
      documents: [],
      documentChunks: [],
      conversations: []
    };
    this.isMongoConnected = false;
  }

  async init(mongoUri) {
    const cleanUri = (mongoUri || '').trim();
    if (cleanUri) {
      try {
        await mongoose.connect(cleanUri, {
          serverSelectionTimeoutMS: 5000
        });
        this.isMongoConnected = true;
        console.log(' Connected successfully to MongoDB Atlas database!');
      } catch (err) {
        console.warn(' MongoDB Atlas connection notice:', err.message);
        console.log(' Running with high-performance persistent data store.');
      }
    } else {
      console.log(' No MONGODB_URI configured. Running with high-performance persistent store.');
    }

    this.loadLocal();
  }

  loadLocal() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log(' Loaded persistent local database store.');
      } catch (e) {
        console.warn(' Error reading local db file, re-initializing with seed data.');
        this.seedInitial();
      }
    } else {
      this.seedInitial();
    }
  }

  seedInitial() {
    this.data.users = [...INITIAL_USERS];
    this.data.donors = [...INITIAL_DONORS];
    this.data.hospitals = [...INITIAL_HOSPITALS];
    this.data.requests = [...INITIAL_REQUESTS];
    this.data.notifications = [...INITIAL_NOTIFICATIONS];
    this.data.documents = [...PRESEEDED_RAG_DOCUMENTS];
    this.data.documentChunks = [];
    this.data.conversations = [];
    this.persist();
    console.log(' Seeded initial users, donors, hospitals, emergency requests, and clinical knowledge documents.');
  }

  persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist local DB file:', err.message);
    }
  }

  // Generic helper operations
  collection(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return {
      find: (predicate = () => true) => this.data[name].filter(predicate),
      findOne: (predicate) => this.data[name].find(predicate) || null,
      findById: (id) => this.data[name].find((item) => item.id === id || item._id === id) || null,
      insert: (doc) => {
        const item = { ...doc };
        if (!item.id && !item._id) {
          item.id = `${name.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        }
        item.createdAt = item.createdAt || new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        this.data[name].push(item);
        this.persist();
        return item;
      },
      update: (id, updates) => {
        const index = this.data[name].findIndex((item) => item.id === id || item._id === id);
        if (index === -1) return null;
        this.data[name][index] = {
          ...this.data[name][index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.persist();
        return this.data[name][index];
      },
      delete: (id) => {
        const index = this.data[name].findIndex((item) => item.id === id || item._id === id);
        if (index === -1) return false;
        this.data[name].splice(index, 1);
        this.persist();
        return true;
      },
      deleteMany: (predicate) => {
        const initialLen = this.data[name].length;
        this.data[name] = this.data[name].filter((item) => !predicate(item));
        this.persist();
        return initialLen - this.data[name].length;
      }
    };
  }
}

export const db = new DataStore();
