# simple storage

A simple storage server service for Deno

## setup on server

1. set up Ubuntu
2. install nginx
3. install Let's Encrypt (certbot-auto)
4. install [Deno](https://deno.land/)

```bash
adduser ss
chmod 755 /home/ss
passwd ss

sudo cat > /etc/nginx/conf.d/ss_sabae_cc.conf <<EOF
server {
  listen 80;
  server_name ss.sabae.cc;
  location / {
    proxy_pass http://localhost:8802/;
  }
}
EOF

nginx -s reload

./certbot-auto

cd /home/ss
su ss
git clone https://github.com/code4fukui/SimpleStorage.git

cd SimpleStorage
cat > run.sh << EOF
nohup deno serve --port 8802 -A simplestorage.js &
EOF

sh run.sh
```

