# DevSecOps y Gestión Segura de Secretos en Pipelines · Kodigo AIDJR05

Repositorio de práctica para la sesión final de **AIDJR Generación 05 (25 de noviembre de 2026)**.

Aquí tienes una aplicación mínima en Node.js con un pipeline de CI/CD endurecido, un ejemplo de workflow inseguro para auditar, un ejemplo de OIDC para AWS, configuración de Dependabot, CodeQL y Gitleaks, más 4 ejercicios prácticos guiados.

---

## Estructura del repositorio

| Ruta | Qué contiene |
| --- | --- |
| `src/` | App mínima de Node.js que lee variables de entorno y enmascara secretos en diagnósticos (`maskSecret`). |
| `test/app.test.js` | Pruebas unitarias con `node:test` (`npm test`). |
| `.github/workflows/ci.yml` | Pipeline seguro: `permissions: contents: read`, Actions fijadas por SHA, `npm ci`, `npm audit --audit-level=high`, `npm test`, `gitleaks` y demo de `environment: production`. |
| `.github/workflows/codeql.yml` | Análisis estático de seguridad (SAST) con CodeQL para JavaScript/TypeScript. |
| `.github/dependabot.yml` | Actualizaciones semanales para `npm` (agrupadas) y `github-actions`. |
| `.gitleaks.toml` | Reglas de detección de secretos en CI (incluye regla didáctica `aidjr-demo-token`). |
| `ejemplos/inseguro.yml` | **Ejemplo educativo con 5 vulnerabilidades** (fuera de `.github/workflows/` para que no se ejecute). |
| `ejemplos/oidc-aws.yml` | Ejemplo documentado de autenticación efímera hacia AWS con OIDC sin llaves estáticas. |
| `practica/` | Guías paso a paso para los 4 ejercicios en clase + `SOLUCIONES.md`. |

---

## Cómo correr el proyecto en local

Requisitos: **Node.js 20 o superior** (recomendado Node 24 LTS).

```bash
cp .env.example .env
npm ci
npm test
npm start
```

> **Nota:** `.env` está listado en `.gitignore` para evitar que subas credenciales locales a Git.

---

## Ejercicios de la sesión

1. [Ejercicio 1 · Detectar un secreto filtrado con Gitleaks](practica/ejercicio-01-gitleaks.md)
2. [Ejercicio 2 · Configurar GitHub Secrets y Environment `production`](practica/ejercicio-02-secrets-env.md)
3. [Ejercicio 3 · Auditar y corregir `ejemplos/inseguro.yml`](practica/ejercicio-03-arreglar-workflow.md)
4. [Ejercicio 4 · Revisar un PR de Dependabot y debatir pros y contras](practica/ejercicio-04-dependabot-pr.md)

---

## Configuración recomendada en GitHub (gratis en repos públicos)

Cuando hagas fork o publiques este repo en tu cuenta de GitHub, ve a **Settings → Security and quality → Advanced Security** y habilita:

1. **Dependency graph** (necesario para que Dependabot conozca tus paquetes).
2. **Dependabot alerts** (avisos cuando aparezca un CVE en tus dependencias).
3. **Dependabot security updates** (PRs automáticos para parchar vulnerabilidades; opcionalmente activa *Grouped security updates*).
4. **Secret scanning** (escanea commits, PRs e issues buscando tokens filtrados).
5. **Push protection** (bloquea tu `git push` **antes** de que un secreto reconocido llegue al repositorio remoto).
6. **Environments → `production` → Required reviewers** (en **Settings → Environments**), para exigir aprobación humana antes de ejecutar `deploy-production-demo`.

---

## Regla de oro para clase

**Usa siempre secretos obviamente falsos en estas prácticas** (por ejemplo `FAKE_API_KEY_123` o `AIDJR_DEMO_TOKEN_...`). Nunca pegues credenciales reales de tus proyectos o cuentas en repositorios ni prompts.
