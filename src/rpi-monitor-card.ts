/* eslint-disable @typescript-eslint/no-inferrable-types */ /* I prefer to learn early when an unexpected type is being assigned */
import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
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

// TODO Name your custom element
@customElement('rpi-monitor-card')
export class RPiMonitorCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('rpi-monitor-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass!: HomeAssistant;
  @property() private _config!: RPiMonitorCardConfig;

  // and those that don't cause a re-render
  private _firstTime: boolean = true;
  private _sensorAvailable: boolean = false;
  private _useFullCard: boolean = false;
  private _tempsInC: boolean = true;
  private _updateTimerID: NodeJS.Timeout | undefined;

  private kREPLACE_WITH_TEMP_UNITS: string = 'replace-with-temp-units';

  private _cardFullElements = {
    // top to bottom
    Storage: Constants.RPI_FS_TOTAL_GB_KEY,
    'Storage Use': Constants.RPI_FS_FREE_PERCENT_KEY,
    Updated: Constants.RPI_LAST_UPDATE_KEY,
    Temperature: Constants.RPI_TEMPERATURE_IN_C_KEY,
    'Up-time': Constants.RPI_UP_TIME_KEY,
    OS: Constants.SHOW_OS_PARTS_VALUE,
    Model: Constants.RPI_MODEL_KEY,
    Interfaces: Constants.RPI_INTERFACES_KEY,
    Reported: Constants.SHOW_TIME_SINCE_VALUE,
  };
  private _cardGlanceElements = {
    // left to right
    '%': Constants.RPI_FS_FREE_PERCENT_KEY,
    GB: Constants.RPI_FS_TOTAL_GB_KEY,
    'replace-with-temp-units': Constants.RPI_TEMPERATURE_IN_C_KEY,
    '-Up-': Constants.RPI_UP_TIME_KEY,
    Upd: Constants.RPI_LAST_UPDATE_KEY,
  };
  private _cardGlanceIconNames = {
    // left to right
    '%': 'file-percent',
    GB: 'sd',
    'replace-with-temp-units': 'thermometer',
    '-Up-': 'clock-check-outline',
    Upd: 'update',
  };

  public setConfig(config: RPiMonitorCardConfig): void {
    // Optional: Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.card_style != undefined) {
      const styleValue: string = config.card_style.toLocaleLowerCase();
      if (styleValue != 'full' && styleValue != 'glance') {
        console.log('Invalid configuration. INVALID card_style = [' + config.card_style + ']');
        throw new Error('Illegal card_style: value [card_style:' + config.card_style + ']');
      }
      // TEMPORARY
      if (styleValue == 'full') {
        console.log('UNSUPPORTED configuration. card_style = [' + config.card_style + ']');
        throw new Error('UNSUPPORTED card_style: value [card_style:' + config.card_style + ']');
      }
    }

    if (config.temp_scale != undefined) {
      const scaleValue: string = config.temp_scale.toLocaleLowerCase();
      if (scaleValue != 'c' && scaleValue != 'f') {
        console.log('Invalid configuration. INVALID temp_scale = [' + config.temp_scale + ']');
        throw new Error('Illegal temp_scale: value [temp_scale:' + config.temp_scale + ']');
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
      name: 'RPi Monitor',
      ...config,
    };

    if (this._config.card_style == undefined || this._config.card_style.toLocaleLowerCase() == 'full') {
      this._useFullCard = true;
    } else {
      this._useFullCard = false;
    }

    if (this._config.temp_scale == undefined || this._config.temp_scale.toLocaleLowerCase() == 'C') {
      this._tempsInC = true;
    } else {
      this._tempsInC = false;
    }

    console.log('- config:');
    console.log(this._config);

    this._updateSensorAvailability();
  }

  public getCardSize(): number {
    // adjust this based on glance or full card type
    return 6;
  }

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
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this._config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }

    const entityId = this._config.entity ? this._config.entity : undefined;
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;

    if (!entityId && !stateObj) {
      return this.showWarning('Entity Unavailable');
    }

    let needCardRegeneration = false;

    if (this._firstTime) {
      console.log('- stateObj:');
      console.log(stateObj);

      // set timer so our card updates timestamp every 5 seconds : 5000 (1 second: 1000)
      // FIXME: UNDONE remember to clear this interval when entity NOT avail. and restore when comes avail again...
      this._startCardRefreshTimer();

      // get card type and eval if change!

      needCardRegeneration = true;

      console.log('- 1st-time _config:');
      console.log(this._config);
      this._firstTime = false;
    }

    const cardName = 'RPi monitor ' + this._getAttributeValueForKey(Constants.RPI_FQDN_KEY);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const stateStrInterp = computeStateDisplay(this.hass?.localize, stateObj!, this.hass?.language);
    const relativeInterp =
      stateStrInterp === undefined ? '{unknown}' : relativeTime(new Date(stateStrInterp), this.hass?.localize);
    const card_timestamp_value = this._sensorAvailable ? relativeInterp : '{unknown}';

    if (this._useFullCard) {
      // our FULL card
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
        ></ha-card>
      `;
    } else {
      // our GLANCE card
      const glanceRows = this._generateGlanceRows();

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

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this._config && ev.detail.action) {
      handleAction(this, this.hass, this._config, ev.detail.action);
    }
  }

  private showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private showError(error: string): TemplateResult {
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
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    if (stateObj != undefined) {
      const labelElement = root.getElementById('card-timestamp');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const stateStrInterp = computeStateDisplay(this.hass?.localize, stateObj!, this.hass?.language);
      const relativeInterp =
        stateStrInterp === undefined ? '{unknown}' : relativeTime(new Date(stateStrInterp), this.hass?.localize);
      const newLabel = this._sensorAvailable ? relativeInterp : '{unknown}';
      labelElement.textContent = newLabel;
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tmpAvail = this.hass.states[this._config.entity!].state != 'unavailable';
        availChanged = this._sensorAvailable != tmpAvail ? true : false;
        this._sensorAvailable = tmpAvail;
      }
    } else {
      this._sensorAvailable = false;
      availChanged = true; // force output in this case
    }
    if (availChanged) {
      console.log('* SENSOR available: ' + this._sensorAvailable);
    }
  }

  private _computeSeverityColor(value: string): unknown {
    const config = this._config;
    const numberValue = Number(value);
    const sections = config.severity;
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
        }
      });
    }

    if (color == undefined) color = config.color;
    return color;
  }

  private _getAttributeValueForKey(key: string): string {
    // HELPER UTILITY: get requested named value from config
    const stateObj = this._config.entity ? this.hass.states[this._config.entity] : undefined;
    let desired_value: string = ''; // empty string
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (key in stateObj?.attributes!) {
      desired_value = stateObj?.attributes[key];
    }
    return desired_value;
  }

  private _generateGlanceRows(): TemplateResult[] {
    // create the columns for the glance card
    const rowsArray: TemplateResult[] = [];
    const uiDateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    for (const currName in this._cardGlanceElements) {
      const currAttributeKey = this._cardGlanceElements[currName];
      // Use `key` and `value`
      const currValue = this._getAttributeValueForKey(currAttributeKey);
      let interpValue = currValue;
      let currUnits = currName;
      if (currUnits == this.kREPLACE_WITH_TEMP_UNITS) {
        currUnits = this._tempsInC ? 'ºC' : 'ºF';
        if (this._tempsInC == false) {
          interpValue = ((parseFloat(currValue) * 9) / 5 + 32.0).toFixed(1);
        }
      }
      const currIconName = this._cardGlanceIconNames[currName];
      // if we have update date, let's carefully format it
      if (currName == 'Upd') {
        const timestamp = new Date(currValue);
        interpValue = timestamp.toLocaleDateString('en-us', uiDateOptions);
      }
      rowsArray.push(html`
        <div class="attributes" tabindex="0">
          <div>
            <ha-icon class="attr-icon" icon="mdi:${currIconName}"></ha-icon>
          </div>
          <div class="attr-value">${interpValue}</div>
          <div class="uom">${currUnits}</div>
        </div>
      `);
    }
    return rowsArray;
  }

  static get styles(): CSSResult {
    return css`
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
