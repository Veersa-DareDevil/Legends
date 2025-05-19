# Test info

- Name: 56825-Checkout Validation >> Should Validate Checkout Validations
- Location: C:\Users\AbhinavSharma\Legends\specs\realMadrid\desktopUI\checkoutValidation.spec.ts:16:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="checkoutbutton"]')
    - locator resolved to <button type="button" preset="primary" data-testid="checkoutbutton" class="align-middle select-none font-sans font-normal text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none justify-center cursor-pointer text-md py-3 px-6 rounded-[16px] shadow-md hover:shadow-lg focus:shadow-lg active:ring-4 active:opacity-[0.85] active:ring-gray-200/40 bg-gradient-to-t from-deep-purple-700 to-purple-700 text-white shadow-deep-purple-500/20 hover:to-deep-purple-700 hover:de…>…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button id="onetrust-accept-btn-handler">Aceptar todas las cookies</button> from <div id="onetrust-consent-sdk">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <button id="onetrust-accept-btn-handler">Aceptar todas las cookies</button> from <div id="onetrust-consent-sdk">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

    at Product.addToCart (C:\Users\AbhinavSharma\Legends\src\pageObject\realMadrid\desktopUI\product.ts:45:35)
    at C:\Users\AbhinavSharma\Legends\specs\realMadrid\desktopUI\checkoutValidation.spec.ts:21:5
```

# Page snapshot

```yaml
- banner:
  - navigation "top-0":
    - link "Sign up to become a Madridista and get 5% off your first purchase":
      - /url: /en-us/auth/login
      - text: Sign up to become a Madridista and get 5% off your first purchase
      - button
- banner:
  - navigation "Top":
    - link "New Real Madrid Logo":
      - /url: /en-us
      - img "New Real Madrid Logo"
    - combobox "Search"
    - button "Search button":
      - img
    - text: EN | USD
    - img
    - navigation:
      - list:
        - listitem "Link to profile":
          - button "KL"
        - listitem:
          - 'button "Cart items: 3"':
            - img
            - text: "3"
    - button "Kits":
      - paragraph: Kits
      - img
    - button "Shop By Player":
      - paragraph: Shop By Player
      - img
    - button "Training":
      - paragraph: Training
      - img
    - button "Fashion":
      - paragraph: Fashion
      - img
    - button "Accessories":
      - paragraph: Accessories
      - img
    - link "Rebajas":
      - /url: /en-us/content/summer-real-madrid
      - button "Rebajas":
        - paragraph: Rebajas
    - link "Regalos":
      - /url: /en-us/training/champions-league
      - button "Regalos":
        - paragraph: Regalos
    - link "Intercontinental Cup":
      - /url: /en-us/content/intercontinental-cup
      - button "Intercontinental Cup":
        - paragraph: Intercontinental Cup
    - button "Kits":
      - link "Kits":
        - /url: /en-us/content/gifting-area
      - img
    - button "Shop By Player":
      - link "Shop By Player":
        - /url: /en-us/content/players
      - img
    - button "Training":
      - link "Training":
        - /url: /en-us/training
      - img
    - button "Fashion":
      - link "Fashion":
        - /url: /en-us/fashion
      - img
    - button "Accessories":
      - link "Accessories":
        - /url: /en-us/gifts/accessories
      - img
    - button "Rebajas":
      - link "Rebajas":
        - /url: /en-us/content/summer-real-madrid
    - button "Regalos":
      - link "Regalos":
        - /url: /en-us/training/champions-league
    - button "Intercontinental Cup":
      - link "Intercontinental Cup":
        - /url: /en-us/content/intercontinental-cup
- main:
  - img "Product image"
  - img "Product image"
  - img "Product image"
  - img "Product image"
  - img "Product image"
  - button "See more"
  - navigation "breadcrumbs":
    - link "Home":
      - /url: /en-us
    - text: Mens Bring Back 99/00 Track Top
  - heading "Mens Bring Back 99/00 Track Top" [level=1]
  - text: "Your price $32.13 $37.80 Size:"
  - listbox:
    - option "Variant Swatch" [selected]: "116"
    - option "Variant Swatch": "128"
    - option "Variant Swatch": "140"
    - option "Variant Swatch": "152"
    - option "Variant Swatch": "164"
  - button "Add to Cart"
  - button "Product Description":
    - heading "Product Description" [level=2]
    - img
  - paragraph: Feel good. Look good. Train better. Rooted in football heritage, these juniors' Tiro 21 shorts grace the pitch with a focus on performance. Made to move, they feature moisture-absorbing AEROREADY to keep you dry and heat-transfer details. They also contain recycled materials, another small step in adidas' efforts to help end plastic waste.
  - paragraph: This product is made with Primegreen, a series of high-performance recycled materials.
  - separator
  - heading "You might be interested in" [level=2]
  - group "1 / 4":
    - link "Mens Bring Back 99/00 Track Pants-primary":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black
      - img "Mens Bring Back 99/00 Track Pants-primary"
    - link "XS":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=xs
    - link "S":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=s
    - link "M":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=m
    - link "L":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=l
    - link "XL":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=xl
    - link "2XL":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=2xl
    - link "3XL":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black?variant.size=3xl
    - link "Mens Bring Back 99/00 Track Pants Your price $72.25 $85.00":
      - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black
      - text: Mens Bring Back 99/00 Track Pants
      - paragraph
      - text: Your price $72.25 $85.00
  - group "2 / 4":
    - link "Mens Away Bring Back 99/00 Jersey Black-primary":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey
      - img "Mens Away Bring Back 99/00 Jersey Black-primary"
    - link "XS":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=xs
    - link "S":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=s
    - link "M":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=m
    - link "L":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=l
    - link "XL":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=xl
    - link "2XL":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=2xl
    - link "3XL":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey?variant.size=3xl
    - link "Mens Away Bring Back 99/00 Jersey Black Your price $93.50 $110.00":
      - /url: /en-us/product/rmcfms0174-real-madrid-mens-adidas-training-ttw-tracksuit-jacket-grey
      - text: Mens Away Bring Back 99/00 Jersey Black
      - paragraph
      - text: Your price $93.50 $110.00
  - group "3 / 4":
    - link "Mens adidas Tiro Vis Tech Competition Jacket Black-primary":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black
      - img "Mens adidas Tiro Vis Tech Competition Jacket Black-primary"
    - link "XS":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=xs
    - link "S":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=s
    - link "M":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=m
    - link "L":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=l
    - link "XL":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=xl
    - link "2XL":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=2xl
    - link "3XL":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black?variant.size=3xl
    - link "Mens adidas Tiro Vis Tech Competition Jacket Black Your price $97.75 $115.00":
      - /url: /en-us/product/rmcfms0411-mens-adidas-tiro-vis-tech-competition-jacket-black
      - text: Mens adidas Tiro Vis Tech Competition Jacket Black
      - paragraph
      - text: Your price $97.75 $115.00
  - group "4 / 4":
    - link "adidas Mens DNA Track Top 23/24 White-primary":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white
      - img "adidas Mens DNA Track Top 23/24 White-primary"
    - link "XS":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=xs
    - link "S":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=s
    - link "M":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=m
    - link "L":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=l
    - link "XL":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=xl
    - link "2XL":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=2xl
    - link "3XL":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white?variant.size=3xl
    - link "adidas Mens DNA Track Top 23/24 White Your price $80.75 $95.00":
      - /url: /en-us/product/rmcfms0213-adidas-mens-dna-track-top-23-24-white
      - text: adidas Mens DNA Track Top 23/24 White
      - paragraph
      - text: Your price $80.75 $95.00
- contentinfo:
  - heading "Shop" [level=4]
  - list:
    - listitem:
      - link "How To Order":
        - /url: /en-us/content/how-to-order
    - listitem:
      - link "Shipping & Returns":
        - /url: /en-us/content/returns-and-refunds
    - listitem:
      - link "Track My Order":
        - /url: /en-us/content/track-my-order
    - listitem:
      - link "My Account":
        - /url: https://signin.realmadrid.com/#/sign-in/user?language=es-ES&workflow=register-free&behalfClientId=58b32718-73e1-4278-9756-7a55ce0cec9c&utm_source=web&utm_medium=tienda-online&utm_campaign=all_login-madridistas-tienda_perm_es_global&redirectUrl=https:%2F%2Fclientsso-rmcf.legendsapis.com%2FLogin&bypassData=nonce%3Drmcf-es%26legendsCustomParam2%3D
    - listitem:
      - link "Shop Locator":
        - /url: https://www.realmadrid.com/en-US/the-club/stores
  - heading "About" [level=4]
  - list:
    - listitem:
      - link "PRIVACY POLICY":
        - /url: /en-us/content/privacy-policy
    - listitem:
      - link "COOKIE POLICY":
        - /url: /en-us/content/cookie-policy?forcePageRefresh=true
    - listitem:
      - link "TERMS & CONDITIONS":
        - /url: /en-us/content/terms-and-conditions
    - listitem:
      - button "COOKIE SETTINGS":
        - paragraph: COOKIE SETTINGS
  - heading "Do You Need Help?" [level=4]
  - list:
    - listitem:
      - link "CONTACT US":
        - /url: https://support.shop.realmadrid.com/en/support/solutions/articles/101000383446-contact-us
    - listitem:
      - link "FAQS":
        - /url: https://support.shop.realmadrid.com/en/support/home
  - paragraph: Download the app now
  - link "iOS App Logo iOS App Logo":
    - /url: https://apps.apple.com/gb/app/real-madrid-official/id1107624540
    - text: iOS App Logo
    - img "iOS App Logo"
  - link "Google Play App Logo Google Play App Logo":
    - /url: https://play.google.com/store/apps/details?id=com.mcentric.mcclient.MyMadrid&hl=en_US&gl=US
    - text: Google Play App Logo
    - img "Google Play App Logo"
  - link "Huaweii App Logo Huaweii App Logo":
    - /url: /en-us
    - text: Huaweii App Logo
    - img "Huaweii App Logo"
  - paragraph: Payments Accepted
  - text: amex
  - img "amex"
  - text: applePay
  - img "applePay"
  - text: dinersClub
  - img "dinersClub"
  - text: discover
  - img "discover"
  - text: googlePay
  - img "googlePay"
  - text: maestro
  - img "maestro"
  - text: mastercard
  - img "mastercard"
  - text: unionPay
  - img "unionPay"
  - text: visa
  - img "visa"
  - img "footer RMLogo"
  - link "X-Logo":
    - /url: https://twitter.com/realmadrid
  - link "facebook_logo":
    - /url: https://www.facebook.com/RealMadrid
  - link "instagram_logo":
    - /url: https://www.instagram.com/realmadrid
  - link "snapchat_icon":
    - /url: /en-us
  - link "tiktok_icon":
    - /url: /en-us
  - link "youtube_icon":
    - /url: /en-us
  - link "onefootball_icon":
    - /url: /en-us
  - link "twitch_icon":
    - /url: /en-us
  - link "Real Madrid CF Shop © 2024 All Rights Reserved":
    - /url: /en-us
- heading "Your bag | 3 items" [level=2]
- button "Close":
  - img
- link:
  - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black
- link "Mens Bring Back 99/00 Track Pants":
  - /url: /en-us/product/rmcfmp0133-real-madrid-mens-adidas-training-ttw-tracksuit-pant-black
- text: "Qty: 1 Size: XL"
- separator
- text: Your price $72.25 $85.00
- button:
  - img
- textbox [disabled]: "1"
- button:
  - img
- button "Remove Mens Bring Back 99/00 Track Pants":
  - paragraph: Remove
  - img
- link:
  - /url: /en-us/product/rmcfyo0031-youth-third-kit-23-24-black
- link "Youth Third Kit 23/24 Black":
  - /url: /en-us/product/rmcfyo0031-youth-third-kit-23-24-black
- text: "Qty: 1 Size: 128"
- separator
- text: Your price $119.00 $140.00
- button:
  - img
- textbox [disabled]: "1"
- button:
  - img
- button "Remove Youth Third Kit 23/24 Black":
  - paragraph: Remove
  - img
- link:
  - /url: /en-us/product/rmcfyp0038-real-madrid-youth-adidas-training-tts-shorts-black
- link "Mens Bring Back 99/00 Track Top":
  - /url: /en-us/product/rmcfyp0038-real-madrid-youth-adidas-training-tts-shorts-black
- text: "Qty: 1 Size: 116"
- separator
- text: Your price $32.13 $37.80
- button:
  - img
- textbox [disabled]: "1"
- button:
  - img
- button "Remove Mens Bring Back 99/00 Track Top":
  - paragraph: Remove
  - img
- paragraph: Best sellers
- group "1 / 12":
  - link "Mens T-Shirt Olive-primary":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive
    - img "Mens T-Shirt Olive-primary"
  - link "S":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive?variant.size=3xl
  - link "Mens T-Shirt Olive Your price $38.25 $45.00":
    - /url: /en-us/product/rmcfmt0151-real-madrid-mens-t-shirt-olive
    - text: Mens T-Shirt Olive
    - paragraph
    - text: Your price $38.25 $45.00
- group "2 / 12":
  - link "Mens T-Shirt Khaki-primary":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki
    - img "Mens T-Shirt Khaki-primary"
  - link "S":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki?variant.size=3xl
  - link "Mens T-Shirt Khaki Your price $38.25 $45.00":
    - /url: /en-us/product/rmcfmt0152-real-madrid-mens-t-shirt-khaki
    - text: Mens T-Shirt Khaki
    - paragraph
    - text: Your price $38.25 $45.00
- group "3 / 12":
  - link "Mens T-Shirt Mustard-primary":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard
    - img "Mens T-Shirt Mustard-primary"
  - link "S":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard?variant.size=3xl
  - link "Mens T-Shirt Mustard Your price $38.25 $45.00":
    - /url: /en-us/product/rmcfmt0256-mens-t-shirt-mustard
    - text: Mens T-Shirt Mustard
    - paragraph
    - text: Your price $38.25 $45.00
- group "4 / 12":
  - link "Mens Hoodie Khaki-primary":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki
    - img "Mens Hoodie Khaki-primary"
  - link "S":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki?variant.size=xl
  - text: 2XL
  - link "3XL":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki?variant.size=3xl
  - link "Mens Hoodie Khaki Your price $80.75 $95.00":
    - /url: /en-us/product/rmcfms0246-mens-hoodie-khaki
    - text: Mens Hoodie Khaki
    - paragraph
    - text: Your price $80.75 $95.00
- group "5 / 12":
  - link "Mens Jogger Black-primary":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black
    - img "Mens Jogger Black-primary"
  - link "S":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black?variant.size=2xl
  - text: 3XL
  - link "Mens Jogger Black Your price $63.75 $75.00":
    - /url: /en-us/product/rmcfmp0174-mens-jogger-black
    - text: Mens Jogger Black
    - paragraph
    - text: Your price $63.75 $75.00
- group "6 / 12":
  - link "Mens T-Shirt Off White-primary":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white
    - img "Mens T-Shirt Off White-primary"
  - link "S":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white?variant.size=3xl
  - link "Mens T-Shirt Off White Your price $38.25 $45.00":
    - /url: /en-us/product/rmcfmt0257-mens-t-shirt-off-white
    - text: Mens T-Shirt Off White
    - paragraph
    - text: Your price $38.25 $45.00
- group "7 / 12":
  - link "Mens T-Shirt Navy-primary":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy
    - img "Mens T-Shirt Navy-primary"
  - link "S":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy?variant.size=3xl
  - link "Mens T-Shirt Navy Your price $38.25 $45.00":
    - /url: /en-us/product/rmcfmt0259-mens-t-shirt-navy
    - text: Mens T-Shirt Navy
    - paragraph
    - text: Your price $38.25 $45.00
- group "8 / 12":
  - link "Mens Hoodie Black-primary":
    - /url: /en-us/product/rmcfms0250-mens-hoodie-black
    - img "Mens Hoodie Black-primary"
  - link "S":
    - /url: /en-us/product/rmcfms0250-mens-hoodie-black?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfms0250-mens-hoodie-black?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfms0250-mens-hoodie-black?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfms0250-mens-hoodie-black?variant.size=xl
  - text: 2XL 3XL
  - link "Mens Hoodie Black Your price $80.75 $95.00":
    - /url: /en-us/product/rmcfms0250-mens-hoodie-black
    - text: Mens Hoodie Black
    - paragraph
    - text: Your price $80.75 $95.00
- group "9 / 12":
  - link "Mens Hoodie Mustard-primary":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard
    - img "Mens Hoodie Mustard-primary"
  - link "S":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard?variant.size=3xl
  - link "Mens Hoodie Mustard Your price $80.75 $95.00":
    - /url: /en-us/product/rmcfms0248-mens-hoodie-mustard
    - text: Mens Hoodie Mustard
    - paragraph
    - text: Your price $80.75 $95.00
- group "10 / 12":
  - link "Mens Jogger Off White-primary":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white
    - img "Mens Jogger Off White-primary"
  - link "S":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white?variant.size=2xl
  - text: 3XL
  - link "Mens Jogger Off White Your price $63.75 $75.00":
    - /url: /en-us/product/rmcfmp0173-mens-jogger-off-white
    - text: Mens Jogger Off White
    - paragraph
    - text: Your price $63.75 $75.00
- group "11 / 12":
  - link "Mens Hoodie Olive-primary":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive
    - img "Mens Hoodie Olive-primary"
  - link "S":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive?variant.size=3xl
  - link "Mens Hoodie Olive Your price $80.75 $95.00":
    - /url: /en-us/product/rmcfms0247-mens-hoodie-olive
    - text: Mens Hoodie Olive
    - paragraph
    - text: Your price $80.75 $95.00
- group "12 / 12":
  - link "Mens Hoodie Navy-primary":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy
    - img "Mens Hoodie Navy-primary"
  - link "S":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy?variant.size=s
  - link "M":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy?variant.size=m
  - link "L":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy?variant.size=l
  - link "XL":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy?variant.size=xl
  - link "2XL":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy?variant.size=2xl
  - link "3XL":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy?variant.size=3xl
  - link "Mens Hoodie Navy Your price $80.75 $95.00":
    - /url: /en-us/product/rmcfms0251-mens-hoodie-navy
    - text: Mens Hoodie Navy
    - paragraph
    - text: Your price $80.75 $95.00
- list:
  - listitem:
    - paragraph: Subtotal
    - text: $262.80
  - listitem: Madridista Savings -$39.42
  - listitem:
    - paragraph: Taxes
    - paragraph: Calculated at next step
  - listitem:
    - paragraph: Shipping
    - paragraph: Calculated at next step
- paragraph: Total
- text: $223.38
- button "Continue Shopping"
- button "Checkout"
- region "Cookie banner":
  - alertdialog "Privacidad":
    - text: Al hacer clic en “Aceptar todas las cookies”, usted acepta que las cookies se guarden en su dispositivo para mejorar la navegación del sitio, analizar el uso del mismo, y colaborar con nuestros estudios para marketing.
    - button "Configuración de cookies"
    - button "Rechazarlas todas"
    - button "Aceptar todas las cookies"
- alert: Mens Bring Back 99/00 Track Top - Official Online Store for Real Madrid CF
```

# Test source

```ts
   1 | import { Page, Locator } from '@playwright/test';
   2 |
   3 | export class Product {
   4 |   readonly page;
   5 |   readonly productCard: Locator;
   6 |   readonly navTaining:Locator
   7 |   readonly productCardLink: Locator;
   8 |   readonly addToCartButton: Locator;
   9 |   readonly checkOutButton: Locator;
  10 |   readonly phoneNumberInput: Locator;
  11 |   readonly warningMessage: Locator;
  12 |   readonly shipAddress: Locator;
  13 |
  14 |   constructor(page: Page) {
  15 |     this.page = page;
  16 |     this.navTaining = page.getByTestId('navigation-bar').getByRole('link', { name: 'Training' })
  17 |     this.productCard = page.locator('[data-testid="productcard"]');
  18 |     this.productCardLink = page.locator('[data-testid="productcardlink"]');
  19 |     this.addToCartButton = page.locator('[data-testid="addtocartbutton"]');
  20 |     this.checkOutButton = page.locator('[data-testid="checkoutbutton"]');
  21 |     this.phoneNumberInput = page.locator('[name="phoneNumber"]');
  22 |     this.warningMessage = page.getByText('Please only use Western characters.');
  23 |     this.shipAddress = page.getByText('Shipping Address');
  24 |   }
  25 |
  26 |   async selectNavTraining(){
  27 |     await Promise.all([
  28 |       this.navTaining.click(),
  29 |       this.page.waitForSelector('#category-description', { state: 'visible' }),
  30 |     ]);
  31 |   }
  32 |   async selectProduct() {
  33 |     await this.productCard.first().hover();
  34 |     const productName = await this.productCard.first().locator('[class="grid content-end"]').textContent();
  35 |     console.log('Product Name:', productName);
  36 |     await this.productCardLink.first().click();
  37 |     await this.page.waitForTimeout(4000);
  38 |     return productName;
  39 |   }
  40 |
  41 |     async addToCart(productName: string) {
  42 |         await this.page.waitForSelector(`text=${productName}`, { state: 'visible' });
  43 |         await this.addToCartButton.click();
  44 |         await this.page.waitForTimeout(2000);
> 45 |         await this.checkOutButton.click();
     |                                   ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  46 |         await this.page.waitForTimeout(2000);
  47 |     }
  48 | }
  49 |
```