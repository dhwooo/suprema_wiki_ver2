---
permalink: /api/zone/intrusion
title: "Intrusion Alarm Zone API"
toc_label: "Intrusion Alarm Zone"  
---

침입 경보 존(intrusion alarm zone)은 허가 없이 무단으로 경계 구역에 침입하는 사용자를 탐지하는 데 사용됩니다. 여러 개의 도어, 존을 경계 설정/해제하는 장치, 그리고 침입을 탐지하는 입력 포인트로 구성됩니다.

## Information

```protobuf
message ZoneInfo {
  uint32 zoneID;
  string name;

  bool disabled;
  uint32 armDelay;
  uint32 alarmDelay;

  repeated uint32 doorIDs;
  repeated uint32 groupIDs;

  repeated card.CSNCardData cards;
  repeated Member members;
  repeated Input inputs;
  repeated Output outputs;
}
```
{: #ZoneInfo }
zoneID
: 존의 ID입니다.

name
: UTF-8 인코딩으로 최대 48자입니다.

disabled
: 존의 비활성화 여부를 나타냅니다.

armDelay
: 마지막 사용자가 존에서 나간 후 존을 경계 설정하기까지의 지연 시간(초)입니다.

alarmDelay
: 침입을 탐지했을 때 경보를 설정하기까지의 지연 시간(초)입니다.

doorIDs
: 침입 경보 존의 주요 구성 요소인 도어의 ID입니다.

groupIDs
: 액세스 그룹의 ID입니다. 이 그룹의 멤버만 존을 경계 설정하거나 해제할 수 있습니다.

cards
: 존을 경계 설정하거나 해제하는 데 사용할 수 있는 카드를 최대 128개까지 등록할 수 있습니다.

[members](#Member)
: 존을 경계 설정하거나 해제하는 데 사용할 수 있는 장치를 최대 128개까지 지정할 수 있습니다. 예를 들어, __Member.input__ 이 INPUT_CARD 이고 __Member.operation__ 이 OPERATION_ARM 이면, 장치에서 __ZoneInfo.cards__ 에 있는 카드를 인식시켜 존을 경계 설정할 수 있습니다.

[inputs](#Input)
: 존을 경계 설정하거나 해제하는 데 사용할 수 있는 입력 포트를 최대 128개까지 지정할 수 있습니다. 예를 들어, __Input.operation__ 이 OPERATION_DISARM 이면, 해당 포트에서 신호가 감지될 때 존의 경계가 해제됩니다. 또한 입력 포트를 사용하여 경보를 탐지하거나 해제할 수도 있습니다. 예를 들어, __Input.operation__ 이 OPERATION_ALARM 이면, 해당 포트에서 신호가 감지될 때 경보가 발생합니다.

[outputs](#Output)
: 지정된 이벤트가 발생할 때 실행될 동작을 최대 128개까지 구성할 수 있습니다.

```protobuf
message Member {
  uint32 deviceID;
  uint32 input;
  uint32 operation;
}
```
{: #Member }

deviceID
: 장치의 ID입니다.

[input](#InputType)
: 장치의 입력 유형입니다.

[operation](#OperationType)
: 장치의 동작 유형입니다.

```protobuf
enum InputType {
  INPUT_NONE = 0x00;
  INPUT_CARD = 0x01;
  INPUT_KEY = 0x02;
  INPUT_ALL = 0xFF;	  
}
```
{: #InputType}
INPUT_CARD
: 존을 경계 설정하거나 해제하려면 __ZoneInfo.cards__ 에 등록된 카드 중 하나를 사용해야 합니다.

INPUT_KEY
: 존을 경계 설정하거나 해제하려면 장치의 지정된 키를 눌러야 합니다. 키패드가 있는 장치에서만 지원됩니다.

INPUT_ALL
: 카드와 키가 모두 허용됩니다.

```protobuf
enum OperationType {
  OPERATION_NONE = 0x00;
  OPERATION_ARM = 0x01;
  OPERATION_DISARM = 0x02;
  OPERATION_TOGGLE = 0x03;
  OPERATION_ALARM = 0x04;
  OPERATION_CLEAR_ALARM = 0x08;  
}
```
{: #OperationType}
OPERATION_ARM
: 장치 또는 입력 포트가 존을 경계 설정하는 데 사용됩니다.

OPERATION_DISARM
: 장치 또는 입력 포트가 존의 경계를 해제하는 데 사용됩니다.

OPERATION_TOGGLE
: 장치 또는 입력 포트가 존을 경계 설정/해제하는 데 사용됩니다. 동작은 매번 토글됩니다.

OPERATION_ALARM
: 입력 포트가 침입을 탐지하는 데 사용됩니다.

OPERATION_CLEAR_ALARM
: 입력 포트가 경보를 해제하는 데 사용됩니다.

```protobuf
message Input {
  uint32 deviceID;
  uint32 port;
  device.SwitchType switchType;
  uint32 duration;
  uint32 operation;
}
```
{: #Input }

deviceID
: 장치의 ID입니다.

port
: 입력 포트의 인덱스입니다.

[switchType]({{'/api/device/' | relative_url}}#SwitchType)
: 입력 포트의 유형입니다.

duration
: 신호가 감지되어야 하는 최소 지속 시간(밀리초)입니다.

[operation](#OperationType)
: 입력 포트의 동작 유형입니다.

```protobuf
message Output {
  uint32 event;
  action.Action;
}
```
{: #Output }

[event]({{'/api/event/' | relative_url}}#EventCode)
: 동작을 트리거할 이벤트 유형입니다. 예를 들어, 경보가 탐지될 때 동작을 실행하려면 BS2_EVENT_ZONE_INTRUSION_ALARM_VIOLATION(0x9000)으로 설정하면 됩니다.

[action]({{'/api/action/' | relative_url}}#Action)
: 위 이벤트가 발생할 때 실행될 동작입니다.


### Get

장치에 구성된 침입 경보 존을 가져옵니다.

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

## Alarm

### SetArm

존을 수동으로 경계 설정하거나 해제할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 존의 ID |
| armed | bool | true이면 존을 경계 설정하고, false이면 존의 경계를 해제합니다 |

### SetAlarm

존의 경보 상태를 설정하거나 해제할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 경보 상태를 설정할 존의 ID |
| alarmed | bool | true이면 경보를 설정하고, false이면 경보를 해제합니다 |