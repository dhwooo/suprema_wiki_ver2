---
title: "Lift API"
toc_label: "Lift"  
---

[OM-120](https://www.supremainc.com/en/hardware/pd_om-120.asp)는 최대 12개의 출력 릴레이를 제어하는 출력 확장 모듈입니다. 엘리베이터 컨트롤러로 사용할 수 있습니다. RS485를 통해 최대 31개의 유닛을 마스터 장치에 연결할 수 있습니다. 예시는 [이 문서](http://kb.supremainc.com/knowledge/doku.php?id=en:tc_appnote_om120_elevator_configuration)를 참고하십시오. 


## Information

```protobuf
message LiftInfo {
  uint32 liftID;
  string name;

  repeated uint32 deviceIDs;

  uint32 activateTimeout;
  uint32 dualAuthTimeout;

  DualAuthApprovalType dualAuthApproval;
  repeated uint32 dualAuthRequiredDeviceIDs;
  uint32 dualAuthScheduleID;

  repeated Floor floors;

  repeated uint32 dualAuthApprovalGroupIDs;

  repeated Alarm alarms;
  uint32 alarmFlags;

  Alarm tamper;
  bool tamperOn;
}
```
{: #LiftInfo }

liftID
: 리프트의 ID입니다. 

name
: UTF-8 인코딩으로 최대 48자입니다.

deviceIDs
: 리프트에 연결된 장치의 ID입니다. 하나의 리프트에 최대 4개의 장치를 연결할 수 있습니다.

[floors](#Floor)
: 하나의 리프트에 최대 192개의 층을 구성할 수 있습니다. 

각 층마다 하나의 릴레이가 있어야 합니다. 따라서 [Floor.deviceID](#Floor)에 0을 설정할 수 없습니다.
{: .notice--warning}

activateTimeout
: 리프트 문은 __activateTimeout__ 초 후에 닫힙니다.

dualAuthTimeout
: __DualAuthApprovalType__이 LAST_ON_LIFT인 경우, 두 번째 사용자는 첫 번째 사용자 이후 __dualAuthTimeout__ 초 이내에 인증해야 합니다. 

[dualAuthApproval](#DualAuthApprovalType)
: __LAST_ON_LIFT__인 경우, __dualAuthApprovalGroupIDs__에 속한 두 번째 사용자가 첫 번째 사용자 이후 __dualAuthTimeout__ 이내에 인증해야 합니다. __NONE_ON_LIFT__인 경우, 이중 인증이 필요하지 않습니다.
{: #DualAuth }

dualAuthRequiredDeviceIDs
: 이중 인증을 적용할 장치를 지정합니다.

dualAuthScheduleID
: 이중 인증이 적용되는 스케줄을 지정합니다. 

dualAuthApprovalGroupIDs
: __dualAuthApproval__이 __LAST_ON_LIFT__인 경우, 이 그룹들에 속한 사용자가 첫 번째 사용자 이후에 인증해야 합니다.

[alarms](#Alarm)
: 두 개의 리프트 센서와 그에 대응하는 동작을 구성할 수 있습니다. 

[alarmFlags](#AlarmFlag)
: 리프트의 알람 상태를 나타냅니다. 예를 들어 FIRST \| TAMPER인 경우, 첫 번째 센서와 탬퍼 스위치가 감지되었음을 의미합니다.

[tamper](#Alarm)
: 탬퍼 스위치와 그에 대응하는 동작을 구성할 수 있습니다.

tamperOn
: 탬퍼 스위치가 켜져 있는지 여부를 나타냅니다.


```protobuf
enum DualAuthApprovalType {
  NONE_ON_LIFT = 0x00;
  LAST_ON_LIFT = 0x01;
};
```
{: #DualAuthApprovalType }


```protobuf
message Floor {
  uint32 deviceID;
  uint32 port;
  FloorStatus status;
}
```
{: #Floor }

deviceID
: 해당 층을 제어하는 장치의 ID입니다.

port
: 장치 릴레이의 인덱스입니다.

[status](#FloorStatus)
: 층의 현재 상태입니다.

```protobuf
message FloorStatus {
  bool activated;
  uint32 activateFlags;
  uint32 deactivateFlags;
}
```
{: #FloorStatus }

activated
: 층이 활성화되어 있으면 True입니다.

activateFlags
: 층이 어떻게 활성화되었는지를 나타냅니다. 사용 가능한 값은 [FloorFlag](#FloorFlag)를 참고하십시오.

deactivateFlags
: 층이 어떻게 비활성화되었는지를 나타냅니다. 사용 가능한 값은 [FloorFlag](#FloorFlag)를 참고하십시오.

```protobuf
enum FloorFlag {
  NONE = 0x00; 
  SCHEDULED = 0x01;
  EMERGENCY = 0x02;
  OPERATOR = 0x04;
}
```
{: #FloorFlag }

각 플래그는 서로 다른 우선순위를 가집니다. 우선순위 순서는 EMERGENCY > OPERATOR > SCHEDULED > NONE입니다.

NONE
: 층이 일반 동작에 의해 활성화/비활성화됩니다. 

SCHEDULED
: 층이 Lift Zone의 Scheduled 기능을 사용하여 활성화/비활성화됩니다.

EMERGENCY
: 층이 Fire Alarm Zone에 의해 활성화/비활성화됩니다. 

OPERATOR
: 층이 운영자에 의해 활성화/비활성화됩니다. 

```protobuf
message Alarm {
  Sensor sensor; 
  action.Action action;
}
```
{: #Alarm }

[sensor](#Sensor)
: 알람 상태를 감지하는 리프트 센서입니다.

[action]({{'/api/action/' | relative_url}}#action)
: 센서가 알람 상태를 감지할 때 트리거되는 동작입니다.

```protobuf
message Sensor {
  uint32 deviceID;
  uint32 port;
  device.SwitchType type;
  uint32 duration;
  uint32 scheduleID;
}
```
{: #Alarm }

deviceID
: 장치의 ID입니다.

port
: 센서의 입력 인덱스입니다.

[type]({{'/api/device/' | relative_url}}#SwitchType)
: 센서의 유형입니다.

duration
: 신호가 감지되어야 하는 최소 지속 시간(밀리초)입니다.

scheduleID
: 센서가 모니터링되는 스케줄을 지정합니다. 0인 경우, 해당 포트는 항상 모니터링됩니다.

```protobuf
enum AlarmFlag {
  NO_ALARM = 0x00; 
  FIRST = 0x01;
  SECOND = 0x02;
  TAMPER = 0x04;
}
```
{: #AlarmFlag }

NO_ALARM
: 알람이 감지되지 않았습니다.

FIRST
: 첫 번째 센서가 알람 상태를 감지합니다.

SECOND
: 두 번째 센서가 알람 상태를 감지합니다.

TAMPER
: 탬퍼 스위치가 켜져 있습니다.


### GetList

장치에 구성된 리프트를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| lifts | [LiftInfo[]](#LiftInfo) | 장치에 구성된 리프트 |

### GetStatus

장치에 구성된 리프트의 상태를 가져옵니다.

```protobuf
message Status {
  uint32 liftID;
  uint32 alarmFlags;
  bool tamperOn;
  repeated FloorStatus floors;
}
```
{: #Status }

liftID
: 리프트의 ID입니다.

[alarmFlags](#AlarmFlag)
: 리프트의 알람 상태를 나타냅니다. 예를 들어 FIRST \| TAMPER인 경우, 첫 번째 센서와 탬퍼 스위치가 감지되었음을 의미합니다.

tamperOn
: 탬퍼 스위치가 켜져 있는지 여부를 나타냅니다.

[floors](#FloorStatus)
: 층의 현재 상태입니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [Status[]](#Status) | 장치에 구성된 리프트의 상태 |  

## Management

### Add

장치에 리프트를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| lifts | [LiftInfo[]](#LiftInfo) | 장치에 구성할 리프트 |

### Delete

장치에서 리프트를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| liftIDs | uint32[] | 장치에서 삭제할 리프트의 ID |


### DeleteAll

장치에 구성된 모든 리프트를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

## Activate/Deactivate

리프트의 지정된 층을 수동으로 활성화, 비활성화 또는 해제할 수 있습니다.

### Activate

리프트의 층을 활성화합니다. __activateFlag__가 [FloorStatus.deactivateFlags](#FloorStatus)보다 낮은 우선순위를 가지는 경우, 작업이 실패합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| liftID | uint32 | 리프트의 ID |
| floorIndexes | uint32[] | 활성화할 층의 인덱스 |
| activateFlag | uint32 | [FloorFlag](#FloorFlag) 중 하나 |

### Deactivate

리프트의 층을 비활성화합니다. __deactivateFlag__가 [FloorStatus.activateFlags](#FloorStatus)보다 낮은 우선순위를 가지는 경우, 작업이 실패합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| liftID | uint32 | 리프트의 ID |
| floorIndexes | uint32[] | 비활성화할 층의 인덱스 |
| deactivateFlag | uint32 | [FloorFlag](#FloorFlag) 중 하나 |

### Release

층 상태를 재설정합니다. __floorFlag__가 [FloorStatus.activateFlags/deactivateFlags](#FloorStatus)보다 낮은 우선순위를 가지는 경우, 작업이 실패합니다.

| Request |
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| liftID | uint32 | 리프트의 ID |
| floorIndexes | uint32[] | 해제할 층의 인덱스 |
| floorFlag | uint32 | [FloorFlag](#FloorFlag) 중 하나 |

### SetAlarm

리프트의 [Status.alarmFlags](#Status)를 변경합니다.

| Request |
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| liftIDs | uint32[] | __alarmFlags__를 변경할 리프트의 ID |
| alarmFlag | uint32 | [AlarmFlag](#AlarmFlag)의 마스크 |

