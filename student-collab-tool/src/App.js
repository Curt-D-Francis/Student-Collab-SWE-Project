import React from 'react';
import MessageComponent from './components/MessageComponent';

function App() {
  return (
    <div className="App">
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        padding: '20px' 
      }}>
        <MessageComponent 
          projectId="test-project-1" 
          currentUser="JohnDoe" 
        />
      </div>
    </div>
  );
}

export default App;