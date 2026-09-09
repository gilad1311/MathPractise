# מתרגלים ומצליחים — V2

גרסת V2 של מערכת התרגול לעילאי ורואי.

## V2 כולל
- אזור תלמיד ואזור מורה.
- בחירת רמת קושי: קל / בינוני / מתקדם.
- 10 שאלות בכל סבב.
- +10 נקודות בהצלחה בניסיון ראשון.
- +5 נקודות בהצלחה בניסיון שני.
- ניסיון נוסף לאחר טעות ראשונה.
- משפט העצמה והמשך לאחר טעות שנייה.
- אנימציית הצלחה.
- שמירת נתונים מקומית.
- יעדי ניקוד לכל תלמיד.
- לוח מורה עם ניקוד, כמות תרגילים, דיוק וניסיונות שניים.
- פירוט לפי נושא.
- דוח מסכם, שיתוף והדפסה/PDF.
- PWA להתקנה באנדרואיד, iPhone (דרך Safari > Add to Home Screen) ומחשב.

## הפעלה
Service Worker עובד דרך HTTP/HTTPS ולא דרך file://.

```bash
python3 -m http.server 8080
```

פתחו:
http://localhost:8080

לפריסה אמיתית מומלץ להעלות לשרת HTTPS כגון GitHub Pages, Netlify או Vercel.

## שלב הבא לגרסת Production
- חשבון מורה מאובטח.
- מסד נתונים בענן.
- סנכרון בין טלפון למחשב.
- ניהול תלמידים.
- בנק תרגילים גדול לפי תוכנית לימודים.
- היסטוריה מלאה לפי תאריכים.
- דוחות PDF מקצועיים.
- הרשאות מורה/הורה.
- גיבוי ושחזור.


## Adaptive difficulty (V3)
- Every topic starts at **התחלה** (the easiest level).
- Difficulty increases only after **3 first-try correct answers in a row**.
- A mistake resets the streak, so the app does not rush the student upward.
- The current level is saved separately for עילאי and רואי and for each topic.
- The student can always see the current level next to each topic.
