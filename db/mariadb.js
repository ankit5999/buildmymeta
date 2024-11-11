const { DataTypes } = require('sequelize');

let Metadata;
let tableInitialized = false; // Flag to track if the table is initialized

/**
 * Initializes the Metadata model using an existing Sequelize instance.
 * @param {Object} sequelize - The already-initialized Sequelize instance from the user's project.
 */
async function initializeMariaDB(sequelize) {
    if (!sequelize) {
        throw new Error('An initialized Sequelize instance is required for MariaDB setup.');
    }

    // Check if the Metadata model is already defined to avoid redefinition
    if (sequelize.models.Metadata) {
        Metadata = sequelize.models.Metadata;
        console.log('MariaDB model "Metadata" already initialized.');
    } else {
        // Define the Metadata model schema if it does not exist
        Metadata = sequelize.define('Metadata', {
            userId: { type: DataTypes.STRING, allowNull: false },
            apiMethod: { type: DataTypes.STRING, allowNull: false },
            metadata: { type: DataTypes.JSON, allowNull: true },
            status: { type: DataTypes.STRING, allowNull: false },
            error: { type: DataTypes.JSON, allowNull: true },         // New field for error details as JSON
            responseMessage: { type: DataTypes.TEXT, allowNull: true }, // New field for response content
            responseTime: { type: DataTypes.DOUBLE, allowNull: true }, // New field for response time in ms
            ip: { type: DataTypes.STRING, allowNull: true },            // New field for IP address
            userAgent: { type: DataTypes.STRING, allowNull: true },     // New field for user agent string
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
        console.log('MariaDB table "metadata" is ready');
        tableInitialized = true; // Set the flag to prevent future sync attempts
    }
}

/**
 * Saves metadata to the MariaDB database.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!Metadata) {
        throw new Error('MariaDB model not initialized. Call initializeMariaDB with a Sequelize instance first.');
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
        // console.log('Metadata saved to MariaDB');
        return logEntry;
    } catch (error) {
        // console.error('Error saving metadata to MariaDB:', error);
        throw error;
    }
}

module.exports = { initializeMariaDB, saveMetadata };
