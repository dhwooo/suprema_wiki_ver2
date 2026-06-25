---
title: "Status API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행하기

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리에 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/status/test/test.py_ 에서 서버와 장치 정보를 변경합니다.
   
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
    cd example/status/test
    python test.py
    ```

## 1. 게이트웨이와 장치에 연결

이 예제는 장치 게이트웨이를 사용한다고 가정합니다. 마스터 게이트웨이나 다른 연결 옵션을 사용하려면 [Connect]({{'/go/connect' | relative_url}}) 또는 [ConnectMaster]({{'/go/connectMaster' | relative_url}}) 예제를 참고하세요.

  ```python
  client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
  channel = client.getChannel()
  
  connectSvc = ConnectSvc(channel)
  connInfo = connect_pb2.ConnectInfo(IPAddr=DEVICE_IP, port=DEVICE_PORT, useSSL=USE_SSL)

  devID = connectSvc.connect(connInfo)
  ```   

## 2. 장치 유형 확인

상태 설정은 BioEntry W2와 같은 헤드리스(headless) 장치에서만 유효합니다.

  ```python  
  def isHeadless(devType):
    headlessTypes = [
      device_pb2.BIOENTRY_P2, 
      device_pb2.BIOENTRY_R2, 
      device_pb2.BIOENTRY_W2, 
      device_pb2.XPASS2, 
      device_pb2.XPASS2_KEYPAD, 
      device_pb2.XPASS_D2, 
      device_pb2.XPASS_D2_KEYPAD, 
      device_pb2.XPASS_S2
    ]

    for headlessType in headlessTypes:
      if devType == headlessType:
        return True

    return False

  deviceSvc = DeviceSvc(channel)
  capInfo = deviceSvc.getCapInfo(devID)

  if not isHeadless(capInfo.type):
    connectSvc.disconnect([devID])
    return
  ``` 

## 3. LED 신호 변경

LED 또는 부저 신호를 변경할 수 있는 [15가지 사전 정의된 상태]({{'/api/status' | relative_url}}#DeviceStatus)가 있습니다. 이 예제는 __DEVICE_STATUS_NORMAL__ 의 LED 신호를 변경합니다.

  ```python
  for i in range(len(config.LEDState)):
    if config.LEDState[i].deviceStatus == status_pb2.DEVICE_STATUS_NORMAL: # Change the LED color of the normal status to yellow
      config.LEDState[i].count = 0 # indefinite

      del config.LEDState[i].signals[:]
      ledSignal = action_pb2.LEDSignal(color=device_pb2.LED_COLOR_YELLOW, duration=2000, delay=0)
      config.LEDState[i].signals.append(ledSignal)
      break

  self.statusSvc.setConfig(deviceID, config)
  ```

## 4. 부저 신호 변경

이 예제는 __DEVICE_STATUS_FAIL__ 의 부저 신호를 변경합니다.

  ```python
  for i in range(len(config.BuzzerState)):
    if config.BuzzerState[i].deviceStatus == status_pb2.DEVICE_STATUS_FAIL: # Change the buzzer signal for FAIL
      config.BuzzerState[i].count = 1 # indefinite

      del config.BuzzerState[i].signals[:]
      buzzerSignal = action_pb2.BuzzerSignal(tone=device_pb2.BUZZER_TONE_HIGH, duration=500, delay=2) # 2 x 500ms beeps
      config.BuzzerState[i].signals.append(buzzerSignal)
      config.BuzzerState[i].signals.append(buzzerSignal)
      break

  self.statusSvc.setConfig(deviceID, config)
  ```