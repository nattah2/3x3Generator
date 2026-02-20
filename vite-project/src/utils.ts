export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
        img.src = URL.createObjectURL(file);
    });
}

export async function getAudioDuration(audioFile: File): Promise<number> {
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new AudioContext();
    const decoded = await audioContext.decodeAudioData(arrayBuffer);
    return decoded.duration;
}

export function calculateDefaultAudioTimes(duration: number): { startTime: number; endTime: number } {
    const clipLength = 30; // 30 second clip
    
    // Start at 1/3 through the song (often past intro, into the good part)
    const startTime = Math.max(0, (duration / 3) - (clipLength / 2));
    const endTime = Math.min(duration, startTime + clipLength);
    
    return { startTime, endTime };
}
