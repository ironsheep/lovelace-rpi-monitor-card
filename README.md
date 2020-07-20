# Lovelace RPi Monitor Card

![Project Maintenance][maintenance-shield]

[![License][license-shield]](LICENSE)


If you have a number of Raspberry Pis on your network then this might be the card you need to setup your Dashboard for monitoring all of you RPi's.

### Where to get the sensor software

Please visit my RPi Monitor project for the software needed to send the data to Home Assistant from each of your Raspberry Pi's. [See [RPi Reporter MQTT2HA Daemon](https://github.com/ironsheep/RPi-Reporter-MQTT2HA-Daemon).]

## About this card

This is a Lovelace card showing you the status of one of the Raspberry Pi's on your network.  This card delivers a choice of smaller 'glance' style card or the large 'details' card.  You choose which you'd like for each of your RPi's.

This card is currently in development.  Our design goal is that the cards (glance, large) should look like this:

![Discovered by Home Assistant](./Docs/images/DesignGoal.png)



------

If you like my work and/or this has helped you in some way then feel free to help me out for a couple of :coffee:'s or :pizza: slices!

[![coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/ironsheep)


---

-------------------- - - - - - - CAUTION -- CAUTION -- CAUTION - - - - - - --------------------

WHILE THIS CARD IS NOT YET READY FOR USE. The following is beginning to appear here as we are building the card for you.

Please be patient, this marker will be removed when the card is finally ready for use (_after we have a working version for you to use, of course._)

-------------------- - - - - - - CAUTION -- CAUTION -- CAUTION - - - - - - --------------------

---

## Installation

Use [HACS](https://github.com/custom-components/hacs) (recommended)
or download *lightning-detector-card.js* from our [Latest Release](https://github.com/ironsheep/lovelace-lightning-detector-card/releases/latest) and place it in your www directory.

In your ui-lovelace.yaml (or resources.yaml, whichever you use for resources) add this:

```yaml
- url: /hacsfiles/lightning-detector-card/lightning-detector-card.js
  type: module
```

If you don't use HACS please change the url accordingly.

## Config

| Name             | Type   | Default       | Description                 |
| ---------------- | ------ | ------------- | --------------------------- |
| title            | string |  {sensor name}             | Common title                
            

## Credits

- [iantrich](https://github.com/iantrich) for the card template and cards you've created which made my implementation effort much easier.


## License

Copyright © 2020 Iron Sheep Productions, LLC. All rights reserved.<br />
Licensed under the MIT License. <br>
<br>
Follow these links for more information:

### [Copyright](copyright) | [License](LICENSE)

[maintenance-shield]: https://img.shields.io/badge/maintainer-S%20M%20Moraco%20%40ironsheepbiz-blue.svg?style=for-the-badge
[license-shield]: https://camo.githubusercontent.com/bc04f96d911ea5f6e3b00e44fc0731ea74c8e1e9/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f69616e74726963682f746578742d646976696465722d726f772e7376673f7374796c653d666f722d7468652d6261646765
[releases-shield]: https://img.shields.io/github/release/ironsheep/lovelace-lightning-detector-card.svg?style=for-the-badge
[releases]: https://github.com/ironsheep/lovelace-lightning-detector-card/releases