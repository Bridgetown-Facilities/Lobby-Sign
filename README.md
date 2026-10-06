# Lobby Sign

Live wayfinding signs for Bridgetown Church, on the lobby TV and on iPads around the building. They show today's Planning Center Calendar events tagged **Lobby Sign**, each with its start time, room, and an arrow pointing the way. Events drop off when they end.

Everything here is free: GitHub Pages hosts the signs, and a Google Apps Script under the Bridgetown Google account reads Planning Center.

## Putting an event on the signs

Add the **Lobby Sign** tag (tag group: Signage) to the event in Planning Center Calendar. That's the only filter. The signs show the event's public time, never setup or teardown.

## Setting up a screen

Open **setup.html** (the Sign Builder) on the screen you're setting up. Pick what the screen is for, check the preview, and tap **Open This Sign**. On an iPad, add it to the Home Screen and lock it with Guided Access; the steps are on the Sign Builder page.

| Sign | What it shows | Address |
|---|---|---|
| Lobby | Every tagged event today, with arrows from the main entrance | the plain address |
| Hallway | Only the rooms you pick, with one arrow for where that screen stands | `?rooms=Forest,Tilikum&arrow=4` |
| Door | What's in one room now, then what's next. With nothing left today, it labels the room | `?room=Forest` |

Other options, which can be combined with any sign:

- `?theme=ptw` uses a host organization's look instead of today's default.
- `?title=Giver Gathering` shows that text instead of Planning Center events.
- `?arrow=none` hides the arrows.
- `?sample` shows sample events, and `?key` shows all ten arrows with their numbers.

Every screen sizes its type to fit, in one or two columns, and works standing on end (portrait) or on its side.

## Looks for hosted events

`config.js` holds a look for Bridgetown and one for each organization we host (colors, font, how the host's name appears, and words to drop from event names, so "Practicing the Way: Giver Gathering" reads "Giver Gathering"). To add an organization, copy an existing look and change it.

To switch every screen for a day, add the date to `themeByDate`. The next day, the screens go back to `defaultTheme` on their own.

## Changing an arrow or a room name

Edit `config.js`. Each room has an arrow number (pointing from the main entrance, where the TV sits) and an optional different name for the sign.

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

## Staying current

Each screen checks Planning Center every 2 minutes. It checks this repository every 5 minutes: a change to `config.js` shows up without a reload, and a change to the sign itself makes the screen reload. Every screen also reloads once a night.

## How it fits together

- `index.html` is the sign. GitHub Pages serves it.
- `setup.html` is the Sign Builder.
- `config.js` holds the rooms, arrows, looks, and the Apps Script address.
- `apps-script/Code.gs` is a copy of the Apps Script that reads Planning Center. The real one runs at script.google.com under the Bridgetown account and holds the Planning Center token in its Script Properties. The token is never in this repository.
- `assets/` holds the Bridgetown icon and TeX Gyre Heros Bold, a free Helvetica clone used on devices without Helvetica Neue (license in `assets/FONT-LICENSE.txt`). The Practicing the Way look loads Satoshi from Fontshare, which allows free use but not hosting the files ourselves.

## What the corner message means

- **Connecting to Planning Center:** the screen hasn't heard back yet. It should clear within a minute.
- **Can't reach Planning Center. Showing the update from [time].:** the screen lost its connection or Apps Script hit an error. The sign keeps showing the last good update. Run `checkSetup` in Apps Script to see what's wrong.
- **Add the Apps Script address to config.js:** setup isn't finished.

## TV settings (Samsung)

Open the sign in the TV's Internet app and bookmark it. In Settings > All Settings > General & Privacy > Power and Energy Saving, turn off Auto Power Saving and Auto Power Off. Turn off Auto Protection Time (the screen saver) too. Press OK on the remote once to ask the page for full screen.
