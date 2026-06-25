---
title: "Device API"
toc_label: "Device"  
---

이 API들은 세 가지 범주로 분류할 수 있습니다.

[Information APIs](#information)
: 장치의 버전 및 기능 정보를 제공합니다.

[Management APIs](#management)
: 장치의 잠금/잠금 해제/재부팅 및 펌웨어 업그레이드 기능을 제공합니다.

[Reset APIs](#reset)
: 장치의 설정 또는 사용자 데이터베이스를 초기화합니다.

## Information

### GetInfo

장치의 버전 정보를 가져옵니다.

```protobuf
message FactoryInfo {
  string MACAddr;
  string modelName;
  string firmwareVersion;
  string kernelVersion;
  string BSCoreVersion;
  string boardVersion;
}
```
{: #FactoryInfo }

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| info | [FactoryInfo](#FactoryInfo) | 장치의 버전 정보 |

### GetCapabilityInfo

각 장치 유형은 고유한 기능을 가지고 있습니다. 예를 들어, WLAN은 BioStation A2에서는 지원되지만 BioStation L2에서는 지원되지 않습니다.

```protobuf
message CapabilityInfo {
  Type type;

  uint32 maxNumOfUser;

  bool PINSupported;
  bool cardSupported;
  bool card1xSupported;
  bool SEOSSupported;
  bool fingerSupported;
  bool faceSupported;

  bool userNameSupported;
  bool userPhotoSupported;
  bool userPhraseSupported;
  bool alphanumericIDSupported;

  bool WLANSupported;
  bool imageLogSupported;
  bool VOIPSupported;	

  bool TNASupported;
  bool jobCodeSupported;

  bool wiegandSupported;
  bool wiegandMultiSupported;
  bool triggerActionSupported;
  bool DSTSupported;
  bool DNSSupported;	

  bool OSDPKeySupported;
  bool RS485ExtSupported;

  bool QRSupported;
}
```
{: #CapabilityInfo }

```protobuf
enum Type {
  BIOENTRY_PLUS	= 0x01;
  BIOENTRY_W = 0x02;
  BIOLITE_NET = 0x03;
  XPASS	= 0x04;
  XPASS_S2 = 0x05;
  ENTRY_MAX = 0x05;
  SECURE_IO_2 = 0x06;
  DOOR_MODULE_20 = 0x07;
  BIOSTATION_2 = 0x08;
  BIOSTATION_A2	= 0x09;
  FACESTATION_2	= 0x0A;
  IO_DEVICE = 0x0B;
  BIOSTATION_L2	= 0x0C;
  BIOENTRY_W2 = 0x0D;
  RS485_SLAVE = 0x80;
  CORESTATION_40 = 0x0E;
  OUTPUT_MODULE = 0x0F;
  INPUT_MODULE = 0x10;
  BIOENTRY_P2 = 0x11;
  BIOLITE_N2 = 0x12;
  XPASS2 = 0x13;
  XPASS_S3 = 0x14;
  BIOENTRY_R2 = 0x15;
  XPASS_D2 = 0x16;
  DOOR_MODULE_21 = 0x17;
  XPASS_D2_KEYPAD = 0x18;
  FACELITE = 0x19;
  XPASS2_KEYPAD	= 0x1A;
  XPASS_D2_REV = 0x1B;
  XPASS_D2_KEYPAD_REV = 0x1C;
  FACESTATION_F2_FP = 0x1D;
  FACESTATION_F2 = 0x1E;
  XSTATION_2_QR = 0x1F;
  XSTATION_2 = 0x20;
  IM_120 = 0x21;
  XSTATION_2_FP = 0x22;
  BIOSTATION_3 = 0x23;
  BIOSTATION_2A = 0x26;
  BIOENTRY_W3 = 0x2A;
  CORESTATION_20 = 0x2B;
  DOOR_INTERFACE_24 = 0x2C;
  BIOSTATION_3_MAX = 0x2D;
  BIOSTATION_3_MAX_FP = 0x2E;
  XPASS_Q2 = 0x2F;
}
```
{: #Type }

```protobuf
enum SwitchType {
  NORMALLY_OPEN = 0x00;
  NORMALLY_CLOSED = 0x01;
}
```
{: #SwitchType }
NORMALLY_OPEN
: 스위치가 평상시에 열려 있습니다.

NORMALLY_CLOSED
: 스위치가 평상시에 닫혀 있습니다.

```protobuf
enum LEDColor {
  LED_COLOR_OFF = 0x00;
  LED_COLOR_RED = 0x01;
  LED_COLOR_YELLOW = 0x02;
  LED_COLOR_GREEN = 0x03;
  LED_COLOR_CYAN = 0x04;
  LED_COLOR_BLUE = 0x05;
  LED_COLOR_MAGENTA = 0x06;
  LED_COLOR_WHITE = 0x07;
}
```
{: #LEDColor }

```protobuf
enum BuzzerTone {
  BUZZER_TONE_OFF = 0x00;
  BUZZER_TONE_LOW = 0x01;
  BUZZER_TONE_MIDDLE = 0x02;
  BUZZER_TONE_HIGH = 0x03;
}
```
{: #BuzzerTone }


| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| info | [CapabilityInfo](#CapabilityInfo) | 장치 유형의 기능 정보 |


### GetCapability

각 장치 유형은 고유한 기능을 가지고 있습니다. 예를 들어, "Extended Auth"는 RGB 기반 비주얼 얼굴 인증 장치에서는 지원되지만 BioStation 2와 FaceStation 2에서는 지원되지 않습니다.

```protobuf
message DeviceCapability {
	uint32 maxUsers;
	uint32 maxEventLogs;
	uint32 maxImageLogs;
	uint32 maxBlacklists;
	uint32 maxOperators;
	uint32 maxCards;
	uint32 maxFaces;
	uint32 maxFingerprints;
	uint32 maxUserNames;
	uint32 maxUserImages;
	uint32 maxUserJobs;
	uint32 maxUserPhrases;
	uint32 maxCardsPerUser;
	uint32 maxFacesPerUser;
	uint32 maxFingerprintsPerUser;
	uint32 maxInputPorts;
	uint32 maxOutputPorts;
	uint32 maxRelays;
	uint32 maxRS485Channels;
	
	bool cameraSupported;
	bool tamperSupported;
	bool wlanSupported;
	bool displaySupported;
	bool thermalSupported;
	bool maskSupported;
	bool faceExSupported;
	bool voipExSupported;
	
	bool EMCardSupported;
	bool HIDProxCardSupported;
	bool MifareFelicaCardSupported;
	bool iClassCardSupported;
	bool ClassicPlusCardSupported;
	bool DesFireEV1CardSupported;
	bool SRSECardSupported;
	bool SEOSCardSupported;
	bool NFCSupported;
	bool BLESupported;
	bool CustomClassicPlusSupported;
	bool CustomDesFireEV1Supported;
	bool TOM_NFCSupported;
	bool TOM_BLESupported;
	bool CustomFelicaSupported;
	bool useCardOperation;

	bool extendedAuthSupported;
	
	bool cardInputSupported;
	bool fingerprintInputSupported;
	bool faceInputSupported;
	bool idInputSupported;
	bool PINInputSupported;
	
	bool biometricOnlySupported;
	bool biometricPINSupported;

	bool cardOnlySupported;
	bool cardBiometricSupported;
	bool cardPINSupported;
	bool cardBiometricOrPINSupported;
	bool cardBiometricPINSupported;
	
	bool idBiometricSupported;
	bool idPINSupported;
	bool idBiometricOrPINSupported;
	bool idBiometricPINSupported;
	
	bool extendedFaceOnlySupported;
	bool extendedFaceFingerprintSupported;
	bool extendedFacePINSupported;
	bool extendedFaceFingerprintOrPINSupported;
	bool extendedFaceFingerprintPINSupported;
	
	bool extendedFingerprintOnlySupported;
	bool extendedFingerprintFaceSupported;
	bool extendedFingerprintPINSupported;
	bool extendedFingerprintFaceOrPINSupported;
	bool extendedFingerprintFacePINSupported;
	
	bool extendedCardOnlySupported;
	bool extendedCardFaceSupported;
	bool extendedCardFingerprintSupported;
	bool extendedCardPINSupported;
	bool extendedCardFaceOrFingerprintSupported;
	bool extendedCardFaceOrPINSupported;
	bool extendedCardFingerprintOrPINSupported;
	bool extendedCardFaceOrFingerprintOrPINSupported;
	bool extendedCardFaceFingerprintSupported;
	bool extendedCardFacePINSupported;
	bool extendedCardFingerprintFaceSupported;
	bool extendedCardFingerprintPINSupported;
	bool extendedCardFaceOrFingerprintPINSupported;
	bool extendedCardFaceFingerprintOrPINSupported;
	bool extendedCardFingerprintFaceOrPINSupported;

	bool extendedIdFaceSupported;
	bool extendedIdFingerprintSupported;
	bool extendedIdPINSupported;
	bool extendedIdFaceOrFingerprintSupported;
	bool extendedIdFaceOrPINSupported;
	bool extendedIdFingerprintOrPINSupported;
	bool extendedIdFaceOrFingerprintOrPINSupported;
	bool extendedIdFaceFingerprintSupported;
	bool extendedIdFacePINSupported;
	bool extendedIdFingerprintFaceSupported;
	bool extendedIdFingerprintPINSupported;
	bool extendedIdFaceOrFingerprintPINSupported;
	bool extendedIdFaceFingerprintOrPINSupported;
	bool extendedIdFingerprintFaceOrPINSupported;

	bool intelligentPDSupported;
	bool updateUserSupported;
	bool simulatedUnlockSupported;
	bool smartCardByteOrderSupported;
	bool qrAsCSNSupported;
	bool rtspSupported;
	bool lfdSupported;
	bool visualQRSupported;

	uint32 maxVoipExtensionNumbers;

	bool osdpStandardCentralSupported;
	bool enableLicenseFuncSupported;
	bool keypadBacklightSupported;
	bool uzWirelessLockDoorSupported;
	bool customSmartCardSupported;
	bool tomSupported;
	bool tomEnrollSupported;
	bool showOsdpResultbyLED;

	bool customSmartCardFelicaSupported;
	bool ignoreInputAfterWiegandOut;
	bool setSlaveBaudrateSupported;
	bool changeRtspResolutionSupported;
	bool changeVoipResolutionSupported;
	bool changeVoipTransportSupported;
	bool showOptionUserInfoSupported;
	bool changeScrambleKeypadSupported;

	uint32 visualFaceTemplateVersion;

	bool authOnlyUnMaskSupported;
	bool mifareExSupported;
	bool lockOverrideSupported;
	bool doorModeOverrideSupported;
	bool extendedDoorOpenTimeSupported;
	bool realtimeDeviceIOStatusSupported;
	bool dynamicSlaveDeviceSupported;
    bool secureTamperSupported;


	bool customSmartcardSlaveSupported;
	bool serverPrivateMsgSupported;
	bool facilityCodeSupported;
	bool masterAdminSupported;
	bool adminTwoStepAuthSupported;
}
```
{: #DeviceCapability }

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| info | [DeviceCapability](#DeviceCapability) | 장치 유형의 기능 정보 |


## Management

### Lock

장치를 일시적으로 비활성화합니다. 잠긴 장치는 어떤 사용자 입력도 처리하지 않습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 잠글 장치의 ID |

### LockMulti

여러 장치를 일시적으로 비활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 잠글 장치들의 ID |


### Unlock

잠긴 장치를 잠금 해제합니다. 장치가 다시 사용자 입력을 처리하기 시작합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 잠금 해제할 장치의 ID |

### UnlockMulti

잠긴 여러 장치를 잠금 해제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 잠금 해제할 장치들의 ID  |

### Reboot

장치를 재부팅합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 재부팅할 장치의 ID |

### RebootMulti

여러 장치를 재부팅합니다

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 재부팅할 장치들의 ID |

### UpgradeFirmware

장치의 펌웨어를 업그레이드합니다. 새 펌웨어는 [당사 지원 사이트](https://www.supremainc.com/en/support/technical-resources.asp)에서 다운로드할 수 있습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 업그레이드할 장치의 ID |
| firmwareData | byte[] | [지원 사이트](https://www.supremainc.com/en/support/technical-resources.asp)에서 다운로드한 펌웨어 |

### UpgradeFirmwareMulti

여러 장치의 펌웨어를 업그레이드합니다. 이 장치들은 동일한 유형이어야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 업그레이드할 장치들의 ID | |
| firmwareData | byte[] | [지원 사이트](https://www.supremainc.com/en/support/technical-resources.asp)에서 다운로드한 펌웨어 |


## Reset

### FactoryReset

장치를 초기 상태로 되돌립니다.

주의하십시오. 장치의 모든 데이터베이스와 설정이 손실됩니다.
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 초기화할 장치의 ID |

### FactoryResetMulti

여러 장치를 초기 상태로 되돌립니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 초기화할 장치들의 ID |

### ClearDB

장치의 사용자 데이터베이스를 비웁니다.

모든 사용자 정보가 손실됩니다. 삭제하기 전에 [User.Get]({{'/api/user/' | relative_url}}#get)을 사용하여 사용자 데이터베이스를 백업할 수 있습니다.
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 데이터베이스를 삭제할 장치의 ID |

### ClearDBMulti

여러 장치의 사용자 데이터베이스를 비웁니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 데이터베이스를 삭제할 장치들의 ID |

### ResetConfig

장치의 설정을 초기화합니다. 네트워크 설정을 유지하려면 __withNetwork__를 false로 설정하십시오. 액세스 그룹, 액세스 레벨, 스케줄과 같은 데이터를 유지하려면 __withDB__를 false로 설정하십시오.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 설정을 초기화할 장치의 ID |
| withNetwork | bool | true이면 네트워크 설정도 함께 초기화합니다 | 
| withDB | bool | true이면 액세스 그룹, 액세스 레벨, 스케줄과 같은 데이터도 함께 삭제합니다 | 

### ResetConfigMulti

여러 장치의 설정을 초기화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 설정을 초기화할 장치들의 ID |
