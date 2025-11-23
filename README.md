# simple storage


## setup on server

- set up Ubuntu
- install nginx
- install Let's Encrypt (certbot-auto)
- install [Deno](https://deno.land/)

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
nohup deno run -A simplestorage.js 8802 &
EOF

sh run.sh
```

