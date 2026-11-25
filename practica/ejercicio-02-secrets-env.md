# Ejercicio 2 · Usar GitHub Secrets y Environments sin exponer logs

**Objetivo:** Configurar un secreto en GitHub, proteger el entorno `production` con aprobación humana y verificar que GitHub enmascara el secreto en los logs.

## Pasos

1. En tu repositorio (o fork) en GitHub, ve a **Settings → Environments → New environment**.
2. Crea un entorno llamado exactamente `production`.
3. (Opcional pero recomendado) Activa **Required reviewers**, agrega tu propio usuario de GitHub y haz clic en **Save protection rules**.
   - Esto hace que el job `deploy-production-demo` en `.github/workflows/ci.yml` **espere tu aprobación manual** antes de ejecutarse cuando haya un push a `main`.
4. Dentro de ese environment `production` (o en **Settings → Secrets and variables → Actions → Repository secrets**), crea un secreto llamado:
   - **Name:** `DEMO_API_KEY`
   - **Value:** `FAKE_PROD_KEY_AIDJR05_998877` (un valor obviamente falso para práctica)
5. Ve a la pestaña **Actions → CI Seguro (DevSecOps) → Run workflow** (en `main`).
6. Si activaste **Required reviewers**, entra al run en espera, haz clic en **Review pending deployments**, selecciona `production` y aprueba el despliegue.
7. Abre los logs del paso **Usar secreto por variable de entorno (sin imprimirlo)**:
   - Verás que la longitud se reporta correctamente (`28 caracteres`).
   - Verás el JSON de `npm start` con `"secretsConfigured": true` y `"apiKeyPreview": "FAK***77"`.
   - El secreto real nunca aparece en texto claro.

## Experimento extra: ¿Qué pasa si intentas hacer `echo "$API_KEY"`?

GitHub Actions detecta automáticamente los valores exactos de `secrets.*` e imprime `***` en el log.
**Pero cuidado:** si el código o un script malicioso transforma el secreto (por ejemplo `echo "$API_KEY" | base64` o lo invierte con `rev`), GitHub **no** lo reconoce y el secreto queda expuesto en los logs (eso fue exactamente lo que explotó el ataque a `tj-actions/changed-files` en marzo de 2025).

## Recuerda sobre forks

Cuando alguien externo abre un Pull Request desde un **fork** con el evento `pull_request`, GitHub **no entrega tus `secrets` al runner** y da un `GITHUB_TOKEN` de solo lectura. Por eso `deploy-production-demo` también tiene la guarda:
```yaml
if: github.ref == 'refs/heads/main' && github.event_name != 'pull_request'
```
