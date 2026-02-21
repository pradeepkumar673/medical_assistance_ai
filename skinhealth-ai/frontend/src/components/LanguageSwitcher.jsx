import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
}