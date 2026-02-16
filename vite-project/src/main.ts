import {
    Input,
    ALL_FORMATS,
    BlobSource,
    Output,
    WebMOutputFormat,
    BufferTarget,
    CanvasSource,
    AudioSource,
    AudioBufferSource,
    QUALITY_HIGH
} from 'mediabunny';

// ────────────────────────────────────────────────
// Updated Album type – now holds decoded image
// ────────────────────────────────────────────────
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

function renderFrame(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    album: Album,
    time: number,
    duration: number
) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw album art if available
    if (album.albumImage) {
        // You can adjust size/position as needed
        const size = 140;
        ctx.drawImage(album.albumImage, 20, 20, size, size);
    }

    // Text overlays
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.fillText(album.songName, 20, 200);

    ctx.font = '20px Arial';
    ctx.fillText(album.artist, 20, 235);
    ctx.fillText(album.albumName, 20, 265);

    // Progress bar
    const progress = time / duration;
    const barWidth = canvas.width * 0.8;
    const barX = (canvas.width - barWidth) / 2;
    const barY = canvas.height - 40;

    ctx.fillStyle = '#444';
    ctx.fillRect(barX, barY, barWidth, 12);

    ctx.fillStyle = '#4caf50';
    ctx.fillRect(barX, barY, barWidth * progress, 12);
}

// ────────────────────────────────────────────────
// Main video rendering function
// ────────────────────────────────────────────────
async function renderVideo() {
    if (albums.length === 0) {
        console.warn("No albums to render");
        return;
    }

    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fps = 30;
    const durationSeconds = 5;           // ← feel free to make dynamic later
    const frameCount = fps * durationSeconds;
    const frameDuration = 1 / fps;

    const output = new Output({
        format: new WebMOutputFormat(),
        target: new BufferTarget(),
    });

    const videoSource = new CanvasSource(canvas, {
        codec: 'vp9',
        bitrate: 2_500_000,   // 2.5 Mbps – reasonable quality
    });

    const audioSource = new AudioBufferSource({
        codec: 'opus',
        bitrate: QUALITY_HIGH
    });

    output.addVideoTrack(videoSource);
    output.addAudioTrack(audioSource);

    await output.start();

    // Render frames
    const album = albums[0]; // for now using first album – later you can loop etc.

    for (let i = 0; i < frameCount; i++) {
        const t = i * frameDuration;
        renderFrame(ctx, canvas, album, t, durationSeconds);
        videoSource.add(t, frameDuration);
    }

    // Add audio (only first album for now)
    if (album.audioFile) {
        const arrayBuffer = await album.audioFile.arrayBuffer();
        const audioContext = new AudioContext();
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        audioSource.add(decoded);
    }

    await output.finalize();

    const buffer = output.target.buffer;
    const blob = new Blob([buffer], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'music_visualizer.webm';
    a.click();

    URL.revokeObjectURL(url);
}



const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<canvas id="myCanvas" width="640" height="360"></canvas>

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
`;


// Rest of your setup code remains mostly the same
document.querySelector<HTMLButtonElement>('#loadTest')?.addEventListener('click', async () => {
    // For testing – you can skip real files or mock them differently
    console.warn("Test album currently disabled – add real files via form");
    // If you want a mock version, create a blank image:
    // const img = new Image(); img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    // await new Promise(r => img.onload = r);
});

document.querySelector<HTMLButtonElement>('#download')!.addEventListener('click', async () => {
    try {
        await renderVideo();
        console.log('Video rendered & download started');
    } catch (err) {
        console.error('Render failed:', err);
        alert('Something went wrong while rendering the video.');
    }
});

// ────────────────────────────────────────────────
// Add album – now decodes image immediately
// ────────────────────────────────────────────────
document.querySelector<HTMLFormElement>('#albumForm')!.addEventListener('submit', async (e) => {
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
});
