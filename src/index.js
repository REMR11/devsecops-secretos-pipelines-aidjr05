require("dotenv").config({ quiet: true });
const { buildHealthStatus } = require("./app");

const status = buildHealthStatus(process.env);
console.log("Estado del servicio (sin exponer secretos reales):");
console.log(JSON.stringify(status, null, 2));
