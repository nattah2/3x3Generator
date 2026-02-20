import type { Album } from './types';

const DB_NAME = 'musicPlayerDB';
const DB_VERSION = 1;
const STORE_NAME = 'albums';

type StoredAlbum = Omit<Album, 'albumImage'> & {
  albumImageSrc: string | null;
};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function saveAlbum(album: Album): Promise<number> {
  const db = await openDB();

  const stored: StoredAlbum = {
    ...album,
    albumImage: undefined,
    albumImageSrc: album.albumImage?.src ?? null,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(stored);
    tx.oncomplete = () => resolve(request.result as number);
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadAlbums(): Promise<Album[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      const albums: Album[] = request.result.map((s: StoredAlbum) => {
        let albumImage: HTMLImageElement | null = null;
        if (s.albumImageSrc) {
          albumImage = new Image();
          albumImage.src = s.albumImageSrc;
        }

        return { ...s, albumImage };
      });
      resolve(albums);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function clearAlbums(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function updateAlbum(album: Album): Promise<void> {
  if (!album.id) throw new Error('Cannot update album without an id');
  
  const db = await openDB();

  const stored: StoredAlbum = {
    ...album,
    albumImage: undefined,
    albumImageSrc: album.albumImage?.src ?? null,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(stored); // put() updates if id exists, adds if not
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
