const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const waitlistForm = document.querySelector("#waitlist-form");
const formStatus = document.querySelector("#form-status");

if (waitlistForm && formStatus) {
  waitlistForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const age = Number(document.querySelector("#age").value);
    const requiredFields = [...waitlistForm.querySelectorAll("[required]")];
    const missingField = requiredFields.find((field) => {
      if (field.type === "checkbox") return !field.checked;
      return !field.value.trim();
    });

    formStatus.className = "form-status";

    if (missingField) {
      formStatus.textContent = "Completa i campi segnati per entrare nella lista.";
      formStatus.classList.add("error");
      missingField.focus();
      return;
    }

    if (age < 18 || age > 99) {
      formStatus.textContent = "DESTINY è riservato a persone maggiorenni.";
      formStatus.classList.add("error");
      document.querySelector("#age").focus();
      return;
    }

    const email = document.querySelector("#email");
    if (!email.validity.valid) {
      formStatus.textContent = "Inserisci un indirizzo email valido.";
      formStatus.classList.add("error");
      email.focus();
      return;
    }

    formStatus.textContent = "Ci sei. Quando sarà il momento, ti troveremo.";
    formStatus.classList.add("success");
    waitlistForm.reset();
  });
}
