# TODO (by priority, descending)


#### Function Scheduling System

- [ ] figure out `node-schedule` function scheduling and `discord.js` embeds in order to make a `chat-data.json` backup system where at 11:59pm every night, the current `chat-data.json` file is embedded in a message and sent to the `#archive` channel (also integrate new system into bot-accessible commands)

  - [ ] make/complete a `scheduler.js` file for easy scheduling

    - [x] test basic scheduling functions using the new file

    - [x] make a class that saves/loads scheduled events (separate from `node-schedule`, or possibly something built-in; if it *is* built-in, a class is not necessary)

      > Note: was not built-in, a class was made (`Scheduler`)

    - [x] ***[NEW]*** create `calendarService.js` initiated by `utilServices.js` which creates a singleton instance of the `Scheduler` class

      > Note: the purpose of this is so that there's only one instance of `Scheduler` (`scheduler`) which manages all premeditated function executions

    - [ ] ***[NEW]*** (maybe/maybe not) import singleton instance of `Scheduler` into the original `scheduler.js` for easier imports (ideally no need to reference `schedulerService.js`)

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


#### Low Priority / Miscellaneous

- [x] ***[NEW]*** create/implement `logging.js`, a replacement for `console.log` with more debugging details

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
