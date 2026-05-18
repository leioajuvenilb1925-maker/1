/* ================================================
   FOOTBALL TEAM MANAGER — app.js
   ================================================ */

'use strict';

// ────────────────────────────────────────────────
// 1. DATOS INICIALES — 20 jugadores
// ────────────────────────────────────────────────
const PLAYERS_DEFAULT = [
  { id: 1,  nombre: 'Julen',    apellido: 'Agirrezabala',  dorsal: 1,  posicion: 'Portero',        edad: 23, nacionalidad: 'Española', goles: 0,  asistencias: 0, partidos: 28, estado: 'Activo'    },
  { id: 2,  nombre: 'Unai',     apellido: 'Simón',         dorsal: 25, posicion: 'Portero',        edad: 27, nacionalidad: 'Española', goles: 0,  asistencias: 0, partidos: 12, estado: 'Activo'    },
  { id: 3,  nombre: 'Dani',     apellido: 'Vivian',        dorsal: 3,  posicion: 'Defensa',        edad: 24, nacionalidad: 'Española', goles: 2,  asistencias: 1, partidos: 30, estado: 'Activo'    },
  { id: 4,  nombre: 'Mikel',    apellido: 'Jauregizar',    dorsal: 4,  posicion: 'Defensa',        edad: 23, nacionalidad: 'Española', goles: 0,  asistencias: 2, partidos: 18, estado: 'Lesionado' },
  { id: 5,  nombre: 'Yeray',    apellido: 'Álvarez',       dorsal: 14, posicion: 'Defensa',        edad: 29, nacionalidad: 'Española', goles: 1,  asistencias: 0, partidos: 25, estado: 'Activo'    },
  { id: 6,  nombre: 'Lekue',    apellido: 'Iñigo',         dorsal: 17, posicion: 'Defensa',        edad: 30, nacionalidad: 'Española', goles: 1,  asistencias: 3, partidos: 22, estado: 'Activo'    },
  { id: 7,  nombre: 'Oscar',    apellido: 'De Marcos',     dorsal: 18, posicion: 'Defensa',        edad: 34, nacionalidad: 'Española', goles: 2,  asistencias: 4, partidos: 20, estado: 'Activo'    },
  { id: 8,  nombre: 'Unai',     apellido: 'Vencedor',      dorsal: 6,  posicion: 'Centrocampista', edad: 25, nacionalidad: 'Española', goles: 3,  asistencias: 5, partidos: 32, estado: 'Activo'    },
  { id: 9,  nombre: 'Ander',    apellido: 'Herrera',       dorsal: 22, posicion: 'Centrocampista', edad: 35, nacionalidad: 'Española', goles: 2,  asistencias: 4, partidos: 19, estado: 'Activo'    },
  { id: 10, nombre: 'Oier',     apellido: 'Zarraga',       dorsal: 24, posicion: 'Centrocampista', edad: 23, nacionalidad: 'Española', goles: 4,  asistencias: 6, partidos: 30, estado: 'Activo'    },
  { id: 11, nombre: 'Mikel',    apellido: 'Vesga',         dorsal: 15, posicion: 'Centrocampista', edad: 30, nacionalidad: 'Española', goles: 3,  asistencias: 2, partidos: 28, estado: 'Sancionado'},
  { id: 12, nombre: 'Dani',     apellido: 'García',        dorsal: 16, posicion: 'Centrocampista', edad: 32, nacionalidad: 'Española', goles: 1,  asistencias: 3, partidos: 24, estado: 'Activo'    },
  { id: 13, nombre: 'Beñat',    apellido: 'Prados',        dorsal: 8,  posicion: 'Centrocampista', edad: 25, nacionalidad: 'Española', goles: 5,  asistencias: 7, partidos: 33, estado: 'Activo'    },
  { id: 14, nombre: 'Nico',     apellido: 'Williams',      dorsal: 10, posicion: 'Delantero',      edad: 21, nacionalidad: 'Española', goles: 14, asistencias: 9, partidos: 34, estado: 'Activo'    },
  { id: 15, nombre: 'Iñaki',    apellido: 'Williams',      dorsal: 9,  posicion: 'Delantero',      edad: 29, nacionalidad: 'Ghanesa',  goles: 12, asistencias: 8, partidos: 32, estado: 'Activo'    },
  { id: 16, nombre: 'Gorka',    apellido: 'Guruzeta',      dorsal: 21, posicion: 'Delantero',      edad: 27, nacionalidad: 'Española', goles: 11, asistencias: 3, partidos: 28, estado: 'Activo'    },
  { id: 17, nombre: 'Asier',    apellido: 'Villalibre',    dorsal: 19, posicion: 'Delantero',      edad: 27, nacionalidad: 'Española', goles: 8,  asistencias: 2, partidos: 26, estado: 'Activo'    },
  { id: 18, nombre: 'Sancet',   apellido: 'Oihan',         dorsal: 20, posicion: 'Delantero',      edad: 24, nacionalidad: 'Española', goles: 9,  asistencias: 5, partidos: 31, estado: 'Lesionado' },
  { id: 19, nombre: 'Jon',      apellido: 'Morcillo',      dorsal: 11, posicion: 'Delantero',      edad: 21, nacionalidad: 'Española', goles: 6,  asistencias: 4, partidos: 29, estado: 'Activo'    },
  { id: 20, nombre: 'Yuri',     apellido: 'Berchiche',     dorsal: 5,  posicion: 'Defensa',        edad: 34, nacionalidad: 'Española', goles: 1,  asistencias: 5, partidos: 21, estado: 'Activo'    },
];

// ────────────────────────────────────────────────
// 2. STATE
// ────────────────────────────────────────────────
let players   = [];
let nextId    = 21;
let activeFilter = 'all';
let searchQuery  = '';
let sortBy       = 'dorsal';
let editingId    = null;

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

    card.innerHTML = `
      <div class="card-top ${getPositionClass(p.posicion)}">
        <div class="card-dorsal">${p.dorsal}</div>
        <div class="card-avatar ${getPositionClass(p.posicion)}">${getInitials(p.nombre, p.apellido)}</div>
      </div>
      <div class="card-body">
        <div class="card-name">${p.nombre} ${p.apellido}</div>
        <div class="card-meta">
          <span class="badge-posicion ${getBadgePosClass(p.posicion)}">${p.posicion}</span>
          <span class="badge-estado estado-${p.estado}">${p.estado}</span>
        </div>
        <div class="card-stats">
          <div class="cs-item"><span class="cs-num">${p.goles}</span><span class="cs-label">Goles</span></div>
          <div class="cs-item"><span class="cs-num">${p.asistencias}</span><span class="cs-label">Asist.</span></div>
          <div class="cs-item"><span class="cs-num">${p.partidos}</span><span class="cs-label">Partidos</span></div>
          <div class="cs-item"><span class="cs-num">${p.edad ?? '—'}</span><span class="cs-label">Edad</span></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="card-btn edit" data-action="edit" data-id="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Editar
        </button>
        <button class="card-btn delete" data-action="delete" data-id="${p.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Eliminar
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

function openAdd() {
  editingId = null;
  modalTitle.textContent = 'Nuevo Jugador';
  playerForm.reset();
  document.getElementById('player-id').value = '';
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
  modalTitle.textContent = 'Editar Jugador';
  document.getElementById('player-id').value   = p.id;
  document.getElementById('f-nombre').value    = p.nombre;
  document.getElementById('f-apellido').value  = p.apellido;
  document.getElementById('f-dorsal').value    = p.dorsal;
  document.getElementById('f-posicion').value  = p.posicion;
  document.getElementById('f-edad').value      = p.edad || '';
  document.getElementById('f-nacionalidad').value = p.nacionalidad || '';
  document.getElementById('f-goles').value     = p.goles || 0;
  document.getElementById('f-asistencias').value = p.asistencias || 0;
  document.getElementById('f-partidos').value  = p.partidos || 0;
  document.querySelector(`input[name="estado"][value="${p.estado}"]`).checked = true;
  updateAvatarPreview(p.nombre, p.posicion);
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

function updateAvatarPreview(nombre, posicion) {
  const initial = nombre ? nombre[0].toUpperCase() : '?';
  const colors = {
    'Portero':        'linear-gradient(135deg, #6366f1, #4f46e5)',
    'Defensa':        'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    'Centrocampista': 'linear-gradient(135deg, #f59e0b, #d97706)',
    'Delantero':      'linear-gradient(135deg, #ef4444, #b91c1c)',
  };
  avatarPreview.textContent = initial;
  avatarPreview.style.background = colors[posicion] || 'linear-gradient(135deg, var(--green), #00a866)';
}

// Live avatar preview
document.getElementById('f-nombre').addEventListener('input', () => {
  const nombre   = document.getElementById('f-nombre').value;
  const posicion = document.getElementById('f-posicion').value;
  updateAvatarPreview(nombre, posicion);
});
document.getElementById('f-posicion').addEventListener('change', () => {
  const nombre   = document.getElementById('f-nombre').value;
  const posicion = document.getElementById('f-posicion').value;
  updateAvatarPreview(nombre, posicion);
});

playerForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validateForm()) { showToast('Completa los campos obligatorios', 'error'); return; }

  const player = {
    id:           editingId || nextId++,
    nombre:       document.getElementById('f-nombre').value.trim(),
    apellido:     document.getElementById('f-apellido').value.trim(),
    dorsal:       Number(document.getElementById('f-dorsal').value),
    posicion:     document.getElementById('f-posicion').value,
    edad:         Number(document.getElementById('f-edad').value) || null,
    nacionalidad: document.getElementById('f-nacionalidad').value.trim() || '—',
    goles:        Number(document.getElementById('f-goles').value) || 0,
    asistencias:  Number(document.getElementById('f-asistencias').value) || 0,
    partidos:     Number(document.getElementById('f-partidos').value) || 0,
    estado:       document.querySelector('input[name="estado"]:checked').value,
  };

  if (editingId) {
    const idx = players.findIndex(p => p.id === editingId);
    if (idx !== -1) players[idx] = player;
    showToast('✅ Jugador actualizado', 'success');
  } else {
    players.push(player);
    showToast('✅ Jugador añadido', 'success');
  }

  saveToStorage();
  renderPlayers();
  closeModal(modalOverlay);
});

// ────────────────────────────────────────────────
// 7. ELIMINAR JUGADOR
// ────────────────────────────────────────────────
function deletePlayer(id) {
  const p = players.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`¿Eliminar a ${p.nombre} ${p.apellido}?`)) return;
  players = players.filter(x => x.id !== id);
  saveToStorage();
  renderPlayers();
  showToast('🗑️ Jugador eliminado');
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

  document.getElementById('detail-body').innerHTML = `
    <div class="detail-hero ${getPositionClass(p.posicion)}">
      <div class="detail-avatar ${getPositionClass(p.posicion)}">${getInitials(p.nombre, p.apellido)}</div>
      <div class="detail-num">${p.dorsal}</div>
    </div>
    <div class="detail-body">
      <div class="detail-name">${p.nombre} ${p.apellido}</div>
      <div class="detail-badges">
        <span class="badge-posicion ${getBadgePosClass(p.posicion)}">${p.posicion}</span>
        <span class="badge-estado estado-${p.estado}">${p.estado}</span>
      </div>
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <div class="label">Dorsal</div>
          <div class="value">#${p.dorsal}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">Edad</div>
          <div class="value">${p.edad ? p.edad + ' años' : '—'}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">Nacionalidad</div>
          <div class="value">${p.nacionalidad || '—'}</div>
        </div>
        <div class="detail-info-item">
          <div class="label">Estado</div>
          <div class="value">${p.estado}</div>
        </div>
      </div>
      <div class="detail-stats-row">
        <div class="dsr-item">
          <div class="dsr-num">${p.goles}</div>
          <div class="dsr-label">Goles</div>
        </div>
        <div class="dsr-item">
          <div class="dsr-num">${p.asistencias}</div>
          <div class="dsr-label">Asistencias</div>
        </div>
        <div class="dsr-item">
          <div class="dsr-num">${p.partidos}</div>
          <div class="dsr-label">Partidos</div>
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
  renderPlayers();
  updateHeaderStats();
})();
