# indesign-lockfile-onedrive

This tool provides a way to use a OneDrive repository and create a text file that acts as a lock file. It assists multiple users collaborating on InDesign documents using the Adobe Extended scripting environment. It is a viable method of informing others collaborating on the same documents in remote locations and logging the data to individual user log files and an audit folder. 

The Idea was based on a script written by https://github.com/t3n/indesign-prevent-multiple-opens/commits?author=ChrisHardie

This script uses the official InDesign scripting capabilities to create a temporary .txt file when an InDesign file is opened. The file is an alternative locking file and is populated with the InDesign user's name (configured in File -> User).

When another user tries to open the same document, and this .txt file exists, the second user will get a warning modal indicating the name of the user who has the document open, and then the document will be closed. When the original locking user closes the file, the .txt file is also removed, and the file becomes available for other users to edit.

For the locking to work, this script must be installed one time on every device that will be running InDesign and accessing shared files.

Installation

1) Ensure you decide on a shared repository in Onedrive that all your team members can access. I have designed this on OneDrive to allow you to add a shortcut rather than an offline library sync.
2) Create two directories in one drive one for the lock files and one for the audit files 
3) Download and edit the file indesign-lockfile-onedrive.jsx file to include the two locations for one drive

\\OneDrive - Companyname\\Documentlibrary\\Lockfiles\\
\\OneDrive - Companyname\\Documentlibrary\\Lockfiles\\Audit\\

4) Save the file to a location you can distribute it from
5) locate your specific user script directory

On Mac, /Users/<User>/Library/Preferences/Adobe Indesign/<version>/<language|e.g. de_DE>/Scripts/
On Windows, c:\users\<username>\AppData\roaming\Adobe\InDesign\<version>\<language|e.g. de_DE>\Scripts\

6) create a folder called "Startup Scripts" (Don't add the ""). This should now look like the following c:\users\<username>\AppData\roaming\Adobe\InDesign\<version>\<language|e.g. de_DE>\Scripts\startup scripts
7) drop in the indesign-lockfile-onedrice.jsx file
8) Open Indesign click File > User, and change your username to a name you will use to identify yourself
9) Restart Indesign
10) Open up Adobe and open a file

Note: when you open a file, it will create a corresponding .TXT file in the lock file location until you close it, which will be deleted.
Any user who opens up the same file will check for the presence of a txt file in the lock file directory, and if there is one present, the user will receive a message about who has the file locked and immediately close the file.

If the name matches the one in the text file, it will allow you to open the file because it presumes it is the same user. Please ensure your Adobe username is set to be unique. 

In addition to the session log per user, the audit folder will contain entries of when the file was opened or closed by the user, allowing for a full audit on a single file. 

An HTML reporting script is in development that collates this information, presents it in data format, and counts how long the file was open and how many users collaborated on it. 

This relies on the one drive running and being in sync, which we all know can occasionally be temperamental, and on the occasions that one drive is not logged in, the script will fail without error. 



