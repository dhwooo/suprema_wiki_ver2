---
permalink: /api/zone/lift
title: "Lift Zone API"
toc_label: "Lift Zone"  
---

지정한 스케줄에 따라 리프트의 층을 활성화하거나 비활성화한 상태로 유지할 수 있습니다.

## Information

```protobuf
message ZoneInfo {
  uint32 zoneID;
  string name;

  uint32 activateScheduleID;
  uint32 deactivateScheduleID;

  bool disabled;
  bool alarmed;

  repeated Lift lifts;

  repeated action.Action actions;
  repeated uint32 bypassGroupIDs;
  repeated uint32 unlockGroupIDs;
}
```
{: #ZoneInfo }
zoneID
: 존의 ID입니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

activateScheduleID
: 층이 활성화되는 [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다. 층을 비활성화하려면 0으로 설정합니다.

deactivateScheduleID
: 층이 비활성화되는 [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다. 층을 활성화하려면 0으로 설정합니다.

__activateScheduleID__ 와 __deactivateScheduleID__ 중 하나만 설정해야 합니다.
{: .notice--warning}

disabled
: 존이 비활성화되었는지 여부를 나타냅니다.

alarmed
: 존에서 알람이 감지되었는지 여부를 나타냅니다.

[lifts](#Lift)
: 한 존에 최대 32개의 리프트를 할당할 수 있습니다.

[actions]({{'/api/action/' | relative_url}}#Action)
: 존에서 알람이 감지되었을 때 트리거할 액션을 최대 5개까지 구성할 수 있습니다.

bypassGroupIDs
: 스케줄에 의해 리프트가 비활성화된 상태에서도 해당 리프트를 사용할 수 있는 사용자들이 속한 [출입 그룹]({{'/api/access/' | relative_url}}#AccessGroup)의 ID입니다. 최대 그룹 수는 16개입니다.

unlockGroupIDs
: 리프트의 활성화 기간을 시작할 수 있는 사용자들이 속한 [출입 그룹]({{'/api/access/' | relative_url}}#AccessGroup)의 ID입니다. 할당되지 않은 경우, 리프트는 스케줄에 따라 활성화됩니다. 그러나 할당된 경우, 리프트가 스케줄에 따라 활성화되려면 이 그룹의 사용자가 먼저 인증해야 합니다.

```protobuf
message Lift {
  uint32 liftID;
  repeated uint32 floorIndexes;
}
```
{: #Lift }
liftID
: 리프트의 ID입니다.

floorIndexes
: 최대 256개의 층을 할당할 수 있습니다.

### Get

장치에 구성된 리프트 존을 가져옵니다.

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

### SetAlarm

존의 알람 상태를 설정하거나 해제할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| zoneIDs | uint32[] | 알람 상태를 설정할 존의 ID |
| alarmed | bool | true이면 알람을 설정하고, false이면 알람을 해제합니다 |
