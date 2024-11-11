const { DataTypes } = require('sequelize');

let Metadata;
let tableInitialized = false; // Flag to track table initialization

/**
 * Initializes the Metadata model using an existing Sequelize instance.
 * @param {Sequelize} sequelize - An already-initialized Sequelize instance from the user's project.
 */
async function initializePostgres(sequelize) {
    if (!sequelize) {
        throw new Error('An initialized Sequelize instance is required for PostgreSQL setup.');
    }

    // Check if the Metadata model already exists to avoid redefinition
    if (sequelize.models.Metadata) {
        Metadata = sequelize.models.Metadata;
        console.log('PostgreSQL model "Metadata" already initialized.');
    } else {
        // Define Metadata model schema if not already defined
        Metadata = sequelize.define('Metadata', {
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            apiMethod: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            metadata: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            error: {
                type: DataTypes.JSONB,    // New field for error details as JSONB
                allowNull: true,
            },
            responseMessage: {
                type: DataTypes.TEXT,      // New field for response content
                allowNull: true,
            },
            responseTime: {
                type: DataTypes.DOUBLE,    // New field for response time in milliseconds
                allowNull: true,
            },
            ip: {
                type: DataTypes.STRING,    // New field for IP address
                allowNull: true,
            },
            userAgent: {
                type: DataTypes.STRING,    // New field for user agent
                allowNull: true,
            },
            headers: {
                type: DataTypes.JSONB,     // New field for request headers as JSONB
                allowNull: true,
            },
            timestamp: {
                type: DataTypes.DATE,
                defaultValue: sequelize.fn('NOW'),
            },
        }, {
            tableName: 'metadata',
            timestamps: false, // Disable automatic createdAt/updatedAt fields
        });
    }

    // Sync model with the database if it hasn't been initialized
    if (!tableInitialized) {
        await Metadata.sync();
        console.log('PostgreSQL table "metadata" is ready');
        tableInitialized = true; // Set the flag to prevent future sync attempts
    }
}

/**
 * Saves metadata to the PostgreSQL database.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!Metadata) {
        throw new Error('PostgreSQL model not initialized. Call initializePostgres with a Sequelize instance first.');
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
        // console.log('Metadata saved to PostgreSQL');
        return logEntry;
    } catch (error) {
        // console.error('Error saving metadata to PostgreSQL:', error);
        throw error;
    }
}

module.exports = { initializePostgres, saveMetadata };
