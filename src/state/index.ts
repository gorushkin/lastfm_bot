const state = new Map();

class State {
  data = new Map<string, string>();

  getUsername = (id: string) => this.data.get(id);

  setUsername = (id: string, username: string) => this.data.set(id, username);
}
