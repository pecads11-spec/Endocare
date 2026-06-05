(function () {
    "use strict";

    const SUBSTANCE_DB = {
        'Hydrocortisone': { origin: 'ألمانيا', batch: 'HYD-2026-01' },
        'Testosterone': { origin: 'بلجيكا', batch: 'TST-2026-03' },
        'Vitamin D3': { origin: 'سويسرا', batch: 'VD3-2026-02' },
    };

    const STATE = {
        isSubmitting: false,
    };

    let fab, modalEl, formEl, submitBtn;

    function generateTicket() {
        return 'PV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    function isoNow() {
        return new Date().toISOString();
    }

    function injectPVHTML() {
        if (document.getElementById('pvModal')) return;

        const html = `
    <div class="modal fade" id="pvModal" tabindex="-1" aria-labelledby="pvModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content pv-glass-modal">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title" id="pvModalLabel"><i class="bi bi-shield-plus me-2 text-primary"></i>التيقظ الدوائي</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="pv-section">
                        <div class="pv-badge bg-green-light text-dark"><i class="bi bi-box-seam me-1"></i>1. بيانات المادة الفعالة</div>
                        <div class="row g-2 mt-1">
                            <div class="col-sm-6">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-substance" placeholder="اسم المادة أو CAS" list="pv-substances" autocomplete="off">
                                    <label for="pv-substance">اسم المادة أو CAS</label>
                                    <datalist id="pv-substances">
                                        <option value="Hydrocortisone">
                                        <option value="Testosterone">
                                        <option value="Vitamin D3">
                                    </datalist>
                                </div>
                            </div>
                            <div class="col-sm-3 col-6">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-batch" placeholder="رقم التشغيلة">
                                    <label for="pv-batch">التشغيلة (Batch)</label>
                                </div>
                            </div>
                            <div class="col-sm-3 col-6">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control bg-light" id="pv-origin" placeholder="المنشأ" readonly>
                                    <label for="pv-origin">بلد المنشأ</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pv-section mt-3">
                        <div class="pv-badge bg-warning text-dark"><i class="bi bi-exclamation-triangle me-1"></i>2. نوع المتغير <span id="pv-type-count" class="badge bg-dark ms-2">0</span></div>
                        <div class="row g-2 mt-1">
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="ظهور عرض جانبي غير متوقع">
                                    <span class="pv-check-content">
                                        <i class="bi bi-person-x fs-5 me-2 text-danger"></i> ظهور عرض جانبي غير متوقع
                                    </span>
                                </label>
                            </div>
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="انعدام أو ضعف الفعالية العلاجية">
                                    <span class="pv-check-content">
                                        <i class="bi bi-graph-down-arrow fs-5 me-2 text-warning"></i> انعدام أو ضعف الفعالية العلاجية
                                    </span>
                                </label>
                            </div>
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="اشتباه في جودة العبوة أو المادة">
                                    <span class="pv-check-content">
                                        <i class="bi bi-box-seam-fill fs-5 me-2 text-info"></i> اشتباه في جودة العبوة أو المادة
                                    </span>
                                </label>
                            </div>
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="خطأ دوائي أو جرعة غير متطابقة">
                                    <span class="pv-check-content">
                                        <i class="bi bi-prescription2 fs-5 me-2 text-primary"></i> خطأ دوائي أو جرعة غير متطابقة
                                    </span>
                                </label>
                            </div>
                            <div class="col-12">
                                <div class="form-floating pv-density mt-1">
                                    <input type="text" class="form-control" id="pv-custom-type" placeholder="أدخل تفاصيل أخرى">
                                    <label for="pv-custom-type"><i class="bi bi-pencil-square me-1"></i>مخصص (أدخل تفاصيل أخرى)</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pv-section mt-3">
                        <div class="pv-badge bg-primary text-white"><i class="bi bi-person-badge me-1"></i>3. بيانات مقدم البلاغ</div>
                        <div class="row g-2 mt-1">
                            <div class="col-12">
                                <div class="form-floating pv-density">
                                    <textarea class="form-control" placeholder="وصف مقتضب للحالة" id="pv-desc" style="height: 50px"></textarea>
                                    <label for="pv-desc">وصف مقتضب للحالة</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-name" placeholder="الاسم">
                                    <label for="pv-name">الاسم</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-org" placeholder="الجهة">
                                    <label for="pv-org">الجهة (مستشفى/صيدلية)</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-floating pv-density">
                                    <input type="tel" class="form-control" id="pv-phone" placeholder="رقم الهاتف">
                                    <label for="pv-phone">هاتف الطوارئ</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-floating pv-density mt-1">
                                    <textarea class="form-control" placeholder="ملاحظات إضافية" id="pv-notes" style="height: 60px"></textarea>
                                    <label for="pv-notes">ملاحظات إضافية</label>
                                </div>
                            </div>
                            <div class="col-12 mt-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="pv-consent">
                                    <label class="form-check-label small" for="pv-consent">
                                        أوافق على نقل بياناتي وبيانات الحالة المبلغ عنها إلى إدارة اليقظة الدوائية في EndoCare ومعالجتها وفقاً لسياسة الخصوصية.
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0 justify-content-center">
                    <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">إلغاء</button>
                    <button type="button" class="btn btn-danger px-5 py-3 fw-bold" id="pv-submit-btn">
                        <i class="bi bi-send-check me-2"></i>إرسال التقرير
                    </button>
                </div>
            </div>
        </div>
    </div>`;

        const wrapper = document.createElement('div');
        wrapper.id = 'endocare-pv-wrapper';
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
    }

    function get$(id) { return document.getElementById(id); }

    function updateOrigin() {
        const substance = get$('pv-substance').value.trim();
        const originField = get$('pv-origin');
        const batchField = get$('pv-batch');
        if (SUBSTANCE_DB[substance]) {
            originField.value = SUBSTANCE_DB[substance].origin;
            if (!batchField.value) {
                batchField.value = SUBSTANCE_DB[substance].batch;
            }
        } else {
            originField.value = '';
        }
    }

    function updateTypeCount() {
        const checked = document.querySelectorAll('input[name="pv-type"]:checked').length;
        get$('pv-type-count').textContent = checked;
    }

    function resetForm() {
        get$('pv-substance').value = '';
        get$('pv-batch').value = '';
        get$('pv-origin').value = '';
        get$('pv-desc').value = '';
        get$('pv-name').value = '';
        get$('pv-org').value = '';
        get$('pv-phone').value = '';
        get$('pv-custom-type').value = '';
        get$('pv-notes').value = '';
        get$('pv-consent').checked = false;
        document.querySelectorAll('input[name="pv-type"]').forEach(function (cb) { cb.checked = false; });
        updateTypeCount();
    }

    function showAlert(message, type) {
        var existing = document.querySelector('.pv-alert');
        if (existing) existing.remove();

        var alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-' + type + ' pv-alert text-center mt-3';
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = message;
        var footer = modalEl.querySelector('.modal-footer');
        footer.parentNode.insertBefore(alertDiv, footer);
        setTimeout(function () {
            if (alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    }

    function handleSubmit() {
        if (STATE.isSubmitting) return;

        var substance = get$('pv-substance').value.trim();
        var batch = get$('pv-batch').value.trim();
        var name = get$('pv-name').value.trim();
        var org = get$('pv-org').value.trim();
        var phone = get$('pv-phone').value.trim();
        var consent = get$('pv-consent').checked;

        if (!substance) { showAlert('يرجى إدخال اسم المادة الفعالة.', 'danger'); return; }
        if (!batch) { showAlert('يرجى إدخال رقم التشغيلة (Batch).', 'danger'); return; }
        if (!name) { showAlert('يرجى إدخال اسم مقدم البلاغ.', 'danger'); return; }
        if (!consent) { showAlert('يرجى الموافقة على سياسة الخصوصية لإرسال التقرير.', 'danger'); return; }

        var selectedTypes = [];
        document.querySelectorAll('input[name="pv-type"]:checked').forEach(function (cb) {
            selectedTypes.push(cb.value);
        });
        var customType = get$('pv-custom-type').value.trim();
        if (customType) selectedTypes.push(customType);

        var report = {
            ticket: generateTicket(),
            timestamp: isoNow(),
            substance: substance,
            batch: batch,
            origin: get$('pv-origin').value || 'غير محدد',
            eventTypes: selectedTypes,
            description: get$('pv-desc').value.trim(),
            reporter: {
                name: name,
                organization: org,
                phone: phone,
            },
            notes: get$('pv-notes').value.trim(),
        };

        STATE.isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>جارٍ الإرسال...';

        setTimeout(function () {
            STATE.isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send-check me-2"></i>إرسال التقرير';

            var successMsg = '<i class="bi bi-check-circle-fill text-success fs-4 me-2"></i> تم استلام التقرير بنجاح. رقم التذكرة: <strong>' + report.ticket + '</strong>. سيتم التواصل معكم خلال 24 ساعة عمل.';
            showAlert(successMsg, 'success');
            resetForm();

            console.log('[PV Report]', JSON.stringify(report, null, 2));
        }, 1500);
    }

    function init() {
        injectPVHTML();

        fab = document.getElementById('Pharmacovigilance');
        modalEl = document.getElementById('pvModal');
        submitBtn = document.getElementById('pv-submit-btn');

        if (!fab || !modalEl || !submitBtn) return;

        var substanceInput = get$('pv-substance');
        var batchInput = get$('pv-batch');

        substanceInput.addEventListener('input', updateOrigin);

        document.querySelectorAll('input[name="pv-type"]').forEach(function (cb) {
            cb.addEventListener('change', updateTypeCount);
        });

        submitBtn.addEventListener('click', handleSubmit);

        modalEl.addEventListener('hidden.bs.modal', function () {
            resetForm();
            var alert = document.querySelector('.pv-alert');
            if (alert) alert.remove();
        });

        updateOrigin();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
