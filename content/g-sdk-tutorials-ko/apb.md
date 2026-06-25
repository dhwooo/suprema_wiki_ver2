---
title: "Anti Passback Zone API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이 설치 및 실행]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리 다운로드]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/apb/test/test.py_ 의 서버 및 장치 정보를 변경합니다.
   
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
    cd example/apb/test
    python test.py
    ```

## 1. 장치 구성

안티 패스백 존은 RS485로 연결된 여러 장치로 구성됩니다. 예제를 실행하려면 아래와 같이 두 개의 장치를 구성해야 합니다.

1. 두 장치를 RS485로 연결합니다.
2. 한 장치를 마스터로, 다른 장치를 슬레이브로 설정합니다. 이 설정은 장치 UI 또는 BioStar 2를 사용하여 구성할 수 있습니다. 또는 [RS485 API]({{'/api/rs485/' | relative_url}})를 사용할 수도 있습니다.

## 2. 게이트웨이와 장치에 연결

이 예제는 장치 게이트웨이를 사용한다고 가정합니다. 마스터 게이트웨이나 다른 연결 옵션의 경우 [Connect]({{'/go/connect' | relative_url}}) 또는 [ConnectMaster]({{'/go/connectMaster' | relative_url}}) 예제를 참고하세요.

  ```python
  client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
  channel = client.getChannel()
  
  connectSvc = ConnectSvc(channel)
  connInfo = connect_pb2.ConnectInfo(IPAddr=DEVICE_IP, port=DEVICE_PORT, useSSL=USE_SSL)

  devID = connectSvc.connect(connInfo)
  ```   

## 3. RS485 슬레이브 검색 및 등록

  ```python
  self.slaves = self.rs485Svc.searchSlave(deviceID)  

  self.registeredSlaves = self.rs485Svc.getSlave(deviceID)

  if len(self.registeredSlaves) == 0:
    self.rs485Svc.setSlave(deviceID, self.slaves)
  ```

## 4. 마스터 및 슬레이브 장치를 사용하여 존 만들기

  ```python
  entryDevice = apb_zone_pb2.Member(deviceID=deviceID, readerType=apb_zone_pb2.ENTRY)
  exitDevice = apb_zone_pb2.Member(deviceID=slaves[0].deviceID, readerType=apb_zone_pb2.EXIT)

  relaySignal = action_pb2.Signal(count=3, onDuration=500, offDuration=500)
  relayAction = action_pb2.RelayAction(relayIndex=0, signal=relaySignal)
  zoneAction = action_pb2.Action(deviceID=deviceID, type=action_pb2.ACTION_RELAY, relay=relayAction)

  zone = apb_zone_pb2.ZoneInfo(zoneID=TEST_ZONE_ID, name='Test APB Zone', resetDuration=0, members=[entryDevice, exitDevice], actions=[zoneAction])

  self.apbSvc.add(deviceID, [zone])
  
  # Test if APB zone works correctly
  ```  
