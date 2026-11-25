const { loadConfig } = require("./config");

function buildHealthStatus(env = process.env) {
  const config = loadConfig(env);
  return {
    status: "ok",
    service: config.appName,
    environment: config.appEnv,
    secretsConfigured: config.hasApiKey,
    apiKeyPreview: config.apiKeyPreview,
  };
}

module.exports = {
  buildHealthStatus,
};
