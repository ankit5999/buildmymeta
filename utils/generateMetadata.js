// utils/generateMetadata.js
function generateMetadata(req, res, userId) {
    const startTime = Date.now();  // Track start time

    const metadata = {
        userId: userId || 'Anonymous',
        apiMethod: req.method.toLowerCase(),
        metadata: {
            url: req.originalUrl,
            body: req.body,
            params: req.params,
            query: req.query,
        },
        headers: req.headers,  // Capture request headers
        ip: req.ip || req.connection.remoteAddress,  // Capture user IP
        userAgent: req.headers['user-agent'],  // Capture user agent
        responseTime: null,  // Will store response time in ms
        status: null,  // Will be updated after response is sent
        responseMessage: null,  // To capture the user API response content
    };

    // Override res.send to capture the response content
    const originalSend = res.send;
    res.send = function (body) {
        // Capture the response content
        metadata.responseMessage = body;

        // Call the original res.send with the response body
        originalSend.call(this, body);
    };

    // Return a promise that resolves when the response is finished
    return new Promise((resolve) => {
        res.on('finish', () => {
            const endTime = Date.now();  // End time
            metadata.responseTime = endTime - startTime;  // Calculate response time
            metadata.status = res.statusCode;

            if (res.statusCode >= 400) {
                metadata.error = {
                    message: res.statusMessage,
                    stack: res.stack || 'No stack available',
                };
            }

            // Resolve the promise with the updated metadata
            resolve(metadata);
        });
    });
}

module.exports = generateMetadata;
