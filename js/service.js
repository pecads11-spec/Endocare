/******************************************************
 * EndoCare Service Page - Product Catalog Engine
 * المرحلة 2: كتالوج المنتجات الذكي
 ******************************************************/

(function () {
  'use strict';

  /* =====================================================
     1. PRODUCT DATA (قاعدة بيانات المنتجات - محتوى تجريبي)
     ===================================================== */
  const mockProducts = [
    {
      id: 1,
      name: 'فيتامين D3',
      nameAr: 'فيتامين D3',
      nameEn: 'Vitamin D3',
      cas: '67-97-0',
      category: 'vitamin',
      form: 'powder',
      badges: ['GMP', 'CoA'],
      origin: 'ألمانيا',
      originAr: 'ألمانيا',
      originEn: 'Germany',
      description: 'فيتامين D3 5000 IU لدعم المناعة والعظام',
      descriptionAr: 'فيتامين D3 5000 IU لدعم المناعة والعظام',
      descriptionEn: 'Vitamin D3 5000 IU for immunity and bone support',
      dosage: '5000 IU',
      therapeuticClass: null,
    },
    {
      id: 2,
      name: 'فيتامين C مع زنك',
      nameAr: 'فيتامين C مع زنك',
      nameEn: 'Vitamin C + Zinc',
      cas: '50-81-7',
      category: 'vitamin',
      form: 'powder',
      badges: ['GMP', 'CoA', 'MoH'],
      origin: 'سويسرا',
      originAr: 'سويسرا',
      originEn: 'Switzerland',
      description: 'مكمل غذائي عالي التركيز لدعم المناعة',
      descriptionAr: 'مكمل غذائي عالي التركيز لدعم المناعة',
      descriptionEn: 'High concentration dietary supplement to support immunity',
      dosage: '1000 mg',
      therapeuticClass: null,
    },
    {
      id: 3,
      name: 'فيتامين B-Complex',
      nameAr: 'فيتامين B-Complex',
      nameEn: 'Vitamin B-Complex',
      cas: '12001-76-2',
      category: 'vitamin',
      form: 'liquid',
      badges: ['GMP'],
      origin: 'الأردن',
      originAr: 'الأردن',
      originEn: 'Jordan',
      description: 'مجموعة فيتامينات B للطاقة والتمثيل الغذائي',
      descriptionAr: 'مجموعة فيتامينات B للطاقة والتمثيل الغذائي',
      descriptionEn: 'B-complex vitamin group for energy and metabolism',
      dosage: 'مجمع',
      therapeuticClass: null,
    },
    {
      id: 4,
      name: 'سوماتروبين (HGH)',
      nameAr: 'سوماتروبين (HGH)',
      nameEn: 'Somatropin (HGH)',
      cas: '12629-01-5',
      category: 'hormone',
      form: 'lyophilized',
      badges: ['GMP', 'CoA'],
      origin: 'ألمانيا',
      originAr: 'ألمانيا',
      originEn: 'Germany',
      description: 'هرمون النمو البشري لعلاج تأخر النمو',
      descriptionAr: 'هرمون النمو البشري لعلاج تأخر النمو',
      descriptionEn: 'Human growth hormone for treating growth retardation',
      dosage: '4-12 IU',
      therapeuticClass: 'growth',
    },
    {
      id: 5,
      name: 'ليفوثيروكسين',
      nameAr: 'ليفوثيروكسين',
      nameEn: 'Levothyroxine',
      cas: '51-48-9',
      category: 'hormone',
      form: 'powder',
      badges: ['GMP', 'MoH'],
      origin: 'الهند',
      originAr: 'الهند',
      originEn: 'India',
      description: 'هرمون الغدة الدرقية لعلاج قصور الغدة',
      descriptionAr: 'هرمون الغدة الدرقية لعلاج قصور الغدة',
      descriptionEn: 'Thyroid hormone for treating hypothyroidism',
      dosage: '25-200 mcg',
      therapeuticClass: 'thyroid',
    },
    {
      id: 6,
      name: 'تستوستيرون أونديكانوات',
      nameAr: 'تستوستيرون أونديكانوات',
      nameEn: 'Testosterone Undecanoate',
      cas: '5949-44-0',
      category: 'hormone',
      form: 'liquid',
      badges: ['GMP', 'CoA'],
      origin: 'ألمانيا',
      originAr: 'ألمانيا',
      originEn: 'Germany',
      description: 'هرمون ذكري لعلاج نقص التستوستيرون',
      descriptionAr: 'هرمون ذكري لعلاج نقص التستوستيرون',
      descriptionEn: 'Male hormone for treating testosterone deficiency',
      dosage: '250 mg/ml',
      therapeuticClass: 'fertility',
    },
    {
      id: 7,
      name: 'FSH (يوروفوليتروبين)',
      nameAr: 'FSH (يوروفوليتروبين)',
      nameEn: 'FSH (Urofollitropin)',
      cas: '97048-13-0',
      category: 'hormone',
      form: 'lyophilized',
      badges: ['GMP'],
      origin: 'سويسرا',
      originAr: 'سويسرا',
      originEn: 'Switzerland',
      description: 'هرمون منبه للجريب لعلاج العقم',
      descriptionAr: 'هرمون منبه للجريب لعلاج العقم',
      descriptionEn: 'Follicle-stimulating hormone for treating infertility',
      dosage: '75-150 IU',
      therapeuticClass: 'fertility',
    },
    {
      id: 8,
      name: 'هيدروكورتيزون',
      nameAr: 'هيدروكورتيزون',
      nameEn: 'Hydrocortisone',
      cas: '50-23-7',
      category: 'hormone',
      form: 'powder',
      badges: ['GMP', 'CoA', 'MoH'],
      origin: 'إيطاليا',
      originAr: 'إيطاليا',
      originEn: 'Italy',
      description: 'ستيرويد قشري لعلاج الالتهابات والحساسية',
      descriptionAr: 'ستيرويد قشري لعلاج الالتهابات والحساسية',
      descriptionEn: 'Corticosteroid for treating inflammation and allergies',
      dosage: '10-100 mg',
      therapeuticClass: 'corticosteroid',
    },
    {
      id: 9,
      name: 'أنسولين جلارجين',
      nameAr: 'أنسولين جلارجين',
      nameEn: 'Insulin Glargine',
      cas: '160337-95-1',
      category: 'hormone',
      form: 'liquid',
      badges: ['GMP', 'CoA'],
      origin: 'فرنسا',
      originAr: 'فرنسا',
      originEn: 'France',
      description: 'أنسولين طويل المفعول لمرضى السكري',
      descriptionAr: 'أنسولين طويل المفعول لمرضى السكري',
      descriptionEn: 'Long-acting insulin for diabetic patients',
      dosage: '100 IU/ml',
      therapeuticClass: null,
    },
    {
      id: 10,
      name: 'إستراديول',
      nameAr: 'إستراديول',
      nameEn: 'Estradiol',
      cas: '50-28-2',
      category: 'hormone',
      form: 'powder',
      badges: ['GMP'],
      origin: 'ألمانيا',
      originAr: 'ألمانيا',
      originEn: 'Germany',
      description: 'هرمون أنثوي للعلاج الهرموني البديل',
      descriptionAr: 'هرمون أنثوي للعلاج الهرموني البديل',
      descriptionEn: 'Female hormone for hormone replacement therapy',
      dosage: '1-2 mg',
      therapeuticClass: 'fertility',
    },
    {
      id: 11,
      name: 'بروجسترون',
      nameAr: 'بروجسترون',
      nameEn: 'Progesterone',
      cas: '57-83-0',
      category: 'hormone',
      form: 'powder',
      badges: ['GMP', 'CoA'],
      origin: 'إيطاليا',
      originAr: 'إيطاليا',
      originEn: 'Italy',
      description: 'هرمون أنثوي لدعم الحمل والخصوبة',
      descriptionAr: 'هرمون أنثوي لدعم الحمل والخصوبة',
      descriptionEn: 'Female hormone for supporting pregnancy and fertility',
      dosage: '100-200 mg',
      therapeuticClass: 'fertility',
    },
    {
      id: 12,
      name: 'حمض الفوليك 5 مجم',
      nameAr: 'حمض الفوليك 5 مجم',
      nameEn: 'Folic Acid 5mg',
      cas: '59-30-3',
      category: 'vitamin',
      form: 'tablet',
      badges: ['GMP', 'MoH'],
      origin: 'الأردن',
      originAr: 'الأردن',
      originEn: 'Jordan',
      description: 'حمض الفوليك لدعم الحمل وصحة الجنين',
      descriptionAr: 'حمض الفوليك لدعم الحمل وصحة الجنين',
      descriptionEn: 'Folic acid for pregnancy support and fetal health',
      dosage: '5 mg',
      therapeuticClass: null,
    },
    {
      id: 13,
      name: 'بريدنيزولون',
      nameAr: 'بريدنيزولون',
      nameEn: 'Prednisolone',
      cas: '50-24-8',
      category: 'hormone',
      form: 'powder',
      badges: ['GMP', 'CoA'],
      origin: 'الهند',
      originAr: 'الهند',
      originEn: 'India',
      description: 'ستيرويد قشري مضاد للالتهابات',
      descriptionAr: 'ستيرويد قشري مضاد للالتهابات',
      descriptionEn: 'Anti-inflammatory corticosteroid',
      dosage: '5-40 mg',
      therapeuticClass: 'corticosteroid',
    },
    {
      id: 14,
      name: 'ديكساميثازون',
      nameAr: 'ديكساميثازون',
      nameEn: 'Dexamethasone',
      cas: '50-02-2',
      category: 'hormone',
      form: 'liquid',
      badges: ['GMP', 'CoA', 'MoH'],
      origin: 'إيطاليا',
      originAr: 'إيطاليا',
      originEn: 'Italy',
      description: 'ستيرويد قشري قوي للحالات الحرجة',
      descriptionAr: 'ستيرويد قشري قوي للحالات الحرجة',
      descriptionEn: 'Strong corticosteroid for critical cases',
      dosage: '4-8 mg',
      therapeuticClass: 'corticosteroid',
    },
    {
      id: 15,
      name: 'ليوثيرونين',
      nameAr: 'ليوثيرونين',
      nameEn: 'Liothyronine',
      cas: '6893-02-3',
      category: 'hormone',
      form: 'powder',
      badges: ['GMP'],
      origin: 'الهند',
      originAr: 'الهند',
      originEn: 'India',
      description: 'هرمون الغدة الدرقية ثلاثي اليود',
      descriptionAr: 'هرمون الغدة الدرقية ثلاثي اليود',
      descriptionEn: 'Triiodothyronine thyroid hormone',
      dosage: '5-50 mcg',
      therapeuticClass: 'thyroid',
    },
    {
      id: 16,
      name: 'نوردوتروبين (سوماتروبين)',
      nameAr: 'نوردوتروبين (سوماتروبين)',
      nameEn: 'Norditropin (Somatropin)',
      cas: '12629-01-5',
      category: 'hormone',
      form: 'liquid',
      badges: ['GMP', 'CoA', 'MoH'],
      origin: 'الدنمارك',
      originAr: 'الدنمارك',
      originEn: 'Denmark',
      description: 'هرمون نمو مخصص للأطفال والبالغين',
      descriptionAr: 'هرمون نمو مخصص للأطفال والبالغين',
      descriptionEn: 'Growth hormone for children and adults',
      dosage: '4-8 IU',
      therapeuticClass: 'growth',
    },
  ];

  const isEnglish = window.location.pathname.includes('/en/');

  // دمج مع بيانات لوحة التحكم إن وجدت (Fallback logic)
  const adminProducts = window.db && window.db.getProducts ? window.db.getProducts().filter(p => p.status === 'نشط' || !p.status) : [];
  const products = adminProducts.length > 0 ? adminProducts : mockProducts;

  /* =====================================================
     2. HORMONE THERAPEUTIC CLASSES
     ===================================================== */
  const hormoneClasses = [
    {
      id: 'corticosteroid',
      title: 'الستيرويدات القشرية',
      titleEn: 'Corticosteroids',
      icon: 'bi-prescription2',
      description: 'مضادات التهابات قشرية للحالات الحرجة والحساسية المزمنة',
      descriptionEn: 'Corticosteroid anti-inflammatories for critical cases and chronic allergies',
      color: '#dc3545',
    },
    {
      id: 'growth',
      title: 'هرمونات النمو',
      titleEn: 'Growth Hormones',
      icon: 'bi-graph-up-arrow',
      description: 'هرمونات النمو البشري لعلاج تأخر النمو واضطرابات الغدة النخامية',
      descriptionEn: 'Human growth hormones for treating growth retardation and pituitary disorders',
      color: '#168a68',
    },
    {
      id: 'fertility',
      title: 'هرمونات الخصوبة',
      titleEn: 'Fertility Hormones',
      icon: 'bi-heart-pulse',
      description: 'هرمونات تنظيم الخصوبة والتبويض ودعم الحمل',
      descriptionEn: 'Fertility and ovulation regulating hormones and pregnancy support',
      color: '#e83e8c',
    },
    {
      id: 'thyroid',
      title: 'هرمونات الغدة الدرقية',
      titleEn: 'Thyroid Hormones',
      icon: 'bi-shield',
      description: 'بدائل هرمونات الغدة الدرقية لعلاج قصور وفرط النشاط',
      descriptionEn: 'Thyroid hormone replacements for treating hypo- and hyper-activity',
      color: '#105978',
    },
  ];

  /* =====================================================
     3. FILTER DATA
     ===================================================== */
  const filterGroups = isEnglish ? {
    form: {
      label: 'Physical Form',
      options: [
        { value: 'powder', label: 'Powder' },
        { value: 'liquid', label: 'Liquid' },
        { value: 'lyophilized', label: 'Lyophilized' },
        { value: 'tablet', label: 'Tablets' },
      ],
    },
    badges: {
      label: 'Certificate Type',
      options: [
        { value: 'GMP', label: 'GMP' },
        { value: 'CoA', label: 'CoA' },
        { value: 'MoH', label: 'MoH' },
      ],
    },
    origin: {
      label: 'Country of Origin',
      options: [
        { value: 'ألمانيا', label: 'Germany' },
        { value: 'سويسرا', label: 'Switzerland' },
        { value: 'الأردن', label: 'Jordan' },
        { value: 'الهند', label: 'India' },
        { value: 'إيطاليا', label: 'Italy' },
        { value: 'فرنسا', label: 'France' },
        { value: 'الدنمارك', label: 'Denmark' },
      ],
    },
  } : {
    form: {
      label: 'حالة المادة',
      options: [
        { value: 'powder', label: 'بودرة / مسحوق' },
        { value: 'liquid', label: 'سائل / محلول' },
        { value: 'lyophilized', label: 'مجفد / Lyophilized' },
        { value: 'tablet', label: 'أقراص' },
      ],
    },
    badges: {
      label: 'نوع الشهادة',
      options: [
        { value: 'GMP', label: 'GMP' },
        { value: 'CoA', label: 'CoA' },
        { value: 'MoH', label: 'MoH' },
      ],
    },
    origin: {
      label: 'بلد المنشأ',
      options: [
        { value: 'ألمانيا', label: 'ألمانيا' },
        { value: 'سويسرا', label: 'سويسرا' },
        { value: 'الأردن', label: 'الأردن' },
        { value: 'الهند', label: 'الهند' },
        { value: 'إيطاليا', label: 'إيطاليا' },
        { value: 'فرنسا', label: 'فرنسا' },
        { value: 'الدنمارك', label: 'الدنمارك' },
      ],
    },
  };

  /* =====================================================
     4. STATE
     ===================================================== */
  const state = {
    searchQuery: '',
    activeFilters: {
      form: [],
      badges: [],
      origin: [],
    },
    filteredProducts: [...products],
    selectedTab: 'all',
  };

  /* =====================================================
     5. DOM REFS
     ===================================================== */
  let dom = {};

  function cacheDom() {
    dom = {
      searchInput: document.getElementById('productSearch'),
      searchResults: document.getElementById('searchResults'),
      clearSearch: document.getElementById('clearSearch'),
      filterSidebar: document.getElementById('filterSidebar'),
      productTableBody: document.getElementById('productTableBody'),
      productCount: document.getElementById('productCount'),
      activeFiltersContainer: document.getElementById('activeFilters'),
      hormoneGrid: document.getElementById('hormoneGrid'),
      noResults: document.getElementById('noResults'),
      tabButtons: document.querySelectorAll('.catalog-tab-btn'),
    };
  }

  /* =====================================================
     6. RENDER FUNCTIONS
     ===================================================== */

  // --- 6a. Search Suggest ---
  function renderSearchSuggest(results) {
    const container = dom.searchResults;
    if (!container) return;
    const q = dom.searchInput.value.trim().toLowerCase();
    if (!q || results.length === 0) {
      container.classList.add('d-none');
      return;
    }
    let html = '';
    const maxShow = Math.min(results.length, 8);
    for (let i = 0; i < maxShow; i++) {
      const p = results[i];
      const dispName = isEnglish ? (p.nameEn || p.name) : (p.nameAr || p.name);
      const dispSub = isEnglish ? (p.nameAr || p.name) : (p.nameEn || p.name);
      html += `
        <button type="button" class="search-suggest-item" data-id="${p.id}">
          <span class="suggest-name">${dispName} <small class="text-muted">${dispSub}</small></span>
          <span class="suggest-cas">${p.cas}</span>
        </button>
      `;
    }
    if (results.length > maxShow) {
      html += `<div class="search-suggest-more">${isEnglish ? `+ ${results.length - maxShow} more results` : `+ ${results.length - maxShow} نتائج إضافية`}</div>`;
    }
    container.innerHTML = html;
    container.classList.remove('d-none');
  }

  // --- 6b. Filters ---
  function renderFilters() {
    const container = dom.filterSidebar;
    if (!container) return;
    let html = '';
    for (const [groupKey, group] of Object.entries(filterGroups)) {
      html += `
        <div class="filter-group mb-4">
          <h6 class="filter-group-title">${group.label}</h6>
          <div class="filter-options">
      `;
      for (const opt of group.options) {
        const checked = state.activeFilters[groupKey].includes(opt.value) ? 'checked' : '';
        const count = products.filter((p) => {
          if (groupKey === 'form') return p.form === opt.value;
          if (groupKey === 'badges') return p.badges.includes(opt.value);
          if (groupKey === 'origin') return p.origin === opt.value;
          return false;
        }).length;
        html += `
          <label class="filter-checkbox-label">
            <input type="checkbox" class="filter-checkbox" data-group="${groupKey}" value="${opt.value}" ${checked}>
            <span class="filter-checkbox-text">${opt.label}</span>
            <span class="filter-count">${count}</span>
          </label>
        `;
      }
      html += `
          </div>
        </div>
      `;
    }
    container.innerHTML = html;

    container.querySelectorAll('.filter-checkbox').forEach((cb) => {
      cb.addEventListener('change', function () {
        const group = this.dataset.group;
        const value = this.value;
        if (this.checked) {
          if (!state.activeFilters[group].includes(value)) {
            state.activeFilters[group].push(value);
          }
        } else {
          state.activeFilters[group] = state.activeFilters[group].filter((v) => v !== value);
        }
        applyFilters();
      });
    });
  }

  // --- 6c. Active Filter Tags ---
  function renderActiveFilters() {
    const container = dom.activeFiltersContainer;
    if (!container) return;
    const allActive = [];
    for (const [group, values] of Object.entries(state.activeFilters)) {
      for (const v of values) {
        const found = filterGroups[group].options.find((o) => o.value === v);
        allActive.push({ group, value: v, label: found ? found.label : v });
      }
    }
    if (allActive.length === 0) {
      container.innerHTML = '';
      return;
    }
    let html = `<span class="active-filter-label">${isEnglish ? 'Active Filters:' : 'مرشّحات نشطة:'}</span>`;
    for (const f of allActive) {
      html += `
        <span class="active-filter-tag">
          ${f.label}
          <button type="button" class="active-filter-remove" data-group="${f.group}" data-value="${f.value}">&times;</button>
        </span>
      `;
    }
    html += `<button type="button" class="active-filter-clear-all btn btn-sm btn-link">${isEnglish ? 'Clear All' : 'مسح الكل'}</button>`;
    container.innerHTML = html;

    container.querySelectorAll('.active-filter-remove').forEach((btn) => {
      btn.addEventListener('click', function () {
        const group = this.dataset.group;
        const value = this.dataset.value;
        state.activeFilters[group] = state.activeFilters[group].filter((v) => v !== value);
        syncFilterCheckboxes();
        applyFilters();
      });
    });
    const clearBtn = container.querySelector('.active-filter-clear-all');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        for (const g of Object.keys(state.activeFilters)) {
          state.activeFilters[g] = [];
        }
        syncFilterCheckboxes();
        applyFilters();
      });
    }
  }

  function syncFilterCheckboxes() {
    document.querySelectorAll('.filter-checkbox').forEach((cb) => {
      const group = cb.dataset.group;
      cb.checked = state.activeFilters[group].includes(cb.value);
    });
  }

  // --- 6d. Product Table ---
  function renderProductTable(results) {
    const tbody = dom.productTableBody;
    const countEl = dom.productCount;
    const noResultsEl = dom.noResults;
    if (!tbody) return;

    if (countEl) {
      const showing = state.searchQuery || state.hasActiveFilters ? results.length : products.length;
      const total = products.length;
      if (state.searchQuery || state.hasActiveFilters) {
        countEl.textContent = isEnglish ? `${showing} of ${total} products` : `${showing} من أصل ${total} منتج`;
      } else {
        countEl.textContent = isEnglish ? `${total} products` : `${total} منتج`;
      }
    }

    if (results.length === 0) {
      tbody.innerHTML = '';
      if (noResultsEl) noResultsEl.classList.remove('d-none');
      return;
    }
    if (noResultsEl) noResultsEl.classList.add('d-none');

    let html = '';
    for (const p of results) {
      const badgesHtml = p.badges
        .map((b) => {
          const cls = b === 'GMP' ? 'badge-gmp' : b === 'CoA' ? 'badge-coa' : 'badge-moh';
          return `<span class="reg-badge ${cls}">${b}</span>`;
        })
        .join(' ');
      
      const dispName = isEnglish ? (p.nameEn || p.name) : (p.nameAr || p.name);
      const dispSubName = isEnglish ? (p.nameAr || p.name) : (p.nameEn || p.name);
      const dispOrigin = isEnglish ? (p.originEn || p.origin) : (p.originAr || p.origin);

      html += `
        <tr class="product-row">
          <td class="product-cell-name" data-label="${isEnglish ? 'Product' : 'المنتج'}">
            <span class="product-name">${dispName}</span>
            <small class="product-name-en text-muted">${dispSubName}</small>
          </td>
          <td class="product-cell-cas" data-label="CAS Number"><code>${p.cas}</code></td>
          <td class="product-cell-badges" data-label="${isEnglish ? 'Compliance' : 'الامتثال'}">${badgesHtml}</td>
          <td class="product-cell-origin" data-label="${isEnglish ? 'Origin' : 'المنشأ'}">${dispOrigin}</td>
          <td class="product-cell-actions" data-label="${isEnglish ? 'Action' : 'الإجراء'}">
            <a href="appoinment.html" class="btn btn-sm text-green product-action-btn" title="${isEnglish ? 'Request Quote' : 'طلب عرض سعر'}">
              <i class="bi bi-cart-plus"></i>
            </a>
            <a href="#" class="btn btn-sm text-green product-action-btn" title="${isEnglish ? 'Request Sample' : 'طلب عينة'}">
              <i class="bi bi-droplet-half"></i>
            </a>
            <a href="https://wa.me/967712345678" class="btn btn-sm text-green product-action-btn" title="${isEnglish ? 'Quick Inquiry' : 'استفسار سريع'}">
              <i class="bi bi-chat-dots"></i>
            </a>
			<a href="#" class="btn btn-sm text-green product-action-btn" title="${isEnglish ? 'More Details' : 'تفاصيل أكثر'}">
  <i class="bi bi-info-circle"></i>
</a>
          </td>
        </tr>
      `;
    }
    tbody.innerHTML = html;
  }

  // --- 6e. Hormone Categories Grid ---
  function renderHormoneGrid() {
    const container = dom.hormoneGrid;
    if (!container) return;

    let html = '';
    for (const cls of hormoneClasses) {
      const classProducts = products.filter((p) => p.therapeuticClass === cls.id);
      const count = classProducts.length;
      const names = classProducts.map((p) => isEnglish ? (p.nameEn || p.name) : (p.nameAr || p.name)).join(isEnglish ? ', ' : '، ');
      const dispTitle = isEnglish ? (cls.titleEn || cls.title) : (cls.title || cls.titleEn);
      const dispSubTitle = isEnglish ? (cls.title || cls.titleEn) : (cls.titleEn || cls.title);
      const dispDesc = isEnglish ? (cls.descriptionEn || cls.description) : (cls.description || cls.descriptionEn);

      html += `
        <div class="hormone-class-card wow fadeInUp" data-wow-delay="0.1s">
          <div class="hormone-class-icon" style="background: ${cls.color}15; color: ${cls.color}">
            <i class="bi ${cls.icon}"></i>
          </div>
          <div class="hormone-class-body">
            <h5 class="hormone-class-title">${dispTitle}</h5>
            <span class="hormone-class-title-en">${dispSubTitle}</span>
            <p class="hormone-class-desc">${dispDesc}</p>
            <div class="hormone-class-meta">
              <span class="hormone-class-count"><i class="bi bi-capsule me-1"></i>${count} ${isEnglish ? 'ingredients' : 'مكونات'}</span>
              <span class="hormone-class-coa"><i class="bi bi-file-check me-1"></i>${isEnglish ? 'CoA available' : 'CoA متاح'}</span>
            </div>
            <div class="hormone-class-products">
              <small class="text-muted">${names}</small>
            </div>
            <a href="https://wa.me/967770249300?text=${isEnglish ? 'I%20want%20to%20inquire%20about%20' + encodeURIComponent(dispTitle) + '%20products%20from%20Endocare' : '%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA%20' + encodeURIComponent(dispTitle) + '%20%D9%85%D9%86%20%D8%A5%D9%86%D8%AF%D9%88%D9%83%D9%8A%D8%B1'}" target="_blank" class="hormone-whatsapp-btn">
              <i class="bi bi-whatsapp"></i>${isEnglish ? 'Contact Sales' : 'تواصل بالمبيعات'}
            </a>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  /* =====================================================
     7. FILTER LOGIC
     ===================================================== */
  function applyFilters() {
    let results = [...products];

    // Search
    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
          (p.cas && p.cas.includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q)) ||
          (p.origin && p.origin.toLowerCase().includes(q)) ||
          (p.originEn && p.originEn.toLowerCase().includes(q))
      );
    }

    // Filter by form
    if (state.activeFilters.form.length > 0) {
      results = results.filter((p) => state.activeFilters.form.includes(p.form));
    }

    // Filter by badges
    if (state.activeFilters.badges.length > 0) {
      results = results.filter((p) =>
        state.activeFilters.badges.some((b) => p.badges.includes(b))
      );
    }

    // Filter by origin
    if (state.activeFilters.origin.length > 0) {
      results = results.filter((p) => state.activeFilters.origin.includes(p.origin));
    }

    state.filteredProducts = results;
    state.hasActiveFilters =
      state.activeFilters.form.length > 0 ||
      state.activeFilters.badges.length > 0 ||
      state.activeFilters.origin.length > 0;

    renderProductTable(results);
    renderActiveFilters();
    renderSearchSuggest(results);
  }

  /* =====================================================
     8. SEARCH HANDLERS
     ===================================================== */
  function handleSearchInput() {
    const q = dom.searchInput.value;
    state.searchQuery = q;

    if (q.length === 0) {
      dom.clearSearch.classList.add('d-none');
      dom.searchResults.classList.add('d-none');
    } else {
      dom.clearSearch.classList.remove('d-none');
    }

    applyFilters();
  }

  function handleSearchSuggestClick(e) {
    const item = e.target.closest('.search-suggest-item');
    if (!item) return;
    const id = parseInt(item.dataset.id);
    const product = products.find((p) => p.id === id);
    if (product) {
      dom.searchInput.value = product.name;
      state.searchQuery = product.name;
      dom.searchResults.classList.add('d-none');
      dom.clearSearch.classList.remove('d-none');
      applyFilters();
    }
  }

  function clearSearch() {
    dom.searchInput.value = '';
    state.searchQuery = '';
    dom.clearSearch.classList.add('d-none');
    dom.searchResults.classList.add('d-none');
    applyFilters();
    dom.searchInput.focus();
  }

  /* =====================================================
     9. TAB SWITCHING (All / Vitamins / Hormones)
     ===================================================== */
  function handleTabClick(e) {
    const btn = e.currentTarget;
    const tab = btn.dataset.tab;
    dom.tabButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.selectedTab = tab;

    if (tab === 'vitamins') {
      state.activeFilters.badges = [];
      state.activeFilters.form = [];
      state.activeFilters.origin = [];
      state.searchQuery = '';
      dom.searchInput.value = '';
      dom.clearSearch.classList.add('d-none');
      dom.searchResults.classList.add('d-none');
      // filter to show only vitamins and apply
      state.activeFilterTab = 'vitamins';
      // We'll handle this via a special filter
    } else if (tab === 'hormones') {
      state.activeFilterTab = 'hormones';
      state.activeFilters.badges = [];
      state.activeFilters.form = [];
      state.activeFilters.origin = [];
      state.searchQuery = '';
      dom.searchInput.value = '';
      dom.clearSearch.classList.add('d-none');
      dom.searchResults.classList.add('d-none');
    } else {
      state.activeFilterTab = 'all';
    }

    syncFilterCheckboxes();
    applyFilters();
  }

  // Override applyFilters to handle tabs
  const originalApplyFilters = applyFilters;
  applyFilters = function () {
    let results = [...products];

    // Tab filter
    if (state.activeFilterTab === 'vitamins') {
      results = results.filter((p) => p.category === 'vitamin');
    } else if (state.activeFilterTab === 'hormones') {
      results = results.filter((p) => p.category === 'hormone');
    }

    // Search
    const q = state.searchQuery.trim().toLowerCase();
    if (q) {
      results = results.filter(
        (p) =>
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
          (p.cas && p.cas.includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.descriptionEn && p.descriptionEn.toLowerCase().includes(q)) ||
          (p.origin && p.origin.toLowerCase().includes(q)) ||
          (p.originEn && p.originEn.toLowerCase().includes(q))
      );
    }

    // Filter by form
    if (state.activeFilters.form.length > 0) {
      results = results.filter((p) => state.activeFilters.form.includes(p.form));
    }

    // Filter by badges
    if (state.activeFilters.badges.length > 0) {
      results = results.filter((p) =>
        state.activeFilters.badges.some((b) => p.badges.includes(b))
      );
    }

    // Filter by origin
    if (state.activeFilters.origin.length > 0) {
      results = results.filter((p) => state.activeFilters.origin.includes(p.origin));
    }

    state.filteredProducts = results;
    state.hasActiveFilters =
      (state.activeFilterTab !== 'all' && state.activeFilterTab !== undefined) ||
      state.activeFilters.form.length > 0 ||
      state.activeFilters.badges.length > 0 ||
      state.activeFilters.origin.length > 0;

    renderProductTable(results);
    renderActiveFilters();
    renderSearchSuggest(results);
  };

  /* =====================================================
     10. INIT
     ===================================================== */
  function init() {
    cacheDom();

    // Init state
    state.activeFilterTab = 'all';

    // Render
    renderFilters();
    renderHormoneGrid();
    applyFilters();

    // Search events
    if (dom.searchInput) {
      dom.searchInput.addEventListener('input', handleSearchInput);
      dom.searchInput.addEventListener('focus', function () {
        if (this.value.trim().length > 0) {
          dom.searchResults.classList.remove('d-none');
        }
      });
      document.addEventListener('click', function (e) {
        if (!e.target.closest('.search-wrapper')) {
          dom.searchResults.classList.add('d-none');
        }
      });
      dom.searchResults.addEventListener('click', handleSearchSuggestClick);
    }

    if (dom.clearSearch) {
      dom.clearSearch.addEventListener('click', clearSearch);
    }

    // Tab buttons
    dom.tabButtons.forEach((btn) => {
      btn.addEventListener('click', handleTabClick);
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
