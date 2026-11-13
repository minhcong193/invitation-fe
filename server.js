const express = require('express');
const path = require('path');
const http = require('http');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_HOST = process.env.BACKEND_HOST || '127.0.0.1';
const BACKEND_PORT = process.env.BACKEND_PORT || 8088;

const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');

// Proxy trung chuyển API sang backend (Stream nguyên vẹn JSON, Multipart/Excel template, Binary)
function forwardToBackend(targetPath, req, res) {
  const headers = { ...req.headers, host: `${BACKEND_HOST}:${BACKEND_PORT}` };
  delete headers['connection'];

  // Nếu gọi /api/v1/guests/code/:code/rsvp thì chuyển sang endpoint /api/v1/guests/invite/:code/rsvp
  let mappedPath = targetPath;
  if (mappedPath.includes('/api/v1/guests/code/') && mappedPath.endsWith('/rsvp')) {
    mappedPath = mappedPath.replace('/api/v1/guests/code/', '/api/v1/guests/invite/');
  }

  const proxyReq = http.request({
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: mappedPath,
    method: req.method,
    headers: headers
  }, (proxyRes) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    if (!res.headersSent) {
      res.status(502).json({ error: 'Không thể kết nối tới backend 8088', details: err.message });
    }
  });

  req.pipe(proxyReq);
}

app.all('/api/backend/*', (req, res) => {
  forwardToBackend(req.originalUrl.replace(/^\/api\/backend/, ''), req, res);
});

app.all('/api/v1/*', (req, res) => {
  forwardToBackend(req.originalUrl, req, res);
});

app.use(express.json());

const greetingFile = path.join(distDir, 'greeting.html');
const dashboardFile = path.join(distDir, 'dashboard.html');

// Hàm phục vụ file HTML kèm hỗ trợ Open Graph Preview động theo query param `?name=...`
function sendHtmlWithOG(req, res, filePath) {
  const guestName = (req.query.name || '').trim();
  if (!guestName) {
    return res.sendFile(filePath);
  }

  try {
    let html = fs.readFileSync(filePath, 'utf8');
    const dynamicTitle = `Kính mời ${guestName} | Thiệp cưới Công Minh & Thu Hằng`;
    const dynamicDesc = `Trân trọng kính mời ${guestName} tới chung vui trong ngày trọng đại của Công Minh & Thu Hằng — 28 & 29.11.2026`;

    html = html.replace(/<title>.*?<\/title>/i, `<title>${dynamicTitle}</title>`);
    html = html.replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/i, `$1${dynamicTitle}$2`);
    html = html.replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/i, `$1${dynamicDesc}$2`);
    html = html.replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/i, `$1${dynamicTitle}$2`);
    html = html.replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/i, `$1${dynamicDesc}$2`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  } catch (err) {
    return res.sendFile(filePath);
  }
}

// 1. Trang chủ mặc định khi vào domain sẽ chuyển hướng sang /greeting
app.get('/', (req, res) => {
  res.redirect('/greeting');
});

// 2. Màn hình Greeting chỉ chứa màn chào, đếm thời gian, sự kiện và âm nhạc (không redirect)
app.get('/greeting', (req, res) => {
  sendHtmlWithOG(req, res, greetingFile);
});

// 3. Màn hình Dashboard thống kê các entity (Khách mời, Nhóm gia đình, Sổ lưu bút)
app.get('/dashboard', (req, res) => {
  res.sendFile(dashboardFile);
});

// Favicon icon trái tim cho tab trình duyệt
app.get(['/favicon.ico', '/favicon.svg'], (req, res) => {
  res.type('image/svg+xml');
  res.sendFile(path.join(distDir, 'favicon.svg'));
});

// Phục vụ toàn bộ file tĩnh (CSS, JS, ảnh, fonts...)
app.use(express.static(distDir, { index: false }));

// Danh sách các route danh xưng chung (Em, Anh, Chị, Cô, Chú, Bác, Cháu, Gia đình...)
const salutationSlugs = [
  'em',
  'anh',
  'chi',
  'co',
  'chu',
  'bac',
  'chau',
  'gia-dinh-em',
  'gia-dinh-anh',
  'gia-dinh-chi',
  'gia-dinh-co',
  'gia-dinh-chu',
  'gia-dinh-bac'
];

salutationSlugs.forEach((slug) => {
  app.get(`/chu-re/${slug}`, (req, res) => sendHtmlWithOG(req, res, indexFile));
  app.get(`/co-dau/${slug}`, (req, res) => sendHtmlWithOG(req, res, indexFile));
  app.get(`/${slug}`, (req, res) => sendHtmlWithOG(req, res, indexFile));
  app.get(`/greeting/${slug}`, (req, res) => sendHtmlWithOG(req, res, greetingFile));
});

// Danh sách các route theo yêu cầu:
// 1. /chu-re và /co-dau
// 2. /chu-re/:inviteCode và /co-dau/:inviteCode (Nhóm họ hàng, family-groups, hiển thị mời không có form)
// 3. /chu-re/invite/:inviteCode và /co-dau/invite/:inviteCode (Khách mời cá nhân, guests, có form RSVP)
const targetRoutes = [
  '/chu-re',
  '/co-dau',
  '/chu-re/:inviteCode',
  '/co-dau/:inviteCode',
  '/chu-re/invite/:inviteCode',
  '/co-dau/invite/:inviteCode'
];

targetRoutes.forEach((route) => {
  app.get(route, (req, res) => {
    sendHtmlWithOG(req, res, indexFile);
  });
});

// Fallback: mọi route khác trả về trang index.html
app.use((req, res) => {
  sendHtmlWithOG(req, res, indexFile);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===================================================`);
  console.log(` Wedding Invitation Server is running!`);
  console.log(` Port: ${PORT}`);
  console.log(` Truy cập các đường dẫn:`);
  console.log(`  - Thiệp theo danh xưng chung (Bác, Chú, Cô, Anh, Chị, Em, Gia đình...):`);
  console.log(`    + http://localhost:${PORT}/chu-re/bac`);
  console.log(`    + http://localhost:${PORT}/chu-re/gia-dinh-bac`);
  console.log(`    + http://localhost:${PORT}/chu-re/anh`);
  console.log(`    + http://localhost:${PORT}/chu-re/chi`);
  console.log(`    + http://localhost:${PORT}/chu-re/em`);
  console.log(`    + http://localhost:${PORT}/co-dau/bac`);
  console.log(`    + http://localhost:${PORT}/co-dau/gia-dinh-bac`);
  console.log(`  - Màn hình Chào mừng theo danh xưng:`);
  console.log(`    + http://localhost:${PORT}/greeting/bac`);
  console.log(`    + http://localhost:${PORT}/greeting/gia-dinh-bac`);
  console.log(`  - Nhóm họ hàng (family-groups, không form):`);
  console.log(`    + http://localhost:${PORT}/chu-re/:inviteCode`);
  console.log(`    + http://localhost:${PORT}/co-dau/:inviteCode`);
  console.log(`  - Khách cá nhân (guests, có form RSVP):`);
  console.log(`    + http://localhost:${PORT}/chu-re/invite/:inviteCode`);
  console.log(`    + http://localhost:${PORT}/co-dau/invite/:inviteCode`);
  console.log(`  - Màn hình Dashboard quản trị:`);
  console.log(`    + http://localhost:${PORT}/dashboard`);
  console.log(`  - Màn hình Chào mừng (Greeting):`);
  console.log(`    + http://localhost:${PORT}/greeting (Mặc định khi vào /)`);
  console.log(`  - Thiệp chi tiết:`);
  console.log(`    + http://localhost:${PORT}/chu-re`);
  console.log(`    + http://localhost:${PORT}/co-dau`);
  console.log(`===================================================`);
});

