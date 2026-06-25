---
title: "Network API"
toc_label: "Network"  
---

Network는 게이트웨이가 디바이스와 통신하기 위한 가장 기본적인 설정입니다. 

게이트웨이 V1.1 기준으로 IPv4 설정만 지원됩니다. IPv6는 향후 버전에서 지원될 예정입니다.
{: .notice--info}

## IP

```protobuf
message IPConfig {
  bool useDHCP; 
  string IPAddr;
  string gateway;
  string subnetMask;
  int32 port; 

  connect.ConnectionMode connectionMode;

  string serverAddr; 
  int32 serverPort;
  int32 SSLServerPort;

  bool useDNS;
  string DNSServer;
  string serverURL;

  int32 MTUSize;
  EthernetBaseband baseband;
}
```
{: #IPConfig }

useDHCP
: true이면 DHCP 서버로부터 IP 주소를 획득하려고 시도합니다. true인 경우 __IPAddr__, __gateway__, __subnetMask__ 파라미터는 DHCP에 의해 자동으로 설정됩니다.

port
: __connectionMode__가 __SERVER_TO_DEVICE__일 때만 사용됩니다. 기본값은 51211입니다.

connectionMode
: __SERVER_TO_DEVICE__(기본값) 또는 __DEVICE_TO_SERVER__입니다. __serverAddr__, __serverPort__, __SSLServerPort__, __useDNS__, __DNSServer__, __serverURL__은 __connectionMode__가 __DEVICE_TO_SERVER__인 경우에만 사용됩니다.

serverAddr
: 디바이스 게이트웨이의 IP 주소입니다. [게이트웨이 설정]({{'/gateway/config/' | relative_url}}#device-server)을 참고하십시오.

serverPort
: 디바이스 게이트웨이의 포트입니다. 기본값은 51212입니다.

SSLServerPort
: 디바이스 게이트웨이의 SSL 포트입니다. 기본값은 51213입니다.

useDNS
: true이면 디바이스가 DNS 서버로부터 게이트웨이의 IP 주소를 획득하려고 시도합니다. 디바이스가 DNS를 지원하는지 [CapabilityInfo.DNSSupported]({{'/api/device/' | relative_url}}#CapabilityInfo)로 확인하십시오.

DNSServer
: DNS 서버의 IP 주소입니다.

serverURL
: 디바이스 게이트웨이의 URL입니다. serverUrl은 유효한 URL 문자열이어야 합니다(예: https://example.com). 유효하지 않거나 URL이 아닌 값은 예기치 않은 동작을 일으킬 수 있습니다.

```protobuf
enum EthernetBaseband {
  BASEBAND_10BASE_T = 0;
  BASEBAND_100BASE_T = 1;
}
```


### GetIPConfig

디바이스의 IP 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [IPConfig](#IPConfig) | 디바이스에서 읽어온 IP 설정 |


### SetIPConfig

디바이스의 IP 설정을 지정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| config | [IPConfig](#IPConfig) | 디바이스에 기록할 IP 설정 |

### SetIPConfigMulti

여러 디바이스의 IP 설정을 지정합니다. 

이 함수는 모든 디바이스에서 __IPConfig.useDHCP__가 true인 경우에만 사용해야 합니다. 그렇지 않으면 디바이스별로 [SetIPConfig](#setipconfig)를 사용해야 합니다.
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스들의 ID |
| config | [IPConfig](#IPConfig) | 디바이스들에 기록할 IP 설정 |

## WLAN

이 API를 사용하기 전에 __Capability.WLANSupported__를 확인하십시오.

```protobuf
message WLANConfig {
  bool enabled;
  WLANOperationMode opMode;
  WLANAuthType authType;
  WLANEncryptionType encType;

  string ESSID;
  string authKey;
}
```
{: #WLANConfig }

```protobuf
enum WLANOperationMode {
  WLAN_OPMODE_MANAGED = 0;
  WLAN_OPMODE_ADHOC = 1;
}

enum WLANAuthType {
  WLAN_AUTH_OPEN = 0;
  WLAN_AUTH_SHARED = 1;
  WLAN_AUTH_WPA_PSK = 2;
  WLAN_AUTH_WPA2_PSK = 3;
}

enum WLANEncryptionType {
  WLAN_ENC_NONE = 0;
  BS2_WLAN_ENC_WEP = 1;
  BS2_WLAN_ENC_TKIP_AES = 2;
  BS2_WLAN_ENC_AES = 3;
  BS2_WLAN_ENC_TKIP = 4;
}
```

### GetWLANConfig

디바이스의 WLAN 설정을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [WLANConfig](#WLANConfig) | 디바이스에서 읽어온 WLAN 설정 |

### SetWLANConfig

디바이스의 WLAN 설정을 지정합니다.

펌웨어 이슈로 인해 __WLANConfig.enabled__만 기록됩니다. 다른 파라미터를 변경하려면 디바이스 UI를 직접 사용해야 합니다.
{: .notice--danger}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| config | [WLANConfig](#WLANConfig) | 디바이스에 기록할 WLAN 설정 |


### SetWLANConfigMulti

여러 디바이스의 WLAN 설정을 지정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스들의 ID |
| config | [WLANConfig](#WLANConfig) | 디바이스들에 기록할 WLAN 설정 |
