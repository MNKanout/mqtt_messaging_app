describe('Login template', () => {
  beforeEach(()=>{
    cy.visit('localhost:4200/login');
  });

  it('Should navigate to login page', () => {});

  it('Should navigate to messaging page when logging in with valid username', () => {
    // Arrange
    const user: string = 'testUser';

    // Act
    cy.get<HTMLInputElement>('input').type(user);
    cy.get<HTMLButtonElement>('button').click();

    // Assert
    cy.location('pathname').should('eq','/messaging/' + user);
  });
});