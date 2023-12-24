function validateForm(arr) {
  let result = [];
  let bad = false;

  arr.forEach((t) => {
    if (!t?.check) {
      const re = !!t.value;

      if (!re) {
        t.f(true);
        bad = true;
      }
    } else {
      const re = t.check(t.value);

      if (!re) {
        t.f(true);
        bad = true;
      }
    }
  });

  if (bad) return false;
  return true;
}

function setErrorStatesFalse(arr) {
  arr.forEach((t) => {
    t(false);
  });
}

export { validateForm, setErrorStatesFalse };
