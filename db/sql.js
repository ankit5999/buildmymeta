let Metadata;
let tableInitialized = false; // Flag to track table initialization

/**
 * Initializes the Metadata model using an existing Sequelize instance.
 * @param {Object} sequelize - The already-initialized Sequelize instance from the user's project.
 */
async function initializeSQL(sequelize) {
    if (!sequelize) {
        throw new Error('An initialized Sequelize instance is required for SQL setup.');
    }

    // Check if the Metadata model already exists to avoid redefinition
    if (sequelize.models.Metadata) {
        Metadata = sequelize.models.Metadata;
        console.log('SQL model "Metadata" already initialized.');
    } else {
        // Define Metadata model schema if not already defined
        Metadata = sequelize.define('Metadata', {
            userId: { type: sequelize.Sequelize.STRING, allowNull: false },
            apiMethod: { type: sequelize.Sequelize.STRING, allowNull: false },
            metadata: { type: sequelize.Sequelize.JSONB, allowNull: true },
            status: { type: sequelize.Sequelize.STRING, allowNull: false },
            error: { type: sequelize.Sequelize.JSONB, allowNull: true },         // New field for error details
            responseMessage: { type: sequelize.Sequelize.TEXT, allowNull: true }, // New field for response content
            responseTime: { type: sequelize.Sequelize.DOUBLE, allowNull: true }, // New field for response time in ms
            ip: { type: sequelize.Sequelize.STRING, allowNull: true },            // New field for IP address
            userAgent: { type: sequelize.Sequelize.STRING, allowNull: true },     // New field for user agent
            headers: { type: sequelize.Sequelize.JSONB, allowNull: true },        // New field for request headers
            timestamp: { type: sequelize.Sequelize.DATE, defaultValue: sequelize.Sequelize.NOW },
        }, { timestamps: false });
    }

    // Sync the model with the database if it hasn't been initialized
    if (!tableInitialized) {
        await Metadata.sync();
        console.log('SQL table "metadata" is ready');
        tableInitialized = true; // Set the flag to prevent future sync attempts
    }
}

/**
 * Saves metadata to the SQL database.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!Metadata) {
        throw new Error('SQL model not initialized. Call initializeSQL with a Sequelize instance first.');
    }

    // Ensure complete metadata structure with defaults
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
        await Metadata.create(completeMetadata);
        // console.log('Metadata saved to SQL database');
    } catch (error) {
        // console.error('Error saving metadata to SQL database:', error);
        throw error;
    }
}

module.exports = { initializeSQL, saveMetadata };
