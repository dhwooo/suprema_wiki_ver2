---
title: "Face API"
toc_label: "Face"  
---

얼굴 인증 장치에는 IR 기반 인증 장치와 RGB 기반 비주얼 얼굴 인증 장치가 있습니다.
IR 기반 장치에는 FaceStation 2와 FaceLite가 있습니다.
RGB 기반 비주얼 얼굴 인증 장치에는 FaceStation F2, BioStation 3, BioEntry W3 등이 있습니다.
이 두 가지 유형 간에는 몇 가지 차이가 있습니다.
<!-- Face authentication is provided by FaceStation 2, FaceLite, FaceStation F2, and BioStation 3. The newest model, FaceStation F2 and BioStation 3 uses a fusion matching algorithm to improve its authentication performance. Due to this, there are a couple of differences between them. -->

|      |       | IR 기반 인증 장치 | RGB 기반 비주얼 얼굴 인증 장치 |
| ---- | ----- | ------------------------ | -----------    |
| FaceData | flag  | BS2_FACE_FLAG_NONE  |  BS2_FACE_FLAG_WARPED / BS2_FACE_FLAG_EX / BS2_FACE_FLAG_TEMPLATE_ONLY |
|          | templates  | 최대 30개  | 최대 10개 |
|          | imageData  | 비주얼 이미지  | 비주얼 이미지 |
|          | irTemplates | 사용 안 함 | 최대 10개 |
|          | irImageData | 사용 안 함 | IR 이미지 |
| Auth Group |  | 지원  | 지원 안 함  |

{: #F2Differences}

## Scan

```protobuf
enum FaceFlag {
  BS2_FACE_FLAG_NONE = 0x00;
  BS2_FACE_FLAG_WARPED = 0x01;
  BS2_FACE_FLAG_TEMPLATE_ONLY = 0x20;
  BS2_FACE_FLAG_EX = 0x100;
}

message FaceData {
  int32 index;
  uint32 flag;
  repeated bytes templates;     // When BS2_FACE_FLAG_TEMPLATE_ONLY, only templates is used.
  bytes imageData;

  // only for RGB-Based Visual Face Authentication Device (flag & BS2_FACE_FLAG_EX is true)
  repeated bytes irTemplates;
  bytes irImageData;
}
```
{: #FaceData}

index
: 애플리케이션에서 얼굴 데이터를 관리하는 데 사용할 수 있습니다. 장치에서는 사용하지 않습니다.

flag
: __BS2_FACE_FLAG_EX__ 가 설정되어 있으면, 해당 얼굴 데이터가 RGB 기반 비주얼 얼굴 인증 장치에서 획득되었음을 의미합니다. 그리고 해당 데이터에는 __irTemplates__ 와 __irImageData__ 가 포함됩니다. 그렇지 않은 경우에는 IR 기반 인증 장치에서 획득된 것이며, __irTemplates__ 와 __irImageData__ 모두 포함되지 않습니다. __BS2_FACE_FLAG_WARPED__ 는 이미지가 정규화되었음을 나타냅니다. <BR>
__[+ 1.7.1]__ 사용자를 등록할 때, 템플릿만 전송할 수 있도록 __BS2_FACE_FLAG_TEMPLATE_ONLY__ 플래그가 지원됩니다.
템플릿은 __templates__ 필드를 통해 지정됩니다.

기본적으로 IR 기반 얼굴 인식 장치(FaceStation 2, FaceLite)는 비주얼 카메라 기반 얼굴 인식 장치(FaceStation F2, BioStation 3)와 그 방식이 매우 다릅니다.
G-SDK의 FaceData 메시지 구조는 서로 다른 방식의 IR 기반 장치와 비주얼 카메라 기반 장치 모두에 얼굴 데이터를 전송하도록 설계된 단일 구조입니다.
이는 템플릿 혼용을 지원한다는 의미가 아닙니다.
예를 들어, FaceStation 2의 얼굴 데이터를 FaceData 메시지에 설정하여 FaceStation 2 또는 FaceLite로 전송할 수 있습니다.
해당 데이터는 BioStation 3으로 전송하여 그대로 사용할 수 없습니다.
{: .notice--warning}


templates
: IR 기반 인증 장치에서는 최대 30개의 얼굴 템플릿을 반환할 수 있습니다. RGB 기반 비주얼 얼굴 인증 장치의 경우 최대 개수는 10개입니다. <BR>
__[+ 1.7.1]__ __BS2_FACE_FLAG_TEMPLATE_ONLY__ 플래그와 함께 templates를 설정하여 템플릿만으로 사용자를 등록할 수 있습니다.

imageData
: 얼굴의 BMP 이미지가 반환됩니다.

irTemplates
: RGB 기반 비주얼 얼굴 인증 장치에서는 최대 10개의 IR 템플릿을 반환할 수 있습니다.

irImageData
: 얼굴의 IR 이미지가 반환됩니다.

```protobuf
enum FaceEnrollThreshold {
  BS2_FACE_ENROLL_THRESHOLD_0 = 0x00;
  BS2_FACE_ENROLL_THRESHOLD_1 = 0x01;
  BS2_FACE_ENROLL_THRESHOLD_2 = 0x02;
  BS2_FACE_ENROLL_THRESHOLD_3 = 0x03;
  BS2_FACE_ENROLL_THRESHOLD_4 = 0x04;
  BS2_FACE_ENROLL_THRESHOLD_5 = 0x05;
  BS2_FACE_ENROLL_THRESHOLD_6 = 0x06;
  BS2_FACE_ENROLL_THRESHOLD_7 = 0x07;
  BS2_FACE_ENROLL_THRESHOLD_8 = 0x08;
  BS2_FACE_ENROLL_THRESHOLD_9 = 0x09;
}
```
{: #FaceEnrollThreshold}

BS2_FACE_ENROLL_THRESHOLD_0
: 가장 덜 엄격한 임계값입니다.

BS2_FACE_ENROLL_THRESHOLD_4
: 기본값입니다.

BS2_FACE_ENROLL_THRESHOLD_9
: 가장 엄격한 임계값입니다.


### Scan

얼굴을 스캔하여 해당 템플릿 데이터를 가져옵니다. __enrollThreshold__ 가 높을수록 더 좋은 품질의 얼굴 템플릿을 얻을 수 있습니다. 다만, 얼굴을 스캔하는 데 더 많은 시간이 걸립니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| enrollThreshold | [FaceEnrollThreshold](#FaceEnrollThreshold) | 얼굴 등록의 엄격도 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| faceData | [FaceData](#FaceData) | 스캔된 얼굴 데이터 |

### Extract

정규화된 이미지에서 얼굴 템플릿을 추출합니다.
스마트 카드에 얼굴 템플릿을 기록하는 데 사용할 수 있습니다.

RGB 기반 비주얼 얼굴 인증 장치에서만 지원됩니다. 이미지 파일이 RGB 기반 비주얼 얼굴 인증 장치에서 획득된 것이 아닌 경우, 이미지 데이터는 JPG 또는 PNG 파일 형식이어야 합니다.
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| imageData | byte[] | 이미지 파일이 RGB 기반 비주얼 얼굴 인증 장치에서 획득된 것이면 BMP 파일 형식이 됩니다. 그렇지 않으면 JPG 파일 형식만 지원됩니다. |
| isWarped | bool  | 이미지 파일이 RGB 기반 비주얼 얼굴 인증 장치에서 획득된 것이면 true여야 합니다. 그렇지 않으면 false여야 합니다. |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| templateData | byte[] | 이미지에서 추출된 템플릿 데이터 |

### Normalize

왜곡되지 않은(unwarped) 이미지에서 왜곡 보정된(warped) 이미지를 추출합니다.
PNG와 JPG 형식이 지원됩니다. JPG를 권장합니다. 왜곡되지 않은 이미지의 최대 해상도는 가로와 세로 모두 4000픽셀입니다. 다만, 1920픽셀 이하의 해상도를 권장합니다. 권장 파일 크기는 10MB 이하입니다.
이 기능은 사용자가 제공한 이미지에서 얼굴 위치를 감지하고, 후처리를 통해 인증에 적합한 Warped Image를 생성합니다. 따라서 얼굴이 카메라를 정면으로 향한 선명하고 고품질의 이미지를 사용하십시오. 원본 이미지가 흐리거나 왜곡되어 있으면 Warped Image 생성이 실패할 수 있습니다.
Warped Image 생성의 성공 여부는 원본 이미지에서 얼굴 영역의 해상도와 크기에 따라 달라집니다. 원본 이미지의 얼굴 영역은 최소 224 × 224픽셀이어야 하며, 전체 이미지 너비가 얼굴 너비의 최소 190% 이상인 이미지를 사용하는 것이 좋습니다. 원본 이미지의 얼굴이 너무 작거나 너무 크면 Warped Image 생성이 실패할 수 있습니다.
해상도와 파일 크기 요구 사항을 충족하더라도 생성이 계속 실패하는 경우, 얼굴 영역이 적절한 크기로 포함되도록 이미지 해상도나 얼굴 비율을 조정한 후 다시 시도하십시오.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| unwrappedImageData | byte[] | 왜곡되지 않은 이미지 데이터. |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| wrappedImageData | byte[] | 왜곡 보정된 이미지 데이터. |


## Config

대부분의 경우 기본값이 적합합니다. 이러한 파라미터 중 일부는 인증 성능에 나쁜 영향을 줄 수 있으므로, 변경하기 전에 설명을 주의 깊게 읽으십시오.

```protobuf
message FaceConfig {
  FaceSecurityLevel securityLevel;
  FaceLightCondition lightCondition;
  FaceEnrollThreshold enrollThreshold;
  FaceDetectSensitivity detectSensitivity;
  uint32 enrollTimeout; 
  FaceLFDLevel LFDLevel;
  bool quickEnrollment;
  FacePreviewOption previewOption;
  bool checkDuplicate;
  FaceOperationMode operationMode;
  uint32 maxRotation;
  uint32 faceWidthMin;
  uint32 faceWidthMax;
  uint32 searchRangeX;
  uint32 searchRangeWidth;
  uint32 detectDistanceMin;
  uint32 detectDistanceMax;
  bool wideSearch;
  bool unableToSaveImageOfVisualFace;
}
```
{: #FaceConfig}

[securityLevel](#FaceSecurityLevel)
: 보안 수준이 높을수록 오수락률(False Acceptance Ratio, FAR)은 낮아집니다. 다만, 오거부율(False Rejection Ratio, FRR)은 높아집니다. 기본값은 __BS2_FACE_SECURITY_NORMAL__ 입니다.

[lightCondition](#FaceLightCondition)
: 조명 조건은 인증 성능에 큰 영향을 줄 수 있습니다. 기본값은 __BS2_FACE_LIGHT_CONDITION_INDOOR__ 입니다.

[enrollThreshold](#FaceEnrollThreshold)
: 얼굴 등록의 엄격도입니다. 기본값은 __BS2_FACE_ENROLL_THRESHOLD_4__ 입니다.

[detectSensitivity](#FaceDetectSensitivity)
: 얼굴을 감지한 후 얼굴 인증이 자동으로 시작됩니다. 이 파라미터는 얼굴 감지의 민감도를 지정합니다. 기본값은 __BS2_FACE_DETECT_SENSITIVITY_MIDDLE__ 입니다.

enrollTimeout
: 얼굴 등록을 위한 타임아웃(초)입니다. 기본값은 60초입니다.

LFDLevel
: LFD(Live Face Detection - 위조 얼굴 감지) 민감도 설정입니다.

| Value | Description | Default |
| ----- | ----------- | ------- |
| 0 | 보통  | IR 기반 얼굴 인증 장치 |
| 1 | 보안 | RGB 기반 비주얼 얼굴 인증 장치 |
| 2 | 강화 보안 | |
| 3 | 최고 보안 | |

quickEnrollment
: 빠른 얼굴 등록 절차입니다. 고품질의 얼굴 템플릿으로 등록하려면 false를 사용하십시오.

| Value | Description |
| ----- | ----------- |
| true | 단일 단계로 진행하는 얼굴 등록 절차  |
| false | 3단계로 진행하는 얼굴 등록 절차 |

previewOption
: 얼굴로 인증할 때의 IR 카메라 미리보기 옵션입니다.
FaceLite에만 사용됩니다.

| Value | Description |
| ----- | ----------- |
| 0 |	미리보기 사용 안 함 |
| 1 |	인증 초기에는 미리보기를 사용하지 않고, 1/2 단계에서 미리보기 |
| 2 |	인증의 모든 단계에서 미리보기 |

checkDuplicate
: 스캔된 얼굴이 장치에 중복되어 있는지 확인합니다.

__*operationMode*__
* __FaceStation F2 V1.0.0__ 은 다음 동작 모드로 설정할 수 있으며, 기본값은 Fusion 모드입니다.

| Value | Mode | Description | Default |
| ----- | ---- | ----------- | ------- |
| 0 |	Fusion Mode | 비주얼 매칭 + IR 매칭	| 기본값 |
| 1 |	Visual Mode | 비주얼 매칭 | |
| 2 |	Visual + IR | 비주얼 매칭, IR은 얼굴만 감지 | |

* __FaceStation F2 V1.0.1 이상 버전__, __RGB 기반 비주얼 얼굴 인증 장치__ 에서는 다음과 같은 의미로 사용됩니다.

| Value |	Mode | Description | Default |
| ----- | ---- | ----------- | ------- |
| 0 |	Fusion Mode	비주얼 매칭 + IR 매칭	| 기본값 |
| 1 |	Fast Mode	비주얼 매칭	| |

maxRotation
: __RGB 기반 비주얼 얼굴 인증 장치__
얼굴이 정상적으로 인식되면 정면입니다.
그래도 장치가 얼굴을 감지할 때 이미지가 정면에서 몇 도 회전되었는지 판단할 수 있습니다.
이를 통해 특정 각도 이상으로 회전된 이미지의 경우 감지에 실패하도록 할 수 있습니다.
maxRotation은 이 경우의 최대 허용값을 나타내며, 기본값은 15도입니다.

| Definition | Value |
| ---------- | ----- |
| BS2_MAX_ROTATION_DEFAULT | 15 |
| BS2_MAX_ROTATION_ANGLE_15 | 15 |
| BS2_MAX_ROTATION_ANGLE_30 | 30 |
| BS2_MAX_ROTATION_ANGLE_45 | 45 |
| BS2_MAX_ROTATION_ANGLE_60 | 60 |
| BS2_MAX_ROTATION_ANGLE_75 | 75 |
| BS2_MAX_ROTATION_ANGLE_90 | 90 |
| BS2_MAX_ROTATION_ANGLE_MAX | 90 |

faceWidthMin
: 사용하지 않습니다. __detectDistanceMin__ 으로 대체되었습니다.

faceWidthMax
: 사용하지 않습니다. __detectDistanceMax__ 로 대체되었습니다.

searchRangeX
: 사용하지 않습니다. __wideSearch__ 로 대체되었습니다.

searchRangeWidth
: 사용하지 않습니다. __wideSearch__ 로 대체되었습니다.

detectDistance ([detectDistanceMin](#detectDistanceMin), [detectDistanceMax](#detectDistanceMax))
: __RGB 기반 비주얼 얼굴 인증 장치__
얼굴 인식을 위한 최소 및 최대 감지 범위를 설정합니다.
복잡성으로 인해 더 이상 픽셀 단위로 얼굴 위치를 지정하는 faceWidth를 지원하지 않습니다.
대신, 대상(얼굴)의 감지 범위를 설정합니다. 단위는 cm이며, 값은 10의 배수로 입력해야 합니다.

| Type | Min limit for min detection range | Max limit for min detection range | Min detection range(Default) | Min limit for max detection range | Max limit for max detection range | Max sensing range(No limit) | Max sensing range(Default) |
| ---- | -- | --- | -- | -- | --- | --- | --- |
| FSF2 | 30 | 130 | 30 | 40 | 130 | 255 | 130 |
| BS3 | 30 | 100 | 30 | 40 | 100 | 255 | 100 |
| BEW3 | 30 | 100 | 30 | 40 | 100 | 255 | 100 |

detectDistanceMin
: 얼굴 인식을 위한 최소 감지 범위입니다.
{: #detectDistanceMin}

detectDistanceMax
: 얼굴 인식을 위한 최대 감지 범위입니다.
{: #detectDistanceMax}

wideSearch
: __FSF2를 제외한 RGB 기반 비주얼 얼굴 인증 장치__
얼굴 감지를 위한 감지 범위를 넓힐 수 있습니다.
복잡성으로 인해 더 이상 x좌표와 너비를 설정하는 searchRange를 지원하지 않습니다.
대신, 얼굴 감지 설정을 기본값(FALSE) 또는 넓은 영역(TRUE)으로 설정합니다.
넓은 영역 감지를 위한 설정 및 프로토콜의 세부 사항은 장치 내부에 설정되어 있으며, 사용자가 변경할 수 없습니다.
이 설정을 TRUE로 설정하면 카메라가 넓은 범위 내의 대상을 감지하여, 의도치 않게 여러 대상을 한 번에 감지하고 인증할 수 있습니다.
따라서 기본 설정은 FALSE입니다.

unableToSaveImageOfVisualFace
: __[+ 1.7.1]__ 비주얼 얼굴을 자격 증명으로 사용하는 장치가 얼굴 이미지를 장치에 저장할지 여부를 나타냅니다.
이 설정을 활성화하면 장치에 저장된 모든 사용자 얼굴 데이터에서 이미지 정보가 즉시 삭제되어 템플릿만 남습니다.
또한, [User.Enroll]({{'/api/user/' | relative_url}}#enroll) API를 통해 사용자 이미지가 포함된 얼굴 정보를 얻더라도 장치는 이를 무시합니다.
기본값은 false이며, 이는 얼굴 데이터와 이미지가 모두 저장됨을 의미합니다.


```protobuf
enum FaceSecurityLevel {
  BS2_FACE_SECURITY_NORMAL = 0x00;
  BS2_FACE_SECURITY_SECURE = 0x01;
  BS2_FACE_SECURITY_MORE_SECURE = 0x02;
}
```
{: #FaceSecurityLevel}

```protobuf
enum FaceLightCondition {
  BS2_FACE_LIGHT_CONDITION_INDOOR = 0x00;
  BS2_FACE_LIGHT_CONDITION_OUTDOOR = 0x01;
  BS2_FACE_LIGHT_CONDITION_AUTO = 0x02;
  BS2_FACE_LIGHT_CONDITION_DARK = 0x03;
}
```
{: #FaceLightCondition}

```protobuf
enum FaceDetectSensitivity {
  BS2_FACE_DETECT_SENSITIVITY_OFF = 0x00;
  BS2_FACE_DETECT_SENSITIVITY_LOW = 0x01;
  BS2_FACE_DETECT_SENSITIVITY_MIDDLE = 0x02;
  BS2_FACE_DETECT_SENSITIVITY_HIGH = 0x03;
}
```
{: #FaceDetectSensitivity}


### GetConfig

장치의 얼굴 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [FaceConfig](#FaceConfig) | 장치의 얼굴 설정 |

### SetConfig

장치의 얼굴 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [FaceConfig](#FaceConfig) | 장치에 기록할 얼굴 설정 |


### SetConfigMulti

여러 장치의 얼굴 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [FaceConfig](#FaceConfig) | 장치들에 기록할 얼굴 설정 |


## Auth group

얼굴 템플릿의 수가 많을수록 오수락률(False Acceptance Ratio, FAR)이 높아집니다. 이 오류를 낮추기 위해, 사용자를 여러 그룹으로 나누어 특정 그룹 내에서만 얼굴 인증을 시도할 수 있습니다. 이 기능을 사용하려면 다음을 수행해야 합니다.

* [AuthConfig.useGroupMatching]({{'/api/auth/' | relative_url}}#AuthConfig)을 활성화합니다.
* [AddAuthGroup](#addauthgroup) 또는 [AddAuthGroupMulti](#addauthgroupmulti)를 사용하여 인증 그룹을 생성합니다.
* [UserHdr.authGroupID]({{'/api/user/' | relative_url}}#UserHdr)를 설정합니다.
* [Enroll]({{'/api/user/' | relative_url}}#enroll) 또는 [EnrollMulti]({{'/api/user/' | relative_url}}#enrollmulti)를 사용하여 사용자를 등록하거나 업데이트합니다.

인증 그룹은 RGB 기반 비주얼 얼굴 인증 장치에서 지원되지 않습니다.
{: .notice--warning}

```protobuf
message AuthGroup {
  uint32 ID;
  string name; 
}
```
{: #AuthGroup}

### GetAuthGroup

장치에 저장된 인증 그룹 목록을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| authGroups | [AuthGroup[]](#AuthGroup) | 장치에 저장된 인증 그룹 |

### AddAuthGroup

장치에 인증 그룹을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| authGroups | [AuthGroup[]](#AuthGroup) | 장치에 추가할 인증 그룹 |

### AddAuthGroupMulti

여러 장치에 인증 그룹을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| authGroups | [AuthGroup[]](#AuthGroup) | 장치들에 추가할 인증 그룹 |

### DeleteAuthGroup

장치에서 인증 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| groupIDs | uint32[] | 장치에서 삭제할 그룹들의 ID |

### DeleteAuthGroupMulti

여러 장치에서 인증 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| groupIDs | uint32[] | 장치들에서 삭제할 그룹들의 ID |

### DeleteAllAuthGroup

장치에서 모든 인증 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllAuthGroupMulti

여러 장치에서 모든 인증 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
