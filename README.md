# Lobby Sign

The wayfinding sign for the TV at Bridgetown Church's main entrance. It shows today's Planning Center Calendar events tagged **Lobby Sign**, each with its start time, room, and an arrow pointing the way, so people walking in can find their event without asking. Events drop off the screen when they end. When nothing tagged is left for the day, it shows "In Portland as it is in Heaven."

Everything here is free: GitHub Pages hosts the sign, and a Google Apps Script under the Bridgetown Google account reads Planning Center.

## Putting an event on the sign

Add the **Lobby Sign** tag (tag group: Signage) to the event in Planning Center Calendar. That's the only filter. The sign shows the event's public time, never setup or teardown.

## Changing an arrow or a room name

Edit `config.js`. Each room has an arrow number and an optional shorter name for the sign. Add `?key` to the end of the sign's address to see all ten arrows with their numbers. Add `?sample` to see two sample events, which is handy for testing the TV.

| # | Arrow |
|---|---|
| 1 | Straight Ahead |
| 2 | Ahead Left |
| 3 | Ahead Right |
| 4 | Left |
| 5 | Right |
| 6 | Ahead, Then Left |
| 7 | Ahead, Then Right |
| 8 | Down Left |
| 9 | Down Right |
| 10 | Down |

## How it fits together

- `index.html` is the sign. GitHub Pages serves it.
- `config.js` holds the arrows, room names, and the Apps Script address.
- `apps-script/Code.gs` is a copy of the Apps Script that reads Planning Center. The real one runs at script.google.com under the Bridgetown account and holds the Planning Center token in its Script Properties. The token is never in this repository.
- `assets/` holds the Bridgetown icon and TeX Gyre Heros Bold, a free Helvetica clone used on devices without Helvetica Neue (license in `assets/FONT-LICENSE.txt`).

The TV checks for changes every 2 minutes and reloads itself once a night.

## What the corner message means

- **Connecting to Planning Center:** the TV hasn't heard back yet. It should clear within a minute.
- **Can't reach Planning Center. Showing the update from [time].:** the TV lost its connection or Apps Script hit an error. The sign keeps showing the last good update. Run `checkSetup` in Apps Script to see what's wrong.
- **Add the Apps Script address to config.js:** setup isn't finished.

## TV settings (Samsung)

Open the sign in the TV's Internet app and bookmark it. In Settings > All Settings > General & Privacy > Power and Energy Saving, turn off Auto Power Saving and Auto Power Off. Turn off Auto Protection Time (the screen saver) too. Press OK on the remote once to ask the page for full screen.
