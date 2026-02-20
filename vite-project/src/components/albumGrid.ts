import { getAlbum } from '../state';

export function initAlbumGrid(): void {
    setupGridDragAndDrop();
    setupCloseButtons();
    setupPlayButtons();
}

function setupGridDragAndDrop(): void {
    const gridElements = document.querySelectorAll('.gridElement');

    gridElements.forEach((element) => {
        element.addEventListener('dragover', (e) => {
            e.preventDefault(); // Required to allow drop
        });

        element.addEventListener('drop', (e) => {
            e.preventDefault();
            
            const target = e.target as HTMLElement;
            const targetSlot = target.closest('.gridElement') as HTMLElement;
            
            if (!targetSlot) return;

            const albumIndex = parseInt(e.dataTransfer!.getData('albumIndex'));
            const album = getAlbum(albumIndex);
            
            if (!album || !album.albumImage) {
                console.error("Album or album image not found");
                return;
            }

            const existingImg = targetSlot.querySelector('img.album');
            if (existingImg) {
                existingImg.remove();
            }

            const img = document.createElement('img');
            img.src = album.albumImage.src;
            img.className = 'album';
            img.dataset.albumIndex = albumIndex.toString();
            targetSlot.appendChild(img);
        });
    });
}

function setupCloseButtons(): void {
    const closeButtons = document.querySelectorAll('.btn-close');

    closeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            
            const parent = (button as HTMLElement).closest('.gridElement');
            if (!parent) return;

            const img = parent.querySelector('.album');
            if (img) {
                img.remove();
                console.log('Album removed from grid');
            }
        });
    });
}

function setupPlayButtons(): void {
    const playButtons = document.querySelectorAll('.btn-play');

    playButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); 
            
            const parent = (button as HTMLElement).closest('.gridElement');
            if (!parent) return;

            const img = parent.querySelector('.album') as HTMLImageElement;
            if (!img) {
                console.log('No album in this slot');
                return;
            }

            const albumIndex = parseInt(img.dataset.albumIndex || '-1');
            if (albumIndex === -1) return;

            const album = getAlbum(albumIndex);
            if (!album || !album.audioFile) {
                console.log('No audio file for this album');
                return;
            }

            playAudioPreview(album.audioFile, album.startTime, album.endTime);
        });
    });
}

let currentAudio: HTMLAudioElement | null = null;

function playAudioPreview(audioFile: File, startTime: number, endTime: number): void {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }

    const audio = new Audio(URL.createObjectURL(audioFile));
    audio.currentTime = startTime;
    
    audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= endTime) {
            audio.pause();
            URL.revokeObjectURL(audio.src);
        }
    });

    audio.play();
    currentAudio = audio;
    
    console.log(`Playing preview from ${startTime}s to ${endTime}s`);
}
