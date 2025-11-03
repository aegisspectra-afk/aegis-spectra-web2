export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
  status: 'published' | 'draft';
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'איך לבחור מצלמות אבטחה לבית - המדריך המלא 2024',
    slug: 'how-to-choose-security-cameras-home-2024',
    excerpt: 'מדריך מקיף לבחירת מצלמות אבטחה לבית, כולל טיפים מקצועיים, המלצות מוצרים וכל מה שאתה צריך לדעת כדי להגן על הבית שלך.',
    content: `
# איך לבחור מצלמות אבטחה לבית - המדריך המלא 2024

## מבוא
בחירת מצלמות אבטחה לבית היא החלטה חשובה שדורשת הבנה מעמיקה של הצרכים והאפשרויות. במדריך זה נסביר לך את כל מה שאתה צריך לדעת.

## סוגי מצלמות אבטחה

### מצלמות IP
- **יתרונות**: איכות גבוהה, חיבור לרשת, שליטה מרחוק
- **חסרונות**: דורשות חיווט, מחיר גבוה יותר
- **מתאימות ל**: בתים עם תשתית רשת טובה

### מצלמות WiFi
- **יתרונות**: התקנה קלה, ללא חיווט
- **חסרונות**: תלויות ברשת WiFi, עלולות להיפגע מהפרעות
- **מתאימות ל**: בתים עם WiFi יציב

## רזולוציה ואיכות

### 1080p (Full HD)
- מתאימה לרוב השימושים הביתיים
- איכות טובה לזיהוי פרטים
- מחיר סביר

### 4K (Ultra HD)
- איכות מעולה לזיהוי פרטים
- דורשת יותר אחסון ורוחב פס
- מחיר גבוה יותר

## ראיית לילה

### IR (Infrared)
- יעילה עד 30 מטר
- לא דורשת תאורה חיצונית
- איכות טובה בחושך מוחלט

### Color Night Vision
- צבעים גם בחושך
- דורשת תאורה מינימלית
- מחיר גבוה יותר

## מערכת NVR

### בחירת NVR
- מספר ערוצים (4, 8, 16, 32)
- אחסון (1TB, 2TB, 4TB)
- חיבור לרשת
- אפליקציה לנייד

## אפליקציה לנייד

### תכונות חשובות
- צפייה בזמן אמת
- הקלטות היסטוריות
- התראות push
- שליטה מרחוק

## סיכום

בחירת מצלמות אבטחה לבית דורשת תכנון קפדני והבנה של הצרכים. חשוב לבחור מוצרים איכותיים ולקבל שירות מקצועי.

לשאלות נוספות או ייעוץ מקצועי, צור קשר איתנו ב-050-973-7025.
    `,
    author: {
      name: 'צוות Aegis Spectra',
      email: 'info@aegisspectra.co.il'
    },
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    views: 1250,
    category: 'מדריכים',
    tags: ['מצלמות', 'אבטחה', 'בית', 'מדריך', 'התקנה'],
    featured: true,
    image: '/blog/camera-guide.jpg',
    status: 'published'
  },
  {
    id: '2',
    title: '5 טיפים לאבטחת הבית שלך בחופשה',
    slug: '5-tips-home-security-vacation',
    excerpt: 'כיצד להגן על הבית בזמן שאתה בחופשה - טיפים מקצועיים מהמומחים שלנו שיעזרו לך לחזור הביתה בשלום.',
    content: `
# 5 טיפים לאבטחת הבית שלך בחופשה

## מבוא
חופשה אמורה להיות זמן של רגיעה, אבל דאגה לבית יכולה להרוס את החוויה. הנה 5 טיפים שיעזרו לך לחזור הביתה בשלום.

## 1. הפעל מערכת אבטחה

### לפני היציאה
- בדוק שכל החיישנים עובדים
- הפעל מצלמות אבטחה
- הגדר התראות לנייד
- בדוק חיבור לאינטרנט

## 2. צור אשליה של נוכחות

### תאורה
- הפעל טיימרים לתאורה
- השאר אור בחדר השינה
- הפעל טלוויזיה מדי פעם

## 3. הגן על נקודות כניסה

### דלתות וחלונות
- בדוק מנעולים
- סגור תריסים
- הוסף מנעולים נוספים

## 4. שמור על קשר

### שכנים וחברים
- הודע על היעדרות
- השאר מספר טלפון
- בקש לבדוק מדי פעם

## 5. השתמש בטכנולוגיה

### אפליקציות וחיישנים
- בקרת מרחוק
- התראות מיידיות
- צפייה בזמן אמת

## סיכום

אבטחת הבית בחופשה דורשת תכנון קפדני ושימוש בטכנולוגיה מתקדמת. עם הטיפים האלה תוכל לחזור הביתה בשלום.

לשאלות נוספות או ייעוץ מקצועי, צור קשר איתנו ב-050-973-7025.
    `,
    author: {
      name: 'מיכאל כהן',
      email: 'michael@aegisspectra.co.il'
    },
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    readTime: 5,
    views: 890,
    category: 'טיפים',
    tags: ['אבטחה', 'חופשה', 'בית', 'טיפים', 'מניעה'],
    featured: true,
    image: '/blog/vacation-security.jpg',
    status: 'published'
  },
  {
    id: '3',
    title: 'מערכות אזעקה אלחוטיות - יתרונות וחסרונות',
    slug: 'wireless-alarm-systems-pros-cons',
    excerpt: 'השוואה מפורטת בין מערכות אזעקה אלחוטיות לחוטיות, כולל המלצות מקצועיות לבחירה הנכונה.',
    content: `
# מערכות אזעקה אלחוטיות - יתרונות וחסרונות

## מבוא
מערכות אזעקה אלחוטיות הפכו פופולריות בשנים האחרונות, אבל האם הן מתאימות לכל מצב? במדריך זה נשווה בין האפשרויות השונות.

## יתרונות מערכות אלחוטיות

### התקנה קלה
- ללא חיווט מסובך
- התקנה מהירה
- פחות הרס בקירות
- אפשרות להעברה

### גמישות
- הוספת חיישנים בקלות
- שינוי מיקום חיישנים
- התאמה לצרכים משתנים

## חסרונות מערכות אלחוטיות

### תלות בסוללות
- החלפה קבועה
- התראות סוללה חלשה
- עלות סוללות

### הפרעות
- הפרעות WiFi
- הפרעות אלקטרומגנטיות
- פגיעות להאקינג

## השוואה למערכות חוטיות

### אמינות
- **אלחוטיות**: תלויות בסוללות ורשת
- **חוטיות**: אמינות גבוהה, חיבור ישיר

### עלות
- **אלחוטיות**: יקרות יותר, עלות סוללות
- **חוטיות**: זולות יותר, ללא עלות תחזוקה

## סיכום

מערכות אזעקה אלחוטיות מתאימות למצבים מסוימים, אבל לא לכל מצב. חשוב לשקול את היתרונות והחסרונות לפני הבחירה.

לשאלות נוספות או ייעוץ מקצועי, צור קשר איתנו ב-050-973-7025.
    `,
    author: {
      name: 'שרה לוי',
      email: 'sarah@aegisspectra.co.il'
    },
    publishedAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    readTime: 6,
    views: 650,
    category: 'טכנולוגיה',
    tags: ['אזעקות', 'אלחוטי', 'טכנולוגיה', 'השוואה', 'מערכות'],
    featured: false,
    image: '/blog/wireless-alarms.jpg',
    status: 'published'
  },
  {
    id: '4',
    title: 'איך להתקין מצלמות אבטחה בעצמך - מדריך שלב אחר שלב',
    slug: 'how-to-install-security-cameras-diy',
    excerpt: 'מדריך מפורט להתקנת מצלמות אבטחה בעצמך, כולל כלים נדרשים, שלבי עבודה וטיפים מקצועיים.',
    content: `
# איך להתקין מצלמות אבטחה בעצמך - מדריך שלב אחר שלב

## מבוא
התקנת מצלמות אבטחה בעצמך יכולה לחסוך כסף, אבל דורשת תכנון קפדני וכלים מתאימים. במדריך זה נסביר לך איך לעשות זאת נכון.

## תכנון מוקדם

### בחירת מיקום
- נקודות אסטרטגיות
- זוויות צילום
- גובה התקנה
- הגנה מהשמש

## כלים נדרשים

### כלים בסיסיים
- מקדחה
- מקדחי בטון
- מברגה
- מברגים

### חומרים
- כבלי רשת
- מחברים
- ברגים ודיבלים

## שלבי התקנה

### שלב 1: סימון נקודות
- סמן מיקום מצלמות
- בדוק זוויות צילום
- סמן נתיב כבלים

### שלב 2: קידוח חורים
- קדח חורים למצלמות
- קדח חורים לכבלים
- בדוק עומק חורים

### שלב 3: הנחת כבלים
- הנח כבלי רשת
- השאר אורך נוסף
- הגן על כבלים

### שלב 4: התקנת מצלמות
- חבר כבלים למצלמות
- התקן מצלמות
- כוון זוויות

## מתי לפנות למקצועי

### מצבים מורכבים
- קידוח בטון
- גובה מעל 3 מטר
- חיווט מסובך
- מערכות מתקדמות

## סיכום

התקנת מצלמות אבטחה בעצמך אפשרית, אבל דורשת תכנון קפדני וכלים מתאימים. במקרים מורכבים, עדיף לפנות למקצועי.

לשאלות נוספות או ייעוץ מקצועי, צור קשר איתנו ב-050-973-7025.
    `,
    author: {
      name: 'דוד כהן',
      email: 'david@aegisspectra.co.il'
    },
    publishedAt: '2024-01-01T16:45:00Z',
    updatedAt: '2024-01-01T16:45:00Z',
    readTime: 10,
    views: 420,
    category: 'מדריכים',
    tags: ['התקנה', 'DIY', 'מצלמות', 'מדריך', 'שלבים'],
    featured: false,
    image: '/blog/diy-installation.jpg',
    status: 'published'
  },
  {
    id: '5',
    title: 'הטרנדים החדשים באבטחה 2024 - מה צפוי השנה',
    slug: 'security-trends-2024-what-to-expect',
    excerpt: 'סקירה מקיפה של הטרנדים החדשים בתחום האבטחה לשנת 2024, כולל טכנולוגיות מתקדמות והמלצות מקצועיות.',
    content: `
# הטרנדים החדשים באבטחה 2024 - מה צפוי השנה

## מבוא
שנת 2024 מביאה איתה טכנולוגיות חדשות ומרתקות בתחום האבטחה. במדריך זה נסקור את הטרנדים החדשים והמשמעות שלהם.

## בינה מלאכותית (AI) באבטחה

### זיהוי פנים מתקדם
- זיהוי מדויק יותר
- זיהוי במצבים קשים
- זיהוי מהיר

### ניתוח התנהגות
- זיהוי התנהגות חשודה
- התראות חכמות
- מניעת אירועים

## מצלמות 4K ו-8K

### איכות מעולה
- רזולוציה גבוהה
- זיהוי פרטים מדויק
- איכות לילה

## אבטחה חכמה

### אינטגרציה עם בית חכם
- שליטה מרחוק
- אוטומציה חכמה
- התראות מותאמות

## אבטחת סייבר

### הגנה מפני האקרים
- הצפנה מתקדמת
- אימות דו-שלבי
- עדכונים קבועים

## סיכום

שנת 2024 מביאה איתה טכנולוגיות חדשות ומרתקות בתחום האבטחה. חשוב להישאר מעודכן ולהשקיע בטכנולוגיות המתאימות.

לשאלות נוספות או ייעוץ מקצועי, צור קשר איתנו ב-050-973-7025.
    `,
    author: {
      name: 'צוות Aegis Spectra',
      email: 'info@aegisspectra.co.il'
    },
    publishedAt: '2023-12-28T11:20:00Z',
    updatedAt: '2023-12-28T11:20:00Z',
    readTime: 7,
    views: 320,
    category: 'חדשות',
    tags: ['טרנדים', '2024', 'טכנולוגיה', 'חדשות', 'עתיד'],
    featured: false,
    image: '/blog/security-trends-2024.jpg',
    status: 'published'
  }
];

export const getBlogPosts = (filters?: {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}) => {
  let filteredPosts = blogPosts.filter(post => post.status === 'published');

  if (filters?.category) {
    filteredPosts = filteredPosts.filter(post => post.category === filters.category);
  }

  if (filters?.featured !== undefined) {
    filteredPosts = filteredPosts.filter(post => post.featured === filters.featured);
  }

  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (filters?.offset) {
    filteredPosts = filteredPosts.slice(filters.offset);
  }

  if (filters?.limit) {
    filteredPosts = filteredPosts.slice(0, filters.limit);
  }

  return filteredPosts;
};

export const getBlogPost = (slug: string) => {
  return blogPosts.find(post => post.slug === slug && post.status === 'published');
};

export const getCategories = () => {
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  return categories;
};

export const getTags = () => {
  const tags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  return tags;
};

