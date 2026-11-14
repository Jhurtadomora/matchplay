// ===== Datos de ejemplo (los mismos del Figma) =====
// Se usan mientras MODO_DEMO esté en true

export const jugadores = [
  {
    id: "1", nombre: "Camilo", edad: 21, deporte: "Fútbol 5", nivel: "intermedio",
    lugar: "Cancha Sintética El Bosque", horario: "Hoy · 8:00 PM",
    descripcion: "Hola, soy Camilo. Estoy armando un partido de fútbol 5 para esta noche. Busco 2 o 3 jugadores más de nivel intermedio, ambiente relajado y buena energía. ¡Anímate!",
    colorFoto: "#1e3a2e", colorTarjeta: "#3a2c26", colorInicio: "#3e5b3a", colorInfo: "#16241a",
  },
  {
    id: "2", nombre: "Diego", edad: 28, deporte: "Básquet 3×3", nivel: "principiante",
    lugar: "Coliseo Municipal", horario: "Mañana · 6:30 PM",
    descripcion: "Soy Diego, juego básquet hace poco tiempo y busco gente para armar partidos 3×3 entre semana. Nivel principiante de preferencia, pero lo importante es que quieran jugar divirtiéndose y aprendiendo juntos.",
    colorFoto: "#3a4a52", colorTarjeta: "#26333a", colorInicio: "#3a4a52", colorInfo: "#1a2226",
  },
  {
    id: "3", nombre: "Sofía", edad: 25, deporte: "Tenis (Dobles)", nivel: "avanzado",
    lugar: "Club de Tenis Los Robles", horario: "Sábado · 10:00 AM",
    descripcion: "Hola, soy Sofía. Juego tenis desde pequeña y busco personas de nivel similar para partidos los sábados en la mañana. Ambiente amistoso, sin presión, pero compitiendo a buen nivel.",
    colorFoto: "#7a4525", colorTarjeta: "#2c3a2c", colorInicio: "#7a4525", colorInfo: "#2a1a10",
  },
  {
    id: "4", nombre: "Antonia", edad: 26, deporte: "Pádel", nivel: "principiante",
    lugar: "Club Pádel Sur", horario: "Tarde · 5:30 PM",
    descripcion: "Soy Antonia, apenas estoy aprendiendo a jugar pádel y busco compañeros pacientes para practicar y mejorar juntos entre semana.",
    colorFoto: "#17587a", colorTarjeta: "#263a3a", colorInicio: "#17587a", colorInfo: "#0e2633",
  },
  {
    id: "5", nombre: "Jorge", edad: 22, deporte: "Voleibol", nivel: "intermedio",
    lugar: "Polideportivo San Fernando", horario: "Tarde · 6:00 PM",
    descripcion: "Soy Jorge, juego vóley desde hace un tiempo y quiero armar equipo para partidos amistosos entre semana. Nivel intermedio, ambiente relajado pero competitivo.",
    colorFoto: "#3a2c52", colorTarjeta: "#3a2c3a", colorInicio: "#3a2c52", colorInfo: "#1c1626",
  },
  {
    id: "6", nombre: "Miguel", edad: 29, deporte: "Ciclismo", nivel: "avanzado",
    lugar: "Punto: Parque del Perro", horario: "Noche · 7:00 PM",
    descripcion: "Soy Miguel, ando en bici hace varios años y busco grupo para rodar fuerte en la noche. Nivel avanzado, ritmo constante y buena actitud.",
    colorFoto: "#6b7580", colorTarjeta: "#3a3a26", colorInicio: "#6b7580", colorInfo: "#262a2e",
  },
];

// Orden en que aparecen en "Personas que quieren jugar contigo"
export const solicitudes = ["3", "2", "1", "5", "4", "6"];

export const eventos = [
  { id: "1", titulo: "Torneo relámpago de vóley", deporte: "Voleibol", fecha: "Sáb 2 ago", hora: "4:00 PM", lugar: "Coliseo Municipal", inscritos: 7, cupo: 10 },
  { id: "2", titulo: "Sesión nocturna de fútbol", deporte: "Fútbol", fecha: "Vie 1 ago", hora: "8:00 PM", lugar: "Cancha El Ingenio", inscritos: 9, cupo: 10 },
  { id: "3", titulo: "Maratón amistoso de baloncesto", deporte: "Básquet", fecha: "Dom 3 ago", hora: "10:00 AM", lugar: "Parque Uribe", inscritos: 4, cupo: 10 },
  { id: "4", titulo: "Clase abierta de pádel", deporte: "Pádel", fecha: "Lun 4 ago", hora: "6:30 PM", lugar: "Club Pádel Sur", inscritos: 8, cupo: 10 },
];

// ===== Datos de ejemplo de la segunda mitad (Explorar, Chat y Más) =====

// Los 8 deportes de la pantalla Explorar
export const deportes = [
  { id: "d1", nombre: "Fútbol 5", disponibles: 412 },
  { id: "d2", nombre: "Fútbol 11", disponibles: 221 },
  { id: "d3", nombre: "Baloncesto", disponibles: 198 },
  { id: "d4", nombre: "Pádel", disponibles: 176 },
  { id: "d5", nombre: "Tenis", disponibles: 132 },
  { id: "d6", nombre: "Vóleibol", disponibles: 96 },
  { id: "d7", nombre: "Natación", disponibles: 64 },
  { id: "d8", nombre: "Ciclismo", disponibles: 58 },
];

// Chats con la misma forma que responde GET /chats
export const chats = [
  { id: "c1", perfil: { id: "1", nombre: "Camilo", edad: 21, deporte: "Fútbol 5", nivel: "Intermedio" }, ultimoMensaje: "Listo, ¿cancha El Ingenio?", noLeidos: 1 },
  { id: "c2", perfil: { id: "2", nombre: "Diego", edad: 28, deporte: "Básquet 3x3", nivel: "Principiante" }, ultimoMensaje: "nivel principiante", noLeidos: 1 },
  { id: "c3", perfil: { id: "3", nombre: "Sofía", edad: 25, deporte: "Tenis", nivel: "Avanzado" }, ultimoMensaje: "Claro, ¿el miércoles te sirve?", noLeidos: 1 },
];

// Mensajes de cada chat (GET /chats/:id/mensajes). "yo" es el usuario que inició sesión.
export const mensajes: Record<string, any[]> = {
  c1: [
    { id: "m1", autorId: "1", tipo: "texto", texto: "Hola, ¿jugamos el sábado?" },
    { id: "m2", autorId: "1", tipo: "propuesta_evento", eventoId: "e1", estadoPropuesta: "aceptada" },
  ],
  c2: [
    { id: "m3", autorId: "2", tipo: "texto", texto: "Vi que también juegas básquet 3x3" },
    { id: "m4", autorId: "yo", tipo: "texto", texto: "Sí, juego los domingos en la tarde" },
    { id: "m5", autorId: "2", tipo: "propuesta_evento", eventoId: "e2", estadoPropuesta: "pendiente" },
  ],
  c3: [
    { id: "m6", autorId: "3", tipo: "texto", texto: "Hola, ¿jugamos un tenis esta semana?" },
    { id: "m7", autorId: "yo", tipo: "texto", texto: "Claro, ¿el miércoles te sirve?" },
    { id: "m8", autorId: "3", tipo: "propuesta_evento", eventoId: "e3", estadoPropuesta: "aceptada" },
  ],
};

// Eventos que se proponen dentro de los chats
export const eventosPropuestos: Record<string, any> = {
  e1: { id: "e1", deporte: "Fútbol 5", lugar: "Cancha El Ingenio", cuando: "Sábado, 5:00 pm" },
  e2: { id: "e2", deporte: "Básquet 3x3", lugar: "Parque Panamericano", cuando: "Domingo, 4:00 pm" },
  e3: { id: "e3", deporte: "Tenis", lugar: "Club Los Cristales", cuando: "Miércoles, 6:30 pm" },
};

// Perfil propio (GET /me)
export const miPerfil = {
  id: "yo",
  nombreUsuario: "camilo_torres",
  nombreCompleto: "Camilo Torres Ramírez",
  edad: 23,
  ciudad: "Cali, Colombia",
  sobreMi: "Me gusta jugar fútbol y básquet los fines de semana. Siempre buscando gente nueva para unirse.",
  deportesFavoritos: ["Fútbol 5", "Básquet 3x3"],
  nivel: "Intermedio",
  radioBusquedaKm: 10,
  idioma: "es",
  tema: "oscuro",
};

export const misNotificaciones = {
  nuevasSolicitudes: true,
  mensajesNuevos: true,
  recordatorioPartido: true,
  nuevosEventosCerca: true,
  cuposCasiLlenos: false,
  cambiosEnEventos: true,
  novedadesYPromociones: false,
};

export const miPrivacidad = {
  perfilVisibleEnBusqueda: true,
  mostrarEdad: true,
  mostrarUbicacionExacta: false,
};

export const miHorario = {
  dias: ["Lunes", "Miércoles", "Viernes"],
  franjaHoraria: "Tarde",
  notas: "Solo disponible después de las 5pm\nentre semana; fines de semana todo el día.",
};
