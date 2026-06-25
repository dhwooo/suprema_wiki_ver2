---
title: "Connect API"
toc_label: "Connect"  
---

디바이스 게이트웨이 전용입니다. 마스터 게이트웨이는 [Connect Master API]({{'/api/connectMaster/' | relative_url}})를 참고하십시오.
{: .notice--info}

## Overview

Connect API는 디바이스 게이트웨이와 BioStar 디바이스 간의 연결을 관리하기 위한 것입니다. 연결 방향에 따라 두 가지 모드가 있습니다. 

### Connection mode

```protobuf
enum ConnectionMode {
  SERVER_TO_DEVICE = 0;	
  DEVICE_TO_SERVER = 1;	
}
```
  SERVER_TO_DEVICE
  : 게이트웨이가 디바이스에 연결합니다.

  DEVICE_TO_SERVER
  : 디바이스가 게이트웨이에 연결합니다.

기본값인 __SERVER_TO_DEVICE__에서는 게이트웨이가 디바이스에 연결합니다. 모드를 변경하려면 [SetConnectionMode](#setconnectionmode)를 호출해야 합니다. 

### Synchronous vs. asynchronous

모드가 __SERVER_TO_DEVICE__일 때, 게이트웨이가 디바이스에 연결하는 방법은 두 가지가 있습니다. [Synchronous API](#synchronous-connection)를 사용하면 디바이스에 직접 연결할 수 있습니다. 더 간단한 방법이지만, 연결을 수동으로 관리해야 합니다. 많은 디바이스를 관리해야 하는 경우에는 대부분의 연결 작업을 게이트웨이가 자동으로 관리하므로 [Asynchronous API](#asynchronous-connection)가 더 바람직합니다. 

### Secure communication 

게이트웨이와 디바이스 간의 모든 패킷은 보안 통신을 위해 암호화됩니다. 패킷 암호화에 대해 두 가지 옵션 중 하나를 선택할 수 있습니다.

Default
: AES256을 사용하여 패킷을 암호화합니다.

SSL
: 통신에 TLS1.2를 사용합니다. 더 안전하지만, 인증서를 관리해야 합니다. 자세한 내용은 [SSL API](#ssl)를 참고하십시오.

SSL과 TLS가 정확히 동일하지는 않지만, 이 매뉴얼에서는 두 용어를 같은 의미로 사용합니다. 별도의 설명이 없는 한, SSL은 TLS v1.2 프로토콜을 의미합니다.
{: .notice--info}

## Status

[Asynchronous API](#asynchronous-connection)와 [Device-to-server 연결](#device-to-server-connection)에서는 연결이 백그라운드에서 게이트웨이에 의해 관리됩니다. 현재 연결 상태를 가져오려면 [GetDeviceList](#getdevicelist)나 [SubscribeStatus](#subscribestatus)를 사용할 수 있습니다.

```protobuf
message DeviceInfo {
  uint32 deviceID;
  device.Type type;
  ConnectionMode connectionMode;
  string IPAddr;
  int32 port;
  Status status; 
  bool autoReconnect; 
  bool useSSL;
}
```
{: #DeviceInfo }

status
: [디바이스의 현재 상태](#Status)입니다.

autoReconnect
: 디바이스가 [AddAsyncConnection](#addasyncconnection)으로 연결된 경우에만 true입니다.

| Connection type | autoReconnect |
| --------------- | ------------- |
| Asynchronous API를 사용할 때 <BR>(예: [AddAsyncConnection](#addasyncconnection)) | True |
| Synchronous API를 사용할 때 <BR>(예: [Connect](#connect)) | False |
| Device-to-server 연결을 사용할 때 <BR>(예: [SetAcceptFilter](#setacceptfilter)) | False |


```protobuf
enum Status {
  // Normal Status
  DISCONNECTED = 0x00;
  TCP_CONNECTED	= 0x01;
  TLS_CONNECTED = 0x02;
  TRY_TO_CONNECT = 0x04; // Try to connect by async mode
  
  // TCP Connection Error Status
  TCP_CANNOT_CONNECT = 0x100;
  TCP_NOT_ALLOWED = 0x101;

  // TLS Connection Error Status
  TLS_CANNOT_CONNECT = 0x200;
  TLS_NOT_ALLOWED = 0x201;
}
```
{: #Status}

### GetDeviceList

관리 중인 디바이스의 정보를 가져옵니다. 

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfos | [DeviceInfo[]](#DeviceInfo) | 관리 중인 디바이스의 정보 |

### SubscribeStatus

상태 채널을 구독하면, 디바이스의 상태가 변경될 때마다 게이트웨이가 알려줍니다.

```protobuf
message StatusChange {
  uint32 deviceID;
  Status status;
  uint32 timestamp; 
}
```
status
: [디바이스의 새로운 상태](#Status)입니다.

timestamp
: 변경이 발생한 시각으로, Unix 시간 형식입니다.

## Synchronous connection

### Connect

디바이스에 동기적으로 연결합니다. 성공하면 디바이스 ID가 반환됩니다.

```protobuf
message ConnectInfo {
  string IPAddr; 
  int32 port;
  bool useSSL;
}
```
{: #ConnectInfo }

IPAddr
: 192.168.0.2와 같은 IPv4 주소입니다.

Port
: 디바이스의 포트 번호입니다. 연결 모드가 __SERVER_TO_DEVICE__일 때만 사용됩니다. 기본값은 51211입니다.

useSSL
: 통신에 SSL을 사용할지 여부를 지정합니다. 

__ConnectInfo.useSSL__을 true로 설정하려면, 먼저 디바이스에서 [EnableSSL](#enablessl)을 호출해야 합니다. 
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| connectInfo | [ConnectInfo](#ConnectInfo) | 디바이스의 연결 정보 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 연결된 디바이스의 ID |

## Asynchronous connection

동기 연결은 디바이스에 연결하는 더 쉽고 간단한 방법입니다. 그러나 수십 또는 수백 개의 디바이스가 있는 경우, 동기 연결을 관리하는 것은 번거로운 일이 될 수 있습니다. 이러한 부담을 줄이기 위해 비동기 API가 제공됩니다. 연결할 디바이스를 등록하기만 하면 됩니다. 그러면 게이트웨이가 백그라운드에서 모든 작업을 처리합니다. 관리 중인 디바이스가 연결이 끊기면, 게이트웨이가 자동으로 재연결을 시도하기도 합니다. 

관리 중인 디바이스의 현재 상태를 가져오려면 [GetDeviceList](#getdevicelist)나 [SubscribeStatus](#subscribestatus)를 사용해야 합니다.

### AddAsyncConnection

연결할 대상 디바이스를 추가합니다. 게이트웨이가 백그라운드에서 디바이스와의 연결을 관리합니다. 관리 중인 디바이스 목록을 가져오려면 [GetDeviceList](#getdevicelist)를 호출하십시오. 

서브넷 내의 디바이스를 찾으려면 [SearchDevice](#searchdevice)를 사용할 수 있습니다. 
{: .notice--info}

```protobuf
message AsyncConnectInfo {
  uint32 deviceID; 
  string IPAddr; 
  int32 port; 
  bool useSSL; 
}
```
{: #AsyncConnectInfo }

deviceID
: 디바이스 뒷면 스티커에 있는 S/N과 동일합니다.

IPAddr
: 192.168.0.2와 같은 IPv4 주소입니다.

Port
: 디바이스의 포트 번호입니다. 연결 모드가 __SERVER_TO_DEVICE__일 때만 사용됩니다. 기본값은 51211입니다.

useSSL
: 통신에 SSL을 사용할지 여부를 지정합니다. 

__AsyncConnectInfo.useSSL__을 true로 설정하려면, 먼저 디바이스에서 [EnableSSL](#enablessl)을 호출해야 합니다. 
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| connectInfos | [AsyncConnectInfo[]](#AsyncConnectInfo) | 디바이스들의 연결 정보 |

### DeleteAsyncConnection

지정된 디바이스를 관리 목록에서 삭제합니다. 해당 디바이스가 연결되어 있는 경우, 먼저 연결이 끊깁니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 삭제할 디바이스의 ID |

## Device-to-server connection

디바이스가 게이트웨이에 연결하도록 하려면, 다음을 수행해야 합니다.

1. __IPConfig.connectionMode__를 __DEVICE_TO_SERVER__로 설정합니다.
2. 디바이스 ID를 포함하도록 [AcceptFilter](#AcceptFilter)를 수정합니다.


### SetAcceptFilter

[AcceptFilter](#AcceptFilter)를 사용하여 수락할 디바이스를 선택할 수 있습니다.

```protobuf
message AcceptFilter {
  bool allowAll;  
  repeated uint32 deviceIDs; 
  repeated string IPAddrs; // not yet supported
  repeated string subnetMasks; // not yet supported
}
```
{: #AcceptFilter }

allowAll
: 모든 수신 연결을 허용합니다. true이면 다른 파라미터를 무시합니다. 

deviceIDs
: 지정된 ID로부터의 연결을 허용합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| filter | [AcceptFilter](#AcceptFilter) | 수락 목록을 지정하는 필터 |

### GetAcceptFilter

[SetAcceptFilter](#SetAcceptFilter)로 설정한 수락 필터를 가져옵니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| filter | [AcceptFilter](#AcceptFilter) | [SetAcceptFilter](#SetAcceptFilter)로 설정한 필터 |

### GetPendingList

디바이스가 게이트웨이에 연결을 시도하지만 수락 필터에 포함되어 있지 않은 경우, 대기 목록에 등록됩니다. 대기 목록을 검토하여 수락할 새 디바이스를 선택할 수 있습니다.

```protobuf
message PendingDeviceInfo {
  uint32 deviceID;
  device.Type type;
  string IPAddr;
  uint32 lastTry; 
}
```
{: #PendingDeviceInfo }

lastTry
: 디바이스가 마지막으로 연결을 시도한 시각입니다. Unix 시간 형식입니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfos | [PendingDeviceInfo[]](#PendingDeviceInfo) | 수락 필터에 의해 필터링된 디바이스 |

## Disconnection

게이트웨이와 디바이스 간의 연결을 닫을 수 있습니다. 연결이 끊긴 후의 동작은 연결이 어떻게 설정되었는지에 따라 달라집니다. 

[Connect](#connect)
: 디바이스가 관리 목록에서 제거됩니다. 게이트웨이는 디바이스에 재연결을 시도하지 않습니다.

[AddAsyncConnection](#addasyncconnection)
: 일정 시간이 지난 후, 게이트웨이가 디바이스에 재연결을 시도합니다. 이를 원하지 않는 경우, [DeleteAsyncConnection](#deleteasyncconnection)을 사용하여 디바이스를 관리 목록에서 제거하십시오.

Device-to-server
: 일정 시간이 지난 후, 디바이스가 게이트웨이에 재연결을 시도합니다. 이를 원하지 않는 경우, [SetAcceptFilter](#setacceptfilter)를 사용하여 디바이스를 수락 필터에서 제거하십시오.

### Disconnect

지정된 디바이스의 연결을 끊습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 연결을 끊을 디바이스의 ID |

### DisconnectAll

연결된 모든 디바이스의 연결을 끊습니다.

## Search

[SearchDevice](#searchdevice)를 사용하여 서브넷 내의 디바이스를 검색할 수 있습니다. 

### SearchDevice

```protobuf
message SearchDeviceInfo  {
  uint32 deviceID;
  device.Type type;
  bool useDHCP;
  ConnectionMode connectionMode; 
  string IPAddr;
  int32 port;
  bool useSSL;
  string serverAddr;
}
```
{: #SearchDeviceInfo }

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| timeout | uint32 | 검색 타임아웃(밀리초) |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfos | [SearchDeviceInfo[]](#SearchDeviceInfo) | 서브넷에서 발견된 디바이스의 정보 |

## Connection mode

디바이스의 연결 모드를 변경할 수 있습니다. 기본값은 __SERVER_TO_DEVICE__입니다. 모드를 변경한 후, 디바이스에 재연결하려면 다음을 수행해야 합니다.

___DEVICE_TO_SERVER__로 설정한 후_

1. 디바이스가 비동기적으로 연결되어 있었다면, [DeleteAsyncConnection](#deleteasyncconnection)을 사용하여 디바이스를 관리 목록에서 제거합니다.
  
2. [SetAcceptFilter](#setacceptfilter)를 사용하여 디바이스 ID를 수락 필터에 추가합니다.

___SERVER_TO_DEVICE__로 설정한 후_

1. [SetAcceptFilter](#setacceptfilter)를 사용하여 디바이스를 수락 필터에서 제거합니다.

2. [Connect](#connect)나 [AddAsyncConnection](#addasyncconnection)을 사용하여 디바이스에 연결합니다.

### SetConnectionMode

디바이스의 연결 모드를 변경합니다. 게이트웨이는 내부적으로 [Network.SetIPConfig]({{'/api/network/' | relative_url}}#setipconfig)를 호출하여 관련 파라미터를 그에 맞게 변경합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| connectionMode | [ConnectionMode](#ConnectionMode) | 설정할 연결 모드 |

### SetConnectionModeMulti

여러 디바이스의 연결 모드를 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스들의 ID |
| connectionMode | [ConnectionMode](#ConnectionMode) | 설정할 연결 모드 |

## SSL

더 안전한 통신을 위해, 디바이스에서 SSL을 활성화할 수 있습니다. 활성화하면, 모든 통신이 TLS 1.2 사양을 준수합니다. 

SSL/TLS를 위해서는 인증서를 적절히 관리해야 합니다. 디바이스는 루트 인증서를 사용하여 게이트웨이의 인증서를 검증합니다. 따라서 둘 이상의 디바이스 게이트웨이가 있는 경우, SSL이 활성화된 디바이스에 연결하려면 루트 인증서를 공유해야 합니다. 
{: .notice--warning}

### EnableSSL

디바이스에서 SSL을 활성화합니다. 이후 [Connect](#connect)나 [AddAsyncConnection](#addasyncconnection)을 사용할 때 __useSSL__을 true로 설정해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### EnableSSLMulti

여러 디바이스에서 SSL을 활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스들의 ID |


### DisableSSL

디바이스에서 SSL을 비활성화합니다. 이후 [Connect](#connect)나 [AddAsyncConnection](#addasyncconnection)을 사용할 때 __useSSL__을 false로 설정해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### DisableSSLMulti

여러 디바이스에서 SSL을 비활성화합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스들의 ID |


## Slave

```protobuf
message SlaveDeviceInfo {
  uint32 deviceID;
  repeated uint32 rs485SlaveDeviceIDs;
  repeated uint32 wiegandSlaveDeviceIDs;
}
```
{: #SlaveDeviceInfo }

deviceID
: 슬레이브가 등록된 상위 디바이스의 ID입니다.

rs485SlaveDeviceIDs
: RS485 채널에 등록된 슬레이브 디바이스의 ID입니다.

wiegandSlaveDeviceIDs
: Wiegand 입력에 등록된 슬레이브 디바이스의 ID입니다.

디바이스의 RS485 채널이나 Wiegand 입력에 슬레이브 디바이스를 추가할 수 있습니다. 슬레이브 디바이스의 검색 및 등록에 대해서는 [RS485]({{'/api/rs485/' | relative_url}}#slave-devices)와 [Wiegand]({{'/api/wiegand/' | relative_url}}#slave-devices)의 해당 섹션을 참고하십시오.

슬레이브 정보는 데이터베이스에 저장되지 않습니다. 따라서 슬레이브 디바이스에 접근하려면, 디바이스 게이트웨이가 재연결된 후 [SetSlaveDevice](#setslavedevice)를 호출해야 합니다.

### GetSlaveDevice

슬레이브 디바이스 정보를 가져옵니다. 

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| slaveDeviceInfos | [SlaveDeviceInfo[]](#SlaveDeviceInfo) | 슬레이브 디바이스 정보 |

### SetSlaveDevice

슬레이브 디바이스 정보를 설정합니다. 슬레이브 디바이스는 먼저 [RS485.SetDevice]({{'/api/rs485/' | relative_url}}#setdevice)나 [Wiegand.SetDevice]({{'/api/wiegand/' | relative_url}}#setdevice)를 사용하여 등록해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| slaveDeviceInfos | [SlaveDeviceInfo[]](#SlaveDeviceInfo) | 슬레이브 디바이스 정보 |
