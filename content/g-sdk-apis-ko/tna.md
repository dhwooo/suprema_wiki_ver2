---
title: "Time & Attendance API"
toc_label: "Time & Attendance"  
---

## Config

장치가 [TNAConfig](#TNAConfig)를 지원하려면 [CapabilityInfo.TNASupported]({{'/api/device/' | relative_url}}#CapabilityInfo)가 true여야 합니다.

```protobuf
message TNAConfig {
  Mode mode;
  Key key;
  bool isRequired;
  repeated uint32 schedules;
  repeated string labels;
}
```
{: #TNAConfig}
__KEY_1__ 부터 __KEY_16__ 까지 최대 16개의 T&A 키를 지정할 수 있습니다. 또한 각 T&A 키마다 레이블이나 스케줄을 할당할 수 있습니다. 


[mode](#Mode)
: T&A 키를 인증 이벤트에 어떻게 할당할지 지정합니다.

[key](#Key)
: 모든 인증 이벤트에 사용되는 고정 T&A 키입니다. __mode__ 가 __FIXED__ 일 때만 유효합니다.

isRequired
: true이면 사용자는 인증을 마친 후 T&A 키를 선택해야 합니다. false이면 사용자는 T&A 키를 선택하지 않고도 인증할 수 있습니다.

schedules
: __mode__ 가 __BY_SCHEDULE__ 일 때 각 T&A 키에 적용할 [Schedule]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다. __schedules[0]__ 는 __KEY_1__, __schedules[1]__ 은 __KEY_2__ 에 해당하는 식입니다. 0이면 해당 T&A 키에 스케줄이 적용되지 않음을 의미합니다. 

labels
: 각 T&A 키의 레이블입니다. labels[0]__ 는 __KEY_1__, labels[1]__ 은 __KEY_2__ 에 해당하는 식입니다.


```protobuf
enum Mode {
  UNUSED = 0;
  BY_USER = 1;
  BY_SCHEDULE = 2;
  LAST_CHOICE = 3;
  FIXED = 4;
}
```
{: #Mode}

UNUSED
: T&A를 사용하지 않습니다.

BY_USER
: T&A 키를 사용자가 선택합니다.

BY_SCHEDULE
: T&A 키가 [TNAConfig.schedules](#TNAConfig)에 의해 자동으로 선택됩니다.

LAST_CHOICE
: 이전 사용자가 선택한 T&A 키가 사용됩니다.

FIXED
: [TNAConfig.key](#TNAConfig)로 정의된 T&A 키가 모든 인증 이벤트에 사용됩니다. 


```protobuf
enum Key {
  UNSPECIFIED = 0;

  KEY_1 = 1;
  KEY_2 = 2;
  KEY_3 = 3;
  KEY_4 = 4;
  KEY_5 = 5;
  KEY_6 = 6;
  KEY_7 = 7;
  KEY_8 = 8;
  KEY_9 = 9;
  KEY_10 = 10;
  KEY_11 = 11;
  KEY_12 = 12;
  KEY_13 = 13;
  KEY_14 = 14;
  KEY_15 = 15;
  KEY_16 = 16;
}
```
{: #Key}


### GetConfig

장치의 T&A 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [TNAConfig](#TNAConfig) | 장치의 T&A 설정 |

### SetConfig

장치의 T&A 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [TNAConfig](#TNAConfig) | 장치에 기록할 T&A 설정 |


### SetConfigMulti

여러 장치의 T&A 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [TNAConfig](#TNAConfig) | 장치들에 기록할 T&A 설정 |

## Event

대부분의 T&A 애플리케이션에서는 T&A 키나 잡 코드가 포함된 이벤트에 관심을 두게 됩니다. [GetTNALog](#gettnalog)와 [GetJobCodeLog](#getjobcodelog)는 각각 T&A 키와 잡 코드가 포함된 이벤트 로그를 반환합니다. 

### GetTNALog

장치에서 T&A 키가 포함된 이벤트 로그를 가져옵니다.

```protobuf
message TNALog {
  uint32 ID;
  uint32 timestamp;
  uint32 deviceID;
  string userID;
  uint32 eventCode;
  uint32 subCode;
  Key TNAKey;
}
```
{: #TNALog}

ID
: 로그 레코드의 4바이트 식별자입니다. 각 장치는 이 식별자에 대해 단조 증가하는 카운터를 관리합니다. 장치에서 로그를 읽을 때 이 값을 사용해 시작 위치를 지정할 수 있습니다.

timestamp
: Unix 시간 형식입니다. 1970년 1월 1일부터 경과한 초 단위 시간입니다.

[eventCode]({{'/api/event/' | relative_url}}#EventCode)
: 이벤트 유형을 식별하는 16비트 코드입니다.

[subCode]({{'/api/event/' | relative_url}}#SubCode)
: 일부 이벤트 유형은 보조 정보를 제공하는 추가 8비트 코드를 가집니다.

[TNAKey](#Key)
: 인증 이벤트에 대해 선택된 T&A 키입니다. 


| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| startEventID | uint32 | 읽을 첫 번째 이벤트 로그의 ID입니다. 0이면 처음부터 로그를 읽습니다 |
| maxNumOfLog | uint32 | 읽을 로그의 최대 개수입니다. 0이면 모든 이벤트 로그를 읽으려고 시도합니다 |
| TNAEventFilter | uint32 | 아직 지원되지 않음 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| TNAEvents | [TNALog[]](#TNALog) | 장치에서 읽은 T&A 이벤트 로그 |

### GetJobCodeLog

장치에서 잡 코드가 포함된 이벤트 로그를 가져옵니다. [User.SetJobCode]({{'/api/user/' | relative_url}}#setjobcode) 또는 [User.SetJobCodeMulti]({{'/api/user/' | relative_url}}#setjobcodemulti)를 사용해 사용자 잡 코드를 구성해야 합니다. 그리고 [SystemConfig.useJobCode]({{'/api/system/' | relative_url}}#SystemConfig)가 true여야 합니다. 

```protobuf
message JobCodeLog {
  uint32 ID;
  uint32 timestamp;
  uint32 deviceID;
  string userID;
  uint32 eventCode;
  uint32 subCode;
  uint32 jobCode;
}
```
{: #JobCodeLog}

ID
: 로그 레코드의 4바이트 식별자입니다. 각 장치는 이 식별자에 대해 단조 증가하는 카운터를 관리합니다. 장치에서 로그를 읽을 때 이 값을 사용해 시작 위치를 지정할 수 있습니다.

timestamp
: Unix 시간 형식입니다. 1970년 1월 1일부터 경과한 초 단위 시간입니다.

[eventCode]({{'/api/event/' | relative_url}}#EventCode)
: 이벤트 유형을 식별하는 16비트 코드입니다.

[subCode]({{'/api/event/' | relative_url}}#SubCode)
: 일부 이벤트 유형은 보조 정보를 제공하는 추가 8비트 코드를 가집니다.

[jobCode](#JobCode)
: 사용자가 인증 이벤트에 대해 선택한 잡 코드입니다. 

```protobuf
message JobCode {
  uint32 code = 1;
  string label = 2;
}
```
{: #JobCode}

code
: 4바이트 부호 없는 코드입니다. 

label
: UTF-8 인코딩으로 최대 16자입니다.



| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| startEventID | uint32 | 읽을 첫 번째 이벤트 로그의 ID입니다. 0이면 처음부터 로그를 읽습니다  |
| maxNumOfLog | uint32 | 읽을 로그의 최대 개수입니다. 0이면 모든 이벤트 로그를 읽으려고 시도합니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| jobCodeEvents | [JobCodeLog[]](#JobCodeLog) | 장치에서 읽은 잡 코드 이벤트 로그  |
