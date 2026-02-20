// album.test.ts
import { describe, it, expect } from 'vitest';

describe('Album', () => {
  it('should create an album with test data', () => {
    const mockAlbumArt = new File(['fake-image-data'], 'album.jpg', { type: 'image/jpeg' });
    const mockAudioFile = new File(['fake-audio-data'], 'song.opus', { type: 'audio/opus' });
    
    const album: Album = {
      albumArt: mockAlbumArt,
      audioFile: mockAudioFile,
      startTime: 0,
      endTime: 30,
      artist: 'Test Artist',
      albumName: 'Test Album',
      songName: 'Test Song',
      description: 'Test description',
      tags: ['rock', 'test']
    };
    
    expect(album.artist).toBe('Test Artist');
    expect(album.audioFile?.name).toBe('song.opus');
  });
});
