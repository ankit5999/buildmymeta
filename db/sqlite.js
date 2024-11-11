const { DataTypes } = require('sequelize');

let Metadata;
let tableInitialized = false; // Flag to track table initialization

/**
 * Initializes the Metadata model using an existing Sequelize instance.
 * @param {Object} sequelize - The already-initialized Sequelize instance from the user's project.
 */
async function initializeSQLite(sequelize) {
    if (!sequelize) {
        throw new Error('An initialized Sequelize instance is required for SQLite setup.');
    }

    // Check if the Metadata model already exists to avoid redefinition
    if (sequelize.models.Metadata) {
        Metadata = sequelize.models.Metadata;
        console.log('SQLite model "Metadata" already initialized.');
    } else {
        // Define the Metadata model schema if not already defined
        Metadata = sequelize.define('Metadata', {
            userId: { type: DataTypes.STRING, allowNull: false },
            apiMethod: { type: DataTypes.STRING, allowNull: false },
            metadata: { type: DataTypes.JSON, allowNull: true },
            status: { type: DataTypes.STRING, allowNull: false },
            error: { type: DataTypes.JSON, allowNull: true },         // New field for error details as JSON
            responseMessage: { type: DataTypes.TEXT, allowNull: true }, // New field for response content
            responseTime: { type: DataTypes.DOUBLE, allowNull: true }, // New field for response time in milliseconds
            ip: { type: DataTypes.STRING, allowNull: true },            // New field for IP address
            userAgent: { type: DataTypes.STRING, allowNull: true },     // New field for user agent
            headers: { type: DataTypes.JSON, allowNull: true },         // New field for request headers as JSON
            timestamp: { type: DataTypes.DATE, defaultValue: sequelize.fn('NOW') },
        }, {
            tableName: 'metadata',
            timestamps: false, // Disable automatic createdAt/updatedAt fields
        });
    }

    // Sync model with the database if it hasn't been initialized
    if (!tableInitialized) {
        await Metadata.sync();
        console.log('SQLite table "metadata" is ready');
        tableInitialized = true; // Set the flag to prevent future sync attempts
    }
}

/**
 * Saves metadata to the SQLite database.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!Metadata) {
        throw new Error('SQLite model not initialized. Call initializeSQLite with a Sequelize instance first.');
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
        const logEntry = await Metadata.create(completeMetadata);
        // console.log('Metadata saved to SQLite');
        return logEntry;
    } catch (error) {
        // console.error('Error saving metadata to SQLite:', error);
        throw error;
    }
}

module.exports = { initializeSQLite, saveMetadata };
