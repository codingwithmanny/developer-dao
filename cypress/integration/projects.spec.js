/// <reference types="cypress" />

// Imports
// ========================================================

// Constants
// ========================================================
const LANGUAGES = {
  UNKNOWN: 'pr',
};

// Tests
// ========================================================
// [Negative]
/**
 *
 */
describe('Projects Page - Expected Negative Interactions', () => {
  /**
   *
   */
  it('Shows 404 for an unknown language', () => {
    // Setup
    cy.visit(`/${LANGUAGES.UNKNOWN}/projects`, { failOnStatusCode: false });

    // Init
    // - no actions to performdocument.querySelector("#__next > div > div > h1")
    cy.waitFor(200);

    // Post Expectations
    // - Status
    // n/a

    // - Location
    cy.location('pathname').should('eq', `/${LANGUAGES.UNKNOWN}/projects`);

    // - DOM
    // -- <h1 />
    cy.get('#__next').find('h1').should('have.text', '404');
    // -- <h2 />
    cy.get('#__next')
      .find('h2')
      .should('have.text', 'This page could not be found.');
  });
});

// [Positive]
/**
 *
 */
describe('Projects Page - Expected Positive Interactions', () => {
  /**
   *
   */
  it('Shows default English page', () => {
    // Setup
    cy.visit(`/projects`);

    // Init
    // - no actions to performdocument.querySelector("#__next > div > div > h1")

    // Post Expectations
    // - Status
    // n/a

    // - Location
    cy.location('pathname').should('eq', `/projects`);

    // - DOM
    // nav
    // -- <a />
    cy.get('#__next > div > nav > div > a')
      .find('span')
      .should('have.text', 'Developer DAO');
    // -- <a /> links
    cy.get('#__next > div > nav > div > div')
      .find('a:nth-child(1)')
      .should('have.text', 'Home');
    cy.get('#__next > div > nav > div > div')
      .find('a:nth-child(2)')
      .should('have.text', 'Mint your Token');
    cy.get('#__next > div > nav > div > div')
      .find('a:nth-child(3)')
      .should('have.text', 'Projects');
    cy.get('#__next > div > nav > div > div')
      .find('a:nth-child(4)')
      .should(
        'have.attr',
        'href',
        'https://github.com/Developer-DAO/developer-dao',
      );

    // main
    // -- <p /> - title
    cy.get('#__next > div > main > div')
      .find('> p:nth-child(1)')
      .should('have.text', 'Projects');
    // -- <p /> - subtitle
    cy.get('#__next > div > main > div')
      .find('> p:nth-child(2)')
      .should(
        'have.text',
        'A list of community projects created by the Developer DAO community.',
      );
    // -- ul > li > <a /> - project link
    const projectLink = cy
      .get('#__next > div > main > div > ul > li:nth-child(1)')
      .find('> a:nth-child(1)');
    projectLink.should('have.attr', 'href', 'https://ddao.ibby.dev/');
    projectLink.should('have.text', 'DDAO Token Search');
    // -- ul > li > <a /> - author link
    const projectLinkAuthor = cy
      .get('#__next > div > main > div > ul > li:nth-child(1)')
      .find('> a:nth-child(2)');
    projectLinkAuthor.should(
      'have.attr',
      'href',
      'https://github.com/Ibby-devv',
    );
    projectLinkAuthor.should('have.text', 'Brian Eter');

    // footer
    // -- <p />
    cy.get('#__next > div > footer > div')
      .find('> p')
      .should('have.text', 'Made by the Developer DAO community: '); // mind the extra space
    // -- ul > li > <a /> links
    cy.get('#__next > div > footer > div > ul')
      .find('> li:nth-child(1) > a')
      .should(
        'have.attr',
        'href',
        'https://opensea.io/collection/devs-for-revolution',
      );
    cy.get('#__next > div > footer > div > ul')
      .find('> li:nth-child(2) > a')
      .should(
        'have.attr',
        'href',
        'https://etherscan.io/address/0x25ed58c027921e14d86380ea2646e3a1b5c55a8b',
      );
    cy.get('#__next > div > footer > div > ul')
      .find('> li:nth-child(3) > a')
      .should('have.attr', 'href', 'https://twitter.com/developer_dao');
    cy.get('#__next > div > footer > div > ul')
      .find('> li:nth-child(4) > a')
      .should('have.attr', 'href', 'https://discord.gg/devdao');
    cy.get('#__next > div > footer > div > ul')
      .find('> li:nth-child(5) > a')
      .should('have.attr', 'href', 'https://github.com/Developer-DAO');
    cy.get('#__next > div > footer > div > ul')
      .find('> li:nth-child(6) > a')
      .should('have.attr', 'href', 'https://forum.developerdao.com/');
    // -- <p /> hosting
    cy.get('#__next > div > footer > div > div')
      .find('> p')
      .should('have.text', 'Hosting by:');
    // -- <a /> hosting link
    cy.get('#__next > div > footer > div > div')
      .find('> a')
      .should(
        'have.attr',
        'href',
        'https://vercel.com/?utm_source=developerdao&utm_campaign=oss',
      );
  });
});
