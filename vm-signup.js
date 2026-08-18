/* VIOL 가입 감지 비콘 v2 — Cafe24 스크립트태그로 로드됨.
   동작: ① 회원가입 폼 페이지에서 클릭/이탈 시점에 아이디 입력값만 기억
        ② 가입 후 다음 페이지에서 회원ID+시각만 1회 전송 (개인정보·할인·화면변화 없음)
   v2: Cafe24 가입 버튼은 JS로 form.submit()을 호출해 submit 이벤트가 발생하지 않음
       → click/pagehide 시점 캡처로 변경. 페이지 판별도 경로 대신 실제 가입폼 존재 여부로.
   제거: /api/scripttag?action=remove 시 즉시 무효. */
(function () {
  try {
    var W = 'https://violmedical-mall.pages.dev/api/webhook?t=violhook';
    var field = function () { return document.querySelector('#member_id, input[name="member_id"]'); };
    var joinForm = document.querySelector('form[action*="/exec/front/Member/join"]') || document.getElementById('joinForm');

    if (joinForm && field()) {
      // 가입 폼 페이지: 클릭·제출·이탈 순간의 아이디 입력값만 기억 (다른 입력값은 접근하지 않음)
      var save = function () {
        try {
          var el = field();
          if (el && el.value && el.value.trim().length >= 4) sessionStorage.setItem('vm_mid', el.value.trim());
        } catch (e) {}
      };
      document.addEventListener('click', save, true);
      document.addEventListener('submit', save, true);
      window.addEventListener('pagehide', save);
      return;
    }

    // 가입 폼이 아닌 페이지: 기억해둔 아이디가 있으면 가입 완료로 보고 1회 전송
    var mid = '';
    try { mid = sessionStorage.getItem('vm_mid') || ''; } catch (e) {}
    if (!mid) return;
    var body = JSON.stringify({ member_id: mid, evt: 'beacon' });
    var sent = false;
    try { sent = navigator.sendBeacon(W, body); } catch (e) {}
    if (!sent) { try { fetch(W, { method: 'POST', body: body, keepalive: true }); } catch (e) {} }
    try { sessionStorage.removeItem('vm_mid'); } catch (e) {}
  } catch (e) {}
})();
