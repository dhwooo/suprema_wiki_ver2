---
permalink: /api/zone/timed
title: "Timed Anti Passback Zone API"
toc_label: "Timed Anti Passback Zone"  
---

시간 기반 안티패스백 존에서는 지정된 시간이 경과한 후에야 동일한 장치에서 자격 증명을 다시 사용할 수 있습니다. 


## Information

```protobuf
message ZoneInfo {
  uint32 zoneID;
  string name;

  Type type;
  bool disabled;
  bool alarmed;
  uint32 resetDuration;

  repeated Member members;
  repeated action.Action actions;
  repeated uint32 bypassGroupIDs;
}
```
{: #ZoneInfo }
zoneID
: 존의 ID입니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

[type](#Type)
: __HARD__ 인 경우 시간 기반 안티패스백 규칙을 위반하면 위반 로그 기록과 함께 출입이 거부됩니다. __SOFT__ 인 경우 장치는 위반 로그 기록을 작성하되 사용자의 출입은 허용합니다. 

disabled
: true 이면 시간 기반 안티패스백 규칙이 적용되지 않습니다. 

alarmed
: 존에서 알람이 감지되었는지 여부를 나타냅니다.

resetDuration
: 동일한 장치에서 자격 증명을 다시 사용할 수 있게 되기까지의 시간(초)입니다. 

[members](#Member)
: 시간 기반 안티패스백 존은 하나 이상의 장치로 구성됩니다. 

[actions]({{'/api/action/' | relative_url}}#Action)
: 사용자가 시간 기반 안티패스백 규칙을 위반할 때 트리거되는 동작을 최대 5개까지 구성할 수 있습니다.

bypassGroupIDs
: 시간 기반 안티패스백 규칙의 영향을 받지 않을 [출입 그룹]({{'/api/access/' | relative_url}}#AccessGroup)의 ID입니다. 최대 그룹 수는 16개입니다.

```protobuf
enum Type {
  HARD = 0x00;
  SOFT = 0x01;
}
```
{: #Type }
HARD
: 위반 시 위반 로그 기록과 함께 출입이 거부됩니다.

SOFT
: 위반하더라도 출입이 허용됩니다. 다만 위반 로그 기록이 작성됩니다.

```protobuf
message Member {
  uint32 deviceID;
}
```
{: #Member }

deviceID
: 장치의 ID입니다.

### Get

장치에 구성된 시간 기반 안티패스백 존을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| zones | [ZoneInfo[]](#ZoneInfo) | 장치에 구성된 존 |


### GetStatus

장치에 구성된 존의 상태를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 존의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [ZoneStatus[]]({{'/api/zone/' | relative_url}}#ZoneStatus) | 장치에 구성된 존의 상태 |  

## Management

### Add

장치에 존을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zones | [ZoneInfo[]](#ZoneInfo) | 장치에 구성할 존 |

### Delete

장치에서 존을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 장치에서 삭제할 존의 ID |


### DeleteAll

장치에 구성된 모든 존을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### Clear

[ZoneInfo.resetDuration](#ZoneInfo) 이전에 지정된 사용자의 상태를 재설정하여 출입을 허용할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneID | uint32 | 존의 ID |
| userIDs | string[] | 상태를 초기화할 사용자의 ID |

### ClearAll

모든 사용자의 상태를 재설정합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneID | uint32 | 존의 ID |

## Alarm

### SetAlarm

존의 알람 상태를 설정하거나 해제할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 알람 상태를 설정할 존의 ID |
| alarmed | bool | true 이면 알람을 설정합니다. false 이면 알람을 해제합니다 |
