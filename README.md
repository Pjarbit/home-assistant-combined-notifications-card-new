Combined Notifications Card
A custom Lovelace card for Home Assistant that works with the Combined Notifications Integration to display grouped entity notifications with dynamic styling.
Show Image
🚀 Features

Auto-styling: Inherits colors, icons, and text from the integration
Dynamic states: Shows alert or all-clear states based on entity conditions
Fully customizable: Override any visual element directly in the card config
Compact & Clear: Shows only what you need to know at a glance

📦 Installation
HACS Installation (Recommended)

Go to the HACS dashboard in Home Assistant
Click the three dots menu in the upper right corner
Select "Custom repositories"
Add this repo URL:
https://github.com/Pjarbit/home-assistant-combined-notifications-card-new

Select "Dashboard" as the repository type
Click "ADD"
Search for "Combined Notifications Card" in the Dashboard section
Click Install
Restart Home Assistant

Manual Installation

Download the latest release from the releases page
Copy the combined-notifications-card.js file to your www/ directory
Add the resource to your dashboard:
yamlurl: /local/combined-notifications-card.js
type: module

Restart Home Assistant

⚙️ Basic Usage
Add the card to your dashboard with this minimal configuration:
yamltype: custom:combined-notifications-card
entity: sensor.car_alert_notifications
That's it! The card automatically inherits all styling and behavior from the sensor entity created by the Combined Notifications integration.
🎨 Customization Options
You can override any default display settings from the sensor using these attributes:
AttributeDescriptionExamplesheader_nameCustom card titleCar Alerts, Lighting, Home Securitytext_all_clearMessage when all clearAll OK, All Clear, Systems Normalbackground_color_all_clearBackground for normal stategreen, blue, tealbackground_color_alertBackground for alert statered, orange, yellowicon_all_clearIcon for normal statemdi:hand-okay, mdi:check-circleicon_alertIcon for alert statemdi:alert-circle, mdi:alerticon_color_all_clearIcon color for normal statewhite, gray, var(--primary-color)icon_color_alertIcon color for alert stateyellow, red, whiteshow_detailsShow entity detailstrue, falsehide_when_clearHide card when all cleartrue, false
📋 Example Configuration
yamltype: custom:combined-notifications-card
entity: sensor.car_alert_notifications
header_name: Car Alerts
text_all_clear: All Systems Normal
background_color_all_clear: green
background_color_alert: red
icon_all_clear: mdi:check-circle
icon_alert: mdi:alert-circle
show_details: true
hide_when_clear: false
🧠 How It Works
Behavior
When any condition is triggered:

Card background changes to your alert color
Displays your alert icon
Shows a list of unmet conditions

When all conditions are normal:

Card switches to your all-clear color
Displays your custom "All Clear" message
Shows your all-clear icon

⚠️ Troubleshooting
Common Issues:

If the card isn't appearing, check that you've added the JS file to your resources
Verify that the integration is properly set up and creating sensor entities
Ensure the entity name in your card configuration matches exactly with the sensor created by the integration
Check your browser console for any JavaScript errors

📚 Related
This card is designed to work with the Combined Notifications Integration. Please install the integration first to create notification group sensors.
🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

Made with ❤️ for the Home Assistant CommunityRetryClaude can make mistakes. Please double-check responses. 3.7 Sonnet
