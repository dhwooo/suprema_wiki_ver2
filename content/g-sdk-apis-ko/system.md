---
title: "System API"
toc_label: "System"  
---

__SystemConfig__를 사용하여 일부 시스템 수준 옵션을 설정할 수 있습니다.

## Config

```protobuf
message SystemConfig {
  int32 timeZone;
  bool syncTime;
  bool isLocked; 
  bool useInterphone;
  bool OSDPKeyEncrypted;
  bool useJobCode;
  bool useAlphanumericID;
  CameraFrequency cameraFrequency;
  bool useSecureTamper;
  uint32 useCardOperationMask;
  bool adminTwoStepAuth;
}
```
{: #SystemConfig}

timeZone/syncTime
: 이 옵션들은 [TimeConfig]({{'/api/time/' | relative_url}}#TimeConfig)를 사용하여 설정할 수 있습니다.

isLocked
: true이면 장치가 잠겨 있어 어떤 사용자 입력도 처리하지 않음을 의미합니다. 잠긴 장치의 잠금을 해제하려면 [Device.Unlock]({{'/api/device/' | relative_url}}#unlock)을 사용하십시오.

useInterphone
: 장치에 인터폰이 있는 경우, 이 플래그로 인터폰을 활성화/비활성화할 수 있습니다. 

OSDPKeyEncrypted
: true이면 보안 OSDP 키를 사용합니다. 

useJobCode
: true이면 사용자에게 작업 코드를 입력하도록 요청합니다. [JobCode]({{'/api/tna/' | relative_url}}#JobCode)를 참조하십시오.

useAlphanumericID
: true이면 영숫자 ID를 허용합니다. [CapabilityInfo.alphanumericIDSupported]({{'/api/device/' | relative_url}}#CapabilityInfo)가 true여야 합니다.

[cameraFrequency](#CameraFrequency) : 

useSecureTamper
: true이면 장치의 탬퍼 스위치가 켜졌을 때 사용자, 로그, 키, 인증서와 같은 민감한 데이터를 장치에서 삭제합니다.

useCardOperationMask
: 장치에서 모든 종류의 카드를 읽지 않도록 하는 카드 선택 옵션을 제공합니다. 
MASK를 사용하여 여러 카드를 선택할 수 있습니다. 사용자는 이 옵션을 사용하여 특정 카드 읽기 옵션을 선택하거나 선택 해제할 수 있습니다. 
다만, 장치가 지원하는 카드 유형에만 적용할 수 있습니다. 장치에서 지원하지 않는 카드 유형을 추가하면 무시됩니다. 
또한, 필요한 카드 유형 MASK는 CARD_OPERATION_MASK_USE와 결합되어야 합니다. 
예를 들어, EM 카드만 선택된 경우 useCardOperationMask는 0x80000001로 설정되어야 합니다.

| Value | Define | Description |
| --------- | ----------- | ----------- |
| 0xFFFFFFFF | CARD_OPERATION_MASK_DEFAULT | 코드에서 직접 정의하여 사용하십시오 |
| 0x80000000 | CARD_OPERATION_MASK_USE | 코드에서 직접 정의하여 사용하십시오 |
| 0x00000800 | CARD_OPERATION_MASK_CUSTOM_DESFIRE_EV1 | |
| 0x00000400 | CARD_OPERATION_MASK_CUSTOM_CLASSIC_PLUS | |
| 0x00000200 | CARD_OPERATION_MASK_BLE | |
| 0x00000100 | CARD_OPERATION_MASK_NFC | |
| 0x00000080 | CARD_OPERATION_MASK_SEOS | |
| 0x00000040 | CARD_OPERATION_MASK_SR_SE | |
| 0x00000020 | CARD_OPERATION_MASK_DESFIRE_EV1 | |
| 0x00000010 | CARD_OPERATION_MASK_CLASSIC_PLUS | |
| 0x00000008 | CARD_OPERATION_MASK_ICLASS | |
| 0x00000004 | CARD_OPERATION_MASK_MIFARE_FELICA | |
| 0x00000002 | CARD_OPERATION_MASK_HIDPROX | |
| 0x00000001 | CARD_OPERATION_MASK_EM | |

adminTwoStepAuth
: [+ V1.9] 2단계 마스터 관리자 인증을 수행할지 여부를 설정합니다.
이 값은 CE RED(무선 장비에 관한 유럽 지침)로 인해 마스터 관리자를 지원하는 신규 장치에서는 변경할 수 없습니다. 이를 지원하지 않는 기존 장치에서 업그레이드할 때만 변경할 수 있습니다.
false로 설정하면 1단계 인증만 수행되며, 일반 사용자 인증에 영향을 주는 [AuthConfig]({{'/api/auth/' | relative_url}}#AuthConfig)와 같은 정보와 관계없이 마스터 관리자에게 할당된 자격 증명 정보만으로 인증이 수행됩니다.
true로 설정하면 2단계 인증이 수행되며, 자격 증명 부족이나 기타 이유로 장치가 1단계 인증만 수행할 수 있는 경우 인증에 실패할 수 있습니다. [MasterAdmin]({{'/api/masteradmin/' | relative_url}}#MasterAdmin)을 참조하십시오.



```protobuf
enum CameraFrequency {
  FREQ_NONE = 0x00;
  FREQ_50HZ = 1;
  FREQ_60HZ = 2;
}
```
{: #CameraFrequency}


### GetConfig

장치의 시스템 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [SystemConfig](#SystemConfig) | 장치의 시스템 설정 |

### SetConfig

장치의 시스템 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [SystemConfig](#SystemConfig) | 장치에 기록할 시스템 설정 |


### SetConfigMulti

여러 장치의 시스템 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [SystemConfig](#SystemConfig) | 장치들에 기록할 시스템 설정 |
