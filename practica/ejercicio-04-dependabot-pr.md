# Ejercicio 4 · Revisar un PR de Dependabot con criterio DevSecOps

**Objetivo:** Saber cómo evaluar un Pull Request automático de Dependabot (o de actualización de dependencias) sin hacer "merge a ciegas" ni ignorar alertas críticas.

## Parte A · Inspectar `.github/dependabot.yml`

Abre `.github/dependabot.yml` y responde:
1. ¿Qué dos ecosistemas vigila? (`npm` y `github-actions`).
2. ¿Por qué vigilar `github-actions` es indispensable cuando fijamos Actions por commit SHA completo?
   - *Pista:* un SHA no se actualiza solo. Sin Dependabot (o Renovate), te quedarías en versiones viejas con bugs o vulnerabilidades.
3. ¿Qué ventaja tiene la sección `groups:` (`npm-minor-and-patch`)?

## Parte B · Checklist antes de aprobar un PR de Dependabot

Imagina que Dependabot abre dos PRs el lunes por la mañana:
- **PR #1:** `Bump dotenv from 18.0.10 to 18.0.12` (patch) — todos los checks en verde.
- **PR #2:** `Bump express from 4.21.0 to 5.1.0` (major) — falla un test o cambia APIs.

Sigue este flujo de revisión:
1. **¿Es alerta de seguridad o solo actualización de versión?**
   - Revisa la pestaña **Security → Dependabot alerts** para ver si hay un CVE y qué severidad tiene (`Critical`, `High`, `Medium`, `Low`).
2. **¿La vulnerabilidad es explotable en tu app?**
   - Ejemplo real: una vulnerabilidad de ReDoS en una librería usada solo para formatear docs de desarrollo no tiene el mismo impacto que una RCE en producción.
3. **Revisa el SemVer (`MAJOR.MINOR.PATCH`):**
   - `PATCH` / `MINOR`: bajo riesgo si los tests y `npm audit` pasan.
   - `MAJOR`: revisa el **Changelog / Release notes** dentro del mismo PR de Dependabot para ver *breaking changes*.
4. **Verifica que el CI pasó completo:**
   - `npm ci` + `npm audit --audit-level=high` + `npm test` + `gitleaks` + `CodeQL`.
5. **Revisa el diff de `package-lock.json`:**
   - ¿Cambió solo lo esperado o aparecieron scripts `preinstall`/`postinstall` sospechosos? (Recuerda que campañas como **Shai-Hulud** en npm abusaron de `scripts.preinstall` en paquetes comprometidos).

## Debate rápido en clase: Pros y Contras de Dependabot

- **Pros:** gratis en GitHub, automático, vigila `npm` y `github-actions`, abre PRs listos con release notes y compatibility score, agrupa actualizaciones.
- **Contras:** puede generar ruido (*alert fatigue*) si no se agrupan PRs, a veces reporta falsos positivos en dependencias `devDependencies` no alcanzables en producción, los updates `major` requieren revisión manual, y no reemplaza una suite de tests confiable.
