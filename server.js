const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Аналіз сайту за URL
app.post('/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith('http')) {
    return res.status(400).json({ result: 'Будь ласка, введіть коректне посилання (http/https).' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const scriptCount = $('script').length;
    const inputCount = $('input, textarea, select').length;
    const buttonCount = $('button').length;
    const divCount = $('div').length;
    const componentsWithClasses = $('[class]').length;
    const reactHints = $('[data-reactroot], [id^="__next"]').length;

    const isSimple = scriptCount < 5 && inputCount < 3 && buttonCount < 3 && divCount < 50 && componentsWithClasses < 40;
    const isReactLike = reactHints > 0 || scriptCount > 10 || componentsWithClasses > 100 || inputCount + buttonCount > 10;

    if (isReactLike) {
      return res.json({ result: 'Рекомендується використати React або Angular — складна DOM-структура, багато інтерактивних елементів.' });
    } else if (isSimple) {
      return res.json({ result: 'Рекомендується використати HTML/CSS/JavaScript — сайт має просту структуру.' });
    } else {
      return res.json({ result: 'Рекомендується використати React або HTML/CSS/JS залежно від ваших потреб — сайт має середню складність.' });
    }

  } catch (error) {
    console.error('Помилка:', error.message);
    return res.status(500).json({ result: 'Не вдалося проаналізувати сайт. Перевірте URL або спробуйте пізніше.' });
  }
});

// 🔍 Аналіз тексту користувача
app.post('/analyze-text', (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length === 0) {
    return res.status(400).json({ result: 'Будь ласка, введіть текст для аналізу.' });
  }

  const lowerText = text.toLowerCase();

  const frontendKeywords = ['сайт', 'інтерфейс', 'макет', 'html', 'css', 'простий'];
  const reactKeywords = ['динамічний', 'spa', 'react', 'компонент', 'стан', 'redux', 'анімація', 'routing'];
  const angularKeywords = ['angular', 'модуль', 'типізація', 'rxjs', 'typescript'];

  const countMatches = (keywords) =>
    keywords.reduce((count, word) => count + (lowerText.includes(word) ? 1 : 0), 0);

  const reactScore = countMatches(reactKeywords);
  const angularScore = countMatches(angularKeywords);
  const frontendScore = countMatches(frontendKeywords);

  let result;
  if (reactScore > angularScore && reactScore > frontendScore) {
    result = 'Рекомендується React — сучасний підхід для складного функціоналу.';
  } else if (angularScore > reactScore && angularScore > frontendScore) {
    result = 'Рекомендується Angular — підходить для масштабних проектів.';
  } else if (frontendScore >= reactScore && frontendScore >= angularScore) {
    result = 'Рекомендується HTML/CSS/JavaScript — простий або статичний сайт.';
  } else {
    result = 'Немає достатньо даних. Уточніть опис.';
  }

  res.json({ result });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущено: http://localhost:${PORT}`);
});
