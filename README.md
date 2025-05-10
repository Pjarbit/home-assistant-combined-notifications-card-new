# Combined Notifications Card

A custom Lovelace card for Home Assistant that works with the [Combined Notifications Integration](https://github.com/Pjarbit/home-assistant-combined-notification-integration) to display grouped entity notifications with dynamic styling.

![Combined Notifications Card Demo](media/demo.gif)

## 🚀 Features

- **Auto-styling**: Inherits colors, icons, and text from the integration
- **Dynamic states**: Shows alert or all-clear states based on entity conditions
- **Fully customizable**: Override any visual element directly in the card config
- **Compact & Clear**: Shows only what you need to know at a glance

## 📦 Installation

### HACS Installation (Recommended)

1. Go to HACS in Home Assistant
2. Click the three dots menu in the upper right corner
3. Select "Custom repositories"
4. Add this repo:
   ```
   https://github.com/Pjarbit/home-assistant-combined-notifications-card-new
   ```
5. Select "Dashboard" as the repository type
6. Click "ADD"
7. Search for "Combined Notifications Card" in HACS
8. Click Install
9. Restart Home Assistant

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/Pjarbit/home-assistant-combined-notifications-card-new/releases)
2. Copy the `combined-notifications-card.js` file to your `www/` directory
3. Add the resource to your dashboard:
   ```yaml
   url: /local/combined-notifications-card.js
   type: module
   ```
4. Restart Home Assistant

## ⚙️ Basic Usage

If you're new to Home Assistant or prefer to keep things simple, getting started with this card is incredibly easy:

1. Go to your Home Assistant dashboard
2. Click the + button to add a new card
3. Select "Manual" from the card type options
4. Paste in this simple code:

```yaml
type: custom:combined-notifications-card
entity: sensor.YOUR_SENSOR_NAME
```

5. Replace `sensor.YOUR_SENSOR_NAME` with the sensor created by the integration
6. Click Save

That's it! The card automatically inherits all styling and behavior from the integration.

> **Note for beginners**: All the additional configuration options and examples in this README are completely optional. This basic card will get you up and running with all the functionality you need to have the integration work on your dashboard.

## 🎨 Customization Options

You can override any default display settings from the sensor using these attributes:

| Attribute | Description | Examples |
|-----------|-------------|----------|
| `header_name` | Custom card title | `Car Alerts`, `Lighting`, `Home Security` |
| `text_all_clear` | Message when all clear | `All OK`, `All Clear`, `Systems Normal` |
| `background_color_all_clear` | Background for normal state | `green`, `blue`, `teal` |
| `background_color_alert` | Background for alert state | `red`, `orange`, `yellow` |
| `icon_all_clear` | Icon for normal state | `mdi:hand-okay`, `mdi:check-circle` |
| `icon_alert` | Icon for alert state | `mdi:alert-circle`, `mdi:alert` |
| `icon_color_all_clear` | Icon color for normal state | `white`, `gray`, `var(--primary-color)` |
| `icon_color_alert` | Icon color for alert state | `yellow`, `red`, `white` |
| `show_details` | Show entity details | `true`, `false` |
| `hide_when_clear` | Hide card when all clear | `true`, `false` |

## 📋 Example Configurations

I am providing several examples to show what can be accomplished with custom cards and card-mod.

### Standard Configuration With Lovelace Overrides 
(All color and icon attributes are optional and will be set by the integration unless you want to modify here. This can be useful if you have different dashboards with different color combinations)

```yaml
type: custom:combined-notifications-card
entity: sensor.car_alert_notifications
header_name: Car Alerts
text_all_clear: All Systems Normal
background_color_all_clear: green
background_color_alert: red
icon_all_clear: mdi:check-circle
icon_alert: mdi:alert-circle
show_details: true
hide_when_clear: false
```

### Template-Based button-card (Pulls attributes directly from the integration)

```yaml
type: custom:button-card
entity: sensor.YOUR_SENSOR_NAME
name: NOTIFICATIONS
show_name: true
show_icon: true
show_state: false
styles:
  card:
    - background-color: >
        [[[ if (entity.state !== "") { return entity.attributes.color_alert; }
        else { return  entity.attributes.color_clear; } ]]]
    - border-radius: 10px
    - padding: 6px 10px 10px 10px
    - color: >
        [[[ if (entity.state === "") { return
        entity.attributes.text_color_clear; } else {   return
        entity.attributes.text_color_alert; } ]]]
    - white-space: normal
    - font-size: 20px
  name:
    - font-weight: bold
    - text-align: center
    - font-size: 23px
    - margin-top: 0
  label:
    - white-space: normal
    - display: block
    - max-width: 100%
    - padding-top: 5px
    - text-align: center
  icon:
    - color: >
        [[[ if (entity.state === "") { return
        entity.attributes.icon_color_clear; } else { return
        entity.attributes.icon_color_alert; } ]]]
    - width: 70px
    - height: 70px
    - margin: 5px 0
icon: >
  [[[ if (entity.state !== "") { return entity.attributes.icon_alert; } else {
  return entity.attributes.icon_clear; } ]]]
show_label: true
label: >
  [[[ if (entity.state !== "") { return entity.state; } else { return
  entity.attributes.text_all_clear; } ]]]
tap_action:
  action: none
hold_action:
  action: none
```

### Custom button-card With Styling (Simple flat design)

![Standard Notification Button](media/standard%20notification%20button.jpg)

```yaml
type: custom:button-card
entity: sensor.unmet_conditions_list
name: NOTIFICATIONS
show_name: true
show_icon: true
show_state: false
styles:
  card:
    - background-color: >
        [[[ if (entity.state !== "") { return "#c80404"; } else { return
        "rgba(67, 73, 82, 0.9)"; } ]]]
    - border-radius: 10px
    - padding: 6px 10px 10px 10px
    - color: >
        [[[ if (entity.state === "") { return "rgb(255, 255, 255)"; } else {  
        return "rgb(255, 255, 255)"; } ]]]
    - white-space: normal
    - font-size: 20px
  name:
    - font-weight: bold
    - text-align: center
    - font-size: 23px
    - margin-top: 0
  label:
    - white-space: normal
    - display: block
    - max-width: 100%
    - padding-top: 5px
    - text-align: center
  icon:
    - color: >
        [[[ if (entity.state === "") { return "rgb(38, 141, 53)"; } else {
        return "rgb(255, 255, 255)"; } ]]]
    - width: 70px
    - height: 70px
    - margin: 5px 0
icon: >
  [[[ if (entity.state !== "") { return "mdi:alert-circle"; } else { return
  "mdi:hand-okay"; } ]]]
show_label: true
label: >
  [[[ if (entity.state !== "") { return entity.state; } else { return "All
  CLEAR"; } ]]]
tap_action:
  action: none
hold_action:
  action: none
```

### Enhanced button-card With card-mod (This is the one I'm using)

![Notification Card with Flare](media/Notification%20card%20with%20flare.jpg)

```yaml
type: custom:button-card
entity: sensor.unmet_conditions_list
name: NOTIFICATIONS
show_name: true
show_icon: true
show_state: false
styles:
  card:
    - background-color: >
        [[[ if (entity.state !== "") { return "#c80404"; } else { return
        "rgba(67, 73, 82, 0.9)"; } ]]]
    - border-radius: 16px !important
    - box-shadow: >
        12px 12px 24px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255,
        0.1), inset -4px -4px 8px rgba(0, 0, 0, 0.2), inset 4px 4px 8px
        rgba(255, 255, 255, 0.2) !important
    - overflow: hidden !important
    - padding: 6px 10px 10px 10px !important
    - color: >
        [[[ if (entity.state === "") { return "rgb(255, 255, 255)"; } else {  
        return "rgb(255, 255, 255)"; } ]]]
    - white-space: normal
    - position: relative !important
    - font-size: 20px
  name:
    - font-weight: bold
    - text-align: center
    - font-size: 23px
    - margin-top: 0
  label:
    - white-space: normal
    - display: block
    - max-width: 100%
    - padding-top: 5px
    - text-align: center
  icon:
    - color: >
        [[[ if (entity.state === "") { return "rgb(38, 141, 53)"; } else {
        return "rgb(255, 255, 255)"; } ]]]
    - width: 70px
    - height: 70px
    - margin: 5px 0
icon: >
  [[[ if (entity.state !== "") { return "mdi:alert-circle"; } else { return
  "mdi:hand-okay"; } ]]]
show_label: true
label: >
  [[[ if (entity.state !== "") { return entity.state; } else { return "All
  CLEAR"; } ]]]
tap_action:
  action: none
hold_action:
  action: none
card_mod:
  style: |
    ha-card::after {
      content: '' !important;
      position: absolute !important;
      width: 100px !important;
      height: 100% !important;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0) 100%
      ) !important;
      transform: skewX(-15deg) translateX(50px) !important;
      top: 0 !important;
      left: -20px !important;
      z-index: 1 !important;
    }
```

The button-card examples require you to have [button-card](https://github.com/custom-cards/button-card) installed. The enhanced version with card-mod requires the [card-mod](https://github.com/thomasloven/lovelace-card-mod) custom component as well. The card-mod section adds a static light reflection effect to give the card a polished appearance.

## 🧠 How It Works

### Behavior
When any condition is triggered:
- Card background changes to your alert color
- Displays your alert icon
- Shows a list of unmet conditions

When all conditions are normal:
- Card switches to your all-clear color
- Displays your custom "All Clear" message
- Shows your all-clear icon

## ⚠️ Troubleshooting

**Common Issues:**
- If the card isn't appearing, check that you've added the JS file to your resources
- Verify that the integration is properly set up and creating sensor entities
- Ensure the entity name in your card configuration matches exactly with the sensor created by the integration
- Check your browser console for any JavaScript errors

## 📚 Related

This card is designed to work with the [Combined Notifications Integration](https://github.com/Pjarbit/home-assistant-combined-notification-integration). Please install the integration first to create notification group sensors.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Special thanks to **@cluelesscactus** for contributing improvements to this README.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for the Home Assistant Community
