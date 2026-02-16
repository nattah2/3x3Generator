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

function create_audio_buffer_from_file() {
    return blob;
}

async function render_video_and_download() {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;

    const fps = 30;
    const durationSeconds = 5;
    const frameCount = fps * durationSeconds;
    const frameDuration = 1 / fps; // seconds

    const output = new Output({
        format: new WebMOutputFormat(),
        target: new BufferTarget(),
    });

    const videoSource = new CanvasSource(canvas, {
        codec: 'vp9',
        bitrate: 1e6,
    });

    output.addVideoTrack(videoSource);
    // const audioSource = new AudioBufferSource({
    //     codec: 'opus', /* TODO Should this be AAC? */
    //     bitrate: QUALITY_HIGH,
    // });

    /* Get audio */
    var audio = document.getElementById("upload");
    var file = audio.files[0];
    var reader = new FileReader();
    reader.fileName = file.name;
    alert(`Hey, we got ${reader.fileName}`);
    
    const audioInput = new Input({
        formats: ALL_FORMATS,
        source: new BlobSource(file),
    });
    const audioSource = await audioInput.getAudioTracks(); // => InputAudioTrack[]
    console.log(audioSource[0].isVideoTrack()); /* false */
    console.log(audioSource[0].isAudioTrack()); /* true */
    console.log(audioSource[0].constructor.name); //InputAudioTrack
    
    const audioOutput = new AudioBufferSource({codec:'opus', bitrate:1e6});
    audioOutput.add(audioSource[0]);
    output.addAudioTrack(audioOutput);

    // const videoSource = new CanvasSource(canvas, {
    //     codec: 'vp9',
    //     bitrate: 1e6,
    // });
    

    // return;
    // const input = new Input({
    //     source: new BlobSource(file), // From a file picker, for example
    //     formats: ALL_FORMATS,
    // });
    // await audioSource.add(audioBuffer1);
    

    await output.start();

    for (let i = 0; i < frameCount; i++) {
        const t = i * frameDuration;

        // Draw something that changes so frames aren't identical
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px sans-serif';
        ctx.fillText(`Frame ${i}`, 50, 100);
        ctx.fillRect(50 + i, 150, 100, 100);

        // Push this frame to MediaBunny
        videoSource.add(t, frameDuration);
    }

    await output.finalize();

    const buffer = output.target.buffer;
    const blob = new Blob([buffer], { type: 'video/webm' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'test_10s_30fps.webm';
    a.click();

    URL.revokeObjectURL(url);
}

function test_func() {
    alert("We're here!");
    var input = document.getElementById("upload");
    var file = input.files[0];
    var reader = new FileReader();
    reader.fileName = file.name;
    alert(`Hey, we got ${reader.fileName}`);
}

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<canvas id="myCanvas" width="640" height="360"></canvas>
<div class="parent-container">
<button id="download">Download test WebM</button>
<input id="upload" type="file"></input>
</div>
`;

document
    .querySelector<HTMLButtonElement>('#download')!
    .addEventListener('click', render_video_and_download);
