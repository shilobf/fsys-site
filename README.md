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

## אחסון נתונים
- כש-`MONGODB_URI` מוגדר: התוכן והפניות נשמרים באוסף `docs`, והתמונות שהמנהל מעלה נשמרות ב-GridFS (`uploads`).
- בלי `MONGODB_URI` (פיתוח מקומי): הכול נשמר בקבצים תחת `DATA_DIR` (`api/data`).

## פריסה (Render, חינמי)
- `render.yaml` מגדיר שירות אחד: `npm run build` בונה את ה-API ואת האתר, ו-`npm start` (`start.mjs`) מריץ את שניהם.
- משתני סביבה ב-Render: `MONGODB_URI` (מ-MongoDB Atlas), `ADMIN_PASSWORD`. את `JWT_SECRET` ‏Render מייצר לבד.
- בחינם השירות נרדם אחרי 15 דקות בלי ביקורים. שירות פינג חיצוני (כמו cron-job.org כל 10 דקות ל-`/api/content`) שומר אותו ער.
- דומיינים מורשים ל-SSR: `web/angular.json` ‏→ `security.allowedHosts`.

## להמשך
- שליחת מייל על פנייה חדשה
- דחיסת תמונות (חלקן 1–3MB)
