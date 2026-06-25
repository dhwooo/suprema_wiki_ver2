import type { Accent } from "@/lib/docs";

export type ApiGroup = {
  slug: string;
  title: string;
  description: string;
  items: ApiItem[];
};

export type ApiMethodGroup = {
  title: string;
  description: string;
  methods: string[];
};

export type ApiItem = {
  slug: string;
  name: string;
  summary: string;
  group: string;
  gateway?: "Device Gateway" | "Master Gateway" | "Both" | "Concept";
  methodGroups?: ApiMethodGroup[];
};

export type ApiFunctionGroup = {
  slug: string;
  title: string;
  summary: string;
  whenToUse: string;
  flow: string[];
  primaryApis: string[];
  relatedApis: string[];
};

export const apiGroups: ApiGroup[] = [
  {
    slug: "overview",
    title: "Overview",
    description: "gRPC, Gateway 차이, API 정의 방식, Multi command 같은 공통 개념입니다.",
    items: [
      { slug: "grpc", name: "gRPC", summary: "G-SDK API가 gRPC와 Protocol Buffers로 정의되는 방식입니다.", group: "Overview" },
      { slug: "gateway-model", name: "Device gateway vs. master gateway", summary: "Device Gateway와 Master Gateway에서 사용할 수 있는 API 차이를 비교합니다.", group: "Overview" },
      { slug: "api-definition", name: "API definition", summary: "요청/응답 메시지와 서비스 정의를 읽는 기본 규칙입니다.", group: "Overview" },
      { slug: "multi-command", name: "XXX_Multi command", summary: "여러 장치에 병렬로 같은 명령을 실행하는 Multi command 패턴입니다.", group: "Overview" },
    ],
  },
  {
    slug: "core",
    title: "Core APIs",
    description: "장치 연결, 장치 정보, 이벤트, 네트워크, 사용자 관리를 담당하는 핵심 API입니다.",
    items: [
      { slug: "connect", name: "Connect", summary: "Device Gateway와 장치 간 연결을 관리합니다.", group: "Core APIs" },
      { slug: "connect-master", name: "ConnectMaster", summary: "Master Gateway가 Device Gateway를 통해 장치를 관리하는 연결 API입니다.", group: "Core APIs" },
      { slug: "device", name: "Device", summary: "장치 펌웨어, 기능 정보, 잠금, 초기화, 업그레이드를 다룹니다.", group: "Core APIs" },
      { slug: "event", name: "Event", summary: "장치 이벤트 로그를 읽고 실시간 이벤트 모니터링을 활성화합니다.", group: "Core APIs" },
      { slug: "network", name: "Network", summary: "장치 IP 주소와 네트워크 설정을 구성합니다.", group: "Core APIs" },
      { slug: "user", name: "User", summary: "사용자 등록, 카드, 지문, 출입 그룹 설정을 관리합니다.", group: "Core APIs" },
    ],
  },
  {
    slug: "master-gateway",
    title: "Master gateway APIs",
    description: "다수의 Device Gateway와 tenant를 중앙에서 관리하는 API입니다.",
    items: [
      { slug: "gateway", name: "Gateway", summary: "Master Gateway에서 Device Gateway를 관리합니다.", group: "Master gateway APIs" },
      { slug: "login", name: "Login", summary: "관리자 또는 tenant로 Master Gateway에 로그인합니다.", group: "Master gateway APIs" },
      { slug: "master-admin", name: "MasterAdmin", summary: "장치의 Master Admin 설정과 관리자 인증 정보를 관리합니다.", group: "Master gateway APIs" },
      { slug: "tenant", name: "Tenant", summary: "Master Gateway tenant를 관리합니다.", group: "Master gateway APIs" },
    ],
  },
  {
    slug: "authentication",
    title: "Authentication APIs",
    description: "카드, 지문, 얼굴, 서버 매칭 등 인증 수단과 옵션을 설정합니다.",
    items: [
      { slug: "auth", name: "Auth", summary: "카드와 지문 등 credential 관련 인증 옵션을 설정합니다.", group: "Authentication APIs" },
      { slug: "card", name: "Card", summary: "카드 읽기/쓰기 및 카드 인증 옵션을 구성합니다.", group: "Authentication APIs" },
      { slug: "finger", name: "Finger", summary: "지문 스캔과 지문 인증 옵션을 다룹니다.", group: "Authentication APIs" },
      { slug: "face", name: "Face", summary: "얼굴 템플릿 스캔과 얼굴 인증 옵션을 다룹니다.", group: "Authentication APIs" },
      { slug: "server", name: "Server", summary: "서버 매칭을 구현합니다.", group: "Authentication APIs" },
    ],
  },
  {
    slug: "access-control",
    title: "Access control APIs",
    description: "문, 엘리베이터, 스케줄, 출입 레벨과 출입 그룹을 구성합니다.",
    items: [
      { slug: "access", name: "Access", summary: "출입 레벨과 출입 그룹을 구성합니다.", group: "Access control APIs" },
      { slug: "door", name: "Door", summary: "문을 구성하고 관리합니다.", group: "Access control APIs" },
      { slug: "lift", name: "Lift", summary: "엘리베이터를 구성하고 관리합니다.", group: "Access control APIs" },
      { slug: "schedule", name: "Schedule", summary: "출입통제와 설정에서 사용할 스케줄을 생성합니다.", group: "Access control APIs" },
    ],
  },
  {
    slug: "time-attendance",
    title: "T&A APIs",
    description: "근태 옵션과 job code가 포함된 이벤트 로그를 다룹니다.",
    items: [
      { slug: "ta", name: "T&A", summary: "Time & Attendance 옵션과 관련 이벤트 로그를 관리합니다.", group: "T&A APIs" },
    ],
  },
  {
    slug: "configuration",
    title: "Configuration APIs",
    description: "장치 표시, RS485, 상태, 시간, Wiegand, 입력 등 장치 구성을 다룹니다.",
    items: [
      { slug: "action", name: "Action", summary: "특정 trigger 발생 시 실행할 action을 구성합니다.", group: "Configuration APIs" },
      { slug: "display", name: "Display", summary: "장치 UI와 언어팩 업그레이드를 구성합니다.", group: "Configuration APIs" },
      { slug: "rs485", name: "RS485", summary: "RS485 통신 파라미터와 slave 장치를 관리합니다.", group: "Configuration APIs" },
      { slug: "status", name: "Status", summary: "상태별 LED와 buzzer를 구성합니다.", group: "Configuration APIs" },
      { slug: "system", name: "System", summary: "장치의 기타 옵션과 잠금 상태를 확인합니다.", group: "Configuration APIs" },
      { slug: "thermal", name: "Thermal", summary: "열화상 카메라 관련 옵션을 설정합니다.", group: "Configuration APIs" },
      { slug: "time", name: "Time", summary: "DST와 시간 동기화, 장치 시각 설정을 구성합니다.", group: "Configuration APIs" },
      { slug: "rtsp", name: "RTSP", summary: "RTSP 관련 옵션을 구성합니다.", group: "Configuration APIs" },
      { slug: "voip", name: "VoIP", summary: "VoIP 관련 옵션을 구성합니다.", group: "Configuration APIs" },
      { slug: "wiegand", name: "Wiegand", summary: "카드 데이터 해석과 외부 리더 연동용 Wiegand format을 구성합니다.", group: "Configuration APIs" },
      { slug: "input", name: "Input", summary: "장치 입력을 구성합니다.", group: "Configuration APIs" },
      { slug: "operator", name: "Operator", summary: "장치 관리자와 운영자 권한을 사용자 기준으로 관리합니다.", group: "Configuration APIs" },
    ],
  },
  {
    slug: "zone",
    title: "Zone APIs",
    description: "Anti-passback, intrusion alarm, fire alarm, interlock 등 고급 zone 기능입니다.",
    items: [
      { slug: "anti-passback-zone", name: "Anti passback zone", summary: "Anti-passback zone을 구성합니다.", group: "Zone APIs" },
      { slug: "timed-anti-passback-zone", name: "Timed anti passback zone", summary: "시간 조건이 있는 anti-passback zone을 구성합니다.", group: "Zone APIs" },
      { slug: "intrusion-alarm-zone", name: "Intrusion alarm zone", summary: "침입 알람 zone을 구성합니다.", group: "Zone APIs" },
      { slug: "fire-alarm-zone", name: "Fire alarm zone", summary: "화재 알람 zone을 구성합니다.", group: "Zone APIs" },
      { slug: "scheduled-lock-zone", name: "Scheduled lock zone", summary: "스케줄 기반 잠금 zone을 구성합니다.", group: "Zone APIs" },
      { slug: "interlock-zone", name: "Interlock zone", summary: "Interlock zone을 구성합니다.", group: "Zone APIs" },
      { slug: "lift-zone", name: "Lift zone", summary: "엘리베이터 zone을 구성합니다.", group: "Zone APIs" },
    ],
  },
  {
    slug: "misc",
    title: "Misc. APIs",
    description: "UDP, Admin, Err 등 보조 API와 오류 정의입니다.",
    items: [
      { slug: "udp", name: "UDP", summary: "Device Gateway와 장치 간 UDP 통신을 관리합니다.", group: "Misc. APIs" },
      { slug: "udp-master", name: "UDPMaster", summary: "Master Gateway가 Device Gateway를 통해 UDP 통신을 관리합니다.", group: "Misc. APIs" },
      { slug: "admin", name: "Admin", summary: "G-SDK 버전을 조회합니다.", group: "Misc. APIs" },
      { slug: "device-license", name: "DeviceLicense", summary: "장치 기능 라이선스 설정과 활성화 상태를 관리합니다.", group: "Misc. APIs" },
      { slug: "err", name: "Err", summary: "Multi command 등에서 사용하는 오류 정의입니다.", group: "Misc. APIs" },
    ],
  },
];

export const apiItems = apiGroups.flatMap((group) => group.items.map((item) => ({ ...item, group: group.title })));

export type ApiCollectionIcon =
  | "network"
  | "device"
  | "identity"
  | "access"
  | "events"
  | "zones"
  | "config"
  | "server";

export type ApiCollection = {
  slug: string;
  title: string;
  description: string;
  icon: ApiCollectionIcon;
  accent: Accent;
  apis: string[]; // 이 Collection에 속한 API slug 목록(작업 흐름 순서)
};

// 8개 시나리오 기반 Collections — /api 상단 카드, 좌측 메뉴, 하단 색인을 모두 구동합니다.
export const apiCollections: ApiCollection[] = [
  {
    slug: "connectivity",
    title: "연결 & Gateway",
    description: "장치를 찾아 연결하고 Gateway·tenant로 운영합니다.",
    icon: "network",
    accent: "cyan",
    apis: ["connect", "connect-master", "gateway", "login", "tenant"],
  },
  {
    slug: "device",
    title: "장치 관리 & 펌웨어",
    description: "장치 정보, 펌웨어, 네트워크, 시간을 관리합니다.",
    icon: "device",
    accent: "blue",
    apis: ["device", "device-license", "network", "time"],
  },
  {
    slug: "identity",
    title: "사용자 & 인증수단",
    description: "사용자와 카드·지문·얼굴 인증수단을 등록합니다.",
    icon: "identity",
    accent: "cyan",
    apis: ["user", "card", "finger", "face", "auth"],
  },
  {
    slug: "access",
    title: "출입 제어",
    description: "문, 엘리베이터, 스케줄로 출입 정책을 구성합니다.",
    icon: "access",
    accent: "violet",
    apis: ["access", "door", "lift", "schedule"],
  },
  {
    slug: "events",
    title: "이벤트 · 모니터링 · 근태",
    description: "이벤트 로그, 실시간 모니터링, 근태를 수집합니다.",
    icon: "events",
    accent: "blue",
    apis: ["event", "ta", "thermal"],
  },
  {
    slug: "zones",
    title: "Zone 자동화",
    description: "anti-passback, 화재·침입 등 zone 규칙을 설정합니다.",
    icon: "zones",
    accent: "violet",
    apis: [
      "anti-passback-zone",
      "timed-anti-passback-zone",
      "intrusion-alarm-zone",
      "fire-alarm-zone",
      "scheduled-lock-zone",
      "interlock-zone",
      "lift-zone",
    ],
  },
  {
    slug: "config",
    title: "장치 설정 & 인터페이스",
    description: "디스플레이, RS485, Wiegand 등 장치 환경을 설정합니다.",
    icon: "config",
    accent: "blue",
    apis: ["display", "rs485", "wiegand", "input", "status", "system", "rtsp", "voip", "action"],
  },
  {
    slug: "server",
    title: "서버 연동 & 저수준",
    description: "서버 매칭과 운영자·저수준 통신을 연동합니다.",
    icon: "server",
    accent: "burgundy",
    apis: ["server", "operator", "udp", "udp-master", "admin", "err"],
  },
];

// gRPC, Gateway 모델 등 모든 API의 공통 기초 개념(8개 Collection에 속하지 않음)
export const apiBasics = ["grpc", "gateway-model", "api-definition", "multi-command"];

export function getCollectionApis(collection: ApiCollection) {
  return collection.apis.map((slug) => getApiItem(slug)).filter((item): item is ApiItem => Boolean(item));
}

export const apiFunctionGroups: ApiFunctionGroup[] = [
  {
    slug: "device-connectivity",
    title: "장치 연결과 Gateway 운영",
    summary: "Device Gateway 또는 Master Gateway를 통해 장치를 찾고, 연결하고, 연결 상태를 지속적으로 추적합니다.",
    whenToUse: "신규 장치 등록, 대량 장치 연결, 서버로 들어오는 장치 접속 허용, TLS 전환, Gateway 다중화 설계에 먼저 확인합니다.",
    flow: ["Connect 또는 Login으로 Gateway context 확보", "SearchDevice로 장치 탐색", "Connect/AddAsyncConnection 또는 ConnectMaster로 연결", "GetDeviceList/SubscribeStatus로 상태 추적", "필요 시 EnableSSL과 SetConnectionMode 적용"],
    primaryApis: ["connect", "connect-master", "gateway", "login", "tenant"],
    relatedApis: ["network", "udp", "udp-master", "admin"],
  },
  {
    slug: "device-lifecycle",
    title: "장치 생명주기와 펌웨어 관리",
    summary: "장치 정보, capability, 잠금, 재부팅, 초기화, 펌웨어 업그레이드처럼 운영 권한이 큰 작업을 모읍니다.",
    whenToUse: "장치 재고 수집, 모델별 기능 분기, 유지보수 창의 펌웨어 업그레이드, 장애 대응용 재부팅/초기화 runbook을 만들 때 사용합니다.",
    flow: ["Device.GetInfo로 모델과 firmware 확인", "GetCapability로 지원 기능 판별", "Lock/Unlock으로 유지보수 상태 제어", "UpgradeFirmwareMulti로 배치 업그레이드", "FactoryReset/ClearDB는 승인 절차 후 실행"],
    primaryApis: ["device", "device-license", "admin"],
    relatedApis: ["system", "network", "time", "event"],
  },
  {
    slug: "identity-credentials",
    title: "사용자와 인증 수단 관리",
    summary: "사용자 레코드, 카드, 지문, 얼굴 템플릿, PIN, credential 정책을 한 흐름으로 정리합니다.",
    whenToUse: "HR/멤버 시스템과 사용자 동기화, 카드 발급, 생체정보 등록, 사용자별 출입 권한 배포를 구현할 때 중심이 됩니다.",
    flow: ["User.GetList/GetPartial로 현황 조회", "Card/Finger/Face로 credential 수집", "User.Enroll 또는 Update로 사용자 저장", "SetAccessGroup으로 권한 연결", "EnrollMulti/UpdateMulti로 여러 장치에 병렬 배포"],
    primaryApis: ["user", "card", "finger", "face", "auth"],
    relatedApis: ["access", "server", "operator"],
  },
  {
    slug: "access-policy",
    title: "출입 정책과 물리 보안",
    summary: "누가, 언제, 어떤 문/층에 접근할 수 있는지 정의하는 Access, Door, Lift, Schedule 계열입니다.",
    whenToUse: "출입 레벨, 출입 그룹, 문 릴레이, 엘리베이터 층 권한, 휴일/스케줄 기반 정책을 구성할 때 사용합니다.",
    flow: ["Schedule/Holiday로 시간 조건 생성", "Door/Lift로 물리 리소스 구성", "Access level과 group으로 정책 구성", "User.SetAccessGroup으로 사용자 연결", "Event 로그로 정책 적용 결과 확인"],
    primaryApis: ["access", "door", "lift", "schedule"],
    relatedApis: ["user", "event", "ta"],
  },
  {
    slug: "events-attendance",
    title: "이벤트, 모니터링, 근태",
    summary: "장치 이벤트 로그, 실시간 로그 구독, 이미지 로그, T&A/job code 정보를 수집합니다.",
    whenToUse: "출입 이력 저장, 실시간 알림, 감사 로그, 근태 집계, 이상 이벤트 파이프라인을 만들 때 사용합니다.",
    flow: ["Event.GetLog로 기간별 로그 적재", "SubscribeRealtimeLog로 실시간 이벤트 수신", "GetImageLog로 이미지 로그 연결", "T&A 설정으로 근태 의미 부여", "Event schema를 내부 감사 로그 모델로 정규화"],
    primaryApis: ["event", "ta", "thermal"],
    relatedApis: ["user", "door", "access", "server"],
  },
  {
    slug: "device-configuration",
    title: "장치 설정과 인터페이스",
    summary: "네트워크, 시간, 표시 UI, 입력, RS485, Wiegand, RTSP, VoIP 등 장치 환경 설정을 모읍니다.",
    whenToUse: "장치 설치 초기 설정, 현장별 네트워크 정책, 외부 리더/컨트롤러 연동, 화면/사운드/언어팩 배포 때 확인합니다.",
    flow: ["Network/Time으로 기본 환경 설정", "Display/Status로 장치 UI와 LED/buzzer 구성", "RS485/Wiegand/Input으로 외부 장치 연결", "RTSP/VoIP로 영상/통화 옵션 설정", "SetConfigMulti로 여러 장치에 일괄 반영"],
    primaryApis: ["network", "time", "display", "rs485", "wiegand", "input"],
    relatedApis: ["status", "system", "rtsp", "voip", "action"],
  },
  {
    slug: "advanced-zones",
    title: "고급 Zone 자동화",
    summary: "Anti-passback, intrusion alarm, fire alarm, scheduled lock, interlock, lift zone 같은 현장 규칙을 구성합니다.",
    whenToUse: "여러 장치와 센서를 묶어 고급 보안 규칙을 만들거나, 로컬 RS485 네트워크 안에서 zone 기반 자동화를 구성할 때 사용합니다.",
    flow: ["zone이 묶을 장치와 문/센서 확인", "필요한 zone 타입 선택", "Door/Schedule과 연동 조건 구성", "Event로 zone 이벤트 모니터링", "운영 변경 시 zone 설정과 장치 배치를 함께 검토"],
    primaryApis: ["anti-passback-zone", "timed-anti-passback-zone", "intrusion-alarm-zone", "fire-alarm-zone", "interlock-zone", "lift-zone"],
    relatedApis: ["door", "schedule", "event", "rs485"],
  },
  {
    slug: "server-integration",
    title: "서버 매칭과 외부 시스템 연동",
    summary: "장치 인증 요청을 서버에서 처리하거나 외부 시스템의 권한/알림/운영 흐름과 연결합니다.",
    whenToUse: "중앙 인증 서버, 외부 보안 시스템, 운영자 권한 모델, custom action, UDP 기반 저수준 통신이 필요할 때 확인합니다.",
    flow: ["Server.Subscribe로 장치 요청 수신", "HandleVerify/HandleIdentify로 인증 결정", "Operator로 장치 관리 권한 모델 구성", "Action으로 이벤트 기반 동작 설정", "UDP/UDPMaster는 특수 통신 요구에 제한적으로 사용"],
    primaryApis: ["server", "operator", "action", "udp", "udp-master"],
    relatedApis: ["auth", "user", "event", "login"],
  },
];

export function getApiFunctionGroups(slug: string) {
  return apiFunctionGroups.filter((group) => group.primaryApis.includes(slug) || group.relatedApis.includes(slug));
}

const methodGroupsBySlug: Record<string, ApiMethodGroup[]> = {
  connect: [
    { title: "Status", description: "Connect API의 Status 메서드입니다.", methods: ["GetDeviceList", "SubscribeStatus"] },
    { title: "Synchronous connection", description: "Connect API의 Synchronous connection 메서드입니다.", methods: ["Connect"] },
    { title: "Asynchronous connection", description: "Connect API의 Asynchronous connection 메서드입니다.", methods: ["AddAsyncConnection", "DeleteAsyncConnection"] },
    { title: "Device-to-server connection", description: "Connect API의 Device-to-server connection 메서드입니다.", methods: ["SetAcceptFilter", "GetAcceptFilter", "GetPendingList"] },
    { title: "Disconnection", description: "Connect API의 Disconnection 메서드입니다.", methods: ["Disconnect", "DisconnectAll"] },
    { title: "Search", description: "Connect API의 Search 메서드입니다.", methods: ["SearchDevice"] },
    { title: "Connection mode", description: "Connect API의 Connection mode 메서드입니다.", methods: ["SetConnectionMode", "SetConnectionModeMulti"] },
    { title: "SSL", description: "Connect API의 SSL 메서드입니다.", methods: ["EnableSSL", "EnableSSLMulti", "DisableSSL", "DisableSSLMulti"] },
    { title: "Slave", description: "Connect API의 Slave 메서드입니다.", methods: ["GetSlaveDevice", "SetSlaveDevice"] },
  ],
  "connect-master": [
    { title: "Status", description: "ConnectMaster API의 Status 메서드입니다.", methods: ["GetDeviceList", "SubscribeStatus"] },
    { title: "Synchronous connection", description: "ConnectMaster API의 Synchronous connection 메서드입니다.", methods: ["Connect"] },
    { title: "Asynchronous connection", description: "ConnectMaster API의 Asynchronous connection 메서드입니다.", methods: ["AddAsyncConnection", "DeleteAsyncConnection", "AddAsyncConnectionDB", "DeleteAsyncConnectionDB", "GetAsyncConnectionDB"] },
    { title: "Device-to-server connection", description: "ConnectMaster API의 Device-to-server connection 메서드입니다.", methods: ["SetAcceptFilter", "GetAcceptFilter", "SetAcceptFilterDB", "GetAcceptFilterDB", "GetPendingList"] },
    { title: "Disconnection", description: "ConnectMaster API의 Disconnection 메서드입니다.", methods: ["Disconnect", "DisconnectAll"] },
    { title: "Search", description: "ConnectMaster API의 Search 메서드입니다.", methods: ["SearchDevice"] },
    { title: "Connection mode", description: "ConnectMaster API의 Connection mode 메서드입니다.", methods: ["SetConnectionMode", "SetConnectionModeMulti"] },
    { title: "SSL", description: "ConnectMaster API의 SSL 메서드입니다.", methods: ["EnableSSL", "EnableSSLMulti", "DisableSSL", "DisableSSLMulti"] },
    { title: "Slave", description: "ConnectMaster API의 Slave 메서드입니다.", methods: ["GetSlaveDevice", "SetSlaveDevice", "AddSlaveDeviceDB", "DeleteSlaveDeviceDB", "GetSlaveDeviceDB"] },
  ],
  device: [
    { title: "Information", description: "Device API의 Information 메서드입니다.", methods: ["GetInfo", "GetCapabilityInfo", "GetCapability"] },
    { title: "Management", description: "Device API의 Management 메서드입니다.", methods: ["Lock", "LockMulti", "Unlock", "UnlockMulti", "Reboot", "RebootMulti", "UpgradeFirmware", "UpgradeFirmwareMulti"] },
    { title: "Reset", description: "Device API의 Reset 메서드입니다.", methods: ["FactoryReset", "FactoryResetMulti", "ClearDB", "ClearDBMulti", "ResetConfig", "ResetConfigMulti"] },
  ],
  event: [
    { title: "Log", description: "Event API의 Log 메서드입니다.", methods: ["GetLog", "[Deprecated] GetLogWithFilter", "ClearLog", "ClearLogMulti"] },
    { title: "Image log", description: "Event API의 Image log 메서드입니다.", methods: ["GetImageLog", "GetImageFilter", "SetImageFilter", "SetImageFilterMulti"] },
    { title: "Monitoring", description: "Event API의 Monitoring 메서드입니다.", methods: ["EnableMonitoring", "EnableMonitoringMulti", "DisableMonitoring", "DisableMonitoringMulti", "SubscribeRealtimeLog"] },
    { title: "Device IO States", description: "Event API의 Device IO States 메서드입니다.", methods: ["GetDeviceIOStates"] },
  ],
  network: [
    { title: "IP", description: "Network API의 IP 메서드입니다.", methods: ["GetIPConfig", "SetIPConfig", "SetIPConfigMulti"] },
    { title: "WLAN", description: "Network API의 WLAN 메서드입니다.", methods: ["GetWLANConfig", "SetWLANConfig", "SetWLANConfigMulti"] },
  ],
  user: [
    { title: "Information", description: "User API의 Information 메서드입니다.", methods: ["GetList", "Get", "GetPartial"] },
    { title: "Enroll", description: "User API의 Enroll 메서드입니다.", methods: ["Enroll", "EnrollMulti"] },
    { title: "Update", description: "User API의 Update 메서드입니다.", methods: ["Update", "UpdateMulti"] },
    { title: "Delete", description: "User API의 Delete 메서드입니다.", methods: ["Delete", "DeleteMulti", "DeleteAll", "DeleteAllMulti"] },
    { title: "Card", description: "User API의 Card 메서드입니다.", methods: ["GetCard", "SetCard", "SetCardMulti"] },
    { title: "Finger", description: "User API의 Finger 메서드입니다.", methods: ["GetFinger", "SetFinger", "SetFingerMulti"] },
    { title: "Face", description: "User API의 Face 메서드입니다.", methods: ["GetFace", "SetFace", "SetFaceMulti"] },
    { title: "Access group", description: "User API의 Access group 메서드입니다.", methods: ["GetAccessGroup", "SetAccessGroup", "SetAccessGroupMulti"] },
    { title: "Job code", description: "User API의 Job code 메서드입니다.", methods: ["GetJobCode", "SetJobCode", "SetJobCodeMulti"] },
    { title: "Utility", description: "User API의 Utility 메서드입니다.", methods: ["GetPINHash"] },
    { title: "UserOverride", description: "User API의 UserOverride 메서드입니다.", methods: ["GetUserOverride", "GetAllUserOverride", "SetUserOverride", "SetUserOverrideMulti", "DeleteUserOverride", "DeleteUserOverrideMulti", "DeleteAllUserOverride", "DeleteAllUserOverrideMulti"] },
  ],
  gateway: [
    { title: "Information", description: "Gateway API의 Information 메서드입니다.", methods: ["GetList", "Get", "SubscribeStatus"] },
    { title: "Management", description: "Gateway API의 Management 메서드입니다.", methods: ["Add", "Delete"] },
    { title: "Certificate", description: "Gateway API의 Certificate 메서드입니다.", methods: ["CreateCertificate", "GetIssuanceHistory", "GetCertificateBlacklist", "AddCertificateBlacklistRequest", "DeleteCertificateBlacklistRequest"] },
  ],
  login: [{ title: "Login", description: "Login API의 Login 메서드입니다.", methods: ["Login", "LoginAdmin"] }],
  "master-admin": [
    { title: "Get", description: "MasterAdmin API의 Get 메서드입니다.", methods: ["Get"] },
    { title: "Set", description: "MasterAdmin API의 Set 메서드입니다.", methods: ["Set", "SetMulti"] },
  ],
  tenant: [
    { title: "Information", description: "Tenant API의 Information 메서드입니다.", methods: ["GetList", "Get"] },
    { title: "Management", description: "Tenant API의 Management 메서드입니다.", methods: ["Add", "Delete", "AddGateway", "DeleteGateway"] },
    { title: "Certificate", description: "Tenant API의 Certificate 메서드입니다.", methods: ["CreateCertificate", "GetIssuanceHistory", "GetCertificateBlacklist", "AddCertificateBlacklistRequest", "DeleteCertificateBlacklistRequest"] },
  ],
  auth: [{ title: "Config", description: "Auth API의 Config 메서드와 설정 항목입니다.", methods: ["Authentication mode", "Authentication mode for RGB-based visual face authentication devices", "GetConfig", "SetConfig", "SetConfigMulti"] }],
  card: [
    { title: "Read/Write", description: "Card API의 Read/Write 메서드입니다.", methods: ["Scan", "Erase", "Write", "WriteQRCode"] },
    { title: "Config", description: "Card API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti", "Get1xConfig", "Set1xConfig", "Set1xConfigMulti", "GetQRConfig", "SetQRConfig", "SetQRConfigMulti"] },
    { title: "CustomConfig", description: "Card API의 CustomConfig 메서드입니다.", methods: ["GetCustomConfig", "SetCustomConfig", "SetCustomConfigMulti"] },
    { title: "Blacklist", description: "Card API의 Blacklist 메서드입니다.", methods: ["GetBlacklist", "AddBlacklist", "AddBlacklistMulti", "DeleteBlacklist", "DeleteBlacklistMulti", "DeleteAllBlacklist", "DeleteAllBlacklistMulti"] },
    { title: "FacilityCodeConfig", description: "Card API의 FacilityCodeConfig 메서드입니다.", methods: ["GetFacilityCodeConfig", "SetFacilityCodeConfig", "SetFacilityCodeConfigMulti"] },
    { title: "LockOverride", description: "Card API의 LockOverride 메서드입니다.", methods: ["GetLockOverride", "GetAllLockOverride", "SetLockOverride", "SetLockOverrideMulti", "DeleteLockOverride", "DeleteLockOverrideMulti", "DeleteAllLockOverride", "DeleteAllLockOverrideMulti"] },
  ],
  finger: [
    { title: "Scan/Verify", description: "Finger API의 Scan/Verify 메서드입니다.", methods: ["Scan", "GetImage", "Verify"] },
    { title: "Config", description: "Finger API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
  ],
  face: [
    { title: "Scan", description: "Face API의 Scan 메서드입니다.", methods: ["Scan", "Extract", "Normalize"] },
    { title: "Config", description: "Face API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Auth group", description: "Face API의 Auth group 메서드입니다.", methods: ["GetAuthGroup", "AddAuthGroup", "AddAuthGroupMulti", "DeleteAuthGroup", "DeleteAuthGroupMulti", "DeleteAllAuthGroup", "DeleteAllAuthGroupMulti"] },
  ],
  server: [
    { title: "Subscribe", description: "Server API의 Subscribe 메서드입니다.", methods: ["Subscribe", "Unsubscribe"] },
    { title: "Matching", description: "Server API의 Matching 메서드입니다.", methods: ["HandleVerify", "HandleIdentify", "HandleGlobalAPB"] },
    { title: "User interface", description: "Server API의 User interface 메서드입니다.", methods: ["HandleUserPhrase"] },
  ],
  access: [
    { title: "Access group", description: "Access API의 Access group 메서드입니다.", methods: ["GetList", "Add", "AddMulti", "Delete", "DeleteMulti", "DeleteAll", "DeleteAllMulti"] },
    { title: "Access level", description: "Access API의 Access level 메서드입니다.", methods: ["GetLevelList", "AddLevel", "AddLevelMulti", "DeleteLevel", "DeleteLevelMulti", "DeleteAllLevel", "DeleteAllLevelMulti"] },
    { title: "Floor level", description: "Access API의 Floor level 메서드입니다.", methods: ["GetFloorLevelList", "AddFloorLevel", "AddFloorLevelMulti", "DeleteFloorLevel", "DeleteFloorLevelMulti", "DeleteAllFloorLevel", "DeleteAllFloorLevelMulti"] },
  ],
  door: [
    { title: "Information", description: "Door API의 Information 메서드입니다.", methods: ["GetList", "GetStatus"] },
    { title: "Management", description: "Door API의 Management 메서드입니다.", methods: ["Add", "Delete", "DeleteAll"] },
    { title: "Lock/Unlock", description: "Door API의 Lock/Unlock 메서드입니다.", methods: ["Lock", "Unlock", "Release", "SetAlarm"] },
  ],
  lift: [
    { title: "Information", description: "Lift API의 Information 메서드입니다.", methods: ["GetList", "GetStatus"] },
    { title: "Management", description: "Lift API의 Management 메서드입니다.", methods: ["Add", "Delete", "DeleteAll"] },
    { title: "Activate/Deactivate", description: "Lift API의 Activate/Deactivate 메서드입니다.", methods: ["Activate", "Deactivate", "Release", "SetAlarm"] },
  ],
  schedule: [
    { title: "Schedule", description: "Schedule API의 Schedule 메서드입니다.", methods: ["GetList", "Add", "AddMulti", "Delete", "DeleteMulti", "DeleteAll", "DeleteAllMulti"] },
    { title: "Holiday", description: "Schedule API의 Holiday 메서드입니다.", methods: ["GetHolidayList", "AddHoliday", "AddHolidayMulti", "DeleteHoliday", "DeleteHolidayMulti", "DeleteAllHoliday", "DeleteAllHolidayMulti"] },
  ],
  ta: [
    { title: "Config", description: "T&A API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Event", description: "T&A API의 Event 메서드입니다.", methods: ["GetTNALog", "GetJobCodeLog"] },
  ],
  action: [{ title: "Config", description: "Action API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti", "RunAction"] }],
  display: [
    { title: "Config", description: "Display API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Language pack", description: "Display API의 Language pack 메서드입니다.", methods: ["UpdateLanguagePack", "UpdateLanguagePackMulti"] },
    { title: "Notice", description: "Display API의 Notice 메서드입니다.", methods: ["UpdateNotice", "UpdateNoticeMulti"] },
    { title: "Background image", description: "Display API의 Background image 메서드입니다.", methods: ["UpdateBackgroundImage", "UpdateBackgroundImageMulti"] },
    { title: "Background slides", description: "Display API의 Background slides 메서드입니다.", methods: ["UpdateSlideImages", "UpdateSlideImagesMulti"] },
    { title: "Sound", description: "Display API의 Sound 메서드입니다.", methods: ["UpdateSound", "UpdateSoundMulti"] },
  ],
  rs485: [
    { title: "Config", description: "RS485 API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Slave devices", description: "RS485 API의 Slave devices 메서드입니다.", methods: ["SearchDevice", "GetDevice", "SetDevice"] },
  ],
  status: [{ title: "Config", description: "Status API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] }],
  system: [{ title: "Config", description: "System API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] }],
  thermal: [
    { title: "Config", description: "Thermal API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Event", description: "Thermal API의 Event 메서드입니다.", methods: ["GetTemperatureLog"] },
  ],
  time: [
    { title: "Time", description: "Time API의 Time 메서드입니다.", methods: ["Get", "Set", "SetMulti"] },
    { title: "Config", description: "Time API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Daylight Saving Time", description: "Time API의 Daylight Saving Time 메서드입니다.", methods: ["GetDSTConfig", "SetDSTConfig", "SetDSTConfigMulti"] },
  ],
  rtsp: [{ title: "Config", description: "RTSP API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] }],
  voip: [{ title: "Config", description: "VoIP API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] }],
  wiegand: [
    { title: "Wiegand Format", description: "Wiegand API의 format 설명 항목입니다.", methods: ["Example: 26 bit standard"] },
    { title: "Config", description: "Wiegand API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] },
    { title: "Slave devices", description: "Wiegand API의 Slave devices 메서드입니다.", methods: ["SearchDevice", "GetDevice", "SetDevice"] },
  ],
  input: [{ title: "Config", description: "Input API의 Config 메서드입니다.", methods: ["GetConfig", "SetConfig", "SetConfigMulti"] }],
  operator: [
    { title: "Get", description: "Operator API의 Get 메서드입니다.", methods: ["GetList"] },
    { title: "Add", description: "Operator API의 Add 메서드입니다.", methods: ["Add", "AddMulti"] },
    { title: "Delete", description: "Operator API의 Delete 메서드입니다.", methods: ["Delete", "DeleteMulti"] },
    { title: "DeleteAll", description: "Operator API의 DeleteAll 메서드입니다.", methods: ["DeleteAll", "DeleteAllMulti"] },
  ],
  udp: [{ title: "IP", description: "UDP API의 IP 메서드입니다.", methods: ["GetIPConfig", "SetIPConfig"] }],
  "udp-master": [{ title: "IP", description: "UDPMaster API의 IP 메서드입니다.", methods: ["GetIPConfig", "SetIPConfig"] }],
  admin: [{ title: "Information", description: "Admin API의 Information 메서드입니다.", methods: ["GetInfo"] }],
  "device-license": [
    { title: "Config", description: "DeviceLicense API의 Config 메서드입니다.", methods: ["GetConfig"] },
    { title: "Enable/Disable/Query", description: "DeviceLicense API의 Enable/Disable/Query 메서드입니다.", methods: ["Enable", "Disable", "Query"] },
  ],
};

const apiDetails: Record<string, Pick<ApiItem, "gateway" | "methodGroups">> = {
  grpc: {
    gateway: "Concept",
    methodGroups: [
      {
        title: "IDL",
        description: "서비스 인터페이스와 payload message를 Protocol Buffers로 정의합니다.",
        methods: ["service", "message", "enum"],
      },
      {
        title: "Generated clients",
        description: "언어별 naming convention과 type mapping은 생성된 header/source를 기준으로 확인합니다.",
        methods: ["Java", "C#", "Python", "Node.js", "Go", "C++", "Kotlin", "Swift"],
      },
    ],
  },
  "gateway-model": {
    gateway: "Concept",
    methodGroups: [
      {
        title: "Device Gateway only",
        description: "장치를 직접 관리할 때 사용하는 API입니다.",
        methods: ["Connect", "Server", "UDP"],
      },
      {
        title: "Master Gateway only",
        description: "Device Gateway를 통해 장치를 관리하고 tenant를 분리할 때 사용하는 API입니다.",
        methods: ["ConnectMaster", "Login", "Tenant", "Gateway", "UDPMaster"],
      },
    ],
  },
  "api-definition": {
    gateway: "Concept",
    methodGroups: [
      {
        title: "Request / Response",
        description: "각 API는 단일 request를 보내고 단일 response를 받는 구조입니다.",
        methods: ["Request message", "Response message", "Empty response omission"],
      },
    ],
  },
  "multi-command": {
    gateway: "Both",
    methodGroups: [
      {
        title: "Parallel execution",
        description: "여러 장치에 동일 작업을 병렬 실행하고 일부 실패는 deviceErrors로 확인합니다.",
        methods: ["User.EnrollMulti", "SetConnectionModeMulti", "EnableSSLMulti", "LockMulti", "RebootMulti"],
      },
    ],
  },
  connect: {
    gateway: "Device Gateway",
    methodGroups: [
      {
        title: "Status",
        description: "Gateway가 관리하는 장치 목록과 연결 상태 변화를 확인합니다.",
        methods: ["GetDeviceList", "SubscribeStatus"],
      },
      {
        title: "Synchronous connection",
        description: "장치에 직접 동기 연결하고 deviceID를 반환받습니다.",
        methods: ["Connect"],
      },
      {
        title: "Asynchronous connection",
        description: "다수 장치를 Gateway가 백그라운드에서 연결·재연결하도록 등록합니다.",
        methods: ["AddAsyncConnection", "DeleteAsyncConnection"],
      },
      {
        title: "Device-to-server connection",
        description: "장치가 Gateway로 접속하는 흐름에서 허용 목록과 pending list를 관리합니다.",
        methods: ["SetAcceptFilter", "GetAcceptFilter", "GetPendingList"],
      },
      {
        title: "Connection control",
        description: "검색, 연결 해제, 연결 모드, SSL/TLS, slave 장치 정보를 관리합니다.",
        methods: ["Disconnect", "DisconnectAll", "SearchDevice", "SetConnectionMode", "EnableSSL", "DisableSSL", "GetSlaveDevice", "SetSlaveDevice"],
      },
    ],
  },
  "connect-master": {
    gateway: "Master Gateway",
    methodGroups: [
      {
        title: "Gateway-routed connection",
        description: "Master Gateway가 Device Gateway를 통해 장치 연결 상태를 관리합니다.",
        methods: ["GetDeviceList", "SubscribeStatus", "Connect", "Disconnect", "SearchDevice"],
      },
      {
        title: "Tenant-aware control",
        description: "Master Gateway 환경에서는 Login과 Tenant/Gateway 구성이 선행됩니다.",
        methods: ["Login", "Tenant", "Gateway"],
      },
    ],
  },
  device: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Information",
        description: "장치 모델, firmware, 기능 지원 범위를 조회합니다.",
        methods: ["GetInfo", "GetCapabilityInfo", "GetCapability"],
      },
      {
        title: "Management",
        description: "장치 잠금, 해제, 재부팅, factory reset, firmware upgrade를 수행합니다.",
        methods: ["Lock", "LockMulti", "Unlock", "UnlockMulti", "Reboot", "RebootMulti", "UpgradeFirmware", "UpgradeFirmwareMulti"],
      },
      {
        title: "Reset",
        description: "장치 설정, 사용자 DB, 장치 상태를 초기화하는 위험 작업입니다.",
        methods: ["FactoryReset", "FactoryResetMulti", "ClearDB", "ClearDBMulti", "ResetConfig", "ResetConfigMulti"],
      },
    ],
  },
  event: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Log retrieval",
        description: "장치 이벤트 로그를 범위 기준으로 읽고 내부 이벤트 파이프라인에 적재합니다.",
        methods: ["GetLog", "GetLogBlob", "GetImageLog"],
      },
      {
        title: "Monitoring",
        description: "실시간 이벤트 수신과 모니터링 상태를 다룹니다.",
        methods: ["StartMonitoring", "StopMonitoring", "SubscribeLog"],
      },
    ],
  },
  network: {
    gateway: "Both",
    methodGroups: [
      {
        title: "IP configuration",
        description: "장치 IP, DHCP, server address, connection mode 같은 네트워크 설정을 변경합니다.",
        methods: ["GetIPConfig", "SetIPConfig", "SetIPConfigMulti"],
      },
      {
        title: "WLAN",
        description: "무선 네트워크 옵션을 지원 장치에서 구성합니다.",
        methods: ["GetWLANConfig", "SetWLANConfig"],
      },
    ],
  },
  user: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Information",
        description: "사용자 목록과 전체/부분 사용자 레코드를 조회합니다.",
        methods: ["GetList", "Get", "GetPartial"],
      },
      {
        title: "Enroll / update / delete",
        description: "사용자를 등록, 수정, 삭제하고 여러 장치에 병렬 반영합니다.",
        methods: ["Enroll", "EnrollMulti", "Update", "UpdateMulti", "Delete", "DeleteMulti", "DeleteAll", "DeleteAllMulti"],
      },
      {
        title: "Credentials",
        description: "카드, PIN, 지문, 얼굴 템플릿과 사용자 권한 데이터를 함께 다룹니다.",
        methods: ["GetCard", "SetCard", "SetCardMulti", "GetFinger", "SetFinger", "SetFingerMulti", "GetFace", "SetFace", "SetFaceMulti", "GetPINHash"],
      },
      {
        title: "Policy links",
        description: "출입 그룹, job code, 사용자 override 정책을 사용자와 연결합니다.",
        methods: ["GetAccessGroup", "SetAccessGroup", "SetAccessGroupMulti", "GetJobCode", "SetJobCode", "SetJobCodeMulti"],
      },
      {
        title: "User override",
        description: "개별 사용자의 인증/운영 override 설정을 조회하고 반영합니다.",
        methods: ["GetUserOverride", "GetAllUserOverride", "SetUserOverride", "SetUserOverrideMulti", "DeleteUserOverride", "DeleteUserOverrideMulti", "DeleteAllUserOverride", "DeleteAllUserOverrideMulti"],
      },
    ],
  },
  gateway: {
    gateway: "Master Gateway",
    methodGroups: [
      {
        title: "Gateway registry",
        description: "Master Gateway에 연결되는 Device Gateway를 등록하고 상태를 관리합니다.",
        methods: ["GetList", "Add", "Delete", "GetStatus", "SubscribeStatus"],
      },
    ],
  },
  login: {
    gateway: "Master Gateway",
    methodGroups: [
      {
        title: "Session",
        description: "관리자 또는 tenant context로 Master Gateway API 호출 권한을 얻습니다.",
        methods: ["Login", "Logout", "Refresh"],
      },
    ],
  },
  "master-admin": {
    gateway: "Both",
    methodGroups: [
      {
        title: "Master administrator",
        description: "CE RED 대응 장치의 Master Admin 설정을 조회하고 장치에 반영합니다.",
        methods: ["Get", "Set", "SetMulti"],
      },
    ],
  },
  tenant: {
    gateway: "Master Gateway",
    methodGroups: [
      {
        title: "Tenant management",
        description: "multi-tenant 환경에서 tenant를 생성, 수정, 삭제, 조회합니다.",
        methods: ["GetList", "Get", "Add", "Update", "Delete"],
      },
    ],
  },
  auth: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Authentication options",
        description: "카드/지문/얼굴 인증 방식, matching, credential 정책을 구성합니다.",
        methods: ["GetConfig", "SetConfig", "SetConfigMulti"],
      },
    ],
  },
  card: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Card operations",
        description: "카드 읽기, 쓰기, 포맷, 인증 옵션을 다룹니다.",
        methods: ["Scan", "GetConfig", "SetConfig", "SetConfigMulti"],
      },
    ],
  },
  finger: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Fingerprint enrollment",
        description: "지문 스캔, 템플릿 추출, 품질 확인, 인증 옵션을 다룹니다.",
        methods: ["Scan", "GetImage", "GetConfig", "SetConfig"],
      },
    ],
  },
  face: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Face template",
        description: "얼굴 템플릿 스캔과 얼굴 인증 옵션을 다룹니다.",
        methods: ["Scan", "GetConfig", "SetConfig"],
      },
    ],
  },
  server: {
    gateway: "Device Gateway",
    methodGroups: [
      {
        title: "Server matching",
        description: "장치 인증 요청을 서버 측 matching으로 처리하는 흐름을 구현합니다.",
        methods: ["Start", "Stop", "Subscribe"],
      },
    ],
  },
  access: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Access policy",
        description: "출입 레벨과 출입 그룹을 구성하고 사용자와 연결합니다.",
        methods: ["GetLevel", "SetLevel", "GetGroup", "SetGroup", "DeleteGroup"],
      },
    ],
  },
  door: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Door configuration",
        description: "문, relay, sensor, forced open, held open 정책을 구성합니다.",
        methods: ["GetList", "Set", "Delete", "Lock", "Unlock", "Release"],
      },
    ],
  },
  lift: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Lift control",
        description: "엘리베이터와 층 접근 권한을 구성합니다.",
        methods: ["GetList", "Set", "Delete", "ActivateFloor"],
      },
    ],
  },
  schedule: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Schedule",
        description: "출입통제와 기타 설정에서 재사용할 시간 스케줄을 만듭니다.",
        methods: ["GetList", "Set", "Delete", "DeleteAll"],
      },
    ],
  },
  ta: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Time & attendance",
        description: "근태 옵션과 job code가 포함된 이벤트 로그를 다룹니다.",
        methods: ["GetConfig", "SetConfig", "GetJobCode", "SetJobCode"],
      },
    ],
  },
  action: { gateway: "Both", methodGroups: [{ title: "Trigger actions", description: "trigger 발생 시 장치가 수행할 action을 설정합니다.", methods: ["GetConfig", "SetConfig"] }] },
  display: { gateway: "Both", methodGroups: [{ title: "Device UI", description: "장치 표시 언어, 화면, language pack 업그레이드를 구성합니다.", methods: ["GetConfig", "SetConfig", "UpgradeLanguagePack"] }] },
  rs485: { gateway: "Both", methodGroups: [{ title: "RS485", description: "RS485 채널과 slave 장치를 구성합니다.", methods: ["GetConfig", "SetConfig", "SearchDevice", "SetDevice"] }] },
  status: { gateway: "Both", methodGroups: [{ title: "LED / buzzer", description: "상태별 LED와 buzzer 동작을 구성합니다.", methods: ["GetConfig", "SetConfig"] }] },
  system: { gateway: "Both", methodGroups: [{ title: "System options", description: "장치 시스템 옵션과 잠금 상태를 확인합니다.", methods: ["GetConfig", "SetConfig", "GetLockStatus"] }] },
  thermal: { gateway: "Both", methodGroups: [{ title: "Thermal camera", description: "열화상 카메라 관련 옵션을 설정합니다.", methods: ["GetConfig", "SetConfig"] }] },
  time: { gateway: "Both", methodGroups: [{ title: "Time sync", description: "DST, 시간 동기화, 장치 시각을 구성합니다.", methods: ["GetConfig", "SetConfig", "SetTime"] }] },
  rtsp: { gateway: "Both", methodGroups: [{ title: "RTSP", description: "RTSP 관련 옵션을 구성합니다.", methods: ["GetConfig", "SetConfig"] }] },
  voip: { gateway: "Both", methodGroups: [{ title: "VoIP", description: "Voice over IP 관련 옵션을 구성합니다.", methods: ["GetConfig", "SetConfig"] }] },
  wiegand: { gateway: "Both", methodGroups: [{ title: "Wiegand", description: "Wiegand format과 slave device를 설정합니다.", methods: ["GetConfig", "SetConfig", "SearchDevice", "SetDevice"] }] },
  input: { gateway: "Both", methodGroups: [{ title: "Inputs", description: "장치 input 설정을 구성합니다.", methods: ["GetConfig", "SetConfig"] }] },
  operator: {
    gateway: "Both",
    methodGroups: [
      {
        title: "Operator",
        description: "장치 관리자/설정 관리자/사용자 관리자 권한을 사용자 ID에 연결합니다.",
        methods: ["GetList", "Add", "AddMulti", "Delete", "DeleteMulti", "DeleteAll", "DeleteAllMulti"],
      },
    ],
  },
  udp: { gateway: "Device Gateway", methodGroups: [{ title: "UDP", description: "Device Gateway와 장치 간 UDP 통신을 관리합니다.", methods: ["GetConfig", "SetConfig", "Send"] }] },
  "udp-master": { gateway: "Master Gateway", methodGroups: [{ title: "UDP Master", description: "Master Gateway가 Device Gateway를 통해 UDP 통신을 관리합니다.", methods: ["GetConfig", "SetConfig", "Send"] }] },
  admin: { gateway: "Both", methodGroups: [{ title: "Admin", description: "G-SDK 버전과 관리 정보를 조회합니다.", methods: ["GetVersion"] }] },
  "device-license": { gateway: "Both", methodGroups: [{ title: "Device license", description: "장치 기능 라이선스 구성을 조회하고 활성화, 비활성화, 질의합니다.", methods: ["GetConfig", "Enable", "Disable", "Query"] }] },
  err: { gateway: "Concept", methodGroups: [{ title: "Error definition", description: "Multi command 등에서 반환되는 오류 구조를 확인합니다.", methods: ["ErrorResponse", "deviceErrors"] }] },
};

export function getApiDetail(slug: string) {
  const item = getApiItem(slug);
  if (!item) return undefined;
  const methodGroups = methodGroupsBySlug[slug];
  const detail = apiDetails[slug] ?? {
    gateway: "Both" as const,
    methodGroups: [
      {
        title: item.name,
        description: item.summary,
        methods: [item.name],
      },
    ],
  };
  return { ...item, ...detail, methodGroups: methodGroups ?? detail.methodGroups };
}

export function getApiItem(slug: string) {
  return apiItems.find((item) => item.slug === slug);
}
