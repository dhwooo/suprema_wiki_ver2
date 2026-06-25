---
title: "User API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/user/test/test.py_ 의 서버 및 장치 정보를 변경합니다.
   
    ```python
    # the path of the root certificate
    GATEWAY_CA_FILE = '../../../../cert/gateway/ca.crt'

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
    cd example/user/test
    python test.py
    ```

## 1. 게이트웨이와 장치에 연결

이 예제는 장치 게이트웨이를 사용한다고 가정합니다. 마스터 게이트웨이나 다른 연결 옵션에 대해서는 [Connect]({{'/go/connect' | relative_url}}) 또는 [ConnectMaster]({{'/go/connectMaster' | relative_url}}) 예제를 참고하세요.

  ```python
  client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
  channel = client.getChannel()
  
  connectSvc = ConnectSvc(channel)
  connInfo = connect_pb2.ConnectInfo(IPAddr=DEVICE_IP, port=DEVICE_PORT, useSSL=USE_SSL)

  devID = connectSvc.connect(connInfo)
  ```   

## 2. 인증 설정 변경

테스트 사용자의 인증 모드를 테스트하기 위해 [AuthConfig.usePrivateAuth]({{'/api/auth' | relative_url}}#AuthConfig)를 활성화합니다.

  ```python
  config = authSvc.getConfig(deviceID)

  # Backup the original configuration
  origConfig = auth_pb2.AuthConfig()
  origConfig.CopyFrom(config)

  # Enable private authentication for test
  config.usePrivateAuth = True
  authSvc.setConfig(deviceID, config)
  ```

## 3. 사용자 등록

테스트 사용자를 등록하고 인증 모드를 설정합니다. 간결함을 위해 이 예제는 단순한 인증 모드만 설정합니다. 이 값들을 변경하여 [모든 모드]({{'/api/auth' | relative_url}}#AuthMode)를 테스트할 수 있습니다.

  ```python
  newUserID = "%d" % int(time.time())
  newUserHdr = user_pb2.UserHdr(ID=newUserID)
  newUser = user_pb2.UserInfo(hdr=newUserHdr, setting=user_pb2.UserSetting())

  if deviceType == device_pb2.FACESTATION_F2 or deviceType == device_pb2.FACESTATION_F2_FP:
    newUser.setting.cardAuthExtMode = auth_pb2.AUTH_EXT_MODE_CARD_ONLY
    newUser.setting.fingerAuthExtMode = auth_pb2.AUTH_EXT_MODE_FINGERPRINT_ONLY
    newUser.setting.faceAuthExtMode = auth_pb2.AUTH_EXT_MODE_FACE_ONLY
  else:
    newUser.setting.cardAuthMode = auth_pb2.AUTH_MODE_CARD_ONLY
    newUser.setting.biometricAuthMode = auth_pb2.AUTH_MODE_BIOMETRIC_ONLY

  userSvc.enroll(deviceID, [newUser], True)
  ```

## 4. 사용자에게 크리덴셜 추가

테스트 사용자에게 카드, 지문 또는 얼굴을 추가합니다. 각 장치가 지원하는 크리덴셜을 확인하려면 [Device.GetCapabilityInfo]({{'/api/device' | relative_url}}#getcapabilityinfo)를 사용할 수 있습니다. 추가된 크리덴셜에 대해, 장치에서 인증할 수 있는지 확인하세요.

  ```python
  capInfo = deviceSvc.getCapInfo(devID)

  if capInfo.cardSupported: 
    cardSvc = CardSvc(channel)
    TestCard(cardSvc, userSvc).test(devID, testUserID)

  if capInfo.fingerSupported: 
    fingerSvc = FingerSvc(channel)
    TestFinger(fingerSvc, userSvc).test(devID, testUserID)

  if capInfo.faceSupported: 
    faceSvc = FaceSvc(channel)
    TestFace(faceSvc, userSvc).test(devID, testUserID)
  ```
  
  ```python
  cardData = cardSvc.scan(deviceID)
  userCard = user_pb2.UserCard(userID=userID, cards=[cardData.CSNCardData])
  userSvc.setCard(deviceID, [userCard])

  pressEnter('>> Try to authenticate the enrolled card. And, press ENTER to end the test.\n') 
  ```

  ```python
  fingerData = finger_pb2.FingerData()

  fingerData.templates.append(fingerSvc.scan(deviceID, TEMPLATE_FORMAT, QUALITY_THRESHOLD))
  fingerData.templates.append(fingerSvc.scan(deviceID, TEMPLATE_FORMAT, QUALITY_THRESHOLD))

  userFinger = user_pb2.UserFinger(userID=userID, fingers=[fingerData])
  userSvc.setFinger(deviceID, [userFinger])

  pressEnter('>> Try to authenticate the enrolled finger. And, press ENTER to end the test.\n')
  ```

  ```python
  faceData = faceSvc.scan(deviceID, ENROLL_THRESHOLD)
  userFace = user_pb2.UserFace(userID=userID, faces=[faceData])
  userSvc.setFace(deviceID, [userFace])

  pressEnter('>> Try to authenticate the enrolled face. And, press ENTER to end the test.\n')
  ```

## 5. 인증 모드 테스트

[AuthConfig]({{'/api/auth' | relative_url}}#AuthConfig)를 사용하여 장치의 인증 모드를 설정할 수 있습니다.

이 단계에서 __AuthConfig.usePrivateAuth__ 는 false로 설정됩니다. 즉, 이 인증 모드는 모든 사용자에게 적용됩니다.
{: .notice--info}

  ```python
  config = auth_pb2.AuthConfig(matchTimeout=10, authTimeout=15, usePrivateAuth=False)

  if deviceType == device_pb2.FACESTATION_F2 or deviceType == device_pb2.FACESTATION_F2_FP:
    config.authSchedules.add(mode=auth_pb2.AUTH_EXT_MODE_CARD_ONLY, scheduleID=1) # Card Only, Always
    config.authSchedules.add(mode=auth_pb2.AUTH_EXT_MODE_FACE_ONLY, scheduleID=1) # Face Only, Always
    config.authSchedules.add(mode=auth_pb2.AUTH_EXT_MODE_FINGERPRINT_ONLY, scheduleID=1) # Fingerprint Only, Always
  else:
    config.authSchedules.add(mode=auth_pb2.AUTH_MODE_CARD_ONLY, scheduleID=1) # Card Only, Always
    config.authSchedules.add(mode=auth_pb2.AUTH_MODE_BIOMETRIC_ONLY, scheduleID=1) # Biometric Only, Always

  authSvc.setConfig(deviceID, config)

  pressEnter('>> Try to authenticate card or fingerprint or face. And, press ENTER for the next test.\n')

  del config.authSchedules[:]

  if deviceType == device_pb2.FACESTATION_F2 or deviceType == device_pb2.FACESTATION_F2_FP:
    config.authSchedules.add(mode=auth_pb2.AUTH_EXT_MODE_CARD_FACE, scheduleID=1) # Card + Face, Always
    config.authSchedules.add(mode=auth_pb2.AUTH_EXT_MODE_CARD_FINGERPRINT, scheduleID=1) # Card + Fingerprint, Always
  else:
    config.authSchedules.add(mode=auth_pb2.AUTH_MODE_CARD_BIOMETRIC, scheduleID=1) # Card + Biometric, Always

  authSvc.setConfig(deviceID, config)

  pressEnter('>> Try to authenticate (card + fingerprint) or (card + face). And, press ENTER for the next test.\n')
  ```

## 6. 이벤트 로그 가져오기

<!--Deprecated. 2024.04.25  by charlie-->
<!-- You can apply filters when reading log records. In a filter, userID or [eventCode]({{'/api/event' | relative_url}}#EventCode) can be specified.

  ```python
  filter = event_pb2.EventFilter(userID=userID)
  events = eventSvc.getLogWithFilter(deviceID, firstEventID, 0, filter)

  # do something with the events

  filter.eventCode = 0x1000 # BS2_EVENT_VERIFY_SUCCESS
  events = eventSvc.getLogWithFilter(deviceID, firstEventID, 0, filter)

  # do something with the events
  ``` -->

실시간 이벤트를 수신하기 위해 이벤트 스트림을 구독할 수도 있습니다.

  ```python
  eventSvc.enableMonitoring(deviceID)
  eventCh = eventSvc.subscribe(EVENT_QUEUE_SIZE)

  statusThread = threading.Thread(target=handleEvent)
  statusThread.start()  

  # ..

  def handleEvent():
    for event in eventCh:
      # do something with the event
  ```

