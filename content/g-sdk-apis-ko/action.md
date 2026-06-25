---
title: "Trigger & Action API"
toc_label: "Trigger & Action"  
---

특정 조건이 충족되었을 때 어떤 동작을 수행할지 구성할 수 있습니다.

## Trigger

트리거는 특정 조건이 충족되었을 때 발생합니다. __TRIGGER_EVENT__, __TRIGGER_INPUT__, __TRIGGER_SCHEDULE__의 세 가지 유형의 트리거를 구성할 수 있습니다.

```protobuf
message Trigger {
  uint32 deviceID; 
  TriggerType type;
  uint32 ignoreSignalTime;
  oneof entity {
    EventTrigger event;
    InputTrigger input;
    ScheduleTrigger schedule;
  }
}
```
{: #Trigger }

deviceID
: 장치의 ID입니다. 0으로 설정되면 트리거가 구성이 작성된 동일한 장치에서 발생함을 의미합니다.

[type](#TriggerType)
: 

ignoreSignalTime
: [+ 1.7] 이 설정은 밀리초 단위로 지정되며, 일정 시간 내에 반복적으로 들어오는 입력 신호를 무시하는 데 사용됩니다.
Suprema 장치가 Wiegand를 통해 서드파티 컨트롤러에 연결된 환경에서,
특정 모델의 컨트롤러로부터 인증에 대한 피드백이 Suprema 장치로 반복적으로 입력되는 경우,
이 기능을 사용하면 지정된 시간 동안 입력 신호를 강제로 무시할 수 있습니다.

[event](#EventTrigger)
: __type__이 __TRIGGER_EVENT__인 경우에만 유효합니다.

[input](#InputTrigger)
: __type__이 __TRIGGER_INPUT__인 경우에만 유효합니다.

[schedule](#ScheduleTrigger)
: __type__이 __TRIGGER_SCHEDULE__인 경우에만 유효합니다.

```protobuf
enum TriggerType {
  TRIGGER_NONE = 0x00;
  TRIGGER_EVENT = 0x01;
  TRIGGER_INPUT = 0x02;
  TRIGGER_SCHEDULE = 0x03;
}
```
{: #TriggerType }

TRIGGER_EVENT
: 지정된 이벤트가 발생하면 트리거가 발생합니다.

TRIGGER_INPUT
: 지정된 입력 신호가 감지되면 트리거가 발생합니다.

TRIGGER_SCHEDULE
: 지정된 스케줄에 따라 트리거가 발생합니다.


```protobuf
message EventTrigger {
  uint32 eventCode;
}
```
{: #EventTrigger }

[eventCode]({{'/api/event/' | relative_url}}#EventCode)
: 동작을 발생시킬 이벤트 유형입니다.

```protobuf
message InputTrigger {
  uint32 port;
  device.SwitchType switchType;
  uint32 duration;
  uint32 scheduleID;
}
```
{: #InputTrigger }

port : 포트의 인덱스입니다.

[switchType]({{'/api/device/' | relative_url}}#SwitchType)
: 입력 포트의 유형입니다.

duration
: 신호가 감지되어야 하는 최소 지속 시간으로, 밀리초 단위입니다.

scheduleID
: 입력 포트가 모니터링되는 스케줄을 지정합니다. 0인 경우 포트는 항상 모니터링됩니다.

```protobuf
message ScheduleTrigger {
  ScheduleTriggerType type;
  uint32 scheduleID;
}
```
{: #ScheduleTrigger }

[type](#ScheduleTriggerType) :

scheduleID
: 트리거를 발생시킬 스케줄의 ID입니다.

```protobuf
enum ScheduleTriggerType {
  SCHEDULE_TRIGGER_ON_START = 0x00;
  SCHEDULE_TRIGGER_ON_END = 0x01;
}
```
{: #ScheduleTriggerType }

SCHEDULE_TRIGGER_ON_START
: 스케줄의 시작 시간에 트리거가 발생합니다.

SCHEDULE_TRIGGER_ON_END
: 스케줄의 종료 시간에 트리거가 발생합니다.

## Action

지정된 트리거가 발생했을 때 실행될 여러 [동작 유형](#ActionType)을 구성할 수 있습니다.

```protobuf
message Action {
  uint32 deviceID;
  ActionType type;
  StopFlag stopFlag;
  uint32 delay;

  oneof entity {
    RelayAction relay;
    OutputPortAction outputPort;
    DisplayAction display;
    SoundAction sound;
    LEDAction LED;
    BuzzerAction buzzer;
    LiftAction lift;
  }
}
```
{: #Action }

deviceID
: 장치의 ID입니다. 0으로 설정되면 동작이 구성이 작성된 동일한 장치에서 수행됨을 의미합니다.

[type](#ActionType)
: 

[stopFlag](#StopFlag)
: 도어에서 동작이 중지되는 시점을 지정합니다.

delay
: 이 지연 시간(밀리초) 이후에 동작이 수행됩니다.

[relay](#RelayAction)
: __type__이 __ACTION_RELAY__인 경우에만 유효합니다.

[outputPort](#OutputPortAction)
: __type__이 __ACTION_TTL__인 경우에만 유효합니다. 아직 지원되지 않습니다.

[display](#DisplayAction)
: __type__이 __ACTION_DISPLAY__인 경우에만 유효합니다. 아직 지원되지 않습니다.

[sound](#SoundAction)
: __type__이 __ACTION_SOUND__인 경우에만 유효합니다.

[LED](#LEDAction)
: __type__이 __ACTION_LED__인 경우에만 유효합니다.

[buzzer](#BuzzerAction)
: __type__이 __ACTION_BUZZER__인 경우에만 유효합니다.

[lift](#LiftAction)
: __type__이 __ACTION_LIFT__인 경우에만 유효합니다.

```protobuf
enum ActionType {
  ACTION_NONE = 0x00;

  ACTION_LOCK_DEVICE = 0x01;
  ACTION_UNLOCK_DEVICE = 0x02;
  ACTION_REBOOT_DEVICE = 0x03;
  ACTION_RELEASE_ALARM = 0x04;
  ACTION_GENERAL_INPUT = 0x05;

  ACTION_RELAY = 0x06;
  ACTION_TTL = 0x07;
  ACTION_SOUND = 0x08;
  ACTION_DISPLAY = 0x09;
  ACTION_BUZZER = 0x0A;
  ACTION_LED = 0x0B;

  ACTION_FIRE_ALARM_INPUT = 0x0C;

  ACTION_AUTH_SUCCESS = 0x0D;
  ACTION_AUTH_FAIL = 0x0E;

  ACTION_LIFT = 0x0F;
}
```
{: #ActionType }

ACTION_LOCK_DEVICE
: 장치를 잠급니다.

ACTION_UNLOCK_DEVICE
: 장치의 잠금을 해제합니다.

ACTION_REBOOT_DEVICE
: 장치를 재부팅합니다.

ACTION_RELEASE_ALARM
: 장치의 모든 알람을 해제합니다.

ACTION_GENERAL_INPUT
: 아직 지원되지 않습니다.

ACTION_RELAY
: 지정된 패턴으로 릴레이를 활성화합니다.

ACTION_TTL
: 아직 지원되지 않습니다.

ACTION_SOUND
: 지정된 사운드를 재생합니다.

ACTION_DISPLAY
: 아직 지원되지 않습니다.

ACTION_BUZZER
: 지정된 패턴으로 부저를 재생합니다.

ACTION_LED
: 지정된 패턴으로 LED를 활성화합니다.

ACTION_FIRE_ALARM_INPUT
: 아직 지원되지 않습니다.

ACTION_AUTH_SUCCESS
: 인증이 성공할 때와 동일한 동작을 재생합니다.

ACTION_AUTH_FAIL
: 인증이 실패할 때와 동일한 동작을 재생합니다.

ACTION_LIFT
: 리프트를 활성화하거나 비활성화합니다.

```protobuf
enum StopFlag {
  STOP_NONE = 0x00;
  STOP_ON_DOOR_CLOSED = 0x01;	
  STOP_BY_CMD_RUN_ACTION = 0x02;
}
```
{: #StopFlag }

STOP_ON_DOOR_CLOSED
: 도어가 닫히면 동작이 중지됩니다.

STOP_BY_CMD_RUN_ACTION
: __Action.stopFlag__가 __STOP_BY_CMD_RUN_ACTION__이면 지정된 동작을 중지합니다.

```protobuf
message RelayAction {
  uint32 relayIndex;
  Signal signal;
}
```
{: #RelayAction }

relayIndex
: 활성화할 릴레이의 인덱스입니다.

[signal](#Signal)
: 릴레이에서 출력될 신호입니다.

```protobuf
message Signal {
  uint32 signalID;
  uint32 count;
  uint32 onDuration;
  uint32 offDuration;
  uint32 delay;
}
```
{: #Signal }

signalID
: 신호의 인덱스입니다. 애플리케이션에서 신호를 관리하는 데 사용할 수 있습니다.

count
: 펄스의 개수입니다.

onDuration
: 한 펄스에서의 활성화 지속 시간입니다. 밀리초 단위입니다.

offDuration
: 한 펄스에서의 비활성화 지속 시간입니다. 밀리초 단위입니다.

delay
: 신호의 시작 지연 시간으로, 밀리초 단위입니다.

```protobuf
message SoundAction {
  uint32 count;
  uint32 soundIndex;
  uint32 delay;
}
```
{: #SoundAction }

count
: 반복 횟수입니다.

[soundIndex]({{'/api/display/' | relative_url}}#SoundIndex)
: 재생할 사운드의 인덱스입니다.

delay
: 사운드의 시작 지연 시간으로, 밀리초 단위입니다.

```protobuf
message LEDAction {
  repeated LEDSignal signals;
}
```
{: #LEDAction }

[signals](#LEDSignal)
: LED에서 출력될 신호입니다.

```protobuf
message LEDSignal {
  device.LEDColor color;
  uint32 duration;
  uint32 delay;
}
```
{: #LEDSignal }

[color]({{'/api/device/' | relative_url}}#LEDColor)
: LED 신호의 색상입니다.

duration
: 지속 시간으로, 밀리초 단위입니다.

delay
: 시작 지연 시간으로, 밀리초 단위입니다.

```protobuf
message BuzzerAction {
  repeated BuzzerSignal signals;
  uint32 count;
}
```
{: #BuzzerAction }

[signals](#BuzzerSignal)
: 부저에서 재생될 신호입니다.

count
: 반복 횟수입니다.

```protobuf
message BuzzerSignal {
  device.BuzzerTone tone;
  bool fadeout;
  uint32 duration;
  uint32 delay;
}
```
{: #BuzzerSignal }

[tone]({{'/api/device/' | relative_url}}#BuzzerTone)
: 부저 신호의 톤 인덱스입니다.

fadeout
: true인 경우 부저 사운드가 페이드 아웃됩니다.

duration
: 부저의 지속 시간으로, 밀리초 단위입니다.

delay
: 시작 지연 시간으로, 밀리초 단위입니다.

```protobuf
message LiftAction {
  uint32 liftID;
  LiftActionType type;
}
```
{: #LiftAction }

liftID
: 리프트의 ID입니다.

[type](#LiftActionType)
: 리프트에서 실행될 동작입니다.

```protobuf
enum LiftActionType {
  LIFT_ACTION_ACTIVATE_FLOORS;
  LIFT_ACTION_DEACTIVATE_FLOORS;
  LIFT_ACTION_RELEASE_FLOORS;
}
```
{: #LiftActionType }

LIFT_ACTION_ACTIVATE_FLOORS
: 리프트의 층을 활성화합니다.

LIFT_ACTION_DEACTIVATE_FLOORS
: 리프트의 층을 비활성화합니다.

LIFT_ACTION_RELEASE_FLOORS
: 리프트의 플래그를 초기화합니다.


## Config

```protobuf
message TriggerActionConfig {
  repeated TriggerAction triggerActions;
}
```
{: #TriggerActionConfig }

[triggerActions](#TriggerAction)
: 장치에는 최대 128개의 트리거 및 동작 쌍을 저장할 수 있습니다.

```protobuf
message TriggerAction {
  Trigger trigger;
  Action action;
}
```
{: #TriggerAction }

[trigger](#Trigger)
: 

[action](#Action)
: 


### GetConfig

장치의 트리거 및 동작 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [TriggerActionConfig](#TriggerActionConfig) | 장치의 트리거 및 동작 구성 |

### SetConfig

장치의 트리거 및 동작 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [TriggerActionConfig](#TriggerActionConfig) | 장치에 작성할 트리거 및 동작 구성 |

### SetConfigMulti

여러 장치의 트리거 및 동작 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [TriggerActionConfig](#TriggerActionConfig) | 장치들에 작성할 트리거 및 동작 구성 |

### RunAction

[+ 1.8.0] Action을 통해 특정 동작을 지시합니다.
{: #RunAction}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| action | [Action](#Action) | 실행할 동작 |
