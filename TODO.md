# TODO (by priority, descending)


#### Function Scheduling System

- [ ] figure out `node-schedule` function scheduling and `discord.js` embeds in order to make a `chat-data.json` backup system where at 11:59pm every night, the current `chat-data.json` file is embedded in a message and sent to the `#archive` channel (also integrate new system into bot-accessible commands)

  - [x] make/complete a `scheduler.js` file for easy scheduling

    - [x] ***[MODIFIED]*** (maybe/maybe not) import singleton instance of `Scheduler` into the original `scheduler.js` for easier imports (ideally no need to reference `schedulerService.js` in general usage of singleton instance)

      > Note: read below for more details on how this was achieved (differently than originally planned)

      - [x] ***[NEW]*** create an **async** `getScheduler` function which returns the `scheduler` object once `initialize` is true (no timeout)

        - [x] ***[NEW]*** create workaround for circular dependencies regarding `schedulerService.js` and `scheduler.js`

          > Note: Used `await import` in order to avoid direct circular dependencies

    - [x] ***[NEW]*** create system that removes old `oneTime` events that haven't been deleted (happens in `saveEvents`)

    - [x] ***[NEW]*** move `functionsToSchedule` array into a new file `schedulerFunctions.js` for ease/clarity

    - [x] ***[NEW]*** general bug fixes

      > Note: `loadEvents` now functions correctly with rescheduling events on load

  - [ ] use this new `scheduler.js` system and integrate it into `botConfig.js`

    - [ ] initial setup/testing of `scheduler.js` in `botConfig.js`

    - [ ] daily `chatlog.json` backups

      - [ ] figure out embedding with `discord.js`

      - [ ] send embed of archive

    - [ ] integrate `scheduler.js` into bot-accessible commands (i.e. `/messagelater`) as well as automatic daily `chatlog.json` backups at 11:59pm in the `#archive` channel

      - [ ] set up bot commands


#### Scheduling With Google Cloud API

- [ ] configure "Scheduling Bot" in `botConfig.js`

  - [ ] rename `Scheduling Bot` into something more broad (`Utility Bot`, `Multipurpose Bot`, `Management Bot`, etc.)

    > Note: now `Utility Bot`

  - [ ] integrate with Eve using `promptEndings`

    - [ ] "teach" Eve how to use the scheduling bot

      > Note: outlined in `/schedule` section of `promptEndings` in `botConfig.js`

  - [ ] develop direct support for the Google Calendar API

    - [ ] add all necessary functions pertaining to calendar access/modification

      > Note: IDs should be present within every returned event with any function that provides events (for selection if needed)

      - [ ] overview function returning recent/upcoming events as well as [farther away] significant events (marked as such)

      - [ ] function to access of events within a range of dates

      - [ ] function to add events with full payload customization (basic event info as well as `all day` flag, color, etc.), etc.)

      - [ ] function to modify existing events (selected by the ID returned by "access functions")


#### Miscellaneous

- [x] create `startup.js` which initiates all necessary functions for the project work (also consolidate error management)

  - [x] add all necessary functions for startup

  - [x] ascii splash and "Starting..." text

- [x] update `logging.js` with better functionality

  - [x] add colored console logging in `logging.js`

    > Note: added new "simple 2" mode of `dateTime` and `parseDateTime` specifically for logging purposes (simple time/date only)

    > Note: also excerpted documentation of string formatting with `moment.js` (useful for "simple 2" mode formatting)

  - [x] add better thrown error nesting

  - [x] refactor all error throws and warnings in **entire project** to use new error system

- [x] better error checking in `fileManager.js`'s `loadJsonFromFile`

- [x] create async `awaitValueChange` function in `utils.js`

  > Note: this is particularly useful for ensuring variables like `initialized` are true before continuing execution (i.e. `getScheduler` in `schedulerService.js`)

- [ ] make askNoRecord  in `openai.js` (may not be needed but would be nice to have)

- [ ] modify and/or partially rewrite Eve's system message in `chat-data.json` (not git tracked) so the AI comes off more "personable"

- [ ] general code refactoring, consistent formatting, and following "good" node/js/general programming conventions

  - [ ] develop some consistency in terms of when to use double quotes (") vs single quotes (') vs none (none: json object declaration)


***


> Please Note:
>
> The "***[NEW]***" item prefix should appear on list items that have been added *this commit*.
>
> Checked boxes signify completion during *this commit*.
>
> > After committing they must be deleted, respectively.
