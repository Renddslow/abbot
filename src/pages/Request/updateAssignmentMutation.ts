import {gql} from '@apollo/client';

const UPDATE_ASSIGNMENT = gql`
    mutation UpdateAssignment($input: UpdateAssignmentInput!) {
        updateAssignment(input: $input) {
            id
            created
            leader {
                firstName
                lastName
                avatar
            }
            relationshipType
            assignment
            individual {
                id
                firstName
                lastName
            }
        }
    }
`;

export default UPDATE_ASSIGNMENT;
