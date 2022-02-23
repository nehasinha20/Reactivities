import React, { Fragment, useEffect, useState } from 'react';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../../api/agent';
import LoadingComponent from './LoadingComponent';


function App() {

	const [activities, setactivities] = useState<Activity[]>([]);
	const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined)
	const [editMode, setEditMode] = useState(false);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		agent.Activities.list().then(response => {
			let activities: Activity[] = [];
			response.forEach(activity => {
				activity.date = activity.date.split("T")[0];
				activities.push(activity);
			})
			setactivities(activities);
			setLoading(false);
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
		setSubmitting(true);
		if(activity.id) {
			agent.Activities.update(activity).then(() => {
				setactivities([...activities.filter(x => x.id !== activity.id), activity])
				setSelectedActivity(activity);
				setEditMode(false);
				setSelectedActivity(activity);
			})
		} else {
			activity.id = uuid();
			agent.Activities.create(activity).then(() => {
				setactivities([...activities, activity])
				setSelectedActivity(activity);
				setEditMode(false);
				setSelectedActivity(activity);
			})
		}
	}

	function handleDeleteActivity(id: string) {
		setSubmitting(true);
		agent.Activities.delete(id).then(() => {
			setactivities([...activities.filter(x => x.id !== id)]);
			setSubmitting(false);
		})
		
	}

	if(loading) return <LoadingComponent content='Loading app...'/>

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
					submitting={submitting}
				/>
			</Container>
		
			<ul>
				 
			</ul>
			
	
		</>
	);
}

export default App;
