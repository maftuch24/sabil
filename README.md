[demo8.html](https://github.com/user-attachments/files/22721586/demo8.html)
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIS Admin: Pencatatan Pembayaran Siswa Multi-Tahun</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    
    <style>
        :root {
            --primary-color: #007bff; /* Biru */
            --primary-dark: #0056b3;
            --success-color: #28a745; 
            --danger-color: #dc3545; 
            --warning-color: #ffc107; 
            --light-bg: #f4f7f6; 
            --card-bg: #ffffff;
            --text-color: #333;
            --border-color: #dee2e6;
            --border-radius: 6px;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            color: var(--text-color);
            background-color: var(--light-bg);
            min-height: 100vh;
        }

        /* --- Global & Navigasi --- */
        .header {
            background-color: var(--primary-color);
            color: white;
            padding: 15px 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .container { padding: 20px; }
        .content-section {
            display: none;
            background-color: var(--card-bg);
            padding: 25px;
            border-radius: var(--border-radius);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
        }
        .content-section.active { display: block; }
        
        /* --- Dashboard Controls --- */
        .dashboard-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap; /* Agar responsif */
        }
        .search-input {
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            flex-grow: 1;
            min-width: 200px;
        }
        .year-selector {
            padding: 10px;
            border: 1px solid var(--primary-color);
            border-radius: var(--border-radius);
            background-color: var(--light-bg);
            font-weight: bold;
            color: var(--primary-color);
        }

        /* --- Tabel Styling --- */
        .table-wrapper { overflow-x: auto; }
        .main-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
            min-width: 1200px; 
        }
        .main-table th, .main-table td {
            padding: 12px 8px;
            border: 1px solid var(--border-color);
            text-align: center;
        }
        .main-table th { background-color: var(--light-bg); font-weight: 600; }
        
        /* Status Colors */
        .status-cell span { padding: 5px; border-radius: 4px; font-weight: bold; font-size: 12px; }
        .status-lunas { background-color: var(--success-color); color: white; }
        .status-belum { background-color: var(--danger-color); color: white; }
        .status-sebagian { background-color: var(--warning-color); color: var(--text-color); }

        /* Actions & Forms */
        .btn-action { background: none; border: none; cursor: pointer; margin: 0 3px; font-size: 16px; padding: 5px; }
        .btn-pay { color: var(--success-color); }
        .btn-edit { color: var(--primary-color); }
        .btn-delete { color: var(--danger-color); }
        .floating-button {
            position: fixed; bottom: 30px; right: 30px; width: 55px; height: 55px;
            background-color: var(--success-color); color: white; border-radius: 50%;
            text-align: center; line-height: 55px; font-size: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            cursor: pointer; z-index: 10;
        }

        /* Modal & Notification */
        .modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.5); display: none; justify-content: center;
            align-items: center; z-index: 100;
        }
        .modal-content { background: white; padding: 30px; border-radius: var(--border-radius); width: 90%; max-width: 500px; }
        .loading-overlay { 
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 255, 255, 0.8); display: none; align-items: center;
            justify-content: center; z-index: 9999; 
        }
        .spinner {
            border: 6px solid #f3f3f3; border-top: 6px solid var(--primary-color);
            border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .notification {
            position: fixed; top: 20px; right: 20px; padding: 15px; border-radius: var(--border-radius);
            color: white; display: none; z-index: 10000; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .notification.success { background-color: var(--success-color); }
        .notification.error { background-color: var(--danger-color); }

        /* Form Grid */
        .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
        .form-group input, .form-group select {
            width: 100%; padding: 10px; border: 1px solid var(--border-color);
            border-radius: var(--border-radius); box-sizing: border-box;
        }
        .btn-submit { padding: 10px 20px; background-color: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer; margin-top: 10px; }
        .btn-cancel { background-color: #6c757d; margin-left: 10px; }
    </style>
</head>
<body>

<div class="header">
    <div style="font-size: 20px; font-weight: bold;">SIS Admin</div>
    <nav>
        <a href="#" class="nav-link active" data-section="dashboard" onclick="switchSection(this, 'dashboard')">Dashboard</a>
        <a href="#" class="nav-link" data-section="laporan" onclick="switchSection(this, 'laporan')">Laporan & Statistik</a>
    </nav>
</div>

<div class="container">

    <div class="loading-overlay" id="loadingOverlay">
        <div class="spinner"></div>
        <p style="margin-top: 20px;">Memuat data dari SheetDB...</p>
    </div>
    
    <div class="notification" id="notification"></div>

    <div class="floating-button" onclick="showAddForm()" title="Tambah Data Siswa">
        <i class="fa fa-plus"></i>
    </div>

    <div id="dashboard" class="content-section active">
        <h2 id="dashboardTitle">Data Pembayaran Siswa</h2>
        
        <div class="dashboard-header">
            <input type="text" id="searchInput" class="search-input" placeholder="Cari Nama Siswa atau NIS..." onkeyup="filterTable(this.value)">
            <select id="yearSelector" class="year-selector" onchange="changeAcademicYear(this.value)"></select>
        </div>

        <div class="table-wrapper">
            <table class="main-table">
                <thead>
                    <tr>
                        <th style="width: 30px;">No</th>
                        <th style="width: 180px;">Nama</th>
                        <th style="width: 100px;">NIS</th>
                        <th colspan="12">Status Pembayaran (April - Maret)</th>
                        <th style="width: 100px;">Total Status</th>
                        <th style="width: 150px;">Aksi</th>
                    </tr>
                    <tr>
                        <th></th><th></th><th></th>
                        <th>Apr</th><th>Mei</th><th>Jun</th><th>Jul</th><th>Agu</th><th>Sep</th><th>Okt</th><th>Nov</th><th>Des</th><th>Jan</th><th>Feb</th><th>Mar</th>
                        <th></th><th></th>
                    </tr>
                </thead>
                <tbody id="paymentTableBody">
                    </tbody>
            </table>
        </div>
    </div>

    <div id="form_data" class="content-section">
        <h2 id="formTitle">Tambah Data Siswa Baru</h2>
        <form id="studentForm">
            <input type="hidden" id="studentId" name="No"> 
            <div class="form-grid">
                <div class="form-group"><label>Nama Siswa</label><input type="text" id="inputNama" name="Nama" required></div>
                <div class="form-group"><label>NIS</label><input type="text" id="inputNIS" name="NIS" required></div>
                <div class="form-group"><label>Jenis Kelamin</label><select id="inputJK" name="Jenis Kelamin"><option>Laki-laki</option><option>Perempuan</option></select></div>
                <div class="form-group"><label>Tempat Lahir</label><input type="text" id="inputTempatLahir" name="Tempat Lahir"></div>
                <div class="form-group"><label>Tanggal Lahir (YYYY-MM-DD)</label><input type="date" id="inputTanggalLahir" name="Tanggal Lahir"></div>
                <div class="form-group"><label>Alamat Siswa</label><input type="text" id="inputAlamat" name="Alamat"></div>
                <div class="form-group"><label>Kota</label><input type="text" id="inputKota" name="Kota"></div>
                <div class="form-group"><label>Provinsi</label><input type="text" id="inputProvinsi" name="Provinsi"></div>
                <div class="form-group"><label>No HP Wali</label><input type="text" id="inputNoHP" name="No HP"></div>
                <div class="form-group"><label>Nama Wali</label><input type="text" id="inputNamaWali" name="Nama Wali" required></div>
                <div class="form-group"><label>Pekerjaan Wali</label><input type="text" id="inputPekerjaanWali" name="Pekerjaan Wali"></div>
                <div class="form-group"><label>Alamat Wali</label><input type="text" id="inputAlamatWali" name="Alamat Wali"></div>
                <div class="form-group"><label>Keterangan (Status)</label><select id="inputKeterangan" name="Keterangan"><option>Aktif</option><option>Nonaktif</option></select></div>
            </div>
            
            <button type="submit" class="btn-submit" id="submitButton">Simpan Data</button>
            <button type="button" class="btn-submit btn-cancel" onclick="switchSection(document.querySelector('.nav-link[data-section=\'dashboard\']'), 'dashboard')">Batal</button>
        </form>
    </div>

    <div id="laporan" class="content-section">
        <h2>Laporan & Statistik Pembayaran</h2>
        <p>Data ini diambil dari sheet "riwayat pembayaran & laporan statistik" (asumsi sheet 6).</p>

        <div class="dashboard-header" style="flex-direction: row;">
            <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; flex-grow: 1;">
                Total Siswa Lunas (12 bulan): <strong id="statsLunas">0</strong>
            </div>
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 6px; flex-grow: 1;">
                Total Siswa Belum Lunas (Sebagian & Nol): <strong id="statsBelum">0</strong>
            </div>
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; flex-grow: 1;">
                Total Transaksi Dicatat: <strong id="statsTransaksi">0</strong>
            </div>
        </div>

        <h3>Grafik Pembayaran per Bulan</h3>
        <div style="height: 350px; background-color: #f9f9f9; border: 1px solid var(--border-color); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
            <p>Placeholder Bar Chart (Membutuhkan library Chart.js, atau data dari sheet Statistik)</p>
        </div>
    </div>
    
</div>

<div id="paymentModal" class="modal">
    <div class="modal-content">
        <h3>Konfirmasi Pembayaran <span id="paymentStudentName"></span></h3>
        <p>Pilih bulan yang dibayarkan:</p>
        <div class="month-selection" id="monthSelection">
            </div>

        <div style="margin-top: 20px;">
            <h4>Metode Pembayaran</h4>
            <div class="payment-method-toggle" style="margin-bottom: 15px;">
                <button type="button" class="active" data-method="Tunai" onclick="selectPaymentMethod(this, 'Tunai')">Tunai</button>
                <button type="button" data-method="Transfer" onclick="selectPaymentMethod(this, 'Transfer')">Transfer</button>
            </div>
        </div>
        
        <div id="transferForm" style="display: none;">
            <div class="form-group">
                <label>Unggah Bukti Transfer (Opsional)</label>
                <input type="file" id="buktiTransfer">
            </div>
        </div>
        
        <p id="paymentSummary">Total bulan dipilih: 0</p>
        
        <button type="button" class="btn-submit" onclick="processPayment()">Konfirmasi Bayar</button>
        <button type="button" class="btn-submit btn-cancel" onclick="document.getElementById('paymentModal').style.display='none'">Batal</button>
    </div>
</div>

<script>
    // =========================================================================
    // !!! LANGSUNG GANTI DENGAN URL API SHEETDB ANDA !!!
    // =========================================================================
    // 1. URL untuk sheet database data umum (Ganti keseluruhan link)
    const SHEETDB_URL_GENERAL = 'YOUR_SHEETDB_API_URL_GENERAL'; 
    // 2. URL BASE untuk sheet pembayaran (Hanya Ganti linknya, JANGAN TAMBAH NAMA SHEET)
    // Contoh: Jika link 23-24 adalah https://sheetdb.io/api/v1/XXXXX/database%2023-24, 
    // maka URL BASE-nya adalah https://sheetdb.io/api/v1/XXXXX/database
    const SHEETDB_URL_BASE = 'https://sheetdb.io/api/v1/xjw713aw3kzst/database%20data%20umum'; 
    
    // Konfigurasi Sistem
    const PAYMENT_MONTHS = ["April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember", "Januari", "Februari", "Maret"];
    const TOTAL_MONTHS = PAYMENT_MONTHS.length;
    
    // Tahun Ajaran yang tersedia (Urutkan dari terbaru ke terlama untuk default)
    const ACADEMIC_YEARS = ['26-27', '25-26', '24-25', '23-24']; 
    let currentAcademicYear = ACADEMIC_YEARS[0]; // Default tahun ajaran aktif
    
    // Data state
    let combinedData = [];
    let studentDataGeneral = [];
    let studentDataPayments = [];
    let currentEditStudent = null;
    let selectedPaymentMonths = [];
    let currentPaymentMethod = 'Tunai';

    // FUNGSI UTILITY
    function showLoading() { document.getElementById('loadingOverlay').style.display = 'flex'; }
    function hideLoading() { document.getElementById('loadingOverlay').style.display = 'none'; }
    function showNotification(message, type = 'success') {
        const notif = document.getElementById('notification');
        notif.textContent = message;
        notif.className = 'notification ' + type;
        notif.style.display = 'block';
        setTimeout(() => { notif.style.display = 'none'; }, 3000);
    }

    function getPaymentSheetURL(year) {
        return `${SHEETDB_URL_BASE}%20${year}`;
    }

    function switchSection(element, sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        element.classList.add('active');
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        if (sectionId === 'dashboard') {
            loadCombinedData();
        } else if (sectionId === 'laporan') {
            // Asumsi sheet riwayat pembayaran & laporan statistik memiliki data ringkasan
            updateStatistics();
        }
    }

    function changeAcademicYear(year) {
        currentAcademicYear = year;
        document.getElementById('dashboardTitle').textContent = `Data Pembayaran Siswa T.A ${year}`;
        loadCombinedData();
    }

    // --- FUNGSI GET DATA DARI SHEETDB (JOIN DATA) ---
    async function fetchFromSheetDB(url) {
        if (!url || url.includes('https://sheetdb.io/api/v1/xjw713aw3kzst')) {
             throw new Error("URL API SheetDB belum diatur.");
        }
        
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Gagal mengambil data dari URL: ${url}`, response);
            // Cek jika error 404/not found (sheet belum ada)
            if (response.status === 404) {
                 return [];
            }
            throw new Error(`Gagal mengambil data dari SheetDB (${response.statusText}).`);
        }
        return response.json();
    }

    async function loadCombinedData() {
        showLoading();
        try {
            const currentPaymentURL = getPaymentSheetURL(currentAcademicYear);
            
            // 1. Ambil data dari sheet data umum & sheet pembayaran aktif
            const generalPromise = fetchFromSheetDB(SHEETDB_URL_GENERAL);
            const paymentsPromise = fetchFromSheetDB(currentPaymentURL);
            
            // Tunggu kedua promise selesai
            const [general, payments] = await Promise.all([generalPromise, paymentsPromise]);
            
            // Simpan data mentah
            studentDataGeneral = general;
            studentDataPayments = payments;
            
            // 2. Gabungkan data
            combinedData = studentDataGeneral.map(g => {
                const pay = studentDataPayments.find(p => p.No === g.No);
                
                let lunasCount = 0;
                PAYMENT_MONTHS.forEach(month => {
                    if (pay && pay[month] && pay[month] !== '') { lunasCount++; }
                });

                let totalStatus;
                if (lunasCount === TOTAL_MONTHS) {
                    totalStatus = 'LUNAS';
                } else if (lunasCount > 0) {
                    totalStatus = `SEBAGIAN (${lunasCount}/${TOTAL_MONTHS})`;
                } else {
                    totalStatus = 'BELUM BAYAR';
                }
                
                return {
                    ...g,
                    ...pay,
                    totalStatus: totalStatus,
                    lunasCount: lunasCount
                };
            });
            
            renderTable(combinedData);
        } catch (error) {
            console.error("Error loading data:", error);
            showNotification(`❌ ${error.message}`, 'error');
            // Tampilkan tabel kosong jika gagal
            renderTable([]);
        }
        hideLoading();
    }
    
    // --- FUNGSI CRUD SISWA ---
    
    async function deleteStudent(studentNo) {
        if (!confirm(`Anda yakin ingin menghapus data siswa No ${studentNo}? Data akan dihapus permanen dari semua sheet (General dan ${ACADEMIC_YEARS.join(', ')})!`)) return;

        showLoading();
        
        try {
            const paymentDeletes = ACADEMIC_YEARS.map(year => 
                fetch(`${getPaymentSheetURL(year)}/No/${studentNo}`, { method: 'DELETE' })
            );
            const generalDelete = fetch(`${SHEETDB_URL_GENERAL}/No/${studentNo}`, { method: 'DELETE' });
            
            const results = await Promise.all([generalDelete, ...paymentDeletes]);
            
            // Cek apakah ada yang gagal (walau SheetDB biasanya return 200/204)
            if (results.some(res => !res.ok && res.status !== 404)) {
                throw new Error("Penghapusan ke salah satu sheet gagal.");
            }
            
            showNotification('✅ Data berhasil dihapus dari semua sheet!', 'success');
            loadCombinedData();

        } catch (error) {
            console.error("Error deleting data:", error);
            showNotification(`❌ Gagal menghapus data: ${error.message}`, 'error');
        }
        hideLoading();
    }

    async function submitFormData(event) {
        event.preventDefault();
        showLoading();
        
        const isEdit = document.getElementById('studentId').value !== '';
        const formData = new FormData(document.getElementById('studentForm'));
        const newStudentGeneral = {};
        formData.forEach((value, key) => { newStudentGeneral[key] = value; });

        let studentNo = parseInt(document.getElementById('studentId').value);
        
        // Hanya untuk data baru, SheetDB auto-increment No, tapi kita butuh No untuk payment sheet
        if (!isEdit) {
            // Simulasi ID/No baru (asumsi No adalah angka)
            studentNo = studentDataGeneral.length > 0 ? Math.max(...studentDataGeneral.map(s => s.No)) + 1 : 1;
        }
        newStudentGeneral.No = studentNo;

        const successMessage = isEdit ? "Data berhasil diperbarui!" : "Data berhasil ditambahkan!";

        try {
            let generalResult;
            const paymentPromises = [];

            // 1. Update/Post ke sheet database data umum
            if (isEdit) {
                generalResult = fetch(`${SHEETDB_URL_GENERAL}/No/${studentNo}`, { 
                    method: 'PATCH', 
                    body: JSON.stringify({ data: newStudentGeneral }), 
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                generalResult = fetch(SHEETDB_URL_GENERAL, { 
                    method: 'POST', 
                    body: JSON.stringify({ data: newStudentGeneral }), 
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // 2. Update/Post ke semua sheet pembayaran
            ACADEMIC_YEARS.forEach(year => {
                const paymentPayload = { No: studentNo, Nama: newStudentGeneral.Nama };
                if (!isEdit) {
                    PAYMENT_MONTHS.forEach(month => { paymentPayload[month] = ''; });
                }

                if (isEdit) {
                    paymentPromises.push(fetch(`${getPaymentSheetURL(year)}/No/${studentNo}`, { 
                        method: 'PATCH', 
                        body: JSON.stringify({ data: paymentPayload }), 
                        headers: { 'Content-Type': 'application/json' }
                    }));
                } else {
                    paymentPromises.push(fetch(getPaymentSheetURL(year), { 
                        method: 'POST', 
                        body: JSON.stringify({ data: paymentPayload }), 
                        headers: { 'Content-Type': 'application/json' }
                    }));
                }
            });

            const results = await Promise.all([generalResult, ...paymentPromises]);

            if (results.some(res => !res.ok && res.status !== 404)) {
                throw new Error("Operasi ke salah satu sheet gagal.");
            }

            showNotification('✅ ' + successMessage, 'success');
            switchSection(document.querySelector('.nav-link[data-section=\'dashboard\']'), 'dashboard');
            
        } catch (error) {
            console.error("Error submitting data:", error);
            showNotification(`❌ Gagal menyimpan data: ${error.message}`, 'error');
        }
        hideLoading();
    }
    
    // --- FUNGSI PEMBAYARAN & LOG TRANSAKSI ---

    async function processPayment() {
        if (selectedPaymentMonths.length === 0) {
            return showNotification('Pilih minimal satu bulan yang dibayarkan.', 'error');
        }

        const studentNo = currentEditStudent.No;
        const studentName = currentEditStudent.Nama;
        // Format tanggal (D/M/YYYY)
        const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' }).replace(/\//g, '/');
        
        showLoading();
        document.getElementById('paymentModal').style.display = 'none';

        try {
            // 1. Buat objek payload PATCH untuk sheet pembayaran (hanya bulan yang dibayar)
            const paymentUpdate = {}; 
            selectedPaymentMonths.forEach(month => {
                paymentUpdate[month] = today;
            });

            // Kirim PATCH ke sheet pembayaran tahun ajaran aktif
            const patchBody = { data: paymentUpdate };
            const paymentSheetUpdate = fetch(`${getPaymentSheetURL(currentAcademicYear)}/No/${studentNo}`, { 
                method: 'PATCH', 
                body: JSON.stringify(patchBody), 
                headers: { 'Content-Type': 'application/json' }
            });

            // 2. Buat log transaksi untuk sheet 'riwayat pembayaran & laporan statistik'
            const logPromises = selectedPaymentMonths.map(month => {
                const logPayload = {
                    Tanggal: today,
                    No: studentNo,
                    Nama: studentName,
                    Bulan: month,
                    Tahun_Ajaran: currentAcademicYear,
                    Metode: currentPaymentMethod,
                    Keterangan: 'Lunas'
                    // Anda bisa tambahkan kolom Bukti_Transfer jika diimplementasikan
                };
                return fetch(`${SHEETDB_URL_BASE}%20riwayat%20pembayaran%20&%20laporan%20statistik`, {
                    method: 'POST',
                    body: JSON.stringify({ data: logPayload }),
                    headers: { 'Content-Type': 'application/json' }
                });
            });

            const results = await Promise.all([paymentSheetUpdate, ...logPromises]);
            if (results.some(res => !res.ok)) {
                throw new Error("Gagal menyimpan pembayaran atau log transaksi.");
            }

            showNotification(`✅ Pembayaran ${selectedPaymentMonths.length} bulan (${currentPaymentMethod}) berhasil dicatat di T.A ${currentAcademicYear}!`, 'success');
            loadCombinedData();

        } catch (error) {
             console.error("Error processing payment:", error);
            showNotification(`❌ Gagal mencatat pembayaran: ${error.message}`, 'error');
        }
        hideLoading();
    }
    
    // --- UI/RENDER & LOGIC ---

    function renderTable(data) {
        // ... (Fungsi renderTable tetap sama, menampilkan data gabungan)
        const tableBody = document.getElementById('paymentTableBody');
        tableBody.innerHTML = '';

        data.forEach(student => {
            let row = `<tr data-no="${student.No}">
                <td>${student.No}</td>
                <td style="text-align: left;">${student.Nama}</td>
                <td>${student.NIS}</td>`;

            let totalPaid = 0;
            
            // Kolom Status Pembayaran Bulanan (Apr - Mar)
            PAYMENT_MONTHS.forEach(month => {
                const isPaid = student[month];
                const displayDate = isPaid ? isPaid : 'Belum';
                const statusText = isPaid ? 'Lunas' : 'Belum';

                row += `<td class="status-cell" title="Tanggal: ${displayDate}">
                    <span class="${isPaid ? 'status-lunas' : 'status-belum'}">
                        ${statusText}
                    </span>
                </td>`;
                if (isPaid && isPaid !== '') totalPaid++;
            });

            // Kolom Total Status
            let totalStatusClass = 'status-belum';
            if (totalPaid === TOTAL_MONTHS) totalStatusClass = 'status-lunas';
            else if (totalPaid > 0) totalStatusClass = 'status-sebagian';

            row += `<td class="status-cell"><span class="${totalStatusClass}">${student.totalStatus}</span></td>`;
            
            // Kolom Aksi
            row += `<td>
                <button class="btn-action btn-pay" onclick="showPaymentModal(${student.No}, '${student.Nama.replace(/'/g, "\\'")}')"><i class="fa fa-money-bill-wave" title="Bayar"></i></button>
                <button class="btn-action btn-edit" onclick="showEditForm(${student.No})"><i class="fa fa-pencil-alt" title="Edit Data"></i></button>
                <button class="btn-action btn-delete" onclick="deleteStudent(${student.No})"><i class="fa fa-trash-alt" title="Hapus Data"></i></button>
            </td></tr>`;
            
            tableBody.innerHTML += row;
        });
        
        if (data.length === 0) {
             tableBody.innerHTML = `<tr><td colspan="${17}" style="text-align: center;">Data siswa tidak ditemukan di T.A ${currentAcademicYear}.</td></tr>`;
        }
    }

    // --- Modal Pembayaran Logic ---
    function showPaymentModal(studentNo, studentName) {
        currentEditStudent = combinedData.find(s => s.No === studentNo);
        if (!currentEditStudent) return;
        
        document.getElementById('paymentStudentName').textContent = studentName;
        selectedPaymentMonths = [];
        currentPaymentMethod = 'Tunai';
        
        const monthSelection = document.getElementById('monthSelection');
        monthSelection.innerHTML = '';
        
        PAYMENT_MONTHS.forEach(month => {
            const isPaid = currentEditStudent[month];
            const button = document.createElement('button');
            button.textContent = month;
            button.setAttribute('data-month', month);
            
            if (isPaid && isPaid !== '') {
                button.className = 'paid';
                button.disabled = true;
            } else {
                button.onclick = () => toggleMonthSelection(button, month);
            }
            monthSelection.appendChild(button);
        });

        document.querySelectorAll('.payment-method-toggle button').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.payment-method-toggle button[data-method="Tunai"]').classList.add('active');
        document.getElementById('transferForm').style.display = 'none';
        
        document.getElementById('paymentModal').style.display = 'flex';
        updatePaymentSummary();
    }
    
    function toggleMonthSelection(button, month) {
        if (button.classList.contains('selected')) {
            button.classList.remove('selected');
            selectedPaymentMonths = selectedPaymentMonths.filter(m => m !== month);
        } else {
            button.classList.add('selected');
            selectedPaymentMonths.push(month);
        }
        updatePaymentSummary();
    }

    function selectPaymentMethod(button, method) {
        currentPaymentMethod = method;
        document.querySelectorAll('.payment-method-toggle button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.getElementById('transferForm').style.display = (method === 'Transfer') ? 'block' : 'none';
    }

    function updatePaymentSummary() {
        document.getElementById('paymentSummary').textContent = `Total bulan dipilih: ${selectedPaymentMonths.length}`;
    }

    // --- INISIALISASI ---
    function initialize() {
        // Isi selector tahun ajaran
        const selector = document.getElementById('yearSelector');
        ACADEMIC_YEARS.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = `T.A ${year}`;
            selector.appendChild(option);
        });
        
        // Set default tahun ajaran
        selector.value = currentAcademicYear;
        document.getElementById('dashboardTitle').textContent = `Data Pembayaran Siswa T.A ${currentAcademicYear}`;

        loadCombinedData();
        document.getElementById('studentForm').onsubmit = submitFormData;
    }
    
    document.addEventListener('DOMContentLoaded', initialize);
</script>

</body>
</html>
