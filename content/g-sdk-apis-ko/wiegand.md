---
title: "Wiegand API"
toc_label: "Wiegand"  
---

서드파티 리더 또는 컨트롤러와 연동하려면 [WiegandConfig](#WiegandConfig)를 올바르게 구성해야 합니다. 

Wiegand 구성에 대한 일반적인 질문은 [FAQ](https://support.supremainc.com/en/support/solutions/articles/24000027804--biostar-2-wiegand-configuration-faq)를 참고하십시오. 
{: .notice--info}

## Wiegand Format

```protobuf
message WiegandFormat {
  uint32 formatID;
  uint32 length;
  repeated bytes IDFields;
  repeated ParityField parityFields;
}
```
{: #WiegandFormat}

formatID
: 포맷의 인덱스로, 애플리케이션에서 여러 포맷을 관리하는 데 사용할 수 있습니다.

length
: 포맷의 비트 길이입니다. 최대값은 256비트입니다.

IDFields
: 최대 4개의 ID 필드를 구성할 수 있습니다. 각 ID 필드에 대한 비트 마스크를 정의해야 합니다. 

parityFields
: 최대 4개의 패리티 필드를 구성할 수 있습니다.

```protobuf
message ParityField {
  uint32 parityPos;
  WiegandParity parityType;
  bytes data;
}
```
{: #ParityField}

parityPos
: 패리티의 비트 위치입니다.

[parityType](#WiegandParity)
: WIEGAND_PARITY_ODD 또는 WIEGAND_PARITY_EVEN입니다.

data
: 패리티를 계산하기 위한 비트 마스크입니다.

```protobuf
enum WiegandParity {
  WIEGAND_PARITY_NONE = 0;
  WIEGAND_PARITY_ODD = 1;
  WIEGAND_PARITY_EVEN = 2;
}
```
{: #WiegandParity}

### Example: 26 bit standard

이 예제는 [WiegandFormat](#WiegandFormat)를 사용하여 Go에서 26비트 표준 포맷을 표현하는 방법을 보여줍니다.

```go
const (
  WIEGAND_26BIT_LENGTH = 26
  WIEGAND_26BIT_NUM_OF_FIELD = 4
  WIEGAND_26BIT_EVEN_PARITY_POS = 0
  WIEGAND_26BIT_ODD_PARITY_POS = 25
)

// 26 bit standard
// FC: 01 1111 1110 0000 0000 0000 0000 : 0x01fe0000
// ID: 00 0000 0001 1111 1111 1111 1110 : 0x0001fffe
// EP: 01 1111 1111 1110 0000 0000 0000 : 0x01ffe000, Pos 0, Type: Even
// OP: 00 0000 0000 0001 1111 1111 1110 : 0x00001ffe, Pos 25, Type: Odd

var bitArray_26bit = [][]byte {
  {0, 1, /**/ 1, 1, 1, 1, 1, 1, 1, 0, /**/ 0, 0, 0, 0, 0, 0, 0, 0, /**/ 0, 0, 0, 0, 0, 0, 0, 0}, // Facility Code
  {0, 0, /**/ 0, 0, 0, 0, 0, 0, 0, 1, /**/ 1, 1, 1, 1, 1, 1, 1, 1, /**/ 1, 1, 1, 1, 1, 1, 1, 0}, // ID
  {0, 1, /**/ 1, 1, 1, 1, 1, 1, 1, 1, /**/ 1, 1, 1, 0, 0, 0, 0, 0, /**/ 0, 0, 0, 0, 0, 0, 0, 0}, // Even Parity
  {0, 0, /**/ 0, 0, 0, 0, 0, 0, 0, 0, /**/ 0, 0, 0, 1, 1, 1, 1, 1, /**/ 1, 1, 1, 1, 1, 1, 1, 0}, // Odd Parity
}

format := &wiegandSvc.WiegandFormat{
  Length: WIEGAND_26BIT_LENGTH,
  IDFields: [][]byte{
    bitArray_26bit[0],
    bitArray_26bit[1],
  },
  ParityFields: []*wiegandSvc.ParityField{
    &wiegandSvc.ParityField{
      ParityPos: WIEGAND_26BIT_EVEN_PARITY_POS,
      ParityType: wiegandSvc.WiegandParity_WIEGAND_PARITY_EVEN,
      Data: bitArray_26bit[2],
    },
    &wiegandSvc.ParityField{
      ParityPos: WIEGAND_26BIT_ODD_PARITY_POS,
      ParityType: wiegandSvc.WiegandParity_WIEGAND_PARITY_ODD,
      Data: bitArray_26bit[3],
    },
  },
}
```

## Config

장치당 최대 16개의 Wiegand 포맷을 구성할 수 있습니다. 즉, __formats__, __slaveFormats__, __CSNFormat__의 총 개수가 16개를 초과해서는 안 됩니다. 

```protobuf
message WiegandConfig {
  WiegandMode mode;
  bool useWiegandBypass;
  bool useFailCode;
  uint32 failCode; 

  uint32 outPulseWidth;
  uint32 outPulseInterval;

  repeated WiegandFormat formats;
  repeated WiegandFormat slaveFormats;
  WiegandFormat CSNFormat;

  WiegandOutType useWiegandUserID;
}
```
{: #WiegandConfig}

[mode](#WiegandMode)
: 

useWiegandBypass
: true이면 카드 정보를 인증하지 않고 그대로 우회 전달합니다. 자세한 내용은 [해당 문서](https://support.supremainc.com/en/support/solutions/articles/24000022037--biostar-2-wiegand-bypass-slave-device-wiegand-)를 참고하십시오. 

useFailCode/failCode
: __useFailCode__가 true이면 인증에 실패했을 때 __failCode__를 전송합니다. __failCode__는 1바이트여야 합니다. 

outPulseWidth
: 펄스의 너비(마이크로초 단위)입니다.

outPulseInterval
: 두 펄스 사이의 간격(마이크로초 단위)입니다. 

formats
: 장치 자체에 적용할 Wiegand 포맷입니다.

slaveFormats
: 슬레이브 장치에 적용할 Wiegand 포맷입니다.

CSNFormat
: [CARD_TYPE_CSN]({{'/api/card/' | relative_url}}#Type)에 적용할 Wiegand 포맷입니다.

[useWiegandUserID](#WiegandOutType)
: 

```protobuf
enum WiegandMode {
  WIEGAND_IN_ONLY = 0;
  WIEGAND_OUT_ONLY = 1;
  WIEGAND_IN_OUT = 2;
}
```
{: #WiegandMode}

WIEGAND_IN_ONLY
: 포트가 Wiegand 입력 수신용으로 사용됩니다. 

WIEGAND_OUT_ONLY
: 포트가 Wiegand 출력 전송용으로 사용됩니다.

WIEGAND_IN_OUT
: 포트가 Wiegand 신호의 수신과 전송 양쪽에 모두 사용됩니다. 


```protobuf
enum WiegandOutType {
  WIEGAND_OUT_UNSPECIFIED = 0;
  WIEGAND_OUT_CARD_ID = 1;
  WIEGAND_OUT_USER_ID = 2;
}
```
{: #WiegandOutType}


### GetConfig

장치의 Wiegand 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [WiegandConfig](#WiegandConfig) | 장치의 Wiegand 구성 |

### SetConfig

장치의 Wiegand 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [WiegandConfig](#WiegandConfig) | 장치에 기록할 Wiegand 구성 |

### SetConfigMulti

여러 장치의 Wiegand 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [WiegandConfig](#WiegandConfig) | 장치들에 기록할 Wiegand 구성 |

## Slave devices

Wiegand 입력에서 슬레이브 장치를 검색, 추가 또는 삭제할 수 있습니다.

```protobuf
message WiegandTamperInput {
  uint32 deviceID;
  uint32 port;
  device.SwitchType switchType;
}

message WiegandOutput {
  uint32 deviceID;
  uint32 port;
}

message WiegandDeviceInfo {
  uint32 deviceID;
  WiegandTamperInput tamperInput;
  WiegandOutput redLEDOutput;
  WiegandOutput greenLEDOutput;
  WiegandOutput buzzerOutput;
}
```
{: #WiegandDeviceInfo }

### SearchDevice

장치의 슬레이브를 검색합니다. 장치에 둘 이상의 Wiegand 입력이 있는 경우 모든 입력이 동시에 탐색됩니다. 검색된 장치에 접근하려면 [SetDevice](#setdevice)를 사용하여 등록해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 슬레이브 장치를 검색할 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| slaveInfos |[WiegandDeviceInfo[]](#WiegandDeviceInfo) | Wiegand 입력에 연결된 슬레이브 장치 |

### GetDevice

등록된 슬레이브 장치를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| slaveInfos |[WiegandDeviceInfo[]](#WiegandDeviceInfo) | 장치에 등록된 슬레이브 장치 |

### SetDevice

슬레이브 장치를 등록합니다. 

슬레이브는 한 번만 등록하면 됩니다. 다만 이 정보는 장치 게이트웨이에 저장되지 않으므로, 장치 게이트웨이가 재연결될 때 [Connect.SetSlaveDevice]({{'/api/connect/' | relative_url}}#setslavedevice) 또는 [ConnectMaster.SetSlaveDevice]({{'/api/connectMaster/' | relative_url}}#setslavedevice)를 사용해야 합니다.
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| slaveInfos |[WiegandDeviceInfo[]](#WiegandDeviceInfo) | 장치에 등록할 슬레이브 장치 |
