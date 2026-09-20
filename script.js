const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const auth = document.querySelector("#auth");
const onboarding = document.querySelector("#onboarding");
const appShell = document.querySelector("#app");
const authForm = document.querySelector("#auth-form");
const authStatus = document.querySelector("#auth-status");
const authSwitch = document.querySelector("#auth-switch");
const authButtons = document.querySelectorAll(".js-auth");
const homeButton = document.querySelector(".js-home");
const form = document.querySelector("#profile-form");
const status = document.querySelector("#onboarding-status");
let authMode = "login";
let currentStep = 1;

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
  auth.hidden = false;
  onboarding.hidden = true;
  appShell.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector("#auth-email").focus();
}

function showOnboarding() {
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
  document.querySelectorAll("main > section").forEach((section) => { section.hidden = !["app"].includes(section.id); });
  appShell.hidden = false;
  const profile = JSON.parse(localStorage.getItem("destiny-profile") || "{}");
  document.querySelector("#profile-name").textContent = profile.nickname || "il tuo profilo";
  document.querySelector("#profile-location").textContent = profile.city ? `${profile.city}, Italia` : "La tua zona";
  document.querySelector("#profile-bio").textContent = profile.interests || "Il tuo spazio è pronto. Lascia che il caso faccia il resto.";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".app-tabs button, [data-jump]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const view = tab.dataset.view || tab.dataset.jump;
    document.querySelectorAll(".app-tabs button").forEach((item) => item.classList.toggle("active", item.dataset.view === view));
    document.querySelectorAll(".app-view").forEach((panel) => { panel.hidden = panel.dataset.panel !== view; });
  });
});

const candidates = [["Luca, 28", "ha salvato gli stessi concerti e vive a 12 minuti da te."], ["Sofia, 25", "cerca qualcuno con cui perdersi in una libreria."], ["Marco, 30", "ha scritto: il miglior piano è quello che cambia."]];
document.querySelector("#generate-match").addEventListener("click", () => {
  const candidate = candidates[Math.floor(Math.random() * candidates.length)];
  const result = document.querySelector("#match-result");
  result.innerHTML = `<b>${candidate[0]} <span>✦ scelto dal destino</span></b><span>${candidate[1]}</span>`;
  result.hidden = false;
});

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
