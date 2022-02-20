import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';


function App() {

	const [activities, setactivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		axios.get<Activity[]>("http://localhost:5278/api/activities").then(response => {
			setactivities(response.data);
		})
	}, [])

	function handleSelectedActivity(id:string) {
		setSelectedActivity(activities.find(x => x.id === id));
		
	}

	function handleCancelSelectedActivity() {
		setSelectedActivity(undefined);		
	}

	function handleFormOpen(id?: string) {
		id ? handleSelectedActivity(id) : handleCancelSelectedActivity();
		setEditMode(true);
		
	}

	function handleFormClose() {
		setEditMode(false);
	}

	function handleCreateOrEditActivity(activity: Activity) {
		activity.id 
			? setactivities([...activities.filter(x => x.id !== activity.id), activity])
			: setactivities([...activities, {...activity, id:uuid()}]);
		setEditMode(false);
		setSelectedActivity(activity);
	}

	function handleDeleteActivity(id: string) {
		setactivities([...activities.filter(x => x.id !== id)])
	}

	return (
		<>
			<NavBar openForm={handleFormOpen} />
			<Container style={{marginTop: '7em'}}>
				<ActivityDashboard activities={activities} 
					selectedActivity={selectedActivity}
					selectActivity={handleSelectedActivity}
					cancelSelectedActivity={handleCancelSelectedActivity}
					editMode={editMode}
					openForm={handleFormOpen}
					closeForm={handleFormClose}
					createOrEdit={handleCreateOrEditActivity}
					deleteActivity={handleDeleteActivity}
				/>
			</Container>
		
			<ul>
				 
			</ul>
			
	
		</>
	);
}

export default App;
