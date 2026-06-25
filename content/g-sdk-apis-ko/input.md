---
title: "Input API"
toc_label: "Input"  
---

__InputConfig__ 를 사용하여 장치의 Supervised 입력, Aux 입력 등을 설정할 수 있습니다.

## Config

Supervised 입력과 aux 입력을 설정합니다.

```protobuf
message SupervisedInputRange {
  uint32 MinValue;
  uint32 MaxValue;
}
```
{: #SupervisedInputRange }

MinValue
: 0 ~ 3300(3.3v) 범위를 갖는 최소 전압입니다.

MaxValue
: 0 ~ 3300(3.3v) 범위를 갖는 최대 전압입니다.

```protobuf
message SupervisedInputConfig {
  SupervisedInputRange short;
  SupervisedInputRange open;
  SupervisedInputRange on;
  SupervisedInputRange off;
}
```
{: #SupervisedInputConfig }

short
: short 입력으로 구분될 전압의 범위입니다.

open
: open 입력으로 구분될 전압의 범위입니다.

on
: on 입력으로 구분될 전압의 범위입니다.

off
: off 입력으로 구분될 전압의 범위입니다.

```protobuf
enum SupervisedResistanceValue {
  SUPERVISED_REG_1K = 0;
  SUPERVISED_REG_2_2K = 1;
  SUPERVISED_REG_4_7K = 2;
  SUPERVISED_REG_10K = 3;

  SUPERVISED_REG_UNUSED = 254;
  SUPERVISED_REG_CUSTOM = 255;
}
```
{: #SupervisedResistanceValue }

SUPERVISED_REG_1K
: 1k 저항

SUPERVISED_REG_2_2K
: 2.2k 저항

SUPERVISED_REG_4_7K
: 4.7k 저항

SUPERVISED_REG_10K
:	10k 저항

SUPERVISED_REG_UNUSED
: Unsupervised

SUPERVISED_REG_CUSTOM
: Custom

```protobuf
message SupervisedInput {
  uint32 portIndex;
  device.SwitchType type;
  uint32 duration;
  SupervisedResistanceValue resistance;
  SupervisedInputConfig config;
}
```
{: #SupervisedInput }

portIndex
: 입력 포트 번호입니다.

[type]({{'/api/device/' | relative_url}}#SwitchType)
: 입력 신호 유형입니다.

duration
: 입력 신호 지속 시간이며, 측정 단위는 밀리초(ms)입니다.

[resistance](#SupervisedResistanceValue)
: Supervised 입력의 저항 값 유형을 설정하거나 unsupervised 로 설정할 수 있습니다.

[config](#SupervisedInputConfig)
: Supervised 입력 신호 유형을 구분하는 설정입니다. 이 설정은 supervised 입력의 __resistance__ 가 __SUPERVISED_REG_CUSTOM__ 으로 설정된 경우에만 유효합니다.


```protobuf
enum AuxInputPort {
  AUX_INPUT_PORT_NORMAL = 0;
  AUX_INPUT_PORT_0 = 1;
  AUX_INPUT_PORT_1 = 2;
  AUX_INPUT_PORT_2 = 3;
}
```
{: #AuxInputPort }

AUX_INPUT_PORT_NORMAL
: aux 입력을 비활성화합니다. (일반 입력으로 사용)

AUX_INPUT_PORT_0
: Aux 입력 포트 0

AUX_INPUT_PORT_1
: Aux 입력 포트 1

AUX_INPUT_PORT_2
: Aux 입력 포트 2

```protobuf
message AuxInput {
  AuxInputPort acFail;
  device.SwitchType typeAux0;
  AuxInputPort tamper;
  device.SwitchType typeAux1;
  AuxInputPort fire;
  device.SwitchType typeAux2;
}
```
{: #AuxInput }

[acFail](#AuxInputPort)
: 사전 정의된 aux 입력 포트이며, __AC Fail__ 을 의미합니다. _AUX_INPUT_PORT_NORMAL_ 로 설정하면 일반 포트로 사용할 수 있습니다.

[typeAux0]({{'/api/device/' | relative_url}}#SwitchType)
: acFail 로 사전 정의된 aux 입력 포트 0 의 스위치 유형을 지정합니다.

[tamper](#AuxInputPort)
: 사전 설정된 aux 입력 포트이며, __Tamper__ 를 의미합니다. _AUX_INPUT_PORT_NORMAL_ 로 설정하면 일반 포트로 사용할 수 있습니다.

[typeAux1]({{'/api/device/' | relative_url}}#SwitchType)
: tamper 로 사전 정의된 aux 입력 포트 0 의 스위치 유형을 지정합니다.

[fire](#AuxInputPort)
: 사전 설정된 aux 입력 포트이며, __Fire Alarm__ 을 의미합니다. _AUX_INPUT_PORT_NORMAL_ 로 설정하면 일반 포트로 사용할 수 있습니다.

[typeAux2]({{'/api/device/' | relative_url}}#SwitchType)
: fire 로 사전 정의된 aux 입력 포트 0 의 스위치 유형을 지정합니다.

```protobuf
message InputConfig {
  uint32 numOfInput;
  uint32 numOfSupervisedInput;
  AuxInput auxInput;
  repeated SupervisedInput supervisedInputs;
}
```
{: #InputConfig }

numOfInput
: 입력 포트의 개수입니다.

numOfSupervisedInput
: Supervised 입력 포트의 개수입니다.

[auxInput](#AuxInput)
: __Aux 입력__ 의 동작을 설정합니다.

[supervisedInputs](#SupervisedInput)
: __Supervised 입력__ 의 동작을 설정합니다.


### GetConfig

장치의 입력 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [InputConfig](#InputConfig) | 장치의 입력 설정 |

### SetConfig

장치의 입력 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [InputConfig](#InputConfig) | 장치에 기록할 입력 설정 |

### SetConfigMulti

여러 장치의 입력 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [InputConfig](#InputConfig) | 장치들에 기록할 입력 설정 |
