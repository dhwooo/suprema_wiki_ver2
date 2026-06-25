---
title: "User Synchronization"
toc: true
toc_label: "Table of Contents"
---

이 예제는 장치 간에 사용자 정보를 동기화하는 방법을 보여줍니다. 등록 장치 하나와 하나 이상의 다른 장치가 필요합니다. 이 예제는 등록 장치의 실시간 이벤트를 모니터링하고, 변경이 발생할 때마다 사용자 정보를 다른 장치들로 전파합니다.

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/sync/test.py_ 에서 게이트웨이 정보를 변경합니다.

    ```python
    GATEWAY_CA_FILE = '../../../cert/gateway/ca.crt'
    GATEWAY_IP = '192.168.0.2'
    GATEWAY_PORT = 4000
    ```
5. 필요에 따라 _sync_config.json_ 에서 장치 설정을 변경합니다.

    ```json
    {
      "enroll_device": {
        "device_id": 939504224,
        "ip_addr": "192.168.0.110",
        "port": 51211,
        "use_ssl": false,
        "last_event_id": 34667
      },
      "devices": [
        {
          "device_id": 543664528,
          "ip_addr": "192.168.0.135",
          "port": 51211,
          "use_ssl": false,
          "last_event_id": 5984
        },
        {
          "device_id": 547634389,
          "ip_addr": "192.168.0.100",
          "port": 51211,
          "use_ssl": true,
          "last_event_id": 295005
        }
      ]
    }
    ```
   
6. 실행합니다.

    ```
    cd example/sync
    python test.py
    ```

## 1. CLI

명령줄 인터페이스(CLI)를 사용하면 6개의 메뉴 중 하나를 선택할 수 있습니다.

```
$ python test.py
Trying to connect to the devices...

===== Test Menu =====

(1) Show test devices
(2) Show new events
(3) Show new users
(4) Enroll a user
(5) Delete a user
(q) Quit

>>>>> Select a menu:
```

### (1) 테스트 설정 표시

테스트 설정과 연결된 장치들을 표시합니다. 연결은 [비동기 API]({{'/api/connect/' | relative_url}}#asynchronous-connection)를 사용하여 백그라운드에서 수행됩니다. 관련 코드는 [DeviceMgr](#2-device-manager)를 참고하십시오.

```
>>>>> Select a menu: 1
***** Test Configuration:
{
  "enroll_device": {
    "device_id": 939504224,
    "ip_addr": "192.168.0.110",
    "port": 51211,
    "use_ssl": false,
    "last_event_id": 35130
  },
  "devices": [
    {
      "device_id": 543664528,
      "ip_addr": "192.168.0.135",
      "port": 51211,
      "use_ssl": false,
      "last_event_id": 6367
    },
    {
      "device_id": 547634389,
      "ip_addr": "192.168.0.100",
      "port": 51211,
      "use_ssl": true,
      "last_event_id": 295389
    }
  ]
}
***** Connected Devices: [939504224, 543664528, 547634389]
```

### (2) 사용자 등록

등록 장치에서 카드로 사용자를 등록합니다. 새 사용자는 [User.EnrollMulti]({{'/api/user/' | relative_url}}#enrollmulti)를 사용하여 다른 장치들에 등록됩니다.

```
>>>>> Select a menu: 4
>> Enter the user ID: 1000
>>> Place a unregistered CSN card on the device 939504224...

2021-06-21 01:16:21: Device 939504224, User 1000, User enrollment success
Trying to synchronize the enrolled user 1000...
2021-06-21 01:16:18: Device 543664528, User 1000, User enrollment success
2021-06-21 01:16:21: Device 547634389, User 1000, User enrollment success
```

### (3) 새 사용자 표시

사용자가 모든 장치에 등록되었는지 확인합니다.

```
>>>>> Select a menu: 3
Read new users from device 939504224...
New users: [hdr {
  ID: "1000"
  numOfCard: 1
}
setting {
  biometricAuthMode: 255
  cardAuthMode: 255
  IDAuthMode: 255
  securityLevel: 2
  faceAuthExtMode: 255
  fingerAuthExtMode: 255
  cardAuthExtMode: 255
  IDAuthExtMode: 255
}
cards {
  type: CARD_TYPE_CSN
  size: 32
  data: "\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\004\035\030\352\323S\200"
}
]
Read new users from device 543664528...
New users: [hdr {
  ID: "1000"
  numOfCard: 1
}
setting {
  biometricAuthMode: 255
  cardAuthMode: 255
  IDAuthMode: 255
  securityLevel: 2
  faceAuthExtMode: 255
  fingerAuthExtMode: 255
  cardAuthExtMode: 255
  IDAuthExtMode: 255
}
cards {
  type: CARD_TYPE_CSN
  size: 32
  data: "\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\000\004\035\030\352\323S\200"
}
```

### (4) 새 사용자 삭제

등록 장치에서 새 사용자를 삭제합니다. 새 사용자는 [User.DeleteMulti]({{'/api/user/' | relative_url}}#deletemulti)를 사용하여 다른 장치들에서도 삭제됩니다.

```
>>>>> Select a menu: 5
>> Enter the user ID: 1000
2021-06-21 01:17:22: Device 939504224, User 1000, User delete success

Trying to synchronize the deleted user 1000...
2021-06-21 01:17:19: Device 543664528, User 1000, User delete success
2021-06-21 01:17:21: Device 547634389, User 1000, User delete success
```

### (5) 새 이벤트 표시

테스트 중에 생성된 이벤트 로그를 표시합니다.

```
>>>>> Select a menu: 2
Read new event logs from device 939504224...
Read 2 event logs
Show the last 2 events...
2021-06-21 01:17:22: Device 939504224, User 1000, User delete success
2021-06-21 01:16:21: Device 939504224, User 1000, User enrollment success
Read new event logs from device 543664528...
Read 2 event logs
Show the last 2 events...
2021-06-21 01:17:19: Device 543664528, User 1000, User delete success
2021-06-21 01:16:18: Device 543664528, User 1000, User enrollment success
Read new event logs from device 547634389...
Read 2 event logs
Show the last 2 events...
2021-06-21 01:17:21: Device 547634389, User 1000, User delete success
2021-06-21 01:16:21: Device 547634389, User 1000, User enrollment success
```

## 2. Device Manager

DeviceMgr는 [비동기 API]({{'/api/connect/' | relative_url}}#asynchronous-connection)를 사용하여 장치들에 연결합니다.

```python
def connectToDevices(self):
  connInfos = self.testConfig.getAsyncConnectInfo()
  try:
    self.connectSvc.addAsyncConnection(connInfos)
```

그리고 [Connect.SubscribeStatus]({{'/api/connect/' | relative_url}}#subscribestatus)를 사용하여 장치들의 연결 이벤트를 모니터링합니다. 새 연결이 감지되면 콜백 함수 __EventMgr.handleConnection__ 을 호출합니다.

```python
deviceMgr.handleConnection(eventMgr.handleConnection)

def handleConnection(self, callback):
  try:
    self.statusCh = self.connectSvc.subscribe(QUEUE_SIZE)
    statusThread = threading.Thread(target=self.receiveStatus, args=(callback,))
    statusThread.start()

def receiveStatus(self, callback):
  try:
    for status in self.statusCh:
      if status.status == connect_pb2.DISCONNECTED:
        self.connectedIDs.remove(status.deviceID)
      elif status.status == connect_pb2.TLS_CONNECTED:
        self.updateConnectedIDs(status.deviceID)
        if not (callback is None):
          callback(status.deviceID)
      elif status.status == connect_pb2.TCP_CONNECTED:
        self.updateConnectedIDs(status.deviceID)
        if not (callback is None):
          callback(status.deviceID)
```

## 3. Event Manager

EventMgr는 [Event.SubscribeRealtimeLog]({{'/api/event/' | relative_url}}#subscriberealtimelog)를 사용하여 장치들의 이벤트를 모니터링합니다. 이벤트가 감지되면 콜백 함수 __UserMgr.syncUser__ 를 호출합니다.

```python
eventMgr.handleEvent(userMgr.syncUser)

def handleEvent(self, callback):
  try:
    self.eventCh = self.eventSvc.subscribe(QUEUE_SIZE)
    statusThread = threading.Thread(target=self.receiveEvent, args=(callback,))
    statusThread.start()

def receiveEvent(self, callback):
  try:
    for event in self.eventCh:
      if not (callback is None):
        callback(event)
      else:
        print(f'\nEvent: {event}', flush=True)
```

## 4. User Manager

__UserMgr.syncUser__ 는 실시간 이벤트를 기반으로 사용자 정보를 동기화하는 방법을 보여줍니다. 등록 장치에서 사용자가 등록되면, 먼저 [User.Get]({{'/api/user/' | relative_url}}#get)을 사용하여 사용자 정보를 가져옵니다. 그런 다음 [User.EnrollMulti]({{'/api/user/' | relative_url}}#enrollmulti)를 사용하여 새 사용자를 다른 장치들로 전파합니다.

```python
def syncUser(self, eventLog):
  try:
  self.eventMgr.printEvent(eventLog)

  # Handle only the events of the enrollment device
  if eventLog.deviceID != self.testConfig.getConfigData()['enroll_device']['device_id']:
    return

  connectedIDs = self.deviceMgr.getConnectedDevices(False)
  targetDeviceIDs = self.testConfig.getTargetDeviceIDs(connectedIDs)

  if eventLog.eventCode == BS2_EVENT_USER_ENROLL_SUCCESS or eventLog.eventCode == BS2_EVENT_USER_UPDATE_SUCCESS:
    newUserInfos = self.userSvc.getUser(eventLog.deviceID, [eventLog.userID])
    self.userSvc.enrollMulti(targetDeviceIDs, newUserInfos, False)
  elif eventLog.eventCode == BS2_EVENT_USER_DELETE_SUCCESS:
    self.userSvc.deleteMulti(targetDeviceIDs, [eventLog.userID])
```

## 5. Multi Error Handling

[Multi 명령]({{'/api/' | relative_url}}#xxx_multi-command)이 하나 이상의 장치에서 실패하면, 게이트웨이는 [Err.MultiErrorResponse]({{'/api/err/' | relative_url}}#MultiErrorResponse)를 반환합니다. 아래와 같이 정보를 얻을 수 있습니다.

이를 위해 [grpcio-status](https://pypi.org/project/grpcio-status/)를 설치해야 합니다.
{: .notice--info}

```python
import err_pb2

from grpc_status import rpc_status

def getMultiError(rpcError):
  status = rpc_status.from_call(rpcError)
  if not (status is None):
    for detail in status.details:
      if detail.Is(err_pb2.MultiErrorResponse.DESCRIPTOR):
        info = err_pb2.MultiErrorResponse()
        detail.Unpack(info)
        return info

  return None
```
