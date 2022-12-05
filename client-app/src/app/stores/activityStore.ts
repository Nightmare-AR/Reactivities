import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid'

export default class ActivityStore{
    // title  = 'hello from MobX';
    // activities : Activity[] = [];using array
    activityRegistry = new Map<string, Activity>();//using map
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    // constructor(){
    //     makeObservable(this, {
    //         title: observable,
    //         setTitle: action
    //     })
    // }

    constructor(){
        makeAutoObservable(this);
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // setTitle = () => {
    //     this.title = this.title + "!";
    // }

    loadActivities = async () => {       
        this.setLoadingInitial(true); 
        try{
            const activities = await agent.Activities.list();

            runInAction(() => {
                activities.forEach(activity => {
                    activity.date=activity.date.split('T')[0];
                    this.setActivity(activity);
                });                
            });
            this.setLoadingInitial(false);
            
        }catch(error){
            console.log(error);
            this.setLoadingInitial(false);           
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if(activity){
            this.selectedActivity = activity;
            this.setLoadingInitial(false);

            return activity;
        }else{            
            try{
                this.setLoadingInitial(true);

                activity = await agent.Activities.details(id);
                this.setActivity(activity);

                runInAction(() => {
                    this.selectedActivity = activity;                   
                });

                this.setLoadingInitial(false);

                return activity;
            } catch(error){
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    private setActivity = (activity: Activity) => {
        activity.date=activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // selectActivity = (id: string) => {
    //     // this.selectedActivity = this.activities.find(a => a.id === id); //Using array
    //     this.selectedActivity = this.activityRegistry.get(id);//using map
    // }

    // cancelSelectedActivity = () => {
    //     this.selectedActivity = undefined;
    // }

    // openForm = (id?: string) => {
    //     id ? this.selectActivity(id) : this.cancelSelectedActivity();
    //     this.editMode = true;
    // }

    // closeForm = () => {
    //     this.editMode = false;
    // }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                // this.activities.push(activity);using array
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                // this.activities = [...this.activities.filter(x => x.id !== activity.id), activity]; using array
                this.activityRegistry.set(activity.id, activity);//using map
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        }catch(error){
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;

        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                // this.activities = [...this.activities.filter(x => x.id !== id)];//using array
                this.activityRegistry.delete(id);//using map
                // if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;                
            })
        }catch(error){
            console.log(error);
            runInAction(() => {
                this.loading = false;        
            });
        }
    }
}