import { ColorRange, OsColor } from './types';

export class ColorUtils {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private _showColorDebug: boolean = false; // REMOVE BEFORE FLIGHT (!set to false before check-in!)

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
      color: 'default',
      from: 0,
      to: 59,
    },
    {
      color: 'orange',
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
      color: 'default',
      from: 0,
      to: 59,
    },
    {
      color: 'orange',
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
      color: 'default',
      from: 0,
      to: 3,
    },
    {
      color: 'orange',
      from: 4,
      to: 5,
    },
    {
      color: 'red',
      from: 6,
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
      color: 'orange',
      from: 61,
      to: 74,
    },
    {
      color: 'default',
      from: 0,
      to: 60,
    },
  ];

  // DEFAULT coloring for used count of OS updates
  //  user sets 'os_update_severity' to override
  private _colorOsUpdateCountDefault = [
    {
      color: 'red',
      from: 100,
      to: 10000,
    },
    {
      color: 'orange',
      from: 25,
      to: 99,
    },
    {
      color: 'default',
      from: 0,
      to: 24,
    },
  ];
  /*  TEST  REMOVE BEFORE FLIGHT
  private _colorOsUpdateCountDefault = [
    {
      color: 'red',
      from: 22,
      to: 10000,
    },
    {
      color: 'orange',
      from: 15,
      to: 21,
    },
    {
      color: 'default',
      from: 0,
      to: 14,
    },
  ];
  */

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

  public getIconNameForPercent(percent: string): string {
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

  public calculateReporterAgeColor(numberValue: number): string {
    const sections = this._colorReportPeriodsAgoDefault;

    //console.log('color-table: sections=[' + sections + ']');
    //return '';

    let color: undefined | string = undefined;

    sections.forEach((section) => {
      if (numberValue >= section.from && numberValue <= section.to) {
        color = section.color;
      }
    });

    if (color == undefined || color == 'default') color = '';
    if (this._showColorDebug) {
      console.log('- ReporterAge() value=(' + numberValue + ') -> color [' + color + ']');
    }
    return color;
  }

  public calculateTemperatureColor(value: string, temp_severity: ColorRange[] | undefined): string {
    const numberValue = Number(value);
    const sections = temp_severity ? temp_severity : this._colorTemperatureDefault;

    //console.log('color-table: sections=[' + sections + ']');
    //return '';

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          if (this._showColorDebug) {
            const logMessage =
              '_calculateTemperatureColor() - value=[' + value + '] matched(from=' + section.from + ', to=' + section.to + ', color=' + color + ')';
            console.log(logMessage);
          }
        }
      });
    }
    if (this._showColorDebug) {
      const logMessage = '_calculateTemperatureColor() - value=[' + value + '] returns(color=' + color + ')';
      console.log(logMessage);
    }
    if (color == undefined || color == 'default') color = '';
    return color;
  }

  public calculateFileSystemUsageColor(value: string, fs_severity: ColorRange[] | undefined): string {
    const numberValue = Number(value);
    const sections = fs_severity ? fs_severity : this._colorUsedSpaceDefault;

    //console.log('color-table: sections=[' + _colorUsedSpaceDefault + ']');
    //return '';

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          if (this._showColorDebug) {
            const logMessage =
              '_calculateFileSystemUsageColor() - value=[' + value + '] matched(from=' + section.from + ', to=' + section.to + ', color=' + color + ')';
            console.log(logMessage);
          }
        }
      });
    }
    if (this._showColorDebug) {
      const logMessage = '_calculateFileSystemUsageColor() - value=[' + value + '] returns(color=' + color + ')';
      console.log(logMessage);
    }

    if (color == undefined || color == 'default') color = '';
    return color;
  }

  public calculateMemoryUsageColor(value: string, memory_severity: ColorRange[] | undefined): string {
    const numberValue = Number(value);
    const sections = memory_severity ? memory_severity : this._colorUsedMemoryDefault;

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          if (this._showColorDebug) {
            const logMessage =
              '_calculateMemoryUsageColor() - value=[' + value + '] matched(from=' + section.from + ', to=' + section.to + ', color=' + color + ')';
            console.log(logMessage);
          }
        }
      });
    }
    if (this._showColorDebug) {
      const logMessage = '_calculateMemoryUsageColor() - value=[' + value + '] returns(color=' + color + ')';
      console.log(logMessage);
    }

    if (color == undefined || color == 'default') color = '';
    return color;
  }

  public calculateOsUpdateCountColor(value: string, os_update_severity: ColorRange[] | undefined): string {
    const numberValue = Number(value);
    const sections = os_update_severity ? os_update_severity : this._colorOsUpdateCountDefault;

    let color: undefined | string;

    if (!isNaN(numberValue)) {
      sections.forEach((section) => {
        if (numberValue >= section.from && numberValue <= section.to) {
          color = section.color;
          if (this._showColorDebug) {
            const logMessage =
              'calculateOsUpdateCountColor() - value=[' + value + '] matched(from=' + section.from + ', to=' + section.to + ', color=' + color + ')';
            console.log(logMessage);
          }
        }
      });
    }
    if (this._showColorDebug) {
      const logMessage = 'calculateOsUpdateCountColor() - value=[' + value + '] returns(color=' + color + ')';
      console.log(logMessage);
    }

    if (color == undefined || color == 'default') color = '';
    return color;
  }

  public calculateOsReleaseColor(osName: string, os_age: OsColor[] | undefined): string {
    const sections = os_age ? os_age : this._colorReleaseDefault;

    //console.log('color-table: sections=[' + sections + ']');
    //return '';

    let color: undefined | string = 'default';

    sections.forEach((section) => {
      if (osName === section.os) {
        color = section.color;
        if (this._showColorDebug) {
          console.log('calculateOsReleaseColor() - value=[' + osName + '] matched(os=' + section.os + ', color=' + color + ')');
        }
      }
    });
    if (this._showColorDebug) {
      console.log('calculateOsReleaseColor() - value=[' + osName + '] returns(color=' + color + ')');
    }
    if (color == undefined || color == 'default') color = '';
    return color;
  }

  public calculateDaemonUpdateVersionColor(currentReporterVersion: string, latestDaemonVersions: string[]): string {
    //console.log('color-table: sections=[' + sections + ']');
    //return '';

    let color: undefined | string = undefined;

    if (latestDaemonVersions.length > 0 && currentReporterVersion != '') {
      if (latestDaemonVersions[0] == currentReporterVersion) {
        // daemon is at latest
        color = 'default';
      } else if (latestDaemonVersions.includes(currentReporterVersion)) {
        // daemon is recent
        color = 'orange';
      } else {
        // daemon is old (not even in latest or stable)
        color = 'red';
      }
    } else {
      // daemon values are missing???
      color = 'orange';
    }
    if (this._showColorDebug) {
      const logMessage = 'calculateDaemonUpdateVersionColor() - value=[' + currentReporterVersion + '] returns(color=' + color + ')';
      console.log(logMessage);
    }

    if (color == undefined || color == 'default') color = '';
    return color;
  }
}
