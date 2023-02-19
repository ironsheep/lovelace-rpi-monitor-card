/* eslint-disable @typescript-eslint/no-inferrable-types */
// (I prefer to learn early when an unexpected type is being assigned)
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  applyThemesOnElement,
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
import { ColorUtils } from './coloring';

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
    console.log('- getConfigElement()');
    return document.createElement('rpi-monitor-card-editor') as LovelaceCardEditor;
  }

  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // Properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: RPiMonitorCardConfig;

  @state() private _cardMinutesSinceUpdate: number = 0;

  // and those that don't cause a re-render
  private _firstTime: boolean = true;
  private _stateInfoAvailable: boolean = false;
  private _updateTimerID: NodeJS.Timeout | undefined = undefined;
  private _configEntityId: string | undefined = undefined;
  private _hostname: string = '';
  private _showFullCard: boolean = true;
  private _useTempsInC: boolean = true;
  private kREPLACE_WITH_TEMP_UNITS: string = 'replace-with-temp-units';
  private latestDaemonVersions: string[] = ['v1.7.4', 'v1.6.1']; // REMOVE BEFORE FLIGHT (TEST DATA)
  private currentDaemonVersion: string = '';

  // OS Age is shown (default = True) unless turned off
  private _showOsAge: boolean = true;
  // Card Update Age is shown (default = True) unless turned off
  private _showCardAge: boolean = true;
  private _showDaemonUpdNeed: boolean = true;
  private _showCardName: boolean = true;

  // WARNING set following to false before commit!
  private _showDebug: boolean = false; // REMOVE BEFORE FLIGHT (!set to false before check-in!)
  private colorHelpers: ColorUtils = new ColorUtils();

  // -----------------------------------------------------------
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
    'Storage Use': 'file-percent',
    Storage: 'sd',
    'Memory Use': 'memory',
    Temperature: 'thermometer',
    'Up-time': 'clock-check-outline',
    Updated: 'update',
    OS: 'linux',
    Model: 'raspberry-pi',
    Interfaces: '',
  };

  private _cardFullCssIDs = {
    // top to bottom
    'Storage Use': Constants.kCSSClassIdFSAvail,
    Storage: Constants.kCSSClassIdFSTotal,
    'Memory Use': Constants.kCSSClassIdMemoryUsage,
    Temperature: Constants.kCSSClassIdSysTemp,
    'Up-time': Constants.kCSSClassIdUptime,
    Updated: Constants.kCSSClassIdUpdated,
    OS: Constants.kCSSClassIdOS,
    Model: Constants.kCSSClassIdRPiModel,
    Interfaces: Constants.kCSSClassIdInterfaces,
  };
  private _cardFullIconCssIDs = {
    // top to bottom
    'Storage Use': Constants.kClassIconFSAvail,
    Storage: Constants.kClassIconFSTotal,
    'Memory Use': Constants.kClassIconMemoryUsage,
    Temperature: Constants.kClassIconSysTemp,
    'Up-time': Constants.kClassIconUptime,
    Updated: Constants.kClassIconUpdated,
    OS: Constants.kClassIconOS,
    Model: Constants.kClassIconRPiModel,
    Interfaces: Constants.kClassIconInterfaces,
  };

  // -----------------------------------------------------------
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
    '%': Constants.kCSSClassIdFSAvail,
    GB: Constants.kCSSClassIdFSTotal,
    Mem: Constants.kCSSClassIdMemoryUsage,
    'replace-with-temp-units': Constants.kCSSClassIdSysTemp,
    UpTime: Constants.kCSSClassIdUptime,
    Upd: Constants.kCSSClassIdUpdated,
  };

  private _cardGlanceIconCssIDs = {
    // left to right
    '%': Constants.kClassIconFSAvail,
    GB: Constants.kClassIconFSTotal,
    Mem: Constants.kClassIconMemoryUsage,
    'replace-with-temp-units': Constants.kClassIconSysTemp,
    UpTime: Constants.kClassIconUptime,
    Upd: Constants.kClassIconUpdated,
  };

  public setConfig(config: RPiMonitorCardConfig): void {
    // https://lit.dev/docs/components/properties/#accessors-custom
    //console.log('- setConfig() - ENTRY');
    // console.log(config);

    // use user debug flag or override with internal flag if set
    if (config.show_debug != undefined) {
      this._showDebug = config.show_debug || this._showDebug;
    }

    if (this._showDebug) {
      console.log('- setConfig()');
    }
    // Optional: Check for required fields and that they are of the proper format
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.entity === undefined) {
      console.log("Invalid configuration. If no entity provided, you'll need to provide a remote entity");
      throw new Error('You need to associate an entity');
    }

    if (config.card_style != undefined) {
      const styleValue: string = config.card_style.toLocaleLowerCase();
      if (styleValue != 'full' && styleValue != 'glance') {
        console.log('Invalid configuration. INVALID card_style = [' + config.card_style + ']');
        throw new Error('Illegal card_style: value (card_style: ' + config.card_style + ') must be [full or glance]');
      }
      this._showFullCard = config.card_style.toLocaleLowerCase() === 'full' ? true : false;
    }

    if (config.temp_scale != undefined) {
      const scaleValue: string = config.temp_scale.toLocaleLowerCase();
      if (scaleValue != 'c' && scaleValue != 'f') {
        console.log('Invalid configuration. INVALID temp_scale = [' + config.temp_scale + ']');
        throw new Error('Illegal temp_scale: value (temp_scale: ' + config.temp_scale + ') must be [F or C]');
      }
      this._useTempsInC = config.temp_scale.toLocaleLowerCase() === 'c' ? true : false;
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this._config = {
      //name: 'RPi Monitor', (causes name overwrite, don't do this!!!)
      ...config,
    };

    //console.log(this._config);
    /*
    console.log(config.show_os_age);
    console.log(config.show_update_age);
    console.log(config.show_daemon_upd);
    console.log(config.show_title);
    console.log(this._config.show_os_age);
    console.log(this._config.show_update_age);
    console.log(this._config.show_daemon_upd);
    console.log(this._config.show_title);
    */

    // OS Age is shown (default = True) unless turned off
    this._showOsAge = this._config.show_os_age != undefined ? this._config.show_os_age : true;
    // Card Update Age is shown (default = True) unless turned off
    this._showCardAge = this._config.show_update_age != undefined ? this._config.show_update_age : true;
    this._showDaemonUpdNeed = this._config.show_daemon_upd != undefined ? this._config.show_daemon_upd : true;
    this._showCardName = this._config.show_title != undefined ? this._config.show_title : true;
    /*
    console.log(
      '- showCardName=[' +
        this._showCardName +
        '], showOsAge=[' +
        this._showOsAge +
        '], showCardAge=[' +
        this._showCardAge +
        '], showDaemonUpdNeed=[' +
        this._showDaemonUpdNeed +
        ']',
    );
*/
    this._configEntityId = this._config.entity != undefined ? this._config.entity : undefined;

    // set initial state avail.
    this._ensureStateInfoAvail();
    // request the release info from the DAEMON repository
    //this.loadDaemonReleases();
    //console.log('- setConfig() - EXIT');
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    // Called to determine whether an update cycle is required.
    // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
    // if we don't yet know our hostname, then get it

    this._ensureStateInfoAvail();

    // and for debug earliest use:
    this._ensureWeHaveHostName();

    //console.log('/---- shouldUpdate(' + this._hostname + ') - ENTRY');

    // list our keys
    this._debugShowProps(changedProps, 'shouldUpdate');

    // Opeartional note:
    // all the properties will come thru as undefined when page is first loaded
    //   in this case we say update since the card need to be initially painted

    if (!this._config) {
      if (this._showDebug) {
        console.log(' - SU ABORT, no config');
      }
      return false;
    }

    // check in order of lightest-weight checks first
    let bShouldStatus: boolean = false;
    if (changedProps.has('_config')) {
      // this will catch our changedProps['_config'] == undefined case in which case we will initially paint our cards
      if (this._showDebug) {
        console.log(' - SU config present');
      }
      bShouldStatus = true;
    } else if (changedProps.has('_cardMinutesSinceUpdate')) {
      if (this._showDebug) {
        console.log(' - SU card last updated changed');
      }
      bShouldStatus = true;
    } else if (this.hass && this._config && changedProps.has('hass')) {
      const oldHass = changedProps.get('hass') as HomeAssistant;

      if (oldHass && this._configEntityId) {
        bShouldStatus = oldHass.states[this._configEntityId] !== this.hass.states[this._configEntityId];
        // XYZZY
        if (bShouldStatus) {
          if (this._showDebug) {
            console.log(' - SU hass state changed');
          }
        } else {
          if (this._showDebug) {
            console.log(' - SU !! NO hass state change');
          }
        }
        //
      }
    }
    /*
    else if ( this.hass && this._configEntityId) {
      console.log(' - SU NO changes but paint card!');
      // force update so we paint cards early
      bShouldStatus = true;
    }
    */

    if (this._showDebug) {
      console.log('\\---- shouldUpdate(' + this._hostname + ') - EXIT w/' + bShouldStatus);
    }
    return bShouldStatus;
  }

  protected willUpdate(changedProps: PropertyValues): void {
    // Called before update() (which in-turn calls render()) to compute values needed during the update.
    // https://lit.dev/docs/components/lifecycle/#willupdate
    //console.log('/---- willUpdate(' + this._hostname + ') - ENTRY');
    if (changedProps) {
    } // kill compiler warn
    // list our keys
    this._debugShowProps(changedProps, 'willUpdate()');
    //console.log('\\---- willUpdate(' + this._hostname + ') - EXIT');
  }

  protected render(): TemplateResult | void {
    // Called by update() and should be implemented to return a renderable result (such as a TemplateResult) used to render the component's DOM.
    // https://lit.dev/docs/components/rendering/
    // https://lit.dev/docs/components/lifecycle/#render
    // Check for stateObj or other necessary things and render a warning if missing
    if (this._showDebug) {
      console.log('- render(' + this._hostname + ')');
    }
    if (this._config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }

    if (this._config.show_error) {
      return this.showError(localize('common.show_error'));
    }

    if (this._configEntityId && !this._stateInfoAvailable) {
      const warningMessage = 'Entity Unavailable: ' + this._configEntityId;
      return this.showWarning(warningMessage);
    }

    const stateObj = this._configEntityId ? this.hass.states[this._configEntityId] : undefined;

    if (!this._configEntityId && !stateObj) {
      return this.showWarning('Entity Unavailable');
    }

    // don't let render happen on no-sensor!
    if (!this._stateInfoAvailable) {
      console.log('?? Render w/o sensor!! (' + this._hostname + ')');
      return;
    }

    let cardHtml: TemplateResult = html``;
    //console.log('/---- render(' + this._hostname + ') - ENTRY');

    if (this._firstTime) {
      if (this._showDebug) {
        console.log('- stateObj: [' + stateObj + ']');
      }

      // set timer so our card updates timestamp every 5 seconds : 5000 (1 second: 1000)
      // remember to clear this interval when entity NOT avail. and restore when comes avail again...
      this._startCardRefreshTimer();

      if (this._showDebug) {
        console.log('- 1st-time _config: [' + this._config + ']');
      }
      this._firstTime = false;
    }

    if (this._showDaemonUpdNeed) {
      // get Daemon current version
      const reporter_version: string = this._getAttributeValueForKey(Constants.RPI_SCRIPT_VER_KEY);
      const reportParts: string[] = reporter_version.split(' ');
      this.currentDaemonVersion = reportParts.length > 1 ? reportParts[1] : '';
      //console.log('- 1st-time currentDaemonVersion=[' + this.currentDaemonVersion + ']');

      // get version list from Daemon (if provided)
      const reporter_version_set: string = this._getAttributeValueForKey(Constants.RPI_SCRIPT_RELEASE_LIST);
      if (reporter_version_set && reporter_version_set.length > 0 && reporter_version_set != 'NOT-LOADED') {
        // parse set into list of versions then replace our built-in set
        const newVersions: string[] = reporter_version_set.split(',');
        this.latestDaemonVersions = newVersions;
      }
    }

    const rpi_fqdn: string = this._getAttributeValueForKey(Constants.RPI_FQDN_KEY);
    const ux_release: string = this._showOsAge == true ? this._getAttributeValueForKey(Constants.RPI_NIX_RELEASE_KEY) : '';

    const daemon_update_status: string = this._showDaemonUpdNeed ? this._computeDaemonUpdMessage(this.currentDaemonVersion) : '';
    let cardUpdateString: string = '';
    if (this._showCardAge) {
      if (this._cardMinutesSinceUpdate == 0) {
        cardUpdateString = 'just now';
      } else {
        const suffix = this._cardMinutesSinceUpdate == 1 ? '' : 's';
        cardUpdateString = this._cardMinutesSinceUpdate + ' min' + suffix + ' ago';
      }
    }
    const card_timestamp: string = this._showCardAge == true ? cardUpdateString : '';
    //const card_timestamp: string = '{bad value}';

    let cardName: string = 'RPi monitor ' + rpi_fqdn;
    cardName = this._config.name_prefix != undefined ? this._config.name_prefix + ' ' + rpi_fqdn : cardName;
    cardName = this._config.name != undefined ? this._config.name : cardName;

    if (this._showCardName == false) {
      cardName = '';
    }

    const last_heard_full_class = this._showCardName == false ? 'last-heard-full-notitle' : 'last-heard-full';
    const last_heard_class = this._showCardName == false ? 'last-heard-notitle' : 'last-heard';

    const os_name_full_class = this._showCardName == false ? 'os-name-full-notitle' : 'os-name-full';
    const os_name_class = this._showCardName == false ? 'os-name-notitle' : 'os-name';

    const daemon_update_full_class = (this._showCardName == false ? 'daemon-update-full-notitle' : 'daemon-update-full') + ' center';
    const daemon_update_class = (this._showCardName == false ? 'daemon-update-notitle' : 'daemon-update') + ' center';

    if (this._showFullCard) {
      // our FULL card
      const fullRows = this._generateFullsizeCardRows();
      if (fullRows.length == 0 || !fullRows) {
        console.log('ERROR: failed to generate full rows!');
        return;
      }

      cardHtml = html`
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
            <div id=${Constants.kCSSClassIdCardAge} class=${last_heard_full_class}>${card_timestamp}</div>
            <div id=${Constants.kCSSClassIdOSName} class=${os_name_full_class}>${ux_release}</div>
            <div id=${Constants.kCSSClassIdDaemonUpd} class=${daemon_update_full_class}>${daemon_update_status}</div>
          </div>
        </ha-card>
      `;
    } else {
      // our GLANCE card
      const glanceRows = this._generateGlanceCardRows();
      if (glanceRows.length == 0 || !glanceRows) {
        console.log('ERROR: failed to generate glance rows!');
        return;
      }

      cardHtml = html`
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
          <div class="glance-content">
            ${glanceRows}
            <div id=${Constants.kCSSClassIdCardAge} class=${last_heard_class}>${card_timestamp}</div>
            <div id=${Constants.kCSSClassIdOSName} class=${os_name_class}>${ux_release}</div>
            <div id=${Constants.kCSSClassIdDaemonUpd} class=${daemon_update_class}>${daemon_update_status}</div>
          </div>
        </ha-card>
      `;
    }
    if (this._showDebug) {
      console.log('/ ---- render() ' + this._hostname + ' ---- :');
      console.log(cardHtml);
    }
    //console.log('\\---- render(' + this._hostname + ') - EXIT');
    return cardHtml;
  }

  protected updated(changedProps: PropertyValues): void {
    // Called whenever the component’s update finishes and the element's DOM has been updated and rendered.
    // NOTE: Implement updated() to perform tasks that use element DOM after an update. For example,
    //  code that performs animation may need to measure the element DOM.
    // https://lit.dev/docs/components/lifecycle/#updated
    // Here we need to refresh the values after card has been initially rendered
    //console.log('/---- updated(' + this._hostname + ') - ENTRY');
    if (this._showDebug) {
      console.log('- updated(' + this._hostname + ')');
    }

    // list our keys
    this._debugShowProps(changedProps, 'Updated()');

    if (this._config) {
      // update cards' theme if changed
      if (this.hass) {
        const oldHass = changedProps.get('hass') as HomeAssistant;
        if (!oldHass || (oldHass && oldHass.themes !== this.hass.themes)) {
          applyThemesOnElement(this, this.hass.themes, this._config.theme);
        }
      }

      this._ensureStateInfoAvail();
      if (!this._stateInfoAvailable) {
        // if we lost our state information, then stop our card timer...
        this._stopCardRefreshTimer();
      }

      //console.log('- changed Props: [' + changedProps + ']');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const root: any = this.shadowRoot;

      if (this._stateInfoAvailable) {
        if (changedProps.get('_cardMinutesSinceUpdate') != undefined) {
          // now apply card age color if our entry is OLD
          const intervalColor = this.colorHelpers.calculateReporterAgeColor(this._cardMinutesSinceUpdate);
          if (intervalColor != '') {
            const labelElement = root.getElementById(Constants.kCSSClassIdCardAge);
            if (labelElement) {
              labelElement.style.setProperty('color', intervalColor);
            }
          }
        }
        if (changedProps.has('hass')) {
          // update common label(s)
          const ux_release: string = this._getAttributeValueForKey(Constants.RPI_NIX_RELEASE_KEY);
          const rlsNameColor = this.colorHelpers.calculateOsReleaseColor(ux_release, this._config.os_age);
          if (rlsNameColor != '') {
            const labelElement = root.getElementById(Constants.kCSSClassIdOSName);
            if (labelElement) {
              labelElement.style.setProperty('color', rlsNameColor);
            }
          }

          // apply color if RPi daemon should be updated
          const daemonUpdColor = this.colorHelpers.calculateDaemonUpdateVersionColor(this.currentDaemonVersion, this.latestDaemonVersions);
          if (daemonUpdColor != '') {
            const labelElement = root.getElementById(Constants.kCSSClassIdDaemonUpd);
            if (labelElement) {
              labelElement.style.setProperty('color', daemonUpdColor);
            }
          }

          if (this._showFullCard) {
            // update our FULL card
            for (const currName in this._cardFullCssIDs) {
              const currLabelID = this._cardFullCssIDs[currName];
              const currAttrKey = this._cardFullElements[currName];
              const rawValue = this._getAttributeValueForKey(currAttrKey);
              const latestValue = this._getFullCardValueForAttributeKey(currAttrKey);
              //          if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
              //            console.log('- FULL memory latestValue=[' + latestValue + ']');
              //          }
              const labelElement = root.getElementById(currLabelID);
              labelElement.textContent = latestValue;
              const currIconCssID = this._cardFullIconCssIDs[currName];
              const iconElement = root.getElementById(currIconCssID);
              if (labelElement && iconElement) {
                if (currAttrKey == Constants.RPI_FS_USED_PERCENT_KEY) {
                  const color = this.colorHelpers.calculateFileSystemUsageColor(rawValue, this._config.fs_severity);
                  if (color != '') {
                    labelElement.style.setProperty('color', color);
                    iconElement.style.setProperty('color', color);
                  }
                }
                if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
                  const color = this.colorHelpers.calculateMemoryUsageColor(latestValue.replace(' %', ''), this._config.memory_severity);
                  if (color != '') {
                    labelElement.style.setProperty('color', color);
                    iconElement.style.setProperty('color', color);
                  }
                }
                if (currAttrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
                  const color = this.colorHelpers.calculateTemperatureColor(rawValue, this._config.temp_severity);
                  if (color != '') {
                    labelElement.style.setProperty('color', color);
                    iconElement.style.setProperty('color', color);
                  }
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
              //          if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
              //            console.log('- GLNC memory latestValue=[' + latestValue + ']');
              //          }
              const labelElement = root.getElementById(currLabelID);
              labelElement.textContent = latestValue;
              const currIconCssID = this._cardGlanceIconCssIDs[currName];
              const iconElement = root.getElementById(currIconCssID);
              if (labelElement && iconElement) {
                if (currAttrKey == Constants.RPI_FS_USED_PERCENT_KEY) {
                  const color = this.colorHelpers.calculateFileSystemUsageColor(rawValue, this._config.fs_severity);
                  if (color != '') {
                    labelElement.style.setProperty('color', color);
                    iconElement.style.setProperty('color', color);
                  }
                }
                if (currAttrKey == Constants.RPI_MEMORY_USED_PERCENT_KEY) {
                  const color = this.colorHelpers.calculateMemoryUsageColor(latestValue, this._config.memory_severity);
                  if (color != '') {
                    labelElement.style.setProperty('color', color);
                    iconElement.style.setProperty('color', color);
                  }
                }
                if (currAttrKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
                  // don't place temp scale (C or F) when 'n/a'
                  if (latestValue != 'n/a') {
                    const color = this.colorHelpers.calculateTemperatureColor(rawValue, this._config.temp_severity);
                    if (color != '') {
                      labelElement.style.setProperty('color', color);
                      iconElement.style.setProperty('color', color);
                    }
                    const scaleLabelElement = root.getElementById(Constants.kCSSClassIdTempScale);
                    if (scaleLabelElement) {
                      scaleLabelElement.textContent = this._getTemperatureScale();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    //console.log('\\---- updated(' + this._hostname + ') - EXIT');
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
    // set timer to refresh every 15 seconds
    this._updateTimerID = setInterval(() => this._handleCardUpdateTimerExpiration(), 15 * 1000);
    if (this._showDebug) {
      console.log('TIMER: (' + this._hostname + ') started');
    }
  }

  private _stopCardRefreshTimer(): void {
    if (this._updateTimerID != undefined) {
      clearInterval(this._updateTimerID);
      this._updateTimerID = undefined;
      if (this._showDebug) {
        console.log('TIMER: (' + this._hostname + ') STOPPED');
      }
    }
  }

  private _handleCardUpdateTimerExpiration(): void {
    //
    //  timestamp portion of card
    //
    //console.log('TIMER: (' + this._hostname + ') timeout ENTRY');
    const sinceMinutes = this._calculateRelativeMinutesSinceUpdate();
    // set properties which should cause our card update
    if (this._cardMinutesSinceUpdate != sinceMinutes) {
      this._cardMinutesSinceUpdate = sinceMinutes;
    }
    //console.log('TIMER: (' + this._hostname + ') timeout EXIT');
  }

  private _debugShowProps(changedProps: PropertyValues, message: string): void {
    if (this._showDebug) {
      console.log('/ ---- ' + message + ' ' + this._hostname + ' ---- :');
      console.log(changedProps);
    }
  }

  private _ensureStateInfoAvail() {
    // keep our global status up-to-date
    if (this._configEntityId && this.hass) {
      const backingState = this._configEntityId ? this.hass.states[this._configEntityId] : undefined;
      if (backingState) {
        // um, yeah, we have to go one step further so empty card with bad values doesn't display
        if (backingState.state == 'unavailable') {
          this._stateInfoAvailable = false; // well, not quite yet
        } else {
          this._stateInfoAvailable = true; // yep!!
        }
      } else {
        this._stateInfoAvailable = false; // well, not quite yet
      }
    }
  }

  private _ensureWeHaveHostName() {
    // as soon as we get our real hostname post it globally
    if (this._hostname.length == 0 || this._hostname == this._configEntityId) {
      const tempHostname: string = this._getAttributeValueForKey(Constants.RPI_HOST_NAME_KEY);
      if (tempHostname && tempHostname.length > 0) {
        this._hostname = tempHostname;
      } else {
        this._hostname = this._configEntityId ? this._configEntityId : '-not-set-';
      }
    }
  }

  private _computeDaemonUpdMessage(currentReporterVersion: string): string {
    let updateStatusMessage: string = '';
    if (this._showDebug) {
      console.log('- RNDR currentDaemonVersion=[' + currentReporterVersion + ']');
      console.log('- RNDR latestDaemonVersions=[' + this.latestDaemonVersions + ']');
    }
    if (this.latestDaemonVersions.length > 0 && currentReporterVersion != '') {
      if (currentReporterVersion < this.latestDaemonVersions[0]) {
        // test code
        /*
        if (currentReporterVersion > this.latestDaemonVersions[0]) {
          console.log(currentReporterVersion + ' is > than ' + this.latestDaemonVersions[0]);
        } else {
          console.log(currentReporterVersion + ' is < than ' + this.latestDaemonVersions[0]);
        }
        */
        // test code
        // reporter version is not latest
        updateStatusMessage = currentReporterVersion + ' ---> ' + this.latestDaemonVersions[0];
      }
    } else {
      if (this.currentDaemonVersion != '') {
        updateStatusMessage = '{no info avail.}';
      } else {
        updateStatusMessage = 'v?.?.? {no info avail.}';
      }
    }
    return updateStatusMessage;
  }

  private _calculateRelativeMinutesSinceUpdate(): number {
    let desiredMinutes: number = 0;
    const backingState = this._configEntityId ? this.hass.states[this._configEntityId] : undefined;
    // publish so we don't check this again
    this._stateInfoAvailable = backingState ? true : false;
    if (backingState) {
      const stateTime: string = backingState.state;
      //console.log('state:' + stateTime + ', chg:' + stateLastChangedTime + ', upd:' + stateLastUpdatedTime);
      const stateDate: Date = new Date(stateTime);
      const stateSeconds = Math.round(stateDate.getTime() / 1000);
      const currSeconds: number = Math.round(new Date().getTime() / 1000);
      //if (this._hostname == 'pip2iotgw') {
      //  console.log('- GRSSU (' + this._hostname + ') stateSec:' + (currSeconds - stateSeconds));
      //}
      desiredMinutes = Math.round((currSeconds - stateSeconds) / 60);
    }
    return desiredMinutes;
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
    let desiredValue: string = '';
    try {
      // FIXME added try/catch during hunt
      if (this.hass && this._config && this._configEntityId) {
        const stateObj = this._configEntityId ? this.hass.states[this._configEntityId] : undefined;

        if (stateObj) {
          if (stateObj.attributes != undefined) {
            if (key in stateObj.attributes) {
              const fetchedValue = stateObj?.attributes[key];
              if (fetchedValue instanceof Array == false) {
                desiredValue = fetchedValue.toString();
              } else {
                desiredValue = fetchedValue;
              }
              //console.log('- LIVE getAttr key=[' + key + '], value=[' + desiredValue + '](' + desiredValue.length + ')');
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    // if key PERCENT USED is not present then...
    if (key == Constants.RPI_FS_USED_PERCENT_KEY && desiredValue.length == 0) {
      // get percent FREE and calculate used
      const freePercentStr: string = this._getAttributeValueForKey(Constants.RPI_FS_FREE_PERCENT_KEY);
      /*
      console.log(
        '   desiredValue=[' + desiredValue + '](' + desiredValue.length + '), freePercentStr=[' + freePercentStr + '](' + freePercentStr.length + ')',
      );
      */
      if (freePercentStr.length > 0) {
        // have free vs used, convert it
        desiredValue = freePercentStr;
        //console.log('   NEW desiredValue=[' + desiredValue + ']');
      }
    }
    //console.log('- getAttr key=[' + key + '], value=[' + desiredValue + '](' + desiredValue.length + ')');
    return desiredValue;
  }

  private _getRawAttributeValueForKey(key: string) {
    // HELPER UTILITY: get requested named value from config
    let desiredValue = '';
    try {
      // FIXME added try/catch during hunt
      if (this.hass && this._config && this._configEntityId) {
        const stateObj = this._configEntityId ? this.hass.states[this._configEntityId] : undefined;

        if (stateObj) {
          if (stateObj.attributes != undefined) {
            if (key in stateObj.attributes) {
              desiredValue = stateObj?.attributes[key];
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

    //console.log('- getRawAttr key=[' + key + '], value=[' + desiredValue + '](' + desiredValue.length + ')');
    return desiredValue;
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
        currIconName = this.colorHelpers.getIconNameForPercent(latestRawValue);
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
            <div class="text-content uom">${currName}</div>
            <div id="${currLabelCssID}" class="info pointer text-content right attr-value">${interpValue}</div>
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
        currIconName = this.colorHelpers.getIconNameForPercent(interpValue);
      }
      const currLabelCssID = this._cardGlanceCssIDs[currName];
      const currIconCssID = this._cardGlanceIconCssIDs[currName];

      let scaleCssID = 'units';
      if (currAttributeKey == Constants.RPI_TEMPERATURE_IN_C_KEY) {
        scaleCssID = Constants.kCSSClassIdTempScale;
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
    const scaleInterp = this._useTempsInC == true ? 'C' : 'F'; // is our degree symbol killing us?
    //const scaleInterp = this._useTempsInC == true ? 'ºC' : 'ºF';
    //    if (this._showDebug) {
    //      const logMessage = '_getTemperatureScale() scaleInterp=(' + scaleInterp + ')';
    //      console.log(logMessage);
    //    }
    return scaleInterp;
  }

  private _getScaledTemperatureValue(temperature_raw: string): string {
    let interpValue = temperature_raw;
    if (interpValue != 'n/a') {
      if (this._useTempsInC == false) {
        // if not inC convert to F
        interpValue = ((parseFloat(temperature_raw) * 9) / 5 + 32.0).toFixed(1);
      }
    }
    //    if (this._showDebug) {
    //      const logMessage = '_getScaledTemperatureValue(' + temperature_raw + ') scaleInterp=(' + interpValue + ')';
    //      console.log(logMessage);
    //    }
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
    let interpValue: string = this._getAttributeValueForKey(Constants.RPI_MEM_USED_PRCNT);
    if (interpValue.length == 0) {
      const altValue = this._getRawAttributeValueForKey(Constants.RPI_MEMORY);
      //console.log(altValue);
      const tmpSize = altValue[Constants.RPI_MEM_SIZE_MB];
      const tmpFree = altValue[Constants.RPI_MEM_FREE_MB];
      //console.log(' tmpSize=[' + tmpSize + ']');
      //console.log(' tmpFree=[' + tmpFree + ']');
      const sizeMB: number = Number(tmpSize);
      const usedMB: number = tmpSize - Number(tmpFree);
      const percentUsed = (usedMB / sizeMB) * 100;
      interpValue = percentUsed.toFixed(0).toString();
    }
    return interpValue;
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
      .glance-content {
        display: flex;
        justify-content: space-between;
        padding: 16px 32px 24px 32px;
      }
      .glance-content {
        text-align: center;
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
        right: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard {
        position: absolute;
        top: 55px;
        right: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard-full-notitle {
        position: absolute;
        top: 3px;
        right: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .last-heard-notitle {
        position: absolute;
        bottom: 5px;
        right: 15%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-full {
        position: absolute;
        top: 45px;
        left: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name {
        position: absolute;
        top: 55px;
        left: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-full-notitle {
        position: absolute;
        top: 3px;
        left: 5%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .os-name-notitle {
        position: absolute;
        bottom: 5px;
        left: 15%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update-full {
        position: absolute;
        top: 45px;
        right: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update {
        position: absolute;
        top: 55px;
        right: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update-full-notitle {
        position: absolute;
        top: 3px;
        right: 27%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
      .daemon-update-notitle {
        position: absolute;
        bottom: 5px;
        right: 37%;
        font-size: 12px;
        color: var(--primary-text-color);
      }
    `;
  }
}
