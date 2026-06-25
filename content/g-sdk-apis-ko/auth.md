---
title: "Authentication API"
toc_label: "Authentication"  
---

[AuthConfig](#AuthConfig)를 사용하면 자격 증명 인증과 관련된 옵션을 지정할 수 있습니다. 가장 중요한 옵션은 __authSchedules__로, 장치에서 사용할 수 있는 인증 모드를 설정합니다. 

## Config

```protobuf
message AuthConfig {
  repeated AuthSchedule authSchedules;
  bool useGlobalAPB;
  GlobalAPBFailActionType globalAPBFailAction;
  bool useGroupMatching;
  bool usePrivateAuth;
  FaceDetectionLevel faceDetectionLevel;
  bool useServerMatching;
  bool useFullAccess;
  uint32 matchTimeout;
  uint32 authTimeout;
  repeated Operator operators;
}
```
{: #AuthConfig}

[authSchedules](#AuthSchedule)
: 장치에서 사용할 수 있는 인증 모드입니다. 

useGlobalAPB
: true이면, 인증에 성공한 후 사용자의 출입 허용 여부를 게이트웨이에 문의합니다.

[globalAPBFailAction](#GlobalAPBFailActionType)
: __useGlobalAPB__가 true일 때 게이트웨이에 연결할 수 없는 경우 수행할 동작을 지정합니다.

useGroupMatching
: true이면, 얼굴 인증에 그룹 매칭을 사용합니다. FaceStation 2와 FaceLite에서만 유효합니다. [AuthGroup]({{'/api/face/' | relative_url }}#auth-group)을 참조하십시오.

usePrivateAuth
: true이면, 사용자마다 서로 다른 인증 모드를 허용합니다. 개별 인증 모드는 [User.UserSetting]({{'/api/user/' | relative_url}}#UserSetting)에서 설정할 수 있습니다.

[faceDetectionLevel](#FaceDetectionLevel)
: FACE_DETECTION_NONE이 아니면, 사용자가 인증에 성공한 후 장치가 얼굴을 감지하려고 시도합니다. BioStation A2에서만 유효합니다.

useServerMatching
: true이면, 인증을 게이트웨이에 위임합니다. 사용자가 지문이나 카드를 스캔하면 장치가 해당 정보를 게이트웨이로 전송하고 인증 결과를 기다립니다.

useFullAccess
: true이면, 액세스 그룹과 관계없이 등록된 모든 사용자의 출입을 허용합니다.

matchTimeout
: 지문 또는 얼굴 매칭에 대한 시간 초과 값(초)입니다.

authTimeout
: 전체 인증 프로세스에 대한 시간 초과 값(초)입니다.

[operators](#Operator)
: 한 장치에 최대 10명의 관리자를 지정할 수 있습니다. 


```protobuf
message AuthSchedule {
  AuthMode mode;
  uint32 scheduleID;
}
```
{: #AuthSchedule}

스케줄별로 서로 다른 인증 모드를 설정할 수 있습니다. 예를 들어, 근무 시간에는 AUTH_MODE_CARD_ONLY를 허용하고, 야간에는 보안이 더 강화된 AUTH_MODE_CARD_BIOMETRIC을 설정할 수 있습니다.

mode
: [인증 모드](#AuthMode)

scheduleID
: 해당 모드가 적용되는 스케줄의 ID입니다. [Schedule]({{'/api/schedule/' | relative_url}}#Schedule)을 참조하십시오.

```protobuf
enum AuthMode {
  AUTH_MODE_BIOMETRIC_ONLY = 0;
  AUTH_MODE_BIOMETRIC_PIN = 1;

  AUTH_MODE_CARD_ONLY = 2;
  AUTH_MODE_CARD_BIOMETRIC = 3;
  AUTH_MODE_CARD_PIN = 4;
  AUTH_MODE_CARD_BIOMETRIC_OR_PIN = 5;
  AUTH_MODE_CARD_BIOMETRIC_PIN = 6;

  AUTH_MODE_ID_BIOMETRIC = 7;
  AUTH_MODE_ID_PIN = 8;
  AUTH_MODE_ID_BIOMETRIC_OR_PIN = 9;
  AUTH_MODE_ID_BIOMETRIC_PIN = 10;

  AUTH_MODE_NONE = 0xff;
  AUTH_MODE_PROHIBITED = 0xfe;

  // The below modes are only for RGB-based visual face authentication devices
  AUTH_EXT_MODE_FACE_ONLY = 11;
  AUTH_EXT_MODE_FACE_FINGERPRINT = 12;
  AUTH_EXT_MODE_FACE_PIN = 13;
  AUTH_EXT_MODE_FACE_FINGERPRINT_OR_PIN = 14;
  AUTH_EXT_MODE_FACE_FINGERPRINT_PIN = 15;

  AUTH_EXT_MODE_FINGERPRINT_ONLY = 16;
  AUTH_EXT_MODE_FINGERPRINT_FACE = 17;
  AUTH_EXT_MODE_FINGERPRINT_PIN = 18;
  AUTH_EXT_MODE_FINGERPRINT_FACE_OR_PIN = 19;
  AUTH_EXT_MODE_FINGERPRINT_FACE_PIN = 20;

  AUTH_EXT_MODE_CARD_ONLY = 21;
  AUTH_EXT_MODE_CARD_FACE = 22;
  AUTH_EXT_MODE_CARD_FINGERPRINT = 23;
  AUTH_EXT_MODE_CARD_PIN = 24;
  AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT = 25;
  AUTH_EXT_MODE_CARD_FACE_OR_PIN = 26;
  AUTH_EXT_MODE_CARD_FINGERPRINT_OR_PIN = 27;
  AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT_OR_PIN = 28;
  AUTH_EXT_MODE_CARD_FACE_FINGERPRINT = 29;
  AUTH_EXT_MODE_CARD_FACE_PIN = 30;
  AUTH_EXT_MODE_CARD_FINGERPRINT_FACE = 31;
  AUTH_EXT_MODE_CARD_FINGERPRINT_PIN = 32;
  AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT_PIN = 33;
  AUTH_EXT_MODE_CARD_FACE_FINGERPRINT_OR_PIN = 34;
  AUTH_EXT_MODE_CARD_FINGERPRINT_FACE_OR_PIN = 35;

  AUTH_EXT_MODE_ID_FACE = 36;
  AUTH_EXT_MODE_ID_FINGERPRINT = 37;
  AUTH_EXT_MODE_ID_PIN = 38;
  AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT = 39;
  AUTH_EXT_MODE_ID_FACE_OR_PIN = 40;
  AUTH_EXT_MODE_ID_FINGERPRINT_OR_PIN = 41;
  AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT_OR_PIN = 42;
  AUTH_EXT_MODE_ID_FACE_FINGERPRINT = 43;
  AUTH_EXT_MODE_ID_FACE_PIN = 44;
  AUTH_EXT_MODE_ID_FINGERPRINT_FACE = 45;
  AUTH_EXT_MODE_ID_FINGERPRINT_PIN = 46;
  AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT_PIN = 47;
  AUTH_EXT_MODE_ID_FACE_FINGERPRINT_OR_PIN = 48;
  AUTH_EXT_MODE_ID_FINGERPRINT_FACE_OR_PIN = 49;  
}
```
{: #AuthMode}

### Authentication mode

AUTH_MODE_BIOMETRIC_ONLY
: 지문 또는 얼굴

AUTH_MODE_BIOMETRIC_PIN
: (지문 또는 얼굴) + PIN

AUTH_MODE_CARD_ONLY
: 카드

AUTH_MODE_CARD_BIOMETRIC
: 카드 + (지문 또는 얼굴)

AUTH_MODE_CARD_PIN
: 카드 + PIN

AUTH_MODE_CARD_BIOMETRIC_OR_PIN
: 카드 + (지문 또는 얼굴 또는 PIN)

AUTH_MODE_CARD_BIOMETRIC_PIN
: 카드 + (지문 또는 얼굴) + PIN

AUTH_MODE_ID_BIOMETRIC
: ID + (지문 또는 얼굴)

AUTH_MODE_ID_PIN
: ID + PIN

AUTH_MODE_ID_BIOMETRIC_OR_PIN
: ID + (지문 또는 얼굴 또는 PIN)

AUTH_MODE_ID_BIOMETRIC_PIN
: ID + (지문 또는 얼굴) + PIN

일부 인증 모드는 특정 장치에서만 사용할 수 있습니다. 예를 들어, __AUTH_MODE_ID_XXX__ 모드는 BioStation N2 및 BioStation 2와 같이 키패드가 있는 장치에서만 사용할 수 있습니다. 
{: .notice--warning}

### Authentication mode for RGB-based visual face authentication devices

일부 RGB 기반 비주얼 얼굴 인증 장치 모델은 얼굴 인증과 지문 인증을 모두 제공합니다. 이러한 멀티모달 기능을 최대한 활용하기 위해, RGB 기반 비주얼 얼굴 인증 장치를 위한 새로운 인증 모드 집합인 __AUTH_EXT_MODE_XXX__가 채택되었습니다. 하위 호환성이 없다는 점에 유의하십시오. 이 모드는 RGB 기반 비주얼 얼굴 인증 장치에서만 사용해야 합니다. 

AUTH_EXT_MODE_FACE_ONLY
: 얼굴 

AUTH_EXT_MODE_FACE_FINGERPRINT
: 얼굴 + 지문

AUTH_EXT_MODE_FACE_PIN
: 얼굴 + PIN 

AUTH_EXT_MODE_FACE_FINGERPRINT_OR_PIN
: 얼굴 + (지문 또는 PIN)

AUTH_EXT_MODE_FACE_FINGERPRINT_PIN
: 얼굴 + 지문 + PIN

AUTH_EXT_MODE_FINGERPRINT_ONLY
: 지문 

AUTH_EXT_MODE_FINGERPRINT_FACE
: 지문 + 얼굴

AUTH_EXT_MODE_FINGERPRINT_PIN
: 지문 + PIN

AUTH_EXT_MODE_FINGERPRINT_FACE_OR_PIN
: 지문 + (얼굴 또는 PIN)

AUTH_EXT_MODE_FINGERPRINT_FACE_PIN
: 지문 + 얼굴 + PIN

AUTH_EXT_MODE_CARD_ONLY
: 카드

AUTH_EXT_MODE_CARD_FACE
: 카드 + 얼굴

AUTH_EXT_MODE_CARD_FINGERPRINT
: 카드 + 지문

AUTH_EXT_MODE_CARD_PIN
: 카드 + PIN

AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT
: 카드 + (얼굴 또는 지문)

AUTH_EXT_MODE_CARD_FACE_OR_PIN
: 카드 + (얼굴 또는 PIN)

AUTH_EXT_MODE_CARD_FINGERPRINT_OR_PIN
: 카드 + (지문 또는 PIN)

AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT_OR_PIN
: 카드 + (얼굴 또는 지문 또는 PIN)

AUTH_EXT_MODE_CARD_FACE_FINGERPRINT
: 카드 + 얼굴 + 지문

AUTH_EXT_MODE_CARD_FACE_PIN
: 카드 + 얼굴 + PIN

AUTH_EXT_MODE_CARD_FINGERPRINT_FACE
: 카드 + 지문 + 얼굴

AUTH_EXT_MODE_CARD_FINGERPRINT_PIN
: 카드 + 지문 + PIN

AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT_PIN
: 카드 + (얼굴 또는 지문) + PIN

AUTH_EXT_MODE_CARD_FACE_FINGERPRINT_OR_PIN
: 카드 + 얼굴 + (지문 또는 PIN)

AUTH_EXT_MODE_CARD_FINGERPRINT_FACE_OR_PIN
: 카드 + 지문 + (얼굴 또는 PIN)

AUTH_EXT_MODE_ID_FACE
: ID + 얼굴

AUTH_EXT_MODE_ID_FINGERPRINT
: ID + 지문

AUTH_EXT_MODE_ID_PIN
: ID + PIN

AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT
: ID + (얼굴 또는 지문)

AUTH_EXT_MODE_ID_FACE_OR_PIN
: ID + (얼굴 또는 PIN)

AUTH_EXT_MODE_ID_FINGERPRINT_OR_PIN
: ID + (지문 또는 PIN)

AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT_OR_PIN
: ID + (얼굴 또는 지문 또는 PIN)

AUTH_EXT_MODE_ID_FACE_FINGERPRINT
: ID + 얼굴 + 지문

AUTH_EXT_MODE_ID_FACE_PIN
: ID + 얼굴 + PIN

AUTH_EXT_MODE_ID_FINGERPRINT_FACE
: ID + 지문 + 얼굴

AUTH_EXT_MODE_ID_FINGERPRINT_PIN
: ID + 지문 + PIN

AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT_PIN
: ID + (얼굴 또는 지문) + PIN

AUTH_EXT_MODE_ID_FACE_FINGERPRINT_OR_PIN
: ID + 얼굴 + (지문 또는 PIN)

AUTH_EXT_MODE_ID_FINGERPRINT_FACE_OR_PIN
: ID + 지문 + (얼굴 또는 PIN)

```protobuf
enum FaceDetectionLevel {
  FACE_DETECTION_NONE = 0;
  FACE_DETECTION_NORMAL = 1;
  FACE_DETECTION_STRICT = 2;
}
```
{: #FaceDetectionLevel}

FACE_DETECTION_NONE
: 얼굴 감지를 사용하지 않습니다.

FACE_DETECTION_NORMAL
: 일반 감지 레벨을 사용합니다.

FACE_DETECTION_STRICT 
: 엄격 감지 레벨을 사용합니다.

얼굴 감지는 얼굴 인증과 다르다는 점에 유의하십시오. 이 옵션은 BioStation A2에만 적용됩니다. FaceStation 2와 FaceLite는 이 옵션을 사용하지 않습니다. 
{: .notice--warning}


```protobuf
enum GlobalAPBFailActionType {
  GLOBAL_APB_FAIL_ACTION_NONE = 0;
  GLOBAL_APB_FAIL_ACTION_SOFT = 1;
  GLOBAL_APB_FAIL_ACTION_HARD = 2;
}
```
{: #GlobalAPBFailActionType}

Global APB는 사용자의 도어 출입 허용 여부를 판단하기 위해 게이트웨이가 필요합니다. 장치가 서버에 연결할 수 없는 경우, 이 매개변수에 따라 장치가 스스로 결정합니다.

GLOBAL_APB_FAIL_ACTION_NONE
: 출입을 허용합니다.

GLOBAL_APB_FAIL_ACTION_SOFT
: 출입을 허용하되, APB 위반을 나타내는 로그 기록을 작성합니다.

GLOBAL_APB_FAIL_ACTION_HARD
: 출입을 거부하고 APB 위반을 나타내는 로그 기록을 작성합니다.


```protobuf
enum OperatorLevel {
  OPERATOR_LEVEL_NONE = 0;
  OPERATOR_LEVEL_ADMIN = 1;
  OPERATOR_LEVEL_CONFIG = 2;
  OPERATOR_LEVEL_USER = 3;
}
```
{: #OperatorLevel}

장치 관리를 위해 관리자를 지정할 수 있습니다. 각 관리자는 세 가지 운영자 레벨 중 하나를 가지며, 레벨마다 서로 다른 권한을 갖습니다. 

OPERATOR_LEVEL_ADMIN
: 장치의 모든 관리 작업을 수행할 수 있습니다.

OPERATOR_LEVEL_CONFIG
: 장치의 구성을 변경할 수 있습니다.

OPERATOR_LEVEL_USER
: 장치에서 사용자를 등록/삭제할 수 있습니다.


```protobuf
message Operator {
  string userID;
  OperatorLevel level;
}
```
{: #Operator}


### GetConfig

장치의 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [AuthConfig](#AuthConfig) | 장치의 인증 구성  |

### SetConfig

장치의 구성을 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [AuthConfig](#AuthConfig) | 장치에 설정할 인증 구성 |

### SetConfigMulti

여러 장치의 구성을 설정합니다.

RGB 기반 비주얼 얼굴 인증 장치는 자체적인 인증 모드를 가지므로, 다른 모델과 혼용할 수 없습니다. 
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [AuthConfig](#AuthConfig) | 장치들에 설정할 인증 구성 |
