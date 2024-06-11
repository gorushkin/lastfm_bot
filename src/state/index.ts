export enum MODE {
  SET_INPUT_NAME = 'SET_INPUT_NAME',
  GET_RECENT_TRACKS = 'GET_RECENT_TRACKS',
  NONE = 'NONE',
}

type UserId = number;

class State {
  data = new Map<UserId, MODE>();

  setMode = (id: number, screen: MODE) => this.data.set(id, screen);

  resetMode = (id: number) => {
    this.setMode(id, MODE.NONE)
  }

  setModeInputLastFM = (id: number) => {
    this.setMode(id, MODE.SET_INPUT_NAME);
  };

  setModeNone = (id: number) => this.setMode(id, MODE.NONE);

  checkUser = (id: number) => !!this.data.has(id);

  initUser = (id: number) => {
    if (!this.checkUser(id)) {
      this.setMode(id, MODE.NONE);
    }
    return this.getMode(id);
  };

  getMode = (id: number) => this.data.get(id);

  getUsers = () => {
    return Array.from(this.data.keys());
  };

  getUserInfo = (id: number) => {
    return {
      id,
      screen: this.getMode(id)
    };
  };

  getInfo = () => {
    const info = this.getUsers().map(this.getUserInfo);
    console.info('data', info);
  };
}

export const stateInstance = new State();
