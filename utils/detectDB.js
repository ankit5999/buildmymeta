const DB_TYPES = require('../constants/dbTypes');

function detectDB(DB_TYPE, dbInstance) {
    switch (DB_TYPE) {
        case DB_TYPES.MONGODB: {
            const { initializeMongoDB } = require('../db/mongodb');
            initializeMongoDB(dbInstance);
            return require('../db/mongodb');
        }
        case DB_TYPES.POSTGRES: {
            const { initializePostgres } = require('../db/postgres');
            initializePostgres(dbInstance);
            return require('../db/postgres');
        }
        case DB_TYPES.MYSQL: {
            const { initializeMySQL } = require('../db/sql');
            initializeMySQL(dbInstance);
            return require('../db/sql');
        }
        case DB_TYPES.FIRESTORE: {
            const { initializeFirebase } = require('../db/firebase');
            initializeFirebase(dbInstance, 'firestore');
            return require('../db/firebase');
        }
        case DB_TYPES.FIREBASEREALTIME: {
            const { initializeFirebase } = require('../db/firebase');
            initializeFirebase(dbInstance, 'realtime');
            return require('../db/firebase');
        }
        case DB_TYPES.SQLITE: {
            const { initializeSQLite } = require('../db/sqlite');
            initializeSQLite(dbInstance);
            return require('../db/sqlite');
        }
        case DB_TYPES.CASSANDRA: {
            const { initializeCassandra } = require('../db/cassandra');
            initializeCassandra(dbInstance);
            return require('../db/cassandra');
        }
        case DB_TYPES.NEO4J: {
            const { initializeNeo4j } = require('../db/neo4j');
            initializeNeo4j(dbInstance);
            return require('../db/neo4j');
        }
        case DB_TYPES.MARIADB: {
            const { initializeMariaDB } = require('../db/mariadb');
            initializeMariaDB(dbInstance);
            return require('../db/mariadb');
        }
        default:
            throw new Error('Unsupported database type.');
    }
}

module.exports = detectDB;
