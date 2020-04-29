# idkr
idk, just a Krunker client

## Platform Note
- Windows: Supported; main platform
- macOS: Not tested; may not work
- Linux: Minimal support

## Features
W: Windows, M: macOS, L: Linux  

- Settings search works for client related settings (unlike official client)

### Settings
- Disable Frame Rate Limit -s
- ANGLE Grapchics Backend -s (W)
	- Performance of the client can be affected by this option
	- If you experiencing problems like crashes, try using different backend
	- Probably only effective on Windows
- Color Profile -s
- Auto Update Behavior
	- Setting this to "Download" is highly recommended but other options are here just because you can
- Enable Resource Swapper -s
	- Put swap files in `<documents>/idkr/swap`
- Enable Userscripts -l
	- Put userscripts in `<documents>/idkr/scripts`
	- Only use truly trusted scripts, they are danger than web extensions. It can cause serious damage if used wrong.
	- [Example script](https://gist.github.com/Mixaz017/5956c4c6ac9db7858f7b720aea260c71)
	- Still work in progress!
___
"-s": applies after restarting  
"-l": applies after reloading or creating a new page  
\<documents>: Your OS's document folder (`%userprofile%/Documents` in default Windows)
### Keyboard Shortcuts
Most of "Control" key can be replaced by "Command" key.  
| Shortcut | Action |
| --- | --- |
| Control + Shift + Delete | Clear cache and restart |
| Control + Alt + F | Open settings window |
| Escape | Exit pointer lock |
| F5 | Reload |
| Shift + F5 | Reload ignoring cache |
| F6 (Game window) | Navigate to main page (Seek match) |
| F11 | Toggle fullscreen |
| Control + Shift + I (WL)<br>Command + Option + I (M) | Toggle DevTools |
| Alt + Left (WL)<br>Command + Left (M) | Go back |
| Alt + Right (WL)<br>Command + Right (M) | Go forward |
| Control + L | Copy current URL |
| Control + N | Open a game window |
| Control + Shift + N | Duplicate current window |
| Control + Shift + Alt + R | Restart |

## Current State
This client is not polished yet, please expect some unintended or wacky behaviors.  
Looking for contributer!  
Bug reports are welcomed via GitHub [issues](https://github.com/Mixaz017/idkr/issues), or our [Discord Server](https://discord.gg/wEZbFFX).  
Make sure to tell your platform, details, and how to reproduce.
I'm very lazy to develop this thing XD  