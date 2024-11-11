const detectDB = require('../utils/detectDB');
const logToCSV = require('../utils/logToFile');
const standardizeMetadata = require('../utils/standardizeMetadata');

let globalDB, globalDBType, globalUserId;

function setDatabase(dbInstance, dbType, userId) {
    globalDB = dbInstance;
    globalDBType = dbType;
    globalUserId = userId;
}

function LogCustomMetadata(metadata, req) {
    if (!globalDB || !globalDBType) {
        throw new Error('Database instance not set. Initialize with BuildMyMeta() first.');
    }

    const startTime = Date.now();

    // Set userId from global if not provided in metadata
    metadata.userId = metadata.userId || globalUserId;

    // Override `res.send` to capture response message
    const originalSend = req.res.send;
    req.res.send = function (body) {
        metadata.responseMessage = body;
        originalSend.call(this, body); // Ensure response is still sent
    };

    // Capture metadata when response finishes
    req.res.on('finish', async () => {
        const completeMetadata = standardizeMetadata({
            ...metadata,
            status: req.res.statusCode,
            responseTime: Date.now() - startTime,
            error: req.res.statusCode >= 400 ? {
                message: req.res.statusMessage,
                stack: req.res.stack || 'No stack available',
            } : null,
        }, req);

        // Log to user API success/error CSV based on response status
        if (req.res.statusCode < 400) {
            logToCSV('apiSuccess.csv', completeMetadata, 'apiSuccess');
        } else {
            logToCSV('apiError.csv', { ...completeMetadata, error: req.res.statusMessage }, 'apiError');
        }

        // Handle metadata logging to database and metadata CSVs
        const db = detectDB(globalDBType, globalDB);
        try {
            await db.saveMetadata(completeMetadata);
            logToCSV('metaSuccess.csv', completeMetadata, 'metaSuccess');
        } catch (error) {
            logToCSV('metaError.csv', { ...completeMetadata, error: error.message }, 'metaError');
        }
    });
}

module.exports = { LogCustomMetadata, setDatabase };
