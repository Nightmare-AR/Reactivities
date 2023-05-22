import { SyntheticEvent, useState } from "react";
import { Button, Icon, Item, ItemGroup, Segment, SegmentGroup } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

interface Props {
    activity: Activity
}

export default function ActivityListItem({activity}: Props) {

    const {activityStore} = useStore();
    const {deleteActivity, activitiesByDate, loading} = activityStore

    const[target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }  

    return(
       <SegmentGroup>
        <Segment>
            <ItemGroup>
                <Item>
                    <Item.Image size='tiny' circular src = '/assets/user.png'></Item.Image>
                    <Item.Content>
                        <Item.Header as={Link} to= {`/activities/${activity.id}`}>
                            {activity.title}
                        </Item.Header>
                        <Item.Description>Hosted by Arturo</Item.Description>
                    </Item.Content>
                </Item>
            </ItemGroup>
        </Segment>
        <Segment>
            <span>
                <Icon name = 'clock'/> {activity.date}
                <Icon name = 'marker'/> {activity.venue}
            </span>
        </Segment>
        <Segment secondary>
            Attendes go here
        </Segment>
        <Segment clearing>
            <span>{activity.description}</span>
            <Button
                as={Link}
                to={`/activities/${activity.id}`}
                color='teal'
                floated="right"
                content='View'
            />
        </Segment>
       </SegmentGroup>
    )
}