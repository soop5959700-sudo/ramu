# 라무 (RAMU) OFFICIAL — 사이트 저장소

메인(확정 커버) + 프로필 · 일정 · 노래책 · 업보 · 일기 · 옷장 + 관리자 + OBS 오버레이.

## 폴더 구조

```
index.html   style.css   main.css   site.js   fx.js   common.js   supabase.js
assets/                      메인 커버 이미지 (scene-*.webp)
profile/  schedule/  song/  work/  diary/  dress/    각 index.html
admin/index.html             관리자 (Supabase Auth 로그인)
overlay/index.html           OBS "지금 트는 노래"
supabase_setup.sql           DB 표 + 권한(RLS) — SQL Editor에서 실행
.github/workflows/keepalive.yml
```

## 셋업 (순서 중요)

1. **Supabase 새 프로젝트** 생성 → Settings → API에서 `프로젝트 ID` · `anon public 키` 복사
2. **관리자 계정 먼저**: Authentication → Users → Add user (이메일·비밀번호, **Auto Confirm User 켜기**)
3. **SQL 실행**: SQL Editor에 `supabase_setup.sql` 전체 붙여넣고 Run
   - 순서를 바꾸면 쓰기 권한이 잠겨 관리자에서 저장이 안 됩니다
4. **키 채우기 — 완료됨** (`supabase.js` 2줄 · `overlay/index.html` 1줄에 프로젝트 `lmpjvujabtqbygkynejf` 값이 이미 들어가 있습니다)
5. **GitHub 업로드** — 폴더 구조 그대로 (`.github/workflows/` 포함)
   - 저장소 Settings → Secrets에 `SUPABASE_URL`(`https://프로젝트ID.supabase.co`), `SUPABASE_ANON` 추가하면 keepalive가 무료 플랜 일시정지를 막아줍니다
6. **Cloudflare Pages** — Connect to Git → 빌드 설정 비움(Framework=None) → Deploy
7. **관리자 접속** — `배포주소/admin/` → 2번 계정으로 로그인

## SOOP 게시글 임베드

```html
<iframe height="2400" scrolling="no" src="배포주소" style="width:100%;border:0;display:block;"></iframe>
```

임베드에서는 메인 커버가 **16:9 비율로 고정**됩니다. iframe 높이를 몇으로 적든 사진 구도가
늘어나지 않고, 남는 높이는 아래쪽 여백으로만 남습니다(스크롤 안 생김).

| 용도 | 권장 height |
|---|---|
| 메인 커버만 | **폭 × 0.5625 정도** (폭 1000이면 570 전후 — 여백 0) |
| 서브 페이지까지 오갈 때 | **2400** (서브 스크롤 확보. 메인은 그대로 16:9 유지) |

한 값만 적어야 하면 높은 쪽(2400)이 안전합니다 — 여백이 남는 편이 스크롤 두 개보다 낫습니다.

## 관리자에서 바꿀 수 있는 것

- 🏠 메인: 프사(SOOP 자동/직접 URL) · 메인 화면 문구(제목/주간 표/캡션/LIVE 버튼) · 프로필 정보 · 좋아/싫어 · 방송 요일 · 링크
- 🎀 프로필: 한마디 · About · NOW · 능력치 · 목표 · TMI · 다시보기 VOD
- 📅 일정: 달력 일정(기간 띠 지원 — 종료일 입력) · 8색 · 하이라이트
- 🎵 노래책 · ⚡ 업보 · 📔 일기 · 👗 옷장 · ✉️ 문의함
- 🎨 테마: 색 6종 + 글자 크기 4단 배율 (저장 즉시 전 페이지 반영)

## 밝기 토글

상단 메뉴의 세로형 토글로 어두운 화면 ↔ 밝은 화면을 바꿉니다.
기본값은 어두운 화면이고, 선택한 값은 `localStorage`에 저장돼 페이지를 옮겨도 유지됩니다.

## 규칙 몇 가지

- 방송 요일 값은 `0=월 … 6=일`
- 옷장 분류를 바꾸면 세 곳 동시 수정: `dress/index.html`의 `CATS` + admin `select#dr-cat` + admin `DRESS_CATS`
- 노래 장르를 바꾸면 두 곳: `song/index.html`의 `GENRES` + admin `select#song-genre`
- 이미지는 링크 방식 — SOOP 비공개 게시판 업로드 후 "이미지 주소 복사"
