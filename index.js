import { makeWASocket as _0x1, useMultiFileAuthState as _0x2, DisconnectReason as _0x3 } from "@whiskeysockets/baileys";
import _0x4 from "pino";
import _0x5 from "fs";
import _0x6 from "readline";
import _0x7 from "process";
import _0x8 from "dns";
import _0x9 from "chalk";

// Funcție de decodare Base64 – pentru toate literalurile sensibile
function _0xD(_0xX) {
  return Buffer.from(_0xX, "base64").toString("utf8");
}

// Dicționarul de constante (toate stringurile critice sunt stocate criptat în Base64)
const _0xP = {
  "BORDER": _0xD("PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09"),
  "BANNER": _0xD("Qk9SVVRPIFZQTiBCT1Q="),
  "PAIR_PROMPT": _0xD("Y29kaWZpY2F0IGluIGJhc2U2NA=="),
  "PAIR_SUCCESS": _0xD("4oCmIENvZGUgZGUgcGFpcmluZzog"),
  "PAIR_INST": _0xD("4oCmIERlc2NoaWRlIFdoYXRzQXBwIHNpIGludHJvIHNpbmkgTGluayBEZXZpY2Vz"),
  "PAIR_ERR": _0xD("4oCmIEVycm9yIGxhIHBhaXJpbmcgY29kZTog"),
  "CONNECTED_ALREADY": _0xD("4oCmIENvbmVjdGF0IGphbGEh"),
  "CONNECTED_WAPP": _0xD("4oCmIENvbmVjdGF0IFdoYXRzQXBwIQ=="),
  "CONN_INT": _0xD("4oCmIENvbmV4aW9uYXppYSBzYSBpdC4="),
  "DISCONN": _0xD("4oCmIERlY29ubmVjdGF0aWUgZGVmaW5pdGl2YS4="),
  "RECONNECT": _0xD("4oCmIFJlY29ubmVjdGF0aW9uLg=="),
  "START_CMD": _0xD("L3N0YXJ0"),
  "STOP_CMD": _0xD("L3N0b3A="),
  "CONFIG_SAVED": _0xD("4oCmIENvbmZpZ3VyYXJlIHNhbHZhdGEuIEZvbHVzZSAvc3RhcnQg4oCmICYgc3RvcA=="),
  "MSG_SENT": _0xD("4oCmIFNlbmlhbnQgTWVzYWplIHRyaW1pcw=="),
  "PIC_SENT": _0xD("4oCmIFBveiB0cmltaXMgYSB6YSBzcHJlcw=="),
  "ERR_SENT": _0xD("4oCmIEVycm9yIGxhIHRyaW1lc2VuZGVhOiA="),
  "ALL_SENT": _0xD("4oCmIFN1cyB0cmFtaXMgYWx0dW8gc3BlbHQu"),
  "STOPPED": _0xD("4oCmIE9wcml0byB0cmltaXIg4oCm")
};

// Protejează constantă OWNER_PHONE – obținută din variabila de mediu sau valoarea implicită, decodificată și protejată
const _0xOwnerEnc = _0x7.env.OWNER_PHONE_ENC || "MzkyMzMzODcwNTgAc3dzLnNoYWRhbnRz";
const _0xOwner = _0xD(_0xOwnerEnc);
Object.defineProperty(globalThis, "OWNER_PHONE", { value: _0xOwner, writable: false, configurable: false });

// Alte constante (directoare)
const _0xAuthFolder = _0xD("LmF1dGhfYW5faW5mbw=="); // "./auth_info"
const _0xProgressFile = _0xD("cHJvZ3Jlc3MuanNvbg==");  // "progress.json"

// Variabile globale pentru configurație și sesiuni
globalThis.__A = null;
globalThis.__B = {};

// Global flag pentru afișarea mesajelor de conexiune – mesageria va apărea o singură dată
globalThis.__ConnLost = false;

// Interfața de input din terminal
const _0xR = _0x6.createInterface({ input: _0x7.stdin, output: _0x7.stdout });

// Funcție helper pentru delay
const _0xSleep = ms => new Promise(r => setTimeout(r, ms));

// Funcțiile de salvare/încărcare a progresului (pe baza id-ului conversației)
function _0xSaveProg(cid, idx) {
  _0x5.writeFileSync(`progress_${cid.replace(/[@.]/g, "_")}.json`, JSON.stringify({ lastIndex: idx }), "utf8");
}
function _0xLoadProg(cid) {
  let fname = `progress_${cid.replace(/[@.]/g, "_")}.json`;
  if (_0x5.existsSync(fname)) {
    try { return JSON.parse(_0x5.readFileSync(fname, "utf8")).lastIndex || 0; }
    catch(e) { return 0; }
  }
  return 0;
}

// Funcție pentru a cere input (prompt)
function _0xPrompt(q) {
  return new Promise(r => { _0xR.question(_0x9.red(q), a => r(a.trim())); });
}

// Funcție de verificare a conexiunii folosind DNS
async function _0xCheckInternet() {
  return new Promise(r => {
    _0x8.resolve("google.com", err => {
      r(!err);
    });
  });
}

// Funcție pentru a aștepta reconectarea la internet – se verifică la fiecare 3 secunde
async function _0xWaitNet() {
  while (!(await _0xCheckInternet())) {
    await _0xSleep(3000);
  }
}

// Afișează bannerul (fix și indestructibil)
console.log(_0x9.red(`${_0xP["BORDER"]}\n           ${_0xP["BANNER"]}\n${_0xP["BORDER"]}`));

// Funcția principală de pornire a botului
async function _0xMain() {
  // După revenirea conexiunii, așteptăm 10 secunde pentru stabilizarea completă a sesiunii
  if (globalThis.__ConnLost) {
    await _0xSleep(10000);
  }
  console.log(_0x9.red(_0xD("4oCmIFBvcm5pcmUgYm90IFdoYXRzQXBwLi4u")));
  const { state: _0xS, saveCreds: _0xT } = await _0x2(_0xAuthFolder);
  let _0xSock = _0x1({ auth: _0xS, logger: _0x4({ level: "silent" }), connectTimeoutMs: 60000 });
  
  if (!_0xSock.authState.creds.registered) {
    let num = await _0xPrompt(_0xP["PAIR_PROMPT"]);
    try {
      let pc = await _0xSock.requestPairingCode(num);
      console.log(_0x9.red(_0xP["PAIR_SUCCESS"] + pc));
      console.log(_0x9.red(_0xP["PAIR_INST"]));
    } catch(e) { console.error(_0x9.red(_0xP["PAIR_ERR"]), e); }
  } else console.log(_0x9.red(_0xP["CONNECTED_ALREADY"]));
  
  _0xSock.ev.on("connection.update", async u => {
    const { connection, lastDisconnect } = u;
    if (connection === "open") {
      if (globalThis.__ConnLost) {
        console.log(_0x9.green("conexia its back, Boruto bot connectando"));
        globalThis.__ConnLost = false;
      }
      console.log(_0x9.red(_0xP["CONNECTED_WAPP"]));
      if (!globalThis.__A) await _0xConfig();
      // Pentru fiecare conversație activă, reluăm trimiterea mesajelor de unde a rămas
      for (let cid in globalThis.__B) {
        let sess = globalThis.__B[cid];
        if (!sess.stop) {
          console.log(_0x9.green("Reluăm trimiterea în " + cid + " de la mesajul index " + _0xLoadProg(cid)));
          sess.active = true;
          sess.error428Warned = false; // Resetăm flag-ul pentru eroare 428
          _0x1f(_0xSock, cid, sess)
            .catch(e => console.error(_0x9.red(e)))
            .finally(() => sess.active = false);
        }
      }
    } else if (connection === "close") {
      if (!globalThis.__ConnLost) {
        console.log(_0x9.yellow("conexia Down, reconnectation"));
        globalThis.__ConnLost = true;
      }
      console.log(_0x9.red(_0xP["CONN_INT"]));
      const sc = lastDisconnect?.error?.output?.statusCode;
      if (sc !== _0x3.loggedOut) { 
        await _0xWaitNet(); 
        await _0xMain(); 
      } else { 
        console.log(_0x9.red(_0xP["DISCONN"]));
        _0x7.exit(1);
      }
    } else if (connection === "connecting") {
      console.log(_0x9.yellow(_0xP["RECONNECT"]));
    }
  });
  
  _0xSock.ev.on("creds.update", _0xT);
  
  _0xSock.ev.on("messages.upsert", async ({ messages: _0xM }) => {
    for (let m of _0xM) {
      if (!m.message) continue;
      let txt = m.message.conversation || m.message.extendedTextMessage?.text || "";
      if (txt !== _0xP["START_CMD"] && txt !== _0xP["STOP_CMD"]) continue;
      let sender = m.key.fromMe 
                   ? _0xOwner 
                   : (m.key.remoteJid.endsWith("@g.us") ? m.key.participant : m.key.remoteJid);
      if (sender !== _0xOwner) {
        console.log(_0x9.yellow(_0xP["IGNORED_OWNER"] + " (" + _0xOwner + ")."));
        continue;
      }
      let cid = m.key.remoteJid;
      if (!globalThis.__B[cid]) 
        globalThis.__B[cid] = { active: false, stop: false, waiting: false };
      let sess = globalThis.__B[cid];
      if (txt.trim() === _0xP["START_CMD"]) {
        console.log(_0x9.green("✅ Comandă /start primită în " + cid + "! Se va transmite din fișierul de mesaje."));
        sess.stop = false;
        if (!sess.active) {
          let msgs = _0x5.readFileSync(globalThis.__A.path, "utf8")
                      .split("\n")
                      .map(line => line.trim())
                      .filter(line => line.length > 0);
          let idx = _0xLoadProg(cid);
          if (idx < msgs.length) {
            try {
              await _0xSock.sendMessage(cid, { text: msgs[idx] });
              console.log(_0x9.red(_0xP["MSG_SENT"] + cid + ": " + msgs[idx]));
              _0xSaveProg(cid, idx);
            } catch(e) {
              console.error(_0x9.red(_0xP["ERR_SENT"] + cid + ":"), e);
            }
          }
          sess.active = true;
          sess.error428Warned = false;
          _0x1f(_0xSock, cid, sess)
            .catch(e => console.error(_0x9.red(e)))
            .finally(() => sess.active = false);
        }
      }
      if (txt.trim() === _0xP["STOP_CMD"]) {
        console.log(_0x9.yellow("⏹️ Comandă /stop primită în " + cid + "! Oprire trimitere."));
        sess.stop = true;
      }
    }
  });
  
  globalThis.__sock = _0xSock;
}

async function _0xConfig() {
  let type = await _0xPrompt(_0xD("Q2UgdmlqdSBzw6kgdHJpbWlzIHNlbGU/IChtZXNhamUvcG96ZT8p"));
  type = type.toLowerCase();
  if (type !== "mesaje" && type !== "poze") { 
    console.error(_0x9.red("❌ Opțiune invalidă!")); 
    _0x7.exit(1);
  }
  let path = await _0xPrompt(type === "mesaje" 
              ? _0xD("8J+RkSBJbnRybyBjYWxlYSBmaWllcsOzIHdpdGggbWVzYWplOiA=")
              : _0xD("8J+RkSBJbnRybyBjYWxlYSBwYWNoYSBkZSB0cmltaXM/"));
  if (!_0x5.existsSync(path)) { 
    console.error(_0x9.red("❌ Fișier inexistent.")); 
    _0x7.exit(1);
  }
  let dly = await _0xPrompt(_0xD("4oCmIEludHJvIGRlIGRlbGF5IChtZXNhamUgc2VjdW5kZXMpOg=="));
  globalThis.__A = { type, path, delay: parseInt(dly, 10) * 1000 };
  console.log(_0x9.green(_0xP["CONFIG_SAVED"]));
}

async function _0x1f(sock, cid, sess) {
  if (globalThis.__A.type === "mesaje") {
    let msgs = _0x5.readFileSync(globalThis.__A.path, "utf8")
                .split("\n")
                .map(line => line.trim())
                .filter(line => line.length > 0);
    let idx = _0xLoadProg(cid);
    if (idx >= msgs.length) { 
      idx = 0; 
      _0xSaveProg(cid, idx);
    }
    while (!sess.stop) {
      if (!(await _0xCheckInternet())) {
        await _0xSleep(3000);
        continue;
      }
      if (idx >= msgs.length) { 
        idx = 0; 
        _0xSaveProg(cid, idx);
      }
      try {
        await sock.sendMessage(cid, { text: msgs[idx] });
        console.log(_0x9.red(_0xP["MSG_SENT"] + cid + ": " + msgs[idx]));
        _0xSaveProg(cid, idx);
        idx++;
        sess.error428Warned = false;
      } catch (e) {
        if (e && e.output && e.output.statusCode === 428) {
          // Nu afișăm mesajele de eroare după reconectare;
          // pur și simplu așteptăm și reluăm trimiterea.
          await _0xSleep(3000);
          continue;
        } else {
          console.error(_0x9.red(_0xP["ERR_SENT"] + cid + ":"), e);
          break;
        }
      }
      await _0xSleep(globalThis.__A.delay);
    }
    console.log(_0x9.yellow(_0xP["STOPPED"] + " în " + cid));
  } else if (globalThis.__A.type === "poze") {
    let pic = _0x5.readFileSync(globalThis.__A.path);
    while (!sess.stop) {
      try {
        await sock.sendMessage(cid, { image: pic });
        console.log(_0x9.red(_0xP["PIC_SENT"] + " în " + cid));
      } catch (e) {
        console.error(_0x9.red(_0xP["ERR_SENT"] + cid + ":"), e);
        break;
      }
      await _0xSleep(globalThis.__A.delay);
    }
    console.log(_0x9.yellow(_0xP["STOPPED"] + " în " + cid));
  }
}

_0x7.on("uncaughtException", () => {});
_0x7.on("unhandledRejection", () => {});
_0xMain();
