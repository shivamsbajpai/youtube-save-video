# YouTube Skin
Firefox extension to add skin to YouTube page</br>
Download extension file from here: [extension](./latest-extension-file/yt_skin-1.0.10.xpi)</br>
Source code can be found in `source` directory

## Features
1. Save videos and channels through video page without logging in</br>
Buttons are shown up in navbar</br>
* Save button saves the url of video with title
* Subscribe button saves the channel url of that video with channel name
![Alt text](readme-assets/buttons.png)

2. Export/Import the saved videos and channels in json format through settings page
* Can be accessed by clicking on extension button in browser

3. Remove saved videos and channels through settings page of extension
* Can be accessed by clicking on extension button in browser

## Credits
Channel and video data is fetched from https://yt.lemnoslife.com APIs.

## Issues
* Sometimes buttons are not visible on the video page</br>
Reason: div element not available when extension script runs</br>
Quick fix: reload the video page</br>

## Improvements required
* Add tags for the saved videos to apply filter
* Unsubscribe and unsave button functionality in youtube page for their respective buttons
* Improve ui of settings page
* Remove multiple api calls to get data
* Optimizations in remove button on settings page

## Development
* PRs for issues and improvements are welcome
* Please raise the pr for master branch