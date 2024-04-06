import { getRecentTracks } from '../api/getRecentTracks/getRecentTracks';
import { type Track } from '../api/getGetFriends/types';

export function compareDates (date1: Date, date2: Date): number {
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
}

export function compareDatesWithShift (
  date1: Date,
  date2: Date,
  shift: number
): number {
  const updatedItem = date1.getTime() + shift;
  return updatedItem > date2.getTime() ? -1 : 1;
}

export class FollowingUser {
  lastTrack: Track | null = null;
  name: string;
  lastUpdate: Date = new Date();
  isLoading: boolean = false;

  constructor (name: string) {
    this.name = name;
  }

  setLastTrack = (track: Track) => {
    this.lastTrack = track;
  };

  isSongNew = (track: Track) => {
    if (track?.['@attr'] != null) {
      return this.lastTrack?.name !== track.name;
    }

    return this.lastTrack?.date?.['#text'] !== track.date?.['#text'];
  };

  getLastTrack = () => this.lastTrack;

  getRecentTracks = async () => {
    const response = await getRecentTracks(this.name);
    this.isLoading = false;

    if (response.ok) {
      const { data } = response;
      const lastTrack = data.recenttracks.track[0];
      const isSongNew = this.isSongNew(lastTrack);
      if (isSongNew) {
        console.log('New song:', lastTrack.name);
        this.setLastTrack(lastTrack);
      }
    }
  };

  isListening = () =>
    this.lastTrack !== null && this.lastTrack['@attr']?.nowplaying === 'true';

  updateData = async () => {
    const currentDate = new Date();

    const shouldUpdate =
      compareDatesWithShift(this.lastUpdate, currentDate, 10000) > 0;

    if (!this.isLoading && (shouldUpdate || this.lastTrack === null)) {
      this.lastUpdate = currentDate;
      this.isLoading = true;
      // await this.getRecentTracks();
    }
  };
}
