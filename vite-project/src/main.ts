import Sortable from 'sortablejs';
import { createIcons, icons } from 'lucide';
import { initAlbumForm } from './components/albumForm';
import { initAlbumGrid } from './components/albumGrid';
import { initAlbumSidebar } from './components/albumSidebar';
import { initAlbumModal, showModal } from './components/albumModal';
import { renderVideo } from './renderVideo';
// import { loadAlbums } from './db';

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<div class="main-container">
    <div class="left-hand-side">
        <div class="grid-with-labels">
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

            <div id="grid-labels">
                <div class="grid-label-row">
                    <span class="label-index">1.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">2.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">3.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">4.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">5.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">6.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">7.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">8.</span>
                    <p>EEE</p>
                </div>
                <div class="grid-label-row">
                    <span class="label-index">9.</span>
                    <p>EEE</p>
                </div>
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
        <button id="edit">edit</button>
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
    
    const edit = document.getElementById('edit');
    edit.addEventListener('click', () => {
        showModal(0);
    }) 
    

    const videoButton = document.getElementById('renderVideo');
    videoButton.addEventListener('click', () => {
        renderVideo();
    }) 
    
    createIcons({ icons });

    initAlbumForm();
    initAlbumGrid();
    initAlbumSidebar();
    initAlbumModal();
});

