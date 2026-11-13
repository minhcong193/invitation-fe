// =========================================================================
// Wedding Invitation Comprehensive Admin & Analytics Dashboard
// Covers 100% of OpenAPI / Swagger APIs on http://localhost:8088
// =========================================================================

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Application state
const state = {
  guests: [],
  familyGroups: [],
  guestbook: [],
  isLoading: false,
  backendOnline: false
};

// Toast notification helper
function showToast(msg) {
  const toast = $('#dashToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// Copy to clipboard helper
async function copyLink(url) {
  try {
    await navigator.clipboard.writeText(url);
    showToast('Đã sao chép link thiệp vào clipboard!');
  } catch (_) {
    prompt('Sao chép đường dẫn dưới đây:', url);
  }
}

// Universal API request helper
async function apiRequest(endpoint, options = {}) {
  const urls = [
    `/api/backend${endpoint}`,
    `http://localhost:8088${endpoint}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      if (res.ok) {
        state.backendOnline = true;
        updateBackendStatus();
        return await res.json();
      }
    } catch (_) {}
  }
  return null;
}

function updateBackendStatus() {
  const dot = $('#statusDot');
  const text = $('#statusText');
  if (state.backendOnline) {
    if (dot) dot.className = 'status-dot online';
    if (text) text.textContent = 'Backend :8088 Online';
  } else {
    if (dot) dot.className = 'status-dot offline';
    if (text) text.textContent = 'Backend Offline';
  }
}

// =========================================================================
// 1. TẢI TOÀN BỘ DỮ LIỆU TỪ BACKEND (GET APIs)
// =========================================================================
async function loadAllData() {
  state.isLoading = true;
  const refreshIcon = $('#refreshIcon');
  if (refreshIcon) refreshIcon.style.animation = 'spin 1s infinite linear';

  try {
    const [guestsRes, familyRes, guestbookRes] = await Promise.all([
      apiRequest('/api/v1/guests?page=0&size=500'),
      apiRequest('/api/v1/family-groups?page=0&size=500'),
      apiRequest('/api/v1/guestbook/admin?page=0&size=500')
    ]);

    state.guests = guestsRes?.data?.content || guestsRes?.data || [];
    state.familyGroups = familyRes?.data?.content || familyRes?.data || [];
    state.guestbook = guestbookRes?.data?.content || guestbookRes?.data || [];

    computeKpis();
    renderGuestsTable();
    renderFamilyTable();
    renderGuestbookTable();
    renderTablesSummary();
  } catch (err) {
    console.error('Lỗi khi tải dữ liệu dashboard:', err);
    showToast('Không thể kết nối đến backend 8088');
  } finally {
    state.isLoading = false;
    if (refreshIcon) refreshIcon.style.animation = 'none';
  }
}

// =========================================================================
// 2. TÍNH TOÁN CÁC CHỈ SỐ KPI & BIỂU ĐỒ TRỰC QUAN
// =========================================================================
function computeKpis() {
  const guests = state.guests;
  const family = state.familyGroups;
  const gb = state.guestbook;

  // Cá nhân
  const groomGuests = guests.filter(g => g.guestSide === 'groom').length;
  const brideGuests = guests.filter(g => g.guestSide === 'bride').length;

  const attendingGuests = guests.filter(g => g.rsvpStatus === 'attending' || g.rsvpStatus === 'ATTENDING').length;
  const declinedGuests = guests.filter(g => g.rsvpStatus === 'declined' || g.rsvpStatus === 'DECLINED').length;
  const pendingGuests = guests.filter(g => !g.rsvpStatus).length;

  // Gia đình & họ hàng
  const totalFamilyCount = family.reduce((sum, f) => sum + (Number(f.expectedGuestCount) || 0), 0);
  const groomFamily = family.filter(f => f.guestSide === 'groom');
  const brideFamily = family.filter(f => f.guestSide === 'bride');
  const groomFamilyCount = groomFamily.reduce((sum, f) => sum + (Number(f.expectedGuestCount) || 0), 0);
  const brideFamilyCount = brideFamily.reduce((sum, f) => sum + (Number(f.expectedGuestCount) || 0), 0);

  // Sổ lưu bút
  const approvedGb = gb.filter(m => m.moderationStatus === 'APPROVED').length;
  const pendingGb = gb.filter(m => m.moderationStatus === 'PENDING').length;

  // Tổng toàn tiệc
  const totalExpected = attendingGuests + totalFamilyCount;

  // Render KPIs
  $('#kpiTotalExpected').textContent = totalExpected;
  $('#kpiTotalGuests').textContent = guests.length;
  $('#kpiGuestsSub').innerHTML = `<span>Nhà trai: <b>${groomGuests}</b></span> · <span>Nhà gái: <b>${brideGuests}</b></span>`;

  $('#kpiRsvpAttending').textContent = attendingGuests;
  $('#kpiRsvpSub').innerHTML = `
    <span class="badge-tag" style="background:#dcfce7; color:#16a34a;">${attendingGuests} Tham dự</span>
    <span class="badge-tag" style="background:#fee2e2; color:#dc2626;">${declinedGuests} Báo bận</span>
    <span class="badge-tag" style="background:#f1f5f9; color:#64748b;">${pendingGuests} Chưa phản hồi</span>
  `;

  $('#kpiFamilyGroups').textContent = family.length;
  $('#kpiFamilyCount').textContent = totalFamilyCount;
  $('#kpiFamilySub').innerHTML = `
    <span>Dự kiến: <b>${totalFamilyCount}</b> người</span> · 
    <span>Trai: ${groomFamily.length} / Gái: ${brideFamily.length}</span>
  `;

  $('#kpiGuestbook').textContent = gb.length;
  $('#kpiGuestbookSub').innerHTML = `
    <span style="color:#16a34a;"><b>${approvedGb}</b> đã duyệt</span> · 
    <span style="color:#d97706;"><b>${pendingGb}</b> chờ duyệt</span>
  `;

  // Badges ở tabs
  $('#badgeGuestsCount').textContent = guests.length;
  $('#badgeFamilyCount').textContent = family.length;
  $('#badgeGuestbookCount').textContent = gb.length;

  // Bàn tiệc count
  const uniqueTables = new Set(family.filter(f => f.tableNumber).map(f => f.tableNumber));
  $('#badgeTablesCount').textContent = uniqueTables.size;

  // Tỷ lệ phản hồi RSVP Progress Bar
  const totalGuests = guests.length || 1;
  const respondedCount = attendingGuests + declinedGuests;
  const responseRate = Math.round((respondedCount / totalGuests) * 100);
  $('#responseRateBadge').textContent = `${responseRate}% đã phản hồi (${respondedCount}/${totalGuests})`;

  const pctAttending = Math.round((attendingGuests / totalGuests) * 100);
  const pctDeclined = Math.round((declinedGuests / totalGuests) * 100);
  const pctPending = 100 - pctAttending - pctDeclined;

  $('#progAttendingText').textContent = `${attendingGuests} (${pctAttending}%)`;
  $('#progAttendingFill').style.width = `${pctAttending}%`;

  $('#progDeclinedText').textContent = `${declinedGuests} (${pctDeclined}%)`;
  $('#progDeclinedFill').style.width = `${pctDeclined}%`;

  $('#progPendingText').textContent = `${pendingGuests} (${pctPending}%)`;
  $('#progPendingFill').style.width = `${pctPending}%`;

  // Phân bổ Nhà trai vs Nhà gái (Toàn bộ)
  const totalGroom = groomGuests + groomFamilyCount;
  const totalBride = brideGuests + brideFamilyCount;
  const sumBoth = (totalGroom + totalBride) || 1;
  const pctGroom = Math.round((totalGroom / sumBoth) * 100);
  const pctBride = 100 - pctGroom;

  $('#sideRatioBadge').textContent = `${pctGroom}% Nhà trai / ${pctBride}% Nhà gái`;
  $('#progGroomTotalText').textContent = `${totalGroom} người (${pctGroom}%)`;
  $('#progGroomFill').style.width = `${pctGroom}%`;
  $('#progBrideTotalText').textContent = `${totalBride} người (${pctBride}%)`;
  $('#progBrideFill').style.width = `${pctBride}%`;
}

// =========================================================================
// 3. TAB 1: KHÁCH MỜI CÁ NHÂN (/api/v1/guests)
// =========================================================================
function renderGuestsTable() {
  const tbody = $('#guestsTableBody');
  if (!tbody) return;

  const searchKeyword = ($('#searchGuests')?.value || '').toLowerCase().trim();
  const sideFilter = $('#filterGuestSide')?.value || 'all';
  const rsvpFilter = $('#filterGuestRsvp')?.value || 'all';
  const activeFilter = $('#filterGuestActive')?.value || 'all';

  const filtered = state.guests.filter(g => {
    if (searchKeyword) {
      const matchName = (g.fullName || '').toLowerCase().includes(searchKeyword);
      const matchCode = (g.inviteCode || '').toLowerCase().includes(searchKeyword);
      const matchMessage = (g.message || '').toLowerCase().includes(searchKeyword);
      if (!matchName && !matchCode && !matchMessage) return false;
    }
    if (sideFilter !== 'all' && g.guestSide !== sideFilter) return false;
    if (rsvpFilter === 'attending' && g.rsvpStatus !== 'attending' && g.rsvpStatus !== 'ATTENDING') return false;
    if (rsvpFilter === 'declined' && g.rsvpStatus !== 'declined' && g.rsvpStatus !== 'DECLINED') return false;
    if (rsvpFilter === 'pending' && Boolean(g.rsvpStatus)) return false;
    if (activeFilter === 'true' && g.isActive === false) return false;
    if (activeFilter === 'false' && g.isActive !== false) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9">
          <div class="empty-state">
            <div class="empty-state__icon">✉️</div>
            <p>Không có khách mời nào phù hợp với bộ lọc hiện tại.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(g => {
    const rolePath = g.guestSide === 'bride' ? 'co-dau' : 'chu-re';
    const inviteUrl = `${window.location.origin}/${rolePath}/invite/${encodeURIComponent(g.inviteCode || g.id)}`;

    let rsvpBadge = '<span class="badge badge-neutral">Chưa phản hồi (null)</span>';
    if (g.rsvpStatus === 'attending' || g.rsvpStatus === 'ATTENDING') {
      rsvpBadge = '<span class="badge badge-attending">✓ Tham dự</span>';
    } else if (g.rsvpStatus === 'declined' || g.rsvpStatus === 'DECLINED') {
      rsvpBadge = '<span class="badge badge-declined">✕ Báo bận</span>';
    }

    const sideBadge = g.guestSide === 'bride'
      ? '<span class="badge badge-bride">👰 Nhà gái</span>'
      : '<span class="badge badge-groom">👔 Nhà trai</span>';

    const activeBadge = g.isActive !== false
      ? '<span class="badge badge-active">Active</span>'
      : '<span class="badge badge-inactive">Inactive</span>';

    const respondedDate = g.respondedAt ? new Date(g.respondedAt).toLocaleString('vi-VN') : '—';

    return `
      <tr>
        <td><b>#${g.id}</b></td>
        <td>
          <strong>${g.fullName || '—'}</strong>
          ${g.message ? `<div style="font-size:11px; color:#64748b; margin-top:2px;">💬 ${g.message}</div>` : ''}
        </td>
        <td><code>${g.inviteCode || '—'}</code></td>
        <td>${sideBadge}</td>
        <td>${rsvpBadge}</td>
        <td>${activeBadge}</td>
        <td><small style="color:#64748b;">${respondedDate}</small></td>
        <td>
          <a href="${inviteUrl}" target="_blank" class="link-btn">Xem thiệp ↗</a>
          <button class="copy-btn" onclick="copyLink('${inviteUrl}')" title="Sao chép link">Copy</button>
        </td>
        <td>
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-icon" onclick="openEditGuestModal(${g.id})" title="Sửa thông tin (PUT /guests/{id})">✏️</button>
            <button class="btn-icon" style="color:#dc2626;" onclick="deleteGuest(${g.id})" title="Xóa (DELETE /guests/{id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Mở Modal Sửa Khách Mời (GET & PUT /api/v1/guests/{id})
async function openEditGuestModal(id) {
  // Lấy chi tiết bằng GET /api/v1/guests/{id}
  const res = await apiRequest(`/api/v1/guests/${id}`);
  const guest = res?.data || state.guests.find(g => g.id === id);
  if (!guest) {
    alert('Không tìm thấy thông tin khách mời!');
    return;
  }

  $('#editGuestId').value = guest.id;
  $('#editGuestCode').value = guest.inviteCode || '';
  $('#editGuestFullName').value = guest.fullName || '';
  $('#editGuestSide').value = guest.guestSide || 'groom';
  if ($('#editGuestMessage')) $('#editGuestMessage').value = guest.message || '';
  $('#editGuestRsvp').value = guest.rsvpStatus || '';
  $('#editGuestIsActive').checked = guest.isActive !== false;

  openModal('modalEditGuest');
}

// Xóa Khách Mời (DELETE /api/v1/guests/{id})
async function deleteGuest(id) {
  if (!confirm(`Bạn có chắc chắn muốn xóa khách mời #${id}?`)) return;
  const res = await apiRequest(`/api/v1/guests/${id}`, { method: 'DELETE' });
  showToast('Đã xóa khách mời!');
  loadAllData();
}

// =========================================================================
// 4. TAB 2: NHÓM HỌ HÀNG & GIA ĐÌNH (/api/v1/family-groups)
// =========================================================================
function renderFamilyTable() {
  const tbody = $('#familyTableBody');
  if (!tbody) return;

  const searchKeyword = ($('#searchFamily')?.value || '').toLowerCase().trim();
  const sideFilter = $('#filterFamilySide')?.value || 'all';
  const activeFilter = $('#filterFamilyActive')?.value || 'all';
  const tableFilter = ($('#filterFamilyTable')?.value || '').toLowerCase().trim();

  const filtered = state.familyGroups.filter(f => {
    if (searchKeyword) {
      const matchName = (f.groupName || '').toLowerCase().includes(searchKeyword);
      const matchRel = (f.relationship || '').toLowerCase().includes(searchKeyword);
      const matchTable = (f.tableNumber || '').toLowerCase().includes(searchKeyword);
      if (!matchName && !matchRel && !matchTable) return false;
    }
    if (tableFilter && !(f.tableNumber || '').toLowerCase().includes(tableFilter)) return false;
    if (sideFilter !== 'all' && f.guestSide !== sideFilter) return false;
    if (activeFilter === 'true' && f.isActive === false) return false;
    if (activeFilter === 'false' && f.isActive !== false) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10">
          <div class="empty-state">
            <div class="empty-state__icon">👨‍👩‍👧‍👦</div>
            <p>Chưa có nhóm gia đình nào phù hợp với bộ lọc.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(f => {
    const rolePath = f.guestSide === 'bride' ? 'co-dau' : 'chu-re';
    const familyUrl = `${window.location.origin}/${rolePath}/${f.id}`;

    const sideBadge = f.guestSide === 'bride'
      ? '<span class="badge badge-bride">👰 Nhà gái</span>'
      : '<span class="badge badge-groom">👔 Nhà trai</span>';

    const activeBadge = f.isActive !== false
      ? '<span class="badge badge-active">Active</span>'
      : '<span class="badge badge-inactive">Inactive</span>';

    return `
      <tr>
        <td><b>#${f.id}</b></td>
        <td><strong>${f.groupName || '—'}</strong></td>
        <td>${sideBadge}</td>
        <td>${f.relationship || '—'}</td>
        <td><b>${f.expectedGuestCount || 0}</b> người</td>
        <td>${f.tableNumber ? `<span class="badge badge-neutral">${f.tableNumber}</span>` : '—'}</td>
        <td>${activeBadge}</td>
        <td><small style="color:#64748b;">${f.note || '—'}</small></td>
        <td>
          <a href="${familyUrl}" target="_blank" class="link-btn">Xem thiệp ↗</a>
          <button class="copy-btn" onclick="copyLink('${familyUrl}')" title="Sao chép link">Copy</button>
        </td>
        <td>
          <div class="action-btns" style="justify-content: flex-end;">
            <button class="btn-icon" onclick="openEditFamilyModal(${f.id})" title="Sửa nhóm (PUT /family-groups/{id})">✏️</button>
            <button class="btn-icon" style="color:#dc2626;" onclick="deleteFamilyGroup(${f.id})" title="Xóa (DELETE /family-groups/{id})">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Mở Modal Sửa Nhóm Gia Đình (GET & PUT /api/v1/family-groups/{id})
async function openEditFamilyModal(id) {
  const res = await apiRequest(`/api/v1/family-groups/${id}`);
  const family = res?.data || state.familyGroups.find(f => f.id === id);
  if (!family) {
    alert('Không tìm thấy thông tin nhóm gia đình!');
    return;
  }

  $('#editFamilyId').value = family.id;
  $('#editFamilyName').value = family.groupName || '';
  $('#editFamilySide').value = family.guestSide || 'groom';
  $('#editFamilyRel').value = family.relationship || '';
  $('#editFamilyCount').value = family.expectedGuestCount || 2;
  $('#editFamilyTable').value = family.tableNumber || '';
  $('#editFamilyNote').value = family.note || '';
  $('#editFamilyIsActive').checked = family.isActive !== false;

  openModal('modalEditFamily');
}

// Xóa Nhóm Gia Đình (DELETE /api/v1/family-groups/{id})
async function deleteFamilyGroup(id) {
  if (!confirm(`Bạn có chắc chắn muốn xóa nhóm gia đình #${id}?`)) return;
  const res = await apiRequest(`/api/v1/family-groups/${id}`, { method: 'DELETE' });
  showToast('Đã xóa nhóm gia đình!');
  loadAllData();
}

// =========================================================================
// 5. TAB 3: SỔ LƯU BÚT (/api/v1/guestbook)
// =========================================================================
function renderGuestbookTable() {
  const tbody = $('#guestbookTableBody');
  if (!tbody) return;

  const statusFilter = $('#filterGuestbookStatus')?.value || 'all';

  const filtered = state.guestbook.filter(m => {
    if (statusFilter !== 'all' && m.moderationStatus !== statusFilter) return false;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <div class="empty-state__icon">💌</div>
            <p>Không có lời chúc nào trong danh sách.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    let statusBadge = '<span class="badge badge-pending">⏳ Chờ duyệt</span>';
    if (m.moderationStatus === 'APPROVED') statusBadge = '<span class="badge badge-approved">✓ Đã duyệt</span>';
    if (m.moderationStatus === 'REJECTED') statusBadge = '<span class="badge badge-rejected">✕ Từ chối</span>';

    const dateStr = m.createdAt ? new Date(m.createdAt).toLocaleString('vi-VN') : '—';

    return `
      <tr>
        <td><b>#${m.id}</b></td>
        <td><strong>${m.displayName || m.invitedGuestName || 'Ẩn danh'}</strong></td>
        <td><code>${m.inviteCode || '—'}</code></td>
        <td style="max-width: 380px; word-break: break-word;">${m.message || ''}</td>
        <td>${statusBadge}</td>
        <td><small style="color:#64748b;">${dateStr}</small></td>
        <td>
          <div class="action-btns" style="justify-content: flex-end;">
            ${m.moderationStatus !== 'APPROVED' ? `
              <button class="btn btn-success btn-sm" onclick="moderateGuestbook(${m.id}, 'APPROVED')" title="Duyệt (PATCH /guestbook/{id}/moderation)">
                ✓ Duyệt
              </button>
            ` : ''}
            ${m.moderationStatus !== 'REJECTED' ? `
              <button class="btn btn-danger btn-sm" onclick="moderateGuestbook(${m.id}, 'REJECTED')" title="Từ chối (PATCH /guestbook/{id}/moderation)">
                ✕ Từ chối
              </button>
            ` : ''}
            <button class="btn-icon" style="color:#dc2626;" onclick="deleteGuestbookMessage(${m.id})" title="Xóa (DELETE /guestbook/{id})">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Duyệt hoặc Từ chối Lời chúc (PATCH /api/v1/guestbook/{id}/moderation)
async function moderateGuestbook(id, status) {
  const res = await apiRequest(`/api/v1/guestbook/${id}/moderation`, {
    method: 'PATCH',
    body: JSON.stringify({ moderationStatus: status })
  });
  showToast(`Đã ${status === 'APPROVED' ? 'duyệt' : 'từ chối'} lời chúc #${id}`);
  loadAllData();
}

// Xóa Lời chúc (DELETE /api/v1/guestbook/{id})
async function deleteGuestbookMessage(id) {
  if (!confirm(`Bạn có chắc chắn muốn xóa lời chúc #${id}?`)) return;
  const res = await apiRequest(`/api/v1/guestbook/${id}`, { method: 'DELETE' });
  showToast('Đã xóa lời chúc!');
  loadAllData();
}

// =========================================================================
// 6. TAB 4: BÀN TIỆC & XẾP CHỖ (SEATING SUMMARY)
// =========================================================================
function renderTablesSummary() {
  const tbody = $('#tablesSummaryBody');
  if (!tbody) return;

  const tableMap = {};

  state.familyGroups.forEach(f => {
    const tableKey = f.tableNumber ? f.tableNumber.trim() : 'Chưa xếp bàn';
    if (!tableMap[tableKey]) {
      tableMap[tableKey] = {
        groups: [],
        totalGuests: 0,
        sides: new Set()
      };
    }
    tableMap[tableKey].groups.push(f);
    tableMap[tableKey].totalGuests += (Number(f.expectedGuestCount) || 0);
    tableMap[tableKey].sides.add(f.guestSide === 'bride' ? '👰 Nhà gái' : '👔 Nhà trai');
  });

  const keys = Object.keys(tableMap).sort();
  if (keys.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">
          <div class="empty-state">
            <div class="empty-state__icon">🍽️</div>
            <p>Chưa có dữ liệu bàn tiệc nào từ nhóm họ hàng.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = keys.map(table => {
    const item = tableMap[table];
    const groupNames = item.groups.map(g => `<b>${g.groupName}</b> (${g.expectedGuestCount || 0} người)`).join(', ');
    const sidesText = [...item.sides].join(' · ');

    return `
      <tr>
        <td><strong>${table}</strong></td>
        <td>${groupNames}</td>
        <td>${sidesText}</td>
        <td><b style="color:var(--primary);">${item.totalGuests}</b> khách</td>
      </tr>
    `;
  }).join('');
}

// =========================================================================
// 7. TAB SWITCHING
// =========================================================================
$$('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.tab-btn').forEach(b => b.classList.remove('active'));
    $$('.tab-pane').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetId = btn.getAttribute('data-tab');
    const targetPane = $(`#${targetId}`);
    if (targetPane) targetPane.classList.add('active');
  });
});

// Filters & Search
$('#searchGuests')?.addEventListener('input', renderGuestsTable);
$('#filterGuestSide')?.addEventListener('change', renderGuestsTable);
$('#filterGuestRsvp')?.addEventListener('change', renderGuestsTable);
$('#filterGuestActive')?.addEventListener('change', renderGuestsTable);

$('#searchFamily')?.addEventListener('input', renderFamilyTable);
$('#filterFamilySide')?.addEventListener('change', renderFamilyTable);
$('#filterFamilyActive')?.addEventListener('change', renderFamilyTable);
$('#filterFamilyTable')?.addEventListener('input', renderFamilyTable);

$('#filterGuestbookStatus')?.addEventListener('change', renderGuestbookTable);

$('#btnRefresh')?.addEventListener('click', loadAllData);

// =========================================================================
// 8. MODAL HANDLERS
// =========================================================================
function openModal(id) {
  const modal = $(`#${id}`);
  if (modal) modal.classList.add('show');
}

function closeModal(id) {
  const modal = $(`#${id}`);
  if (modal) modal.classList.remove('show');
}

$('#btnOpenAddGuestModal')?.addEventListener('click', () => openModal('modalAddGuest'));
$('#btnOpenAddFamilyModal')?.addEventListener('click', () => openModal('modalAddFamily'));
$('#btnOpenAddWishModal')?.addEventListener('click', () => openModal('modalAddWish'));

$$('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-close');
    closeModal(modalId);
  });
});

$$('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });
});

// =========================================================================
// 9. FORM SUBMIT HANDLERS (POST & PUT APIs)
// =========================================================================

// POST /api/v1/guests (Tạo khách mời mới)
$('#formAddGuest')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const payload = {
    fullName: formData.get('fullName').trim(),
    guestSide: formData.get('guestSide'),
    message: formData.get('message') ? formData.get('message').trim() : ''
  };

  const btn = $('#btnSubmitAddGuest');
  btn.disabled = true;
  btn.textContent = 'Đang lưu...';

  const res = await apiRequest('/api/v1/guests', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  btn.disabled = false;
  btn.textContent = 'Tạo khách mời';

  if (res && res.success !== false) {
    showToast('Tạo khách mời thành công!');
    closeModal('modalAddGuest');
    e.currentTarget.reset();
    loadAllData();
  } else {
    alert(res?.message || 'Lỗi khi tạo khách mời.');
  }
});

// PUT /api/v1/guests/{id} (Cập nhật thông tin khách mời)
$('#formEditGuest')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const id = formData.get('id');
  const payload = {
    fullName: formData.get('fullName').trim(),
    guestSide: formData.get('guestSide'),
    message: formData.get('message') ? formData.get('message').trim() : '',
    rsvpStatus: formData.get('rsvpStatus') || null,
    isActive: formData.get('isActive') === 'on'
  };

  const btn = $('#btnSubmitEditGuest');
  btn.disabled = true;
  btn.textContent = 'Đang lưu...';

  const res = await apiRequest(`/api/v1/guests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  btn.disabled = false;
  btn.textContent = 'Lưu thay đổi';

  if (res && res.success !== false) {
    showToast('Cập nhật khách mời thành công!');
    closeModal('modalEditGuest');
    loadAllData();
  } else {
    alert(res?.message || 'Lỗi khi cập nhật khách mời.');
  }
});

// POST /api/v1/family-groups (Tạo nhóm gia đình mới)
$('#formAddFamily')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const payload = {
    groupName: formData.get('groupName').trim(),
    guestSide: formData.get('guestSide'),
    relationship: formData.get('relationship')?.trim() || null,
    expectedGuestCount: Number(formData.get('expectedGuestCount')) || 2,
    tableNumber: formData.get('tableNumber')?.trim() || null,
    note: formData.get('note')?.trim() || null
  };

  const btn = $('#btnSubmitAddFamily');
  btn.disabled = true;
  btn.textContent = 'Đang lưu...';

  const res = await apiRequest('/api/v1/family-groups', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  btn.disabled = false;
  btn.textContent = 'Tạo nhóm gia đình';

  if (res && res.success !== false) {
    showToast('Tạo nhóm gia đình thành công!');
    closeModal('modalAddFamily');
    e.currentTarget.reset();
    loadAllData();
  } else {
    alert(res?.message || 'Lỗi khi tạo nhóm gia đình.');
  }
});

// PUT /api/v1/family-groups/{id} (Cập nhật nhóm gia đình)
$('#formEditFamily')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const id = formData.get('id');
  const payload = {
    groupName: formData.get('groupName').trim(),
    guestSide: formData.get('guestSide'),
    relationship: formData.get('relationship')?.trim() || null,
    expectedGuestCount: Number(formData.get('expectedGuestCount')) || 2,
    tableNumber: formData.get('tableNumber')?.trim() || null,
    note: formData.get('note')?.trim() || null,
    isActive: formData.get('isActive') === 'on'
  };

  const btn = $('#btnSubmitEditFamily');
  btn.disabled = true;
  btn.textContent = 'Đang lưu...';

  const res = await apiRequest(`/api/v1/family-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });

  btn.disabled = false;
  btn.textContent = 'Lưu thay đổi';

  if (res && res.success !== false) {
    showToast('Cập nhật nhóm gia đình thành công!');
    closeModal('modalEditFamily');
    loadAllData();
  } else {
    alert(res?.message || 'Lỗi khi cập nhật nhóm gia đình.');
  }
});

// POST /api/v1/guestbook (Gửi lời chúc mừng mới)
$('#formAddWish')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const payload = {
    displayName: formData.get('displayName').trim(),
    inviteCode: formData.get('inviteCode')?.trim() || null,
    message: formData.get('message').trim()
  };

  const btn = $('#btnSubmitAddWish');
  btn.disabled = true;
  btn.textContent = 'Đang gửi...';

  const res = await apiRequest('/api/v1/guestbook', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  btn.disabled = false;
  btn.textContent = 'Gửi lời chúc';

  if (res && res.success !== false) {
    showToast('Đã gửi lời chúc mới!');
    closeModal('modalAddWish');
    e.currentTarget.reset();
    loadAllData();
  } else {
    alert(res?.message || 'Lỗi khi gửi lời chúc.');
  }
});

// =========================================================================
// 10. EXCEL TEMPLATE DOWNLOAD & EXCEL IMPORT HANDLERS
// =========================================================================

// Mở Import Modals
$('#btnOpenImportGuestModal')?.addEventListener('click', () => {
  $('#formImportGuest')?.reset();
  const nameEl = $('#guestSelectedFileName');
  const resEl = $('#guestImportResult');
  if (nameEl) nameEl.style.display = 'none';
  if (resEl) resEl.style.display = 'none';
  openModal('modalImportGuest');
});

$('#btnOpenImportFamilyModal')?.addEventListener('click', () => {
  $('#formImportFamily')?.reset();
  const nameEl = $('#familySelectedFileName');
  const resEl = $('#familyImportResult');
  if (nameEl) nameEl.style.display = 'none';
  if (resEl) resEl.style.display = 'none';
  openModal('modalImportFamily');
});

// Khi chọn file Excel
$('#fileGuestInput')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const nameEl = $('#guestSelectedFileName');
  if (file && nameEl) {
    nameEl.textContent = `📄 Đã chọn: ${file.name} (${Math.round(file.size / 1024)} KB)`;
    nameEl.style.display = 'block';
  }
});

$('#fileFamilyInput')?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const nameEl = $('#familySelectedFileName');
  if (file && nameEl) {
    nameEl.textContent = `📑 Đã chọn: ${file.name} (${Math.round(file.size / 1024)} KB)`;
    nameEl.style.display = 'block';
  }
});

// Submit Import Khách Mời (POST /api/v1/guests/import)
$('#formImportGuest')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = $('#fileGuestInput')?.files[0];
  if (!file) {
    alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)!');
    return;
  }

  const btn = $('#btnSubmitImportGuest');
  const resultCard = $('#guestImportResult');
  btn.disabled = true;
  btn.textContent = 'Đang import...';
  resultCard.style.display = 'none';

  const formData = new FormData();
  formData.append('file', file);

  try {
    let res = null;
    const urls = ['/api/backend/api/v1/guests/import', 'http://localhost:8088/api/v1/guests/import'];
    for (const url of urls) {
      try {
        const resp = await fetch(url, { method: 'POST', body: formData });
        res = await resp.json();
        if (resp.ok) break;
      } catch (_) {}
    }

    const data = res?.data;
    if (res && res.success !== false && data) {
      resultCard.className = data.failedCount > 0 ? 'import-result-card warning' : 'import-result-card success';
      resultCard.innerHTML = `
        <strong>${res.message || 'Import hoàn tất!'}</strong>
        <div style="margin-top:6px;">
          <span>Tổng số dòng: <b>${data.totalRows || 0}</b></span> · 
          <span style="color:#16a34a;">Thành công: <b>${data.successCount || 0}</b></span> · 
          <span style="color:#dc2626;">Thất bại: <b>${data.failedCount || 0}</b></span>
        </div>
        ${data.errors && data.errors.length > 0 ? `
          <ul class="import-error-list">
            ${data.errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
        ` : ''}
      `;
      resultCard.style.display = 'block';
      showToast(`Import xong: ${data.successCount} thành công!`);
      loadAllData();
    } else {
      resultCard.className = 'import-result-card danger';
      resultCard.textContent = res?.message || 'Có lỗi xảy ra khi import file Excel.';
      resultCard.style.display = 'block';
    }
  } catch (err) {
    resultCard.className = 'import-result-card danger';
    resultCard.textContent = 'Lỗi kết nối máy chủ: ' + err.message;
    resultCard.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Tiến hành Import';
  }
});

// Submit Import Nhóm Họ Hàng (POST /api/v1/family-groups/import)
$('#formImportFamily')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const file = $('#fileFamilyInput')?.files[0];
  if (!file) {
    alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)!');
    return;
  }

  const btn = $('#btnSubmitImportFamily');
  const resultCard = $('#familyImportResult');
  btn.disabled = true;
  btn.textContent = 'Đang import...';
  resultCard.style.display = 'none';

  const formData = new FormData();
  formData.append('file', file);

  try {
    let res = null;
    const urls = ['/api/backend/api/v1/family-groups/import', 'http://localhost:8088/api/v1/family-groups/import'];
    for (const url of urls) {
      try {
        const resp = await fetch(url, { method: 'POST', body: formData });
        res = await resp.json();
        if (resp.ok) break;
      } catch (_) {}
    }

    const data = res?.data;
    if (res && res.success !== false && data) {
      resultCard.className = data.failedCount > 0 ? 'import-result-card warning' : 'import-result-card success';
      resultCard.innerHTML = `
        <strong>${res.message || 'Import hoàn tất!'}</strong>
        <div style="margin-top:6px;">
          <span>Tổng số dòng: <b>${data.totalRows || 0}</b></span> · 
          <span style="color:#16a34a;">Thành công: <b>${data.successCount || 0}</b></span> · 
          <span style="color:#dc2626;">Thất bại: <b>${data.failedCount || 0}</b></span>
        </div>
        ${data.errors && data.errors.length > 0 ? `
          <ul class="import-error-list">
            ${data.errors.map(err => `<li>${err}</li>`).join('')}
          </ul>
        ` : ''}
      `;
      resultCard.style.display = 'block';
      showToast(`Import xong: ${data.successCount} thành công!`);
      loadAllData();
    } else {
      resultCard.className = 'import-result-card danger';
      resultCard.textContent = res?.message || 'Có lỗi xảy ra khi import file Excel.';
      resultCard.style.display = 'block';
    }
  } catch (err) {
    resultCard.className = 'import-result-card danger';
    resultCard.textContent = 'Lỗi kết nối máy chủ: ' + err.message;
    resultCard.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Tiến hành Import';
  }
});

// =========================================================================
// 10.5. EXCEL EXPORT HANDLERS (/export, /export-all)
// =========================================================================

async function triggerExcelDownload(endpoint, params = {}, defaultFilename = 'export.xlsx') {
  try {
    showToast('Đang tạo và tải file Excel...');

    // Gửi domain hiện tại để backend tự động gắn hyperlink thiệp mời chính xác
    if (!params.domain) {
      params.domain = window.location.origin;
    }

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        searchParams.append(key, value);
      }
    }
    const queryString = searchParams.toString();
    const finalPath = queryString ? `${endpoint}?${queryString}` : endpoint;

    const urls = [
      `/api/backend${finalPath}`,
      finalPath,
      `http://localhost:8088${finalPath}`
    ];

    let response = null;
    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          response = res;
          break;
        }
      } catch (_) {}
    }

    if (!response) {
      // Fallback: Tự động kích hoạt tải trực tiếp qua thẻ <a>
      const directUrl = `/api/backend${finalPath}`;
      const a = document.createElement('a');
      a.href = directUrl;
      a.download = defaultFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast(`Đang tải file: ${defaultFilename}`);
      return;
    }

    const blob = await response.blob();
    let filename = defaultFilename;
    const disposition = response.headers.get('content-disposition');
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim();
      }
    }

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);

    showToast(`✓ Đã xuất file thành công: ${filename}`);
  } catch (err) {
    console.error('Export error:', err);
    showToast('Lỗi khi xuất Excel: ' + (err.message || 'Không thể tải file'));
  }
}

// 1. Xuất danh sách khách mời cá nhân (/api/v1/guests/export)
$('#btnExportGuests')?.addEventListener('click', () => {
  const side = $('#filterGuestSide')?.value;
  const rsvp = $('#filterGuestRsvp')?.value;
  const active = $('#filterGuestActive')?.value;

  const params = {
    domain: window.location.origin,
    guestSide: (side && side !== 'all') ? side : undefined,
    rsvpStatus: (rsvp && rsvp !== 'all') ? rsvp : undefined,
    isActive: (active && active !== 'all') ? (active === 'true') : undefined
  };

  triggerExcelDownload('/api/v1/guests/export', params, 'danh_sach_khach_moi.xlsx');
});

// 2. Xuất danh sách nhóm họ hàng / gia đình (/api/v1/family-groups/export)
$('#btnExportFamily')?.addEventListener('click', () => {
  const side = $('#filterFamilySide')?.value;
  const table = $('#filterFamilyTable')?.value?.trim();
  const active = $('#filterFamilyActive')?.value;

  const params = {
    domain: window.location.origin,
    guestSide: (side && side !== 'all') ? side : undefined,
    tableNumber: table || undefined,
    isActive: (active && active !== 'all') ? (active === 'true') : undefined
  };

  triggerExcelDownload('/api/v1/family-groups/export', params, 'danh_sach_nhom_gia_dinh.xlsx');
});

// 3. Xuất toàn bộ cả 2 danh sách trong 1 file Excel (2 sheet riêng biệt) (/api/v1/guests/export-all)
$('#btnExportAllHeader')?.addEventListener('click', () => {
  const params = {
    domain: window.location.origin
  };

  triggerExcelDownload('/api/v1/guests/export-all', params, 'danh_sach_khach_moi_va_gia_dinh.xlsx');
});

// =========================================================================
// 11. DANH XƯNG CHUNG RENDER (TAB 5)
// =========================================================================
const salutationItems = [
  { slug: 'em', title: 'Em', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'anh', title: 'Anh', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'chi', title: 'Chị', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'co', title: 'Cô', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'chu', title: 'Chú', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'bac', title: 'Bác', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'chau', title: 'Cháu', pronoun: 'hai gia đình chúng tôi', type: 'Cá nhân' },
  { slug: 'gia-dinh-em', title: 'Gia đình Em', pronoun: 'hai gia đình chúng tôi', type: 'Gia đình' },
  { slug: 'gia-dinh-anh', title: 'Gia đình Anh', pronoun: 'hai gia đình chúng tôi', type: 'Gia đình' },
  { slug: 'gia-dinh-chi', title: 'Gia đình Chị', pronoun: 'hai gia đình chúng tôi', type: 'Gia đình' },
  { slug: 'gia-dinh-co', title: 'Gia đình Cô', pronoun: 'hai gia đình chúng tôi', type: 'Gia đình' },
  { slug: 'gia-dinh-chu', title: 'Gia đình Chú', pronoun: 'hai gia đình chúng tôi', type: 'Gia đình' },
  { slug: 'gia-dinh-bac', title: 'Gia đình Bác', pronoun: 'hai gia đình chúng tôi', type: 'Gia đình' },
  { slug: 'family', title: 'Thiệp họ hàng (Ngô Hường Tạ Thành)', pronoun: 'gia đình chúng con', type: 'Gia đình' },
  { slug: 'cus?name=Tên+Khách', title: 'Tùy chỉnh tự do (Cus)', pronoun: 'hai gia đình chúng tôi', type: 'Tùy chỉnh' }
];

function renderSalutationsTable() {
  const tbody = $('#salutationsTableBody');
  if (!tbody) return;
  const origin = window.location.origin;

  tbody.innerHTML = salutationItems.map(item => {
    const groomUrl = `${origin}/chu-re/${item.slug}`;
    const brideUrl = `${origin}/co-dau/${item.slug}`;
    const greetingUrl = `${origin}/greeting/${item.slug}`;

    return `
      <tr>
        <td>
          <div style="font-weight:600; color:#1e293b;">${item.title}</div>
          <span class="badge ${item.type === 'Gia đình' ? 'badge-primary' : 'badge-neutral'}" style="font-size:10px; padding:2px 6px;">
            ${item.type}
          </span>
        </td>
        <td style="color:#64748b; font-size:13px;">
          Xưng hô: <b>${item.pronoun}</b>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <a href="${groomUrl}" target="_blank" class="invite-link" title="Mở thử thiệp nhà trai">
              /chu-re/${item.slug} ↗
            </a>
            <button class="btn btn-sm btn-outline" onclick="copyToClipboard('${groomUrl}', 'Đã copy link Nhà trai!')" title="Copy link">📋 Copy</button>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <a href="${brideUrl}" target="_blank" class="invite-link" style="color:#d946ef;" title="Mở thử thiệp nhà gái">
              /co-dau/${item.slug} ↗
            </a>
            <button class="btn btn-sm btn-outline" onclick="copyToClipboard('${brideUrl}', 'Đã copy link Nhà gái!')" title="Copy link">📋 Copy</button>
          </div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <a href="${greetingUrl}" target="_blank" class="invite-link" style="color:#0ea5e9;" title="Mở thử màn chào">
              /greeting/${item.slug} ↗
            </a>
            <button class="btn btn-sm btn-outline" onclick="copyToClipboard('${greetingUrl}', 'Đã copy link Màn chào!')" title="Copy link">📋 Copy</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Keyframe spin animation
const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleEl);

// Init load
loadAllData();
renderSalutationsTable();
