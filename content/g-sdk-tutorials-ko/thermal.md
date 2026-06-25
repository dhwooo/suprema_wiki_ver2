---
title: "Thermal API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/thermal/test/test.py_ 의 서버 및 장치 정보를 변경합니다.
   
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
    cd example/thermal/test
    python test.py
    ```

## 1. 게이트웨이와 장치에 연결

이 예제는 장치 게이트웨이를 사용한다고 가정합니다. 마스터 게이트웨이나 다른 연결 옵션은 [Connect]({{'/go/connect' | relative_url}}) 또는 [ConnectMaster]({{'/go/connectMaster' | relative_url}}) 예제를 참고하세요.

  ```python
  client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
  channel = client.getChannel()
  
  connectSvc = ConnectSvc(channel)
  connInfo = connect_pb2.ConnectInfo(IPAddr=DEVICE_IP, port=DEVICE_PORT, useSSL=USE_SSL)

  devID = connectSvc.connect(connInfo)
  ```   

## 2. 써멀 설정 테스트

써멀 카메라와 관련하여 구성할 수 있는 여러 옵션이 있습니다. 이 예제는 이러한 옵션 중 일부를 구성하고 그 결과를 확인하는 방법을 보여줍니다.

```python
  # Set options for the test
  config.auditTemperature = True # write temperature logs
  config.checkMode = thermal_pb2.HARD # disalllow access when temperature is too high

  # (1) Set check order to AFTER_AUTH
  config.checkOrder = thermal_pb2.AFTER_AUTH 
  self.thermalSvc.setConfig(deviceID, config)

  print(f'(1) The Check Order is set to AFTER_AUTH. The device will try to authenticate a user only when the user\'s temperature is within the threshold. Try to authenticate faces.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')

  # (2) Set check order to BEFORE_AUTH
  config.checkOrder = thermal_pb2.BEFORE_AUTH 
  self.thermalSvc.setConfig(deviceID, config)

  print(f'(2) The Check Order is set to BEFORE_AUTH. The device will measure the temperature only after successful authentication. Try to authenticate faces.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')      

  # (3) Set check order to WITHOUT_AUTH
  config.checkOrder = thermal_pb2.WITHOUT_AUTH 
  self.thermalSvc.setConfig(deviceID, config)

  print(f'(3) The Check Order is set to WITHOUT_AUTH. Any user whose temperature is within the threshold will be allowed to access. Try to authenticate faces.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')     

  # (4) Set check order to AFTER_AUTH with too low threshold
  config.checkOrder = thermal_pb2.AFTER_AUTH 
  config.temperatureThreshold = 3500 # Too low threshold. Most temperature check will fail
  self.thermalSvc.setConfig(deviceID, config)

  print(f'(4) To reproduce the case of high temperature, the Check Order is set to AFTER_AUTH with the threshold of 35 degree Celsius. Most temperature check will fail, now. Try to authenticate faces.\n')
  pressEnter('>> Press ENTER if you finish testing this mode.\n')    
```

## 3. 온도 로그 가져오기

[ThermalConfig.AuditTemperature]({{'/api/thermal' | relative_url}}#ThermalConfig) 를 true로 설정하면 장치가 다른 정보와 함께 사용자의 온도를 기록합니다. 이러한 로그는 [Thermal.GetTempeartureLog]({{'/api/thermal' | relative_url}}#gettemperaturelog) 를 사용하여 읽을 수 있습니다.

  ```python
  events = thermalSvc.getTemperatureLog(deviceID, self.firstEventID, 0)
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
