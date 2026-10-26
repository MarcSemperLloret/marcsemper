#!/bin/bash
# Ubuntu 24.04: infrastructure only. Does not create or replace the student API.
# Run once as EC2 user data on a new instance. No credentials in this file.
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y openjdk-21-jre-headless nginx postgresql curl
useradd --system --home /opt/intermodular --shell /usr/sbin/nologin intermodular
install -d -o root -g intermodular -m 750 /opt/intermodular
install -m 600 /dev/null /etc/intermodular.env
cat > /etc/systemd/system/intermodular.service <<'UNIT'
[Unit]
Description=Backend del proyecto intermodular
After=network.target postgresql.service
[Service]
User=intermodular
WorkingDirectory=/opt/intermodular
EnvironmentFile=/etc/intermodular.env
ExecStart=/usr/bin/java -Xmx512m -jar /opt/intermodular/app.jar --server.address=127.0.0.1 --server.port=8080
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
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX
nginx -t
systemctl reload nginx
systemctl daemon-reload
systemctl enable intermodular
echo INTERMODULAR_INFRASTRUCTURE_READY
# The service is started after an approved JAR has been installed.
