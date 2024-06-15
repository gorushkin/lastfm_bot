import { getRecentTracks } from '../api/getRecentTracks/getRecentTracks';
import { getGetFriendsRequest } from '../api/getGetFriends/getGetFriends';
import { getUserInfo } from '../api/getUserInfo/getUserInfo';

class LastFMApiService {
  getConvertedTracks = (
    tracks: Array<{
      artist: string;
      name: string;
      album: string;
      url: string;
    }>,
    length: number
  ) => {
    return tracks
      .slice(0, length)
      .map((item) => `<a href="${item.url}">${item.artist}: ${item.name}</a>`)
      .join('\n');
  };

  getUserFriends = async (username: string) => {
    const response = await getGetFriendsRequest(username);

    return response.friends.user;
  };

  private readonly getUserTracks = async (username: string) => {
    const response = await getRecentTracks(username);

    const tracks = response.recenttracks.track.map((item) => {
      return {
        artist: item.artist['#text'],
        name: item.name,
        album: item.album['#text'],
        url: item.url,
        attr: item['@attr']
      };
    });

    return tracks;
  };

  getUserCurrentTrack = async (username: string) => {
    const tracks = await this.getUserTracks(username);

    const isPlaying = tracks[0].attr?.nowplaying === 'true';

    return { currentTrackInfo: this.getConvertedTracks(tracks, 1), isPlaying };
  };

  getUserRecentTracks = async (username: string) => {
    const tracks = await this.getUserTracks(username);

    return this.getConvertedTracks(tracks, 10);
  };

  getUserInfo = async (username: string) => {
    const response = await getUserInfo(username);

    return response.user;
  };
}

export const lastFMApiService = new LastFMApiService();
