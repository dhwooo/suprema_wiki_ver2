---
title: "Connect API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [장치 게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리에 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 에 있습니다.
4. 필요에 따라 _example/connect/test/test.py_ 의 서버 정보를 변경합니다.
   
    ```python
    # the path of the root certificate
    GATEWAY_CA_FILE = '../../../../cert/gateway/ca.crt'

    # the address of the gateway
    GATEWAY_IP = '192.168.0.2'
    GATEWAY_PORT = 4000
    ```
5. 실행합니다.
    ```
    cd example/connect/test
    python test.py    
    ```

## 1. CLI 

명령줄 인터페이스(CLI)를 사용하면 연결 관리와 관련된 5가지 기능을 테스트할 수 있습니다.

```
===== Main Menu =====

(1) Search devices
(2) Connect to a device synchronously
(3) Manage asynchronous connections
(4) Accept devices
(5) Device menu
(q) Quit

>>>>> Select a menu:
```

### (1) 장치 검색

장치에 연결하려면 장치의 주소와 연결 모드 같은 관련 옵션을 알아야 합니다. [Connect.SearchDevice]({{'/api/connect/' | relative_url }}#searchdevice)를 사용하면 서브넷에서 이러한 정보를 얻을 수 있습니다.


```
>>>>> Select a menu: 1
Searching devices in the subnet...
***** Found devices: 9
[deviceID: 544114231
type: BIOENTRY_W2
useDHCP: true
IPAddr: "192.168.0.104"
port: 51211
, deviceID: 540092578
type: BIOSTATION_L2
useDHCP: true
IPAddr: "192.168.0.120"
port: 51211
useSSL: true
, deviceID: 846
type: BIOLITE_N2
useDHCP: true
IPAddr: "192.168.0.117"
port: 51211
```

### (2) 장치에 동기적으로 연결

장치에 연결하는 가장 간단한 방법은 [Connect.Connect]({{'/api/connect/' | relative_url }}#connect)를 사용하는 것입니다.

```
>>>>> Select a menu: 2
>> Enter the IP address of the device: 192.168.0.104
>> Enter the port of the device (default: 51211):
>> Use SSL y/n (default: n):
Connecting to 192.168.0.104:51211...
[TCP_CONNECTED] Device 544114231
Connected to 544114231
```

### (3) 비동기 연결 관리

여러 장치에 대한 영구 연결을 관리해야 할 때는 [비동기 API]({{'/api/connect/' | relative_url }}#asynchronous-connection)가 더 나은 선택입니다. 이러한 API를 사용하면 게이트웨이가 백그라운드에서 장치 연결을 처리합니다. 예를 들어 일부 장치의 연결이 끊어지면 게이트웨이가 자동으로 재연결을 시도합니다.

```
>>>>> Select a menu: 3

***** Async connections: 0
[]

===== Async Menu =====

(1) Add async connections
(2) Delete async connections
(3) Refresh the connection list
(q) Return to Main Menu

>>>>> Select a menu: 1
>> Enter the device ID (Press just ENTER if no more device): 540092578
>> Enter the IP address of the device: 192.168.0.120
>> Enter the port of the device (default: 51211):
>> Use SSL y/n (default: n): y
>> Enter the device ID (Press just ENTER if no more device): 939504224
>> Enter the IP address of the device: 192.168.0.110
>> Enter the port of the device (default: 51211):
>> Use SSL y/n (default: n):
>> Enter the device ID (Press just ENTER if no more device):

***** Async connections: 2
[deviceID: 939504224
IPAddr: "192.168.0.110"
port: 51211
autoReconnect: true
, deviceID: 540092578
IPAddr: "192.168.0.120"
port: 51211
autoReconnect: true
useSSL: true
]

[TCP_CONNECTED] Device 939504224
[TLS_CONNECTED] Device 540092578
```

### (4) 장치 수락

일부 환경에서는 게이트웨이가 장치에 연결하는 것이 아니라 장치가 게이트웨이에 연결해야 합니다. 장치가 게이트웨이에 연결하도록 하려면 다음을 수행해야 합니다.

1. [Connect.SetConnectionMode]({{'/api/connect/' | relative_url }}#setconnectionmode)를 사용하여 연결 모드를 __DEVICE_TO_SERVER__ 로 변경합니다.
2. 기본적으로 게이트웨이는 들어오는 연결을 수락하지 않습니다. [Connect.SetAcceptFilter]({{'/api/connect' | relative_url}}#setacceptfilter)를 사용하여 장치를 수락 필터에 추가해야 합니다.

```
>>>>> Select a menu: 4
***** Pending devices: 1
[deviceID: 939342898
IPAddr: "192.168.0.121"
lastTry: 1584650963
]
***** Accept filter:

===== Accept Menu =====

(1) Add devices to the filter
(2) Delete devices from the filter
(3) Allow all devices
(4) Disallow all devices
(5) Refresh the pending device list
(q) Return to Main Menu

>>>>> Select a menu: 3
***** Accept filter:  allowAll: true

[TLS_CONNECTED] Device 939342898
```

### (5) 연결 관련 옵션 구성

IP 주소 외에도 장치 연결에는 두 가지 중요한 옵션이 있습니다. [Connect.SetConnectionMode]({{'/api/connect/' | relative_url }}#setconnectionmode)를 사용하여 연결 모드를 변경하고, [SSL API]({{'/api/connect' | relative_url}}#ssl)를 사용하여 SSL을 활성화/비활성화할 수 있습니다.

```
>>>>> Select a menu: 5
***** Managed devices: 1
[deviceID: 939342898
connectionMode: DEVICE_TO_SERVER
IPAddr: "192.168.0.121"
status: TLS_CONNECTED
useSSL: true
]

===== Device Menu =====

(1) Set connection mode
(2) Enable SSL
(3) Disable SSL
(4) Disconnect
(5) Disconnect All
(6) Refresh the device list
(q) Return to Main Menu

>>>>> Select a menu: 3
Enter the device ID (Press just ENTER if no more device): 939342898
Enter the device ID (Press just ENTER if no more device):
```

이러한 옵션을 변경하려면 먼저 메뉴 (2) ~ (4)를 사용하여 장치에 연결해야 합니다.
{: .notice--warning}


## 2. 동기 연결

[동기 API]({{'/api/connect/' | relative_url }}#synchronous-connection)를 사용하면 연결을 직접 관리할 수 있습니다.

```python
class ConnectSvc:
  # ...

  def connect(self, connInfo):
    response = self.stub.Connect(connect_pb2.ConnectRequest(connectInfo=connInfo))
    return response.deviceID

  def disconnect(self, deviceIDs):
    self.stub.Disconnect(connect_pb2.DisconnectRequest(deviceIDs=deviceIDs))
```

```python
connInfo = getConnectInfo(); # getting the connection info from user

try:
  devID = connectSvc.connect(connInfo)

  # do something with the device

  deviceIDs = [devID]
  connectSvc.disconnect(deviceIDs)

except grpc.RpcError as e:
  print(f'Cannot connect to the device: {e}')
```

## 3. 비동기 연결

[비동기 API]({{'/api/connect/' | relative_url }}#asynchronous-connection)를 사용하면 장치를 등록하거나 등록 해제하기만 하면 됩니다. 게이트웨이가 모든 연결 관련 작업을 백그라운드에서 처리합니다.

```python
class ConnectSvc:
  # ...
  def addAsyncConnection(self, connInfos):
    self.stub.AddAsyncConnection(connect_pb2.AddAsyncConnectionRequest(connectInfos=connInfos))

  def deleteAsyncConnection(self, deviceIDs):
    self.stub.DeleteAsyncConnection(connect_pb2.DeleteAsyncConnectionRequest(deviceIDs=deviceIDs))
}  
```

등록된 장치의 상태를 얻으려면 [Connect.GetDeviceList]({{'/api/connect/' | relative_url }}#getdevicelist)를 사용해야 합니다.

```python
connInfos = []

try:
  devList = connectSvc.getDeviceList()

  for dev in devList:
    if dev.autoReconnect:
      connInfos.append(dev)

  print(f'\n***** Async connections: {len(connInfos)}', flush=True)

except grpc.RpcError as e:
  print(f'Cannot show the async connections: {e}')      
```

## 4. 장치 수락

```python
class ConnectSvc:
  # ...
  def getAcceptFilter(self):
    response = self.stub.GetAcceptFilter(connect_pb2.GetAcceptFilterRequest())
    return response.filter

  def setAcceptFilter(self, filter):
    self.stub.SetAcceptFilter(connect_pb2.SetAcceptFilterRequest(filter=filter))      
}
```

기본적으로 게이트웨이는 들어오는 연결을 수락하지 않습니다. [Connect.GetPendingList]({{'/api/connect/' | relative_url }}#getpendinglist)를 사용하면 게이트웨이에 연결을 시도하지만 수락 필터에 없는 장치를 얻을 수 있습니다.

```python
class ConnectSvc:
  # ...
  def getPendingList(self):
    response = self.stub.GetPendingList(connect_pb2.GetPendingListRequest())
    return response.deviceInfos
}
```

[AcceptFilter.allowAll]({{'/api/connect/' | relative_url }}#AcceptFilter)을 true로 설정하면 들어오는 모든 연결을 허용할 수 있습니다. 또는 [AcceptFilter.deviceIDs]({{'/api/connect/' | relative_url }}#AcceptFilter)에 허용할 장치를 지정할 수 있습니다.

```python
# allow all devices
filter = connect_pb2.AcceptFilter(allowAll=True)
connectSvc.setAcceptFilter(filter)

# add specific devices to the filter
deviceIDs = getDeviceIDs()

filter = connectSvc.getAcceptFilter()
filter.allowAll = False

for devID in deviceIDs:
  existing = False
  for existingDevID in filter.deviceIDs:
    if devID == existingDevID:
      existing = True
      break

  if not existing:
    filter.deviceIDs.append(devID)

connectSvc.setAcceptFilter(filter)
```


## 5. 연결 상태

[Connect.GetDeviceList]({{'/api/connect/' | relative_url }}#getdevicelist) 외에도 [Connect.SubscribeStatus]({{'/api/connect/' | relative_url }}#subscribestatus)를 사용하여 실시간 업데이트를 얻을 수 있습니다.

```python
def getDeviceStatus(statusCh):
  try:
    for status in statusCh:
      if status.status == connect_pb2.DISCONNECTED:
        print(f'[DISCONNECTED] Device {status.deviceID}', flush=True)
      elif status.status == connect_pb2.TLS_CONNECTED:
        print(f'[TLS_CONNECTED] Device {status.deviceID}', flush=True)
      elif status.status == connect_pb2.TCP_CONNECTED:
        print(f'[TCP_CONNECTED] Device {status.deviceID}', flush=True)

  except grpc.RpcError as e:
    if e.code() == grpc.StatusCode.CANCELLED:
      print('Subscription is cancelled', flush=True)    
    else:
      print(f'Cannot get the device status: {e}')   
```

```python
# start monitoring the status changes
statusCh = connectSvc.subscribe(QUEUE_SIZE)
statusThread = threading.Thread(target=getDeviceStatus, args=(statusCh,))
statusThread.start()

# stop monitoring
statusCh.cancel()
statusThread.join()
```

## 6. 연결 모드

```python
class ConnectSvc:
  # ...
  def setConnectionMode(self, deviceIDs, mode):
    self.stub.SetConnectionModeMulti(connect_pb2.SetConnectionModeMultiRequest(deviceIDs=deviceIDs, connectionMode=mode))
```

연결 모드를 설정한 후에는 그에 맞게 다른 API를 사용해야 합니다. __SERVER_TO_DEVICE__ 의 경우 장치에 연결하려면 [동기 API]({{'/api/connect/' | relative_url }}#synchronous-connection) 또는 [비동기 API]({{'/api/connect/' | relative_url }}#asynchronous-connection)를 사용해야 합니다. __DEVICE_TO_SERVER__ 의 경우 [AcceptFilter]({{'/api/connect' | relative_url}}#AcceptFilter)를 올바르게 구성해야 합니다.
{: .notice--warning}

## 7. SSL

게이트웨이와 장치 간의 보다 안전한 통신을 위해 TLS 1.2를 사용할 수 있습니다. 자세한 내용은 [Secure Communication]({{'/api/connect/' | relative_url }}#secure-communication)을 참조하세요.

```python
class ConnectSvc:
  # ...
  def enableSSL(self, deviceIDs):
    self.stub.EnableSSLMulti(connect_pb2.EnableSSLMultiRequest(deviceIDs=deviceIDs))

  def disableSSL(self, deviceIDs):
    self.stub.DisableSSLMulti(connect_pb2.DisableSSLMultiRequest(deviceIDs=deviceIDs))
```
