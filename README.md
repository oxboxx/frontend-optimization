# 프론트엔드 성능 최적화 가이드

## 1장. 블로그 서비스 최적화

### 실행 방법

```bash
npm install
npm run serve
```

### 1. 이미지 사이즈 최적화

렌더링 사이즈인 `120*120`에 비해 실제 이미지 사이즈가 지나치게 크다. 레티나 디스플레이를 고려하여 실제 이미지 사이즈를 `240*240`으로 줄였다. 이미지 사이즈는 이미지 CDN을 활용하여 조절할 수 있는데, 여기서는 `Unsplash` 서비스를 일종의 이미지 CDN처럼 활용했다.

### 2. 병목 코드 최적화

특수문자를 제거하는 `removeSpecialCharacter` 함수의 로직을 개선했다. `substring`과 `concat` 대신 `replace` 함수와 정규표현식을 활용하여 특수문자를 제거했다. 또한 모든 글 데이터를 검사하지 않고 실제 서비스에 사용되는 200자 정도만 잘라내서 탐색하도록 변경했다.

### 3. 코드 분할 & 지연 로딩

`react-syntax-highlighter`는 마크다운을 표시하는 데 필요한 라이브러리이므로 글 목록 페이지에서는 필요가 없다. 따라서 `lazy` 함수와 `Suspense`를 활용하여 해당 라이브러리가 필요할 때 로드가 되도록 코드 분할 및 지연 로딩 기법을 적용했다.

### 4. 텍스트 압축

파일을 압축하여 더 작은 크기의 번들을 제공한다. 여기서는 `serve`라는 라이브러리를 활용하여 파일을 `gzip`으로 압축해서 번들 사이즈를 줄였다.

## 2장. 올림픽 통계 서비스 최적화

### 실행 방법

```bash
npm install
npm run server
npm run start
```

### 1. 애니메이션 최적화

막대의 가로 길이를 변경할 때, 매번 리플로우가 일어나서 쟁크(jank) 현상을 일으키는 `transition: width` 대신 하드웨어 가속(GPU 가속)을 사용하는 `transition: transform`으로 변경했다.

### 2. 컴포넌트 지연 로딩

이미지 모달을 띄울 때 `react-image-gallery` 라이브러리를 사용하는데 이 라이브러리는 첫 화면부터 필요하지 않다. 따라서 `Suspense`와 `lazy` 함수를 이용하여 컴포넌트를 지연 로딩했다.

### 3. 컴포넌트 사전 로딩

위에서 이미지 모달 컴포넌트를 지연 로딩했는데, 이 방법은 첫 화면에서는 효과적이지만 모달을 띄울 때는 지연이 발생한다. 그래서 모든 컴포넌트가 로딩된 이후 이미지 모달을 로드하도록 `useEffect` 내부에서 이미지 모달 컴포넌트를 사전 로딩했다.

### 4. 이미지 사전 로딩

이미지 모달의 첫 이미지 사이즈가 커서 이미지가 늦게 뜬다. 이미지 모달을 사전 로드하는 `useEffect` 내부에서 자바스크립트 이미지 객체를 생성하여 이미지를 사전 로드했다. 사전 로드는 `const img = new Image(); img.src = '이미지 주소'` 이와 같은 코드를 사용하여 구현했다.

## 3장. 홈페이지 최적화

### 실행 방법

```bash
npm install
npm run build
npm run pruge
npm run serve
```

### 1. 이미지 지연 로딩

첫 화면에 보이는 비디오의 크기가 크기 때문에 비디오 로딩에 우선순위를 두고 이미지에는 지연 로딩을 적용했다. `Intersection Observer API`를 활용하여 이미지 요소가 화면에 들어왔을 때 로딩되도록 설정했다.

### 2. 이미지 사이즈 최적화

렌더링 최대 사이즈인 `300*300`에 비해 이미지 사이즈가 과도하게 커서 이미지 사이즈를 `600*600`으로 줄였다. 또한 브라우저 호환성에 따라 `webp`와 `jpeg` 두 가지 포맷을 제공하여 포맷을 최적화를 했다.

### 3. 동영상 최적화

첫 화면의 비디오가 단순히 배경 동영상으로 활용되는 것에 비해 동영상 용량이 지나치게 크다. 비트레이트를 512kbps로 줄이고 오디오를 제거하여 용량을 줄였다. 이미지와 마찬가지로 브라우저 호환성에 따라 `webm`과 `mp4` 두 가지 포맷을 제공했고, 저하된 화질은 `filter: blur(10px)`과 `TailwindCSS`의 `bg-texture` 필터를 사용해서 보완했다.

### 4. 폰트 최적화

`ttf` 포맷을 `woff`와 `woff2` 포맷으로 변경하여 폰트 파일 크기를 줄였다. 실제로 사용하는 문자의 폰트만 가지도록 서브셋 폰트로 만들어 파일 크기를 더욱 줄였다. `fontfaceobserver` 라이브러리를 사용하여 폰트 파일이 로드되면 페이드 인 애니메이션과 함께 나타나도록 설정했다.

### 5. 캐시 최적화

서버에서 `Cache-Control` 헤더를 설정하여 캐시를 적용했다. HTML 파일은 `no-cache`로 설정했고, JS, CSS, 이미지 파일은 `public, max-age=31536000`, 나머지는 `no-store`로 설정했다.

### 6. 불필요한 CSS 제거

`PurgeCSS`를 활용하여 불필요한 CSS를 제거했다. 최신 버전의 `TailwindCSS`에서는 자동으로 `purge`를 수행하기 때문에 이러한 작업을 수행하지 않아도 된다.

## 4장. 이미지 갤러리 최적화

### 실행 방법

```bash
npm install
npm run server
npm run start
```

### 1. 레이아웃 이동 피하기

부모 요소에서 가로 세로 비율을 명시함으로써 CLS를 방지했다. 학습의 목적으로 `aspect-ratio` 대신 `padding`을 이용한 전통적인 방식으로 구현했다.

### 2. 이미지 지연 로딩

이번에는 `Intersection Observer API`로 직접 구현하지 않고 `react-lazyload` 라이브러리를 사용했다. `offset={1000}` 옵션을 주어 1000px만큼 미리 로드하도록 설정했다.

### 3. 리덕스 렌더링 최적화

`useSelector`로 구독한 상태를 가져올 때, `shallowEqual`로 비교하여 리렌더링을 방지했다. 중첩 객체가 존재하여 `shallowEqual`로도 동등 비교가 불가능할 경우에는 상태를 저장하는 로직 밖에서 새로운 객체를 생성했다.

### 4. 병목 코드 최적화

이미지의 평균 픽셀 값을 계산하는 `getAverageColorOfImage` 함수의 로직을 개선하여 로딩 시간을 줄였다. 큰 이미지 대신 작은 이미지를 계산하고, 메모이제이션을 활용했다.
