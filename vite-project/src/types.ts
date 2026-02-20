export type Album = {
    id?: number;
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
