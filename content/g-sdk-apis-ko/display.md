---
title: "Display API"
toc_label: "Display"  
---

__DisplayConfig__를 사용하여 UI 옵션을 설정할 수 있습니다. 언어 팩, 배경 이미지, 사운드도 변경할 수 있습니다.

## Config

```protobuf
message DisplayConfig {
  LanguageType language;
  BackgroundType background;
  BackgroundTheme theme;

  uint32 volume;
  bool useVoice;

  DateFormat dateFormat;
  TimeFormat timeFormat;
  bool showDateTime;

  uint32 menuTimeout;
  uint32 msgTimeout;
  uint32 backlightTimeout;

  bool useUserPhrase;
  bool queryUserPhrase;

  bool useScreenSaver;
  ShowOSDPResult showOSDPResult;

  ShowOptionUserInfo showOptionUserName;
  ShowOptionUserInfo showOptionUserId;
  KeypadType keypadType;
}
```
{: #DisplayConfig }

[language](#LanguageType)
: 기본적으로 영어와 한국어가 지원됩니다.

[background](#BackgroundType)
: 장치의 배경 이미지입니다. 

theme
: 아직 지원되지 않습니다.

volume
: 0(무음)에서 100(최대)까지의 볼륨 레벨입니다.

useVoice
: 음성 안내를 활성화합니다.

[dateFormat](#DateFormat)
: 

[timeFormat](#TimeFormat)
: 

showDateTime
: true인 경우 화면에 시계를 표시합니다.

menuTimeout
: 지정한 시간(초) 후에 메뉴를 닫습니다. 기본값은 20초입니다.

msgTimeout
: 지정한 시간(밀리초) 후에 메시지 대화 상자를 닫습니다. 기본값은 2,000밀리초입니다.

backlightTimeout
: 지정한 시간(초) 후에 백라이트를 끕니다. 기본값은 20초입니다.

useUserPhrase
: 사용자가 인증되었을 때 특정 메시지를 표시합니다. 장치의 [CapabilityInfo.userPhraseSupported]({{'/api/device/' | relative_url}}#CapabilityInfo)가 true여야 합니다.

queryUserPhrase
: __useUserPhrase__가 true인 경우, 표시할 문구를 장치 게이트웨이에 요청합니다. 자세한 내용은 [Server API]({{'/api/server/' | relative_url}})를 참조하십시오.

useScreenSaver
: true인 경우 화면 보호기가 사용됩니다.

[showOSDPResult](#ShowOSDPResult)
: [+ 1.7.0] Suprema 장치가 Intelligent Slave 또는 서드파티 컨트롤러에 주변 장치로 연결된 환경에서, 이 옵션을 사용하면 인증 결과를 장치 화면에 표시할 수 있습니다.

[showOptionUserName](#ShowOptionUserInfo)
: [+ 1.8.0] 인증 성공 결과에 대한 사용자 이름 표시 조건을 변경합니다. 개인 정보 보호가 중요한 장소에서 사용할 수 있습니다.

| Value | Description |
| --------- | ----------- |
| BS2_SHOW_USER_INFO_ALL | 전체 사용자 이름 표시 |
| BS2_SHOW_USER_INFO_PARTIAL | 부분 사용자 이름 표시 |
| BS2_SHOW_USER_INFO_NOTHING | 사용자 이름 숨김 |

[showOptionUserId](#ShowOptionUserInfo)
: [+ 1.8.0] 인증 성공 결과에 대한 사용자 ID 표시 조건을 변경합니다. 개인 정보 보호가 중요한 장소에서 사용할 수 있습니다.

| Value | Description |
| --------- | ----------- |
| BS2_SHOW_USER_INFO_ALL | 전체 사용자 ID 표시 |
| BS2_SHOW_USER_INFO_PARTIAL | 부분 사용자 ID 표시 |
| BS2_SHOW_USER_INFO_NOTHING | 사용자 ID 숨김 |

[keypadType](#KeypadType)
: [+ 1.8.0] 스크램블 키패드를 켜거나 끕니다. 기본값은 켜짐입니다.

| Value | Description |
| --------- | ----------- |
| BS2_KEYPAD_TYPE_SCRAMBLE | 스크램블 키패드 켜짐. (보안 우선) |
| BS2_KEYPAD_TYPE_NORMAL | 스크램블 키패드 꺼짐. (사용성 우선) |


```protobuf
enum LanguageType {
  BS2_LANGUAGE_KOREAN = 0;
  BS2_LANGUAGE_ENGLISH = 1;
  BS2_LANGUAGE_CUSTOM = 2;
}
```
{: #LanguageType }

```protobuf
enum BackgroundType {
  BS2_BG_LOGO = 0;
  BS2_BG_NOTICE = 1;
  BS2_BG_SLIDE = 2;
  BS2_BG_PDF = 3;
}
```
{: #BackgroundType }

BS2_BG_LOGO
: 배경 이미지를 표시합니다. [UpdateBackgroundImage](#updatebackgroundimage)를 사용하여 배경 이미지를 변경할 수 있습니다.

BS2_BG_NOTICE
: 메시지를 표시합니다. [UpdateNotice](#updatenotice)를 사용하여 메시지를 변경할 수 있습니다;

BS2_BG_SLIDE
: 이미지 슬라이드를 표시합니다. [UpdateSlideImages](#updateslideimages)를 사용하여 슬라이드를 변경할 수 있습니다.


```protobuf
enum DateFormat {
  BS2_DATE_FORMAT_YYYYMMDD = 0;
  BS2_DATE_FORMAT_MMDDYYYY = 1;
  BS2_DATE_FORMAT_DDMMYYYY = 2;
}
```
{: #DateFormat }

```protobuf
enum TimeFormat {
  BS2_TIME_FORMAT_12_HOUR = 0;
  BS2_TIME_FORMAT_24_HOUR = 1;
}
```
{: #TimeFormat }

```protobuf
enum ShowOSDPResult {
  BS2_SHOW_OSDP_RESULT_ON = 0;
  BS2_SHOW_OSDP_RESULT_OFF = 1;
}
```
{: #ShowOSDPResult }

```protobuf
enum ShowOptionUserInfo {
  BS2_SHOW_USER_INFO_ALL = 0;
  BS2_SHOW_USER_INFO_PARTIAL = 1;
  BS2_SHOW_USER_INFO_NOTHING = 2;
}
```
{: #ShowOptionUserInfo }

```protobuf
enum KeypadType {
  BS2_KEYPAD_TYPE_SCRAMBLE = 0;
  BS2_KEYPAD_TYPE_NORMAL = 1;
}
```
{: #KeypadType }


### GetConfig

장치의 디스플레이 설정을 가져옵니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [DisplayConfig](#DisplayConfig) | 장치의 디스플레이 설정 |


### SetConfig

장치의 디스플레이 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [DisplayConfig](#DisplayConfig) | 장치에 기록할 디스플레이 설정 |

### SetConfigMulti

여러 장치의 디스플레이 설정을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [DisplayConfig](#DisplayConfig) | 장치들에 기록할 디스플레이 설정 |


## Language pack

UI에서 사용하는 언어 팩을 변경할 수 있습니다. 사용 가능한 언어 팩에 대해서는 [당사](https://www.supremainc.com/en/about/contact-us.asp)로 문의하십시오.

### UpdateLanguagePack

장치의 언어 팩을 업데이트합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| data | byte[] | 장치에 설치할 언어 팩 |

### UpdateLanguagePackMulti

여러 장치의 언어 팩을 업데이트합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| data | byte[] | 장치들에 설치할 언어 팩 |

## Notice

메인 UI에 표시되는 공지 메시지를 변경할 수 있습니다. 먼저 [DisplayConfig.background](#DisplayConfig)를 [BS2_BG_NOTICE](#BackgroundType)로 설정해야 합니다.

### UpdateNotice

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| notice | string | 표시할 메시지 |

### UpdateNoticeMulti

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| notice | string | 표시할 메시지 |

## Background image

메인 UI에 표시되는 배경 이미지를 변경할 수 있습니다. [DisplayConfig.background](#DisplayConfig)는 [BS2_BG_LOGO](#BackgroundType)로 설정되어야 합니다.

### UpdateBackgroundImage

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| PNGImage | byte[] | 표시할 PNG 이미지 데이터 |

### UpdateBackgroundImageMulti

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32 | 장치들의 ID |
| PNGImage | byte[] | 표시할 PNG 이미지 데이터 |

## Background slides

메인 UI에 표시되는 슬라이드를 변경할 수 있습니다. [DisplayConfig.background](#DisplayConfig)는 [BS2_BG_SLIDE](#BackgroundType)로 설정되어야 합니다.

### UpdateSlideImages

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| PNGImages | byte[][] | 표시할 PNG 이미지 데이터 배열 |

### UpdateSlideImagesMulti

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32 | 장치들의 ID |
| PNGImages | byte[][] | 표시할 PNG 이미지 데이터 배열 |

## Sound

지정한 경우에 대한 사운드 파일을 변경합니다.

```protobuf
enum SoundIndex {
  SOUND_INDEX_WELCOME = 0;
  SOUND_INDEX_AUTH_SUCCESS = 1;
  SOUND_INDEX_AUTH_FAIL = 2;
  SOUND_INDEX_ALARM_1 = 3;
  SOUND_INDEX_ALARM_2 = 4;
}
```
{: #SoundIndex }

### UpdateSound

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| index | [SoundIndex](#SoundIndex) | 파일을 업데이트할 사운드 인덱스 |
| waveData | byte[] | WAVE 파일 형식의 사운드 데이터 |

### UpdateSoundMulti

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32 | 장치들의 ID |
| index | [SoundIndex](#SoundIndex) | 파일을 업데이트할 사운드 인덱스 |
| waveData | byte[] | WAVE 파일 형식의 사운드 데이터 |

