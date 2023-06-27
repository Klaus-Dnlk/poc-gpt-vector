import React, { useState, useEffect } from 'react';
import { CircularProgress, Typography, Button } from '@mui/material';
import { chatServices } from '../../services/chat-services';

export const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [filesArray, _] = useState([]);

  useEffect(() => {
    if (selectedFile != null) {
      setAnswer(null);
    }
    console.log(selectedFile);
    console.log(filesArray);
  }, [selectedFile, filesArray]);

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        setLoading(true);
        const form = new FormData();
        form.append('chat-file', selectedFile);

        const { success } = await chatServices.ingestFile({ fileInput: form });
        if (success) {
          filesArray.push(selectedFile);
          setAnswer('Successfully ingested. Ask me anything.');
        }
      } catch (err) {
        setSelectedFile(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const clear = () => {
    setSelectedFile(null);
    setAnswer('');
    setResponse('');
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
        Upload section
      </h2>
      <div
        style={{
          backgroundColor: 'lightcyan',
          padding: '15px',
          height: '150px',
        }}
      >
        <h4>Here you can choose and add pdf/txt/csv file</h4>
        <div>
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <input
              accept='.pdf,.txt,.csv'
              id='file-input'
              type='file'
              onChange={handleFileChange}
            />

            {selectedFile && (
              <div>
                <button
                  type='submit'
                  style={{
                    width: '400px',
                    backgroundColor: 'lightblue',
                    marginTop: '10px',
                    cursor: 'pointer',
                    padding: '10px',
                    fontSize: '18px',
                    borderRadius: '10px',
                    border: 'none',
                  }}
                  onClick={handleFileUpload}
                >
                  {loading
                    ? loading && (
                        <div>
                          <CircularProgress color='secondary' size={23} />
                        </div>
                      )
                    : 'Upload'}
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
              </div>
            )}
          </div>

          <div>
            {answer && <Typography>{answer}</Typography>}
            {error && <p>Something bad happened</p>}
          </div>
        </div>
      </div>
      <div
        style={{
          backgroundColor: 'lightcyan',
          padding: '15px',
          marginTop: '15px',
          height: '500px',
        }}
      >
        <h4>List of added files</h4>
        {response && <div>{response}</div>}
        <div>
          <ul style={{ textAlign: 'left' }}>
            {selectedFile &&
              filesArray.map((f, i) => (
                <li key={i}>
                  {f.name} --- {f.type} --- {f.size}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

//TRY-CATCH-BLOCK
//
// try {
//   setLoading(true);
//   const form = new FormData();
//   form.append('chat-file', selectedFile);

//   const { success } = await chatServices.ingestFile({
//     fileInput: form,
//   });
//   if (success) {
//     setAnswer('Successfully ingested. Ask me anything.');
//   }
// } catch (err) {
//   setSelectedFile(null);
//   setError(err);
// } finally {
//   setLoading(false);
// }

/// STYLES
// style={{
//   marginTop: '2rem',
//   display: 'flex',
//   flexDirection: 'column',
//   alignItems: 'center',
//   border: '2px dashed #999',
//   borderRadius: '4px',
//   padding: '1rem',
//   backgroundColor: isDragActive ? '#eee' : 'transparent',
// }}
