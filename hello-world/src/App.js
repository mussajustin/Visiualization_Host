// Importing necessary React hooks and components from React and recharts library
import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
// Importing CSS for styling the application
import './App.css';

// Main function component for the application
function App() {
  // State variables for storing chart data, current text, and new text input by the user
  const [chartData, setChartData] = useState([]);
  const [text, setText] = useState('');
  const [newText, setNewText] = useState('');

  // useEffect hook to fetch data from APIs on component mount
  useEffect(() => {
    // Fetching a text greeting from the server
    fetch('http://localhost:3001/hello')
      .then(response => {
        // Checking for successful response
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setText(data.text))
      .catch(err => console.error('Error fetching data:', err));

    // Fetching chart data from the server
    fetch('http://localhost:3001/chart-data')
      .then(response => response.json())
      .then(data => setChartData(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []); // Empty dependency array to run only once on mount

  // Function to handle form submission for updating text
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch('http://localhost:3001/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: newText })
    })
    .then(response => {
      // Checking for successful response
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message);
      setText(newText); // Updating displayed text with new text
      setNewText(''); // Clearing the input field
    })
    .catch(err => console.error('Error updating text:', err));
  };

  // Array of colors for chart elements
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#a4de6c'];

  // Rendering the application UI
  return (
    <div className="App">
      <header className="App-header">
        <h1>Data Visualization</h1>
        <p>{text}</p>
        <form onSubmit={handleUpdate}>
          <input 
            type="text" 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)} 
            placeholder="Update text"
          />
          <button type="submit">Update</button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          {chartData.length > 0 ? (
            <>
              <LineChart width={400} height={300} data={chartData}>
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>
              <BarChart width={400} height={300} data={chartData}>
                <Bar dataKey="value" fill="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
              </BarChart>
              <PieChart width={400} height={300}>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="60%"
                  cy="60%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </>
          ) : (
            <p>Loading data...</p>
          )}
        </div>
      </header>
    </div>
  );
}

// Exporting the App component for use in other parts of the application
export default App;
