export const CARD_VERSION = '0.2.0';

/*
{
  "info": {
    "timestamp": "2020-07-19T13:17:54-06:00",
    "rpi_model": "RPi 3 Model B r1.2",
    "ifaces": "e,w,b",
    "host_name": "pi3plus",
    "fqdn": "pi3plus.home",
    "ux_release": "stretch",
    "ux_version": "4.19.66-v7+",
    "up_time": "13:17:54 up 14 days",
    "last_update": "2020-07-18T00:51:36-06:00",
    "fs_total_gb": 64,
    "fs_free_prcnt": 10,
    "networking": {
      "eth0": {
        "mac": "b8:27:eb:1a:f3:bc"
      },
      "wlan0": {
        "IP": "192.168.100.189",
        "mac": "b8:27:eb:4f:a6:e9"
      }
    },
    "temperature_c": 55.3,
    "reporter": "ISP-RPi-mqtt-daemon v0.8.5"
  }
}
*/

export const RPI_TOP_KEY = 'info';

export const RPI_TIMESTAMP_KEY = 'timestamp';
export const RPI_MODEL_KEY = 'rpi_model';
export const RPI_INTERFACES_KEY = 'ifaces';
export const RPI_HOST_NAME_KEY = 'host_name';
export const RPI_FQDN_KEY = 'fqdn';
export const RPI_NIX_RELEASE_KEY = 'ux_release';
export const RPI_NIX_VERSION_KEY = 'ux_version';
export const RPI_LAST_UPDATE_KEY = 'last_update';
export const RPI_UP_TIME_KEY = 'up_time';
export const RPI_FS_TOTAL_GB_KEY = 'fs_total_gb';
export const RPI_FS_USED_PERCENT_KEY = 'fs_free_prcnt';
export const RPI_NETWORKING_KEY = 'networking';
export const RPI_TEMPERATURE_IN_C_KEY = 'temperature_c';
export const RPI_SCRIPT_VER_KEY = 'reporter';

export const SHOW_OS_PARTS_VALUE = 'show-os-parts';

export const RPI_IP_NTWK_KEY = 'IP';
export const RPI_MAC_NTWK_KEY = 'mac';
