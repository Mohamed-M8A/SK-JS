document.addEventListener('DOMContentLoaded', () => {
        const categories = [
            {
                name: 'إلكترونيات',
                children: [
                    {
                        name: 'جوالات',
                        children: [
                            { name: 'شاومي' },
                            { name: 'سامسونج' },
                            { name: 'آيفون' },
                            { name: 'أوبو' },
                            { name: 'هواوي' }
                        ]
                    },
                    { name: 'لابتوبات', children: [{ name: 'جيمينج' }, { name: 'ماك بوك' }, { name: 'لابتوبات أعمال' }] },
                    { name: 'شاشات', children: [{ name: 'شاشات ذكية' }, { name: 'شاشات كمبيوتر' }] }
                ]
            },
            {
                name: 'أدوات منزلية',
                children: [
                    { name: 'المطبخ', children: [{ name: 'خلاطات' }, { name: 'مكاوي' }, { name: 'ماكينات قهوة' }, { name: 'أفران كهربائية' }] },
                    { name: 'التنظيف', children: [{ name: 'مكانس كهربائية' }, { name: 'غسالات' }] }
                ]
            },
            { name: 'ملحقات', children: [{ name: 'سماعات' }, { name: 'كيبورد وماوس' }, { name: 'باور بانك' }] },
            { name: 'ألعاب', children: [{ name: 'بلاي ستيشن' }, { name: 'إكس بوكس' }, { name: 'نينتندو سويتش' }] },
            { name: 'عروض خاصة' },
            { name: 'الموضة' },
            { name: 'المنزل والمطبخ' },
            { name: 'أجهزة صغيرة' },
            { name: 'الصحة والجمال' }
        ];

        function generateLink(cat) {
            const base = "https://souq-alkul.blogspot.com/p/search.html";
            return `${base}?label=${encodeURIComponent(cat.name)}`;
        }

        // جلب العناصر من الهيكل HTML
        const toggleBtn = document.getElementById('widget-toggle-btn');
        const closeBtn = document.getElementById('widget-close-btn');
        const sidebar = document.getElementById('widget-sidebar');
        const overlay = document.getElementById('widget-overlay');
        const sideList = document.getElementById('widget-side-list');
        const desktopCats = document.getElementById('widget-desktop-cats');
        const sidebarTitle = document.getElementById('widget-sidebar-title');

        // 1. إنشاء تصنيفات سطح المكتب (إضافة المحتوى)
        categories.slice(0, 5).forEach(cat => {
            const wrapper = document.createElement('div');
            wrapper.className = 'widget-cat-wrapper';
            
            const link = document.createElement('a');
            link.textContent = cat.name;
            link.href = generateLink(cat);
            link.className = 'widget-cat-link';

            // إدارة الـ Custom Property للتسطير عبر JS لتجنب استخدام :hover في JS
            link.addEventListener('mouseover', () => link.style.setProperty("--underline-scale", "1"));
            link.addEventListener('mouseout', () => link.style.setProperty("--underline-scale", "0"));

            wrapper.appendChild(link);

            if (cat.children) {
                const expandBtn = document.createElement('span');
                expandBtn.textContent = '❯';
                expandBtn.className = 'widget-expand-btn';
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openSidebar(false);
                    renderSubCategories(cat.name, cat.children || []);
                });
                wrapper.appendChild(expandBtn);
            }
            desktopCats.appendChild(wrapper);
        });

        // 2. وظائف العرض والتفاعل للسايد بار
        function createCategoryRow(cat) {
            const row = document.createElement('div');
            row.className = 'widget-category-row';
            
            const link = document.createElement('a');
            link.textContent = cat.name;
            link.href = generateLink(cat);
            row.appendChild(link);

            if (cat.children) {
                const expandBtn = document.createElement('span');
                expandBtn.textContent = '❯';
                expandBtn.className = 'widget-expand-btn-sidebar';
                expandBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    renderSubCategories(cat.name, cat.children);
                });
                row.appendChild(expandBtn);
            }
            return row;
        }

        function renderMainCategories() {
            sideList.innerHTML = "";
            sidebarTitle.textContent = 'التصنيفات';
            categories.forEach(cat => sideList.appendChild(createCategoryRow(cat)));
        }

        function renderSubCategories(title, children) {
            sideList.innerHTML = "";
            sidebarTitle.textContent = title;

            const backRow = document.createElement('div');
            backRow.textContent = '← رجوع';
            backRow.className = 'widget-back-row';
            backRow.addEventListener('click', () => renderMainCategories());
            sideList.appendChild(backRow);

            children.forEach(sub => sideList.appendChild(createCategoryRow(sub)));
        }

        function openSidebar(showMain = true) {
            sidebar.style.right = '0';
            overlay.style.display = 'block';
            if (showMain) renderMainCategories();
        }

        function closeSidebar() {
            sidebar.style.right = '-300px';
            overlay.style.display = 'none';
        }

        // ربط الأحداث
        toggleBtn.addEventListener('click', () => openSidebar(true));
        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        // 3. الاستجابة (Responsive) - لإدارة خاصية display للـ desktop cats
        function applyResponsive() {
            if (window.innerWidth > 768) {
                desktopCats.style.display = 'flex';
            }
        }
        applyResponsive();
        window.addEventListener('resize', applyResponsive);
    });
