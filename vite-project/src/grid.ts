import Sortable from 'sortablejs';

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
    <div class="grid">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div><img class="album" src="https://fujiframe.com/assets/images/_3000x2000_fit_center-center_85_none/10085/xhs2-fuji-70-300-Amazilia-Hummingbird.webp"></img></div>
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
    <ul id="album-list">
        <li class="list-item">1</li>
        <li class="list-item">2</li>
        <li class="list-item">3</li>
        <li class="list-item">4</li>
        <li class="list-item">5</li>
        <li class="list-item">6</li>
        <li class="list-item">7</li>
        <li class="list-item">8</li>
        <li class="list-item">9</li>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    var el = document.getElementById('album-list');
    var sortable = new Sortable(
        el,
        {animation: 150}
    )
});

document.querySelector<HTMLFormElement>('#albumForm')!.addEventListener('submit', async (e) => {
    alert("doin it");
    e.preventDefault();

    const albumArtFile  = (document.getElementById('albumArtInput')  as HTMLInputElement).files?.[0] ?? null;
    const audioFile     = (document.getElementById('audioFileInput') as HTMLInputElement).files?.[0] ?? null;
    const artist        = (document.getElementById('artistInput')    as HTMLInputElement).value.trim();
    const albumName     = (document.getElementById('albumNameInput') as HTMLInputElement).value.trim();
    const songName      = (document.getElementById('songNameInput')  as HTMLInputElement).value.trim();

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
        endTime: 0,           // you can compute later from audio duration
        artist: artist || "Unknown Artist",
        albumName: albumName || "Unknown Album",
        songName: songName || "Untitled",
        description: '',
        tags: [],
    };

    albums.push(newAlbum);
    console.log('Album added:', newAlbum);
    console.log('Total albums:', albums.length);

    (e.target as HTMLFormElement).reset();
    alert("WEe didd it!");
});
