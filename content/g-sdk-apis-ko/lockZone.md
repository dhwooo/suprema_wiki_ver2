---
permalink: /api/zone/lock
title: "Scheduled Lock Zone API"
toc_label: "Schedule Lock Zone"  
---

지정한 스케줄에 따라 문을 잠금 또는 잠금 해제 상태로 유지할 수 있습니다.

## Information

```protobuf
message ZoneInfo {
  uint32 zoneID;
  string name;

  uint32 lockScheduleID;
  uint32 unlockScheduleID;

  bool bidirectionalLock;

  bool disabled;
  bool alarmed;

  repeated uint32 doorIDs;
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

lockScheduleID
: 문이 잠기는 [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다. 문을 잠금 해제하려면 0으로 설정하십시오.

unlockScheduleID
: 문이 잠금 해제되는 [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다. 문을 잠그려면 0으로 설정하십시오.

__lockScheduleID__ 와 __unlockScheduleID__ 중 하나만 설정해야 합니다.
{: .notice--warning}

bidirectionalLock
: true이고 문에 ENTRY 장치와 EXIT 장치가 모두 있는 경우, 잠금 스케줄에 대해 두 장치를 모두 잠급니다. 그렇지 않으면 ENTRY 장치만 잠급니다.

disabled
: 존이 비활성화되었는지 여부를 나타냅니다.

alarmed
: 존에서 알람이 감지되었는지 여부를 나타냅니다.

doorIDs
: 하나의 존에 최대 32개의 문을 할당할 수 있습니다.

[actions]({{'/api/action/' | relative_url}}#Action)
: 존에서 알람이 감지될 때 트리거할 액션을 최대 5개까지 구성할 수 있습니다.

bypassGroupIDs
: 스케줄에 의해 문이 잠긴 상태에서도 해당 문으로 들어갈 수 있는 사용자가 속한 [액세스 그룹]({{'/api/access/' | relative_url}}#AccessGroup)의 ID입니다. 최대 그룹 수는 16개입니다.

unlockGroupIDs
: 문의 잠금 해제 기간을 시작할 수 있는 사용자가 속한 [액세스 그룹]({{'/api/access/' | relative_url}}#AccessGroup)의 ID입니다. 할당되지 않은 경우, 문은 스케줄에 따라 잠금 해제됩니다. 그러나 할당된 경우, 문이 스케줄에 따라 잠금 해제되려면 이 그룹의 사용자가 먼저 인증해야 합니다.

### Get

장치에 구성된 예약 잠금 존을 가져옵니다.

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