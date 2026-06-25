---
title: "RTSP API"
toc_label: "RTSP"
---

BioStation 3, BioStation 3 Max에서는 RTSP를 사용할 수 있습니다.

## Config

```protobuf
message RTSPConfig {
  string serverURL;
  uint32 serverPort;
  string userID;
  string userPW;
  bool enabled;
  RTSP_RESOLUTION_TYPE resolution;
}
```
{: #RTSPConfig}

serverURL
: RTSP 서버의 주소입니다.

serverPort
: RTSP 서버 연결 포트입니다. 기본 포트는 554입니다.

userID
: RTSP 서버에 연결할 때 사용하는 계정 정보입니다.

userPW
: RTSP 서버에 연결할 때 사용하는 비밀번호입니다.

enabled
: RTSP 연결의 활성화 여부를 나타냅니다.

[resolution](#RTSP_RESOLUTION_TYPE)
: [+ 1.8.0] RTSP 스트리밍의 해상도를 지정합니다.

```protobuf
enum RTSP_RESOLUTION_TYPE {
  RTSP_RESOLUTION_DEFAULT = 0;
  RTSP_RESOLUTION_TYPE_1 = 0;
  RTSP_RESOLUTION_TYPE_2 = 1;
}
```
{: #RTSP_RESOLUTION_TYPE }

RTSP_RESOLUTION_DEFAULT
: RTSP의 영상 해상도를 지정합니다. 기본값을 의미하며, 기본값은 RTSP_RESOLUTION_TYPE_1입니다.

RTSP_RESOLUTION_TYPE_1
: 해상도를 Type1 (360*640)으로 설정합니다.

RTSP_RESOLUTION_TYPE_2
: 해상도를 Type2 (720x480)로 설정합니다.

### GetConfig

장치의 RTSP 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [RTSPConfig](#RTSPConfig) | 장치의 RTSP 구성 |

### SetConfig

장치의 RTSP 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [RTSPConfig](#RTSPConfig) | 장치에 기록할 RTSP 구성 |


### SetConfigMulti

여러 장치의 RTSP 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [RTSPConfig](#RTSPConfig) | 장치들에 기록할 RTSP 구성 |
