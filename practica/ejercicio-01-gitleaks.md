# Ejercicio 1 · Detectar un secreto filtrado con Gitleaks en CI

**Objetivo:** Ver en vivo cómo un pipeline DevSecOps detiene una fuga de credenciales antes de que llegue a `main`, y practicar la respuesta correcta ante una filtración.

## Pasos

1. Crea tu propia copia del repositorio (fork o repo propio en tu cuenta de GitHub) y clónala en tu PC:
   ```bash
   git clone <URL_DE_TU_FORK>
   cd devsecops-secretos-pipelines-aidjr05
   ```
2. Asegúrate de tener **GitHub Actions** habilitado en la pestaña **Actions** de tu fork.
3. Crea una rama nueva para no trabajar sobre `main`:
   ```bash
   git checkout -b feat/prueba-gitleaks
   ```
4. Simula el error clásico de un desarrollador apurado: crea un archivo `src/prueba-secreto.js` (o edita `.env.example`) con un token falso siguiendo el patrón de la regla personalizada de `.gitleaks.toml`.
   Por ejemplo, reemplaza `PLANTILLA` por tus iniciales y un número:
   - Plantilla de referencia (permitida en este doc): `AIDJR_DEMO_TOKEN_EJEMPLO_PLANTILLA`
   - Valor para tu prueba (cámbialo, por ejemplo): `AIDJR_DEMO_TOKEN_` + `TU_INICIAL_20261125`
5. Haz commit y sube la rama a GitHub:
   ```bash
   git add src/prueba-secreto.js
   git commit -m "test: simular fuga de token para probar gitleaks"
   git push -u origin feat/prueba-gitleaks
   ```
6. Abre un **Pull Request** hacia `main` en tu propio fork (o revisa la pestaña **Actions** sobre el `push` de tu rama).
7. Observa el job **Escaneo de secretos (Gitleaks)** en `.github/workflows/ci.yml`:
   - El workflow debe fallar en rojo (`🛑 Leaks detected`).
   - Revisa el **Job Summary** y el artefacto `gitleaks-results.sarif` para ver qué regla y qué línea lo dispararon.

## Pregunta clave (¡no la saltes!)

Imagina que ese token era **real** (una API key de OpenAI, Stripe o AWS) y ya hiciste `git push` a un repo público.
¿Qué haces **primero**?
- A) Haces otro commit borrando la línea y vuelves a hacer `git push`.
- B) **Revocas y rotas la credencial en el proveedor inmediatamente**, y *después* limpias el historial de Git (`git filter-repo`) y revisas los logs de acceso.

> **Respuesta correcta: B.** Borrar el archivo en un commit nuevo deja el secreto visible en el historial anterior de Git. Además, en repositorios públicos los bots escanean commits nuevos en cuestión de segundos: en cuanto un secreto toca Git, se considera comprometido.

## Limpieza

Cierra el PR de prueba, borra la rama en local y en remoto:
```bash
git checkout main
git branch -D feat/prueba-gitleaks
git push origin --delete feat/prueba-gitleaks
```
