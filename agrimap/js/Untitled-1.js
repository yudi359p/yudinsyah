
/*************************************************
 AGRIMAP - INTEGRASI PETA LAHAN PETANI
 Lokasi: Mugirejo, Samarinda
 Jumlah: 5 Petani
 Total : 4,25 Hektare
*************************************************/

// ================================================
// 1. MEMBUAT PETA
// ================================================

const map = L.map('map').setView(
    [-0.430, 117.200],
    12
);

// ================================================
// 2. MENAMBAHKAN PETA DASAR
// ================================================

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '&copy; OpenStreetMap'
    }
).addTo(map);

// ================================================
// 3. WARNA PETAK LAHAN
// ================================================

const warnaPetani = {
    P0: '#e74c3c',
    P1: '#3498db',
    P2: '#2ecc71',
    P3: '#f1c40f',
    P4: '#9b59b6'
};

// ================================================
// 4. MEMBACA FILE GEOJSON
// ================================================

fetch('data/petak_lahan_petani.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('File GeoJSON tidak ditemukan');
        }

        return response.json();
    })
    .then(data => {

        const layerPetani = L.geoJSON(data, {

            style: function(feature) {
                const kode = feature.properties.kode;

                return {
                    color: warnaPetani[kode] || '#333333',
                    weight: 3,
                    fillColor: warnaPetani[kode] || '#777777',
                    fillOpacity: 0.45
                };
            },

            onEachFeature: function(feature, layer) {

                const petani = feature.properties;

                layer.bindPopup(`
                    <div style="min-width:200px">
                        <h3>${petani.nama_petani}</h3>
                        <hr>
                        <b>Kode:</b> ${petani.kode}<br>
                        <b>Luas:</b> ${petani.luas_ha} hektare<br>
                        <b>Luas:</b> ${Number(petani.luas_m2).toLocaleString('id-ID')} m²<br>
                        <b>Bentuk:</b> ${petani.bentuk}
                    </div>
                `);

            }

        }).addTo(map);

        // Memusatkan peta pada kelima petak
        map.fitBounds(layerPetani.getBounds());

        console.log('Data petak berhasil dimuat:', data);

    })
    .catch(error => {
        console.error('Gagal memuat GeoJSON:', error);
        alert('Data petak tidak berhasil dimuat. Periksa lokasi file GeoJSON.');
    });
