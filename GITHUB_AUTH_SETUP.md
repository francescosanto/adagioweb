# 🔐 Configurazione Autenticazione GitHub

## ⚠️ Problema Rilevato

Il comando `git push` sta fallendo con l'errore "Repository not found". Questo può essere dovuto a:

1. **Repository non ancora completamente creato** (aspetta 5-10 minuti)
2. **Problema di autenticazione** (token scaduto o mancante)
3. **URL del repository non corretto**

## 🚀 Soluzioni

### Soluzione 1: Aspetta e riprova

GitHub a volte ha bisogno di tempo per creare completamente il repository:

```bash
# Aspetta 5-10 minuti, poi riprova
git push -u origin main
```

### Soluzione 2: Verifica l'URL del repository

1. Vai su [https://github.com/adagiosevilla/adagio-website](https://github.com/adagiosevilla/adagio-website)
2. Verifica che il repository sia visibile e accessibile
3. Controlla che l'URL sia esattamente: `https://github.com/adagiosevilla/adagio-website.git`

### Soluzione 3: Configura autenticazione con token

Se il problema persiste, configura un token di accesso personale:

1. **Crea un token GitHub:**
   - Vai su GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Clicca "Generate new token (classic)"
   - Seleziona i permessi: `repo`, `workflow`
   - Copia il token generato

2. **Configura Git con il token:**
   ```bash
   # Sostituisci USERNAME e TOKEN con i tuoi valori
   git remote set-url origin https://USERNAME:TOKEN@github.com/adagiosevilla/adagio-website.git
   
   # Esempio:
   git remote set-url origin https://adagiosevilla:ghp_xxxxxxxxxxxx@github.com/adagiosevilla/adagio-website.git
   ```

3. **Prova di nuovo il push:**
   ```bash
   git push -u origin main
   ```

### Soluzione 4: Usa SSH invece di HTTPS

Se preferisci usare SSH:

```bash
# Cambia l'URL del remote
git remote set-url origin git@github.com:adagiosevilla/adagio-website.git

# Prova il push
git push -u origin main
```

## 🔍 Verifica Stato Repository

Per verificare lo stato attuale:

```bash
# Controlla i remote configurati
git remote -v

# Controlla lo stato
git status

# Controlla i branch
git branch -a
```

## 📞 Se il problema persiste

1. **Verifica che il repository sia pubblico** (per GitHub Pages gratuito)
2. **Controlla i permessi** del tuo account GitHub
3. **Prova a creare un nuovo repository** con un nome diverso
4. **Contatta il supporto GitHub** se necessario

---

**Nota**: Il repository deve essere completamente creato prima di poter pushare il codice. Aspetta qualche minuto e riprova!
