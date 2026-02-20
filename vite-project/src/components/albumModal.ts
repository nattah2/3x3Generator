import type { Album } from '../types';
import { getAlbum, updateAlbum } from '../state';
import { updateSidebarItem } from './albumSidebar';
import { loadImageFromFile, getAudioDuration, calculateDefaultAudioTimes } from '../utils';

let modalElement: HTMLElement | null = null;
let currentEditingIndex: number = -1;

export function initAlbumModal(): void {
    createModalHTML();
    setupModalEventListeners();
}

// TODO WHAT IS MODAL CLOSE FIX THAT TO USE LUCIDE
// 
function createModalHTML(): void {
    const modalHTML = `
        <div id="albumModal" class="modal-overlay">
            <div class="modal-container">
                <span class="modal-close">&times;</span>
                
                <div class="modal-body">
                    <div class="modal-preview">
                        <img id="editPreviewImage" src="" alt="Album Art Preview">
                        <div id="noImageText" style="display:none;">No Image Selected</div>
                    </div>

                    <div class="modal-form-side">
                        <h2>Edit Album</h2>
                        <form id="editAlbumForm">
                            <label>Artist</label>
                            <input id="editArtist" type="text" required>

                            <label>Album Name</label>
                            <input id="editAlbumName" type="text" required>

                            <label>Song Name</label>
                            <input id="editSongName" type="text" required>

                            <div class="file-inputs">
                                <div>
                                    <label>Update Art</label>
                                    <input id="editAlbumArt" type="file" accept="image/*">
                                </div>
                                <div>
                                    <label>Update Audio</label>
                                    <input id="editAudioFile" type="file" accept="audio/*">
                                </div>
                            </div>

                            <div class="audio-controls">
                                <audio controls id="previewAudio">
                                    <source src="" type="audio/ogg">
                                </audio>
                            </div>

                            <div class="time-grid">
                                <div>
                                    <label>Start (s)</label>
                                    <input id="editStartTime" type="number" step="0.1">
                                </div>
                                <div>
                                    <label>End (s)</label>
                                    <input id="editEndTime" type="number" step="0.1">
                                </div>
                            </div>

                            <label>Description</label>
                            <textarea id="editDescription" rows="2"></textarea>

                            <div class="modal-buttons">
                                <button type="submit" class="save-btn">Save Changes</button>
                                <button type="button" class="modal-cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalElement = document.getElementById('albumModal');
}

function setupModalEventListeners(): void {
    if (!modalElement) return;

    // TODO LOL
    const closeBtn = modalElement.querySelector('.modal-close');
    const cancelBtn = modalElement.querySelector('.modal-cancel');
    const form = document.getElementById('editAlbumForm') as HTMLFormElement;

    // Close modal handlers
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    // Close when clicking outside modal
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeModal();
        }
    });

    // Form submission
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        saveAlbumChanges();
    });
}

export function showModal(albumIndex: number): void {
    const album = getAlbum(albumIndex);
    if (!album || !modalElement) return;
    
    currentEditingIndex = albumIndex;

    // Fill Text Inputs
    (document.getElementById('editArtist') as HTMLInputElement).value = album.artist;
    (document.getElementById('editAlbumName') as HTMLInputElement).value = album.albumName;
    (document.getElementById('editSongName') as HTMLInputElement).value = album.songName;
    (document.getElementById('editStartTime') as HTMLInputElement).value = album.startTime.toString();
    (document.getElementById('editEndTime') as HTMLInputElement).value = album.endTime.toString();
    (document.getElementById('editDescription') as HTMLTextAreaElement).value = album.description;

    // Handle Image Preview
    const previewImg = document.getElementById('editPreviewImage') as HTMLImageElement;
    if (album.albumImage && album.albumImage.src) {
        previewImg.src = album.albumImage.src;
        previewImg.style.display = 'block';
    } else {
        previewImg.style.display = 'none';
        // Show placeholder text if no image exists
    }
    // Handle audio
    const previewAudio = document.getElementById('previewAudio');
    if (album.audioFile) {
        const fileURL = URL.createObjectURL(album.audioFile);
        previewAudio.src = fileURL;
    }

    modalElement.style.display = 'flex';
}

function closeModal(): void {
    if (!modalElement) return;
    modalElement.style.display = 'none';
    currentEditingIndex = -1;
}

async function saveAlbumChanges(): void { // Added async
    if (currentEditingIndex === -1) return;

    const artFile = (document.getElementById('editAlbumArt') as HTMLInputElement).files?.[0];
    const audioFile = (document.getElementById('editAudioFile') as HTMLInputElement).files?.[0];

    // 1. Get current album to preserve data we aren't editing
    const existingAlbum = getAlbum(currentEditingIndex);
    if (!existingAlbum) return;

    // 2. Prepare the updates
    const updates: Partial<Album> = {
        artist: (document.getElementById('editArtist') as HTMLInputElement).value.trim(),
        albumName: (document.getElementById('editAlbumName') as HTMLInputElement).value.trim(),
        songName: (document.getElementById('editSongName') as HTMLInputElement).value.trim(),
        description: (document.getElementById('editDescription') as HTMLTextAreaElement).value.trim(),
    };

    // 3. Handle New Album Art (Matches your create logic)
    if (artFile) {
        try {
            updates.albumImage = await loadImageFromFile(artFile);
        } catch (err) {
            console.error("Error updating art:", err);
        }
    }

    // 4. Handle New Audio (Recalculates duration/times)
    if (audioFile) {
        try {
            const duration = await getAudioDuration(audioFile);
            const times = calculateDefaultAudioTimes(duration);
            updates.audioFile = audioFile;
            updates.startTime = times.startTime;
            updates.endTime = times.endTime;
            
            // Sync the UI inputs with these new calculated times
            (document.getElementById('editStartTime') as HTMLInputElement).value = times.startTime.toString();
            (document.getElementById('editEndTime') as HTMLInputElement).value = times.endTime.toString();
        } catch (err) {
            console.error("Error updating audio:", err);
        }
    } else {
        // If no new file, grab times from the manual input fields
        updates.startTime = parseFloat((document.getElementById('editStartTime') as HTMLInputElement).value);
        updates.endTime = parseFloat((document.getElementById('editEndTime') as HTMLInputElement).value);
    }

    updateAlbum(currentEditingIndex, updates);
    
    // 5. Update UI
    const updatedAlbum = getAlbum(currentEditingIndex);
    if (updatedAlbum) {
        updateSidebarItem(currentEditingIndex, updatedAlbum);
    }

    closeModal();
}
