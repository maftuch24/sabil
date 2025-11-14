const BOT_TOKEN = "8290970800:AAEf9GHAZL1ZYJfu9IoRlrbNCPOmd2irH28";
const CHAT_ID = "8213116534";

let pin = "";
const truePin = "311200";

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
    alert("PIN Salah");
    pin = "";
    document.getElementById("pin").innerText = "";
  }
}

async function toggleRelay() {
  let btn = document.getElementById("btn");
  let cmd = btn.classList.contains("off") ? "CMD:ON" : "CMD:OFF";

  // HANYA KIRIM COMMAND — TIDAK READ UPDATES
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${cmd}`);

  // Ubah tampilan tombol
  btn.classList.toggle("on");
  btn.classList.toggle("off");
  btn.innerText = cmd.replace("CMD:", "");
}
