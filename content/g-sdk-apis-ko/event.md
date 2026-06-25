---
title: "Event API"
toc_label: "Event"  
---

## Log

```protobuf
message EventLog {
  uint32 ID;
  uint32 timestamp;
  uint32 deviceID;
  string userID;
  uint32 entityID;
  uint32 eventCode;
  uint32 subCode;
  tna.Key TNAKey;
  bool hasImage;
  bool changedOnDevice;
  uint32 temperature;
  bytes cardData;
  DetectInputInfo inputInfo;
  AlarmZoneInfo alarmZoneInfo;
  InterlockZoneInfo interlockZoneInfo;
}
```
{: #EventLog}

ID
: 로그 레코드의 4바이트 식별자입니다. 각 장치는 이 식별자에 대해 단조 증가하는 카운터를 관리합니다. 이 값을 사용하여 장치에서 로그를 읽을 때 시작 위치를 지정할 수 있습니다.

timestamp
: Unix 시간 형식입니다. 1970년 1월 1일 이후 경과한 초의 수입니다.

userID/entityID
: __EVENT_VERIFY_SUCCESS__ 또는 __EVENT_USER_ENROLL_SUCCESS__ 와 같은 사용자 관련 이벤트의 경우 __userID__ 가 설정됩니다. 다른 유형의 이벤트의 경우 __entity_ID__ 는 도어 ID 또는 존 ID 중 하나일 수 있습니다. 

eventCode
: 이벤트 유형을 식별하는 16비트 코드입니다.

  | Category | Code | Value | Description |
  | -------- | ---- | ------| ----------- |
  | Auth | BS2_EVENT_VERIFY_SUCCESS | 0x1000 | 1:1 인증 성공 | 
  || BS2_EVENT_VERIFY_FAIL | 0x1100 | 1:1 인증 실패 | 
  || BS2_EVENT_VERIFY_DURESS | 0x1200 | 강요 상황에서의 1:1 인증 성공 |
  || BS2_EVENT_IDENTIFY_SUCCESS | 0x1300 | 1:N 인증 성공 |
  || BS2_EVENT_IDENTIFY_FAIL | 0x1400 | 1:N 인증 실패 |
  || BS2_EVENT_IDENTIFY_DURESS | 0x1500 | 강요 상황에서의 1:N 인증 성공 |
  || BS2_EVENT_DUAL_AUTH_SUCCESS | 0x1600 | 이중 인증 성공 |
  || BS2_EVENT_DUAL_AUTH_FAIL | 0x1700 | 이중 인증 실패 |
  || BS2_EVENT_AUTH_FAILED | 0x1800 | 등록되지 않은 자격 증명 |
  || BS2_EVENT_ACCESS_DENIED | 0x1900 | 출입 권한이 없는 사용자 또는 존 규칙 위반 |
  || BS2_EVENT_FAKE_FINGER_DETECTED | 0x1A00 | 위조 지문 감지 |
  | User | BS2_EVENT_USER_ENROLL_SUCCESS | 0x2000 | 사용자 등록 성공 |
  || BS2_EVENT_USER_ENROLL_FAIL | 0x2100 | 사용자 등록 실패 |
  || BS2_EVENT_USER_UPDATE_SUCCESS | 0x2200 | 사용자 수정 성공 |
  || BS2_EVENT_USER_UPDATE_FAIL | 0x2300 | 사용자 수정 실패 |
  || BS2_EVENT_USER_DELETE_SUCCESS | 0x2400 | 사용자 삭제 성공 |
  || BS2_EVENT_USER_DELETE_FAIL | 0x2500 | 사용자 삭제 실패 |
  || BS2_EVENT_USER_DELETE_ALL_SUCCESS | 0x2600 | 전체 사용자 삭제 성공 |
  || BS2_EVENT_USER_ISSUE_AOC_SUCCESS | 0x2700 | AOC 카드 발급 성공 | 
  || BS2_EVENT_USER_DUPLICATE_CREDENTIAL | 0x2800 | 중복된 자격 증명 |
  | Device | BS2_EVENT_DEVICE_SYSTEM_RESET | 0x3000 | 시스템 리셋 |
  || BS2_EVENT_DEVICE_SYSTEM_STARTED | 0x3100 | 시스템 시작 |
  || BS2_EVENT_DEVICE_TIME_SET | 0x3200 | 시스템 시간 설정 |
  || BS2_EVENT_DEVICE_TIMEZONE_SET | 0x3201 | 타임존 변경 |
  || BS2_EVENT_DEVICE_DST_SET | 0x3202 | DST 변경 |
  || BS2_EVENT_DEVICE_LINK_CONNECTED | 0x3300 | LAN 케이블 연결 |
  || BS2_EVENT_DEVICE_LINK_DISCONNECTED | 0x3400 | LAN 케이블 연결 해제 |
  || BS2_EVENT_DEVICE_DHCP_SUCCESS | 0x3500 | DHCP에 의한 IP 주소 획득 |
  || BS2_EVENT_DEVICE_ADMIN_MENU | 0x3600 | 관리자 메뉴 진입 |
  || BS2_EVENT_DEVICE_UI_LOCKED | 0x3700 | 장치 잠금 |
  || BS2_EVENT_DEVICE_UI_UNLOCKED | 0x3800 | 장치 잠금 해제 |
  || BS2_EVENT_DEVICE_TCP_CONNECTED | 0x3B00 | TCP 연결 |
  || BS2_EVENT_DEVICE_TCP_DISCONNECTED | 0x3C00 | TCP 연결 해제 |
  || BS2_EVENT_DEVICE_RS485_CONNECTED | 0x3D00 | RS485 연결 |
  || BS2_EVENT_DEVICE_RS485_DISCONNECTED | 0x3E00 | RS485 연결 해제 |
  || BS2_EVENT_DEVICE_INPUT_DETECTED | 0x3F00 | 입력 신호 감지 |
  || BS2_EVENT_DEVICE_TAMPER_ON | 0x4000 | 탬퍼 스위치 켜짐 |
  || BS2_EVENT_DEVICE_TAMPER_OFF | 0x4100 | 탬퍼 스위치 꺼짐 |
  || BS2_EVENT_DEVICE_EVENT_LOG_CLEARED | 0x4200 | 로그 레코드 삭제 |
  || BS2_EVENT_DEVICE_FIRMWARE_UPGRADED | 0x4300 | 펌웨어 업그레이드 |
  || BS2_EVENT_DEVICE_RESOURCE_UPGRADED | 0x4400 | 리소스 업그레이드 |
  || BS2_EVENT_DEVICE_CONFIG_RESET | 0x4500 | 시스템 설정 초기화(네트워크 포함) |
  || BS2_EVENT_DEVICE_DATABASE_RESET | 0x4501 | 데이터베이스 초기화 |
  || BS2_EVENT_DEVICE_FACTORY_RESET | 0x4502 | 공장 초기화 |
  || BS2_EVENT_DEVICE_CONFIG_RESET_EX | 0x4503 | 시스템 설정 초기화(네트워크 제외) |
  || BS2_EVENT_SUPERVISED_INPUT_SHORT | 0x4600 | 슈퍼바이즈드 입력의 단락 감지 |
  || BS2_EVENT_SUPERVISED_INPUT_OPEN | 0x4700 | 슈퍼바이즈드 입력의 연결 끊김 감지 |
  | Door | BS2_EVENT_DOOR_UNLOCKED | 0x5000 | 도어 잠금 해제됨 |
  || BS2_EVENT_DOOR_LOCKED | 0x5100 | 도어 잠김 |
  || BS2_EVENT_DOOR_OPENED | 0x5200 | 센서로 도어 열림 감지 |
  || BS2_EVENT_DOOR_CLOSED | 0x5300 | 센서로 도어 닫힘 감지 |
  || BS2_EVENT_DOOR_FORCED_OPEN | 0x5400 | 도어 강제 열림 |
  || BS2_EVENT_DOOR_HELD_OPEN | 0x5500 | 도어가 너무 오래 열려 있음 |
  || BS2_EVENT_DOOR_FORCED_OPEN_ALARM | 0x5600 | 강제 열림 경보 |
  || BS2_EVENT_DOOR_FORCED_OPEN_ALARM_CLEAR | 0x5700 | 강제 열림 경보 해제됨 |
  || BS2_EVENT_DOOR_HELD_OPEN_ALARM | 0x5800 | 열림 유지 경보 | 
  || BS2_EVENT_DOOR_HELD_OPEN_ALARM_CLEAR | 0x5900 | 열림 유지 경보 해제됨 | 
  || BS2_EVENT_DOOR_APB_ALARM | 0x5A00 | 도어의 안티패스백 경보 |
  || BS2_EVENT_DOOR_APB_ALARM_CLEAR | 0x5B00 | 도어의 안티패스백 경보 해제됨 |
  || BS2_EVENT_DOOR_RELEASE | 0x5C00 | 도어 상태 리셋 |
  || BS2_EVENT_DOOR_LOCK | 0x5D00 | 도어 잠금 |
  || BS2_EVENT_DOOR_UNLOCK | 0x5E00 | 도어 잠금 해제 |
  | Zone | BS2_EVENT_ZONE_APB_VIOLATION | 0x6000 | APB 존 위반 |
  || BS2_EVENT_ZONE_APB_ALARM | 0x6100 | APB 존 경보 |
  || BS2_EVENT_ZONE_APB_ALARM_CLEAR | 0x6200 | APB 존 경보 해제됨 |
  || BS2_EVENT_ZONE_TIMED_APB_VIOLATION | 0x6300 | 시간 제한 APB 존 위반 |
  || BS2_EVENT_ZONE_TIMED_APB_ALARM | 0x6400 | 시간 제한 APB 존 경보 |
  || BS2_EVENT_ZONE_TIMED_APB_ALARM_CLEAR | 0x6500 | 시간 제한 APB 존 경보 해제됨 |
  || BS2_EVENT_ZONE_FIRE_ALARM_INPUT | 0x6600 | 화재 경보 입력 감지 |
  || BS2_EVENT_ZONE_FIRE_ALARM | 0x6700 | 화재 경보 |
  || BS2_EVENT_ZONE_FIRE_ALARM_CLEAR | 0x6800 | 화재 경보 해제됨 |
  || BS2_EVENT_ZONE_SCHEDULED_LOCK_VIOLATION | 0x6900 | 예약 잠금 존 위반 |
  || BS2_EVENT_ZONE_SCHEDULED_LOCK_START | 0x6A00 | 잠금 스케줄 시작 |
  || BS2_EVENT_ZONE_SCHEDULED_LOCK_END | 0x6B00 | 잠금 스케줄 종료 |
  || BS2_EVENT_ZONE_SCHEDULED_UNLOCK_START | 0x6C00 | 잠금 해제 스케줄 시작 |
  || BS2_EVENT_ZONE_SCHEDULED_UNLOCK_END | 0x6D00 | 잠금 해제 스케줄 종료 |
  || BS2_EVENT_ZONE_SCHEDULED_LOCK_ALARM | 0x6E00 | 예약 잠금 존 경보 |
  || BS2_EVENT_ZONE_SCHEDULED_LOCK_ALARM_CLEAR | 0x6F00 | 예약 잠금 존 경보 해제됨 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_VIOLATION | 0x9000 | 침입 존 위반 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_ARM_GRANTED | 0x9100 | 침입 존 경계 설정 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_ARM_SUCCESS | 0x9200 | 침입 존 경계 설정됨 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_ARM_FAIL | 0x9300 | 침입 존 경계 설정 실패 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_DISARM_GRANTED | 0x9400 | 침입 존 경계 해제 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_DISARM_SUCCESS | 0x9500 | 침입 존 경계 해제됨 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_DISARM_FAIL | 0x9600 | 침입 존 경계 해제 실패 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM | 0x9800 | 침입 경보 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_CLEAR | 0x9900 | 침입 경보 해제됨 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_ARM_DENIED | 0x9A00 | 침입 존 경계 설정 거부됨 |
  || BS2_EVENT_ZONE_INTRUSION_ALARM_DISARM_DENIED | 0x9B00 | 침입 존 경계 해제 거부됨 |
  | Lift | BS2_EVENT_FLOOR_ACTIVATED | 0x7000 | 층 활성화됨 |
  || BS2_EVENT_FLOOR_DEACTIVATED | 0x7100 | 층 비활성화됨 |
  || BS2_EVENT_FLOOR_RELEASE | 0x7200 | 층 상태 리셋 |
  || BS2_EVENT_FLOOR_ACTIVATE | 0x7300 | 층 활성화 |
  || BS2_EVENT_FLOOR_DEACTIVATE | 0x7400 | 층 비활성화 |
  || BS2_EVENT_LIFT_ALARM_INPUT | 0x7500 | 리프트 경보 입력 감지 |
  || BS2_EVENT_LIFT_ALARM | 0x7600 | 리프트 경보 |
  || BS2_EVENT_LIFT_ALARM_CLEAR | 0x7700 | 리프트 경보 해제됨 |
  || BS2_EVENT_ALL_FLOOR_ACTIVATED | 0x7800 | 전체 층 활성화됨 |
  || BS2_EVENT_ALL_FLOOR_DEACTIVATED | 0x7900 | 전체 층 비활성화됨 |
  {: #EventCode}

subCode
: 일부 이벤트 유형에는 보조 정보를 제공하는 추가 8비트 코드가 있습니다. 예를 들어 __BS2_EVENT_VERIFY_XXXX__ 이벤트에는 인증 모드를 나타내는 서브 코드가 있습니다. __eventCode__ 가 BS2_EVENT_VERIFY_SUCCESS이고 __subCode__ 가 BS2_SUB_EVENT_VERIFY_CARD_FINGER이면, 사용자가 카드 + 지문으로 성공적으로 인증했음을 의미합니다.

  | Category | Code | Value | Description |
  | -------- | ---- | ------| ----------- |
  | Verify | BS2_SUB_EVENT_VERIFY_ID_PIN | 0x01 | ID + PIN |
  || BS2_SUB_EVENT_VERIFY_ID_FINGER | 0x02 | ID + 지문 |
  || BS2_SUB_EVENT_VERIFY_ID_FINGER_PIN | 0x03 | ID + 지문 + PIN |
  || BS2_SUB_EVENT_VERIFY_ID_FACE | 0x04 | ID + 얼굴 |
  || BS2_SUB_EVENT_VERIFY_ID_FACE_PIN | 0x05 | ID + 얼굴 + PIN |
  || BS2_SUB_EVENT_VERIFY_CARD | 0x06 | 카드 전용 |
  || BS2_SUB_EVENT_VERIFY_CARD_PIN | 0x07 | 카드 + PIN |
  || BS2_SUB_EVENT_VERIFY_CARD_FINGER | 0x08 | 카드 + 지문 |
  || BS2_SUB_EVENT_VERIFY_CARD_FINGER_PIN | 0x09 | 카드 + 지문 + PIN |
  || BS2_SUB_EVENT_VERIFY_CARD_FACE | 0x0A | 카드 + 얼굴 |
  || BS2_SUB_EVENT_VERIFY_CARD_FACE_PIN | 0x0B | 카드 + 얼굴 + PIN |
  || BS2_SUB_EVENT_VERIFY_AOC | 0x0C | AOC 카드 |
  || BS2_SUB_EVENT_VERIFY_AOC_PIN | 0x0D | AOC 카드 + PIN |
  || BS2_SUB_EVENT_VERIFY_AOC_FINGER | 0x0E | AOC 카드 + 지문 |
  || BS2_SUB_EVENT_VERIFY_AOC_FINGER_PIN | 0x0F | AOC 카드 + 지문 + PIN |
  || BS2_SUB_EVENT_VERIFY_CARD_FACE_FINGER | 0x10 | 카드 + 얼굴 + 지문 |
  || BS2_SUB_EVENT_VERIFY_CARD_FINGER_FACE | 0x11 | 카드 + 지문 + 얼굴 |
  || BS2_SUB_EVENT_VERIFY_ID_FACE_FINGER | 0x12 | ID + 얼굴 + 지문 |
  || BS2_SUB_EVENT_VERIFY_ID_FINGER_FACE | 0x13 | ID + 지문 + 얼굴 |
  | Identify | BS2_SUB_EVENT_IDENTIFY_FINGER | 0x01 | 지문 전용 |
  || BS2_SUB_EVENT_IDENTIFY_FINGER_PIN | 0x02 | 지문 + PIN |
  || BS2_SUB_EVENT_IDENTIFY_FACE | 0x03 | 얼굴 전용 |
  || BS2_SUB_EVENT_IDENTIFY_FACE_PIN | 0x04 | 얼굴 + PIN |
  || BS2_SUB_EVENT_IDENTIFY_FACE_FINGER | 0x05 | 얼굴 + 지문 |
  || BS2_SUB_EVENT_IDENTIFY_FACE_FINGER_PIN | 0x06 | 얼굴 + 지문 + PIN |
  || BS2_SUB_EVENT_IDENTIFY_FINGER_FACE | 0x07 | 지문 + 얼굴 |
  || BS2_SUB_EVENT_IDENTIFY_FINGER_FACE_PIN | 0x08 | 지문 + 얼굴 + PIN |
  | Dual Auth | BS2_SUB_EVENT_DUAL_AUTH_FAIL_TIMEOUT | 0x01 | 이중 인증 타임아웃 |
  || BS2_SUB_EVENT_DUAL_AUTH_FAIL_ACCESS_GROUP | 0x02 | 이중 인증에 대한 유효하지 않은 출입 그룹 |
  | Invalid Credential | BS2_SUB_EVENT_CREDENTIAL_ID | 0x01 | 유효하지 않은 사용자 ID |
  || BS2_SUB_EVENT_CREDENTIAL_CARD | 0x02 | 유효하지 않은 카드 |
  || BS2_SUB_EVENT_CREDENTIAL_PIN | 0x03 | 유효하지 않은 PIN |
  || BS2_SUB_EVENT_CREDENTIAL_FINGER | 0x04 | 유효하지 않은 지문 |
  || BS2_SUB_EVENT_CREDENTIAL_FACE | 0x05 | 유효하지 않은 얼굴 |
  || BS2_SUB_EVENT_CREDENTIAL_AOC_PIN | 0x06 | 유효하지 않은 AOC PIN |
  || BS2_SUB_EVENT_CREDENTIAL_AOC_FINGER | 0x07 | 유효하지 않은 AOC 지문 |
  | Auth Fail | BS2_SUB_EVENT_AUTH_FAIL_INVALID_AUTH_MODE | 0x01 | 유효하지 않은 인증 모드 |
  || BS2_SUB_EVENT_AUTH_FAIL_INVALID_CREDENTIAL | 0x02 | 유효하지 않은 자격 증명 |
  || BS2_SUB_EVENT_AUTH_FAIL_TIMEOUT | 0x03 | 인증 타임아웃 |
  | Access Denied | BS2_SUB_EVENT_ACCESS_DENIED_ACCESS_GROUP | 0x01 | 유효하지 않은 출입 그룹 |
  || BS2_SUB_EVENT_ACCESS_DENIED_DISABLED | 0x02 | 비활성화된 사용자 |
  || BS2_SUB_EVENT_ACCESS_DENIED_EXPIRED | 0x03 | 만료된 사용자 |
  || BS2_SUB_EVENT_ACCESS_DENIED_ON_BLACKLIST | 0x04 | 블랙리스트 사용자 |
  || BS2_SUB_EVENT_ACCESS_DENIED_APB | 0x05 | APB 규칙에 의한 거부 |
  || BS2_SUB_EVENT_ACCESS_DENIED_TIMED_APB | 0x06 | 시간 제한 APB 규칙에 의한 거부 |
  || BS2_SUB_EVENT_ACCESS_DENIED_SCHEDULED_LOCK | 0x07 | 예약 잠금 존에 의한 거부 |
  || BS2_SUB_EVENT_ACCESS_DENIED_FACE_DETECTION | 0x0A | 얼굴 미감지 |
  || BS2_SUB_EVENT_ACCESS_DENIED_FAKE_FINGER | 0x0C | 위조 지문 감지 |
  || BS2_SUB_EVENT_ACCESS_DENIED_INTRUSION_ALARM | 0x0E | 침입 경보 존에 의한 거부 |
  || BS2_SUB_EVENT_ACCESS_DENIED_INTRUSION_ALARM | 0x0E | 침입 경보 존에 의한 거부 |
  || BS2_SUB_EVENT_ACCESS_DENIED_INTERLOCK | 0x0F | 인터록 존에 의한 거부 |
  || BS2_SUB_EVENT_ACCESS_DENIED_HIGH_TEMPERATURE | 0x13 | 너무 높은 온도 |
  || BS2_SUB_EVENT_ACCESS_DENIED_UNMASKED_FACE | 0x15 | 마스크 미착용 |
   {: #SubCode}

TNAKey
: 인증 이벤트에 대해 T&A 키가 선택되면 이 필드가 해당 키로 설정됩니다. [TNA.Key]({{'/api/tna/' | relative_url}}#Key)를 참고하십시오.

hasImage
: 이벤트에 관련된 이미지 로그가 있으면 True입니다. [GetImageLog](#getimagelog)를 사용하여 이미지 로그를 읽을 수 있습니다.

changedOnDevice
: 사용자가 장치에서 등록, 변경 또는 삭제되었으면 True입니다. 

temperature
: 사용자의 온도입니다. 관련 옵션은 [Thermal API]({{'/api/thermal/' | relative_url}})를 참고하십시오.

cardData
: [eventCode](#EventCode)가 BS2_EVENT_VERIFY_FAIL이고 [subCode](#SubCode)가 BS2_SUB_EVENT_CREDENTIAL_CARD인 경우, 이 필드에는 실패한 카드 데이터가 들어 있습니다.

[inputInfo](#DetectInputInfo)
: [eventCode](#EventCode)가 BS2_EVENT_DEVICE_INPUT_DETECTED, BS2_EVENT_SUPERVISED_INPUT_SHORT 또는 BS2_EVENT_SUPERVISED_INPUT_OPEN인 경우, 입력 포트에 대한 추가 정보가 들어 있습니다.

[alarmZoneInfo](#AlarmZoneInfo)
: [eventCode](#EventCode)가 BS2_EVENT_ZONE_INTRUSION_ALARM_ARM_FAIL 또는 BS2_EVENT_ZONE_INTRUSION_ALARM인 경우, 경보 존에 대한 추가 정보가 들어 있습니다.

[interlockZoneInfo](#InterlockZoneInfo)
: [eventCode](#EventCode)가 BS2_EVENT_ZONE_INTERLOCK_VIOLATION인 경우, 인터록 존에 대한 추가 정보가 들어 있습니다.

```protobuf
message DetectInputInfo {
  uint32 ioDeviceID;
  uint32 port;
  PortValue value;
}
```
{: #DetectInputInfo}

ioDeviceID
: 입력 포트의 장치 ID입니다.

port
: 포트의 인덱스입니다.

[value](#PortValue)
: 포트에서 감지된 값입니다.

```protobuf
enum PortValue {
  OPEN = 0;
  CLOSED = 1;
  SUPERVISED_SHORT = 2;
  SUPERVISED_OPEN = 3;
};
```
{: #PortValue}

OPEN
: 포트가 열려 있습니다.

CLOSED
: 포트가 닫혀 있습니다.

SUPERVISED_SHORT
: 슈퍼바이즈드 포트가 단락되어 있습니다. 

SUPERVISED_OPEN
: 슈퍼바이즈드 포트가 열려 있습니다.

```protobuf
message AlarmZoneInfo {
  uint32 zoneID;
  uint32 doorID;
  uint32 ioDeviceID;
  uint32 port;
}
```
{: #AlarmZoneInfo}

```protobuf
message InterlockZoneInfo {
  uint32 zoneID;
  repeated uint32 doorIDs; 
}
```
{: #InterlockZoneInfo}


### GetLog

장치에서 이벤트 로그를 읽습니다. __startEventID__ 와 __maxNumOfLog__ 를 사용하여 검색 범위를 제한할 수 있습니다. T&A 전용 API는 [T&A API]({{'/api/tna' | relative_url}}#event)를 참고하십시오.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| startEventID | uint32 | 읽을 첫 번째 이벤트 로그의 ID입니다. 0이면 처음부터 로그를 읽습니다 |
| maxNumOfLog | uint32 | 읽을 로그의 최대 개수입니다. 0이면 모든 이벤트 로그를 읽으려고 시도합니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| events | [EventLog[]](#EventLog) | 장치에서 읽은 이벤트 로그 |

### [Deprecated] GetLogWithFilter   <!--Deprecated. 2024.04.25  by charlie-->

<!-- You can filter the event logs to be read by setting [EventFilter](#EventFilter). For example, to read events of a specific user, you can set __EventFilter.userID__.

```protobuf
message EventFilter {
  string userID;
  uint32 startTime;
  uint32 endTime;
  uint32 eventCode;
  tna.Key TNAKey;
}
```
{: #EventFilter}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | The ID of the device  |
| startEventID | uint32 | The ID of the first event log to be read. If it is 0, read logs from the start |
| maxNumOfLog | uint32 | The maximum number of logs to be read. If it is 0, try to read all the event logs |
| filters | [EventFilter[]](#EventFilter) | The filters to be applied to the event logs |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| events | [EventLog[]](#EventLog) | The filtered event logs read from the device | -->

***[Important]<BR>GetLog API를 사용하여 장치에서 로그를 일괄로 받고, 현재 시간 이후에 발생하는 로그는 EnableMonitoring 및 SubscribeRealtimeLog API를 사용하여 실시간으로 받는 것이 좋습니다. 이렇게 하면 서버가 모든 로그를 적절한 DBMS에 저장하고 DBMS에서 로그를 필터링할 수 있습니다.***

### ClearLog

장치에 저장된 모든 이벤트 로그를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### ClearLogMulti

여러 장치에 저장된 모든 이벤트 로그를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |


## Image log

일부 장치는 이벤트 로그 외에 이미지를 기록할 수 있습니다. 장치가 [CapabilityInfo.imageLogSupported]({{'/api/device/' | relative_url}}#CapabilityInfo)를 지원하는지 확인하십시오. [SetImageFilter](#setimagefilter)를 사용하여 이미지가 기록될 이벤트 유형을 지정해야 합니다.

```protobuf
message ImageLog {
  uint32 ID;
  uint32 timestamp;
  uint32 deviceID;
  string userID;
  uint32 eventCode;
  uint32 subCode;
  bytes JPGImage;
}
```
{: #ImageLog}


ID
: 로그 레코드의 4바이트 식별자입니다. 

timestamp
: Unix 시간 형식입니다. 1970년 1월 1일 이후 경과한 초의 수입니다.

[eventCode](#EventCode)
: 이벤트 유형을 식별하는 16비트 코드입니다.

[subCode](#SubCode)
: 일부 이벤트 유형에는 보조 정보를 제공하는 추가 8비트 코드가 있습니다.

JPGImage
: JPG 파일 형식으로 기록된 이미지입니다.


### GetImageLog

장치에서 이미지 로그를 읽습니다. __startEventID__ 와 __maxNumOfLog__ 를 사용하여 검색 범위를 제한할 수 있습니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| startEventID | uint32 | 읽을 첫 번째 이미지 로그의 ID입니다. 0이면 처음부터 로그를 읽습니다  |
| maxNumOfLog | uint32 | 읽을 로그의 최대 개수입니다. 0이면 모든 이미지 로그를 읽으려고 시도합니다. 이미지 로그는 텍스트 이벤트 로그보다 상당히 크므로, 이 파라미터를 0이 아닌 값으로 설정하는 것이 좋습니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| imageEvents | [ImageLog[]](#ImageLog) | 장치에서 읽은 이미지 로그 |

### GetImageFilter

이미지를 기록할 이벤트 유형을 지정하는 현재 이미지 필터를 가져옵니다.

```protobuf
message ImageFilter {
  uint32 eventCode; 
  uint32 scheduleID;
}
```
{: #ImageFilter}

[eventCode](#EventCode)
: 이미지가 기록될 이벤트 유형

scheduleID
: 스케줄을 지정하여 기록을 추가로 제한할 수 있습니다. [Schedule]({{'/api/schedule/' | relative_url}}#Schedule)을 참고하십시오.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| filters | [ImageFilter[]](#ImageFilter) | 장치에 설정된 필터 |

### SetImageFilter

이미지를 기록할 이벤트 유형을 지정하는 이미지 필터를 설정합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| filters | [ImageFilter[]](#ImageFilter) | 장치에 설정할 필터 |

### SetImageFilterMulti 

여러 장치에 이미지 필터를 설정합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| filters | [ImageFilter[]](#ImageFilter) | 장치들에 설정할 필터 |

## Monitoring

실시간 이벤트를 수신하려면 다음 단계를 수행해야 합니다.

1. [EnableMonitoring](#enablemonitoring) 또는 [EnableMonitoringMulti](#enablemonitoringmulti)를 사용하여 일부 장치에서 모니터링을 활성화합니다.
2. [SubscribeRealtimeLog](#subscriberealtimelog)를 사용하여 이벤트 채널을 구독합니다.

### EnableMonitoring

장치에서 모니터링을 활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### EnableMonitoringMulti

여러 장치에서 모니터링을 활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |

### DisableMonitoring

장치에서 모니터링을 비활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |


### DisableMonitoringMulti

여러 장치에서 모니터링을 비활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |

### SubscribeRealtimeLog

```protobuf
message SubscribeRealtimeLogRequest {
  int32 queueSize;
  repeated uint32 deviceIDs;
  repeated int32 eventCodes;
}
```
{: #SubscribeRealtimeLogRequest}

queueSize
: 큐가 가득 차면 게이트웨이가 실시간 이벤트를 폐기합니다. 따라서 동시 이벤트를 수신할 수 있을 만큼 충분히 커야 합니다.

deviceIDs
: 비어 있지 않으면 지정된 장치에서만 이벤트를 수신합니다.

[eventCodes](#EventCode)
: 비어 있지 않으면 지정된 이벤트만 수신합니다.

실시간 이벤트를 수신하는 방법은 선택한 언어에 따라 다릅니다. 자세한 내용은 빠른 시작 가이드를 참고하십시오. 

## Device IO States

[+ 1.9.0] 장치 I/O 포트의 상태를 확인할 수 있습니다.
* 입력/출력, 보조 입력/출력, 릴레이, 탬퍼

```protobuf
message IOStates {
  repeated PortValue states = 1;
}
```
{: #IOStates}

[states](#PortValue)
: 각 포트의 상태

```protobuf
message DeviceIOStates {
  uint32 deviceID = 1;

  IOStates input = 2;
  IOStates output = 3;
  IOStates relay = 4;
  IOStates tamper = 5;
  IOStates auxIn = 6;
  IOStates auxOut = 7;

  repeated uint32 supervisorInputPortIndex = 8;
}
```
{: #DeviceIOStates}

input
: 슈퍼바이즈드 입력 포트를 포함한 입력 포트

output
: 장치의 출력 포트 상태

relay
: 장치의 릴레이 상태

tamper
: 장치의 탬퍼 상태

auxIn
: 장치의 보조 입력 포트 상태

auxOut
: 장치의 보조 출력 포트 상태

supervisorInputPortIndex
: 나열된 입력 포트 중 어느 것이 슈퍼바이즈드 입력 포트이며 그 인덱스가 무엇인지 나타냅니다.

### GetDeviceIOStates

장치 I/O 포트의 상태를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| slaveIDs | uint32 | slaveIDs를 사용하여 장치를 식별할 수 있습니다. 이 정보가 생략되면 마스터 및 모든 슬레이브 장치의 상태가 조회됩니다. |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| states | (#DeviceIOStatus) | 장치들의 I/O 포트 상태 |
