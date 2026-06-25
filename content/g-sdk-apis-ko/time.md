---
title: "Time API"
toc_label: "Time"  
---

## Time

### Get

장치의 시간을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| GMTTime | uint64 | Unix 형식의 GMT 시간 |

### Set

장치의 시간을 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| GMTTime | uint64 | Unix 형식으로 설정할 GMT 시간 |


### SetMulti

여러 장치의 시간을 설정합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| GMTTime | uint64 | Unix 형식으로 설정할 GMT 시간 |

## Config

```protobuf
message TimeConfig {
  int32 timeZone;
  bool syncWithServer;
}
```
{: #TimeConfig}

timeZone
: 초 단위의 시간대입니다. 예를 들어 시간대가 GMT-5이면 -18,000이어야 합니다. 

syncWithServer
: true이면 장치의 시간을 장치 게이트웨이와 동기화하려고 시도합니다. 

### GetConfig

장치의 시간 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [TimeConfig](#TimeConfig) | 장치의 시간 구성 |


### SetConfig

장치의 시간 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [TimeConfig](#TimeConfig) | 장치에 기록할 시간 구성 |


### SetConfigMulti

장치들의 시간 구성을 변경합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [TimeConfig](#TimeConfig) | 장치들에 기록할 시간 구성 |

## Daylight Saving Time

먼저 CapabilityInfo.DSTSupported를 확인하세요.
{: .notice--warning}

```protobuf
message DSTConfig {
  repeated DSTSchedule schedules;
}
```
{: #DSTConfig}

[schedules](#DSTSchedule)
: 펌웨어 문제로 인해 하나의 스케줄만 정의할 수 있습니다. 

```protobuf
message DSTSchedule {
  WeekTime startTime;
  WeekTime endTime;
  int32 timeOffset;
}
```
{: #DSTSchedule}

[startTime](#WeekTime)
: DST가 시작되는 시간입니다.

[endTime](#WeekTime)
: DST가 끝나는 시간입니다.

timeOffset
: 초 단위의 DST 시간입니다. 예를 들어 1시간이면 3,600이어야 합니다.

```protobuf
message WeekTime {
  uint32 year = 1;
  Month month = 2;
  Ordinal ordinal = 3;
  Weekday weekday = 4;
  uint32 hour = 5;
  uint32 minute = 6;
  uint32 second = 7;
}
```
{: #WeekTime}

year
: 0으로 설정하면 [DSTConfig](#DSTConfig)가 매년 적용됩니다.

[month](#Month)
: 

[ordinal](#Ordinal)
: 해당 요일의 순번입니다. 예를 들어 (MONTH_MARCH, ORDINAL_SECOND, WEEKDAY_MONDAY)는 3월의 두 번째 월요일을 의미합니다. 

```protobuf
enum Month {
  MONTH_JANUARY = 0;
  MONTH_FEBRUARY = 1;
  MONTH_MARCH = 2;
  MONTH_APRIL = 3;
  MONTH_MAY = 4;
  MONTH_JUNE = 5;
  MONTH_JULY = 6;
  MONTH_AUGUST = 7;
  MONTH_SEPTEMBER = 8;
  MONTH_OCTOBER = 9;
  MONTH_NOVEMBER = 10;
  MONTH_DECEMBER = 11;
}
```
{: #Month}

```protobuf
enum Ordinal {
  ORDINAL_FIRST = 0;
  ORDINAL_SECOND = 1;
  ORDINAL_THIRD = 2;
  ORDINAL_FOURTH = 3;
  ORDINAL_FIFTH = 4;
  ORDINAL_SIXTH = 5;
  ORDINAL_SEVENTH = 6;
  ORDINAL_EIGHTH = 7;
  ORDINAL_NINTH = 8;
  ORDINAL_TENTH = 9;

  ORDINAL_LAST = -1;
}
```
{: #Ordinal}

```protobuf
enum Weekday {
  WEEKDAY_SUNDAY = 0;
  WEEKDAY_MONDAY = 1;
  WEEKDAY_TUESDAY = 2;
  WEEKDAY_WEDNESDAY = 3;
  WEEKDAY_THURSDAY = 4;
  WEEKDAY_FRIDAY = 5;
  WEEKDAY_SATURDAY = 6;
}
```
{: #Weekday}

### GetDSTConfig

장치의 DST 구성을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| config | [DSTConfig](#DSTConfig) | 장치의 DST 구성 |

### SetDSTConfig

장치의 DST 구성을 변경합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| config | [DSTConfig](#DSTConfig) | 장치에 기록할 DST 구성 |


### SetDSTConfigMulti

여러 장치의 DST 구성을 변경합니다. 

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| config | [DSTConfig](#DSTConfig) | 장치들에 기록할 DST 구성 |
