import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import {
    Button,
    Card,
    Checkbox,
    Form,
    Header,
    Icon,
    Image,
    Input
} from "semantic-ui-react";

const style = (
    <link
        rel="stylesheet"
        href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
    />
);

const api = "https://api.notelog.app/github?query=";

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "git",
            hits: 0,
            results: []
        };
    }
    componentDidMount() {
        this.getQueryResults();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    onChange = event => {
        this.setState(
            {
                [event.target.name]: event.target.value
            },
            () => {
                this.getQueryResults();
                updateText(this.state.query);
            }
        );
    };
    getQueryResults() {
        let { query } = this.state;
        if (query) {
            axios.get(api + query).then(res => {
                // console.log(res["data"]["hits"]["hits"]);
                if (res.data) {
                    this.setState({
                        hits: res.data.hits.total.value,
                        results: res.data.hits.hits
                    });
                } else {
                    this.setState({
                        hits: 0,
                        results: []
                    });
                }
            });
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <Form>
                        <Input
                            type="text"
                            name="query"
                            icon="search"
                            value={this.state.query}
                            onChange={this.onChange}
                            fluid
                            placeholder="Enter Search Term"
                        />
                    </Form>
                    <GitResults results={this.state.results} />
                </div>
            </div>
        );
    }
}

function updateText(query) {
    console.log(query);
}

const GitResults = ({ results }) => (
    <div>
        <div className="hitCount">
            <Header className="header" as="h2">
                Repositories
            </Header>
        </div>
        <div class="ui four doubling stackable cards">
            {results.map(result => (
                <Card>
                    <Card.Content>
                        <Card.Header href={result._source.url}>{result._source.reponame}</Card.Header>
                        <Image
                            floated="right"
                            size="mini"
                            src={result._source.avatar}
                            href={"https://github.com/"+result._source.username}
                        />
                        <Card.Meta>{result._source.username}</Card.Meta>
                        <Card.Description>
                            {result._source.description}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <a src={result._source.url}>
                            <Icon name="github square" />
                            {result._source.username}/{result._source.reponame}
                        </a>
                    </Card.Content>
                </Card>
            ))}
        </div>
    </div>
);

ReactDOM.render(
    <div>
        <h1>NoteLog</h1>
        {style}
        <Search />
    </div>,
    document.getElementById("root")
);
