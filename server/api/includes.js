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
    },
  },

  owner: true,
  sharedUsers: true,
  category: {
    include: {
      items: true,
    },
  },
});

module.exports = { list };
