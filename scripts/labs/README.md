# Prueba de infraestructura de Intermodular

Validación docente realizada el 26 de octubre de 2026 en AWS Academy Learner Lab.

## Configuración probada

- us-east-1; EC2 t3.small, créditos CPU Standard; Ubuntu Server 24.04 LTS x86_64; disco gp3 de 8 GiB.
- Java 21, Spring Boot 3.5.7 para esta prueba, PostgreSQL 16, Nginx y systemd.
- Sin rol IAM adjunto. Una única regla de entrada TCP/80, autorizada por el titular. SSH, 5432 y 8080 sin acceso exterior.
- La contraseña se genera dentro de la instancia y se conserva en un archivo root 600. No aparece en el código, los datos de usuario ni las evidencias públicas.

## Resultado observado

`intermodular-smoke-cloud-init.sh` se utilizó como datos de usuario sobre una instancia nueva. El registro mostró `BUILD SUCCESS`, `INTERMODULAR_SMOKE_OK` e `INTERMODULAR_PERSISTENCE_AFTER_SERVICE_RESTART_OK`.

Desde un navegador externo a la máquina, `GET /api/estado` devolvió:

```json
{"baseDeDatos":"PostgreSQL","estado":"ok","registros":1}
```

El contador procede de una consulta SQL real. El mismo registro seguía presente después de reiniciar PostgreSQL y el backend. `ss` mostró PostgreSQL solo en 127.0.0.1:5432. Esta prueba no acredita recuperación tras pérdida de disco, HTTPS ni despliegue desde GitHub Actions.

## Material del alumno

`public/teaching/downloads/intermodular-ec2-init.sh` prepara únicamente infraestructura. No instala la demo ni sustituye el proyecto de Servidor. El alumno publica el JAR aprobado de su propio repositorio siguiendo la sesión 8.

La combinación de runtime, proxy y base local está probada; la variante de plantilla para el alumno, la transferencia SCP del artefacto del CI, el apagado/arranque completo de EC2 y la restauración de una copia no se han ensayado de extremo a extremo en esta validación. HTTPS requiere un nombre DNS administrable y su prueba antes del cliente de Pages o la autenticación.

Las capturas, identificadores de cuenta y direcciones temporales de la prueba se conservan fuera de los archivos versionados. No reutilizar el script de demo sobre una base existente: es una preparación de una sola ejecución para una máquina desechable, no una migración del producto.
