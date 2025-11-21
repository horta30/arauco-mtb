# 🚵 Mapa MTB Arauco

Mapa interactivo profesional de rutas de Mountain Bike en la región de Arauco, Chile.

## 🎯 Características

- ✅ **15 rutas procesadas** (XC y DH)
- ✅ **MapLibre GL JS** - Renderizado GPU de alta performance
- ✅ **Visualización por zoom** - Rutas aparecen progresivamente
- ✅ **Panel lateral responsive** - Desktop y mobile
- ✅ **Descarga de KMZ** - Archivos originales disponibles
- ✅ **Color por dificultad** - Verde (fácil), Azul (intermedio), Negro (difícil)
- ✅ **Estadísticas completas** - Distancia, desnivel, ubicación
- ✅ **Sin dependencias** - Solo MapLibre GL JS (220KB gzipped)
- ✅ **100% gratis** - OpenStreetMap + GitHub Pages

## 📊 Datos procesados

### Rutas XC (Cross Country)
- CICLISMO ZONA 7 - 60km
- LEFU BIKE - 74km
- MAULEN RIDERS - 43km
- MTB 3 PEDALES - 48km
- MTB LOS ALAMOS - 196km
- PUTU BIKE - 440km
- LANPU BIKE - 58km

### Rutas DH (Downhill)
- SKILL BIKE - Dichato Clásica - 2.4km
- ADRENALINA DOWNHILL - Villa Esperanza - 0.9km
- COE BIKE Racing - Dichato - 2.4km
- FUNDO MANCO - 3.9km
- HIJOS DE PENCO - 8.4km
- PRO BIKE - DH Series - 129km
- PUMONES FAST - 40km
- RUKAFEST - 5.7km

**Total: 3.3 MB de datos GeoJSON optimizados**

## 🚀 Deploy en GitHub Pages

### Opción 1: Manual

```bash
# 1. Crear repositorio en GitHub
#    Nombre: arauco-mtb

# 2. Clonar en tu computador
git clone https://github.com/TU-USUARIO/arauco-mtb.git
cd arauco-mtb

# 3. Copiar todos los archivos de este proyecto

# 4. Push a GitHub
git add .
git commit -m "Initial commit: Mapa MTB Arauco"
git push origin main

# 5. Habilitar GitHub Pages
#    Settings > Pages > Source: main branch
```

### Opción 2: GitHub Desktop

1. Abre GitHub Desktop
2. File > New Repository
3. Nombre: `arauco-mtb`
4. Copia archivos a la carpeta
5. Commit y Publish

### Opción 3: Subir ZIP directo

1. Ve a github.com
2. New Repository: `arauco-mtb`
3. Upload files (arrastra todo)
4. Settings > Pages > Enable

**Tu mapa estará en:** `https://TU-USUARIO.github.io/arauco-mtb/`

## 📁 Estructura del proyecto

```
arauco-mtb/
├── index.html              # UI principal
├── js/
│   └── app.js             # Lógica MapLibre + interacciones
├── rutas.geojson          # Todas las rutas (3.3 MB optimizado)
├── metadata.json          # Info de cada sendero (6 KB)
├── kmz/                   # Archivos KMZ originales para descarga
│   └── (16 archivos)
└── README.md              # Esta documentación
```

## 🔧 Cómo agregar nuevas rutas

### 1. Preparar el archivo KMZ

Nombra siguiendo el formato:
```
CLUB_DISCIPLINA_UBICACION_NOMBRE-RUTA_DIFICULTAD.kmz

Ejemplo:
NUEVO-CLUB_XC_TEMUCO_RUTA-LAGO_AZUL.kmz
```

### 2. Procesar con el script Python

```bash
# Instalar dependencias (solo primera vez)
pip install lxml fastkml pygeoif

# Copiar tu nuevo KMZ a la carpeta con los demás

# Ejecutar script
python3 process_kmz.py

# Se generan nuevos:
# - rutas.geojson
# - metadata.json
```

### 3. Reemplazar archivos

- Copia el nuevo `rutas.geojson`
- Copia el nuevo `metadata.json`
- Copia el nuevo KMZ a la carpeta `kmz/`

### 4. Push a GitHub

```bash
git add .
git commit -m "Agregada ruta: NOMBRE"
git push
```

**¡Listo!** En 1-2 minutos se actualiza automáticamente en GitHub Pages.

## ⚙️ Personalización

### Cambiar centro del mapa

En `js/app.js`, línea 17:
```javascript
center: [-73.3, -37.5], // [longitud, latitud]
zoom: 8,
```

### Cambiar colores de dificultad

En `js/app.js`, línea 66:
```javascript
'verde', '#4CAF50',   // Verde
'azul', '#2196F3',    // Azul
'negro', '#212121',   // Negro
```

### Cambiar estilo del mapa base

Opciones gratuitas:
- **OpenStreetMap** (actual) - Clásico
- **OpenTopoMap** - Con curvas de nivel
  ```
  https://a.tile.opentopomap.org/{z}/{x}/{y}.png
  ```
- **CyclOSM** - Optimizado para ciclismo
  ```
  https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png
  ```

Cambiar en `js/app.js`, línea 12.

## 📱 Compatibilidad

- ✅ Chrome/Edge/Safari/Firefox (últimas 2 versiones)
- ✅ iOS Safari 12+
- ✅ Android Chrome 80+
- ✅ Tablets
- ✅ Desktop

## 🐛 Troubleshooting

**Las rutas no aparecen:**
- Verifica que `rutas.geojson` y `metadata.json` estén en la raíz
- Abre DevTools (F12) y revisa errores en Console

**El mapa no carga:**
- Verifica conexión a internet (MapLibre se carga desde CDN)
- Revisa que la URL sea HTTPS (requerido por GitHub Pages)

**Los KMZ no descargan:**
- Verifica que los archivos estén en la carpeta `kmz/`
- Revisa que los nombres coincidan en `metadata.json`

## 📈 Performance

- **Carga inicial:** <2s en 4G
- **Renderizado:** 60fps en mobile
- **Memoria:** ~150MB RAM
- **Datos:** 3.3MB GeoJSON (descarga una sola vez)

## 🔮 Próximas mejoras (opcional)

- [ ] Filtros por disciplina (XC/DH)
- [ ] Filtros por dificultad
- [ ] Búsqueda de rutas
- [ ] Compartir link de ruta específica
- [ ] Perfil de elevación
- [ ] Fotos de las rutas
- [ ] Comentarios/reviews

## 📄 Licencia

Este proyecto usa:
- **MapLibre GL JS** - BSD License
- **OpenStreetMap** - ODbL License
- Código del proyecto - Libre para uso personal/comercial

## 👤 Autor

**Gravitas Marketing Solutions**  
Proyecto Mapa MTB Arauco 2025

## 🆘 Soporte

Para agregar/modificar rutas o reportar problemas:
- Email: contacto@gravitasmarketing.cl
- Crear Issue en el repositorio GitHub
