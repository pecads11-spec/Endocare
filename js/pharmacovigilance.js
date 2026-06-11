(function () {
    "use strict";

    const isEnglish = window.location.pathname.includes('/en/');

    const SUBSTANCE_DB = {
        'Hydrocortisone': { originAr: 'ألمانيا', originEn: 'Germany', batch: 'HYD-2026-01' },
        'Testosterone': { originAr: 'بلجيكا', originEn: 'Belgium', batch: 'TST-2026-03' },
        'Vitamin D3': { originAr: 'سويسرا', originEn: 'Switzerland', batch: 'VD3-2026-02' },
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
        if (document.getElementById('pvModal') || document.getElementById('inline-pv-form')) return;

        const html = isEnglish ? `
    <div class="modal fade" id="pvModal" tabindex="-1" aria-labelledby="pvModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content pv-glass-modal" dir="ltr" style="text-align: left;">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title text-start" id="pvModalLabel"><i class="bi bi-shield-plus me-2 text-primary"></i>Pharmacovigilance</h5>
                    <button type="button" class="btn-close ms-auto me-0" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                    <div class="pv-section">
                        <div class="pv-badge bg-green-light text-dark"><i class="bi bi-box-seam me-1"></i>1. Active Substance Data</div>
                        <div class="row g-2 mt-1">
                            <div class="col-sm-6">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-substance" placeholder="Substance Name or CAS" list="pv-substances" autocomplete="off">
                                    <label for="pv-substance">Substance Name or CAS</label>
                                    <datalist id="pv-substances">
                                        <option value="Hydrocortisone">
                                        <option value="Testosterone">
                                        <option value="Vitamin D3">
                                    </datalist>
                                </div>
                            </div>
                            <div class="col-sm-3 col-6">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-batch" placeholder="Batch Number">
                                    <label for="pv-batch">Batch Number</label>
                                </div>
                            </div>
                            <div class="col-sm-3 col-6">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control bg-light" id="pv-origin" placeholder="Origin" readonly>
                                    <label for="pv-origin">Country of Origin</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pv-section mt-3">
                        <div class="pv-badge bg-warning text-dark"><i class="bi bi-exclamation-triangle me-1"></i>2. Event Type <span id="pv-type-count" class="badge bg-dark ms-2">0</span></div>
                        <div class="row g-2 mt-1">
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="Unexpected side effect">
                                    <span class="pv-check-content">
                                        <i class="bi bi-person-x fs-5 me-2 text-danger"></i> Unexpected side effect
                                    </span>
                                </label>
                            </div>
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="Lack or weakness of efficacy">
                                    <span class="pv-check-content">
                                        <i class="bi bi-graph-down-arrow fs-5 me-2 text-warning"></i> Lack or weakness of efficacy
                                    </span>
                                </label>
                            </div>
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="Suspicion of quality">
                                    <span class="pv-check-content">
                                        <i class="bi bi-box-seam-fill fs-5 me-2 text-info"></i> Suspicion of quality
                                    </span>
                                </label>
                            </div>
                            <div class="col-sm-6">
                                <label class="pv-check-card w-100">
                                    <input type="checkbox" name="pv-type" class="pv-check-input" value="Medication error or mismatched dosage">
                                    <span class="pv-check-content">
                                        <i class="bi bi-prescription2 fs-5 me-2 text-primary"></i> Medication error or mismatched dosage
                                    </span>
                                </label>
                            </div>
                            <div class="col-12">
                                <div class="form-floating pv-density mt-1">
                                    <input type="text" class="form-control" id="pv-custom-type" placeholder="Enter other details">
                                    <label for="pv-custom-type"><i class="bi bi-pencil-square me-1"></i>Custom (enter other details)</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="pv-section mt-3">
                        <div class="pv-badge bg-primary text-white"><i class="bi bi-person-badge me-1"></i>3. Reporter Information</div>
                        <div class="row g-2 mt-1">
                            <div class="col-12">
                                <div class="form-floating pv-density">
                                    <textarea class="form-control" placeholder="Brief description of the case" id="pv-desc" style="height: 50px"></textarea>
                                    <label for="pv-desc">Brief description of the case</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-name" placeholder="Name">
                                    <label for="pv-name">Name</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-floating pv-density">
                                    <input type="text" class="form-control" id="pv-org" placeholder="Organization">
                                    <label for="pv-org">Organization (Hospital/Pharmacy)</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-floating pv-density">
                                    <input type="tel" class="form-control" id="pv-phone" placeholder="Emergency Phone">
                                    <label for="pv-phone">Emergency Phone</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-floating pv-density mt-1">
                                    <textarea class="form-control" placeholder="Additional Notes" id="pv-notes" style="height: 60px"></textarea>
                                    <label for="pv-notes">Additional Notes</label>
                                </div>
                            </div>
                            <div class="col-12 mt-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="pv-consent">
                                    <label class="form-check-label small" for="pv-consent">
                                        I agree to transfer my data and the reported case data to the Pharmacovigilance Department at EndoCare and process it in accordance with the Privacy Policy.
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-0 pt-0 justify-content-center gap-2">
                    <button type="button" class="btn btn-outline-secondary pv-action-btn" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger fw-bold pv-action-btn pv-submit-btn" id="pv-submit-btn">
                        <i class="bi bi-send-check me-2"></i>Submit Report
                    </button>
                </div>
            </div>
        </div>
    </div>` : `
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
                <div class="modal-footer border-0 pt-0 justify-content-center gap-2">
                    <button type="button" class="btn btn-outline-secondary pv-action-btn" data-bs-dismiss="modal">إلغاء</button>
                    <button type="button" class="btn btn-danger fw-bold pv-action-btn pv-submit-btn" id="pv-submit-btn">
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
            originField.value = isEnglish ? SUBSTANCE_DB[substance].originEn : SUBSTANCE_DB[substance].originAr;
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
        var footer = document.querySelector('.modal-footer') || document.querySelector('.pv-footer');
        if (footer) {
            footer.parentNode.insertBefore(alertDiv, footer);
        } else if (submitBtn) {
            submitBtn.parentNode.insertBefore(alertDiv, submitBtn);
        }
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

        if (!substance) { showAlert(isEnglish ? 'Please enter the active substance name.' : 'يرجى إدخال اسم المادة الفعالة.', 'danger'); return; }
        if (!batch) { showAlert(isEnglish ? 'Please enter the batch number (Batch).' : 'يرجى إدخال رقم التشغيلة (Batch).', 'danger'); return; }
        if (!name) { showAlert(isEnglish ? 'Please enter the reporter name.' : 'يرجى إدخال اسم مقدم البلاغ.', 'danger'); return; }
        if (!consent) { showAlert(isEnglish ? 'Please agree to the privacy policy to submit the report.' : 'يرجى الموافقة على سياسة الخصوصية لإرسال التقرير.', 'danger'); return; }

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
            origin: get$('pv-origin').value || (isEnglish ? 'Not Specified' : 'غير محدد'),
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
        submitBtn.innerHTML = isEnglish ? '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending...' : '<span class="spinner-border spinner-border-sm me-2" role="status"></span>جارٍ الإرسال...';

        setTimeout(function () {
            STATE.isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.innerHTML = isEnglish ? '<i class="bi bi-send-check me-2"></i>Submit Report' : '<i class="bi bi-send-check me-2"></i>إرسال التقرير';

            if (window.db && window.db.addPVReport) {
                // transform object slightly to match admin table expectations if needed
                window.db.addPVReport({
                    id: Date.now(),
                    ticket: report.ticket,
                    product: report.substance,
                    batch: report.batch,
                    eventType: report.eventTypes.join(', '),
                    date: new Date().toISOString().split('T')[0],
                    status: isEnglish ? 'New' : 'جديد',
                    severity: isEnglish ? 'Medium' : 'متوسطة',
                    reporter: report.reporter.name
                });
            }

            var successMsg = isEnglish ? 
                '<i class="bi bi-check-circle-fill text-success fs-4 me-2"></i> Report received successfully. Ticket number: <strong>' + report.ticket + '</strong>. We will contact you within 24 working hours.' :
                '<i class="bi bi-check-circle-fill text-success fs-4 me-2"></i> تم استلام التقرير بنجاح. رقم التذكرة: <strong>' + report.ticket + '</strong>. سيتم التواصل معكم خلال 24 ساعة عمل.';
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

        // We only really strictly need the submitBtn to be present to function.
        if (!submitBtn) return;

        var substanceInput = get$('pv-substance');
        var batchInput = get$('pv-batch');

        if (substanceInput) {
            substanceInput.addEventListener('input', updateOrigin);
        }

        document.querySelectorAll('input[name="pv-type"]').forEach(function (cb) {
            cb.addEventListener('change', updateTypeCount);
        });

        submitBtn.addEventListener('click', handleSubmit);

        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', function () {
                resetForm();
                var alert = document.querySelector('.pv-alert');
                if (alert) alert.remove();
            });
        }

        updateOrigin();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
