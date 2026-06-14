# خطة ربط قاعدة البيانات والنشر - EndoCare Yemen

---

## القسم التمهيدي: ما قبل ربط قاعدة البيانات - توصيات وملاحظات وإصلاحات ضرورية

> هذا القسم يوثّق نتائج مراجعة شاملة للموقع (Site Audit) ويحدد الإصلاحات والتحسينات الواجب تنفيذها **قبل** الشروع في ربط Supabase أو النشر.

---

### نظرة عامة على واقع الموقع الحالي

| البند | الوضع الحالي |
|-------|-------------|
| **نوع المشروع** | Static HTML/CSS/JS كلاسيكي - ليس React أو Angular |
| **Build Tool** | Vite v6 (مهيأ لـ React + Tailwind رغم عدم استخدامها فعلياً) |
| **قاعدة البيانات** | localStorage في المتصفح فقط - كل البيانات مؤقتة |
| **المصادقة** | وهمية - مجرد إخفاء/إظهار عناصر HTML |
| **البوت المساعد** | يعمل كلياً على client-side بدون API خارجي |
| **الاستضافة الحالية** | لا يوجد (مصمم أصلاً لـ AI Studio) |
| **عدد الصفحات** | ~18 صفحة (9 إنجليزي + 9 عربي) + index.html و admin.html |
| **اللغات** | عربي (RTL) + إنجليزي (LTR) - بنية متطابقة لكل لغة |

---

### قائمة المهام مرتبة حسب الأولوية البرمجية

#### 🟥 مهم — أخطاء وإصلاحات جوهرية (ضرورية قبل النشر)

| # | المهمة | التفاصيل والموقع |
|---|--------|------------------|
| 1 | **إصلاح `selectedhome` ← `selectedIndex` في `admin.html`** | في `saveArticle()` بالسطرين 842 و 845. بدونه لن يتم حفظ تصنيف المقال أو حالته |
| 2 | **إصلاح مسار Bootstrap RTL للنسخة العربية** | `ar/blog.html:28` يشير إلى `css/bootstrap.rtl.min.css` محلياً بينما الإنجليزية تستخدم CDN. تغييره إلى CDN |
| 3 | **توحيد الإعدادات الافتراضية بين `db.js` و `main.js`** | حذف التعريف المكرر من `main.js:94-109` وجعله يستدعي `window.db.getSiteSettings()` من `db.js` |
| 4 | **إضافة حقل `workingHoursEn` إلى `company_profile.json`** | `chatbot.js:223` يستخدم الحقل لكنه غير موجود — يسبب خطأ في البوت |
| 5 | **إضافة الملفات العلمية المفقودة في `scientific_docs/`** | `vitamin_c_zinc.md`, `vitamin_b_complex.md`, `folic_acid.md`, `fsh_urofollitropin.md`, `insulin_glargine.md`, `estradiol.md`, `progesterone.md`, `prednisolone_dexamethasone.md`, `liothyronine.md` — البوت لن يتمكن من الرجوع لهذه المصادر |
 
| 7 | **تفعيل Gemini API في `chatbot.js`** | تفعيل `@google/genai` SDK المثبت فعلياً مع الاحتفاظ بـ fallback محلي عند عدم الاتصال |
| 8 | **استخدام `system_prompt.md` كـ system prompt لـ Gemini** | الملف موجود فعلياً لكنه غير مستخدم |
| 9 | **ترقية المصادقة المؤقتة في `admin.html`** | إضافة التحقق الأساسي من credentials في localStorage بدلاً من مجرد إخفاء/إظهار العناصر |
| 10 | **ملء `meta description` في جميع الصفحات** | جميع الصفحات تحتوي على `content=""` فارغ — ضروري لتحسين محركات البحث قبل النشر |
| 11 | **إنشاء ملف `.env.example`** | وإضافته إلى git مع المتغيرات: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `VITE_SITE_URL` |
| 12 | **تنظيف `package.json` من الحزم غير المستخدمة** | إزالة: `react`, `react-dom`, `lucide-react`, `motion`, `express`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `tailwindcss`, `autoprefixer` |

#### 🟧 ثانوي — تحسينات في التجربة والجودة (مهمة لكن غير عاجلة)

| # | المهمة | التفاصيل |
|---|--------|----------|
 
| 14 | **إنشاء `robots.txt`** | توجيه محركات البحث لأهم الصفحات |
| 15 | **إضافة Open Graph tags** | `og:title`, `og:description`, `og:image` لجميع الصفحات |
 
| 17 | **إضافة `loading="lazy"` للصور** | تحسين سرعة تحميل الصفحات وتجربة المستخدم |
| 18 | **إضافة مؤشر للبوت عند القراءة من قاعدة المعرفة** | إظهار إشعار للمستخدم أن البوت يرجع لمصدر علمي |
| 19 | **إضافة أزرار المقالات ذات الصلة في ردود البوت** | روابط لمقالات ذات صلة في نهاية كل رد |
| 20 | **إنشاء صفحة 404 مخصصة** | `en/404.html` و `ar/404.html` مع رسالة مناسبة ورابط العودة للرئيسية |
| 21 | **إضافة Favicon موحد بمسار مطلق** | استخدام مسار مطلق بدلاً من المسار النسبي ليظهر في جميع الصفحات |
| 22 | **استبدال المحتوى التجريبي (Placeholder/Lorem Ipsum)** | مقالات وهمية في `blog.html`, `single-blog.html`, ومنتجات وهمية في `service.js` |
| 23 | **إضافة منتجات إضافية إلى `sources_manifest.json`** | لتغطية الكتالوج الكامل للبوت المساعد |

#### 🟩 غير مهم — تحسينات إضافية (لا تؤثر على الموقع بشكل مباشر)

| # | المهمة | التفاصيل |
|---|--------|----------|
| 24 | **دمج السكريبتات المتكررة عبر الصفحات** | تحميل سكريبتات (spinner, WOW) مرة واحدة بدلاً من تكرارها |
| 25 | **إزالة jQuery وإعادة كتابة `main.js` بـ Vanilla JS** | تقليل حجم التبعيات وزيادة سرعة التحميل |
| 26 | **تصغير (Minify) ملفات HTML يدوياً** | Vite يعالج JS/CSS تلقائياً لكن HTML يحتاج معالجة إضافية |
| 27 | **إضافة Bootstrap CDN fallback محلي** | تحميل نسخة محلية احتياطية في حال انقطاع الإنترنت عن CDN |
| 28 | **توحيد تنسيق JSON بين النسختين AR/EN** | إضافة النسخة الإنجليزية لـ `company_profile.json` و `sources_manifest.json` |
| 29 | **حفظ سجل المحادثة على الخادم** | بعد ربط Supabase — حفظ تاريخ المحادثة في قاعدة البيانات |
| 30 | **إضافة Service Worker (PWA)** | لجعل الموقع يعمل جزئياً بدون إنترنت |

---

## القسم الأول: ربط قاعدة بيانات Supabase وتفعيلها

### الوضع الحالي
- الموقع بالكامل **Static HTML/CSS/JS** بدون أي backend
- جميع البيانات مخزنة في **localStorage** للمتصفح فقط
- عند مسح الكاش أو استخدام جهاز آخر **تُفقد كل البيانات** (المقالات، المنتجات، الطلبات، إلخ)
- لوحة التحكم (admin.html) وهمية بالكامل - لا يوجد مصادقة حقيقية

### الخطوات المطلوبة

#### 1. إنشاء مشروع Supabase
| الخطوة | التفاصيل |
|--------|----------|
| الذهاب إلى | https://supabase.com |
| إنشاء حساب | باستخدام GitHub أو Google |
| إنشاء مشروع جديد | اختيار اسم مثل `endocare-yemen` |
| اختيار المنطقة | الأقرب جغرافيا (Middle East / Europe) |
| حفظ بيانات الاتصال | `Project URL` + `anon public key` من صفحة Settings > API |

#### 2. تثبيت حزمة Supabase في المشروع
```bash
npm install @supabase/supabase-js
```

#### 3. إنشاء ملف البيئة `.env`
إنشاء ملف `D:\مشاريع برمجية\اعمال العملاء\Endocare\اصدارات\13\.env` بالمحتوى التالي:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> **ملاحظة:** هذا الملف مضاف بالفعل في `.gitignore` ولن يتم رفعه إلى GitHub.

#### 4. إنشاء جداول قاعدة البيانات في Supabase

**جدول `articles` (المقالات):**
| العمود | النوع | الملاحظات |
|--------|------|-----------|
| id | uuid | Primary key, default: gen_random_uuid() |
| title | text | عنوان المقال (إنجليزي) |
| title_ar | text | عنوان المقال (عربي) |
| category | text | التصنيف (market, logistics, regulatory, scientific) |
| category_label | text | اسم التصنيف المعروض |
| editor | text | اسم المحرر |
| image | text | رابط الصورة |
| excerpt | text | ملخص المقال |
| content | text | محتوى المقال كامل |
| refs | text | المصادر والمراجع |
| date | text | تاريخ النشر |
| status | text | draft / active / archived |
| created_at | timestamptz | default: now() |
| updated_at | timestamptz | auto-update |
| created_by | uuid | references auth.users |

**جدول `products` (المنتجات):**
| العمود | النوع | الملاحظات |
|--------|------|-----------|
| id | uuid | Primary key |
| name | text | اسم المنتج |
| description | text | وصف المنتج |
| category | text | التصنيف |
| image | text | رابط الصورة |
| price | numeric | السعر |
| featured | boolean | مميز أم لا |
| status | text | active / inactive |
| created_at | timestamptz | default: now() |

**جدول `orders` (طلبات التوريد):**
| العمود | النوع | الملاحظات |
|--------|------|-----------|
| id | uuid | Primary key |
| company_name | text | اسم الشركة |
| contact_person | text | الشخص المسؤول |
| email | text | البريد الإلكتروني |
| phone | text | رقم الهاتف |
| products_requested | jsonb | قائمة المنتجات المطلوبة |
| notes | text | ملاحظات إضافية |
| status | text | pending / processed / completed |
| created_at | timestamptz | default: now() |

**جدول `inquiries` (استفسارات):**
| العمود | النوع |
|--------|------|
| id | uuid PK |
| name | text |
| email | text |
| phone | text |
| subject | text |
| message | text |
| created_at | timestamptz |

**جدول `pv_reports` (تقارير التيقظ الدوائي):**
| العمود | النوع |
|--------|------|
| id | uuid PK |
| patient_name | text |
| medication | text |
| reaction | text |
| severity | text |
| reporter_name | text |
| reporter_email | text |
| created_at | timestamptz |

**جدول `site_settings` (إعدادات الموقع):**
| العمود | النوع |
|--------|------|
| id | uuid PK |
| key | text unique |
| value | jsonb |
| updated_at | timestamptz |

#### 5. إنشاء ملف تهيئة Supabase

إنشاء ملف `js/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 6. تعديل `js/db.js` - استبدال localStorage بـ Supabase

تحويل دوال `window.db` لاستخدام Supabase بدلاً من localStorage:
- `getArticles()` ← `supabase.from('articles').select('*')`
- `addArticle(data)` ← `supabase.from('articles').insert(data)`
- `updateArticle(id, data)` ← `supabase.from('articles').update(data).eq('id', id)`
- `deleteArticle(id)` ← `supabase.from('articles').delete().eq('id', id)`
- وهكذا لباقي الجداول

#### 7. تعديل `admin.html` لجلب البيانات من Supabase
- استبدال جميع استدعاءات `window.db` باستدعاءات `supabase`
- إضافة معالجة `async/await` للاستدعاءات
- إضافة مؤشرات تحميل (loading states)
- إضافة معالجة الأخطاء (network errors, etc.)

#### 8. تعديل `blog.html` و `single-blog.html`
- `blog.html`: تعديل الدالة التي تجلب المقالات لتعمل مع Supabase بدلاً من localStorage
- `single-blog.html`: تعديل الدالة `getArticleById` لتعمل مع Supabase
- إضافة fallback للمقالات النموذجية في حالة عدم الاتصال بالإنترنت

#### 9. إضافة نظام المصادقة (Supabase Auth)
- تفعيل Email/Password Authentication في Supabase Dashboard
- تعديل `admin.html` لاستخدام `supabase.auth.signInWithPassword()` بدلاً من التحقق الوهمي
- إضافة `supabase.auth.onAuthStateChanged()` للتحقق من حالة تسجيل الدخول
- إضافة تسجيل خروج آمن
- حماية Routes بحيث لا يمكن الوصول إلى admin.html بدون تسجيل دخول

#### 10. تفعيل Row Level Security (RLS)
- تشغيل RLS لكل الجداول من Supabase Dashboard
- إضافة سياسات (Policies):
  - `articles`: PUBLIC يستطيع قراءة articles WHERE status = 'active' فقط، ADMIN يستطيع CRUD الكامل
  - `products`: PUBLIC يقرأ فقط، ADMIN يتحكم كامل
  - `orders`, `inquiries`, `pv_reports`: PUBLIC يستطيع INSERT فقط، ADMIN يقرأ ويدير

#### 11. إضافة Supabase Storage للصور
- إنشاء bucket باسم `images` في Supabase Storage
- إضافة سياسة للقراءة العامة (public access)
- تعديل admin.html لرفع الصور إلى Supabase Storage بدلاً من مسار محلي
- استخدام `supabase.storage.from('images').upload()` للرفع
- استخدام الرابط العام المُعاد للتخزين في قاعدة البيانات

#### 12. ترحيل البيانات الموجودة
- تصدير البيانات الحالية من localStorage عبر JavaScript console
- إنشاء سكريبت SQL لاستيراد البيانات إلى Supabase
- التحقق من صحة البيانات بعد الترحيل

---

## القسم الثاني: النشر (Deployment)

### المتطلبات الأساسية

| المتطلب | الشرح | التكلفة التقريبية |
|---------|-------|-------------------|
| **دومين (Domain)** | اسم النطاق الخاص بالموقع، مثلاً `endocare-ye.com` | 10-20 دولار / سنة |
| **استضافة (Hosting)** | لاستضافة ملفات الموقع الثابتة | مجاني - 20 دولار / شهر |
| **Supabase** | قاعدة البيانات والمصادقة والتخزين | 0-25 دولار / شهر |
| **SSL Certificate** | شهادة أمان للموقع | مجاني (مع大多数 المنصات) |

### اختيار الدومين

- الدومين المستخدم حالياً في الكود: **endocare-ye.com**
- شركات شراء الدومين المقترحة:
  - **GoDaddy** (https://godaddy.com)
  - **Namecheap** (https://namecheap.com)
  - **Cloudflare Registrar** (https://cloudflare.com/products/registrar) - سعر التكلفة
  - **SaudiDomains** (https://saudidomains.com) للدومينات السعودية
- الامتداد المناسب `.com` للدومين الدولي أو `.ye` للسوق اليمني

### اختيار منصة الاستضافة

#### الخيار الموصى به: Cloudflare Pages + Supabase

| الميزة | التفاصيل |
|--------|----------|
| **المميزات** | أداء عالي سرعة، CDN عالمي مجاني، SSL تلقائي، نطاق واسع |
| **التكلفة** | مجاني (Free Plan: 500 builds/month, 1GB storage) |
| **خطوات النشر** | انظر أدناه |

#### خيارات بديلة:

| المنصة | التكلفة | المميزات | العيوب |
|--------|---------|----------|--------|
| **Netlify** | مجاني-19$/شهر | CI/CD سهل، Forms، Functions | الحد المجاني محدود |
| **Vercel** | مجاني-20$/شهر | سرعة عالية، Edge Functions | Serverless قد يكون معقداً |
| **GitHub Pages** | مجاني | بسيط جداً | لا يدعم Forms ولا Server-side |
| **سيرفر VPS (DigitalOcean/Linode)** | 6-24$/شهر | تحكم كامل | يحتاج إدارة تقنية |

### خطوات النشر على Cloudflare Pages

#### 1. رفع الكود على GitHub
```bash
cd D:\مشاريع برمجية\اعمال العملاء\Endocare\اصدارات\13
git init
git add .
git commit -m "Initial commit - EndoCare Yemen"
# إنشاء مستودع جديد على GitHub ثم:
git remote add origin https://github.com/your-org/endocare-yemen.git
git push -u origin main
```

#### 2. إنشاء حساب Cloudflare
- الذهاب إلى https://dash.cloudflare.com
- إنشاء حساب (مجاني)
- إضافة الدومين إلى Cloudflare (يحتاج تغيير Nameservers)

#### 3. ربط المشروع مع Cloudflare Pages
- الذهاب إلى Cloudflare Dashboard > Pages
- الضغط على "Create a project" > "Connect to Git"
- اختيار مستودع GitHub
- إعدادات البناء:
  - **Build command:** `npm run build`
  - **Build output directory:** `dist`
  - **Environment variables:**
    - `VITE_SUPABASE_URL` = رابط Supabase
    - `VITE_SUPABASE_ANON_KEY` = المفتاح العام
- الضغط على "Save and Deploy"

#### 4. ربط الدومين المخصص
- في Cloudflare Pages > المشروع > Custom domains
- إضافة الدومين: `endocare-ye.com`
- Cloudflare سيقوم تلقائياً بإضافة السجلات DNS اللازمة
- تفعيل SSL/TLS (Automatic / Full)

#### 5. تفعيل النشر التلقائي (CI/CD)
- كل مرة تدفع (push) إلى فرع `main` على GitHub
- Cloudflare Pages سيقوم تلقائياً بـ:
  1. سحب الكود الجديد
  2. تشغيل `npm install`
  3. تشغيل `npm run build`
  4. نشر الملفات الجديدة

### خريطة DNS المقترحة

| السجل | النوع | القيمة |
|-------|------|--------|
| `endocare-ye.com` | A | (Cloudflare Pages IP) |
| `www.endocare-ye.com` | CNAME | `endocare-ye.com` |
| `api.endocare-ye.com` | A | (اختياري إذا أضفتم API لاحقاً) |

### خطوات ما بعد النشر

1. **التحقق من صحة الموقع:**
   - تصفح جميع الصفحات والتأكد من عمل الروابط
   - اختبار جميع النماذج (forms)
   - اختبار لوحة التحكم (admin panel)
   - اختبار المقالات والتصنيفات

2. **تحسين محركات البحث (SEO):**
   - إضافة عنوان الموقع إلى Google Search Console
   - إنشاء `sitemap.xml`
   - إضافة `robots.txt`
   - تجهيز `meta` tags للصفحات

3. **إعداد التحليلات:**
   - إضافة Google Analytics أو Cloudflare Web Analytics
   - تتبع زوار الموقع والصفحات الأكثر زيارة

4. **النسخ الاحتياطي:**
   - تفعيل Daily Backup في Supabase (متوفر في Pro Plan)
   - تصدير دوري لقاعدة البيانات SQL

5. **الأمان:**
   - تفعيل Rate Limiting في Cloudflare
   - تفعيل Bot Fight Mode
   - تفعيل WAF (Web Application Firewall) - مجاني مع Cloudflare

### جدول زمني مقترح

| الأسبوع | المهمة |
|---------|--------|
| الأسبوع 1 | شراء الدومين، إنشاء Supabase project، إنشاء الجداول |
| الأسبوع 2 | ربط Supabase مع الكود (تعديل db.js، admin.html، blog.html) |
| الأسبوع 3 | إضافة المصادقة، RLS، و Supabase Storage |
| الأسبوع 4 | ترحيل البيانات، اختبار شامل، ونشر الموقع تجريبياً |
| الأسبوع 5 | ربط الدومين، تفعيل SSL، تحسين SEO، ونشر نهائي |

---

## ملخص الاحتياجات النهائية

| العنصر | الحالة | المطلوب |
|--------|--------|---------|
| دومين (Domain) | ❌ غير موجود | شراء `endocare-ye.com` أو أي دومين متاح |
| استضافة (Hosting) | ❌ غير موجودة | Cloudflare Pages (مجاني) |
| قاعدة بيانات | ❌ لا يوجد | Supabase (مجاني/مدفوع) |
| Supabase SDK | ❌ غير مثبت | `npm install @supabase/supabase-js` |
| مصادقة حقيقية | ❌ لا يوجد | Supabase Auth (Email/Password) |
| رفع صور | ❌ يدوي | Supabase Storage |
| SSL Certificate | ❌ غير مفعل | تلقائي مع Cloudflare |
| CI/CD | ❌ غير موجود | GitHub + Cloudflare Pages |
| SEO | ⚠️ جزئي | Google Search Console + sitemap.xml |
| تحليلات | ❌ لا يوجد | Google Analytics / Cloudflare Analytics |
