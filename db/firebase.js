let firestoreDB;
let realtimeDB;

/**
 * Sets up Firestore or Realtime Database using an existing Firebase app instance.
 * @param {Object} dbInstance - The user-provided Firebase app or database instance.
 * @param {string} dbType - Type of Firebase database ('firestore' or 'realtime').
 */
function initializeFirebase(dbInstance, dbType) {
    if (!dbInstance) {
        throw new Error('A Firebase app or database instance is required.');
    }

    if (dbType === 'firestore') {
        if (!firestoreDB) {
            firestoreDB = dbInstance.firestore ? dbInstance.firestore() : dbInstance;
            console.log('Firestore initialized for metadata storage.');
        } else {
            console.log('Firestore is already initialized.');
        }
    } else if (dbType === 'realtime') {
        if (!realtimeDB) {
            realtimeDB = dbInstance.database ? dbInstance.database() : dbInstance;
            console.log('Firebase Realtime Database initialized for metadata storage.');
        } else {
            console.log('Firebase Realtime Database is already initialized.');
        }
    } else {
        throw new Error('Invalid dbType. Choose "firestore" or "realtime".');
    }
}

/**
 * Saves metadata to Firestore with updated fields.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadataFirestore(metadata) {
    if (!firestoreDB) {
        throw new Error('Firestore not initialized. Call initializeFirebase first with Firestore.');
    }

    // Enforce consistent structure with required fields
    const completeMetadata = {
        userId: metadata.userId || 'Anonymous',
        apiMethod: metadata.apiMethod || 'unknown',
        metadata: metadata.metadata || {},
        status: metadata.status || 'unknown',
        error: metadata.error || null,
        responseMessage: metadata.responseMessage || 'No response message',
        responseTime: metadata.responseTime || 0,
        ip: metadata.ip || 'unknown',
        userAgent: metadata.userAgent || 'unknown',
        headers: metadata.headers || {},
        timestamp: metadata.timestamp || new Date(),
    };

    try {
        const metadataRef = firestoreDB.collection('metadata').doc();
        await metadataRef.set(completeMetadata);
        // console.log('Metadata saved to Firestore');
    } catch (error) {
        // console.error('Error saving metadata to Firestore:', error);
        throw error;
    }
}

/**
 * Saves metadata to Firebase Realtime Database with updated fields.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadataRealtime(metadata) {
    if (!realtimeDB) {
        throw new Error('Firebase Realtime Database not initialized. Call initializeFirebase first with Realtime Database.');
    }

    // Enforce consistent structure with required fields
    const completeMetadata = {
        userId: metadata.userId || 'Anonymous',
        apiMethod: metadata.apiMethod || 'unknown',
        metadata: metadata.metadata || {},
        status: metadata.status || 'unknown',
        error: metadata.error || null,
        responseMessage: metadata.responseMessage || 'No response message',
        responseTime: metadata.responseTime || 0,
        ip: metadata.ip || 'unknown',
        userAgent: metadata.userAgent || 'unknown',
        headers: metadata.headers || {},
        timestamp: metadata.timestamp || new Date(),
    };

    try {
        const metadataRef = realtimeDB.ref('metadata').push();
        await metadataRef.set(completeMetadata);
        // console.log('Metadata saved to Firebase Realtime Database');
    } catch (error) {
        // console.error('Error saving metadata to Firebase Realtime Database:', error);
        throw error;
    }
}

/**
 * A generic function to save metadata depending on the database type.
 * @param {string} dbType - Type of Firebase database ('firestore' or 'realtime').
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(dbType, metadata) {
    if (dbType === 'firestore') {
        await saveMetadataFirestore(metadata);
    } else if (dbType === 'realtime') {
        await saveMetadataRealtime(metadata);
    } else {
        throw new Error('Invalid dbType. Choose "firestore" or "realtime".');
    }
}

module.exports = { initializeFirebase, saveMetadata };
