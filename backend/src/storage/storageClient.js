// Dynamically select the storage client based on the environment
const useGoogleSheets = process.env.DEPLOY_ENV === 'prod';

let storageClient;

if (useGoogleSheets) {
    try {
        storageClient = require('./googleSheetsClient');
    } catch (error) {
        console.error("Could not load Google Sheets client. Check credentials.", error);
        // Fallback to SQLite if Google Sheets fails to initialize
        storageClient = require('./sqliteClient');
    }
} else {
    storageClient = require('./sqliteClient');
}

module.exports = storageClient;
