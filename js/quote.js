/**
 * Módulo de cotizaciones: reutiliza los datos de la calculadora (window.last_quote_data)
 * para precargar el formulario, calcula subtotal/descuento/impuestos/total y genera
 * una vista de cotización imprimible (sin backend ni base de datos).
 */

(function () {
  const generate_quote_btn = document.getElementById('generate_quote_btn');

  const quote_modal = document.getElementById('quote_modal');
  const quote_modal_overlay = document.getElementById('quote_modal_overlay');
  const quote_modal_close = document.getElementById('quote_modal_close');

  const quote_form_panel = document.getElementById('quote_form_panel');
  const quote_preview_panel = document.getElementById('quote_preview_panel');
  const quote_form = document.getElementById('quote_form');

  const freelancer_name_input = document.getElementById('quote_freelancer_name');
  const client_name_input = document.getElementById('quote_client_name');
  const service_input = document.getElementById('quote_service');
  const description_input = document.getElementById('quote_description');
  const hours_input = document.getElementById('quote_hours');
  const hourly_rate_input = document.getElementById('quote_hourly_rate');
  const discount_input = document.getElementById('quote_discount');
  const tax_input = document.getElementById('quote_tax');
  const validity_date_input = document.getElementById('quote_validity_date');
  const notes_input = document.getElementById('quote_notes');

  const quote_number_el = document.getElementById('quote_number');
  const quote_date_el = document.getElementById('quote_date');
  const preview_freelancer_el = document.getElementById('quote_preview_freelancer');
  const preview_client_el = document.getElementById('quote_preview_client');
  const preview_service_el = document.getElementById('quote_preview_service');
  const preview_description_el = document.getElementById('quote_preview_description');
  const preview_service_row_el = document.getElementById('quote_preview_service_row');
  const preview_hours_el = document.getElementById('quote_preview_hours');
  const preview_hourly_rate_el = document.getElementById('quote_preview_hourly_rate');
  const preview_subtotal_el = document.getElementById('quote_preview_subtotal');
  const total_subtotal_el = document.getElementById('quote_total_subtotal');
  const discount_row_el = document.getElementById('quote_discount_row');
  const total_discount_el = document.getElementById('quote_total_discount');
  const tax_row_el = document.getElementById('quote_tax_row');
  const total_tax_el = document.getElementById('quote_total_tax');
  const total_final_el = document.getElementById('quote_total_final');
  const preview_validity_el = document.getElementById('quote_preview_validity');
  const notes_section_el = document.getElementById('quote_notes_section');
  const preview_notes_el = document.getElementById('quote_preview_notes');

  const print_btn = document.getElementById('quote_print_btn');
  const copy_btn = document.getElementById('quote_copy_btn');
  const edit_btn = document.getElementById('quote_edit_btn');
  const new_btn = document.getElementById('quote_new_btn');
  const copy_feedback = document.getElementById('quote_copy_feedback');

  let currency = 'USD';
  let locale = 'es-CO';
  let current_quote_number = '';
  let last_quote_summary_text = '';

  function format_currency(amount) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  function default_validity_date() {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  }

  function generate_quote_number() {
    const now = new Date();
    const date_part = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const random_part = Math.floor(1000 + Math.random() * 9000);
    return `COT-${date_part}-${random_part}`;
  }

  function show_form_panel() {
    quote_form_panel.hidden = false;
    quote_preview_panel.hidden = true;
  }

  function show_preview_panel() {
    quote_form_panel.hidden = true;
    quote_preview_panel.hidden = false;
    copy_feedback.textContent = '';
  }

  function open_quote_modal() {
    const calculator_data = window.last_quote_data;
    if (!calculator_data) {
      return;
    }

    currency = calculator_data.currency;
    locale = calculator_data.locale;

    service_input.value = calculator_data.profession_label;
    hours_input.value = calculator_data.estimated_hours;
    hourly_rate_input.value = Math.round(calculator_data.hourly_rate * 100) / 100;
    validity_date_input.value = default_validity_date();

    show_form_panel();
    quote_modal.hidden = false;
    document.body.classList.add('modal_open');
    freelancer_name_input.focus();
  }

  function close_quote_modal() {
    quote_modal.hidden = true;
    document.body.classList.remove('modal_open');
  }

  function calculate_quote_totals(quote_data) {
    const subtotal = quote_data.hours * quote_data.hourly_rate;
    const discount_amount = subtotal * (quote_data.discount_percent / 100);
    const subtotal_after_discount = subtotal - discount_amount;
    const tax_amount = subtotal_after_discount * (quote_data.tax_percent / 100);
    const total = subtotal_after_discount + tax_amount;

    return { subtotal, discount_amount, tax_amount, total };
  }

  function build_quote_summary_text(quote_data, totals) {
    const lines = [
      `Cotización N.º ${current_quote_number}`,
      `Fecha: ${quote_date_el.textContent}`,
      '',
      `De: ${quote_data.freelancer_name}`,
      `Para: ${quote_data.client_name}`,
      '',
      `Servicio: ${quote_data.service}`,
      `Descripción: ${quote_data.description || '—'}`,
      `Horas: ${quote_data.hours}`,
      `Precio por hora: ${format_currency(quote_data.hourly_rate)}`,
      `Subtotal: ${format_currency(totals.subtotal)}`,
    ];

    if (quote_data.discount_percent > 0) {
      lines.push(
        `Descuento (${quote_data.discount_percent}%): -${format_currency(totals.discount_amount)}`
      );
    }
    if (quote_data.tax_percent > 0) {
      lines.push(`Impuesto (${quote_data.tax_percent}%): ${format_currency(totals.tax_amount)}`);
    }

    lines.push(`Total: ${format_currency(totals.total)}`);
    lines.push(`Válida hasta: ${preview_validity_el.textContent}`);

    if (quote_data.notes) {
      lines.push('', `Notas: ${quote_data.notes}`);
    }

    return lines.join('\n');
  }

  function render_quote_preview(quote_data) {
    const totals = calculate_quote_totals(quote_data);

    current_quote_number = current_quote_number || generate_quote_number();
    quote_number_el.textContent = current_quote_number;
    quote_date_el.textContent = new Date().toLocaleDateString(locale);

    preview_freelancer_el.textContent = quote_data.freelancer_name;
    preview_client_el.textContent = quote_data.client_name;
    preview_service_el.textContent = quote_data.service;
    preview_description_el.textContent = quote_data.description || '—';

    preview_service_row_el.textContent = quote_data.service;
    preview_hours_el.textContent = quote_data.hours;
    preview_hourly_rate_el.textContent = format_currency(quote_data.hourly_rate);
    preview_subtotal_el.textContent = format_currency(totals.subtotal);

    total_subtotal_el.textContent = format_currency(totals.subtotal);

    if (quote_data.discount_percent > 0) {
      discount_row_el.hidden = false;
      total_discount_el.textContent = `-${format_currency(totals.discount_amount)} (${
        quote_data.discount_percent
      }%)`;
    } else {
      discount_row_el.hidden = true;
    }

    if (quote_data.tax_percent > 0) {
      tax_row_el.hidden = false;
      total_tax_el.textContent = `${format_currency(totals.tax_amount)} (${quote_data.tax_percent}%)`;
    } else {
      tax_row_el.hidden = true;
    }

    total_final_el.textContent = format_currency(totals.total);

    preview_validity_el.textContent = new Date(
      `${quote_data.validity_date}T00:00:00`
    ).toLocaleDateString(locale);

    if (quote_data.notes) {
      notes_section_el.hidden = false;
      preview_notes_el.textContent = quote_data.notes;
    } else {
      notes_section_el.hidden = true;
    }

    last_quote_summary_text = build_quote_summary_text(quote_data, totals);
  }

  function read_quote_form() {
    return {
      freelancer_name: freelancer_name_input.value.trim(),
      client_name: client_name_input.value.trim(),
      service: service_input.value.trim(),
      description: description_input.value.trim(),
      hours: Number(hours_input.value),
      hourly_rate: Number(hourly_rate_input.value),
      discount_percent: Number(discount_input.value) || 0,
      tax_percent: Number(tax_input.value) || 0,
      validity_date: validity_date_input.value,
      notes: notes_input.value.trim(),
    };
  }

  function handle_quote_submit(event) {
    event.preventDefault();
    if (!quote_form.reportValidity()) {
      return;
    }
    render_quote_preview(read_quote_form());
    show_preview_panel();
  }

  function handle_print() {
    window.print();
  }

  async function handle_copy_quote() {
    if (!last_quote_summary_text) {
      return;
    }
    try {
      await navigator.clipboard.writeText(last_quote_summary_text);
      copy_feedback.textContent = 'Cotización copiada al portapapeles.';
    } catch (error) {
      copy_feedback.textContent = 'No se pudo copiar. Copia la cotización manualmente.';
    }
  }

  function handle_edit() {
    show_form_panel();
  }

  function handle_new_quote() {
    current_quote_number = '';
    quote_form.reset();
    open_quote_modal();
  }

  generate_quote_btn.addEventListener('click', open_quote_modal);
  quote_modal_overlay.addEventListener('click', close_quote_modal);
  quote_modal_close.addEventListener('click', close_quote_modal);
  quote_form.addEventListener('submit', handle_quote_submit);
  print_btn.addEventListener('click', handle_print);
  copy_btn.addEventListener('click', handle_copy_quote);
  edit_btn.addEventListener('click', handle_edit);
  new_btn.addEventListener('click', handle_new_quote);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !quote_modal.hidden) {
      close_quote_modal();
    }
  });
})();
