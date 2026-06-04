/******************************************************
 * EndoCare Product Detail Page - B2B Engine
 * الصياغة: SKU, Brand, API, Pricing, WhatsApp
 ******************************************************/

(function () {
  'use strict';

  /* =====================================================
     1. PRODUCT MASTER DATA
     ===================================================== */
  const product = {
    sku: 'ENDO-VIT-D3-5000',
    brandName: 'إندوكير-د3',
    brandNameEn: 'EndoCare-D3',
    activeIngredient: 'كوليكالسيفيرول',
    activeIngredientEn: 'Cholecalciferol',
    classification: 'فيتامينات',
    concentration: '5000 IU',
    dosageForm: 'Capsules',
    manufacturer: 'Swiss Caps AG',
    countryOfOrigin: 'سويسرا',
    regulatoryLicense: 'SFDA Lic. #YEM-2024-0881',
    regulatoryValidity: '2026-12-31',
    batchExpiry: '2027-09-15',
    storageConditions: 'يُحفظ في مكان بارد وجاف أقل من 25°C، بعيداً عن الضوء',
    storageConditionsEn: 'Keep in a cool, dry place below 25°C, away from light',
    packagingUnit: 'بوكس يحتوي 3 شرائط × 10 كبسولات (30 كبسولة/بوكس)، 24 بوكس/كرتون',
    packagingUnitEn: 'Box containing 3 blisters × 10 capsules (30 caps/box), 24 boxes/carton',
    moq: 5,
    isColdChain: false,
    stockLevel: 150,
    unitType: 'كرتون',
    image: 'img/product-vitamin.png',
  };

  /* =====================================================
     2. TIERED PRICING MATRIX
     ===================================================== */
  const pricingTiers = [
    { min: 1,    max: 5,   unitPrice: 185.00, label: 'الطلب العادي (1-5 كرتون)' },
    { min: 6,    max: 20,  unitPrice: 168.00, label: 'الجملة الصغيرة (6-20 كرتون)' },
    { min: 21,   max: 50,  unitPrice: 149.00, label: 'الجملة المتوسطة (21-50 كرتون)' },
    { min: 51,   max: Infinity, unitPrice: 132.00, label: 'الجملة الكبيرة (51+ كرتون)' },
  ];

  /* =====================================================
     3. STATE
     ===================================================== */
  const state = {
    quantity: product.moq,
    isAuthenticated: true,
    stockLevel: product.stockLevel,
    isColdChain: product.isColdChain,
  };

  /* =====================================================
     4. DOM REFS
     ===================================================== */
  let dom = {};

  function cacheDom() {
    dom = {
      qtyInput: document.getElementById('qtyInput'),
      qtyDecrease: document.getElementById('qtyDecrease'),
      qtyIncrease: document.getElementById('qtyIncrease'),
      totalPrice: document.getElementById('totalPrice'),
      unitPrice: document.getElementById('unitPrice'),
      tierLabel: document.getElementById('tierLabel'),
      pricingTableBody: document.getElementById('pricingTableBody'),
      whatsappBtn: document.getElementById('whatsappBtn'),
      addToOrderBtn: document.getElementById('addToOrderBtn'),
      coldChainWarning: document.getElementById('coldChainWarning'),
      expiryWarning: document.getElementById('expiryWarning'),
      stockAlert: document.getElementById('stockAlert'),
      authNotice: document.getElementById('authNotice'),
      pricingSection: document.getElementById('pricingSection'),
      productTitle: document.getElementById('productTitle'),
      productTitleDetail: document.getElementById('productTitleDetail'),
      productSubtitle: document.getElementById('productSubtitle'),
      productSku: document.getElementById('productSku'),
      productDosageForm: document.getElementById('productDosageForm'),
      productManufacturer: document.getElementById('productManufacturer'),
      productOrigin: document.getElementById('productOrigin'),
      productRegLicense: document.getElementById('productRegLicense'),
      productRegValidity: document.getElementById('productRegValidity'),
      productBatchExpiry: document.getElementById('productBatchExpiry'),
      productStorage: document.getElementById('productStorage'),
      productPackaging: document.getElementById('productPackaging'),
      productMoq: document.getElementById('productMoq'),
      productIcon: document.getElementById('productIcon'),
      stockBadge: document.getElementById('stockBadge'),
    };
  }

  /* =====================================================
     5. HELPERS
     ===================================================== */
  function getTier(qty) {
    for (const t of pricingTiers) {
      if (qty >= t.min && qty <= t.max) return t;
    }
    return pricingTiers[pricingTiers.length - 1];
  }

  function calculateTotalPrice(qty) {
    const tier = getTier(qty);
    return tier.unitPrice * qty;
  }

  function validateQuantity(qty) {
    if (!Number.isInteger(qty) || qty < 1) {
      return { valid: false, error: 'يجب أن تكون الكمية رقماً صحيحاً موجباً' };
    }
    if (qty < product.moq) {
      return { valid: false, error: `الحد الأدنى للطلب هو ${product.moq} كرتون` };
    }
    if (qty > state.stockLevel) {
      return { valid: false, error: `الكمية المطلوبة (${qty}) تتجاوز المخزون المتاح (${state.stockLevel})` };
    }
    return { valid: true, error: null };
  }

  function monthsUntil(dateStr) {
    const now = new Date();
    const expiry = new Date(dateStr);
    const diff = (expiry - now) / (1000 * 60 * 60 * 24 * 30.44);
    return Math.round(diff);
  }

  /* =====================================================
     6. WHATSAPP MESSAGE
     ===================================================== */
  function generateWhatsAppMessage(qty, isAuth) {
    if (!isAuth) {
      const msg =
        `مرحباً، نود الاستفسار عن المنتج: ${product.brandName} (${product.brandNameEn})، SKU: ${product.sku}. نرغب في الحصول على عرض سعر رسمي.`;
      return encodeURIComponent(msg);
    }
    const msg =
      `مرحباً شركة إندوكير، نود الاستفسار عن المنتج: ${product.brandName} - ${product.concentration}، المادة الفعالة: ${product.activeIngredient}، SKU: ${product.sku}. نحن [اسم المؤسسة] ونرغب في طلب كمية تقريبية: ${qty} ${product.unitType}. يرجى تزويدنا بعرض سعر رسمي.`;
    return encodeURIComponent(msg);
  }

  /* =====================================================
     7. RENDER
     ===================================================== */

  function renderProductInfo() {
    const title = `${product.brandName} - ${product.concentration}`;
    dom.productTitle.textContent = title;
    if (dom.productTitleDetail) dom.productTitleDetail.textContent = title;
    dom.productSubtitle.textContent = `المادة الفعالة: ${product.activeIngredient} (${product.activeIngredientEn}) | التصنيف: ${product.classification}`;
    dom.productSku.textContent = product.sku;
    dom.productDosageForm.textContent = product.dosageForm;
    dom.productManufacturer.textContent = `${product.manufacturer}، ${product.countryOfOrigin}`;
    dom.productOrigin.textContent = product.countryOfOrigin;
    dom.productRegLicense.textContent = product.regulatoryLicense;
    dom.productRegValidity.textContent = new Date(product.regulatoryValidity).toLocaleDateString('ar-SA');
    dom.productBatchExpiry.textContent = new Date(product.batchExpiry).toLocaleDateString('ar-SA');
    dom.productStorage.textContent = product.storageConditions;
    dom.productPackaging.textContent = product.packagingUnit;
    dom.productMoq.textContent = `${product.moq} كرتون`;
  }

  function renderStockBadge() {
    if (!dom.stockBadge) return;
    if (state.stockLevel === 0) {
      dom.stockBadge.className = 'badge bg-danger';
      dom.stockBadge.textContent = 'غير متوفر';
    } else if (state.stockLevel <= product.moq * 3) {
      dom.stockBadge.className = 'badge bg-warning text-dark';
      dom.stockBadge.textContent = `مخزون محدود (${state.stockLevel} كرتون)`;
    } else {
      dom.stockBadge.className = 'badge bg-success';
      dom.stockBadge.textContent = `متوفر (${state.stockLevel} كرتون)`;
    }
  }

  function renderPricingTable() {
    const tbody = dom.pricingTableBody;
    if (!tbody) return;
    let html = '';
    for (const tier of pricingTiers) {
      const maxDisplay = tier.max === Infinity ? '50+' : tier.max;
      const activeClass = state.quantity >= tier.min && state.quantity <= tier.max ? 'table-active fw-bold' : '';
      html += `
        <tr class="${activeClass}">
          <td>${tier.label}</td>
          <td>${tier.min} - ${maxDisplay}</td>
          <td>$${tier.unitPrice.toFixed(2)}</td>
        </tr>
      `;
    }
    tbody.innerHTML = html;
  }

  function renderPricing() {
    const tier = getTier(state.quantity);
    const total = calculateTotalPrice(state.quantity);
    dom.unitPrice.textContent = `$${tier.unitPrice.toFixed(2)}`;
    dom.tierLabel.textContent = tier.label;
    dom.totalPrice.textContent = `$${total.toFixed(2)}`;
    renderPricingTable();
  }

  function renderQtyInput() {
    dom.qtyInput.value = state.quantity;
    dom.qtyInput.placeholder = `أدخل عدد الكرتون (الحد الأدنى: ${product.moq})`;
  }

  function renderColdChain() {
    if (!dom.coldChainWarning) return;
    if (state.isColdChain) {
      dom.coldChainWarning.classList.remove('d-none');
    } else {
      dom.coldChainWarning.classList.add('d-none');
    }
  }

  function renderExpiryWarning() {
    if (!dom.expiryWarning) return;
    const months = monthsUntil(product.batchExpiry);
    if (months <= 12) {
      dom.expiryWarning.classList.remove('d-none');
      dom.expiryWarning.querySelector('.expiry-months').textContent = months;
    } else {
      dom.expiryWarning.classList.add('d-none');
    }
  }

  function renderStockAlert() {
    if (!dom.stockAlert) return;
    const exceedsStock = state.quantity > state.stockLevel;
    if (exceedsStock) {
      dom.stockAlert.classList.remove('d-none');
      dom.qtyInput.disabled = true;
      dom.qtyIncrease.disabled = true;
      dom.qtyDecrease.disabled = true;
      dom.whatsappBtn.innerHTML = '<i class="bi bi-truck ms-1"></i><span class="btn-text-desktop">طلب توريد خاص / شحنة</span><span class="btn-text-mobile">طلب خاص</span>';
      dom.whatsappBtn.href = '#';
      dom.whatsappBtn.className = 'btn btn-warning btn-lg w-100';
    } else {
      dom.stockAlert.classList.add('d-none');
      dom.qtyInput.disabled = false;
      dom.qtyIncrease.disabled = false;
      dom.qtyDecrease.disabled = false;
      dom.whatsappBtn.innerHTML = '<i class="bi bi-whatsapp ms-1"></i><span class="btn-text-desktop">الاستفسار عن الأسعار والدفع عبر واتساب</span><span class="btn-text-mobile">استفسار واتساب</span>';
      dom.whatsappBtn.className = 'btn btn-success btn-lg w-100';
    }
  }

  function renderAuthNotice() {
    if (!dom.authNotice || !dom.pricingSection) return;
    if (!state.isAuthenticated) {
      dom.authNotice.classList.remove('d-none');
      dom.pricingSection.classList.add('d-none');
    } else {
      dom.authNotice.classList.add('d-none');
      dom.pricingSection.classList.remove('d-none');
    }
  }

  function updateUI() {
    renderProductInfo();
    renderStockBadge();
    renderQtyInput();
    renderPricing();
    renderColdChain();
    renderExpiryWarning();
    renderStockAlert();
    renderAuthNotice();
  }

  /* =====================================================
     8. EVENTS
     ===================================================== */

  function handleQuantityChange(newQty) {
    const parsed = parseInt(newQty, 10);
    if (isNaN(parsed)) return;
    const validation = validateQuantity(parsed);
    if (!validation.valid && parsed >= product.moq && parsed <= state.stockLevel) {
      return;
    }
    if (!validation.valid && parsed > state.stockLevel) {
      state.quantity = parsed;
      updateUI();
      return;
    }
    if (validation.valid) {
      state.quantity = parsed;
      updateUI();
    }
  }

  function setupQtyInput() {
    dom.qtyInput.addEventListener('input', function () {
      const val = this.value.trim();
      if (val === '') return;
      handleQuantityChange(val);
    });

    dom.qtyInput.addEventListener('blur', function () {
      const val = parseInt(this.value, 10);
      if (isNaN(val) || val < product.moq) {
        this.value = product.moq;
        state.quantity = product.moq;
        updateUI();
      }
    });

    dom.qtyDecrease.addEventListener('click', function () {
      const current = parseInt(dom.qtyInput.value, 10) || product.moq;
      const next = Math.max(product.moq, current - 1);
      state.quantity = next;
      updateUI();
    });

    dom.qtyIncrease.addEventListener('click', function () {
      const current = parseInt(dom.qtyInput.value, 10) || product.moq;
      const next = current + 1;
      state.quantity = next;
      updateUI();
    });
  }

  function setupWhatsApp() {
    dom.whatsappBtn.addEventListener('click', function (e) {
      if (state.quantity > state.stockLevel) {
        e.preventDefault();
        const msg = encodeURIComponent(
          `مرحباً شركة إندوكير، نحتاج إلى توريد خاص للمنتج: ${product.brandName} - ${product.concentration}، SKU: ${product.sku}. الكمية المطلوبة: ${state.quantity} ${product.unitType} تتجاوز المخزون الحالي. نرجو تأكيد إمكانية استيراد كمية إضافية.`
        );
        window.open(`https://wa.me/967770249300?text=${msg}`, '_blank');
        return;
      }
      const msg = generateWhatsAppMessage(state.quantity, state.isAuthenticated);
      const url = state.isAuthenticated
        ? `https://wa.me/967770249300?text=${msg}`
        : `https://wa.me/967770249300?text=${msg}`;
      this.href = url;
    });
  }

  function setupAddToOrder() {
    dom.addToOrderBtn.addEventListener('click', function () {
      const validation = validateQuantity(state.quantity);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      this.innerHTML = '<i class="bi bi-check-lg ms-1"></i>تمت الإضافة';
      this.className = 'btn btn-outline-success btn-lg w-100';
      setTimeout(() => {
        this.innerHTML = '<i class="bi bi-cart-plus ms-1"></i><span class="btn-text-desktop">إضافة إلى طلب التوريد الحالي</span><span class="btn-text-mobile">إضافة للطلب</span>';
        this.className = 'btn btn-outline-primary btn-lg w-100';
      }, 2000);
    });
  }

  /* =====================================================
     9. INIT
     ===================================================== */
  function init() {
    cacheDom();
    state.isAuthenticated = true;
    state.quantity = product.moq;
    state.stockLevel = product.stockLevel;
    state.isColdChain = product.isColdChain;

    updateUI();
    setupQtyInput();
    setupWhatsApp();
    setupAddToOrder();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
