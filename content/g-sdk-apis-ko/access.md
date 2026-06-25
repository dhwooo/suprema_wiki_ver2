---
title: "Access Group API"
toc_label: "Access Group"  
---

## Access group

액세스 그룹은 액세스 레벨로 구성되며, 액세스 레벨은 특정 스케줄에 대해 출입 가능한 도어를 지정합니다. 각 사용자는 최대 16개의 액세스 그룹에 속할 수 있습니다. 사용자에게 액세스 그룹을 할당하려면 다음 작업을 수행해야 합니다.

1. [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)을 생성합니다.
2. [도어]({{'/api/door/' | relative_url}}#DoorInfo)를 생성합니다.
3. 스케줄과 도어를 사용하여 [액세스 레벨](#access-level)을 생성합니다.
4. 액세스 레벨을 사용하여 [액세스 그룹](#access-group)을 생성합니다.
5. [User.SetAccessGroup]({{'/api/user/' | relative_url}}#setaccessgroup) 또는 [User.SetAccessGroupMulti]({{'/api/user/' | relative_url}}#setaccessgroupmulti)를 사용하여 사용자에게 액세스 그룹을 할당합니다.

도어 외에도, 액세스 그룹을 사용하여 리프트의 특정 층에 대한 출입을 제한할 수 있습니다. 이 경우, 특정 스케줄에 대해 출입 가능한 층을 지정하는 플로어 레벨을 정의해야 합니다.

```protobuf
message AccessGroup {
  uint32 ID;
  string name;
  repeated uint32 levelIDs;
}
```
{: #AccessGroup }
ID
: 액세스 그룹의 ID입니다.

0은 내부적으로 예약되어 있으므로 ID로 할당할 수 없습니다.
{: .notice--warning}

name
: UTF-8 인코딩 기준 최대 48자입니다.

levelIDs
: 액세스 레벨 또는 플로어 레벨의 ID입니다. 액세스 레벨의 ID는 32768보다 작아야 하며, 플로어 레벨의 ID는 32768 이상이어야 합니다. 각 액세스 그룹은 최대 128개의 레벨을 가질 수 있습니다.

### GetList
디바이스에 저장된 액세스 그룹을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| groups | [AccessGroup[]](#AccessGroup) | 디바이스에 저장된 액세스 그룹 |

### Add
디바이스에 액세스 그룹을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| groups | [AccessGroup[]](#AccessGroup) | 디바이스에 추가할 액세스 그룹 |

### AddMulti
여러 디바이스에 액세스 그룹을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| groups | [AccessGroup[]](#AccessGroup) | 디바이스에 추가할 액세스 그룹 |

### Delete
디바이스에서 액세스 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| groupIDs | uint32[] | 디바이스에서 삭제할 그룹의 ID |

### DeleteMulti

여러 디바이스에서 액세스 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| groupIDs | uint32[] | 디바이스에서 삭제할 그룹의 ID |

### DeleteAll

디바이스에서 모든 액세스 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### DeleteAllMulti

여러 디바이스에서 모든 액세스 그룹을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |

## Access level

액세스 레벨은 특정 스케줄에 대해 어떤 도어가 출입 가능한지를 지정합니다. 

```protobuf
message AccessLevel {
  uint32 ID;
  string name;
  repeated DoorSchedule doorSchedules;
}
```
{: #AccessLevel }

ID
: 액세스 레벨의 ID입니다. 32768보다 작아야 합니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

[doorSchedules](#DoorSchedule)
: 도어 스케줄은 도어가 언제 출입 가능한지를 지정합니다. 하나의 액세스 레벨은 최대 128개의 도어 스케줄을 가질 수 있습니다.

```protobuf
message DoorSchedule {
  uint32 doorID;
  uint32 scheduleID;
}
```
{: #DoorSchedule }

doorID
: [도어]({{'/api/door/' | relative_url}}#DoorInfo)의 ID입니다.

scheduleID
: [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다.


### GetLevelList

디바이스에 저장된 액세스 레벨을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| levels | [AccessLevel[]](#AccessLevel) | 디바이스에 저장된 액세스 레벨  |

### AddLevel

디바이스에 액세스 레벨을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| levels | [AccessLevel[]](#AccessLevel) | 디바이스에 추가할 액세스 레벨 |

### AddLevelMulti

여러 디바이스에 액세스 레벨을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| levels | [AccessLevel[]](#AccessLevel) | 디바이스에 추가할 액세스 레벨 |

### DeleteLevel

디바이스에서 액세스 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| levelIDs | uint32[] | 디바이스에서 삭제할 레벨의 ID |

### DeleteLevelMulti

여러 디바이스에서 액세스 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| levelIDs | uint32[] | 디바이스에서 삭제할 레벨의 ID |

### DeleteAllLevel

디바이스에서 모든 액세스 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### DeleteAllLevelMulti

여러 디바이스에서 모든 액세스 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |


## Floor level

플로어 레벨은 특정 스케줄에 대해 어떤 층이 출입 가능한지를 지정합니다. 

```protobuf
message FloorLevel {
  uint32 ID;
  string name;
  repeated FloorSchedule floorSchedules;
}
```
{: #FloorLevel }

ID
: 플로어 레벨의 ID입니다. 32768 이상이어야 합니다.

name
: UTF-8 인코딩 기준 최대 48자입니다.

[floorSchedules](#FloorSchedule)
: 플로어 스케줄은 리프트의 층이 언제 출입 가능한지를 지정합니다. 하나의 플로어 레벨은 최대 128개의 플로어 스케줄을 가질 수 있습니다.

```protobuf
message FloorSchedule {
  uint32 liftID;
  uint32 floorIndex;
  uint32 scheduleID;
}
```
{: #FloorSchedule }

liftID
: [리프트]({{'/api/lift/' | relative_url}}#LiftInfo)의 ID입니다.

floorIndex
: 리프트 내 층의 인덱스입니다.

scheduleID
: [스케줄]({{'/api/schedule/' | relative_url}}#ScheduleInfo)의 ID입니다.


### GetFloorLevelList

디바이스에 저장된 플로어 레벨을 가져옵니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

| Response |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| levels | [FloorLevel[]](#FloorLevel) | 디바이스에 저장된 플로어 레벨  |

### AddFloorLevel

디바이스에 플로어 레벨을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| levels | [FloorLevel[]](#FloorLevel) | 디바이스에 추가할 플로어 레벨 |

### AddFloorLevelMulti

여러 디바이스에 플로어 레벨을 추가합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| levels | [FloorLevel[]](#FloorLevel) | 디바이스에 추가할 플로어 레벨 |

### DeleteFloorLevel

디바이스에서 플로어 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |
| levelIDs | uint32[] | 디바이스에서 삭제할 레벨의 ID |

### DeleteFloorLevelMulti

여러 디바이스에서 플로어 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
| levelIDs | uint32[] | 디바이스에서 삭제할 레벨의 ID |

### DeleteAllFloorLevel

디바이스에서 모든 플로어 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceID | uint32 | 디바이스의 ID |

### DeleteAllFloorLevelMulti

여러 디바이스에서 모든 플로어 레벨을 삭제합니다.

| Request |

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| deviceIDs | uint32[] | 디바이스의 ID |
