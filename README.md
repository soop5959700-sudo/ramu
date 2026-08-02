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

게시글에는 사이트 주소를 그대로 넣습니다.

```html
<div data-soop-custom-block="true"><iframe src="https://ramuwiki.pages.dev/profile/" frameborder="0" id="pandaFrame" style="width:100%; height:2500px"></iframe></div>
```

### 앱에서는 모바일 배치입니다 (한계)

iframe 안에서는 브라우저가 `width=1180` 뷰포트 지정을 무시하기 때문에, 숲 앱 게시글에서는
모바일 배치로 그려집니다. 이를 우회하려고 `embed/` 래퍼(안쪽에 1180px 프레임을 두고 축소)를
만들었지만, **숲 앱이 중첩 iframe을 견디지 못하고 게시글을 무한히 다시 불러옵니다.**
그래서 게시글에는 페이지 주소를 그대로 넣고, 대신 앱 화면 상단에 **`PC 화면 ↗`** 버튼을 둡니다.
누르면 브라우저로 열리고, 브라우저에서는 PC 배치로 보입니다.

- `PC 화면 ↗` 버튼은 iframe 안일 때만 나오고 직접 접속 시에는 숨겨집니다.
- `embed/` 폴더는 남겨뒀습니다. 숲이 아닌 다른 곳(중첩 iframe이 문제없는 사이트)에 임베드할 때
  `배포주소/embed/?p=profile` 로 쓰면 PC 배치로 축소되어 나옵니다.
- 게시글 height는 2500 정도. 앱에서 세로 스크롤은 게시글 자체 스크롤로 처리됩니다.

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
