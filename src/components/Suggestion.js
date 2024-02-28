import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function Suggestion(){

    return(
    <>
        <Form>
            <Form.Group>
                <Form.Label>Enter Any Website Suggestions/Improvement Ideas Here:</Form.Label>
                <InputGroup>
        <InputGroup.Text></InputGroup.Text>
        <Form.Control as="textarea" aria-label="With textarea" />
      </InputGroup>
            </Form.Group>
            <Button type='submit'>Submit</Button>
        </Form>
    </>
    )
}

export default Suggestion;