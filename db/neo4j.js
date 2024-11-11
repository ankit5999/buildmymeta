let session;
let constraintInitialized = false; // Flag to track constraint setup

/**
 * Initializes Neo4j with an existing Neo4j session from the user's project.
 * @param {Object} neo4jSession - The already-initialized Neo4j session.
 */
async function initializeNeo4j(neo4jSession) {
    if (!neo4jSession) {
        throw new Error('An initialized Neo4j session is required for Neo4j setup.');
    }

    // Check if the session is already initialized
    if (session) {
        console.log('Neo4j session already initialized.');
        return;
    }

    // Assign the user-provided session to the local session variable
    session = neo4jSession;

    // Define a Cypher query to ensure that metadata nodes can be created
    if (!constraintInitialized) {
        const createConstraintQuery = `
            CREATE CONSTRAINT IF NOT EXISTS ON (m:Metadata) ASSERT m.userId IS UNIQUE;
        `;
        try {
            await session.run(createConstraintQuery);
            console.log('Neo4j Metadata constraint ensured');
            constraintInitialized = true; // Set the flag to prevent future constraint setup attempts
        } catch (error) {
            console.error('Error setting up constraint in Neo4j:', error);
            throw error;
        }
    }
}

/**
 * Saves metadata to Neo4j.
 * @param {Object} metadata - The metadata object to be stored.
 */
async function saveMetadata(metadata) {
    if (!session) {
        throw new Error('Neo4j session not initialized. Call initializeNeo4j with a Neo4j session first.');
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
        timestamp: metadata.timestamp || new Date().toISOString(),
    };

    try {
        const query = `
            MERGE (m:Metadata {userId: $userId})
            SET m.apiMethod = $apiMethod,
                m.metadata = $metadata,
                m.status = $status,
                m.error = $error,
                m.responseMessage = $responseMessage,
                m.responseTime = $responseTime,
                m.ip = $ip,
                m.userAgent = $userAgent,
                m.headers = $headers,
                m.timestamp = $timestamp
            RETURN m
        `;

        const params = {
            userId: completeMetadata.userId,
            apiMethod: completeMetadata.apiMethod,
            metadata: JSON.stringify(completeMetadata.metadata),  // Convert to JSON string for Neo4j
            status: completeMetadata.status,
            error: JSON.stringify(completeMetadata.error),        // Convert error object to JSON string
            responseMessage: completeMetadata.responseMessage,
            responseTime: completeMetadata.responseTime,
            ip: completeMetadata.ip,
            userAgent: completeMetadata.userAgent,
            headers: JSON.stringify(completeMetadata.headers),     // Convert headers to JSON string
            timestamp: completeMetadata.timestamp,
        };

        const result = await session.run(query, params);
        // console.log('Metadata saved to Neo4j');
        return result;
    } catch (error) {
        // console.error('Error saving metadata to Neo4j:', error);
        throw error;
    }
}

module.exports = { initializeNeo4j, saveMetadata };
