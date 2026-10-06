// Lobby Sign settings for Bridgetown Church.
// This is the only file that needs editing to change arrows, room names, or a sign's look.
window.LOBBY_SIGN = {
  // The Apps Script web app address (Deploy > Manage deployments > Web app URL).
  // It only hands out today's events tagged "Lobby Sign", so it is not a secret.
  dataUrl: "https://script.google.com/macros/s/AKfycbxmEiZZVnqcyYw3s79GmRrmNPIgtbVEmlTjZqAslVK8w4-fivuQPkLzGyN-e4felwZa/exec",

  // How often each screen checks Planning Center for changes.
  refreshMinutes: 2,

  // Arrow numbers match the Arrow Key (add ?key to the end of the sign's address to see it):
  //  1 Straight Ahead    2 Ahead Left    3 Ahead Right    4 Left    5 Right
  //  6 Ahead, Then Left  7 Ahead, Then Right  8 Down Left  9 Down Right  10 Down
  // These point the way from the main entrance, where the lobby TV sits.
  // "room" must match the room name in Planning Center (capitals, periods and apostrophes don't matter).
  // "show" is optional: a different name for the sign.
  rooms: [
    { room: "Auditorium", arrow: 5 },
    { room: "Collaboration Room", arrow: 1 },
    { room: "Conference Room", arrow: 6 },
    { room: "Hospitality Room", arrow: 4 },
    { room: "Forest", arrow: 8 },
    { room: "Tilikum", arrow: 8 },
    { room: "Prayer Room", arrow: 8 },
    { room: "Kids Check-In Lobby", arrow: 8 },
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
  ],

  // Which look a sign uses when its address doesn't name one.
  // List a date to switch every screen for that day; the day after, they go back to the default.
  defaultTheme: "bridgetown",
  themeByDate: {
    "2026-10-06": "ptw"
  },

  // Looks for Bridgetown and the organizations we host. Copy one to add another.
  themes: {
    bridgetown: {
      label: "Bridgetown Church",
      background: "#000000",   // Brand Black
      text: "#FFFFFF",         // Brand White
      detail: "#E2E3E4",       // Brand Light Grey
      quiet: "#8E9093",
      font: '"Sign Sans", Arial, sans-serif', // Helvetica Neue Bold, or the free stand-in in assets/
      fontCss: "",
      nameWeight: 700,
      detailWeight: 700,
      detailSize: 1,           // time | room line, as a share of the event name's size
      arrowWeight: 9,
      arrowAbove: false,       // false: arrow beside the name, true: arrow above it
      markImage: "assets/bridgetown-icon.png",
      markText: "",
      emptyLines: ["In Portland", "as it is", "in Heaven."],
      removeFromNames: []
    },
    ptw: {
      label: "Practicing the Way",
      background: "#E6DDC7",
      text: "#1B1918",
      detail: "#1B1918",
      quiet: "#6F675C",
      font: '"Satoshi", "Helvetica Neue", Arial, sans-serif',
      fontCss: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap",
      nameWeight: 400,
      detailWeight: 500,
      detailSize: 0.6,
      arrowWeight: 6,
      arrowAbove: true,
      markImage: "",
      markText: "Practicing the Way",
      emptyLines: ["Practicing the Way"],
      removeFromNames: ["Practicing the Way", "PTW"]
    }
  }
};
