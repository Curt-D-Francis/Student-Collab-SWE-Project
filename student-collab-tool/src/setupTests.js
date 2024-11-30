// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MessageComponent from './MessageComponent';

describe('MessageComponent', () => {
  it('renders without crashing', () => {
    render(<MessageComponent projectId="test" currentUser="TestUser" />);
  });

  it('allows sending a message', () => {
    
    const textarea = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button');

    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
});