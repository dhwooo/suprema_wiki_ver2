---
title: "Schedule API"
toc_label: "Schedule"  
---

## Schedule

스케줄은 출입 통제 및 인증 모드와 같은 기타 설정에 사용됩니다. [DailySchedule](#DailySchedule) 또는 [WeeklySchedule](#WeeklySchedule)을 설정할 수 있습니다. 

```protobuf
enum PredefinedSchedule {
  NEVER = 0;
  ALWAYS = 1;
}

message ScheduleInfo {
  uint32 ID;
  string name;
  oneof ordinary {
    DailySchedule daily;
    WeeklySchedule weekly;
  }
  repeated HolidaySchedule holidays;
}
```
{: #ScheduleInfo}

스케줄은 __DailySchedule__ 또는 __WeeklySchedule__ 중 하나입니다. 따라서 하나의 스케줄에 두 가지를 모두 설정해서는 안 됩니다.
{: .notice--warning}

ID
: 스케줄의 ID입니다.

0은 유효한 ID가 아닙니다. 그리고 1은 미리 정의된 'Always' 스케줄을 위해 예약되어 있습니다. 예를 들어 [DoorSchedule.scheduleID]({{'/api/access/' | relative_url}}#DoorSchedule)를 1로 설정하면 항상 해당 도어에 출입할 수 있음을 의미합니다. 
{: .notice--warning}

name
: UTF-8 인코딩으로 최대 48자입니다.

[daily](#DailySchedule)
: 

[weekly](#WeeklySchedule)
: 

[holidays](#HolidaySchedule)
: 최대 4개의 [HolidaySchedule](#HolidaySchedule)을 하나의 스케줄에 할당할 수 있습니다.

```protobuf
message DailySchedule {
  uint32 startDate; 
  repeated DaySchedule daySchedules;
}
```
{: #DailySchedule}

startDate
: 스케줄의 시작 날짜로 0에서 365 범위입니다. 1월 1일은 0입니다.

daySchedules
: 최대 90개의 [DaySchedule](#DaySchedule)을 __DailySchedule__에 할당할 수 있습니다.

```protobuf
message WeeklySchedule {
  repeated DaySchedule daySchedules;
}
```
{: #WeeklySchedule}

daySchedules
: __WeeklySchedule__에는 7개의 [DaySchedule](#DaySchedule)을 설정해야 합니다. 순서는 일요일, 월요일, ..., 토요일입니다.

```protobuf
message HolidaySchedule {
  uint32 groupID;
  DaySchedule daySchedule;
}
```
{: #HolidaySchedule}

groupID
: [HolidayGroup](#HolidayGroup)의 ID입니다.

daySchedule
: 휴일 그룹의 휴일에 적용될 [DaySchedule](#DaySchedule)입니다.

```protobuf
message DaySchedule {
  repeated TimePeriod periods;
}
```
{: #DaySchedule}

periods
: __DaySchedule__마다 최대 5개의 [TimePeriod](#TimePeriod)를 설정할 수 있습니다. 이 기간들은 서로 겹쳐서는 안 됩니다.

```protobuf
message TimePeriod {
  int32 startTime;
  int32 endTime;
}
```
{: #TimePeriod}

startTime/endTime
: 하루 중의 시간을 분 단위로 나타냅니다. 예를 들어 90은 오전 1시 30분을, 750은 오후 12시 30분을 의미합니다.


### GetList

장치에 저장된 스케줄을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| schedules | [ScheduleInfo[]](#ScheduleInfo) | 장치에 저장된 스케줄 |

### Add

장치에 스케줄을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| schedules | [ScheduleInfo[]](#ScheduleInfo) | 장치에 추가할 스케줄 |

### AddMulti

여러 장치에 스케줄을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| schedules | [ScheduleInfo[]](#ScheduleInfo) | 장치들에 추가할 스케줄 |

### Delete

장치에서 스케줄을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| scheduleIDs | uint32[] | 장치에서 삭제할 스케줄의 ID |

### DeleteMulti

여러 장치에서 스케줄을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| scheduleIDs | uint32[] | 장치들에서 삭제할 스케줄의 ID |

### DeleteAll

장치에서 모든 스케줄을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllMulti

여러 장치에서 모든 스케줄을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |

## Holiday 

스케줄에서 휴일을 식별하는 데 사용될 [HolidayGroup](#HolidayGroup)을 설정할 수 있습니다.

```protobuf
message HolidayGroup {
  uint32 ID;
  string name;
  repeated Holiday holidays;
}
```
{: #HolidayGroup}

ID
: 휴일 그룹의 ID입니다.

name
: UTF-8 인코딩으로 최대 48자입니다.

[holidays](#Holiday)
: 최대 128개의 [Holiday](#Holiday)를 하나의 휴일 그룹에 할당할 수 있습니다.

```protobuf
message Holiday {
  uint32 date;
  HolidayRecurrence recurrence;
}
```
{: #Holiday}

date
: 해당 연도 내의 날짜로 0에서 365 범위입니다. 1월 1일은 0입니다.

[recurrence](#HolidayRecurrence)
: 이 휴일이 반복되는 휴일인지 여부를 나타냅니다.

```protobuf
enum HolidayRecurrence {
  DO_NOT_RECUR = 0;
  RECUR_YEARLY = 1;
  RECUR_MONTHLY = 2;
  RECUR_WEEKLY = 3;
}
```
{: #HolidayRecurrence}

### GetHolidayList

장치에 저장된 휴일 그룹을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| groups | [HolidayGroup[]](#HolidayGroup) | 장치에 저장된 휴일 그룹 |

### AddHoliday

장치에 휴일 그룹을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| groups | [HolidayGroup[]](#HolidayGroup) | 장치에 추가할 휴일 그룹  |

### AddHolidayMulti

여러 장치에 휴일 그룹을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| groups | [HolidayGroup[]](#HolidayGroup) | 장치들에 추가할 휴일 그룹 |


### DeleteHoliday

장치에서 휴일 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |
| groupIDs | uint32[] | 장치에서 삭제할 휴일 그룹의 ID |

### DeleteHolidayMulti

여러 장치에서 휴일 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
| groupIDs | uint32[] | 장치들에서 삭제할 휴일 그룹의 ID |

### DeleteAllHoliday

장치에서 모든 휴일 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 장치의 ID |

### DeleteAllHolidayMulti

여러 장치에서 모든 휴일 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 장치들의 ID |
