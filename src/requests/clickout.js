function clickout(idarr, visibleid, func, funcvalue) {
  const $target = $(event.target);

  const check = idarr.map((v) => {
    return !$target.closest(`#${v}`).length;
  });

  if (!check.includes(false) && $(`#${visibleid}`).is(":visible")) {
    func(funcvalue);
  }
}

export { clickout };
