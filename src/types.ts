import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'rpi-monitor-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// Configuration elements for type-checking

/*
| type          | string       | **Required**       | `custom:rpi-monitor-card`                                             |
| entity        | string       | **Required**       | Entity State                                                          |
| name          | string       | none               | Overrides default title of the card.                                  |
| card_style    | string       | 'glance' or 'full' | Card layout desired for this RPi. (Default is Full)                   |
| temp_scale    | string       | 'C' or 'F'         | Show Temperature in Celsius (C) or Fahrenheit (F). (Default is C)     |
| fs_severity   | ColorRange[] | none               | A list of severity values. See [Severity Options](#severity-options). |
| temp_severity | ColorRange[] | none               | A list of severity values. See [Severity Options](#severity-options). |
| memory_severity | ColorRange[] | none             | A list of severity values. See [Severity Options](#severity-options). |
| os_age        | OsColor[]    | none               | A list of os release names with color values.                         |
*/

export interface ColorRange {
  color: string;
  from: number;
  to: number;
}

export interface OsColor {
  color: string;
  os: string;
}

export interface RPiMonitorCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  card_style?: string;
  fs_severity?: ColorRange[];
  temp_severity?: ColorRange[];
  temp_scale?: string;
  memory_severity?: ColorRange[];
  os_age?: OsColor[];
  name_prefix?: string;
  show_title?: boolean;
  // following are on by default:  set to false to disable
  show_os_age?: boolean;
  show_update_age?: boolean;

  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
  show_debug?: boolean;

  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
