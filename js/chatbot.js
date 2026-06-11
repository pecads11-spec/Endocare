(function () {
    "use strict";

    const isEnglish = window.location.pathname.includes('/en/');

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

    let fab, overlay, closeBtn, messagesEl, inputEl, sendBtn, charCount, quickRepliesEl, networkBanner;

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
        return d.toLocaleTimeString(isEnglish ? 'en-US' : 'ar-YE', { hour: '2-digit', minute: '2-digit' });
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
            retry.textContent = isEnglish ? 'Retry' : 'إعادة المحاولة';
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
        if (quickRepliesEl) quickRepliesEl.classList.remove('hidden');
    }

    function hideQuickReplies() {
        if (quickRepliesEl) quickRepliesEl.classList.add('hidden');
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

    let companyProfile = null;

    async function loadCompanyProfile() {
        if (!companyProfile) {
            try {
                const path = isEnglish ? '/en/bot_core/company_profile.json' : '/ar/bot_core/company_profile.json';
                let res = await fetch(path);
                if (!res.ok && isEnglish) {
                    res = await fetch('/ar/bot_core/company_profile.json');
                }
                if (res.ok) {
                    companyProfile = await res.json();
                }
            } catch (e) {
                console.error("Error loading company profile:", e);
            }
        }
        return companyProfile;
    }

    async function processBotQuery(userText) {
        const text = userText.trim();
        const lowerText = text.toLowerCase();

        // 1. Triage: Check for Operations & Sales (Company Profile)
        const matchesSales = isEnglish ?
            (lowerText.includes('buy') || lowerText.includes('purchase') || lowerText.includes('contact') || lowerText.includes('management') || lowerText.includes('support') || lowerText.includes('address') || lowerText.includes('phone') || lowerText.includes('customer service') || lowerText.includes('hours') || lowerText.includes('order')) :
            (text.includes('شراء') || text.includes('تواصل') || text.includes('ادارة') || text.includes('دعم') || text.includes('عنوان') || text.includes('هاتف') || text.includes('خدمة عملاء') || text.includes('مواعيد') || text.includes('طلب'));

        if (matchesSales) {
            const profile = await loadCompanyProfile();
            if (profile) {
                if (isEnglish) {
                    return {
                        answer: `You can contact us via the following methods:\n- Customer Service: ${profile.contact.customerService}\n- Email: ${profile.contact.email}\n- Working Hours: ${profile.workingHoursEn || profile.workingHours}\n- Address: ${profile.location.mainBranch.addressEn || profile.location.mainBranch.address}, ${profile.location.countryEn || profile.location.country}.`,
                        type: 'normal'
                    };
                } else {
                    return {
                        answer: `يمكنك التواصل معنا عبر الطرق التالية:\n- خدمة العملاء: ${profile.contact.customerService}\n- البريد الإلكتروني: ${profile.contact.email}\n- أوقات العمل: ${profile.workingHours}\n- العنوان: ${profile.location.mainBranch.address}، ${profile.location.country}.`,
                        type: 'normal'
                    };
                }
            }
        }

        // 2. Local Database Sync (Products checking)
        try {
            let syncModule;
            try {
                syncModule = await import(isEnglish ? '../en/bot_core/site_sync_config.js' : '../ar/bot_core/site_sync_config.js');
            } catch (importErr) {
                // Fallback to ar/bot_core/site_sync_config.js if en/ doesn't exist
                syncModule = await import('../ar/bot_core/site_sync_config.js');
            }
            const SiteSyncConfig = syncModule.default;
            const matchedProducts = SiteSyncConfig.searchProducts(text);

            if (matchedProducts && matchedProducts.length > 0) {
                const p = matchedProducts[0];
                if (isEnglish) {
                    return {
                        answer: `We found a product matching your inquiry in our medical catalog:\n\n**${p.nameEn || p.nameAr}**\n- Category: ${p.categoryEn || p.category}\n- Country of Origin: ${p.originEn || p.origin}\n- Description: ${p.descEn || p.desc || 'No description available'}\n\nWould you like to know more?`,
                        type: 'normal'
                    };
                } else {
                    return {
                        answer: `وجدنا منتجاً يطابق استفسارك من الكتالوج الطبي الخاص بنا:\n\n**${p.nameAr} (${p.nameEn})**\n- التصنيف: ${p.category}\n- بلد المنشأ: ${p.origin}\n- الوصف: ${p.desc || 'لا يوجد وصف متاح'}\n\nهل ترغب في معرفة المزيد؟`,
                        type: 'normal'
                    };
                }
            }
        } catch (e) {
            console.error("Error linking with site sync logic:", e);
        }

        // 3. Fallback (Knowledge Base / Web logic simplified simulation)
        var answersAr = {
            'شحنة': 'بخصوص الشحنات والتوريد، نعمل وفق أعلى معايير سلسلة التبريد لضمان الجودة. يمكنك طلب توريد من قسم الطلبات.',
            'كتالوج': 'يتوفر لدينا كتالوج شامل يشمل الفيتامينات والهرمونات. يمكنك استخدام محرك البحث في قسم المنتجات.',
            'علمي': 'الفيتامينات مثل D3 تلعب دوراً محورياً في دعم المناعة. الهرمونات البديلة تستخدم تحت إشراف طبي. تُعد هذه المعلومات إرشادية وتثقيفية، ويُنصح دائماً باستشارة طبيبك المختص.'
        };

        var answersEn = {
            'شحنة': 'Regarding shipments and supply, we operate according to the highest cold chain standards to guarantee quality. You can request supply from the orders section.',
            'كتالوج': 'We have a comprehensive catalog that includes vitamins and hormones. You can use the search bar in the products section.',
            'علمي': 'Vitamins such as D3 play a pivotal role in supporting immunity. Hormone replacement therapies are used under medical supervision. This information is for guidance and educational purposes only; it is always recommended to consult your specialist doctor.'
        };

        var answers = isEnglish ? answersEn : answersAr;
        var reply = answers['علمي'];

        const matchesShipment = isEnglish ?
            (lowerText.includes('ship') || lowerText.includes('supply') || lowerText.includes('logist')) :
            (text.includes('شحن') || text.includes('توريد') || text.includes('لوجست'));

        const matchesCatalog = isEnglish ?
            (lowerText.includes('catalog') || lowerText.includes('product')) :
            (text.includes('كتالوج') || text.includes('منتجات'));

        const matchesPrice = isEnglish ?
            (lowerText.includes('price') || lowerText.includes('discount')) :
            (text.includes('سعر') || text.includes('خصم'));

        if (matchesShipment) {
            reply = answers['شحنة'];
        } else if (matchesCatalog) {
            reply = answers['كتالوج'];
        } else if (matchesPrice) {
            reply = isEnglish ? 
                'For commercial pricing inquiries, please contact sales directly. How else can I help you?' :
                'للاستفسار عن الأسعار التجارية، يرجى التواصل مع المبيعات مباشرة. كيف يمكنني مساعدتك بخلاف ذلك؟';
        }

        return {
            answer: reply,
            type: 'normal'
        };
    }

    function callBotAPI(userText, sessionId) {
        return processBotQuery(userText);
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
                const errorMsg = isEnglish ? 
                    'Sorry, I encountered a connection issue. Please check your internet and try again.' :
                    'عذراً، واجهت مشكلة في الاتصال. يرجى التحقق من الإنترنت وإعادة المحاولة.';
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

        if (isEnglish) {
            addBotMessage('Welcome to Endocare! I am your AI assistant. Are you looking for information about hormone shipments and supply, or do you have a scientific question about vitamins?');
        } else {
            addBotMessage('مرحباً بك في Endocare! أنا مساعدك الذكي. هل تبحث عن معلومات حول شحنات وتوريد الهرمونات، أم لديك سؤال علمي حول الفيتامينات؟');
        }
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
    function openChat(e) {
        if (e) {
            e.stopPropagation();
        }
        if (!fab.classList.contains('expanded')) {
            fab.classList.add('expanded');
            return;
        }
        if (STATE.isOpen) return;
        STATE.isOpen = true;
        overlay.classList.add('open');
        fab.style.display = 'none';
        fab.classList.remove('expanded'); // Reset expanded state
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

    // ─── Inject HTML ─────────────────────────────────────────────────────────
    function injectChatbotHTML() {
        if (document.getElementById('chatbot-overlay')) return; // Already injected
        
        const html = isEnglish ? `
    <!-- Chat Overlay -->
    <div id="chatbot-overlay" class="chatbot-overlay" style="direction: ltr;">
        <div class="chatbot-container">
            <!-- Header -->
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-avatar">
                        <i class="bi bi-robot"></i>
                    </div>
                    <div>
                        <h5 class="chatbot-title">Endocare AI Assistant</h5>
                        <span class="chatbot-status">Online - Ready to answer your medical and logistical inquiries</span>
                    </div>
                </div>
                <button id="chatbot-close" class="btn btn-sm chatbot-close-btn" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Messages -->
            <div id="chatbot-messages" class="chatbot-messages">
                <!-- Messages will be rendered here by JS -->
            </div>

            <!-- Network Banner -->
            <div id="chatbot-network-banner" class="chatbot-network-banner d-none">
                <i class="bi bi-wifi-off me-2"></i>
                <span>Sorry, you are offline. Your message will be saved.</span>
            </div>

            <!-- Input Area -->
            <div class="chatbot-input-area">
                <div class="chatbot-input-wrapper">
                    <textarea id="chatbot-input" class="chatbot-input" rows="1" placeholder="Type your question here about hormones, vitamins, or our services..." maxlength="500"></textarea>
                    <button id="chatbot-send" class="btn btn-primary chatbot-send-btn" aria-label="Send">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
                <div class="chatbot-char-count"><span id="chatbot-char-count">0</span>/500</div>
            </div>
        </div>
    </div>` : `
    <!-- Chat Overlay -->
    <div id="chatbot-overlay" class="chatbot-overlay">
        <div class="chatbot-container">
            <!-- Header -->
            <div class="chatbot-header">
                <div class="chatbot-header-info">
                    <div class="chatbot-avatar">
                        <i class="bi bi-robot"></i>
                    </div>
                    <div>
                        <h5 class="chatbot-title">مساعد Endocare AI</h5>
                        <span class="chatbot-status">متصل - جاهز للإجابة على استفساراتك الطبية واللوجستية</span>
                    </div>
                </div>
                <button id="chatbot-close" class="btn btn-sm chatbot-close-btn" aria-label="إغلاق">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Messages -->
            <div id="chatbot-messages" class="chatbot-messages">
                <!-- Messages will be rendered here by JS -->
            </div>

            <!-- Network Banner -->
            <div id="chatbot-network-banner" class="chatbot-network-banner d-none">
                <i class="bi bi-wifi-off ms-2"></i>
                <span>عذراً، أنت غير متصل بالإنترنت. سيتم حفظ رسالتك.</span>
            </div>

            <!-- Input Area -->
            <div class="chatbot-input-area">
                <div class="chatbot-input-wrapper">
                    <textarea id="chatbot-input" class="chatbot-input" rows="1" placeholder="اكتب سؤالك هنا حول الهرمونات، الفيتامينات، أو خدماتنا..." maxlength="500"></textarea>
                    <button id="chatbot-send" class="btn btn-primary chatbot-send-btn" aria-label="إرسال">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
                <div class="chatbot-char-count"><span id="chatbot-char-count">0</span>/500</div>
            </div>
        </div>
    </div>`;
        const container = document.createElement('div');
        container.id = 'endocare-chatbot-wrapper';
        container.innerHTML = html;
        document.body.appendChild(container);
    }

    // ─── Init ────────────────────────────────────────────────────────────────
    function init() {
        injectChatbotHTML();
        
        // Initialize DOM refs
        fab = $('#chatbot-fab');
        overlay = $('#chatbot-overlay');
        closeBtn = $('#chatbot-close');
        messagesEl = $('#chatbot-messages');
        inputEl = $('#chatbot-input');
        sendBtn = $('#chatbot-send');
        charCount = $('#chatbot-char-count');
        quickRepliesEl = $('#chatbot-quick-replies');
        networkBanner = $('#chatbot-network-banner');

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
