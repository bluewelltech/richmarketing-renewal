export const CONSULT_URL = 'https://tally.so/r/7Ryg2R';
const imagekit = 'https://ik.imagekit.io/suelle/rich/';
const cafe24 = 'https://ecimg.cafe24img.com/pg2535b99666738022/bluewelltech/';

export const heroImages = [
  { src: `${imagekit}medical_moz.png`, alt: '임상 데이터 광고 예시', label: '임상 데이터' },
  { src: `${imagekit}before&after_moz.png`, alt: '비포·애프터 광고 예시', label: '비포·애프터' },
  { src: `${imagekit}shortform_moz.png`, alt: '인플루언서 숏폼 광고 예시', label: '인플루언서 숏폼' },
];
export const patentImages = Array.from({ length: 5 }, (_, i) => ({
  src: `${imagekit}${i + 1}.jpg`, alt: `브랜드 특허출원 기술 활용 사례 ${i + 1}`,
}));
export const media = {
  certificate: `${cafe24}sssssssss.png`,
  video: `${cafe24}PATENTGIF.gif`,
  detail: `${cafe24}patentimage.png`,
  ctr: `${cafe24}CTR_image_precise_transparent.png`,
  logo: 'https://ik.imagekit.io/suelle/%EB%A1%9C%EB%AC%B8/%EB%A1%9C%EB%AC%B8%EB%B8%94%EB%9E%99.png',
};
export const figmaAsset = (name: string) => `${import.meta.env.BASE_URL}figma/${name}.svg`;

export const packages = [
  { count: 1, label: '단품', title: '특허 소재 1건', price: 45, total: 45 },
  { count: 4, label: '브랜드사 추천', title: 'IP 마케팅 패키지', price: 25, total: 100 },
];
export const patentExamples = [
  '진피 탄력 밀도 증진 및 주름 깊이 감소를 위한 PDRN, 콜라겐 복합 화장료 조성물 및 제조방법',
  '피부 광학 투명도 강화 및 산화성 색소침착 완화를 위한 글루타티온, 나이아신아마이드 복합 화장료 조성물 및 제조방법',
  '체지방 축적 억제 및 에너지 소비 촉진을 위한 녹차추출물, L-카르니틴 복합 식품 조성물 및 제조방법',
  '식후 혈당 항상성 유지 및 탄수화물 대사 활성화를 위한 여주추출물, 바나바잎추출물 복합 식품 조성물 및 제조방법',
];
