import { ActionConfig, LovelaceCardConfig } from 'custom-card-helpers';

// Configuration elements for type-checking

/*
| type          | string | **Required**       | `custom:rpi-monitor-card`                                             |
| entity        | string | **Required**       | Entity State                                                          |
| name          | string | none               | Overrides default title of the card.                                  |
| card_style    | string | 'glance' or 'full' | Card layout desired for this RPi. (Default is Full)                   |
| temp_scale    | string | 'C' or 'F'         | Show Temperature in Celsius (C) or Fahrenheit (F). (Default is C)     |
| fs_severity   | object | none               | A list of severity values. See [Severity Options](#severity-options). |
| temp_severity | object | none               | A list of severity values. See [Severity Options](#severity-options). |
*/
export interface RPiMonitorCardConfig extends LovelaceCardConfig {
  type: string;
  entity?: string;
  name?: string;
  card_style?: string;
  fs_severity?: any;
  temp_severity?: any;
  temp_scale?: string;

  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;

  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}
