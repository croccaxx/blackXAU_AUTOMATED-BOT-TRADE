const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const onboarding = document.querySelector("#onboarding");
const appShell = document.querySelector("#app");
const startButtons = document.querySelectorAll(".js-start");
const homeButton = document.querySelector(".js-home");
const form = document.querySelector("#profile-form");
const status = document.querySelector("#onboarding-status");
const fields = [...document.querySelectorAll("#profile-form [required]")];
let currentStep = 1;

const stepCopy = [
  ["Partiamo<br>dal tuo <strong>nome.</strong>", "Scegli come vuoi essere chiamato. Non serve il tuo nome vero."],
  ["Ora dimmi<br>dove <strong>sei.</strong>", "Ci serve solo una zona, mai la tua posizione precisa."],
  ["Cosa ti<br>muove <strong>dentro?</strong>", "Questi dettagli aiutano il motore a sorprenderti meglio."],
  ["Un ultimo<br><strong>dettaglio.</strong>", "Ti scriveremo solo quando ci sarà qualcosa di interessante."]
];

function openOnboarding() {
  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = section.id !== "onboarding";
  });
  onboarding.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    document.querySelector("#age").focus();
    return false;
  }
  if (currentStep === 4 && !document.querySelector("#email").validity.valid) {
    status.textContent = "Inserisci un indirizzo email valido.";
    status.className = "form-status error";
    document.querySelector("#email").focus();
    return false;
  }
  return true;
}

startButtons.forEach((button) => button.addEventListener("click", openOnboarding));
homeButton?.addEventListener("click", () => {
  onboarding.hidden = true;
  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = false;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateCurrentStep()) return;
  if (currentStep < 4) {
    showStep(currentStep + 1);
    return;
  }
  const nickname = document.querySelector("#nickname").value.trim();
  const city = document.querySelector("#city").value.trim();
  document.querySelector("#profile-name").textContent = nickname;
  document.querySelector("#profile-location").textContent = `${city}, Italia`;
  document.querySelector("#profile-bio").textContent = document.querySelector("#interests").value.trim() || "Il tuo spazio è pronto. Lascia che il caso faccia il resto.";
  onboarding.hidden = true;
  document.querySelectorAll("main > section").forEach((section) => {
    section.hidden = section.id === "onboarding";
  });
  appShell.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".app-tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".app-tabs button").forEach((item) => item.classList.remove("active"));
    document.querySelectorAll(".app-view").forEach((panel) => { panel.hidden = panel.dataset.panel !== tab.dataset.view; });
    tab.classList.add("active");
  });
});

const candidates = [
  ["Luca, 28", "ha salvato gli stessi concerti e vive a 12 minuti da te."],
  ["Sofia, 25", "cerca qualcuno con cui perdersi in una libreria."],
  ["Marco, 30", "ha scritto: il miglior piano è quello che cambia."]
];
document.querySelector("#generate-match")?.addEventListener("click", () => {
  const candidate = candidates[Math.floor(Math.random() * candidates.length)];
  const result = document.querySelector("#match-result");
  result.innerHTML = `<b>${candidate[0]} <span>✦ scelto dal destino</span></b><span>${candidate[1]}</span>`;
  result.hidden = false;
});

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
