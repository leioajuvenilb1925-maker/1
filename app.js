/* ================================================
   FOOTBALL TEAM MANAGER — app.js
   ================================================ */

'use strict';

// ────────────────────────────────────────────────
// 0. SUPABASE CONFIGURATION
// ────────────────────────────────────────────────
const supabaseUrl = 'https://hrauelgepfuyrdglginw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhyYXVlbGdlcGZ1eXJkZ2xnaW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjI1MjcsImV4cCI6MjA5NDY5ODUyN30.GfpJZBheX6Z5uI_dAwX82r1YTqoaLVzbonFgUjRiA6c';
const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(supabaseUrl, supabaseKey)
  : null;

async function fetchPlayersFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('players')
      .select('*')
      .order('dorsal');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      players = data;
      nextId = Math.max(...players.map(p => Number(p.id) || 0)) + 1;
      saveToStorage();
      renderPlayers();
    }
  } catch (err) {
    console.error('Error al obtener jugadores de Supabase:', err);
    showToast('⚠️ Cargados datos locales (sin conexión a Supabase)', 'error');
  }
}

// ────────────────────────────────────────────────
// 1. DATOS INICIALES — 20 jugadores
// ────────────────────────────────────────────────
const PLAYERS_DEFAULT = [
  { id: 1,  nombre: 'Julen',    apellido: 'Agirrezabala',  dorsal: 1,  posicion: 'Portero',        edad: 23, nacionalidad: 'Española', goles: 0,  asistencias: 0, partidos: 28, estado: 'Activo',     talla: 'L',  val: 4 },
  { id: 2,  nombre: 'Unai',     apellido: 'Simón',         dorsal: 25, posicion: 'Portero',        edad: 27, nacionalidad: 'Española', goles: 0,  asistencias: 0, partidos: 12, estado: 'Activo',     talla: 'XL', val: 5 },
  { id: 3,  nombre: 'Dani',     apellido: 'Vivian',        dorsal: 3,  posicion: 'Defensa',        edad: 24, nacionalidad: 'Española', goles: 2,  asistencias: 1, partidos: 30, estado: 'Activo',     talla: 'M',  val: 5 },
  { id: 4,  nombre: 'Mikel',    apellido: 'Jauregizar',    dorsal: 4,  posicion: 'Defensa',        edad: 23, nacionalidad: 'Española', goles: 0,  asistencias: 2, partidos: 18, estado: 'Lesionado',  talla: 'M',  val: 3 },
  { id: 5,  nombre: 'Yeray',    apellido: 'Álvarez',       dorsal: 14, posicion: 'Defensa',        edad: 29, nacionalidad: 'Española', goles: 1,  asistencias: 0, partidos: 25, estado: 'Activo',     talla: 'L',  val: 4 },
  { id: 6,  nombre: 'Lekue',    apellido: 'Iñigo',         dorsal: 17, posicion: 'Defensa',        edad: 30, nacionalidad: 'Española', goles: 1,  asistencias: 3, partidos: 22, estado: 'Activo',     talla: 'M',  val: 3 },
  { id: 7,  nombre: 'Oscar',    apellido: 'De Marcos',     dorsal: 18, posicion: 'Defensa',        edad: 34, nacionalidad: 'Española', goles: 2,  asistencias: 4, partidos: 20, estado: 'Activo',     talla: 'L',  val: 4 },
  { id: 8,  nombre: 'Unai',     apellido: 'Vencedor',      dorsal: 6,  posicion: 'Centrocampista', edad: 25, nacionalidad: 'Española', goles: 3,  asistencias: 5, partidos: 32, estado: 'Activo',     talla: 'M',  val: 4 },
  { id: 9,  nombre: 'Ander',    apellido: 'Herrera',       dorsal: 22, posicion: 'Centrocampista', edad: 35, nacionalidad: 'Española', goles: 2,  asistencias: 4, partidos: 19, estado: 'Activo',     talla: 'M',  val: 4 },
  { id: 10, nombre: 'Oier',     apellido: 'Zarraga',       dorsal: 24, posicion: 'Centrocampista', edad: 23, nacionalidad: 'Española', goles: 4,  asistencias: 6, partidos: 30, estado: 'Activo',     talla: 'S',  val: 3 },
  { id: 11, nombre: 'Mikel',    apellido: 'Vesga',         dorsal: 15, posicion: 'Centrocampista', edad: 30, nacionalidad: 'Española', goles: 3,  asistencias: 2, partidos: 28, estado: 'Sancionado', talla: 'L',  val: 3 },
  { id: 12, nombre: 'Dani',     apellido: 'García',        dorsal: 16, posicion: 'Centrocampista', edad: 32, nacionalidad: 'Española', goles: 1,  asistencias: 3, partidos: 24, estado: 'Activo',     talla: 'L',  val: 3 },
  { id: 13, nombre: 'Beñat',    apellido: 'Prados',        dorsal: 8,  posicion: 'Centrocampista', edad: 25, nacionalidad: 'Española', goles: 5,  asistencias: 7, partidos: 33, estado: 'Activo',     talla: 'M',  val: 4 },
  { id: 14, nombre: 'Nico',     apellido: 'Williams',      dorsal: 10, posicion: 'Delantero',      edad: 21, nacionalidad: 'Española', goles: 14, asistencias: 9, partidos: 34, estado: 'Activo',     talla: 'M',  val: 5 },
  { id: 15, nombre: 'Iñaki',    apellido: 'Williams',      dorsal: 9,  posicion: 'Delantero',      edad: 29, nacionalidad: 'Ghanesa',  goles: 12, asistencias: 8, partidos: 32, estado: 'Activo',     talla: 'XL', val: 5 },
  { id: 16, nombre: 'Gorka',    apellido: 'Guruzeta',      dorsal: 21, posicion: 'Delantero',      edad: 27, nacionalidad: 'Española', goles: 11, asistencias: 3, partidos: 28, estado: 'Activo',     talla: 'L',  val: 4 },
  { id: 17, nombre: 'Asier',    apellido: 'Villalibre',    dorsal: 19, posicion: 'Delantero',      edad: 27, nacionalidad: 'Española', goles: 8,  asistencias: 2, partidos: 26, estado: 'Activo',     talla: 'XL', val: 4 },
  { id: 18, nombre: 'Sancet',   apellido: 'Oihan',         dorsal: 20, posicion: 'Delantero',      edad: 24, nacionalidad: 'Española', goles: 9,  asistencias: 5, partidos: 31, estado: 'Lesionado',  talla: 'L',  val: 5 },
  { id: 19, nombre: 'Jon',      apellido: 'Morcillo',      dorsal: 11, posicion: 'Delantero',      edad: 21, nacionalidad: 'Española', goles: 6,  asistencias: 4, partidos: 29, estado: 'Activo',     talla: 'M',  val: 3 },
  { id: 20, nombre: 'Yuri',     apellido: 'Berchiche',     dorsal: 5,  posicion: 'Defensa',        edad: 34, nacionalidad: 'Española', goles: 1,  asistencias: 5, partidos: 21, estado: 'Activo',     talla: 'L',  val: 4 },
];

// ────────────────────────────────────────────────
// 2. STATE & TRANSLATIONS
// ────────────────────────────────────────────────
let players   = [];
let nextId    = 21;
let activeFilter = 'all';
let searchQuery  = '';
let sortBy       = 'dorsal';
let editingId    = null;
let tempFotoUrl  = null;

// i18n Translation Dictionary (Spanish, Basque, and English)
const TRANSLATIONS = {
  es: {
    // Header
    'logo-subtitle': 'Athletic Team · Temporada 2025/26',
    'stat-players': 'Jugadores',
    'stat-active': 'Activos',
    'stat-goals': 'Goles',
    'btn-add': 'Añadir Jugador',
    // Filters
    'search-placeholder': 'Buscar jugador…',
    'filter-all': 'Todos',
    'filter-portero': 'Portero',
    'filter-defensa': 'Defensa',
    'filter-centrocampista': 'Centrocampista',
    'filter-delantero': 'Delantero',
    'sort-dorsal': 'Ordenar: Dorsal',
    'sort-nombre': 'Ordenar: Nombre',
    'sort-goles': 'Ordenar: Goles',
    'sort-edad': 'Ordenar: Edad',
    'sort-val': 'Ordenar: Valoración',
    // Empty state
    'empty-title': 'Sin resultados',
    'empty-desc': 'Prueba con otro nombre o filtro',
    // Card Stats & Actions
    'card-goals': 'Goles',
    'card-assists': 'Asist.',
    'card-matches': 'Partidos',
    'card-age': 'Edad',
    'card-edit': 'Editar',
    'card-delete': 'Eliminar',
    // Form Modals
    'modal-title-new': 'Nuevo Jugador',
    'modal-title-edit': 'Editar Jugador',
    'form-photo-title': 'Foto del Jugador',
    'form-photo-desc': 'Sube un archivo de imagen o introduce una URL',
    'form-photo-upload': '📁 Subir foto',
    'form-photo-placeholder': 'O pega URL de la imagen...',
    'form-name': 'Nombre *',
    'form-name-placeholder': 'Ej: Iker',
    'form-lastname': 'Apellidos *',
    'form-lastname-placeholder': 'Ej: Muniain',
    'form-number': 'Dorsal *',
    'form-position': 'Posición *',
    'form-select-prompt': 'Selecciona…',
    'form-age': 'Edad',
    'form-nationality': 'Nacionalidad',
    'form-nationality-placeholder': 'Española',
    'form-size': 'Talla',
    'form-size-placeholder': 'Ej: M, L, 42',
    'form-goals': 'Goles',
    'form-assists': 'Asistencias',
    'form-matches': 'Partidos',
    'form-rating': 'Valoración *',
    'form-status': 'Estado',
    'btn-cancel': 'Cancelar',
    'btn-save': 'Guardar',
    // Positions mapping
    'pos-Portero': 'Portero',
    'pos-Defensa': 'Defensa',
    'pos-Centrocampista': 'Centrocampista',
    'pos-Delantero': 'Delantero',
    // Status mapping
    'status-Activo': 'Activo',
    'status-Lesionado': 'Lesionado',
    'status-Sancionado': 'Sancionado',
    // Ratings
    'rate-5': '⭐⭐⭐⭐⭐ (5 - Excelente)',
    'rate-4': '⭐⭐⭐⭐ (4 - Bueno)',
    'rate-3': '⭐⭐⭐ (3 - Regular)',
    'rate-2': '⭐⭐ (2 - Bajo)',
    'rate-1': '⭐ (1 - Muy Bajo)',
    // Detail Modal
    'detail-dorsal': 'Dorsal',
    'detail-age': 'Edad',
    'detail-years': 'años',
    'detail-nationality': 'Nacionalidad',
    'detail-status': 'Estado',
    'detail-size': 'Talla',
    'detail-id': 'Ficha ID',
    'detail-goals': 'Goles',
    'detail-assists': 'Asistencias',
    'detail-matches': 'Partidos',
    // Toast & Confirm
    'toast-required': 'Completa los campos obligatorios',
    'toast-updated': '✅ Jugador actualizado',
    'toast-added': '✅ Jugador añadido',
    'toast-deleted': '🗑️ Jugador eliminado',
    'toast-sync-ok': '✅ Sincronizado con Supabase',
    'toast-sync-err': '⚠️ Error al sincronizar con Supabase',
    'toast-upload-start': '📤 Subiendo imagen a Storage...',
    'toast-upload-ok': '✅ Imagen subida a Storage',
    'toast-upload-db': '⚠️ Usando almacenamiento en base de datos para la foto',
    'toast-db-deleted': '🗑️ Eliminado de Supabase',
    'confirm-delete': '¿Eliminar a {name}?',
  },
  eu: {
    // Header
    'logo-subtitle': 'Athletic Team · 2025/26 Denboraldia',
    'stat-players': 'Jokalariak',
    'stat-active': 'Aktiboak',
    'stat-goals': 'Golak',
    'btn-add': 'Jokalaria Gehitu',
    // Filters
    'search-placeholder': 'Bilatu jokalaria…',
    'filter-all': 'Guztiak',
    'filter-portero': 'Atezaina',
    'filter-defensa': 'Defentsa',
    'filter-centrocampista': 'Erdilaria',
    'filter-delantero': 'Aurrelaria',
    'sort-dorsal': 'Ordenatu: Dorsala',
    'sort-nombre': 'Ordenatu: Izena',
    'sort-goles': 'Ordenatu: Golak',
    'sort-edad': 'Ordenatu: Adina',
    'sort-val': 'Ordenatu: Balorazioa',
    // Empty state
    'empty-title': 'Emaitzarik ez',
    'empty-desc': 'Saiatu beste izen edo iragazki batekin',
    // Card Stats & Actions
    'card-goals': 'Golak',
    'card-assists': 'Asist.',
    'card-matches': 'Partidak',
    'card-age': 'Adina',
    'card-edit': 'Editatu',
    'card-delete': 'Ezabatu',
    // Form Modals
    'modal-title-new': 'Jokalari Berria',
    'modal-title-edit': 'Jokalaria Editatu',
    'form-photo-title': 'Jokalariaren Argazkia',
    'form-photo-desc': 'Igo irudi fitxategi bat edo idatzi URL bat',
    'form-photo-upload': '📁 Argazkia igo',
    'form-photo-placeholder': 'Edo itsatsi irudiaren URLa...',
    'form-name': 'Izena *',
    'form-name-placeholder': 'Adib: Iker',
    'form-lastname': 'Abizenak *',
    'form-lastname-placeholder': 'Adib: Muniain',
    'form-number': 'Dorsala *',
    'form-position': 'Posizioa *',
    'form-select-prompt': 'Hautatu…',
    'form-age': 'Adina',
    'form-nationality': 'Nazionalitatea',
    'form-nationality-placeholder': 'Euskalduna',
    'form-size': 'Taila',
    'form-size-placeholder': 'Adib: M, L, 42',
    'form-goals': 'Golak',
    'form-assists': 'Asistentziak',
    'form-matches': 'Partidak',
    'form-rating': 'Balorazioa *',
    'form-status': 'Egoera',
    'btn-cancel': 'Utzi',
    'btn-save': 'Gorde',
    // Positions mapping
    'pos-Portero': 'Atezaina',
    'pos-Defensa': 'Defentsa',
    'pos-Centrocampista': 'Erdilaria',
    'pos-Delantero': 'Aurrelaria',
    // Status mapping
    'status-Activo': 'Aktiboa',
    'status-Lesionado': 'Zauritua',
    'status-Sancionado': 'Zigorra',
    // Ratings
    'rate-5': '⭐⭐⭐⭐⭐ (5 - Bikaina)',
    'rate-4': '⭐⭐⭐⭐ (4 - Ona)',
    'rate-3': '⭐⭐⭐ (3 - Erregularra)',
    'rate-2': '⭐⭐ (2 - Baxua)',
    'rate-1': '⭐ (1 - Oso Baxua)',
    // Detail Modal
    'detail-dorsal': 'Dorsala',
    'detail-age': 'Adina',
    'detail-years': 'urte',
    'detail-nationality': 'Nazionalitatea',
    'detail-status': 'Egoera',
    'detail-size': 'Taila',
    'detail-id': 'Fitxa ID',
    'detail-goals': 'Golak',
    'detail-assists': 'Asistentziak',
    'detail-matches': 'Partidak',
    // Toast & Confirm
    'toast-required': 'Bete beharreko eremuak osatu',
    'toast-updated': '✅ Jokalaria eguneratu da',
    'toast-added': '✅ Jokalaria gehitu da',
    'toast-deleted': '🗑️ Jokalaria ezabatu da',
    'toast-sync-ok': '✅ Supabase-rekin sinkronizatuta',
    'toast-sync-err': '⚠️ Errorea Supabase-rekin sinkronizatzean',
    'toast-upload-start': '📤 Irudia Storage-ra igotzen...',
    'toast-upload-ok': '✅ Irudia igota Storage-ra',
    'toast-upload-db': '⚠️ Datu baseko biltegia erabiltzen argazkirako',
    'toast-db-deleted': '🗑️ Supabase-tik ezabatuta',
    'confirm-delete': 'Ezabatu nahi duzu {name}?',
  },
  en: {
    // Header
    'logo-subtitle': 'Athletic Team · Season 2025/26',
    'stat-players': 'Players',
    'stat-active': 'Active',
    'stat-goals': 'Goals',
    'btn-add': 'Add Player',
    // Filters
    'search-placeholder': 'Search player…',
    'filter-all': 'All',
    'filter-portero': 'Goalkeeper',
    'filter-defensa': 'Defender',
    'filter-centrocampista': 'Midfielder',
    'filter-delantero': 'Forward',
    'sort-dorsal': 'Sort: Number',
    'sort-nombre': 'Sort: Name',
    'sort-goles': 'Sort: Goals',
    'sort-edad': 'Sort: Age',
    'sort-val': 'Sort: Rating',
    // Empty state
    'empty-title': 'No results',
    'empty-desc': 'Try another name or filter',
    // Card Stats & Actions
    'card-goals': 'Goals',
    'card-assists': 'Assists',
    'card-matches': 'Matches',
    'card-age': 'Age',
    'card-edit': 'Edit',
    'card-delete': 'Delete',
    // Form Modals
    'modal-title-new': 'New Player',
    'modal-title-edit': 'Edit Player',
    'form-photo-title': 'Player Photo',
    'form-photo-desc': 'Upload an image file or enter a URL',
    'form-photo-upload': '📁 Upload photo',
    'form-photo-placeholder': 'Or paste image URL...',
    'form-name': 'First Name *',
    'form-name-placeholder': 'Ex: Iker',
    'form-lastname': 'Last Name *',
    'form-lastname-placeholder': 'Ex: Muniain',
    'form-number': 'Number *',
    'form-position': 'Position *',
    'form-select-prompt': 'Select…',
    'form-age': 'Age',
    'form-nationality': 'Nationality',
    'form-nationality-placeholder': 'Spanish',
    'form-size': 'Size',
    'form-size-placeholder': 'Ex: M, L, 42',
    'form-goals': 'Goals',
    'form-assists': 'Assists',
    'form-matches': 'Matches',
    'form-rating': 'Rating *',
    'form-status': 'Status',
    'btn-cancel': 'Cancel',
    'btn-save': 'Save',
    // Positions mapping
    'pos-Portero': 'Goalkeeper',
    'pos-Defensa': 'Defender',
    'pos-Centrocampista': 'Midfielder',
    'pos-Delantero': 'Forward',
    // Status mapping
    'status-Activo': 'Active',
    'status-Lesionado': 'Injured',
    'status-Sancionado': 'Suspended',
    // Ratings
    'rate-5': '⭐⭐⭐⭐⭐ (5 - Excellent)',
    'rate-4': '⭐⭐⭐⭐ (4 - Good)',
    'rate-3': '⭐⭐⭐ (3 - Average)',
    'rate-2': '⭐⭐ (2 - Poor)',
    'rate-1': '⭐ (1 - Very Poor)',
    // Detail Modal
    'detail-dorsal': 'Number',
    'detail-age': 'Age',
    'detail-years': 'years',
    'detail-nationality': 'Nationality',
    'detail-status': 'Status',
    'detail-size': 'Size',
    'detail-id': 'Player ID',
    'detail-goals': 'Goals',
    'detail-assists': 'Assists',
    'detail-matches': 'Matches',
    // Toast & Confirm
    'toast-required': 'Complete the required fields',
    'toast-updated': '✅ Player updated',
    'toast-added': '✅ Player added',
    'toast-deleted': '🗑️ Player deleted',
    'toast-sync-ok': '✅ Synchronized with Supabase',
    'toast-sync-err': '⚠️ Error synchronizing with Supabase',
    'toast-upload-start': '📤 Uploading image to Storage...',
    'toast-upload-ok': '✅ Image uploaded to Storage',
    'toast-upload-db': '⚠️ Using database storage for the photo',
    'toast-db-deleted': '🗑️ Deleted from Supabase',
    'confirm-delete': 'Delete {name}?',
  }
};

let currentLang = localStorage.getItem('ftm_lang') || 'es';

function t(key, replacements = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.es;
  let text = dict[key] || TRANSLATIONS.es[key] || key;
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  return text;
}

function translatePosition(pos) {
  return t(`pos-${pos}`);
}

function translateStatus(status) {
  return t(`status-${status}`);
}

function updateLanguageUI() {
  // Translate static text nodes with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Translate placeholders
  document.getElementById('search-input').placeholder = t('search-placeholder');
  document.getElementById('f-foto').placeholder = t('form-photo-placeholder');
  document.getElementById('f-nombre').placeholder = t('form-name-placeholder');
  document.getElementById('f-apellido').placeholder = t('form-lastname-placeholder');
  document.getElementById('f-nacionalidad').placeholder = t('form-nationality-placeholder');
  document.getElementById('f-talla').placeholder = t('form-size-placeholder');

  // Update language buttons active state
  document.querySelectorAll('.btn-lang').forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ftm_lang', lang);
  updateLanguageUI();
  renderPlayers();
}

// ────────────────────────────────────────────────
// 3. STORAGE
// ────────────────────────────────────────────────
const STORAGE_KEY = 'ftm_players_v2';

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, nextId }));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      players = data.players || [];
      nextId  = data.nextId  || 21;
    } else {
      players = structuredClone(PLAYERS_DEFAULT);
      nextId  = 21;
      saveToStorage();
    }
  } catch (_) {
    players = structuredClone(PLAYERS_DEFAULT);
    nextId  = 21;
  }
}

// ────────────────────────────────────────────────
// 4. HELPERS
// ────────────────────────────────────────────────
function getInitials(nombre, apellido) {
  return ((nombre[0] || '') + (apellido[0] || '')).toUpperCase();
}

function getPositionClass(posicion) {
  return 'pos-' + posicion.replace(/\s+/g, '');
}

function getBadgePosClass(posicion) {
  return 'badge-pos-' + posicion.replace(/\s+/g, '');
}

function getFilteredSorted() {
  let list = [...players];

  // Filtro posición
  if (activeFilter !== 'all') {
    list = list.filter(p => p.posicion === activeFilter);
  }

  // Búsqueda
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    list = list.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      String(p.dorsal).includes(q) ||
      p.posicion.toLowerCase().includes(q)
    );
  }

  // Ordenación
  list.sort((a, b) => {
    switch (sortBy) {
      case 'nombre':  return (a.nombre + a.apellido).localeCompare(b.nombre + b.apellido);
      case 'goles':   return b.goles - a.goles;
      case 'edad':    return a.edad - b.edad;
      case 'val':     return (b.val || 5) - (a.val || 5);
      default:        return a.dorsal - b.dorsal; // dorsal
    }
  });

  return list;
}

// ────────────────────────────────────────────────
// 5. RENDER
// ────────────────────────────────────────────────
function updateHeaderStats() {
  document.getElementById('stat-total').textContent   = players.length;
  document.getElementById('stat-activos').textContent = players.filter(p => p.estado === 'Activo').length;
  document.getElementById('stat-goles').textContent   = players.reduce((s, p) => s + (p.goles || 0), 0);
}

function renderPlayers() {
  const grid   = document.getElementById('players-grid');
  const empty  = document.getElementById('empty-state');
  const list   = getFilteredSorted();

  grid.innerHTML = '';

  if (list.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.forEach((p, idx) => {
    const card = document.createElement('article');
    card.className = 'player-card';
    card.style.animationDelay = `${idx * 40}ms`;
    card.dataset.id = p.id;

    const avatarContent = p.foto 
      ? `<img src="${p.foto}" alt="${p.nombre}" class="avatar-img" />`
      : getInitials(p.nombre, p.apellido);

    card.innerHTML = `
      <div class="card-top ${getPositionClass(p.posicion)}">
        <div class="card-dorsal">${p.dorsal}</div>
        <div class="card-avatar ${getPositionClass(p.posicion)}" style="${p.foto ? 'background: var(--surface-2);' : ''}">${avatarContent}</div>
      </div>
      <div class="card-body">
        <div class="card-name">${p.nombre} ${p.apellido}</div>
        <div class="card-meta">
          <span class="badge-posicion ${getBadgePosClass(p.posicion)}">${translatePosition(p.posicion)}</span>
          <span class="badge-estado estado-${p.estado}">${translateStatus(p.estado)}</span>
          <span class="badge-val">⭐ ${p.val || 5}</span>
        </div>
        <div class="card-stats">
          <div class="cs-item"><span class="cs-num">${p.goles}</span><span class="cs-label">${t('card-goals')}</span></div>
          <div class="cs-item"><span class="cs-num">${p.asistencias}</span><span class="cs-label">${t('card-assists')}</span></div>
          <div class="cs-item"><span class="cs-num">${p.partidos}</span><span class="cs-label">${t('card-matches')}</span></div>
          <div class="cs-item"><span class="cs-num">${p.edad ?? '—'}</span><span class="cs-label">${t('card-age')}</span></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn edit" data-action="edit" data-id="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          ${t('card-edit')}
        </button>
        <button class="card-btn delete" data-action="delete" data-id="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          ${t('card-delete')}
        </button>
      </div>
    `;

    // Click en card → detalle (no en botones)
    card.addEventListener('click', e => {
      if (!e.target.closest('.card-btn')) openDetail(p.id);
    });

    // Botones dentro de la card
    card.querySelectorAll('.card-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (btn.dataset.action === 'edit')   openEdit(Number(btn.dataset.id));
        if (btn.dataset.action === 'delete') deletePlayer(Number(btn.dataset.id));
      });
    });

    grid.appendChild(card);
  });

  updateHeaderStats();
}

// ────────────────────────────────────────────────
// 6. MODAL ADD/EDIT
// ────────────────────────────────────────────────
const modalOverlay = document.getElementById('modal-overlay');
const playerForm   = document.getElementById('player-form');
const modalTitle   = document.getElementById('modal-title');
const avatarPreview= document.getElementById('avatar-preview');

async function uploadPhotoToSupabase(playerId, file) {
  if (!supabaseClient) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${playerId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error } = await supabaseClient.storage
      .from('player-photos')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      console.warn('Supabase Storage bucket upload warning:', error);
      return null;
    }

    const { data: { publicUrl } } = supabaseClient.storage
      .from('player-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err) {
    console.error('Error in uploadPhotoToSupabase:', err);
    return null;
  }
}

function openAdd() {
  editingId = null;
  modalTitle.textContent = t('modal-title-new');
  playerForm.reset();
  document.getElementById('player-id').value = '';
  document.getElementById('f-foto').value = '';
  document.getElementById('f-foto-file').value = '';
  tempFotoUrl = null;
  document.getElementById('f-val').value = '5';
  document.getElementById('f-estado-activo').checked = true;
  avatarPreview.textContent = '?';
  avatarPreview.style.background = 'linear-gradient(135deg, var(--green), #00a866)';
  clearErrors();
  openModal(modalOverlay);
}

function openEdit(id) {
  const p = players.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  modalTitle.textContent = t('modal-title-edit');
  document.getElementById('player-id').value   = p.id;
  document.getElementById('f-nombre').value    = p.nombre;
  document.getElementById('f-apellido').value  = p.apellido;
  document.getElementById('f-dorsal').value    = p.dorsal;
  document.getElementById('f-posicion').value  = p.posicion;
  document.getElementById('f-edad').value      = p.edad || '';
  document.getElementById('f-nacionalidad').value = p.nacionalidad || '';
  document.getElementById('f-talla').value     = p.talla || '';
  document.getElementById('f-goles').value     = p.goles || 0;
  document.getElementById('f-asistencias').value = p.asistencias || 0;
  document.getElementById('f-partidos').value  = p.partidos || 0;
  document.getElementById('f-val').value       = p.val || 5;
  document.getElementById('f-foto').value      = p.foto || '';
  document.getElementById('f-foto-file').value = '';
  tempFotoUrl = p.foto || null;
  document.querySelector(`input[name="estado"][value="${p.estado}"]`).checked = true;
  updateAvatarPreview(p.nombre, p.posicion, p.foto);
  clearErrors();
  openModal(modalOverlay);
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function validateForm() {
  let valid = true;
  const required = ['f-nombre', 'f-apellido', 'f-dorsal', 'f-posicion'];
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  return valid;
}

function updateAvatarPreview(nombre, posicion, fotoUrl) {
  const initial = nombre ? nombre[0].toUpperCase() : '?';
  const colors = {
    'Portero':        'linear-gradient(135deg, #6366f1, #4f46e5)',
    'Defensa':        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Centrocampista': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Delantero':      'linear-gradient(135deg, #ef4444, #b91c1c)',
  };
  if (fotoUrl) {
    avatarPreview.innerHTML = `<img src="${fotoUrl}" alt="Preview" class="avatar-img" />`;
    avatarPreview.style.background = 'none';
  } else {
    avatarPreview.innerHTML = initial;
    avatarPreview.style.background = colors[posicion] || 'linear-gradient(135deg, var(--green), #00a866)';
  }
}

// Live avatar preview
document.getElementById('f-nombre').addEventListener('input', () => {
  const nombre   = document.getElementById('f-nombre').value;
  const posicion = document.getElementById('f-posicion').value;
  updateAvatarPreview(nombre, posicion, tempFotoUrl);
});
document.getElementById('f-posicion').addEventListener('change', () => {
  const nombre   = document.getElementById('f-nombre').value;
  const posicion = document.getElementById('f-posicion').value;
  updateAvatarPreview(nombre, posicion, tempFotoUrl);
});

// Photo inputs listeners
document.getElementById('f-foto-file').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 1024 * 1024) {
      showToast('⚠️ Imagen grande. Se guardará, pero se recomienda < 1MB', 'warning');
    }
    const reader = new FileReader();
    reader.onload = function(evt) {
      tempFotoUrl = evt.target.result;
      document.getElementById('f-foto').value = ''; // Clear URL text if user uploads a file
      const nombre = document.getElementById('f-nombre').value;
      const posicion = document.getElementById('f-posicion').value;
      updateAvatarPreview(nombre, posicion, tempFotoUrl);
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById('f-foto').addEventListener('input', e => {
  tempFotoUrl = e.target.value.trim() || null;
  const nombre = document.getElementById('f-nombre').value;
  const posicion = document.getElementById('f-posicion').value;
  updateAvatarPreview(nombre, posicion, tempFotoUrl);
});

playerForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!validateForm()) { showToast(t('toast-required'), 'error'); return; }

  const isNew = !editingId;
  const id = editingId || nextId++;

  const fileInput = document.getElementById('f-foto-file');
  const file = fileInput.files[0];
  let finalFotoUrl = tempFotoUrl;

  // If there's a file selected and we are connected to Supabase, try uploading it to Storage
  if (file && supabaseClient) {
    showToast(t('toast-upload-start'), 'info');
    const uploadedUrl = await uploadPhotoToSupabase(id, file);
    if (uploadedUrl) {
      finalFotoUrl = uploadedUrl;
      showToast(t('toast-upload-ok'), 'success');
    } else {
      showToast(t('toast-upload-db'), 'warning');
    }
  }

  const player = {
    id:           id,
    nombre:       document.getElementById('f-nombre').value.trim(),
    apellido:     document.getElementById('f-apellido').value.trim(),
    dorsal:       Number(document.getElementById('f-dorsal').value),
    posicion:     document.getElementById('f-posicion').value,
    edad:         Number(document.getElementById('f-edad').value) || null,
    nacionalidad: document.getElementById('f-nacionalidad').value.trim() || '—',
    talla:        document.getElementById('f-talla').value.trim() || '—',
    goles:        Number(document.getElementById('f-goles').value) || 0,
    asistencias:  Number(document.getElementById('f-asistencias').value) || 0,
    partidos:     Number(document.getElementById('f-partidos').value) || 0,
    estado:       document.querySelector('input[name="estado"]:checked').value,
    val:          Number(document.getElementById('f-val').value) || 5,
    foto:         finalFotoUrl || null
  };

  if (editingId) {
    const idx = players.findIndex(p => p.id === editingId);
    if (idx !== -1) players[idx] = player;
    showToast(t('toast-updated'), 'success');
  } else {
    players.push(player);
    showToast(t('toast-added'), 'success');
  }

  saveToStorage();
  renderPlayers();
  closeModal(modalOverlay);

  // Sincronizar en segundo plano con Supabase
  if (supabaseClient) {
    const dbPayload = {
      nombre:       player.nombre,
      apellido:     player.apellido,
      dorsal:       player.dorsal,
      posicion:     player.posicion,
      edad:         player.edad,
      nacionalidad: player.nacionalidad,
      talla:        player.talla,
      goles:        player.goles,
      asistencias:  player.asistencias,
      partidos:     player.partidos,
      estado:       player.estado,
      val:          player.val,
      foto:         player.foto
    };

    if (isNew) {
      dbPayload.id = player.id;
      supabaseClient
        .from('players')
        .insert(dbPayload)
        .then(({ error }) => {
          if (error) {
            console.error('Error al guardar en Supabase:', error);
            showToast(t('toast-sync-err'), 'error');
          } else {
            showToast(t('toast-sync-ok'), 'success');
          }
        });
    } else {
      supabaseClient
        .from('players')
        .update(dbPayload)
        .eq('id', player.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error al actualizar en Supabase:', error);
            showToast(t('toast-sync-err'), 'error');
          } else {
            showToast(t('toast-sync-ok'), 'success');
          }
        });
    }
  }
});

// ────────────────────────────────────────────────
// 7. ELIMINAR JUGADOR
// ────────────────────────────────────────────────
function deletePlayer(id) {
  const p = players.find(x => x.id === id);
  if (!p) return;
  if (!confirm(t('confirm-delete', { name: `${p.nombre} ${p.apellido}` }))) return;
  
  players = players.filter(x => x.id !== id);
  saveToStorage();
  renderPlayers();
  showToast(t('toast-deleted'));

  // Eliminar en Supabase
  if (supabaseClient) {
    supabaseClient
      .from('players')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          console.error('Error al eliminar en Supabase:', error);
          showToast(t('toast-sync-err'), 'error');
        } else {
          showToast(t('toast-db-deleted'), 'success');
        }
      });
  }
}

// ────────────────────────────────────────────────
// 8. MODAL DETALLE
// ────────────────────────────────────────────────
const detailOverlay = document.getElementById('detail-overlay');

function openDetail(id) {
  const p = players.find(x => x.id === id);
  if (!p) return;

  const posColorMap = {
    'Portero':        'linear-gradient(135deg, #6366f1, #4f46e5)',
    'Defensa':        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Centrocampista': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Delantero':      'linear-gradient(135deg, #ef4444, #b91c1c)',
  };

  const detailAvatarContent = p.foto 
    ? `<img src="${p.foto}" alt="${p.nombre}" class="avatar-img" />`
    : getInitials(p.nombre, p.apellido);

  document.getElementById('detail-body').innerHTML = `
    <div class="detail-hero ${getPositionClass(p.posicion)}">
      <div class="detail-avatar ${getPositionClass(p.posicion)}" style="${p.foto ? 'background: var(--surface-2);' : ''}">${detailAvatarContent}</div>
      <div class="detail-num">${p.dorsal}</div>
    </div>
    <div class="detail-body">
      <div class="detail-name">${p.nombre} ${p.apellido}</div>
      <div class="detail-badges">
        <span class="badge-posicion ${getBadgePosClass(p.posicion)}">${translatePosition(p.posicion)}</span>
        <span class="badge-estado estado-${p.estado}">${translateStatus(p.estado)}</span>
        <span class="badge-val" style="background: rgba(255, 200, 66, 0.2); color: var(--yellow); font-weight: 700; display: inline-flex; align-items: center; gap: 3px;">
          ${'★'.repeat(p.val || 5)}${'☆'.repeat(5 - (p.val || 5))}
        </span>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <div class="label">${t('detail-dorsal')}</div>
          <div class="value">#${p.dorsal}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">${t('detail-age')}</div>
          <div class="value">${p.edad ? p.edad + ' ' + t('detail-years') : '—'}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">${t('detail-nationality')}</div>
          <div class="value">${p.nacionalidad || '—'}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">${t('detail-status')}</div>
          <div class="value">${translateStatus(p.estado)}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">${t('detail-size')}</div>
          <div class="value">${p.talla || '—'}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">${t('detail-id')}</div>
          <div class="value">#${p.id}</div>
        </div>
      </div>
      <div class="detail-stats-row">
        <div class="dsr-item">
          <div class="dsr-num">${p.goles}</div>
          <div class="dsr-label">${t('detail-goals')}</div>
        </div>
        <div class="dsr-item">
          <div class="dsr-num">${p.asistencias}</div>
          <div class="dsr-label">${t('detail-assists')}</div>
        </div>
        <div class="dsr-item">
          <div class="dsr-num">${p.partidos}</div>
          <div class="dsr-label">${t('detail-matches')}</div>
        </div>
      </div>
    </div>
  `;

  openModal(detailOverlay);
}

// ────────────────────────────────────────────────
// 9. MODAL HELPERS
// ────────────────────────────────────────────────
function openModal(overlay)  { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }

document.getElementById('btn-add-player').addEventListener('click', openAdd);
document.getElementById('modal-close').addEventListener('click', () => closeModal(modalOverlay));
document.getElementById('btn-cancel').addEventListener('click', () => closeModal(modalOverlay));
document.getElementById('detail-close').addEventListener('click', () => closeModal(detailOverlay));

// Cerrar al hacer clic fuera
[modalOverlay, detailOverlay].forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal(overlay);
  });
});

// Cerrar con Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal(modalOverlay);
    closeModal(detailOverlay);
  }
});

// ────────────────────────────────────────────────
// 10. FILTROS Y BÚSQUEDA
// ────────────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderPlayers();
  });
});

document.getElementById('search-input').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderPlayers();
});

document.getElementById('sort-select').addEventListener('change', e => {
  sortBy = e.target.value;
  renderPlayers();
});

// ────────────────────────────────────────────────
// 11. TOAST
// ────────────────────────────────────────────────
let toastTimer = null;

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  // forzar reflow para reiniciar animación
  void toast.offsetWidth;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ────────────────────────────────────────────────
// 12. INIT
// ────────────────────────────────────────────────
(function init() {
  loadFromStorage();
  updateLanguageUI();
  renderPlayers();
  updateHeaderStats();
  if (supabaseClient) {
    fetchPlayersFromSupabase();
  }
  // Bind language switching button events
  document.querySelectorAll('.btn-lang').forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });
})();
