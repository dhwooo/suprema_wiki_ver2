---
title: "T&A API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리에 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/tna/test/test.py_ 에서 서버와 장치 정보를 변경합니다.
   
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
    cd example/tna/test
    python test.py
    ```

## 1. 게이트웨이와 장치에 연결

이 예제는 장치 게이트웨이를 사용한다고 가정합니다. 마스터 게이트웨이나 기타 연결 옵션에 대해서는 [Connect]({{'/go/connect' | relative_url}}) 또는 [ConnectMaster]({{'/go/connectMaster' | relative_url}}) 예제를 참고하십시오.

  ```python
  client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
  channel = client.getChannel()
  
  connectSvc = ConnectSvc(channel)
  connInfo = connect_pb2.ConnectInfo(IPAddr=DEVICE_IP, port=DEVICE_PORT, useSSL=USE_SSL)

  devID = connectSvc.connect(connInfo)
  ```   

## 2. T&A 설정 테스트

T&A 기능과 관련하여 설정할 수 있는 여러 옵션이 있습니다. 이 예제는 이러한 옵션 중 일부를 설정하는 방법을 보여주고 결과를 확인할 수 있게 해줍니다.

  ```python
  # (1) BY_USER
  config = tna_pb2.TNAConfig()
  config.mode = tna_pb2.BY_USER
  config.labels[:] = ["In", "Out", "Scheduled In", "Fixed Out"]
  tnaSvc.setConfig(deviceID, config)

  print(f'(1) The T&A mode is set to BY_USER(optional). You can select a T&A key before authentication. Try to authenticate after selecting a T&A key.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')

  # (2) IsRequired
  config.isRequired = True
  tnaSvc.setConfig(deviceID, config)

  print(f'(2) The T&A mode is set to BY_USER(mandatory). Try to authenticate without selecting a T&A key.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')

  # (3) LAST_CHOICE
  config.mode = tna_pb2.LAST_CHOICE
  tnaSvc.setConfig(deviceID, config)

  print(f'(3) The T&A mode is set to LAST_CHOICE. The T&A key selected by the previous user will be used. Try to authenticate multiple users.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')      

  # (4) BY_SCHEDULE
  config.mode = tna_pb2.BY_SCHEDULE
  config.schedules[:] = [0, 0, 1] # Always for KEY_3 (Scheduled In)
  tnaSvc.setConfig(deviceID, config)

  print(f'(4) The T&A mode is set to BY_SCHEDULE. The T&A key will be determined automatically by schedule. Try to authenticate without selecting a T&A key.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')          

  # (5) FIXED 
  config.mode = tna_pb2.FIXED
  config.key = tna_pb2.KEY_4
  tnaSvc.setConfig(deviceID, config)

  print(f'(5) The T&A mode is set to FIXED(KEY_4). Try to authenticate without selecting a T&A key.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')   
  ```

## 3. T&A 로그 가져오기

[TNA.GetTNALog]({{'/api/tna' | relative_url}}#gettnalog)를 사용하여 T&A 키 정보가 포함된 로그 레코드를 읽을 수 있습니다. 키의 레이블을 가져오려면 [TNAConfig.labels]({{'/api/tna' | relative_url}}#TNAConfig)를 조회해야 합니다.

  ```python
  events = tnaSvc.getTNALog(deviceID, firstEventID, 0)

  # ...

  def getTNALabel(key, config):
    if len(config.labels) > key - 1:
      return "%s(Key_%d)" % (config.labels[key - 1], key)
    else:
      return "Key_%s" % key
  ```

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
