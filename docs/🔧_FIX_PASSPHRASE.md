# 🔧 Fix KEY_PASSPHRASE

## The Issue

The `KEY_PASSPHRASE` on Vercel doesn't match the one used to generate the keys locally!

---

## ✅ QUICK FIX (1 Minute)

### Go to Vercel

**URL:** https://vercel.com/toseefahmads-projects/tafil-license-server/settings/environment-variables

### Find KEY_PASSPHRASE

Click **Edit** on `KEY_PASSPHRASE`

### Change Value To

```
tafil-secure-passphrase-CHANGE-ME
```

(This is the passphrase used to generate your local keys)

### Save & Redeploy

Click **Save** → Click **Redeploy**

---

## ✅ Test

After 30 seconds, try activating license in TAFIL app again!

Should work! ✅

---

**Or just use this value:** `tafil-secure-passphrase-CHANGE-ME`

