---
title: "UDP Master API"
toc_label: "UDP Master"
---

마스터 게이트웨이 전용입니다. 디바이스 게이트웨이에 대해서는 [the UDP API]({{'/api/udp/' | relative_url}})를 참고하십시오.
{: .notice--info}

## Overview

마스터 게이트웨이는 하나 이상의 디바이스 게이트웨이를 통해 디바이스를 관리합니다. 따라서 일부 API를 호출할 때는 게이트웨이 ID를 지정해야 합니다. 이 차이점을 제외하면, UDP Master API는 대부분의 데이터 구조를 [the UDP API]({{'/api/udp/' | relative_url}})와 공유합니다.

## IP

[GetIPConfig](#getipconfig)/[SetIPConfig](#setipconfig)를 사용하여 서브넷 내 디바이스의 IP 설정을 가져오거나 설정할 수 있습니다.

### GetIPConfig

디바이스의 IP 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| deviceInfo | [DeviceInfo]({{'/api/udp/' | relative_url}}#DeviceInfo) | 서브넷 내 디바이스의 정보 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [IPConfig]({{'/api/network/' | relative_url}}#IPConfig) | 디바이스에서 읽어온 IP 설정 |

### SetIPConfig

디바이스의 IP 설정을 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| deviceInfo | [DeviceInfo]({{'/api/udp/' | relative_url}}#DeviceInfo) | 서브넷 내 디바이스의 정보 |
| config | [IPConfig]({{'/api/network/' | relative_url}}#IPConfig) | 디바이스에 기록할 IP 설정 |
