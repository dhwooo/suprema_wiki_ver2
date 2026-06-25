---
permalink: /api/zone/apb
title: "Anti Passback Zone API"
toc_label: "Anti Passback Zone"  
---

안티 패스백 존(Anti passback zone)은 사용자가 자신의 인증 수단을 다른 사람에게 전달하여 출입하는 것을 방지하기 위해 사용됩니다. 안티 패스백 존은 여러 멤버로 구성되며, 각 멤버는 __ENTRY__ 또는 __EXIT__ 유형 중 하나입니다. __ENTRY__ 장치를 통해 존에 입장한 경우, 다시 입장하기 전에 먼저 __EXIT__ 장치를 통해 퇴장해야 합니다.

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
: __HARD__이고 안티 패스백 규칙이 위반된 경우, 위반 로그 기록과 함께 출입이 거부됩니다. __SOFT__인 경우, 장치는 위반 로그 기록을 남기지만 사용자의 출입을 허용합니다.

disabled
: true인 경우, 안티 패스백 규칙이 적용되지 않습니다.

alarmed
: 존에서 알람이 감지되었는지 여부를 나타냅니다.

resetDuration
: 안티 패스백 상태가 재설정되기까지의 시간(초)입니다. 예를 들어 3600으로 설정하면, 동일한 장치에서 1시간 후에 인증 수단을 다시 사용할 수 있습니다. 0인 경우 안티 패스백 상태가 해제되지 않음을 의미합니다.

[Clear](#clear) 또는 [ClearAll](#clearall)를 사용하여 사용자의 안티 패스백 상태를 수동으로 해제할 수도 있습니다.
{: .notice--info}

[members](#Member)
: 안티 패스백 존은 서로 다른 [ReaderType](#ReaderType)을 가진 최소 두 개의 멤버를 가져야 합니다.

[actions]({{'/api/action/' | relative_url}}#Action)
: 사용자가 안티 패스백 규칙을 위반했을 때 트리거되는 액션을 최대 5개까지 구성할 수 있습니다.

bypassGroupIDs
: 안티 패스백 규칙의 영향을 받지 않는 [출입 그룹]({{'/api/access/' | relative_url}}#AccessGroup)의 ID입니다. 최대 그룹 수는 16개입니다.

```protobuf
enum Type {
  HARD = 0x00;
  SOFT = 0x01;
}
```
{: #Type }
HARD
: 위반 시, 위반 로그 기록과 함께 출입이 거부됩니다.

SOFT
: 위반하더라도 출입이 허용됩니다. 다만 위반 로그 기록은 남습니다.

```protobuf
message Member {
  uint32 deviceID;
  ReaderType readerType;
}
```
{: #Member }

deviceID
: 장치의 ID입니다.

[readerType](#ReaderType)
: 장치의 유형입니다.

```protobuf
enum ReaderType {
  ENTRY = 0x00;
  EXIT = 0x01;
}
```
{: #ReaderType }
ENTRY
: 존에 입장하기 위해 사용되는 장치입니다.

EXIT
: 존에서 퇴장하기 위해 사용되는 장치입니다.

### Get

장치에 구성된 안티 패스백 존을 가져옵니다.

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

[ZoneInfo.resetDuration](#ZoneInfo) 이전에 지정된 사용자의 안티 패스백 상태를 재설정하여 출입을 허용할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneID | uint32 | 존의 ID |
| userIDs | string[] | 상태를 해제할 사용자의 ID |

### ClearAll

모든 사용자의 안티 패스백 상태를 재설정합니다.

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
| alarmed | bool | true인 경우 알람을 설정하고, false인 경우 알람을 해제합니다 |
