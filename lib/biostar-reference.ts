export type BioStarApiGroup = {
  slug: string;
  title: string;
  description: string;
  protocol: string;
  endpoints: string[];
};

export type BioStarExample = {
  slug: string;
  title: string;
  description: string;
  steps: string[];
  tags: string[];
};

export const biostar2ApiGroups: BioStarApiGroup[] = [
  {
    slug: "auth",
    title: "Authentication",
    description: "BioStar 2 API 호출 전 로그인하고 `bs-session-id` 헤더로 세션을 전달하는 흐름입니다.",
    protocol: "REST / JSON",
    endpoints: ["POST /api/login", "bs-session-id", "session header", "LOGIN REQUIRED"],
  },
  {
    slug: "users",
    title: "Users",
    description: "BioStar 2 서버의 사용자 생성, 조회, 수정, 삭제와 credential 연결을 다룹니다.",
    protocol: "REST / JSON",
    endpoints: ["GET users", "POST users", "PUT users", "DELETE users", "user groups"],
  },
  {
    slug: "devices",
    title: "Devices",
    description: "BioStar 서버에 등록된 장치, 단말 상태, 동기화 대상을 조회합니다.",
    protocol: "REST / JSON",
    endpoints: ["GET /devices", "GET /devices/{id}", "device status", "device sync"],
  },
  {
    slug: "access-control",
    title: "Access Control",
    description: "BioStar 2 AC 기능의 출입 그룹, 출입 레벨, 문, 스케줄 같은 리소스를 관리합니다.",
    protocol: "REST / JSON",
    endpoints: ["access groups", "access levels", "doors", "schedules", "time zones"],
  },
  {
    slug: "events",
    title: "Events",
    description: "출입 이벤트, 알람, 감사 로그를 조회하고 외부 시스템으로 정규화합니다.",
    protocol: "REST / JSON",
    endpoints: ["GET /events", "event filters", "audit logs", "cursor pagination"],
  },
  {
    slug: "biometrics",
    title: "Biometrics",
    description: "카드, 지문, 얼굴 등 인증정보와 사용자 credential 모델을 연결합니다.",
    protocol: "REST / JSON",
    endpoints: ["cards", "finger templates", "face templates", "credential policy"],
  },
];

export const biostarXApiGroups: BioStarApiGroup[] = [
  {
    slug: "devices",
    title: "Devices",
    description: "BioStar X에 연결된 장치와 단말 제어용 REST 리소스입니다.",
    protocol: "REST / JSON",
    endpoints: ["devices", "terminals", "device status", "remote connection"],
  },
  {
    slug: "users",
    title: "Users",
    description: "BioStar X 사용자와 조직, 권한 데이터를 외부 시스템과 연결합니다.",
    protocol: "REST / JSON",
    endpoints: ["users", "organizations", "roles", "permission mappings"],
  },
  {
    slug: "biometrics",
    title: "Biometrics",
    description: "지문, 얼굴, 모바일 credential 같은 바이오인식/인증정보를 다룹니다.",
    protocol: "REST / JSON",
    endpoints: ["biometric templates", "face", "fingerprint", "mobile credential"],
  },
  {
    slug: "access-control",
    title: "Access Control",
    description: "맞춤형 출입통제 시스템을 만들기 위한 핵심 리소스입니다.",
    protocol: "REST / JSON",
    endpoints: ["doors", "access levels", "schedules", "events", "alarms"],
  },
  {
    slug: "apps",
    title: "Modular Apps",
    description: "Access Control core 외 기능을 모듈화된 앱과 개발자 참조 구조로 확장합니다.",
    protocol: "REST / JSON",
    endpoints: ["apps", "modules", "extensions", "open source references"],
  },
  {
    slug: "remote",
    title: "Remote Server",
    description: "클라우드 기반 기술로 로컬 BioStar X 서버를 원격 연결하고 관리하는 API 영역입니다.",
    protocol: "REST / JSON",
    endpoints: ["remote server", "cloud connection", "site management", "server sync"],
  },
];

export const biostarApiGroups = biostar2ApiGroups;

export const biostar2Facts = [
  "BioStar 2 API는 JSON 기반 API입니다.",
  "BioStar 2.7.10부터 새 Local API가 BioStar 2 AC 서버에 기본 포함됩니다.",
  "새 API는 별도 API 서버 설치 없이 BioStar 2 AC 서버에서 사용할 수 있습니다.",
  "기존 Local API Server는 v2.6.3 계열이며, 새 API와 별도 제품 축으로 봅니다.",
  "인증 후 응답 헤더의 session id를 `bs-session-id` 헤더로 전달합니다.",
  "주요 리소스는 사용자, 장치, 출입통제, 이벤트, 인증정보입니다.",
];

export const biostarXFacts = [
  "BioStar X API는 BioStar X를 외부 소프트웨어와 통합하기 위한 REST API입니다.",
  "요청과 응답은 이해하기 쉬운 JSON 형식으로 구성됩니다.",
  "장치, 단말, 사용자, 바이오인식 제어를 위한 개발 도구 역할을 합니다.",
  "Access Control core 외 기능은 모듈화된 앱과 개발자 참조 구조로 확장됩니다.",
  "로컬 BioStar X 서버를 원격으로 연결하고 관리하는 클라우드 기반 활용을 포함합니다.",
];

export const biostar2Examples: BioStarExample[] = [
  {
    slug: "login-session",
    title: "로그인 후 세션 헤더 저장",
    description: "BioStar 2 API는 먼저 로그인 API를 호출하고 응답 헤더의 session id를 이후 요청에 전달합니다.",
    steps: ["POST /api/login 호출", "응답 헤더에서 session id 확인", "후속 요청 헤더에 bs-session-id 추가", "세션 만료 시 LOGIN REQUIRED 처리"],
    tags: ["login", "bs-session-id", "session"],
  },
  {
    slug: "create-user",
    title: "사용자 생성",
    description: "외부 HR/회원 시스템의 사용자를 BioStar 2 서버 사용자로 생성하고 credential 연결 전 상태를 만듭니다.",
    steps: ["내부 사용자 ID와 BioStar 사용자 ID 매핑", "사용자 생성 요청 전송", "사용자 그룹 또는 출입 그룹 연결", "실패 시 중복 ID와 필수 필드 검증"],
    tags: ["users", "create", "mapping"],
  },
  {
    slug: "event-sync",
    title: "이벤트 조회와 정규화",
    description: "출입 이벤트를 외부 시스템의 감사 로그나 알림 파이프라인으로 가져오는 패턴입니다.",
    steps: ["마지막 수집 시점 저장", "이벤트 API 조건 조회", "내부 이벤트 모델로 정규화", "중복 이벤트와 누락 구간 점검"],
    tags: ["events", "audit", "sync"],
  },
];

export const biostarXExamples: BioStarExample[] = [
  {
    slug: "third-party-integration",
    title: "기존 보안 소프트웨어와 통합",
    description: "BioStar X API를 통해 기존 보안 소프트웨어가 사용자, 장치, 출입 이벤트를 읽고 반영하는 패턴입니다.",
    steps: ["연동 범위 정의", "사용자/장치 리소스 매핑", "이벤트 동기화 경계 설정", "권한과 감사 로그 분리"],
    tags: ["integration", "security software", "events"],
  },
  {
    slug: "custom-access-control",
    title: "맞춤형 출입통제 시스템 구성",
    description: "BioStar X의 REST API를 기반으로 고객 환경에 맞는 출입통제 워크플로를 구성합니다.",
    steps: ["문과 단말 모델링", "사용자 권한 모델 설계", "스케줄과 출입 레벨 적용", "알람과 예외 이벤트 처리"],
    tags: ["access control", "doors", "schedules"],
  },
  {
    slug: "remote-site-management",
    title: "원격 사이트 서버 관리",
    description: "로컬 BioStar X 서버를 원격으로 연결하고 여러 사이트 운영 상태를 통합해서 봅니다.",
    steps: ["사이트별 서버 식별자 구성", "원격 연결 상태 확인", "장치/사용자 동기화 상태 비교", "장애 시 사이트 단위 복구 플로우 실행"],
    tags: ["remote", "server", "site"],
  },
];
