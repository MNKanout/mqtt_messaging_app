describe('Login template', () => {
  beforeEach(()=>{
    cy.visit('localhost:4200/login');
  });

  it('Should navigate to login page', () => {});

  it('Should notify when logging in with empty username', () => {

    // Act
    cy.get<HTMLButtonElement>('button').click();
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    
    // Assert
    .should('include','Please enter a username!');
  });

  it('Should notify when logging in with invalid username', () => {
    // Arrange
    const user: string = 'test_user';

    // Act
    cy.get<HTMLInputElement>('input').type(user);
    cy.get<HTMLButtonElement>('button').click();

    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    // Assert
    .should('include','Invalid Username')
  });

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