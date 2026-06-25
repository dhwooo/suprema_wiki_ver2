---
title: "Device Status API"
toc_label: "Device Status"  
---

미리 정의된 [장치 상태](#DeviceStatus)에 대해 LED와 부저에서 어떤 신호를 발생시킬지 구성할 수 있습니다.

## Config

미리 정의된 상태는 15개입니다. 각 상태마다 [LEDStatus](#LEDStatus)와 [BuzzerStatus](#BuzzerStatus)를 구성할 수 있습니다. 

```protobuf
message StatusConfig {
  repeated LEDStatus LEDState;
  repeated BuzzerStatus BuzzerState;
}
```
{: #StatusConfig}
[LEDState](#LEDStatus)
: 상태에 대한 LED 신호입니다.

[BuzzerState](#BuzzerStatus)
: 상태에 대한 부저 신호입니다.

```protobuf
message LEDStatus {
  DeviceStatus deviceStatus;
  uint32 count;
  repeated action.LEDSignal signals;
}
```
{: #LEDStatus}

[deviceStatus](#DeviceStatus)
: LED 신호가 표시될 대상 상태입니다.

count
: 신호의 반복 횟수입니다. 0이면 신호를 무한히 반복합니다.

[signals]({{'/api/action/' | relative_url}}#LEDSignal)
: 최대 3개의 LED 신호를 정의할 수 있습니다.

```protobuf
message BuzzerStatus {
  DeviceStatus deviceStatus;
  uint32 count;
  repeated action.BuzzerSignal signals;
}
```
{: #BuzzerStatus}

[deviceStatus](#DeviceStatus)
: 부저 신호가 발생할 대상 상태입니다.

count
: 신호의 반복 횟수입니다. 0이면 신호를 무한히 반복합니다.

[signals]({{'/api/action/' | relative_url}}#BuzzerSignal)
: 최대 3개의 부저 패턴을 정의할 수 있습니다.

```protobuf
enum DeviceStatus {
  DEVICE_STATUS_NORMAL = 0;
  DEVICE_STATUS_LOCKED = 1;
  DEVICE_STATUS_RTC_ERROR = 2;
  DEVICE_STATUS_WAITING_INPUT = 3;
  DEVICE_STATUS_WAITING_DHCP = 4;
  DEVICE_STATUS_SCAN_FINGER = 5;
  DEVICE_STATUS_SCAN_CARD = 6;
  DEVICE_STATUS_SUCCESS = 7;
  DEVICE_STATUS_FAIL = 8;
  DEVICE_STATUS_DURESS = 9;
  DEVICE_STATUS_PROCESS_CONFIG_CARD = 10;
  DEVICE_STATUS_SUCCESS_CONFIG_CARD = 11;
  DEVICE_STATUS_RESERVED2 = 12;
  DEVICE_STATUS_RESERVED3 = 13;
  DEVICE_STATUS_RESERVED4 = 14;
}
```
{: #DeviceStatus}

### GetConfig

장치의 상태 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [StatusConfig](#StatusConfig) | 장치의 상태 구성 |

### SetConfig

장치의 상태 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [StatusConfig](#StatusConfig) | 장치에 기록할 상태 구성 |


### SetConfigMulti

여러 장치의 상태 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [StatusConfig](#StatusConfig) | 장치들에 기록할 상태 구성 |
