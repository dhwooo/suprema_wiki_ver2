---
title: "Trigger & Action API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행하기

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/action/test/test.py_ 에서 서버와 장치 정보를 변경합니다.
   
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
    cd example/action/test
    python test.py
    ```

## 1. 게이트웨이와 장치에 연결

이 예제는 장치 게이트웨이를 사용한다고 가정합니다. 마스터 게이트웨이나 다른 연결 옵션을 사용하려면 [Connect]({{'/go/connect' | relative_url}}) 또는 [ConnectMaster]({{'/go/connectMaster' | relative_url}}) 예제를 참고하십시오.

  ```python
  client = GatewayClient(GATEWAY_IP, GATEWAY_PORT, GATEWAY_CA_FILE)
  channel = client.getChannel()
  
  connectSvc = ConnectSvc(channel)
  connInfo = connect_pb2.ConnectInfo(IPAddr=DEVICE_IP, port=DEVICE_PORT, useSSL=USE_SSL)

  devID = connectSvc.connect(connInfo)
  ```   

## 2. 트리거 만들기

[여러 종류의 트리거]({{'/api/action' | relative_url}}#TriggerType)를 만들 수 있습니다. 이 예제는 그중에서 이벤트 트리거를 만드는 방법을 보여줍니다.

  ```python
  cardFailEventTrigger = action_pb2.EventTrigger(eventCode=BS2_EVENT_VERIFY_FAIL | BS2_SUB_EVENT_CREDENTIAL_CARD)
  cardFailTrigger = action_pb2.Trigger(deviceID=deviceID, type=action_pb2.TRIGGER_EVENT, event=cardFailEventTrigger)

  fingerFailEventTrigger = action_pb2.EventTrigger(eventCode=BS2_EVENT_IDENTIFY_FAIL | BS2_SUB_EVENT_CREDENTIAL_FINGER)
  fingerFailTrigger = action_pb2.Trigger(deviceID=deviceID, type=action_pb2.TRIGGER_EVENT, event=fingerFailEventTrigger)
  ```

## 3. 액션 만들기

이 예제는 릴레이 액션을 만드는 방법을 보여줍니다. 사용 가능한 액션 종류는 [ActionType]({{'/api/action' | relative_url}}#ActionType)을 참고하십시오.

  ```python
  relaySignal = action_pb2.Signal(count=3, onDuration=500, offDuration=500)
  relayAction = action_pb2.RelayAction(relayIndex=0, signal=relaySignal)
  failAction = action_pb2.Action(deviceID=deviceID, type=action_pb2.ACTION_RELAY, relay=relayAction)
  ```  

## 4. TriggerActionConfig 만들기

[TriggerActionConfig]({{'/api/action' | relative_url}}#TriggerActionConfig)에서는 최대 128쌍의 트리거와 액션을 구성할 수 있습니다.

  ```python
  cardTriggerAction = action_pb2.TriggerActionConfig.TriggerAction(trigger=cardFailTrigger, action=failAction)
  fingerTriggerAction = action_pb2.TriggerActionConfig.TriggerAction(trigger=fingerFailTrigger, action=failAction)

  config = action_pb2.TriggerActionConfig(triggerActions=[cardTriggerAction, fingerTriggerAction])
  self.actionSvc.setConfig(deviceID, config)
  ```  
