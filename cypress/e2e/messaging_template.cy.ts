describe('messaging template spec', () => {

  beforeEach(()=>{
    cy.visit('localhost:4200/messaging/testUser');
  });

  it('Should navigate to messaging page with valid username', () => {});

  it('Should notify when adding empty topic', ()=>{
    // Act
    cy.get('#add-topic-button').click()
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    
    // Assert
    .should('include', "Can't add an empty topic");
  });

});