import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [response, setResponse] = useState('');

  const handleFileDrop = acceptedFiles => {
    const file = acceptedFiles[0];
    setSelectedFile(file);

    if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = event => {
        const text = event.target.result;
        setTextInput(text);
      };
      const result = reader.readAsText(file);
      setResponse(result);
      console.log('==result==: ', selectedFile);
    }
  };

  // Type in text (not file)
  //   const handleInputChange = event => {
  //     setTextInput(event.target.value);
  //   };

  const handleSubmit = async e => {
    e.preventDefault();

    // TODO: Send the text input and file to your database

    // TODO: Make a request to the GPT API
    // const response = await axios.post(GPT_API_URL, { text: textInput });

    // TODO: Handle the response from the GPT API
    // setResponse(response.data.content);
    setSelectedFile('');
    console.log('===submit response===: ');
  };

  const clear = () => {
    setSelectedFile('');
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
        {/* <h4>Dropzone</h4> */}
        <form onSubmit={handleSubmit}>
          <Dropzone onDrop={handleFileDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{
                  padding: '20px',
                  border: '1px solid #ccc',
                }}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <p>{selectedFile.name}</p>
                ) : (
                  <p>Drag and drop a file here, or click to select files</p>
                )}
              </div>
            )}
          </Dropzone>
          {/* <textarea
            value={textInput}
            onChange={handleInputChange}
            placeholder='Enter your text'
          /> */}
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
          >
            Add
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
        {response && <div>{response}</div>}
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
        <div></div>
      </div>
    </div>
  );
};

export default Upload;
