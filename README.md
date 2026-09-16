# RICH MARKETING · 리치마케팅

Figma 디자인을 바탕으로 구현한 리치마케팅 랜딩페이지입니다. **React + TypeScript + Vite**, 일반 CSS를 사용합니다.

## VS Code에서 실행하기

1. 이 `rich-marketing` 폴더를 VS Code의 **파일 → 폴더 열기**로 엽니다.
2. **터미널 → 새 터미널**을 엽니다.
3. 아래 명령을 순서대로 실행합니다. Node.js 24 LTS를 권장합니다.

```bash
npm install
npm run dev
```

터미널에 표시된 **http://localhost:5173** 또는 **http://127.0.0.1:5173**을 엽니다.

이 프로젝트의 `index.html`은 Vite 진입점입니다. 파일을 더블클릭하거나 Live Server 확장으로 여는 대신 `npm run dev`를 사용하세요.

### 배포용 파일 만들기

```bash
npm run build
npm run preview
```

`dist/`에 생성된 파일이 실제 배포 파일입니다. 저장소의 하위 경로에서도 작동하도록 상대 경로를 사용합니다.

## 구현 범위

- Figma의 14개 본문 섹션과 푸터, 1440px 기준 본문 폭 1120px
- 디자인의 어두운 배경, 파란색 광원, 카드 테두리·그림자
- 밝은 배경의 형광 밑줄 제거, 어두운 배경의 강조 문구 바로 아래에 글자 길이를 따르는 얇은 밑줄 적용
- 프리텐다드 가변 폰트 파일 자체 호스팅: 가벼운 도입 300, 본문 400, 안내·중간 강조 600, 강조 700, 큰 제목 800·900
- 화이트·블루 중심의 강조색에 빨간 핵심 문구를 유지하고, 노란색은 가격·추천 배지·가격 선택 상태에만 사용
- 지정한 6개 영역의 강조 문구에 대각선 빛이 지나가는 텍스트 효과 적용: 6초 주기, 약 2초 이동 후 휴식. 모션 감소 설정에서는 효과 없이 원래 색으로 표시
- 핵심 구절을 묶고 의미 단위로 줄바꿈해 “전문 브랜드” 등 강조 문구가 중간에 끊기지 않도록 구성
- 320px 이상 모바일·태블릿·데스크톱 반응형 레이아웃
- 상단 이미지 3종: 1.6초 자동재생, 무한 반복, 드래그·스와이프, 340ms 이동
- 특허 사례 5종: 2.4초 자동재생, 중앙 확대, 무한 반복, 드래그·스와이프, 340ms 이동
- 드래그 종료 후 3초간 자동재생 일시정지 후 재개
- 가격표: 화면 전체 너비의 어두운 섹션에 1건·4건 두 카드, 추천 배지·큰 가격·총액 표시. 선택 시 6px 이동, 테두리와 선택 상태 강조
- 진행 과정: 스크롤 진입 시 01→04 순서, 140ms 간격, 520ms fade-up, 한 번 재생
- 진행 과정 01~04의 배경·테두리를 동일한 검은색 카드로 통일
- 기존 Tally 상담 링크 연결, 새 창 열기
- 이미지 로딩 실패 시 빈 공간 유지
- 결과물 이미지: 가로로 넓힌 프레임에 원본 비율 그대로 표시
- CTR 이미지: 검은 배경과 고정 높이 제거, 원본 비율과 얇은 테두리 적용
- 키보드 탐색, 명확한 포커스, 모션 감소 설정 지원

가격 카드는 **선택 효과**를 제공합니다. 결제나 신청서 제출 기능은 연결되어 있지 않으며, 상담 신청 버튼을 누르면 기존 Tally 신청서가 열립니다.

### 슬라이드 조작

드래그·스와이프하거나, 캐러셀에 키보드 포커스를 둔 뒤 좌우 방향키를 누르면 이동합니다. 슬라이드 위의 조작 버튼은 표시하지 않습니다. 키보드 조작 중에는 자동재생을 멈춥니다. 화면 밖의 캐러셀과 숨겨진 브라우저 탭에서는 재생을 쉬며, 모션 감소 설정에서는 자동재생을 끕니다.

## 수정할 파일

| 변경할 내용 | 파일 |
| --- | --- |
| 본문 문구·섹션 구성 | `src/App.tsx` |
| 이미지 URL·상담 링크·가격 | `src/data.ts` |
| 폰트 크기·색상·간격·반응형 | `src/styles.css` |
| 자동 슬라이드·드래그 | `src/components/Carousel.tsx` |
| 가격 선택 동작 | `src/components/Pricing.tsx` |
| 진행 과정·스크롤 효과 | `src/components/Process.tsx` |
| 페이지 제목·검색 설명 | `index.html` |

색상은 `src/styles.css` 상단의 CSS 변수에서 바꿀 수 있습니다. 이미지 URL을 교체할 때는 `src/data.ts`만 수정하면 됩니다. 가격을 바꿀 때는 패키지 데이터와 하단의 “25~45만원” 설명 문구도 함께 확인하세요.

## 디자인과 원본 자료

- [Figma 기준 디자인](https://www.figma.com/design/IEHtqRarePl3hP549WllK3/RICH-MARKETING-Landing-Redesign?node-id=1-2)
- 기능 명세: Figma의 `WEB MOTION SPECS / RICH LANDING` 프레임
- 이미지 URL·상담 링크·사무소 정보: 제공된 기존 HTML
- 원본 HTML의 CSS를 누적 복사하지 않고, 섹션과 공통 컴포넌트로 새로 구성했습니다.
- **가격은 사용자 요청에 따라 1건·4건만 표시**합니다. 1건 45만원 / 4건 패키지 건당 25만원, 총 100만원입니다.
- **CTR 이미지 영역은 기존 HTML의 실제 성과 이미지**를 사용합니다. Figma의 설명용 막대 그래프와 이 부분의 이미지 내용은 다릅니다.
- **푸터 로고도 원본 HTML의 이미지**를 사용합니다. Figma의 텍스트 임시 로고와 모양이 다릅니다.
- Figma의 Noto Sans KR는 요청에 따라 전체 웹 텍스트를 Pretendard로 교체했습니다. 원본 이미지에 포함된 글자는 이미지 그대로 표시합니다.
- 기준 디자인 구현 후 사용자 피드백을 반영해 강조선, 이미지 프레임, 슬라이드 속도, 강조 색상, 줄바꿈, 가격표, 폰트 굵기를 조정했습니다.
- 모바일 전용 Figma 프레임은 없어 데스크톱 디자인을 기준으로 반응형 규칙을 추가했습니다.

Figma에서 받은 아이콘과 광원 SVG는 `public/figma/`에 저장되어 있어 만료되는 Figma 이미지 주소에 의존하지 않습니다. 콘텐츠 이미지는 요청대로 원본 URL을 사용하므로, 외부 이미지 서버의 변경·삭제는 사이트에 반영됩니다. 실패한 이미지는 대체 문구 없이 빈 공간으로 남습니다.

Pretendard의 라이선스는 `public/fonts/OFL.txt`에 포함했습니다. [Pretendard 공식 저장소](https://github.com/orioncactus/pretendard), [Vite 실행 안내](https://vite.dev/guide/)

## GitHub에 올리기

이 폴더를 저장소의 최상위 폴더로 사용합니다. `node_modules/`, `dist/`, 테스트 결과, 로컬 환경 변수는 `.gitignore`로 제외됩니다. `package-lock.json`과 `public/`은 함께 올립니다.

처음 저장소를 연결할 때:

```bash
git init -b main
git add .
git commit -m "Build Rich Marketing landing page"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

`YOUR_ACCOUNT/YOUR_REPOSITORY`는 본인의 빈 GitHub 저장소로 바꾸세요. 로컬 저장소가 이미 초기화되어 있으면 첫 번째 명령은 생략합니다. 원격 저장소 생성과 업로드는 이 작업에서 실행하지 않았습니다.

### GitHub Pages 배포

1. GitHub 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 선택합니다.
2. **Actions → Deploy GitHub Pages → Run workflow**를 실행합니다.
3. 완료 후 해당 실행에 표시된 사이트 주소를 엽니다.

배포는 수동 실행 방식입니다. 코드 업로드만으로 배포되지 않습니다. `Check website` 워크플로는 main 브랜치 푸시와 PR에서 빌드·테스트를 검사합니다.

## 검사

```bash
npm run typecheck
npm run build
npx playwright install chromium
npm test
```

데스크톱·모바일 Chromium에서 캐러셀 반복 이동, 자동재생, 드래그 후 재개, 가격 선택, 이미지 오류 처리, 모션 감소 설정, 스크롤 효과, 상담 링크, 반응형 넘침을 검증합니다.

기존 HTML의 Meta Pixel은 포함하지 않았습니다. 현재 프런트엔드에서 별도 분석 이벤트나 고객정보를 수집하지 않습니다. 상담 접수는 기존 Tally에서 처리합니다.
