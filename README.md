# CanvasGrade: Chrome Extension

## Setup Instructions

There are two ways you can install CanvasGrade: the Chrome Web Store (RECOMMENDED) and Direct Download.

In almost every case, the Chrome Web Store is what you're looking for, unless you know what you are doing and want to modify the extension's files.

### Chrome Web Store Installation

1. Go to the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) and search "CanvasGrade"

2. Click on CanvasGrade offered by Jack Hughes

3. Click "Add to Chrome"

A successful installation looks like this: 

![succesful-installation-CWS](https://github.com/Jackman3323/CanvasGrade-Real/raw/CHROME-Master/successful-installation-cws.png)

### Direct Download Installation

DISCLAIMER: THIS IS NOT SUPPORTED AND SHOULD NOT BE USED UNLESS YOU KNOW WHAT YOU ARE DOING

1. Download all files

2. Unzip

3. Go to [your extensions](chrome://extensions/) and turn on "Developer Mode" in the top right

4. Click "Load Unpacked"

5. Select the folder with all extension files

6. Enable extension

## File Explanation

### background.js

This is the javascript file that runs the extension whenever you're on a kent denver canvas grade website.

### icon.png

The logo of the extension:

![logo](https://github.com/Jackman3323/CanvasGrade-Real/raw/CHROME-Master/icon.png)

### manifest.json

This is the "setup" file, it contains various extension information such as the version number, the name, the author's name, and the permissions the extension requires to function. It also tells Chrome what files do what, for instance, questions like "which file runs the popup window?" are answered by this file.

### modifier.js

This is the "main" file for the portion of the extension that modifies the text of canvas's grade page. This file counts the number of earned points and total points in each category of assignment, calculates your overall grade with that information (and any relevant weighting information, if applicable) and displays that information for the user up where it used to say that such information is disabled.

This file also saves the name of the class, the grade in the class, and whether the class is AP or Honors to Chrome's storage system for the rest of the extension to use.

This file runs every time any part of any grade is modified (i.e. reverting or changing a "what-if score") which then updates both the overall grade information on that page and the information stored in Chrome's storage for the rest of the extension.

### popup.html

This is the html file for the popup window. It starts very bland and with instructions for initial setup. Initial setup of the popup window entails going to the grade page of each of your canvas classes once. 

### popup.js

This is the javascript file for the popup window. It modifies the html window with relevant information it gets from Chrome's storage, placed there by modifier.js. Whenever something in storage is updated,this file re-runs itself to update the popup window. The window displays your grade in each class the extension has seen at least once, it's GPA value, and your overall GPA.

### Style.css

This is the stylesheet file for the popup window. I use it to make formatting the window easier. This file only exists for visual purposes.

### successful-installation-image-cws.png

This is the picture used above in this document to show you what a successful Chrome Web Store installation looks like.

## Future Plans and Current Bugs

### Bugs
All current bugs are listed in the Known Bugs section of the most recent release, and you can always check the issues page to see any reported issues and progress on their removal.

### Plans
Future plans include:
- A fully functional Safari port of the extension
- Options for potential rounding of grades
- Ability to add completely new hypothetical assignments
- Ability to edit total earned points and total available points

Distant future plans include:

- Other Canvas improvements
    * Dark mode
    * Other visual customizations
    * Grade + GPA on dashboard
    * To-Do List integration
- Firefox port of the extension (?, if there's interest...)
- Open to suggestions, this list is not exhaustive