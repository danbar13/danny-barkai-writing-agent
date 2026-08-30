export interface SampleIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  rawContent: string;
  wizardData?: {
    dilemma: string;
    personalBackground: string;
    prosAndCons: string;
    concreteExample: string;
    personalStance: string;
  };
}

export const SAMPLE_IDEAS: SampleIdea[] = [
  {
    id: 'travel-tech-kiosks',
    title: 'צ\'ק-אין אוטומטי ו-Kiosks במלון — קידמה טכנולוגית או אובדן נשמת האירוח?',
    category: 'Travel Tech וחדשנות',
    description: 'הדילמה שבין התייעלות וחיסכון בעלויות תפעול לבין אובדן הקשר האישי והחום האנושי של פקיד הקבלה.',
    rawContent: `דילמת הכנסת עמדות צ'ק-אין אוטומטיות (Self Check-in Kiosks) וטרבל-טק למלונות בישראל.
בעבר - פקיד הקבלה היה הפנים, החיוך והנשמה של המלון. האורח הגיע עייף מהדרך, קיבל משקה קבלת פנים והסבר אישי.
כיום - תורים ארוכים בשעות השיא בלובי, מחסור בכוח אדם ומערכות דיגיטליות שמאפשרות פתיחת דלת מהסמארטפון ודילוג על הקבלה.
מצד אחד - קיצור זמני המתנה דרמטי, חיסכון בעלויות, דיוק בנתונים ואורחים צעירים שמעדיפים אפליקציה.
מצד שני - תחושת ניכור, תקלות טכנולוגיות שמתסכלות את האורח, ואובדן ההזדמנות ל-Upsell ולהענקת חוויית אירוח אותנטית ("Hospitality").
עמדה: טכנולוגיה נועדה לשחרר את עובדי השירות מבירוקרטיה כדי שיתפנו לאירוח אמיתי - לא להחליף את האדם לחלוטין.`,
  },
  {
    id: 'ai-in-management',
    title: 'בינה מלאכותית (AI) בקבלת החלטות ניהוליות — כלי תומך או תחליף למנהיגות?',
    category: 'בינה מלאכותית וניהול',
    description: 'אלגוריתמים לתמחור דינמי, חיזוי תפוסה וניהול סידורי עבודה מול תחושת בטן ושיקול דעת אנושי.',
    rawContent: `שילוב כלי AI ואוטומציה בקבלת החלטות אסטרטגיות ותפעוליות בארגונים ובמלונאות.
בעבר - מנהל תפעול ומנהל הכנסות הסתמכו על ניסיון השנים, אינטואיציה עמוקה והכרת השטח.
כיום - מודלים של בינה מלאכותית מנבאים ביקושים, קובעים תמחור דינמי וממליצים על קיצוץ תקאים בלחיצת כפתור.
הדילמה: מתי המנהל הופך ממוביל בעל חזון ל'מוציא לפועל' עיוור של פקודות האלגוריתם? ואיך שומרים על גמישות ואמפתיה כשהמספרים היבשים של ה-AI מכתיבים את המציאות?
עמדה: AI הוא מכפיל כוח אדיר בניתוח נתונים, אך האחריות המוסרית והשיקול המערכתי לעולם יישארו בידי המנהל האנושי.`,
  },
  {
    id: 'foreign-workers',
    title: 'עובדים זרים וירדנים במלונאות — פתרון הכרחי או פשרה מסוכנת?',
    category: 'משאבי אנוש ומלונאות',
    description: 'הדילמה בין המחסור החמור בכוח אדם ישראלי לעבודות כפיים לבין אתגרי השירות והביטחון.',
    rawContent: `דילמת העסקת עובדים ירדנים וזרים במלונות אילת וים המלח.
מצד אחד - יש מחסור כרוני בידיים עובדות (משק בית, שטיפת כלים, תחזוקה). ישראלים כבר עשרות שנים לא מגיעים לעבודות האלה, מה שפוגע קשות ברמת התחזוקה של המלונות ומוביל לקריסת צוותים.
מצד שני - קיימים חששות ביטחוניים, פערי שהה ותרבות מול האורח הישראלי, תלות במדיניות ממשלתייע�',
    personalBackground: 'מעל 20 שנות ניהול משאבי אנוש במלונות באילת — ראיתי איך מענקים ממשלתיים לא הצליחו להביא ישראלים למקצועות הניקיון לאורך שנים.',
    prosAndCons: 'מחד: מענה מיידי ומכציל למחסור הצריטי בידיים עובדות, ר�y�z�z�y}ymy]z}yBy�y]yyB�y�yy�y=y��y}z�z�y]z�yy�y�y}y]zy�y�y��y�y}zy]y�z�zMyBy�y]y�yMyy]z�yr�z�y�y]z�yy�y=y�zy�y]z�y�y�z�y�z�y�y�z.�r��6��7&WFTW���S�}y=w�יינו מנהל משק שעומד מול 100 חדרים לא מנוקים בשעה 14:00 כשהלובי מלא אורחים זועמים, ובלי עובדים זרים אין מי שינקה.',
    personalStance: 'לתפישתי, זה לא שירה אידיאלית אלא מענה ٝz�y�y�y]yMy�z�y}y��y�z�y�zyMy�ymyz�yy�yy]y2�yy�z}zmy]z-y�y]z�y]yzy]yy�zy]z��yyMzmy�y}yBr��������C�w67&VV��r�FW7G2r��F�F�S�}y�yy}zy�y�y�y]y�y�y�y]y}z�yy�y�(	B��y�y�z-��z�y�yyRz�y}y�y�z2z-y�y]z�y]z�y�z�y�z}y]y�y=z-z�yzy]z�y��r��6FVv�'��}zy�yMy]y�y]y-y�y]zr��FW67&�F���}y�yy}zy�yMz�yy�yBy]y�yMy�y�zy]z�y�y�y]y}z�yy�y�y�z-y]y�z�yy�zy�y]yy�zmy�yBy]z�y�z}y]y�y=z-z�z�y�y�zyMy�y�y-y�y�z�r��&t6��FV�C�y�yy}zy�y�y�y]y�y�y�y]y}z�yy�y�y]zMzy�y�y]y�y�zy�y�y�y�z}yy�yBy�z-yy]y=yB�yz-yz��yMy�zyMy�y]y�zyMy�y�z�yyy�yzy]z�z�yy�y�zyR�yMz�z�z�y�yRy]yMy}y�y�y�yRz-y�zMy�z�y�y}yBy�z-y�y�z}yBy]z�y}y]z�z�yy�y�y�z}zmy]z-y�z��y�y�y]y��y�z-z�y�y]z�zy�zy]y�yy]y�y]y�y�y�y]z��y�yy}zy�y�yMy�y�zy]z�y�z}y]y]zy�y�y]zmy�y]zy�yMz�yy�yBy}y2�y�z�y�z-y�y�y��yMy=y�y�y�yC�yMyy�yMy�yy}zy�y�yMyy�yRy�zzMy�y�y�y]z-y�y=y�y�y�y]yy�y�y]z�y-y�z�y�y�z�zryy-y�y�y}z�y=z�y�yy}zy�y��y]y�zy-y2�yy�y�yz�y-y]y�y-y=y]y�y�y�y]y�y�zzy�y�yy]z�y�y]z-y�y=y�y�yy�y�y�y�y�yy}y�y2y]yy]yy�y�z}y�y�yy��zy�zyByz�y�ys�y�zyMy�z�z�y]yyBzmy�y]y�zy�y]y�yy�yy}y�y]y�z�z�y�z�yymyBy�zMy-y]z"yz-y]yy2�-z�yy�zyRyy�yy}y�z�yy�yzMz�z�y�zy�y]y�z-y�y�y�"��z-y�y=yC�yMy�yy}y�yMy]yy�y�y�z�y]y�y�yMy}y�y�yByy�yy2�yzy]z�z�y�yMy�yBy�y�y�yy�z-y=y�yyRz�y]zMy�z-y�y�y]y����������C�v6��G&7F�'2�g2֖��W6Rr��F�F�S�}z-y]yy=y�z}yy�y�y]y�y]yryy=y�y�y]y�z-y]yy=y�yy�z�(	Bzyy�zy]z�y}zmy]y�yByyz�y-y]y�r��6FVv�'��}y�y}zy�z-yy]y=yBr��FW67&�F���}yy�y�y�y�y�zmz�y�y�z�y}y]z�z�z�y�y�y�y]z�y]y-yy]y]z�y�y}y�y=yBy�z�y}y�zrzy�y�z�y�yMz-y]yy=y�y�y�y]z-zz}y�y�y=z�y�zmy2z�y�y�z�y��r��&t6��FV�C�z-y]yy=y�y}yz�y]z�y�y]yryy=y�y�z-y]y�z�z-y]yy=y�yy�z�yy�y�y]zyy]z��y�z�yyy�yzy]z�y�zzyBy�y�y�zmz�z�z�yy]z�yz�y-y]zy�z��y�z�zMy}z�y�y]z�y]zyy�zy]z�y�}y=y-y�r�yyy�y�z�z-y]yy2y�z}yy�z�y�y]z�z�y�z�y�y}yz�yBy}y�zmy]zy�z��z�y]yyByMyy=y�y�y�yz�zyy�y�y]y�z�y-y�z�-zy]y"yr"�yMy�z�y�y�yBy�y�z-y�yy�z�y�yzMz�z�y�z��y�yy�y=y��yMy-y�y�z�y]z�yMzy�yMy]y�y�z�z�y�y}yz�y]z�y�y]yryy=y�y}y�y]zy�z�y�z-zz2z-y]zz�y�y]z�zy]y=z�y�y�y�yRy�y�y]zyy]z��z-y�y=yC�y}yz�y]z�y�y]yryy=y�yy�zy�yMyy]y�yyy�yz�y]z�zMy]z��yy�y}y]yz�yMy�y�y]y�y�yMz�y�y�y}zy�y�y�z-y]yy2yz�y�yry�yy=y�z�y]y]yBymy�y]y�y]z�������Ӱ�