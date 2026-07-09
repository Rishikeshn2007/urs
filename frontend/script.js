const counters = document.querySelectorAll("[data-count]");

counters.forEach((counter) => {
  const target = Number(counter.dataset.count);
  const isPercent = counter.textContent.includes("%");
  const duration = 900;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);

    counter.textContent = isPercent ? `${value}%` : value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const originalText = button.textContent;

    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = "Copied";
    } catch (error) {
      button.textContent = "Copy";
    }

    setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
  });
});


