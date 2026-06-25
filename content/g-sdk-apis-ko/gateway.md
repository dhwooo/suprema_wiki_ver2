---
title: "Gateway API"
toc_label: "Gateway"  
---

마스터 게이트웨이 전용입니다.
{: .notice--info}

하나의 테넌트는 여러 개의 디바이스 게이트웨이를 가질 수 있습니다. 디바이스 게이트웨이가 마스터 게이트웨이에 연결되도록 하려면 다음 작업을 수행해야 합니다.

1. 디바이스 게이트웨이용 클라이언트 인증서를 발급하고 그에 맞게 설정합니다. 자세한 내용은 [Certificate Management]({{'/master/certificate/' | relative_url}})를 참고하십시오.
2. [Add](#add)를 사용하여 디바이스 게이트웨이를 마스터 게이트웨이에 추가합니다.

## Information

```protobuf
message GatewayInfo {
  string gatewayID;
  repeated uint32 deviceIDs;
  bool isConnected;
}
```
{: #GatewayInfo }

gatewayID
: 디바이스 게이트웨이의 ID입니다.

deviceIDs
: 디바이스 게이트웨이가 관리하는 디바이스의 ID입니다.

isConnected
: 디바이스 게이트웨이가 마스터 게이트웨이에 연결되어 있으면 True입니다.

### GetList

테넌트에 등록된 디바이스 게이트웨이 목록을 가져옵니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayIDs | string[] | 테넌트에 등록된 디바이스 게이트웨이의 ID |

### Get

지정한 디바이스 게이트웨이의 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayIDs | string[] | 게이트웨이의 ID |


| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayInfos | [GatewayInfo[]](#GatewayInfo) | 지정한 게이트웨이의 정보 |

### SubscribeStatus

상태 채널을 구독하면 디바이스 게이트웨이가 연결되거나 연결이 끊어질 때마다 알림을 받습니다.

```protobuf
enum Status {
  DISCONNECTED = 0x00;
  CONNECTED = 0x01;
}

message StatusChange {
  string gatewayID;
  Status status;
  uint32 timestamp; 
}
```
gatewayID
: 상태가 변경된 디바이스 게이트웨이의 ID입니다.

status
: 게이트웨이의 새로운 상태입니다.

timestamp
: 변경이 발생한 시각으로, Unix 시간 형식입니다.

## Management

### Add

디바이스 게이트웨이를 테넌트에 추가합니다. 이 정보는 데이터베이스에 저장되므로 한 번만 수행하면 됩니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayIDs | string[] | 추가할 게이트웨이의 ID |


### Delete

디바이스 게이트웨이를 테넌트에서 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayIDs | string[] | 삭제할 게이트웨이의 ID |


## Certificate

[Create certificates]({{'/master/install/' | relative_url}}#create-certificates)에 설명된 대로 마스터 게이트웨이의 명령줄 옵션을 사용하여 게이트웨이 인증서를 생성할 수 있습니다. 또한 다음 API를 사용하여 인증서를 생성하고 관리할 수도 있습니다.

경우에 따라 발급된 인증서를 비활성화해야 할 때가 있습니다. 블랙리스트에 등록된 인증서를 가진 디바이스 게이트웨이는 마스터 게이트웨이에 연결할 수 없습니다.

```protobuf
message PKIName {
  string country;
  string province;
  string city;
  string organization;
  string organizationUnit;
  string commonName;
}
```
{: #PKIName }

country
: [ISO 3166](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)에 정의된 2바이트 국가 코드입니다.

### CreateCertificate

디바이스 게이트웨이 인증서를 생성합니다. 인증서를 생성한 후에는 디바이스 게이트웨이의 [the configuration file]({{'/gateway/config/' | relative_url}}#configuration-file)을 그에 맞게 변경해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |
| subject | [PKIName](#PKIName) | 인증서의 주체(subject) |
| expireAfterYears | int32 | 인증서는 지정한 연수가 지나면 만료됩니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayCert | string | PEM 형식의 게이트웨이 인증서 |
| gatewayKey | string | PEM 형식의 인증서 개인 키 |

### GetIssuanceHistory

```protobuf
message CertificateInfo {
  string gatewayID;
  cert.PKIName subject; 
  int64 serialNO;
  int64 issueDate;
  int64 expiryDate;
  bool blacklisted;
}
```
{: #CertificateInfo }

gatewayID
: 게이트웨이의 ID입니다.

subject
: 인증서의 주체(subject)입니다.

serialNO
: 인증서의 고유한 64비트 식별자입니다.

issueDate
: 발급 날짜로, Unix 시간 형식입니다.

expiryDate
: 만료 날짜로, Unix 시간 형식입니다.

blacklisted
: 인증서가 블랙리스트에 등록되어 있으면 True입니다.

지정한 게이트웨이에 대한 인증서 발급 이력을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayIDs | string[] | 이력을 반환할 게이트웨이의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| certInfos | [CertificateInfo[]](#CertificateInfo) | 게이트웨이에 대해 발급된 인증서 |


### GetCertificateBlacklist

지정한 게이트웨이에 대한 블랙리스트 인증서를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayIDs | string[] | 블랙리스트를 반환할 게이트웨이의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| certInfos | [CertificateInfo[]](#CertificateInfo) | 지정한 게이트웨이에 대한 블랙리스트 인증서 |

### AddCertificateBlacklistRequest

인증서를 블랙리스트에 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| serialNOs | int64[] | 블랙리스트에 등록할 인증서의 일련번호 |

### DeleteCertificateBlacklistRequest

인증서를 블랙리스트에서 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| serialNOs | int64[] | 블랙리스트에서 삭제할 인증서의 일련번호 |