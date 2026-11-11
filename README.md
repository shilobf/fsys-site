# F-SYS Site

אתר החברה: Angular (SSR) + NestJS, עם תוכן שנשמר בקובצי JSON (בלי DB רלציוני).

```
web/   Angular 22 + Tailwind 4, RTL, SSR. server.ts מעביר את /api ל-NestJS
api/   NestJS: תוכן, התחברות מנהל (JWT), טופס צור קשר
       הנתונים נשמרים ב-api/data/*.json (נוצרים בהרצה הראשונה מתוך default-content.ts)
```

## הרצה בפיתוח

```bash
cd api && npm run start:dev     # http://localhost:3000/api
cd web && npm start             # http://localhost:4200
```

ההגדרות נמצאות ב-`api/.env` (תבנית: `api/.env.example`), כולל `ADMIN_PASSWORD` ו-`JWT_SECRET`.

## API

| Method | Path | הרשאה |
|---|---|---|
| GET | /api/content | ציבורי |
| PUT | /api/content | מנהל |
| POST | /api/auth/login `{password}` → `{token}` | ציבורי |
| POST | /api/contact | ציבורי |
| GET | /api/contact | מנהל |

## ממשק ניהול

`http://localhost:4200/admin`: כניסה עם `ADMIN_PASSWORD` מתוך `api/.env`. אפשר לערוך את כל הסקשנים, להוסיף, להסיר ולסדר מחדש פריטים, להעלות תמונות ולצפות בפניות.
התמונות נשמרות ב-`api/data/uploads` ומוגשות מ-`/api/uploads/...`. השמירה מתעדכנת באתר מיד, כי ה-SSR מרונדר בכל בקשה.

| Method | Path | הרשאה |
|---|---|---|
| POST | /api/uploads (multipart `file`, עד 10MB, JPG/PNG/WEBP/GIF) | מנהל |
| GET | /api/uploads/:name | ציבורי |

## להמשך
- מעבר ל-MongoDB: להחליף את `JsonStore` במימוש Mongo
- שליחת מייל על פנייה חדשה
- דחיסת תמונות (חלקן 1–3MB)
