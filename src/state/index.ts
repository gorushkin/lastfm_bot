export enum MODE {
  SET_INPUT_NAME = 'set_input_name',
  NONE = 'none',
}

type UserId = number;

class State {
  data = new Map<UserId, MODE>();

  setMode = (id: number, screen: MODE) => this.data.set(id, screen);

  setModeInputLastFM = (id: number) => this.setMode(id, MODE.SET_INPUT_NAME);

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
  }

  getUserInfo = (id: number) => {
    return {
      id,
      screen: this.getMode(id)
    };
  }
}

export const stateInstance = new State();
