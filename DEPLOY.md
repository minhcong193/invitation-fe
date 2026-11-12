# Hướng Dẫn Deploy Dự Án Thiệp Cưới Lên VPS

Dự án này đã được cấu hình sẵn để triển khai lên VPS với **4 đường dẫn (URL routes)**:
1. `/chu-re`
2. `/co-dau`
3. `/chu-re/:id` (ví dụ: `/chu-re/anh-tuan`, `/chu-re/ban-cap-3`, `/chu-re/01`)
4. `/co-dau/:id` (ví dụ: `/co-dau/chi-mai`, `/co-dau/dong-nghiep`, `/co-dau/02`)

Tạm thời cả 4 trang đều dùng chung giao diện thiệp cưới, đồng thời:
- Tự động nhận diện slug `{id}` hoặc query param `?to=Tên+Khách` để hiển thị tên khách mời trang trọng tại màn hình mở thiệp.
- Tự động chọn sẵn mục **Bạn là khách của: Chú rể** (khi truy cập `/chu-re/...`) hoặc **Cô dâu** (khi truy cập `/co-dau/...`) trong form RSVP.

---

## Cách 1: Triển khai bằng Node.js + PM2 (Khuyên Dùng)

### 1. Chuẩn bị trên VPS (Ubuntu/Debian)
Cài đặt Node.js (phiên bản 18+ hoặc 20+) và PM2:
```bash
# Cài đặt Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2 để quản lý tiến trình chạy nền vĩnh viễn
sudo npm install -g pm2
```

### 2. Đưa mã nguồn lên VPS
Bạn có thể dùng Git hoặc SCP/FileZilla để tải toàn bộ thư mục dự án lên VPS (ví dụ đặt tại `/var/www/wedding-invitation`).

```bash
cd /var/www/wedding-invitation
npm install
```

### 3. Khởi chạy bằng PM2
Dự án đã có sẵn file [ecosystem.config.js](file:///c:/Users/Admin/Documents/ChatGPT/Thi%E1%BB%87p%20c%C6%B0%E1%BB%9Bi/wedding-invitation/ecosystem.config.js):
```bash
# Chạy app qua PM2
pm2 start ecosystem.config.js

# Cấu hình tự khởi động lại app khi VPS reboot
pm2 startup
pm2 save
```

Kiểm tra trạng thái app:
```bash
pm2 status
pm2 logs wedding-invitation
```

### 4. Cấu hình Nginx làm Reverse Proxy & Cấp SSL miễn phí (HTTPS)
Tạo file cấu hình Nginx:
```bash
sudo nano /etc/nginx/sites-available/wedding.conf
```
Dán nội dung cấu hình (đã có trong file [nginx.conf](file:///c:/Users/Admin/Documents/ChatGPT/Thi%E1%BB%87p%20c%C6%B0%E1%BB%9Bi/wedding-invitation/nginx.conf)):
```nginx
server {
    listen 80;
    server_name thiepcuoi.domaincuaban.com; # Đổi thành domain của bạn

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Kích hoạt site và reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/wedding.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Cài chứng chỉ SSL HTTPS miễn phí với Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d thiepcuoi.domaincuaban.com
```

---

## Cách 2: Triển khai bằng Docker & Docker Compose (Nhanh & Gọn)

Nếu VPS của bạn đã có Docker và Docker Compose:
```bash
cd /var/www/wedding-invitation
docker compose up -d --build
```
Dự án sẽ tự động đóng gói và chạy trên cổng `3000`.

---

## Cách 3: Chạy thuần Nginx (Không cần cài Node.js trên VPS)

Nếu bạn không muốn chạy Node.js trên VPS, bạn chỉ cần copy thư mục `dist` lên VPS và cấu hình Nginx:

1. Copy thư mục `dist` lên `/var/www/wedding-invitation/dist`.
2. Trong Nginx cấu hình:
```nginx
server {
    listen 80;
    server_name thiepcuoi.domaincuaban.com;

    root /var/www/wedding-invitation/dist;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Định tuyến 4 đường dẫn về index.html
    location ~ ^/(chu-re|co-dau)(/.*)?$ {
        try_files $uri $uri/ /index.html;
    }

    # Trang chủ tự chuyển hướng sang /chu-re
    location = / {
        return 302 /chu-re;
    }

    # Các file tĩnh (ảnh, css, js)
    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|webp|gif|svg|ico|css|js|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
```
Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Kiểm tra sau khi deploy
Hãy thử truy cập:
- `https://your-domain.com/chu-re`
- `https://your-domain.com/co-dau`
- `https://your-domain.com/chu-re/Anh%20Tuan` (hoặc `https://your-domain.com/chu-re/anh-tuan`)
- `https://your-domain.com/co-dau/Ban%20Lan` (hoặc `https://your-domain.com/co-dau/ban-lan`)
- `https://your-domain.com/chu-re?to=Bác%20Ba%20và%20Gia%20Đình`

