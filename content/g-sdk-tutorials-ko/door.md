---
title: "Door API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 에 있습니다.
4. 필요에 따라 _example/door/test/test.py_ 에서 서버와 장치 정보를 변경합니다.
   
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
    cd example/door/test
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

## 2. 도어 만들기

이 예제는 단일 장치로 구성된 도어를 설정하는 방법을 보여줍니다.

  ```python
  relay = door_pb2.Relay(deviceID=deviceID, port=0) # 1st relay
  sensor = door_pb2.Sensor(deviceID=deviceID, port=0, type=device_pb2.NORMALLY_OPEN) # 1st input port
  button = door_pb2.ExitButton(deviceID=deviceID, port=1, type=device_pb2.NORMALLY_OPEN) # 2nd input port

  doorInfo = door_pb2.DoorInfo(doorID=TEST_DOOR_ID, name='Test Door', entryDeviceID=deviceID, relay=relay, sensor=sensor, button=button, autoLockTimeout=3, heldOpenTimeout=10)

  self.doorSvc.add(deviceID, [doorInfo])
  ```

## 3. 액세스 그룹 만들기

사용자가 도어에 접근하도록 허용하려면 먼저 액세스 그룹을 할당해야 합니다. 액세스 그룹을 생성하려면 [Access API]({{'/api/access/' | relative_url}})를 사용해야 합니다.

  ```python
  doorSchedule = access_pb2.DoorSchedule(doorID=TEST_DOOR_ID, scheduleID=ALWAYS_SCHEDULE_ID) # can access the test door all the time
  accessLevel = access_pb2.AccessLevel(ID=TEST_ACCESS_LEVEL_ID, name='Test Access Level', doorSchedules=[doorSchedule])
  self.accessSvc.addLevel(deviceID, [accessLevel])

  accessGroup = access_pb2.AccessGroup(ID=TEST_ACCESS_GROUP_ID, name='Test Access Group', levelIDs=[TEST_ACCESS_LEVEL_ID])
  self.accessSvc.add(deviceID, [accessGroup])
  ```

그런 다음, [User API]({{'/api/user/' | relative_url}})를 사용하여 이 액세스 그룹을 사용자에게 할당해야 합니다.

  ```python
  userAccessGroup = user_pb2.UserAccessGroup(userID=userID, accessGroupIDs=[TEST_ACCESS_GROUP_ID])
  self.userSvc.setAccessGroup(deviceID, [userAccessGroup])
  ```

## 4. 도어 잠금/잠금 해제

해당 API를 사용하여 도어를 수동으로 잠그거나 잠금 해제할 수 있습니다.

  ```python
  # unlock the door
  self.doorSvc.unlock(deviceID, [TEST_DOOR_ID], door_pb2.OPERATOR)

  # lock the door
  self.doorSvc.lock(deviceID, [TEST_DOOR_ID], door_pb2.OPERATOR)

  # release the door flag for normal operation
  self.doorSvc.release(deviceID, [TEST_DOOR_ID], door_pb2.OPERATOR)
  ```