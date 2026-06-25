---
title: "Schedule API Tutorial"
toc: true
toc_label: "Table of Contents"
---

## 예제 실행

1. [게이트웨이를 설치하고 실행합니다]({{'/gateway/install/' | relative_url}})
2. [Python 클라이언트 라이브러리를 다운로드합니다]({{'/python/install/' | relative_url}})
3. 게이트웨이의 루트 인증서를 작업 디렉터리로 복사합니다. 기본적으로 인증서(_ca.crt_)는 설치 디렉터리의 _cert_ 안에 있습니다.
4. 필요에 따라 _example/schedule/test/test.py_ 의 서버와 장치 정보를 변경합니다.
   
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
    cd example/schedule/test
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

## 2. 주간 스케줄 만들기

주간 스케줄을 만들려면 7개의 [DaySchedules]({{'/api/schedule' | relative_url}}#DaySchedule)을 구성해야 합니다.

  ```python
  weekdaySchedule = schedule_pb2.DaySchedule()
  weekdaySchedule.periods.append(schedule_pb2.TimePeriod(startTime=540, endTime=720)) # 9 am ~ 12 pm
  weekdaySchedule.periods.append(schedule_pb2.TimePeriod(startTime=780, endTime=1080)) # 1 pm ~ 6 pm

  weekendSchedule = schedule_pb2.DaySchedule()
  weekendSchedule.periods.append(schedule_pb2.TimePeriod(startTime=570, endTime=770)) # 9:30 am ~ 12:30 pm

  weeklySchedule = schedule_pb2.WeeklySchedule()
  weeklySchedule.daySchedules.append(weekendSchedule) # Sunday
  weeklySchedule.daySchedules.append(weekdaySchedule) # Monday
  weeklySchedule.daySchedules.append(weekdaySchedule) # Tuessay
  weeklySchedule.daySchedules.append(weekdaySchedule) # Wednesday
  weeklySchedule.daySchedules.append(weekdaySchedule) # Thursday
  weeklySchedule.daySchedules.append(weekdaySchedule) # Friday
  weeklySchedule.daySchedules.append(weekendSchedule) # Saturday

  scheduleInfo = schedule_pb2.ScheduleInfo(ID=WEEKLY_SCHEDULE_ID, name='Sample Weekly Schedule', weekly=weeklySchedule, holidays=[holidaySchedule])

  self.scheduleSvc.add(deviceID, [scheduleInfo])
  ``` 

## 3. 일간 스케줄 만들기

최대 90개의 [DaySchedules]({{'/api/schedule' | relative_url}}#DaySchedule)로 구성된 일간 스케줄도 구성할 수 있습니다.

  ```python
  daySchedule = schedule_pb2.DaySchedule()
  daySchedule.periods.append(schedule_pb2.TimePeriod(startTime=540, endTime=720)) # 9 am ~ 12 pm
  daySchedule.periods.append(schedule_pb2.TimePeriod(startTime=780, endTime=1080)) # 1 pm ~ 6 pm

  dailySchedule = schedule_pb2.DailySchedule(startDate=int(datetime.now().strftime('%j')) - 1) # 30 days starting from today
  for i in range(NUM_OF_DAY):
    dailySchedule.daySchedules.append(daySchedule)

  scheduleInfo = schedule_pb2.ScheduleInfo(ID=DAILY_SCHEDULE_ID, name='Sample Daily Schedule', daily=dailySchedule)

  self.scheduleSvc.add(deviceID, [scheduleInfo])
  ```