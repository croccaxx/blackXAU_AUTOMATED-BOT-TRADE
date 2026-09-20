# DESTINY

Landing page concept per DESTINY, un modo più umano e sorprendente di incontrarsi.

## Cosa contiene

- Landing orientata al prodotto, con profili visuali e linguaggio social/dating
- Accesso e registrazione con email e password
- Onboarding progressivo in 4 step: nickname, età/zona, interessi e email
- Spazio profilo personale separato dalla landing, con bio, statistiche e navigazione dedicata
- Sezioni separate Home, Scopri, Messaggi, Collection e Profilo
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

L'accesso, l'onboarding e il profilo sono una simulazione front-end: l'account, la sessione e il profilo vengono conservati in `localStorage` per non perderli nello stesso browser. Non vengono inviati a un server. Per un prodotto reale serviranno backend, password hashate, sessioni sicure e recupero account; non usare questa demo per credenziali reali. Il "DESTINY engine" è un placeholder che seleziona demo localmente; non è un'AI reale e non esiste ancora un backend di matching, messaggistica o upload. Le persone e le immagini della Collection sono elementi demo del concept; non c'è geolocalizzazione precisa o servizio attivo.

## GitHub Pages

I file statici si trovano alla root e sono già compatibili con GitHub Pages. Nelle impostazioni del repository seleziona **Settings → Pages → Deploy from a branch**, scegli la branch e la cartella `/ (root)`.
