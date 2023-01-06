# simple storage


## setup on server

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
cat > run.sh
nohup deno run -A simplestorage.js 8802 &
sh run.sh
```

