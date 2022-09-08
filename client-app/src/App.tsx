import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header, Icon, List} from 'semantic-ui-react';

function App() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/Activities').then(response => {
      console.log(response);
      setActivities(response.data)
    })
  }, [])

  return (
    <div>      
      <Header as='h2'>
        <Icon name='users' />
        <Header.Content>
          Reactivities
          <Header.Subheader>By Arturo Angel</Header.Subheader>
        </Header.Content>
      </Header>

      <List>
        {activities.map((activity : any) => (
        <List.Item key={activity.id}>
            {activity.title}
        </List.Item>
        ))}
      </List>         
    </div>
  );
}

export default App;
