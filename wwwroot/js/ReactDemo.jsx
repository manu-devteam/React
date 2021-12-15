
class CommentList extends React.Component {
  
    render() {
        return (
            <div className="commentList">
                <Comment author="Daniel Lo Nigro">
                    Hello ReactJS.NET World!
                </Comment>
                <Comment author="Pete Hunt">This is one comment</Comment>
                <Comment author="Jordan Walke">
                    This is *another* comment
                </Comment>
            </div>
        );
    }
}
class CommentLists extends React.Component {
    render() {
        const commentNodes = this.props.data.map(comment => (
            <Comment author={comment.author} key={comment.id}>
                {comment.text}
            </Comment>
        ));
        return <div className="commentLists">{commentNodes}</div>;
    }
}
function createRemarkable() {
    var remarkable =
        'undefined' != typeof global && global.Remarkable
            ? global.Remarkable
            : window.Remarkable;

    return new remarkable();
}
class Comment extends React.Component {
    rawMarkup() {
        const md = new Remarkable();
        const rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }
    render() {
        //const md = createRemarkable();
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                {/*{md.render(this.props.children)}*/}
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
}
//class CommentForm extends React.Component {
//    render() {
//        return (
//            <div className="commentForm">Hello, world! I am a CommentForm.</div>
//        );
//    }
//}
class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { author: '', text: '' };
        this.handleAuthorChange = this.handleAuthorChange.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleAuthorChange(e) {
        this.setState({ author: e.target.value });
    }
    handleTextChange(e) {
        this.setState({ text: e.target.value });
    }
    handleSubmit(e) {
        e.preventDefault();
        const author = this.state.author.trim();
        const text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        // TODO: send request to the server
        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
    }
    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                />
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />
                <input type="submit" value="Post" />
            </form>
        );
    }
}

class CommentBox extends React.Component {

    constructor(props) {
        super(props)
        this.state = { data: [] };
        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }
    loadCommentsFromServer() {
        const xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = () => {
            const data = JSON.parse(xhr.responseText);
            this.setState({ data: data });
        };
        xhr.send();
    }
    handleCommentSubmit(comment) {
        const data = new FormData();
        data.append('Author', comment.author);
        data.append('Text', comment.text);

        const xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = () => this.loadCommentsFromServer();
        xhr.send(data);
    }
  
    render() {
      
        return (

            <div className="commentBox">
                <h1>Hello, world! I am a CommentBox.</h1>
                <CommentLists data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}
  const data = [
            { id: 1, author: 'Daniel Lo Nigro', text: 'Hello ReactJS.NET World!' },
            { id: 2, author: 'Pete Hunt', text: 'This is one comment' },
            { id: 3, author: 'Jordan Walke', text: 'This is *another* comment' },
        ];
//ReactDOM.render(<CommentBox data={ data}/>, document.getElementById('content'));
ReactDOM.render(<CommentBox url="/Comments" submitUrl="/comments/new"
    pollInterval={2000} />, document.getElementById('content'));


//class CommentBox extends React.Component {
//    render() {
//        return React.createElement(
//            'div',
//            { className: 'commentBox' },
//            'Hello, world! I am a CommentBox.',
//        );
//    }
//}

//ReactDOM.render(
//    React.createElement(CommentBox, null),
//    document.getElementById('content'),
//);

