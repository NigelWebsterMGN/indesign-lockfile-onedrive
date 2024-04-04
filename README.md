# indesign-lockfile-onedrive

This tool provides a way to use a OneDrive repository and create a text file that acts as a lock file. It assists multiple users collaborating on InDesign documents using the Adobe Extended scripting environment. It is a viable method of not only informing others collaborating on the same documents in remote locations but also logging the data to individual user log files and an audit folder. 

The Idea was based on a script written by https://github.com/t3n/indesign-prevent-multiple-opens/commits?author=ChrisHardie

This script uses the official InDesign scripting capabilities to create a temporary .txt file when an InDesign file is opened. The file serves as an alternative locking file and is populated with the InDesign user's name (configured in File -> User).

When another user tries to open the same document, and this .txt file exists, the second user will get a warning modal indicating the name of the user who has the document open, and then the document will be closed. When the original locking user closes the file, the .txt file is also removed, and the file becomes available for other users to edit.

For the locking to work, this script must be installed one time on every device that will be running InDesign and accessing shared files.

Installation

1) Ensure you decide on a shared repository in Onedrive that all your team members can access. I have designed this on OneDrive to allow you to add a shortcut rather than an offline library sync.
2) Download and edit the 

