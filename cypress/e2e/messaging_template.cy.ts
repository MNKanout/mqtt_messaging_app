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

  it('Should notify when adding the same topic more than once', ()=>{
    // Arrange
    const topic: string = 'testCha1';
    // Act
    cy.get('#topic-input').type(topic);
    cy.get('#add-topic-button').click()
    cy.get('#topic-input').type(topic);
    cy.get('#add-topic-button').click()
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    
    // Assert
    .should('include', '"'+ topic +'"'+ ' is already added!');
  });

  it('Should notify when new topic is added', ()=>{
    // Arrange
    const topic: string = 'testCha1';
    // Act
    cy.get('#topic-input').type(topic);
    cy.get('#add-topic-button').click()
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    
    // Assert
    .should('include', 'Added "'+ topic + '" successfully');
  });

  it('Should notify when subscribing without selecting a topic', ()=>{

    // Act
    cy.get('#subscribe-button').click();

    // Assert
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    .should('include','Please select a topic!');
  });

  it('Should notify when subscribed to selected topic', ()=>{
    // Arrange
    const topic: string = 'testCha1';
    cy.get('#topic-input').type(topic);
    cy.get('#add-topic-button').click();

    // Act
    cy.get('mat-select').click();
    cy.get('mat-option').click();
    cy.get('#subscribe-button').click();

    // Assert
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    .should('include', 'Subscribed to "' + topic + '"');
  });

  it('Should notify when subscribing to an already subscribed to topic', ()=>{
    // Arrange
    const topic: string = 'testCha1';
    cy.get('#topic-input').type(topic);
    cy.get('#add-topic-button').click();

    // Act
    cy.get('mat-select').click();
    cy.get('mat-option').click();
    cy.get('#subscribe-button').click();
    cy.get('#subscribe-button').click();

    // Assert
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    .should('include', 'Already subscribed to "' + topic + '"');
  });

  it('Should notify when publishing an empty message', ()=>{
    // Act
    cy.get('#publish-button').click();

    // Assert
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    .should('include', 'Please enter a message!');
  });

  it('Should notify when publishing before subscribing to any topic', ()=>{

    // Act
    cy.get('#message-text').type('test_text')
    cy.get('#publish-button').click();

    // Assert
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    .should('include', 'Not subscribed to any topic yet!');
  });

  it('Should notify when publishing before subscribing to selected topic', ()=>{
    // Arrange
    const topic1: string = 'testCha1';
    cy.get('#topic-input').type(topic1);
    cy.get('#add-topic-button').click();
    cy.get('mat-select').click();
    cy.get('#mat-option-0').click();
    cy.get('#subscribe-button').click();

    const topic2: string = 'testCha2';
    cy.get('#topic-input').type(topic2);
    cy.get('#add-topic-button').click();
    cy.get('mat-select').click();
    cy.get('#mat-option-1').click();

    // Act
    cy.get('#message-text').type('test_text')
    cy.get('#publish-button').click();

    // Assert
    cy.get('simple-snack-bar')
    .find('.mat-mdc-snack-bar-label')
    .invoke('text')
    .should('include', 'Not subscribed to "' + topic2 + '" yet!');
  });
});