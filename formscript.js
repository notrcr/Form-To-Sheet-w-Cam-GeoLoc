// ==================== ELEMEN DOM ====================
 
const timSelect = document.getElementById('Tim');
 
// LOKASI
const lokasiKerjaField = document.getElementById('lokasi-kerja-field');
const geoLokasiField = document.getElementById('geo-lokasi-field');

// CAMERA
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photoInput = document.getElementById('photo-input');
const photoPreview = document.getElementById('photo-preview');
const tombolKamera = document.getElementById('tombol-kamera');
const toggleKamera = document.getElementById('toggle');
const labelKamera = document.getElementById('label-kamera')
const toggleSwitch = document.getElementById('switch');
const captureBtn = document.getElementById('capture');
const cameraField = document.getElementById('camera-field');
 
// SHEET
const form = document.forms['submit-to-google-sheet'];
const scriptURL = 'https://script.google.com/MY WEB URL(FROM SHEET)/exec';

let cameraStream = null;

// ==================== KAMERA FUNCTION ==================== //
// PROMISE
async function startCamera() { 
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    cameraStream = stream;
    console.log('Kamera berhasil diaktifkan');
  } catch (err) {
    console.error('Error mengakses kamera:', err);
    Swal.fire('Gagal', 'Tidak bisa mengakses kamera!' );
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.srcObject = null;
    console.log('Kamera dimatikan');
  }
}

function capturePhoto() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  // SET TO BASE64
  const imageData = canvas.toDataURL('image/jpeg', 0.5);
  photoInput.value = imageData;
  photoPreview.src = imageData;
  photoPreview.style.display = 'block';
}

// ==================== LOKASI FUNCTION ==================== //
function getLocation() {
  const select = document.getElementById('lokasi-select');
  
  if (!navigator.geolocation) {
    Swal.fire('Error', 'Browser kamu tidak mendukung geolocation.', 'error');
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);
      const coords = `${lat},${lon}`;
      
      select.innerHTML = `<option value="${coords}" selected>📍 ${coords}</option>`;
      Swal.fire('📍 Lokasi berhasil diambil!', coords, 'success');
    },
    (error) => {
      console.error('Error geolocation:', error);
      Swal.fire('Gagal!', 'Pastikan izin lokasi aktif.', 'error');
    }
  );
}

// ==================== FUNGSI TOGGLE FIELD ==================== //
function toggleFields(value) {
  const isMarketing = value === 'Marketing';
   
  [
  toggleKamera,labelKamera,
  captureBtn,tombolKamera,
  video,lokasiKerjaField,
  geoLokasiField
].forEach(el => el.classList.toggle('hidden', !isMarketing));

   
 cameraField.classList.remove('hidden', 'camera-container');
if (isMarketing) {
    //     If value = Marketing We add camera container class
  cameraField.classList.add('camera-container');
} else {
    // If Value not Marketing We remove Camera Container Class
  cameraField.classList.remove('camera-container');
 
}

  bukaCamera.classList.toggle('hidden', !isMarketing);
  tutupCamera.classList.toggle('hidden', !isMarketing);
}

// ====================  SUBMIT FORM ==================== //
async function handleFormSubmit(e) {
  e.preventDefault();
  
  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim...';
  
  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      body: new FormData(form)
    });
    
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Formulir kamu sudah dikirim.',
      showConfirmButton: false,
      timer: 0
    });
    
    form.reset();
  } catch (error) {
    console.error('Error mengirim data:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Terjadi kesalahan saat mengirim data!'
    });
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Kirim';
  }
}

// ==================== EVENT LISTENERS ====================
 
timSelect.addEventListener('change', () => {
  toggleFields(timSelect.value);
});


toggleSwitch.addEventListener('change', async () => {
  if (toggleSwitch.checked) {
    try {
      await startCamera();
      video.style.display = 'block';
      Swal.fire('Berhasil!', 'Kamera berhasil diaktifkan');
    } catch (error) {
      console.error('Camera access denied:', error);
      Swal.fire('Gagal!', 'Silahkan ALLOW kamera di pengaturan BROWSER');
      toggleSwitch.checked = false;  
    }
  } else {
    try {
      stopCamera();
      video.style.display = 'none';
      Swal.fire('Berhasil!', 'Kamera dimatikan');
    } catch (err) {
      console.error('Error menutup kamera:', err);
      Swal.fire('Gagal', 'Terjadi kesalahan saat menutup kamera');
    }
  }
});
captureBtn.addEventListener('click', capturePhoto);

document.getElementById('get-location').addEventListener('click', getLocation);

form.addEventListener('submit', handleFormSubmit);