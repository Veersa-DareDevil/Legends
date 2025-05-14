export const PAYLOAD = {
    createProduct: {
        "reviewsSummary": {
            "numberOfReviews": 0
        },
        "$tracking": {
            "searchSettings": {
                "settingsContext": "ADMIN",
                "searchEnabled": true
            },
            "tenant": {
                "allowedLocales": [
                    "en",
                    "en-US",
                    "es",
                    "fr",
                    "de",
                    "pt",
                    "zh",
                    "ja",
                    "ko"
                ],
                "allowedCurrencies": [
                    "USD",
                    "EUR",
                    "GBP",
                    "AUD",
                    "NZD",
                    "CAD",
                    "CHF",
                    "CNY",
                    "JPY",
                    "KRW"
                ],
                "id": "REAL_MADRID",
                "name": "REAL_MADRID Tenant",
                "identifierType": "DOMAIN",
                "identifierValue": "uat-real-madrid-admin.legendscommerce.io",
                "defaultLocale": "en-US",
                "defaultCurrency": "EUR",
                "orderPrefix": "RM"
            },
            "application": {
                "allowedLocales": [
                    "en-US",
                    "en",
                    "en-AU",
                    "en-GB",
                    "es",
                    "fr",
                    "ja",
                    "ko",
                    "pt",
                    "zh",
                    "de",
                    "es-MX"
                ],
                "allowedCurrencies": [
                    "USD",
                    "EUR",
                    "GBP",
                    "AUD",
                    "NZD",
                    "CAD",
                    "CHF",
                    "CNY",
                    "JPY",
                    "KRW"
                ],
                "portraitAsset": {
                    "tags": [],
                    "tenantId": "REAL_MADRID",
                    "type": "IMAGE",
                    "provider": "BROADLEAF",
                    "url": "/rm_logo_core.png",
                    "contentUrl": "https://uat.legends.blcdemo.com/api/asset/content/rm_logo_core.png?contextRequest=%7B%22forceCatalogForFetch%22:false,%22forceFilterByCatalogIncludeInheritance%22:false,%22forceFilterByCatalogExcludeInheritance%22:false,%22tenantId%22:%22REAL_MADRID%22%7D"
                },
                "isolatedCatalogs": [
                    {
                        "parents": [],
                        "id": "01H4RD9NXMKQBQ1WVKM1181VD8_SG_MAIN",
                        "implicit": "01H4RD9NXMKQBQ1WVKM1181VD8_SG_IMPL",
                        "name": "Real Madrid Search Group",
                        "mutabilityType": "CUSTOMIZABLE",
                        "visibleAsAssigned": true,
                        "excludeFromAdd": false,
                        "catalogStatus": "ONLINE",
                        "type": "SEARCH_GROUP"
                    },
                    {
                        "parents": [],
                        "id": "01HTNGGZ5K87AW0PYCMBBM0DDP",
                        "implicit": "01HTNGHZJ6YR0D0E4B2JWP1H2F",
                        "name": "ECOM Master",
                        "mutabilityType": "CUSTOMIZABLE",
                        "visibleAsAssigned": true,
                        "excludeFromAdd": false,
                        "catalogStatus": "ONLINE",
                        "type": "PRODUCT"
                    }
                ],
                "contextState": {
                    "fieldChanges": [],
                    "mutable": false,
                    "archived": false,
                    "level": null,
                    "catalog": null,
                    "sandbox": null,
                    "application": null,
                    "tenant": "REAL_MADRID",
                    "customerContextId": null,
                    "baseCatalogId": null,
                    "overrideCatalogId": null,
                    "sandboxChangeType": null,
                    "creationTime": "2023-07-07T14:50:02.780Z",
                    "updateTime": "2025-04-08T18:12:37.787504Z",
                    "creator": "master@test.com",
                    "updater": "nfierro@legends.net"
                },
                "embroideryLogos": [],
                "id": "01H4RD9NXMKQBQ1WVKM1181VD8",
                "name": "Real Madrid",
                "token": "real_madrid",
                "identifierType": "DOMAIN",
                "identifierValue": "real-madrid.uat.storefront.legendscommerce.io",
                "customerContextId": "01H4RD9NXMKQBQ1WVKM1181VD8",
                "deactivated": false,
                "defaultLocale": "en-US",
                "defaultCurrency": "EUR",
                "private": false,
                "marketplace": false
            },
            "catalog": {
                "assignedCatalogs": [
                    {
                        "parents": [],
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": false,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2024-04-04T21:34:04.055315Z",
                            "updateTime": null,
                            "creator": "achepey@credera.com",
                            "updater": null
                        },
                        "id": "01HTNGGZ5K87AW0PYCMBBM0DDP",
                        "name": "ECOM Master",
                        "hidden": false,
                        "locale": "en",
                        "defaultCurrency": "EUR",
                        "type": "PRODUCT",
                        "isRestricted": false
                    }
                ],
                "forceCatalogForFetch": false
            },
            "sandbox": {
                "userSandboxes": [
                    {
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": true,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2024-08-12T22:07:32.980735Z",
                            "updateTime": "2024-08-12T22:28:24.094838Z",
                            "creator": "csiles@legends.net",
                            "updater": "csiles@legends.net"
                        },
                        "id": "01J54A3Q2R2C7V02337EFP16Z4",
                        "name": "Default Sandbox",
                        "color": "#404040",
                        "description": "The default, general use sandbox.",
                        "application": "01H4RD9NXMKQBQ1WVKM1181VD8",
                        "tenant": "REAL_MADRID",
                        "temporarySandbox": false
                    },
                    {
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": true,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2024-08-13T20:06:38.510503Z",
                            "updateTime": null,
                            "creator": "csiles@legends.net",
                            "updater": null
                        },
                        "id": "01J56NK1NBGXNJ10JKC69W19TC",
                        "name": "Test Sandbox",
                        "color": "#2a00ff",
                        "application": "01H4RD9NXMKQBQ1WVKM1181VD8",
                        "tenant": "REAL_MADRID",
                        "temporarySandbox": false
                    },
                    {
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": true,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2024-09-17T11:43:52.993809Z",
                            "updateTime": "2024-09-17T11:43:56.281672Z",
                            "creator": "UNKNOWN",
                            "updater": "fsalgadom@legends.net"
                        },
                        "id": "01J7ZWQKXDPQGG06VP0K121931",
                        "name": "Bulk Operation - Update Active - 9/17/2024, 1:43:43 PM",
                        "color": "#249f07",
                        "description": "Sandbox for BulkOperation - Update Active - 9/17/2024, 1:43:43 PM",
                        "application": "01H4RD9NXMKQBQ1WVKM1181VD8",
                        "tenant": "REAL_MADRID",
                        "temporarySandbox": true
                    },
                    {
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": true,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2025-02-04T17:12:51.433163Z",
                            "updateTime": null,
                            "creator": "UNKNOWN",
                            "updater": null
                        },
                        "id": "01JK8Z6KDHKYAC136H7N6X19BF",
                        "name": "Bulk Operation - Update Searchable - 2/4/2025, 11:12:41 AM",
                        "color": "#44d82e",
                        "description": "Sandbox for BulkOperation - Update Searchable - 2/4/2025, 11:12:41 AM",
                        "application": "01H4RD9NXMKQBQ1WVKM1181VD8",
                        "tenant": "REAL_MADRID",
                        "temporarySandbox": false
                    },
                    {
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": true,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2025-02-05T14:09:40.867290Z",
                            "updateTime": "2025-02-05T14:09:50.013319Z",
                            "creator": "UNKNOWN",
                            "updater": "jfleschler@broadleafcommerce.com"
                        },
                        "id": "01JKB73XAPDKMC0N5KYQE01T2Z",
                        "name": "Bulk Operation - Update Active - 2/5/2025, 8:09:32 AM",
                        "color": "#eece68",
                        "description": "Sandbox for BulkOperation - Update Active - 2/5/2025, 8:09:32 AM",
                        "application": "01H4RD9NXMKQBQ1WVKM1181VD8",
                        "tenant": "REAL_MADRID",
                        "temporarySandbox": true
                    },
                    {
                        "contextState": {
                            "fieldChanges": [],
                            "mutable": true,
                            "archived": false,
                            "level": null,
                            "catalog": null,
                            "sandbox": null,
                            "application": null,
                            "tenant": "REAL_MADRID",
                            "customerContextId": null,
                            "baseCatalogId": null,
                            "overrideCatalogId": null,
                            "sandboxChangeType": null,
                            "creationTime": "2025-03-17T16:34:46.739704Z",
                            "updateTime": null,
                            "creator": "UNKNOWN",
                            "updater": null
                        },
                        "id": "01JPJFABNH04J91P22D85708Z5",
                        "name": "Mens Home Authentic Shirt 24/25 White (Indy)",
                        "color": "#404040",
                        "description": "Import with ID 01JPJFABHBG0NJ07H9AV7X0371",
                        "application": "01H4RD9NXMKQBQ1WVKM1181VD8",
                        "tenant": "REAL_MADRID",
                        "temporarySandbox": false
                    }
                ],
                "currentSandboxId": "01J54A3Q2R2C7V02337EFP16Z4"
            },
            "tenantId": "REAL_MADRID",
            "applicationId": "01H4RD9NXMKQBQ1WVKM1181VD8",
            "customerContextId": "01H4RD9NXMKQBQ1WVKM1181VD8"
        },
        "defaultPrice": {
            "amount": 60
        },
        "discountable": true,
        "online": true,
        "activeStartDate": "2028-01-14T18:30:00.000Z",
        "productType": "STANDARD",
        "inventoryType": "PHYSICAL",
        "inventoryCheckStrategy": "NEVER",
        "inventoryReservationStrategy": "NEVER",
        "individuallySold": true,
        "name": "New Jersey A2",
        "uri": "/new-jersey-a-2",
        "sku": "A2"
    }
}