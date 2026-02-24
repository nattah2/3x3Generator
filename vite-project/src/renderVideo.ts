import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toCanvas, toPixelData, toSvg } from 'html-to-image';

export function renderVideo() {
    const node = document.getElementById('grid');
    htmlToImage
    .toPng(node)
    .then((dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        document.body.appendChild(img);
    })
    .catch((err) => {
        console.error('oops, something went wrong!', err);
    });
    alert('hi');
}
