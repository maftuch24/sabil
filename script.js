const PIN_BENAR = "123456";

function cekPin() {
    let pin = document.getElementById("pin").value;
    if (pin === PIN_BENAR) {
        document.getElementById("kontrol").classList.remove("hidden");
    } else {
        alert("PIN salah");
    }
}

function kirim(data) {
    Telegram.WebApp.sendData(data);
    Telegram.WebApp.close();
}

Telegram.WebApp.ready();
