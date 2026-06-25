---
title: "Door API"
toc_label: "Door"  
---

도어는 출입 통제의 기본 단위입니다. 릴레이와 도어 센서, 퇴실 버튼 같은 선택적 구성 요소로 이루어집니다. 도어는 RS485로 연결된 하나 이상의 장치에 구성할 수 있습니다.

## Information

```protobuf
message DoorInfo {
  uint32 doorID;
  string name;

  uint32 entryDeviceID;
  uint32 exitDeviceID;

  Relay relay;
  Sensor sensor;
  ExitButton button;

  uint32 autoLockTimeout;
  uint32 heldOpenTimeout;

  bool instantLock;
  uint32 unlockFlags;
  uint32 lockFlags;
  bool unconditionalLock;

  repeated action.Action forcedOpenActions;
  repeated action.Action heldOpenActions;

  uint32 dualAuthScheduleID;
  DualAuthDevice dualAuthDevice;
  DualAuthType dualAuthType;
  uint32 dualAuthTimeout;
  repeated uint32 dualAuthGroupIDs;

  apb_zone.ZoneInfo apbZone;

  uint32 extendedDoorOpenTime;
}
```
{: #DoorInfo }

doorID
: 도어의 ID입니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

entryDeviceID
: 입실 장치의 ID입니다. 도어에 장치가 하나만 있는 경우 이를 입실 장치로 설정해야 합니다.

exitDeviceID
: 퇴실 장치의 ID입니다. 도어가 RS485로 연결된 두 개의 장치로 구성된 경우에만 설정하면 됩니다.

[relay](#Relay)
: 릴레이의 포트 정보입니다.

각 도어마다 하나의 릴레이가 반드시 있어야 합니다. 따라서 [Relay.deviceID](#Relay)에 0을 설정할 수 없습니다.
{: .notice--warning}

[sensor](#Sensor)
: 도어 센서의 포트 정보입니다. __FORCED_OPEN__ 또는 __HELD_OPEN__ 같은 도어 알람을 사용하려면 도어 센서를 구성해야 합니다. 도어 센서가 필요 없는 경우에는 [Sensor.deviceID](#Sensor)에 0을 설정하면 됩니다.<br>
__apbUseDoorSensor__는 Global APB를 사용할 때 도어 센서를 사용할지 여부를 결정합니다.
[AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 useGlobalAPB와 함께 사용해야 합니다.

[button](#ExitButton)
: 퇴실 버튼의 포트 정보입니다. 퇴실 버튼이 필요 없는 경우에는 [ExitButton.deviceID](#ExitButton)에 0을 설정하면 됩니다.

autoLockTimeout 
: 0이 아닌 경우, 도어가 열린 후 __autoLockTimeout__초가 지나면 자동으로 잠깁니다. [unconditionalLock](#UnconditionalLock)도 참고하십시오.
{: #AutoLockTimeout }

heldOpenTimeout
: 0이 아닌 경우, 도어가 열린 후 __heldOpenTimeout__초가 지나면 __HELD_OPEN__ 알람을 생성합니다.
{: #HeldOpenTimeout }

instantLock
: true인 경우, 센서가 도어가 닫힌 것을 감지하면 도어가 즉시 잠깁니다.

unlockFlags/lockFlags
: [DoorFlag](#DoorFlag)의 마스크입니다. V1.0에서는 __NONE__으로 설정하십시오. 나머지 옵션은 향후 G-SDK 버전에서 제공될 예정입니다.

unconditionalLock 
: 이 플래그는 [autoLockTimeout](#AutoLockTimeout) 이후의 동작 방식을 결정합니다. true인 경우, 도어 센서가 도어가 열려 있는 것을 감지하더라도 도어가 잠깁니다. false인 경우, 도어 센서가 도어가 닫힌 것을 감지할 때만 잠깁니다.
{: #UnconditionalLock }

forcedOpenActions
: 센서가 정상적인 동작이 아닌 강제로 도어가 열린 것을 감지하면 __FORCED_OPEN__ 알람이 생성됩니다. 이 알람으로 어떤 액션을 트리거할지 구성할 수 있습니다. 사용 가능한 액션은 [Action]({{'/api/action/' | relative_url}}#action)을 참고하십시오.

heldOpenActions
: 센서가 도어가 [heldOpenTimeout](#HeldOpenTimeout)보다 오래 열려 있는 것을 감지하면 __HELD_OPEN__ 알람이 생성됩니다. 이 알람으로 어떤 액션을 트리거할지 구성할 수 있습니다. 사용 가능한 액션은 [Action]({{'/api/action/' | relative_url}}#action)을 참고하십시오.

dualAuthScheduleID
: 0이 아닌 경우, 지정된 스케줄에 대해 이중 인증이 활성화됩니다. 이중 인증에서는 도어에 출입하기 위해 두 명의 사용자가 인증해야 합니다.

[dualAuthDevice](#DualAuthDevice)
: 이중 인증이 적용될 장치를 지정합니다. 예를 들어 __DUAL_AUTH_ENTRY_DEVICE_ONLY__인 경우 입실 장치에만 적용됩니다.

[dualAuthType](#DualAuthType)
: __DUAL_AUTH_LAST__인 경우, [dualAuthGroupIDs](#DualAuthGroupIDs)에 속한 두 번째 사용자가 __dualAuthTimeout__ 이내에 첫 번째 사용자에 이어 인증해야 합니다. __DUAL_AUTH_NONE__인 경우 이중 인증이 필요하지 않습니다.
{: #DualAuth }

dualAuthTimeout
: 두 인증 사이의 최대 간격(초)입니다. 즉, 두 번째 사용자는 첫 번째 사용자의 인증 이후 이 타임아웃 이내에 인증해야 합니다.

dualAuthGroupIDs
: [dualAuthType](#DualAuth)을 참고하십시오. 최대 16개의 출입 그룹을 이중 인증 그룹으로 설정할 수 있습니다.

apbZone
: 도어에 [Anti Passback]({{'api/zone/apb/' | relative_url}})을 구성합니다. Anti Passback 존 ID와 도어 ID는 동일합니다.

extendedDoorOpenTime
: [+ 1.9.0] 확장된 도어 열림 시간을 초 단위로 설정합니다. 기본값은 10초입니다.


```protobuf
message Relay {
  uint32 deviceID;
  uint32 port;
}
```
{: #Relay }

```protobuf
message Sensor {
  uint32 deviceID;
  uint32 port;
  device.SwitchType type;
  bool apbUseDoorSensor = 4;
}
```
{: #Sensor }

[type]({{'/api/device/' | relative_url}}#SwitchType)
: 센서의 유형입니다.


```protobuf
message ExitButton {
  uint32 deviceID;
  uint32 port;
  device.SwitchType type;
}
```
{: #ExitButton }

[type]({{'/api/device/' | relative_url}}#SwitchType)
: 버튼의 유형입니다.

```protobuf
enum DualAuthDevice {
  DUAL_AUTH_NO_DEVICE	= 0x00;
  DUAL_AUTH_ENTRY_DEVICE_ONLY	= 0x01;
  DUAL_AUTH_EXIT_DEVICE_ONLY = 0x02;
  DUAL_AUTH_BOTH_DEVICE	= 0x03;
};
```
{: #DualAuthDevice }

```protobuf
enum DualAuthType {
  DUAL_AUTH_NONE = 0x00;
  DUAL_AUTH_LAST = 0x01;
};
```
{: #DualAuthType }

DUAL_AUTH_NONE
: 두 사용자의 출입 그룹을 확인하지 않습니다.

DUAL_AUTH_LAST
: 두 번째 사용자는 이중 인증 그룹에 속해야 합니다.

### GetList

장치에 구성된 도어를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| doors | [DoorInfo[]](#DoorInfo) | 장치에 구성된 도어 |

### GetStatus

장치에 구성된 도어의 상태를 가져옵니다.

```protobuf
message Status {
  uint32 doorID;
  bool isOpen;
  bool isUnlocked;
  bool heldOpen;
  uint32 unlockFlags;
  uint32 lockFlags;
  uint32 alarmFlags;
  uint32 lastOpenTime;
}
```
{: #Status }

doorID
: 도어의 ID입니다.

isOpen
: 도어 센서가 도어가 열린 것을 감지하면 true입니다.

isUnlocked
: 도어가 잠금 해제된 경우 true입니다.

heldOpen
: 도어 센서가 도어가 [heldOpenTimeout](#HeldOpenTimeout)보다 오래 열려 있는 것을 감지하면 true입니다.

unlockFlags
: 도어가 어떻게 잠금 해제되었는지 나타냅니다. 사용 가능한 값은 [DoorFlag](#DoorFlag)를 참고하십시오.

lockFlags
: 도어가 어떻게 잠겼는지 나타냅니다. 사용 가능한 값은 [DoorFlag](#DoorFlag)를 참고하십시오.

alarmFlags
: 도어의 알람 상태를 나타냅니다. 사용 가능한 값은 [AlarmFlag](#AlarmFlag)를 참고하십시오.

lastOpenTime
: 도어가 마지막으로 열린 시간입니다. Unix 시간 형식입니다.

```protobuf
enum DoorFlag {
  NONE = 0x00; 
  SCHEDULED = 0x01;
  EMERGENCY = 0x02;
  OPERATOR = 0x04;
}
```
{: #DoorFlag }

각 도어 플래그는 서로 다른 우선순위를 가집니다. 우선순위 순서는 EMERGENCY > OPERATOR > SCHEDULED > NONE입니다.

NONE
: 도어가 정상적인 동작으로 잠기거나 잠금 해제됩니다.

SCHEDULED
: 도어가 Scheduled Lock/Unlock 존에 의해 잠기거나 잠금 해제됩니다. 존은 향후 G-SDK 버전에서 지원될 예정입니다.

EMERGENCY
: 도어가 Fire Alarm Zone 또는 Intrusion Alarm Zone에 의해 잠기거나 잠금 해제됩니다. 존은 향후 G-SDK 버전에서 지원될 예정입니다.

OPERATOR
: 도어가 운영자에 의해 잠기거나 잠금 해제됩니다.

```protobuf
enum AlarmFlag {
  NO_ALARM = 0x00;
  FORCED_OPEN = 0x01;
  HELD_OPEN = 0x02;
  APB_VIOLATION = 0x04;
}
```
{: #AlarmFlag }

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| status | [Status[]](#Status) | 장치에 구성된 도어의 상태 |  

## Management

### Add

장치에 도어를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| doors | [DoorInfo[]](#DoorInfo) | 장치에 구성할 도어 |

### Delete

장치에서 도어를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| doorIDs | uint32[] | 장치에서 삭제할 도어의 ID |


### DeleteAll

장치에 구성된 모든 도어를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

## Lock/Unlock

도어를 수동으로 잠그거나, 잠금 해제하거나, 해제할 수 있습니다.  
[+ 1.9.0] 도어 모드 오버라이드를 지원합니다.

### Lock

도어를 잠급니다. __doorFlag__가 [DoorStatus.unlockFlags](#Status)보다 낮은 우선순위를 가지면 작업이 실패합니다.  
[+ 1.9.0] 도어 모드 오버라이드를 지원합니다.
| Version | Description |
| :-----: | :---------- |
| ~ 1.8.1 | Lock 명령은 다음 Unlock 또는 Release 명령이 있을 때까지 유지됩니다. (관리자가 Unlock 또는 Release를 잊어버릴 수 있습니다.) |
| 1.9.0 ~ | 이제 Lock 명령에 시간을 설정할 수 있으며, 설정한 시간이 지나면 도어가 자동으로 정상 상태로 돌아갑니다. <br>normalizeTimer에서 시간을 설정할 수 있으며, ___doorFlag가 OPERATOR로 설정된 경우에만___ 동작합니다. |

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| doorIDs | uint32[] | 잠글 도어의 ID |
| doorFlag | uint32 | [DoorFlag](#DoorFlag) 중 하나 |
| normalizeTimer | uint32 | [+ 1.9.0] 정상 상태로 전환되기까지의 대기 시간. 1부터 86400(24시간)까지 초 단위로 설정할 수 있으며, 0은 무한입니다. |

### Unlock

도어를 잠금 해제합니다. __doorFlag__가 [DoorStatus.lockFlags](#Status)보다 낮은 우선순위를 가지면 작업이 실패합니다.  
[+ 1.9.0] 도어 모드 오버라이드를 지원합니다.
| Version | Description |
| :-----: | :---------- |
| ~ 1.8.1 | Unlock 명령은 다음 Lock 또는 Release 명령이 있을 때까지 유지됩니다. (관리자가 Lock 또는 Release를 잊어버릴 수 있습니다.) |
| 1.9.0 ~ | 이제 Unlock 명령에 시간을 설정할 수 있으며, 설정한 시간이 지나면 도어가 자동으로 정상 상태로 돌아갑니다. <br>normalizeTimer에서 시간을 설정할 수 있으며, ___doorFlag가 OPERATOR로 설정된 경우에만___ 동작합니다. |

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| doorIDs | uint32[] | 잠금 해제할 도어의 ID |
| doorFlag | uint32 | [DoorFlag](#DoorFlag) 중 하나 |
| normalizeTimer | uint32 | [+ 1.9.0] 정상 상태로 전환되기까지의 대기 시간. 1부터 86400(24시간)까지 초 단위로 설정할 수 있으며, 0은 무한입니다. |

### Release

도어 상태를 초기화합니다. __doorFlag__가 [DoorStatus.lockFlags/unlockFlags](#Status)보다 낮은 우선순위를 가지면 작업이 실패합니다.

| Request |
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| doorIDss | uint32[] | 초기화할 도어의 ID |
| doorFlag | uint32 | [DoorFlag](#DoorFlag) 중 하나 |

### SetAlarm

도어의 [Status.alarmFlags](#Status)를 변경합니다.

| Request |
| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| doorIDss | uint32[] | __alarmFlags__를 변경할 도어의 ID |
| alarmFlag | uint32 | [AlarmFlag](#AlarmFlag)의 마스크 |

