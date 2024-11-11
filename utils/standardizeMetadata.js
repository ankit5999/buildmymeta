// utils/standardizeMetadata.js
function standardizeMetadata(metadata, req = null) {
    return {
        userId: metadata.userId || 'Anonymous',
        apiMethod: metadata.apiMethod || (req ? req.method.toLowerCase() : 'unknown'),
        metadata: {
            // Core fields from `req` to maintain consistency
            url: req ? req.originalUrl : '',
            body: req ? req.body : {},
            params: req ? req.params : {},
            query: req ? req.query : {},
            // Append any additional user-defined metadata
            ...metadata.metadata,
        },
        headers: metadata.headers || (req ? req.headers : {}),
        ip: metadata.ip || (req ? req.ip || req.connection.remoteAddress : 'unknown'),
        userAgent: metadata.userAgent || (req ? req.headers['user-agent'] : 'unknown'),
        responseTime: metadata.responseTime || null,  // Set to null initially, updated after response
        status: metadata.status || 'unknown',
        responseMessage: metadata.responseMessage || 'No response message',
        timestamp: metadata.timestamp || new Date(),  // Default to current timestamp
        error: metadata.error || null,
    };
}

module.exports = standardizeMetadata;