# idkr
[![Total downloads](https://img.shields.io/github/downloads/mixaz017/idkr/total)](https://github.com/Mixaz017/idkr/releases)
[![Discord server](https://discord.com/api/guilds/697366856914173994/widget.png)](https://discord.gg/wEZbFFX)

idk, just a Krunker client  
This client aims for:
- Stable behavior and performance
- Advanced customizability (settings and userscripts)
- Constructive to the community (open source and MIT license)

## Supported Platforms
| Platform | Status | File Extension |
|-|-|-|
| Windows | Supported (Main platform) | `.exe` |
| macOS | Not confirmed by the developer | `.dmg` |
| Linux | Supported | `.AppImage` |

## Links
### Discord Server
https://discord.gg/wEZbFFX

### Wiki
https://github.com/Mixaz017/idkr/wiki

### Download
[Latest release / changelog](https://github.com/Mixaz017/idkr/releases/latest)
- [Windows installer](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-setup-win.exe)
- [Windows portable](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-win.exe)
- [macOS portable](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-mac.dmg)
- [Linux portable (x86_64)](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-linux-x86_64.AppImage)
- [Linux portable (i836)](https://github.com/Mixaz017/idkr/releases/latest/download/idkr-portable-linux-i386.AppImage)

## Features
(W): Windows, (M): macOS, (L): Linux  

- Prompt window (used when importing settings) has a "Load File" button.
	- This button lets you select a file and load its contents directly without opening the file in an external editor and copy pasting it.
- Even secure than official client
	- Official client disables `webSecurity`, which is a bad thing to do, in order to get the resource swapper work. However, idkr uses a method that makes resource swapper work without having to disable `webSecurity`.

Other features that have its settings are listed below.

### Settings
- Disable Frame Rate Limit *
- Accelerated Canvas *
	- Only disable this if you have problems or performance issues with your GPU.
- ANGLE Graphics Backend * (W)
	- Set this to "D3D9" if you have video capture/recording problems.
	- Performance of the client can be affected by this option.
	- If you are experiencing problems like crashes, try using a different backend.
- Color Profile *
- Chromium Flags *
	- This setting could overwrite existing flags/settings such as `force-color-profile` (Color Profile setting).
- Discord Rich Presence *
- Auto Update Behavior
	- Setting this to "Download" is highly recommended since you won't have to worry about manually updating the client but other options are here in case you don't wish the automatic updates.
- Resource Swapper Mode *
- Resource Swapper Path
	- Defaults to `<documents>/idkr/swap`
- Enable Userscripts *
	- Only use truly trusted scripts, they are more dangerous than web extensions. It can cause serious damage if used wrongly.
	- [Example script](https://gist.github.com/Mixaz017/bb6d334c4718a4c4bb626380d3844bc8)
	- This is an experimental feature!
- Userscripts Path
	- Defaults to `<documents>/idkr/scripts`
___
*: applies after restarting  
\<documents>: Your OS's document folder (`%userprofile%/Documents` in default Windows).

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
- [git](https://git-scm.com/downloads) and [GitHub CLI](https://cli.github.com/) (Optional for easier clone/pull operations)

### Downloading The Source Code
If you use git (recommended):
```sh
# If its your first time getting the code
git clone --depth 1 https://github.com/Mixaz017/idkr.git

# ...or if you use GitHub CLI instead
gh repo clone Mixaz017/idkr -- --depth 1

# If you already cloned the repository and want to update to the latest commit
git pull
```
If you don't use git, [Download ZIP](https://github.com/Mixaz017/idkr/archive/master.zip) and extract. You have to do this every time you want to update the client, so I recommend using git instead.

### Run Or Build the Client
```sh
# Install dependencies
npm i

# If you want to run the client without building it
npm start

# If you want to build the client
npm run dist
```
After building the client, new directory named `dist` containing executable binary files (`.exe`, `.dmg`, or `.AppImage`) should be created (or overwrited if already exists).