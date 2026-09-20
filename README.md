# DESTINY

Landing page concept per DESTINY, un modo più umano e sorprendente di incontrarsi.

## Cosa contiene

- Landing orientata al prodotto, con profili visuali e linguaggio social/dating
- Onboarding progressivo in 4 step: nickname, età/zona, interessi e email
- Spazio profilo personale separato dalla landing, con bio, statistiche e modifica futura
- Tab "Destiny per te" con motore concettuale che genera connessioni casuali
- Tab Collection con archivio privato delle Connection Photos
- Informazioni su privacy, posizione approssimativa, blocco/segnalazione e sicurezza del concept

## Sviluppo

Il progetto usa solo HTML, CSS e JavaScript vanilla:

```text
index.html
styles.css
script.js
```

Apri `index.html` direttamente nel browser per un'anteprima locale. Non è richiesto un server di sviluppo o un processo di build.

L'onboarding e il profilo sono volutamente front-end-only: validano i campi nel browser e costruiscono una schermata profilo locale senza inviare, salvare o persistere dati. Il "DESTINY engine" è un placeholder di prodotto che seleziona demo localmente; non è un'AI reale e non esiste ancora un backend di matching, messaggistica o upload. Le persone e le immagini della Collection sono elementi demo del concept; non c'è geolocalizzazione precisa o servizio attivo.

## GitHub Pages

I file statici si trovano alla root e sono già compatibili con GitHub Pages. Nelle impostazioni del repository seleziona **Settings → Pages → Deploy from a branch**, scegli la branch e la cartella `/ (root)`.
