

async function analyze() {
    const input = document.getElementById('inputText').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Завантаження...';
    try {
    const res = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input })
    });
    const data = await res.json();
    resultDiv.textContent = data.result;
    } catch (err) {
    resultDiv.textContent = 'Помилка: не вдалося підключитися до сервера.';
    }}

    async function analyzeText() {
  const text = document.getElementById('textInput').value.trim();

  if (!text) {
    document.getElementById('textResult').innerText = 'Будь ласка, введіть текст для аналізу.';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/analyze-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    document.getElementById('textResult').innerText = data.result;
  } catch (error) {
    document.getElementById('textResult').innerText = 'Сталася помилка при запиті до сервера.';
    console.error(error);
  }
}

