/**
 * 탄소중립 설문조사 공통 로직 및 검증 스크립트
 */

document.addEventListener("DOMContentLoaded", () => {
    loadSessionData();
    initDynamicFields();
    
    // 주민등록번호 입력 시 자동 하이픈 포맷터
    const juminInput = document.getElementById('userJumin');
    if (juminInput) {
        juminInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 6) {
                val = val.substring(0, 6) + '-' + val.substring(6, 13);
            }
            e.target.value = val;
            saveSessionData();
        });
    }

    // 휴대폰 번호 입력 시 자동 하이픈 포맷터
    const phoneInput = document.getElementById('userPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val.length > 3 && val.length <= 7) {
                val = val.substring(0, 3) + '-' + val.substring(3);
            } else if (val.length > 7) {
                val = val.substring(0, 3) + '-' + val.substring(3, 7) + '-' + val.substring(7, 11);
            }
            e.target.value = val;
            saveSessionData();
        });
    }
});

// '기타' 선택 시 입력창 토글 및 이벤트 바인딩
function initDynamicFields() {
    const c1EtcCheckbox = document.getElementById('c1EtcCheck');
    const c1EtcContainer = document.getElementById('c1EtcContainer');
    if (c1EtcCheckbox && c1EtcContainer) {
        c1EtcCheckbox.addEventListener('change', () => {
            c1EtcContainer.style.display = c1EtcCheckbox.checked ? 'flex' : 'none';
            if (!c1EtcCheckbox.checked) document.getElementById('userExpertiseEtc').value = '';
            saveSessionData();
        });
    }

    const c2Select = document.getElementById('userRole');
    const c2EtcContainer = document.getElementById('c2EtcContainer');
    if (c2Select && c2EtcContainer) {
        c2Select.addEventListener('change', () => {
            c2EtcContainer.style.display = c2Select.value === '기타' ? 'flex' : 'none';
            if (c2Select.value !== '기타') document.getElementById('userRoleEtc').value = '';
            saveSessionData();
        });
    }
}

// 데이터 실시간 세션 저장
function saveSessionData() {
    const fields = [
        'userName', 'userCompany', 'userExp', 'userPhone', 'userEmail', 
        'userRole', 'userRoleEtc', 'userExpertiseEtc', 'userJumin', 'userBank', 'userAccount'
    ];
    
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            sessionStorage.setItem(id, element.value.trim());
        }
    });
    
    const privacyAgree = document.getElementById('privacyAgree');
    if (privacyAgree) {
        sessionStorage.setItem('privacyAgree', privacyAgree.checked);
    }

    const expertises = [];
    document.querySelectorAll('input[name="userExpertise"]:checked').forEach(cb => {
        expertises.push(cb.value);
    });
    sessionStorage.setItem('userExpertise', JSON.stringify(expertises));
}

// 세션 데이터 복원 및 화면 상태 맞춤
function loadSessionData() {
    const fields = [
        'userName', 'userCompany', 'userExp', 'userPhone', 'userEmail', 
        'userRole', 'userRoleEtc', 'userExpertiseEtc', 'userJumin', 'userBank', 'userAccount'
    ];
    
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element && sessionStorage.getItem(id)) {
            element.value = sessionStorage.getItem(id);
        }
    });

    const privacyAgree = document.getElementById('privacyAgree');
    if (privacyAgree && sessionStorage.getItem('privacyAgree') === 'true') {
        privacyAgree.checked = true;
    }

    const savedExpertise = sessionStorage.getItem('userExpertise');
    if (savedExpertise) {
        const expertises = JSON.parse(savedExpertise);
        expertises.forEach(val => {
            const cb = document.querySelector(`input[name="userExpertise"][value="${val}"]`);
            if (cb) cb.checked = true;
        });
    }

    const c1EtcCheckbox = document.getElementById('c1EtcCheck');
    const c1EtcContainer = document.getElementById('c1EtcContainer');
    if (c1EtcCheckbox && c1EtcContainer) {
        c1EtcContainer.style.display = c1EtcCheckbox.checked ? 'flex' : 'none';
    }

    const c2Select = document.getElementById('userRole');
    const c2EtcContainer = document.getElementById('c2EtcContainer');
    if (c2Select && c2EtcContainer) {
        c2EtcContainer.style.display = c2Select.value === '기타' ? 'flex' : 'none';
    }
}

// privacy.html 페이지 폼 종합 검증
function validateAndNext() {
    const agreeCheckbox = document.getElementById('privacyAgree');
    const name = document.getElementById('userName').value.trim();
    const company = document.getElementById('userCompany').value.trim();
    const exp = document.getElementById('userExp').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    
    const expertiseChecked = document.querySelectorAll('input[name="userExpertise"]:checked');
    const c1EtcCheckbox = document.getElementById('c1EtcCheck');
    const expertiseEtc = document.getElementById('userExpertiseEtc').value.trim();
    
    const role = document.getElementById('userRole').value;
    const roleEtc = document.getElementById('userRoleEtc').value.trim();
    
    const jumin = document.getElementById('userJumin').value.trim();
    const bank = document.getElementById('userBank').value.trim();
    const account = document.getElementById('userAccount').value.trim();

    if (!agreeCheckbox || !agreeCheckbox.checked) {
        alert("설문 및 자문료 정산 진행을 위해 개인정보 수집 동의에 체크해 주세요.");
        return;
    }
    if (!name || !company || !exp || !phone || !email) {
        alert("응답자 기본 정보를 모두 기입해 주세요.");
        return;
    }
    if (phone.replace(/-/g, '').length < 10) {
        alert("올바른 휴대폰 번호를 입력해 주세요.");
        return;
    }
    if (expertiseChecked.length === 0) {
        alert("귀하의 전문 분야를 최소 하나 이상 선택해 주세요.");
        return;
    }
    if (c1EtcCheckbox.checked && !expertiseEtc) {
        alert("전문 분야 '기타'의 세부 내용을 입력해 주세요.");
        return;
    }
    if (!role) {
        alert("귀하의 산업 기여 역할을 선택해 주세요.");
        return;
    }
    if (role === '기타' && !roleEtc) {
        alert("기여 역할 '기타'의 세부 내용을 입력해 주세요.");
        return;
    }
    if (!jumin || jumin.replace('-', '').length !== 13) {
        alert("주민등록번호 13자리를 올바르게 기입해 주세요.");
        return;
    }
    if (!bank || !account) {
        alert("자문료 지급을 위한 은행명과 계좌번호를 기입해 주세요.");
        return;
    }

    saveSessionData();
    location.href = 'survey_info.html';
}

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // 프론트엔드(survey_main.html)에서 전송된 전체 폼 데이터 파싱
    const payload = JSON.parse(e.postData.contents);
    
    // 8대 주요 감축 기술명 배열 정의 (K열 tech_name 매핑용)
    const techNames = [
      "저온 플라즈마 산화 공정",
      "AI기반 극저온 식각 공정",
      "ALD 증착 및 저온 플라즈마 이온주입 공정",
      "Hybrid 세정 공정",
      "저 GWP 가스 이용 식각 공정",
      "저 GWP 가스 이용 증착 공정",
      "저 GWP 가스 이용 세정 공정",
      "증착/세정 공정용 Heat-cat-wet"
    ];
    
    // 기술 1(T1)부터 기술 8(T8)까지 루프를 돌며 총 8개의 행을 연속으로 쌓음
    for (let i = 0; i < 8; i++) {
      const tNum = i + 1;
      const tId = "T" + tNum; // T1, T2, T3 ... 변수 매핑용 접두사
      
      // image_ec87e1.png에 정의된 A열부터 V열까지의 순서와 1:1 대응하는 배열 생성
      const rowData = [
        payload.userName,          // A: name
        payload.userCompany,       // B: affiliation (소속/직급)
        payload.userExp,           // C: career (경력)
        payload.userPhone,         // D: mobile (휴대폰 번호)
        payload.userEmail,         // E: email
        payload.userExpertise,     // F: experience (C1 전문분야 선택값)
        payload.userRole,          // G: job (C2 기여 역할)
        payload.userJumin,         // H: id (주민등록번호)
        payload.userBank,          // I: bank (은행명)
        payload.userAccount,       // J: account (계좌번호)
        techNames[i],              // K: tech_name (8대 주요 감축 기술명)
        
        // 정량 전망 데이터 매핑 (B1 ~ B4)
        payload[tId + '_B1_First'],  // L: ini_year (최초 상용화 시점)
        payload[tId + '_B1_50Pct'],  // M: 50_year (50% 상용화 시점)
        
        payload[tId + '_B2_Adv'],    // N: Adv CAPEX (투자 비용 - 낙관)
        payload[tId + '_B3_Adv'],    // O: Adv OPEX (변동 유지보수 비용 - 낙관)
        payload[tId + '_B4_Adv'],    // P: Adv Energy (에너지 소비 감소 수준 - 낙관)
        
        payload[tId + '_B2_Mod'],    // Q: Mod CAPEX (투자 비용 - 중립)
        payload[tId + '_B3_Mod'],    // R: Mod OPEX (변동 유지보수 비용 - 중립)
        payload[tId + '_B4_Mod'],    // S: Mod Energy (에너지 소비 감소 수준 - 중립)
        
        payload[tId + '_B2_Con'],    // T: Con CAPEX (투자 비용 - 비관)
        payload[tId + '_B3_Con'],    // U: Con OPEX (변동 유지보수 비용 - 비관)
        payload[tId + '_B4_Con']     // V: Con Energy (에너지 소비 감소 수준 - 비관)
      ];
      
      // 스프레드시트의 다음 빈 행에 누적 데이터 삽입
      sheet.appendRow(rowData);
    }
    
    // 프론트엔드 CORS 정책 우회를 위한 성공 메시지 반환
    return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    // 에러 발생 시 디버깅을 위한 에러 메시지 반환
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}