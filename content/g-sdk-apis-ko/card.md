---
title: "Card API"
toc_label: "Card"  
---

## Overview

### Card type

지원되는 카드는 여러 가지 유형으로 분류할 수 있습니다.

| Type | Cards |
| ---- | ----------- |
| CSN | EM, Mifare, Felica |
| Wiegand | HID Prox, HID iClass |
| Smartcard | Mifare, Mifare DESFire, iClass, iClass SEOS |

더 자세한 정보는 [이 문서](https://support.supremainc.com/en/support/solutions/articles/24000006349--biostar-2-supported-card-and-card-formats-based-on-model-type)를 참고하시기 바랍니다. 

```protobuf
enum Type {
  CARD_TYPE_UNKNOWN = 0x00;
  CARD_TYPE_CSN	= 0x01;
  CARD_TYPE_SECURE = 0x02;
  CARD_TYPE_ACCESS = 0x03;
  CARD_TYPE_QR = 0x06;
  CARD_TYPE_WIEGAND = 0x0A;
  CARD_TYPE_CONFIG_CARD = 0x0B;
  CARD_TYPE_CUSTOM_SMART = 0x0D;
}
```
{: #Type }
CARD_TYPE_CSN
: CSN(Card Serial Number)은 제조사가 카드에 기록한 ID입니다. 이 값은 변경할 수 없습니다.

CARD_TYPE_SECURE
: 스마트카드에는 데이터를 기록할 수 있습니다. CARD_TYPE_SECURE 카드는 인증 과정에 사용되는 사용자 자격 증명 정보를 저장합니다. 출입 그룹 정보는 카드에 저장되지 않으므로, 장치는 여전히 사용자 정보를 저장해야 합니다.

CARD_TYPE_ACCESS
: CARD_TYPE_ACCESS 카드는 사용자의 자격 증명에 더해 출입 그룹 정보까지 저장합니다. 인증에 필요한 모든 정보가 카드에 있으므로, 장치는 별도의 사용자 정보를 저장할 필요가 없습니다. 

CARD_TYPE_QR
: [X-Station 2](https://www.supremainc.com/en/hardware/versatile-intelligent-terminal-xstation2.asp)는 QR 코드를 자격 증명으로 지원합니다. [WriteQRCode](#writeqrcode)와 [QRConfig](#QRConfig)를 참고하시기 바랍니다.

CARD_TYPE_WIEGAND
: Wiegand 카드의 경우, 데이터를 디코딩하기 위해 포맷을 구성해야 합니다. 자세한 내용은 [이 문서](https://support.supremainc.com/en/support/solutions/articles/24000027804--biostar-2-wiegand-configuration-faq)를 참고하시기 바랍니다. 

CARD_TYPE_CONFIG_CARD
: HID config 카드를 지원할 때 사용되는 카드 유형입니다.

CARD_TYPE_CUSTOM_SMART
: Custom smart 카드에 사용되는 카드 유형입니다.

### Card data

```protobuf
message CardData {
  Type type;
  CSNCardData CSNCardData; // null if it is a smartcard
  SmartCardData smartCardData; // null if it is a CSN card
}
```
{: #CardData }

[type](#Type)
: 

[CSNCardData](#CSNCardData)
: CARD_TYPE_CSN 또는 CARD_TYPE_QR에서만 유효합니다.

[smartCardData](#SmartCardData)
: CARD_TYPE_SECURE 또는 CARD_TYPE_ACCESS에서만 유효합니다.


```protobuf
message CSNCardData {
  Type type;
  int32 size;
  bytes data;
}
```
{: #CSNCardData }

[type](#Type)
: 

size
: 이 값은 항상 32입니다. CSNCard는 기록할 수 없다는 점에 유의하시기 바랍니다.

data
: __type__이 __CARD_TYPE_SECURE__인 경우, 24바이트 카드 ID, 4바이트 발급 횟수, 4바이트 타임스탬프로 구성됩니다.

```protobuf
message SmartCardData {
  SmartCardHeader header;
  bytes cardID;
  SmartCardCredential credential;
  AccessOnCardData accessOnData;
}
```
{: #SmartCardData }

[header](#SmartCardHeader)
: 

cardID
: CARD_TYPE_ACCESS의 경우 32바이트, CARD_TYPE_SECURE의 경우 24바이트입니다.

[credential](#SmartCardCredential)
: 

[accessOnData](#AccessOnCardData)
: CARD_TYPE_ACCESS 카드에서만 유효합니다.


```protobuf
message SmartCardHeader {
  uint32 headerCRC;
  uint32 cardCRC;
  Type type;
  oneof templateCount {
    uint32 numOfTemplate;
    uint32 numOfFaceTemplate;   // Only for RGB-based visual face authentication devices
  }
  uint32 templateSize;
  uint32 issueCount;
  uint32 duressMask;
  uint32 cardAuthMode;
  bool useAlphanumericID;
  uint32 cardAuthModeEx;    // Only for RGB-based visual face authentication devices
}
```
{: #SmartCardHeader }

headerCRC/cardCRC
: 이 값들은 [Write](#write)에서 자동으로 계산됩니다. 따라서 기록할 때 이 값들을 채울 필요가 없습니다.

type
: CARD_TYPE_SECURE 또는 CARD_TYPE_ACCESS입니다.

numOfTemplate
: 카드에 저장된 지문 템플릿의 개수입니다. 카드에는 최대 4개의 템플릿을 저장할 수 있습니다.

numOfFaceTemplate
: 카드에 저장된 얼굴 템플릿의 개수입니다. 카드에는 최대 2개의 템플릿을 저장할 수 있습니다.

templateSize
: 지문/얼굴 템플릿의 크기(바이트)입니다. 일반적으로 384 또는 552입니다.

issueCount
: 카드는 여러 번 발급할 수 있습니다. 이 경우 이 매개변수로 각 발급을 구분할 수 있습니다. 

duressMask
: 지문 템플릿 중 협박(duress) 지문이 있는지를 지정합니다. 예를 들어 첫 번째 템플릿이 협박 지문이라면 값은 0x01이어야 합니다.

useAlphanumericID
: true이면 cardID는 문자열이어야 합니다.

cardAuthMode
: 카드에 대한 개별 인증 모드를 지정합니다.

cardAuthModeEx
: 카드에 대한 확장 개별 인증 모드를 지정합니다.



```protobuf
message SmartCardCredential {
  bytes PIN;
  repeated bytes templates;
}
```
{: #SmartCardCredential}

PIN
: 최대 16바이트 PIN에 대한 32바이트 해시 값입니다. [User.GetPINHash]({{'/api/user/' | relative_url}}#getpinhash)를 참고하시기 바랍니다.

templates
: 사용자의 지문 템플릿입니다.

```protobuf
message AccessOnCardData {
  repeated uint32 accessGroupIDs;
  uint32 startTime;
  uint32 endTime;
}
```
{: #AccessOnCardData}

accessGroupIDs
: 사용자가 속한 출입 그룹의 ID입니다. [Access.AccessGroup]({{'/api/access/' | relative_url}}#AccessGroup)를 참고하시기 바랍니다.

startTime/endTime
: [UserSetting]({{'/api/user/' | relative_url}}#UserSetting)과 동일합니다.

## Read/Write

### Scan

장치에서 카드를 읽습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| cardData | [CardData](#CardData) | 장치에서 읽은 카드 정보 |

### Erase

장치에서 스마트카드를 지웁니다. 새 데이터를 다시 기록하기 전에 카드를 먼저 지워야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |


### Write

장치에서 스마트카드에 기록합니다. 카드가 비어 있지 않다면 먼저 지워야 합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| smartCardData | [SmartCardData](#SmartCardData) | 기록할 스마트카드 정보 |

### WriteQRCode

QR 코드를 [CSNCardData](#CSNCardData)로 변환합니다. 이 데이터는 [User.Enroll]({{'/api/user/' | relative_url }}#enroll-1) 또는 [User.SetCard]({{'/api/user/' | relative_url }}#setcard)를 사용하여 사용자에게 할당할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| QRText | string | 최대 32개의 ASCII 코드 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| cardData | [CSNCardData](#CSNCardData) | 사용자에게 할당할 수 있는 카드 데이터 |


## Config

지원되는 카드 구성은 장치 유형에 따라 다릅니다. [이 문서](https://support.supremainc.com/en/support/solutions/articles/24000006349--biostar-2-supported-card-and-card-formats-based-on-model-type)를 참고하시기 바랍니다.

```protobuf
message CardConfig {
  CardByteOrder byteOrder;
  bool useWiegandFormat;
  CardDataType dataType;
  bool useSecondaryKey;

  MifareConfig mifareConfig;
  IClassConfig iClassConfig;
  DESFireConfig DESFireConfig;
  SEOSConfig SEOSConfig;

  uint32 formatID;

  bool cipher;
  CardByteOrder smartCardByteOrder;
  MIFARE_ENCRYPTION mifareEncryption;
}
```
{: #CardConfig }

[byteOrder](#CardByteOrder)
: 카드에 저장된 데이터의 바이트 순서입니다. 기본값은 __MSB__입니다.

useWiegandFormat
: true이면 [Wiegand 포맷]({{'/api/wiegand/' | relative_url}}#WiegandFormat)을 사용하여 카드 ID 데이터를 디코딩합니다.

[dataType](#CardDataType)
: 카드에 저장된 데이터의 인코딩 유형입니다. 기본값은 __DATA_BINARY__입니다.

useSecondaryKey
: true이면 기본 키로 읽기 또는 쓰기에 실패했을 때 보조 키를 시도합니다.

[mifareConfig](#MifareConfig)
: 장치가 Mifare 카드를 지원하는 경우에만 유효합니다.

[iClassConfig](#IClassConfig)
: 장치가 iClass 카드를 지원하는 경우에만 유효합니다.

[DESFireConfig](#DESFireConfig)
: 장치가 DESFire 카드를 지원하는 경우에만 유효합니다.

[SEOSConfig](#SEOSConfig)
: 장치가 SEOS 카드를 지원하는 경우에만 유효합니다.

formatID
: 애플리케이션에서 여러 카드 구성을 관리하기 위해 ID를 할당할 수 있습니다. 이 값은 장치에서 사용되지 않습니다.

cipher
: true이면 XPASS D2의 키패드를 통한 CardID 입력이 허용됩니다.

[smartCardByteOrder](#CardByteOrder)
: 스마트카드에 저장된 데이터의 바이트 순서입니다. 기본값은 __MSB__입니다.

[mifareEncryption](#MIFARE_ENCRYPTION)
: MIFARE의 암호화 유형을 설정합니다.

```protobuf
enum CardByteOrder {
  MSB = 0;
  LSB = 1;
}
```
{: #CardByteOrder }

```protobuf
enum CardDataType {
  DATA_BINARY = 0;
  DATA_ASCII = 1;
  DATA_UTF16 = 2;
  DATA_BCD = 3;  
}
```
{: #CardDataType }

```protobuf
enum MIFARE_ENCRYPTION {
  MIFARE_ENCRYPTION_CRYPTO1 = 0;
  MIFARE_ENCRYPTION_AES128 = 1;
}
```
{: #MIFARE_ENCRYPTION }

MIFARE_ENCRYPTION_CRYPTO1
: MIFARE의 암호화 유형을 _crypto1_로 설정합니다. 키 크기는 최대 __6바이트__까지 설정할 수 있습니다.

MIFARE_ENCRYPTION_AES128
: MIFARE의 암호화 유형을 _AES128_로 설정합니다. 키 크기는 최대 __16바이트__까지 설정할 수 있습니다.

```protobuf
message MifareConfig {
  bytes primaryKey;
  bytes secondaryKey;
  int32 startBlockIndex;
}
```
{: #MifareConfig }

primaryKey
: 데이터를 암호화/복호화하기 위한 6바이트 키입니다. 기본값은 0xffffffffffff입니다.

secondaryKey
: 6바이트 키입니다. [CardConfig.useSecondaryKey](#CardConfig)가 true인 경우에만 사용됩니다.

startBlockIndex
: Mifare 카드에서 첫 번째 데이터 블록의 인덱스입니다.


```protobuf
message IClassConfig {
  bytes primaryKey;
  bytes secondaryKey;
  int32 startBlockIndex;
}
```
{: #IClassConfig }

primaryKey
: 데이터를 암호화/복호화하기 위한 8바이트 키입니다. 

secondaryKey
: 8바이트 키입니다. [CardConfig.useSecondaryKey](#CardConfig)가 true인 경우에만 사용됩니다.

startBlockIndex
: iClass 카드에서 첫 번째 데이터 블록의 인덱스입니다.


```protobuf
message DESFireConfig {
  bytes primaryKey;
  bytes secondaryKey;
  bytes appID;
  uint32 fileID;
  DESFireEncryptionType encryptionType;
  DESFireOperationMode operationMode;
}
```
{: #DESFireConfig }

primaryKey
: 데이터를 암호화/복호화하기 위한 16바이트 키입니다.

secondaryKey
: 16바이트 키입니다. [CardConfig.useSecondaryKey](#CardConfig)가 true인 경우에만 사용됩니다.

appID
: 3바이트 애플리케이션 ID입니다.

fileID
: 카드 데이터를 저장하는 데 사용되는 1바이트 파일 ID입니다.

[encryptionType](#DESFireEncryptionType)
: 

```protobuf
enum DESFireEncryptionType {
  ENC_DES_3DES = 0;
  ENC_AES = 1;
}
```
{: #DESFireEncryptionType }

[operationMode](#DESFireOperationMode)
:

```protobuf
enum DESFireOperationMode {
  OPERATION_LEGACY = 0;
  OPERATION_APPLEVELKEY = 1;
}
```
{: #DESFireOperationMode }

```protobuf
message SEOSConfig {
  bytes OIDADF;
  uint32 sizeADF;
  repeated uint32 OIDDataObjectID;
  repeated uint32 sizeDataObject;
  bytes primaryKeyAuth;
  bytes secondaryKeyAuth;
}
```
{: #SEOSConfig }

OIDADF
: 13바이트 Application Dedicated Files(ADF) 주소입니다. 읽기 전용입니다.

sizeADF
: ADF의 크기입니다.

OIDDataObjectID
: 최대 8개의 data object ID를 설정할 수 있습니다.

sizeDataObject
: 각 data object의 크기입니다.

primaryKeyAuth
: 데이터를 암호화/복호화하기 위한 16바이트 키입니다.

secondaryKeyAuth
: 16바이트 키입니다. [CardConfig.useSecondaryKey](#CardConfig)가 true인 경우에만 사용됩니다.


### GetConfig

장치의 카드 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [CardConfig](#CardConfig) | 장치에 저장된 카드 구성 |

### SetConfig

장치의 카드 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [CardConfig](#CardConfig) | 장치에 기록할 카드 구성 |

### SetConfigMulti

여러 장치의 카드 구성을 변경합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [CardConfig](#CardConfig) | 장치들에 기록할 카드 구성 |

### Get1xConfig

일부 BioStar 2 장치는 BioStar 1 장치에서 발급한 Mifare 카드를 읽을 수 있습니다. 먼저 장치의 [CapabilityInfo.card1xSupported]({{'/api/device/' | relative_url}}#CapabilityInfo)를 확인하시기 바랍니다.

```protobuf
message Card1XConfig {
  bool useCSNOnly;
  bool bioEntryCompatible;

  bool useSecondaryKey;
  bytes primaryKey;
  bytes secondaryKey;

  uint32 CISIndex;
  uint32 numOfTemplate;
  uint32 templateSize;
  repeated uint32 templateStartBlocks;
}
```
{: #Card1XConfig }

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [Card1XConfig](#Card1XConfig) | 장치의 V1 카드 구성  |

### Set1xConfig

장치의 V1 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [Card1XConfig](#Card1XConfig) | 장치에 기록할 V1 카드 구성 |

### Set1xConfigMulti

여러 장치의 V1 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [Card1XConfig](#Card1XConfig) | 장치들에 기록할 V1 카드 구성 |

### GetQRConfig

X-Station 2는 QR 코드를 자격 증명으로 지원합니다. QR 코드는 최대 32개의 ASCII 코드로 구성될 수 있습니다. QR 코드 문자열을 카드 데이터로 변환하는 방법은 [WriteQRCode](#writeqrcode)를 참고하시기 바랍니다.

```protobuf
message QRConfig {
  bool useQRCode;
  uint32 scanTimeout;
  bool bypassData;
  bool treatAsCSN;

  bool useVisualQRCode;
  MotionSensitivity motionSensitivity;
  uint32 visualQRScanTimeout;
  bool useVisualQRDetectGuideline;
}
```
{: #QRConfig }

```protobuf
enum MotionSensitivity {
  LOW = 0;
  NORMAL = 1;
  HIGH = 2;
}
```
{: #MotionSensitivity }

useQRCode
: QR 코드 읽기를 활성화합니다.

scanTimeout
: QR 코드를 읽는 타임아웃(초)입니다. 기본값은 4초이며, 4초에서 10초 사이로 설정할 수 있습니다.

bypassData
: true이면 QR 데이터가 장치 게이트웨이로 전송됩니다. (___추후 제공___)

treatAsCSN
: true이면 QR 데이터를 CSN으로 취급합니다.

[+ 1.9.0] useVisualQRCode
: 비주얼 카메라를 통한 QR 코드 읽기를 활성화합니다.

| Device Type | Supported Version |
| ----------- | ----------------- |
| XS2 | V1.2.0 or later |
| BS3 | V1.1.0 or later |

[+ 1.9.0] [motionSensitivity](#MotionSensitivity)
: 비주얼 바코드에 대한 모션 센서의 감도를 설정합니다.

[+ 1.9.0] visualQRScanTimeout
: 비주얼 카메라를 통해 QR 코드를 읽는 타임아웃(초)입니다. 기본값은 10초이며, 3초에서 20초 사이로 설정할 수 있습니다.

[+ 1.9.0] useVisualQRDetectGuideline
: __XPass Q2__ 화면에 QR 코드 감지 외곽선이 표시됩니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [QRConfig](#QRConfig) | 장치의 QR 구성  |

### SetQRConfig

장치의 QR 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [QRConfig](#QRConfig) | 장치에 기록할 QR 구성 |

### SetQRConfigMulti

여러 장치의 QR 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [QRConfig](#QRConfig) | 장치들에 기록할 QR 구성 |

## CustomConfig

[+ 1.7] 스마트 카드 데이터의 위치와 크기를 임의로 지정하여 읽는 것을 지원합니다. 먼저 장치의 [DeviceCapability.customSmartCardSupported]({{'/api/device/' | relative_url}}#DeviceCapability)를 확인하시기 바랍니다.

```protobuf
message CustomConfig {
  CardDataType dataType;
  bool useSecondaryKey;
  CustomMifareCard mifare;
  CustomDESFireCard desfire;
  CardByteOrder smartCardByteOrder;
  uint32 formatID;
  MIFARE_ENCRYPTION mifareEncryption;
}
```
{: #CustomConfig }

[dataType](#CardDataType)
: 카드 데이터의 유형입니다.

useSecondaryKey
: 보조 암호화 키를 사용할지 여부를 결정합니다.

[mifare](#CustomMifareCard)
: Mifare custom 카드 정보를 설정합니다.

[desfire](#CustomDESFireCard)
: DESFire custom 카드 정보를 설정합니다.

[smartCardByteOrder](#CardByteOrder)
: 출력 방식을 MSB 또는 LSB 중에서 선택할 수 있습니다.

formatID
: BioStar 2 애플리케이션이 카드 구성을 데이터베이스로 관리해야 할 때 사용할 수 있는 식별자입니다.

[mifareEncryption](#MIFARE_ENCRYPTION)
: MIFARE의 암호화 유형을 설정합니다.

```protobuf
message CustomMifareCard {
  bytes primaryKey;
  bytes secondaryKey;
  uint32 startBlockIndex;
  uint32 dataSize;
  uint32 skipBytes;
}
```
{: #CustomMifareCard }

primaryKey
: Mifare 카드 정보에 접근하기 위한 기본 암호화 키입니다.

secondaryKey
: Mifare 카드 정보에 접근하기 위한 보조 암호화 키입니다.

startBlockIndex
: Mifare 데이터 저장소의 시작 블록 인덱스입니다.

dataSize
: 카드 데이터의 크기(바이트)입니다.

skipBytes
: 카드 데이터가 나타나는 위치입니다.
이는 카드 데이터를 읽기 시작하는 지점입니다. 시작 지점부터 읽을 경우 0이며, 처음 이후 건너뛴 바이트 수를 나타냅니다.

```protobuf
message CustomDESFireCard {
  bytes primaryKey;
  bytes secondaryKey;
  bytes appID;
  uint32 fileID;
  DESFireEncryptionType encryptionType;
  DESFireOperationMode operationMode;
  uint32 dataSize;
  uint32 skipBytes;
  DESFireAppLevelKey desfireAppKey;
}
```
{: #CustomDESFireCard }

primaryKey
: DESFire 카드 정보에 접근하기 위한 기본 암호화 키입니다. (일반 설정)

secondaryKey
: DESFire 카드 정보에 접근하기 위한 보조 암호화 키입니다. (일반 설정)

appID
: 사용자 인증을 위해 DESFire 카드 내부에 저장되는 Application Id입니다.

fileID
: DESFire 카드 내부에 저장되는 File ID로, 애플리케이션이 데이터를 읽고 쓰는 데 사용됩니다.

[encryptionType](#DESFireEncryptionType)
: 데이터 암호화 유형입니다.

[operationMode](#DESFireOperationMode)
: 동작 모드입니다.

dataSize
: 카드 데이터의 크기(바이트)입니다.

skipBytes
: 카드 데이터가 나타나는 위치입니다.
이는 카드 데이터를 읽기 시작하는 지점입니다. 시작 지점부터 읽을 경우 0이며, 처음 이후 건너뛴 바이트 수를 나타냅니다.

[desfireAppKey](#DESFireAppLevelKey)
: DESFire 카드 정보에 접근하기 위한 키 정보를 나타냅니다. (고급 설정)

```protobuf
message DESFireAppLevelKey {
  bytes appMasterKey;
  bytes fileReadKey;
  bytes fileWriteKey;
  uint32 fileReadKeyNumber;
  uint32 fileWriteKeyNumber;
}
```
{: #DESFireAppLevelKey }

appMasterKey
: DESFire의 애플리케이션 마스터 키입니다.

fileReadKey
: 파일을 읽는 데 사용되는 키입니다.

fileWriteKey
: 파일을 쓰는 데 사용되는 키입니다.

fileReadKeyNumber
: 파일을 읽기 위한 키의 인덱스입니다.

fileWriteKeyNumber
: 파일을 쓰기 위한 키의 인덱스입니다.

desfireAppKey
: DESFire 키 정보를 담고 있는 구조체입니다.

### GetCustomConfig

장치의 custom 카드 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [CustomConfig](#CustomConfig) | 장치의 custom 스마트 카드 구성  |

### SetCustomConfig

장치의 custom 스마트 카드 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [CustomConfig](#CustomConfig) | 장치에 기록할 custom 스마트 카드 구성 |

### SetCustomConfigMulti

여러 장치의 custom 스마트 카드 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [CustomConfig](#CustomConfig) | 장치들에 기록할 custom 스마트 카드 구성 |

## Blacklist

경우에 따라 이미 사용자에게 할당된 카드를 비활성화해야 할 때가 있습니다. 예를 들어 사용자가 카드를 분실한 경우, 보안을 위해 해당 카드를 비활성화해야 합니다. 각 장치는 이 목적을 위해 블랙리스트를 관리합니다.

```protobuf
message BlacklistItem {
  bytes cardID;
  uint32 issueCount;
}
```
{: #BlacklistItem }

cardID
: 32바이트 카드 ID입니다.

issueCount
: 스마트카드에서만 유효합니다.

### GetBlacklist

장치의 블랙리스트를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| blacklist | [BlacklistItem[]](#BlacklistItem) | 장치의 블랙리스트 |

### AddBlacklist

장치의 블랙리스트에 카드를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| cardInfos | [BlacklistItem[]](#BlacklistItem) | 장치의 블랙리스트에 추가할 카드 |

### AddBlacklistMulti

여러 장치의 블랙리스트에 카드를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| cardInfos | [BlacklistItem[]](#BlacklistItem) |  장치들의 블랙리스트에 추가할 카드 |

### DeleteBlacklist

장치의 블랙리스트에서 카드를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| cardInfos | [BlacklistItem[]](#BlacklistItem) | 장치의 블랙리스트에서 삭제할 카드 |

### DeleteBlacklistMulti

여러 장치의 블랙리스트에서 카드를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| cardInfos | [BlacklistItem[]](#BlacklistItem) | 장치들의 블랙리스트에서 삭제할 카드 |

### DeleteAllBlacklist

장치의 블랙리스트에서 모든 카드를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllBlacklistMulti

여러 장치의 블랙리스트에서 모든 카드를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |

## FacilityCodeConfig

[+ 1.8.0] DoorInterface 장치에 facility code를 설정합니다.

```protobuf
message FacilityCodeConfig {
  repeated FacilityCode facilityCodes;
}
```
{: #FacilityCodeConfig }

[facilityCodes](#FacilityCode)
: 최대 __[16](#FacilityCodeConfigEnum)__개의 facility code를 지정합니다.

```protobuf
message FacilityCode {
  bytes code;
}
```
{: #FacilityCode }

code
: 최대 __[4바이트](#FacilityCodeConfigEnum)__ 크기의 facility code를 지정합니다.

```protobuf
enum Enum {
  FACILITY_CODE_SIZE = 4;
  MAX_FACILITY_CODE = 16;
}
```
{: #FacilityCodeConfigEnum }

### GetFacilityCodeConfig

장치의 facility code 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [FacilityCodeConfig](#FacilityCodeConfig) | 장치의 facility code 구성  |

### SetFacilityCodeConfig

장치의 facility code 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [FacilityCodeConfig](#FacilityCodeConfig) | 장치에 기록할 facility code 구성 |

### SetFacilityCodeConfigMulti

여러 장치의 facility code 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [FacilityCodeConfig](#FacilityCodeConfig) | 장치들에 기록할 facility code 구성 |

## LockOverride

[+ 1.9.0] 일반적으로 문이 잠겨 있을 때는 인증을 시도해도 문이 열리지 않습니다.  
V1.9.0은 __화재 또는 기타 재난 상황__에서 ___비상 문 열림을 위한 방법___을 제공합니다.  
비상 문 열림에 사용되는 카드를 Lock Override로 설정하여 장치에 인식시키고, 문이 잠겨 있는 경우 Lock Override로 설정된 카드 인증을 사용하여 문이 열립니다. 문이 잠겨 있지 않은 경우, 해당 카드에 대한 일반 인증이 수행됩니다(카드가 일반 사용자에게 사전 할당된 경우).  
비상 문 열림은 Lock Override로 등록된 카드가 블랙리스트에 있더라도 유효합니다.
또한, 슬레이브 장치가 Lock Override를 지원하지 않더라도, 마스터 장치가 지원하면 Lock Override를 사용한 비상 문 열림이 가능합니다.
Lock override에는 다음과 같은 제약 사항이 있습니다.
1. 한 사용자에게 최대 8개의 Lock Override 자격 증명을 할당할 수 있습니다.  
1. 한 장치에 최대 1000개의 Lock Override 자격 증명을 설정할 수 있습니다.

현재 Lock Override와 함께 사용할 수 있는 인증 방법은 다음과 같습니다.
* CSN card
* SC card


```protobuf
message LockOverride {
  bytes cardID = 1;
  uint32 issueCount = 2;

  Type type = 3;
  uint32 size = 4;
  string userID = 5;
}
```
{: #LockOverride }

cardID
: 32바이트 카드 ID입니다.

issueCount
: 스마트카드에서만 유효합니다.

[type](#Type)
: 

size
: 이 값은 항상 32입니다. CSNCard는 기록할 수 없다는 점에 유의하시기 바랍니다.

userID
: 카드가 이미 사용자에게 할당된 경우, 해당 사용자의 user ID를 설정할 수 있습니다.  
카드를 사용자에게 할당하지 않고 비상 열림 용도로만 사용하려는 경우에는 이 정보를 비워 두시기 바랍니다. 이 경우 문이 잠겨 있지 않으면 카드 인증이 일반 인증으로 수행되지 않으며, 문이 열리지 않습니다.


### GetLockOverride

장치의 lock override를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| lockOverrides | [LockOverride[]](#LockOverride) | Lock override 검색 필터 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| lockOverrides | [LockOverride[]](#LockOverride) | 장치의 lock override |

### GetAllLockOverride

장치의 모든 lock override를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| lockOverrides | [LockOverride[]](#LockOverride) | 장치의 lock override |

### SetLockOverride

장치에 lock override를 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| lockOverrides | [LockOverride[]](#LockOverride) | 장치에 설정할 lock override |

### SetLockOverrideMulti

여러 장치에 lock override를 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| lockOverrides | [LockOverride[]](#LockOverride) | 여러 장치에 설정할 lock override |

### DeleteLockOverride

장치에서 lock override를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| lockOverrides | [LockOverride[]](#LockOverride) | Lock override 삭제 필터 |

### DeleteLockOverrideMulti

여러 장치에서 lock override를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| lockOverrides | [LockOverride[]](#LockOverride) | Lock override 삭제 필터 |

### DeleteAllLockOverride

장치의 모든 lock override를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllLockOverrideMulti

여러 장치의 모든 lock override를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
