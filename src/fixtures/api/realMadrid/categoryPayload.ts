
const categoryNumber = Math.floor(Math.random() * 1000);

export const PAYLOAD = {
    createCategory:{"attributes":{"promotedProductView":{"value":true}},"optionTargeters":["Product 1","Product 2","Product 3"],"accessCodes":["category"],"activeStartDate":"2025-05-18T18:30:00.000Z","showInSiteMap":true,"displayType":"STANDARD","productMembershipType":"EXPLICIT","name":`Test Category ${categoryNumber}`,"url":`/test-category-${categoryNumber}`,"legendsCategoryId":categoryNumber,"subTheme":"New Theme","directoryNameOverride":`Test Category ${categoryNumber}`,"breadcrumbLabel":`Test Category ${categoryNumber}`,"activeEndDate":"2025-12-18T18:30:00.000Z"}
}