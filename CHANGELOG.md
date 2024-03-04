*I messed up and forgot to commit the first time...*

***

**WHAT I JUST DID THIS COMMIT (what I was going to commit originally)**
- scrapped discord-interactions package and tunnels
  - (scrapped tunnels for the most part - may still use ngrok for general api use)
- set up discord.js with "Eve" discord bot
  - COULDN'T GET INTERACTIONS WORKING :(

**WHAT TO DO NEXT (what I had planned on doing next)**
- figure out interactions
- set up ChatHub objects with discord
- everything else

***

**WHAT I JUST DID THIS COMMIT (the rest)**
- Lexi became Simone, and Simone became **Eve**
- initially set up discord.js events in a very hardcoded way in `chatService.js` (no longer exists)
- refactored all of `chatService.js` in its entirety into a more modular design (`botConfig.js`), which allows for relatively simple event handling with multiple bots (with multiple discord bot tokens and different permissions)
  - (`botConfig.js` essentially contains an array of "bots" that contain their respective discord client objects (/discord configs), code to handle events, a pointer to a chat within `chat-data.json`, and really any logic necessary for the bot)
    - (something to note, any given index in the `bots` array (defined/exported in `botConfig.js`) doesn't necessarily need to have an associated `discord` parameter containing the discord bot config, it's possible for it to be a standalone unit without a dedicated discord bot associated with it)
  - (also *massively* simplified `discordService.js` to work with the newly refactored system)
- new `discordUtils.js` file (just a start) for, well, utility functions related to discord (as of now it's just for parsing messages sent from discord to be more readable)
- fleshed out the `Chathub` class (no longer `ChatHub`) in `openai.js`
  - added functionality for optional timestamp (shown after timeout) and origin (where the input message comes from, be it a discord channel or elsewhere (`origin`, `isFromDiscord`)) status messages (can be specified to be shown/excluded in instances of the `Chat` object's `defaults` parameter (`timestampStatus`, `timestampStatusTimeout`, `originStatus`))
  - translated basic `Chat` class methods into `Chathub` for easy access of `Chat` instances
- temporarily disabled localhost tunneling (ngrok/localtunnel), as `discord.js` has no need for a publicly hosted server
  - (eventually the goal, however, is to set up the server such that it can be accessed through discord *as well as* its own api (this used to be managed by `routes/chat.js` and `controllers/chatController.js` before `discord.js` was adopted, they now have the file extension `.jsNONFUNCTIONAL` as a temporary measure))
- and like last time a **BUNCH** of stuff I'm forgetting

**WHAT TO DO NEXT**
- configure "Scheduling Bot" in `botConfig.js`
  - integrate with Eve using `promptEndings`
    - "teach" Eve how to use the scheduling bot
      - (outlined lines 117-125 of `botConfig.js`)
  - develop direct support for the Google Calendar API
    - Google auth stuff
    - auto sync, and auto schedule export from the server to the calendar
- (less impactful and more annoying, but rewarding)
  - (change Eve's initial system text to make her...um...less incredibly worried about me...)
  - (develop some consistency in terms of when to use double quotes (") vs single quotes (') vs none (none: json object declaration))

***

*wow that was a lot...I gotta get this up and running so I can get my life back in order lmaoo*
