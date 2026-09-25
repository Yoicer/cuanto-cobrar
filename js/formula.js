/**
 * Lógica de cálculo de precios, separada de la interfaz.
 * Cualquier cambio en la fórmula del negocio se hace solo aquí.
 */

/**
 * Calcula el precio recomendado para un proyecto freelance.
 *
 * @param {Object} params
 * @param {number} params.hourly_rate - Valor hora base según país/profesión/experiencia.
 * @param {number} params.estimated_hours - Horas estimadas del proyecto.
 * @param {number} params.profit_margin_percent - Margen de ganancia deseado (%).
 * @returns {{
 *   base_cost: number,
 *   margin_amount: number,
 *   min_price: number,
 *   ideal_price: number,
 *   estimated_hourly_value: number,
 * }}
 */
function calculate_project_price({ hourly_rate, estimated_hours, profit_margin_percent }) {
  const base_cost = hourly_rate * estimated_hours;
  const margin_amount = base_cost * (profit_margin_percent / 100);

  const min_price = base_cost;
  const ideal_price = base_cost + margin_amount;
  const estimated_hourly_value = ideal_price / estimated_hours;

  return {
    base_cost,
    margin_amount,
    min_price,
    ideal_price,
    estimated_hourly_value,
  };
}

// Se expone en window para mantener el proyecto sin módulos/build tools.
window.calculate_project_price = calculate_project_price;
