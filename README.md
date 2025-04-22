# Cypress Test Suite for FlowWrestling Events Page

## Prerequisites

Before installing Cypress, make sure your package manager is set up. This project uses **npm**.

### Install Node.js and npm

You can quickly get started by installing Node.js (which includes npm):  
- [Download Node.js](https://nodejs.org/en/download/)

Alternatively, you can use **nvm (Node Version Manager)** for a more flexible setup:  
- [nvm GitHub Repo](https://github.com/nvm-sh/nvm)

Follow the instructions on either page to complete setup.

### Install Cypress

Once you have Node.js and npm installed, install Cypress:  
- [Cypress Installation Guide](https://docs.cypress.io/app/get-started/install-cypress)

### Running the Tests

- Run in headless mode: `npm run test`  
- Run using the GUI: `npm run cy:open`

## Project Overview

This codebase follows the **Page Object Model (POM)** design pattern. POM treats each page as an object, where each page component (buttons, fields, content areas) is abstracted into methods and selectors. This makes the test suite more readable, maintainable, and reusable.

- Cypress test specs are located in `test.cy.js`
- Page Object Model definitions are located in `PageObjectModel.js`

## Known Issue: Page Load Timeout

There is a known issue where Cypress may not detect the `pageLoad` event or the event never fires, resulting in `cy.visit` timing out. Initial solutions involved mocking/blocking failed third-party requests, which proved flaky.

**Final solution implemented:**
- Extend wait time to 12 seconds
- Force `cy.visit` to proceed after 12 seconds even if the `pageLoad` event hasn't fired
- This avoids flakiness caused by unreliable third-party scripts and slow-loading network resources

This is a key item to flag for the web team as a potential area of improvement.

## Test Structure

The test scenarios are grouped using `describe` blocks and represent user-facing functionality broken down into logical groupings.

Each `it` block (test case) represents a complete, independent test simulating a user's journey from the start (navigating to the event page) and verifying UI elements or video playback as defined in the assignment sheet.
