          function updateCartWidget() {
            const cart = JSON.parse(localStorage.getItem(&quot;cart&quot;)) || [];
            const cartCountElement = document.getElementById(&quot;cart-count&quot;);
            cartCountElement.textContent = cart.length;
            if (cart.length &gt; 0) {
              cartCountElement.classList.add(&quot;active&quot;);
            } else {
              cartCountElement.classList.remove(&quot;active&quot;);
            }
          }
          updateCartWidget();
          window.addEventListener(&quot;storage&quot;, function (event) {
            if (event.key === &quot;cart&quot;) {
              updateCartWidget();
            }
          });
          setInterval(updateCartWidget, 1000);
          document.getElementById(&quot;cart-widget-header&quot;).addEventListener(&quot;click&quot;, function() {
            window.location.href = &quot;/p/cart.html&quot;;
          });


            const searchPageURL = 'https://souq-alkul.blogspot.com/p/search.html';
            function startSearch() {
              const query = document.getElementById('searchInput').value.trim();
              if (query) {
                window.location.href = `${searchPageURL}?q=${encodeURIComponent(query)}`;
              }
            }
            const placeholders = [
              "خلنا نساعدك تلاقي اللي يناسبك",
              "جاهز تلاقي شي يغير يومك",
              "ماكينة قهوة ديلونجي",
              "سماعات بلوتوث جالكسي بودز",
              "مكنسة روبوت ذكية",
              "شاحن مغناطيسي للآيفون",
              "ستاند لابتوب قابل للطي",
              "مكواة بخار محمولة",
              "عصارة فواكه كهربائية",
              "كاميرا مراقبة واي فاي",
              "ماوس لاسلكي لابتوب",
              "منظف وجه كهربائي",
              "لوح مفاتيح ميكانيكي RGB",
              "فرامة خضار يدوية",
              "ميزان ذكي للحمية",
              "سماعات رأس للألعاب",
              "اختر منتجك وابدأ اكتشاف الأفضل"
            ];
            let currentIndex = 0;
            const input = document.getElementById('searchInput');
            function rotatePlaceholder() {
              input.setAttribute('placeholder', placeholders[currentIndex]);
              currentIndex = (currentIndex + 1) % placeholders.length;
            }
            rotatePlaceholder();
            setInterval(rotatePlaceholder, 45000);  
          
