---
title: "MasterAdmin API"
toc_label: "MasterAdmin"  
---

## Overview

Suprema 장치는 CE RED(유럽 무선 장비 지침)를 준수하며 Master Admin을 지원합니다.
관리자를 설정하지 않고 장치를 사용하면 누구나 관리자 메뉴에 접근하여 장치 설정을 변경할 수 있습니다. Master Admin 기능은 전체 관리자의 설정을 강제함으로써 이러한 보안 취약점을 해결합니다.
이 기능을 지원하는 장치는 Master Admin을 구성하지 않으면 사용을 시작할 수 없습니다.
이는 기존의 Operator와는 다릅니다.
Master Admin이 구성되면 장치를 사용할 수 있게 됩니다.
아래는 Master Admin을 지원하는 장치 및 버전에 대한 정보입니다.

| Device Type | Supported Version |
| ----------- | ----------------- |
| BS3 | V1.4.0 이상 |
| XS2 | V1.4.0 이상 |
| BS2a | V1.2.0 이상 |
| BEW3 | 예정 |

## Get

### Get

마스터 관리자 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| masterAdmin | [UserInfo[]]({{'/api/user/' | relative_url}}#UserInfo) | 장치의 마스터 관리자 정보 |


## Set

### Set

장치에 마스터 관리자를 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| masterAdmin | [UserInfo[]]({{'/api/user/' | relative_url}}#UserInfo) | 설정할 마스터 관리자의 정보 |

### SetMulti

여러 장치에 마스터 관리자를 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| masterAdmin | [UserInfo[]]({{'/api/user/' | relative_url}}#UserInfo) | 설정할 마스터 관리자의 정보  |
