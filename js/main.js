/**
 * Interfaz: llena selects, valida el formulario, calcula y muestra resultados.
 * La lógica de negocio vive en formula.js y config.js.
 */

(function () {
  const { COUNTRIES, PROFESSIONS, EXPERIENCE_LEVELS } = window.APP_CONFIG;

  const form = document.getElementById('calculator_form');
  const country_select = document.getElementById('country');
  const profession_select = document.getElementById('profession');
  const experience_select = document.getElementById('experience_level');
  const hours_input = document.getElementById('estimated_hours');
  const margin_input = document.getElementById('profit_margin');

  const result_section = document.getElementById('result');
  const result_price_range = document.getElementById('result_price_range');
  const result_hourly_value = document.getElementById('result_hourly_value');
  const result_breakdown_list = document.getElementById('result_breakdown_list');

  const copy_result_btn = document.getElementById('copy_result_btn');
  const recalculate_btn = document.getElementById('recalculate_btn');
  const copy_feedback = document.getElementById('copy_feedback');

  let last_result_text = '';

  function populate_select(select_element, items, label_key) {
    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item[label_key];
      select_element.appendChild(option);
    });
  }

  function populate_country_select() {
    Object.keys(COUNTRIES).forEach((country_code) => {
      const option = document.createElement('option');
      option.value = country_code;
      option.textContent = COUNTRIES[country_code].label;
      country_select.appendChild(option);
    });
  }

  function format_currency(amount, currency, locale) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function set_field_error(field_id, message) {
    const error_element = document.getElementById(`${field_id}_error`);
    const field_wrapper = document.getElementById(field_id).closest('.form_field');
    error_element.textContent = message;
    field_wrapper.classList.toggle('has_error', Boolean(message));
  }

  function clear_all_errors() {
    ['country', 'profession', 'experience_level', 'estimated_hours', 'profit_margin'].forEach(
      (field_id) => set_field_error(field_id, '')
    );
  }

  /**
   * Valida el formulario. Retorna los datos limpios si todo es válido, o null si hay errores.
   */
  function validate_form() {
    clear_all_errors();
    let is_valid = true;

    const country_code = country_select.value;
    if (!country_code) {
      set_field_error('country', 'Selecciona un país.');
      is_valid = false;
    }

    const profession_id = profession_select.value;
    if (!profession_id) {
      set_field_error('profession', 'Selecciona una profesión o servicio.');
      is_valid = false;
    }

    const experience_id = experience_select.value;
    if (!experience_id) {
      set_field_error('experience_level', 'Selecciona tu nivel de experiencia.');
      is_valid = false;
    }

    const estimated_hours = Number(hours_input.value);
    if (!hours_input.value || Number.isNaN(estimated_hours) || estimated_hours <= 0) {
      set_field_error('estimated_hours', 'Ingresa un número de horas mayor a 0.');
      is_valid = false;
    }

    const profit_margin_percent = Number(margin_input.value);
    if (
      margin_input.value === '' ||
      Number.isNaN(profit_margin_percent) ||
      profit_margin_percent < 0
    ) {
      set_field_error('profit_margin', 'Ingresa un margen de ganancia válido (0 o más).');
      is_valid = false;
    }

    if (!is_valid) {
      return null;
    }

    return {
      country_code,
      profession_id,
      experience_id,
      estimated_hours,
      profit_margin_percent,
    };
  }

  function render_result(form_data) {
    const country_data = COUNTRIES[form_data.country_code];
    const hourly_rate =
      country_data.rates[form_data.profession_id][form_data.experience_id];

    const calculation = calculate_project_price({
      hourly_rate,
      estimated_hours: form_data.estimated_hours,
      profit_margin_percent: form_data.profit_margin_percent,
    });

    const { currency, locale } = country_data;
    const format = (amount) => format_currency(amount, currency, locale);

    const min_price_text = format(calculation.min_price);
    const ideal_price_text = format(calculation.ideal_price);
    const hourly_value_text = format(calculation.estimated_hourly_value);

    result_price_range.textContent = `${min_price_text} – ${ideal_price_text}`;
    result_hourly_value.textContent = hourly_value_text;

    result_breakdown_list.innerHTML = '';
    const breakdown_items = [
      `Valor hora base: ${format(hourly_rate)}`,
      `Horas estimadas: ${form_data.estimated_hours}`,
      `Costo base (valor hora × horas): ${format(calculation.base_cost)}`,
      `Margen de ganancia (${form_data.profit_margin_percent}%): ${format(
        calculation.margin_amount
      )}`,
      `Precio ideal (costo base + margen): ${format(calculation.ideal_price)}`,
    ];
    breakdown_items.forEach((text) => {
      const item = document.createElement('li');
      item.textContent = text;
      result_breakdown_list.appendChild(item);
    });

    last_result_text =
      `Precio recomendado: ${min_price_text} – ${ideal_price_text}\n` +
      `Valor hora estimado: ${hourly_value_text}`;

    // Datos que reutiliza quote.js para precargar el formulario de cotización.
    window.last_quote_data = {
      profession_label: PROFESSIONS.find((item) => item.id === form_data.profession_id).label,
      estimated_hours: form_data.estimated_hours,
      hourly_rate: calculation.estimated_hourly_value,
      currency,
      locale,
    };

    result_section.hidden = false;
    result_section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handle_submit(event) {
    event.preventDefault();
    copy_feedback.textContent = '';

    const form_data = validate_form();
    if (!form_data) {
      return;
    }

    render_result(form_data);
  }

  async function handle_copy_result() {
    if (!last_result_text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(last_result_text);
      copy_feedback.textContent = 'Resultado copiado al portapapeles.';
    } catch (error) {
      copy_feedback.textContent = 'No se pudo copiar. Copia el resultado manualmente.';
    }
  }

  function handle_recalculate() {
    result_section.hidden = true;
    copy_feedback.textContent = '';
    form.reset();
    margin_input.value = 30;
    clear_all_errors();
    country_select.focus();
    document.getElementById('calculator').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  populate_country_select();
  populate_select(profession_select, PROFESSIONS, 'label');
  populate_select(experience_select, EXPERIENCE_LEVELS, 'label');

  form.addEventListener('submit', handle_submit);
  copy_result_btn.addEventListener('click', handle_copy_result);
  recalculate_btn.addEventListener('click', handle_recalculate);
})();
