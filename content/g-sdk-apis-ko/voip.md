---
title: "Voice over IP API"
toc_label: "VoIP"  
---

BioStation A2, FaceStation 2, X-Station 2, BioStation 3, BioStation 3 Max에서는 VoIP(Voice over IP)를 사용할 수 있습니다. 자세한 내용은 [해당 문서](http://kb.supremainc.com/knowledge/doku.php?id=en:tc_appnote_setting_up_a_voip_server_for_a2&s[]=voip)를 참고하십시오. 

## Config

```protobuf
message VOIPConfig {
  string serverURL;
  uint32 serverPort;
  string userID;
  string userPW;

  bool enabled;

  uint32 exitButton;
  uint32 DTMFMode;

  uint32 registrationDuration;
  uint32 speakerVolume;
  uint32 micVolume;

  string AuthorizationCode;

  bool showExtensionNumber;
  bool useOutboundProxy;
  string proxyURL;
  uint32 proxyPort;

  repeated UserPhone phones;
}
```
{: #VOIPConfig}

serverURL
: SIP 서버의 URL입니다.

serverPort
: SIP 서버의 포트 번호입니다.

userID
: SIP 서버에 접속하기 위한 사용자 ID입니다.

userPW
: SIP 서버에 접속하기 위한 비밀번호입니다.

enabled
: VoIP의 활성화 여부를 나타냅니다.

exitButton
: 종료 버튼으로 사용할 키입니다.

  | Value | Key |  
  | ----- | --- | 
  | 0 | '*' |
  | 1 | '#' |
  | 2 ~ 11 | | '0' ~ '9' |

DTMFMode
: DTMF(Dual Tone Multi Frequency) 신호를 전달하는 방식을 지정합니다.

  | Value | Mode |  
  | ----- | --- | 
  | 0 | RFC2833 |
  | 1 | SIP-INFO |

registrationDuration
: 관련 정보를 SIP 서버에 갱신하는 주기를 지정합니다. 
초 단위로 설정하며 60에서 600 사이의 값이어야 합니다.

speakerVolume
: 인터컴의 스피커 볼륨 정보를 0에서 100 범위로 지정합니다. 기본값은 50입니다.

micVolume
: 인터컴의 마이크 볼륨 정보를 0에서 100 범위로 지정합니다. 기본값은 50입니다.

authorizationCode
: SIP 서버에 연결하기 위해 필요한 인증 코드 값을 지정합니다.

useOutboundProxy
: Outbound Proxy 서버의 구성 여부를 지정합니다.

proxyURL
: Outbound Proxy 서버의 IP 주소를 지정합니다.

proxyPort
: Outbound Proxy 서버의 포트를 지정합니다.

[phones](#UserPhone)
: 최대 32개의 내선 번호를 구성할 수 있습니다.


```protobuf
message UserPhone {
  string phoneNumber;
  string description;
}
```
{: #UserPhone}

phoneNumber
: 내선 번호입니다.

description
: 내선 번호에 대한 텍스트 설명입니다.

### GetConfig

장치의 VoIP 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [VOIPConfig](#VOIPConfig) | 장치의 VoIP 구성 |

### SetConfig

장치의 VoIP 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [VOIPConfig](#VOIPConfig) | 장치에 기록할 VoIP 구성 |


### SetConfigMulti

여러 장치의 VoIP 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [VOIPConfig](#VOIPConfig) | 장치들에 기록할 VoIP 구성 |
