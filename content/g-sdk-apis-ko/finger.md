---
title: "Fingerprint API"
toc_label: "Fingerprint"  
---

## Scan/Verify

장치에서 손가락을 스캔하여 지문 템플릿을 가져올 수 있습니다. 또한 두 지문 템플릿이 서로 일치하는지 검증할 수도 있습니다.

### Scan

장치에서 지문을 스캔합니다. 지문 템플릿의 품질은 0(최악)에서 100(최상) 사이의 숫자로 표현됩니다. __qualityThreshold__ 를 사용하면 최소 품질 점수를 지정할 수 있습니다. 품질 점수가 이 임계값보다 낮고 [FingerConfig.advancedEnrollment](#FingerConfig) 가 true이면 오류가 반환됩니다. 

```protobuf
enum TemplateFormat {
  TEMPLATE_FORMAT_SUPREMA = 0x00;
  TEMPLATE_FORMAT_ISO = 0x01;
  TEMPLATE_FORMAT_ANSI = 0x02;	
}
```
{: #TemplateFormat}

TEMPLATE_FORMAT_SUPREMA
: 기본 형식입니다. 다른 벤더의 장치에서 취득한 템플릿과의 호환성이 필요한 경우가 아니라면 변경하지 않아야 합니다.


{: #TemplateFormat}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| templateFormat | [TemplateFormat](#TemplateFormat) | 취득할 지문 템플릿의 형식 |
| qualityThreshold | uint32 | 템플릿이 충족해야 하는 최소 품질 점수 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| templateData | byte[] | 스캔된 템플릿 데이터. 크기는 384바이트입니다 |
| qualityScore | uint32 | 템플릿의 품질 점수 |

### GetImage

마지막 [Scan](#scan)에서 캡처된 지문 이미지를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| BMPImage | byte[] | BMP 파일 형식의 지문 이미지 |

### Verify

[FingerData](#FingerData) 는 한 손가락의 두 템플릿으로 구성됩니다. [Verify](#verify) 를 사용하여 두 템플릿이 서로 일치하는지 검증할 수 있습니다.

```protobuf
enum FingerFlag {
  BS2_FINGER_FLAG_NONE = 0x00;
  BS2_FINGER_FLAG_DURESS = 0x01;
}

message FingerData {
  int32 index;
  uint32 flag;
  repeated bytes templates;
}
```
index
: 애플리케이션에서 지문 데이터를 관리하는 데 사용할 수 있습니다. 장치에서는 무시됩니다.

flag
: 지문의 용도를 나타냅니다.

templates
: 동일한 손가락의 두 지문 템플릿입니다. 지문 템플릿의 크기는 384바이트보다 크지 않아야 합니다.

{: #FingerData }

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| fingerData | [FingerData](#FingerData) | 검증할 지문 데이터 |

## Config

대부분의 경우 기본값이 적합합니다. 이 파라미터들 중 일부는 인증 성능에 좋지 않은 영향을 줄 수 있으므로, 변경하기 전에 설명을 주의 깊게 읽으십시오. 

```protobuf
message FingerConfig {
  SecurityLevel securityLevel;
  FastMode fastMode;
  Sensitivity sensitivity;
  SensorMode sensorMode;
  TemplateFormat templateFormat;
  int32 scanTimeout;
  bool advancedEnrollment;
  bool showImage;
  LFDLevel LFDLevel;
  bool checkDuplicate;
}
```
{: #FingerConfig }

[securityLevel](#SecurityLevel)
: 보안 수준이 높을수록 오인식률(False Acceptance Ratio, FAR)이 낮아집니다. 그러나 오거부율(False Rejection Ratio, FRR)은 높아집니다. 이 수준이 무엇을 의미하는지 이해하려면 [해당 문서](https://support.supremainc.com/en/support/solutions/articles/24000005895--general-about-far-and-frr-rates)를 참조하십시오.

[fastMode](#FastMode)
: 모드가 빠를수록 인증 성능이 약간 저하되는 대신 매칭 속도가 빨라집니다. 대부분의 경우 __AUTOMATIC__ 이 속도와 정확도 사이의 최적의 절충안입니다.

[sensitivity](#Sensitivity)
: 지문 센서의 감도를 조정할 수 있습니다. 기본값은 __HIGHEST_SENSITIVE__ 입니다.

[sensorMode](#SensorMode)
: __ACTIVATED_BY_PROXIMITY__ 를 사용하면 근접 센서가 손가락을 감지한 후에만 센서를 켭니다. 

[templateFormat](#TemplateFormat)
: 한 장치에서 템플릿 형식을 혼합할 수 없습니다. 따라서 형식을 변경하려면 먼저 등록된 모든 템플릿을 삭제해야 합니다. 

scanTimeout
: 지문을 캡처하기 위한 타임아웃(초)입니다. 기본값은 10초입니다.

advancedEnrollment
: true이면 스캔된 템플릿의 품질이 [qualityThreshold](#scan)보다 낮을 때 오류를 반환합니다.

showImage
: true이면 지문을 스캔한 후 장치 화면에 지문 이미지를 표시합니다. 

[LFDLevel](#LFDLevel)
: 위조 지문 감지(Live Finger Detection, LFD)의 수준을 지정합니다. 기본값은 __NOT_USED__ 입니다.

checkDuplicate
: true이면 중복된 지문을 가진 사용자는 등록할 수 없습니다.

```protobuf
enum SecurityLevel {
  SECURE = 0x00;
  MORE_SECURE = 0x01;
  MOST_SECURE = 0x02;
}
```
{: #SecurityLevel}

```protobuf
enum FastMode {
  AUTOMATIC = 0x00;
  FAST = 0x01;
  FASTER = 0x02;
  FASTEST = 0x03;
}
```
{: #FastMode}

```protobuf
enum Sensitivity {
  LOWEST_SENSITIVE = 0x00;
  LEVEL0_SENSITIVE = 0x00;
  LEVEL1_SENSITIVE = 0x01;
  LEVEL2_SENSITIVE = 0x02;
  LEVEL3_SENSITIVE = 0x03;
  LEVEL4_SENSITIVE = 0x04;
  LEVEL5_SENSITIVE = 0x05;
  LEVEL6_SENSITIVE = 0x06;
  LEVEL7_SENSITIVE = 0x07;
  HIGHEST_SENSITIVE = 0x07;
}
```
{: #Sensitivity}

```protobuf
enum SensorMode {
  ALWAYS_ON = 0;
  ACTIVATED_BY_PROXIMITY = 1;
}
```
{: #SensorMode}


```protobuf
enum LFDLevel {
  NOT_USED = 0x00;
  STRICT = 0x01;
  MORE_STRICT = 0x02;
  MOST_STRICT = 0x03;
}
```
{: #LFDLevel}

### GetConfig

장치의 지문 설정을 가져옵니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [FingerConfig](#FingerConfig) | 장치의 지문 설정 |

### SetConfig

장치의 지문 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [FingerConfig](#FingerConfig) | 장치에 기록할 지문 설정 |

### SetConfigMulti

여러 장치의 지문 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [FingerConfig](#FingerConfig) | 장치들에 기록할 지문 설정 |
