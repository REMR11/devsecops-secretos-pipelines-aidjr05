# Ejercicio 3 · Auditar y corregir un workflow inseguro

**Objetivo:** Entrenar el ojo para detectar malas prácticas reales en archivos YAML de GitHub Actions antes de aprobar un PR.

## Instrucciones

1. Abre el archivo `ejemplos/inseguro.yml` (sin moverlo a `.github/workflows/`).
2. Léelo línea por línea y anota **todos los problemas de seguridad** que encuentres. Hay al menos **5 fallos importantes**.
3. Para cada fallo, responde:
   - ¿Qué riesgo introduce? (ej. robo de secretos, modificación de código, fuga en logs, compromiso de dependencia).
   - ¿Cómo lo corrige `.github/workflows/ci.yml`?
4. Abre `.github/workflows/ci.yml` y verifica dónde está aplicada cada corrección.

## Preguntas guía

- ¿Qué diferencia hay entre `pull_request` y `pull_request_target` cuando alguien abre un PR desde un fork?
- ¿Por qué `uses: actions/checkout@v4` es menos seguro que `uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`?
- ¿Por qué debemos evitar `${{ secrets.MI_SECRETO }}` directamente dentro de un bloque `run:` y preferir `env:`?
- ¿Qué pasa si omites el bloque `permissions:`?

Cuando termines, contrasta tus respuestas con `practica/SOLUCIONES.md`.
