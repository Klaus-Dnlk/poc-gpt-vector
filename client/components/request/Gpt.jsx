import React, { useState, useEffect } from 'react';
import { TextField, Typography, CircularProgress } from '@mui/material';
import { KeyboardReturn } from '@mui/icons-material';

import { chatServices } from '../../services/chat-services';

const Gpt = () => {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = event => {
    setError('');
    setUserInput(event.target.value);
  };

  const handlSendUserInput = async event => {
    event.persist();
    if (event.key !== 'Enter') {
      return;
    }

    try {
      setLoading(true);
      const { response } = await chatServices.chatWithLLM({ userInput });
      setAnswer(response);
    } catch (err) {
      setError(err);
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInput != null && userInput.trim() === '') {
      setAnswer('');
    }
  }, [userInput]);

  const clear = () => {
    setUserInput('');
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
        <form onSubmit={handlSendUserInput}>
          <div>
            <TextField
              id='question'
              label='Enter your question'
              variant='outlined'
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handlSendUserInput}
              rows={2}
              cols={50}
              fullWidth={true}
              multiline={true}
              readOnly={true}
              disabled={loading}
            >
              <KeyboardReturn style={{ marginLeft: '5px', marginTop: '5px' }} />
            </TextField>
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
            {loading
              ? loading && (
                  <div>
                    <CircularProgress color='secondary' size={23} />
                  </div>
                )
              : 'Ask'}
          </button>
          <button
            type='button'
            onClick={clear}
            style={{
              width: '60px',
              backgroundColor: 'lightgrey',
              marginTop: '10px',
              marginLeft: '5px',
              cursor: 'pointer',
              padding: '10px',
              fontSize: '18px',
              borderRadius: '10px',
              border: 'none',
            }}
          >
            clear
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
          value={answer}
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
          {/* {answer && <Typography>{answer}</Typography>}
          {error && <p>Something bad happened</p>} */}
        </textarea>
      </div>
    </div>
  );
};

export default Gpt;
