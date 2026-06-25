---
title: "Server API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리에 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/server/test/test.py_ 의 서버 및 장치 정보를 변경합니다.
   
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
    cd example/server/test
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

## 2. 구독

장치로부터 요청을 받으려면 먼저 [설명된 대로]({{'/api/server/' | relative_url}}#RelatedOptions) 관련 옵션을 구성해야 합니다.

  ```python
  testConfig = auth_pb2.AuthConfig()
  testConfig.CopyFrom(origAuthConfig)
  testConfig.useServerMatching = True

  self.authSvc.setConfig(deviceID, testConfig)
  ```

그런 다음 요청 채널을 구독해야 합니다.

  ```python
  self.reqCh = self.serverSvc.subscribe(QUEUE_SIZE)
  ```

## 3. 인증(verification) 요청 처리

서버 매칭이 활성화되면 장치는 카드를 읽을 때 게이트웨이로 인증 요청을 보냅니다. 직접 로직을 구현하고 [HandleVerify]({{'/api/server/' | relative_url}}#handleverify)를 사용하여 그 결과를 장치로 반환할 수 있습니다.

  ```python
  def handleVerify(self):
    try:
      for req in self.reqCh:
        if self.returnError: # emulate authentication failure
          self.serverSvc.handleVerify(req, server_pb2.VERIFY_FAIL, None)
        else: # emulate authentication success
          userHdr = user_pb2.UserHdr(ID=TEST_USER_ID, numOfCard=1)
          cardData = card_pb2.CSNCardData(data=req.verifyReq.cardData)
          userInfo = user_pb2.UserInfo(hdr=userHdr, cards=[cardData])

          self.serverSvc.handleVerify(req, server_pb2.SUCCESS, userInfo)
  
  verifyThread = threading.Thread(target=self.handleVerify)
  verifyThread.start()
  ```

## 4. 식별(identification) 요청 처리

서버 매칭이 활성화되면 장치는 지문을 읽을 때 게이트웨이로 식별 요청을 보냅니다. 직접 로직을 구현하고 [HandleIdentify]({{'/api/server/' | relative_url}}#handleidentify)를 사용하여 그 결과를 장치로 반환할 수 있습니다.

  ```python
  def handleIdentify(self):
    try:
      for req in self.reqCh:
        if self.returnError: # emulate authentication failure
          self.serverSvc.handleIdentify(req, server_pb2.IDENTIFY_FAIL, None)
        else: # emulate authentication success
          userHdr = user_pb2.UserHdr(ID=TEST_USER_ID, numOfFinger=1)
          fingerData = finger_pb2.FingerData(templates=[req.identifyReq.templateData, req.identifyReq.templateData,])
          userInfo = user_pb2.UserInfo(hdr=userHdr, fingers=[fingerData])

          self.serverSvc.handleIdentify(req, server_pb2.SUCCESS, userInfo)

  identifyThread = threading.Thread(target=self.handleIdentify)
  identifyThread.start()    
  ```

