describe('home template spec', () => {
  beforeEach(()=>{
    cy.visit('localhost:4200')
  })

  it('Should navigate to home page', () => {});

  it('Should navigate to login page when clicking get started',()=>{
    // Act
    cy.get('button').click();

    // Assert
    cy.location('pathname').should('eq','/login');
  });
})