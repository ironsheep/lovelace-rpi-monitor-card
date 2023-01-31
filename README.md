# Lovelace RPi Monitor Card

![Project Maintenance][maintenance-shield]

[![hacs_badge][hacs-shield]](https://github.com/custom-components/hacs)

[![License][license-shield]](LICENSE)

[![GitHub Release][releases-shield]][releases]

![Release](https://github.com/ironsheep/lovelace-rpi-monitor-card/workflows/Release/badge.svg)

If you have a number of Raspberry Pis on your network then this might be the card you need to setup your Dashboard for monitoring all of you RPi's. Setup the sensor software on your RPi: See [RPi Reporter MQTT2HA Daemon](https://github.com/ironsheep/RPi-Reporter-MQTT2HA-Daemon). Then install this card to display the state of your RPi.

## About this card

This is a Lovelace card showing you the status of one of the Raspberry Pi's on your network. This card offers a choice of smaller 'glance' style card or the larger 'full' card. You choose which you'd like for each of your RPi's.

![Actual Card Layouts](./DOCs/images/LiveCards.png)

Place one of these cards for each of your RPi's on your network (and install the sensor/daemon script on each RPi) and you can monitor your entire constellation of RPi's "at a glance"!

----

If you like my work and/or this has helped you in some way then feel free to help me out for a couple of :coffee:'s or :pizza: slices!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/ironsheep)

----

## Installation

Use [HACS](https://github.com/custom-components/hacs) (recommended)
or download _rpi-monitor-card.js_ from our [Latest Release](https://github.com/ironsheep/lovelace-rpi-monitor-card/releases/latest) and place it in your www directory.

In your ui-lovelace.yaml (or resources.yaml, whichever you use for resources) add this:

```yaml
- url: /hacsfiles/lovelace-rpi-monitor-card/rpi-monitor-card.js
  type: module
```

If you don't use HACS please change the url accordingly.

## Configuration

| Name          | Type    | Default            | Description                                                             |
| ------------- | ------- | ------------------ | ----------------------------------------------------------------------- |
| type          | string  | **Required**       | `custom:rpi-monitor-card`                                               |
| entity        | string  | **Required**       | Entity State                                                            |
| name          | string  | none               | Overrides default title of the card. (Default: RPi Monitor {FQDN})      |
| name_prefix   | string  | 'RPi monitor'      | Overrides default name prefix(Default: 'RPi Monitor')                   |
| card_style    | string  | 'glance' or 'full' | Card layout desired for this RPi. (Default is full)                     |
| temp_scale    | string  | 'C' or 'F'         | Show Temperature in Celsius (C) or Fahrenheit (F). (Default is C)       |
| fs_severity   | object  | none               | A list of severity values. See [Severity Coloring](#severity-coloring). |
| temp_severity | object  | none               | A list of severity values. See [Severity Coloring](#severity-coloring). |
| show_title    | boolean | true               | Show / hide the Title for this card. (Default is show - 'true')         |

### Threashold Monitoring

Both the 'system temperature' and 'disk space used' values & icons are colored by threshold. The following defaults can be overridden for each card (each RPi.)

The default coloring is

| **Value**/color    | from | to  |
| ------------------ | ---- | --- |
| **Storage Used** % |      |
| default            | 0    | 60  |
| yellow             | 61   | 85  |
| red                | 86   | 100 |
| **Temperature** C  |      |
| default            | 0    | 59  |
| yellow             | 60   | 79  |
| red                | 80   | 100 |

### Severity Coloring

| Name  | Type   | Default      | Description                                             |
| ----- | ------ | ------------ | ------------------------------------------------------- |
| from  | number | **Required** | Defines from which value the color should be displayed. |
| to    | number | **Required** | Defines to which value the color should be displayed.   |
| color | array  | **Required** | Defines the color to be displayed.                      |

### Example card specifications

**NOTE**: this card must always be attached to the 'sensor.rpi_monitor_{hostname}' sensor, **the other two sensors from the same RPi will not work to drive this card!**

A 'glance' card example

```yaml
type: 'custom:rpi-monitor-card'
entity: sensor.rpi_monitor_hostname
card_style: glance
temp_scale: f
```

A 'full' card example (_with additional coloring override example_)

```yaml
type: 'custom:rpi-monitor-card'
entity: sensor.rpi_monitor_hostname
card_style: full
temp_scale: C
fs_severity:
  - color: Green
    from: 0
    to: 25
  - color: Orange
    from: 26
    to: 50
  - color: Red
    from: 51
    to: 100
```

## Credits

- Ian [iantrich](https://github.com/iantrich) for the card template and cards you've created which made my implementation effort much easier.
- Lucas [Gluwc](https://github.com/Gluwc) for the custom-card: bar-card for his example of how to handle users specifying coloring overrides.

## License

Copyright © 2020 Iron Sheep Productions, LLC. All rights reserved.<br />
Licensed under the MIT License. <br>
<br>
Follow these links for more information:

### [Copyright](copyright) | [License](LICENSE)

[maintenance-shield]: https://img.shields.io/badge/maintainer-stephen%40ironsheep.biz-blue.svg?style=for-the-badge
[hacs-shield]: https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge
[license-shield]: https://camo.githubusercontent.com/bc04f96d911ea5f6e3b00e44fc0731ea74c8e1e9/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f69616e74726963682f746578742d646976696465722d726f772e7376673f7374796c653d666f722d7468652d6261646765
[releases-shield]: https://img.shields.io/github/release/ironsheep/lovelace-rpi-monitor-card.svg?style=for-the-badge
[releases]: https://github.com/ironsheep/lovelace-rpi-monitor-card/releases
