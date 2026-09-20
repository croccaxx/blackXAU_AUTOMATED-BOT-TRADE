const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const auth = document.querySelector("#auth");
const onboarding = document.querySelector("#onboarding");
const appShell = document.querySelector("#app");
const storyDetail = document.querySelector("#story-detail");
const storiesHeading = document.querySelector(".stories-heading");
const storiesRow = document.querySelector(".stories-row");
const authForm = document.querySelector("#auth-form");
const authStatus = document.querySelector("#auth-status");
const authSwitch = document.querySelector("#auth-switch");
const authButtons = document.querySelectorAll(".js-auth");
const homeButton = document.querySelector(".js-home");
const form = document.querySelector("#profile-form");
const status = document.querySelector("#onboarding-status");
let authMode = "login";
let currentStep = 1;
const appViews = ["home", "discover", "messages", "profile"];
let activeView = "home";
let touchStartX = 0;
let touchStartY = 0;
let chatTouchStartX = 0;
let chatTouchStartY = 0;

const stepCopy = [
  ["Partiamo<br>dal tuo <strong>nome.</strong>", "Scegli come vuoi essere chiamato. Non serve il tuo nome vero."],
  ["Ora dimmi<br>dove <strong>sei.</strong>", "Ci serve solo una zona, mai la tua posizione precisa."],
  ["Cosa ti<br>muove <strong>dentro?</strong>", "Questi dettagli aiutano il motore a sorprenderti meglio."],
  ["Un ultimo<br><strong>dettaglio.</strong>", "Ti scriveremo solo quando ci sarà qualcosa di interessante."]
];

function publicSections(hidden) {
  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = hidden && !["auth", "onboarding", "app"].includes(section.id);
  });
}

function openAuth() {
  publicSections(true);
  document.body.classList.remove("app-interface-active");
  auth.hidden = false;
  onboarding.hidden = true;
  appShell.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#auth-email").focus();
}

function showOnboarding() {
  document.body.classList.add("app-interface-active");
  auth.hidden = true;
  onboarding.hidden = false;
  showStep(1);
  document.querySelector("#nickname").focus();
}

function showStep(step) {
  currentStep = step;
  document.querySelectorAll("#profile-form fieldset").forEach((fieldset) => {
    fieldset.hidden = Number(fieldset.dataset.step) !== step;
  });
  document.querySelector("#onboarding-title").innerHTML = stepCopy[step - 1][0];
  document.querySelector("#onboarding-help").textContent = stepCopy[step - 1][1];
  document.querySelector("#step-number").textContent = String(step).padStart(2, "0");
  document.querySelector("#form-action").textContent = step === 4 ? "Crea il mio spazio" : "Continua";
  status.textContent = "";
}

authButtons.forEach((button) => button.addEventListener("click", openAuth));
authSwitch.addEventListener("click", () => {
  authMode = authMode === "login" ? "register" : "login";
  document.querySelector("#auth-title").innerHTML = authMode === "login" ? "Accedi al tuo<br><strong>profilo.</strong>" : "Crea il tuo<br><strong>profilo.</strong>";
  document.querySelector("#auth-kicker").textContent = authMode === "login" ? "IL TUO SPAZIO TI ASPETTA" : "INIZIA IL TUO SPAZIO";
  document.querySelector("#auth-help").textContent = authMode === "login" ? "Usa la tua email e una password per ritrovare sempre il tuo spazio." : "Registrati con email e password. Il tuo spazio resterà nel browser.";
  document.querySelector("#auth-action").textContent = authMode === "login" ? "Accedi" : "Registrati";
  authSwitch.innerHTML = authMode === "login" ? "Non hai ancora un profilo? <strong>Registrati</strong>" : "Hai già un profilo? <strong>Accedi</strong>";
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#auth-email").value.trim().toLowerCase();
  const password = document.querySelector("#auth-password").value;
  authStatus.className = "form-status";
  if (!email || !document.querySelector("#auth-email").validity.valid || password.length < 8) {
    authStatus.textContent = "Inserisci un'email valida e una password di almeno 8 caratteri.";
    authStatus.classList.add("error");
    return;
  }
  const account = JSON.parse(localStorage.getItem("destiny-account") || "null");
  if (authMode === "login" && (!account || account.email !== email || account.password !== password)) {
    authStatus.textContent = "Account non trovato in questo browser. Registrati per iniziare.";
    authStatus.classList.add("error");
    return;
  }
  if (authMode === "register") localStorage.setItem("destiny-account", JSON.stringify({ email, password }));
  localStorage.setItem("destiny-session", "active");
  if (localStorage.getItem("destiny-profile")) openApp();
  else showOnboarding();
});

homeButton.addEventListener("click", () => {
  onboarding.hidden = true;
  auth.hidden = false;
  document.body.classList.remove("app-interface-active");
  authMode = "login";
  publicSections(true);
});

function validateCurrentStep() {
  const active = [...document.querySelectorAll(`#profile-form fieldset[data-step="${currentStep}"] [required]`)];
  const missing = active.find((field) => (field.type === "checkbox" ? !field.checked : !field.value.trim()));
  if (missing) {
    status.textContent = "Completa questo campo per continuare.";
    status.className = "form-status error";
    missing.focus();
    return false;
  }
  if (currentStep === 2 && (Number(document.querySelector("#age").value) < 18 || Number(document.querySelector("#age").value) > 99)) {
    status.textContent = "DESTINY è riservato a persone maggiorenni.";
    status.className = "form-status error";
    return false;
  }
  if (currentStep === 4 && !document.querySelector("#email").validity.valid) {
    status.textContent = "Inserisci un indirizzo email valido.";
    status.className = "form-status error";
    return false;
  }
  return true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;
  if (currentStep < 4) {
    showStep(currentStep + 1);
    return;
  }
  const profile = {
    nickname: document.querySelector("#nickname").value.trim(),
    city: document.querySelector("#city").value.trim(),
    interests: document.querySelector("#interests").value.trim()
  };
  localStorage.setItem("destiny-profile", JSON.stringify(profile));
  openApp();
});

function openApp() {
  document.body.classList.add("app-interface-active");
  document.querySelectorAll("main > section").forEach((section) => { section.hidden = !["app"].includes(section.id); });
  appShell.hidden = false;
  const profile = JSON.parse(localStorage.getItem("destiny-profile") || "{}");
  document.querySelector("#profile-name").textContent = profile.nickname || "il tuo profilo";
  document.querySelector("#profile-location").textContent = profile.city ? `${profile.city}, Italia` : "La tua zona";
  document.querySelector("#profile-bio").textContent = profile.interests || "Il tuo spazio è pronto. Lascia che il caso faccia il resto.";
  if (activeChat) {
    document.querySelector("#message-list").innerHTML = `<button class="message-thread" type="button"><span class="thread-avatar"></span><span><b>${activeChat[0]}</b><small>La tua connessione è qui ✦</small></span><strong>1</strong></button>`;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showView(view, direction = "next") {
  if (!appViews.includes(view) || view === activeView) return;
  const shell = document.querySelector(".app-shell");
  shell.classList.remove("view-slide-next", "view-slide-prev");
  void shell.offsetWidth;
  shell.classList.add(direction === "prev" ? "view-slide-prev" : "view-slide-next");
  activeView = view;
  const showStories = view === "home";
  storiesHeading.hidden = !showStories;
  storiesRow.hidden = !showStories;
  storyDetail.hidden = true;
  if (view === "discover" && pendingMatch) {
    document.querySelector("#match-name").textContent = pendingMatch[0];
    document.querySelector("#match-description").textContent = pendingMatch[1];
    document.querySelector("#match-result").hidden = false;
    const generateButton = document.querySelector("#generate-match");
    generateButton.disabled = true;
    generateButton.classList.add("match-locked");
    generateButton.innerHTML = "Incontro in corso <span>⌁</span>";
  }
  document.querySelectorAll(".app-tabs button").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
  document.querySelectorAll(".app-view").forEach((panel) => { panel.hidden = panel.dataset.panel !== view; });
}

document.querySelectorAll(".app-tabs button, [data-jump]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const view = tab.dataset.view || tab.dataset.jump;
    const direction = appViews.indexOf(view) > appViews.indexOf(activeView) ? "next" : "prev";
    showView(view, direction);
  });
});

appShell.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
}, { passive: true });

appShell.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].screenX - touchStartX;
  const deltaY = event.changedTouches[0].screenY - touchStartY;
  if (Math.abs(deltaX) < 55 || Math.abs(deltaX) < Math.abs(deltaY)) return;
  const currentIndex = appViews.indexOf(activeView);
  const nextIndex = deltaX < 0 ? Math.min(currentIndex + 1, appViews.length - 1) : Math.max(currentIndex - 1, 0);
  if (activeView === "messages" && document.querySelector("#chat-panel").hidden === false && deltaX > 0) {
    closeChat();
    return;
  }
  if (nextIndex !== currentIndex) showView(appViews[nextIndex], deltaX < 0 ? "next" : "prev");
}, { passive: true });

const chatPanel = document.querySelector("#chat-panel");
chatPanel.addEventListener("touchstart", (event) => {
  chatTouchStartX = event.changedTouches[0].screenX;
  chatTouchStartY = event.changedTouches[0].screenY;
}, { passive: true });

chatPanel.addEventListener("touchmove", (event) => {
  const deltaX = event.changedTouches[0].screenX - chatTouchStartX;
  const deltaY = event.changedTouches[0].screenY - chatTouchStartY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) event.preventDefault();
}, { passive: false });

chatPanel.addEventListener("touchend", (event) => {
  const deltaX = event.changedTouches[0].screenX - chatTouchStartX;
  const deltaY = event.changedTouches[0].screenY - chatTouchStartY;
  if (deltaX > 45 && Math.abs(deltaX) > Math.abs(deltaY)) {
    event.preventDefault();
    closeChat();
  }
}, { passive: false });

const candidates = [["Luca, 28", "ha salvato gli stessi concerti e vive a 12 minuti da te."], ["Sofia, 25", "cerca qualcuno con cui perdersi in una libreria."], ["Marco, 30", "ha scritto: il miglior piano è quello che cambia."]];
let pendingMatch = JSON.parse(localStorage.getItem("destiny-pending-match") || "null");
let matchLocked = Boolean(pendingMatch);
let activeChat = JSON.parse(localStorage.getItem("destiny-chat") || "null");
document.querySelector("#generate-match").addEventListener("click", () => {
  const button = document.querySelector("#generate-match");
  if (matchLocked) return;
  button.disabled = true;
  button.classList.add("is-searching");
  button.innerHTML = '<span class="search-spinner" aria-hidden="true"></span> Sto cercando...';
  document.querySelector("#match-result").hidden = true;
  const candidate = candidates[Math.floor(Math.random() * candidates.length)];
  const result = document.querySelector("#match-result");
  window.setTimeout(() => {
    pendingMatch = candidate;
    activeChat = candidate;
    localStorage.setItem("destiny-chat", JSON.stringify(candidate));
    localStorage.setItem("destiny-pending-match", JSON.stringify(candidate));
    matchLocked = true;
    document.querySelector("#match-name").textContent = candidate[0];
    document.querySelector("#match-description").textContent = candidate[1];
    result.hidden = false;
    button.disabled = false;
    button.classList.remove("is-searching");
    button.innerHTML = "Incontro trovato <span>✓</span>";
    button.classList.add("match-locked");
    result.classList.add("match-pop");
    document.querySelector("#message-list").innerHTML = `<button class="message-thread" type="button"><span class="thread-avatar"></span><span><b>${candidate[0]}</b><small>La tua nuova connessione è qui ✦</small></span><strong>1</strong></button>`;
    document.querySelector("#chat-name").textContent = candidate[0];
  }, 1500);
});

document.querySelector("#begin-chat").addEventListener("click", () => {
  const burst = document.createElement("div");
  burst.className = "confetti-burst";
  for (let index = 0; index < 26; index += 1) {
    const piece = document.createElement("i");
    piece.style.setProperty("--x", `${Math.random() * 220 - 110}px`);
    piece.style.setProperty("--y", `${Math.random() * 220 - 110}px`);
    piece.style.setProperty("--r", `${Math.random() * 520 - 260}deg`);
    piece.style.setProperty("--h", `${Math.floor(Math.random() * 360)}deg`);
    burst.appendChild(piece);
  }
  document.body.appendChild(burst);
  window.setTimeout(() => {
    burst.remove();
    showView("messages", "next");
    document.querySelector("#message-list").hidden = true;
    document.querySelector("#chat-panel").hidden = false;
  }, 650);
});

document.querySelector("#message-list").addEventListener("click", (event) => {
  const thread = event.target.closest(".message-thread");
  if (!thread || !activeChat) return;
  openChat();
});

function openChat() {
  document.querySelector("#message-list").hidden = true;
  document.querySelector("#chat-panel").hidden = false;
}

function closeChat() {
  document.querySelector("#chat-panel").hidden = true;
  document.querySelector("#message-list").hidden = false;
}

document.querySelector("#close-chat").addEventListener("click", closeChat);

document.querySelector("#chat-camera").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.capture = "environment";
  input.addEventListener("change", () => {
    if (!input.files?.length) return;
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble chat-photo-preview";
    bubble.innerHTML = 'Connection Photo pronta ✦ <button class="publish-chat-photo" type="button">Pubblica insieme</button>';
    document.querySelector(".chat-body").appendChild(bubble);
    document.querySelector("#chat-camera").textContent = "✓";
  });
  input.click();
});

document.querySelector(".chat-body").addEventListener("click", (event) => {
  if (!event.target.classList.contains("publish-chat-photo")) return;
  const photo = document.createElement("div");
  photo.className = "empty-tile published-tile";
  photo.innerHTML = `<span>✦</span><small>Tu + ${activeChat?.[0] || "la tua connessione"}<br>Connection Photo · @${(activeChat?.[0] || "destiny").split(",")[0].toLowerCase().replace(/\s/g, "_")}</small>`;
  const grid = document.querySelector("#collection-grid");
  grid.querySelector(".empty-tile:not(.published-tile)")?.remove();
  grid.prepend(photo);
  const count = grid.querySelectorAll(".published-tile").length;
  document.querySelector("#collection-count").textContent = `${count} / 12`;
  document.querySelector("#profile-photo-count").firstChild.textContent = `${count} `;
  const notification = document.createElement("div");
  notification.className = "chat-bubble chat-notification";
  notification.textContent = `Notifica inviata a ${activeChat?.[0] || "la tua connessione"}: può pubblicare la stessa foto nel suo profilo.`;
  document.querySelector(".chat-body").appendChild(notification);
  event.target.textContent = "Pubblicata ✓";
  event.target.disabled = true;
  matchLocked = false;
  pendingMatch = null;
  localStorage.removeItem("destiny-pending-match");
  const generateButton = document.querySelector("#generate-match");
  generateButton.disabled = false;
  generateButton.classList.remove("match-locked");
  generateButton.innerHTML = "Genera un altro incontro <span>✦</span>";
});

document.querySelector("#chat-profile-trigger").addEventListener("click", () => {
  const panel = document.querySelector("#chat-profile");
  panel.hidden = !panel.hidden;
  document.querySelector("#chat-profile-name").textContent = activeChat?.[0] || "Nuova connessione";
  document.querySelector("#chat-profile-bio").textContent = activeChat?.[1] || "Profilo scelto dal destino.";
});

document.querySelectorAll(".story-pair:not(.story-add)").forEach((story) => {
  story.addEventListener("click", () => {
    document.querySelector("#story-pair-name").textContent = story.dataset.pair;
    document.querySelector("#story-pair-detail").textContent = story.dataset.detail;
    storyDetail.hidden = false;
  });
});
document.querySelector(".story-close")?.addEventListener("click", () => {
  storyDetail.hidden = true;
});

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
