# 🚀 Configurazione GitHub e Pubblicazione Sito

## 📋 Passi per Pubblicare il Sito su GitHub

### 1. Creare il Repository su GitHub

1. Vai su [GitHub.com](https://github.com) e accedi al tuo account
2. Clicca su "New repository" (pulsante verde)
3. Configura il repository:
   - **Repository name**: `adagio-website`
   - **Description**: Sito web ufficiale del Ristorante Adagio
   - **Visibility**: Public (per GitHub Pages gratuito)
   - **Initialize with**: NON selezionare nulla (abbiamo già i file)
4. Clicca "Create repository"

### 2. Collegare il Repository Locale

```bash
# Aggiungi il remote origin (sostituisci USERNAME con il tuo username GitHub)
git remote add origin https://github.com/USERNAME/adagio-website.git

# Rinomina il branch principale in 'main' (standard GitHub)
git branch -M main

# Pusha il codice
git push -u origin main
```

### 3. Configurare GitHub Pages

1. Nel repository GitHub, vai su **Settings**
2. Scorri fino a **Pages** nella sidebar sinistra
3. In **Source**, seleziona **Deploy from a branch**
4. In **Branch**, seleziona **gh-pages** e **/(root)**
5. Clicca **Save**

### 4. Abilitare GitHub Actions

1. Nel repository, vai su **Actions**
2. Seleziona il workflow "Deploy to GitHub Pages"
3. Clicca **Run workflow**
4. Seleziona il branch **main** e clicca **Run workflow**

### 5. Deploy Automatico

Dopo aver configurato tutto, ogni volta che fai push al branch `main`:

```bash
# Fai le modifiche ai file
git add .
git commit -m "Aggiornamento sito"
git push origin main
```

Il sito si aggiornerà automaticamente su GitHub Pages!

## 🌐 URL del Sito

Il tuo sito sarà disponibile su:
`https://USERNAME.github.io/adagio-website`

## ⚠️ Note Importanti

- **Chiavi API**: Non committare mai le chiavi API nel repository pubblico
- **File Sensibili**: Il file `.gitignore` esclude già i file sensibili
- **Build**: Il sito viene buildato automaticamente da GitHub Actions
- **Aggiornamenti**: Ogni push al branch `main` triggera un nuovo deploy

## 🔧 Risoluzione Problemi

### Se il sito non si carica:
1. Controlla che GitHub Pages sia abilitato
2. Verifica che il workflow GitHub Actions sia completato
3. Aspetta qualche minuto per la propagazione

### Se le immagini non si caricano:
1. Verifica che i percorsi delle immagini siano corretti
2. Controlla che le immagini siano nel repository
3. Assicurati che i nomi dei file non abbiano spazi

## 📞 Supporto

Per problemi tecnici, controlla:
- I log di GitHub Actions
- Le impostazioni di GitHub Pages
- La console del browser per errori JavaScript

---

**Buon deploy! 🎉**
