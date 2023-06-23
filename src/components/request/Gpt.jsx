import React, { useState } from 'react';
import { TextField } from '@mui/material';

const Gpt = () => {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState();

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = async e => {
    e.preventDefault();

    try {
    } catch (error) {}
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    const answer = data.answer; // Assuming the API response contains the answer

    setResult(answer);
  };
  return (
    <div>
      <h2
        style={{
          textAlign: 'center',
          backgroundColor: 'dodgerblue',
          color: 'white',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        Gpt form
      </h2>
      <div
        style={{
          backgroundColor: 'lightcyan',
          padding: '15px',
          height: '150px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              id='question'
              label='Enter your question'
              variant='outlined'
              value={question}
              onChange={e => setQuestion(e.target.value)}
              rows={2}
              cols={50}
              fullWidth={true}
              multiline={true}
              readOnly={true}
            />
          </div>
          <button
            type='submit'
            style={{
              width: '400px',
              backgroundColor: 'lightblue',
              margin: '10px',
              cursor: 'pointer',
              padding: '10px',
              fontSize: '18px',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            Ask
          </button>
        </form>
      </div>
      <div
        style={{
          backgroundColor: 'lightcyan',
          padding: '15px',
          marginTop: '15px',
          height: '500px',
        }}
      >
        <h4>Response</h4>
        <textarea
          id='answer'
          value={result}
          readOnly
          rows={3}
          cols={50}
          style={{
            width: '100%',
            height: '80%',
            backgroundColor: 'Background',
            resize: 'none',
            overflowY: 'scroll',
          }}
        >
          {result}
        </textarea>
      </div>
    </div>
  );
};

export default Gpt;
