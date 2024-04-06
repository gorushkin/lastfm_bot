export type GetGetFriendsResponse = {
  friends: Friends;
}

export type Friends = {
  '@attr': Attr;
  user: LastFmUser[];
}

export type Attr = {
  perPage: string;
  totalPages: string;
  page: string;
  total: string;
  user: string;
}

export type LastFmUser = {
  name: string;
  url: string;
  country: string;
  playlists: string;
  playcount: string;
  image: Image[];
  registered: Registered;
  realname: string;
  subscriber: string;
  bootstrap: string;
  type: string;
}

export type Image = {
  size: string;
  '#text': string;
}

export type Registered = {
  unixtime: string;
  '#text': string;
}
