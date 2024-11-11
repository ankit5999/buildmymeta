let Metadata;

/**
 * Initializes the Metadata model using an existing mongoose connection.
 * @param {Object} mongoose - The already-initialized mongoose instance from the user's project.
 */
function initializeMongoDB(mongoose) {
    if (!mongoose) {
        throw new Error('An initialized mongoose instance is required for MongoDB setup.');
    }

    // Check if the Metadata model already exists to avoid overwriting
    if (mongoose.models.Metadata) {
        Metadata = mongoose.models.Metadata;
    } else {
        // Define the Metadata schema and model if not already defined
        const metadataSchema = new mongoose.Schema({
            userId: String,
            apiMethod: String,
            metadata: Object,
            status: String,
            error: Object,
            responseMessage: String,
            responseTime: Number,          // New field to store response time in milliseconds
            ip: String,                    // New field to store the user IP address
            userAgent: String,             // New field for storing the user agent string
            headers: Object,               // New field to store request headers
            timestamp: { type: Date, default: Date.now },
        });

        Metadata = mongoose.model('Metadata', metadataSchema);
    }
}


/**
 * Saves metadata to MongoDB.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!Metadata) {
        throw new Error('MongoDB model not initialized. Call initializeMongoDB with a mongoose instance first.');
    }

    try {
        const logEntry = new Metadata(metadata);
        await logEntry.save();
        // console.log('Metadata saved to MongoDB');
    } catch (error) {
        // console.error('Error saving metadata to MongoDB:', error);
        throw error;
    }
}

module.exports = { initializeMongoDB, saveMetadata };
