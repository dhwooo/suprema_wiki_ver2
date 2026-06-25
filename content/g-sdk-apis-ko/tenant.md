---
title: "Tenant API"
toc_label: "Tenant"  
---

마스터 게이트웨이 전용입니다.
{: .notice--info}

마스터 게이트웨이는 멀티테넌트 시스템을 지원하도록 설계되었습니다. 각 테넌트는 자신만의 디바이스 게이트웨이를 소유하며 다른 테넌트의 게이트웨이에는 연결할 수 없습니다. 관리자만 테넌트를 추가하거나 삭제할 수 있습니다. 다시 말해, 다음 API들을 사용하려면 [LoginAdmin]({{'/api/login/' | relative_url}}#loginadmin)을 사용하여 마스터 게이트웨이에 로그인해야 합니다.

기본적으로 마스터 게이트웨이에는 'administrator'라는 하나의 테넌트가 자동으로 생성됩니다. 이 기본 테넌트는 삭제할 수 없습니다. 시스템이 멀티테넌트인 경우, Tenant API를 사용하여 다른 테넌트를 생성해야 합니다.
{: .notice--info}

## Information

```protobuf
message TenantInfo {
  string tenantID;
  repeated string gatewayIDs;
}
```
{: #TenantInfo }

tenantID
: 테넌트의 ID입니다.

gatewayIDs
: 테넌트가 소유한 게이트웨이의 ID들입니다.

### GetList

마스터 게이트웨이에 등록된 테넌트 목록을 가져옵니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantIDs | string[] | 마스터 게이트웨이에 등록된 테넌트의 ID들 |


### Get

지정한 테넌트들의 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantIDs | string[] | 테넌트의 ID들 |


| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantInfos | [TenantInfo[]](#TenantInfo) | 지정한 테넌트들의 정보 |

## Management

### Add

테넌트를 추가합니다. 이 정보는 데이터베이스에 저장되므로 한 번만 수행하면 됩니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantInfos | [TenantInfo[]](#TenantInfo) | 추가할 테넌트의 정보 |

### Delete

테넌트를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantIDs | string[] | 삭제할 테넌트의 ID들 |

### AddGateway

테넌트에 디바이스 게이트웨이를 추가합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantID | string | 게이트웨이를 추가할 테넌트의 ID |
| gatewayIDs | string[] | 추가할 게이트웨이의 ID들 |

### DeleteGateway

테넌트에서 디바이스 게이트웨이를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantID | string | 게이트웨이를 삭제할 테넌트의 ID |
| gatewayIDs | string[] | 삭제할 게이트웨이의 ID들 |


## Certificate

[Create certificates]({{'/master/install/' | relative_url}}#create-certificates)에서 설명한 대로 마스터 게이트웨이의 명령줄 옵션을 사용하여 테넌트 인증서를 생성할 수 있습니다. 
또한 다음 API들을 사용하여 인증서를 생성하고 관리할 수도 있습니다. 

경우에 따라 발급된 인증서를 비활성화해야 할 수도 있습니다. 블랙리스트에 등록된 인증서를 가진 테넌트는 마스터 게이트웨이에 연결할 수 없습니다. 

### CreateCertificate

테넌트 인증서를 생성합니다. 클라이언트 애플리케이션은 마스터 게이트웨이에 [login]({{'/api/login/' | relative_url}}#login)하기 위해 테넌트 인증서를 사용해야 합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantID | string | 테넌트의 ID |
| subject | [PKIName]({{'/api/gateway/' | relative_url}}#PKIName) | 인증서의 주체(subject) |
| expireAfterYears | int32 | 인증서는 지정한 연수 후에 만료됩니다 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantCert | string | PEM 형식의 테넌트 인증서 |
| tenantKey | string | PEM 형식의 개인 키 |

### GetIssuanceHistory

```protobuf
message CertificateInfo {
  string tenantID;
  cert.PKIName subject; 
  int64 serialNO;
  int64 issueDate;
  int64 expiryDate;
  bool blacklisted;
}
```
{: #CertificateInfo }

tenantID
: 테넌트의 ID입니다.

subject
: 인증서의 주체(subject)입니다.

serialNO
: 인증서의 고유한 64비트 식별자입니다.

issueDate
: Unix 시간 형식의 발급일입니다.

expiryDate
: Unix 시간 형식의 만료일입니다.

blacklisted
: 인증서가 블랙리스트에 등록되어 있으면 True입니다.

마스터 게이트웨이가 발급한 인증서의 이력을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantIDs | string[] | 이력을 반환할 테넌트의 ID들 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| certInfos | [CertificateInfo[]](#CertificateInfo) | 테넌트들에 대해 발급된 인증서 |


### GetCertificateBlacklist

지정한 테넌트들의 블랙리스트에 등록된 인증서를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantIDs | string[] | 블랙리스트를 반환할 테넌트의 ID들 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| certInfos | [CertificateInfo[]](#CertificateInfo) | 지정한 테넌트들의 블랙리스트에 등록된 인증서 |

### AddCertificateBlacklistRequest

테넌트의 블랙리스트에 인증서를 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantID | string | 테넌트의 ID |
| serialNOs | int64[] | 블랙리스트에 등록할 인증서의 일련번호들 |

### DeleteCertificateBlacklistRequest

테넌트의 블랙리스트에서 인증서를 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| tenantID | string | 테넌트의 ID |
| serialNOs | int64[] | 블랙리스트에서 삭제할 인증서의 일련번호들 |
