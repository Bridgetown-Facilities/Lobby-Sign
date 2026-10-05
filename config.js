// Lobby Sign settings for Bridgetown Church.
// This is the only file that needs editing to change arrows or how a room's name reads on the sign.
window.LOBBY_SIGN = {
  // The Apps Script web app address (Deploy > Manage deployments > Web app URL).
  // It only hands out today's events tagged "Lobby Sign", so it is not a secret.
  dataUrl: "",

  // How often the TV checks Planning Center for changes.
  refreshMinutes: 2,

  // Arrow numbers match the Arrow Key (add ?key to the end of the sign's address to see it):
  //  1 Straight Ahead    2 Ahead Left    3 Ahead Right    4 Left    5 Right
  //  6 Ahead, Then Left  7 Ahead, Then Right  8 Down Left  9 Down Right  10 Down
  // "room" must match the room name in Planning Center (capitals, periods and apostrophes don't matter).
  // "show" is optional: a shorter name for the sign.
  rooms: [
    { room: "Auditorium", arrow: 5 },
    { room: "Collaboration Room", arrow: 1 },
    { room: "Conference Room", arrow: 6 },
    { room: "Hospitality Room", arrow: 4 },
    { room: "Forest", arrow: 8 },
    { room: "Tilikum", arrow: 8 },
    { room: "Prayer Room", arrow: 8 },
    { room: "Broadway", arrow: 8 },
    { room: "Burnside", arrow: 8 },
    { room: "Council Crest", arrow: 8 },
    { room: "Fremont", arrow: 8 },
    { room: "Hawthorne", arrow: 8 },
    { room: "Irving", arrow: 8 },
    { room: "Morrison", arrow: 8 },
    { room: "Mt. Tabor", arrow: 8 },
    { room: "Overlook", arrow: 8 },
    { room: "St. Johns", arrow: 8 },
    { room: "Steel", arrow: 8 }
  ]
};
