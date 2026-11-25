# Soluciones y guía rápida de los ejercicios

## Ejercicio 1 · Gitleaks
- Al subir un commit con un token que coincide con `.gitleaks.toml` (o con cualquier clave real de AWS/GitHub/etc.), el job `secret-scan` termina con código de salida `1` (`gitleaks` detecta la fuga y redacta el secreto en el log).
- **Orden obligatorio ante una fuga real:**
  1. **Revocar y rotar** el secreto inmediatamente en el proveedor.
  2. Revisar logs de auditoría para verificar si fue usado.
  3. Limpiar historial de Git (`git filter-repo`) y forzar push si aplica.
  4. Agregar prevención (GitHub Push Protection + Gitleaks en pre-commit / CI).

## Ejercicio 2 · Secrets y Environments
- Los secretos deben inyectarse con `env:` en el paso específico que los usa, nunca con `${{ secrets.* }}` directo dentro de `run:`.
- `environment: production` permite exigir aprobación manual (*Required reviewers*) y aislar secretos de producción respecto a ramas de desarrollo o PRs de forks.

## Ejercicio 3 · Los 5 fallos de `ejemplos/inseguro.yml`
1. **`pull_request_target` + checkout del head del PR:** ejecuta código no confiable de un fork con acceso a secretos y token de escritura (Poisoned Pipeline Execution). Solución: usar `pull_request` normal (sin secretos de forks) y nunca hacer checkout del `head` bajo `pull_request_target`.
2. **Falta de `permissions:`:** hereda permisos amplios por defecto. Solución: declarar `permissions: contents: read` arriba del workflow.
3. **Actions por tag mutable (`@v4`, `@v45`):** si comprometen la cuenta del autor del Action y mueven el tag (como pasó en `tj-actions/changed-files` en marzo 2025), tu CI ejecuta código malicioso. Solución: fijar por commit SHA completo + comentario de versión + Dependabot para `github-actions`.
4. **Secreto hardcodeado (`FAKE_HARDCODED_SECRET_DEMO_123`):** cualquiera con acceso al repo o historial lo lee. Solución: usar `.env` local (en `.gitignore`) y GitHub Secrets en CI.
5. **Imprimir/transformar secretos en `run:`:** `${{ secrets.PROD_TOKEN }}` interpolado en shell abre puerta a inyección y codificarlo en `base64` rompe el enmascarado de GitHub. Solución: pasar por `env:` y nunca imprimirlo ni codificarlo.

## Ejercicio 4 · Dependabot
- `dependabot.yml` monitorea `npm` y `github-actions` semanalmente y agrupa `minor`/`patch`.
- Un PR de Dependabot se aprueba tras revisar: severidad/alcance, changelog (en `major`), estado verde del CI y ausencia de cambios raros en `package-lock.json`.
