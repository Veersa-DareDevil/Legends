export const QueryParams = {
  newFullfillmentOrders: {
    cq: "(status=eqic='NEW')",
    hydrateChildEntities: 'true',
    size: '50',
    sort: ['submitDate,DESC'],
  },
}