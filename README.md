# YouTube Skin
Web extension to add skin to YouTube page</br>

Extension solves the issue of YouTube recommendation turned off on the homepage due to turned off watch history. </br>
Since recommendations work fine if account is not logged in. </br>
This extension gives the functionality to save the video and channel without the need of logging to the google account. </br>

Add extension from official channels:</br>
[Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/youtube-skin/)</br>
[Chrome Extension](https://chromewebstore.google.com/detail/jjmbohilcpfmobmmicpihpkibfpkpcme)</br>

Source code can be found in `source` directory

## Features
1. Save videos and channels through video page without logging in</br>
Buttons are shown up in navbar</br>
* Save button saves the url of video with title
* Subscribe button saves the channel url of that video with channel name</br>
![Alt text](readme-assets/buttons.png)

2. Export/Import the saved videos and channels in json format through settings page
* Can be accessed by clicking on extension button in browser

3. Remove saved videos and channels through settings page of extension
* Can be accessed by clicking on extension button in browser</br>
![Alt text](readme-assets/data.png)

## Credits
Channel and video data is fetched from https://yt.lemnoslife.com APIs.

<details>
    <summary><h2>Issues</h2></summary>
    <details>
        <summary>Sometimes buttons are not visible on the video page<b>[Fixed]</b></summary></br>
        <s>Reason: div element not available when extension script runs</s></br>
        <s>Quick fix: reload the video page</s></br>
        If this issue exists because of update in youtube and element id does not exist anymore then please raise a pr by modifying <code>ytElementId</code> constant in <code>app.js</code> with its new element id or let me know by raising an issue.
    </details>
</details>

## Improvements required
* Add tags for the saved videos to apply filter
* Unsubscribe and unsave button functionality in youtube page for their respective buttons
* Improve ui of settings page
* Remove multiple api calls to get data
* Optimizations in remove button on settings page

## Development
* PRs for issues and improvements are welcome
* Please raise the pr for `release-amo` branch