import React, { useEffect, useState } from 'react'
import MainLayout from './MainLayout'
import { withTracker } from 'meteor/react-meteor-data';
import { locations } from '../api/lines.js';
import { Meteor } from 'meteor/meteor';
import { Icon, Button, ListItem, ListTitle, Card, ProgressCircular } from 'react-onsenui'
import moment from 'moment';
import { toast } from 'react-toastify';

function Index({ AllLocations, history }) {
    
    const [nearby ,setNearby]=useState();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            Meteor.call('location.findnearby',position.coords.longitude, position.coords.latitude, (err, result)=>{         
                setNearby(result)
            })
        }, (err) => {
            toast("Cant get current location, please turn on browser's geolocation function and refresh")
            console.warn(`ERROR(${err.code}): ${err.message}`);
        });
        return () => {
        }
    }, [])


    function statusToWord(statusCode) {
        switch (statusCode) {
            case "no":
                return <div style={{ color: "green" }}>No Lines!</div>
            case "small":
                return <div style={{ color: "orange" }}>A Wee Wait</div>
            case "long":
                return <div style={{ color: "red" }}>Busy. Stay Home.</div>
        }
    }

    function renderList() {
        return AllLocations.map((location) => {
            return (
                <Card key={location._id}>
                    <ListItem>
                        Name: {location.name}
                        <div className="right">
                            <Button
                                onClick={() => {
                                    history.push('/editLine?id=' + location._id)
                                }}
                            >Update Status</Button>
                        </div>
                    </ListItem>
                    <ListItem>
                        Address: {location.address}
                    </ListItem>
                    <ListItem>
                        Last updated: {moment(location.lastUpdate).fromNow()}
                    </ListItem>
                    <ListItem>
                        Waiting time:&nbsp;{statusToWord(location.status)}
                    </ListItem>
                </Card>)
        })
    }

    function renderNearby() {
        if(!nearby){
            return (
                <Card>
                    <ProgressCircular indeterminate />
                </Card>
            )
        }
        return nearby.map((location) => {
            return (
                <Card key={location._id}>
                    <ListItem>
                        Name: {location.name}
                        <div className="right">
                            <Button
                                onClick={() => {
                                    history.push('/editLine?id=' + location._id)
                                }}
                            >Update Status</Button>
                        </div>
                    </ListItem>
                    <ListItem>
                        Address: {location.address}
                    </ListItem>
                    <ListItem>
                        Last updated: {moment(location.lastUpdate).fromNow()}
                    </ListItem>
                    <ListItem>
                        Waiting time:&nbsp;{statusToWord(location.status)}
                    </ListItem>
                </Card>)
        })
    }

    return (
        <MainLayout>
            <div style={{ marginBottom: 55 }}>
            <ListTitle>
                Shops Near You
            </ListTitle>
            {renderNearby()}
            <ListTitle>
                All Shops
            </ListTitle>
            {renderList()}
            </div>
            <Button modifier="large--cta" style={{ position: "fixed", bottom: 0, zIndex: 1000, minHeight: 50 }}
                // type="submit"
                onClick={() => { history.push('/addLine') }}>
                Add a new shop
                    <Icon style={{ marginLeft: 10 }} icon='fa-plus' />
            </Button>
        </MainLayout>
    )
}


export default withTracker(() => {
    Meteor.subscribe('locations');

    return {
        AllLocations: locations.find({}, { sort: { lastUpdate: -1 } }).fetch(),
        //   currentUser: Meteor.user,
    };
})(Index);