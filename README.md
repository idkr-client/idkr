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

## Links
### Discord Server
https://discord.gg/wEZbFFX  
A server dedicated to idkr.

### Download
[Latest release / changelog](https://github.com/Mixaz017/idkr/releases/latest)
- [Windows installer](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-setup-win.exe)
- [Windows portable](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-win.exe)
- [macOS portable](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-mac.dmg)
- [Linux portable (x86_64)](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-linux-x86_64.AppImage)
- [Linux portable (i836)](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-linux-i386.AppImage)

## Features
W: Windows, M: macOS, L: Linux  

- Settings search works for client related settings (unlike official client)
- Prompt window (used when importing settings) has a "Load File" button
	- This button lets you select a file and loads its content directly without opening the file in external editor and copy pasting
- Even more secure than official client
	- Official client disables `webSecurity`, which is a bad thing to do, in order to get the resource swapper work. However, idkr uses a way that makes resource swapper work without having to disable `webSecurity`.

### Settings
- Disable Frame Rate Limit *
- Accelerated Canvas *
	- Only disable this if you have problems or performance issues with your GPU
- ANGLE Grapchics Backend * (W)
	- Set this to "D3D9" if you have video capture/recording problems
	- Performance of the client can be affected by this option
	- If you experiencing problems like crashes, try using different backend
- Color Profile *
- Chromium Flags *
	- This setting could overwrite existing flags/settings such as `force-color-profile` (Color Profile setting)
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

## Running/Building From The Source Code
Pre-built releases are cool but you may want to use latest features/bugfixes.
This is a simple tutorial to get the source code, install dependencies, and run or build the client.  

### Requirements
- [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm)
- [git](https://git-scm.com/downloads) (Optional for easier clone/pull operations)

### Downloading The Source Code
If you use git (recommended):
```sh
# If its your first time getting the code
git clone https://github.com/Mixaz017/idkr.git

# If you already cloned the repository and want to update to the latest commit
git pull
```
If you don't use git, [Download ZIP](https://github.com/Mixaz017/idkr/archive/master.zip) and extract. You have to do this every time you want to update the client, so use git to save your time if possible.

### Run Or Build the Client
```sh
# Install dependencies
npm i

# If you want to run the client without building it
npm start

# If you want to build the client
npm run dist
```
After building the client, new directory named `dist` containing executable binary files (`.exe`, `.dmg`, or `.appImage`) should be created (or overwrited if aleady exists).