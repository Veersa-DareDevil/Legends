export const QueryParams = {
  newFullfillmentOrders: {
    cq: "(status=eqic='NEW')",
    hydrateChildEntities: 'true',
    size: '50',
    sort: ['submitDate,DESC'],
  },

  productSearchByName: (name: string) => ({
    indexableType: 'PRODUCT',
    q: name,
    query: name,
    localeOverrideForFacetAndSortLabels: 'en-US',
    size: '50',
  }),

  searchProductStorefront: {
    page: '0',
    primaryAndSecondaryOnly: 'true',
    query: 'jersey',
    size: '12',
    type: 'PRODUCT',
  },
}
