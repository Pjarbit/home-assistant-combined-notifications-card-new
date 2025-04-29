class CombinedNotificationsCard extends HTMLElement {
  // Card constructor - initialize properties
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._createCard();
  }

  _createCard() {
    const style = document.createElement('style');
    style.textContent = `
      .card-container {
        padding: 16px;
        border-radius: 10px;
        text-align: center;
        color: white;
      }
      .card-header {
        font-weight: bold;
        font-size: 20px;
        margin-bottom: 10px;
        text-transform: uppercase;
      }
      .card-icon {
        margin: 10px auto;
      }
      .card-icon ha-icon {
        width: 80px;
        height: 80px;
      }
      .card-label {
        font-size: 16px;
        margin-top: 10px;
        white-space: normal;
      }
    `;

    const card = document.createElement('ha-card');
    card.className = 'card-container';

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);

    this.card = card;
  }

  set hass(hass) {
    if (!hass || !this.config) return;

    const config = this.config;

    const entityId = config.entity.startsWith('sensor.')
      ? config.entity
      : `sensor.${config.entity}`;

    const stateObj = hass.states[entityId];

    if (!stateObj) {
      this.card.innerHTML = `
        <div class="card-header">Entity not found</div>
        <div>${entityId}</div>
      `;
      return;
    }

    const attrs = stateObj.attributes || {};

    const clearText = attrs.text_all_clear || config.text_all_clear || "ALL CLEAR";
    const isClear = stateObj.state === clearText;

    if (config.hide_when_clear === true && isClear) {
      this.card.style.display = 'none';
      return;
    } else {
      this.card.style.display = '';
    }

    const icon = isClear
      ? (attrs.icon_clear || config.icon_all_clear || "mdi:hand-okay")
      : (attrs.icon_alert || config.icon_alert || "mdi:alert-circle");

    const bgColor = isClear
      ? this._resolveColor(attrs.color_clear || config.background_color_all_clear || "rgba(67, 73, 82, 1)")
      : this._resolveColor(attrs.color_alert || config.background_color_alert || "rgba(255, 0, 0, 0.7)");

    const defaultIconColorClear = "rgb(47, 207, 118)";
    const defaultIconColorAlert = "white";

    const iconColor = isClear
      ? this._resolveColor(config.icon_color_all_clear || defaultIconColorClear)
      : this._resolveColor(config.icon_color_alert || defaultIconColorAlert);

    const textColor = isClear
      ? this._resolveColor(config.text_color_all_clear || iconColor)
      : this._resolveColor(config.text_color_alert || iconColor);

    const label = isClear ? clearText : stateObj.state;
    const name = attrs.friendly_name || config.header_name || "NOTIFICATIONS";

    this.card.style.background = bgColor;
    this.card.style.color = textColor;

    this.card.innerHTML = `
      ${!config.hide_title ? `<div class="card-header" style="color: ${textColor};">${name}</div>` : ""}
      <div class="card-icon">
        <ha-icon icon="${icon}" style="color: ${iconColor};"></ha-icon>
      </div>
      <div class="card-label" style="color: ${textColor};">${label}</div>
    `;
  }

  _resolveColor(color) {
    if (!color) return "inherit";
    if (color === "Use YOUR Current Theme Color") return "var(--primary-color)";
    if (color === "Transparent Background") return "transparent";
    return color;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }

    this.config = {
      ...config,
      hide_when_clear: config.hide_when_clear === true,
      hide_title: config.hide_title === true
    };
  }

  getCardSize() {
    return this.config?.hide_when_clear ? 0 : 2;
  }

  static getStubConfig() {
    return {
      entity: "",
      header_name: "",
      text_all_clear: "",
      background_color_all_clear: "",
      background_color_alert: "",
      icon_all_clear: "",
      icon_alert: "",
      icon_color_all_clear: "",
      icon_color_alert: "",
      text_color_all_clear: "",
      text_color_alert: "",
      hide_when_clear: false
    };
  }
}

customElements.define("combined-notifications-card", CombinedNotificationsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "combined-notifications-card",
  name: "Combined Notifications Card",
  description: "Card that displays alert states from the Combined Notifications integration"
});
