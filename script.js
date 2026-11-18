const weddingDate = new Date("2027-01-16T18:00:00+07:00");
const photoSources = [4, 5, 1, 7, 8, 6, 2, 3].map(
  (assetIndex) => `assets/photo-${assetIndex}.webp`,
);

const seededWishes = [
  [
    "Vợ chồng anh Dũng",
    "Mong hai bạn luôn có chuyện để kể với nhau.",
    "16:00:00 24/2/2027",
  ],
  [
    "Cậu mợ Hải Yến",
    "Chúc mừng hai gia đình. Hôm nay ai cũng vui.",
    "17:00:00 25/2/2027",
  ],
  [
    "Dì Út",
    "Yêu thương nhau nhiều nhé, và nhớ giữ gìn sức khỏe.",
    "18:00:00 26/2/2027",
  ],
  [
    "Bác Sáu Bến Tre",
    "Chúc hai bạn một khởi đầu thật đẹp.",
    "19:00:00 27/2/2027",
  ],
  [
    "Tập thể lớp 12A2",
    "Hạnh phúc là biết đủ. Chúc hai em luôn thấy đủ bên nhau.",
    "20:00:00 28/2/2027",
  ],
];

const opening = document.querySelector("#opening");
const site = document.querySelector("#site");
const openInvitation = document.querySelector("#openInvitation");
const snowBurst = document.querySelector("#snowBurst");
const musicToggle = document.querySelector("#musicToggle");
const autoScrollToggle = document.querySelector("#autoScrollToggle");
const music = document.querySelector("#backgroundMusic");
const countdown = document.querySelector("#countdown");
const carousel = document.querySelector("#carousel");
const carouselStage = document.querySelector("#carouselStage");
const currentPhoto = document.querySelector("#currentPhoto");
const wishes = document.querySelector("#wishes");
const wishForm = document.querySelector("#wishForm");
const giftModal = document.querySelector("#giftModal");
let activePhoto = 0;
let carouselTimer = 0;
let carouselVisible = false;
let autoScrollFrame = 0;
let autoScrollLastTime = 0;
let autoScrolling = false;
const autoScrollSpeed = 36;

function openCard() {
  if (
    opening.classList.contains("is-opening") ||
    opening.classList.contains("is-open")
  )
    return;

  createSnowBurst();
  opening.classList.add("is-opening");
  playMusic();
  window.setTimeout(() => {
    site.setAttribute("aria-hidden", "false");
    site.classList.add("is-entering");
    document.body.classList.remove("locked");
    musicToggle.classList.add("visible");
  }, 1850);

  window.setTimeout(() => opening.classList.add("is-open"), 2000);

  window.setTimeout(() => {
    site.classList.remove("is-entering");
    site.classList.add("is-opened");
    startAutoScroll();
  }, 3000);
}

function startAutoScroll() {
  if (autoScrolling) return;
  autoScrolling = true;
  autoScrollLastTime = 0;
  document.documentElement.classList.add("auto-scrolling");
  autoScrollToggle.classList.add("visible");
  autoScrollToggle.setAttribute("aria-pressed", "true");
  autoScrollToggle.setAttribute("aria-label", "Tạm dừng tự cuộn");
  autoScrollToggle.title = "Tạm dừng tự cuộn";
  autoScrollToggle.firstElementChild.textContent = "Ⅱ";
  autoScrollFrame = window.requestAnimationFrame(runAutoScroll);
}

function pauseAutoScroll() {
  if (!autoScrolling) return;
  autoScrolling = false;
  window.cancelAnimationFrame(autoScrollFrame);
  document.documentElement.classList.remove("auto-scrolling");
  autoScrollToggle.setAttribute("aria-pressed", "false");
  autoScrollToggle.setAttribute("aria-label", "Tiếp tục tự cuộn");
  autoScrollToggle.title = "Tiếp tục tự cuộn";
  autoScrollToggle.firstElementChild.textContent = "▶";
}

function toggleAutoScroll() {
  if (autoScrolling) pauseAutoScroll();
  else startAutoScroll();
}

function runAutoScroll(now) {
  if (!autoScrolling) return;
  if (!autoScrollLastTime) autoScrollLastTime = now;
  const elapsedSeconds = Math.min((now - autoScrollLastTime) / 1000, 0.05);
  autoScrollLastTime = now;

  const root = document.documentElement;
  const maxScroll = root.scrollHeight - window.innerHeight;
  if (window.scrollY >= maxScroll - 1) {
    pauseAutoScroll();
    return;
  }
  root.scrollTop = Math.min(maxScroll, window.scrollY + autoScrollSpeed * elapsedSeconds);
  autoScrollFrame = window.requestAnimationFrame(runAutoScroll);
}

function createSnowBurst() {
  if (!snowBurst || snowBurst.childElementCount) return;

  const particleCount = 38;
  for (let i = 0; i < particleCount; i += 1) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.28;
    const distance = 90 + Math.random() * 260;
    const particle = document.createElement("span");
    particle.textContent = "✣";
    particle.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--burst-rotation", `${Math.random() * 300 - 150}deg`);
    particle.style.setProperty("--particle-size", `${12 + Math.random() * 20}px`);
    particle.style.setProperty("--particle-delay", `${1.5 + Math.random() * 0.15}s`);
    snowBurst.append(particle);
  }
}

function playMusic() {
  music.volume = 0.45;
  const promise = music.play();
  if (promise) {
    promise
      .then(() => {
        musicToggle.setAttribute("aria-pressed", "true");
        musicToggle.setAttribute("aria-label", "Tắt nhạc");
      })
      .catch(() => {
        musicToggle.setAttribute("aria-pressed", "false");
      });
  }
}

function toggleMusic() {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    musicToggle.setAttribute("aria-pressed", "false");
    musicToggle.setAttribute("aria-label", "Bật nhạc");
  }
}

function updateCountdown() {
  const difference = weddingDate.getTime() - Date.now();
  if (difference <= 0) {
    countdown.textContent = "Hôm nay là ngày trọng đại!";
    return;
  }

  const days = Math.floor(difference / 86_400_000);
  const hours = Math.floor((difference / 3_600_000) % 24);
  const minutes = Math.floor((difference / 60_000) % 60);
  const seconds = Math.floor((difference / 1_000) % 60);
  countdown.textContent = `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
}

function buildCarousel() {
  photoSources.forEach((source, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "carousel-card";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `Xem ảnh ${index + 1}`);

    const image = document.createElement("img");
    image.src = source;
    image.alt = `Ảnh cưới ${index + 1} của Khánh Duy và Ngọc Hân`;
    image.loading = index > 2 ? "lazy" : "eager";
    button.append(image);
    button.addEventListener("click", () => {
      activePhoto = index;
      renderCarousel();
      restartCarouselAutoplay();
    });
    carouselStage.append(button);
  });
  renderCarousel();

  const carouselObserver = new IntersectionObserver(([entry]) => {
    carouselVisible = entry.isIntersecting;
    restartCarouselAutoplay();
  }, { threshold: 0.25 });
  carouselObserver.observe(carousel);
}

function restartCarouselAutoplay() {
  window.clearInterval(carouselTimer);
  if (!carouselVisible || document.hidden) return;
  carouselTimer = window.setInterval(() => moveCarousel(1), 2300);
}

function circularOffset(index) {
  let offset = index - activePhoto;
  if (offset > photoSources.length / 2) offset -= photoSources.length;
  if (offset < -photoSources.length / 2) offset += photoSources.length;
  return offset;
}

function renderCarousel() {
  carouselStage.querySelectorAll(".carousel-card").forEach((card, index) => {
    const offset = circularOffset(index);
    const absoluteOffset = Math.abs(offset);
    const x = offset * 112;
    const z = absoluteOffset * -170;
    const rotate = offset * 30;
    const scale = Math.max(0.68, 1.06 - absoluteOffset * 0.16);
    const opacity = [1, 0.72, 0.42, 0.2, 0.12][Math.min(absoluteOffset, 4)];
    card.style.zIndex = String(20 - absoluteOffset);
    card.style.opacity = String(opacity);
    card.style.filter = absoluteOffset ? "brightness(0.68)" : "none";
    card.style.transform = `translateX(calc(-50% + ${x}%)) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`;
    card.setAttribute("aria-hidden", absoluteOffset > 2 ? "true" : "false");
  });
  currentPhoto.textContent = String(activePhoto + 1);
}

function moveCarousel(direction) {
  activePhoto =
    (activePhoto + direction + photoSources.length) % photoSources.length;
  renderCarousel();
  restartCarouselAutoplay();
}

function createWish([name, message, time], prepend = false) {
  const article = document.createElement("article");
  article.className = "wish";

  const header = document.createElement("div");
  header.className = "wish-header";
  const strong = document.createElement("strong");
  strong.textContent = name;
  const timestamp = document.createElement("time");
  timestamp.textContent = time;
  header.append(strong, timestamp);

  const body = document.createElement("p");
  body.textContent = message;
  article.append(header, body);

  if (prepend) wishes.prepend(article);
  else wishes.append(article);
}

function submitWish(event) {
  event.preventDefault();
  const name = document.querySelector("#wishName").value.trim();
  const message = document.querySelector("#wishMessage").value.trim();
  if (!name || !message) return;

  createWish(
    [
      name,
      message,
      new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "short",
        timeStyle: "medium",
      }).format(new Date()),
    ],
    true,
  );
  wishForm.reset();
  wishes.scrollTop = 0;
}

function openGift() {
  giftModal.hidden = false;
  document.body.classList.add("locked");
  giftModal.querySelector(".modal-close").focus();
}

function closeGift() {
  giftModal.hidden = true;
  document.body.classList.remove("locked");
  document.querySelector("#giftButton").focus();
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.13 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}

openInvitation.addEventListener("click", openCard);
musicToggle.addEventListener("click", toggleMusic);
autoScrollToggle.addEventListener("click", toggleAutoScroll);
site.addEventListener("click", (event) => {
  if (event.target.closest("button, a, input, textarea, select, [contenteditable='true']")) return;
  toggleAutoScroll();
});
site.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a, input, textarea, select, [contenteditable='true']")) {
    pauseAutoScroll();
  }
});
window.addEventListener("wheel", pauseAutoScroll, { passive: true });
window.addEventListener("touchmove", pauseAutoScroll, { passive: true });
document.addEventListener("visibilitychange", restartCarouselAutoplay);
document.addEventListener("keydown", (event) => {
  if ([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(event.key)) {
    pauseAutoScroll();
  }
});
document
  .querySelector("#prevPhoto")
  .addEventListener("click", () => moveCarousel(-1));
document
  .querySelector("#nextPhoto")
  .addEventListener("click", () => moveCarousel(1));
document.querySelector("#giftButton").addEventListener("click", openGift);
document
  .querySelectorAll("[data-close-modal]")
  .forEach((button) => button.addEventListener("click", closeGift));
document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () =>
    document
      .querySelector(`#${button.dataset.scrollTo}`)
      ?.scrollIntoView({ behavior: "smooth" }),
  );
});
wishForm.addEventListener("submit", submitWish);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !giftModal.hidden) closeGift();
  if (event.key === "ArrowLeft") moveCarousel(-1);
  if (event.key === "ArrowRight") moveCarousel(1);
});

seededWishes.forEach((wish) => createWish(wish));
buildCarousel();
setupReveal();
updateCountdown();
window.setInterval(updateCountdown, 1000);

if (new URLSearchParams(window.location.search).get("open") === "1") {
  openCard();
}
