import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe scoreboard and board', () => {
  render(<App />);
  // Scoreboard contains X, O, Draws
  expect(screen.getByText(/X/)).toBeInTheDocument();
  expect(screen.getByText(/O/)).toBeInTheDocument();
  expect(screen.getByText(/Draws/)).toBeInTheDocument();
  // 3x3 board renders 9 buttons
  const cells = screen.getAllByRole('gridcell');
  expect(cells).toHaveLength(9);
});
