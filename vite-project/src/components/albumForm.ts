import type { Album } from '../types';
import { addAlbum } from '../state';
import { loadImageFromFile, getAudioDuration, calculateDefaultAudioTimes } from '../utils';
import { addAlbumToSidebar } from './albumSidebar';

export function initAlbumForm(): void {
    const form = document.querySelector<HTMLFormElement>('#albumForm');
    
    if (!form) {
        console.error("Album form not found");
        return;
    }

    form.addEventListener('submit', async (e) => {
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

        let startTime = 0;
        let endTime = 0;

        if (audioFile) {
            try {
                const duration = await getAudioDuration(audioFile);
                const times = calculateDefaultAudioTimes(duration);
                startTime = times.startTime;
                endTime = times.endTime;
                console.log(`Audio duration: ${duration}s, clip: ${startTime}s - ${endTime}s`);
            } catch (err) {
                console.error("Could not get audio duration:", err);
            }
        }

        const newAlbum: Album = {
            albumImage,
            audioFile,
            startTime,
            endTime,
            artist: artist || "Unknown Artist",
            albumName: albumName || "Unknown Album",
            songName: songName || "Untitled",
            description: '',
            tags: [],
        };

        addAlbum(newAlbum);
        addAlbumToSidebar(newAlbum);

        form.reset();
    });
}
