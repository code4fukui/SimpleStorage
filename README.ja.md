# SimpleStorage

Denoで開発された簡易ストレージサーバーサービスです。HTMLデータの保存、パスワードによる保護機能、簡単なAPIによる操作が行えます。

## 機能
- HTMLファイルの保存と取得
- パスワードによるファイルの保護
- 32KB以下のファイルサイズ制限

## 必要環境
- Ubuntu サーバー
- Nginx ウェブサーバー
- Let's Encrypt (certbot-auto) によるSSL証明書の設定
- Deno ランタイム

## 使い方
1. サーバーのセットアップ
   - Ubuntu のインストール
   - Nginx のインストール
   - Let's Encrypt (certbot-auto) のインストールと設定
   - [Deno](https://deno.land/) のインストール
   - 'ss' ユーザーの作成とホームディレクトリの設定 `/home/ss`

2. Nginx の設定
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

3. Let's Encrypt によるSSL証明書の取得
   ```bash
   ./certbot-auto
   ```

4. リポジトリのクローンと サーバーの起動
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

## ライセンス
MIT License