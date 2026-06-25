---
title: "Event API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이 설치 및 실행]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리 다운로드]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 폴더에 있습니다.
4. 필요에 따라 _example/event/test/test.py_ 의 서버 및 장치 정보를 변경합니다.
   
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
    cd example/event/test
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

## 2. 이벤트 코드 맵 초기화

V1.3부터 이벤트 코드 맵 __event_code.json__ 이 제공됩니다. 이를 애플리케이션에서 사용하여 이벤트 코드의 간단한 설명을 조회할 수 있습니다.

  ```python
  class EventSvc:
    def initCodeMap(self, filename):
      try:
        with open(filename) as f:
          self.codeMap = json.load(f)

    def getEventString(self, eventCode, subCode):
      for entry in self.codeMap['entries']:
        if eventCode == entry['event_code'] and subCode == entry['sub_code']:
          return entry['desc']

      return "Unknown code(%#X)" % (eventCode | subCode)

  eventSvc.initCodeMap(CODE_MAP_FILE)
  ```

## 3. 실시간 이벤트 수신

장치로부터 실시간 이벤트를 수신하려면 다음 작업을 수행해야 합니다.

1. 대상 장치에서 [모니터링을 활성화]({{'/api/event' | relative_url}}#enablemonitoring)합니다.
2. 이벤트 채널을 [구독]({{'/api/event' | relative_url}}#subscriberealtimelog)합니다.
3. 채널에서 이벤트를 읽습니다.

  ```python
  def handleEvent(self):
    for event in self.eventCh:
      # do something with the event
    
  self.eventSvc.enableMonitoring(deviceID)
  self.eventCh = self.eventSvc.subscribe(EVENT_QUEUE_SIZE)

  statusThread = threading.Thread(target=self.handleEvent)
  statusThread.start()
  ```

## 4. 이벤트 로그 읽기

이벤트 로그를 읽을 때 시작 인덱스와 최대 이벤트 수를 지정할 수 있습니다.

  ```python
  events = self.eventSvc.getLog(deviceID, self.firstEventID, MAX_NUM_EVENT)
  for event in events:
    self.printEvent(event)
  ```

<!--Deprecated. 2024.04.25  by charlie-->
<!-- You can also specify a filter to limit your search.

  ```python
  filter = event_pb2.EventFilter(eventCode=events[0].eventCode)
  events = self.eventSvc.getLogWithFilter(deviceID, self.firstEventID, MAX_NUM_EVENT, filter)
  for event in events:
    self.printEvent(event)
  ``` -->
