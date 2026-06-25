---
title: "Thermal/Mask API"
toc_label: "Thermal"  
---

[Suprema 열화상 카메라](https://www.supremainc.com/en/hardware/suprema-thermal-camera.asp)는 얼굴 인식 단말기와 함께 사용하여 피부 온도가 높은 사용자를 감지할 수 있습니다. [ThermalConfig](#ThermalConfig)를 통해 카메라 및 마스크 감지와 관련된 옵션을 지정할 수 있습니다. 또한 온도 정보가 포함된 로그 기록을 읽을 수도 있습니다. 

## Config

```protobuf
message ThermalConfig {
  CheckMode checkMode;
  CheckOrder checkOrder;
  TemperatureFormat temperatureFormat;
  uint32 temperatureThresholdHigh;

  bool auditTemperature;
  bool useRejectSound;
  bool useOverlapThermal;

  ThermalCamera camera;

  // only for RGB-based visual face authentication devices
  CheckMode maskCheckMode;
  MaskDetectionLevel maskDetectionLevel;

  bool useDynamicROI;

  uint32 temperatureThresholdLow;
}
```
{: #ThermalConfig}

[checkMode](#CheckMode)
: __HARD__이고 사용자의 온도가 __temperatureThreshold__를 초과하면, 위반 로그 기록과 함께 출입이 거부됩니다. __SOFT__인 경우, 장치는 온도 정보가 포함된 위반 로그 기록을 작성하지만 사용자의 출입은 허용합니다. 

[checkOrder](#CheckOrder)
: 온도를 언제 확인할지 지정합니다.

[temperatureFormat](#TemperatureFormat)
: 온도의 단위를 지정합니다.

temperatureThresholdHigh
: 높은 임계 온도를 0.01 섭씨 단위로 설정합니다. 예를 들어, 임계값이 37.5&deg;C라면 3750이어야 합니다.

auditTemperature
: true이면, 측정된 온도가 로그 기록에 작성됩니다. 이러한 로그는 [GetTemperatureLog](#gettemperaturelog)를 사용하여 읽을 수 있습니다.

useRejectSound
: true이면, 사용자의 출입이 거부될 때 녹음된 오류 메시지가 재생됩니다. 

useOverlapThermal
: LCD 화면에 열화상 이미지 오버레이를 표시합니다. 

[camera](#ThermalCamera)
: 카메라 자체와 관련된 옵션을 지정합니다. 

기본값은 대부분의 경우에 적합합니다. 이러한 파라미터 중 일부는 카메라 성능에 나쁜 영향을 줄 수 있으므로, 변경하기 전에 설명을 주의 깊게 읽으십시오. 
{: .notice--warning}

[maskCheckMode](#CheckMode)
: __HARD__이고 사용자가 마스크를 착용하지 않은 경우, 위반 로그 기록과 함께 출입이 거부됩니다. __SOFT__인 경우, 장치는 위반 로그 기록을 작성하지만 사용자의 출입은 허용합니다. 

별도의 __maskCheckOrder__는 없다는 점에 유의하십시오. 위의 __checkOrder__ 파라미터가 마스크 확인에도 적용됩니다. 예를 들어, __BEFORE_AUTH__인 경우 사용자가 마스크를 착용하고 있을 때만 인증합니다.
{: .notice--warning}

[maskDetectionLevel](#MaskDetectionLevel)
: 마스크 감지의 민감도입니다. __NOT_USE__인 경우, 마스크 감지가 사용되지 않습니다.

useDynamicROI
: true이면, 동적 ROI가 사용됩니다.

temperatureThresholdLow
: 낮은 임계 온도를 0.01 섭씨 단위로 설정합니다. 예를 들어, 임계값이 32.5&deg;C라면 3250이어야 합니다.


```protobuf
enum CheckMode {
  OFF = 0x00;
  HARD = 0x01;
  SOFT = 0x02;
}
```
{: #CheckMode}

OFF
: 사용자의 온도를 확인하지 않습니다. 또는 __maskCheckMode__와 함께 사용 시, 사용자가 마스크를 착용했는지 확인하지 않습니다. 

HARD
: 사용자의 온도가 __temperatureThreshold__를 초과하면, 위반 로그 기록과 함께 출입이 거부됩니다. __maskCheckMode__와 함께 사용 시, 사용자가 마스크를 착용했는지 확인합니다.

SOFT
: 사용자의 온도가 __temperatureThreshold__를 초과하더라도, 출입이 허용됩니다. 다만, 온도 정보가 포함된 위반 로그 기록이 작성됩니다. __maskCheckMode__와 함께 사용 시, 사용자가 마스크를 착용했는지 확인합니다. 

```protobuf
enum CheckOrder {
  AFTER_AUTH = 0x00;
  BEFORE_AUTH = 0x01;
  WITHOUT_AUTH = 0x02;
}
```
{: #CheckOrder}

AFTER_AUTH
: 인증에 성공한 후 온도를 측정합니다. 

BEFORE_AUTH
: 사용자의 온도가 임계값 이내일 때만 인증합니다. 이 모드에서는 사용자의 온도가 임계값을 초과하면 장치가 인증을 시도하지 않습니다. 

WITHOUT_AUTH
: 인증 없이 온도를 감지합니다. 이 모드는 정상 온도의 사용자가 신원이나 출입 권한 확인 없이 출입할 수 있도록 허용합니다. 

```protobuf
enum TemperatureFormat {
  FAHRENHEIT = 0x00;
  CELSIUS = 0x01;
}
```
{: #CheckMode}

```protobuf
message ThermalCamera {
  uint32 distance;
  uint32 emissionRate;
  ThermalCameraROI ROI;

  bool useBodyCompensation;
  int32 compensationTemperature;
}
```
{: #ThermalCamera}

distance
: 사용자와 장치 사이의 거리를 센티미터 단위로 지정합니다. 기본값은 100입니다.

emissionRate
: 열을 반사하는 대상의 방사율입니다. 사람 대상의 경우, 기본값은 98입니다.

[ROI](#ThermalCameraROI)
: 관심 영역(Region of interest)입니다. 이 네 가지 파라미터는 온도 측정 영역을 제한합니다. 좌표(x, y)와 범위(width, height)의 기본값은 백분율 단위로 각각 (47, 45)와 (15, 10)입니다.

useBodyCompensation
: true이면, 측정값에 __CompensationTemperature__를 적용합니다. 

compensationTemperature
: 보정값을 0.1 섭씨 단위로 나타냅니다. 예를 들어, 보정값이 -0.1&deg;C라면 1이어야 합니다.

```protobuf
message ThermalCameraROI {
  uint32 x;
  uint32 y;
  uint32 width;
  uint32 height;
}
```
{: #ThermalCameraROI}

```protobuf
enum MaskDetectionLevel {
  NOT_USE = 0;
  NORMAL = 1;
  HIGH = 2;
  VERY_HIGH = 3;
}
```
{: #MaskDetectionLevel}

NOT_USE
: 마스크 감지가 사용되지 않습니다.

NORMAL/HIGH/VERY_HIGH
: 마스크 감지의 민감도입니다. 

### GetConfig

장치의 열화상 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [ThermalConfig](#ThermalConfig) | 장치의 열화상 설정 |

### SetConfig

장치의 열화상 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [ThermalConfig](#ThermalConfig) | 장치에 기록할 열화상 설정 |


### SetConfigMulti

여러 장치의 열화상 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [ThermalConfig](#ThermalConfig) | 장치들에 기록할 열화상 설정 |

## Event

온도 정보가 포함된 이벤트 로그를 가져오려면, __ThermalConfig.auditTemperature__가 true여야 합니다.
{: .notice--warning}


### GetTemperatureLog

온도 정보가 포함된 이벤트 로그를 가져옵니다. 

```protobuf
message TemperatureLog {
  uint32 ID;
  uint32 timestamp;
  uint32 deviceID;
  string userID;
  uint32 eventCode;
  uint32 subCode;
  uint32 temperature;
}
```
{: #TemperatureLog}

ID
: 로그 기록의 4바이트 식별자입니다. 각 장치는 이 식별자에 대해 단조 증가하는 카운터를 관리합니다. 이 값을 사용하여 장치에서 로그를 읽을 시작 위치를 지정할 수 있습니다.

timestamp
: Unix 시간 형식입니다. 1970년 1월 1일 이후 경과한 초의 수입니다.

[eventCode]({{'/api/event/' | relative_url}}#EventCode)
: 이벤트 유형을 식별하는 16비트 코드입니다.

[subCode]({{'/api/event/' | relative_url}}#SubCode)
: 일부 이벤트 유형에는 보조 정보를 제공하는 추가 8비트 코드가 있습니다.

temperature
: 사용자의 온도를 0.01도 단위로 나타냅니다. 예를 들어, 사용자의 온도가 36.3&deg;C라면 3630이 됩니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| startEventID | uint32 | 읽을 첫 번째 이벤트 로그의 ID입니다. 0이면, 처음부터 로그를 읽습니다 |
| maxNumOfLog | uint32 | 읽을 로그의 최대 개수입니다. 0이면, 모든 이벤트 로그를 읽으려고 시도합니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| temperatureEvents | [TemperatureLog[]](#TemperatureLog) | 장치에서 읽은 온도 이벤트 로그 |
