/* eslint-disable @typescript-eslint/no-inferrable-types */ /* I prefer to learn early when an unexpected type is being assigned */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  applyThemesOnElement,
  computeStateDisplay,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
  LovelaceCard,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import './editor';

import { RPiMonitorCardConfig } from './types';
import { actionHandler } from './action-handler-directive';
import * as Constants from './const';

import { localize } from './localize/localize';

/* eslint no-console: 0 */
console.info(
  `%c  RPI-MONITOR-CARD \n%c  ${localize('common.version')} ${Constants.CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards = (window as any).customCards || [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).customCards.push({
  type: 'rpi-monitor-card',
  name: 'RPi Monitor Card',
  description: 'A template custom card for you to create something awesome',
});

// Name our custom element
@customElement('rpi-monitor-card')
export class RPiMonitorCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('rpi-monitor-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // Properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: RPiMonitorCardConfig;

  // and those that don't cause a re-render
  private _firstTime: boolean = true;
  private _sensorAvailable: boolean = false;
  private _updateTimerID: NodeJS.Timeout | undefined;
  private _hostname: string = '';
  private kREPLACE_WITH_TEMP_UNITS: string = 'replace-with-temp-units';

  // WARNING set following to false before commit!
  private _show_debug: boolean = false;
  //private _show_debug: boolean = true;

  //
  // FULL-SIZE CARD tables
  //
  private _cardFullElements = {
    // top to bottom
    'Storage Use': Constants.RPI_FS_USED_PERCENT_KEY,
    Storage: Constants.RPI_FS_TOTAL_GB_KEY,
    'Memory Use': Constants.RPI_MEMORY_USED_PERCENT_KEY,
    Temperature: Constants.RPI_TEMPERATURE_IN_C_KEY,
    'Up-time': Constants.RPI_UP_TIME_KEY,
    Updated: Constants.RPI_LAST_UPDATE_KEY,
    OS: Constants.SHOW_OS_PARTS_VALUE,
    Model: Constants.RPI_MODEL_KEY,
    Interfaces: Constants.RPI_INTERFACES_KEY,
  };
  private _cardFullIconNames = {
    // top to bottom
    Storage: 'sd',
    'Storage Use': 'file-percent',
    'Memory Use': 'memory',
    Temperature: 'thermometer',
    'Up-time': 'clock-check-outline',
    Updated: 'update',
    OS: 'linux',
    Model: 'raspberry-pi',
    Interfaces: '',
  };

  // attribute ICON IDs
  private kClassIdIconFSAvail = 'ico-fs-percent';
  private kClassIdIconFSTotal = 'ico-fs-total';
  private kClassIdIconSysTemp = 'ico-sys-temp';
  private kClassIdIconUptime = 'ico-up-time';
  private kClassIdIconUpdated = 'ico-last-update';
  private kClassIdIconOS = 'ico-*nix';
  private kClassIdIconRPiModel = 'ico-rpi-model';
  private kClassIdIconInterfaces = 'ico-rpi-ifaces';
  private kClassIdIconMemoryUsage = 'ico-memory-percent';
  // attribute value label IDs
  private kClassIdFSAvail = 'fs-percent';
  private kClassIdFSTotal = 'fs-total';
  private kClassIdSysTemp = 'sys-temp';
  private kClassIdUptime = 'up-time';
  private kClassIdUpdated = 'last-update';
  private kClassIdOS = '*nix';
  private kClassIdRPiModel = 'rpi-model';
  private kClassIdInterfaces = 'rpi-ifaces';
  private kClassIdMemoryUsage = 'memory-percent';
  // ond one special for unit
  private kClassIdTempScale = 'sys-temp-scale';

  private _cardFullCssIDs = {
    // top to bottom
    'Storage Use': this.kClassIdFSAvail,
    Storage: this.kClassIdFSTotal,
    'Memory Use': this.kClassIdMemoryUsage,
    Temperature: this.kClassIdSysTemp,
    'Up-time': this.kClassIdUptime,
    Updated: this.kClassIdUpdated,
    OS: this.kClassIdOS,
    Model: this.kClassIdRPiModel,
    Interfaces: this.kClassIdInterfaces,
  };
  private _cardFullIconCssIDs = {
    // top to bottom
    'Storage Use': this.kClassIdIconFSAvail,
    Storage: this.kClassIdIconFSTotal,
    'Memory Use': this.kClassIdIconMemoryUsage,
    'Up-time': this.kClassIdIconUptime,
    Updated: this.kClassIdIconUpdated,
    Temperature: this.kClassIdIconSysTemp,
    OS: this.kClassIdIconOS,
    Model: this.kClassIdIconRPiModel,
    Interfaces: this.kClassIdIconInterfaces,
  };
  //
  // GLANCE CARD tables
  //
  private _cardGlanceElements = {
    // left to right
    '%': Constants.RPI_FS_USED_PERCENT_KEY,
    GB: Constants.RPI_FS_TOTAL_GB_KEY,
    Mem: Constants.RPI_MEMORY_USED_PERCENT_KEY,
    'replace-with-temp-units': Constants.RPI_TEMPERATURE_IN_C_KEY,
    UpTime: Constants.RPI_UP_TIME_KEY,
    Upd: Constants.RPI_LAST_UPDATE_KEY,
  };
  private _cardGlanceIconNames = {
    // left to right
    '%': 'file-percent',
    GB: 'sd',
    Mem: 'memory',
    'replace-with-temp-units': 'thermometer',
    UpTime: 'clock-check-outline',
    Upd: 'update',
  };

  private _cardGlanceCssIDs = {
    // left to right
    '%': this.kClassIdFSAvail,
    GB: this.kClassIdFSTotal,
    Mem: this.kClassIdMemoryUsage,
    'replace-with-temp-units': this.kClassIdSysTemp,
    UpTime: this.kClassIdUptime,
    Upd: this.kClassIdUpdated,
  };

  private _cardGlanceIconCssIDs = {
    // left to right
    '%': this.kClassIdIconFSAvail,
    GB: this.kClassIdIconFSTotal,
    Mem: this.kClassIdIconMemoryUsage,
    'replace-with-temp-units': this.kClassIdIconSysTemp,
    UpTime: this.kClassIdIconUptime,
    Upd: this.kClassIdIconUpdated,
  };

  // space used icon set
  private _circleIconsValueByName = {
    'circle-outline': 0,
    'circle-slice-1': 13,
    'circle-slice-2': 25,
    'circle-slice-3': 38,
    'circle-slice-4': 50,
    'circle-slice-5': 63,
    'circle-slice-6': 75,
    'circle-slice-7': 88,
    'circle-slice-8': 100,
  };

  /*
   *  COLORING Goals (default)
   *
   *  1) color  time since reported:  yellow if longer than 1 reporting interval, red if two or more
   *  2) color space-used: nothing to 60%, 61-85% yellow, 86%+ red
   *  3) color temp: nothing to 59C, 60-79C yellow, 80C+ red
   */

  // DEFAULT coloring for used space
  //  user sets 'fs_severity' to override
  private _colorUsedSpaceDefault = [
    {
      color: 'undefined',
      from: 0,
      to: 59,
    },
    {
      color: 'yellow',
      from: 60,
      to: 84,
    },
    {
      color: 'red',
      from: 85,
      to: 100,
    },
  ];

  // coloring for temp-in-C
  //  user sets 'temp_severity' to override
  private _colorTemperatureDefault = [
    {
      color: 'undefined',
      from: 0,
      to: 59,
    },
    {
      color: 'yellow',
      from: 60,
      to: 79,
    },
    {
      color: 'red',
      from: 85,
      to: 100,
    },
  ];

  // coloring for report update age
  // no user override for now
  private _colorReportPeriodsAgoDefault = [
    {
      color: 'white',
      from: 0,
      to: 3,
    },
    {
      color: 'yellow',
      from: 4,
      to: 4,
    },
    {
      color: 'red',
      from: 5,
      to: 100,
    },
  ];

  // DEFAULT coloring for used memory
  //  user sets 'memory_severity' to override
  private _colorUsedMemoryDefault = [
    {
      color: 'red',
      from: 75,
      to: 100,
    },
    {
      color: 'yellow',
      from: 61,
      to: 74,
    },
    {
      color: '',
      from: 0,
      to: 60,
    },
  ];

  // DEFAULT coloring for named releases
  // intent is to show which ones are aging and should no longer be used
  //  user sets 'os_age' to override
  // see https://en.wikipedia.org/wiki/Debian_version_history for important dates (e.g., 'Long-term')
  // Jessie EOL 30 June 2020 'red'
  // Stretch EOL 30 June 2022 'red'
  // Buster EOL 30 June 2024: Jun 2023 'orange', Jan 2024 is 'yellow'
  //
  // TODO: replace color with dates and use days until date to color?
  //
  // Thinking:  past EOL is 'red'
  //            within 6 mos of EOL is yellow
  //            within 12 mos of EOL is orange
  private _colorReleaseDefault = [
    {
      color: 'red',
      os: 'stretch',
    },
    {
      color: 'red',
      os: 'jessie',
    },
    {
      color: 'red',
      os: 'wheezy',
    },
  ];

  public setConfig(config: RPiMonitorCardConfig): void {
    if (this._showDebug()) {
      console.log('- setConfig()');
    }
    // Optional: Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.card_style != undefined) {
      const styleValue: string = config.card_style.toLocaleLowerCase();
      if (styleValue != 'full' && styleValue != 'glance') {
        console.log('Invalid configuration. INVALID card_style = [' + config.card_style + ']');
        throw new Error('Illegal card_style: value (card_style: ' + config.card_style + ') must be [full or glance]');
      }
    }

    if (config.temp_scale != undefined) {
      const scaleValue: string = config.temp_scale.toLocaleLowerCase();
      if (scaleValue != 'c' && scaleValue != 'f') {
        console.log('Invalid configuration. INVALID temp_scale = [' + config.temp_scale + ']');
        throw new Error('Illegal temp_scale: value (temp_scale: ' + config.temp_scale + ') must be [F or C]');
      }
    }

    if (!config.entity) {
      console.log("Invalid configuration. If no entity provided, you'll need to provide a remote entity");
      throw new Error('You need to associate an entity');
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this._config = {
      ...config,
    };

    //console.log('- config:');
    //console.log(this._config);

    this._updateSensorAvailability();
  }

  /*
  public getCardSize(): number {
    // adjust this based on glance or full card type
    return this._useFullCard() == true ? 3 : 1;
  }
  */

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    //return hasConfigOrEntityChanged(this, changedProps, false);

    this._updateSensorAvailability();

    if (changedProps.has('_config')) {
      return true;
    }

    if (this.hass && this._config) {
      const oldHass = changedProps.get('hass') as HomeAssistant | undefined;

      if (oldHass) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return oldHass.states[this._config.entity!] !== this.hass.states[this._config.entity!];
      }
    }

    return true;
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    // Check for stateObj or other necessary things and render a warning if missing
    if (this._showDebug()) {
      console.log('- render()');
    }
    if (this._config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }

    if (this._config.show_error) {
      return this.showError(localize('common.show_error'));
    }

    const entityId = this._config.entity ? this._config.entity : undefined;

    if (entityId && !this._sensorAvailable) {
      const warningMessage = 'Entity Unavailable: ' + entityId;
      return this.showWarning(warningMessage);
    }

    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;

    if (!entityId && !stateObj) {
      return this.showWarning('Entity Unavailable');
    }

    if (this._firstTime) {
      if (this._showDebug()) {
        console.log('- stateObj:');
        console.log(stateObj);
      }

      // set timer so our card updates timestamp every 5 seconds : 5000 (1 second: 1000)
      // FIXME: UNDONE remember to clear this interval when entity NOT avail. and restore when comes avail again...
      this._startCardRefreshTimer();

      if (this._showDebug()) {
        console.log('- 1st-time _config:');
        console.log(this._config);
      }
      this._firstTime = false;
    }

    // OS Age is shown (default = True) unless turned off
    const showOsAge = this._config.show_os_age != undefined ? this._config.show_os_age : true;
    // Card Update Age is shown (default = True) unless turned off
    const showCardAge = this._config.show_update_age != undefined ? this._config.show_update_age : true;

    const rpi_fqdn: string = this._getAttributeValueForKey(Constants.RPI_FQDN_KEY);
    let cardName: string = 'RPi monitor ' + rpi_fqdn;
    const ux_release: string = showOsAge == true ? this._getAttributeValueForKey(Constants.RPI_NIX_RELEASE_KEY) : '';

    cardName = this._config.name_prefix != undefined ? this._config.name_prefix + ' ' + rpi_fqdn : cardName;
    cardName = this._config.name != undefined ? this._config.name : cardName;

    const showCardName = this._config.show_title != undefined ? this._config.show_title : true;
    if (showCardName == false) {
      cardName = '';
    }

    const last_heard_full_class = showCardName == false ? 'last-heard-full-notitle' : 'last-heard-full';

    const last_heard_class = showCardName == false ? 'last-heard-notitle' : 'last-heard';

    const os_name_full_class = showCardName == false ? 'os-name-full-notitle' : 'os-name-full';

    const os_name_class = showCardName == false ? 'os-name-notitle' : 'os-name';

    const [card_timestamp_value, minsSinceUpdate] = this._getRelativeTimeSinceUpdate();
    if (minsSinceUpdate) {
    } // kill compiler warning
    const card_timestamp = showCardAge == true ? card_timestamp_value : '';

    if (this._useFullCard()) {
      // our FULL card
      const fullRows = this._generateFullsizeCardRows();

      return html`
        <ha-card
          .header=${cardName}
          @action=${this._handleAction}
          .actionHandler=${actionHandler({
            hasHold: hasAction(this._config.hold_action),
            hasDoubleClick: hasAction(this._config.double_tap_action),
          })}
          tabindex="0"
          aria-label=${cardName}
        >
          <div id="states" class="card-content">
            ${fullRows}
            <div id="card-timestamp" class=${last_heard_full_class}>${card_timestamp}</div>
            <div id="os-name" class=${os_name_full_class}>${ux_release}</div>
          </div>
        </ha-card>
      `;
    } else {
      // our GLANCE card
      const glanceRows = this._generateGlanceCardRows();

      return html`
        <ha-card
          .header=${cardName}
          @action=${this._handleAction}
          .actionHandler=${actionHandler({
            hasHold: hasAction(this._config.hold_action),
            hasDoubleClick: hasAction(this._config.double_tap_action),
          })}
          tabindex="0"
          aria-label=${cardName}
        >
          <div class="content">
            ${glanceRows}
            <div id="card-timestamp" class=${last_heard_class}>${card_timestamp}</div>
            <div id="os-name" class=${os_name_class}>${ux_release}</div>
          </div>
        </ha-card>
      `;
    }
  }

  private _getRelativeTimeSinceUpdate(): [string, number] {
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    let desiredValue: string = '';
    let desiredMinutes: number = 0;
    if (this.hass.locale != undefined && stateObj != undefined) {
      const stateStrInterp = computeStateDisplay(this.hass?.localize, stateObj, this.hass.locale);
      // console.log('- grtsu card stateStrInterp=[' + stateStrInterp + ']');
      const relativeInterp = stateStrInterp === undefined ? '{unknown}' : this.prettyDate(stateStrInterp);
      // console.log('   relativeInterp=[' + relativeInterp + ']');
      desiredValue = this._sensorAvailable ? relativeInterp : '{unknown}';
      // console.log('   desiredValue=[' + desiredValue + ']');
      const lineParts: string[] = relativeInterp.split(' ');
      const minutesValue: string = lineParts[0];

      if (minutesValue.includes('just') || minutesValue.includes('unknown')) {
        desiredMinutes = 0;
      } else {
        desiredMinutes = Number(minutesValue);
      }
    }
    return [desiredValue, desiredMinutes];
  }

  private prettyDate(time: string): string {
    const date: Date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
    const diff: number = (new Date().getTime() - date.getTime()) / 1000;
    const day_diff: number = Math.floor(diff / 86400);
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1;
    const day: number = date.getDate();

    if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
      return (
        year.toString() +
        '-' +
        (month < 10 ? '0' + month.toString() : month.toString()) +
        '-' +
        (day < 10 ? '0' + day.toString() : day.toString())
      );

    let rslt: string = '{unknown}';
    if (day_diff == 0) {
      if (diff < 60) {
        rslt = 'just now';
      } else if (diff < 120) {
        rslt = '1 minute ago';
      } else if (diff < 3600) {
        rslt = Math.floor(diff / 60) + ' minutes ago';
      } else if (diff < 7200) {
        rslt = '1 hour ago';
      } else if (diff < 86400) {
        rslt = Math.floor(diff / 3600) + ' hours ago';
      }
    } else if (day_diff == 1) {
      rslt = 'Yesterday';
    } else if (day_diff < 7) {
      rslt = day_diff + ' days ago';
    } else if (day_diff < 31) {
      rslt = Math.ceil(day_diff / 7) + ' weeks ago';
    }
    return rslt;
  }

  // Here we need to refresh the rings and titles after it has been initially rendered
  protected updated(changedProps: PropertyValues): void {
    if (this._showDebug()) {
      console.log('- updated()');
    }
    if (!this._config) {
      return;
    }

    // update cards' theme if changed
    if (this.hass) {
      const oldHass = changedProps.get('hass') as HomeAssistant;
      if (!oldHass || (oldHass && oldHass.themes !== this.hass.themes)) {
        applyThemesOnElement(this, this.hass.themes, this._config.theme);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stateObj = this.hass!.states[this._config.entity!];
    if (!stateObj) {
      this._stopCardRefreshTimer();
    }

    //console.log('- changed Props: [' + changedProps + ']');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = this.shadowRoot;

    if (this._sensorAvailable) {
      // update common label(s)
      const ux_release: string = this._getAttributeValueForKey(Constants.RPI_NIX_RELEASE_KEY);
      const color = this._computeOsReleaseColor(ux_release);
      if (color != '') {
        const labelElement = root.getElementById('os-name');
        labelElement.style.setProperty('color', color);
      }

      if (this._useFullCard()) {
        // update our FULL card
        for (const currName in this._cardFullCssIDs) {
          const currLabelID = this._cardFullCssIDs[currName];
          const currAttrKey = this._cardFullElements[currName];
          const rawValue = this._getAttributeValueForKey(currAttrKey);
          const latestValue = this._getFullCardValueForAttributeKey(currAttrKey);
          if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
            console.log('- FULL memory latestValue=[' + latestValue + ']');
          }
          const labelElement = root.getElementById(currLabelID);
          labelElement.textContent = latestValue;
          const currIconCssID = this._cardFullIconCssIDs[currName];
          const iconElement = root.getElementById(currIconCssID);
          if (currAttrKey == Constants.RPI_FS_USED_PERCENT_KEY) {
            const color = this._computeFileSystemUsageColor(rawValue);
            if (color != '') {
              labelElement.style.setProperty('color', color);
              iconElement.style.setProperty('color', color);
            }
          }
          if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
            const color = this._computeMemoryUsageColor(latestValue.replace(' %', ''));
            if (color != '') {
              labelElement.style.setProperty('color', color);
              iconElement.style.setProperty('color', color);
            }
          }
          if (currAttrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
            const color = this._computeTemperatureColor(rawValue);
            if (color != '') {
              labelElement.style.setProperty('color', color);
              iconElement.style.setProperty('color', color);
            }
          }
        }
      } else {
        // update our GLANCE card
        for (const currName in this._cardGlanceCssIDs) {
          const currLabelID = this._cardGlanceCssIDs[currName];
          const currAttrKey = this._cardGlanceElements[currName];
          const rawValue = this._getAttributeValueForKey(currAttrKey);
          const latestValue = this._getGlanceCardValueForAttributeKey(currAttrKey);
          if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
            console.log('- GLNC memory latestValue=[' + latestValue + ']');
          }
          const labelElement = root.getElementById(currLabelID);
          labelElement.textContent = latestValue;
          const currIconCssID = this._cardGlanceIconCssIDs[currName];
          const iconElement = root.getElementById(currIconCssID);
          if (currAttrKey == Constants.RPI_FS_USED_PERCENT_KEY) {
            const color = this._computeFileSystemUsageColor(rawValue);
            if (color != '') {
              labelElement.style.setProperty('color', color);
              iconElement.style.setProperty('color', color);
            }
          }
          if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
            const color = this._computeMemoryUsageColor(latestValue);
            if (color != '') {
              labelElement.style.setProperty('color', color);
              iconElement.style.setProperty('color', color);
            }
          }
          if (currAttrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
            // don't place temp scale (C or F) when 'n/a'
            if (latestValue != 'n/a') {
              const color = this._computeTemperatureColor(rawValue);
              if (color != '') {
                labelElement.style.setProperty('color', color);
                iconElement.style.setProperty('color', color);
              }
              const scaleLabelElement = root.getElementById(this.kClassIdTempScale);
              scaleLabelElement.textContent = this._getTemperatureScale();
            }
          }
        }
      }
    }
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this._config && ev.detail.action) {
      handleAction(this, this.hass, this._config, ev.detail.action);
    }
  }

  private showWarning(warning: string): TemplateResult {
    // generate a warning message for use in card
    return html` <hui-warning>${warning}</hui-warning> `;
  }

  private showError(error: string): TemplateResult {
    // display an error card
    const errorCard = document.createElement('hui-error-card') as LovelaceCard;
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this._config,
    });

    return html` ${errorCard} `;
  }

  // ===========================================================================
  //  PRIVATE (utility) functions
  // ---------------------------------------------------------------------------

  private _startCardRefreshTimer(): void {
    this._updateTimerID = setInterval(() => this._handleCardUpdateTimerExpiration(), 1000);
  }

  private _stopCardRefreshTimer(): void {
    if (this._updateTimerID != undefined) {
      clearInterval(this._updateTimerID);
      this._updateTimerID = undefined;
    }
  }

  private _handleCardUpdateTimerExpiration(): void {
    //
    //  timestamp portion of card
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = this.shadowRoot;
    let needCardFlush = false;
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    if (stateObj != undefined) {
      const labelElement = root.getElementById('card-timestamp');
      if (labelElement) {
        const showCardAge = this._config.show_update_age != undefined ? this._config.show_update_age : true;
        const [card_timestamp_value, sinceInMinutes] = this._getRelativeTimeSinceUpdate();
        //console.log('-- card_timestamp_value=[' + card_timestamp_value + '] sinceInMinutes=[' + sinceInMinutes + ']');
        if (card_timestamp_value) {
          let card_timestamp = card_timestamp_value;
          // BUGFIX let's NOT show 'in NaN weeks' message on reload...
          if (card_timestamp_value.includes('NaN')) {
            card_timestamp = 'waiting for report...';
            needCardFlush = true;
          }
          labelElement.textContent = showCardAge == true ? card_timestamp : '';

          // now apply color if our entry is OLD
          //const periodMinutes: string = this._getAttributeValueForKey(Constants.RPI_SCRIPT_INTERVAL_KEY);
          //console.log('   periodMinutes=[' + periodMinutes + ']');
          //const mumber_periods: number = (sinceInMinutes / parseInt(periodMinutes)) * 10;
          //console.log('   mumber_periods=[' + mumber_periods + ']');
          const intervalColor = this._computeReporterAgeColor(sinceInMinutes);
          if (intervalColor != '' && intervalColor != undefined) {
            //console.log('   intervalColor=[' + intervalColor + ']');
            labelElement.style.setProperty('color', intervalColor);
          }
        }
        if (needCardFlush) {
          this._emptyCardValuesWhileWaitingForSensor();
        }
      }
    }
  }

  private _useFullCard(): boolean {
    let useFullCardStatus = true;
    if (this._config) {
      if (this._config.card_style != undefined) {
        // NOTE this depends upon full validation of the two legal values [full|glance] above
        useFullCardStatus = this._config.card_style.toLocaleLowerCase() == 'full' ? true : false;
      }
    }
    return useFullCardStatus;
  }

  private _useTempsInC(): boolean {
    let useTempsInCStatus = true;
    if (this._config) {
      if (this._config.temp_scale != undefined) {
        // NOTE this depends upon full validation of the two legal values [full|glance] above
        useTempsInCStatus = this._config.temp_scale.toLocaleLowerCase() == 'c' ? true : false;
      }
    }
    return useTempsInCStatus;
  }

  private _logChangeMessage(message: string): void {
    if (this._hostname == '') {
      this._hostname = this._getAttributeValueForKey(Constants.RPI_HOST_NAME_KEY);
    }
    const logMessage = '(' + this._hostname + '): ' + message;
    if (this._showDebug()) {
      console.log(logMessage);
    }
  }

  private _updateSensorAvailability(): void {
    let availChanged: boolean = false;
    if (this.hass && this._config) {
      const entityId = this._config.entity ? this._config.entity : undefined;
      const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;

      if (!entityId && !stateObj) {
        this._sensorAvailable = false;
        availChanged = true; // force output in this case
      } else {
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const tmpAvail = this.hass.states[this._config.entity!].state != 'unavailable';
          availChanged = this._sensorAvailable != tmpAvail ? true : false;
          this._sensorAvailable = tmpAvail;
        } catch (error) {
          this._sensorAvailable = false;
          availChanged = true; // force output in this case
        }
      }
    } else {
      this._sensorAvailable = false;
      availChanged = true; // force output in this case
    }
    if (availChanged) {
      this._logChangeMessage('* SENSOR available: ' + this._sensorAvailable);
    }
  }

  private _getIconNameForPercent(percent: string): string {
    // return name of icon we should show for given %
    let desiredIconName = '';
    for (const currIconName in this._circleIconsValueByName) {
      const currMaxValue = this._circleIconsValueByName[currIconName];
      if (percent <= currMaxValue) {
        desiredIconName = currIconName;
        break;
      }
    }
    return desiredIconName;
  }

  private _computeReporterAgeColor(numberValue: number): unknown {
    const sections = this._colorReportPeriodsAgoDefault;

    //console.log('color-table: sections=');
    //console.log(sections);
    //return '';

    let color: undefined | string = undefined;

    sections.forEach((section) => {
      if (numberValue >= section.from && numberValue <= section.to) {
        color = section.color;
      }
    });

    if (color === undefined) color = '';
    return color;
  }

  private _computeTemperatureColor(value: string): unknown {
    const config = this._config;
    const numberValue = Number(value);
    const sections = config.temp_severity ? config.temp_severity : this._colorTemperatureDefault;

    //console.log('color-table: sections=');
    //console.log(sections);
    //return '';

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          const logMessage =
            '_computeTemperatureColor() - value=[' +
            value +
            '] matched(from=' +
            section.from +
            ', to=' +
            section.to +
            ', color=' +
            color +
            ')';
          if (this._showDebug()) {
            console.log(logMessage);
          }
        }
      });
    }
    const logMessage = '_computeTemperatureColor() - value=[' + value + '] returns(color=' + color + ')';
    if (this._showDebug()) {
      console.log(logMessage);
    }
    if (color == undefined) color = '';
    return color;
  }

  private _computeFileSystemUsageColor(value: string): string {
    const config = this._config;
    const numberValue = Number(value);
    const sections = config.fs_severity ? config.fs_severity : this._colorUsedSpaceDefault;

    //console.log('color-table: sections=[' + _colorUsedMemoryDefault + ']');
    //return '';

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          const logMessage =
            '_computeFileSystemUsageColor() - value=[' +
            value +
            '] matched(from=' +
            section.from +
            ', to=' +
            section.to +
            ', color=' +
            color +
            ')';
          if (this._showDebug()) {
            console.log(logMessage);
          }
        }
      });
    }
    const logMessage = '_computeFileSystemUsageColor() - value=[' + value + '] returns(color=' + color + ')';
    if (this._showDebug()) {
      console.log(logMessage);
    }

    if (color == undefined) color = '';
    return color;
  }

  private _computeMemoryUsageColor(value: string): string {
    const config = this._config;
    const numberValue = Number(value);
    const sections = config.memory_severity ? config.memory_severity : this._colorUsedMemoryDefault;

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          const logMessage =
            '_computeMemoryUsageColor() - value=[' +
            value +
            '] matched(from=' +
            section.from +
            ', to=' +
            section.to +
            ', color=' +
            color +
            ')';
          if (this._showDebug()) {
            console.log(logMessage);
          }
        }
      });
    }
    const logMessage = '_computeMemoryUsageColor() - value=[' + value + '] returns(color=' + color + ')';
    if (this._showDebug()) {
      console.log(logMessage);
    }

    if (color == undefined) color = '';
    return color;
  }

  private _computeOsReleaseColor(osName: string): unknown {
    const config = this._config;
    const sections = config.os_age ? config.os_age : this._colorReleaseDefault;

    //console.log('color-table: sections=');
    //console.log(sections);
    //return '';

    let color: undefined | string = undefined;

    sections.forEach((section) => {
      if (osName === section.os) {
        color = section.color;
        const logMessage =
          '_computeOsReleaseColor() - value=[' + osName + '] matched(os=' + section.os + ', color=' + color + ')';
        if (this._showDebug()) {
          console.log(logMessage);
        }
      }
    });
    const logMessage = '_computeTemperatureColor() - value=[' + osName + '] returns(color=' + color + ')';
    if (this._showDebug()) {
      console.log(logMessage);
    }
    if (color == undefined) color = '';
    return color;
  }

  private _filterUptime(uptimeRaw: string): string {
    const lineParts: string[] = uptimeRaw.split(' ');
    let interpValue = uptimeRaw;
    if (interpValue.includes(':')) {
      for (let index = 0; index < lineParts.length; index++) {
        const currPart = lineParts[index];
        if (currPart.includes(':')) {
          const timeParts = currPart.split(':');
          const newPart = timeParts[0] + 'h:' + timeParts[1] + 'm';
          lineParts[index] = newPart;
        }
      }
      interpValue = lineParts.join(' ');
    }
    return interpValue;
  }

  private _getAttributeValueForKey(key: string): string {
    // HELPER UTILITY: get requested named value from config
    if (!this.hass || !this._config) {
      return '';
    }
    const entityId = this._config.entity ? this._config.entity : undefined;
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;

    if (!entityId && !stateObj) {
      return '';
    }

    if (stateObj?.attributes == undefined) {
      return '';
    }

    let desired_value: string = ''; // empty string
    if (key in stateObj?.attributes) {
      desired_value = stateObj?.attributes[key];
    }
    //console.log('- getAttr key=[' + key + '], value=[' + desired_value + ']');
    return desired_value;
  }

  private _emptyCardValuesWhileWaitingForSensor(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = this.shadowRoot;

    if (this._sensorAvailable) {
      if (this._useFullCard()) {
        // clear values for our FULL card
        for (const currName in this._cardFullCssIDs) {
          const currLabelID = this._cardFullCssIDs[currName];
          const labelElement = root.getElementById(currLabelID);
          labelElement.textContent = '';
        }
      } else {
        // clear values for our GLANCE card
        for (const currName in this._cardGlanceCssIDs) {
          const currLabelID = this._cardGlanceCssIDs[currName];
          const currAttrKey = this._cardGlanceElements[currName];
          const labelElement = root.getElementById(currLabelID);
          labelElement.textContent = '';
          if (currAttrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
            const scaleLabelElement = root.getElementById(this.kClassIdTempScale);
            scaleLabelElement.textContent = this._getTemperatureScale();
          }
        }
      }
    }
  }

  private _generateFullsizeCardRows(): TemplateResult[] {
    // create the rows for the GLANCE card
    const rowsArray: TemplateResult[] = [];

    for (const currName in this._cardFullElements) {
      const currAttributeKey = this._cardFullElements[currName];
      // Use `key` and `value`
      const interpValue = this._getFullCardValueForAttributeKey(currAttributeKey);

      // determine icon we should display
      let currIconName = this._cardFullIconNames[currName];
      if (currAttributeKey == Constants.RPI_FS_USED_PERCENT_KEY) {
        const latestRawValue = this._getAttributeValueForKey(currAttributeKey);
        currIconName = this._getIconNameForPercent(latestRawValue);
      }
      const currIconCssID = this._cardFullIconCssIDs[currName];
      // get ID for values that need updating
      const currLabelCssID = this._cardFullCssIDs[currName];
      // adjust our row size for bottom rows (group them visually)
      let rowHightAttribute = 'attribute-row';
      if (currName == 'Model') {
        rowHightAttribute = 'first-short';
      } else if (currName == 'Interfaces') {
        rowHightAttribute = 'last-short';
      }
      // now generate row....
      rowsArray.push(html`
        <div class="${rowHightAttribute}">
          <rpi-attribute-row>
            <div class="icon-holder">
              <ha-icon id="${currIconCssID}" class="attr-icon-full pointer" icon="mdi:${currIconName}"></ha-icon>
            </div>
            <div class="info pointer text-content attr-value">${currName}</div>
            <div id="${currLabelCssID}" class="text-content right uom">${interpValue}</div>
          </rpi-attribute-row>
        </div>
      `);
    }
    return rowsArray;
  }

  private _generateGlanceCardRows(): TemplateResult[] {
    // create the columns for the GLANCE card
    const columnsArray: TemplateResult[] = [];

    for (const currName in this._cardGlanceElements) {
      const currAttributeKey = this._cardGlanceElements[currName];
      // Use `key` and `value`
      const interpValue = this._getGlanceCardValueForAttributeKey(currAttributeKey);
      let currUnits = currName;
      if (currUnits == this.kREPLACE_WITH_TEMP_UNITS) {
        if (interpValue != 'n/a') {
          currUnits = this._getTemperatureScale();
        } else {
          // when 'n/a' don't show units!
          currUnits = '';
        }
      }
      if (currAttributeKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
        currUnits = '% Mem';
      }
      let currIconName = this._cardGlanceIconNames[currName];
      if (currAttributeKey == Constants.RPI_FS_USED_PERCENT_KEY) {
        currIconName = this._getIconNameForPercent(interpValue);
      }
      const currLabelCssID = this._cardGlanceCssIDs[currName];
      const currIconCssID = this._cardGlanceIconCssIDs[currName];

      let scaleCssID = 'units';
      if (currAttributeKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
        scaleCssID = this.kClassIdTempScale;
      }
      columnsArray.push(html`
        <div class="attributes" tabindex="0">
          <div>
            <ha-icon id="${currIconCssID}" class="attr-icon" icon="mdi:${currIconName}"></ha-icon>
          </div>
          <div id="${currLabelCssID}" class="attr-value">${interpValue}</div>
          <div id="${scaleCssID}" class="uom">${currUnits}</div>
        </div>
      `);
    }
    return columnsArray;
  }

  private _getTemperatureScale(): string {
    const scaleInterp = this._useTempsInC() == true ? 'ºC' : 'ºF';
    const logMessage = '_getTemperatureScale() scaleInterp=(' + scaleInterp + ')';
    if (this._showDebug()) {
      console.log(logMessage);
    }
    return scaleInterp;
  }

  private _getScaledTemperatureValue(temperature_raw: string): string {
    let interpValue = temperature_raw;
    if (interpValue != 'n/a') {
      if (this._useTempsInC() == false) {
        // if not inC convert to F
        interpValue = ((parseFloat(temperature_raw) * 9) / 5 + 32.0).toFixed(1);
      }
    }
    const logMessage = '_getScaledTemperatureValue(' + temperature_raw + ') scaleInterp=(' + interpValue + ')';
    if (this._showDebug()) {
      console.log(logMessage);
    }
    return interpValue;
  }

  private _getFullCardValueForAttributeKey(attrKey: string): string {
    const latestValue = this._getAttributeValueForKey(attrKey);
    let interpValue = latestValue;
    if (attrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
      interpValue = this._getPercentMemoryUsed() + ' %';
      //console.log('- interpValue=[' + interpValue + ' %]');
    } else if (attrKey == Constants.RPI_LAST_UPDATE_KEY) {
      // regenerate the date value
      interpValue = this._getUIDateForTimestamp(latestValue);
    } else if (attrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
      // let's format our temperature value
      interpValue = this._getScaledTemperatureValue(latestValue);
      if (interpValue != 'n/a') {
        const currUnits = this._getTemperatureScale();
        interpValue = interpValue + ' ' + currUnits;
      }
    } else if (attrKey == Constants.RPI_FS_TOTAL_GB_KEY) {
      // append our units
      interpValue = latestValue + ' GB';
    } else if (attrKey == Constants.RPI_FS_USED_PERCENT_KEY) {
      // append our % sign
      interpValue = latestValue + ' %';
    } else if (attrKey == Constants.RPI_UP_TIME_KEY) {
      interpValue = this._filterUptime(interpValue);
    } else if (attrKey == Constants.SHOW_OS_PARTS_VALUE) {
      // replace value with os release and version
      const osRelease = this._getAttributeValueForKey(Constants.RPI_NIX_RELEASE_KEY);
      const osVersion = this._getAttributeValueForKey(Constants.RPI_NIX_VERSION_KEY);
      interpValue = osRelease + ' v' + osVersion;
    } else if (attrKey == Constants.RPI_INTERFACES_KEY) {
      const namesArray: string[] = [];
      // expand our single letters into interface names
      if (latestValue.includes('e')) {
        namesArray.push('Ether');
      }
      if (latestValue.includes('w')) {
        namesArray.push('WiFi');
      }
      if (latestValue.includes('b')) {
        namesArray.push('Bluetooth');
      }
      interpValue = namesArray.join(', ');
    }
    return interpValue;
  }

  private _getGlanceCardValueForAttributeKey(attrKey: string): string {
    const latestValue = this._getAttributeValueForKey(attrKey);
    let interpValue = latestValue;
    if (attrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
      interpValue = this._getPercentMemoryUsed();
      //console.log('- interpValue=[' + interpValue + ' %]');
    } else if (attrKey == Constants.RPI_LAST_UPDATE_KEY) {
      // regenerate the date value
      interpValue = this._getUIDateForTimestamp(latestValue);
    } else if (attrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
      // let's scale our temperature value
      interpValue = this._getScaledTemperatureValue(latestValue);
    } else if (attrKey == Constants.RPI_UP_TIME_KEY) {
      interpValue = this._filterUptime(interpValue);
    }
    return interpValue;
  }

  private _getUIDateForTimestamp(dateISO: string): string {
    //const uiDateOptions = new DateTimeFormatOptions({
    //    locale:  'en-us',
    //    year:  'numeric',
    //    month: 'short',
    //    day:   'numeric',
    //});
    const timestamp = new Date(dateISO);
    const desiredInterp = timestamp.toLocaleDateString('en-us');
    return desiredInterp;
  }

  private _getPercentMemoryUsed(): string {
    // get the two memory values
    const tmpValue = this._getAttributeValueForKey('memory');
    const tmpSize = tmpValue['size_mb'];
    const tmpFree = tmpValue['free_mb'];
    const sizeMB: number = Number(tmpSize);
    const usedMB: number = tmpSize - Number(tmpFree);
    const percentUsed = (usedMB / sizeMB) * 100;
    const interpValue = percentUsed.toFixed(0).toString();
    return interpValue;
  }

  private _showDebug(): boolean {
    // we show debug if enabled in code or if found enabled in config for this card!
    let showDebugStatus = this._show_debug;
    if (this._config) {
      if (this._config.show_debug != undefined) {
        showDebugStatus = showDebugStatus == true || this._config.show_debug == true;
      }
    }
    return showDebugStatus;
  }

  static get styles(): CSSResultGroup {
    // style our GLANCE card
    return css`
      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
      }
      rpi-attribute-row {
        display: grid;
        flex-direction: row;
        align-items: center;
        height: 40px;
        grid-template-columns: 40px 2fr 3fr;
      }
      #states > * {
        margin: 8px 0px;
      }
      #states > div > * {
        overflow: hidden;
      }
      #states {
        flex: 1 1 0%;
      }
      .right {
        text-align: right;
      }
      .first-short {
        margin: 8px 0px 0px 0px;
        height: 20px;
      }
      .mid-short {
        margin: 0px;
        height: 20px;
      }
      .last-short {
        margin: 0px 0px 8px 0px;
        height: 20px;
      }
      .pointer {
        cursor: pointer;
      }
      .icon-holder {
        align-items: center;
        margin-left: 8px;
      }
      .attr-icon-full {
        color: var(--paper-item-icon-color);
      }
      .attribute-row {
        height: 40px;
      }
      .text-content {
        display: inline;
        line-height: 20px;
      }
      .info {
        white-space: nowrap;
        text-overflow: ellipses;
        overflow: hidden;
        margin-left: 16px;
        flex: 1 0 60px;
      }
      .content {
        display: flex;
        justify-content: space-between;
        padding: 16px 32px 24px 32px;
      }
      .attributes {
        cursor: pointer;
      }
      .attributes div {
        text-align: center;
      }
      .uom {
        color: var(--secondary-text-color);
      }
      .attr-value {
        color: var(--primary-text-color);
      }
      .attr-icon {
        color: var(--paper-item-icon-color);
        margin-bottom: 8px;
      }
      .last-heard-full {
        position: absolute;
        top: 45px;
        right: 30px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard {
        position: absolute;
        top: 55px;
        right: 30px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard-full-notitle {
        position: absolute;
        top: 3px;
        right: 30px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard-notitle {
        position: absolute;
        bottom: 5px;
        right: 90px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-full {
        position: absolute;
        top: 45px;
        left: 30px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name {
        position: absolute;
        top: 55px;
        left: 30px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-full-notitle {
        position: absolute;
        top: 3px;
        left: 30px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-notitle {
        position: absolute;
        bottom: 5px;
        left: 90px;
        font-size: 12px;
        color: var(--primary-text-color);
      }
    `;
  }
}
