const BOT_TOKEN = "8290970800:AAEf9GHAZL1ZYJfu9IoRlrbNCPOmd2irH28";
const CHAT_ID   = "8213116534";

let pin = "";
const truePin = "311200";

// ---------------- PIN -----------------
function addNum(n) {
  if (pin.length < 6) pin += n;
  document.getElementById("pin").innerText = "••••••".slice(0, pin.length);
}

function delPin() {
  pin = pin.slice(0, -1);
  document.getElementById("pin").innerText = "••••••".slice(0, pin.length);
}

function okPin() {
  if (pin === truePin) {
    document.getElementById("pinBox").remove();
    document.getElementById("btn").disabled = false;
  } else {
    alert("PIN salah");
    pin = "";
    document.getElementById("pin").innerText = "";
  }
}

// ---------------- KIRIM PERINTAH -----------------
async function toggleRelay() {
  let btn = document.getElementById("btn");

  let cmd = btn.classList.contains("off") ? "CMD:ON" : "CMD:OFF";

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${cmd}`);

  // update UI langsung
  if (cmd === "CMD:ON") {
    btn.classList.remove("off");
    btn.classList.add("on");
    btn.innerText = "ON";
  } else {
    btn.classList.remove("on");
    btn.classList.add("off");
    btn.innerText = "OFF";
  }
}

// ---------------- STATUS REALTIME -----------------
async function refreshStatus() {
  try {
    let res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    let data = await res.json();

    let last = data.result?.[data.result.length - 1]?.message?.text || "???";

    if (last.startsWith("STATUS")) {
      document.getElementById("status").innerText = last;
    }
  } catch (e) {
    console.log("Error:", e);
  }
}

setInterval(refreshStatus, 2000);
