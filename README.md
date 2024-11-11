
# Build-My-Meta (Metadata-Logger)

Build-My-Meta is a powerful and flexible metadata logging package for API calls, designed to support multiple databases. This package automatically logs metadata related to API requests and responses, making it easy to monitor user actions, performance, and errors.

## 🦒 Supported Databases
1. [**MongoDB**](#mongodb)
2. [**PostgreSQL**](#postgresql)
3. [**MySQL**](#mysql)
4. [**Firebase Realtime Database / Firestore**](#firebase)
5. [**SQLite**](#sqlite)
6. [**Cassandra**](#cassandra)
7. [**Neo4j**](#neo4j)
8. [**MariaDB**](#mariadb)
9. **Redis** (Coming soon)
10. **Oracle Database** (Coming soon)

## 🦓 Supported Frameworks & Environments
1. Node.js
2. Express.js
3. Next.js (Manual Edition Only)
4. Fastify (Coming Soon)

---

## 🐒 Installation

Install the package using npm:

```bash
npm install build-my-meta
```

## 🐸 Getting Started

### Basic Setup

In your main server file (e.g., `app.js`), import and configure the `BuildMyMeta` middleware. Based on the database type, pass your initialized database instance to the `BuildMyMeta` middleware.

---

## 🐺 Documentation on Website:
Below are some examples of how to configure and use the packages, but they might not be available latest, or might not have detailed step by step process to understand the uses. Visit our website documentation for better understanding. 

##### Website Documentation Link: [https://.../build-my-meta](https://opensource.workforwin.com/packages/build-my-meta)

---

## ~🦈 Backend (Database-Specific Setup Examples)

#### 1. MongoDB ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=mongodb) {#mongodb}


#### 2. PostgreSQL ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=postgresql) {#postgresql}


#### 3. MySQL ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=mysql) {#mysql}


#### 4. Firebase Realtime Database / Firestore ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=firebase) {#firebase}


#### 5. SQLite ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=sqlite) {#sqlite}


#### 6. Cassandra ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=cassandra) {#cassandra}


#### 7. Neo4j ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=neo4j) {#neo4j}


#### 8. MariaDB ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=mariadb) {#mariadb}


## ~ 🐳 Frontend (Next.js) ~ [`🌿Weblink `](https://opensource.workforwin.com/packages/build-my-meta?db=nextjs)

In Next.js, you can use `BuildMyMeta` middleware within custom API routes under `pages/api`. This allows you to set up automatic or manual metadata logging as needed.


#### Notes for Next.js
- **Environment Variables**: Store sensitive information in `.env` files and avoid exposing them to the client side.
- **Database Connection**: Ensure your database connection is established before logging, as shown in the examples above.


## ~ 🪸 Error Handling and Logs

Error logs are stored in the `metaError.json` file if any issues occur during metadata logging.

---

## ~ 🐦‍🔥 Troubleshooting
- **Missing Database Instance**: Ensure to pass an initialized instance (e.g., `mongoose` for MongoDB).
- **Unsupported Database**: Verify that the database type is supported.

---

## License
This package is licensed under the MIT License.
