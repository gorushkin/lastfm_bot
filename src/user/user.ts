import { type Track } from '../api/types';

class User {
  lastTrack: Track | null = null;
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  setLastTrack = (track: Track) => {
    this.lastTrack = track;
  };

  getLastTrack = () => {
    return this.lastTrack;
  };

  isListening = () => {
    return (
      this.lastTrack !== null && this.lastTrack['@attr']?.nowplaying === 'true'
    );
  };
}

export const user = new User();
