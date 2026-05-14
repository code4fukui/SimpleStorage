# SimpleStorage

Deno用のシンプルなストレージサーバーサービスです。

## 機能
- シンプルなAPIでHTMLファイルの保存と取得が可能
- パスワード保護されたファイルをサポート
- ファイルサイズを32KBまでに制限

## 必要条件
- Ubuntuサーバー
- Nginxウェブサーバー
- SSL証明書用のLet's Encrypt (certbot-auto)
- Denoランタイム

## 使い方

1. サーバーのセットアップ:
   - Ubuntuをインストール
   - Nginxをインストール
   - Let's Encrypt (certbot-auto)をインストール
   - [Deno](https://deno.land/)をインストール
   - ホームディレクトリが`/home/ss`のユーザー'ss'を作成

2. Nginxの設定:
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

3. Let's EncryptでSSL証明書を取得:
   ```bash
   ./certbot-auto
   ```

4. リポジトリをクローンしてサーバーを起動:
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
MIT License — 詳細は[LICENSE](LICENSE)を参照してください。
