---
title: "DeviceLicense API"
toc_label: "DeviceLicense"  
---

## Overview

[+ 1.9.0] Device License는 장치에서 특정 기능을 활성화하는 방법을 제공합니다.

| Device Type | Supported Version | Visual QR | Wireless lock |
| ----------- | ----------------- | :-------: | :-----------: |
| XS2 | V1.2.0 이상 | O |  |
| BS3 | V1.1.0 이상 | O |  |
| CS40 | V1.7.1 이상 |  | O |

## Config

장치의 디바이스 라이선스 관련 설정을 가져옵니다.

```protobuf
message DeviceLicenseConfig {
    uint32 version = 1;
    repeated DeviceLicenseInfo licenseInfo = 2;
}
```
{: #DeviceLicenseConfig }

version
: 디바이스 라이선스 설정 정보의 버전입니다.

[licenseInfo](#DeviceLicenseInfo)
: 디바이스 라이선스 정보입니다. 최대 16개까지 구성할 수 있습니다.

```protobuf
message DeviceLicenseInfo {
    uint32 index = 1;
    uint32 hasCapability = 2;
    bool enabled = 3;
    uint32 enableCount = 4;
    DeviceLicenseType type = 5;
    DeviceLicenseSubType subType = 6;
    uint32 enableTime = 7;
    uint32 expiredTime = 8;
    uint32 issueNumber = 9;
    string name = 10;
}
```
{: #DeviceLicenseInfo }

index
: 라이선스 인덱스입니다.

hasCapability
: 장치가 해당 라이선스를 지원하는지 여부입니다. 일반적으로 1의 값을 가집니다.

enabled
: 라이선스가 활성화되어 있는지 여부입니다.

enableCount
: 지원할 수 있는 개수입니다. 무선 잠금장치의 경우 연결할 수 있는 슬레이브의 개수를 나타냅니다.

[type](#DeviceLicenseType)
: 라이선스의 유형입니다.

[subType](#DeviceLicenseSubType)
: 라이선스 유형의 세부 형태입니다.

enableTime
: 라이선스 활성화 시작 시간으로, POSIX 시간으로 표현됩니다.

expiredTime
: 라이선스 활성화 종료 시간이며, 0은 무제한을 의미합니다.

issueNumber
: 발급 고유 번호입니다.

name
: 라이선스 이름입니다.


```protobuf
enum DeviceLicenseType {
    TYPE_NONE                = 0x0000;
    TYPE_VISUAL_QR           = 0x0001;
    TYPE_UZ_WIRELESS_LOCK    = 0x0002;
}
```
{: #DeviceLicenseType }

```protobuf
enum DeviceLicenseSubType {
    SUBTYPE_NONE                = 0;
    SUBTYPE_VISUAL_QR_CODE_CORP = 1;
}
```
{: #DeviceLicenseSubType }

### GetConfig

장치의 디스플레이 설정을 가져옵니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [DeviceLicenseConfig](#DeviceLicenseConfig) | 장치의 디바이스 라이선스 설정 |



## Enable/Disable/Query

장치에서 디바이스 라이선스를 활성화/비활성화/확인합니다.

```protobuf
message DeviceLicenseBlob {
    DeviceLicenseType type = 1;
    repeated uint32 deviceIDs = 2;
    bytes data = 3;
}
```
{: #DeviceLicenseBlob }

[type](#DeviceLicenseType)
: 라이선스의 유형입니다.

deviceIDs
: 라이선스 정보를 발급할 슬레이브 장치입니다.

data
: 라이선스 활성화 데이터 블록입니다.

```protobuf
message DeviceLicenseResult {
    uint32 deviceID = 1;
    DeviceLicenseStatus status = 2;
}
```
{: #DeviceLicenseResult }

deviceID
: 장치 식별자입니다.

[status](#DeviceLicenseStatus)
: 라이선스 상태 정보입니다.


```protobuf
enum DeviceLicenseStatus {
    NOT_SUPPORTED   = 0;
    DISABLE         = 1;
    ENABLE          = 2;
    EXPIRED         = 3;
    NOT_EXIST       = 4;
    ALREADY_ADD     = 5;
}
```
{: #DeviceLicenseStatus }

### Enable

장치에서 디바이스 라이선스를 활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| licenseBlob | [DeviceLicenseBlob](#DeviceLicenseBlob) | 활성화할 디바이스 라이선스 정보입니다. |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| results | [DeviceLicenseResult](#DeviceLicenseResult) | 활성화 결과입니다. |


### Disable

장치에서 디바이스 라이선스를 비활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| licenseBlob | [DeviceLicenseBlob](#DeviceLicenseBlob) | 비활성화할 디바이스 라이선스 정보입니다. |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| results | [DeviceLicenseResult](#DeviceLicenseResult) | 비활성화 결과입니다. |

### Query

장치에서 활성화 상태를 확인합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| type | [DeviceLicenseType](#DeviceLicenseType) | 확인할 디바이스 라이선스 유형 정보입니다. |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| results | [DeviceLicenseResult](#DeviceLicenseResult) | 장치에서의 활성화 상태입니다. |
