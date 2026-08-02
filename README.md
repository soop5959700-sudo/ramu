# 라무 (RAMU) OFFICIAL — 사이트 저장소

메인(확정 커버) + 프로필 · 일정 · 노래책 · 업보 · 일기 · 옷장 + 관리자 + OBS 오버레이.

## 폴더 구조

```
index.html   style.css   main.css   site.js   fx.js   common.js   supabase.js
assets/                      메인 커버 이미지 (scene-*.webp)
profile/  schedule/  song/  work/  diary/  dress/    각 index.html
embed/index.html             SOOP 게시글용 래퍼 (PC 배치를 폭에 맞춰 축소)
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

## 모바일에서도 PC 화면

각 페이지의 `<meta name="viewport" content="width=1180">` 때문에 **폰에서도 PC와 같은 배치**로
그려진 뒤 화면 폭에 맞춰 축소됩니다. 카테고리가 햄버거로 접히지 않고 상단에 그대로 나옵니다.
글자가 작으면 브라우저에서 손가락으로 확대하면 됩니다.

- 폭을 바꾸려면 전 페이지의 `content="width=1180"` 숫자만 고칩니다(작게 할수록 크게 보임).
- 폰에서는 커버가 16:9로 고정되고 화면 세로 가운데에 놓입니다.
- 브라우저 글자 자동확대(text boost)는 `style.css`의 `text-size-adjust:100%` 로 껐습니다.
  이걸 켜면 카드 폭은 그대로인데 글자만 커져 칸을 넘칩니다.

## SOOP 게시글 임베드

게시글 주소는 **그냥 배포주소** 그대로 두면 됩니다. 폭이 좁은 프레임(숲 앱)에서 열리면
페이지가 자동으로 `embed/` 래퍼로 넘어가 PC 배치로 다시 그립니다. 처음부터 `배포주소/embed/`
를 넣어도 결과는 같습니다.

```html
<iframe height="2400" scrolling="no" src="배포주소/embed/" style="width:100%;border:0;display:block;"></iframe>
```

`embed/`는 사이트를 감싸는 얇은 래퍼입니다. 하는 일:

- **폭이 980px 이상**(PC 게시글) → 사이트를 그대로 1:1로 보여줍니다
- **폭이 980px 미만**(숲 앱·모바일) → 사이트를 **1180px PC 배치로 그린 뒤 폭에 맞춰 축소**합니다
  숲 앱은 iframe 폭을 폰 화면 폭으로 주기 때문에, 그냥 넣으면 미디어쿼리가 모바일 배치를 고릅니다.
  래퍼 안에서는 화면 폭과 무관하게 항상 PC 배치가 나옵니다. (글자가 작으니 앱 우측 상단 🔍 확대 사용)
- 안쪽에서 페이지를 이동하면 높이를 다시 재서 맞춥니다.

첫 화면을 지정하려면 `배포주소/embed/?p=profile` (`profile schedule song work diary dress`).

축소 배율을 바꾸려면 `embed/index.html` 위쪽 두 값만 고치면 됩니다.

```js
var DESIGN = 1180;   // 앱에서 그릴 화면 폭 (작게 할수록 글자가 커짐)
var WIDE   = 980;    // 이 폭 이상이면 축소 없이 1:1
```

| 상황 | 게시글 height |
|---|---|
| PC·모바일 한 글에서 같이 | **2400** (PC 기준 가장 긴 프로필 페이지가 안 잘리는 값) |
| 모바일만 볼 글 | 1000 정도면 충분 (폰에서 가장 긴 프로필이 약 860) |

폰에서는 콘텐츠가 짧아 아래에 어두운 여백이 남습니다. 배경색이 사이트와 같아 이어져 보입니다.

전환 조건은 **iframe 안 + 폭 980px 미만** 두 가지입니다. 폰 브라우저로 주소를 직접 열면
(iframe이 아니므로) 기존 모바일 배치가 그대로 나옵니다.

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
