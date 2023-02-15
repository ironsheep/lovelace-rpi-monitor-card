export const CARD_VERSION = '1.3.3';

/*
*  EXAMPLE attributes  ISP-RPi-mqtt-daemon.py v1.7.2
{
  "info": {
    "timestamp": "2023-02-11T22:36:15-07:00",
    "rpi_model": "RPi 4 Model B r1.5",
    "ifaces": "e,w,b",
    "host_name": "pip2iotgw",
    "fqdn": "pip2iotgw.home",
    "ux_release": "bullseye",
    "ux_version": "5.15.84-v8+",
    "up_time": " 9:41",
    "last_update": "2023-02-11T01:18:02-07:00",
    "fs_total_gb": 32,
    "fs_free_prcnt": 18,
    "networking": {
      "eth0": {
        "mac": "e4:5f:01:f8:18:01"
      },
      "wlan0": {
        "IP": "192.168.100.196",
        "mac": "e4:5f:01:f8:18:02"
      }
    },
    "drives": {
      "root": {
        "size_gb": 32,
        "used_prcnt": 18,
        "device": "/dev/root",
        "mount_pt": "/"
      }
    },
    "memory": {
      "size_mb": "1849.246",
      "free_mb": "1508.148"
    },
    "cpu": {
      "hardware": "BCM2835",
      "model": "",
      "number_cores": 4,
      "bogo_mips": "432.00",
      "serial": "1000000081ae88c7",
      "load_1min_prcnt": 0.2,
      "load_5min_prcnt": 0.5,
      "load_15min_prcnt": 0
    },
    "throttle": [
      "throttled = 0x0",
      "Not throttled"
    ],
    "temperature_c": 27.2,
    "temp_gpu_c": 27.2,
    "temp_cpu_c": 26.3,
    "reporter": "ISP-RPi-mqtt-daemon v1.7.2",
    "reporter_releases": "v1.7.2,v1.6.2",
    "report_interval": 5
  }
}
*/

// attribute ICON IDs
export const kClassIconFSAvail = 'ico-fs-percent';
export const kClassIconFSTotal = 'ico-fs-total';
export const kClassIconSysTemp = 'ico-sys-temp';
export const kClassIconUptime = 'ico-up-time';
export const kClassIconUpdated = 'ico-last-update';
export const kClassIconOS = 'ico-*nix';
export const kClassIconRPiModel = 'ico-rpi-model';
export const kClassIconInterfaces = 'ico-rpi-ifaces';
export const kClassIconMemoryUsage = 'ico-memory-percent';
// attribute value label IDs
export const kClassIdFSAvail = 'fs-percent';
export const kClassIdFSTotal = 'fs-total';
export const kClassIdSysTemp = 'sys-temp';
export const kClassIdUptime = 'up-time';
export const kClassIdUpdated = 'last-update';
export const kClassIdOS = '*nix';
export const kClassIdRPiModel = 'rpi-model';
export const kClassIdInterfaces = 'rpi-ifaces';
export const kClassIdMemoryUsage = 'memory-percent';
// ond one special for unit
export const kClassIdTempScale = 'sys-temp-scale';

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
export const RPI_SCRIPT_RELEASE_LIST = 'reporter_releases';
export const RPI_SCRIPT_INTERVAL_KEY = 'report_interval';

export const SHOW_OS_PARTS_VALUE = 'show-os-parts';

export const RPI_IP_NTWK_KEY = 'IP';
export const RPI_MAC_NTWK_KEY = 'mac';

export const RPI_MEMORY_USED_PERCENT_KEY = 'memory_percent';
