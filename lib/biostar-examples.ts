import { getBiostarApi, type BiostarEndpoint, type BiostarGroup, type BiostarProduct } from "./biostar-doc";

// Postman collection 데이터로부터 실행 가능한 호출 예제(cURL / JavaScript)를 생성합니다.
// endpoint의 method·path·body가 이미 구조화돼 있어 기계적으로 변환합니다.

const SERVER = "https://YOUR_SERVER";

function isLogin(e: BiostarEndpoint): boolean {
  return /\/api\/login\b/.test(e.path) || /login/i.test(e.name);
}

// body 예시를 보기 좋게 정규화(과한 들여쓰기 정리, 빈 줄 제거)
function normalizeBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body.trim();
  }
}

export function genCurl(e: BiostarEndpoint): string {
  const needsSession = !isLogin(e);
  const lines = [`curl -X ${e.method} "${SERVER}${e.path}"`];
  lines.push(`  -H "Content-Type: application/json"`);
  if (needsSession) lines.push(`  -H "bs-session-id: $SESSION_ID"`);
  if (e.body) {
    const body = normalizeBody(e.body).replace(/\n/g, "\n  ");
    lines.push(`  -d '${body}'`);
  }
  return lines.join(" \\\n");
}

export function genFetch(e: BiostarEndpoint): string {
  const needsSession = !isLogin(e);
  const headers = [`    "Content-Type": "application/json",`];
  if (needsSession) headers.push(`    "bs-session-id": sessionId,`);
  const parts = [
    `const res = await fetch("${SERVER}${e.path}", {`,
    `  method: "${e.method}",`,
    `  headers: {`,
    ...headers,
    `  },`,
  ];
  if (e.body) {
    const body = normalizeBody(e.body).replace(/\n/g, "\n  ");
    parts.push(`  body: JSON.stringify(${body}),`);
  }
  parts.push(`});`, `const data = await res.json();`);
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Examples 페이지용 시나리오 구성: 인증 + 그룹별 CRUD 흐름을 자동으로 묶습니다.
// ---------------------------------------------------------------------------

export type ExampleStep = {
  endpointSlug: string;
  title: string;
  method: string;
  path: string;
  curl: string;
  fetch: string;
};

export type ExampleScenario = {
  slug: string;
  title: string;
  description: string;
  steps: ExampleStep[];
};

function toStep(e: BiostarEndpoint): ExampleStep {
  return { endpointSlug: e.slug, title: e.name, method: e.method, path: e.path, curl: genCurl(e), fetch: genFetch(e) };
}

// 그룹에서 CRUD 성격의 대표 endpoint를 순서대로 선별(목록→생성→조회→수정→삭제)
function pickCrud(group: BiostarGroup): BiostarEndpoint[] {
  const eps = group.endpoints;
  const find = (pred: (e: BiostarEndpoint) => boolean) => eps.find(pred);
  const picked: BiostarEndpoint[] = [];
  const add = (e?: BiostarEndpoint) => {
    if (e && !picked.includes(e)) picked.push(e);
  };
  add(find((e) => e.method === "GET" && e.pathParams.length === 0)); // 목록
  add(find((e) => e.method === "POST")); // 생성
  add(find((e) => e.method === "GET" && e.pathParams.length > 0)); // 단건 조회
  add(find((e) => e.method === "PUT" || e.method === "PATCH")); // 수정
  add(find((e) => e.method === "DELETE")); // 삭제
  return picked;
}

export function getExampleScenarios(product: BiostarProduct): ExampleScenario[] {
  const api = getBiostarApi(product);
  const scenarios: ExampleScenario[] = [];

  // 1) 인증: 로그인 endpoint 기반
  const authGroup = api.groups.find((g) => g.slug === "authorization");
  const login = authGroup?.endpoints.find((e) => isLogin(e));
  if (login) {
    scenarios.push({
      slug: "authentication",
      title: "인증 & 세션",
      description:
        "모든 API 호출 전에 로그인해 세션 ID를 발급받습니다. 응답 헤더의 세션 ID를 이후 모든 요청의 bs-session-id 헤더로 전달합니다.",
      steps: authGroup!.endpoints.filter((e) => isLogin(e) || /logout/i.test(e.name)).map(toStep),
    });
  }

  // 2) 그룹별 CRUD 흐름 (대표 리소스 중심)
  const featured = ["user", "device", "access-group", "doors", "cards", "events"];
  for (const slug of featured) {
    const g = api.groups.find((x) => x.slug === slug);
    if (!g) continue;
    const steps = pickCrud(g).map(toStep);
    if (steps.length === 0) continue;
    scenarios.push({
      slug: g.slug,
      title: `${g.title} 다루기`,
      description: `${g.title} 리소스의 대표 호출 흐름입니다. 로그인으로 발급한 세션 ID가 필요합니다.`,
      steps,
    });
  }

  return scenarios;
}
