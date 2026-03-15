# SimpleStorage

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple storage server service for Deno.

## Features
- Stores and retrieves HTML files with a simple API
- Supports password-protected files
- Limits file size to 32KB

## Requirements
- Ubuntu server
- Nginx web server
- Let's Encrypt (certbot-auto) for SSL certificates
- Deno runtime

## Usage

1. Set up the server:
   - Install Ubuntu
   - Install Nginx
   - Install Let's Encrypt (certbot-auto)
   - Install [Deno](https://deno.land/)
   - Create a user 'ss' with home directory `/home/ss`

2. Configure Nginx:
   ```bash
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
   ```

3. Obtain an SSL certificate with Let's Encrypt:
   ```bash
   ./certbot-auto
   ```

4. Clone the repository and run the server:
   ```bash
   cd /home/ss
   su ss
   git clone https://github.com/code4fukui/SimpleStorage.git
   cd SimpleStorage
   cat > run.sh << EOF
   nohup deno serve --port 8802 -A simplestorage.js &
   EOF
   sh run.sh
   ```

## License
MIT License