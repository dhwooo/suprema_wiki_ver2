---
title: "Operator API"
toc_label: "Operator"  
---

## Overview

모든 장치 운영자를 설정합니다.
[AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)를 사용할 경우 운영자를 최대 10명까지만 설정할 수 있다는 제약이 있습니다.
[Operator](#Operator)를 사용하면 최대 1000명의 운영자를 생성하고 관리할 수 있습니다.
BS2 1.8.0, A2 1.7.0, L2 1.5.0, N2 1.2.0, FS 1.3.0, FaceLite 1.0.1, CS40 1.3.0, P2 1.3.0, W2 1.4.0, Xpass 2 1.0.0 이상 + 2019년 3분기 이후 새로 출시된 장치에서만 사용할 수 있습니다.

Operator 기능을 올바르게 사용하려면 __장치에 최소 한 명의 관리자(_OPERATOR_LEVEL_ADMIN_)__가 구성되어 있어야 합니다.
관리자가 지정되지 않은 경우 __어떤 사용자든 제한 없이 장치 메뉴에 접근할 수 있습니다__.
{: .notice--warning}

### OperatorLevel

장치를 관리하기 위한 관리자를 지정할 수 있습니다. 각 관리자는 세 가지 운영자 레벨 중 하나를 가지며, 레벨마다 서로 다른 권한을 가집니다.

```protobuf
enum OperatorLevel {
  OPERATOR_LEVEL_NONE = 0;
  OPERATOR_LEVEL_ADMIN = 1;
  OPERATOR_LEVEL_CONFIG = 2;
  OPERATOR_LEVEL_USER = 3;
}
```
{: #OperatorLevel}


OPERATOR_LEVEL_ADMIN
: 장치에서 모든 관리 작업을 수행할 수 있습니다.

OPERATOR_LEVEL_CONFIG
: 장치의 설정을 변경할 수 있습니다.

OPERATOR_LEVEL_USER
: 장치에서 사용자를 등록/삭제할 수 있습니다.

### Operator

[AuthConfig]({{'/api/auth/' | relative_url }}#AuthConfig)를 통해 등록된 운영자는 `Operator` 관련 API를 호출하는 순간 마이그레이션되며, 그 이후로 장치는 `Operator`를 통해서만 운영자를 관리합니다.
{: .notice--warning}


```protobuf
message Operator {
  string userID;
  OperatorLevel level;
}
```
{: #Operator}

userID
: 운영자로 지정할 사용자 ID입니다.

level
: [OperatorLevel](#OperatorLevel)

## Get

### GetList

장치의 운영자를 가져옵니다

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| operators | [Operator](#Operator) | 장치의 운영자 |

## Add

### Add

장치에 장치 운영자를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| operators | [Operator](#Operator) | 장치의 운영자 |

### AddMulti

여러 장치에 장치 운영자를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| operators | [Operator](#Operator) | 장치의 운영자 |

## Delete

### Delete

장치에서 장치 운영자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| operatorIDs | string | 운영자들의 ID |

### DeleteMulti

여러 장치에서 장치 운영자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| operatorIDs | string[] | 운영자들의 ID |

## DeleteAll

### DeleteAll

장치의 모든 운영자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllMulti

여러 장치의 모든 운영자를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
