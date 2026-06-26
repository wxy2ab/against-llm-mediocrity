// ==UserScript==
// @name         GLM Coding 10:00 购买窗口助手
// @namespace    local.codex.glm-coding
// @version      1.0.0
// @description  10:00（UTC+8）刷新 GLM Coding 页面，有限重试并只打开购买窗口，付款由用户手动完成。
// @match        https://bigmodel.cn/glm-coding*
// @match        https://www.bigmodel.cn/glm-coding*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    retryDelayMs: 750,
    retryWindowMs: 120_000,
    maxRetries: 80,
    pageReadyTimeoutMs: 5_000,
    dialogTimeoutMs: 3_000,
  };

  const STORAGE_KEY = 'glm-coding-rush-state-v1';
  const PLAN_KEY = 'glm-coding-rush-plan-v1';
  const PANEL_ID = 'glm-coding-rush-panel';
  const PLAN_NAMES = ['Lite', 'Pro', 'Max'];
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function saveState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }

  function clearState(reason = '已停止') {
    const state = loadState() || {};
    saveState({ ...state, armed: false, phase: 'stopped', stopReason: reason });
  }

  function nextShanghaiTen(now = Date.now()) {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
        .formatToParts(new Date(now))
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, Number(part.value)]),
    );

    let target = Date.UTC(parts.year, parts.month - 1, parts.day, 2, 0, 0, 0);
    if (target <= now) {
      target = Date.UTC(parts.year, parts.month - 1, parts.day + 1, 2, 0, 0, 0);
    }
    return target;
  }

  function formatShanghai(epoch) {
    return new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(epoch));
  }

  function isVisible(element) {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }

  function normalizeText(element) {
    return (element?.innerText || element?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function findPlanCard(plan) {
    const candidates = [
      ...document.querySelectorAll('.glm-coding-package-list > *, .package-list > *, [class*="package-card"]'),
    ].filter(isVisible);

    return candidates.find((element) => {
      const text = normalizeText(element);
      return new RegExp(`(^|\\s)${plan}(\\s|$)`, 'i').test(text) || text.includes(`${plan} 套餐`);
    });
  }

  function findPlanButton(plan) {
    const card = findPlanCard(plan);
    if (!card) return null;
    const buttons = [...card.querySelectorAll('button, [role="button"]')].filter(isVisible);
    return (
      buttons.find((button) => /特惠订阅|立即订阅|开启自动续订|订阅升级/.test(normalizeText(button))) ||
      buttons.find((button) => /暂时售罄|抢购人数过多/.test(normalizeText(button))) ||
      null
    );
  }

  function findPurchaseDialog() {
    const dialogs = [...document.querySelectorAll('[role="dialog"], .el-dialog__wrapper, .el-dialog')].filter(isVisible);
    return dialogs.find((dialog) => /订阅|支付|支付宝|微信/.test(normalizeText(dialog))) || null;
  }

  async function waitFor(getValue, timeoutMs, intervalMs = 60) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const value = getValue();
      if (value) return value;
      await sleep(intervalMs);
    }
    return null;
  }

  function scheduleReload(state, reason) {
    if (!state.armed) return;
    const elapsed = Date.now() - state.startedAt;
    if (elapsed >= CONFIG.retryWindowMs || state.attempts >= CONFIG.maxRetries) {
      clearState(`停止：${reason}；已达到重试上限`);
      renderPanel();
      return;
    }

    saveState({
      ...state,
      phase: 'retry-wait',
      attempts: state.attempts + 1,
      lastReason: reason,
      nextReloadAt: Date.now() + CONFIG.retryDelayMs,
    });
    renderPanel();
    setTimeout(() => location.reload(), CONFIG.retryDelayMs);
  }

  async function runAfterTen(state) {
    const current = loadState();
    if (!current?.armed || current.targetAt !== state.targetAt) return;

    saveState({ ...current, phase: 'scanning', startedAt: current.startedAt || Date.now() });
    renderPanel();

    const dialogAlreadyOpen = findPurchaseDialog();
    if (dialogAlreadyOpen) {
      clearState('购买窗口已打开，请手动接管');
      renderPanel();
      alert('GLM Coding 购买窗口已打开，脚本已经停止。请手动确认套餐并付款。');
      return;
    }

    const button = await waitFor(() => findPlanButton(current.plan), CONFIG.pageReadyTimeoutMs);
    if (!button) {
      scheduleReload(loadState(), `未找到 ${current.plan} 套餐按钮`);
      return;
    }

    const text = normalizeText(button);
    const disabled = button.disabled || button.getAttribute('aria-disabled') === 'true' || button.classList.contains('disabled');
    if (disabled || /暂时售罄|抢购人数过多/.test(text)) {
      scheduleReload(loadState(), text || '按钮尚不可用');
      return;
    }

    if (!/特惠订阅|立即订阅|开启自动续订|订阅升级/.test(text)) {
      clearState(`停止：按钮状态不明确（${text || '无文字'}）`);
      renderPanel();
      return;
    }

    saveState({ ...loadState(), phase: 'clicked', lastReason: `已点击：${text}` });
    renderPanel();
    button.click();

    const dialog = await waitFor(findPurchaseDialog, CONFIG.dialogTimeoutMs);
    if (dialog) {
      clearState('购买窗口已打开，请手动接管');
      renderPanel();
      document.title = '【请付款】GLM Coding';
      alert('GLM Coding 购买窗口已打开，脚本已经停止。请手动确认套餐并付款。');
      return;
    }

    scheduleReload(loadState(), '点击后没有检测到购买窗口');
  }

  function arm(plan) {
    const targetAt = nextShanghaiTen();
    localStorage.setItem(PLAN_KEY, plan);
    saveState({
      armed: true,
      phase: 'waiting',
      plan,
      targetAt,
      startedAt: null,
      attempts: 0,
      lastReason: '',
      createdAt: Date.now(),
    });
    renderPanel();
    scheduleTarget();
  }

  function scheduleTarget() {
    const state = loadState();
    if (!state?.armed) return;

    const delay = state.targetAt - Date.now();
    if (delay > 0) {
      setTimeout(scheduleTarget, Math.min(delay, 30_000));
      return;
    }

    if (Date.now() - state.targetAt > CONFIG.retryWindowMs) {
      clearState('目标时间已过，未执行');
      renderPanel();
      return;
    }

    if (!state.startedAt) {
      saveState({ ...state, phase: 'initial-refresh', startedAt: Date.now(), attempts: 1 });
      location.reload();
      return;
    }

    runAfterTen(state);
  }

  function panelMarkup() {
    const savedPlan = localStorage.getItem(PLAN_KEY) || 'Pro';
    return `
      <div style="font-weight:700;margin-bottom:8px">GLM 10:00 助手</div>
      <label style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        套餐
        <select data-role="plan" style="flex:1;padding:4px;background:#fff;color:#111;border:1px solid #bbb;border-radius:4px">
          ${PLAN_NAMES.map((name) => `<option value="${name}" ${name === savedPlan ? 'selected' : ''}>${name}</option>`).join('')}
        </select>
      </label>
      <div data-role="status" style="line-height:1.5;margin-bottom:8px"></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        <button data-role="arm">启动</button>
        <button data-role="locate">测试定位</button>
        <button data-role="stop">停止</button>
      </div>
    `;
  }

  function renderPanel() {
    if (!document.body) return;
    let panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement('div');
      panel.id = PANEL_ID;
      panel.style.cssText = [
        'position:fixed',
        'right:18px',
        'bottom:18px',
        'z-index:2147483647',
        'width:260px',
        'padding:12px',
        'border:1px solid #b9c8ff',
        'border-radius:10px',
        'background:rgba(255,255,255,.97)',
        'color:#17213a',
        'font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
        'box-shadow:0 8px 30px rgba(0,0,0,.18)',
      ].join(';');
      panel.innerHTML = panelMarkup();
      document.body.appendChild(panel);

      for (const button of panel.querySelectorAll('button')) {
        button.style.cssText = 'padding:5px 9px;border:1px solid #9db0ef;border-radius:5px;background:#eef2ff;color:#17377c;cursor:pointer';
      }

      panel.querySelector('[data-role="arm"]').addEventListener('click', () => {
        arm(panel.querySelector('[data-role="plan"]').value);
      });
      panel.querySelector('[data-role="stop"]').addEventListener('click', () => {
        clearState('用户手动停止');
        renderPanel();
      });
      panel.querySelector('[data-role="locate"]').addEventListener('click', () => {
        const plan = panel.querySelector('[data-role="plan"]').value;
        const button = findPlanButton(plan);
        if (!button) {
          alert(`没有定位到 ${plan} 套餐按钮。请确认页面已加载完成，或调整脚本中的定位规则。`);
          return;
        }
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        button.animate(
          [{ outline: '4px solid #ff3b30' }, { outline: '0 solid transparent' }],
          { duration: 1_200, iterations: 2 },
        );
      });
    }

    const state = loadState();
    const status = panel.querySelector('[data-role="status"]');
    if (state?.armed) {
      const remaining = Math.max(0, Math.ceil((state.targetAt - Date.now()) / 1000));
      status.textContent = `已启动：${state.plan}｜${formatShanghai(state.targetAt)}｜阶段 ${state.phase}｜重试 ${state.attempts}/${CONFIG.maxRetries}${remaining ? `｜剩余 ${remaining}s` : ''}${state.lastReason ? `｜${state.lastReason}` : ''}`;
    } else {
      status.textContent = state?.stopReason || '未启动。先选套餐并测试定位。';
    }
  }

  renderPanel();
  setInterval(renderPanel, 1_000);
  scheduleTarget();
})();
