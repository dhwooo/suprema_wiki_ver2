---
title: "UDP API"
toc_label: "UDP"
---

장치 게이트웨이 전용입니다. 마스터 게이트웨이는 [UDP Master API]({{'/api/udpMaster/' | relative_url}})를 참고하십시오.
{: .notice--info}

## Overview

UDP API는 UDP를 통해 장치와 통신하기 위한 것입니다.

## IP

[GetIPConfig](#getipconfig)/[SetIPConfig](#setipconfig)를 사용하여 서브넷 내 장치의 IP 구성을 가져오거나 설정할 수 있습니다.

### GetIPConfig

장치의 IP 구성을 가져옵니다.

```protobuf
message DeviceInfo {
  uint32 deviceID;
  string IPAddr; 
}
```
{: #DeviceInfo }

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfo | [DeviceInfo](#DeviceInfo) | 서브넷 내 장치의 정보 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [IPConfig]({{'/api/network/' | relative_url}}#IPConfig) | 장치에서 읽어온 IP 구성 |

### SetIPConfig

장치의 IP 구성을 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfo | [DeviceInfo](#DeviceInfo) | 서브넷 내 장치의 정보 |
| config | [IPConfig]({{'/api/network/' | relative_url}}#IPConfig) | 장치에 기록할 IP 구성 |
