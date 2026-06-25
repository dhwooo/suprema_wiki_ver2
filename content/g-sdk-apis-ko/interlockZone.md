---
permalink: /api/zone/interlock
title: "Interlock Zone API"
toc_label: "Interlock Zone"  
---

인터록 존(interlock zone)은 둘 이상의 도어 상태를 감시하여, 다른 도어가 열려 있거나 잠금 해제된 상태에서는 한 도어를 열거나 닫을 수 없도록 제어합니다. 또한 사용자가 존 내부에 머물러 있는 경우 출입을 차단할 수도 있습니다.

인터록 존을 구성할 때는 몇 가지 제약 사항이 있습니다.

- 하나의 인터록 존은 최대 4개의 도어로 구성할 수 있습니다.

- 각 도어에는 도어 센서가 있어야 합니다.

- 인터록 존은 CoreStation에 연결된 장치의 도어만 설정할 수 있습니다.

- 인터록 존으로 설정된 도어는 화재 경보 존을 제외한 다른 존으로 설정할 수 없습니다.


## Information

```protobuf
message ZoneInfo {
  uint32 zoneID;
  string name;

  bool disabled;

  repeated uint32 doorIDs;

  repeated Input inputs;
  repeated Output outputs;
}
```
{: #ZoneInfo }
zoneID
: 존의 ID입니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

disabled
: 존이 비활성화되어 있는지 여부를 나타냅니다.

doorIDs
: 하나의 존에는 최대 4개의 도어를 할당할 수 있습니다. CoreStation이 상태를 확인할 수 있도록 각 도어에는 도어 센서가 있어야 합니다. 

[inputs](#Input)
: 존 내부에 사용자가 있는지 감지하기 위해 최대 4개의 입력을 구성할 수 있습니다. 이 입력 중 하나에서 신호가 감지되면 출입이 거부됩니다.

[outputs](#Output)
: 지정된 이벤트가 발생할 때 트리거되는 동작을 최대 8개까지 구성할 수 있습니다. 

```protobuf
message Input {
  uint32 deviceID;
  uint32 port;
  device.SwitchType switchType;
  uint32 duration;
  uint32 operation; // not used
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
: 신호가 감지되어야 하는 최소 지속 시간(밀리초 단위)입니다. 

```protobuf
message Output {
  uint32 event;
  action.Action;
}
```
{: #Output }

[event]({{'/api/event/' | relative_url}}#EventCode)
: 동작을 트리거하는 이벤트 유형입니다. 예를 들어 경보가 감지될 때 동작을 실행하려면 BS2_EVENT_ZONE_INTERLOCK_ALARM(0xA100)으로 설정하면 됩니다.

[action]({{'/api/action/' | relative_url}}#Action)
: 위 이벤트가 발생할 때 실행될 동작입니다.


### Get

CoreStation에 구성된 인터록 존을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | CoreStation의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| zones | [ZoneInfo[]](#ZoneInfo) | CoreStation에 구성된 존 |

### GetStatus

CoreStation에 구성된 존의 상태를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | CoreStation의 ID |
| zoneIDs | uint32[] | 존의 ID 목록 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [ZoneStatus[]]({{'/api/zone/' | relative_url}}#ZoneStatus) | CoreStation에 구성된 존의 상태 |  

## Management

### Add

CoreStation에 존을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | CoreStation의 ID |
| zones | [ZoneInfo[]](#ZoneInfo) | CoreStation에 구성할 존 |

### Delete

CoreStation에서 존을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | CoreStation의 ID |
| zoneIDs | uint32[] | CoreStation에서 삭제할 존의 ID 목록 |


### DeleteAll

CoreStation에 구성된 모든 존을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | CoreStation의 ID |

## Alarm

### SetAlarm

존의 경보 상태를 설정하거나 해제할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | CoreStation의 ID |
| zoneIDs | uint32[] | 경보 상태를 설정할 존의 ID 목록 |
| alarmed | bool | true이면 경보를 설정하고, false이면 경보를 해제합니다 |