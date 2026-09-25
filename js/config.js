/**
 * Configuración de tarifas por hora (MVP).
 * Los valores son estimaciones de referencia por país + profesión + nivel de experiencia.
 * En una fase futura esto puede reemplazarse por datos reales o una API externa,
 * por eso vive separado del resto de la lógica y de la interfaz.
 */

const PROFESSIONS = [
  { id: 'web_dev', label: 'Desarrollo web' },
  { id: 'graphic_design', label: 'Diseño gráfico' },
  { id: 'marketing', label: 'Marketing digital' },
  { id: 'video_editing', label: 'Edición de video' },
  { id: 'photography', label: 'Fotografía' },
  { id: 'copywriting', label: 'Redacción / Copywriting' },
];

const EXPERIENCE_LEVELS = [
  { id: 'junior', label: 'Junior' },
  { id: 'mid', label: 'Mid' },
  { id: 'senior', label: 'Senior' },
];

/**
 * rates: valor por hora en moneda local, según profesión y nivel.
 * currency: código ISO 4217 usado por Intl.NumberFormat.
 * locale: usado para formatear el número según la convención del país.
 */
const COUNTRIES = {
  CO: {
    label: 'Colombia',
    currency: 'COP',
    locale: 'es-CO',
    rates: {
      web_dev: { junior: 25000, mid: 45000, senior: 75000 },
      graphic_design: { junior: 20000, mid: 35000, senior: 60000 },
      marketing: { junior: 22000, mid: 40000, senior: 65000 },
      video_editing: { junior: 20000, mid: 38000, senior: 62000 },
      photography: { junior: 25000, mid: 42000, senior: 70000 },
      copywriting: { junior: 18000, mid: 32000, senior: 55000 },
    },
  },
  MX: {
    label: 'México',
    currency: 'MXN',
    locale: 'es-MX',
    rates: {
      web_dev: { junior: 120, mid: 220, senior: 380 },
      graphic_design: { junior: 100, mid: 180, senior: 300 },
      marketing: { junior: 110, mid: 200, senior: 330 },
      video_editing: { junior: 100, mid: 190, senior: 320 },
      photography: { junior: 130, mid: 210, senior: 350 },
      copywriting: { junior: 90, mid: 160, senior: 280 },
    },
  },
  AR: {
    label: 'Argentina',
    currency: 'ARS',
    locale: 'es-AR',
    rates: {
      web_dev: { junior: 4500, mid: 8500, senior: 14000 },
      graphic_design: { junior: 3800, mid: 7000, senior: 11500 },
      marketing: { junior: 4000, mid: 7500, senior: 12500 },
      video_editing: { junior: 3800, mid: 7200, senior: 12000 },
      photography: { junior: 4200, mid: 7800, senior: 13000 },
      copywriting: { junior: 3500, mid: 6500, senior: 10500 },
    },
  },
  CL: {
    label: 'Chile',
    currency: 'CLP',
    locale: 'es-CL',
    rates: {
      web_dev: { junior: 9000, mid: 16000, senior: 27000 },
      graphic_design: { junior: 7500, mid: 13000, senior: 21000 },
      marketing: { junior: 8000, mid: 14500, senior: 23000 },
      video_editing: { junior: 7500, mid: 13500, senior: 22000 },
      photography: { junior: 9000, mid: 15000, senior: 25000 },
      copywriting: { junior: 7000, mid: 12000, senior: 19500 },
    },
  },
  PE: {
    label: 'Perú',
    currency: 'PEN',
    locale: 'es-PE',
    rates: {
      web_dev: { junior: 30, mid: 55, senior: 90 },
      graphic_design: { junior: 25, mid: 45, senior: 75 },
      marketing: { junior: 27, mid: 48, senior: 80 },
      video_editing: { junior: 25, mid: 46, senior: 78 },
      photography: { junior: 30, mid: 50, senior: 85 },
      copywriting: { junior: 22, mid: 40, senior: 68 },
    },
  },
  EC: {
    label: 'Ecuador',
    currency: 'USD',
    locale: 'es-EC',
    rates: {
      web_dev: { junior: 8, mid: 15, senior: 25 },
      graphic_design: { junior: 7, mid: 12, senior: 20 },
      marketing: { junior: 7.5, mid: 13, senior: 22 },
      video_editing: { junior: 7, mid: 12.5, senior: 21 },
      photography: { junior: 8, mid: 14, senior: 23 },
      copywriting: { junior: 6, mid: 11, senior: 18 },
    },
  },
};

// Se exponen en window para poder usarse desde otros scripts sin build tools ni módulos.
window.APP_CONFIG = { COUNTRIES, PROFESSIONS, EXPERIENCE_LEVELS };
