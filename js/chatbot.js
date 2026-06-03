(function () {
    "use strict";

    // ─── State ───────────────────────────────────────────────────────────────
    const STATE = {
        sessionId: null,
        isOpen: false,
        isProcessing: false,
        isOffline: !navigator.onLine,
        messages: [],
        unsentText: '',
    };

    // ─── DOM refs ────────────────────────────────────────────────────────────
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const fab = $('#chatbot-fab');
    const overlay = $('#chatbot-overlay');
    const closeBtn = $('#chatbot-close');
    const messagesEl = $('#chatbot-messages');
    const inputEl = $('#chatbot-input');
    const sendBtn = $('#chatbot-send');
    const charCount = $('#chatbot-char-count');
    const quickRepliesEl = $('#chatbot-quick-replies');
    const networkBanner = $('#chatbot-network-banner');
    const typingEl = document.getElementById('chatbot-typing');

    // ─── Utils ───────────────────────────────────────────────────────────────
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    function isoNow() {
        return new Date().toISOString();
    }

    function formatTime(iso) {
        const d = new Date(iso);
        return d.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' });
    }

    // ─── Storage ─────────────────────────────────────────────────────────────
    function saveConversation() {
        try {
            const data = {
                sessionId: STATE.sessionId,
                messages: STATE.messages,
                timestamp: Date.now(),
            };
            localStorage.setItem('endocare_chat_history', JSON.stringify(data));
        } catch (e) { /* storage full or blocked */ }
    }

    function loadConversation() {
        try {
            const raw = localStorage.getItem('endocare_chat_history');
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (data && data.sessionId && Array.isArray(data.messages)) {
                return data;
            }
        } catch (e) { /* ignore */ }
        return null;
    }

    function clearConversation() {
        try {
            localStorage.removeItem('endocare_chat_history');
        } catch (e) { /* ignore */ }
    }

    // ─── Render ──────────────────────────────────────────────────────────────
    function renderMessages() {
        messagesEl.innerHTML = '';
        STATE.messages.forEach(function (msg) {
            appendMessageDOM(msg, false);
        });
        scrollToBottom();
    }

    function appendMessageDOM(msg, doScroll) {
        const div = document.createElement('div');
        div.className = 'message';

        if (msg.role === 'bot') {
            div.classList.add('message-bot');
            if (msg.type === 'error') div.classList.add('message-error');
            if (msg.type === 'out-of-scope') div.classList.add('message-out-of-scope');
        } else {
            div.classList.add('message-user');
        }

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        if (msg.role === 'user' && msg.status === 'pending') {
            bubble.classList.add('pending');
        }
        bubble.textContent = msg.text;

        div.appendChild(bubble);

        if (msg.role === 'bot' && msg.type === 'error') {
            const retry = document.createElement('button');
            retry.className = 'retry-btn';
            retry.textContent = 'إعادة المحاولة';
            retry.addEventListener('click', function () {
                retrySend(msg._originalText || '');
            });
            div.appendChild(retry);
        }

        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = formatTime(msg.timestamp);
        div.appendChild(time);

        messagesEl.appendChild(div);
        if (doScroll !== false) scrollToBottom();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        let el = document.querySelector('.typing-indicator');
        if (!el) {
            el = document.createElement('div');
            el.className = 'typing-indicator active';
            el.id = 'chatbot-typing';
            el.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
            messagesEl.appendChild(el);
        } else {
            el.classList.add('active');
        }
        scrollToBottom();
    }

    function hideTyping() {
        const el = document.querySelector('.typing-indicator');
        if (el) el.classList.remove('active');
    }

    function showQuickReplies() {
        quickRepliesEl.classList.remove('hidden');
    }

    function hideQuickReplies() {
        quickRepliesEl.classList.add('hidden');
    }

    // ─── Bot messages ────────────────────────────────────────────────────────
    function addBotMessage(text, type) {
        const msg = {
            id: generateUUID(),
            role: 'bot',
            text: text,
            timestamp: isoNow(),
            type: type || 'normal',
        };
        STATE.messages.push(msg);
        appendMessageDOM(msg);
        saveConversation();
        return msg;
    }

    function addUserMessage(text) {
        const msg = {
            id: generateUUID(),
            role: 'user',
            text: text.trim(),
            timestamp: isoNow(),
            status: 'pending',
            category: null,
        };
        STATE.messages.push(msg);
        appendMessageDOM(msg);
        saveConversation();
        return msg;
    }

    function markLastUserSent() {
        for (let i = STATE.messages.length - 1; i >= 0; i--) {
            if (STATE.messages[i].role === 'user' && STATE.messages[i].status === 'pending') {
                STATE.messages[i].status = 'sent';
                break;
            }
        }
        saveConversation();
    }

    // ─── Static demo responses ────────────────────────────────────────────────
    function getDemoResponse(userText) {
        var text = userText.trim();

        var answers = {
            'شحنة': 'بخصوص الشحنات والتوريد، نعمل وفق أعلى معايير سلسلة التبريد (Cold Chain) لضمان وصول المنتجات بحالة ممتازة. جميع شحناتنا مغطاة بوثائق التخليص الجمركي وشهادات المنشأ. هل تود الاستفسار عن شحنة محددة؟',
            'علمي': 'يسعدني تقديم معلومات علمية دقيقة! الفيتامينات مثل D3 و B-complex تلعب دوراً محورياً في دعم المناعة والطاقة. أما الهرمونات البديلة مثل HGH والتستوستيرون فتستخدم تحت إشراف طبي لعلاج قصور الغدد. هل هناك فيتامين أو هرمون معين تود معرفة المزيد عنه؟',
            'كتالوج': 'يتوفر لدينا كتالوج شامل يشمل: الفيتامينات المتعددة (Centrum، Solgar)، الهرمونات البديلة (HGH، التستوستيرون)، هرمونات الخصوبة (FSH، hCG)، والمكملات المتخصصة (أوميغا 3، الحديد الوريدي). يمكنك زيارة صفحة المنتجات للاطلاع على الكتالوج الكامل.',
        };

        var reply = answers['علمي'];
        var type = 'normal';

        if (text.includes('شحن') || text.includes('توريد') || text.includes('لوجست')) {
            reply = answers['شحنة'];
        } else if (text.includes('كتالوج') || text.includes('منتج') || text.includes('هرمون')) {
            reply = answers['كتالوج'];
        } else if (text.includes('فيتامين') || text.includes('علم') || text.includes('صحي')) {
            reply = answers['علمي'];
        } else if (text.includes('سعر') || text.includes('شراء') || text.includes('خصم')) {
            reply = 'أعتذر منك، تخصصي ينحصر في علم الهرمونات والفيتامينات والخدمات اللوجستية لشركة Endocare. كيف يمكنني مساعدتك في هذا النطاق؟';
            type = 'out-of-scope';
        }

        return {
            answer: reply,
            category: 'General',
            type: type,
        };
    }

    function callBotAPI(userText, sessionId) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(getDemoResponse(userText));
            }, 800);
        });
    }

    // ─── Send flow ───────────────────────────────────────────────────────────
    function retrySend(text) {
        // Remove the last error message from bot
        for (let i = STATE.messages.length - 1; i >= 0; i--) {
            if (STATE.messages[i].role === 'bot' && STATE.messages[i].type === 'error') {
                STATE.messages.splice(i, 1);
                break;
            }
        }
        saveConversation();
        renderMessages();
        sendMessage(text, true);
    }

    function sendMessage(text, isRetry) {
        if (!text || !text.trim()) return;
        if (STATE.isProcessing) return;
        if (STATE.isOffline) {
            STATE.unsentText = text;
            inputEl.value = text;
            updateCharCount();
            return;
        }

        STATE.isProcessing = true;
        sendBtn.disabled = true;
        hideQuickReplies();

        if (!isRetry) {
            addUserMessage(text);
        }
        markLastUserSent();
        inputEl.value = '';
        updateCharCount();
        showTyping();

        callBotAPI(text, STATE.sessionId)
            .then(function (res) {
                hideTyping();
                addBotMessage(res.answer, res.type);
                STATE.isProcessing = false;
                sendBtn.disabled = false;
                if (res.type !== 'out-of-scope') {
                    showQuickReplies();
                }
                saveConversation();
            })
            .catch(function (err) {
                hideTyping();
                const errorMsg = 'عذراً، واجهت مشكلة في الاتصال. يرجى التحقق من الإنترنت وإعادة المحاولة.';
                const msg = {
                    id: generateUUID(),
                    role: 'bot',
                    text: errorMsg,
                    timestamp: isoNow(),
                    type: 'error',
                    _originalText: text,
                };
                STATE.messages.push(msg);
                appendMessageDOM(msg);
                STATE.isProcessing = false;
                sendBtn.disabled = false;
                showQuickReplies();
                saveConversation();
            });
    }

    // ─── Welcome / Triage ────────────────────────────────────────────────────
    function showWelcome() {
        const saved = loadConversation();
        if (saved && saved.messages && saved.messages.length > 0) {
            STATE.sessionId = saved.sessionId || generateUUID();
            STATE.messages = saved.messages;
            renderMessages();
            hideQuickReplies();
            return;
        }

        STATE.sessionId = generateUUID();
        STATE.messages = [];
        saveConversation();

        addBotMessage('مرحباً بك في Endocare! أنا مساعدك الذكي. هل تبحث عن معلومات حول شحنات وتوريد الهرمونات، أم لديك سؤال علمي حول الفيتامينات؟');
        showQuickReplies();
    }

    // ─── Input auto-resize + char count ──────────────────────────────────────
    function updateCharCount() {
        const len = inputEl.value.length;
        charCount.textContent = len;
    }

    function autoResize() {
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    }

    // ─── Network status ──────────────────────────────────────────────────────
    function handleOnline() {
        STATE.isOffline = false;
        networkBanner.classList.add('d-none');
        sendBtn.disabled = STATE.isProcessing;
        if (STATE.unsentText) {
            const text = STATE.unsentText;
            STATE.unsentText = '';
            sendMessage(text);
        }
    }

    function handleOffline() {
        STATE.isOffline = true;
        networkBanner.classList.remove('d-none');
        sendBtn.disabled = true;
    }

    // ─── Open / Close ────────────────────────────────────────────────────────
    function openChat() {
        if (STATE.isOpen) return;
        STATE.isOpen = true;
        overlay.classList.add('open');
        fab.style.display = 'none';
        showWelcome();
        setTimeout(function () { inputEl.focus(); }, 400);
    }

    function closeChat() {
        if (!STATE.isOpen) return;
        STATE.isOpen = false;
        overlay.classList.remove('open');
        fab.style.display = 'flex';
    }

    // ─── Quick Reply handler ─────────────────────────────────────────────────
    function handleQuickReply(e) {
        const btn = e.currentTarget;
        const query = btn.getAttribute('data-query') || '';
        const label = btn.textContent.trim();
        inputEl.value = label;
        updateCharCount();
        sendMessage(label);
    }

    // ─── Init ────────────────────────────────────────────────────────────────
    function init() {
        // Event listeners
        fab.addEventListener('click', openChat);
        closeBtn.addEventListener('click', closeChat);

        sendBtn.addEventListener('click', function () {
            sendMessage(inputEl.value);
        });

        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputEl.value);
            }
        });

        inputEl.addEventListener('input', function () {
            updateCharCount();
            autoResize();
        });

        // Quick replies
        $$('.quick-reply-btn').forEach(function (btn) {
            btn.addEventListener('click', handleQuickReply);
        });

        // Network events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial offline check
        if (STATE.isOffline) {
            handleOffline();
        }

        // Load conversation from storage on page load to restore UI if needed
        // Chat only fully opens on FAB click
    }

    // ─── Kickoff ─────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
