import React,{Component} from 'react';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import  NavbarComp from '../../home/partials/navbar';
import { Card, Icon, Image, List, Button, Flag } from 'semantic-ui-react'
import { fetchUser } from '../../../actions';
import { userHelper } from '../../../helpers/user';
import { uploadProfileImage } from '../../../actions';
import Dropzone from 'react-dropzone'
import { Tooltip } from 'reactstrap';
import { fetchAchievements } from '../../../actions/ranking';
import _ from 'lodash';
import { stringHelper } from '../../../helpers/string';
import AddAchievement from './addAchievement';





class Profile extends Component{
    constructor(props){
        super(props);

        this.state = {
            tooltipOpen: false,
            imgPreview : null
        }

    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    componentDidMount(){
        this.props.fetchUser(this.props.match.params.userId);
        this.props.fetchAchievements(this.props.match.params.userId);
    }

    onDrop(acceptedFiles, rejectedFiles) {
        acceptedFiles.forEach(file => {
            this.props.uploadProfileImage(this.props.match.params.userId,file);
        });
        this.setState({
            imgPreview: acceptedFiles[0].preview
        });

    }

    deleteAchievement(achievement,e){
        console.log(achievement);
    }

    renderAchievements(){
        if(this.props.profile.achievements){
            return _.map(this.props.profile.achievements.data.data, (achievement) => {

                return (
                    <List.Item>
                        <List.Icon dangerouslySetInnerHTML={{__html: achievement.cup}}/>
                        <List.Content>
                            <List.Header as='a'>{achievement.event.title}</List.Header>
                            <List.Description>
                                {achievement.category} | {achievement.place} | {stringHelper.limitTo(achievement.event.date,10)}
                            </List.Description>
                        </List.Content>
                        <List.Icon onClick={this.deleteAchievement.bind(this,achievement)} name="delete"/>
                    </List.Item>
                )
            });
        }
    }

    renderUserImage(){
        const {profile} = this.props;
        if(profile.user) {
            return (
                    <div className="col-md-3">
                        <Card>
                            { profile.user.id == this.props.currentUser.user.id ?
                                <Dropzone id="upload" style={{width: 'max-width'}} onDrop={this.onDrop.bind(this)}>
                                    <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="upload"
                                             toggle={this.toggle.bind(this)}>
                                        Click or drop image to upload
                                    </Tooltip>
                                    { this.state.imgPreview ? <Image src={this.state.imgPreview}/>
                                        :
                                        <Image src={userHelper.getImage(profile.user)}/> }
                                </Dropzone> :
                                <Image src={userHelper.getImage(profile.user)}/>
                            }
                            <Card.Content>
                                <Card.Header>
                                    { profile.user.name }
                                </Card.Header>
                                <Card.Meta>
                                        <span className='date'>
                                          Joined in 2015
                                        </span>
                                </Card.Meta>
                                <Card.Description>

                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </div>

            )
        }
    }

    renderFlags(){
        const {profile} = this.props;
        if(profile.achievements) {
            return _.map(this.props.profile.achievements.data.achievement.countries, (achievement) => {

                return (
                    <Flag name={achievement.event.location}/>
                );
            });
        }
    }

    renderUserProfile(){
        const {profile} = this.props;
        if(profile.user) {
            return (
                <div className="col-md-5">
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                {this.renderFlags()}
                            </Card.Header>
                        </Card.Content>
                        <Card.Content>
                            <Card.Header className="text-center">
                                Fighter Info
                            </Card.Header>
                            <hr/>
                            <div className="row">
                                <div className="col-md-6">
                                    <List>
                                        <List.Item icon='certificate'
                                                   content={'Total points: ' + profile.user.total_points}/>
                                        <List.Item icon='certificate' content={'Age: ' + profile.user.age}/>
                                        <List.Item icon='certificate' content={'Weight: ' + profile.user.weight}/>
                                        <List.Item icon='certificate' content={'Quote :' }/>
                                        <List.Item content={'"' + profile.user.quote + '"'}/>
                                    </List>
                                </div>
                                <div className="col-md-6">
                                    <List>
                                        <List.Item icon='certificate' content={'Total Fights: ' +
                                        (profile.user.bohurtTable.fights + profile.user.profightTable.fights + profile.user.swordShieldTable.fights +
                                        profile.user.swordBucklerTable.fights + profile.user.longswordTable.fights + profile.user.polearmTable.fights + profile.user.triathlonTable.fights)}/>
                                        <List.Item icon='certificate'
                                                   content={'Bohurt fights: ' + profile.user.bohurtTable.fights}/>
                                        <List.Item icon='certificate'
                                                   content={'S&S fights: ' + profile.user.swordShieldTable.fights}/>
                                        <List.Item icon='certificate'
                                                   content={'S&B fights: ' + profile.user.swordBucklerTable.fights}/>
                                        <List.Item icon='certificate'
                                                   content={'Longsword fights: ' + profile.user.longswordTable.fights}/>
                                        <List.Item icon='certificate'
                                                   content={'Polearm fights: ' + profile.user.polearmTable.fights}/>
                                        <List.Item icon='certificate'
                                                   content={'Triathlon fights: ' + profile.user.triathlonTable.fights}/>
                                        <List.Item icon='certificate'
                                                   content={'Profights fights: ' + profile.user.profightTable.fights}/>
                                    </List>
                                </div>
                            </div>
                            <hr/>
                            <Card.Header className="text-center">
                                About
                            </Card.Header>
                            <p>
                                { profile.user.about }
                            </p>
                        </Card.Content>
                    </Card>


                </div>

            )
        }
    }



    render(){
        const {profile} = this.props;

        if(!profile){
            return <div>Loading...</div>;
        }

        return(
            <div>
                <NavbarComp/>
                <div className="container">
                    <div className="row">
                        {this.renderUserImage()}
                        {this.renderUserProfile()}
                        <div className="col-md-4">
                            <Card>
                                <Card.Content>
                                    <Card.Header>
                                        Achievements
                                        <AddAchievement/>
                                    </Card.Header>
                                </Card.Content>
                                <Card.Content>
                                    <List>
                                        {this.renderAchievements()}
                                    </List>
                                </Card.Content>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { profile: state.profile,
        currentUser: state.currentUser};
}



export default connect(mapStateToProps,{fetchUser,uploadProfileImage,fetchAchievements})(Profile);