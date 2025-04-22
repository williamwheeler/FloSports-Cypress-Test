export class PageObjectModel {
        /* cy.visit was initally failing on pageLoad timeout 
        after debuging decided to force the load to stop and visit to proceed after 12 seconds. 
        See ReadMe for details */
    visit() {
      cy.visit('https://www.flowrestling.org/events/12932757-2025-eiwa-championship', {
        onBeforeLoad(win) {
          setTimeout(() => {
            if (win.document.readyState !== 'complete') {
              win.stop();
            }
          }, 12000);
        },
      });
      cy.get('[data-test="header-title-desktop"]', { timeout: 20000 }).should('exist');
    }
  
    // Method to get the Page Title
    getPageTitle() {
      return cy.title();
    }
  
    //Method to get the title for the banner, only one with a 
    //test id header title doesn;t make it clear if its banner title or something else
    getEventTitle() {
      return cy.get('[data-test="header-title-desktop"]');
    }
  
    //Getter method for the date, also desn't have a testid, 
    //not robust if the date changes from march
    getEventDate() {
        return cy.contains('span', /Mar \d{1,2}-\d{1,2}/);
    }   

    //Get the first video thumbnail title to compare in the test
    getFirstVideoTitle() {
      cy.get('[data-test="thumbnail"]')
        .first()
        .invoke('attr', 'alt')
        .then((altText) => {
          this.videoTitle = altText.trim();
        });
    }
    //Method to click the navigation tabs
    clickTab(tabName) {
      cy.get('[data-test="flo-link"]')
        .contains(tabName)
        .click()

    }
    //Page Interaction methods
    clickClearAllFilters() {
      cy.get('[data-test="event-clear-all-filters-bff"]')
        .should('be.visible')
        .click();
    }
    
    //Click the first video thumbnail
    clickFirstVideoThumbnail() {
      cy.get('[data-test="thumbnail"]').first().click();
    }

    // Click the filter dropdown button based on ID
    selectDropDownId(filterId, optionText) {
      cy.get(`#${filterId}`)
        .should('be.visible')
        .click();
        //Select the option by visible text
      cy.contains('span.dropdown-title', optionText, { timeout: 10000 })
        .should('be.visible')
        .click();
    }
    
    searchWrestler(name) {
      cy.get('[data-test="search-input"]')
        .should('be.visible')
        .clear()
        .type(name);
      }

    // Assertion methods
    assertPageTitleIncludes(expectedText) {
      this.getPageTitle().should('include', expectedText);
    }
  
    assertEventBannerIsVisible() {
      this.getEventTitle().should('be.visible');
    }
  
    assertEventDateVisible() {
      this.getEventDate()
        .should('exist')
        .and('be.visible')
    }

    assertTabUrlIncludes(pathSegment) {
      cy.url().should('include', pathSegment);
    }
      
    assertTabContentIncludes(textRegex) {
      cy.contains(textRegex).should('exist');
    }

    assertVideoThumbnailsVisible() {
      cy.get('[data-test="small-content-thumbnail"]')
        .should('exist')
        .and('be.visible');
    }

    //Iterates through the DOM tree for the each result-card check to ensure that the searched
    //team is included somewhere in the card
    assertResultsIncludeTeam(teamName) {
      const normalizedTeam = teamName.trim().toLowerCase();
    
      cy.get('.w-result-card').should('have.length.greaterThan', 0).each(($card) => {
        cy.wrap($card)
          .find('.w-competitor-detail__team .caption.text-truncate')
          .then(($teams) => {
            const texts = [...$teams].map(el => el.textContent.trim().toLowerCase());
            const match = texts.some(t => t.includes(normalizedTeam));
            expect(match, `Card should include team "${teamName}"`).to.be.true;
          });
      });
    }
    
    
    //The same as asserResultsInludeTeam but for the Weight Class filter
    assertAllResultsIncludeWeightClass(weightClass) {
      cy.get('.w-result-card').each(($card) => {
        cy.wrap($card)
          .find('span.color-500') // The specific span that shows weight class
          .should('exist')
          .invoke('text')
          .then((text) => {
            expect(text.trim().toLowerCase()).to.include(weightClass.toLowerCase());
          });
      });
    }
    //Ensures only the selecteed Round filter is displayed
    assertOnlySelectedRoundVisible(roundName) {
      cy.get('h2.h5.mb-0').each(($el) => {
        cy.wrap($el)
          .invoke('text')
          .should('eq', roundName);
      });
    }
    //Ensures Clear All cleared the results by confirm at least one card 
    //doesn't have the team filter
    assertResultsIncludeNonMatchingTeam(teamName) {
      cy.get('.w-result-card .w-competitor-detail__team .caption.text-truncate')
        .should('have.length.greaterThan', 0)
        .then(($teams) => {
          const foundNonMatching = [...$teams].some(el =>
            !el.innerText.toLowerCase().includes(teamName.toLowerCase())
          );
          expect(
            foundNonMatching,
            `Expected at least one result to not include "${teamName}"`
          ).to.be.true;
        });
    }
    
    assertRoundResultsInclude(resultName) {
      cy.contains(resultName, { matchCase: false}).should('exist');
    }
      
    assertUrlIncludes(resultName) {
      const encodedName = encodeURIComponent(resultName);
      cy.url().should('include', encodedName);
    }
      
    assertNoFacetsInUrl() {
      cy.url().should('include', 'facets=%7B%7D');
    }

    //Assert that will loop through the search results container 
    //and ensure only result machting the wrestler search are displayed
    assertOnlyResultsMatching(searchTerm) {
      const term = searchTerm.toLowerCase();
      cy.get('.w-result-card').should('have.length.greaterThan', 0).each(($card) => {
        cy.wrap($card)
          .find('[data-test="athleteInfoDesktop"] h2') // only select h2 name elements
          .then(($names) => {
            const matches = [...$names].some((el) =>
              el.textContent.trim().toLowerCase().includes(term)
            );
            expect(matches, `Expected at least one name in card to include "${searchTerm}"`).to.be.true;
          });
      });
    }
    
    assertNoSearchResults(searchTerm) {
      cy.contains("We couldn't find any results for").should('be.visible');
      cy.get('[data-test="no-results-text"]')
        .should('be.visible')
        .and('contain', searchTerm);
      cy.contains("Check your spelling, try different keywords, or adjust your filters.").should('be.visible');
      
    }

    //Methods to assert the video title matches its previous page, the url includes "playing"
    //and the video is not paused
    assertVideoTitleMatch() {
      cy.get('h2.headline')
        .should('be.visible')
        .invoke('text')
        .then((playerTitle) => {
          expect(playerTitle.trim()).to.eq(this.videoTitle);
        });

    }
    assertVideoIsPlaying() {
      const MIN_PLAYTIME_SECONDS = 5;
      cy.get('[data-test="video-container"] video', { timeout: 60000 })
        .should('be.visible')
        .should(($video) => {
          expect($video[0].offsetParent).to.not.be.null;
        });
      cy.get('.video-current-time', { timeout: 60000 })
        .should(($time) => {
          const text = $time.text().trim();
          const parts = text.split(':').map(Number);
    
          let seconds = 0;
          if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
          } else if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
          }
    
          // Confirm that the main video (not the ad) is playing
          expect(seconds).to.be.greaterThan(MIN_PLAYTIME_SECONDS);
        });
    }
          
}
      
    
  
  

  