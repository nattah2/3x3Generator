import { openDB } from 'idb';
import type { Album } from './types';

const db = await openDB('music-app', 1, {
  upgrade(db) {
    db.createObjectStore('albums', { keyPath: 'id', autoIncrement: true });
  }
});

// Save an album (stores File and HTMLImageElement-compatible data natively)
await db.add('albums', album);

// Get all albums
const albums = await db.getAll('albums');
