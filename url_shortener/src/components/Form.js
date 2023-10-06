import React from 'react'; //every component needs to import react or react components
import { nanoid } from 'nanoid'; // creates characters for url
import { getDatabase, child, ref, set, get} from 'firebase/database'; //firebase database methods 
import { isWebUri } from 'valid-url'; //used to chekc if a inputted url is valid 
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from "react-bootstrap/Tooltip"; //for copied message to user


class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            longURL: '',
            preferedAlias: '',
            generatedURL: '',
            loading: false,
            errors: [],
            errorMessage: {},
            toolTipMessage: 'copy to clip board' 
        };
    }

    //called when user clicks submit 
    onSubmit = async (event) => {
        event.preventDefault(); //stops page from reloading
        this.setState({
            loading: true,
            generatedUrl: '' 
        })

        //validated the url the user has inputted
        var isFormValid = await this.validateInput()
        if (!isFormValid) {
            return  //validateInput already returns error messages so we leave this as is
        }

        //generate new url 
        var generatedKey = nanoid(5); //5 characters 
        var generatedURL = 'shortlink/' + generatedKey
        
        //if user has prefered short link we use that 
        if(this.state.preferedAlias !== ''){
            generatedKey = this.state.preferedAlias
            generatedURL = 'shortlink/' + generatedKey
        }

        //update database with new info
        const db = getDatabase()
        set(ref(db, '/' + generatedKey), {
            generatedKey: generatedKey,
            longURL: this.state.longURL,
            preferedAlias: this.state.preferedAlias,
            generatedURL: generatedURL
        }).then((result) => {
            this.setState({
                generatedURL: generatedURL,
                loading: false
            })
        }).catch((e) => {
            //handle error 
        })
    }

    //helper functions 
    //checks if there is any error overall
    hasError = (key) => {
        return this.state.errors.indexOf(key) !== -1;
    }

    //saves as the user is typing 
    handleChange = (e) => {
        const { id, value } = e.target
        this.setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    //validates user input 
    validateInput = async () => {
        var errors = [];
        var errorMessages = this.state.errorMessage

        //validated user inputted url
        if(this.state.longURL.length === 0){ //nothing is inputted 
            errors.push("longURL");
            errorMessages["longURl"] = 'no url inputted :('
        } 
        else if (!isWebUri(this.state.longURL)) { //is not valid url
            errors.push("longURL");
            errorMessages["longURL"] = 'use a url in form of https://www...'
        }

        //preferred alias 
        if(this.state.preferedAlias !== ''){ //if there exists an alias
            //checks if alias is greater than 7 char long
            if(this.state.preferedAlias.length > 7) {
                errors.push("suggestedAlias");
                errorMessages["suggestedAlias"] = 'needs to be less than 7 characers'
            }
            //checks if alias has blank spaces 
            else if(this.state.preferedAlias.indexOf(' ') >= 0){
                errors.push("suggestedAlias")
                errorMessages["auggestedAlias"] = 'no blank spaces pls'
            }

            var keyExists = await this.checkKeyExists()

            //checks is alias exists or not
            if(keyExists.exists()) {
                errors.push("suggestedAlias")
                errorMessages["suggestedAlias"] = 'already taken! ty again :)'
            }
        }
        //update states 
        this.setState({
            errors: errors,
            errorMessages: errorMessages,
            loading: false
        });

        if(errors.length > 0){
            return false;
        }
        return true
    }

    //checks if key exists in the database and fetches preferred alias
    checkKeyExists = async () => {
        const dbRef = ref(getDatabase());
        return get(child(dbRef, `/${this.state.preferredAlias}`)).catch((error) => {
            return false 
        });
    }

    //copies to clipboard
    copyToClipboard = () => {
        navigator.clipboard.writeText(this.state.generatedURL)
        this.setState({
            toolTipMessage: 'copied!'
        })
    }

    //render method contains all html code 
    render() {
        return (
            <div className = "container">
                <form autoComplete="off">
                    <h3>Short Link!</h3>

                    <div className="form-group">
                        <label>Enter the long url</label>
                        <input
                            id="longURL"
                            onChange={this.handleChange} //calling our function from ealier
                            value={this.state.longURL}
                            type="url"
                            required
                            className={
                                this.hasError("longURL")
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            plaeholder="include http://www. pls"
                        />
                    </div>
                    <div
                        className={
                            this.hasError("longURL") ? "text-danger" : "visually-hidden"
                        }
                    >
                        {this.state.errorMessage.longURL}
                    </div>

                    <div className="form-group">
                        <label htmlFor="basic-url">Short url coming right up!</label>
                        <div className='input-group mb-3'>
                            <div className="input-group-prepend">
                            <span className="input-group-text">shortlink.com/</span>
                            </div>
                        <input
                            id="preferredAlias"
                            onChange={this.handleChange}
                            value={this.state.prefferedAlias} //calling our function from earlier
                            className={
                                this.hasError("prefferedAlias")
                                    ? "form-control is-invalid"
                                    : "form-control"
                            }
                            type="text" placeholder="ex. s8ume"
                        />
                        </div>
                        <div 
                            className={this.hasError("suggestedAlias") ? "text-danger" : "visually-hidden"}
                        >
                            {this.state.errorMessage.suggestedAlias}
                        </div>
                    </div>
                    
                    
                    <button className="btn btn-primary" type="button" onClick={this.onSubmit}>
                        {
                            this.state.loading ?
                                <div> 
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </div> :
                                <div>
                                    <span className="visually-hhidden psinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Short Link</span>
                                </div>
                        }
                    </button>
 
                    {
                        this.state.generatedURL === '' ? 
                            <div></div>
                            : 
                            <div className="generatedurl">
                                <span>Your short link is: </span>
                                <div className="input-group mb-3">
                                    <input disbaled type="text" value={this.state.generatedURL} className="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <OverlayTrigger
                                            key={'top'}
                                            placement={'top'}
                                            overlay={
                                                <Tooltip id={`tooltip-${'top'}`}>
                                                    {this.state.toolTipMessage}
                                                </Tooltip>
                                            }
                                        >
                                            <button onClick={() => this.copyToClipboard()} data-toggle="tooltip" data-placement="top" title="Tooltip on top" className="btn btn-outline-secondary" type="button">Copy</button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                                
                            </div>
                    }

                </form>
            </div>
        );
    }

}

//export
export default Form;