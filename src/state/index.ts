export enum MODE {
  SET_INPUT_NAME,
  SET_INPUT_FRIEND_NAME,
  GET_RECENT_TRACKS,
  NONE,
}

type UserId = number;

class State {
  data = new Map<UserId, MODE>();

  private readonly setMode = (id: number, screen: MODE) =>
    this.data.set(id, screen);

  resetMode = (id: number) => {
    this.setMode(id, MODE.NONE);
  };

  setModeInputUsername = (id: number) => {
    this.setMode(id, MODE.SET_INPUT_NAME);
  };

  setModeInputFriendName = (id: number) => {
    this.setMode(id, MODE.SET_INPUT_FRIEND_NAME);
  };

  private readonly checkUser = (id: number) => !!this.data.has(id);

  initUser = (id: number) => {
    if (!this.checkUser(id)) {
      this.setMode(id, MODE.NONE);
    }
    return this.getMode(id);
  };

  private readonly getMode = (id: number) => this.data.get(id);

  getUsers = () => {
    return Array.from(this.data.keys());
  };

  isModeInputName = (id: number) => {
    return this.getMode(id) === MODE.SET_INPUT_NAME;
  };

  isModeInputFriendName = (id: number) => {
    return this.getMode(id) === MODE.SET_INPUT_FRIEND_NAME;
  };

  getUserInfo = (id: number) => {
    return {
      isModeInputName: this.isModeInputName(id),
      isModeInputFriendName: this.isModeInputFriendName(id)
    };
  };
}

export const stateInstance = new State();
