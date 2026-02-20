import type { Album } from '../types';
import { albums } from '../state';

export function initAlbumSidebar(): void {
    // Sidebar is initialized in HTML, no setup needed here
}

export function addAlbumToSidebar(album: Album): void {
    const albumListElement = document.getElementById("album-list");
    
    if (!albumListElement) {
        console.error("Album list element not found");
        return;
    }

    const albumIndex = albums.indexOf(album);
    const newItem = document.createElement("li");
    newItem.classList.add("list-item");
    newItem.textContent = `${album.artist} - ${album.albumName}`;
    newItem.draggable = true;
    newItem.dataset.albumIndex = albumIndex.toString();
    
    newItem.addEventListener('dragstart', (e) => {
        e.dataTransfer!.setData('albumIndex', albumIndex.toString());
    });
    
    albumListElement.appendChild(newItem);
}

export function removeAlbumFromSidebar(albumIndex: number): void {
    const albumListElement = document.getElementById("album-list");
    if (!albumListElement) return;
    
    const items = albumListElement.querySelectorAll('.list-item');
    items.forEach((item) => {
        const itemIndex = parseInt((item as HTMLElement).dataset.albumIndex || '-1');
        if (itemIndex === albumIndex) {
            item.remove();
        }
    });
}

export function updateSidebarItem(albumIndex: number, album: Album): void {
    const albumListElement = document.getElementById("album-list");
    if (!albumListElement) return;
    
    const items = albumListElement.querySelectorAll('.list-item');
    items.forEach((item) => {
        const itemIndex = parseInt((item as HTMLElement).dataset.albumIndex || '-1');
        if (itemIndex === albumIndex) {
            item.textContent = `${album.artist} - ${album.albumName}`;
        }
    });
}
