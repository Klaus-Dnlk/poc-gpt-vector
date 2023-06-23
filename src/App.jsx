import './App.css';
import { Grid, Container } from '@mui/material';
import Upload from './components/upload/Upload';
import Gpt from './components/request/Gpt';

function App() {
  return (
    <div className='App'>
      <Container
        maxWidth='100%'
        style={{
          backgroundColor: 'lightgrey',
          // marginTop: '25px',
          textAlign: 'center',
          height: '100vh',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Upload />
          </Grid>
          <Grid item xs={6}>
            <Gpt />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;
