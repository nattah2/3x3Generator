import Sortable from 'sortablejs';
import { createIcons, icons } from 'lucide';

interface Album {
    albumImage: HTMLImageElement | null;
    audioFile: File | null;
    startTime: number;
    endTime: number;
    artist: string;
    albumName: string;
    songName: string;
    description: string;
    tags: string[];
}

const albums: Album[] = [];

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
        img.src = URL.createObjectURL(file);
    });
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<div class="main-container">
    <div class="left-hand-side">
        <div id="grid">
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
            <div class="gridElement">
                <button class="btn-play" title="Play / Preview" aria-label="Play album">
                    <i data-lucide="play"></i>
                </button>
                <button class="btn-close" title="Remove" aria-label="Remove album">
                    <i data-lucide="x"></i>
                </button>
            </div>
        </div>

        <div class="parent-container">
            <button id="loadTest">Load Test Data</button>
            <button id="renderVideo">Render & Download Video</button>

            <div class="parent-container">
                <h2>Add Album</h2>
                <form id="albumForm">
                    <div>
                        <label>Album Art:</label>
                        <input id="albumArtInput" type="file" accept="image/*">
                    </div>

                    <div>
                        <label>Audio File:</label>
                        <input id="audioFileInput" type="file" accept="audio/*">
                    </div>

                    <div>
                        <label>Artist:</label>
                        <input id="artistInput" type="text">
                    </div>

                    <div>
                        <label>Album Name:</label>
                        <input id="albumNameInput" type="text">
                    </div>

                    <div>
                        <label>Song Name:</label>
                        <input id="songNameInput" type="text">
                    </div>

                    <button type="submit">Add Album</button>
                </form>

                <button id="download">Download test WebM</button>
            </div>
        </div>
    </div>
    <div class="right-hand-side">
        <p>Album List: </p>
        <ul id="album-list">
        </ul>
        <button>Edit</button>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    const albumListElement = document.getElementById('album-list');
    const gridElement = document.getElementById('grid');

    if (albumListElement) {
        new Sortable(albumListElement, {
            animation: 150
        });
    }

    if (gridElement) {
        new Sortable(gridElement, {
            swap: true,
            animation: 150
        });
    }
    
    createIcons({icons});
    createModal();
});

document.querySelector<HTMLFormElement>('#albumForm')!.addEventListener('submit', async (e) => {
    e.preventDefault();

    const albumArtFile = (document.getElementById('albumArtInput') as HTMLInputElement).files?.[0] ?? null;
    const audioFile = (document.getElementById('audioFileInput') as HTMLInputElement).files?.[0] ?? null;
    const artist = (document.getElementById('artistInput') as HTMLInputElement).value.trim();
    const albumName = (document.getElementById('albumNameInput') as HTMLInputElement).value.trim();
    const songName = (document.getElementById('songNameInput') as HTMLInputElement).value.trim();

    let albumImage: HTMLImageElement | null = null;

    if (albumArtFile) {
        try {
            albumImage = await loadImageFromFile(albumArtFile);
            console.log(`Album art loaded: ${albumArtFile.name}`);
        } catch (err) {
            console.error("Could not load album art:", err);
            alert("Failed to load the album artwork. Using without cover.");
        }
    }

    const newAlbum: Album = {
        albumImage,
        audioFile,
        startTime: 0,
        endTime: 0,
        artist: artist || "Unknown Artist",
        albumName: albumName || "Unknown Album",
        songName: songName || "Untitled",
        description: '',
        tags: [],
    };

    albums.push(newAlbum);
    console.log('Album added:', newAlbum);
    console.log('Total albums:', albums.length);

    addAlbumToSidebar(newAlbum);

    (e.target as HTMLFormElement).reset();
});

function addAlbumToSidebar(album: Album): void {
    const albumListElement = document.getElementById("album-list");
    
    if (!albumListElement) {
        console.error("Album list element not found");
        return;
    }

    const newItem = document.createElement("li");
    newItem.classList.add("list-item");
    newItem.textContent = `${album.artist} - ${album.albumName}`;
    newItem.draggable = true; 
    
    newItem.addEventListener('dragstart', (e) => {
        const albumIndex = albums.indexOf(album);
        e.dataTransfer!.setData('albumIndex', albumIndex.toString());
    });
    
    albumListElement.appendChild(newItem);
}

const gridList = document.querySelectorAll('.gridElement');

gridList.forEach(function(element) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault(); // Required to allow drop
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        const albumIndex = parseInt(e.dataTransfer!.getData('albumIndex'));
        const album = albums[albumIndex];
        const targetSlot = e.target; 

        const existingImg = targetSlot.querySelector('img.album');
        if (existingImg) {
            existingImg.remove();
        }

        // targetSlot.innerHTML = `<img src="${album.albumImage.src}" class="album">`;
        const img = document.createElement('img');
        img.src = album.albumImage!.src;
        img.className = 'album';
        targetSlot.appendChild(img);
    });
})

const closeButtonList = document.querySelectorAll('.btn-close');

closeButtonList.forEach(function(element) {
    element.addEventListener('click', (e) => {
        console.log(element);
        const parent = element.parentElement;
        if (!parent) {return};
        const img = parent.querySelector(".album");
        if (img) {
            img.remove();
        }
    });
})

function createModal() {
    const modal = document.createElement('div');
    modal.classList.add("modal");
    const modalContent = document.createElement('div');
    const main_container = document.body.getElementsByClassName("main-container");
    main_container[0].appendChild(modal);
}
