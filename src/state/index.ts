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

  private readonly getMode = (id: number) => this.data.get(id);

  resetMode = (id: number) => {
    this.data.delete(id);
  };

  setModeInputUsername = (id: number) => {
    this.setMode(id, MODE.SET_INPUT_NAME);
  };

  setModeInputFriendName = (id: number) => {
    this.setMode(id, MODE.SET_INPUT_FRIEND_NAME);
  };

  getUsers = () => {
    return Array.from(this.data.keys());
  };

  isInputNameMode = (id: number) => {
    return this.getMode(id) === MODE.SET_INPUT_NAME;
  };

  isFriendNameInputMode = (id: number) => {
    return this.getMode(id) === MODE.SET_INPUT_FRIEND_NAME;
  };

  getUserInfo = (id: number) => {
    return {
      isModeInputName: this.isInputNameMode(id),
      isModeInputFriendName: this.isFriendNameInputMode(id)
    };
  };
}

export const stateInstance = new State();
