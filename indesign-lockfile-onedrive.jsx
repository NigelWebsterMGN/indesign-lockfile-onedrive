#targetengine "preventMultipleOpens"

// Register Variables

// Change oneDrivePath and OneDriveAuditPath
// This path must be the root of onedrive and not include C:\Users\username
// it must be in the double slash format as in example 
// - \\OneDrive - Companyname\\Documentlibrary\\Lockfiles\\
// - \\OneDrive - Companyname\\Documentlibrary\\Lockfiles\\Audit\\



var userHome = $.getenv("USERPROFILE");
var userName = (app.userName != "Unknown User Name") ? app.userName : "unknown user";
var oneDrivePath = "<Onedrive Path>";
var OneDriveAuditPath = "<AuditPath>";
var lockFilesFolder = userHome + oneDrivePath;
var AuditFilesFolder = userHome + OneDriveAuditPath

// Register event listeners
var eventListenerOpen = app.addEventListener("afterOpen", handleAfterOpen, false);
var eventListenerClose = app.addEventListener("beforeClose", handleBeforeClose, false);
var eventListenerQuit = app.addEventListener('beforeQuit', handleAppShutdown, false);


function handleAfterOpen(event) {
    createTxtFile(event);
}

function handleBeforeClose(event) {
    deleteTxtFile(event);
}

function padNumber(num) {
    return num < 10 ? '0' + num : num.toString();
}

function padNumberWithZero(number, length) {
    var result = number.toString();
    while (result.length < length) {
        result = "0" + result;
    }
    return result;
}



function ensureDirectoryExists(path) {
    var folder = new Folder(path);
    var logFile = new File(logFilePath);
    logFile.open("a");

    if (!folder.exists) {
        var success = folder.create();
        if (success) {
            logFile.writeln("Directory created: " + path);
        } else {
            logFile.writeln("Failed to create directory: " + path);
        }
    } else {
        logFile.writeln("Directory already exists: " + path);
    }

    logFile.close();
}


// Session-based lock file tracking
var createdLockFiles = [];

// Set User session log files
var now = new Date();
var dateString = padNumber(now.getDate()) + "-" + padNumber(now.getMonth() + 1) + "-" + now.getFullYear();
var logFilePath = lockFilesFolder + "\\" + userName.replace(/\s+/g, '_') + "_" + dateString + "_sessionLog.txt";
var logFile = new File(logFilePath);
var now = new Date();
var dateTimeString = now.toLocaleString();
logFile.open("a");
logFile.writeln("\n\n================================================");
logFile.writeln("===== New Session Started + dateTimeString =====");
logFile.writeln("================================================");
logFile.writeln("Script started by user: " + userName + " at " + dateTimeString);
logFile.close();




function customAlert(message, delaySeconds, title) {
 
    title = title || 'Alert';
    var alertWindow = new Window('palette', title);
    var control_text = alertWindow.add('edittext', [0, 0, 400, 100], message, {multiline: false});
   
    if(delaySeconds == 0){
        var control_close = alertWindow.add('button', undefined, 'Close');       
        control_close.onClick = function(){
            if(alertWindow){
				alertWindow.hide();
				app.activeDocument.close();
            }
        };
    }

    alertWindow.show();
    alertWindow.update();

    if(delaySeconds > 0){
        $.sleep(delaySeconds * 1000);
        alertWindow.hide();
        alertWindow = null;
    }
}


function logDirectoryPath() {
    try {
        var logFile = new File(logFilePath);
        logFile.open("a");  
        logFile.writeln("Lock Files Directory: " + lockFilesFolder);
        logFile.close();
    } catch (err) {
        alert("Error writing log file: " + err.message);
    }
}


function createTxtFile(event) {
 


 var logFile = new File(logFilePath);
    logFile.open("a");
    logFile.writeln("Create lock file event triggered at " + new Date().toLocaleString());
    logFile.close();

    try {
        var doc = event.parent;
        var baseFileName = doc.name.replace(/\.indd$/i, ".txt");

        // Simplified check if the filename ends with '.txt'
        if (baseFileName.substr(-4).toLowerCase() === ".txt") {
            var lockFilePath = lockFilesFolder + baseFileName;
            

            var folder = new Folder(lockFilesFolder);
            if (!folder.exists) {
                folder.create();
            }

            var lockFile = new File(lockFilePath);
            lockFile.encoding = "UTF-8";
            
            if (!lockFile.exists) {
                lockFile.open("w");
                lockFile.write(userName);
                lockFile.close();
                
                createdLockFiles.push(lockFilePath);
                logFile = new File(logFilePath);  
                logFile.open("a");
                logFile.writeln("Lock file created: " + lockFilePath);
                logFile.close();

		// AUDIT ALL FILE ACTIONS BY FILE
   		var auditLogPath = AuditFilesFolder + baseFileName.replace(/\.indd$/i, "_audit.log");
   		 var auditLogFile = new File(auditLogPath);
                 auditLogFile.open("a");
                 auditLogFile.writeln("File opened by " + userName + " at " + new Date().toLocaleString());
                 auditLogFile.close();


            } else {
                lockFile.open("r"); 
                var userNameSaved = lockFile.read();
                lockFile.close();
                
                if (userNameSaved != userName) {
                    customAlert('This Document is already opened by ' + userNameSaved, 0, 'Warning!');
                }
            }
        } else {
            // Log that the file was ignored due to its name
            logFile = new File(logFilePath);  // Reuse the variable for logging
            logFile.open("a");
            logFile.writeln("File ignored as not a required file to create: " + baseFileName);
            logFile.close();
        }
    } catch(err) {
        logFile = new File(logFilePath);  // Reuse the variable for logging
        logFile.open("a");
        logFile.writeln("Error in createTxtFile: " + err.message);
        logFile.close();
        alert("Error in createTxtFile: " + err.message);
    }
}



function deleteTxtFile(event) {
    var logFile = new File(logFilePath);
    logFile.open("a");
    logFile.writeln("Clear lock file triggered at " + new Date().toLocaleString());
    
    try {
        var doc = event.parent;
        var baseFileName = doc.name.replace(/\.indd$/i, ".txt");
        var lockFilePath = lockFilesFolder + baseFileName;
        
        var lockFile = new File(lockFilePath);
        
        if (lockFile.exists) {
            lockFile.open("r"); 
            var userNameSaved = lockFile.read();
            lockFile.close();
            
            if (userNameSaved == userName) {
                lockFile.remove();
                logFile.writeln("Deleted file: " + lockFilePath + " at " + new Date().toLocaleString());

	
                // AUDIT ALL FILE ACTIONS BY FILE
   		var auditLogPath = AuditFilesFolder + baseFileName.replace(/\.indd$/i, "_audit.log");
   		 var auditLogFile = new File(auditLogPath);
                 auditLogFile.open("a");
                  AuditFile.writeln("File closed by " + userName + " at " + now.toLocaleString());
                 auditLogFile.close();


            }
        }
    } catch(err) {
       logFile.writeln("Error in deleteTxtFile: " + err.message + " at " + new Date().toLocaleString());
    }
    
    logFile.close();
}



function handleAppShutdown() {
    var logFile = new File(logFilePath);
    logFile.open("a");
    logFile.writeln("Adobe is shutting down. Final lock files list: " + createdLockFiles.join(", "));
    
    

       // Example to add a file path for testing
    createdLockFilesTest.push(lockFilesFolder + "\\testFile.txt");

    // Use a traditional for loop to iterate over the array
    if (createdLockFilesTest && createdLockFilesTest.length > 0) {
        for (var i = 0; i < createdLockFilesTest.length; i++) {
            var filePath = createdLockFilesTest[i];
            logFile.writeln("Index: " + i + " FilePath: " + filePath);
         
        }
    } else {
        logFile.writeln("No lock files to delete or createdLockFilesTest is not defined.");
    }

    logFile.close();
}


// Log the directory path when the script is executed
logDirectoryPath();



