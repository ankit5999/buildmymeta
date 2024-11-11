let client;
let tableInitialized = false; // Flag to track table creation

/**
 * Initializes the Cassandra client using an existing client instance.
 * @param {Object} cassandraClient - The already-initialized Cassandra client from the user's project.
 */
async function initializeCassandra(cassandraClient) {
    if (!cassandraClient) {
        throw new Error('An initialized Cassandra client is required for Cassandra setup.');
    }

    // Check if the client is already initialized
    if (client) {
        console.log('Cassandra client already initialized.');
        return;
    }

    // Assign the user-provided client to the local client variable
    client = cassandraClient;

    // Create table if it has not been initialized
    if (!tableInitialized) {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS metadata (
                userId text,
                apiMethod text,
                metadata map<text, text>,         // Storing metadata as a map to handle key-value pairs
                status text,
                error map<text, text>,            // New field to store error details as a map
                responseMessage text,             // New field to store response content
                responseTime double,              // New field for response time in milliseconds
                ip text,                          // New field to store user IP address
                userAgent text,                   // New field to store user agent string
                headers map<text, text>,          // New field to store headers as a map
                timestamp timestamp,
                PRIMARY KEY (userId, timestamp)
            );
        `;
        try {
            await client.execute(createTableQuery);
            console.log('Cassandra table "metadata" is ready');
            tableInitialized = true; // Set flag to prevent future table creation attempts
        } catch (error) {
            console.error('Error creating table in Cassandra:', error);
            throw error;
        }
    }
}

/**
 * Saves metadata to the Cassandra database.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!client) {
        throw new Error('Cassandra client not initialized. Call initializeCassandra with a Cassandra client instance first.');
    }

    try {
        const insertQuery = `
            INSERT INTO metadata (
                userId, apiMethod, metadata, status, error, responseMessage, 
                responseTime, ip, userAgent, headers, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const params = [
            metadata.userId,
            metadata.apiMethod,
            metadata.metadata || {},  // Default to an empty object if not provided
            metadata.status,
            metadata.error || {},     // Default to an empty object for error details
            metadata.responseMessage || 'No response message',
            metadata.responseTime || 0,
            metadata.ip || 'unknown',
            metadata.userAgent || 'unknown',
            metadata.headers || {},   // Default to an empty object for headers
            metadata.timestamp || new Date(),
        ];

        await client.execute(insertQuery, params, { prepare: true });
        // console.log('Metadata saved to Cassandra');
    } catch (error) {
        // console.error('Error saving metadata to Cassandra:', error);
        throw error;
    }
}

module.exports = { initializeCassandra, saveMetadata };
