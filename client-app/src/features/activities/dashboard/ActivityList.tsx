import { observer } from 'mobx-react-lite';
import { Header, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import ActivityListItem from './ActivityListItem';
import { Fragment } from 'react';

export default observer(function ActivityList(){
    const {activityStore} = useStore();
    const {groupedActivities} = activityStore

    return (
        <>
            {groupedActivities.map(([group, activites]) => (
            <Fragment key = {group}>
                <Header sub color = 'teal'>
                    {group}
                </Header>
                <Segment>
                    <Item.Group divided>
                            {activites.map(activity => (
                                <ActivityListItem key={activity.id} activity={activity}/>
                            ))}
                    </Item.Group>
                </Segment>
            </Fragment>

            ))}
        </>       
    )
})