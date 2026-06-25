---
title: "Wiegand API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이 설치 및 실행]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리 다운로드]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/wiegand/test/test.py_ 의 서버 및 장치 정보를 변경합니다.
   
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
    cd example/wiegand/test
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

## 2. 표준 26비트 포맷 만들기

26비트 표준 포맷은 8비트 시설 코드(facility code)와 16비트 ID로 구성됩니다. 업계에서 가장 널리 사용되는 포맷 중 하나입니다.

  ```python
  # 26 bit standard
  # FC: 01 1111 1110 0000 0000 0000 0000 : 0x01fe0000
  # ID: 00 0000 0001 1111 1111 1111 1110 : 0x0001fffe
  # EP: 01 1111 1111 1110 0000 0000 0000 : 0x01ffe000, Pos 0, Type: Even
  # OP: 00 0000 0000 0001 1111 1111 1110 : 0x00001ffe, Pos 25, Type: Odd 

  default26bit = wiegand_pb2.WiegandFormat(length=26)
  default26bit.IDFields.append(bytes([0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])) # Facility Code
  default26bit.IDFields.append(bytes([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0])) # ID

  evenParity = wiegand_pb2.ParityField(parityPos=0, parityType=wiegand_pb2.WIEGAND_PARITY_EVEN)
  evenParity.data = bytes([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  oddParity = wiegand_pb2.ParityField(parityPos=25, parityType=wiegand_pb2.WIEGAND_PARITY_ODD)
  oddParity.data = bytes([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0])

  default26bit.parityFields.append(evenParity)
  default26bit.parityFields.append(oddParity)

  wiegandConfig = wiegand_pb2.WiegandConfig(mode=wiegand_pb2.WIEGAND_IN_ONLY, outPulseWidth=40, outPulseInterval=10000)
  wiegandConfig.formats.append(default26bit)

  self.wiegandSvc.setConfig(deviceID, wiegandConfig)
  ``` 

## 3. HID 37비트 포맷 만들기

HID 37 포맷은 16비트 시설 코드(facility code)와 19비트 ID로 구성됩니다.

  ```python
  # 37 bit HID
  # FC: 0 1111 1111 1111 1111 0000 0000 0000 0000 0000 : 0x0ffff00000
  # ID: 0 0000 0000 0000 0000 1111 1111 1111 1111 1110 : 0x00000ffffe
  # EP: 0 1111 1111 1111 1111 1100 0000 0000 0000 0000 : 0x0ffffc0000, Pos 0, Type: Even
  # OP: 0 0000 0000 0000 0000 0111 1111 1111 1111 1110 : 0x000007fffe, Pos 36, Type: Odd

  hid37bitFormat = wiegand_pb2.WiegandFormat(length=37)
  hid37bitFormat.IDFields.append(bytes([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])) # Facility Code
  hid37bitFormat.IDFields.append(bytes([0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0])) # ID

  evenParity = wiegand_pb2.ParityField(parityPos=0, parityType=wiegand_pb2.WIEGAND_PARITY_EVEN)
  evenParity.data = bytes([0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  oddParity = wiegand_pb2.ParityField(parityPos=36, parityType=wiegand_pb2.WIEGAND_PARITY_ODD)
  oddParity.data = bytes([0, 0, 0, 0, 0, 0, 0 ,0 ,0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0])

  hid37bitFormat.parityFields.append(evenParity)
  hid37bitFormat.parityFields.append(oddParity)

  wiegandConfig = wiegand_pb2.WiegandConfig(mode=wiegand_pb2.WIEGAND_IN_ONLY, outPulseWidth=40, outPulseInterval=10000)
  wiegandConfig.formats.append(hid37bitFormat)

  self.wiegandSvc.setConfig(deviceID, wiegandConfig)
  ```