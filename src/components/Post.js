import React, { Component } from 'react'
import '../styles/Post.css'
import ArrowDown from 'react-icons/lib/md/keyboard-arrow-down'
import ArrowUp from 'react-icons/lib/md/keyboard-arrow-up'
import Edit from 'react-icons/lib/md/edit'
import Delete from 'react-icons/lib/md/delete'
import { timeAgo } from '../helpers'
import { connect } from 'react-redux'
import { showPostDetails } from '../actions/ui'
import { votePost, removePost } from '../actions/posts'
import PostCreateEdit from './PostCreateEdit'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
}

class Post extends Component {

    state = {
        modalIsOpen: false
    }

    openModal = () => {
        this.setState({ modalIsOpen: true })
    }

    closeModal = () => {
        this.setState({ modalIsOpen: false })
    }

    votePost = (vote) => {
        this.props.votePost(vote, this.props.data.id)
    }

    deletePost = () => {
        this.props.deletePost(this.props.data.id)
    }

    showDetails = (id) => {
        const { showDetails } = this.props

        if (showDetails) {
            return
        } else {
            this.props.showPostDetails(id)
        }
    }

    render() {

        const { id, voteScore, title, body, author, timestamp, commentCount, category } = this.props.data
        return(
            
            <div className='post-container'>
                <div className='vote-container'>
                    <button id='arrow-up' onClick={() => { this.votePost('upVote') }}><ArrowUp size={36} /></button>
                    <p>{voteScore}</p>
                    <button id='arrow-down' onClick={() => { this.votePost('downVote') }}><ArrowDown size={36}/></button>
                </div>
                <div className='details-container'>
                    <Link to={`/${category}/${id}`} className='no-link' onClick={() => this.showDetails(id)}>
                    <div className='post-title'>
                        {title}
                    </div>
                    <div className='post-body'>
                        {body}
                    </div>
                    </Link>
                    <div className='post-info'>
                        <div>
                            {`${author} • ${timeAgo(timestamp)} • ${commentCount} comments`}
                        </div>
                        
                        {this.props.editEnable ? 
                        <div id='edit-delete-icons'>
                            <Edit id='edit' size={16} onClick={this.openModal}/>
                            <Delete id='delete' size={16} onClick={this.deletePost}/>
                            <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                                <PostCreateEdit close={this.closeModal} data={this.props.data} isEditing={true}/>
                            </Modal>
                        </div>
                        :
                        null}
                        
                    </div>
                </div>
            </div>
            
        )
    }
}

const mapStateToProps = (state, props) => ({
    showDetails: state.ui.showDetails
})  

const mapDispatchToProps = dispatch => ({
    votePost: (vote, id) => dispatch(votePost(vote, id)),
    deletePost: (id) => dispatch(removePost(id)),
    showPostDetails: (id) => dispatch(showPostDetails(id)),
})

Post.defaultProps = {
    editEnable: true
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)