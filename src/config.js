function maskSecret(value) {
  if (!value || typeof value !== "string") {
    return "(no configurado)";
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "(no configurado)";
  }
  if (trimmed.length <= 6) {
    return "******";
  }
  return `${trimmed.slice(0, 3)}***${trimmed.slice(-2)}`;
}

function loadConfig(env = process.env) {
  return {
    appName: env.APP_NAME || "PupuSec API Helper",
    appEnv: env.APP_ENV || "development",
    port: Number(env.PORT || 3000),
    hasApiKey: Boolean(env.API_KEY && env.API_KEY.trim().length > 0),
    apiKeyPreview: maskSecret(env.API_KEY),
  };
}

module.exports = {
  maskSecret,
  loadConfig,
};
