export type HistoryResponse = {
  recenttracks: Recenttracks;
};

type Recenttracks = {
  track: Track[];
  '@attr': Attr2;
};

export type Track = {
  artist: Artist;
  streamable: string;
  image: Image[];
  mbid: string;
  album: Album;
  name: string;
  '@attr'?: Attr;
  url: string;
  date?: Date;
};

type Artist = {
  mbid: string;
  '#text': string;
};

export type Image = {
  size: string;
  '#text': string;
};

export type Album = {
  mbid: string;
  '#text': string;
};

export type Attr2 = {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
};

export type Attr = {
  nowplaying: string;
};

export type Date = {
  uts: string;
  '#text': string;
};
