class CombinedNotificationsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._createCard();
  }

  _createCard() {
    const style = document.createElement('style');
    style.textContent = `
      .card-container {
        padding: 10px;
        border-radius: 10px;
        background: inherit;
        color: white;
        text-align: center;
        box-sizing: border-box;
        overflow: hidden;
        width: 100%;
      }

      .card-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        width: 100%;
        box-sizing: border-box;
      }

      .card-header {
        font-weight: bold;
        font-size: 20px;
        margin: 0;
        text-transform: uppercase;
      }

      .card-label {
        font-size: 18px;
        font-weight: 500;
        margin: 0;
        white-space: normal;
        display: block;
        max-width: 100%;
      }

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      ha-icon {
        width: 100%;
        height: 100%;
        display: block;
      }
    `;

    const card = document.createElement('ha-card');
    card.className = 'card-container';

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'icon-wrapper';

    const icon = document.createElement('ha-icon');

    const header = document.createElement('div');
    header.className = 'card-header';

    const label = document.createElement('div');
    label.className = 'card-label';

    iconWrapper.appendChild(icon);
    cardInner.appendChild(iconWrapper);
    cardInner.appendChild(header);
    cardInner.appendChild(label);
    card.appendChild(cardInner);

    this.cardElements = {
      icon,
      iconWrapper,
      header,
      label,
      cardInner
    };

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);
    this.card = card;
  }

  set hass(hass) {
    if (!hass || !this.config) return;

    const config = this.config;
    const entityId = config.entity && config.entity.startsWith('sensor.') ? config.entity : `sensor.${config.entity}`;
    const stateObj = hass.states[entityId];
    const { icon, iconWrapper, header, label } = this.cardElements;

    if (!stateObj) {
      iconWrapper.style.display = 'none';
      header.textContent = "Entity not found";
      label.textContent = entityId;
      return;
    }

    iconWrapper.style.display = 'flex';

    const attrs = stateObj.attributes || {};
    const clearText = attrs.text_all_clear || config.text_all_clear || "ALL CLEAR";
    const isClear = stateObj.state === "" || stateObj.state === clearText;

    if (config.hide_when_clear && isClear) {
      this.card.style.display = 'none';
      return;
    } else {
      this.card.style.display = '';
    }

    const iconName = isClear
      ? (attrs.icon_clear || config.icon_all_clear || "mdi:hand-okay")
      : (attrs.icon_alert || config.icon_alert || "mdi:alert-circle");

    const bgColor = isClear
      ? this._resolveColor(attrs.color_clear || config.background_color_all_clear || "rgba(67, 73, 82, 1)")
      : this._resolveColor(attrs.color_alert || config.background_color_alert || "rgba(190, 11, 11, 0.9)");

    const defaultIconColorClear = "rgb(47, 207, 118)";
    const defaultIconColorAlert = "white";

    const iconColor = isClear
      ? this._resolveColor(config.icon_color_all_clear || defaultIconColorClear)
      : this._resolveColor(config.icon_color_alert || defaultIconColorAlert);

    const textColor = isClear
      ? this._resolveColor(config.text_color_all_clear || iconColor)
      : this._resolveColor(config.text_color_alert || iconColor);

    const labelText = isClear ? clearText : stateObj.state;
    const name = attrs.friendly_name || config.header_name || "NOTIFICATIONS";

    const cardHeight = attrs.card_height || config.card_height || "auto";
    const cardWidth = attrs.card_width || config.card_width || "100%";
    const iconSize = attrs.icon_size || config.icon_size || "80px";

    iconWrapper.style.width = iconSize;
    iconWrapper.style.height = iconSize;
    icon.style.setProperty('--mdc-icon-size', iconSize);

    icon.setAttribute('icon', iconName);
    icon.style.color = iconColor;

    header.style.color = textColor;
    header.textContent = name;
    header.style.display = config.hide_title ? 'none' : '';

    label.style.color = textColor;
    label.textContent = labelText || '\u00A0';

    this.card.style.background = bgColor;
    this.card.style.color = textColor;
    this.card.style.height = cardHeight;
    this.card.style.width = cardWidth;
  }

  _resolveColor(color) {
    if (!color) return "inherit";
    if (color === "Use YOUR Current Theme Color") return "var(--primary-color)";
    if (color === "Transparent Background") return "transparent";
    if (color === "Red") return "rgba(190, 11, 11, 0.9)"; // Force custom red
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
      header_name: "NOTIFICATIONS",
      text_all_clear: "ALL CLEAR",
      background_color_all_clear: "rgba(67, 73, 82, 1)",
      background_color_alert: "rgba(190, 11, 11, 0.9)",
      icon_all_clear: "mdi:hand-okay",
      icon_alert: "mdi:alert-circle",
      icon_color_all_clear: "rgb(47, 207, 118)",
      icon_color_alert: "white",
      text_color_all_clear: "",
      text_color_alert: "",
      card_height: "auto",
      card_width: "100%",
      icon_size: "80px",
      hide_when_clear: false,
      hide_title: false
    };
  }
}

customElements.define("combined-notifications-card", CombinedNotificationsCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "combined-notifications-card",
  name: "Combined Notifications Card",
  description: "Card that displays alert states from notifications"
});
