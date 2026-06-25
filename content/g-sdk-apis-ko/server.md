---
title: "Server API"
toc_label: "Server"  
---

__Server API__를 사용하여 서버 매칭 기능을 구현할 수 있습니다. 서버 매칭이 활성화되면 장치는 인증 처리를 디바이스 게이트웨이에 위임합니다. 사용자가 카드나 지문을 장치에 인식시킬 때마다 장치는 게이트웨이로 요청을 전송합니다. 그러면 이러한 요청을 API 중 하나를 사용하여 처리해야 합니다.

서버 매칭을 구현하려면 다음 단계를 수행해야 합니다.

1. 관련 옵션을 활성화합니다.
   
    | Function | Option | Handler |
    | -------- | ------ | ------- |
    | Verify | [AuthConfig.useServerMatching]({{'/api/auth/' | relative_url}}#AuthConfig) | [HandleVerify](#handleverify) |
    | Identify | [AuthConfig.useServerMatching]({{'/api/auth/' | relative_url}}#AuthConfig) | [HandleIdentify](#handleidentify) |
    | Global APB | [AuthConfig.useGlobalAPB]({{'/api/auth/' | relative_url}}#AuthConfig) | [HandleGlobalAPB](#handleglobalapb) |
    | User Phrase | [DisplayConfig.useUserPhrase/queryUserPhrase]({{'/api/display/' | relative_url}}#DisplayConfig) | [HandleUserPhrase](#handleuserphrase) |  
    {: #RelatedOptions }

2. [Subscribe](#subscribe)를 사용하여 요청 채널을 구독합니다.
3. 해당 핸들러를 사용하여 자체 로직을 구현합니다.
4. [Unsubscribe](#unsubscribe)를 사용하여 채널 구독을 해제합니다.

Server API는 마스터 게이트웨이에서 지원되지 않습니다.
{: .notice--warning}

## Subscribe

구독에 성공하면 장치는 디바이스 게이트웨이로 다음과 같은 요청을 전송합니다.

```protobuf
message ServerRequest {
  RequestType reqType;
  uint32 deviceID;
  uint32 seqNO;
  VerifyRequest verifyReq; 
  IdentifyRequest identifyReq;
  GlobalAPBRequest globalAPBReq;
  UserPhraseRequest userPhraseReq;
}
```
{: #ServerRequest }

[reqType](#RequestType)
: 요청의 유형입니다.

deviceID
: 요청을 전송한 장치의 ID입니다.

seqNO
: 요청의 시퀀스 번호입니다. 장치에 응답을 반환할 때 이 번호를 사용해야 합니다.

[verifyReq](#VerifyRequest)
: __reqType__이 VERIFY_REQUEST인 경우에만 유효합니다.

[identifyReq](#IdentifyRequest)
: __reqType__이 IDENTIFY_REQUEST인 경우에만 유효합니다.

[globalAPBReq](#GlobalAPBRequest)
: __reqType__이 GLOBAL_APB_REQUEST인 경우에만 유효합니다.

[userPhraseRequest](#UserPhraseRequest)
: __reqType__이 USER_PHRASE_REQUEST인 경우에만 유효합니다.

```protobuf
enum RequestType {
  NO_REQUEST = 0x00;
  VERIFY_REQUEST = 0x01;
  IDENTIFY_REQUEST = 0x02;
  GLOBAL_APB_REQUEST = 0x03;
  USER_PHRASE_REQUEST = 0x04;
}
```
{: #RequestType }

```protobuf
message VerifyRequest {
  bool isCard;
  card.Type cardType;
  bytes cardData;
  string userID;
}
```
{: #VerifyRequest }

isCard
: true이면 검증을 위해 __cardType__과 __cardData__를 조회해야 합니다. false이면 __userID__를 조회해야 합니다.

```protobuf
message IdentifyRequest {
  finger.TemplateFormat templateFormat;
  bytes templateData;
}
```
{: #IdentifyRequest }

```protobuf
message GlobalAPBRequest {
  repeated string userIDs;
}
```
{: #GlobalAPBRequest }

```protobuf
message UserPhraseRequest {
  string userID;
}
```
{: #UserPhraseRequest }


요청 처리는 프로그래밍 언어에 따라 다릅니다. 사용하는 클라이언트 SDK의 서버 API 예제를 참고하십시오.
{: .notice--info}

### Subscribe

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| queueSize | int32 | 큐가 가득 차면 게이트웨이는 요청을 폐기합니다. 동시 요청을 처리할 수 있을 만큼 충분히 커야 합니다 |

### Unsubscribe

채널은 하나만 존재할 수 있습니다. 따라서 채널을 재사용하려면 먼저 구독을 해제해야 합니다.

## Matching

### HandleVerify

[AuthConfig.useServerMatching]({{'/api/auth/' | relative_url}}#AuthConfig)가 true이면, 장치는 카드를 읽을 때 게이트웨이로 [VerifyRequest](#VerifyRequest)를 전송합니다. 이 API를 사용하여 장치에 응답을 전송해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID입니다. 요청의 __deviceID__와 동일해야 합니다. |
| seqNO | uint32 | 응답의 시퀀스 번호입니다. 해당 요청의 __seqNO__와 동일해야 합니다. |
| errCode | [ServerErrorCode](#ServerErrorCode) | 검증 결과입니다. SUCCESS이면 검증된 사용자 정보를 __user__ 필드에 채워야 합니다. |
| user | [user.UserInfo]({{'/api/user/' | relative_url}}#UserInfo) | 검증된 사용자의 정보입니다. |

```protobuf
enum ServerErrorCode {
  SUCCESS = 0;

  VERIFY_FAIL = -301;
  IDENTIFY_FAIL = -302;

  HARD_APB_VIOLATION = -1202;
  SOFT_APB_VIOLATION = -1203;

  CANNOT_FIND_USER =  -714;
}
```
{: #ServerErrorCode }

### HandleIdentify

[AuthConfig.useServerMatching]({{'/api/auth/' | relative_url}}#AuthConfig)가 true이면, 장치는 지문을 읽을 때 게이트웨이로 [IdentifyRequest](#IdentifyRequest)를 전송합니다. 이 API를 사용하여 장치에 응답을 전송해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID입니다. 요청의 __deviceID__와 동일해야 합니다. |
| seqNO | uint32 | 응답의 시퀀스 번호입니다. 해당 요청의 __seqNO__와 동일해야 합니다.  |
| errCode | [ServerErrorCode](#ServerErrorCode) | 식별 결과입니다. SUCCESS이면 식별된 사용자 정보를 __user__ 필드에 채워야 합니다. |
| user | [user.UserInfo]({{'/api/user/' | relative_url}}#UserInfo) | 식별된 사용자의 정보입니다. |

### HandleGlobalAPB

[AuthConfig.useGlobalAPB]({{'/api/auth/' | relative_url}}#AuthConfig)가 true이면, 장치는 인증 성공 후 게이트웨이로 [GlobalAPBRequest](#GlobalAPBRequest)를 전송합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID입니다. 요청의 __deviceID__와 동일해야 합니다. |
| seqNO | uint32 | 응답의 시퀀스 번호입니다. 해당 요청의 __seqNO__와 동일해야 합니다.  |
| errCode | [ServerErrorCode](#ServerErrorCode) | 안티 패스백 위반 결과입니다. 위반된 경우 결과는 존의 유형에 따라 HARD_APB_VIOLATION 또는 SOFT_APB_VIOLATION 중 하나가 됩니다. |
| zoneID | uint32 | 안티 패스백 존의 ID입니다. |

## User interface

서버 매칭과는 별개로, 인증 후 사용자별 메시지를 표시할 수도 있습니다.

### HandleUserPhrase

[DisplayConfig.useUserPhrase/queryUserPhrase]({{'/api/display/' | relative_url}}#DisplayConfig)가 true이면, 장치는 인증 성공 후 [UserPhraseRequest](#UserPhraseRequest)를 전송합니다. 이 API를 사용하여 장치에 응답을 전송해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID입니다. 요청의 __deviceID__와 동일해야 합니다. |
| seqNO | uint32 | 응답의 시퀀스 번호입니다. 해당 요청의 __seqNO__와 동일해야 합니다.  |
| errCode | [ServerErrorCode](#ServerErrorCode) | SUCCESS이면 __userPhrase__ 필드에 사용자 문구를 전송해야 합니다. |
| userPhrase | string |  장치의 UI에 표시될 메시지입니다. |