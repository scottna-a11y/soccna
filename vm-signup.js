/* VIOL 가입 감지 비콘 — Cafe24 스크립트태그로 로드됨.
   동작: ① 회원가입 폼 제출 시 아이디를 브라우저 세션에 기억
        ② 가입 완료 후 다음 페이지에서 회원ID+시각만 1회 전송 (개인정보·할인·화면변화 없음)
   제거: 스크립트태그 삭제(/api/scripttag?action=remove) 시 즉시 무효. */
(function () {
  try {
    var W = 'https://violmedical-mall.pages.dev/api/webhook?t=violhook';
    var p = (location.pathname || '').toLowerCase();
    var isJoinForm = /join/.test(p) && !/join_ok|joinok|join_complete|joincomplete|join_result|result/.test(p);

    if (isJoinForm) {
      // 가입 폼 페이지: 제출 순간 입력된 아이디만 기억 (비밀번호 등 다른 값은 접근하지 않음)
      document.addEventListener('submit', function () {
        try {
          var el = document.querySelector('input[name="member_id"], #member_id');
          if (el && el.value) sessionStorage.setItem('vm_mid', el.value.trim());
        } catch (e) {}
      }, true);
      return;
    }

    // 가입 폼이 아닌 페이지: 기억해둔 아이디가 있으면 가입 성공으로 보고 1회 전송
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
