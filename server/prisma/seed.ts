const prisma = require("./prismaClient");

const { c } = require("../jsonobj");

function sorting(a, b) {
  const aTime = Date.parse(a.COMPLETE_DATE);
  const bTime = Date.parse(b.COMPLETE_DATE);

  return aTime - bTime;
}

const findqty = () => {
  const group = {};

  for (let i = 0; i < c.length; i++) {
    const v = c[i];

    delete v.ItemMNo;
    delete v.PRO_TYPE;
    delete v.PRO_DATE;
    delete v.IMG_1;
    delete v.IMG_2;
    delete v.STORE_SUPPORT;
    delete v.R_DATE;
    delete v.W_DATE;
    delete v.W_MEM_ID;
    delete v.M_DATE;
    delete v.M_MEM_ID;
    delete v.D_DATE;
    delete v.D_MEM_ID;
    delete v.CHK_USE;
    delete v.DOC_CODE;
    delete v.PARENTS_DOC_CODE;
    delete v.PROCESSING_CODE;
    delete v.EDITING_ID;
    delete v.EDITING_TIME;
    delete v.HOLD_ID;

    delete v.HOLD_DATE;

    delete v.HOLD_NOTE;

    delete v.CANCEL_ID;

    delete v.CANCEL_DATE;

    delete v.CANCEL_NOTE;

    delete v.READ_ID;

    delete v.READ_DATE;

    delete v.W_STORE_NOTE;

    delete v.W_STORE_SEND_DATE;
  }

  c.slice().forEach((v) => {
    group[v.SUPPLY_NUM] ||= {
      //later we can use the prisma auto gen id
      id: v.SUPPLY_NUM, //temp id, so we dont have duplicate items
      name: v.C_TITLE,
      quantity: 0,
      completedDates: [],
    };

    group[v.SUPPLY_NUM].quantity = group[v.SUPPLY_NUM].quantity + v.QTY;

    if (group[v.SUPPLY_NUM].completedDates.length > 20)
      group[v.SUPPLY_NUM].completedDates.shift();

    group[v.SUPPLY_NUM].completedDates.push(v.COMPLETE_DATE);
    group[v.SUPPLY_NUM].lastCompletedPerson = v.COMPLETE_ID;
  });

  return group;
};

const seed = async () => {
  await prisma.item.deleteMany();

  const re = Object.values(findqty());

  for (let i = 0; i < re.length; i++) {
    const cur = re[i];

    console.log(cur);

    await prisma.item.create({
      data: {
        name: cur.name,
        quantity: 0,
        historyQTY: cur.quantity,
        completedTimes: cur.completedDates,
      },
    });
  }
};

try {
  seed();
} catch (error) {
  console.log(error);
  process.exitCode = 1;
} finally {
  console.log("db connection closed");
}
