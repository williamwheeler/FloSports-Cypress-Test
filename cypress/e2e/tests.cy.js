import { PageObjectModel } from '../support/PageObjectModel';
const mainPage = new PageObjectModel();
describe('Basic Page Load and UI Checks', () => {
  it('Verify the page loads correctly', () => {
    mainPage.visit();
    mainPage.assertPageTitleIncludes('2025 EIWA Championship');
    mainPage.assertEventBannerIsVisible();
    mainPage.assertEventDateVisible();
  });
});

describe('Navigation & Tab Validation', () => {
  it('Verify key navigation links', () => {
    mainPage.visit();
    //Click the News tab and  verify the new url and content update
    mainPage.clickTab('News');
    mainPage.assertTabUrlIncludes('/news');
    mainPage.assertTabContentIncludes(/news|article|headline/i);
    //Click the Results tab and  verify the new url and content update
    mainPage.clickTab('Results');
    mainPage.assertTabUrlIncludes('/results');
    mainPage.assertTabContentIncludes(/matches|results/i)
    //Click Videos and verify the new url and content update
    mainPage.clickTab('Videos');
    mainPage.assertTabUrlIncludes('/videos');
    mainPage.assertVideoThumbnailsVisible();
  });
});

  describe('Testing Search filters', () => {
    it('Test the Team search filter', () => {
    mainPage.visit();
    mainPage.selectDropDownId('filter-teamName', 'Army West Point');
    mainPage.assertUrlIncludes('Army West Point');
    mainPage.assertResultsIncludeTeam('Army West Point');
  });
    
    it('Test the Weight Class Search Filter', () => {
    mainPage.visit();
    mainPage.selectDropDownId('filter-weightClassName', '125');
    mainPage.assertUrlIncludes('125');
    mainPage.assertAllResultsIncludeWeightClass('125');
  });

    it('Test the Round Search Filter', () => {
    mainPage.visit();
    mainPage.selectDropDownId('filter-roundName', 'Quarter-Finals');
    mainPage.assertUrlIncludes('Quarter-Finals');
    mainPage.assertOnlySelectedRoundVisible('Quarter-Finals');
  });
    
    it('Test the Clear All button clears all filters', () => {
    mainPage.visit()
    mainPage.selectDropDownId('filter-teamName', 'Army West Point');
    mainPage.selectDropDownId('filter-weightClassName', '125');
    mainPage.clickClearAllFilters();
    mainPage.assertNoFacetsInUrl();
    mainPage.assertResultsIncludeNonMatchingTeam('Army West Point');
  });
});
  
describe('Search Functionality', () => {
  it('Test Search Input', () => {
    mainPage.visit();
    mainPage.searchWrestler('Sheldon Seymour');
    cy.wait(2000);
    mainPage.assertOnlyResultsMatching('Sheldon Seymour');
  });

  it('Test No Results Behavior', () => {
    mainPage.visit();
    mainPage.searchWrestler('Random Wrestler');
    mainPage.assertNoSearchResults('Random Wrestler');
  })
});

describe('Test Video Streaming', () => {
  it('Ensures the video loads correctly and details match', () => {
    mainPage.visit();
    mainPage.clickTab('Videos');
    mainPage.getFirstVideoTitle();
    mainPage.clickFirstVideoThumbnail();
    mainPage.assertTabUrlIncludes('?playing')
    mainPage.assertVideoTitleMatch();
    mainPage.assertVideoIsPlaying();
  })
});
