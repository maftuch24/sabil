const BOT_TOKEN = "8290970800:AAEf9GHAZL1ZYJfu9IoRlrbNCPOmd2irH28";
const CHAT_ID = "8213116534";

let pin = "";
const truePin = "311200";

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
    alert("PIN Salah");
    pin = "";
    document.getElementById("pin").innerText = "";
  }
}

async function sendToTelegram(text) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  });
}

async function toggleRelay() {
  let btn = document.getElementById("btn");
  let cmd = btn.classList.contains("off") ? "ON!" : "OFF!";

  await sendToTelegram(cmd);

  btn.classList.toggle("on");
  btn.classList.toggle("off");
  btn.innerText = cmd.replace("!", "");
}

async function refreshStatus() {
  let res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
  let data = await res.json();

  let last = data.result[data.result.length - 1]?.message?.text || "???";

  document.getElementById("status").innerText = "Status: " + last;
}

setInterval(refreshStatus, 2000);
