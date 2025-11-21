// Configuración del mapa
let map;
let metadata;
let selectedRuta = null;

// Inicializar mapa
async function initMap() {
    // Crear mapa centrado en región de Arauco, Chile
    map = new maplibregl.Map({
        container: 'map',
        style: {
            version: 8,
            sources: {
                'osm': {
                    type: 'raster',
                    tiles: [
                        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    ],
                    tileSize: 256,
                    attribution: '© OpenStreetMap contributors'
                }
            },
            layers: [{
                id: 'osm-tiles',
                type: 'raster',
                source: 'osm',
                minzoom: 0,
                maxzoom: 19
            }]
        },
        center: [-73.3, -37.5], // Centro aproximado región Arauco
        zoom: 8,
        maxZoom: 18,
        minZoom: 6
    });
    
    // Agregar controles
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-right');
    
    // Cargar datos cuando el mapa esté listo
    map.on('load', async () => {
        await loadData();
        addRutasLayer();
        setupInteractions();
    });
}

// Cargar GeoJSON y metadata
async function loadData() {
    try {
        // Cargar metadata
        const metaResponse = await fetch('metadata.json');
        metadata = await metaResponse.json();
        
        // Cargar GeoJSON
        const geoResponse = await fetch('rutas.geojson');
        const geojson = await geoResponse.json();
        
        // Agregar source al mapa
        map.addSource('rutas', {
            type: 'geojson',
            data: geojson
        });
        
        // Actualizar contador
        document.getElementById('ruta-count').textContent = 
            `${metadata.total_senderos} senderos disponibles`;
        
        // Renderizar lista
        renderRutasList();
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        document.getElementById('ruta-count').textContent = 
            'Error cargando rutas';
    }
}

// Agregar capas de rutas al mapa
function addRutasLayer() {
    // Capa de rutas (visible desde zoom 10)
    map.addLayer({
        id: 'rutas-line',
        type: 'line',
        source: 'rutas',
        minzoom: 10,
        paint: {
            'line-width': [
                'interpolate',
                ['exponential', 2],
                ['zoom'],
                10, 2,
                14, 4,
                18, 6
            ],
            'line-color': [
                'match',
                ['get', 'dificultad'],
                'verde', '#4CAF50',
                'azul', '#2196F3',
                'negro', '#212121',
                'multiple', '#FF9800',
                '#999999'
            ],
            'line-opacity': 0.8
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });
    
    // Capa de hover
    map.addLayer({
        id: 'rutas-hover',
        type: 'line',
        source: 'rutas',
        paint: {
            'line-width': 8,
            'line-color': '#FFD700',
            'line-opacity': 0
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    });
}

// Configurar interacciones
function setupInteractions() {
    // Cambiar cursor en hover
    map.on('mouseenter', 'rutas-line', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'rutas-line', () => {
        map.getCanvas().style.cursor = '';
    });
    
    // Click en ruta
    map.on('click', 'rutas-line', (e) => {
        if (e.features.length > 0) {
            const feature = e.features[0];
            selectRuta(feature.properties.id);
            
            // Mostrar popup
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(createPopupContent(feature.properties))
                .addTo(map);
        }
    });
    
    // Hover effect
    let hoveredId = null;
    
    map.on('mousemove', 'rutas-line', (e) => {
        if (e.features.length > 0) {
            if (hoveredId !== null) {
                map.setPaintProperty('rutas-hover', 'line-opacity', 0);
            }
            
            hoveredId = e.features[0].id;
            map.setFilter('rutas-hover', ['==', ['id'], hoveredId]);
            map.setPaintProperty('rutas-hover', 'line-opacity', 0.6);
        }
    });
    
    map.on('mouseleave', 'rutas-line', () => {
        if (hoveredId !== null) {
            map.setPaintProperty('rutas-hover', 'line-opacity', 0);
        }
        hoveredId = null;
    });
}

// Renderizar lista de rutas
function renderRutasList() {
    const container = document.getElementById('rutas-list');
    container.innerHTML = '';
    
    // Ordenar por disciplina y luego por nombre
    const sorted = [...metadata.senderos].sort((a, b) => {
        if (a.disciplina !== b.disciplina) {
            return a.disciplina.localeCompare(b.disciplina);
        }
        return a.nombre.localeCompare(b.nombre);
    });
    
    sorted.forEach(ruta => {
        const card = createRutaCard(ruta);
        container.appendChild(card);
    });
}

// Crear card de ruta
function createRutaCard(ruta) {
    const card = document.createElement('div');
    card.className = 'ruta-card';
    card.dataset.id = ruta.id;
    
    const desnivel = ruta.desnivel_positivo > 0 
        ? `+${ruta.desnivel_positivo}m/-${ruta.desnivel_negativo}m`
        : 'N/A';
    
    card.innerHTML = `
        <div class="ruta-nombre">${ruta.nombre}</div>
        <div class="ruta-meta">
            <span class="badge badge-disciplina">${ruta.disciplina}</span>
            <span class="badge badge-${ruta.dificultad}">${ruta.dificultad}</span>
        </div>
        <div class="ruta-stats">
            <span>📏 ${ruta.distancia_km} km</span>
            <span>⛰️ ${desnivel}</span>
        </div>
        <div class="ruta-stats">
            <span>📍 ${ruta.ubicacion}</span>
        </div>
        <a href="${ruta.archivo_kmz}" class="btn-download" download>
            ⬇ Descargar KMZ
        </a>
    `;
    
    // Click handler
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-download')) {
            selectRuta(ruta.id);
            centerOnRuta(ruta.id);
        }
    });
    
    return card;
}

// Seleccionar ruta
function selectRuta(rutaId) {
    // Remover selección anterior
    if (selectedRuta) {
        const prevCard = document.querySelector(`[data-id="${selectedRuta}"]`);
        if (prevCard) prevCard.classList.remove('active');
    }
    
    // Agregar nueva selección
    selectedRuta = rutaId;
    const card = document.querySelector(`[data-id="${rutaId}"]`);
    if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Centrar mapa en ruta
function centerOnRuta(rutaId) {
    const features = map.querySourceFeatures('rutas', {
        sourceLayer: 'rutas',
        filter: ['==', ['get', 'id'], rutaId]
    });
    
    if (features.length > 0) {
        const feature = features[0];
        const coordinates = feature.geometry.coordinates;
        
        // Calcular bounds
        const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
        }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));
        
        // Ajustar mapa
        map.fitBounds(bounds, {
            padding: { top: 50, bottom: 50, left: 400, right: 50 },
            maxZoom: 14,
            duration: 1000
        });
    }
}

// Crear contenido de popup
function createPopupContent(props) {
    const desnivel = props.desnivel_pos > 0 
        ? `+${props.desnivel_pos}m/-${props.desnivel_neg}m`
        : 'N/A';
    
    return `
        <div class="popup-title">${props.nombre}</div>
        <div class="popup-info">
            <strong>${props.disciplina}</strong> • ${props.dificultad.toUpperCase()}<br>
            📏 ${props.distancia_km} km • ⛰️ ${desnivel}<br>
            📍 ${props.ubicacion}
        </div>
    `;
}

// Toggle panel
function togglePanel() {
    const panel = document.getElementById('panel');
    const toggle = document.getElementById('panel-toggle');
    
    panel.classList.toggle('hidden');
    toggle.classList.toggle('panel-hidden');
}

// Mobile: Drag to close panel
let startY = 0;
let currentY = 0;

if (window.innerWidth <= 768) {
    const panel = document.getElementById('panel');
    const header = document.querySelector('.panel-header');
    
    header.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    
    header.addEventListener('touchmove', (e) => {
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;
        
        if (diff > 0) {
            panel.style.transform = `translateY(${diff}px)`;
        }
    });
    
    header.addEventListener('touchend', () => {
        const diff = currentY - startY;
        
        if (diff > 100) {
            panel.classList.add('hidden');
        }
        
        panel.style.transform = '';
    });
}

// Inicializar cuando cargue el DOM
document.addEventListener('DOMContentLoaded', initMap);
