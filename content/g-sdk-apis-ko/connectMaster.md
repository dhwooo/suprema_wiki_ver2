---
title: "Connect Master API"
toc_label: "Connect Master"  
---

마스터 게이트웨이 전용입니다. 디바이스 게이트웨이에 대해서는 [the Connect API]({{'/api/connect/' | relative_url}})를 참조하십시오.
{: .notice--info}

## Overview

마스터 게이트웨이는 하나 이상의 디바이스 게이트웨이를 통해 디바이스를 관리합니다. 따라서 일부 API를 호출할 때는 게이트웨이 ID를 지정해야 합니다. 이 차이를 제외하면, Connect Master API는 대부분의 데이터 구조를 [the Connect API]({{'/api/connect/' | relative_url}})와 공유합니다.

## Status

[the asynchronous APIs](#asynchronous-connection)와 [the device-to-server connection](#device-to-server-connection)을 사용하면, 연결은 백그라운드에서 디바이스 게이트웨이에 의해 관리됩니다. 연결의 현재 상태를 가져오려면 [GetDeviceList](#getdevicelist)나 [SubscribeStatus](#subscribestatus)를 사용할 수 있습니다.

### GetDeviceList

디바이스 게이트웨이가 관리하는 디바이스의 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfos | [DeviceInfo[]]({{'/api/connect/' | relative_url}}#DeviceInfo) | 관리되는 디바이스의 정보 |

### SubscribeStatus

상태 채널을 구독하면, 마스터 게이트웨이는 디바이스의 상태가 변경될 때마다 알려줍니다.

```protobuf
message StatusChange {
  uint32 deviceID;
  Status status;
  uint32 timestamp; 
}
```
status
: [디바이스의 새로운 상태]({{'/api/connect/' | relative_url}}#Status).

timestamp
: 변경이 발생한 시각으로, Unix 시간 형식입니다.


## Synchronous connection

### Connect

디바이스에 동기적으로 연결합니다. 성공하면 디바이스 ID가 반환됩니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스에 연결할 때 사용할 게이트웨이의 ID |
| connectInfo | [ConnectInfo]({{'/api/connect/' | relative_url}}#ConnectInfo) | 디바이스의 연결 정보 |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 연결된 디바이스의 ID |

## Asynchronous connection

동기 연결은 디바이스에 연결하는 더 쉽고 간단한 방법입니다. 그러나 수십 또는 수백 개의 디바이스가 있는 경우, 동기 연결을 관리하는 것은 번거로운 일이 될 수 있습니다. 이러한 부담을 줄이기 위해 비동기 API가 제공됩니다. 연결할 디바이스를 등록하기만 하면 됩니다. 그러면 디바이스 게이트웨이가 백그라운드에서 모든 작업을 처리합니다. 관리되는 디바이스의 연결이 끊어지면, 디바이스 게이트웨이는 자동으로 재연결을 시도합니다. 

비동기 연결을 위한 두 종류의 API가 있습니다. 첫째, 디바이스 게이트웨이가 마스터 게이트웨이에 연결될 때마다 연결 정보를 수동으로 할당할 수 있습니다. [AddAsyncConnection](#addasyncconnection)과 [DeleteAsyncConnection](#deleteasyncconnection)은 이러한 종류의 시나리오에 사용됩니다. 둘째, 연결 정보를 마스터 게이트웨이 데이터베이스에 저장할 수 있습니다. 이 경우, 디바이스 게이트웨이가 마스터 게이트웨이에 연결될 때마다 마스터 게이트웨이가 자동으로 연결 정보를 할당합니다. 이를 위해 [AddAsyncConnectionDB](#addasyncconnectiondb), [DeleteAsyncConnectionDB](#deleteasyncconnectiondb), [GetAsyncConnectionDB](#getasyncconnectiondb)가 제공됩니다.

### AddAsyncConnection

대상 디바이스를 디바이스 게이트웨이에 추가합니다. 디바이스 게이트웨이는 백그라운드에서 디바이스에 대한 연결을 관리합니다. 관리되는 디바이스의 목록을 가져오려면 [GetDeviceList](#getdevicelist)를 호출하십시오. 

서브넷 내의 디바이스를 찾으려면 [SearchDevice](#searchdevice)를 사용할 수 있습니다. 
{: .notice--info}

비동기 연결 정보는 데이터베이스에 저장되지 않습니다. 따라서 디바이스 게이트웨이가 마스터 게이트웨이에 재연결될 때 다시 할당해야 합니다. 마스터 게이트웨이가 이를 자동으로 처리하도록 하려면, 대신 [AddAsyncConnectionDB](#addasyncconnectiondb)를 사용하십시오. 
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스가 추가될 게이트웨이의 ID |
| connectInfos | [AsyncConnectInfo[]]({{'/api/connect/' | relative_url}}#AsyncConnectInfo) | 디바이스의 연결 정보 |

### DeleteAsyncConnection

지정된 디바이스를 디바이스 게이트웨이에서 삭제합니다. 이 디바이스가 연결되어 있는 경우, 먼저 연결이 끊어집니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스가 삭제될 게이트웨이의 ID |
| deviceIDs | uint32[] | 삭제할 디바이스의 ID |

### AddAsyncConnectionDB

디바이스 게이트웨이의 대상 디바이스를 데이터베이스에 추가합니다. 마스터 게이트웨이는 디바이스 게이트웨이가 재연결될 때마다 이들을 디바이스 게이트웨이에 할당합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스가 추가될 게이트웨이의 ID |
| connectInfos | [AsyncConnectInfo[]]({{'/api/connect/' | relative_url}}#AsyncConnectInfo) | 디바이스의 연결 정보 |

### DeleteAsyncConnectionDB

지정된 디바이스를 데이터베이스에서 삭제합니다. 이 디바이스가 연결되어 있는 경우, 먼저 연결이 끊어집니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스가 삭제될 게이트웨이의 ID |
| deviceIDs | uint32[] | 삭제할 디바이스의 ID |

### GetAsyncConnectionDB

디바이스 게이트웨이의 대상 디바이스를 데이터베이스에서 가져옵니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| connectInfos | [AsyncConnectInfo[]]({{'/api/connect/' | relative_url}}#AsyncConnectInfo) | 데이터베이스에 저장된 게이트웨이의 연결 정보 |


## Device-to-server connection

디바이스가 디바이스 게이트웨이에 연결되도록 하려면, 다음 작업을 수행해야 합니다.

1. [IPConfig.connectionMode]({{'/api/network/' | relative_url}}#IPConfig)를 __DEVICE_TO_SERVER__로 설정합니다.
2. 디바이스 ID를 포함하도록 [AcceptFilter]({{'/api/connect/' | relative_url}}#AcceptFilter)를 수정합니다.

### SetAcceptFilter

[AcceptFilter]({{'/api/connect/' | relative_url}}#AcceptFilter)를 사용하여 수락할 디바이스를 선택할 수 있습니다.

이 필터는 데이터베이스에 저장되지 않습니다. 따라서 디바이스 게이트웨이가 마스터 게이트웨이에 재연결될 때 다시 구성해야 합니다. 마스터 게이트웨이가 이를 자동으로 처리하도록 하려면, 대신 [SetAcceptFilterDB](#setacceptfilterdb)를 사용하십시오. 
{: .notice--warning}

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 필터가 할당될 게이트웨이의 ID |
| filter | [AcceptFilter]({{'/api/connect/' | relative_url}}#AcceptFilter) | 수락 목록을 지정하는 필터 |

### GetAcceptFilter

디바이스 게이트웨이의 수락 필터를 가져옵니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| filter | [AcceptFilter]({{'/api/connect/' | relative_url}}#AcceptFilter) | [SetAcceptFilter](#setacceptfilter)로 설정된 필터 |


### SetAcceptFilterDB

디바이스 게이트웨이의 수락 필터를 데이터베이스에 저장합니다. 마스터 게이트웨이는 디바이스 게이트웨이가 재연결될 때마다 이를 다시 구성합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 필터가 할당될 게이트웨이의 ID |
| filter | [AcceptFilter]({{'/api/connect/' | relative_url}}#AcceptFilter) | 수락 목록을 지정하는 필터 |

### GetAcceptFilterDB

디바이스 게이트웨이의 수락 필터를 데이터베이스에서 가져옵니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| filter | [AcceptFilter]({{'/api/connect/' | relative_url}}#AcceptFilter) | [SetAcceptFilterDB](#setacceptfilterdb)로 설정된 필터 |

### GetPendingList

디바이스가 디바이스 게이트웨이에 연결을 시도하지만 수락 필터에 포함되어 있지 않은 경우, 해당 디바이스는 대기 목록에 등록됩니다. 대기 목록을 검토하여 수락할 새 디바이스를 선택할 수 있습니다.

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 게이트웨이의 ID |
| deviceInfos | [PendingDeviceInfo[]]({{'/api/connect/' | relative_url}}#PendingDeviceInfo) | 수락 필터에 의해 필터링된 디바이스 |

## Disconnection

디바이스 게이트웨이와 디바이스 사이의 연결을 닫을 수 있습니다. 연결 해제 후의 동작은 연결이 어떻게 설정되었는지에 따라 달라집니다. 

[Connect](#connect)
: 디바이스가 관리 목록에서 제거됩니다. 게이트웨이는 디바이스에 재연결을 시도하지 않습니다.

[AddAsyncConnection](#addasyncconnection)
: 일정 지연 후, 게이트웨이는 디바이스에 재연결을 시도합니다. 이를 원하지 않으면, [DeleteAsyncConnection](#deleteasyncconnection)을 사용하여 관리 목록에서 디바이스를 제거하십시오.

Device-to-server
: 일정 지연 후, 디바이스는 게이트웨이에 재연결을 시도합니다. 이를 원하지 않으면, [SetAcceptFilter](#setacceptfilter)를 사용하여 수락 필터에서 디바이스를 제거하십시오.

### Disconnect

지정된 디바이스의 연결을 끊습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 연결을 끊을 디바이스의 ID |

연결된 디바이스 ID로 API를 호출할 때는 게이트웨이 ID를 지정할 필요가 없습니다. 마스터 게이트웨이가 해당 게이트웨이를 자동으로 찾습니다. 
{: .notice--info}

### DisconnectAll

디바이스 게이트웨이에 연결된 모든 디바이스의 연결을 끊습니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 연결을 끊을 게이트웨이의 ID |

## Search

[SearchDevice](#searchdevice)를 사용하여 서브넷 내의 디바이스를 검색할 수 있습니다. 

### SearchDevice


| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스를 검색할 때 사용할 게이트웨이의 ID |
| timeout | uint32 | 검색 타임아웃(밀리초 단위) |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceInfos | [SearchDeviceInfo[]]({{'/api/connect/' | relative_url}}#SearchDeviceInfo) | 서브넷에서 발견된 디바이스의 정보 |

## Connection mode

디바이스의 연결 모드를 변경할 수 있습니다. 기본값은 __SERVER_TO_DEVICE__입니다. 모드를 변경한 후, 디바이스에 재연결하려면 다음 작업을 수행해야 합니다.

___DEVICE_TO_SERVER__로 설정한 후_

1. 디바이스가 비동기적으로 연결되어 있었다면, [DeleteAsyncConnection](#deleteasyncconnection)을 사용하여 관리 목록에서 디바이스를 제거합니다.
  
2. [SetAcceptFilter](#setacceptfilter)를 사용하여 수락 필터에 디바이스 ID를 추가합니다.

___SERVER_TO_DEVICE__로 설정한 후_

1. [SetAcceptFilter](#setacceptfilter)를 사용하여 수락 필터에서 디바이스를 제거합니다.

2. [Connect](#connect)나 [AddAsyncConnection](#addasyncconnection)을 사용하여 디바이스에 연결합니다.

### SetConnectionMode

디바이스의 연결 모드를 변경합니다. 게이트웨이는 내부적으로 [Network.SetIPConfig]({{'/api/network/' | relative_url}}#setipconfig)를 호출하고 관련 파라미터를 그에 따라 변경합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| connectionMode | [ConnectionMode]({{'/api/connect/' | relative_url}}#ConnectionMode) | 설정할 연결 모드 |

### SetConnectionModeMulti

여러 디바이스의 연결 모드를 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| connectionMode | [ConnectionMode]({{'/api/connect/' | relative_url}}#ConnectionMode) | 설정할 연결 모드 |

## SSL

보다 안전한 통신을 위해, 디바이스에서 SSL을 활성화할 수 있습니다. 활성화되면, 모든 통신은 TLS 1.2 사양을 따릅니다. 

SSL/TLS를 위해서는 인증서를 적절하게 관리해야 합니다. 디바이스는 루트 인증서를 사용하여 게이트웨이의 인증서를 검증합니다. 따라서 디바이스 게이트웨이가 두 개 이상인 경우, SSL이 활성화된 디바이스에 연결하려면 루트 인증서를 공유해야 합니다. 
{: .notice--warning}

### EnableSSL

디바이스에서 SSL을 활성화합니다. 이후 [Connect](#connect)나 [AddAsyncConnection](#addasyncconnection)을 사용할 때 __useSSL__을 true로 설정해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### EnableSSLMulti

여러 디바이스에서 SSL을 활성화합니다

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |


### DisableSSL

디바이스에서 SSL을 비활성화합니다. 이후 [Connect](#connect)나 [AddAsyncConnection](#addasyncconnection)을 사용할 때 __useSSL__을 false로 설정해야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### DisableSSLMulti

여러 디바이스에서 SSL을 비활성화합니다

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |


## Slave

디바이스의 RS485 채널이나 Wiegand 입력에 슬레이브 디바이스를 추가할 수 있습니다. 슬레이브 디바이스의 검색 및 등록에 대해서는 [RS485]({{'/api/rs485/' | relative_url}}#slave-devices)와 [Wiegand]({{'/api/wiegand/' | relative_url}}#slave-devices)의 해당 섹션을 참조하십시오.

비동기 연결과 마찬가지로, 슬레이브 디바이스를 위한 두 종류의 API가 있습니다. 첫째, 디바이스 게이트웨이가 마스터 게이트웨이에 연결될 때마다 정보를 수동으로 할당할 수 있습니다. [SetSlaveDevice](#setslavedevice)는 이러한 종류의 시나리오에 사용됩니다. 둘째, 정보를 마스터 게이트웨이 데이터베이스에 저장할 수 있습니다. 이 경우, 디바이스 게이트웨이가 마스터 게이트웨이에 연결될 때마다 마스터 게이트웨이가 자동으로 슬레이브를 할당합니다. 이를 위해 [AddSlaveDeviceDB](#addslavedevicedb)와 [DeleteSlaveDeviceDB](#deleteslavedevicedb)가 제공됩니다.

### GetSlaveDevice

디바이스 게이트웨이의 슬레이브 디바이스 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| slaveDeviceInfos | [SlaveDeviceInfo[]]({{'/api/connect/' | relative_url}}#SlaveDeviceInfo) | 게이트웨이의 슬레이브 디바이스 정보 |

### SetSlaveDevice

디바이스 게이트웨이의 슬레이브 디바이스 정보를 설정합니다. 슬레이브 디바이스는 먼저 [RS485.SetDevice]({{'/api/rs485/' | relative_url}}#setdevice)나 [Wiegand.SetDevice]({{'/api/wiegand/' | relative_url}}#setdevice)를 사용하여 등록되어야 합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |
| slaveDeviceInfos | [SlaveDeviceInfo[]](#SlaveDeviceInfo) | 슬레이브 디바이스 정보 |

### AddSlaveDeviceDB

슬레이브 디바이스 정보를 마스터 게이트웨이 데이터베이스에 추가합니다. 마스터 게이트웨이는 지정된 게이트웨이가 재연결될 때마다 이들을 해당 게이트웨이에 할당합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |
| slaveDeviceInfos | [SlaveDeviceInfo[]]({{'/api/connect/' | relative_url}}#SlaveDeviceInfo) | 추가할 슬레이브 디바이스 정보 |

### DeleteSlaveDeviceDB

슬레이브 디바이스 정보를 마스터 게이트웨이 데이터베이스에서 삭제합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |
| slaveDeviceInfos | [SlaveDeviceInfo[]]({{'/api/connect/' | relative_url}}#SlaveDeviceInfo) | 삭제할 슬레이브 디바이스 정보 |


### GetSlaveDeviceDB

데이터베이스에 저장된 디바이스 게이트웨이의 슬레이브 디바이스 정보를 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| gatewayID | string | 디바이스 게이트웨이의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| slaveDeviceInfos | [SlaveDeviceInfo[]]({{'/api/connect/' | relative_url}}#SlaveDeviceInfo) | 데이터베이스에 저장된 슬레이브 디바이스 정보 |
