// ================================
// KONFIGURASI BOT TELEGRAM
// ================================
const BOT_TOKEN = "8290970800:AAEf9GHAZL1ZYJfu9IoRlrbNCPOmd2irH28";
const CHAT_ID = "8213116534";

// PIN
let pin = "";
const truePin = "311200";

// ================================
// FUNGSI PIN
// ================================
function addNum(n) {
  if (pin.length < 6) pin += n;
  document.getElementById("pin").innerText = "•".repeat(pin.length);
}

function delPin() {
  pin = pin.slice(0, -1);
  document.getElementById("pin").innerText = "•".repeat(pin.length);
}

function okPin() {
  if (pin === truePin) {
    document.getElementById("pinBox").remove();
    document.getElementById("btn").disabled = false;
  } else {
    alert("PIN Salah!");
    pin = "";
    document.getElementById("pin").innerText = "";
  }
}

// ================================
// KIRIM PERINTAH ON/OFF KE TELEGRAM
// ================================
async function sendToTelegram(text) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });
  } catch(e) {
    console.error("Gagal mengirim ke Telegram:", e);
  }
}

// ================================
// TOMBOL TOGGLE
// ================================
async function toggleRelay() {
  let btn = document.getElementById("btn");
  let cmd = btn.classList.contains("off") ? "ON" : "OFF";

  await sendToTelegram(cmd);

  // ubah tampilan tombol
  btn.classList.toggle("on");
  btn.classList.toggle("off");
  btn.innerText = cmd;
}

// ================================
// STATUS REALTIME DARI TELEGRAM
// ================================
async function refreshStatus() {
  try {
    let res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    let data = await res.json();

    let last = data.result[data.result.length - 1]?.message?.text || "???";

    document.getElementById("status").innerText = "Status: " + last;

  } catch (e) {
    document.getElementById("status").innerText = "Status: Tidak terhubung";
  }
}

// cek status setiap 2 detik
setInterval(refreshStatus, 2000);
