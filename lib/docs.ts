export type Accent = "cyan" | "blue" | "violet" | "burgundy";
export type Thumbnail = "overview" | "gateway" | "quick" | "device" | "user" | "access" | "logs" | "config" | "language";
export type IconName = "network" | "play" | "fingerprint" | "users" | "shield" | "settings";

export type Doc = {
  slug: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  workflow: string;
  team: string;
  type: string;
  level: string;
  time: string;
  tags: string[];
  accent: Accent;
  thumbnail: Thumbnail;
  featured?: boolean;
  sections: {
    title: string;
    body: string;
  }[];
};

export type Collection = {
  title: string;
  description: string;
  icon: IconName;
  accent: Accent;
  filterKind: "category" | "workflow" | "type";
  filter: string;
};

export const categories = ["전체", "개요", "Gateway", "장치", "사용자", "출입통제", "이벤트", "설정"];
export const platforms = ["전체", "BioStar 2", "Device Gateway", "Master Gateway", "Client SDK"];
export const workflows = ["전체", "연동", "장치 관리", "데이터", "운영", "보안"];
export const teams = ["전체", "개발", "보안", "운영", "제품", "QA"];
export const docTypes = ["전체", "가이드", "API 레퍼런스", "튜토리얼", "개념", "체크리스트"];

export const collections: Collection[] = [
  {
    title: "아키텍처",
    description: "Device Gateway, Master Gateway, gRPC 클라이언트 구조를 이해합니다.",
    icon: "network",
    accent: "cyan",
    filterKind: "category",
    filter: "Gateway",
  },
  {
    title: "Gateway 설치",
    description: "Device Gateway와 Master Gateway 설치, 인증서, 포트 구성을 한 흐름으로 정리합니다.",
    icon: "settings",
    accent: "blue",
    filterKind: "category",
    filter: "Gateway",
  },
  {
    title: "빠른 시작",
    description: "Gateway 연결부터 첫 서비스 호출까지 최소 흐름을 따라갑니다.",
    icon: "play",
    accent: "violet",
    filterKind: "type",
    filter: "튜토리얼",
  },
  {
    title: "장치 관리",
    description: "BioStar 2 장치 연결, 조회, 잠금, 재부팅, 초기화를 다룹니다.",
    icon: "fingerprint",
    accent: "blue",
    filterKind: "workflow",
    filter: "장치 관리",
  },
  {
    title: "사용자와 인증정보",
    description: "사용자, 카드, PIN, 지문, 얼굴 템플릿 동기화 흐름을 정리합니다.",
    icon: "users",
    accent: "cyan",
    filterKind: "category",
    filter: "사용자",
  },
  {
    title: "출입통제",
    description: "문, 스케줄, 출입 그룹, Zone, Wiegand, RS485 구성을 탐색합니다.",
    icon: "shield",
    accent: "violet",
    filterKind: "category",
    filter: "출입통제",
  },
  {
    title: "운영 체크리스트",
    description: "TLS 인증서, Gateway 포트, 장애 대응, 배포 기준을 점검합니다.",
    icon: "settings",
    accent: "burgundy",
    filterKind: "type",
    filter: "체크리스트",
  },
];

export const docs: Doc[] = [
  {
    slug: "gsdk-overview",
    title: "Suprema G-SDK란?",
    description: "gRPC 기반으로 BioStar 2 장치를 연결하고 운영·관리하는 G-SDK의 기본 개념을 설명합니다.",
    category: "개요",
    platform: "Client SDK",
    workflow: "연동",
    team: "개발",
    type: "개념",
    level: "입문",
    time: "7분",
    tags: ["gRPC", "BioStar 2", "SDK"],
    accent: "cyan",
    thumbnail: "overview",
    featured: true,
    sections: [
      {
        title: "핵심 개념",
        body: "G-SDK는 애플리케이션이 gRPC 클라이언트를 통해 Gateway에 요청하고, Gateway가 BioStar 2 장치와 통신하는 구조입니다.",
      },
      {
        title: "언제 사용하나",
        body: "장치 관리, 사용자 동기화, 출입 로그 수집처럼 서버 애플리케이션에서 여러 장치를 일관되게 제어해야 할 때 적합합니다.",
      },
    ],
  },
  {
    slug: "gateway-architecture",
    title: "Device Gateway와 Master Gateway",
    description: "Device Gateway가 장치와 통신하고 Master Gateway가 다수 Gateway를 관리하는 구조를 정리합니다.",
    category: "Gateway",
    platform: "Master Gateway",
    workflow: "운영",
    team: "개발",
    type: "가이드",
    level: "중급",
    time: "12분",
    tags: ["Device Gateway", "Master Gateway", "확장성"],
    accent: "blue",
    thumbnail: "gateway",
    featured: true,
    sections: [
      {
        title: "Device Gateway",
        body: "Device Gateway는 장치 연결과 명령 전달을 담당합니다. 장치가 많아질수록 네트워크 위치와 장애 격리를 함께 고려해야 합니다.",
      },
      {
        title: "Master Gateway",
        body: "Master Gateway는 여러 Device Gateway를 묶어 더 큰 사이트나 멀티 사이트 운영을 지원하는 계층으로 볼 수 있습니다.",
      },
    ],
  },
  {
    slug: "quick-connect",
    title: "첫 BioStar 장치 연결하기",
    description: "Gateway 주소, 포트, CA 인증서를 준비하고 Connect API로 장치 ID를 얻는 기본 절차입니다.",
    category: "장치",
    platform: "Device Gateway",
    workflow: "연동",
    team: "개발",
    type: "튜토리얼",
    level: "입문",
    time: "15분",
    tags: ["Connect", "TLS", "Device ID"],
    accent: "cyan",
    thumbnail: "quick",
    featured: true,
    sections: [
      {
        title: "준비 항목",
        body: "Gateway 주소, gRPC 포트, TLS 인증서, 장치 IP 또는 검색 가능한 네트워크 조건을 먼저 확인합니다.",
      },
      {
        title: "연결 흐름",
        body: "채널을 생성하고 Connect 서비스 클라이언트를 초기화한 뒤 장치 연결 요청을 보내 장치 ID를 확보합니다.",
      },
    ],
  },
  {
    slug: "device-api",
    title: "Device API 지도",
    description: "장치 정보 조회, 잠금/해제, 재부팅, 펌웨어 업그레이드, 초기화 API를 목적별로 구분합니다.",
    category: "장치",
    platform: "BioStar 2",
    workflow: "장치 관리",
    team: "운영",
    type: "API 레퍼런스",
    level: "중급",
    time: "10분",
    tags: ["GetInfo", "Reboot", "Firmware"],
    accent: "blue",
    thumbnail: "device",
    sections: [
      {
        title: "조회 API",
        body: "장치 모델, 펌웨어, 지원 기능 같은 정보를 읽어 운영 화면과 점검 도구에 표시합니다.",
      },
      {
        title: "제어 API",
        body: "잠금, 재부팅, 초기화처럼 영향이 큰 API는 역할 권한과 감사 로그를 반드시 함께 설계합니다.",
      },
    ],
  },
  {
    slug: "user-credentials",
    title: "사용자와 인증정보 모델",
    description: "사용자 ID, 카드, PIN, 지문, 얼굴 템플릿을 애플리케이션 데이터와 안전하게 매핑합니다.",
    category: "사용자",
    platform: "BioStar 2",
    workflow: "데이터",
    team: "제품",
    type: "가이드",
    level: "중급",
    time: "14분",
    tags: ["User", "Card", "Biometric"],
    accent: "burgundy",
    thumbnail: "user",
    sections: [
      {
        title: "식별자 설계",
        body: "앱 사용자 ID와 장치 사용자 ID를 명확히 분리하고, 동기화 실패 시 복구할 수 있는 매핑 테이블을 둡니다.",
      },
      {
        title: "민감 정보",
        body: "지문과 얼굴 템플릿은 민감한 인증정보입니다. 저장, 전송, 삭제 흐름을 운영 정책과 함께 다뤄야 합니다.",
      },
    ],
  },
  {
    slug: "access-control",
    title: "Access Control API 입문",
    description: "문, 스케줄, 출입 그룹, Zone, Wiegand, RS485 설정의 관계를 문서화합니다.",
    category: "출입통제",
    platform: "BioStar 2",
    workflow: "보안",
    team: "보안",
    type: "개념",
    level: "고급",
    time: "18분",
    tags: ["Door", "Schedule", "Zone"],
    accent: "violet",
    thumbnail: "access",
    sections: [
      {
        title: "정책 모델",
        body: "물리적인 문과 장치 구성, 사용자 그룹, 시간 스케줄을 분리해서 모델링해야 변경 영향 범위를 줄일 수 있습니다.",
      },
      {
        title: "검증 순서",
        body: "스케줄과 그룹을 먼저 검증한 뒤 장치 정책으로 내려보내야 운영 중 접근 권한 오류를 줄일 수 있습니다.",
      },
    ],
  },
  {
    slug: "event-logs",
    title: "이벤트와 로그 수집",
    description: "출입 로그와 장치 이벤트를 안정적으로 수집하기 위한 커서, 재시도, 정규화 기준입니다.",
    category: "이벤트",
    platform: "Device Gateway",
    workflow: "데이터",
    team: "운영",
    type: "체크리스트",
    level: "중급",
    time: "9분",
    tags: ["Log", "Event", "T&A"],
    accent: "blue",
    thumbnail: "logs",
    sections: [
      {
        title: "수집 경계",
        body: "장치별 마지막 수집 시점 또는 커서를 기록해 중복과 누락을 줄입니다.",
      },
      {
        title: "정규화",
        body: "장치 이벤트를 내부 도메인 이벤트로 변환하는 계층을 분리하면 분석과 알림 시스템이 안정됩니다.",
      },
    ],
  },
  {
    slug: "language-samples",
    title: "언어별 샘플 구성",
    description: "C#, Java, Python, Go, Node.js 등에서 생성된 gRPC 클라이언트를 사용하는 진입점을 비교합니다.",
    category: "개요",
    platform: "Client SDK",
    workflow: "연동",
    team: "개발",
    type: "가이드",
    level: "입문",
    time: "11분",
    tags: ["C#", "Python", "Node.js"],
    accent: "cyan",
    thumbnail: "language",
    sections: [
      {
        title: "공통 구조",
        body: "언어가 달라도 채널 생성, 인증서 로딩, 서비스 클라이언트 호출이라는 큰 흐름은 동일합니다.",
      },
      {
        title: "샘플 관리",
        body: "각 언어 샘플에는 Gateway 주소, 포트, 인증서 경로를 어디에서 주입하는지 명확히 남겨야 합니다.",
      },
    ],
  },
  {
    slug: "production-hardening",
    title: "운영 환경 점검표",
    description: "Gateway 인증서, 네트워크 포트, 초기화 권한, 장애 대응, 배포 롤백 기준을 점검합니다.",
    category: "설정",
    platform: "Server",
    workflow: "운영",
    team: "보안",
    type: "체크리스트",
    level: "고급",
    time: "13분",
    tags: ["TLS", "Runbook", "Security"],
    accent: "violet",
    thumbnail: "config",
    sections: [
      {
        title: "인증서와 포트",
        body: "Gateway 인증서 교체 절차와 포트 접근 범위를 문서화하고 배포 전 점검 항목으로 둡니다.",
      },
      {
        title: "위험 API",
        body: "초기화, 펌웨어, 재부팅 API는 별도 승인과 감사 로그가 필요한 운영 기능으로 취급합니다.",
      },
    ],
  },
];

export function getDocBySlug(slug: string) {
  return docs.find((doc) => doc.slug === slug);
}
