//find orders for a specific store
const a = await prisma.order.findFirst({
  where: {
    store: {
      id: "abc",
    },
  },
});

//find orders for a specific item
const b = await prisma.order.findFirst({
  where: {
    item: {
      id: "abc",
    },
  },
});
