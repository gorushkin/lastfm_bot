import { getGetFriendsRequest } from '../api/getGetFriends/getGetFriends';
import { type LastFmUser } from '../api/getRecentTracks/types';

export enum STATE {
  SET_NAME = 'set_name',
  NONE = 'none',
}

class User {
  state: STATE = STATE.NONE;
  friends: LastFmUser[] = [];

  constructor (
    public name: string,
    public id: number
  ) {}

  setState (state: STATE) {
    this.state = state;
  }

  updateFriends = async () => {
    const response = await getGetFriendsRequest(this.name);
    if (response.ok) {
      this.friends = response.data.friends.user;
      return this.friends;
    }
  };

  getFriends = async () => {
    if (this.friends.length === 0) {
      return await this.updateFriends();
    }
    return this.friends;
  };
}

class DB {
  private readonly users: User[] = [];

  addUser (user: User) {
    this.users.push(user);
  }

  getUser (id: number) {
    return this.users.find((user) => user.id === id);
  }

  getUserFriends = async (id: number) => {
    const user = this.getUser(id);
    return await user?.getFriends();
  };
}

export { User, DB };
