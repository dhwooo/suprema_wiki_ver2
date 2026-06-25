# AI 친화 문서 재정비 계획

## 배경
이 위키는 AI(코딩 에이전트)가 G-SDK Python 통합 코드를 짤 때 참조하는 문서.
현재 용어/메뉴가 제각각이고, "어떻게 호출하나"(실행 코드)가 없음.

## 확정 방향
- IA 3축 통일: **Guides**(개념) / **API Reference**(메서드·타입) / **Examples**(Python 코드)
- Examples = g-sdk `docs/_tutorials/python/` 18개 기반 단계별 Python 코드 + 한국어 설명
- Home = 3축 진입점으로 재정비
- 코드는 영어, 설명은 한국어 (API Reference와 동일 원칙)
- API Reference 메서드 ↔ Examples 상호 연결
- 검증: Examples 코드의 메서드/타입이 API Reference 데이터와 정합

## 작업 단계
1. [ ] Python 튜토리얼 18개 다운로드 → content/g-sdk-tutorials/
2. [ ] 튜토리얼 파서 lib/gsdk-tutorial.ts (front matter + 단계 heading + prose + code블록)
3. [ ] CodeBlock에 python/shell 하이라이트 추가
4. [ ] /examples 라우트 (인덱스 + [slug] 상세)
5. [ ] user 튜토리얼 1개로 렌더 검증
6. [ ] 한국어 번역 (워크플로우, 코드 보존)
7. [ ] 헤더/페이지 용어 통일 (API Reference / Examples / Guides)
8. [ ] Home 3축 재정비
9. [ ] API ↔ Examples 상호 링크
10. [ ] 정합성 검증

## 현재 진행: 1~5 (Examples 골격 + 시연)
번역/용어/Home/연결은 골격 검증 후 순차.

---

# Biostar 2 / X API Reference 재구축

## 배경
현재 Biostar 파트(`lib/biostar-reference.ts`)는 손으로 쓴 그룹 카드 + 예시 step 뿐.
실제 endpoint/스키마 0건 → AI가 통합 코드를 못 짬. G-SDK API Reference 수준으로 재구축.

## 확정 방향 (사용자 합의)
- **데이터 소스: 공식 Postman collection JSON 파싱** (G-SDK의 Jekyll md 파서와 동형 패턴)
  - BS2: `https://bs2api.biostar2.com/api/collections/18574376/UVsLQ69e?segregateAuth=true&versionTag=latest` (308 endpoints)
  - BSX: `https://docs.supremainc.com/specs/bsxapi-postman-collection.json` (315 endpoints)
  - 저장: `content/biostar/bs2.postman.json`, `content/biostar/bsx.postman.json` (확보 완료)
- **BS2 / BSX 동시 작업** — 두 collection이 동일 스키마(그룹·endpoint 구조 거의 일치) → 파서 1개로 처리
- endpoint 데이터: name / HTTP method / path({{baseUrl}} 정리) / description(md→html) / headers / request body example / response examples(status·code·body)
- 번역: 그룹/endpoint 설명만 한국어 후순위, URL·example은 영어 유지 (코드 영어 원칙)

## 작업 단계
1. [x] 두 Postman collection 확보 → content/biostar/
2. [x] 파서 lib/biostar-doc.ts (collection→groups→endpoints, {{var}}·baseUrl 정리, BS2=HTML/BSX=md 분기, sanitize)
3. [x] REST 렌더러 components/biostar-doc.tsx (MethodBadge·path·params·request body·responses + 인덱스 본문)
4. [x] 라우트: 2·x api-reference 인덱스 실데이터 교체 + [slug] 상세 (generateStaticParams로 623개 SSG)
5. [x] 사이드바 components/biostar-sidebar.tsx (그룹 → endpoint 네비)
6. [ ] 검색 인덱스(lib/search.ts) 연결 — 현재 placeholder 기반, 실 endpoint로 교체 필요
7. [ ] placeholder(lib/biostar-reference.ts) 정리 — landing/examples/search가 아직 의존
8. [x] 빌드 검증: build OK(712 pages), lint OK, 타입체크 OK

## 검증 결과
- BS2 26 groups / 308 endpoints, BSX 26 groups / 315 endpoints
- slug 유니크, path에서 baseUrl·호스트 제거 정상, desc 이중이스케이프 없음

---

# 라이트/다크 토글 (완료)
- next-themes + components/theme-provider.tsx, theme-toggle.tsx(헤더), layout Provider 래핑
- globals.css semantic 토큰(bg/surface/raised/hover/active/edge/edge-strong/text/secondary/muted/faint/link), :root,.dark 기본 + .light 스왑
- 31개 파일 564곳 다크 하드코딩 → 토큰 (병렬 5 에이전트), 잔존 0
- build/lint OK

# 한국어 번역 (완료)
- 방식: 원문 추출(scripts/biostar-ko-extract.ts) → 30청크 병렬 번역(executor) → 머지(biostar-ko-merge.ts) → content/biostar/{bs2,bsx}.ko.json 오버레이
- 파서(lib/biostar-doc.ts) loadKo/applyKo로 원본 collection 불변 머지
- 커버리지 100%: bs2 308/308, bsx 315/315, 그룹명·endpoint명·설명·파라미터 설명 전부 한국어, 용어집 일관
- UI 레이블 한국어화(요청 본문/응답/파라미터/개요)
- fixPipeTables: 마크다운 파이프 테이블이 평문으로 뭉친 것 → <table> 복원 (bs2 155, bsx 106 endpoint)
- _kosrc/_kotrans는 중간산물(.gitignore)

# 사이드바 accordion (완료)
- components/biostar-sidebar.tsx(server, 데이터) + biostar-sidebar-nav.tsx(client accordion)
- endpoint 623개 전부 펼침 → 26 그룹 헤더 접기, 활성 endpoint 그룹만 기본 펼침, method 색상 표시

# Examples Postman 자동 생성 (완료)
- lib/biostar-examples.ts: genCurl/genFetch(endpoint→cURL·JS fetch), getExampleScenarios(인증 + 그룹별 CRUD)
- endpoint 상세 페이지: "코드 예제" 섹션(cURL+JS) 자동 추가 (전체 623개)
- examples 페이지 재구성: 7 시나리오(인증/사용자/장치/액세스그룹/도어/카드/이벤트) × 단계별 코드, 각 단계 → API Reference 연결
- components/biostar-examples-view.tsx

# 남은 선택 작업
- lib/search.ts 검색을 placeholder 대신 실제 623 endpoint로 연결
- lib/biostar-reference.ts placeholder 정리(landing은 아직 의존)
