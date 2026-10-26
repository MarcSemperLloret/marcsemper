#!/bin/bash
# Disposable smoke test. Ubuntu 24.04, Java 21, Spring Boot, local PostgreSQL.
# No personal data. Database credentials are generated on the instance.
set -euo pipefail
exec > >(tee -a /var/log/intermodular-setup.log /dev/console) 2>&1
trap 'echo "INTERMODULAR_SETUP_FAILED line=$LINENO"' ERR
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y openjdk-21-jdk-headless maven postgresql nginx curl openssl
systemctl enable --now postgresql
useradd --system --home /opt/intermodular --shell /usr/sbin/nologin intermodular
install -d -o intermodular -g intermodular /opt/intermodular/src/main/java/aula /opt/intermodular/src/main/resources
DB_PASSWORD=$(openssl rand -hex 24)
runuser -u postgres -- psql -v ON_ERROR_STOP=1 <<SQL
CREATE USER intermodular WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE intermodular OWNER intermodular;
SQL
cat > /opt/intermodular/pom.xml <<'XML'
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-parent</artifactId><version>3.5.7</version><relativePath/></parent>
  <groupId>aula</groupId><artifactId>intermodular-smoke</artifactId><version>0.0.1</version>
  <properties><java.version>21</java.version></properties>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-jdbc</artifactId></dependency>
    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
XML
cat > /opt/intermodular/src/main/java/aula/Application.java <<'JAVA'
package aula;
import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@SpringBootApplication
@RestController
public class Application {
  private final JdbcTemplate db;
  public Application(JdbcTemplate db) { this.db = db; }
  public static void main(String[] args) { SpringApplication.run(Application.class, args); }
  @GetMapping("/api/estado")
  public Map<String,Object> estado() {
    return Map.of("estado", "ok", "baseDeDatos", "PostgreSQL", "registros",
      db.queryForObject("select count(*) from evidencia", Long.class));
  }
}
JAVA
cat > /opt/intermodular/src/main/resources/application.properties <<'PROPS'
server.address=127.0.0.1
server.port=8080
spring.datasource.url=jdbc:postgresql://127.0.0.1:5432/intermodular
spring.datasource.username=intermodular
spring.datasource.password=${DB_PASSWORD}
server.error.include-message=never
PROPS
runuser -u postgres -- psql -d intermodular -v ON_ERROR_STOP=1 <<'SQL'
CREATE TABLE evidencia (id bigint generated always as identity primary key, nota text not null);
ALTER TABLE evidencia OWNER TO intermodular;
INSERT INTO evidencia(nota) VALUES ('dato ficticio persistente');
SQL
chown -R intermodular:intermodular /opt/intermodular
cd /opt/intermodular
runuser -u intermodular -- env MAVEN_OPTS=-Xmx384m mvn -B -ntp package
install -m 600 /dev/null /etc/intermodular.env
printf 'DB_PASSWORD=%s\n' "$DB_PASSWORD" > /etc/intermodular.env
unset DB_PASSWORD
cat > /etc/systemd/system/intermodular.service <<'UNIT'
[Unit]
Description=Intermodular Spring Boot smoke test
After=network.target postgresql.service
Requires=postgresql.service
[Service]
User=intermodular
WorkingDirectory=/opt/intermodular
EnvironmentFile=/etc/intermodular.env
ExecStart=/usr/bin/java -Xmx256m -jar /opt/intermodular/target/intermodular-smoke-0.0.1.jar
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
[Install]
WantedBy=multi-user.target
UNIT
cat > /etc/nginx/sites-available/default <<'NGINX'
server {
  listen 80 default_server;
  server_name _;
  location = /api/estado {
    limit_except GET { deny all; }
    proxy_pass http://127.0.0.1:8080;
  }
  location / { return 404; }
}
NGINX
nginx -t
systemctl reload nginx
systemctl daemon-reload
systemctl enable --now intermodular
for attempt in $(seq 1 90); do
  if curl -fsS http://127.0.0.1/api/estado > /tmp/intermodular-before.json; then break; fi
  sleep 2
done
grep -q '"registros":1' /tmp/intermodular-before.json
systemctl restart postgresql
systemctl restart intermodular
for attempt in $(seq 1 90); do
  if curl -fsS http://127.0.0.1/api/estado > /tmp/intermodular-after.json; then break; fi
  sleep 2
done
grep -q '"registros":1' /tmp/intermodular-after.json
echo INTERMODULAR_SMOKE_OK
cat /tmp/intermodular-after.json
echo
echo INTERMODULAR_PERSISTENCE_AFTER_SERVICE_RESTART_OK
ss -lnt
