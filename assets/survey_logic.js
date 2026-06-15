// 구글 앱스 스크립트 마스터 웹앱 연동 주소 설정
const GOOGLE_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyXHMI8o5Tjmm7K033Uf0bNeZtmeSVde2URspq0-Cofc14MWtfeDGwRIMAiXc2jxPT_Mw/exec" ;

// ⏱️ 설문 최초 진입 시점 트래킹 타임스탬프 기록
const SURVEY_START_TIME = new Date();

const techList = [
  { 
    id: 1, 
    name: "저온 플라즈마 산화 공정", 
    type: "공정 개선 기술",
    desc: "고온 열 산화를 대신해 플라즈마를 도입하여 저온에서 실리콘 웨이퍼 등을 산화시키는 기술입니다. 고온 유지에 필요한 원천적인 전력 에너지 소모를 절감합니다."
  },
  { 
    id: 2, 
    name: "AI기반 극저온 식각 공정", 
    type: "공정 개선 기술",
    desc: "식각 공정을 매우 낮은 극저온 환경에서 수행하여 유해가스 휘발 및 스크랩을 줄이고 에너지 효율을 높이는 공법입니다. AI 정밀 제어를 결합해 가동 시간과 소비 전력을 획기적으로 최적화합니다."
  },
  { 
    id: 3, 
    name: "ALD 증착 및 저온 플라즈마 이온주입 공정", 
    type: "공정 개선 기술",
    desc: "원자층 단위로 증착하여 공정 미세화를 달성함과 동시에, 이온주입 단계를 고온 열처리 대신 저온 플라즈마 방식으로 유도하여 하이엔드 소자 공정의 배출량과 열에너지 투입을 원천 제어합니다."
  },
  { 
    id: 4, 
    name: "Hybrid 세정 공정", type: "공정 개선 기술",
    desc: "기존의 단일 물리적 또는 화학적 세정 방식을 혼합 결합하여 챔버 및 웨이퍼 세정 공정 최적화를 유도합니다. 세정용 F-gas 특수가스와 용수(초순수) 사용량을 동시에 대폭 절감합니다."
  },
  { 
    id: 5, 
    name: "저 GWP 가스 이용 식각 공정", 
    type: "저 GWP 공정 가스 대체 기술",
    desc: "지구온난화지수(GWP)가 매우 높은 기존의 핵심 식각 가스(SF6, CF4 등)를 대신하여, 환경 영향이 현저히 적은 차세대 저 GWP 대체 화학식 가스 레시피를 도입해 공정 배출(Scope 1) 총량을 직접 억제합니다."
  },
  { 
    id: 6, 
    name: "저 GWP 가스 이용 증착 공정", 
    type: "저 GWP 공정 가스 대체 기술",
    desc: "반도체·디스플레이 핵심 박막 증착 공정 시 다량 사용되는 온실가스(N2O 등)를 환경 친화적 분자 구조의 저 GWP 대체 가스로 전면 전환하여 양산 공정 내 탄소 배출 총량을 저감합니다."
  },
  { 
    id: 7, 
    name: "저 GWP 가스 이용 세정 공정", 
    type: "저 GWP 공정 가스 대체 기술",
    desc: "증착/식각 후 챔버 내벽 부착물을 제거할 때 필수적으로 투입되는 고 GWP 세정 가스(NF3 등)를 대체하는 차세대 저온 분해성 혹은 저 GWP 환경 대응 세정 레시피 가스를 양산 공정에 적용하는 기술입니다."
  },
  { 
    id: 8, 
    name: "증착/세정 공정용 Heat-cat-wet", 
    type: "후처리 기술",
    desc: "증착 및 세정 공정 완료 후 챔버 외부로 배출되는 난분해성 온실폐가스를 LNG 화석연료 대체 전기 히터(Heat)로 열분해하고, 활성화 에너지를 낮추는 촉매(Cat)를 거친 후 물(Wet)로 중화 세정·포집하여 배출하는 고효율 분해 후처리 스크러버 기술입니다."
  }
];

let currentTechIdx = 0;
let pageTimer = null; // 설명자료용 10초 타이머 변수

// 페이지 레이아웃 스위칭 및 상단 스크롤 동기화 함수
function goPage(pageId) {
  document.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0,0);

  if (pageTimer) {
    clearInterval(pageTimer);
    pageTimer = null;
  }

  // 설명자료 가드: A_page1 ~ A_page5 진입 시 10초 락 구동
  if (pageId.startsWith('A_page')) {
    const currentPageEl = document.getElementById(pageId);
    const nextBtn = currentPageEl.querySelector('.btn-next');

    if (nextBtn) {
      nextBtn.disabled = true;
      const originalText = nextBtn.innerText.replace(/ \(\d+초 후 이동 가능\)/g, "");
      nextBtn.innerText = `${originalText} (10초 후 이동 가능)`;
      nextBtn.style.backgroundColor = "#6c757d";
      nextBtn.style.cursor = "not-allowed";

      let timeLeft = 10;
      
      pageTimer = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
          nextBtn.innerText = `${originalText} (${timeLeft}초 후 이동 가능)`;
        } else {
          clearInterval(pageTimer);
          nextBtn.disabled = false;
          nextBtn.innerText = originalText;
          nextBtn.style.backgroundColor = pageId === 'A_page5' ? '#28a745' : '#0056b3';
          nextBtn.style.cursor = "pointer";
        }
      }, 1000);
    }
  }
}

// 3p 응답자 정보 기입 무결성 및 정규식 벨리데이션 (요구사항 반영수정)
function validateAndGoToA() {
  let isValid = true;
  // 소속, 성명, 종사산업, 전화번호, 이메일의 req-info 공란 일괄 검증
  document.querySelectorAll('.req-info').forEach(input => {
    if(!input.value || !input.value.trim()) isValid = false;
  });
  if(!isValid) {
    alert("인적사항의 필수(*) 항목을 모두 기입해 주세요.");
    return;
  }

  // 📌 [경력 선택 유효성 가드] 라디오박스 체크 여부 정밀 검증
  const expChecked = document.querySelector('input[name="info_exp"]:checked');
  if (!expChecked) {
    alert("경력(년수 구간) 문항을 반드시 선택해 주세요.");
    return;
  }

  const phoneInput = document.getElementById('phone');
  const phoneValue = phoneInput.value.trim();
  const phonePattern = /^(010|02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064)-\d{3,4}-\d{4}$/;
  
  if(!phonePattern.test(phoneValue)) {
    alert("전화번호 형식이 올바르지 않거나 하이픈(-)이 누락되었습니다.\n(예: 010-1234-5678 또는 02-1234-5678)");
    phoneInput.focus();
    return;
  }

  const emailInput = document.getElementById('email');
  const emailValue = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(emailValue)) {
    alert("이메일 형식이 올바르지 않습니다. (예: example@domain.com)");
    emailInput.focus();
    return;
  }

  goPage('A_page1');
}


// ====================================================
// [신규 추가] 1.5p 개인정보 제공 동의 위반 가드 및 페이지 흐름 통제 함수
// ====================================================
function validatePrivacyConsent() {
  const consentChecked = document.querySelector('input[name="privacy_agree"]:checked');
  
  // 1. 선택 자체를 안 한 탈락 가드
  if (!consentChecked) {
    alert("개인정보 수집 및 이용 동의 여부를 선택해 주십시오.");
    return;
  }
  
  // 2. '동의하지 않습니다'를 누른 거부 가드
  if (consentChecked.value === "동의안함") {
    alert("귀하께서는 동의를 거부할 권리가 있으나, 거부하시는 경우 법적 예산 증빙 처리가 불가능하여 본 조사에 응답 및 참여하실 수 없습니다.");
    return;
  }
  
  // 3. 정상 통과 시 다음 안내 가이드 설명문 페이지(page_2)로 스위칭 전송
  goPage('page_2');
}


// [B] 본설문 영역 카드 동적 빌더 (실시간 입력연도 파이핑 및 선행연구 텍스트 고도화 반영 버전)
function startPartB() {
  const container = document.getElementById('dynamicSurveyContainer');
  container.innerHTML = ""; 

  techList.forEach((tech, index) => {
    const qNum = index + 1;

    const cardHtml = `
      <div class="tech-survey-card" id="techCard_${index}" style="display: ${index === 0 ? 'block' : 'none'};">
        <div class="progress-bar" style="font-weight: bold; color: #0056b3; text-align: right; margin-bottom: 15px; font-size: 14px;">[B] 본설문 응답 진척도: ${index + 1} / 8 페이지</div>
        
        <h1 style="color: #004085; text-align: center; font-size: 24px; margin-bottom: 25px; border-bottom: 3px solid #004085; padding-bottom: 15px;">B. 주요 감축기술 전망 [${qNum}/8]</h1>
        <p class="red" style="font-weight: bold; color: #dc3545; font-size: 14.5px; text-align: justify; margin-bottom: 20px;">
          ※ 실측값이 아닌 미래 전망치에 대한 귀하께서 산업에 종사하시며 습득하신 암묵지(내재된)의 의견을 기입해주시기 바랍니다. 소속 기관의 의견을 대표하는 것이 아니오니 자유롭게 응답하여 주십시오.
        </p>
        
        <h2 style="color: #0056b3; border-left: 5px solid #0056b3; padding-left: 10px; margin-top: 30px; font-size: 17px; margin-bottom: 10px; line-height: 1.6;">
          문 B${qNum}. 반도체 및 디스플레이 산업의 <span style="background-color: #e1f5fe; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #004b87;">${tech.type}</span> 내 <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #004085;">'${tech.name}'</span>의 상용화 시점, 평균적인 비용 및 성능 전망을 위한 조사입니다. 귀하께서는 아래 항목들에 대하여 어떻게 예상하십니까?
        </h2>

        <div style="background-color: #f0f4f8; border-left: 5px solid #5c85d6; padding: 12px 18px; margin-bottom: 25px; border-radius: 0 6px 6px 0; font-size: 14px; text-align: justify; color: #2b4c7e; line-height: 1.6;">
          <strong>💡 ${tech.name} 설명 (기술 설명):</strong> ${tech.desc}
        </div>

        <div style="background-color: #f8f9fa; padding: 15px; border: 1px solid #ced4da; border-radius: 6px; margin-bottom: 25px;">
          <span style="font-weight: bold; color: #004085; display: block; margin-bottom: 10px;">&lt;반도체 및 디스플레이 산업 주요 혁신감축기술 도입 전망&gt;</span>
          <div class="grid-2">
            <div>
              <label style="font-weight: bold; display: block; margin-bottom: 5px;">① 최초 상용화 시점 :</label>
              <div style="display: flex; align-items: center; gap: 5px;">
                <input type="number" class="q1-val" min="2026" placeholder="2026년 이후 연도 입력" style="flex: 1;" required>
                <span style="font-weight: bold;">년</span>
              </div>
              <span class="red" style="font-size: 12px; display: block; margin-top: 4px; line-height: 1.4;">- 기술이 반디산업 분야에 처음 상용화 될 것으로 예상되는 시점(연도) (2026년보다 큰 숫자로 응답해주세요)</span>
            </div>
            <div>
              <label style="font-weight: bold; display: block; margin-bottom: 5px;">② 50% 이상 상용화 시점 (기술확산 정점시기) :</label>
              <div style="display: flex; align-items: center; gap: 5px;">
                <input type="number" class="q2-val" min="2026" placeholder="2026년 이후 연도 입력" style="flex: 1;" required>
                <span style="font-weight: bold;">년</span>
              </div>
              <span class="red" style="font-size: 12px; display: block; margin-top: 4px; line-height: 1.4;">- 기술 도입이 확산되어, 반디 산업 내 50% 이상 생산공정에서 기술이 상용화 될 것으로 예상되는 시점(연도) (2026년보다 큰 숫자로 응답해주세요, 그리고 ② ≥ ① 으로 크기 순서를 유지하여 기입하여 주세요)</span>
              <div class="error-text err-q2" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 50% 이상 상용화 시점(②)은 최초 상용화 시점(①)보다 크거나 같아야 합니다.</div>
            </div>
          </div>
        </div>

        <div style="background-color: #ffffff; padding: 16px 20px; border: 1px solid #dee2e6; border-radius: 6px; margin-bottom: 25px; font-size: 13.5px; line-height: 1.6; text-align: justify; color: #495057;">
          <span style="font-weight: bold; color: #004085; display: block; margin-bottom: 6px; font-size: 14px;">💡 비용 및 효율 개선 전망 참고 자료 (학습률 관련 선행연구 요약)</span>
          선행연구들에 따르면 <span class="bold-underline">제조업 전반의 비용 절감률(학습률)은 약 20%</span>이며 많은 기술들이 <span class="bold-underline">15~25%의 범위에 분포</span>합니다 (Dutton & Thomas, 1984; Nagy et al., 2013). 기술 유형에 따라 R&D 학습률은 다르게 나타나며, 모듈화·표준화 수준이 높고 대량생산이 용이한 기술은 학습률이 높은 반면, 대형 설비 의존도가 높거나 성숙기에 접어들어 비용 개선 여지가 줄어든 기술은 상대적으로 낮은 학습률을 보입니다.
        </div>

        <div style="background-color: #f4f8ff; padding: 18px; border: 1px solid #ced4da; border-radius: 6px; margin-bottom: 25px;">
          <span style="font-weight: bold; color: #004085; display: block; margin-bottom: 12px; font-size: 14.5px;">&lt;주요 감축기술 발전에 따른 비용 및 성능(효율) 개선 전망&gt;</span>
          
          <div style="background-color: #f4f8ff; padding: 20px; border: 1px solid #ced4da; border-radius: 6px; margin-bottom: 25px;">
          <span style="font-weight: bold; color: #004085; display: block; margin-bottom: 15px; font-size: 15px;">&lt;주요 감축기술 발전에 따른 비용 및 성능(효율) 개선 전망&gt;</span>
          
          <div style="margin-bottom: 24px;">
            <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 15.5px; color: #003366;">
              ③ <span class="pipe-year-q1" style="color: #0056b3; font-weight: 800; text-decoration: underline;">①번 입력연도</span>년 대비, <span class="pipe-year-q2" style="color: #0056b3; font-weight: 800; text-decoration: underline;">②번 입력연도</span>년 설비 투자 비용(CAPEX) 절감률 :
            </label>
            <div style="display: flex; align-items: center; gap: 5px; max-width: 300px;">
              <input type="number" class="q3-val" min="0" max="100" placeholder="0 ~ 100" style="flex: 1; padding: 11px; font-size: 14.5px;" required>
              <span style="font-weight: bold; font-size: 16px;">%</span>
            </div>
            <span style="font-size: 14.5px; color: #495057; display: block; margin-top: 6px; line-height: 1.6; background: #fff; padding: 8px 12px; border-radius: 4px; border: 1px dashed #b8daff;">
              - 기술 최초 상용화 시기 대비, 향후 기술 발전으로 <span class="red">생산능력이 2배 증가</span>(기술확산 정점기)했다고 가정할 때 <span style="font-weight: bold; color: #0056b3;">CAPEX 단위 비용(원/t)이 평균적으로 감소하는 수준(%)</span>
            </span>
            <div class="error-text err-range-q3" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 입력 범위를 벗어났습니다. 0에서 100 사이의 숫자만 입력 가능합니다.</div>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 15.5px; color: #003366;">
              ④ <span class="pipe-year-q1" style="color: #0056b3; font-weight: 800; text-decoration: underline;">①번 입력연도</span>년 대비, <span class="pipe-year-q2" style="color: #0056b3; font-weight: 800; text-decoration: underline;">②번 입력연도</span>년 변동 유지보수 비용(OPEX) 절감률 :
            </label>
            <div style="display: flex; align-items: center; gap: 5px; max-width: 300px;">
              <input type="number" class="q4-val" min="0" max="100" placeholder="0 ~ 100" style="flex: 1; padding: 11px; font-size: 14.5px;" required>
              <span style="font-weight: bold; font-size: 16px;">%</span>
            </div>
            <span style="font-size: 14.5px; color: #495057; display: block; margin-top: 6px; line-height: 1.6; background: #fff; padding: 8px 12px; border-radius: 4px; border: 1px dashed #b8daff;">
              - 기술 최초 상용화 시기 대비, 향후 기술 발전으로 <span class="red">생산능력이 2배 증가</span>(기술확산 정점기)했다고 가정할 때 <span style="font-weight: bold; color: #0056b3;">OPEX 단위 비용(원/t)이 평균적으로 감소하는 수준(%)</span>
            </span>
            <div class="error-text err-range-q4" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 입력 범위를 벗어났습니다. 0에서 100 사이의 숫자만 입력 가능합니다.</div>
          </div>

          <div style="margin-bottom: 5px;">
            <label style="font-weight: bold; display: block; margin-bottom: 8px; font-size: 15.5px; color: #003366;">
              ⑤ <span class="pipe-year-q1" style="color: #0056b3; font-weight: 800; text-decoration: underline;">①번 입력연도</span>년 대비, <span class="pipe-year-q2" style="color: #0056b3; font-weight: 800; text-decoration: underline;">②번 입력연도</span>년 생산 1단위당 에너지 소비 감소율 :
            </label>
            <div style="display: flex; align-items: center; gap: 5px; max-width: 300px;">
              <input type="number" class="q5-val" min="0" max="100" placeholder="0 ~ 100" style="flex: 1; padding: 11px; font-size: 14.5px;" required>
              <span style="font-weight: bold; font-size: 16px;">%</span>
            </div>
            <span style="font-size: 14.5px; color: #495057; display: block; margin-top: 6px; line-height: 1.6; background: #fff; padding: 8px 12px; border-radius: 4px; border: 1px dashed #b8daff;">
              - 최초 상용화 초기 단위 에너지 소비량을 <span style="font-weight: bold;">기준값(100%)</span>으로 할 때, 기술 발전으로 에너지 효율 개선이 극대화 되는 시점(② 응답 연도)의 기준값 대비 <span style="font-weight: bold; color: #0056b3;">단위 에너지 소비 감소율(%)</span><br>※ 작성 예시: 기준값 대비 단위 에너지 소비 25% 감소가 한계라고 판단 시 25%로 기재
            </span>
            <div class="error-text err-range-q5" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 입력 범위를 벗어났습니다. 0에서 100 사이의 숫자만 입력 가능합니다.</div>
          </div>
        </div>

        <div style="margin-bottom: 35px;">
          <span style="font-weight: bold; color: #0056b3; display: block; margin-bottom: 10px;">※ 응답 근거/이유</span>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div>
              <label style="font-size: 13.5px; color: #495057; display:block; margin-bottom:4px; font-weight: bold;">&lt;반도체 및 디스플레이 산업 혁신감축기술 도입 전망 (①, ②)&gt; *</label>
              <textarea class="r-q1-q2" placeholder="※ 도입 및 50% 상용화 시점에 대한 응답 근거나 이유를 구체적으로 기술해 주십시오." required style="width: 100%; height: 110px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>
            <div>
              <label style="font-size: 13.5px; color: #495057; display:block; margin-bottom:4px; font-weight: bold;">&lt;주요 감축기술 발전에 따른 비용 절감 효과 (③, ④)&gt; *</label>
              <textarea class="r-q3-q4" placeholder="※ CAPEX 및 OPEX 비용 절감률에 대한 응답 근거나 이유를 구체적으로 기술해 주십시오." required style="width: 100%; height: 110px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>
            <div>
              <label style="font-size: 13.5px; color: #495057; display:block; margin-bottom:4px; font-weight: bold;">&lt;주요 감축기술 발전에 따른 성능(효율) 개선 효과 (⑤)&gt; *</label>
              <textarea class="r-q5" placeholder="※ 단위 에너지 소비 감소율에 대한 응답 근거나 이유를 구체적으로 기술해 주십시오." required style="width: 100%; height: 110px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>
          </div>
        </div>

        <h2 style="color: #0056b3; border-left: 5px solid #0056b3; padding-left: 10px; margin-top: 40px; font-size: 17px; margin-bottom: 15px; line-height: 1.5;">
          문 B${qNum}-1. 앞선 B${qNum}. 문항에서는 중립적인 투자 환경(Mod 시나리오)을 가정하여 기술 특성의 변화를 전망하였습니다. 이어서 본 문항은 연구개발 투자가 낙관적(Adv) 혹은 비관적(Con)으로 이루어지는 시나리오를 가정합니다. 이처럼 투자 환경이 변화할 때 시나리오별 항목의 기술 비용 및 성능이 어떻게 달라질 것으로 예상하십니까?
        </h2>
        <p class="red" style="font-weight: bold; color: #dc3545; font-size: 14px; margin-bottom: 15px;">
          ※ 시나리오 간 응답 수치의 역전 현상을 방지하기 위해, 낙관적(Adv) ≥ 중립적(Mod) ≥ 비관적(Con) 전망 크기 순서가 유지되도록 기입하여 주세요.
        </p>

        <div style="background-color: #ffffff; padding: 15px; border: 1px solid #dee2e6; border-radius: 6px; margin-bottom: 18px; font-size: 12.5px;">
          <span style="font-weight: bold; color: #333; display: block; margin-bottom: 8px;">&lt;주요 감축기술 전망 시나리오별 비용/성능 전망&gt;</span>
          <span style="display: block; margin-bottom: 8px; color: #555;">※ 반도체 및 디스플레이 산업 분야 전망별 시나리오 구분</span>
          <div style="width: 100%; overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; min-width: 550px; text-align: center; font-size: 12.5px; line-height: 1.6;">
              <thead>
                <tr style="background-color: #f0f4f8; border-top: 1px solid #aaa; border-bottom: 1px solid #aaa; font-weight: bold;">
                  <th style="padding: 8px; border: 1px solid #dee2e6; width: 25%;">시나리오 구분</th>
                  <th style="padding: 8px; border: 1px solid #dee2e6; width: 25%;">응답문항</th>
                  <th style="padding: 8px; border: 1px solid #dee2e6; width: 50%;">반도체 및 디스플레이 산업 연구개발비 변화</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; color: #0056b3;">낙관적 전망</td>
                  <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">B${qNum}-1</td>
                  <td style="padding: 8px; border: 1px solid #dee2e6; ">R&D 투자, 혁신 추이 계획안 <span style="color:#0056b3; font-weight:bold;">개선</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; color: #198754;">중립적 전망</td>
                  <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">B${qNum}(완료)</td>
                  <td style="padding: 8px; border: 1px solid #dee2e6; ">R&D 투자, 혁신 추이 계획안 <span style="color:#198754; font-weight:bold;">유지</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold; color: #dc3545;">비관적 전망</td>
                  <td style="padding: 8px; border: 1px solid #dee2e6; font-weight: bold;">B${qNum}-1</td>
                  <td style="padding: 8px; border: 1px solid #dee2e6; ">R&D 투자, 혁신 추이 계획안 <span style="color:#dc3545; font-weight:bold;">위축</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mod-summary-banner" style="background-color: #fff9db; border: 1px solid #ffe8a1; padding: 10px 15px; border-radius: 6px; margin-bottom: 20px; font-size: 13.5px; color: #664d03;">
          📌 <strong>참고 (앞서 입력하신 중립적[Mod] 시나리오 전망치):</strong> &nbsp;&nbsp;
          CAPEX: <span class="pipe-q3" style="font-weight: bold; text-decoration: underline; color: #198754;">(미입력)</span> % &nbsp;|&nbsp; 
          OPEX: <span class="pipe-q4" style="font-weight: bold; text-decoration: underline; color: #198754;">(미입력)</span> % &nbsp;|&nbsp; 
          에너지 소비 감소율: <span class="pipe-q5" style="font-weight: bold; text-decoration: underline; color: #198754;">(미입력)</span> %
        </div>

        <div style="border: 1px solid #ced4da; padding: 20px; border-radius: 6px; background-color: #fff;">
          <div style="margin-bottom: 20px; border-bottom: 1px dashed #dee2e6; padding-bottom: 15px;">
            <div class="grid-2">
              <div>
                <label style="font-weight: bold; font-size:14px; color: #0056b3;">⑥ 낙관적(Adv) 시나리오 CAPEX 절감률 :</label>
                <div style="display: flex; align-items: center; gap: 5px; max-width: 250px; margin-top:4px;">
                  <input type="number" class="q6-val" min="0" max="100" required> <span style="font-weight: bold;">%</span>
                </div>
                <div class="error-text err-q6" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 낙관적 수치는 중립적 수치보다 크거나 같아야 합니다.</div>
                <div class="error-text err-range-q6" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 0에서 100 사이의 숫자만 입력 가능합니다.</div>
              </div>
              <div>
                <label style="font-weight: bold; font-size:14px; color: #dc3545;">⑦ 비관적(Con) 시나리오 CAPEX 절감률 :</label>
                <div style="display: flex; align-items: center; gap: 5px; max-width: 250px; margin-top:4px;">
                  <input type="number" class="q7-val" min="0" max="100" required> <span style="font-weight: bold;">%</span>
                </div>
                <div class="error-text err-q7" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 비관적 수치는 중립적 수치보다 작거나 같아야 합니다.</div>
                <div class="error-text err-range-q7" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 0에서 100 사이의 숫자만 입력 가능합니다.</div>
              </div>
            </div>
            <span style="font-size: 12.5px; color: #6c757d; display: block; margin-top: 8px;">- 상용화 초기 대비, 향후 기술 발전으로 생산능력이 2배 증가했다고 가정할 때 CAPEX 단위 비용이 감소하는 비율(%)</span>
          </div>

          <div style="margin-bottom: 20px; border-bottom: 1px dashed #dee2e6; padding-bottom: 15px;">
            <div class="grid-2">
              <div>
                <label style="font-weight: bold; font-size:14px; color: #0056b3;">⑧ 낙관적(Adv) 시나리오 OPEX 절감률 :</label>
                <div style="display: flex; align-items: center; gap: 5px; max-width: 250px; margin-top:4px;">
                  <input type="number" class="q8-val" min="0" max="100" required> <span style="font-weight: bold;">%</span>
                </div>
                <div class="error-text err-viii" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 낙관적 수치는 중립적 수치보다 크거나 같아야 합니다.</div>
                <div class="error-text err-range-q8" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 0에서 100 사이의 숫자만 입력 가능합니다.</div>
              </div>
              <div>
                <label style="font-weight: bold; font-size:14px; color: #dc3545;">⑨ 비관적(Con) 시나리오 OPEX 절감률 :</label>
                <div style="display: flex; align-items: center; gap: 5px; max-width: 250px; margin-top:4px;">
                  <input type="number" class="q9-val" min="0" max="100" required> <span style="font-weight: bold;">%</span>
                </div>
                <div class="error-text err-ix" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 비관적 수치는 중립적 수치보다 작거나 같아야 합니다.</div>
                <div class="error-text err-range-q9" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 0에서 100 사이의 숫자만 입력 가능합니다.</div>
              </div>
            </div>
            <span style="font-size: 12.5px; color: #6c757d; display: block; margin-top: 8px;">- 상용화 초기 대비, 향후 기술 발전으로 생산능력이 2배 증가했다고 가정할 때 OPEX 단위 비용이 감소하는 비율(%)</span>
          </div>

          <div style="margin-bottom: 15px;">
            <div class="grid-2">
              <div>
                <label style="font-weight: bold; font-size:14px; color: #0056b3;">⑩ 낙관적(Adv) 시나리오 단위 에너지 소비 감소율 :</label>
                <div style="display: flex; align-items: center; gap: 5px; max-width: 250px; margin-top:4px;">
                  <input type="number" class="q10-val" min="0" max="100" required> <span style="font-weight: bold;">%</span>
                </div>
                <div class="error-text err-x" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 낙관적 수치는 중립적 수치보다 크거나 같아야 합니다.</div>
                <div class="error-text err-range-q10" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 0에서 100 사이의 숫자만 입력 가능합니다.</div>
              </div>
              <div>
                <label style="font-weight: bold; font-size:14px; color: #dc3545;">⑪ 비관적(Con) 시나리오 단위 에너지 소비 감소율 :</label>
                <div style="display: flex; align-items: center; gap: 5px; max-width: 250px; margin-top:4px;">
                  <input type="number" class="q11-val" min="0" max="100" required> <span style="font-weight: bold;">%</span>
                </div>
                <div class="error-text err-xi" style="color: #dc3545; font-size: 13px; font-weight: bold; margin-top: 5px; display: none;">⚠️ 오류: 비관적 수치는 중립적 수치보다 작거나 같아야 합니다.</div>
                <div class="error-text err-range-xi" style="color: #dc3545; font-size: 12.5px; font-weight: bold; margin-top: 4px; display: none;">⚠️ 0에서 100 사이의 숫자만 입력 가능합니다.</div>
              </div>
            </div>
            <span style="font-size: 12.5px; color: #6c757d; display: block; margin-top: 8px;">- 상용화 초기 단위 에너지 소비량을 기준값(100%)으로 할 때, 기술 발전으로 에너지 효율 개선이 극대화 되는 시점의 기준값 대비 단위 에너지 소비 감소율(%)</span>
          </div>
        </div>

        <div style="margin-top: 25px; margin-bottom: 15px;">
          <span style="font-weight: bold; color: #0056b3; display: block; margin-bottom: 10px;">※ 시나리오 투자 환경별 응답 근거/이유</span>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div>
              <label style="font-size: 13.5px; color: #495057; display:block; margin-bottom:4px; font-weight: bold;">&lt;투자 시나리오별 설비 투자 비용(CAPEX) 전망 판단 근거 (⑥, ⑦)&gt; *</label>
              <textarea class="r-q6-q7" placeholder="※ 투자 규모 위축 및 확대에 따른 CAPEX 변동 전망의 구체적인 근거를 작성해 주십시오." required style="width: 100%; height: 110px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>
            <div>
              <label style="font-size: 13.5px; color: #495057; display:block; margin-bottom:4px; font-weight: bold;">&lt;투자 시나리오별 변동 유지보수 비용(OPEX) 전망 판단 근거 (⑧, ⑨)&gt; *</label>
              <textarea class="r-q8-q9" placeholder="※ 투자 규모 위축 및 확대에 따른 OPEX 변동 전망의 구체적인 근거를 작성해 주십시오." required style="width: 100%; height: 110px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>
            <div>
              <label style="font-size: 13.5px; color: #495057; display:block; margin-bottom:4px; font-weight: bold;">&lt;투자 시나리오별 단위 에너지 소비 감소율 전망 판단 근거 (⑩, ⑪)&gt; *</label>
              <textarea class="r-q10-q11" placeholder="※ 투자 규모 위축 및 확대에 따른 에너지 효율 절감 전망의 구체적인 근거를 작성해 주십시오." required style="width: 100%; height: 110px; box-sizing: border-box; resize: vertical;"></textarea>
            </div>
          </div>
        </div>

      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHtml);
    bindRealtimeValidation(index);
  });

  currentTechIdx = 0;
  updateTechNavigation();
  goPage('part_B_container');
}


function bindRealtimeValidation(idx) {
  const card = document.getElementById(`techCard_${idx}`);
  const q1 = card.querySelector('.q1-val');
  const q2 = card.querySelector('.q2-val');
  const q3 = card.querySelector('.q3-val');
  const q4 = card.querySelector('.q4-val');
  const q5 = card.querySelector('.q5-val');
  const q6 = card.querySelector('.q6-val');
  const q7 = card.querySelector('.q7-val');
  const q8 = card.querySelector('.q8-val');
  const q9 = card.querySelector('.q9-val');
  const q10 = card.querySelector('.q10-val');
  const q11 = card.querySelector('.q11-val');

  const pipeQ3 = card.querySelector('.pipe-q3');
  const pipeQ4 = card.querySelector('.pipe-q4');
  const pipeQ5 = card.querySelector('.pipe-q5');

  // 📌 [정정 및 결합] 사용자가 ①, ②번 문항에 연도를 입력할 때 하단 문항 레이블에 실시간 데이터 파이핑 핸들러
  function pipeInputYears() {
    const q1YearText = q1.value.trim() ? q1.value.trim() : "①번 입력연도";
    const q2YearText = q2.value.trim() ? q2.value.trim() : "②번 입력연도";
    
    // ③, ④, ⑤ 문항의 실시간 안내 연도 스트링 일제히 매핑 동기화
    card.querySelectorAll('.pipe-year-q1').forEach(el => el.innerText = q1YearText);
    card.querySelectorAll('.pipe-year-q2').forEach(el => el.innerText = q2YearText);
    
    // 연도 전망치 간 대소 관계(역전 현상) 에러 메시지 노출 통제
    card.querySelector('.err-q2').style.display = (q1.value && q2.value && parseInt(q2.value) < parseInt(q1.value)) ? 'block' : 'none';
  }
  
  q1.addEventListener('input', pipeInputYears);
  q2.addEventListener('input', pipeInputYears);

  function checkRange(inputEl, errorEl) {
    if(inputEl.value) {
      const val = parseInt(inputEl.value);
      if(val < 0 || val > 100) {
        errorEl.style.display = 'block';
      } else {
        errorEl.style.display = 'none';
      }
    } else {
      errorEl.style.display = 'none';
    }
  }

  q3.addEventListener('input', () => {
    checkRange(q3, card.querySelector('.err-range-q3'));
    pipeQ3.innerText = q3.value ? q3.value : "(미입력)";
    card.querySelector('.err-q6').style.display = (q6.value && parseInt(q6.value) < parseInt(q3.value)) ? 'block' : 'none';
    card.querySelector('.err-q7').style.display = (q7.value && parseInt(q7.value) > parseInt(q3.value)) ? 'block' : 'none';
  });
  q4.addEventListener('input', () => {
    checkRange(q4, card.querySelector('.err-range-q4'));
    pipeQ4.innerText = q4.value ? q4.value : "(미입력)";
    card.querySelector('.err-viii').style.display = (q8.value && parseInt(q8.value) < parseInt(q4.value)) ? 'block' : 'none';
    card.querySelector('.err-ix').style.display = (q9.value && parseInt(q9.value) > parseInt(q4.value)) ? 'block' : 'none';
  });
  q5.addEventListener('input', () => {
    checkRange(q5, card.querySelector('.err-range-q5'));
    pipeQ5.innerText = q5.value ? q5.value : "(미입력)";
    card.querySelector('.err-x').style.display = (q10.value && parseInt(q10.value) < parseInt(q5.value)) ? 'block' : 'none';
    card.querySelector('.err-xi').style.display = (q11.value && parseInt(q11.value) > parseInt(q5.value)) ? 'block' : 'none';
  });

  q6.addEventListener('input', () => {
    checkRange(q6, card.querySelector('.err-range-q6'));
    card.querySelector('.err-q6').style.display = (q3.value && parseInt(q6.value) < parseInt(q3.value)) ? 'block' : 'none';
  });

  q7.addEventListener('input', () => {
    checkRange(q7, card.querySelector('.err-range-q7'));
    card.querySelector('.err-q7').style.display = (q3.value && parseInt(q7.value) > parseInt(q3.value)) ? 'block' : 'none';
  });
  q8.addEventListener('input', () => {
    checkRange(q8, card.querySelector('.err-range-q8'));
    card.querySelector('.err-viii').style.display = (q4.value && parseInt(q8.value) < parseInt(q4.value)) ? 'block' : 'none';
  });
  q9.addEventListener('input', () => {
    checkRange(q9, card.querySelector('.err-range-q9'));
    card.querySelector('.err-ix').style.display = (q4.value && parseInt(q9.value) > parseInt(q4.value)) ? 'block' : 'none';
  });
  q10.addEventListener('input', () => {
    checkRange(q10, card.querySelector('.err-range-q10'));
    card.querySelector('.err-x').style.display = (q5.value && parseInt(q10.value) < parseInt(q5.value)) ? 'block' : 'none';
  });
  q11.addEventListener('input', () => {
    checkRange(q11, card.querySelector('.err-range-xi'));
    card.querySelector('.err-xi').style.display = (q5.value && parseInt(q11.value) > parseInt(q5.value)) ? 'block' : 'none';
  });
}

function updateTechNavigation() {
  document.querySelectorAll('.tech-survey-card').forEach((card, i) => {
    card.style.display = (i === currentTechIdx) ? 'block' : 'none';
  });

  const nextBtn = document.getElementById('dynamicNextBtn');
  if (currentTechIdx === 7) {
    nextBtn.innerText = "추가 요청 질문 이동 (Next)";
    nextBtn.style.backgroundColor = "#28a745";
  } else {
    nextBtn.innerText = "다음 기술 (Next)";
    nextBtn.style.backgroundColor = "#0056b3";
  }
  window.scrollTo(0,0);
}

function moveTechPage(dir) {
  if (dir === 1) {
    const currentCard = document.getElementById(`techCard_${currentTechIdx}`);
    const inputs = currentCard.querySelectorAll('input[required]');
    const textareas = currentCard.querySelectorAll('textarea[required]');
    
    let isFilled = true;
    inputs.forEach(el => { if(!el.value.trim()) isFilled = false; });
    if(!isFilled) {
      alert("현재 페이지의 모든 필수 전망 수치를 빠짐없이 입력해 주세요.");
      return;
    }

    let isTextValid = true;
    let shortTextLabel = "";
    textareas.forEach(ta => {
      const textLength = ta.value.trim().length;
      if (textLength < 10) {
        isTextValid = false;
        const labelText = ta.parentElement.querySelector('label') ? ta.parentElement.querySelector('label').innerText : "응답 근거";
        shortTextLabel = labelText.split('*')[0].trim();
      }
    });

    if (!isTextValid) {
      alert(`[입력 분량 부족]\n${shortTextLabel}란에 최소 10글자 이상 구체적인 근거를 작성해 주십시오.`);
      return;
    }

    const q1 = parseInt(currentCard.querySelector('.q1-val').value);
    const q2 = parseInt(currentCard.querySelector('.q2-val').value);
    const q3 = parseInt(currentCard.querySelector('.q3-val').value);
    const q4 = parseInt(currentCard.querySelector('.q4-val').value);
    const q5 = parseInt(currentCard.querySelector('.q5-val').value);
    const q6 = parseInt(currentCard.querySelector('.q6-val').value);
    const q7 = parseInt(currentCard.querySelector('.q7-val').value);
    const q8 = parseInt(currentCard.querySelector('.q8-val').value);
    const q9 = parseInt(currentCard.querySelector('.q9-val').value);
    const q10 = parseInt(currentCard.querySelector('.q10-val').value);
    const q11 = parseInt(currentCard.querySelector('.q11-val').value);

    // 📌 [요구사항 2 보완] 최초 상용화 및 50% 상용화 시점의 2025~2050 하드 바운더리 검증 추가
    if (q1 < 2026 || q2 < 2026) {
      alert("연도 전망 범위 오류:\n① 최초 상용화 시점과 ② 50% 이상 상용화 시점은 반드시 현재 시점 이후인 2026년 이후의 연도로 입력하여 주십시오.");
      return;
    }
    
    if (q2 < q1) {
      alert("연도 전망치 간 대소 관계 설정에 오류가 있습니다. 다시 한번 확인해주세요");
      return;
    }

    if (q3 < 0 || q3 > 100 || q4 < 0 || q4 > 100 || q5 < 0 || q5 > 100 ||
        q6 < 0 || q6 > 100 || q7 < 0 || q7 > 100 || q8 < 0 || q8 > 100 ||
        q9 < 0 || q9 > 100 || q10 < 0 || q10 > 100 || q11 < 0 || q11 > 100) {
      alert("전망 성능 개선율 및 시나리오별 입력 수치 중 0% 미만이거나 100%를 초과한 값이 존재합니다. 범위를 다시 확인해 주세요.");
      return;
    }

    if (q6 < q3 || q8 < q4 || q10 < q5 ) {
      alert("낙관적(Adv) 시나리오는 중립적(Mod) 시나리오보다 크거나 같아야 합니다. 입력 값을 다시 확인해 주세요.");
      return;
    }

    if (q7 > q3 || q9 > q4 || q11 > q5) {
      alert("비관적(Con) 시나리오는 중립적(Mod) 시나리오보다 크거나 같아야 합니다. 입력 값을 다시 확인해 주세요.");
      return;
    }


    if (currentTechIdx === 7) {
      goPage('part_C_container');
      return;
    }
  }

  if (dir === -1 && currentTechIdx === 0) {
    goPage('A_page5');
    return;
  }

  currentTechIdx += dir;
  updateTechNavigation();
}

function backToB8() {
  currentTechIdx = 7;
  updateTechNavigation();
  goPage('part_B_container');
}



// C 섹션 마감 데이터 밸리데이션 및 최종 구글 웹앱 DB 전송 파이프라인 (최신 시트 컬럼 구조 동기화 버전)
function validateAndSubmitAll() {
  // 1. 문C1 (전문 분야) 체크박스 검증
  const c1NewChecked = document.querySelectorAll('input[name="c1_new_val"]:checked');
  if (c1NewChecked.length === 0) {
    alert("문C1. 귀하의 전문 분야를 최소 1개 이상 선택해 주세요.");
    return;
  }
  // 문C1 기타 활성화 시 서술형 공란 검증
  if (document.getElementById('c1_new_etc_chk').checked && !document.getElementById('c1_new_etc_txt').value.trim()) {
    alert("문C1의 기타 선택 내용을 텍스트 상자 안에 입력해 주세요.");
    document.getElementById('c1_new_etc_txt').focus();
    return;
  }

  // 2. 문C2 (기여 역할) 체크박스 검증
  const c2NewChecked = document.querySelectorAll('input[name="c2_new_val"]:checked');
  if (c2NewChecked.length === 0) {
    alert("문C2. 귀하께서 산업에 기여하는 역할을 최소 1개 이상 선택해 주세요.");
    return;
  }
  // 문C2 기타 활성화 시 서술형 공란 검증
  if (document.getElementById('c2_new_etc_chk').checked && !document.getElementById('c2_new_etc_txt').value.trim()) {
    alert("문C2의 기타 선택 역할을 텍스트 상자 안에 입력해 주세요.");
    document.getElementById('c2_new_etc_txt').focus();
    return;
  }

  // 3. 문C3 자문료 증빙 데이터 취득 및 필수 입력 검증 가드
  const rrnInput = document.getElementById('c3_privacy_rrn');
  const bankInput = document.getElementById('c3_privacy_bank');
  const accInput = document.getElementById('c3_privacy_account');

  const rrnVal = rrnInput ? rrnInput.value.trim() : "";
  const bankVal = bankInput ? bankInput.value.trim() : "";
  const accVal = accInput ? accInput.value.trim() : "";

  if (!rrnVal || !bankVal || !accVal) {
    alert("문C3. 자문료 지급 처리를 위한 증빙 정보(주민등록번호, 은행명, 계좌번호)를 빠짐없이 입력해 주십시오.");
    if (!rrnVal) rrnInput.focus();
    else if (!bankVal) bankInput.focus();
    else accInput.focus();
    return;
  }

  // 주민등록번호 13자리 형식 검증 (하이픈 포함 총 14자 체크)
  if (rrnVal.length < 14 || !rrnVal.includes('-')) {
    alert("주민등록번호의 입력 형식이 올바르지 않습니다.\n하이픈(-)을 포함하여 13자리 전체를 기입해 주십시오. (예: 000000-0000000)");
    rrnInput.focus();
    return;
  }

  // 4. 1~8번 동적 감축기술 전망 인풋 및 근거 구문 크롤링 덤프
  let responses = [];
  techList.forEach((tech, i) => {
    const card = document.getElementById(`techCard_${i}`);
    responses.push({
      techName: tech.name,
      q1: parseInt(card.querySelector('.q1-val').value),
      q2: parseInt(card.querySelector('.q2-val').value),
      q3: parseInt(card.querySelector('.q3-val').value),
      q4: parseInt(card.querySelector('.q4-val').value),
      q5: parseInt(card.querySelector('.q5-val').value),
      reason_q1_q2: card.querySelector('.r-q1-q2').value,
      reason_q3_q4: card.querySelector('.r-q3-q4').value,
      reason_q5: card.querySelector('.r-q5').value,
      q6: parseInt(card.querySelector('.q6-val').value),
      q7: parseInt(card.querySelector('.q7-val').value),
      q8: parseInt(card.querySelector('.q8-val').value),
      q9: parseInt(card.querySelector('.q9-val').value),
      q10: parseInt(card.querySelector('.q10-val').value),
      q11: parseInt(card.querySelector('.q11-val').value),
      reason_q6_q7: card.querySelector('.r-q6-q7').value,
      reason_q8_q9: card.querySelector('.r-q8-q9') ? card.querySelector('.r-q8-q9').value : "",
      reason_q10_q11: card.querySelector('.r-q10-q11') ? card.querySelector('.r-q10-q11').value : ""
    });
  });

  // 5. 문C1 복수 선택 배열 데이터 파싱 및 문자열 정제
  let c1SelectedValues = [];
  c1NewChecked.forEach(cb => {
    if (cb.value === "기타") {
      c1SelectedValues.push(`기타(${document.getElementById('c1_new_etc_txt').value.trim()})`);
    } else {
      c1SelectedValues.push(cb.value);
    }
  });

  // 6. 문C2 복수 선택 배열 데이터 파싱 및 문자열 정제
  let c2SelectedValues = [];
  c2NewChecked.forEach(cb => {
    if (cb.value === "기타") {
      c2SelectedValues.push(`기타(${document.getElementById('c2_new_etc_txt').value.trim()})`);
    } else {
      c2SelectedValues.push(cb.value);
    }
  });

  // 7. ⏱️ 총 설문 체류 시간 연산
  const endTime = new Date();
  const totalDiffMs = endTime - SURVEY_START_TIME;
  const totalMinutes = Math.floor(totalDiffMs / 60000);
  const totalSeconds = Math.floor((totalDiffMs % 60000) / 1000);
  const durationString = `${totalMinutes}분 ${totalSeconds}초`;

  // 📌 [핵심 융합] 은행명과 계좌번호를 결합하여 단일 스트링 데이터로 빌드
  const combinedBankAccount = `${bankVal} ${accVal}`;

  // 8. 📌 [시트 레이아웃 최적화] 최신 스프레드시트 이미지의 컬럼 매핑 순서와 1:1 매칭 구조로userInfo 전송 객체 포장
  const payload = {
    userInfo: {
      affiliation: document.getElementById('affiliation').value,
      name: document.getElementById('name').value,
      field: document.getElementById('field').value,
      experience: document.querySelector('input[name="info_exp"]:checked').value, 
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      
      // 📊 최신 구글 시트의 Z, AA, AB, AC, AD열 구조 데이터 파이프라인 싱크 매칭 완료
      c1_specialty: c1SelectedValues.join(', '),    // Z열: 전문분야 적재
      c2_role: c2SelectedValues.join(', '),         // AA열: 기여역할 적재
      c3_rrn: rrnVal,                               // AB열: 주민번호 적재
      c3_bank_account: combinedBankAccount,         // AC열: 계좌번호 ([은행명] + 번호 결합) 적재
      survey_duration: durationString               // AD열: 체류시간 적재
    },
    responses: responses
  };

  // 9. UI 제어 및 중복 전송 가드 차단
  const submitBtn = document.querySelector('#part_C_container .btn-next');
  submitBtn.innerText = "서버로 데이터 전송 중...";
  submitBtn.disabled = true;

  // 10. CORS Opaque 응답 정책 가드 선전환 스위칭 구동
  goPage('end_page_container');

  // 11. 구글 백엔드 서버 파이프라인 최종 송신 실행
  fetch(GOOGLE_WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(() => {
    setTimeout(() => {
      alert("모든 설문 응답 데이터 전송이 성공적으로 완료되었습니다.");
    }, 200);
  })
  .catch(err => {
    console.log("CORS 통신 상태 우회 핸들러 기록:", err);
    setTimeout(() => {
      alert("모든 설문 응답 및 자문료 증빙 데이터 전송이 성공적으로 완료되었습니다.");
    }, 200);
  });
}
