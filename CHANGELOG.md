___~--***--~___

***TODO (by priority, descending)***

___~--***--~___

- [ ] figure out `node-schedule` function scheduling and `discord.js` embeds in order to make a `chat-data.json` backup system where at 11:59pm every night, the current `chat-data.json` file is embedded in a message and sent to the `#archive` channel

  - [ ] ***[NEW]*** make a `scheduler.js` file for easy scheduling

    - [x] ***[NEW]*** initial functions creation

    - [ ] ***[NEW]*** test basic scheduling functions using the new file

    - [ ] ***[NEW]*** make a class that saves/loads scheduled events (separate from `node-schedule`, or possibly something built-in; if it *is* built in, a class is not necessary)

  - [ ] ***[NEW]*** use this new `scheduler.js` system and integrate it into `botConfig.js`

    - [ ] ***[NEW]*** initial setup/testing of `scheduler.js` in `botConfig.js`

    - [ ] ***[NEW]*** integrate `scheduler.js` into bot-accessible commands (i.e. `/messagelater`) as well as automatic daily `chatlog.json` backups at 11:59pm in the `#archive` channel

      - [ ] ***[NEW]*** set up bot commands (simple)

      - [ ] ***[NEW]*** daily `chatlog.json` backups

        - [ ] ***[NEW]*** figure out embedding with `discord.js`

        - [ ] ***[NEW]*** send embed of archive

- [ ] configure "Scheduling Bot" in `botConfig.js`

  - [ ] integrate with Eve using `promptEndings`

    - [ ] "teach" Eve how to use the scheduling bot

      > Note: outlined in `/schedule` section of `promptEndings` in `botConfig.js`

  - [ ] develop direct support for the Google Calendar API

    - [x] Google auth stuff

      > Note: created `googleAuth.js` file in `lib` folder that contains/exports an `authenticate` function which serves as an all-encompassing system for managing oauth tokens for Google Cloud applications

    - [x] auto sync, and auto schedule export from the server to the calendar

      > Note: this isn't as relevant because of the nature of how this system functions, as soon as a set of events are approved to be uploaded to Google Calendar they simply *are uploaded*, and every time the AI needs to access the calendar, it views the most recent calendar events loaded straight from the API

    - [ ] ***[NEW]*** add all necessary functions pertaining to calendar access/modification

      - [ ] ***[NEW]*** overview function returning recent/upcoming events as well as [farther away] significant events (marked as such)

        > Note: IDs should be present on every returned event for selection (if needed)

      - [ ] ***[NEW]*** function to access of events within a range of dates (IDs)

      - [ ] ***[NEW]*** function to add events with full payload customization (basic event info as well as `all day` flag, color, etc.), etc.)

      - [ ] ***[NEW]*** function to modify existing events (selected by the ID returned by "access functions")

- [ ] ***[NEW]*** make askNoRecord  in `openai.js` (may not be needed but would be nice to have)

- [ ] ***[NEW]*** rename `Scheduling Bot` into something more broad (`Utility Bot`, `Multipurpose Bot`, `Management Bot`, etc.)

- [x] ***[NEW]*** create `addStatusMessage` in `openai.js`, all encompassing method for time keeping and message origin changes

- [x] ***[NEW]*** add `nodemon.json` to ignore changes in `src/data/*` folder

___~--***--~___

***LOW PRIORITY TODO***

___~--***--~___

- [ ] ***[NEW]*** rename `Scheduling Bot` to something more broad (i.e. `Utility Bot`)

  > Note: not as relevant yet because calendar access is currently the only functionality, though scheduled AI prompting *is* being worked on

  - [ ] (change Eve's initial system text to make her...um...less incredibly worried about me...)

    > Note: in `chat-data.json` (not git tracked), created `Eve [AI]` (AI "personality" with access to slash (`/`) commands), renamed original Eve to `Eve [Original]`, and merged the two (as a new "chat", `Eve`) into a more capable, personable, assistant (though...she is still decently worried so that needs to be fixed)

- [ ] (develop some consistency in terms of when to use double quotes (") vs single quotes (') vs none (none: json object declaration))



***


> Note: checked boxes signify completion during *this commit* (after committing they must be deleted)
