export const CARD_VERSION = '1.2.7';

/*
*  EXAMPLE attributes  ISP-RPi-mqtt-daemon.py v1.5.4
{
  "info": {
    "timestamp": "2021-05-18T18:17:52-06:00",
    "rpi_model": "RPi 2 Model B r1.1",
    "ifaces": "e",
    "host_name": "pinode1",
    "fqdn": "pinode1.home",
    "ux_release": "jessie",
    "ux_version": "4.9.35-v7+",
    "up_time": " 4:55",
    "last_update": "2021-05-18T14:39:58-06:00",
    "fs_total_gb": 32,
    "fs_free_prcnt": 19,
    "networking": {
      "eth0": {
        "mac": "b8:27:eb:b0:9c:3b",
        "IP": "192.168.100.42"
      }
    },
    "drives": {
      "root": {
        "size_gb": 32,
        "used_prcnt": 19,
        "device": "/dev/root",
        "mount_pt": "/"
      }
    },
    "memory": {
      "size_mb": "923.355",
      "free_mb": "795.066"
    },
    "cpu": {
      "hardware": "BCM2835",
      "model": "ARMv7 Processor rev 5 (v7l)",
      "number_cores": 4,
      "bogo_mips": "230.40",
      "serial": "00000000bab09c3b"
    },
    "throttle": [
      "throttled = 0x0",
      "Not throttled"
    ],
    "temperature_c": 40.1,
    "temp_gpu_c": 40.1,
    "temp_cpu_c": 40.1,
    "reporter": "ISP-RPi-mqtt-daemon v1.5.4",
    "report_interval": 5
  }
}*/

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
export const RPI_SCRIPT_INTERVAL_KEY = 'report_interval';

export const SHOW_OS_PARTS_VALUE = 'show-os-parts';

export const RPI_IP_NTWK_KEY = 'IP';
export const RPI_MAC_NTWK_KEY = 'mac';

export const RPI_MEMORY_USED_PERCENT_KEY = 'memory_percent';
