import { BookShowcase } from './components/BookShowcase';
import { ConsultSteps } from './components/ConsultSteps';
import { Carousel } from './components/Carousel';
import { ConsultLink } from './components/ConsultLink';
import { Pricing } from './components/Pricing';
import { Process } from './components/Process';
import { SafeImage } from './components/SafeImage';
import { Glow, Section } from './components/Section';
import { figmaAsset, heroImages, media, patentImages } from './data';

const reactions = [
  { icon: 'Bulb', title: <>“특허출원 기술이라고?”</>, body: <>제품의 차별화 요소를<br />{' '}실제 특허출원 내용으로 구체화했다는 점을<br />{' '}보여줄 수 있습니다.</> },
  { icon: 'PatentDocument', title: <>“제품 하나에 이런 특허까지<br />{' '}출원했다고?”</>, body: <>제품의 성분, 배합, 작용원리 등을<br />{' '}기술적인 관점에서 보여줄 수 있습니다.</> },
  { icon: 'Search', title: <>“제품의 특징을”</>, body: <>특허 관점에서 구조화하여<br />{' '}설명할 수 있습니다.</> },
  { icon: 'Cart', title: <>“단순히 과대광고만 하는<br />{' '}제품은 아닌 것 같은데”</>, body: <>단순한 광고 문구를 넘어,<br />{' '}제품의 구매 이유를 기술적인 관점에서<br />{' '}보여줄 수 있습니다.</> },
];

export default function App() {
  return <>
    <a className="skip-link" href="#main">본문 바로가기</a>
    <main id="main">
      <Section id="intro" theme="dark" className="hero" nodeId="1:3" glow="1-3-imgEffectBlueSpotlight">
        <header className="site-header">
          <a className="brand" href="#intro" aria-label="리치마케팅 처음으로"><strong>RICH MARKETING</strong><span>특허출원 기반 프리미엄 차별화 마케팅</span></a>
          <ConsultLink compact />
        </header>
        <p className="hero__kicker">요즘 대부분 브랜드들을 보면</p>
        <h1 className="text-shimmer text-shimmer--diagonal">임상 데이터<br />비포·애프터<br />인플루언서</h1>
        <p className="hero__sub">이제는 모두 비슷하게 하고 있습니다.</p>
        <Carousel variant="hero" slides={heroImages} label="광고 소재 예시" interval={1600} initial={1} />
        <div className="hero__message">
          <p>문제는, 소비자 눈에도<br /><strong className="text-blue">모든 제품이 다 비슷해 보인다는 겁니다.</strong></p>
          <p>비슷한 광고, 비슷한 효능, 비슷한 데이터 속에서<br />소비자가 한 번 더 멈춰보고,<br />제품을 한 번 더 들여다보게 만드는<br /><strong className="text-accent">새로운 차별점이 필요합니다.</strong></p>
        </div>
      </Section>

      <Section id="patent" theme="dark" className="solution" nodeId="1:17" glow="1-17-imgEffectSolutionAura">
        <p className="solution__intro"><span className="copy-line"><strong className="text-blue">광고 영상과 상세페이지</strong>에서</span><span className="copy-line">“이 제품은 뭔가 다른가?”라는 호기심을 만들고</span><span className="copy-line">제품에 대한 기대감을 주는<br /><strong className="text-blue keep-together">새로운 소구 소재.</strong></span></p>
        <h2 className="solution__title"><strong className="text-blue text-shimmer">브랜드 특허출원 기술</strong><span>이라는 프레임입니다.</span></h2>
        <Carousel variant="patent" slides={patentImages} label="특허 활용 사례" interval={2400} initial={2} />
        <p className="solution__caption">대표님 제품도 위 예시처럼<br /><em className="text-accent text-blue keep-together">“특허출원 기술제품”</em>으로<br /><span className="keep-together">포지셔닝할 수 있습니다.</span></p>
      </Section>

      <Section id="reactions" className="reactions" nodeId="1:27" glow="1-27-imgGlowReferenceBlue">
        <h2 className="section-title"><span className="consumer-dots"><span>소</span><span>비</span><span>자</span></span>는 이렇게 <em>반응합니다.</em></h2>
        <div className="reaction-grid">{reactions.map((reaction, i) => <article className="reaction-card" key={reaction.icon}>
          <img src={figmaAsset(`1-27-imgHtmlVector${reaction.icon}`)} alt="" className="reaction-card__icon" width="44" height="44" />
          <span className="reaction-card__number">0{i + 1}</span>
          <h3>{reaction.title}</h3><p>{reaction.body}</p>
        </article>)}</div>
        <p className="legal-note">※ 특허출원은 특허청에 정식으로 진행되는 공식 절차이며, 제품의 기술적 특징과 차별화 요소를 특허문서로 구체화하는 과정입니다.<br />다만, 출원 사실만으로 기술적 우수성이 공식 인정되거나 독점적인 권리가 발생하는 것은 아닙니다.</p>
      </Section>

      <Section id="perception" theme="soft" className="perception" nodeId="1:49" glow="1-49-imgGlowReferenceBlue">
        <p className="eyebrow">특허출원이 만드는 가장 큰 차이</p>
        <h2 className="section-title">같은 제품이라도,<br />소비자가 받아들이는<br /><em>인식이 달라집니다.</em></h2>
        <div className="perception-grid">
          <article className="perception-card"><header className="perception-card__heading"><p className="perception-card__label">제품 포지션</p><p className="perception-card__subtitle">소비자의 제품 인식</p></header><p className="perception-card__before">“성분을 조합해 만든 일반적인 제품”이 아니라</p><h3>“효능과 작용원리까지 연구해 설계한 <em className="text-blue keep-together">기술제품</em>”</h3><p className="perception-card__note">으로 인식되도록 만듭니다.</p></article>
          <article className="perception-card"><header className="perception-card__heading"><p className="perception-card__label">브랜드 포지션</p><p className="perception-card__subtitle">소비자의 브랜드 인식</p></header><p className="perception-card__before">단순히 제품을 광고/판매하는 브랜드가 아니라</p><h3>“해당 분야의 효능을 집중적으로 연구하는 <em className="text-blue keep-together">전문 브랜드</em>”</h3><p className="perception-card__note">로 인식되도록 만듭니다.</p></article>
        </div>
        <p className="perception__conclusion"><span className="copy-line">그리고 그 인식의 차이는</span><span className="copy-line perception__keyline"><span className="keep-together"><em>“제품에 대한 호기심”</em>과</span> <span className="keep-together"><em>“효능에 대한 기대감”</em>을 높여,</span></span><span className="copy-line"><span className="keep-together">첫 구매 전환을 만들고</span><br /><span className="keep-together"><em>기존 타제품 사용자의 전환</em>까지</span> 유도합니다.</span></p>
      </Section>

      <Section id="consult" theme="dark" className="consult" nodeId="1:64" glow="1-64-imgGlowConsultFocus">
        <h2 className="section-title"><span className="text-accent text-blue text-shimmer"><span className="keep-together">“우리도 특허</span> <span className="keep-together">낼 수 있을까요?”</span></span></h2>
        <p className="consult__intro"><span className="copy-line">제품명이나 판매 링크만 보내주세요.</span><span className="copy-line">제품을 분석해 <strong className="text-blue">어떤 포인트를 강조할지부터</strong></span><span className="copy-line"><strong className="text-blue">어떤 특허를 출원하면 좋을지</strong>까지 설계해드립니다.</span></p>
        <ConsultSteps />
        <p className="consult__no-idea text-blue">직접 특허 아이디어를 준비하실 필요 없습니다.</p>
        <ul className="consult-benefits">{['평균 24시간 이내', '광고 소재 삽입 가능', '상세페이지 삽입 가능', '개인/회사 명의 출원 가능'].map(text => <li key={text}>{text}</li>)}</ul>
        <p className="consult__available">ODM, OEM, 사입, 위탁판매, 병행수입 대표님도<br />제품에서 특허출원할 수 있는 포인트를 발굴해드립니다.</p>
        <ConsultLink tone="light" />
        <p className="consult-note">평일·주말 접수 가능</p>
      </Section>

      <Section id="pricing" theme="dark" className="pricing" nodeId="1:91">
          <p className="pricing__kicker text-red text-shimmer"><span className="keep-together">지금 바로 광고·상세페이지에</span> <span className="keep-together">활용할 수 있는</span></p>
          <h2 className="section-title"><em className="text-blue text-shimmer">IP 마케팅 소재</em><br /><span className="text-shimmer text-shimmer--silver">구축 패키지</span></h2>
          <Pricing />
          <p className="pricing__description"><span className="copy-line"><span className="keep-together">제품의 <em className="text-blue">차별화 요소</em>를</span> <span className="keep-together"><em className="text-blue">특허 포인트</em>로 발굴하고,</span></span><span className="copy-line"><span className="keep-together">브랜드에 활용할 수 있는</span> <span className="keep-together"><em className="text-blue">IP 마케팅 소재</em>로 완성합니다.</span></span></p>
          <p className="legal-note">※ 본 서비스의 특허출원은 특허청을 통해 정식 출원 절차로 진행되며, 등록변리사가 직접 수행합니다.<br />RICH MARKETING(리치마케팅)은 로문특허법률사무소가 직접 운영하는 IP 서비스입니다.</p>
      </Section>

      <Section id="expertise" theme="dark" className="expertise" nodeId="13:2" glow="13-2-imgEffectExpertiseHalo">
        <img src={figmaAsset('13-2-imgHtmlVectorExpertConversation')} className="expertise__icon" width="68" height="68" alt="" />
        <p>코스메틱·건기식 브랜드를 다수 운영하며,<br />여러 브랜드를 성장시켜온</p>
        <h2><em className="text-blue text-shimmer">변리사 출신<br />K-뷰티 브랜드 대표가</em></h2>
        <p className="expertise__closing"><span className="text-accent"><em className="text-red text-shimmer">직접</em> 진행을 돕습니다.</span></p>
      </Section>

      <Section id="process" theme="soft" className="process" nodeId="1:104" glow="1-104-imgGlowReferenceBlue">
        <p className="eyebrow">진행은 이렇게 됩니다.</p>
        <h2 className="section-title">대표님은 <span className="keep-together"><em>제품명/서비스명</em>만</span><br /><span className="keep-together">알려주시면 됩니다.</span></h2>
        <Process />
      </Section>

      <Section id="problem" theme="dark" className="problem" nodeId="1:127">
        <h2 className="section-title">광고비는 많이 쓰는데,<br />왜 <em className="text-blue"><span className="keep-together">폭발적으로</span> <span className="keep-together">팔리지 않을까요?</span></em><br />왜 <em className="text-blue">‘비슷한 제품 중 하나’</em>로 보일까요?</h2>
        <p className="problem__description"><span className="copy-line">대부분의 <strong className="text-blue">건기식·코스메틱 시장</strong>은 이미 <strong className="text-blue keep-together">너무 비슷해졌습니다.</strong></span><span className="copy-line">성분, 임상데이터, 후기, 인플루언서, 비포애프터, 상세페이지 카피까지</span><span className="copy-line">소비자 눈에는 점점 비슷하게 보입니다.</span></p>
        <div className="problem__conclusion"><p>그래서 이제는 웬만한 광고 소재나 성분만으로는</p><strong>눈에 띄고, 클릭시키고,<br /><em className="text-accent text-red text-shimmer"><span className="keep-together">구매 전환까지 만드는 것이</span> <span className="keep-together">상당히 어려워졌습니다.</span></em></strong></div>
      </Section>

      <Section id="deliverables" className="deliverables" nodeId="1:132" glow="1-132-imgGlowReferenceBlue">
        <h2 className="section-title">결과물 예시</h2>
        <div className="deliverables-grid">
          <BookShowcase />
          <div className="deliverables__copy">
            <h3>다른 경쟁제품과 확실히 차별성을<br />강력하게 어필할 수 있는 것,<br /><em><span className="keep-together">“특허출원 기술”이라는</span> <span className="keep-together">프레임입니다.</span></em></h3>
            <p>특허출원서는 단순한 서류가 아닙니다.<br />광고 영상과 상세페이지에서<br />대표님 상품이 왜 다른지 보여주는<br /><strong><span className="text-red keep-together">강력한 마케팅 무기</span>가 됩니다.</strong></p>
            <ul className="deliverables__uses"><li>✓ 상세페이지에 “특허출원 기술” 문구 삽입</li><li>✓ 광고 영상 첫 장면 후킹 소재로 활용</li><li>✓ 경쟁제품과 다른 차별화 근거 확보</li></ul>
          </div>
        </div>
      </Section>

      <Section id="examples" theme="dark" className="examples" nodeId="1:143" glow="1-143-imgGlowProofHeadline">
        <h2 className="section-title">마케팅은,<br /><em className="text-red text-shimmer">남들이 아직 안 하는 걸</em><br />할 때 <em className="text-accent text-blue text-shimmer">터집니다.</em></h2>
        <div className="examples__description"><p>아직 대부분의 브랜드는<br /><strong className="text-blue">특허출원증명서</strong>와 <strong className="text-blue keep-together">독자기술 X종</strong>을<br />광고·상세페이지의 핵심 소재로 쓰지 않습니다.</p><p>그래서 지금, <strong className="text-blue keep-together">특허출원 기술 소재</strong>는<br />광고와 상세페이지에서 <strong className="text-red keep-together">강하게 먹힙니다.</strong></p></div>
        <div className="examples-grid">
          <Glow asset="1-143-imgDecorationProofGoldGlow" className="examples-glow" />
          <figure className="example-card"><div><SafeImage src={media.video} alt="특허출원증명서를 활용한 광고 영상" loading="lazy" /></div><figcaption>광고 영상 적용 예시</figcaption></figure>
          <figure className="example-card"><div><SafeImage src={media.detail} alt="특허출원 기술을 소개하는 상세페이지" loading="lazy" /></div><figcaption>상세페이지 적용 예시</figcaption></figure>
        </div>
      </Section>

      <Section id="results" theme="soft" className="results" nodeId="18:2" glow="18-2-imgGlowReferenceBlue">
        <h2 className="results__title"><span>동일 제품, 동일 모델, 동일 소재</span><span><span className="keep-together">딱 하나,</span> <span className="keep-together"><strong className="text-blue">‘특허출원 기술 4건’</strong> 소재로,</span></span><em className="text-shimmer text-shimmer--light">CTR이 폭발했습니다.</em></h2>
        <figure className="results-board"><SafeImage src={media.ctr} alt="동일 광고에 특허출원 기술 소재를 적용한 실제 CTR 비교 결과" width={5238} height={1837} loading="lazy" /></figure>
        <p className="results__note">*고객사의 요청에 따라 CTR 지수를 제외하고는 블라인드 처리했습니다.</p>
        <blockquote>“제품을 바꾼 것이 아니라,<br />제품을 바라보는 <em>‘관점’</em>을 바꿨습니다”</blockquote>
        <p className="results__closing"><span className="keep-together">소비자는 <em className="text-red">신선한</em> 광고 소재에</span> <span className="keep-together">반응합니다!</span></p>
        <ul className="results-chips">{['신선도 UP', '신뢰도 UP', '호기심 UP'].map(text => <li key={text}>{text}</li>)}</ul>
      </Section>

      <Section id="eligibility" className="eligibility" nodeId="1:158" glow="1-158-imgGlowReferenceBlue">
        <h2 className="section-title">직접 만든 제품이 아니어도<br /><em>괜찮습니다.</em></h2>
        <ul className="eligibility-types">{['ODM/OEM', '사입', '구매대행', '병행수입'].map((text, i) => <li key={text}><span>0{i + 1}</span><strong>{text}</strong></li>)}</ul>
        <div className="value-card"><h3><span className="keep-together">저비용으로, 오래 쓰는</span> <span className="keep-together">마케팅 자산을 만듭니다.</span></h3><p><span className="copy-line">단 <em>25~45만원</em>으로 일회성 광고 소재가 아니라,</span><span className="copy-line">대표님의 광고·상세페이지에 <em className="text-red keep-together">반복, 지속적으로 활용</em>할 수 있는</span><span className="copy-line"><em>차별화된 강력한 마케팅 포인트</em>를 만들어보세요.</span></p></div>
      </Section>

      <Section id="apply" theme="dark" className="final-cta" nodeId="21:2" glow="21-2-imgEffectFinalCtaSpotlight">
        <div className="final-cta__icon"><img src={figmaAsset('21-2-imgHtmlVectorPatentDocument')} width="44" height="44" alt="" /></div>
        <h2 className="section-title"><span className="copy-line"><span className="keep-together">지금 판매 중인</span> <span className="keep-together">상품/서비스도 좋습니다.</span></span><span className="copy-line"><span className="keep-together">출시 전</span> <span className="keep-together">상품/서비스도 좋습니다.</span></span></h2>
        <p className="final-cta__description"><span className="keep-together">대표님 <span className="text-accent text-blue">제품/서비스 이름</span>만</span> <span className="keep-together">알려주시면 됩니다.</span></p>
        <ConsultLink />
        <p className="consult-note">평일·주말 접수 가능</p>
      </Section>
    </main>
    <footer className="site-footer" data-figma-node="1:177"><div className="container">
      <div className="footer-logo"><SafeImage src={media.logo} alt="로문특허법률사무소 Lawmun IP Law Firm" loading="lazy" /></div>
      <p className="footer-representatives">대표 변리사 : 이원택, 김성현</p>
      <div className="footer-offices"><address><strong>로문특허법률사무소 선릉사무소</strong><span>사업자등록번호 : 797-43-01231</span><span>주소 : 서울특별시 강남구 테헤란로 52길6, 1408호</span></address><address><strong>로문특허법률사무소 역삼사무소</strong><span>사업자등록번호 : 788-63-00861</span><span>주소 : 서울특별시 강남구 논현로 75길15, 501호</span></address></div>
      <p className="footer-email">이메일 : <a href="mailto:marketing@lawmun.com">marketing@lawmun.com</a></p>
      <p className="footer-copyright">© 2026 로문특허법률사무소. All Rights Reserved.</p>
    </div></footer>
  </>;
}
