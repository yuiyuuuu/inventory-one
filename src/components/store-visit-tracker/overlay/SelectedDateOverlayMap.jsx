import React, { useState } from "react";

const SelectedDateOverlayMap = ({ t }) => {
  const [show, setShow] = useState(false);

  return (
    <div className='vt-selcon'>
      <div className='vt-sel' onClick={() => setShow((prev) => !prev)}>
        {t.store.name} - {t.user.name}
        <div className='grow' />
        <div
          className='mitem-caret'
          style={{ transform: !show && "rotate(-90deg)" }}
        />
      </div>

      {show && (
        <div className='vt-desccon'>
          <div className='f-s-main vt-desc'>
            <span className='bold'>Visitors: </span>
            {t.visitors}
          </div>
          <div className='f-s-main vt-desc'>
            <span className='bold'>Body: </span>

            <pre>{t.memo}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedDateOverlayMap;
