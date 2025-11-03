'use client';

import {
  ShoppingCart,
  Phone, Mail, Star, Settings, Gift, CheckCircle, HardDrive, Shield
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// cleaned unused old imports
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useEffect } from 'react';
import Head from 'next/head';
import { ProductNavigation } from '@/components/product/product-navigation';
import { ProductGallery } from '@/components/product/product-gallery';
import Link from 'next/link';
import { useCart } from '@/contexts/cart-context';
import HomeCamImg from '@/Store_Pictures/Home Cam H01/Home Cam - H01.png';


export default function ProductPage() {
  useEffect(() => {
    const scrollToHash = () => {
      const raw = window.location.hash;
      const id = raw ? decodeURIComponent(raw.replace('#', '')) : '';
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    // On initial load with hash
    scrollToHash();
    // On subsequent hash changes
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);
  const priceRegular = 2590;
  const priceSale = 2290;
  const save = priceRegular - priceSale;
  const savePct = Math.round((save / priceRegular) * 100);
  const { addToCart } = useCart();
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Home Cam H-01 (2 TB Edition)',
    image: ['/Store_Pictures/Home Cam H01/Home Cam - H01.png'],
    description: 'מערכת אבטחה ביתית: 2× 4MP PoE + NVR 2TB, Plug & Play',
    sku: 'H-01-2TB',
    brand: { '@type': 'Brand', name: 'Aegis Spectra' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ILS',
      price: 2290,
      availability: 'https://schema.org/InStock',
    },
  } as const;
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      
      <main className="pt-16">
        <nav aria-label="breadcrumb" className="border-b border-border bg-background/70">
          <div className="container-max py-2 text-sm text-foreground/70">
            <ol className="flex gap-2">
              <li><Link href="/">בית</Link></li>
              <li>/</li>
              <li><Link href="/products">מוצרים</Link></li>
              <li>/</li>
              <li aria-current="page" className="text-foreground">Home Cam H-01</li>
            </ol>
          </div>
        </nav>
        <Head>
          <title>Home Cam H-01 (2TB) | Aegis Spectra</title>
          <meta name="description" content="מערכת אבטחה 2× 4MP PoE + NVR 2TB. Plug & Play, שליטה באפליקציה בעברית. משלוח חינם." />
          <meta property="og:title" content="Home Cam H-01 (2TB)" />
          <meta property="og:description" content="2× 4MP PoE + NVR 2TB • Plug & Play • App HE" />
        </Head>
        <script
          type="application/ld+json"
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'האם צריך Wi‑Fi למצלמות?', acceptedAnswer: { '@type': 'Answer', text: 'לא. המצלמות מקבלות חשמל ותקשורת דרך PoE מה‑NVR. Wi‑Fi נדרש רק לגישה מהנייד דרך הראוטר.' } },
              { '@type': 'Question', name: 'כמה זמן הקלטה נותן דיסק 2TB?', acceptedAnswer: { '@type': 'Answer', text: 'כ‑30 יום (2× 4MP, H.265+, תלוי בתנועה ובהגדרות איכות).' } },
              { '@type': 'Question', name: 'אפשר להוסיף מצלמות?', acceptedAnswer: { '@type': 'Answer', text: 'כן. ה‑NVR תומך עד 4 מצלמות.' } }
            ]
          }) }}
        />
        <ProductNavigation
          sections={[
            { id: 'specs', label: 'מפרט' },
            { id: 'features', label: 'תכונות' },
            { id: 'warranty', label: 'אחריות' },
            { id: 'pricing', label: 'מחיר' },
            { id: 'box', label: 'מה בקופסה' },
            { id: 'contact', label: 'יצירת קשר' },
          ]}
        />
        {/* Hero Section */}
        <section id="hero" className="py-12 bg-gradient-to-br from-aegis-blue/5 to-aegis-teal/5">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <ProductGallery images={[{ src: HomeCamImg, alt: 'Home Cam H-01 Kit' }]} />
                <div className="absolute -top-4 -right-4 bg-aegis-blue text-white rounded-full p-3">
                  <Star className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">Home Cam H-01 (2 TB Edition)</h1>
                  <p className="text-sm sm:text-base text-foreground/70 whitespace-nowrap">Plug & Play · 24/7 · Full HD</p>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    מוצר מוביל
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm text-foreground/70 mr-2">(4.9)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-end gap-3">
                      <div className="text-3xl font-bold text-aegis-blue">₪ {priceSale.toLocaleString('he-IL')}</div>
                      <div className="text-lg text-foreground/60 line-through">₪ {priceRegular.toLocaleString('he-IL')}</div>
                      <Badge className="bg-emerald-600">מבצע</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full border border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
                        חיסכון ₪{save.toLocaleString('he-IL')} (~{savePct}%)
                      </span>
                      <span className="text-xs text-foreground/60">כולל מע״מ · משלוח חינם</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        const product = { id: 'home-cam-h01', name: 'Home Cam H-01 (2 TB Edition)', price: priceSale, image: (HomeCamImg as any).src };
                        try { addToCart(product); } catch {}
                        window.location.href = '/store/checkout';
                      }}
                    >
                      הוסף לעגלה
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    </Button>
                    <Button variant="outline" size="lg">
                      <Phone className="h-5 w-5 mr-2" />
                      צור קשר
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section id="specs" className="py-16">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Settings className="h-6 w-6 text-aegis-blue" />
                    מפרטים טכניים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">רזולוציה</span>
                        <span className="font-bold text-aegis-blue">4MP (2688×1520)</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">זווית צילום</span>
                        <span className="font-bold text-aegis-blue">~103° (עדשה 2.8 מ״מ)</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">תצוגת לילה</span>
                        <span className="font-bold text-aegis-blue">IR עד 30מ</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">אחסון</span>
                        <span className="font-bold text-aegis-blue">NVR פנימי 2TB (SkyHawk)</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">חיבור</span>
                        <span className="font-bold text-aegis-blue">PoE דרך NVR + LAN לראוטר</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-muted-foreground">אספקת חשמל</span>
                        <span className="font-bold text-aegis-blue">PoE (אופציונלי 12V DC למצלמה)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Gift className="h-6 w-6 text-aegis-blue" />
                    עיקרי המערכת
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-foreground border border-border shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">2 × מצלמות Provision-ISR I4-340IP5 (4 MP PoE Bullet)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-foreground border border-border shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">NVR Provision-ISR NVR5-4100PX+ (4 CH PoE)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-foreground border border-border shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">דיסק Seagate SkyHawk 2 TB (ייעודי CCTV 24/7)</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-foreground border border-border shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">כבלי CAT6 איכותיים + HDMI 1.5 מ׳ + כבל ראוטר 1 מ׳</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-foreground border border-border shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">מדריך מודפס + כרטיס אחריות + מדבקות Spectra</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-card text-foreground border border-border shadow-sm">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">מזוודת ABS קשיחה ממותגת עם ספוג פנימי מותאם</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technical Specs (table-like) */}
        <section id="features" className="py-16 bg-muted/30 scroll-mt-28 md:scroll-mt-32">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><Settings className="h-5 w-5 text-aegis-blue" />מצלמות Provision-ISR I4-340IP5</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <div>חיישן 1/2.7" CMOS</div>
                  <div>רזולוציה 4 MP (2688×1520)</div>
                  <div>עדשה 2.8 מ"מ זווית רחבה</div>
                  <div>ראיית לילה IR עד 30 מ׳</div>
                  <div>תקן IP67 — עמידות למים ואבק</div>
                  <div>חיבור PoE / 12 V DC</div>
                  <div>דחיסת וידאו H.265</div>
                  <div>אפליקציה Provision CAM 2 (עברית + אנגלית)</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><Settings className="h-5 w-5 text-aegis-blue" />מקליט NVR5-4100PX+</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <div>4 ערוצי PoE מובנים (Plug & Play)</div>
                  <div>יציאות HDMI / VGA עד 1080p</div>
                  <div>דחיסה H.265+ לחיסכון באחסון</div>
                  <div>AI Analytics (DDA2): חציית קו, חדירה לאזור, ספירת אנשים, ניטור תנועה</div>
                  <div>1× SATA עד 6 TB</div>
                  <div>2× USB + LAN לצפייה מהנייד</div>
                  <div>ממשק עברית מלא + שליטה מלאה באפליקציה</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><HardDrive className="h-5 w-5 text-aegis-blue" />דיסק Seagate SkyHawk 2 TB</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/80">
                  <div>3.5" SATA 6 Gb/s • 5900 RPM • 256 MB Cache</div>
                  <div>ייעודי למערכות CCTV 24/7</div>
                  <div>כ~30 יום הקלטה רציפה (2 מצלמות 4 MP)</div>
                  <div>שקט, קר ואמין לשימוש מתמשך</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Warranty & Service */}
        <section id="warranty" className="py-12 scroll-mt-28 md:scroll-mt-32">
          <div className="container-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">אחריות ושירות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/80">
                <p>אחריות 12 חודשים מלאה ע"י Aegis Spectra Security.</p>
                <p>תמיכה טכנית בוואטסאפ / טלפון / דוא״ל בכל שאלה.</p>
                <p>במידת צורך — החלפה מהירה או תיקון במקום.</p>
                <p>הארכת אחריות לאופציה (בתוספת תשלום).</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Legal Notice */}
        <section id="legal" className="py-12 scroll-mt-28 md:scroll-mt-32">
          <div className="container-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">הצהרת שימוש וחוקיות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/80">
                <p>אין לצלם שטחים ציבוריים מעבר לגבולות הנכס ללא שילוט מתאים.</p>
                <p>המערכת נמכרת ומורכבת ממוצרים מקוריים של Provision-ISR ו-Seagate.</p>
                <p>Aegis Spectra היא ספק מערכת ואחראית בלעדית על השירות והאחריות.</p>
                <p>עומדת בתקן IP67 לשימוש חיצוני ובחוק הגנת הפרטיות הישראלי.</p>
              </CardContent>
                  </Card>
            </div>
        </section>

        {/* Pricing Note */}
        <section id="pricing" className="py-12 scroll-mt-28 md:scroll-mt-32">
          <div className="container-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">מחיר מומלץ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/80">
                <div className="overflow-hidden rounded-lg border border-border">
                  <div className="grid grid-cols-2 bg-muted/50 px-4 py-3 text-sm font-semibold">
                    <div>סוג הצעה</div>
                    <div className="text-left">מחיר (כולל מע"מ)</div>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-3 border-t border-border text-sm">
                    <div>מחיר רגיל</div>
                    <div className="text-left">₪ 2,590</div>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-3 border-t border-border text-sm">
                    <div>מבצע השקה</div>
                    <div className="text-left">₪ 2,290</div>
                  </div>
                  <div className="grid grid-cols-2 px-4 py-3 border-t border-border text-sm">
                    <div>כולל התקנה בבית</div>
                    <div className="text-left">₪ 2,890</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border"><Shield className="h-3 w-3" /> תשלומים מאובטחים</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border">SSL</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border">Visa</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border">Mastercard</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border">PayPal</span>
                </div>
                <div className="text-sm text-foreground/70">
                  <div>משלוח חינם בארץ | זמן אספקה 1–3 ימי עסקים</div>
                  <div>התקנה בתיאום מראש | תיעוד והדרכה מלאים ללקוח</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* In the box */}
        <section id="box" className="py-12 scroll-mt-28 md:scroll-mt-32">
          <div className="container-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Gift className="h-6 w-6 text-aegis-blue" />מה מגיע בקופסה</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  {["2 × מצלמות Provision I4-340IP5","1 × מקליט NVR5-4100PX+","1 × דיסק קשיח Seagate SkyHawk 2 TB מותקן","2 × כבלי CAT6 30 מ׳ + מחברים","1 × כבל HDMI 1.5 מ׳","1 × כבל רשת 1 מ׳ (לראוטר)","מדריך A5 מודפס + כרטיס אחריות עם QR","מדבקות Spectra Security","מזוודת ABS קשיחה עם foam מותאם"].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-card border border-border">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Aegis Spectra */}
        <section className="py-12">
          <div className="container-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">למה Aegis Spectra?</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4 text-sm text-foreground/80">
                <div className="bg-muted/30 rounded-lg p-4">שילוב בין ציוד מקצועי למותג ישראלי אמין.</div>
                <div className="bg-muted/30 rounded-lg p-4">כל מערכת עוברת בדיקה וקונפיגורציה לפני אספקה.</div>
                <div className="bg-muted/30 rounded-lg p-4">ממשק שפה עברית + תמיכה אישית.</div>
                <div className="bg-muted/30 rounded-lg p-4">אריזה פרימיום ומראה מותג אמיתי.</div>
                <div className="bg-muted/30 rounded-lg p-4">פתרון מלא – מערכת אבטחה חכמה, לא רק "ערכת מצלמות".</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-12 scroll-mt-28 md:scroll-mt-32">
          <div className="container-max">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">להזמנה ולייעוץ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-foreground/80 text-sm">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> 050-XXX-XXXX</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@aegis-spectra.com</div>
                <p>או השאירו פרטים ונציג יחזור אליכם תוך שעה.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 border-t border-border p-3 flex gap-3 md:hidden">
        <Button
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700"
          aria-label="הוסף לעגלה"
          onClick={() => {
            try { addToCart({ id: 'home-cam-h01', name: 'Home Cam H-01 (2 TB Edition)', price: priceSale, image: (HomeCamImg as any).src }); } catch {}
            window.location.href = '/store/checkout';
          }}
        >
          <ShoppingCart className="h-5 w-5 mr-2" /> הוסף לעגלה
        </Button>
        <Button variant="outline" size="lg" asChild aria-label="צור קשר">
          <Link href="/contact">צור קשר</Link>
        </Button>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="חזרה לראש העמוד"
        className="hidden md:inline-flex fixed bottom-6 right-6 z-40 rounded-full border border-border bg-card px-4 py-2 text-sm shadow"
      >
        ↑ לראש העמוד
      </button>

      <Footer />
    </div>
  );
}