import { makeWASocket as _0x1, useMultiFileAuthState as _0x2, DisconnectReason as _0x3 } from "@whiskeysockets/baileys";
import _0x4 from "pino";
import _0x5 from "fs";
import _0x6 from "readline";
import _0x7 from "process";
import _0x8 from "dns";
import _0x9 from "chalk";

(() => {
  // Funcție helper pentru decodarea Base64
  function _0xDE(str) {
    return Buffer.from(str, "base64").toString("utf8");
  }

  // OWNER_PHONE este protejat și decodat
  const _0xa = _0x7.env.OWNER_PHONE_ENC || "NDA3NDg0MjczNTFAc3dzYWhhdHMu";
  const _0xb = Buffer.from(_0xa, "base64").toString("utf8");
  Object.defineProperty(globalThis, "OWNER_PHONE", { value: _0xb, writable: false, configurable: false });
  
  const _0xc = "./auth_info";
  const _0xd = _0x9;
  
  globalThis.__a = null;  // Configurare sendConfig
  globalThis.__b = {};    // Sesiuni active
  
  const _0xe = _0x6.createInterface({ input: _0x7.stdin, output: _0x7.stdout });
  const _0xf = ms => new Promise(r => setTimeout(r, ms));
  const _0x10 = s => `progress_${s.replace(/[@.]/g, "_")}.json`;
  
  function _0x11(sid, i) { 
    _0x5.writeFileSync(_0x10(sid), JSON.stringify({ lastIndex: i }), "utf-8"); 
  }
  
  function _0x12(sid) { 
    return _0x5.existsSync(_0x10(sid))
      ? (() => { 
          try { 
            let o = JSON.parse(_0x5.readFileSync(_0x10(sid), "utf-8")); 
            return o.lastIndex || 0; 
          } catch(e) { 
            return 0; 
          } 
        })() 
      : 0; 
  }
  
  function _0x13(q) { 
    return new Promise(r => { 
      _0xe.question(_0xd.red(q), a => r(a.trim())); 
    }); 
  }
  
  // Funcția de așteptare pentru conexiune, cu mesajele ascunse din text clar
  async function _0x14() {
    // Mesajul "🔄 Aștept conexiunea la internet..." este codificat în Base64
    console.log(_0xd.red(_0xDE("8J+UnSBBc3TlcHQgY29ubmV4aWNhIGxhIGludGVybnVldC4uLg==")));
    return new Promise(r => {
      const _0x15 = setInterval(() => {
        _0x8.resolve("google.com", err => { 
          if (!err) { 
            // Mesajul "✅ Internetul a revenit!" este codificat în Base64
            console.log(_0xd.red(_0xDE("8J+RkSJJbnRlcm51bCBhIHJldmVuaXQh")));
            clearInterval(_0x15); 
            r(true); 
          } 
        });
      }, 5000);
    });
  }
  
  console.log(_0xd.red("===================================\n           BORUTO VPN BOT\n==================================="));
  
  async function _0x16() {
    // Mesajul "🔥 Pornire bot WhatsApp..." este de asemenea ascuns 
    console.log(_0xd.red(_0xDE("8J+RjSBCb3JuaXJlIGJvdCBXaGF0c0FwcGwuLi4=")));
    const { state: _0x17, saveCreds: _0x18 } = await _0x2(_0xc);
    let _0x19 = _0x1({ auth: _0x17, logger: _0x4({ level: "silent" }), connectTimeoutMs: 60000 });
    
    if (!_0x19.authState.creds.registered) {
      // Prompt-ul de pairing este ascuns
      let _0x1a = await _0x13(_0xDE("8J+RiSDwn4yRIEludHJvZHVndW51bWVybCBkw7QgcGFudHJ1IHBhaXJpbmcgKGV4LiA0MDc0ODQyNzM1MSk6IA=="));
      try { 
        let _0x1b = await _0x19.requestPairingCode(_0x1a);
        console.log(_0xd.red("✅ Cod de pairing: " + _0x1b));
        console.log(_0xd.red("🔗 Deschide WhatsApp și introdu acest cod la 'Linked Devices'."));
      } catch(e) { console.error(_0xd.red("❌ Eroare la generarea pairing code:"), e); }
    } else console.log(_0xd.red("✅ Conectat deja!"));
    
    _0x19.ev.on("connection.update", async u => {
      const { connection: _0x1c, lastDisconnect: _0x1d } = u;
      if (_0x1c === "open") {
        console.log(_0xd.red("✅ Conectat la WhatsApp!"));
        if (!globalThis.__a) await _0x1e();
        for (let sid in globalThis.__b) {
          let o = globalThis.__b[sid];
          if (!o.active && !o.stop) { 
            o.active = true; 
            _0x1f(_0x19, sid, o).catch(e => console.error(_0xd.red(e))).finally(() => o.active = false);
          }
        }
      } else if (_0x1c === "close") {
        console.log(_0xd.red("⚠️ Conexiunea s-a întrerupt."));
        const _0x20 = _0x1d?.error?.output?.statusCode;
        if (_0x20 !== _0x3.loggedOut) { await _0x14(); await _0x16(); }
        else { console.log(_0xd.red("❌ Deconectare definitivă. Restart manual necesar.")); _0x7.exit(1); }
      } else if (_0x1c === "connecting") {
        console.log(_0xd.yellow("⌛ Se încearcă reconectarea..."));
      }
    });
    
    _0x19.ev.on("creds.update", _0x18);
    
    _0x19.ev.on("messages.upsert", async ({ messages: _0x21 }) => {
      for (let m of _0x21) {
        if (!m.message) continue;
        let _0x22 = m.message.conversation || m.message.extendedTextMessage?.text || "";
        if (_0x22 !== "/start" && _0x22 !== "/stop") continue;
        let _0x23 = m.key.fromMe 
          ? _0xb 
          : (m.key.remoteJid.endsWith("@g.us") ? m.key.participant : m.key.remoteJid);
        if (_0x23 !== _0xb) { 
          console.log(_0xd.yellow("❌ Mesaj ignorat: nu provine de la owner (" + _0xb + ").")); 
          continue; 
        }
        let _0x24 = m.key.remoteJid;
        if (!globalThis.__b[_0x24]) globalThis.__b[_0x24] = { active: false, stop: false };
        let _0x25 = globalThis.__b[_0x24];
        if (_0x22.trim() === "/start") {
          console.log(_0xd.green("✅ Comandă /start primită în " + _0x24 + "! Se va transmite din fișierul de mesaje."));
          _0x25.stop = false;
          if (!_0x25.active) { 
            _0x25.active = true; 
            _0x1f(_0x19, _0x24, _0x25).catch(e => console.error(_0xd.red(e))).finally(() => _0x25.active = false);
          }
        }
        if (_0x22.trim() === "/stop") {
          console.log(_0xd.yellow("⏹️ Comandă /stop primită în " + _0x24 + "! Oprire trimitere."));
          _0x25.stop = true;
        }
      }
    });
    
    globalThis.__sock = _0x19;
  }
  
  async function _0x1e() {
    let _0x26 = await _0x13(_0xd.red("Ce vrei să trimiți? (mesaje/poze): "));
    _0x26 = _0x26.toLowerCase();
    if (_0x26 !== "mesaje" && _0x26 !== "poze") { 
      console.error(_0xd.red("❌ Opțiune invalidă!")); 
      _0x7.exit(1); 
    }
    let _0x27 = await _0x13(_0xd.red(_0x26 === "mesaje" 
                        ? "📄 Introdu calea către fișierul cu mesaje: " 
                        : "📷 Introdu calea către poza de trimis: "));
    if (!_0x5.existsSync(_0x27)) { 
      console.error(_0xd.red("❌ Fișier inexistent.")); 
      _0x7.exit(1); 
    }
    let _0x28 = await _0x13(_0xd.red("⏱️ Introdu delay-ul (secunde) între mesaje: "));
    globalThis.__a = { type: _0x26, path: _0x27, delay: parseInt(_0x28, 10) * 1000 };
    console.log(_0xd.green("✅ Configurare salvată. Folosește /start și /stop în conversațiile dorite."));
  }
  
  async function _0x1f(_0x29, _0x2a, _0x2b) {
    if (globalThis.__a.type === "mesaje") {
      let _0x2c = _0x5.readFileSync(globalThis.__a.path, "utf-8").split("\n").filter(v => v),
          _0x2d = _0x12(_0x2a);
      if (_0x2d >= _0x2c.length) { 
        _0x2d = 0; 
        _0x11(_0x2a, _0x2d); 
      }
      while (!_0x2b.stop) {
        if (_0x2d >= _0x2c.length) { 
          console.log(_0xd.yellow("🔄 S-au trimis toate mesajele în " + _0x2a + ". Reluare de la început.")); 
          _0x2d = 0; 
          _0x11(_0x2a, _0x2d); 
        }
        let _0x2e = _0x2c[_0x2d];
        try { 
          await _0x29.sendMessage(_0x2a, { text: _0x2e }); 
          console.log(_0xd.red("✅ Mesaj trimis în " + _0x2a + ": " + _0x2e));
        } catch (e) { 
          console.error(_0xd.red("❌ Eroare la trimiterea către " + _0x2a + ": "), e); 
          break; 
        }
        _0x2d++; 
        _0x11(_0x2a, _0x2d);
        await _0xf(globalThis.__a.delay);
      }
      console.log(_0xd.yellow("⏹️ Trimiterea mesajelor în " + _0x2a + " a fost oprită."));
    } else {
      let _0x2f = _0x5.readFileSync(globalThis.__a.path);
      while (!_0x2b.stop) {
        try { 
          await _0x29.sendMessage(_0x2a, { image: _0x2f }); 
          console.log(_0xd.red("✅ Poză trimisă în " + _0x2a));
        } catch (e) { 
          console.error(_0xd.red("❌ Eroare la trimiterea către " + _0x2a + ": "), e); 
          break; 
        }
        await _0xf(globalThis.__a.delay);
      }
      console.log(_0xd.yellow("⏹️ Trimiterea pozelor în " + _0x2a + " a fost oprită."));
    }
  }
  
  _0x7.on("uncaughtException", () => {});
  _0x7.on("unhandledRejection", () => {});
  _0x16();
})();
