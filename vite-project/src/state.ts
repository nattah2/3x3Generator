import type { Album } from './types';

export const albums: Album[] = [];

export function addAlbum(album: Album): number {
    albums.push(album);
    console.log('Album added:', album);
    console.log('Total albums:', albums.length);
    return albums.length - 1; // Return index of added album
}

export function removeAlbum(index: number): void {
    if (index >= 0 && index < albums.length) {
        albums.splice(index, 1);
        console.log('Album removed at index:', index);
        console.log('Total albums:', albums.length);
    }
}

export function updateAlbum(index: number, updates: Partial<Album>): void {
    if (index >= 0 && index < albums.length) {
        albums[index] = { ...albums[index], ...updates };
        console.log('Album updated at index:', index);
    }
}

export function getAlbum(index: number): Album | undefined {
    return albums[index];
}

export function getAllAlbums(): Album[] {
    return albums;
}
