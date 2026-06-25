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
