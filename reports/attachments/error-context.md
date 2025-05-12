# Test info

- Name: Real Madrid Desktop UI Navigation >> should navigate to the storefront portal
- Location: C:\Users\AbhinavSharma\Realmadrid\specs\RealMadrid\DesktopUI\RegressionTest\navigation.spec.ts:6:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Continue', exact: true })

    at CommonUtils.loginToStorefront (C:\Users\AbhinavSharma\Realmadrid\src\utils\loginUtils\realMadrid\commonUtils.ts:96:48)
    at C:\Users\AbhinavSharma\Realmadrid\specs\RealMadrid\DesktopUI\RegressionTest\navigation.spec.ts:10:5
```

# Page snapshot

```yaml
- banner:
  - img "Real Madrid C.F.":
    - img
    - img
  - button "ES"
  - button "EN"
- banner:
  - heading "¡Hola!" [level=1]
  - paragraph: "Inicia sesión o regístrate para acceder:"
- textbox "Email / Nº Socio / Nº Madridista": abhinav.sharma@veersatech.com
- text: Email / Nº Socio / Nº Madridista
- button "Reset" [disabled]
- button "Continuar"
- button "¿No puedes acceder?"
- text: o
- button "Continuar con Google"
- button "Continuar con Apple ID"
- paragraph:
  - text: Trataremos tu email para comprobar si ya estás registrado o no. Puedes ejercer tus derechos en
  - link "oposicion@corp.realmadrid.com":
    - /url: mailto:oposicion@corp.realmadrid.com
  - text: y obtener más información
  - link "aquí.":
    - /url: ""
- contentinfo:
  - paragraph: Real Madrid © 2022. Todos los derechos reservados.
  - button "Aviso legal"
  - button "Política de cookies"
  - button "Política de Privacidad"
  - button "realmadrid.com"
- region "Cookie banner":
  - dialog "Uso de cookies":
    - img "Logotipo de la empresa"
    - heading "Uso de cookies" [level=2]
    - paragraph:
      - text: Real Madrid usa cookies propias y de terceros para garantizar la funcionalidad de la web (cookies necesarias y de funcionalidad), para fines analíticos (cookies de rendimiento o analíticas) y para mostrarle publicidad relacionada con sus preferencias a partir de sus hábitos de navegación y creación de un perfil (cookies dirigidas o de publicidad) tanto por parte del Club como de nuestros
      - link "partners y patrocinadores":
        - /url: https://www.realmadrid.com/es-ES/el-club/patrocinadores
      - text: . Puede aceptar todas las cookies, seleccionar aquellas que desee en “Configurar” o rechazarlas todas.
    - link "Más sobre las cookies, se abre en una nueva pestaña":
      - /url: https://www.realmadrid.com/es-ES/legal/politica-de-cookies
      - text: Más sobre las cookies
    - button "Configurar"
    - button "Rechazar"
    - button "Aceptar todas"
```

# Test source

```ts
   1 | import { Locator, Page } from '@playwright/test';
   2 |
   3 | export class CommonUtils {
   4 |   private page: Page;
   5 |   private adminUrl: string;
   6 |   private storefrontUrl: string;
   7 |   readonly adminUsername: Locator;
   8 |   readonly adminPassword: Locator;
   9 |   readonly adminSignIn: Locator;
   10 |   readonly storefrontLoginIcon: Locator;
   11 |   readonly storefrontUsername: Locator;
   12 |   readonly storefrontLoginContinueButton: Locator;
   13 |   readonly storefrontPassword: Locator;
   14 |   readonly storefrontSignIn: Locator;
   15 |
   16 |   constructor(page: Page) {
   17 |     this.page = page;
   18 |     this.adminUrl = process.env.RM_ADMIN_URL!;
   19 |     this.storefrontUrl = process.env.RM_STOREFRONT_URL!;
   20 |     this.adminUsername = page.getByRole('textbox', { name: 'Username' });
   21 |     this.adminPassword = page.getByRole('textbox', { name: 'Password' });
   22 |     this.adminSignIn = page.getByRole('button', { name: 'Sign In' });
   23 |     this.storefrontLoginIcon = page.getByTestId('loginbutton');
   24 |     this.storefrontUsername = page.getByRole('textbox', { name: 'Email' });
   25 |     this.storefrontPassword = page.getByRole('textbox', { name: 'Password' });
   26 |     this.storefrontLoginContinueButton = page.getByRole('button', { name: 'Continue', exact: true })
   27 |   }
   28 |
   29 |   /**
   30 |    * Navigates to the specified portal URL.
   31 |    * @param portalType - 'admin' or 'storefront'
   32 |    */
   33 |   async goToPortal(portalType: 'admin' | 'storefront'): Promise<void> {
   34 |     let urlToNavigate: string;
   35 |     if (portalType === 'admin') {
   36 |       urlToNavigate = this.adminUrl;
   37 |     } else if (portalType === 'storefront') {
   38 |       urlToNavigate = this.storefrontUrl;
   39 |     } else {
   40 |       throw new Error(`Invalid portal type: ${portalType}`);
   41 |     }
   42 |
   43 |     console.log(`Navigating to ${urlToNavigate}`);
   44 |     await this.page.goto(urlToNavigate);
   45 |     await this.page.waitForLoadState('load');
   46 |     await this.page.waitForSelector('text=Loading', { state: 'hidden' });
   47 |
   48 |   }
   49 |   /**
   50 |    * Performs login based on the portal type.
   51 |    * @param portalType - 'admin' or 'storefront'
   52 |    * @param username - The username for login
   53 |    * @param password - The password for login
   54 |    */
   55 |   async loginToAdmin() {
   56 |     const username = process.env.RM_ADMIN_USERNAME;
   57 |     const password = process.env.RM_ADMIN_PASSWORD;
   58 |     if (!username || !password) {
   59 |       throw new Error('Username and password must be provided for admin login.');
   60 |     }
   61 |
   62 |     await this.adminUsername.fill(username);
   63 |     await this.adminPassword.fill(password);
   64 |     await this.adminSignIn.click();
   65 |     await this.page.waitForLoadState('load');
   66 |     await this.page.waitForSelector('text=Loading', { state: 'hidden' });
   67 |     console.log('Successfully logged in to admin portal.');
   68 |     }
   69 |
   70 |     /**
   71 |      * Performs login to the storefront portal.
   72 |      */
   73 |     async loginToStorefront(): Promise<void> {
   74 |       const username = process.env.RM_STOREFRONT_USERNAME;
   75 |       const password = process.env.RM_STOREFRONT_PASSWORD;
   76 |       if (!username || !password) {
   77 |         throw new Error('Username and password must be provided for storefront login.');
   78 |       }
   79 |       await this.storefrontLoginIcon.click();
   80 |       await this.page.waitForLoadState('load');
   81 |       // Function to handle the cookie banner if it appears
   82 |       const handleCookieBanner = async () => {
   83 |         const cookieBanner = this.page.locator('role=region[name="Cookie banner"]');
   84 |         if (await cookieBanner.isVisible()) {
   85 |           const rejectAllButton = this.page.getByRole('button', { name: 'Reject all' });
   86 |           await rejectAllButton.click();
   87 |         }
   88 |       };
   89 |
   90 |       // Check for the cookie banner initially
   91 |       await handleCookieBanner();
   92 |
   93 |       await this.storefrontUsername.fill(username);
   94 |       // Check for the cookie banner again after filling the username
   95 |       await handleCookieBanner();
>  96 |       await this.storefrontLoginContinueButton.click();
      |                                                ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
   97 |       await this.storefrontPassword.fill(password);
   98 |       await handleCookieBanner();
   99 |
  100 |       await this.storefrontSignIn.click();
  101 |       // Check for the cookie banner again after clicking sign in
  102 |       await handleCookieBanner();
  103 |
  104 |       await this.page.waitForLoadState('load');
  105 |       await this.page.waitForSelector('text=Loading', { state: 'hidden' });
  106 |       console.log('Successfully logged in to storefront portal.');
  107 |     }
  108 |
  109 |   // Add more common utility functions.
  110 | }
  111 |
```