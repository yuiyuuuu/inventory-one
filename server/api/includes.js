//this file includes all includes for the prisma queries.
//this will ensure we dont repeat the same includes, we can just use JSON.parse

const list = JSON.stringify({
  item: {
    include: {
      orders: {
        include: {
          user: true,
          store: true,
        },
      },
      category: true,
      shipments: true,
    },
  },

  owner: true,
  sharedUsers: true,
  category: {
    include: {
      items: {
        include: {
          orders: true,
        },
      },
    },
  },

  orders: true,
});

const store = JSON.stringify({
  orders: {
    include: {
      item: {
        include: {
          category: true,
          list: true,
        },
      },
      user: true,
    },
  },

  keyLog: true,
  keyImage: true,
  callLog: true,
  employees: {
    include: {
      store: true,
    },
  },
});

const userinclude = JSON.stringify({
  lists: true,
  sharedLists: {
    include: {
      owner: true,
    },
  },
  orders: true,
  QR: true,
  print: {
    include: {
      printFiles: true,
    },
  },
  TimeTracker: {
    include: {
      history: true,
    },
  },
});

const item = JSON.stringify({
  orders: {
    include: {
      user: true,
      store: true,
    },
  },
  category: true,
  shipments: true,
});

const calls = JSON.stringify({
  store: true,
});

module.exports = { list, store, userinclude, item, calls };
