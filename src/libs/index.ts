export const getFriendsListMessage = (names: string[]) => {
  if (names.length === 0) {
    return 'You have no friends';
  }

  const namesList = names
    .map((name) => `<a href="https://www.last.fm/user/${name}">${name}</a>`)
    .join('\n');

  return `Your lastfm friends \n${namesList}`;
};
