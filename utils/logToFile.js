const fs = require('fs');
const path = require('path');

function logToCSV(fileName, data, type = 'metaSuccess') {
    // Use process.cwd() to get the user's project root directory
    const logDir = path.join(process.cwd(), 'buildmymetalogs');

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    let logFilePath;
    if (type === 'metaError') {
        logFilePath = path.join(logDir, 'metaError.csv');
    } else if (type === 'metaSuccess') {
        logFilePath = path.join(logDir, 'metaSuccess.csv');
    } else if (type === 'apiSuccess') {
        logFilePath = path.join(logDir, 'apiSuccess.csv');
    } else if (type === 'apiError') {
        logFilePath = path.join(logDir, 'apiError.csv');
    }

    const timestamp = data.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString();
    const csvHeader = 'timestamp,userId,apiMethod,url,status,message\n';
    const csvData = `${timestamp},${data.userId || 'N/A'},${data.apiMethod || 'N/A'},${data.metadata?.url || 'N/A'},${data.status || 'N/A'},${data.error?.message || 'success'}\n`;

    // Add header if the file doesn't exist
    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, csvHeader, 'utf8');
    }

    fs.appendFileSync(logFilePath, csvData, 'utf8');
}

module.exports = logToCSV;
