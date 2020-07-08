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

Testings are greatly appreciated! Let me know in the Discord or GitHub if something didnt work right.

### Links
- [Discord server](https://discord.gg/wEZbFFX)
- [Latest prebuilt release](https://github.com/Mixaz017/idkr/releases/latest)

## Features
W: Windows, M: macOS, L: Linux  

- Settings search works for client related settings (unlike official client)
- Prompt window (used when importing settings) has a "Load File" button
	- This button lets you select a file and loads its content directly without opening the file in external editor and copy pasting

### Settings
- Disable Frame Rate Limit *
- Accelerated Canvas *
	- Only disable this if you have problems or performance issues with your GPU
- ANGLE Grapchics Backend * (W)
	- Performance of the client can be affected by this option
	- If you experiencing problems like crashes, try using different backend
- Color Profile *
- Pointer Raw Input *
- Auto Update Behavior
	- Setting this to "Download" is highly recommended but other options are here just because you can
- Resource Swapper Mode *
	- Place swap files in `<documents>/idkr/swap`
- Enable Userscripts *
	- Put userscripts in `<documents>/idkr/scripts`
	- Only use truly trusted scripts, they are danger than web extensions. It can cause serious damage if used wrongly.
	- [Example script](https://gist.github.com/Mixaz017/bb6d334c4718a4c4bb626380d3844bc8)
	- This is an experimental feature!
___
*: applies after restarting  
\<documents>: Your OS's document folder (`%userprofile%/Documents` in default Windows)
### Keyboard Shortcuts
Most of "Control" key can be replaced by "Command" key in macOS.  
| Shortcut | Action |
| --- | --- |
| Control + Shift + Delete | Clear Cache and Restart |
| Control + Alt + F | Open Settings Window |
| Escape | Exit Pointer Lock |
| F5 | Reload |
| Shift + F5 | Force Reload |
| F6 (Game window) | Navigate to Main Page (Seek Match) |
| F11 | Toggle Full Screen |
| Control + Shift + I (WL)<br>Command + Option + I (M) | Toggle Developer Tools |
| Alt + Left (WL)<br>Command + Left (M) | Go Back |
| Alt + Right (WL)<br>Command + Right (M) | Go Forward |
| Control + L | Copy Current URL |
| Control + N | Open a Game Window |
| Control + Shift + N | Duplicate Current Window |
| Control + Alt + R | Restart |

## Current State
Looking for contributors!  
Bug reports are welcomed via GitHub [issues](https://github.com/Mixaz017/idkr/issues), or our [Discord server](https://discord.gg/wEZbFFX).  
Please include details about the bug and your platform in the bug report.

## Building
```sh
# Update if necessary
git pull

# Install dependencies
npm i

# Build
npm run dist
```
After building the client, new directory named `dist` containing executable binary files (`.exe`, `.dmg`, or `.appImage`) should be created.