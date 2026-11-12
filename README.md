# Thiệp cưới Công Minh & Thu Hằng

Phiên bản dựng lại độc lập từ HTML đã render của MeliPage. Trang dùng HTML, CSS và JavaScript thuần, không cần build.

## Chạy thử

Mở `dist/index.html` trực tiếp hoặc chạy một static server tại thư mục `dist`.

Có thể cá nhân hóa tên khách bằng query string:

`index.html?to=Anh%20Tuấn%20và%20gia%20đình`

## Chức năng

- Màn hình mở thiệp và phát nhạc nền
- Responsive trên điện thoại/máy tính
- Đếm ngược tới lễ cưới
- Hai lịch sự kiện và liên kết bản đồ
- Gallery có lightbox
- Sổ lưu bút và RSVP lưu trên trình duyệt (`localStorage`)

Lưu ý: ảnh và nhạc hiện tham chiếu tới các URL tài nguyên gốc trên `melipage.com`. Để triển khai hoàn toàn độc lập, hãy tải tài nguyên về thư mục `dist/assets` và cập nhật đường dẫn.
