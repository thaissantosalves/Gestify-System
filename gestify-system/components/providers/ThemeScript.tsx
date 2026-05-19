export default function ThemeScript() {
  const script = `
    (function () {
      try {
        var stored = localStorage.getItem('gestify-theme');
        var theme = stored === 'light' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
