export enum SCREEN {
  SET_INPUT_NAME = 'set_input_name',
  // LASTFM_NAME_IS_READY = 'lastfm_name_is_ready',
  NONE = 'none',
}

class State {
  data = new Map<number, SCREEN>();

  setScreen = (id: number, screen: SCREEN) => this.data.set(id, screen);

  setScreenInputName = (id: number) => this.setScreen(id, SCREEN.SET_INPUT_NAME);

  checkUser = (id: number) => !!this.data.has(id);

  initUser = (id: number) => {
    if (!this.checkUser(id)) {
      this.setScreen(id, SCREEN.NONE);
    }
    return this.getScreen(id);
  };

  getScreen = (id: number) => this.data.get(id);

  getUsers = () => {
    return Array.from(this.data.keys());
  }

  getUserInfo = (id: number) => {
    return {
      id,
      screen: this.getScreen(id)
    };
  }
}

export const stateInstance = new State();
