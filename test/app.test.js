const test = require("node:test");
const assert = require("node:assert/strict");
const { maskSecret, loadConfig } = require("../src/config");
const { buildHealthStatus } = require("../src/app");

test("maskSecret nunca devuelve el secreto completo", () => {
  const fakeSecret = "FAKE_DEMO_SECRET_987654";
  const masked = maskSecret(fakeSecret);

  assert.equal(masked, "FAK***54");
  assert.equal(masked.includes("987654"), false);
});

test("maskSecret maneja valores vacios o muy cortos", () => {
  assert.equal(maskSecret(""), "(no configurado)");
  assert.equal(maskSecret(undefined), "(no configurado)");
  assert.equal(maskSecret("1234"), "******");
});

test("loadConfig lee variables de entorno sin exponer el valor crudo", () => {
  const config = loadConfig({
    APP_NAME: "Demo Segura",
    APP_ENV: "production",
    PORT: "8080",
    API_KEY: "FAKE_TEST_TOKEN_ABCD",
  });

  assert.equal(config.appName, "Demo Segura");
  assert.equal(config.appEnv, "production");
  assert.equal(config.port, 8080);
  assert.equal(config.hasApiKey, true);
  assert.equal(config.apiKeyPreview, "FAK***CD");
  assert.equal(JSON.stringify(config).includes("FAKE_TEST_TOKEN_ABCD"), false);
});

test("buildHealthStatus reporta estado correcto aun sin API_KEY", () => {
  const status = buildHealthStatus({ APP_ENV: "test" });

  assert.equal(status.status, "ok");
  assert.equal(status.environment, "test");
  assert.equal(status.secretsConfigured, false);
  assert.equal(status.apiKeyPreview, "(no configurado)");
});
