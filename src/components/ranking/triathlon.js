import React,{Component} from 'react';
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux';
import { Header, Image, Table } from 'semantic-ui-react'
import { userHelper } from '../../helpers/user';
import UpdateTriathlon from './updates/triathlon';
import _ from 'lodash';
import {Link} from 'react-router-dom';


class Triathlon extends Component{
    renderRows(){
        const { admin } = this.props.currentUser;

        return _.map(this.props.fighters,(fighter) => {
            return(
                <Table.Row key={fighter.id}>
                    <Table.Cell>
                        <Header as='h4' image>
                            <Image src={userHelper.getImage(fighter)} shape='rounded' size='mini' />
                            <Header.Content>
                                <Link to={`/profile/${fighter.id}`}> {fighter.name}</Link>
                                <Header.Subheader>{fighter.club}</Header.Subheader>
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="1" >
                        {fighter.triathlonTable.win}
                    </Table.Cell>
                    <Table.Cell width="1" >
                        {fighter.triathlonTable.loss}
                    </Table.Cell>
                    <Table.Cell width="1" >
                        {fighter.triathlonTable.points}
                    </Table.Cell>
                    { admin &&
                    <Table.Cell width="1" >
                        <UpdateTriathlon events={this.props.events} fighter={fighter}/>
                    </Table.Cell>
                    }
                </Table.Row>
            )
        });
    }

    render(){
        const { admin } = this.props.currentUser;
        return(
            <div>
                <Table celled inverted selectable unstackable>

                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Fighter</Table.HeaderCell>
                            <Table.HeaderCell width="1">Win</Table.HeaderCell>
                            <Table.HeaderCell width="1">Lost</Table.HeaderCell>
                            <Table.HeaderCell width="1">Points</Table.HeaderCell>
                            { admin &&
                            <Table.HeaderCell width="1"></Table.HeaderCell>
                            }
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { currentUser:state.currentUser };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, );
}

export default connect(mapStateToProps,mapDispatchToProps)(Triathlon);