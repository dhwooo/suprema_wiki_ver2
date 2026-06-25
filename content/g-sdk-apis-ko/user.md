---
title: "User API"
toc_label: "User"  
---

## Overview

BioStar 장치는 헤더, 인증 설정, 자격 증명 등 여러 부분으로 나누어 사용자 정보를 관리합니다.  

### User Header

사용자의 가장 기본적인 정보를 지정합니다.

```protobuf
message UserHdr {
  string ID;
  uint32 userFlag;
  int32 numOfCard;
  int32 numOfFinger;
  int32 numOfFace;
  uint32 authGroupID;
  uint32 updateMask;    // for Update(Multi)Request only
}
```
{: #UserHdr}

ID
: 최대 32바이트입니다. ID로 0은 허용되지 않습니다. 영숫자 ID의 경우, [CapabilityInfo.alphanumericIDSupported]({{'/api/device/' | relative_url}}#CapabilityInfo)를 사용하여 장치가 지원하는지 확인한 후 [SystemConfig.useAlphanumericID]({{'/api/system/' | relative_url}}#SystemConfig)를 사용하여 설정합니다.

userFlag
: 사용자 헤더에 저장되는 사용자 상태 플래그입니다. 이 값은 비트마스크입니다.

  | Value | Name | Description |
  | ----- | ---- | ----------- |
  | 0x00 | USER_FLAG_NONE | 기본 상태 |
  | 0x01 | USER_FLAG_CREATED | 사용자가 장치에 생성됨 |
  | 0x02 | USER_FLAG_UPDATED | 사용자가 장치에서 업데이트됨 |
  | 0x04 | USER_FLAG_DELETED | 사용자가 장치에서 삭제됨 (예약됨 / 아직 사용되지 않음) |
  | 0x80 | USER_FLAG_DISABLED | 사용자가 비활성화됨 |
  | 0xFF | USER_FLAG_ALL | 모든 플래그 (내부 사용자 조회 명령에서 사용) |

numOfCard
: 사용자당 최대 8개의 카드를 할당할 수 있습니다. 

numOfFinger
: 사용자당 최대 10개의 지문을 등록할 수 있습니다.

numOfFace
: 사용자당 최대 5개의 얼굴을 등록할 수 있습니다.

authGroupID
: 얼굴의 그룹 매칭에만 사용됩니다. [Face.AuthGroup]({{'/api/face/' | relative_url}}#auth-group)을 참조하십시오.

updateMask
: UpdateRequest/UpdateMultiRequest에만 사용됩니다.

### UpdateMask
```protobuf
enum UpdateMask {
  KEEP_NONE = 0x00;          // Update all fields (keep none)
  KEEP_USER_PHRASE = 0x01;   // Keep user phrase
  KEEP_USER_JOB_CODE = 0x02; // Keep user job code
  KEEP_USER_NAME = 0x04;     // Keep user name
  KEEP_USER_PHOTO = 0x08;    // Keep user photo
  KEEP_USER_PIN = 0x10;      // Keep user PIN
  KEEP_USER_CARD = 0x20;     // Keep user card data
  KEEP_USER_FINGER = 0x40;   // Keep user fingerprint data
  KEEP_USER_FACE = 0x80;     // Keep user face data
  KEEP_ALL = 0xFF;           // Keep all optional user fields
}
```

| Value | Name | Description |
| ----- | ---- | ----------- |
| 0x00 | KEEP_NONE | 모든 필드 업데이트 |
| 0x01 | KEEP_USER_PHRASE | phrase를 변경하지 않고 유지 |
| 0x02 | KEEP_USER_JOB_CODE | job code를 변경하지 않고 유지 |
| 0x04 | KEEP_USER_NAME | 이름을 변경하지 않고 유지 |
| 0x08 | KEEP_USER_PHOTO | 사진을 변경하지 않고 유지 |
| 0x10 | KEEP_USER_PIN | PIN을 변경하지 않고 유지 |
| 0x20 | KEEP_USER_CARD | 카드 데이터를 변경하지 않고 유지 |
| 0x40 | KEEP_USER_FINGER | 지문 데이터를 변경하지 않고 유지 |
| 0x80 | KEEP_USER_FACE | 얼굴 데이터를 변경하지 않고 유지 |
| 0xFF | KEEP_ALL | 모든 선택적 필드를 변경하지 않고 유지 |

### User Setting

__startTime__과 __endTime__을 사용하여 사용자의 유효 시간과 만료 시간을 지정할 수 있습니다. 또한 __fingerAuthMode__, __cardAuthMode__, __IDAuthMode__를 사용하여 사용자의 개인 인증 모드를 지정할 수 있습니다. 사용 가능한 모드는 [authentication modes]({{'/api/auth/' | relative_url}}#AuthMode)를 참조하십시오. RGB 기반 비주얼 얼굴 인증 장치는 [다른 인증 모드]({{'/api/auth/' | relative_url}}#authentication-mode-for-facestation-f2)를 제공하므로, 이를 위해서는 __faceAuthExtMode__, __fingerAuthExtMode__, __cardAuthExtMode__, __IDAuthExtMode__를 사용해야 합니다.

개인 인증 모드는 [AuthConfig.usePrivateAuth]({{'/api/auth/' | relative_url }}#AuthConfig)가 true일 때만 적용됩니다.
{: .notice--warning}


```protobuf
message UserSetting {
  uint32 startTime;
  uint32 endTime;

  uint32 biometricAuthMode;
  uint32 cardAuthMode;
  uint32 IDAuthMode;
  uint32 securityLevel;

  // Only for RGB-based visual face authentication devices
  uint32 faceAuthExtMode;
  uint32 fingerAuthExtMode;
  uint32 cardAuthExtMode;
  uint32 IDAuthExtMode;  
}
```
{: #UserSetting}

startTime
: 사용자는 이 시간 이후에만 유효합니다. 0이면 제한이 없습니다. Unix 형식입니다.

endTime
: 사용자는 이 시간까지만 유효합니다. 0이면 제한이 없습니다. Unix 형식입니다.

biometricAuthMode
: 
  | AUTH_MODE_BIOMETRIC_ONLY | 지문 또는 얼굴 |  
  | AUTH_MODE_BIOMETRIC_PIN | (지문 또는 얼굴) + PIN | 
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 | 

cardAuthMode
: 
  | AUTH_MODE_CARD_ONLY | 카드 |  
  | AUTH_MODE_CARD_BIOMETRIC | 카드 + (지문 또는 얼굴) | 
  | AUTH_MODE_CARD_PIN | 카드 + PIN |
  | AUTH_MODE_CARD_BIOMETRIC_OR_PIN | 카드 + (지문 또는 얼굴 또는 PIN) | 
  | AUTH_MODE_CARD_BIOMETRIC_PIN | 카드 + (지문 또는 얼굴) + PIN |
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 | 

idAuthMode
: 
  | AUTH_MODE_ID_BIOMETRIC | ID + (지문 또는 얼굴) |  
  | AUTH_MODE_ID_PIN | ID + PIN | 
  | AUTH_MODE_ID_BIOMETRIC_OR_PIN | ID + (지문 또는 얼굴 또는 PIN) | 
  | AUTH_MODE_ID_BIOMETRIC_PIN | ID + (지문 또는 얼굴) + PIN |
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 | 

securityLevel
: 지문 및 얼굴 인증의 보안 수준을 지정합니다.

  | 0 | 정의되지 않음. [FingerConfig]({{'/api/finger/' | relative_url }}#FingerConfig) 및 [FaceConfig]({{'/api/face/' | relative_url }}#FaceConfig)의 설정 사용 |
  | 1 | 가장 낮은 보안 | 
  | 2 | 낮은 보안 | 
  | 3 | 보통 |
  | 4 | 높은 보안 |
  | 5 | 가장 높은 보안 | 

faceAuthExtMode
: RGB 기반 비주얼 얼굴 인증 장치 전용

  | AUTH_EXT_MODE_FACE_ONLY | 얼굴 |  
  | AUTH_EXT_MODE_FACE_FINGERPRINT | 얼굴 + 지문 | 
  | AUTH_EXT_MODE_FACE_PIN | 얼굴 + PIN  | 
  | AUTH_EXT_MODE_FACE_FINGERPRINT_OR_PIN | 얼굴 + (지문 또는 PIN) | 
  | AUTH_EXT_MODE_FACE_FINGERPRINT_PIN | 얼굴 + 지문 + PIN | 
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 | 

fingerAuthExtMode
: RGB 기반 비주얼 얼굴 인증 장치 전용

  | AUTH_EXT_MODE_FINGERPRINT_ONLY | 지문 |  
  | AUTH_EXT_MODE_FINGERPRINT_FACE | 지문 + 얼굴 | 
  | AUTH_EXT_MODE_FINGERPRINT_PIN | 지문 + PIN  | 
  | AUTH_EXT_MODE_FINGERPRINT_FACE_OR_PIN | 지문 + (얼굴 또는 PIN) | 
  | AUTH_EXT_MODE_FINGERPRINT_FACE_PIN | 지문 + 얼굴 + PIN | 
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 | 

cardAuthExtMode
: RGB 기반 비주얼 얼굴 인증 장치 전용

  | AUTH_EXT_MODE_CARD_ONLY | 카드 |  
  | AUTH_EXT_MODE_CARD_FACE | 카드 + 얼굴 | 
  | AUTH_EXT_MODE_CARD_FINGERPRINT | 카드 + 지문  | 
  | AUTH_EXT_MODE_CARD_PIN | 카드 + PIN | 
  | AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT | 카드 + (얼굴 또는 지문) | 
  | AUTH_EXT_MODE_CARD_FACE_OR_PIN | 카드 + (얼굴 또는 PIN) |  
  | AUTH_EXT_MODE_CARD_FINGERPRINT_OR_PIN | 카드 + (지문 또는 PIN) | 
  | AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT_OR_PIN | 카드 + (얼굴 또는 지문 또는 PIN)  | 
  | AUTH_EXT_MODE_CARD_FACE_FINGERPRINT | 카드 + 얼굴 + 지문 | 
  | AUTH_EXT_MODE_CARD_FACE_PIN | 카드 + 얼굴 + PIN | 
  | AUTH_EXT_MODE_CARD_FINGERPRINT_FACE | 카드 + 지문 + 얼굴 |  
  | AUTH_EXT_MODE_CARD_FINGERPRINT_PIN | 카드 + 지문 + PIN | 
  | AUTH_EXT_MODE_CARD_FACE_OR_FINGERPRINT_PIN | 카드 + (얼굴 또는 지문) + PIN  | 
  | AUTH_EXT_MODE_CARD_FACE_FINGERPRINT_OR_PIN | 카드 + 얼굴 + (지문 또는 PIN) | 
  | AUTH_EXT_MODE_CARD_FINGERPRINT_FACE_OR_PIN | 카드 + 지문 + (얼굴 또는 PIN) | 
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 | 

IDAuthExtMode
: RGB 기반 비주얼 얼굴 인증 장치 전용

  | AUTH_EXT_MODE_ID_FACE | ID + 얼굴 | 
  | AUTH_EXT_MODE_ID_FINGERPRINT | ID + 지문  | 
  | AUTH_EXT_MODE_ID_PIN | ID + PIN | 
  | AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT | ID + (얼굴 또는 지문) | 
  | AUTH_EXT_MODE_ID_FACE_OR_PIN | ID + (얼굴 또는 PIN) |  
  | AUTH_EXT_MODE_ID_FINGERPRINT_OR_PIN | ID + (지문 또는 PIN) | 
  | AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT_OR_PIN | ID + (얼굴 또는 지문 또는 PIN)  | 
  | AUTH_EXT_MODE_ID_FACE_FINGERPRINT | ID + 얼굴 + 지문 | 
  | AUTH_EXT_MODE_ID_FACE_PIN | ID + 얼굴 + PIN | 
  | AUTH_EXT_MODE_ID_FINGERPRINT_FACE | ID + 지문 + 얼굴 |  
  | AUTH_EXT_MODE_ID_FINGERPRINT_PIN | ID + 지문 + PIN | 
  | AUTH_EXT_MODE_ID_FACE_OR_FINGERPRINT_PIN | ID + (얼굴 또는 지문) + PIN  | 
  | AUTH_EXT_MODE_ID_FACE_FINGERPRINT_OR_PIN | ID + 얼굴 + (지문 또는 PIN) | 
  | AUTH_EXT_MODE_ID_FINGERPRINT_FACE_OR_PIN | ID + 지문 + (얼굴 또는 PIN) | 
  | 0xFE | 허용되지 않음 |
  | 0xFF | 정의되지 않음. [AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)의 설정 사용 |   

### User Information

```protobuf
message UserInfo {
  UserHdr hdr;
  UserSetting setting;
  string name;
  repeated card.CSNCardData cards;
  repeated finger.FingerData fingers;
  repeated face.FaceData faces;
  repeated uint32 accessGroupIDs;
  repeated tna.JobCode jobCodes;
  bytes PIN;
  bytes photo;
}
```
{: #UserInfo}

hdr
: [UserHdr](#UserHdr).

setting
: [UserSetting](#UserSetting).

name
: UTF-8 인코딩으로 최대 48자입니다.

cards
: 사용자에게 할당된 카드입니다. [CSNCardData]({{'/api/card/' | relative_url }}#CSNCardData)를 참조하십시오. [SetCard](#setcard) 또는 [SetCardMulti](#setcardmulti)를 사용하여 카드를 할당할 수 있습니다.

fingers:
: 사용자에게 등록된 지문입니다. [FingerData]({{'/api/finger/' | relative_url }}#FingerData)를 참조하십시오. [SetFinger](#setfinger) 또는 [SetFingerMulti](#setfingermulti)를 사용하여 지문을 등록할 수 있습니다.

faces
: 사용자에게 등록된 얼굴입니다. [FaceData]({{'/api/face/' | relative_url }}#FaceData)를 참조하십시오. [SetFace](#setface) 또는 [SetFaceMulti](#setfacemulti)를 사용하여 얼굴을 등록할 수 있습니다.

accessGroupIDs
: 사용자가 속한 출입 그룹 ID입니다. [AccessGroup]({{'/api/access/' | relative_url }}#AccessGroup)을 참조하십시오. 사용자는 최대 16개의 출입 그룹에 속할 수 있습니다. [SetAccessGroup](#setaccessgroup) 또는 [SetAccessGroupMulti](#setaccessgroupmulti)를 사용하여 출입 그룹을 할당할 수 있습니다.

jobCodes
: 사용자에게 할당된 job code입니다. [JobCode]({{'/api/tna/' | relative_url }}#JobCode)를 참조하십시오. [SetJobCode](#setjobcode) 또는 [SetJobCodeMulti](#setjobcodemulti)를 사용하여 job code를 할당할 수 있습니다. 

PIN
: PIN은 최대 16바이트입니다. 보안을 위해 PIN은 해시 값으로 저장됩니다. [GetPINHash](#getpinhash)를 참조하십시오.

photo
: 사용자당 프로필 이미지를 저장할 수 있습니다. 최대 크기는 16KB입니다.

## Information

### GetList

장치에 등록된 사용자 목록을 가져옵니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| hdrs | [UserHdr[]](#UserHdr) | 장치에 등록된 사용자의 헤더 정보 |

### Get

특정 사용자 ID로 사용자 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 사용자의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| users | [UserInfo[]](#UserInfo) | 지정된 사용자 ID의 사용자 정보 |

### GetPartial

특정 사용자 ID로 부분 사용자 정보를 가져옵니다. 예를 들어, 카드와 지문 정보만 필요한 경우 __infoMask__를 __USER_MASK_CARD__ \| __USER_MASK_FINGER__로 지정할 수 있습니다. __infoMask__가 __USER_MASK_ALL__이면 [Get](#get)과 동일합니다.

```protobuf
enum InfoMask {
  USER_MASK_ID_ONLY = 0x0000;      // User ID only
  USER_MASK_HDR = 0x0001;          // User header
  USER_MASK_SETTING = 0x0002;      // User setting
  USER_MASK_NAME = 0x0004;         // User name
  USER_MASK_PHOTO = 0x0008;        // User photo
  USER_MASK_PIN = 0x0010;          // User PIN hash
  USER_MASK_CARD = 0x0020;         // Card credentials
  USER_MASK_FINGER = 0x0040;       // Fingerprint credentials
  USER_MASK_FACE = 0x0080;         // Face credentials
  USER_MASK_ACCESS_GROUP = 0x0100; // Access group IDs
  USER_MASK_JOB = 0x0200;          // Job codes
  USER_MASK_PHRASE = 0x0400;       // User phrase
  USER_MASK_FACE_EX = 0x0800;      // FaceEx credentials
  USER_MASK_SETTING_EX = 0x1000;   // Extended user setting
  USER_MASK_ALL = 0xFFFF;          // All user information
}
```

| Value | Name | Description |
| ----- | ---- | ----------- |
| 0x0000 | USER_MASK_ID_ONLY | 사용자 ID만 반환 |
| 0x0001 | USER_MASK_HDR | [UserHdr](#UserHdr) 포함 |
| 0x0002 | USER_MASK_SETTING | [UserSetting](#UserSetting) 포함 |
| 0x0004 | USER_MASK_NAME | 사용자 이름 포함 |
| 0x0008 | USER_MASK_PHOTO | 사용자 사진 포함 |
| 0x0010 | USER_MASK_PIN | 사용자 PIN 해시 포함 |
| 0x0020 | USER_MASK_CARD | 카드 데이터 포함 |
| 0x0040 | USER_MASK_FINGER | 지문 데이터 포함 |
| 0x0080 | USER_MASK_FACE | 얼굴 데이터 포함 |
| 0x0100 | USER_MASK_ACCESS_GROUP | 출입 그룹 ID 포함 |
| 0x0200 | USER_MASK_JOB | job code 포함 |
| 0x0400 | USER_MASK_PHRASE | 사용자 phrase 포함 |
| 0x0800 | USER_MASK_FACE_EX | FaceEx 데이터 포함 |
| 0x1000 | USER_MASK_SETTING_EX | 확장 사용자 설정 포함 |
| 0xFFFF | USER_MASK_ALL | 모든 사용자 정보 포함 |

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 사용자 ID 배열 |
| infoMask | uint32 | 필요한 정보에 대한 마스크 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| users | [UserInfo[]](#UserInfo) | 마스크가 적용된 지정된 사용자 ID의 사용자 정보 |

## Enroll

### Enroll

장치에 사용자를 등록합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| users | [UserInfo[]](#UserInfo) | 등록할 사용자의 정보 |
| overwrite | bool | true이면 동일한 ID를 가진 기존 사용자를 덮어씁니다. false이면 오류를 반환합니다 |

### EnrollMulti

여러 장치에 사용자를 등록합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| users | [UserInfo[]](#UserInfo) | 등록할 사용자의 정보  |
| overwrite | bool | true이면 동일한 ID를 가진 기존 사용자를 덮어씁니다. false이면 오류를 반환합니다 |

## Update
특정 사용자 ID로 부분 사용자 정보를 설정합니다. 예를 들어, 카드와 PIN만 업데이트하려면 [updateMask](#UpdateMask)를 KEEP_USER_PHRASE | KEEP_USER_JOB_CODE | KEEP_USER_NAME | KEEP_USER_PHOTO | KEEP_USER_FINGER | KEEP_USER_FACE로 지정해야 합니다. [updateMask](#UpdateMask)가 KEEP_NONE이면 overwrite 옵션이 적용된 [Enroll](#Enroll)과 동일하게 동작합니다.

### Update

장치의 사용자를 업데이트합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| users | [UserInfo[]](#UserInfo) | 업데이트할 사용자의 정보 |

### UpdateMulti

여러 장치의 사용자를 업데이트합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| users | [UserInfo[]](#UserInfo) | 업데이트할 사용자의 정보  |

## Delete

### Delete

장치에서 사용자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 삭제할 사용자의 ID |

### DeleteMulti

여러 장치에서 사용자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userIDs | string[] | 삭제할 사용자의 ID |

### DeleteAll

장치에서 모든 사용자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |


### DeleteAllMulti

여러 장치에서 모든 사용자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |

## Card

```protobuf
message UserCard {
  string userID;
  repeated card.CSNCardData cards;
}
```
{: #UserCard }

cards
: [Card.Scan]({{'/api/card/' | relative_url }}#scan)을 사용하여 카드를 읽을 수 있습니다.

### GetCard

지정된 사용자의 카드 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 카드 정보를 반환할 사용자의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userCards | [UserCard[]](#UserCard) | 지정된 사용자의 카드 정보 |

### SetCard

장치의 사용자에게 카드를 할당합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userCards | [UserCard[]](#UserCard) | 장치에 저장할 카드 정보 |

### SetCardMulti

여러 장치의 사용자에게 카드를 할당합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userCards | [UserCard[]](#UserCard) | 장치에 저장할 카드 정보 |

## Finger

```protobuf
message UserFinger {
  string userID;
  repeated finger.FingerData fingers;
}
```
{: #UserFinger }

fingers
: [Finger.Scan]({{'/api/finger/' | relative_url }}#scan)을 사용하여 지문 템플릿을 획득할 수 있습니다.

### GetFinger

지정된 사용자의 지문 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 지문 정보를 반환할 사용자의 ID  |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userFingers | [UserFinger[]](#UserFinger) | 지정된 사용자의 지문 정보 |

### SetFinger

장치의 사용자에게 지문을 등록합니다.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userFingers | [UserFinger[]](#UserFinger) | 장치에 저장할 지문 정보 |

### SetFingerMulti

여러 장치의 사용자에게 지문을 등록합니다.

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userFingers | [UserFinger[]](#UserFinger) | 장치에 저장할 지문 정보 |

## Face

```protobuf
message UserFace {
  string userID;
  repeated face.FaceData faces;
}
```
{: #UserFace }

faces
: [Face.Scan]({{'/api/face/' | relative_url }}#scan)을 사용하여 얼굴 템플릿을 가져올 수 있습니다.

### GetFace

지정된 사용자의 얼굴 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 얼굴 정보를 반환할 사용자의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userFaces | [UserFace[]](#UserFace) | 지정된 사용자의 얼굴 정보 |


### SetFace

장치의 사용자에게 얼굴 템플릿을 등록합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userFaces | [UserFace[]](#UserFace) | 장치에 저장할 얼굴 정보 |

### SetFaceMulti

여러 장치의 사용자에게 얼굴 템플릿을 등록합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userFaces | [UserFace[]](#UserFace) | 장치에 저장할 얼굴 정보 |

## Access group

[AccessGroup]({{'/api/access/' | relative_url }}#AccessGroup)을 사용하여 특정 사용자가 출입할 수 있는 문을 지정할 수 있습니다.

```protobuf
message UserAccessGroup {
  string userID;
  repeated uint32 accessGroupIDs;
}
```
{: #UserAccessGroup }

accessGroupIDs
: 사용자가 속한 출입 그룹의 ID입니다. [AccessGroup]({{'/api/access/' | relative_url }}#AccessGroup)을 참조하십시오.

### GetAccessGroup

지정된 사용자의 출입 그룹 ID를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 출입 그룹 ID를 반환할 사용자의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userAccessGroups | [UserAccessGroup[]](#UserAccessGroup) | 지정된 사용자의 출입 그룹 ID |


### SetAccessGroup

장치의 사용자에게 출입 그룹을 할당합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userAccessGroups | [UserAccessGroup[]](#UserAccessGroup) | 장치에 저장할 출입 그룹 정보 |

### SetAccessGroupMulti

여러 장치의 사용자에게 출입 그룹을 할당합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userAccessGroups | [UserAccessGroup[]](#UserAccessGroup) | 장치에 저장할 출입 그룹 정보 |

## Job code

먼저 장치의 [CapabilityInfo.jobCodeSupported]({{'/api/device/' | relative_url }}#CapabilityInfo)를 확인하십시오. job code를 기록하려면 [SystemConfig.useJobCode]({{'/api/system/' | relative_url }}#SystemConfig)를 true로 설정해야 합니다. 
{: .notice--warning}

```protobuf
message UserJobCode {
  string userID;
  repeated tna.JobCode jobCodes;
}
```
{: #UserJobCode }

jobCodes
: [TNA.JobCode]({{'/api/tna/' | relative_url }}#JobCode)를 참조하십시오.

### GetJobCode

지정된 사용자의 job code를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | job code를 반환할 사용자의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userJobCodes | [UserJobCode[]](#UserJobCode) | 지정된 사용자의 job code 정보 |


### SetJobCode

장치의 사용자에게 job code를 할당합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userJobCodes | [UserJobCode[]](#UserJobCode) | 장치에 저장할 job code 정보 |

### SetJobCodeMulti

여러 장치의 사용자에게 job code를 할당합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userJobCodes | [UserJobCode[]](#UserJobCode) | 장치에 저장할 job code 정보 |


## Utility

### GetPINHash

보안을 위해 PIN은 해시 값으로 저장됩니다. __GetPINHash__는 PIN을 32바이트 해시 값으로 변환합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| PIN | string | 최대 16바이트 PIN |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| hashVal | byte[] | PIN의 32바이트 해시 값 |

## UserOverride

[+ 1.9.0] 장애인이나 배송 작업자처럼 출입에 더 많은 시간이 필요한 사용자가 표준 문 열림 시간보다 더 오래 문을 사용할 수 있도록 지원합니다. 문의 [extendedDoorOpenTime]({{'/api/door/' | relative_url }}#DoorInfo)으로 연장 시간을 설정하고, UserOverride로 사용자별 적용 여부를 지정합니다.
연장 문 열림 시간을 사용할 때는 다음 규칙을 따릅니다.
* 연장 문 열림 시간이 있는 사용자와 없는 사용자가 연속으로 인증하는 경우, 문 열림 시간은 나중에 인증한 사용자를 기준으로 동작합니다.
* 이중 인증을 사용할 때, 참여자 중 한 명이라도 연장 문 열림 시간을 사용하면 문은 연장 문 열림 시간으로 열립니다.


```protobuf
message UserOverride {
  string userID = 1;
  bool useExtendedDoorOpenTime = 2;
}
```
{: #UserOverride }

userID
: 연장 문 열림 시간을 사용할 사용자 ID입니다.

useExtendedDoorOpenTime
: 연장 문 열림 시간 사용 여부입니다.


### GetUserOverride

장치의 사용자 재정의를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 특정 사용자를 조회할 때 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userOverrides | [UserOverride[]](#UserOverride) | 장치의 사용자 재정의 |

### GetAllUserOverride

장치의 모든 사용자 재정의를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| userOverrides | [UserOverride[]](#UserOverride) | 장치의 사용자 재정의 |

### SetUserOverride

장치에 사용자 재정의를 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userOverrides | [UserOverride[]](#UserOverride) | 장치에 설정할 사용자 재정의 |

### SetUserOverrideMulti

여러 장치에 사용자 재정의를 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userOverrides | [UserOverride[]](#UserOverride) | 여러 장치에 설정할 사용자 재정의 |

### DeleteUserOverride

장치의 사용자 재정의를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| userIDs | string[] | 삭제할 사용자 ID |

### DeleteUserOverrideMulti

여러 장치의 사용자 재정의를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
| userIDs | string[] | 삭제할 사용자 ID |

### DeleteAllUserOverride

장치의 모든 사용자 재정의를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllUserOverrideMulti

여러 장치의 모든 사용자 재정의를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치의 ID |
