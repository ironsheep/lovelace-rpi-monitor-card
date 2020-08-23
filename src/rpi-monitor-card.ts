/* eslint-disable @typescript-eslint/no-inferrable-types */ /* I prefer to learn early when an unexpected type is being assigned */
import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  applyThemesOnElement,
  computeStateDisplay,
  relativeTime,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
  LovelaceCard,
} from 'custom-card-helpers';

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

(window as any).customCards = (window as any).customCards || [];
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

  public static getStubConfig(): object {
    return {};
  }

  // Properities that should cause your element to re-render here
  @property() public hass!: HomeAssistant;
  @property() private _config!: RPiMonitorCardConfig;

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
    Storage: Constants.RPI_FS_TOTAL_GB_KEY,
    'Storage Use': Constants.RPI_FS_USED_PERCENT_KEY,
    Updated: Constants.RPI_LAST_UPDATE_KEY,
    Temperature: Constants.RPI_TEMPERATURE_IN_C_KEY,
    'Up-time': Constants.RPI_UP_TIME_KEY,
    OS: Constants.SHOW_OS_PARTS_VALUE,
    Model: Constants.RPI_MODEL_KEY,
    Interfaces: Constants.RPI_INTERFACES_KEY,
  };
  private _cardFullIconNames = {
    // top to bottom
    Storage: 'sd',
    'Storage Use': 'file-percent',
    Updated: 'update',
    Temperature: 'thermometer',
    'Up-time': 'clock-check-outline',
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
  // attribute value label IDs
  private kClassIdFSAvail = 'fs-percent';
  private kClassIdFSTotal = 'fs-total';
  private kClassIdSysTemp = 'sys-temp';
  private kClassIdUptime = 'up-time';
  private kClassIdUpdated = 'last-update';
  private kClassIdOS = '*nix';
  private kClassIdRPiModel = 'rpi-model';
  private kClassIdInterfaces = 'rpi-ifaces';
  // ond one special for unit
  private kClassIdTempScale = 'sys-temp-scale';

  private _cardFullCssIDs = {
    // top to bottom
    Storage: this.kClassIdFSTotal,
    'Storage Use': this.kClassIdFSAvail,
    Updated: this.kClassIdUpdated,
    Temperature: this.kClassIdSysTemp,
    'Up-time': this.kClassIdUptime,
    OS: this.kClassIdOS,
    Model: this.kClassIdRPiModel,
    Interfaces: this.kClassIdInterfaces,
  };
  private _cardFullIconCssIDs = {
    // top to bottom
    Storage: this.kClassIdIconFSTotal,
    'Storage Use': this.kClassIdIconFSAvail,
    Updated: this.kClassIdIconUpdated,
    Temperature: this.kClassIdIconSysTemp,
    'Up-time': this.kClassIdIconUptime,
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
    'replace-with-temp-units': Constants.RPI_TEMPERATURE_IN_C_KEY,
    UpTime: Constants.RPI_UP_TIME_KEY,
    Upd: Constants.RPI_LAST_UPDATE_KEY,
  };
  private _cardGlanceIconNames = {
    // left to right
    '%': 'file-percent',
    GB: 'sd',
    'replace-with-temp-units': 'thermometer',
    UpTime: 'clock-check-outline',
    Upd: 'update',
  };

  private _cardGlanceCssIDs = {
    // left to right
    '%': this.kClassIdFSAvail,
    GB: this.kClassIdFSTotal,
    'replace-with-temp-units': this.kClassIdSysTemp,
    UpTime: this.kClassIdUptime,
    Upd: this.kClassIdUpdated,
  };

  private _cardGlanceIconCssIDs = {
    // left to right
    '%': this.kClassIdIconFSAvail,
    GB: this.kClassIdIconFSTotal,
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

  // coloring for temp-in-C
  // no user override for now
  private _colorReportPeriodsAgoDefault = [
    {
      color: 'undefined',
      from: 0,
      to: 0,
    },
    {
      color: 'yellow',
      from: 1,
      to: 1,
    },
    {
      color: 'red',
      from: 2,
      to: 100,
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

  protected render(): TemplateResult | void {
    // Check for stateObj or other necessary things and render a warning if missing
    if (this._showDebug()) {
      console.log('- render()');
    }
    if (this._config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
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

    const rpi_fqdn = this._getAttributeValueForKey(Constants.RPI_FQDN_KEY);
    let cardName = 'RPi monitor ' + rpi_fqdn;
    cardName = this._config.name_prefix != undefined ? this._config.name_prefix + ' ' + rpi_fqdn : cardName;
    cardName = this._config.name != undefined ? this._config.name : cardName;

    const card_timestamp_value = this._getRelativeTimeSinceUpdate();

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
            <div id="card-timestamp" class="last-heard-full">${card_timestamp_value}</div>
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
            <div id="card-timestamp" class="last-heard">${card_timestamp_value}</div>
          </div>
        </ha-card>
      `;
    }
  }

  private _getRelativeTimeSinceUpdate(): string {
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stateStrInterp = computeStateDisplay(this.hass?.localize, stateObj!, this.hass?.language);
    const relativeInterp =
      stateStrInterp === undefined ? '{unknown}' : relativeTime(new Date(stateStrInterp), this.hass?.localize);
    const desiredValue = this._sensorAvailable ? relativeInterp : '{unknown}';
    return desiredValue;
  }

  private _getMinutesSinceUpdate(): number {
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stateStrInterp = computeStateDisplay(this.hass?.localize, stateObj!, this.hass?.language);
    const then = new Date(stateStrInterp);
    const now = new Date();
    let diff = (now.getTime() - then.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  // Here we need to refresh the rings and titles after it has been initially rendered
  protected updated(changedProps): void {
    if (this._showDebug()) {
      console.log('- updated()');
    }
    if (!this._config) {
      return;
    }

    // update cards' theme if changed
    if (this.hass) {
      const oldHass = changedProps.get('hass');
      if (!oldHass || oldHass.themes !== this.hass.themes) {
        applyThemesOnElement(this, this.hass.themes, this._config.theme);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stateObj = this.hass!.states[this._config.entity!];
    if (!stateObj) {
      this._stopCardRefreshTimer();
    }

    //console.log('- changed Props: ');
    //console.log(changedProps);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const root: any = this.shadowRoot;

    if (this._sensorAvailable) {
      if (this._useFullCard()) {
        // update our FULL card
        for (const currName in this._cardFullCssIDs) {
          const currLabelID = this._cardFullCssIDs[currName];
          const currAttrKey = this._cardFullElements[currName];
          const rawValue = this._getAttributeValueForKey(currAttrKey);
          const latestValue = this._getFullCardValueForAttributeKey(currAttrKey);
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
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private showError(error: string): TemplateResult {
    // display an error card
    const errorCard = document.createElement('hui-error-card') as LovelaceCard;
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this._config,
    });

    return html`
      ${errorCard}
    `;
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
    const root: any = this.shadowRoot;
    let needCardFlush = false;
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    if (stateObj != undefined) {
      const labelElement = root.getElementById('card-timestamp');
      if (labelElement) {
        let card_timestamp_value = this._getRelativeTimeSinceUpdate();
        if (card_timestamp_value) {
          // BUGFIX let's NOT show 'in NaN weeks' message on reload...
          if (card_timestamp_value.includes('NaN')) {
            card_timestamp_value = 'waiting for report...';
            needCardFlush = true;
          }
          labelElement.textContent = card_timestamp_value;
          // now apply color if our entry is OLD
          /*
          const sinceInMinutes = this._getMinutesSinceUpdate();
          const periodMinutes = this._getAttributeValueForKey(Constants.RPI_SCRIPT_INTERVAL_KEY);
          const mumber_periods: number = sinceInMinutes / parseInt(periodMinutes);
          const intervalColor = this._computeReporterAgeColor(mumber_periods.toString());
          if (intervalColor != '') {
            labelElement.style.setProperty('color', intervalColor);
          }
          */
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

  private _computeReporterAgeColor(value: string): unknown {
    const numberValue = Number(value);
    const sections = this._colorReportPeriodsAgoDefault;

    //console.log('color-table: sections=');
    //console.log(sections);
    //return '';

    let color: undefined | string;

    sections.forEach(section => {
      if (numberValue >= section.from && numberValue <= section.to) {
        color = section.color;
      }
    });

    if (color == undefined) color = '';
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

    if (isNaN(numberValue)) {
      sections.forEach(section => {
        if (value == section.text) {
          color = section.color;
        }
      });
    } else {
      sections.forEach(section => {
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

    //console.log('color-table: sections=');
    //console.log(sections);
    //return '';

    let color: undefined | string;

    if (isNaN(numberValue)) {
      sections.forEach(section => {
        if (value == section.text) {
          color = section.color;
        }
      });
    } else {
      sections.forEach(section => {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (key in stateObj?.attributes!) {
      desired_value = stateObj?.attributes[key];
    }
    return desired_value;
  }

  private _emptyCardValuesWhileWaitingForSensor(): void {
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
    if (attrKey == Constants.RPI_LAST_UPDATE_KEY) {
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
    if (attrKey == Constants.RPI_LAST_UPDATE_KEY) {
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
    const uiDateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const timestamp = new Date(dateISO);
    const desiredInterp = timestamp.toLocaleDateString('en-us', uiDateOptions);
    return desiredInterp;
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

  static get styles(): CSSResult {
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
    `;
  }
}
