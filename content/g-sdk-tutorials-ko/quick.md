---
title: "Quick Start Guide for Device Gateway"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리에 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 에 있습니다.
4. 필요에 따라 _example/quick/quick.py_ 의 서버 및 장치 정보를 변경합니다.
   
    ```python
    # the path of the root certificate
    GATEWAY_CA_FILE = '../../../cert/gateway/ca.crt'

    # the ip address of the gateway
    GATEWAY_IP = '192.168.0.2'
    GATEWAY_PORT = 4000

    # the ip address of the target device
    DEVICE_IP = '192.168.0.110'
    DEVICE_PORT = 51211
    USE_SSL = False
    ```
5. 실행합니다.
   
    ```
    cd example/quick
    python quick.py
    ```


## 1. 개요

다음 단계에 따라 G-SDK 서비스를 사용할 수 있습니다.

1. 게이트웨이에 연결하여 ___grpc.secure_channel___ 을 가져옵니다.
   
    ```python
    creds = grpc.ssl_channel_credentials(f.read())
    channel = grpc.secure_channel("{}:{}".format(ipAddr, port), creds)
    ```

2. 채널을 사용하여 ___connect_pb2_grpc.ConnectStub___ 과 같은 서비스 스텁을 생성합니다. 사용 가능한 서비스와 함수에 대해서는 [API 레퍼런스]({{'/api/' | relative_url}})를 참고하십시오.
   
    ```python
    stub = connect_pb2_grpc.ConnectStub(channel)
    ```

3. 스텁을 사용하여 서비스의 함수를 호출합니다.
   
    ```python
    response = stub.Connect(connect_pb2.ConnectRequest(connectInfo=connInfo))    
    ```

_example_ 의 클래스들은 해당 API의 사용법을 보여주기 위해 작성되었습니다. 실제 애플리케이션에서는 이러한 샘플 클래스를 사용할 필요가 없습니다.
{: .notice--warning}


## 2. 장치 게이트웨이에 연결

가장 먼저 해야 할 일은 게이트웨이에 연결하여 이후 통신에 사용할 ___grpc.secure_channel___ 을 가져오는 것입니다. 게이트웨이의 주소와 포트 번호를 알고 있어야 합니다. 또한 TLS/SSL 통신을 위해 게이트웨이의 루트 인증서도 가지고 있어야 합니다.

```python
# An example class encapsulating communication with the gateway
class GatewayClient:
  channel = None

  # caFile is the pathname of the root certificate
  def __init__(self, ipAddr, port, caFile):
    with open(caFile, 'rb') as f:
      creds = grpc.ssl_channel_credentials(f.read())
      self.channel = grpc.secure_channel("{}:{}".format(ipAddr, port), creds)

  def getChannel(self):
    return self.channel
```

1. ___GatewayClient___ 를 생성하고 게이트웨이에 연결합니다.

    ```python
    client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
    channel = client.getChannel()
    ```

## 3. BioStar 장치에 연결

BioStar 장치와의 연결을 관리하는 방법에는 세 가지가 있습니다. 이 예제는 동기 API만 보여줍니다. 다른 API에 대해서는 [Connect API]({{'/api/connect/' | relative_url}})와 [튜토리얼]({{'/python/connect/' | relative_url}})을 참고하십시오..

```python
# An example class showing the usage of the Connect API
class ConnectSvc:
  stub = None

  def __init__(self, channel): 
    self.stub = connect_pb2_grpc.ConnectStub(channel)

  def getDeviceList(self):
    response = self.stub.GetDeviceList(connect_pb2.GetDeviceListRequest())
    return response.deviceInfos

  def connect(self, connInfo):
    response = self.stub.Connect(connect_pb2.ConnectRequest(connectInfo=connInfo))
    return response.deviceID

  def disconnect(self, deviceIDs):
    self.stub.Disconnect(connect_pb2.DisconnectRequest(deviceIDs=deviceIDs))
```

1. ___ConnectSvc___ 를 생성합니다. 내부적으로 ___connect_pb2_grpc.ConnectStub___ 을 만듭니다.
   
    ```python
    connectSvc = ConnectSvc(channel)
    ```

2. 지정한 장치에 연결합니다. 기본적으로 장치는 SSL을 사용하도록 설정되어 있지 않습니다. SSL을 사용하려면 먼저 [Connect.EnableSSL]({{'/api/connect/' | relative_url}}#enablessl)을 사용하여 활성화해야 합니다. 반환된 장치 ID는 다른 API에서 사용됩니다.
  
    ```python
    devID = connectSvc.connect(connInfo)
    ```

3. 게이트웨이가 관리하는 장치들을 가져옵니다.
   
    ```python
    devList = connectSvc.getDeviceList() 
    ```

4. 장치 연결을 해제합니다.
   
    ```python  
    deviceIDs = [devID]
    connectSvc.disconnect(deviceIDs)
    ```

## 4. 장치

[Device API]({{'/api/device/' | relative_url}})를 사용하여 지정한 장치의 정보를 가져올 수 있습니다.

```python
# An example class showing the usage of the Device API
class DeviceSvc:
  stub = None

  def __init__(self, channel): 
    self.stub = device_pb2_grpc.DeviceStub(channel)

  def getInfo(self, deviceID):
    response = self.stub.GetInfo(device_pb2.GetInfoRequest(deviceID=deviceID))
    return response.info

  def getCapInfo(self, deviceID):
    response = self.stub.GetCapabilityInfo(device_pb2.GetCapabilityInfoRequest(deviceID=deviceID))
    return response.capInfo
```

1. ___DeviceSvc___ 를 생성합니다. 내부적으로 ___device_pb2_grpc.DeviceStub___ 을 만듭니다.

    ```python
    deviceSvc = DeviceSvc(channel)
    ```
2. 장치의 버전 정보를 가져옵니다.

    ```python
    info = deviceSvc.getInfo(deviceID)
    ```

3. 장치의 기능(capability) 정보를 가져옵니다. 각 장치 유형은 고유한 기능을 가지고 있습니다. 예를 들어, [CapabilityInfo.faceSupported]({{'/api/device/' | relative_url }}#CapabilityInfo)는 FaceStation 2와 FaceLite에서만 true가 됩니다.

    ```python
    capInfo = deviceSvc.getCapInfo(deviceID)

    ```

## 5. 지문

[Finger API]({{'/api/finger/' | relative_url}})를 사용하여 지문을 스캔하고, 마지막으로 스캔한 이미지를 가져오며, 지문 옵션을 설정할 수 있습니다.

```python
# An example class showing the usage of the Finger API

class FingerSvc:
  stub = None

  def __init__(self, channel): 
    self.stub = finger_pb2_grpc.FingerStub(channel)

  def scan(self, deviceID, templateFormat, qualityThreshold):
    response = self.stub.Scan(finger_pb2.ScanRequest(deviceID=deviceID, templateFormat=templateFormat, qualityThreshold=qualityThreshold))
    return response.templateData

  def getImage(self, deviceID):
    response = self.stub.GetImage(finger_pb2.GetImageRequest(deviceID=deviceID))
    return response.BMPImage

  def getConfig(self, deviceID):
    response = self.stub.GetConfig(finger_pb2.GetImageRequest(deviceID=deviceID))
    return response.config
```

1. ___FingerSvc___ 를 생성합니다. 내부적으로 ___finger_pb2_grpc.FingerStub___ 을 만듭니다.
 
    ```python
    fingerSvc = FingerSvc(channel) 
    ```

2. 장치에서 지문을 스캔하고 템플릿 데이터를 가져옵니다. 이 템플릿을 [User.SetFinger]({{'/api/user/' | relative_url }}#setfinger)를 사용하여 사용자에게 할당할 수 있습니다.
   
    ```python
    templateData = fingerSvc.scan(deviceID, finger_pb2.TEMPLATE_FORMAT_SUPREMA, QUALITY_THRESHOLD)
    ```

3. 스캔한 지문 이미지를 가져와 BMP 파일로 저장합니다.

    ```python
    fingerImage = fingerSvc.getImage(deviceID)
    f = open(IMAGE_FILENAME, 'wb')
    f.write(fingerImage)
    f.close()
    ```    

4. 지문 설정을 가져옵니다. 일부 옵션을 변경하려면 [Finger.SetConfig]({{'/api/finger/' | relative_url }}#setconfig)를 호출합니다.

    ```python
    fingerConfig = fingerSvc.getConfig(deviceID)
    ```

## 6. 카드

[Card API]({{'/api/card/' | relative_url}})를 사용하여 카드를 스캔/기록하고, 블랙리스트를 관리하며, 카드 옵션을 설정할 수 있습니다.

```python
# An example class showing the usage of the Card API
class CardSvc:
  stub = None

  def __init__(self, channel): 
    self.stub = card_pb2_grpc.CardStub(channel)

  def scan(self, deviceID):
    response = self.stub.Scan(card_pb2.ScanRequest(deviceID=deviceID))
    return response.cardData

  def getBlacklist(self, deviceID):
    response = self.stub.GetBlacklist(card_pb2.GetBlacklistRequest(deviceID=deviceID))
    return response.blacklist

  def addBlacklist(self, deviceID, cardInfos):
    self.stub.AddBlacklist(card_pb2.AddBlacklistRequest(deviceID=deviceID, cardInfos=cardInfos))

  def deleteBlacklist(self, deviceID, cardInfos):
    self.stub.DeleteBlacklist(card_pb2.DeleteBlacklistRequest(deviceID=deviceID, cardInfos=cardInfos))
}
```

1. ___CardSvc___ 를 생성합니다. 내부적으로 ___card_pb2_grpc.CardStub___ 을 만듭니다.

    ```python
    cardSvc = CardSvc(channel)
    ```

2. 카드를 스캔합니다.

    ```python
    cardData = cardSvc.scan(deviceID)
    ```

3. BioStar 장치는 자격이 없는 카드를 비활성화하기 위해 블랙리스트를 관리합니다. 블랙리스트에 등록된 카드를 가져오거나, 추가하거나, 삭제할 수 있습니다.

    ```python
    # Get the current blacklist
    blacklist = cardSvc.getBlacklist(deviceID)

    # Add new items into the blacklist
    cardInfos = []

    for i in range(0, NUM_OF_NEW_BLACKLIST):
      buf = str(FIRST_BLACKLISTED_CARD_ID + i).encode()
      cardInfo = card_pb2.BlacklistItem(cardID=buf, issueCount=ISSUE_COUNT)
      cardInfos.append(cardInfo)

    cardSvc.addBlacklist(deviceID, cardInfos)
    ```

## 7. 사용자

[User API]({{'/api/user/' | relative_url}})를 사용하여 사용자를 가져오거나, 등록하거나, 삭제할 수 있습니다. 또한 사용자에게 지문/카드/그룹을 설정할 수도 있습니다.

```python
# An example class showing the usage of the User API
class UserSvc:
  stub = None

  def __init__(self, channel): 
    self.stub = user_pb2_grpc.UserStub(channel)

  def getList(self, deviceID):
    response = self.stub.GetList(user_pb2.GetListRequest(deviceID=deviceID))
    return response.hdrs

  def getUser(self, deviceID, userIDs):
    response = self.stub.Get(user_pb2.GetRequest(deviceID=deviceID, userIDs=userIDs))
    return response.users    

  def enroll(self, deviceID, users, overwrite):
    self.stub.Enroll(user_pb2.EnrollRequest(deviceID=deviceID, users=users, overwrite=overwrite))

  def delete(self, deviceID, userIDs):
    self.stub.Delete(user_pb2.DeleteRequest(deviceID=deviceID, userIDs=userIDs))

  def setFinger(self, deviceID, userFingers):
    self.stub.SetFinger(user_pb2.SetFingerRequest(deviceID=deviceID, userFingers=userFingers))
```

1. ___UserSvc___ 를 생성합니다. 내부적으로 ___user_pb2_grpc.UserStub___ 을 만듭니다.

    ```python
    userSvc = UserSvc(channel) 
    ```

2. 사용자 목록과 상세 정보를 가져옵니다.

    ```python
    # Get the user list
    userList = userSvc.getList(deviceID)

    # Extract user IDs from the list
    userIDs = []
    for user in userList:
      userIDs.append(user.ID)

    # Get the user information with the user IDs
    userInfos = userSvc.getUser(deviceID, userIDs)
    ```

3. 새 사용자를 등록합니다.

    ```python
    userInfos = []

    for i in range(0, NUM_OF_NEW_USER):
      userHdr = user_pb2.UserHdr(ID=str(START_USER_ID + i))
      userInfo = user_pb2.UserInfo(hdr=userHdr)

      userInfos.append(userInfo)

    userSvc.enroll(deviceID, userInfos, True)
    ```

4. 사용자에게 지문을 설정합니다. 비슷한 방식으로 카드, 접근 그룹, 작업 코드도 설정할 수 있습니다.

    ```python
    # Scan the first fingerprint
    templateData1 = fingerSvc.scan(deviceID, TEMPLATE_FORMAT, QUALITY_THRESHOLD)

    # Scan the second fingerprint of the same finger
    templateData2 = fingerSvc.scan(deviceID, TEMPLATE_FORMAT, QUALITY_THRESHOLD)

    fingerData = finger_pb2.FingerData(templates=[templateData1, templateData2])
    userFingers = [user_pb2.UserFinger(userID=userID, fingers=[fingerData])]

    userSvc.setFinger(deviceID, userFingers)
    ```

5. 새 사용자를 삭제합니다.

    ```python
    userSvc.delete(deviceID, newUserIDs)
    ```

## 8. 이벤트

[Event API]({{'/api/event/' | relative_url}})를 사용하여 장치에 저장된 이벤트 로그를 읽을 수 있습니다. 또한 모니터링을 활성화한 후 실시간 이벤트를 수신할 수도 있습니다.

```python
# An example class showing the usage of the Event API
class EventSvc:
  stub = None

  def __init__(self, channel): 
    self.stub = event_pb2_grpc.EventStub(channel)

  def getLog(self, deviceID, startEventID, maxNumOfLog):
    response = self.stub.GetLog(event_pb2.GetLogRequest(deviceID=deviceID, startEventID=startEventID, maxNumOfLog=maxNumOfLog))
    return response.events

  def getImageLog(self, deviceID, startEventID, maxNumOfLog):
    response = self.stub.GetImageLog(event_pb2.GetImageLogRequest(deviceID=deviceID, startEventID=startEventID, maxNumOfLog=maxNumOfLog))
    return response.imageEvents

  def enableMonitoring(self, deviceID):
    self.stub.EnableMonitoring(event_pb2.EnableMonitoringRequest(deviceID=deviceID))

  def disableMonitoring(self, deviceID):
    self.stub.DisableMonitoring(event_pb2.DisableMonitoringRequest(deviceID=deviceID))

  def subscribe(self, queueSize): 
    return self.stub.SubscribeRealtimeLog(event_pb2.SubscribeRealtimeLogRequest(queueSize=queueSize))
```

1. ___EventSvc___ 를 생성합니다. 내부적으로 ___event_pb2_grpc.EventStub___ 을 만듭니다.

    ```python
    eventSvc = EventSvc(channel)
    ```

2. 이벤트 로그를 가져옵니다. 첫 번째 ID와 반환할 이벤트의 최대 개수를 지정할 수 있습니다.

    ```python
    events = eventSvc.getLog(deviceID, 0, MAX_NUM_OF_LOG)
    ```

3. JPG 형식의 이미지 로그를 가져옵니다. [CapabilityInfo.imageLogSupported]({{'/api/device/' | relative_url }}#CapabilityInfo)를 지원하는 장치만 이미지 로그를 저장할 수 있습니다. 또한 [Event.SetImageFilter]({{'/api/event/' | relative_url }}#setimagefilter)를 사용하여 이미지 로그를 저장할 이벤트 유형을 지정할 수도 있습니다.

    ```python
    imageEvents = eventSvc.getImageLog(deviceID, 0, MAX_NUM_OF_IMAGE_LOG)

    if len(imageEvents) > 0:
      f = open(LOG_IMAGE_NAME, 'wb')
      f.write(imageEvents[0].JPGImage)
      f.close()
    ```

4. 장치의 이벤트 모니터링을 활성화하고 실시간 이벤트를 수신합니다.

    ```python
    # Enable monitoring of the device
    eventSvc.enableMonitoring(deviceID)

    # Start receiving events from the subscription channel
    eventCh = eventSvc.subscribe(QUEUE_SIZE)

    for event in eventCh:
      print(f'Event: {event}', flush=True)    
    ```

5. 모니터링을 중지합니다.

    ```python
    eventCh.cancel()
    eventSvc.disableMonitoring(deviceID)
    ```


