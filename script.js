const envelope = document.getElementById("envelope");
const openEnvelope = document.getElementById("openEnvelope");
const answerArea = document.getElementById("answerArea");
const hint = document.getElementById("hint");
const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
const modal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");
const celebrateButton = document.getElementById("celebrateButton");

// Open the envelope and reveal the answer buttons.
openEnvelope.addEventListener("click", () => {
  envelope.classList.add("open");
  hint.textContent = "A little question, from the bottom of my heart...";
  window.setTimeout(() => {
    answerArea.classList.add("visible");
    answerArea.setAttribute("aria-hidden", "false");
  }, 650);
});

// Make NO jump to a different visible spot whenever the pointer gets close.
let noIsActive = false;
let lastNoMove = 0;

function moveNoButton() {
  const now = Date.now();
  if (now - lastNoMove < 450) return;
  lastNoMove = now;

  const margin = 16;
  const rect = noButton.getBoundingClientRect();
  const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
  const yesRect = yesButton.getBoundingClientRect();
  let x = margin;
  let y = margin;

  // Pick a new position that does not cover the YES button.
  for (let attempt = 0; attempt < 60; attempt++) {
    x = margin + Math.random() * Math.max(0, maxX - margin);
    y = margin + Math.random() * Math.max(0, maxY - margin);
    const overlapsYes =
      x < yesRect.right + 24 && x + rect.width > yesRect.left - 24 &&
      y < yesRect.bottom + 24 && y + rect.height > yesRect.top - 24;
    if (!overlapsYes) break;
  }

  noButton.style.position = "fixed";
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
  noButton.style.right = "auto";
  noButton.style.bottom = "auto";
  noButton.style.zIndex = "30";
  noButton.style.display = "block";
  noButton.style.visibility = "visible";
  noButton.style.opacity = "1";
}

// Trigger when the pointer enters the button or gets close to it.
noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});

// This proximity check also works if the pointer approaches the button slowly.
document.addEventListener("pointermove", (event) => {
  if (!answerArea.classList.contains("visible")) return;
  const rect = noButton.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY);
  if (distance < 85) moveNoButton();
});

// On touch screens, move it as soon as it is tapped.
noButton.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });

window.addEventListener("resize", () => {
  if (noButton.style.position === "fixed") moveNoButton();
});

yesButton.addEventListener("click", () => {
  modal.classList.add("show");
  launchConfettiHearts();
});

function hideModal() {
  modal.classList.remove("show");
}
closeModal.addEventListener("click", hideModal);
celebrateButton.addEventListener("click", () => {
  launchConfettiHearts();
  celebrateButton.textContent = "Sending you all my love! 💞";
});
modal.addEventListener("click", (event) => {
  if (event.target === modal) hideModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideModal();
});

// Floating hearts and tiny sparkles in the background.
const sparkleLayer = document.querySelector(".sparkles");
const symbols = ["✦", "♥", "✧", "·"];
for (let i = 0; i < 30; i++) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  sparkle.style.left = `${Math.random() * 100}%`;
  sparkle.style.fontSize = `${9 + Math.random() * 15}px`;
  sparkle.style.animationDuration = `${9 + Math.random() * 13}s`;
  sparkle.style.animationDelay = `${Math.random() * 12}s`;
  sparkleLayer.appendChild(sparkle);
}

function launchConfettiHearts() {
  for (let i = 0; i < 24; i++) {
    const heart = document.createElement("span");
    heart.className = "sparkle";
    heart.textContent = Math.random() > .35 ? "♥" : "✦";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.bottom = "-25px";
    heart.style.fontSize = `${13 + Math.random() * 19}px`;
    heart.style.animationDuration = `${3 + Math.random() * 3}s`;
    sparkleLayer.appendChild(heart);
    window.setTimeout(() => heart.remove(), 6500);
  }
}
