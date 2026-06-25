import type { Accent, Thumbnail } from "@/lib/docs";

// Python 튜토리얼(Examples) 메타데이터. 인덱스 카드, 사이드바, API↔Example 상호 연결에 사용합니다.

export type TutorialMeta = {
  slug: string;
  title: string;
  description: string;
  apis: string[]; // 이 예제가 사용하는 API Reference slug (상호 링크)
  thumbnail: Thumbnail;
  accent: Accent;
};

// 학습 흐름 순서 (빠른 시작 -> 연결 -> 도메인별)
export const tutorials: TutorialMeta[] = [
  { slug: "quick", title: "빠른 시작", description: "Gateway 연결부터 첫 사용자 인증까지 최소 흐름을 따라갑니다.", apis: ["connect", "user", "auth"], thumbnail: "quick", accent: "cyan" },
  { slug: "connect", title: "장치 연결", description: "Device Gateway로 장치를 검색하고 동기·비동기로 연결합니다.", apis: ["connect"], thumbnail: "quick", accent: "blue" },
  { slug: "connectMaster", title: "Master Gateway 연결", description: "Master Gateway에 로그인하고 tenant를 통해 장치를 연결합니다.", apis: ["connect-master", "login", "tenant"], thumbnail: "gateway", accent: "blue" },
  { slug: "quickMaster", title: "Master 빠른 시작", description: "Master Gateway 환경에서 첫 연결과 호출을 빠르게 시작합니다.", apis: ["connect-master", "login"], thumbnail: "gateway", accent: "violet" },
  { slug: "user", title: "사용자 관리", description: "사용자를 등록하고 카드·지문·얼굴·인증모드를 설정합니다.", apis: ["user", "card", "finger", "face", "auth"], thumbnail: "user", accent: "cyan" },
  { slug: "event", title: "이벤트 수집", description: "이벤트 로그를 읽고 실시간 이벤트를 구독합니다.", apis: ["event"], thumbnail: "logs", accent: "blue" },
  { slug: "tna", title: "근태(T&A)", description: "근태 모드를 설정하고 T&A 이벤트 로그를 수집합니다.", apis: ["ta", "event"], thumbnail: "logs", accent: "violet" },
  { slug: "door", title: "출입문 제어", description: "문을 구성하고 잠금·해제·강제개방을 제어합니다.", apis: ["door", "schedule"], thumbnail: "access", accent: "violet" },
  { slug: "schedule", title: "스케줄", description: "출입통제에 사용할 시간 스케줄과 휴일을 만듭니다.", apis: ["schedule"], thumbnail: "access", accent: "blue" },
  { slug: "action", title: "액션 트리거", description: "특정 이벤트에 반응해 장치가 수행할 동작을 설정합니다.", apis: ["action"], thumbnail: "config", accent: "cyan" },
  { slug: "thermal", title: "열화상", description: "열화상 카메라 옵션을 설정하고 온도 로그를 수집합니다.", apis: ["thermal", "event"], thumbnail: "device", accent: "burgundy" },
  { slug: "wiegand", title: "Wiegand", description: "Wiegand 포맷을 설정하고 외부 리더와 연동합니다.", apis: ["wiegand"], thumbnail: "config", accent: "blue" },
  { slug: "apb", title: "Anti-passback", description: "Anti-passback zone을 구성해 재진입을 제어합니다.", apis: ["anti-passback-zone", "door"], thumbnail: "access", accent: "burgundy" },
  { slug: "server", title: "서버 매칭", description: "장치 인증 요청을 서버에서 처리하는 흐름을 구현합니다.", apis: ["server", "auth", "user"], thumbnail: "overview", accent: "cyan" },
  { slug: "status", title: "상태 표시", description: "상태별 LED와 buzzer 동작을 구성합니다.", apis: ["status"], thumbnail: "config", accent: "violet" },
  { slug: "sync", title: "사용자 동기화", description: "여러 장치에 사용자 정보를 일관되게 동기화합니다.", apis: ["user", "connect"], thumbnail: "user", accent: "blue" },
];

export function getTutorialMeta(slug: string) {
  return tutorials.find((t) => t.slug === slug);
}

// 특정 API를 사용하는 튜토리얼 목록 (API Reference -> Examples 역링크)
export function getTutorialsForApi(apiSlug: string) {
  return tutorials.filter((t) => t.apis.includes(apiSlug));
}
