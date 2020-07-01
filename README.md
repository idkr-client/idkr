# idkr
idk, just a Krunker client  
This client aims for:
- Stable behavior and performance
- Advanced customizability (settings and userscripts)
- Constructive to the community (open source and MIT license)

## Supported Platforms
- Windows: Supported, main platform
- Linux: Supported
- macOS: Not supported, may or may not work

Testings are greatly appreciated! Post test results and your thoughts in #feedback channel in the Discord.

### Links
- [Discord server](https://discord.gg/wEZbFFX)
- [Latest prebuilt release](https://github.com/Mixaz017/idkr/releases/latest)

## Features
W: Windows, M: macOS, L: Linux  

- Settings search works for client related settings (unlike official client)

### Settings
- Disable Frame Rate Limit *
- Accelerated Canvas *
	- Only disable this if you have problems or performance issues with your GPU
- ANGLE Grapchics Backend * (W)
	- Performance of the client can be affected by this option
	- If you experiencing problems like crashes, try using different backend
	- Probably only effective on Windows
- Color Profile *
- Pointer Raw Input *
- Auto Update Behavior
	- Setting this to "Download" is highly recommended but other options are here just because you can
- Resource Swapper Mode *
	- Place swap files in `<documents>/idkr/swap`
- Enable Userscripts *
	- Put userscripts in `<documents>/idkr/scripts`
	- Only use truly trusted scripts, they are danger than web extensions. It can cause serious damage if used wrong.
	- [Example script](https://gist.github.com/Mixaz017/5956c4c6ac9db7858f7b720aea260c71)
	- This is an experimental feature!
___
*: applies after restarting  
\<documents>: Your OS's document folder (`%userprofile%/Documents` in default Windows)
### Keyboard Shortcuts
Most of "Control" key can be replaced by "Command" key in macOS.  
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
| Control + Alt + R | Restart |

## Current State
Looking for contributors!  
Bug reports are welcomed via GitHub [issues](https://github.com/Mixaz017/idkr/issues), or our [Discord server](https://discord.gg/wEZbFFX).  
Please include details about the bug and your platform in the bug report.