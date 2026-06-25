---
permalink: /api/zone/fire
title: "Fire Alarm Zone API"
toc_label: "Fire Alarm Zone"  
---

화재 경보 구역(fire alarm zone)은 비상 상황을 감지하기 위한 여러 개의 문과 센서로 구성됩니다. 화재가 감지되면 모든 문이 자동으로 잠금 해제됩니다.

## Information

```protobuf
message ZoneInfo {
  uint32 zoneID;
  string name;

  bool disabled;
  bool alarmed;

  repeated uint32 doorIDs;
  repeated FireSensor sensors;
  repeated action.Action actions;
}
```
{: #ZoneInfo }
zoneID
: 구역의 ID입니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

disabled
: 구역의 비활성화 여부를 나타냅니다.

alarmed
: 구역에서 경보가 감지되었는지 여부를 나타냅니다.

doorIDs
: 화재가 감지되었을 때 잠금 해제될 문의 ID입니다.

[sensors](#FireSensor)
: 화재를 감지하기 위해 최대 8개의 센서를 구성할 수 있습니다.

[actions]({{'/api/action/' | relative_url}}#Action)
: 화재가 감지되었을 때 트리거될 액션을 최대 5개까지 구성할 수 있습니다.


```protobuf
message FireSensor {
  uint32 deviceID;
  uint32 port;
  device.SwitchType type;
  uint32 duration;
}
```
{: #FireSensor }

deviceID
: 장치의 ID입니다.

port
: 입력 포트의 인덱스입니다.

[switchType]({{'/api/device/' | relative_url}}#SwitchType)
: 센서의 유형입니다.

duration
: 신호가 감지되어야 하는 최소 지속 시간(밀리초 단위)입니다.

### Get

장치에 구성된 화재 경보 구역을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| zones | [ZoneInfo[]](#ZoneInfo) | 장치에 구성된 구역 |


### GetStatus

장치에 구성된 구역의 상태를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 구역의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [ZoneStatus[]]({{'/api/zone/' | relative_url}}#ZoneStatus) | 장치에 구성된 구역의 상태 |  

## Management

### Add

장치에 구역을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zones | [ZoneInfo[]](#ZoneInfo) | 장치에 구성할 구역 |

### Delete

장치에서 구역을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 장치에서 삭제할 구역의 ID |


### DeleteAll

장치에 구성된 모든 구역을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

## Alarm

### SetAlarm

구역의 경보 상태를 설정하거나 해제할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 경보 상태를 설정할 구역의 ID |
| alarmed | bool | true이면 경보를 설정하고, false이면 경보를 해제합니다 |