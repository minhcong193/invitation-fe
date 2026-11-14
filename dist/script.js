const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const opening = $('#opening');
const music = $('#music');
const soundToggle = $('#soundToggle');
const toast = $('#toast');

// 1. Danh sách cấu hình các danh xưng mời chung (Em, Anh, Chị, Cô, Chú, Bác, Cháu, Gia đình...)
const genericSalutations = {
  'em': {
    title: 'Em',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Em là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Em sẽ làm cho ngày vui của hai gia đình chúng tôi thêm trọn vẹn và ý nghĩa!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Em! Rất mong được đón tiếp Em trong ngày vui.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Em Nam'
  },
  'anh': {
    title: 'Anh',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Anh là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Anh là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Anh! Rất mong được đón tiếp Anh trong ngày vui.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Anh Tuấn'
  },
  'chi': {
    title: 'Chị',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Chị là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Chị là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Chị! Rất mong được đón tiếp Chị trong ngày vui.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Chị Lan'
  },
  'co': {
    title: 'Cô',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Cô là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày đặc biệt này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Cô là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Cô! Kính chúc Cô luôn dồi dào sức khỏe và bình an.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Cô Mai'
  },
  'chu': {
    title: 'Chú',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Chú là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày đặc biệt này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Chú là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Chú! Kính chúc Chú luôn dồi dào sức khỏe và vạn sự cát tường.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Chú Dũng'
  },
  'bac': {
    title: 'Bác',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Bác là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày đặc biệt này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Bác là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Bác! Kính chúc Bác luôn trường thọ, bình an và hạnh phúc.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Bác Thành'
  },
  'chau': {
    title: 'Cháu',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Cháu là niềm vui trọn vẹn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Cháu là niềm vui của hai gia đình chúng tôi trong ngày vui này!',
    thankMsg: 'Gia đình chúng tôi cảm ơn Cháu rất nhiều! Hẹn gặp Cháu trong ngày cưới nhé.',
    isFamily: false,
    defaultCount: 1,
    namePlaceholder: 'Ví dụ: Cháu Linh'
  },
  'gia-dinh-em': {
    title: 'Gia đình Em',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Gia đình Em là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Gia đình Em sẽ làm cho ngày vui của hai gia đình chúng tôi thêm trọn vẹn và ấm áp!',
    thankMsg: 'Gia đình chúng tôi xin cảm ơn Gia đình Em rất nhiều! Hẹn gặp cả gia đình trong ngày vui.',
    isFamily: true,
    defaultCount: 2,
    namePlaceholder: 'Ví dụ: Gia đình Em Nam'
  },
  'gia-dinh-anh': {
    title: 'Gia đình Anh',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Gia đình Anh là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Gia đình Anh là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin cảm ơn Gia đình Anh rất nhiều! Chúc gia đình luôn đầm ấm và hạnh phúc.',
    isFamily: true,
    defaultCount: 2,
    namePlaceholder: 'Ví dụ: Gia đình Anh Tuấn'
  },
  'gia-dinh-chi': {
    title: 'Gia đình Chị',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Gia đình Chị là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Gia đình Chị là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin cảm ơn Gia đình Chị rất nhiều! Chúc gia đình luôn đầm ấm và hạnh phúc.',
    isFamily: true,
    defaultCount: 2,
    namePlaceholder: 'Ví dụ: Gia đình Chị Lan'
  },
  'gia-dinh-co': {
    title: 'Gia đình Cô',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Gia đình Cô là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày đặc biệt này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Gia đình Cô là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Gia đình Cô! Kính chúc cả gia đình dồi dào sức khỏe và bình an.',
    isFamily: true,
    defaultCount: 3,
    namePlaceholder: 'Ví dụ: Gia đình Cô Mai'
  },
  'gia-dinh-chu': {
    title: 'Gia đình Chú',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Gia đình Chú là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày đặc biệt này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Gia đình Chú là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Gia đình Chú! Kính chúc cả gia đình dồi dào sức khỏe và vạn sự như ý.',
    isFamily: true,
    defaultCount: 3,
    namePlaceholder: 'Ví dụ: Gia đình Chú Dũng'
  },
  'gia-dinh-bac': {
    title: 'Gia đình Bác',
    eyebrow: 'Trân trọng kính mời',
    copy: 'tới chung vui trong ngày trọng đại của hai gia đình chúng tôi',
    invitationLead: 'Sự hiện diện của Gia đình Bác là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày đặc biệt này.',
    invitationHeading: 'Cùng chung vui với hai gia đình chúng tôi',
    rsvpSubtext: 'Sự hiện diện của Gia đình Bác là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!',
    thankMsg: 'Gia đình chúng tôi xin chân thành cảm ơn Gia đình Bác! Kính chúc cả gia đình dồi dào sức khỏe và vạn sự cát tường.',
    isFamily: true,
    defaultCount: 3,
    namePlaceholder: 'Ví dụ: Gia đình Bác Thành'
  }
};

function normalizeSalutationKey(key) {
  if (!key) return null;
  return key.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// 2. Phân tích đường dẫn:
// - /chu-re/invite/:inviteCode hoặc /co-dau/invite/:inviteCode -> Khách mời cá nhân (có form RSVP)
// - /chu-re/:salutation hoặc /co-dau/:salutation -> Danh xưng chung (Em, Anh, Chị, Cô, Chú, Bác, Cháu, Gia đình...)
// - /chu-re/:inviteCode hoặc /co-dau/:inviteCode -> Nhóm gia đình / họ hàng (hiển thị mời luôn, không có form)
// - /chu-re hoặc /co-dau -> Mặc định
const pathSegments = window.location.pathname.split('/').filter(Boolean);
const searchParams = new URLSearchParams(window.location.search);

let role = 'chu-re';
let isInviteMode = false;
let isCustomMode = false;
let isFamilyMode = false;
let inviteCode = null;
let salutationKey = null;
let familyCode = null;

if (pathSegments.length > 0) {
  const p0 = normalizeSalutationKey(pathSegments[0]);
  const p1 = pathSegments[1] ? normalizeSalutationKey(pathSegments[1]) : '';

  if (p0 === 'family' || p1 === 'family') {
    role = 'chu-re';
    isFamilyMode = true;
  } else if (p0 === 'co-dau') {
    role = 'co-dau';
    if (p1 === 'invite') {
      isInviteMode = true;
      inviteCode = pathSegments[2] || null;
    } else if (p1 === 'cus') {
      isCustomMode = true;
    } else if (p1) {
      if (genericSalutations[p1]) {
        salutationKey = p1;
      } else {
        familyCode = pathSegments[1];
      }
    }
  } else if (p0 === 'chu-re') {
    role = 'chu-re';
    if (p1 === 'invite') {
      isInviteMode = true;
      inviteCode = pathSegments[2] || null;
    } else if (p1 === 'cus') {
      isCustomMode = true;
    } else if (p1) {
      if (genericSalutations[p1]) {
        salutationKey = p1;
      } else {
        familyCode = pathSegments[1];
      }
    }
  } else if (p0 === 'invite') {
    isInviteMode = true;
    inviteCode = pathSegments[1] || null;
  } else if (p0 === 'cus') {
    role = 'chu-re';
    isCustomMode = true;
  } else if (genericSalutations[p0]) {
    // Truy cập trực tiếp đường dẫn ngắn ví dụ: /bac, /em, /gia-dinh-bac
    role = 'chu-re';
    salutationKey = p0;
  }
}

// Kiểm tra query parameter nếu không có trên path (?for=bac hoặc ?salutation=bac)
if (!salutationKey && !isInviteMode) {
  const qSalt = searchParams.get('for') || searchParams.get('salutation');
  if (qSalt) {
    const candidateKey = normalizeSalutationKey(qSalt);
    if (genericSalutations[candidateKey]) {
      salutationKey = candidateKey;
    }
  }
}

const salutationInfo = salutationKey ? genericSalutations[salutationKey] : null;

// Cấu hình thông tin theo vai trò:
const config = {
  'chu-re': {
    primaryName: 'Công Minh',
    secondaryName: 'Thu Hằng',
    fullTitle: 'Công Minh & Thu Hằng',
    dateDisplay: '28 · 11 · 2026',
    dateDot: '28.11.2026',
    weddingDate: new Date('2026-11-28T15:30:00+07:00'),
    activeParty: 'chu-re',
    inactiveParty: 'co-dau',
    defaultSide: 'Chú rể',
    guestSideApi: 'groom'
  },
  'co-dau': {
    primaryName: 'Thu Hằng',
    secondaryName: 'Công Minh',
    fullTitle: 'Thu Hằng & Công Minh',
    dateDisplay: '29 · 11 · 2026',
    dateDot: '29.11.2026',
    weddingDate: new Date('2026-11-29T10:00:00+07:00'),
    activeParty: 'co-dau',
    inactiveParty: 'chu-re',
    defaultSide: 'Cô dâu',
    guestSideApi: 'bride'
  }
}[role];

// 2. Cập nhật tiêu đề, tên cặp đôi và ngày cưới theo đường dẫn
document.title = `${config.fullTitle} | Wedding Invitation`;

const openingTitle = $('#openingTitle');
if (openingTitle) {
  openingTitle.innerHTML = `<span>${config.primaryName}</span><i>&</i><span>${config.secondaryName}</span>`;
}

const openingDate = $('#openingDate');
if (openingDate) {
  openingDate.textContent = config.dateDisplay;
}

const heroTitle = $('#heroTitle');
if (heroTitle) {
  heroTitle.innerHTML = `${config.primaryName} <i>&</i> ${config.secondaryName}`;
}

const heroDate = $('#heroDate');
if (heroDate) {
  heroDate.textContent = config.dateDot;
}

const footerTitle = $('#footerTitle');
if (footerTitle) {
  footerTitle.innerHTML = `${config.primaryName} <i>&</i> ${config.secondaryName}`;
}

// 3. Hiển thị địa chỉ đám cưới phù hợp (chỉ hiện nhà trai khi /chu-re, chỉ hiện nhà gái khi /co-dau)
const activeCard = $(`[data-party="${config.activeParty}"]`);
const inactiveCard = $(`[data-party="${config.inactiveParty}"]`);
const eventGrid = $('#eventGrid');

if (activeCard) {
  activeCard.style.display = 'block';
  const no = $('.event-card__no', activeCard);
  if (no) no.textContent = '01';
}
if (inactiveCard) {
  inactiveCard.style.display = 'none';
}
if (eventGrid) {
  eventGrid.classList.add('event-grid--single');
}

// Khi là cô dâu (/co-dau), đảo thứ tự hiển thị của cô dâu lên trước chú rể
if (role === 'co-dau') {
  const coupleSection = $('#coupleSection');
  const bridePerson = $('#bridePerson');
  const groomPerson = $('#groomPerson');
  const coupleAnd = $('#coupleAnd');
  if (coupleSection && bridePerson && groomPerson && coupleAnd) {
    coupleSection.insertBefore(bridePerson, coupleAnd);
    coupleSection.appendChild(groomPerson);
  }

  const familyGrid = $('#familyGrid');
  const familyBride = $('#familyBride');
  const familyGroom = $('#familyGroom');
  if (familyGrid && familyBride && familyGroom) {
    familyGrid.insertBefore(familyBride, familyGroom);
  }
}

// Hàm format tên từ slug
function formatSlug(slug) {
  if (!slug) return '';
  try {
    const decoded = decodeURIComponent(slug).replace(/[-_]/g, ' ').trim();
    if (!decoded || !isNaN(Number(decoded))) return '';
    return decoded;
  } catch (_) {
    return '';
  }
}

// Lấy tên khách từ query param (?to= hoặc ?guest= hoặc ?name=)
let queryGuestName = searchParams.get('to') || searchParams.get('guest') || searchParams.get('name');
if (queryGuestName) {
  let displayGuestName = queryGuestName;
  if (salutationInfo) {
    if (salutationInfo.title.toLowerCase().startsWith('gia đình ') && queryGuestName.toLowerCase().startsWith('chị ') && salutationInfo.title.toLowerCase().includes('chị')) {
      displayGuestName = `Gia đình ${queryGuestName}`;
    } else if (queryGuestName.toLowerCase().startsWith(salutationInfo.title.toLowerCase())) {
      displayGuestName = queryGuestName;
    } else {
      displayGuestName = `${salutationInfo.title} ${queryGuestName}`;
    }
  }
  const guestEl = $('#guestName');
  if (guestEl) guestEl.textContent = displayGuestName.slice(0, 60);
}

// Tự động chọn đối tượng khách mời trong form RSVP mặc định
const sideSelect = $('select[name="side"]');
if (sideSelect) {
  sideSelect.value = config.defaultSide;
}

// 4. Cuộn mượt khi bấm nút mũi tên xuống
const scrollCue = $('.scroll-cue');
if (scrollCue) {
  scrollCue.addEventListener('click', (e) => {
    e.preventDefault();
    const storySection = $('#story');
    if (storySection) storySection.scrollIntoView({ behavior: 'smooth' });
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

async function startMusic() {
  if (!music) return;
  try {
    await music.play();
    soundToggle.classList.add('playing');
    soundToggle.setAttribute('aria-label', 'Tắt nhạc');
  } catch (_) {
    soundToggle.classList.remove('playing');
  }
}

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    if (!music) return;
    if (music.paused) startMusic();
    else {
      music.pause();
      soundToggle.classList.remove('playing');
      soundToggle.setAttribute('aria-label', 'Bật nhạc');
    }
  });
}

$('#openInvitation').addEventListener('click', () => {
  opening.classList.add('is-open');
  document.body.classList.remove('locked');
  startMusic();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
$$('.reveal').forEach((element) => observer.observe(element));

// 5. Đếm ngược tới ngày cưới (theo ngày cưới của từng bên)
function updateCountdown() {
  const diff = Math.max(0, config.weddingDate - new Date());
  const values = [
    Math.floor(diff / 86400000),
    Math.floor(diff / 3600000) % 24,
    Math.floor(diff / 60000) % 60,
    Math.floor(diff / 1000) % 60,
  ];
  $$('#countdown b').forEach((item, index) => {
    item.textContent = String(values[index]).padStart(2, '0');
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// 6. Lightbox xem ảnh
const lightbox = $('#lightbox');
if (lightbox) {
  $$('.gallery__item').forEach((button) => {
    button.addEventListener('click', () => {
      const img = $('img', button);
      const fullSrc = img ? (img.getAttribute('data-full') || img.src) : '';
      $('img', lightbox).src = fullSrc;
      lightbox.showModal();
    });
  });
  const closeBtn = $('button', lightbox);
  if (closeBtn) closeBtn.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}

// 7. Sổ lưu bút (Guest book) với hiệu ứng tự cuộn lặp vô tận (Infinite Marquee Auto-Scroll)
const wishForm = $('#wishForm');
const wishList = $('#wishList');
const wishMarqueeWrapper = $('#wishMarqueeWrapper');

// Xóa sạch cache localStorage cũ nếu từng lưu
try {
  localStorage.removeItem('minh-hang-wishes');
} catch (_) { }

let liveWishes = [];
let allWishesList = [];

let scrollPos = 0;
let isUserInteracting = false;
let resumeTimer = null;
let animFrameId = null;

function renderWishes() {
  if (!wishList) return;
  wishList.innerHTML = '';

  // Lọc trùng theo tên và nội dung
  const uniqueMap = new Map();
  liveWishes.forEach(item => {
    if (item && item.message) {
      const key = `${(item.name || '').trim()}-${item.message.trim()}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, item);
    }
  });
  allWishesList = Array.from(uniqueMap.values());

  if (allWishesList.length === 0) {
    const emptyNotice = document.createElement('div');
    emptyNotice.className = 'wish-empty';
    emptyNotice.style.cssText = 'text-align: center; color: rgba(255, 255, 255, 0.7); font-style: italic; padding: 24px 16px; font-size: 15px;';
    emptyNotice.textContent = 'Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc tới Công Minh & Thu Hằng nhé!';
    wishList.append(emptyNotice);
    return;
  }

  // Để tạo hiệu ứng cuộn lặp vô tận (infinite loop seamless scroll),
  // nhân bản danh sách ít nhất 2 đến 3 lần để chiều cao vượt trội khung nhìn
  let loopItems = [...allWishesList];
  while (loopItems.length < 8) {
    loopItems = [...loopItems, ...allWishesList];
  }
  // Nhân đôi để có 2 nửa hoàn toàn giống nhau
  const finalDisplayItems = [...loopItems, ...loopItems];

  finalDisplayItems.forEach(({ name, message }) => {
    const item = document.createElement('article');
    item.className = 'wish';
    const author = document.createElement('b');
    const copy = document.createElement('p');
    author.textContent = name || 'Khách quý';
    copy.textContent = message;
    item.append(author, copy);
    wishList.append(item);
  });

  // Đảm bảo auto-scroll luôn kích hoạt sau khi render danh sách lời chúc
  startAutoScroll();
}

// Hàm chạy cuộn tự động vòng lặp
function startAutoScroll() {
  if (animFrameId) cancelAnimationFrame(animFrameId);

  function stepScroll() {
    if (!isUserInteracting && wishMarqueeWrapper && wishList && allWishesList.length > 0) {
      const halfHeight = wishList.scrollHeight / 2;
      if (halfHeight > 0) {
        scrollPos += 0.6; // Tốc độ cuộn mượt mà (~36px/giây)
        if (scrollPos >= halfHeight) {
          scrollPos -= halfHeight; // Quay về vị trí đầu của chu kỳ liền mạch 100% không giật
        }
        wishMarqueeWrapper.scrollTop = scrollPos;
      }
    }
    // Luôn tiếp tục vòng lặp animation frame để tự động cuộn khi có dữ liệu
    animFrameId = requestAnimationFrame(stepScroll);
  }

  animFrameId = requestAnimationFrame(stepScroll);
}

// Tương tác chuột & cảm ứng để dừng khi người dùng muốn đọc
if (wishMarqueeWrapper) {
  // Rê chuột vào -> Tạm dừng
  wishMarqueeWrapper.addEventListener('mouseenter', () => {
    isUserInteracting = true;
  });

  // Rời chuột ra -> Tiếp tục cuộn sau 1 giây
  wishMarqueeWrapper.addEventListener('mouseleave', () => {
    scrollPos = wishMarqueeWrapper.scrollTop;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      startAutoScroll();
    }, 1000);
  });

  // Chạm trên điện thoại -> Tạm dừng
  wishMarqueeWrapper.addEventListener('touchstart', () => {
    isUserInteracting = true;
  }, { passive: true });

  // Thả tay ra trên điện thoại -> Tiếp tục cuộn sau 2 giây
  wishMarqueeWrapper.addEventListener('touchend', () => {
    scrollPos = wishMarqueeWrapper.scrollTop;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      startAutoScroll();
    }, 2000);
  }, { passive: true });

  // Cuộn bằng con lăn chuột -> Đồng bộ vị trí và tạm dừng
  wishMarqueeWrapper.addEventListener('wheel', () => {
    isUserInteracting = true;
    scrollPos = wishMarqueeWrapper.scrollTop;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      startAutoScroll();
    }, 2000);
  }, { passive: true });
}

// Tải toàn bộ lời chúc từ API backend ở TẤT CẢ các trạng thái (PENDING, APPROVED,...)
async function fetchBackendGuestbook() {
  const endpoints = [
    '/api/backend/api/v1/guestbook/admin?page=0&size=500',
    '/api/v1/guestbook/admin?page=0&size=500',
    '/api/backend/api/v1/guestbook?page=0&size=500',
    '/api/v1/guestbook?page=0&size=500'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        const apiList = json?.data?.content || json?.data || [];
        if (Array.isArray(apiList) && apiList.length > 0) {
          const fetchedWishes = apiList
            .filter(m => m && m.message && m.message.trim())
            .map(m => ({
              name: (m.displayName || m.invitedGuestName || 'Khách quý').trim(),
              message: m.message.trim()
            }));

          // Giữ lại các lời chúc vừa gửi trong phiên nếu backend chưa kịp cập nhật
          const merged = [...liveWishes];
          fetchedWishes.forEach(fw => {
            const exists = merged.some(w => w.name === fw.name && w.message === fw.message);
            if (!exists) merged.push(fw);
          });

          liveWishes = merged.length > 0 ? merged : fetchedWishes;
          renderWishes();
          return;
        }
      }
    } catch (_) { }
  }
}

fetchBackendGuestbook();
renderWishes();
startAutoScroll();

if (wishForm) {
  wishForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(wishForm);
    const authorName = (data.get('name') || '').trim();
    const wishMsg = (data.get('message') || '').trim();

    if (!authorName || !wishMsg) return;

    // Hiển thị ngay lời chúc mới vào danh sách đang chạy (hoàn toàn không lưu vào localStorage)
    liveWishes.unshift({ name: authorName, message: wishMsg });
    renderWishes();
    scrollPos = 0; // Đưa cuộn về vị trí đầu để thấy ngay lời chúc mới
    if (wishMarqueeWrapper) wishMarqueeWrapper.scrollTop = 0;

    wishForm.reset();
    showToast('Cảm ơn bạn đã gửi lời chúc tốt đẹp!');

    // Gửi sang backend API
    const postUrls = ['/api/backend/api/v1/guestbook', '/api/v1/guestbook'];
    for (const u of postUrls) {
      try {
        const res = await fetch(u, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ displayName: authorName, message: wishMsg })
        });
        if (res.ok) {
          // Sau khi gửi thành công, fetch lại từ backend sau 1s để đồng bộ danh sách
          setTimeout(fetchBackendGuestbook, 1000);
          break;
        }
      } catch (_) { }
    }
  });
}

// 8. Xử lý RSVP Form thông thường và danh xưng chung
const defaultRsvpForm = $('#rsvpForm');
if (defaultRsvpForm) {
  defaultRsvpForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    localStorage.setItem('minh-hang-rsvp', JSON.stringify({ ...data, submittedAt: new Date().toISOString() }));
    const thankNotice = salutationInfo ? salutationInfo.thankMsg : `Đã ghi nhận xác nhận của ${data.name}. Cảm ơn bạn!`;
    const rsvpStatusEl = $('#rsvpStatus');
    if (rsvpStatusEl) rsvpStatusEl.textContent = thankNotice;
    showToast('Đã lưu xác nhận tham dự!');

    if (data.message && data.message.trim()) {
      fetch('/api/backend/api/v1/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: data.name, message: data.message })
      }).catch(() => { });
    }
  });
}

// =========================================================================
// 9. XỬ LÝ KHÁCH MỜI CÁ NHÂN (/chu-re/invite/:inviteCode hoặc /co-dau/invite/:inviteCode)
// Màn này call API /api/v1/guests và VẪN CÓ FORM ĐỂ NHẬP THAM DỰ
// =========================================================================
const rsvpGuestBox = $('#rsvpGuestBox');
const rsvpGuestLoading = $('#rsvpGuestLoading');
const rsvpGuestForm = $('#rsvpGuestForm');
const rsvpGuestLocked = $('#rsvpGuestLocked');
const rsvpFamilyBox = $('#rsvpFamilyBox');

function showLockedState(name, statusVal) {
  if (rsvpGuestLoading) rsvpGuestLoading.style.display = 'none';
  if (rsvpGuestForm) rsvpGuestForm.style.display = 'none';
  if (rsvpGuestLocked) {
    rsvpGuestLocked.style.display = 'block';
    const nameEl = $('#rsvpLockedName');
    if (nameEl) nameEl.textContent = name || 'Quý khách';
    const statusTextEl = $('#rsvpCurrentStatusText');
    if (statusTextEl) statusTextEl.textContent = statusVal;

    const sub = $('#rsvpLockedSubtext');
    if (sub) {
      const lower = String(statusVal).toLowerCase();
      if (lower.includes('tham dự') || lower.includes('attend') || lower === 'true') {
        sub.textContent = 'Thank you for confirming! We look forward to celebrating our special day with you.';
      } else {
        sub.textContent = 'Thank you for your response! Even though you cannot attend, we truly appreciate your heartfelt blessings.';
      }
    }
  }
}

function showUpdateFormState(name) {
  if (rsvpGuestLoading) rsvpGuestLoading.style.display = 'none';
  if (rsvpGuestLocked) rsvpGuestLocked.style.display = 'none';
  if (rsvpGuestForm) {
    rsvpGuestForm.style.display = 'block';
    const nameEl = $('#rsvpGuestName');
    if (nameEl) nameEl.textContent = name || 'Quý khách';
  }
}

if (isInviteMode && inviteCode) {
  // Ẩn form mặc định và form gia đình, hiện hộp khách cá nhân
  if (defaultRsvpForm) defaultRsvpForm.style.display = 'none';
  if (rsvpFamilyBox) rsvpFamilyBox.style.display = 'none';
  if (rsvpGuestBox) {
    rsvpGuestBox.style.display = 'block';
    if (rsvpGuestLoading) rsvpGuestLoading.style.display = 'block';
  }

  // Tương tác checkbox độc quyền (mutual exclusivity)
  const chkAttend = $('#chkAttend');
  const chkBusy = $('#chkBusy');
  const lblAttend = $('#lblAttend');
  const lblBusy = $('#lblBusy');

  if (chkAttend && chkBusy) {
    chkAttend.addEventListener('change', () => {
      if (chkAttend.checked) {
        chkBusy.checked = false;
        if (lblBusy) lblBusy.classList.remove('is-selected');
        if (lblAttend) lblAttend.classList.add('is-selected');
      } else {
        if (lblAttend) lblAttend.classList.remove('is-selected');
      }
    });

    chkBusy.addEventListener('change', () => {
      if (chkBusy.checked) {
        chkAttend.checked = false;
        if (lblAttend) lblAttend.classList.remove('is-selected');
        if (lblBusy) lblBusy.classList.add('is-selected');
      } else {
        if (lblBusy) lblBusy.classList.remove('is-selected');
      }
    });
  }

  const preRenderedName = ($('#guestName')?.textContent || '').trim();
  let currentGuestName = queryGuestName || (preRenderedName && preRenderedName !== 'Quý khách' ? preRenderedName : '') || formatSlug(inviteCode);
  if (currentGuestName) {
    const guestEl = $('#guestName');
    if (guestEl) guestEl.textContent = currentGuestName.slice(0, 60);
  }

  // Gọi API /api/v1/guests/code/{inviteCode}
  (async function initIndividualGuest() {
    let fetchedData = null;
    const candidates = [
      `/api/v1/guests/code/${encodeURIComponent(inviteCode)}`,
      `http://localhost:8088/api/v1/guests/code/${encodeURIComponent(inviteCode)}`,
      `/api/backend/api/v1/guests/code/${encodeURIComponent(inviteCode)}`,
      `/api/v1/guests/invite/${encodeURIComponent(inviteCode)}`,
      `http://localhost:8088/api/v1/guests/invite/${encodeURIComponent(inviteCode)}`,
      `/api/backend/api/v1/guests/invite/${encodeURIComponent(inviteCode)}`
    ];

    if (!isNaN(Number(inviteCode))) {
      candidates.push(
        `/api/v1/guests/${encodeURIComponent(inviteCode)}`,
        `http://localhost:8088/api/v1/guests/${encodeURIComponent(inviteCode)}`,
        `/api/backend/api/v1/guests/${encodeURIComponent(inviteCode)}`
      );
    }

    for (const url of candidates) {
      try {
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          fetchedData = await res.json();
          break;
        }
      } catch (_) { }
    }

    const payload = fetchedData ? (fetchedData.data || fetchedData) : null;
    const resolvedName = payload
      ? (payload.fullName || payload.name || payload.ten || payload.guestName || payload.hoTen)
      : currentGuestName;

    let rawStatus = payload
      ? (payload.rsvpStatus !== undefined ? payload.rsvpStatus : (payload.status !== undefined ? payload.status : payload.trangThai))
      : null;

    let displayStatus = null;
    if (rawStatus && rawStatus !== 'pending' && rawStatus !== 'PENDING') {
      if (rawStatus === 'attending' || rawStatus === 'ATTENDING' || rawStatus === 'Tham dự') {
        displayStatus = 'Tham dự';
      } else if (rawStatus === 'declined' || rawStatus === 'DECLINED' || rawStatus === 'Tiếc quá mình bận mất rồi') {
        displayStatus = 'Tiếc quá mình bận mất rồi';
      } else {
        displayStatus = rawStatus;
      }
    }

    if (resolvedName) {
      currentGuestName = resolvedName;
      const guestEl = $('#guestName');
      if (guestEl) guestEl.textContent = resolvedName.slice(0, 60);
    }

    // Nếu status === null hoặc pending => Hiện form cho phép update (gồm 2 checkbox Tham dự hoặc Bận)
    // Nếu status !== null và khác pending => Hiện màn hình đã ghi nhận, khóa không cho update
    if (displayStatus === null || displayStatus === undefined || displayStatus === '') {
      showUpdateFormState(resolvedName);
    } else {
      showLockedState(resolvedName, displayStatus);
    }

    // Cập nhật mã VietQR quà mừng cưới với fullName + message từ API
    if (typeof updateWeddingGiftSection === 'function') {
      updateWeddingGiftSection(payload);
    }
  })();

  // Submit RSVP khi status === null hoặc pending
  if (rsvpGuestForm) {
    rsvpGuestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!chkAttend.checked && !chkBusy.checked) {
        alert('Vui lòng chọn "Tham dự" hoặc "Tiếc quá mình bận mất rồi"!');
        return;
      }

      const selectedStatus = chkAttend.checked ? 'Tham dự' : 'Tiếc quá mình bận mất rồi';
      const swaggerStatus = chkAttend.checked ? 'attending' : 'declined';
      const btn = $('#btnSubmitGuestRsvp');
      const actionStatus = $('#rsvpGuestActionStatus');

      btn.disabled = true;
      btn.textContent = 'Đang lưu xác nhận...';
      if (actionStatus) actionStatus.textContent = '';

      const submitCandidates = [
        {
          url: `/api/v1/guests/invite/${encodeURIComponent(inviteCode)}/rsvp`,
          method: 'POST',
          body: { rsvpStatus: swaggerStatus }
        },
        {
          url: `/api/v1/guests/code/${encodeURIComponent(inviteCode)}/rsvp`,
          method: 'POST',
          body: { rsvpStatus: swaggerStatus }
        },
        {
          url: `http://localhost:8088/api/v1/guests/invite/${encodeURIComponent(inviteCode)}/rsvp`,
          method: 'POST',
          body: { rsvpStatus: swaggerStatus }
        },
        {
          url: `/api/backend/api/v1/guests/invite/${encodeURIComponent(inviteCode)}/rsvp`,
          method: 'POST',
          body: { rsvpStatus: swaggerStatus }
        }
      ];

      for (const item of submitCandidates) {
        try {
          const res = await fetch(item.url, {
            method: item.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.body)
          });
          if (res.ok) break;
        } catch (_) { }
      }

      localStorage.setItem(`rsvp-${role}-${inviteCode}`, JSON.stringify({
        status: selectedStatus,
        submittedAt: new Date().toISOString()
      }));

      btn.disabled = false;
      btn.textContent = 'Gửi xác nhận';

      showToast('Xác nhận thành công!');
      showLockedState(currentGuestName, selectedStatus);
    });
  }
}

// =========================================================================
// 10. XỬ LÝ NHÓM HỌ HÀNG / GIA ĐÌNH QUA API (chỉ khi không phải danh xưng chung)
// Màn này call API /api/v1/family-groups và HIỂN THỊ MỜI LUÔN, KHÔNG CÓ FORM NỮA
// =========================================================================
if (!isInviteMode && !salutationInfo && familyCode) {
  // Ẩn toàn bộ form nhập liệu
  if (defaultRsvpForm) defaultRsvpForm.style.display = 'none';
  if (rsvpGuestBox) rsvpGuestBox.style.display = 'none';
  if (rsvpFamilyBox) rsvpFamilyBox.style.display = 'block';

  // Điều chỉnh tiêu đề phần RSVP phù hợp với họ hàng
  const rsvpHeading = $('#rsvpHeading');
  if (rsvpHeading) rsvpHeading.textContent = 'Kính mời gia đình & họ hàng';
  const rsvpLead = $('#rsvpLead');
  if (rsvpLead) rsvpLead.textContent = 'Sự hiện diện của gia đình là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!';

  let initialFamilyName = queryGuestName || formatSlug(familyCode);
  if (initialFamilyName && !initialFamilyName.toLowerCase().startsWith('gia đình')) {
    initialFamilyName = `Gia đình ${initialFamilyName}`;
  }
  if (!initialFamilyName) initialFamilyName = 'Quý gia đình';

  const guestEl = $('#guestName');
  if (guestEl) guestEl.textContent = initialFamilyName.slice(0, 60);

  const rsvpFamilyName = $('#rsvpFamilyName');
  if (rsvpFamilyName) rsvpFamilyName.textContent = initialFamilyName;

  // Gọi API /api/v1/family-groups
  (async function initFamilyGroup() {
    let groupData = null;

    // 1. Nếu familyCode là số ID: gọi trực tiếp /api/v1/family-groups/{id}
    if (!isNaN(Number(familyCode))) {
      const urls = [
        `http://localhost:8088/api/v1/family-groups/${encodeURIComponent(familyCode)}`,
        `/api/backend/api/v1/family-groups/${encodeURIComponent(familyCode)}`
      ];
      for (const url of urls) {
        try {
          const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (res.ok) {
            const data = await res.json();
            groupData = data.data || data;
            break;
          }
        } catch (_) { }
      }
    }

    // 2. Nếu chưa có hoặc familyCode là slug chuỗi: gọi danh sách nhóm
    if (!groupData) {
      const listUrls = [
        `http://localhost:8088/api/v1/family-groups?guestSide=${config.guestSideApi}&page=0&size=50`,
        `/api/backend/api/v1/family-groups?guestSide=${config.guestSideApi}&page=0&size=50`
      ];
      for (const url of listUrls) {
        try {
          const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (res.ok) {
            const json = await res.json();
            const list = json?.data?.content || json?.data || [];
            // Tìm theo ID hoặc theo tên gần giống
            const matched = list.find(item =>
              String(item.id) === String(familyCode) ||
              (item.groupName && item.groupName.toLowerCase().includes(familyCode.toLowerCase().replace(/[-_]/g, ' ')))
            );
            if (matched) {
              groupData = matched;
              break;
            }
          }
        } catch (_) { }
      }
    }

    // Hiển thị thông tin nhóm họ hàng lên giao diện
    if (groupData) {
      const name = groupData.groupName || initialFamilyName;
      if (guestEl) guestEl.textContent = name.slice(0, 60);
      if (rsvpFamilyName) rsvpFamilyName.textContent = name;

      // Mối quan hệ họ hàng
      const relEl = $('#rsvpFamilyRel');
      if (relEl) {
        if (groupData.relationship) {
          relEl.textContent = `(${groupData.relationship})`;
          relEl.style.display = 'block';
        }
      }

      // Chi tiết bàn tiệc và số lượng
      const detailsEl = $('#rsvpFamilyDetails');
      const chipTable = $('#chipTable');
      const chipCount = $('#chipCount');
      let hasDetails = false;

      if (groupData.tableNumber) {
        const tableEl = $('#rsvpFamilyTable');
        if (tableEl) tableEl.textContent = groupData.tableNumber;
        if (chipTable) chipTable.style.display = 'inline-block';
        hasDetails = true;
      }

      if (groupData.expectedGuestCount) {
        const countEl = $('#rsvpFamilyCount');
        if (countEl) countEl.textContent = `${groupData.expectedGuestCount} người`;
        if (chipCount) chipCount.style.display = 'inline-block';
        hasDetails = true;
      }

      if (detailsEl && hasDetails) {
        detailsEl.style.display = 'flex';
      }
    }
  })();
}

// =========================================================================
// 11. XỬ LÝ DANH XƯNG CHUNG (Em, Anh, Chị, Cô, Chú, Bác, Cháu, Gia đình...)
// =========================================================================
if (salutationInfo) {
  // Ẩn các hộp khách mời khác
  if (rsvpGuestBox) rsvpGuestBox.style.display = 'none';
  if (rsvpFamilyBox) rsvpFamilyBox.style.display = 'none';

  let effectiveName = salutationInfo.title;
  if (queryGuestName) {
    if (queryGuestName.toLowerCase().startsWith(salutationInfo.title.toLowerCase())) {
      effectiveName = queryGuestName;
    } else {
      effectiveName = `${salutationInfo.title} ${queryGuestName}`;
    }
  }

  // Cập nhật Màn hình mở thiệp
  const guestEl = $('#guestName');
  if (guestEl) guestEl.textContent = effectiveName;
  const openEyebrow = $('#openingEyebrow') || $('#opening .eyebrow');
  if (openEyebrow) openEyebrow.textContent = salutationInfo.eyebrow;
  const openCopy = $('#openingCopy') || $('#opening .opening__copy');
  if (openCopy) openCopy.textContent = salutationInfo.copy;

  // Cập nhật Thẻ Invitation Section
  const invEyebrow = $('#invitationEyebrow') || $('.invitation .eyebrow');
  if (invEyebrow) invEyebrow.textContent = salutationInfo.eyebrow;
  const invHeading = $('#invitationHeading') || $('.invitation .script');
  if (invHeading && salutationInfo.invitationHeading) {
    invHeading.innerHTML = `${salutationInfo.invitationHeading}`;
  }
  const invLead = $('#invitationLead') || $('.invitation .lead');
  if (invLead) invLead.textContent = salutationInfo.invitationLead;

  // Cập nhật Tiêu đề & Lời nhắn phần Thiệp mời (thay cho Form RSVP)
  const rsvpEyebrow = $('#rsvp .eyebrow');
  if (rsvpEyebrow) rsvpEyebrow.textContent = 'Invitation';
  const rsvpHeading = $('#rsvpHeading');
  if (rsvpHeading) rsvpHeading.textContent = 'Thiệp mời chung vui';
  const rsvpLead = $('#rsvpLead');
  if (rsvpLead) rsvpLead.textContent = 'Hai gia đình chúng tôi rất hân hạnh và trân trọng kính mời:';

  // Hiển thị Thẻ Danh xưng trang trọng
  const rsvpSalutationBox = $('#rsvpSalutationBox');
  if (rsvpSalutationBox) {
    rsvpSalutationBox.style.display = 'block';
    const saltEyebrow = $('#rsvpSalutationEyebrow');
    if (saltEyebrow) saltEyebrow.textContent = 'Trân trọng kính mời';
    const saltName = $('#rsvpSalutationName');
    if (saltName) saltName.textContent = effectiveName;
    const saltLead = $('#rsvpSalutationLead');
    if (saltLead) saltLead.textContent = salutationInfo.rsvpSubtext;
  }

  // Bỏ hoàn toàn form xác nhận tham dự đối với các link common
  if (defaultRsvpForm) {
    defaultRsvpForm.style.display = 'none';
  }
}

// =========================================================================
// 11b. XỬ LÝ LINK TÙY CHỈNH (/chu-re/cus?name={tên} hoặc /co-dau/cus?name={tên})
// Chỉ hiển thị đúng tên đã truyền vào query param
// =========================================================================
if (isCustomMode) {
  // Ẩn các hộp khách mời khác
  if (rsvpGuestBox) rsvpGuestBox.style.display = 'none';
  if (rsvpFamilyBox) rsvpFamilyBox.style.display = 'none';

  const customName = (queryGuestName || 'Quý khách').trim();

  // 1. Màn hình mở thiệp (Opening screen)
  const guestEl = $('#guestName');
  if (guestEl) guestEl.textContent = customName.slice(0, 60);

  const openEyebrow = $('#openingEyebrow') || $('#opening .eyebrow');
  if (openEyebrow) openEyebrow.textContent = 'Trân trọng kính mời';

  const openCopy = $('#openingCopy') || $('#opening .opening__copy');
  if (openCopy) openCopy.textContent = 'tới chung vui trong ngày trọng đại của';

  // 2. Thẻ Invitation Section
  const invEyebrow = $('#invitationEyebrow') || $('.invitation .eyebrow');
  if (invEyebrow) invEyebrow.textContent = 'Trân trọng kính mời';

  const invHeading = $('#invitationHeading') || $('.invitation .script');
  if (invHeading) {
    invHeading.innerHTML = 'Cùng chung vui với hai gia đình chúng tôi';
  }

  const invLead = $('#invitationLead') || $('.invitation .lead');
  if (invLead) {
    invLead.textContent = `Sự hiện diện của ${customName} là niềm vinh hạnh và niềm vui to lớn của hai gia đình chúng tôi trong ngày trọng đại này.`;
  }

  // 3. Khối RSVP: Ẩn form, hiển thị thiệp mời trang trọng chỉ với đúng tên truyền vào
  const rsvpEyebrow = $('#rsvp .eyebrow');
  if (rsvpEyebrow) rsvpEyebrow.textContent = 'Invitation';

  const rsvpHeading = $('#rsvpHeading');
  if (rsvpHeading) rsvpHeading.textContent = 'Thiệp mời chung vui';

  const rsvpLead = $('#rsvpLead');
  if (rsvpLead) rsvpLead.textContent = 'Hai gia đình chúng tôi rất hân hạnh và trân trọng kính mời:';

  const rsvpSalutationBox = $('#rsvpSalutationBox');
  if (rsvpSalutationBox) {
    rsvpSalutationBox.style.display = 'block';

    const saltEyebrow = $('#rsvpSalutationEyebrow');
    if (saltEyebrow) saltEyebrow.textContent = 'Trân trọng kính mời';

    const saltName = $('#rsvpSalutationName');
    if (saltName) saltName.textContent = customName;

    const saltLead = $('#rsvpSalutationLead');
    if (saltLead) {
      saltLead.textContent = `Sự hiện diện của ${customName} là niềm vinh hạnh to lớn của hai gia đình chúng tôi trong ngày trọng đại!`;
    }
  }

  // Bỏ form xác nhận tham dự đối với link tùy chỉnh
  if (defaultRsvpForm) {
    defaultRsvpForm.style.display = 'none';
  }
}

// =========================================================================
// 11c. XỬ LÝ LINK /family (HOẶC /chu-re/family)
// Gia đình con Ngô Hường Tạ Thành trân trọng kính mời U, Cô, Dì, Chú, Bác, Anh, Em, Cháu
// =========================================================================
if (isFamilyMode) {
  // Ẩn các hộp khách mời khác
  if (rsvpGuestBox) rsvpGuestBox.style.display = 'none';
  if (rsvpFamilyBox) rsvpFamilyBox.style.display = 'none';

  const familyDefaultGuest = 'U, Cô, Dì, Chú, Bác, Anh, Em, Cháu';
  const familyGuestName = (queryGuestName || familyDefaultGuest).trim();

  // 1. Màn hình mở thiệp (Opening screen)
  const guestEl = $('#guestName');
  if (guestEl) {
    guestEl.textContent = familyGuestName;
    if (familyGuestName.length > 25) {
      guestEl.style.fontSize = '20px';
      guestEl.style.lineHeight = '1.35';
    }
  }

  const openEyebrow = $('#openingEyebrow') || $('#opening .eyebrow');
  if (openEyebrow) openEyebrow.textContent = 'Gia đình con Ngô Hường Tạ Thành trân trọng kính mời';

  const openCopy = $('#openingCopy') || $('#opening .opening__copy');
  if (openCopy) openCopy.textContent = 'tới chung vui trong ngày trọng đại của hai cháu';

  // 2. Thẻ Invitation Section
  const invEyebrow = $('#invitationEyebrow') || $('.invitation .eyebrow');
  if (invEyebrow) invEyebrow.textContent = 'Gia đình con Ngô Hường Tạ Thành trân trọng kính mời';

  const invHeading = $('#invitationHeading') || $('.invitation .script');
  if (invHeading) {
    invHeading.innerHTML = 'Cùng chung vui với gia đình chúng con';
  }

  const invLead = $('#invitationLead') || $('.invitation .lead');
  if (invLead) {
    invLead.textContent = `Sự hiện diện của ${familyGuestName} là niềm vinh hạnh và niềm vui to lớn của gia đình chúng con trong ngày trọng đại này.`;
  }

  // 3. Khối RSVP: Ẩn form, hiển thị thiệp mời trang trọng của gia đình
  const rsvpEyebrow = $('#rsvp .eyebrow');
  if (rsvpEyebrow) rsvpEyebrow.textContent = 'Invitation';

  const rsvpHeading = $('#rsvpHeading');
  if (rsvpHeading) rsvpHeading.textContent = 'Thiệp mời gia đình';

  const rsvpLead = $('#rsvpLead');
  if (rsvpLead) rsvpLead.textContent = 'Gia đình con Ngô Hường Tạ Thành trân trọng kính mời:';

  const rsvpSalutationBox = $('#rsvpSalutationBox');
  if (rsvpSalutationBox) {
    rsvpSalutationBox.style.display = 'block';

    const saltEyebrow = $('#rsvpSalutationEyebrow');
    if (saltEyebrow) saltEyebrow.textContent = 'Gia đình con Ngô Hường Tạ Thành trân trọng kính mời';

    const saltName = $('#rsvpSalutationName');
    if (saltName) {
      saltName.textContent = familyGuestName;
      if (familyGuestName.length > 25) {
        saltName.style.fontSize = '20px';
        saltName.style.lineHeight = '1.35';
      }
    }

    const saltLead = $('#rsvpSalutationLead');
    if (saltLead) {
      saltLead.textContent = `Sự hiện diện của quý ${familyGuestName} là niềm hạnh phúc to lớn của gia đình chúng con trong ngày trọng đại!`;
    }
  }

  // Bỏ form xác nhận tham dự đối với link gia đình
  if (defaultRsvpForm) {
    defaultRsvpForm.style.display = 'none';
  }
}

// =========================================================================
// 12. KHỐI QUÀ MỪNG CƯỚI (NÚT BẤM & POPUP VIETQR TƯƠNG ỨNG ROLE)
// =========================================================================
function removeVietnameseAccents(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const groomBankConfig = {
  bankBin: "970407",
  accountNumber: "2388666688",
  accountName: "TA CONG MINH",
  displayName: "Tạ Công Minh",
  bankName: "Techcombank",
  template: "compact2"
};

const brideBankConfig = {
  bankBin: "970407",
  accountNumber: "19035382016016",
  accountName: "CAO THU HANG",
  displayName: "Cao Thu Hằng",
  bankName: "Techcombank",
  template: "compact2"
};

function computeGiftDescription(guestApiData = null) {
  // 1. Nếu là /invite (:inviteCode) hoặc có dữ liệu khách mời cá nhân từ API
  // Tạo description theo fullName + message trả về từ api GET /guests/code/{inviteCode} + " chuc mung"
  if (guestApiData || (isInviteMode && inviteCode)) {
    let name = '';
    let msg = '';
    if (guestApiData) {
      name = guestApiData.fullName || guestApiData.name || '';
      msg = guestApiData.message || guestApiData.note || '';
    } else if (currentGuestName) {
      name = currentGuestName;
    } else if (queryGuestName) {
      name = queryGuestName;
    }
    const cleanName = removeVietnameseAccents(name);
    const cleanMsg = removeVietnameseAccents(msg);

    if (cleanName && cleanMsg) {
      return `${cleanName} ${cleanMsg} chuc mung`.trim();
    } else if (cleanName) {
      return `${cleanName} chuc mung`.trim();
    } else if (cleanMsg) {
      return `${cleanMsg} chuc mung`.trim();
    }
    return "Mung cuoi Minh va Hang";
  }

  // 2. Nếu là các mẫu common
  // description mặc định với nhà trai nếu là các mẫu common SẼ MẶC ĐỊNH LÀ NAME(không dấu) + "chuc mung"
  if (salutationInfo) {
    let rawName = salutationInfo.title;
    if (queryGuestName) {
      if (salutationInfo.title.toLowerCase().startsWith('gia đình ') && queryGuestName.toLowerCase().startsWith('chị ') && salutationInfo.title.toLowerCase().includes('chị')) {
        rawName = `Gia đình ${queryGuestName}`;
      } else if (queryGuestName.toLowerCase().startsWith(salutationInfo.title.toLowerCase())) {
        rawName = queryGuestName;
      } else {
        rawName = `${salutationInfo.title} ${queryGuestName}`;
      }
    }
    const cleanName = removeVietnameseAccents(rawName);
    if (cleanName) {
      return `${cleanName} chuc mung`.trim();
    }
    return "Mung cuoi Minh va Hang";
  }

  // 3. Nếu có query param name trên URL thường
  if (queryGuestName) {
    const cleanName = removeVietnameseAccents(queryGuestName);
    if (cleanName) {
      return `${cleanName} chuc mung`.trim();
    }
  }

  // 4. Mặc định
  return "Mung cuoi Minh va Hang";
}

async function requestVietQrGenerate(payload) {
  const endpoints = [
    '/api/v1/qr/vietqr/generate',
    '/api/backend/api/v1/qr/vietqr/generate',
    'http://localhost:8088/api/v1/qr/vietqr/generate'
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (_) { }
  }
  return null;
}

// Lưu trữ dữ liệu khách mời mới nhất để dùng khi mở popup
let latestGiftGuestData = null;
let currentQrLoadedSrc = null;

async function prepareGiftQr(guestApiData = null) {
  if (guestApiData) latestGiftGuestData = guestApiData;
  const description = computeGiftDescription(latestGiftGuestData);

  // Chọn cấu hình ngân hàng theo role:
  // /chu-re chỉ hiển thị QR chú rể, /co-dau chỉ hiển thị QR cô dâu
  const targetConfig = role === 'co-dau' ? brideBankConfig : groomBankConfig;

  // Cập nhật thông tin text dưới mã QR (Tên, Số tài khoản, Ngân hàng)
  const nameEl = $('#giftModalName');
  const accEl = $('#giftModalAcc');
  const bankEl = $('#giftModalBank');
  const copyBtn = $('#btnCopyGiftAcc');

  if (nameEl) nameEl.textContent = targetConfig.displayName;
  if (accEl) accEl.textContent = targetConfig.accountNumber;
  if (bankEl) bankEl.textContent = targetConfig.bankName;
  if (copyBtn) {
    copyBtn.setAttribute('data-acc', targetConfig.accountNumber);
    copyBtn.setAttribute('title', 'Sao chép số tài khoản');
    copyBtn.classList.remove('copied');
    const iconCopy = copyBtn.querySelector('.icon-copy');
    const iconCheck = copyBtn.querySelector('.icon-check');
    if (iconCopy) iconCopy.style.display = 'block';
    if (iconCheck) iconCheck.style.display = 'none';
  }

  const payload = {
    bankBin: targetConfig.bankBin,
    accountNumber: targetConfig.accountNumber,
    accountName: targetConfig.accountName,
    template: targetConfig.template,
    description: description
  };

  const fallbackUrl = `https://img.vietqr.io/image/${payload.bankBin}-${payload.accountNumber}-${payload.template}.png?accountName=${encodeURIComponent(payload.accountName)}&addInfo=${encodeURIComponent(payload.description)}`;

  const imgEl = $('#giftModalQrImg');
  const loadingEl = $('#giftModalLoading');

  try {
    const data = await requestVietQrGenerate(payload);
    const imgSrc = data?.qrDataUrl || data?.qrQuickLink || fallbackUrl;
    currentQrLoadedSrc = imgSrc;
    if (imgEl) {
      imgEl.src = imgSrc;
      imgEl.style.display = 'block';
    }
    if (loadingEl) loadingEl.style.display = 'none';
  } catch (_) {
    currentQrLoadedSrc = fallbackUrl;
    if (imgEl) {
      imgEl.src = fallbackUrl;
      imgEl.style.display = 'block';
    }
    if (loadingEl) loadingEl.style.display = 'none';
  }
}

function updateWeddingGiftSection(guestApiData = null) {
  prepareGiftQr(guestApiData);
}

// Modal popup handlers
const giftModal = $('#giftModal');
const btnOpenGift = $('#btnOpenGiftModal');
const btnCloseGift = $('#btnCloseGiftModal');
const giftWash = $('#giftModalWash');
const btnCopyGiftAcc = $('#btnCopyGiftAcc');

if (btnCopyGiftAcc) {
  btnCopyGiftAcc.addEventListener('click', async () => {
    const acc = btnCopyGiftAcc.getAttribute('data-acc') || $('#giftModalAcc')?.textContent?.trim();
    if (!acc) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(acc);
      } else {
        const temp = document.createElement('textarea');
        temp.value = acc;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      btnCopyGiftAcc.classList.add('copied');
      btnCopyGiftAcc.setAttribute('title', 'Đã sao chép!');
      const iconCopy = btnCopyGiftAcc.querySelector('.icon-copy');
      const iconCheck = btnCopyGiftAcc.querySelector('.icon-check');
      if (iconCopy) iconCopy.style.display = 'none';
      if (iconCheck) iconCheck.style.display = 'block';
      setTimeout(() => {
        btnCopyGiftAcc.classList.remove('copied');
        btnCopyGiftAcc.setAttribute('title', 'Sao chép số tài khoản');
        if (iconCopy) iconCopy.style.display = 'block';
        if (iconCheck) iconCheck.style.display = 'none';
      }, 2000);
    } catch (_) { }
  });
}

function openGiftModal() {
  if (!giftModal) return;
  // Đảm bảo mã QR đã được chuẩn bị
  if (!currentQrLoadedSrc) {
    prepareGiftQr(latestGiftGuestData);
  }
  giftModal.style.display = 'flex';
  requestAnimationFrame(() => {
    giftModal.classList.add('is-open');
  });
}

function closeGiftModal() {
  if (!giftModal) return;
  giftModal.classList.remove('is-open');
  setTimeout(() => {
    giftModal.style.display = 'none';
  }, 280);
}

if (btnOpenGift) {
  btnOpenGift.addEventListener('click', openGiftModal);
}
if (btnCloseGift) {
  btnCloseGift.addEventListener('click', closeGiftModal);
}
if (giftWash) {
  giftWash.addEventListener('click', closeGiftModal);
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && giftModal && giftModal.classList.contains('is-open')) {
    closeGiftModal();
  }
});

// Khởi tạo tải trước mã QR tương ứng
prepareGiftQr();
