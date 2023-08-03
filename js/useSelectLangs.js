document.addEventListener('DOMContentLoaded', function () {
  const selectLanguagesElm = document.getElementById('select-languages');

  if (selectLanguagesElm) {
    selectLanguagesElm.addEventListener('change', function () {
      const selectedLanguage = selectLanguagesElm.value;
      document.body.classList.remove('en', 'vn');
      document.body.classList.add(selectedLanguage);
    });
  }
});
