class CombinedNotificationsCard extends HTMLElement {
  // Card constructor - initialize properties
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._createCard();
  }
  
  _createCard() {
    // Add CSS to the shadow DOM for styling
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
    
    // Create card container
    const card = document.createElement('ha-card');
    card.className = 'card-container';
    
    // Add style and card to shadow root
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(card);
    
    // Save reference to the card for updates
    this.card = card;
  }
  
  set hass(hass) {
    if (!hass || !this.config) return;
    
    const config = this.config;
    
    // Format entity_id with sensor. prefix if not provided
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
    
    // Get all clear text from attributes first, then config, then default
    const clearText = attrs.text_all_clear || config.text_all_clear || "ALL CLEAR";
    
    // Determine if the state is "all clear" by comparing to the clearText
    const isClear = stateObj.state === clearText;
    
    // Support for hiding card when all clear
    if (config.hide_when_clear === true && isClear) {
      this.card.style.display = 'none';
      return;
    } else {
      this.card.style.display = '';
    }
    
    // Get icon - from attributes first, then config, then default
    const icon = isClear
      ? (attrs.icon_clear || config.icon_all_clear || "mdi:hand-okay")
      : (attrs.icon_alert || config.icon_alert || "mdi:alert-circle");
    
    // Get colors - from attributes first, then config, then default
    const bgColor = isClear
      ? this._resolveColor(attrs.color_clear || config.background_color_all_clear || "rgba(67, 73, 82, 1)")
      : this._resolveColor(attrs.color_alert || config.background_color_alert || "rgba(255, 0, 0, 0.7)");
    
    // Default icon colors based on clear/alert state
    const defaultIconColorClear = "rgb(47, 207, 118)";  // green
    const defaultIconColorAlert = "white";
    
    // Get icon colors - from config, then default
    const iconColor = isClear
      ? this._resolveColor(config.icon_color_all_clear || defaultIconColorClear)
      : this._resolveColor(config.icon_color_alert || defaultIconColorAlert);
    
    // Text color defaults to icon color if not specified
    const textColor = isClear
      ? this._resolveColor(config.text_color_all_clear || iconColor)
      : this._resolveColor(config.text_color_alert || iconColor);
    
    // Get display text - if clear use clearText, otherwise use state
    const label = isClear ? clearText : stateObj.state;
    
    // Get card title from friendly name attribute first, then config, then default
    const name = attrs.friendly_name || config.header_name || "NOTIFICATIONS";
    
    // Update card content
    this.card.style.background = bgColor;
    this.card.style.color = textColor;
    
    // Render card content
    this.card.innerHTML = `
      <div class="card-header" style="color: ${textColor};">${name}</div>
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
    
    // Validate required config options
    this.config = {
      ...config,
      hide_when_clear: config.hide_when_clear === true
    };
  }
  
  getCardSize() {
    return this.config?.hide_when_clear ? 0 : 2;
  }
  
  static getStubConfig() {
    // Return a default configuration for the card editor
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

// Register the card
customElements.define("combined-notifications-card", CombinedNotificationsCard);

// Add support for editor if Lovelace is available
window.customCards = window.customCards || [];
window.customCards.push({
  type: "combined-notifications-card",
  name: "Combined Notifications Card",
  description: "Card that displays alert states from the Combined Notifications integration"
});
