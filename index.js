const { setDatabase, LogCustomMetadata } = require('./middleware/logCustomMetadata');
const DB_TYPES = require('./constants/dbTypes');
const API_METHODS = require('./constants/apiMethods');
const detectDB = require('./utils/detectDB');
const generateMetadata = require('./utils/generateMetadata');
const logToCSV = require('./utils/logToFile');

function BuildMyMeta(dbInstance, DB_TYPE, DEFAULT = true, userId) {
    if (!dbInstance) throw new Error('A database instance is required');
    if (!Object.values(DB_TYPES).includes(DB_TYPE)) throw new Error('Invalid or missing DB_TYPE');
    if (!userId) throw new Error('userId is required in BuildMyMeta');

    setDatabase(dbInstance, DB_TYPE, userId);
    const db = detectDB(DB_TYPE, dbInstance);

    return function logMetadata(req, res, next) {
        if (DEFAULT === true) {
            generateMetadata(req, res, userId).then((metadata) => {
                // Log API success or error based on response status
                if (res.statusCode < 400) {
                    logToCSV('apiSuccess.csv', metadata, 'apiSuccess');  // Log successful API response
                } else {
                    logToCSV('apiError.csv', { ...metadata, error: res.statusMessage }, 'apiError');  // Log API error response
                }

                // Save metadata to the database and log outcome in metaSuccess or metaError
                db.saveMetadata(metadata)
                    .then(() => {
                        logToCSV('metaSuccess.csv', metadata, 'metaSuccess');  // Log successful metadata storage
                    })
                    .catch(err => {
                        logToCSV('metaError.csv', { ...metadata, error: err.message }, 'metaError');  // Log metadata storage error
                    });
            });
        }
        next();
    };
}

module.exports = {
    BuildMyMeta,
    LogCustomMetadata,
    DB_TYPES,
    API_METHODS
};













// // index.js
// const { setDatabase, LogCustomMetadata } = require('./middleware/logCustomMetadata');
// const DB_TYPES = require('./constants/dbTypes');
// const API_METHODS = require('./constants/apiMethods');
// const detectDB = require('./utils/detectDB');
// const generateMetadata = require('./utils/generateMetadata');
// const logToCSV = require('./utils/logToFile');

// function BuildMyMeta(dbInstance, DB_TYPE, DEFAULT = true, userId) {
//     if (!dbInstance) throw new Error('A database instance is required');
//     if (!Object.values(DB_TYPES).includes(DB_TYPE)) throw new Error('Invalid or missing DB_TYPE');
//     if (!userId) throw new Error('userId is required in BuildMyMeta');

//     setDatabase(dbInstance, DB_TYPE, userId);
//     const db = detectDB(DB_TYPE, dbInstance);

//     return function logMetadata(req, res, next) {
//         if (DEFAULT === true) {
//             // Wait for the metadata promise to resolve
//             generateMetadata(req, res, userId).then((metadata) => {

//                 db.saveMetadata(metadata)
//                     .then(() => {
//                         logToCSV('metaSuccess.csv', metadata, 'success');
//                     })
//                     .catch(err => {
//                         logToCSV('metaError.csv', { ...metadata, error: err.message }, 'error');
//                     });
//             });
//         }
//         next();
//     };
// }

// module.exports = {
//     BuildMyMeta,
//     LogCustomMetadata,
//     DB_TYPES,
//     API_METHODS
// };