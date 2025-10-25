
<h1 align="center">
Play me right 🎭</h1>

<p align="center"><img src="https://mambosinfinitos.pt/pir3.png" alt="Play me right" height="300px"></p>

<p align="center">The repo that exists solely to click buttons so I don’t have to.</p>

<br>&nbsp;
## ℹ️ About This

This is a personal project I’m developing to **sharpen my Playwright skills**.  
The main focus here is **architecture, project structure, and building reusable helpers/components** - the actual tests themselves are minimal.  

So far, the project contains:  
- **Helper utilities** for common assertions and actions  
- **“Component” files** that provide helpers for reusable UI elements (e.g., Angular form fields)  
- **Page objects**, which are lighter and have fewer functions than the components  
- **Fixtures** like demo `.MILO` files and locales used for assertions  
- **An API helper** for interacting with endpoints during test runs (e.g., creating a new user, simulating an expired trial, etc.) - the endpoints are provided by LEGGERA2’s backend and exposed in the development pipeline

I often get excited and keep **refactoring and improving the helpers** around the tests, so even with a few `.spec.ts` files, there’s already a solid foundation for scalable, maintainable automation code.

All feedback, suggestions, or constructive criticism is **very much welcome** - so if you spot something that could be improved, don’t hesitate to reach out!  <br>&nbsp;

 
⚠️ **Heads up:** this is a work-in-progress project. Some “mistakes,” warcrimes, or shortcuts might be lurking in the code - it’s mostly for learning and experimentation, not production use.

<br>&nbsp;
## 🚀 What This Does

This project runs automated end-to-end tests over **LEGGERA2**<sup>1</sup> to make sure it behaves the way it’s supposed to.  
If it doesn’t, Playwright will gleefully take a screenshot of my failures and store them forever.

<sub>1 - LEGGERA2 is another pet project of mine: an Angular-based HTML live editor.

<br>&nbsp;
## 🛠️ How to Install / Use

Honestly… there’s not much point in actually using this app unless you want to test **LEGGERA2**.  
If that’s the case, well… understandable - have a good day 😎  

Anyway, you’re totally free to **download the repo and get inspired** - peek at the code, and see what I’ve built! 


```bash
git clone https://github.com/mixagem/play-it-right.git
```


Installing dependencies: 
```bash
npm i
```

The default test suite runing on Firefox:
```bash
npx playwright test --project=firefox
```

If you want to go HAM, run the test suite on all browsers - and watch it happen live, with the actual browser windows popping up:
```bash
npx playwright test --headed
```

<br>&nbsp;
## 🧰 Tech Stack

- **Playwright** – for testing web apps like a speedrunner on caffeine  
- **Node.js** – JavaScript belongs in the backend  
- **TypeScript** – I like my pain statically typed


<br>&nbsp;
## 📁 Folder Vibes

```
Playwright/
  ├─ components
  ├─ fixtures
  ├─ helpers
  ├─ pages
  ├─ tests
  ├─ types
  └─ reports
         └─ flaky_test_screenshot_goes_here.png
```


<br>&nbsp;
## 💡 Skills / Features Covered

- **Locators** – CSS, text, XPath, Role selectors, chaining, and advanced targeting  
- **Page Object Model (POM)** – organizing tests for scalability and readability  
- **Fixtures** – test setup, teardown, context injection  
- **Browser Contexts** – isolating tests, cookies, storage, multiple sessions  
- **Parallel & Serial Test Execution** – speed and reliability  
- **Dynamic Content Handling** – waiting for elements, network idle, animations  
- **Assertions** – rich built-in assertions, soft asserts, and conditional checks  
- **Screenshots & Videos** – capturing test runs for debugging and reporting  
- **Tracing** – Playwright trace viewer integration for deep debugging  
- **Authentication Flows** – cookies, tokens, OAuth flows  
- **Network Interception & Mocking** – intercepting requests/responses for testing  
- **Keyboard / Mouse / Touch Actions** – complex user interactions  
- **File Upload / Download** – automating file handling  
- **CI/CD Integration** – Jenkins pipeline & reporting integration  
- **Language Testing** – Portuguese, English and Spanish covered


<br>&nbsp;
## 🛠️ To-Do / Work in Progress

- **Accessibility Testing** –  coming soon™

# 📡 Integration

This repo connects with **touch my PIPELINE**, the Jenkins-powered portal that visualizes your build progress, test reports, and general automation chaos.

Check it out 👉 [https://touchmypipeline.ddns.net](https://touchmypipeline.ddns.net)
